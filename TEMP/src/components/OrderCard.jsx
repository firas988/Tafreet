const statusClass = {
  New: "new",
  Accepted: "accepted",
  Preparing: "preparing",
  Ready: "ready",
  Completed: "completed",
  Rejected: "rejected",
};

export default function OrderCard({ order, worker = false }) {
  return (
    <article className="orderCard">
      <div className="orderHead">
        <div>
          <span className="smallLabel">Order #{order.id}</span>
          <h3>Table {order.table}</h3>
          <p>{order.customer} · {order.phone}</p>
        </div>
        <span className={`status ${statusClass[order.status] || "new"}`}>{order.status}</span>
      </div>

      <div className="orderItems">
        {order.items.map((item) => (
          <div key={item.name}>
            <span>{item.name}</span>
            <b>x{item.qty}</b>
          </div>
        ))}
      </div>

      <div className="orderFoot">
        <b>₪{order.total}</b>
        <span>{order.time}</span>
      </div>

      {worker && (
        <div className="actionRow">
          <button className="btn light">Reject</button>
          <button className="btn">Accept</button>
          <button className="btn dark">Ready</button>
        </div>
      )}
    </article>
  );
}
