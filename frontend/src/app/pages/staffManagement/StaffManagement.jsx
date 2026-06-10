import { useEffect, useState } from "react";
import { Edit, Plus, ShieldCheck } from "lucide-react";
import AdminLayout from "../../../components/adminLayout/AdminLayout.jsx";
import AddWorkerForm from "../../../components/addWorkerForm/AddWorkerForm.jsx";
import {
  addWorker,
  getWorkers,
  updateWorker,
} from "../../../api/restaurant.service.js";
import classes from "./StaffManagement.module.css";

export default function StaffManagement() {
  const [staff, setStaff] = useState([]);
  const [workerForm, setWorkerForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [pageError, setPageError] = useState("");
  const [formError, setFormError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  const loadWorkers = async () => {
    setLoading(true);
    setPageError("");

    try {
      const result = await getWorkers();
      if (!result.success) {
        setPageError(result.message || "Failed to load workers");
        return;
      }
      setStaff(result.workers || []);
    } catch (err) {
      setPageError(err.response?.data?.message || "Could not load workers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWorkers();
  }, []);

  const closeForm = () => {
    setWorkerForm(null);
    setFormError("");
  };

  const handleSaveWorker = async (data) => {
    setSubmitting(true);
    setFormError("");

    try {
      const result =
        workerForm === "new"
          ? await addWorker(data)
          : await updateWorker(workerForm.user_id, data);

      if (!result.success) {
        setFormError(result.message || "Failed to save worker");
        return;
      }

      closeForm();
      await loadWorkers();
    } catch (err) {
      setFormError(err.response?.data?.message || "Could not save worker");
    } finally {
      setSubmitting(false);
    }
  };

  const getFullName = (member) =>
    `${member.first_name || ""} ${member.last_name || ""}`.trim();

  const handleToggleActive = async (member) => {
    const newActive = member.is_active ? 0 : 1;
    setUpdatingId(member.user_id);
    setPageError("");

    try {
      const result = await updateWorker(member.user_id, {
        first_name: member.first_name,
        last_name: member.last_name,
        email: member.email,
        is_active: newActive,
      });

      if (!result.success) {
        setPageError(result.message || "Failed to update worker status");
        return;
      }

      setStaff((prev) =>
        prev.map((worker) =>
          worker.user_id === member.user_id
            ? { ...worker, is_active: newActive }
            : worker,
        ),
      );
    } catch (err) {
      setPageError(err.response?.data?.message || "Could not update worker status");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <AdminLayout title="Admin Panel" subtitle="Staff accounts">
      <div className={classes.pageTitle}>
        <div>
          <h1>Staff Management</h1>
          <p>Create, edit, and manage worker accounts.</p>
        </div>
        <button
          className="btn"
          type="button"
          onClick={() => setWorkerForm("new")}
        >
          <Plus size={18} /> Add Worker
        </button>
      </div>

      {pageError && <p className={classes.error}>{pageError}</p>}

      <section className={classes.panel}>
        {loading && <p className={classes.empty}>Loading workers...</p>}

        {!loading && staff.length === 0 && (
          <p className={classes.empty}>No workers yet. Add your first worker.</p>
        )}

        {staff.map((member) => (
          <div className={classes.staffRow} key={member.user_id}>
            <div className={classes.avatar}>
              {(member.first_name || "?")[0]}
            </div>
            <div>
              <h3>{getFullName(member)}</h3>
              <p>{member.email}</p>
            </div>
            <span className={classes.role}>
              <ShieldCheck size={15} /> {member.role}
            </span>
            <div className={classes.rowActions}>
              <button
                className={classes.editBtn}
                type="button"
                onClick={() => setWorkerForm(member)}
                aria-label={`Edit ${getFullName(member)}`}
              >
                <Edit size={16} />
              </button>
              <label className={classes.toggle}>
                <input
                  type="checkbox"
                  checked={Boolean(member.is_active)}
                  disabled={updatingId === member.user_id}
                  onChange={() => handleToggleActive(member)}
                />
                <span className={classes.toggleTrack}>
                  <span className={classes.toggleThumb} />
                </span>
                <span className={classes.toggleText}>
                  {updatingId === member.user_id
                    ? "Updating..."
                    : member.is_active
                      ? "Active"
                      : "Disabled"}
                </span>
              </label>
            </div>
          </div>
        ))}
      </section>

      {workerForm && (
        <AddWorkerForm
          worker={workerForm === "new" ? null : workerForm}
          onSubmit={handleSaveWorker}
          onClose={closeForm}
          loading={submitting}
          error={formError}
        />
      )}
    </AdminLayout>
  );
}
