import React, { createContext, useState, useContext, useEffect } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { doc, getDoc, serverTimestamp, setDoc, writeBatch } from 'firebase/firestore';
import { auth, db } from './firebase';
import { ROLES, USER_STATUS, enrichUserProfile, isOwnerEmail } from './roles';
import { buildTeacherApplicationPayload } from './teacherSchema';
import { buildCounsellorApplicationPayload, normalizeCounsellorName } from './counsellorSchema';

const AuthContext = createContext();

const createDefaultOnboardingState = () => ({
  hasCompletedTour: false,
  currentStepIndex: 0,
  lastActiveTimestamp: serverTimestamp(),
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Get extra user data from Firestore
        try {
          const userRef = doc(db, 'users', firebaseUser.uid);
          const userDoc = await getDoc(userRef);

          if (!userDoc.exists()) {
            // Auto-create missing profiles safely. Owner emails keep admin access.
            const isOwner = isOwnerEmail(firebaseUser.email || '');
            await setDoc(userRef, {
              full_name: isOwner ? 'Ustaath Admin' : '',
              email: firebaseUser.email,
              role: isOwner ? ROLES.ADMIN : ROLES.STUDENT,
              status: isOwner ? USER_STATUS.APPROVED : USER_STATUS.PENDING,
              onboarding: createDefaultOnboardingState(),
              created_at: serverTimestamp(),
            });
          }

          const freshDoc = await getDoc(userRef);
          const userData = freshDoc.data() || {};
          setUser(enrichUserProfile({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            full_name: userData.full_name || '',
            ...userData,
          }));
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Error fetching user data:', error);
          setUser(enrichUserProfile({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            role: ROLES.STUDENT,
            status: USER_STATUS.PENDING,
          }));
          setIsAuthenticated(true);
        }
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
      setIsLoadingAuth(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    setAuthError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      setAuthError(error.message);
      throw error;
    }
  };

  const createUserProfile = async ({ email, password, fullName, role, status, extraProfile = {} }) => {
    setAuthError(null);
    try {
      const { user: firebaseUser } = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, 'users', firebaseUser.uid), {
        full_name: fullName,
        email,
        role,
        status,
        onboarding: createDefaultOnboardingState(),
        created_at: serverTimestamp(),
        ...extraProfile,
      });
      return firebaseUser;
    } catch (error) {
      setAuthError(error.message);
      throw error;
    }
  };

  const registerStudent = async (email, password, fullName) => {
    return createUserProfile({
      email,
      password,
      fullName,
      role: ROLES.STUDENT,
      status: USER_STATUS.APPROVED,
    });
  };

  /**
   * Register a counselling client (person seeking counselling sessions).
   * Role stored as ROLES.COUNSELLING_CLIENT.
   * Status starts as PENDING — admin must approve before access is granted.
   *
   * @param {string} email
   * @param {string} password
   * @param {string} fullName
   * @param {string} [registrationNotes] – optional reason/note for counsellor
   */
  const registerCounsellingClient = async (email, password, fullName, registrationNotes = '') => {
    return createUserProfile({
      email,
      password,
      fullName,
      role: ROLES.COUNSELLING_CLIENT,
      status: USER_STATUS.PENDING,
      extraProfile: registrationNotes.trim()
        ? { registrationNotes: registrationNotes.trim() }
        : {},
    });
  };

  const applyAsTeacher = async (email, password, fullName, teacherApplication = {}) => {
    setAuthError(null);
    try {
      const { user: firebaseUser } = await createUserWithEmailAndPassword(auth, email, password);
      const submittedAt = serverTimestamp();
      const applicationPayload = buildTeacherApplicationPayload({
        ...teacherApplication,
        fullName,
        email,
      });

      const userRef = doc(db, 'users', firebaseUser.uid);
      const teacherRef = doc(db, 'teachers', firebaseUser.uid);
      const privateVerificationRef = doc(db, 'teachers', firebaseUser.uid, 'private_data', 'verification');
      const batch = writeBatch(db);

      batch.set(userRef, {
        full_name: fullName,
        email,
        role: ROLES.TEACHER,
        status: USER_STATUS.PENDING,
        onboarding: createDefaultOnboardingState(),
        created_at: submittedAt,
      });

      batch.set(teacherRef, {
        ...applicationPayload.publicProfile,
        uid: firebaseUser.uid,
        created_at: submittedAt,
        updated_at: submittedAt,
      });

      batch.set(privateVerificationRef, {
        ...applicationPayload.privateData,
        uid: firebaseUser.uid,
        submitted_at: submittedAt,
        updated_at: submittedAt,
      });

      await batch.commit();
      return firebaseUser;
    } catch (error) {
      setAuthError(error.message);
      throw error;
    }
  };

  const applyAsCounsellor = async (email, password, fullName, counsellorApplication = {}) => {
    setAuthError(null);
    try {
      const { user: firebaseUser } = await createUserWithEmailAndPassword(auth, email, password);
      const submittedAt = serverTimestamp();
      const normalizedFullName = normalizeCounsellorName(fullName, { allowTitle: false });
      const applicationPayload = buildCounsellorApplicationPayload({
        ...counsellorApplication,
        fullName: normalizedFullName,
        email,
      });

      const userRef = doc(db, 'users', firebaseUser.uid);
      const counsellorRef = doc(db, 'counsellors', firebaseUser.uid);
      const privateVerificationRef = doc(db, 'counsellors', firebaseUser.uid, 'private_data', 'verification');
      const batch = writeBatch(db);

      batch.set(userRef, {
        full_name: normalizedFullName,
        display_name: applicationPayload.publicProfile.displayName,
        email,
        role: ROLES.COUNSELLOR,
        status: USER_STATUS.PENDING,
        onboarding: createDefaultOnboardingState(),
        created_at: submittedAt,
      });

      batch.set(counsellorRef, {
        ...applicationPayload.publicProfile,
        uid: firebaseUser.uid,
        created_at: submittedAt,
        updated_at: submittedAt,
      });

      batch.set(privateVerificationRef, {
        ...applicationPayload.privateData,
        uid: firebaseUser.uid,
        submitted_at: submittedAt,
        updated_at: submittedAt,
      });

      await batch.commit();
      return firebaseUser;
    } catch (error) {
      setAuthError(error.message);
      throw error;
    }
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setIsAuthenticated(false);
  };

  const resetPassword = async (email) => {
    await sendPasswordResetEmail(auth, email);
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      isLoadingAuth,
      isLoadingPublicSettings: false,
      authError,
      login,
      register: registerStudent,
      registerStudent,
      registerCounsellingClient,
      applyAsTeacher,
      applyAsCounsellor,
      logout,
      resetPassword,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};






