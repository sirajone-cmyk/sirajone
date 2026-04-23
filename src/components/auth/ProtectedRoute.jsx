import React, { useEffect } from 'react';
import { usePlatform } from '../../state/PlatformContext';

function redirectToAuth() {
  window.history.replaceState({}, '', '/');
  window.dispatchEvent(new PopStateEvent('popstate'));
}

export function ProtectedRoute({ children, requireAdmin = false }) {
  const { currentUser, isAdmin } = usePlatform();

  const allowed = requireAdmin ? Boolean(currentUser && isAdmin) : Boolean(currentUser);

  useEffect(() => {
    if (!allowed) {
      redirectToAuth();
    }
  }, [allowed]);

  if (!allowed) {
    return null;
  }

  return children;
}
