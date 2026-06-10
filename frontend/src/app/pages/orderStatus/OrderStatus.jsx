import { Link, useLocation } from "react-router-dom";
import { Banknote, CheckCircle2, ChefHat, Clock, Home } from "lucide-react";
import classes from "./OrderStatus.module.css";

export default function OrderStatus() {
  const location = useLocation();
  const orderId = location.state?.orderId;
  const tableNumber = location.state?.tableNumber || 1;
  const isCash = location.state?.isCash !== false;

  return (
    <div className={`${classes.customerPage} ${classes.statusPage}`}>
      <div className={classes.statusCard}>
        <div className={classes.successIcon}>
          <CheckCircle2 size={46} />
        </div>
        <span className="pill">
          {orderId ? `Order #${orderId}` : "Order sent"}
        </span>
        <h1>Your order was sent</h1>
        <p>
          The restaurant received your order from table {tableNumber}. You can
          follow the current status here.
        </p>

        <div className={classes.timeline}>
          <div className={`${classes.step} ${classes.done}`}>
            <CheckCircle2 />
            <span>Sent</span>
          </div>
          <div className={classes.step}>
            <ChefHat />
            <span>Preparing</span>
          </div>
          <div className={classes.step}>
            <Clock />
            <span>Ready</span>
          </div>
        </div>

        <div className={classes.estimateBox}>
          <span>Estimated time</span>
          <b>15 - 20 min</b>
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
