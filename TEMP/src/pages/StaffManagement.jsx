import AdminLayout from "../components/AdminLayout.jsx";
import { staff } from "../data.js";
import { Plus, ShieldCheck } from "lucide-react";

export default function StaffManagement() {
  return (
    <AdminLayout title="Admin Panel" subtitle="Staff accounts">
      <div className="pageTitle">
        <div>
          <h1>Staff Management</h1>
          <p>Create worker accounts and control active status.</p>
        </div>
        <button className="btn"><Plus size={18} /> Add Worker</button>
      </div>

      <section className="panel">
        {staff.map((member) => (
          <div className="staffRow" key={member.id}>
            <div className="avatar">{member.name[0]}</div>
            <div>
              <h3>{member.name}</h3>
              <p>{member.email}</p>
            </div>
            <span className="role"><ShieldCheck size={15} /> {member.role}</span>
            <span className={member.active ? "status accepted" : "status rejected"}>
              {member.active ? "Active" : "Disabled"}
            </span>
          </div>
        ))}
      </section>
    </AdminLayout>
  );
}
