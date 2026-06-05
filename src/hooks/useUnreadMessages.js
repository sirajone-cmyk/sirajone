/**
 * useUnreadMessages.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Real-time listener that counts unread inbox messages for the current user.
 *
 * Firestore collection: `inbox_messages`
 * Query: recipientId == userId  AND  isRead == false
 *
 * Used by:
 *   • Navbar   — shows the green NotificationDot only when count > 0
 *   • Messages — calls markAllRead() on mount to clear the badge instantly
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { useEffect, useState } from 'react';
import {
  collection,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  where,
  writeBatch,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

/**
 * @param {string | null | undefined} userId
 * @returns {{ count: number, markAllRead: () => Promise<void> }}
 */
export function useUnreadMessages(userId) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!userId) {
      setCount(0);
      return undefined;
    }

    const unreadQuery = query(
      collection(db, 'inbox_messages'),
      where('recipientId', '==', userId),
      where('isRead', '==', false),
    );

    const unsubscribe = onSnapshot(
      unreadQuery,
      (snap) => setCount(snap.size),
      (err) => console.error('[useUnreadMessages] snapshot error:', err),
    );

    return () => unsubscribe();
  }, [userId]);

  /**
   * Batch-mark every unread inbox_message for this user as read.
   * Called by Messages.jsx on mount.
   */
  async function markAllRead() {
    if (!userId) return;

    const unreadQuery = query(
      collection(db, 'inbox_messages'),
      where('recipientId', '==', userId),
      where('isRead', '==', false),
    );

    const snap = await getDocs(unreadQuery);
    if (snap.empty) return;

    // Firestore batch limit is 500 operations; chunk for safety.
    const CHUNK = 499;
    const docs = snap.docs;

    for (let i = 0; i < docs.length; i += CHUNK) {
      const batch = writeBatch(db);
      docs.slice(i, i + CHUNK).forEach((d) => {
        batch.update(d.ref, { isRead: true, readAt: serverTimestamp() });
      });
      await batch.commit(); // eslint-disable-line no-await-in-loop
    }
  }

  return { count, markAllRead };
}

export default useUnreadMessages;
