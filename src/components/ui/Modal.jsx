import React, { useEffect } from "react";
import { cn } from "../../utils/cn";

export function Modal({ className, title, open, onClose, children }) {
  useEffect(() => {
    if (!open) return undefined;

    const previousOverflow = document.body.style.overflow;
    const previousTouchAction = document.body.style.touchAction;
    document.body.style.overflow = "hidden";
    document.body.style.touchAction = "none";
    document.body.classList.add("modal-open");

    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.style.touchAction = previousTouchAction;
      document.body.classList.remove("modal-open");
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label={title}>
      <div className={cn("modal-panel", className)}>
        <div className="modal-header">
          <h3>{title}</h3>
          <button type="button" className="modal-close focus-ring" onClick={onClose}>
            Close
          </button>
        </div>
        <div className="modal-content">{children}</div>
      </div>
    </div>
  );
}

