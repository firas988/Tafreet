import { Link } from "react-router-dom";
import { ArrowLeft, CreditCard, Minus, Plus, Trash2 } from "lucide-react";

const cartItems = [
  { id: 1, name: "Royal Smash Burger", price: 62, qty: 1 },
  { id: 2, name: "Mint Lemonade", price: 18, qty: 2 },
  { id: 3, name: "Chocolate Lava Cake", price: 34, qty: 1 },
];

export default function Cart() {
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <div className="customerPage">
      <header className="simpleHeader">
        <Link to="/menu" className="iconBtn"><ArrowLeft size={20} /></Link>
        <div>
          <h1>Your Cart</h1>
          <p>Review your order before sending it</p>
        </div>
      </header>

      <section className="cartList">
        {cartItems.map((item) => (
          <article className="cartItem" key={item.id}>
            <button className="iconBtn danger"><Trash2 size={17} /></button>
            <div>
              <h3>{item.name}</h3>
              <p>₪{item.price} each</p>
            </div>
            <div className="qtyBox">
              <button><Minus size={14} /></button>
              <b>{item.qty}</b>
              <button><Plus size={14} /></button>
            </div>
          </article>
        ))}
      </section>

      <section className="checkoutCard">
        <h2>Customer details</h2>
        <div className="formGrid">
          <input placeholder="Your name" />
          <input placeholder="Phone number" />
          <input placeholder="Table number" defaultValue="12" />
          <select defaultValue="paypal">
            <option value="paypal">PayPal / Mock Payment</option>
            <option value="cash">Cash at restaurant</option>
          </select>
        </div>

        <div className="totalLine">
          <span>Subtotal</span>
          <b>₪{subtotal}</b>
        </div>
        <div className="totalLine big">
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
