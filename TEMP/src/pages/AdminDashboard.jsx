import AdminLayout from "../components/AdminLayout.jsx";
import OrderCard from "../components/OrderCard.jsx";
import { orders, products, staff } from "../data.js";
import { DollarSign, ListOrdered, Package, Users } from "lucide-react";

export default function AdminDashboard() {
  return (
    <AdminLayout title="Admin Panel" subtitle="Luna Bistro">
      <div className="pageTitle">
        <div>
          <h1>Dashboard</h1>
          <p>Live restaurant overview and order queue.</p>
        </div>
      </div>

      <section className="statsGrid">
        <div className="statCard"><ListOrdered /><span>Today Orders</span><b>34</b></div>
        <div className="statCard"><DollarSign /><span>Revenue</span><b>₪2,470</b></div>
        <div className="statCard"><Package /><span>Products</span><b>{products.length}</b></div>
        <div className="statCard"><Users /><span>Staff</span><b>{staff.length}</b></div>
      </section>

      <section className="sectionHead">
        <div>
          <h2>Live Orders</h2>
          <p>Orders coming from QR tables</p>
        </div>
      </section>

      <div className="ordersGrid">
        {orders.map((order) => <OrderCard key={order.id} order={order} worker />)}
      </div>
    </AdminLayout>
  );
}
