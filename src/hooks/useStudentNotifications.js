/**
 * useStudentNotifications.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Real-time listener for a student's personal notification subcollection.
 *
 * Firestore path: `users/{userId}/notifications`
 * Query: dismissed == false  (undismissed only)
 * Ordered: createdAt desc  (newest first for the toast stack)
 *
 * Used by: StudentNotificationToast — mounts globally in App.jsx for Students.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { useEffect, useState } from 'react';
import { collection, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';

/**
 * @typedef {Object} StudentNotification
 * @property {string}  id
 * @property {string}  type            – 'practice_reminder'
 * @property {string}  teacherId
 * @property {string}  teacherName
 * @property {string}  studentId
 * @property {string}  message
 * @property {string}  stage           – PIPELINE_STAGES value
 * @property {boolean} read
 * @property {boolean} dismissed
 * @property {import('firebase/firestore').Timestamp} createdAt
 */

/**
 * @param {string | null | undefined} userId
 * @returns {StudentNotification[]}
 */
export function useStudentNotifications(userId) {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!userId) {
      setNotifications([]);
      return undefined;
    }

    const notifQuery = query(
      collection(db, 'users', userId, 'notifications'),
      where('dismissed', '==', false),
      orderBy('createdAt', 'desc'),
    );

    const unsubscribe = onSnapshot(
      notifQuery,
      (snap) => {
        setNotifications(
          snap.docs.map((d) => ({ id: d.id, ...d.data() })),
        );
      },
      (err) => console.error('[useStudentNotifications] snapshot error:', err),
    );

    return () => unsubscribe();
  }, [userId]);

  return notifications;
}

export default useStudentNotifications;
