import { Plus, ShieldCheck } from "lucide-react";
import AdminLayout from "../../../components/adminLayout/AdminLayout.jsx";
import classes from "./StaffManagement.module.css";

export default function StaffManagement() {
  const staff = [];
  return (
    <AdminLayout title="Admin Panel" subtitle="Staff accounts">
      <div className={classes.pageTitle}>
        <div>
          <h1>Staff Management</h1>
          <p>Create worker accounts and control active status.</p>
        </div>
        <button className="btn" type="button">
          <Plus size={18} /> Add Worker
        </button>
      </div>

      <section className={classes.panel}>
        {staff.map((member) => (
          <div className={classes.staffRow} key={member.id}>
            <div className={classes.avatar}>{member.name[0]}</div>
            <div>
              <h3>{member.name}</h3>
              <p>{member.email}</p>
            </div>
            <span className={classes.role}>
              <ShieldCheck size={15} /> {member.role}
            </span>
            <span
              className={
                member.active ? "status accepted" : "status rejected"
              }
            >
              {member.active ? "Active" : "Disabled"}
            </span>
          </div>
        ))}
      </section>
    </AdminLayout>
  );
}
