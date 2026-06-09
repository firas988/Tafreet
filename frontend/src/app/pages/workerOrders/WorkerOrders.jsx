import AdminLayout from "../../../components/adminLayout/AdminLayout.jsx";
import OrderCard from "../../../components/orderCard/OrderCard.jsx";
import classes from "./WorkerOrders.module.css";

const columns = ["New", "Preparing", "Ready"];

export default function WorkerOrders() {
  const orders = [];
  return (
    <AdminLayout title="Worker Panel" subtitle="Kitchen live queue">
      <div className={classes.pageTitle}>
        <div>
          <h1>Kitchen Orders</h1>
          <p>Accept, prepare and complete customer orders.</p>
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
