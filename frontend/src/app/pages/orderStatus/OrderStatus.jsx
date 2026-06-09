import { Link } from "react-router-dom";
import { CheckCircle2, ChefHat, Clock, Home } from "lucide-react";
import classes from "./OrderStatus.module.css";

export default function OrderStatus() {
  return (
    <div className={`${classes.customerPage} ${classes.statusPage}`}>
      <div className={classes.statusCard}>
        <div className={classes.successIcon}>
          <CheckCircle2 size={46} />
        </div>
        <span className="pill">Order #104</span>
        <h1>Your order was sent</h1>
        <p>
          The restaurant received your order. You can follow the current status
          here.
        </p>

        <div className={classes.timeline}>
          <div className={`${classes.step} ${classes.done}`}>
            <CheckCircle2 />
            <span>Sent</span>
          </div>
          <div className={`${classes.step} ${classes.done}`}>
            <CheckCircle2 />
            <span>Accepted</span>
          </div>
          <div className={`${classes.step} ${classes.active}`}>
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

        <Link to="/menu" className="btn full">
          <Home size={18} /> Back to Menu
        </Link>
      </div>
    </div>
  );
}
