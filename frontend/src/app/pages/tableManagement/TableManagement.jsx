import { useEffect, useMemo, useState } from "react";
import {
  Copy,
  ExternalLink,
  Plus,
  QrCode,
  Search,
  Table2,
} from "lucide-react";
import AdminLayout from "../../../components/adminLayout/AdminLayout.jsx";
import AddTableForm from "../../../components/addTableForm/AddTableForm.jsx";
import ConfirmDialog from "../../../components/confirmDialog/ConfirmDialog.jsx";
import QrCodeModal from "../../../components/qrCodeModal/QrCodeModal.jsx";
import {
  addTable,
  deleteTable,
  getTableQrCode,
  getTables,
  updateTable,
} from "../../../api/restaurant.service.js";
import classes from "./TableManagement.module.css";

export default function TableManagement() {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [tableForm, setTableForm] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [formError, setFormError] = useState("");
  const [pageError, setPageError] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [qrModalTable, setQrModalTable] = useState(null);
  const [qrCode, setQrCode] = useState("");
  const [qrMenuUrl, setQrMenuUrl] = useState("");
  const [qrLoading, setQrLoading] = useState(false);
  const [qrError, setQrError] = useState("");

  const activeCount = useMemo(
    () => tables.filter((table) => Boolean(table.is_active)).length,
    [tables],
  );

  const filteredTables = useMemo(() => {
    const query = search.trim();
    if (!query) return tables;

    return tables.filter((table) =>
      String(table.table_number).includes(query),
    );
  }, [tables, search]);

  const loadTables = async () => {
    setLoading(true);
    setPageError("");

    try {
      const result = await getTables();
      if (!result.success) {
        setPageError(result.message || "Failed to load tables");
        return;
      }
      setTables(result.tables || []);
    } catch (err) {
      setPageError(err.response?.data?.message || "Could not load tables");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTables();
  }, []);

  const closeTableForm = () => {
    setTableForm(null);
    setFormError("");
  };

  const getMenuUrl = (tableNumber) =>
    `${window.location.origin}/menu/public/table/${tableNumber}`;

  const getExistingNumbers = (excludeId = null) =>
    tables
      .filter((table) => table.table_id !== excludeId)
      .map((table) => Number(table.table_number));

  const handleSaveTable = async (data) => {
    setSubmitting(true);
    setFormError("");

    try {
      const result =
        tableForm === "new"
          ? await addTable(data)
          : await updateTable(tableForm.table_id, data);

      if (!result.success) {
        setFormError(result.message || "Failed to save table");
        return;
      }

      closeTableForm();
      await loadTables();
    } catch (err) {
      setFormError(err.response?.data?.message || "Could not save table");
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleActive = async (table) => {
    const newActive = table.is_active ? 0 : 1;
    setUpdatingId(table.table_id);
    setPageError("");

    try {
      const result = await updateTable(table.table_id, {
        table_number: table.table_number,
        is_active: newActive,
      });

      if (!result.success) {
        setPageError(result.message || "Failed to update table status");
        return;
      }

      setTables((prev) =>
        prev.map((item) =>
          item.table_id === table.table_id
            ? { ...item, is_active: newActive }
            : item,
        ),
      );
    } catch (err) {
      setPageError(err.response?.data?.message || "Could not update table");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    setDeletingId(deleteTarget.table_id);
    setDeleteError("");

    try {
      const result = await deleteTable(deleteTarget.table_id);
      if (!result.success) {
        setDeleteError(result.message || "Failed to delete table");
        return;
      }

      setDeleteTarget(null);
      await loadTables();
    } catch (err) {
      setDeleteError(err.response?.data?.message || "Could not delete table");
    } finally {
      setDeletingId(null);
    }
  };

  const downloadQrImage = (dataUrl, tableNumber) => {
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = `table-${tableNumber}-qr.png`;
    link.click();
  };

  const closeQrModal = () => {
    setQrModalTable(null);
    setQrCode("");
    setQrMenuUrl("");
    setQrError("");
    setQrLoading(false);
  };

  const openQrModal = async (table) => {
    setQrModalTable(table);
    setQrCode("");
    setQrMenuUrl("");
    setQrError("");
    setQrLoading(true);

    try {
      const result = await getTableQrCode(table.table_id);
      if (!result.success) {
        setQrError(result.message || "Failed to generate QR code");
        return;
      }

      setQrCode(result.qrCode);
      setQrMenuUrl(result.menuUrl || getMenuUrl(table.table_number));
    } catch (err) {
      setQrError(err.response?.data?.message || "Could not generate QR code");
    } finally {
      setQrLoading(false);
    }
  };

  const handleDownloadQr = () => {
    if (!qrCode || !qrModalTable) return;
    downloadQrImage(qrCode, qrModalTable.table_number);
  };

  const handleCopyLink = async (table) => {
    try {
      await navigator.clipboard.writeText(getMenuUrl(table.table_number));
      setCopiedId(table.table_id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // Clipboard may be blocked in some browsers
    }
  };

  return (
    <AdminLayout title="Admin Panel" subtitle="Table manager">
      <div className={classes.pageTitle}>
        <div>
          <h1>Tables</h1>
          <p>Manage dining tables and their QR menu links.</p>
        </div>
        <button
          className="btn"
          type="button"
          onClick={() => setTableForm("new")}
        >
          <Plus size={18} /> Add Table
        </button>
      </div>

      {pageError && <p className={classes.error}>{pageError}</p>}

      <section className={classes.summary}>
        <div className={classes.summaryCard}>
          <Table2 size={20} />
          <div>
            <span>Total tables</span>
            <b>{tables.length}</b>
          </div>
        </div>
        <div className={classes.summaryCard}>
          <QrCode size={20} />
          <div>
            <span>Active menu links</span>
            <b>{activeCount}</b>
          </div>
        </div>
      </section>

      <div className={classes.toolbar}>
        <label className={classes.searchBox}>
          <Search size={16} />
          <input
            type="text"
            placeholder="Search by table number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </label>
        <p className={classes.count}>
          {filteredTables.length} of {tables.length} shown
        </p>
      </div>

      {loading && <p className={classes.empty}>Loading tables...</p>}

      {!loading && tables.length === 0 && (
        <div className={classes.emptyState}>
          <div className={classes.emptyIcon}>
            <Table2 size={28} />
          </div>
          <h2>No tables yet</h2>
          <p>Add your first table to generate a customer menu link.</p>
          <button
            className="btn"
            type="button"
            onClick={() => setTableForm("new")}
          >
            <Plus size={18} /> Add Table
          </button>
        </div>
      )}

      {!loading && tables.length > 0 && filteredTables.length === 0 && (
        <p className={classes.empty}>No tables match your search.</p>
      )}

      <section className={classes.tableGrid}>
        {filteredTables.map((table) => {
          const isActive = Boolean(table.is_active);

          return (
            <article
              className={
                isActive
                  ? classes.tableCard
                  : `${classes.tableCard} ${classes.tableCardInactive}`
              }
              key={table.table_id}
            >
              <div className={classes.cardTop}>
                <div
                  className={
                    isActive ? classes.tableBadge : classes.tableBadgeInactive
                  }
                >
                  <Table2 size={18} />
                  <span>{isActive ? "Active" : "Inactive"}</span>
                </div>
                <button
                  className={classes.qrVisual}
                  type="button"
                  onClick={() => openQrModal(table)}
                  aria-label={`View QR code for table ${table.table_number}`}
                >
                  <QrCode size={42} strokeWidth={1.4} />
                  <span>View QR</span>
                </button>
                <h3>Table {table.table_number}</h3>
                <p className={classes.menuPath}>
                  /menu/public/table/{table.table_number}
                </p>
              </div>

              <label className={classes.toggle}>
                <input
                  type="checkbox"
                  checked={isActive}
                  disabled={updatingId === table.table_id}
                  onChange={() => handleToggleActive(table)}
                />
                <span className={classes.toggleTrack}>
                  <span className={classes.toggleThumb} />
                </span>
                <span className={classes.toggleText}>
                  {updatingId === table.table_id
                    ? "Updating..."
                    : isActive
                      ? "Menu link enabled"
                      : "Menu link disabled"}
                </span>
              </label>

              <button
                className={classes.qrBtn}
                type="button"
                onClick={() => openQrModal(table)}
              >
                <QrCode size={16} />
                Generate & download QR
              </button>

              <div className={classes.linkActions}>
                <button
                  className={classes.copyBtn}
                  type="button"
                  onClick={() => handleCopyLink(table)}
                >
                  <Copy size={16} />
                  {copiedId === table.table_id ? "Copied!" : "Copy link"}
                </button>
                {isActive ? (
                  <a
                    className={classes.openBtn}
                    href={getMenuUrl(table.table_number)}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <ExternalLink size={16} />
                    Open menu
                  </a>
                ) : (
                  <button className={classes.openBtnDisabled} type="button" disabled>
                    <ExternalLink size={16} />
                    Unavailable
                  </button>
                )}
              </div>

              <div className={classes.cardActions}>
                <button
                  className="btn light"
                  type="button"
                  onClick={() => setTableForm(table)}
                >
                  Edit
                </button>
                <button
                  className={classes.deleteBtn}
                  type="button"
                  onClick={() => {
                    setDeleteError("");
                    setDeleteTarget(table);
                  }}
                  disabled={deletingId === table.table_id}
                >
                  Delete
                </button>
              </div>
            </article>
          );
        })}
      </section>

      {tableForm && (
        <AddTableForm
          table={tableForm === "new" ? null : tableForm}
          existingNumbers={getExistingNumbers(
            tableForm === "new" ? null : tableForm.table_id,
          )}
          onSubmit={handleSaveTable}
          onClose={closeTableForm}
          loading={submitting}
          error={formError}
        />
      )}

      {qrModalTable && (
        <QrCodeModal
          table={qrModalTable}
          qrCode={qrCode}
          menuUrl={qrMenuUrl}
          loading={qrLoading}
          error={qrError}
          onClose={closeQrModal}
          onDownload={handleDownloadQr}
        />
      )}

      {deleteTarget && (
        <ConfirmDialog
          title="Delete table?"
          message="This table will be removed from your restaurant."
          itemName={`Table ${deleteTarget.table_number}`}
          warning="If this table has orders, delete will be blocked. Disable it instead."
          loading={Boolean(deletingId)}
          error={deleteError}
          onConfirm={handleConfirmDelete}
          onClose={() => {
            if (deletingId) return;
            setDeleteTarget(null);
            setDeleteError("");
          }}
        />
      )}
    </AdminLayout>
  );
}
