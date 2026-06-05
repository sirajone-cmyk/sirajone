/**
 * useAssignments.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Real-time hook for the `assignments` Firestore collection.
 *
 * Firestore collection: `assignments`
 * Document shape:
 *   {
 *     studentId:    string                    – requesting user UID
 *     studentName:  string
 *     assignedId:   string | null             – target educator UID (null until matched)
 *     assignedName: string | null
 *     type:         'teacher' | 'counsellor'
 *     status:       'pending_admin'            – awaiting admin allocation
 *                 | 'pending_educator'         – sent directly, awaiting educator accept
 *                 | 'active'                   – accepted / confirmed
 *                 | 'declined'                 – educator declined
 *                 | 'completed'                – relationship ended
 *     note:         string                     – optional message from student
 *     createdAt:    Timestamp
 *     updatedAt:    Timestamp
 *   }
 *
 * Three query modes (controlled by the `mode` argument):
 *   'educator'  – assignments where assignedId == uid AND status == pending_educator
 *   'admin'     – all assignments where status == pending_admin
 *   'student'   – assignments where studentId == uid
 *   'active'    – assignments where assignedId == uid AND status == active
 *
 * Mutation helpers are also exported so callers don't need to import Firestore.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { useEffect, useState } from 'react';
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

// ── Collection reference ──────────────────────────────────────────────────────

const ASSIGNMENTS = 'assignments';

// ── Hook ─────────────────────────────────────────────────────────────────────

/**
 * @param {'educator'|'admin'|'student'|'active'} mode
 * @param {string | null | undefined} uid   – current user's UID
 * @param {'teacher'|'counsellor'|null} [typeFilter]  – optional type filter
 * @returns {{ assignments: Object[], loading: boolean }}
 */
export function useAssignments(mode, uid, typeFilter = null) {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading]         = useState(true);

  useEffect(() => {
    if (!uid && mode !== 'admin') {
      setAssignments([]);
      setLoading(false);
      return undefined;
    }

    let constraints = [];

    switch (mode) {
      case 'educator':
        constraints = [
          where('assignedId', '==', uid),
          where('status',     '==', 'pending_educator'),
        ];
        break;

      case 'active':
        constraints = [
          where('assignedId', '==', uid),
          where('status',     '==', 'active'),
        ];
        break;

      case 'student':
        constraints = [where('studentId', '==', uid)];
        break;

      case 'admin':
      default:
        constraints = [where('status', '==', 'pending_admin')];
        break;
    }

    if (typeFilter) {
      constraints.push(where('type', '==', typeFilter));
    }

    constraints.push(orderBy('createdAt', 'desc'));

    const q = query(collection(db, ASSIGNMENTS), ...constraints);

    const unsubscribe = onSnapshot(
      q,
      (snap) => {
        setAssignments(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        setLoading(false);
      },
      (err) => {
        console.error('[useAssignments] snapshot error:', err);
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, [mode, uid, typeFilter]);

  return { assignments, loading };
}

// ── Mutation helpers ──────────────────────────────────────────────────────────

/**
 * Educator accepts a pending assignment → status: 'active'.
 * @param {string} assignmentId
 */
export async function acceptAssignment(assignmentId) {
  await updateDoc(doc(db, ASSIGNMENTS, assignmentId), {
    status:    'active',
    updatedAt: serverTimestamp(),
  });
}

/**
 * Educator declines a pending assignment → status: 'declined'.
 * @param {string} assignmentId
 */
export async function declineAssignment(assignmentId) {
  await updateDoc(doc(db, ASSIGNMENTS, assignmentId), {
    status:    'declined',
    updatedAt: serverTimestamp(),
  });
}

/**
 * Admin confirms allocation — injects educator details and sets status: 'active'.
 * @param {string} assignmentId
 * @param {{ id: string, name: string }} educator
 */
export async function confirmAllocation(assignmentId, educator) {
  await updateDoc(doc(db, ASSIGNMENTS, assignmentId), {
    assignedId:   educator.id,
    assignedName: educator.name,
    status:       'active',
    updatedAt:    serverTimestamp(),
  });
}

export default useAssignments;
