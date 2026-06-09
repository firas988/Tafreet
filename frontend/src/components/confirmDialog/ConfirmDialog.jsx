import { AlertTriangle, Trash2, X } from "lucide-react";
import modal from "../modal/modal.shared.module.css";
import classes from "./ConfirmDialog.module.css";

export default function ConfirmDialog({
  title,
  message,
  itemName,
  warning,
  confirmLabel = "Delete",
  loading = false,
  error = "",
  confirmDisabled = false,
  onConfirm,
  onClose,
}) {
  return (
    <div className={modal.overlay} onClick={onClose}>
      <div
        className={`${modal.modal} ${classes.modalDanger}`}
        onClick={(e) => e.stopPropagation()}
        role="alertdialog"
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-message"
      >
        <div className={modal.header}>
          <div className={classes.headerIconDanger}>
            <Trash2 size={22} />
          </div>
          <div>
            <span className="pill">Confirm delete</span>
            <h2 id="confirm-dialog-title">{title}</h2>
          </div>
          <button
            className={modal.closeBtn}
            type="button"
            onClick={onClose}
            disabled={loading}
          >
            <X size={18} />
          </button>
        </div>

        <div className={modal.body}>
          {error && <p className={modal.error}>{error}</p>}

          <p id="confirm-dialog-message" className={classes.bodyText}>
            {message}
          </p>

          {itemName && <p className={classes.itemName}>{itemName}</p>}

          {warning && (
            <p className={classes.warning}>
              <AlertTriangle size={14} />
              <span>{warning}</span>
            </p>
          )}
        </div>

        <div className={modal.footer}>
          <div className={modal.actions}>
            <button
              className="btn light"
              type="button"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              className={classes.deleteBtn}
              type="button"
              onClick={onConfirm}
              disabled={loading || confirmDisabled}
            >
              <Trash2 size={18} />
              {loading ? "Deleting..." : confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
