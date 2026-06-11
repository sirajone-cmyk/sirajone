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

/** Small delay helper used to resolve registration race conditions. */
function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

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
          const userRef  = doc(db, 'users', firebaseUser.uid);
          let   userDoc  = await getDoc(userRef);

          // Race-condition guard
          // When a counsellor or teacher registers, onAuthStateChanged fires
          // immediately after createUserWithEmailAndPassword resolves, before
          // the registration setDoc can complete. Detecting a first login and
          // waiting 3 s gives the write time to land before we fall back to
          // auto-creating a generic Student document.
          if (!userDoc.exists()) {
            const isFirstLogin =
              firebaseUser.metadata.creationTime === firebaseUser.metadata.lastSignInTime;

            if (isFirstLogin) {
              await wait(3000);
              userDoc = await getDoc(userRef);
            }
          }

          if (!userDoc.exists()) {
            // Genuinely missing: bootstrap owner, or recover from edge cases.
            const isOwner = isOwnerEmail(firebaseUser.email || '');
            await setDoc(userRef, {
              full_name:  isOwner ? 'Ustaath Admin' : '',
              email:      firebaseUser.email,
              role:       isOwner ? ROLES.ADMIN   : ROLES.STUDENT,
              status:     isOwner ? USER_STATUS.APPROVED : USER_STATUS.PENDING,
              onboarding: createDefaultOnboardingState(),
              created_at: serverTimestamp(),
            });
            userDoc = await getDoc(userRef);
          }

          const userData = userDoc.data() || {};
          setUser(enrichUserProfile({
            uid:       firebaseUser.uid,
            email:     firebaseUser.email,
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

  const registerStudent = async (email, password, fullName, options = {}) => {
    return createUserProfile({
      email,
      password,
      fullName,
      role: ROLES.STUDENT,
      status: USER_STATUS.APPROVED,
      extraProfile: {
        registrationType: 'student',
        ...(options.parentGuardianConsent === true
          ? {
              parentGuardianConsent: true,
              parentGuardianConsentAt: serverTimestamp(),
            }
          : {}),
      },
    });
  };

  /**
   * Register a counselling client (person seeking counselling sessions).
   * Role stored as ROLES.COUNSELLING_CLIENT.
   * Status starts as PENDING; admin must approve before access is granted.
   *
   * @param {string} email
   * @param {string} password
   * @param {string} fullName
   * @param {string} [registrationNotes] optional reason/note for counsellor
   */
  const registerCounsellingClient = async (email, password, fullName, registrationNotes = '') => {
    return createUserProfile({
      email,
      password,
      fullName,
      role: ROLES.COUNSELLING_CLIENT,
      status: USER_STATUS.PENDING,
      extraProfile: {
        registrationType: 'counsellingClient',
        appliedRole: ROLES.COUNSELLING_CLIENT,
        ...(registrationNotes.trim()
          ? { registrationNotes: registrationNotes.trim() }
          : {}),
      },
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

      const userRef                = doc(db, 'users',    firebaseUser.uid);
      const teacherRef             = doc(db, 'teachers', firebaseUser.uid);
      const privateVerificationRef = doc(db, 'teachers', firebaseUser.uid, 'private_data', 'verification');

      // Write users/{uid} FIRST so onAuthStateChanged finds the correct role
      // immediately, preventing the race that would auto-create a Student doc.
      await setDoc(userRef, {
        full_name:  fullName,
        email,
        role:       ROLES.TEACHER,
        appliedRole: ROLES.TEACHER,
        registrationType: 'teacher',
        status:     USER_STATUS.PENDING,
        onboarding: createDefaultOnboardingState(),
        created_at: submittedAt,
      });

      // Batch only the secondary collections.
      const batch = writeBatch(db);
      batch.set(teacherRef, {
        ...applicationPayload.publicProfile,
        uid:        firebaseUser.uid,
        created_at: submittedAt,
        updated_at: submittedAt,
      });
      batch.set(privateVerificationRef, {
        ...applicationPayload.privateData,
        uid:          firebaseUser.uid,
        submitted_at: submittedAt,
        updated_at:   submittedAt,
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
      const submittedAt        = serverTimestamp();
      const normalizedFullName = normalizeCounsellorName(fullName, { allowTitle: false });
      const applicationPayload = buildCounsellorApplicationPayload({
        ...counsellorApplication,
        fullName: normalizedFullName,
        email,
      });

      const userRef                = doc(db, 'users',      firebaseUser.uid);
      const counsellorRef          = doc(db, 'counsellors', firebaseUser.uid);
      const privateVerificationRef = doc(db, 'counsellors', firebaseUser.uid, 'private_data', 'verification');

      // Write users/{uid} FIRST so onAuthStateChanged finds the correct
      // Counsellor role immediately, preventing the race that auto-creates a
      // Student document before the batch can commit.
      await setDoc(userRef, {
        full_name:    normalizedFullName,
        display_name: applicationPayload.publicProfile.displayName,
        email,
        role:         ROLES.COUNSELLOR,
        appliedRole:  ROLES.COUNSELLOR,
        registrationType: 'counsellor',
        status:       USER_STATUS.PENDING,
        onboarding:   createDefaultOnboardingState(),
        created_at:   submittedAt,
      });

      // Batch only the secondary counsellor collections.
      const batch = writeBatch(db);
      batch.set(counsellorRef, {
        ...applicationPayload.publicProfile,
        uid:        firebaseUser.uid,
        created_at: submittedAt,
        updated_at: submittedAt,
      });
      batch.set(privateVerificationRef, {
        ...applicationPayload.privateData,
        uid:          firebaseUser.uid,
        submitted_at: submittedAt,
        updated_at:   submittedAt,
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
