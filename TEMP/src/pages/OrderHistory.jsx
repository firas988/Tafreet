import AdminLayout from "../components/AdminLayout.jsx";
import { orders } from "../data.js";

export default function OrderHistory() {
  return (
    <AdminLayout title="Admin Panel" subtitle="Reports">
      <div className="pageTitle">
        <div>
          <h1>Order History</h1>
          <p>Completed and previous restaurant orders.</p>
        </div>
      </div>

      <section className="panel">
        <div className="historyHeader">
          <input placeholder="Search by customer, table or order id..." />
          <select defaultValue="all">
            <option value="all">All Status</option>
            <option>Completed</option>
            <option>Rejected</option>
          </select>
        </div>

        <table className="historyTable">
          <thead>
            <tr>
              <th>Order</th>
              <th>Customer</th>
              <th>Table</th>
              <th>Status</th>
              <th>Total</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>#{order.id}</td>
                <td>{order.customer}</td>
                <td>{order.table}</td>
                <td><span className="status completed">{order.status}</span></td>
                <td>₪{order.total}</td>
                <td>{order.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </AdminLayout>
  );
}
