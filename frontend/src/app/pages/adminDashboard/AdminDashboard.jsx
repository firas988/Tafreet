import { DollarSign, ListOrdered, Package, Users } from "lucide-react";
import AdminLayout from "../../../components/adminLayout/AdminLayout.jsx";
import OrderCard from "../../../components/orderCard/OrderCard.jsx";
import classes from "./AdminDashboard.module.css";

export default function AdminDashboard() {
  const orders = [];
  const products = [];
  const staff = [];
  return (
    <AdminLayout title="Admin Panel" subtitle="Luna Bistro">
      <div className={classes.pageTitle}>
        <div>
          <h1>Dashboard</h1>
          <p>Live restaurant overview and order queue.</p>
        </div>
      </div>

      <section className={classes.statsGrid}>
        <div className={classes.statCard}>
          <ListOrdered />
          <span>Today Orders</span>
          <b>34</b>
        </div>
        <div className={classes.statCard}>
          <DollarSign />
          <span>Revenue</span>
          <b>₪2,470</b>
        </div>
        <div className={classes.statCard}>
          <Package />
          <span>Products</span>
          <b>{products.length}</b>
        </div>
        <div className={classes.statCard}>
          <Users />
          <span>Staff</span>
          <b>{staff.length}</b>
        </div>
      </section>

      <section className={classes.sectionHead}>
        <div>
          <h2>Live Orders</h2>
          <p>Orders coming from QR tables</p>
        </div>
      </section>

      <div className={classes.ordersGrid}>
        {orders.map((order) => (
          <OrderCard key={order.id} order={order} worker />
        ))}
      </div>
    </AdminLayout>
  );
}
