import classes from "./OrderCard.module.css";

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
    <article className={classes.orderCard}>
      <div className={classes.orderHead}>
        <div>
          <span className={classes.smallLabel}>Order #{order.id}</span>
          <h3>Table {order.table}</h3>
          <p>
            {order.customer} · {order.phone}
          </p>
        </div>
        <span className={`status ${statusClass[order.status] || "new"}`}>
          {order.status}
        </span>
      </div>

      <div className={classes.orderItems}>
        {order.items.map((item) => (
          <div key={item.name}>
            <span>{item.name}</span>
            <b>x{item.qty}</b>
          </div>
        ))}
      </div>

      <div className={classes.orderFoot}>
        <b>₪{order.total}</b>
        <span>{order.time}</span>
      </div>

      {worker && (
        <div className={classes.actionRow}>
          <button className="btn light" type="button">
            Reject
          </button>
          <button className="btn" type="button">
            Accept
          </button>
          <button className="btn dark" type="button">
            Ready
          </button>
        </div>
      )}
    </article>
  );
}
