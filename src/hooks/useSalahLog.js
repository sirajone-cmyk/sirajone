/**
 * useSalahLog — reads and writes a user's daily salah log.
 *
 * Firestore path: users/{uid}/salahLogs/{YYYY-MM-DD}
 * Document shape:
 *   {
 *     date: string,            // 'YYYY-MM-DD'
 *     fajr: boolean,
 *     dhuhr: boolean,
 *     asr: boolean,
 *     maghrib: boolean,
 *     isha: boolean,
 *     updatedAt: Timestamp,
 *   }
 *
 * Privacy: subcollection is private to the user only (enforced in firestore.rules).
 * Counsellors do NOT have access to these documents.
 */

import { useEffect, useState, useCallback } from 'react';
import { doc, onSnapshot, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { format } from 'date-fns';

const PRAYERS = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];

const defaultLog = (date) => ({
  date,
  fajr: false,
  dhuhr: false,
  asr: false,
  maghrib: false,
  isha: false,
});

export function useSalahLog(uid, dateOverride = null) {
  const dateKey = dateOverride ?? format(new Date(), 'yyyy-MM-dd');
  const [log, setLog] = useState(defaultLog(dateKey));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!uid) {
      setLoading(false);
      return;
    }

    const ref = doc(db, 'users', uid, 'salahLogs', dateKey);
    const unsub = onSnapshot(
      ref,
      (snap) => {
        if (snap.exists()) {
          setLog(snap.data());
        } else {
          setLog(defaultLog(dateKey));
        }
        setLoading(false);
      },
      (err) => {
        console.error('[useSalahLog] onSnapshot error:', err);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsub();
  }, [uid, dateKey]);

  const _ensureDoc = useCallback(
    async (ref) => {
      // setDoc with merge:true ensures the document exists with defaults before patching
      await setDoc(
        ref,
        { date: dateKey, updatedAt: serverTimestamp() },
        { merge: true }
      );
    },
    [dateKey]
  );

  const markPrayer = useCallback(
    async (prayer) => {
      if (!uid || !PRAYERS.includes(prayer)) return;
      const ref = doc(db, 'users', uid, 'salahLogs', dateKey);
      try {
        await setDoc(
          ref,
          { date: dateKey, [prayer]: true, updatedAt: serverTimestamp() },
          { merge: true }
        );
      } catch (err) {
        console.error('[useSalahLog] markPrayer error:', err);
        setError(err);
      }
    },
    [uid, dateKey]
  );

  const unmarkPrayer = useCallback(
    async (prayer) => {
      if (!uid || !PRAYERS.includes(prayer)) return;
      const ref = doc(db, 'users', uid, 'salahLogs', dateKey);
      try {
        await setDoc(
          ref,
          { date: dateKey, [prayer]: false, updatedAt: serverTimestamp() },
          { merge: true }
        );
      } catch (err) {
        console.error('[useSalahLog] unmarkPrayer error:', err);
        setError(err);
      }
    },
    [uid, dateKey]
  );

  return { log, markPrayer, unmarkPrayer, loading, error };
}
