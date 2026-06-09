import { useEffect, useState } from "react";
import { Plus, ShieldCheck } from "lucide-react";
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
  const [showForm, setShowForm] = useState(false);
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

  const handleAddWorker = async (data) => {
    setSubmitting(true);
    setFormError("");

    try {
      const result = await addWorker(data);
      if (!result.success) {
        setFormError(result.message || "Failed to add worker");
        return;
      }

      setShowForm(false);
      setFormError("");
      await loadWorkers();
    } catch (err) {
      setFormError(err.response?.data?.message || "Could not add worker");
    } finally {
      setSubmitting(false);
    }
  };

  const openForm = () => {
    setFormError("");
    setShowForm(true);
  };

  const closeForm = () => {
    setFormError("");
    setShowForm(false);
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
          <p>Create worker accounts and control active status.</p>
        </div>
        <button
          className="btn"
          type="button"
          onClick={openForm}
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
        ))}
      </section>

      {showForm && (
        <AddWorkerForm
          onSubmit={handleAddWorker}
          onClose={closeForm}
          loading={submitting}
          error={formError}
        />
      )}
    </AdminLayout>
  );
}
