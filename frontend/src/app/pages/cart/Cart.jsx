import { Link } from "react-router-dom";
import { ArrowLeft, CreditCard } from "lucide-react";
import CartItem from "../../../components/cartItem/CartItem.jsx";
import classes from "./Cart.module.css";

const cartItems = [
  { id: 1, name: "Royal Smash Burger", price: 62, qty: 1 },
  { id: 2, name: "Mint Lemonade", price: 18, qty: 2 },
  { id: 3, name: "Chocolate Lava Cake", price: 34, qty: 1 },
];

export default function Cart() {
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.qty,
    0,
  );

  return (
    <div className={classes.customerPage}>
      <header className={classes.simpleHeader}>
        <Link to="/menu" className={classes.iconBtn}>
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1>Your Cart</h1>
          <p>Review your order before sending it</p>
        </div>
      </header>

      <section className={classes.cartList}>
        {cartItems.map((item) => (
          <CartItem key={item.id} item={item} />
        ))}
      </section>

      <section className={classes.checkoutCard}>
        <h2>Customer details</h2>
        <div className={classes.formGrid}>
          <input placeholder="Your name" />
          <input placeholder="Phone number" />
          <input placeholder="Table number" defaultValue="12" />
          <select defaultValue="paypal">
            <option value="paypal">PayPal / Mock Payment</option>
            <option value="cash">Cash at restaurant</option>
          </select>
        </div>

        <div className={classes.totalLine}>
          <span>Subtotal</span>
          <b>₪{subtotal}</b>
        </div>
        <div className={`${classes.totalLine} ${classes.big}`}>
          <span>Total</span>
          <b>₪{subtotal}</b>
        </div>

        <Link to="/status" className="btn full">
          <CreditCard size={18} />
          Send Order
        </Link>
      </section>
    </div>
  );
}
