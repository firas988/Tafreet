import { useEffect, useState } from "react";
import { Link, useLocation, useParams, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  Banknote,
  CheckCircle2,
  ChefHat,
  Clock,
  Home,
} from "lucide-react";
import { getOrderById } from "../../../api/order.service.js";
import { joinTableRoom, onOrderUpdated } from "../../../socket/socket.js";
import {
  getStoredTableOrder,
  upsertTableOrder,
} from "../../../utils/tableOrderStorage.js";
import {
  formatOrderTime,
  getStatusLabel,
} from "../../../utils/orderStatus.js";
import classes from "./OrderStatus.module.css";

const timelineSteps = [
  { key: "submitted", label: "Sent", icon: CheckCircle2 },
  { key: "processing", label: "Preparing", icon: ChefHat },
  { key: "completed", label: "Ready", icon: Clock },
];

const statusRank = {
  submitted: 0,
  processing: 1,
  completed: 2,
  paid: 3,
};

export default function OrderStatus() {
  const location = useLocation();
  const { orderId: orderIdParam } = useParams();
  const [searchParams] = useSearchParams();

  const tableFromQuery = Number(searchParams.get("table")) || null;
  const storedOrder = tableFromQuery ? getStoredTableOrder(tableFromQuery) : null;

  const initialOrderId =
    orderIdParam ||
    location.state?.orderId ||
    storedOrder?.orderId ||
    null;

  const initialTable =
    location.state?.tableNumber ||
    tableFromQuery ||
    storedOrder?.tableNumber ||
    1;

  const [orderId] = useState(initialOrderId);
  const [tableNumber, setTableNumber] = useState(initialTable);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(Boolean(initialOrderId));
  const [error, setError] = useState("");

  useEffect(() => {
    if (!orderId) return;

    const loadOrder = async () => {
      setLoading(true);
      setError("");

      try {
        const result = await getOrderById(orderId);
        if (!result.success) {
          setError(result.message || "Failed to load order");
          return;
        }

        setOrder(result.order);
        setTableNumber(result.order.table_number);
        upsertTableOrder(result.order.table_number, result.order);
      } catch (err) {
        setError(err.response?.data?.message || "Could not load order");
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [orderId]);

  useEffect(() => {
    if (!tableNumber) return;

    joinTableRoom(tableNumber);

    const unsubscribe = onOrderUpdated((updatedOrder) => {
      if (Number(updatedOrder.order_id) !== Number(orderId)) return;

      setOrder(updatedOrder);
      upsertTableOrder(updatedOrder.table_number, updatedOrder);
    });

    return unsubscribe;
  }, [tableNumber, orderId]);

  const currentRank = statusRank[order?.status] ?? -1;
  const isCash = order ? Number(order.is_cash) === 1 : location.state?.isCash !== false;
  const isPaid = order?.status === "paid";

  return (
    <div className={`${classes.customerPage} ${classes.statusPage}`}>
      <div className={classes.statusCard}>
        <Link
          to={`/menu/public/table/${tableNumber}`}
          className={classes.backLink}
        >
          <ArrowLeft size={18} />
          Back to menu
        </Link>

        <div
          className={
            isPaid
              ? `${classes.statusIcon} ${classes.statusIconPaid}`
              : classes.statusIcon
          }
        >
          <CheckCircle2 size={40} />
        </div>

        <div className={classes.statusMeta}>
          <span className="pill">Order #{orderId || "—"}</span>
          <span className={classes.tableBadge}>Table {tableNumber}</span>
        </div>

        <h1>{order ? getStatusLabel(order.status) : "Track your order"}</h1>
        <p className={classes.subtitle}>
          {loading
            ? "Loading your order..."
            : `${order?.user_name || "Guest"} · Placed at ${formatOrderTime(order?.created_at)}`}
        </p>

        {error && <p className={classes.error}>{error}</p>}

        <div className={classes.timeline}>
          {timelineSteps.map((step, index) => {
            const Icon = step.icon;
            const stepRank = statusRank[step.key];
            const isDone = currentRank > stepRank || isPaid;
            const isActive =
              order?.status === step.key ||
              (isPaid && step.key === "completed");

            return (
              <div key={step.key} className={classes.timelineItem}>
                {index > 0 && (
                  <span
                    className={
                      isDone || isActive
                        ? `${classes.timelineLine} ${classes.timelineLineDone}`
                        : classes.timelineLine
                    }
                  />
                )}
                <div
                  className={
                    isActive
                      ? `${classes.step} ${classes.active}`
                      : isDone
                        ? `${classes.step} ${classes.done}`
                        : classes.step
                  }
                >
                  <Icon />
                  <span>{step.label}</span>
                </div>
              </div>
            );
          })}
        </div>

        {order?.items?.length > 0 && (
          <section className={classes.orderSummary}>
            <div className={classes.summaryHead}>
              <h2>Order summary</h2>
              <span>{order.items_count} items</span>
            </div>
            <div className={classes.summaryList}>
              {order.items.map((item) => (
                <div
                  key={`${order.order_id}-${item.product_id}`}
                  className={classes.summaryRow}
                >
                  <span>
                    {item.product_name} <b>x{item.quantity}</b>
                  </span>
                  <span>
                    ₪{(item.product_price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
            <div className={classes.summaryTotal}>
              <span>Total</span>
              <b>₪{Number(order.total).toFixed(2)}</b>
            </div>
          </section>
        )}

        <div className={classes.estimateBox}>
          <span>Current status</span>
          <b>{order ? getStatusLabel(order.status) : "Waiting..."}</b>
        </div>

        {isCash && (
          <div className={classes.paymentNote}>
            <Banknote size={18} />
            <span>Payment: cash at the table</span>
          </div>
        )}

        <Link
          to={`/menu/public/table/${tableNumber}`}
          className="btn full"
        >
          <Home size={18} /> Back to Menu
        </Link>
      </div>
    </div>
  );
}
