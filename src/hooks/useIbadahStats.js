/**
 * useIbadahStats — reads and writes aggregate ibadah statistics for a user.
 *
 * Firestore path: users/{uid}/ibadahStats/summary
 * Document shape:
 *   {
 *     totalSalahDays: number,        // days where at least 1 prayer was logged
 *     totalDhikrSessions: number,    // days where any dhikr was done
 *     totalQuranPages: number,       // cumulative pages read
 *     totalQuranMinutes: number,     // cumulative minutes
 *     totalMorningAdhkar: number,    // days morning adhkar completed
 *     totalEveningAdhkar: number,    // days evening adhkar completed
 *     lastActive: Timestamp,
 *     updatedAt: Timestamp,
 *   }
 *
 * This document is intentionally sparse — it does NOT reveal which prayers
 * were missed or private details. It is used only to show the user their
 * own cumulative journey. No counsellor access (enforced in firestore.rules).
 */

import { useEffect, useState, useCallback } from 'react';
import { doc, onSnapshot, setDoc, increment, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const STATS_DOC_ID = 'summary';

const defaultStats = () => ({
  totalSalahDays: 0,
  totalDhikrSessions: 0,
  totalQuranPages: 0,
  totalQuranMinutes: 0,
  totalMorningAdhkar: 0,
  totalEveningAdhkar: 0,
  lastActive: null,
});

export function useIbadahStats(uid) {
  const [stats, setStats] = useState(defaultStats());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!uid) {
      setLoading(false);
      return;
    }

    const ref = doc(db, 'users', uid, 'ibadahStats', STATS_DOC_ID);
    const unsub = onSnapshot(
      ref,
      (snap) => {
        if (snap.exists()) {
          setStats(snap.data());
        } else {
          setStats(defaultStats());
        }
        setLoading(false);
      },
      (err) => {
        console.error('[useIbadahStats] onSnapshot error:', err);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsub();
  }, [uid]);

  /**
   * Merge a partial stats update into the summary document.
   * Pass Firestore `increment(n)` values for counters, or exact values for overrides.
   *
   * Example usage:
   *   updateStats({ totalQuranPages: increment(2), totalQuranMinutes: increment(15) })
   *   updateStats({ totalMorningAdhkar: increment(1) })
   */
  const updateStats = useCallback(
    async (partial) => {
      if (!uid || !partial) return;
      const ref = doc(db, 'users', uid, 'ibadahStats', STATS_DOC_ID);
      try {
        await setDoc(
          ref,
          { ...partial, lastActive: serverTimestamp(), updatedAt: serverTimestamp() },
          { merge: true }
        );
      } catch (err) {
        console.error('[useIbadahStats] updateStats error:', err);
        setError(err);
      }
    },
    [uid]
  );

  return { stats, updateStats, loading, error };
}

// Re-export Firestore increment so callers don't need a second import
export { increment as statsIncrement };
