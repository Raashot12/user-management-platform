import { useEffect, useRef } from "react";

type Props = { userName: string; isDeleting: boolean; error?: string; onCancel: () => void; onConfirm: () => void };

export function ConfirmDeleteDialog({ userName, isDeleting, error, onCancel, onConfirm }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
    return () => { if (dialog?.open) dialog.close(); };
  }, []);

  return (
    <dialog ref={dialogRef} className="confirm-dialog" aria-labelledby="delete-heading" onCancel={(event) => { event.preventDefault(); if (!isDeleting) onCancel(); }}>
      <div className="confirm-dialog-content">
        <span className="confirm-dialog-mark" aria-hidden="true">!</span>
        <div>
          <h2 id="delete-heading">Delete this person?</h2>
          <p>This will permanently remove <strong>{userName}</strong> and all of their profile information.</p>
        </div>
      </div>
      {error && <p className="dialog-error" role="alert">{error}</p>}
      <footer className="confirm-dialog-actions">
        <button type="button" className="secondary-button" onClick={onCancel} disabled={isDeleting}>Cancel</button>
        <button type="button" className="danger-button" onClick={onConfirm} disabled={isDeleting}>{isDeleting ? "Deleting..." : "Delete person"}</button>
      </footer>
    </dialog>
  );
}
