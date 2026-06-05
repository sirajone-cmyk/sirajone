import { useContext } from 'react';
import { PlatformContext } from '../state/PlatformContext';
import { useContentProtection } from '../hooks/useContentProtection';

/**
 * SecurityWrapper
 *
 * Wrap any protected section (workbook pages, counsellor dashboard, etc.).
 * Provides three layers:
 *   1. Diagonal tiled watermark with the logged-in user's name + email.
 *   2. user-select: none on the content area to block text highlighting / copy.
 *   3. onContextMenu prevention to disable right-click menus.
 *   4. Full-screen mask when the window loses focus (via useContentProtection).
 *
 * Usage:
 *   <SecurityWrapper>
 *     <YourProtectedContent />
 *   </SecurityWrapper>
 *
 * Prop `enabled` (default: true) — set to false in dev if you need free interaction.
 */
export default function SecurityWrapper({ children, enabled = true }) {
  const ctx = useContext(PlatformContext);
  const currentUser = ctx?.currentUser;

  const { masked } = useContentProtection({ enabled });

  // Build the watermark label — falls back gracefully if no user yet
  const watermarkLabel = currentUser
    ? `${currentUser.name || 'SirajOne User'}  |  ${currentUser.email || ''}`
    : 'SirajOne — Protected Content';

  // Repeat the label enough times to tile the entire viewport diagonally
  const tiles = Array.from({ length: 60 }, (_, i) => i);

  return (
    <div
      className="relative"
      onContextMenu={enabled ? (e) => e.preventDefault() : undefined}
      style={enabled ? { userSelect: 'none', WebkitUserSelect: 'none' } : undefined}
    >
      {/* ── Tiled watermark overlay ─────────────────────────────────────────── */}
      {enabled && currentUser && (
        <div
          aria-hidden="true"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9998,
            pointerEvents: 'none',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: '-50%',           // extend beyond viewport so rotation has no gaps
              display: 'flex',
              flexWrap: 'wrap',
              alignContent: 'flex-start',
              transform: 'rotate(-15deg)',
              opacity: 0.04,
            }}
          >
            {tiles.map((i) => (
              <span
                key={i}
                style={{
                  display: 'block',
                  width: '340px',
                  padding: '28px 0',
                  color: '#ffffff',
                  fontSize: '12px',
                  fontFamily: 'monospace',
                  fontWeight: 600,
                  letterSpacing: '0.06em',
                  whiteSpace: 'nowrap',
                  userSelect: 'none',
                  WebkitUserSelect: 'none',
                }}
              >
                {watermarkLabel}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ── Focus-loss protection mask ──────────────────────────────────────── */}
      {enabled && masked && (
        <div
          aria-live="polite"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(7, 23, 15, 0.97)',
            backdropFilter: 'blur(18px)',
            WebkitBackdropFilter: 'blur(18px)',
          }}
        >
          {/* Hexagonal emblem */}
          <svg
            width="56"
            height="56"
            viewBox="0 0 56 56"
            fill="none"
            style={{ marginBottom: '24px', opacity: 0.6 }}
          >
            <polygon
              points="28,4 52,16 52,40 28,52 4,40 4,16"
              fill="none"
              stroke="#34d399"
              strokeWidth="1.5"
            />
            <polygon
              points="28,12 44,21 44,35 28,44 12,35 12,21"
              fill="none"
              stroke="#34d399"
              strokeWidth="0.8"
              opacity="0.5"
            />
            <circle cx="28" cy="28" r="5" fill="#34d399" opacity="0.7" />
          </svg>

          <p
            style={{
              color: '#d1fae5',
              fontSize: '13px',
              fontWeight: 700,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              marginBottom: '12px',
              opacity: 0.7,
            }}
          >
            SirajOne
          </p>

          <h2
            style={{
              color: '#ffffff',
              fontSize: 'clamp(1.1rem, 3vw, 1.5rem)',
              fontWeight: 700,
              textAlign: 'center',
              maxWidth: '380px',
              lineHeight: 1.4,
              margin: '0 0 12px',
            }}
          >
            Content Protected
          </h2>

          <p
            style={{
              color: '#6ee7b7',
              fontSize: '13px',
              textAlign: 'center',
              maxWidth: '320px',
              lineHeight: 1.6,
              opacity: 0.75,
            }}
          >
            Return to this window to continue your session.
          </p>
        </div>
      )}

      {/* ── Protected content ───────────────────────────────────────────────── */}
      {children}
    </div>
  );
}
