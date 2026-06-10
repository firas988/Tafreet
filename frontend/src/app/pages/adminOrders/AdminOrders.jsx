import AdminLayout from "../../../components/adminLayout/AdminLayout.jsx";
import OrderCard from "../../../components/orderCard/OrderCard.jsx";
import classes from "../workerOrders/WorkerOrders.module.css";

const columns = ["New", "Preparing", "Ready"];

export default function AdminOrders() {
  const orders = [];

  return (
    <AdminLayout title="Admin Panel" subtitle="Live orders">
      <div className={classes.pageTitle}>
        <div>
          <h1>Live Orders</h1>
          <p>Monitor and manage incoming customer orders.</p>
        </div>
      </div>

      <div className={classes.kanban}>
        {columns.map((status) => (
          <section className={classes.kanbanCol} key={status}>
            <h2>{status}</h2>
            {orders
              .filter(
                (order) =>
                  order.status === status ||
                  (status === "New" && order.status === "Accepted"),
              )
              .map((order) => (
                <OrderCard key={order.id} order={order} worker />
              ))}
          </section>
        ))}
      </div>
    </AdminLayout>
  );
}
