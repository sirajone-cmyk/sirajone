/**
 * useAdhkarCompletions — reads and writes a user's morning/evening adhkar completions.
 *
 * Firestore path: users/{uid}/adhkarCompletions/{YYYY-MM-DD}
 * Document shape:
 *   {
 *     date: string,                          // 'YYYY-MM-DD'
 *     morning: { [adhkarId]: true },         // e.g. { morning_01: true, morning_03: true }
 *     evening: { [adhkarId]: true },
 *     morningCompleted: boolean,             // all 15 morning adhkar done
 *     eveningCompleted: boolean,             // all 15 evening adhkar done
 *     updatedAt: Timestamp,
 *   }
 *
 * Privacy: subcollection is private to the user only (enforced in firestore.rules).
 */

import { useEffect, useState, useCallback } from 'react';
import { doc, onSnapshot, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { format } from 'date-fns';
import { MORNING_ADHKAR } from '@/data/adhkar/morning';
import { EVENING_ADHKAR } from '@/data/adhkar/evening';

const MORNING_IDS = MORNING_ADHKAR.map((a) => a.id);
const EVENING_IDS = EVENING_ADHKAR.map((a) => a.id);

const defaultCompletions = (date) => ({
  date,
  morning: {},
  evening: {},
  morningCompleted: false,
  eveningCompleted: false,
});

export function useAdhkarCompletions(uid, dateOverride = null) {
  const dateKey = dateOverride ?? format(new Date(), 'yyyy-MM-dd');
  const [completions, setCompletions] = useState(defaultCompletions(dateKey));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!uid) {
      setLoading(false);
      return;
    }

    const ref = doc(db, 'users', uid, 'adhkarCompletions', dateKey);
    const unsub = onSnapshot(
      ref,
      (snap) => {
        if (snap.exists()) {
          setCompletions(snap.data());
        } else {
          setCompletions(defaultCompletions(dateKey));
        }
        setLoading(false);
      },
      (err) => {
        console.error('[useAdhkarCompletions] onSnapshot error:', err);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsub();
  }, [uid, dateKey]);

  /**
   * Mark a single adhkar item as complete.
   * @param {'morning'|'evening'} session
   * @param {string} adhkarId  e.g. 'morning_03'
   */
  const markItem = useCallback(
    async (session, adhkarId) => {
      if (!uid || !['morning', 'evening'].includes(session)) return;
      const ref = doc(db, 'users', uid, 'adhkarCompletions', dateKey);

      // Optimistically compute whether the session will now be fully complete
      const currentSession = completions[session] ?? {};
      const updatedSession = { ...currentSession, [adhkarId]: true };
      const targetIds = session === 'morning' ? MORNING_IDS : EVENING_IDS;
      const allDone = targetIds.every((id) => updatedSession[id]);
      const completedKey = session === 'morning' ? 'morningCompleted' : 'eveningCompleted';

      try {
        await setDoc(
          ref,
          {
            date: dateKey,
            [session]: updatedSession,
            [completedKey]: allDone,
            updatedAt: serverTimestamp(),
          },
          { merge: true }
        );
      } catch (err) {
        console.error('[useAdhkarCompletions] markItem error:', err);
        setError(err);
      }
    },
    [uid, dateKey, completions]
  );

  /**
   * Mark all items in a session as complete at once.
   * @param {'morning'|'evening'} session
   */
  const markAll = useCallback(
    async (session) => {
      if (!uid || !['morning', 'evening'].includes(session)) return;
      const ref = doc(db, 'users', uid, 'adhkarCompletions', dateKey);
      const targetIds = session === 'morning' ? MORNING_IDS : EVENING_IDS;
      const allMap = Object.fromEntries(targetIds.map((id) => [id, true]));
      const completedKey = session === 'morning' ? 'morningCompleted' : 'eveningCompleted';

      try {
        await setDoc(
          ref,
          {
            date: dateKey,
            [session]: allMap,
            [completedKey]: true,
            updatedAt: serverTimestamp(),
          },
          { merge: true }
        );
      } catch (err) {
        console.error('[useAdhkarCompletions] markAll error:', err);
        setError(err);
      }
    },
    [uid, dateKey]
  );

  /**
   * Unmark a single item (for accidental taps).
   */
  const unmarkItem = useCallback(
    async (session, adhkarId) => {
      if (!uid || !['morning', 'evening'].includes(session)) return;
      const ref = doc(db, 'users', uid, 'adhkarCompletions', dateKey);
      const currentSession = completions[session] ?? {};
      const updatedSession = { ...currentSession };
      delete updatedSession[adhkarId];
      const completedKey = session === 'morning' ? 'morningCompleted' : 'eveningCompleted';

      try {
        await setDoc(
          ref,
          {
            date: dateKey,
            [session]: updatedSession,
            [completedKey]: false,
            updatedAt: serverTimestamp(),
          },
          { merge: true }
        );
      } catch (err) {
        console.error('[useAdhkarCompletions] unmarkItem error:', err);
        setError(err);
      }
    },
    [uid, dateKey, completions]
  );

  return { completions, markItem, unmarkItem, markAll, loading, error };
}
