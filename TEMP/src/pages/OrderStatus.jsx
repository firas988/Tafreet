import { Link } from "react-router-dom";
import { CheckCircle2, ChefHat, Clock, Home } from "lucide-react";

export default function OrderStatus() {
  return (
    <div className="customerPage statusPage">
      <div className="statusCard">
        <div className="successIcon"><CheckCircle2 size={46} /></div>
        <span className="pill">Order #104</span>
        <h1>Your order was sent</h1>
        <p>The restaurant received your order. You can follow the current status here.</p>

        <div className="timeline">
          <div className="step done"><CheckCircle2 /><span>Sent</span></div>
          <div className="step done"><CheckCircle2 /><span>Accepted</span></div>
          <div className="step active"><ChefHat /><span>Preparing</span></div>
          <div className="step"><Clock /><span>Ready</span></div>
        </div>

        <div className="estimateBox">
          <span>Estimated time</span>
          <b>15 - 20 min</b>
        </div>

        <Link to="/menu" className="btn full"><Home size={18} /> Back to Menu</Link>
      </div>
    </div>
  );
}
