/**
 * useQuranLog — reads and writes a user's daily Quran recitation log.
 *
 * Firestore path: users/{uid}/quranLogs/{YYYY-MM-DD}
 * Document shape:
 *   {
 *     date: string,            // 'YYYY-MM-DD'
 *     pages: number,           // pages recited today
 *     minutes: number,         // minutes spent
 *     juz: number | null,      // which juz (optional)
 *     notes: string,           // personal reflection (private, optional)
 *     updatedAt: Timestamp,
 *   }
 *
 * Privacy: subcollection is private to the user only (enforced in firestore.rules).
 */

import { useState, useCallback } from 'react';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { format } from 'date-fns';

const defaultLog = (date) => ({
  date,
  pages: 0,
  minutes: 0,
  juz: null,
  notes: '',
});

export function useQuranLog(uid, dateOverride = null) {
  const dateKey = dateOverride ?? format(new Date(), 'yyyy-MM-dd');
  const [log, setLog] = useState(defaultLog(dateKey));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fetch the log for the current date. Called on component mount or date change.
   */
  const fetchLog = useCallback(async () => {
    if (!uid) return;
    setLoading(true);
    try {
      const ref = doc(db, 'users', uid, 'quranLogs', dateKey);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        setLog(snap.data());
      } else {
        setLog(defaultLog(dateKey));
      }
    } catch (err) {
      console.error('[useQuranLog] fetchLog error:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [uid, dateKey]);

  /**
   * Save (upsert) the Quran log for the day.
   * @param {{ pages?: number, minutes?: number, juz?: number|null, notes?: string }} data
   */
  const saveLog = useCallback(
    async (data) => {
      if (!uid) return;
      setLoading(true);
      try {
        const ref = doc(db, 'users', uid, 'quranLogs', dateKey);
        const payload = {
          date: dateKey,
          pages: data.pages ?? 0,
          minutes: data.minutes ?? 0,
          juz: data.juz ?? null,
          notes: data.notes ?? '',
          updatedAt: serverTimestamp(),
        };
        await setDoc(ref, payload, { merge: true });
        setLog((prev) => ({ ...prev, ...payload }));
      } catch (err) {
        console.error('[useQuranLog] saveLog error:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    },
    [uid, dateKey]
  );

  return { log, fetchLog, saveLog, loading, error };
}
