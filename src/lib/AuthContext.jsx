import React, { createContext, useState, useContext, useEffect } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './firebase';

const AuthContext = createContext();

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
          const OWNER_EMAIL = 'madrassatahseenulquraan@gmail.com';
          const userRef = doc(db, 'users', firebaseUser.uid);
          const userDoc = await getDoc(userRef);

          if (!userDoc.exists()) {
            // Auto-create document — owner gets Admin, others get Student/pending
            const isOwner = firebaseUser.email === OWNER_EMAIL;
            await setDoc(userRef, {
              full_name: isOwner ? 'Ustaath Admin' : '',
              email: firebaseUser.email,
              role: isOwner ? 'Admin' : 'Student',
              status: isOwner ? 'approved' : 'pending',
              created_at: serverTimestamp(),
            });
          }

          const freshDoc = await getDoc(userRef);
          const userData = freshDoc.data();
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            full_name: userData.full_name || '',
            role: userData.role || 'Student',
            status: userData.status || 'pending',
            ...userData,
          });
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Error fetching user data:', error);
          setUser({ uid: firebaseUser.uid, email: firebaseUser.email, role: 'Student' });
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

  const register = async (email, password, fullName, role = 'Student') => {
    setAuthError(null);
    try {
      const { user: firebaseUser } = await createUserWithEmailAndPassword(auth, email, password);
      // Save user profile to Firestore
      await setDoc(doc(db, 'users', firebaseUser.uid), {
        full_name: fullName,
        email,
        role,
        status: 'pending', // Admin must approve
        created_at: serverTimestamp(),
      });
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
      register,
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
