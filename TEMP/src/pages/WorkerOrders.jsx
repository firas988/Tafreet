import AdminLayout from "../components/AdminLayout.jsx";
import OrderCard from "../components/OrderCard.jsx";
import { orders } from "../data.js";

export default function WorkerOrders() {
  return (
    <AdminLayout title="Worker Panel" subtitle="Kitchen live queue">
      <div className="pageTitle">
        <div>
          <h1>Kitchen Orders</h1>
          <p>Accept, prepare and complete customer orders.</p>
        </div>
      </div>

      <div className="kanban">
        {["New", "Preparing", "Ready"].map((status) => (
          <section className="kanbanCol" key={status}>
            <h2>{status}</h2>
            {orders.filter((o) => o.status === status || (status === "New" && o.status === "Accepted")).map((order) => (
              <OrderCard key={order.id} order={order} worker />
            ))}
          </section>
        ))}
      </div>
    </AdminLayout>
  );
}
