import { Download, QrCode, X } from "lucide-react";
import modal from "../modal/modal.shared.module.css";
import classes from "./QrCodeModal.module.css";

export default function QrCodeModal({
  table,
  qrCode,
  menuUrl,
  loading,
  error,
  onClose,
  onDownload,
}) {
  return (
    <div className={modal.overlay} onClick={onClose}>
      <div
        className={modal.modal}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-labelledby="qr-dialog-title"
      >
        <div className={modal.header}>
          <div className={modal.headerIcon}>
            <QrCode size={22} />
          </div>
          <div>
            <span className="pill">Table QR</span>
            <h2 id="qr-dialog-title">Table {table.table_number}</h2>
            <p>Scan to open the customer menu for this table.</p>
          </div>
          <button className={modal.closeBtn} type="button" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className={modal.body}>
          {error && <p className={modal.error}>{error}</p>}
          {loading && <p className={classes.loading}>Generating QR code...</p>}

          {!loading && qrCode && (
            <>
              <div className={classes.preview}>
                <img src={qrCode} alt={`QR code for table ${table.table_number}`} />
              </div>
              {menuUrl && <p className={classes.menuUrl}>{menuUrl}</p>}
            </>
          )}
        </div>

        <div className={modal.footer}>
          <div className={modal.actions}>
            <button className="btn light" type="button" onClick={onClose}>
              Close
            </button>
            <button
              className="btn"
              type="button"
              onClick={onDownload}
              disabled={loading || !qrCode}
            >
              <Download size={18} />
              Download PNG
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
