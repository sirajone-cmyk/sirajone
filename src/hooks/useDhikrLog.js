/**
 * useDhikrLog — reads and writes a user's daily dhikr counter log.
 *
 * Firestore path: users/{uid}/dhikrLogs/{YYYY-MM-DD}
 * Document shape:
 *   {
 *     date: string,            // 'YYYY-MM-DD'
 *     istighfar: number,       // target 100
 *     durood: number,          // target 100
 *     tahleel: number,         // La ilaha illallah — target 100
 *     updatedAt: Timestamp,
 *   }
 *
 * Privacy: subcollection is private to the user only (enforced in firestore.rules).
 */

import { useEffect, useState, useCallback } from 'react';
import { doc, onSnapshot, setDoc, serverTimestamp, increment } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { format } from 'date-fns';

export const DHIKR_TYPES = ['istighfar', 'durood', 'tahleel'];
export const DHIKR_TARGETS = { istighfar: 100, durood: 100, tahleel: 100 };
export const DHIKR_LABELS = {
  istighfar: 'Istighfar',
  durood: 'Durood',
  tahleel: 'Lā ilāha illallāh',
};

const defaultLog = (date) => ({
  date,
  istighfar: 0,
  durood: 0,
  tahleel: 0,
});

export function useDhikrLog(uid, dateOverride = null) {
  const dateKey = dateOverride ?? format(new Date(), 'yyyy-MM-dd');
  const [log, setLog] = useState(defaultLog(dateKey));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!uid) {
      setLoading(false);
      return;
    }

    const ref = doc(db, 'users', uid, 'dhikrLogs', dateKey);
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
        console.error('[useDhikrLog] onSnapshot error:', err);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsub();
  }, [uid, dateKey]);

  /**
   * Increment a dhikr counter by `amount` (default 1).
   * Capped at target to prevent runaway taps.
   */
  const incrementDhikr = useCallback(
    async (type, amount = 1) => {
      if (!uid || !DHIKR_TYPES.includes(type)) return;
      const target = DHIKR_TARGETS[type];
      const current = log[type] ?? 0;
      if (current >= target) return; // already at target, no-op
      const safeAmount = Math.min(amount, target - current);
      const ref = doc(db, 'users', uid, 'dhikrLogs', dateKey);
      try {
        await setDoc(
          ref,
          {
            date: dateKey,
            [type]: increment(safeAmount),
            updatedAt: serverTimestamp(),
          },
          { merge: true }
        );
      } catch (err) {
        console.error('[useDhikrLog] incrementDhikr error:', err);
        setError(err);
      }
    },
    [uid, dateKey, log]
  );

  /**
   * Set a dhikr counter to an exact value (for manual input or reset).
   */
  const setCount = useCallback(
    async (type, value) => {
      if (!uid || !DHIKR_TYPES.includes(type)) return;
      const clamped = Math.max(0, Math.min(value, DHIKR_TARGETS[type]));
      const ref = doc(db, 'users', uid, 'dhikrLogs', dateKey);
      try {
        await setDoc(
          ref,
          { date: dateKey, [type]: clamped, updatedAt: serverTimestamp() },
          { merge: true }
        );
      } catch (err) {
        console.error('[useDhikrLog] setCount error:', err);
        setError(err);
      }
    },
    [uid, dateKey]
  );

  return { log, increment: incrementDhikr, setCount, loading, error };
}
