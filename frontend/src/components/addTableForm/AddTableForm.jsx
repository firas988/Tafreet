import { useState } from "react";
import { Table2, X } from "lucide-react";
import modal from "../modal/modal.shared.module.css";
import classes from "./AddTableForm.module.css";

export default function AddTableForm({
  onSubmit,
  onClose,
  loading,
  error,
  table = null,
  existingNumbers = [],
}) {
  const isEdit = Boolean(table);
  const [tableNumber, setTableNumber] = useState(
    table ? String(table.table_number) : "",
  );
  const [isActive, setIsActive] = useState(
    table ? Boolean(table.is_active) : true,
  );
  const [localError, setLocalError] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    const parsed = Number(tableNumber);

    if (!Number.isInteger(parsed) || parsed <= 0) {
      setLocalError("Table number must be a positive whole number");
      return;
    }

    const duplicate = existingNumbers.some((num) => num === parsed);
    if (duplicate) {
      setLocalError(`Table ${parsed} already exists`);
      return;
    }

    setLocalError("");
    onSubmit({
      table_number: parsed,
      is_active: isActive ? 1 : 0,
    });
  };

  const displayError = localError || error;

  return (
    <div className={modal.overlay} onClick={onClose}>
      <form
        className={modal.modal}
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={modal.header}>
          <div className={modal.headerIcon}>
            <Table2 size={22} />
          </div>
          <div>
            <span className="pill">{isEdit ? "Edit" : "New"} Table</span>
            <h2>{isEdit ? "Update Table" : "Add Table"}</h2>
            <p>
              {isEdit
                ? "Change the table number or availability for customers."
                : "Create a table for QR menu ordering."}
            </p>
          </div>
          <button className={modal.closeBtn} type="button" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className={modal.body}>
          {displayError && <p className={modal.error}>{displayError}</p>}

          <label className={modal.field}>
            <span>Table number</span>
            <input
              type="number"
              min="1"
              step="1"
              value={tableNumber}
              onChange={(e) => {
                setTableNumber(e.target.value);
                setLocalError("");
              }}
              placeholder="e.g. 12"
              required
            />
          </label>

          <label className={classes.toggle}>
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
            />
            <span className={classes.toggleTrack}>
              <span className={classes.toggleThumb} />
            </span>
            <span className={classes.toggleText}>
              <b>Active table</b>
              <small>Customers can open the menu link</small>
            </span>
          </label>
        </div>

        <div className={modal.footer}>
          <div className={modal.actions}>
            <button className="btn light" type="button" onClick={onClose}>
              Cancel
            </button>
            <button className="btn" type="submit" disabled={loading}>
              {loading ? "Saving..." : isEdit ? "Save Changes" : "Add Table"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
