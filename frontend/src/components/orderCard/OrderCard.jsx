import {
  formatOrderTime,
  getStatusLabel,
  WORKER_ACTION_LABELS,
} from "../../utils/orderStatus.js";
import classes from "./OrderCard.module.css";

const statusClass = {
  submitted: "new",
  processing: "preparing",
  completed: "ready",
  paid: "completed",
};

export default function OrderCard({
  order,
  worker = false,
  onAdvanceStatus,
  updating = false,
}) {
  const nextActionLabel = WORKER_ACTION_LABELS[order.status];
  const canAdvance = worker && Boolean(nextActionLabel) && !updating;

  return (
    <article className={classes.orderCard}>
      <div className={classes.orderHead}>
        <div>
          <span className={classes.smallLabel}>Order #{order.order_id}</span>
          <h3>Table {order.table_number}</h3>
          <p>
            {order.customer_name || order.user_name}
            {order.is_cash ? " · Cash" : ""}
          </p>
        </div>
        <span className={`status ${statusClass[order.status] || "new"}`}>
          {getStatusLabel(order.status)}
        </span>
      </div>

      <div className={classes.orderItems}>
        {order.items.map((item) => (
          <div key={`${order.order_id}-${item.product_id}`}>
            <span>{item.product_name}</span>
            <b>x{item.quantity}</b>
          </div>
        ))}
      </div>

      <div className={classes.orderFoot}>
        <b>₪{Number(order.total).toFixed(2)}</b>
        <span>{formatOrderTime(order.created_at)}</span>
      </div>

      {canAdvance && (
        <div className={classes.actionRow}>
          <button
            className="btn full"
            type="button"
            disabled={updating}
            onClick={() => onAdvanceStatus(order)}
          >
            {updating ? "Updating..." : nextActionLabel}
          </button>
        </div>
      )}
    </article>
  );
}
