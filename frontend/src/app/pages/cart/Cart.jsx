import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Banknote, Send } from "lucide-react";
import CartItem from "../../../components/cartItem/CartItem.jsx";
import { createOrder } from "../../../api/order.service.js";
import { useCart } from "../../../context/CartContext.jsx";
import classes from "./Cart.module.css";

export default function Cart() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tableFromQuery = searchParams.get("table");
  const {
    tableNumber,
    items,
    subtotal,
    productIds,
    removeFromCart,
    updateQty,
    clearCart,
    initTable,
  } = useCart();

  const activeTable = tableNumber || Number(tableFromQuery) || 1;
  const [userName, setUserName] = useState("");
  const [isCash, setIsCash] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (tableFromQuery) {
      initTable(Number(tableFromQuery));
    }
  }, [tableFromQuery, initTable]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!userName.trim()) {
      setError("Please enter your name");
      return;
    }

    if (items.length === 0) {
      setError("Your cart is empty");
      return;
    }

    setSubmitting(true);

    try {
      const result = await createOrder({
        table_number: activeTable,
        user_name: userName.trim(),
        product_ids: productIds,
        is_cash: isCash ? 1 : 0,
        payment_code: null,
      });

      if (!result.success) {
        setError(result.message || "Failed to send order");
        return;
      }

      clearCart();
      navigate("/status", {
        state: {
          orderId: result.order_id,
          tableNumber: activeTable,
          isCash: Number(result.is_cash) === 1,
        },
      });
    } catch (err) {
      setError(err.response?.data?.message || "Could not send order");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={classes.customerPage}>
      <header className={classes.simpleHeader}>
        <Link
          to={`/menu/public/table/${activeTable}`}
          className={classes.iconBtn}
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1>Your Cart</h1>
          <p>Table {activeTable} · Review your order before sending it</p>
        </div>
      </header>

      {items.length === 0 ? (
        <section className={classes.emptyCart}>
          <p>Your cart is empty.</p>
          <Link to={`/menu/public/table/${activeTable}`} className="btn">
            Back to menu
          </Link>
        </section>
      ) : (
        <>
          <section className={classes.cartList}>
            {items.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                onRemove={removeFromCart}
                onUpdateQty={updateQty}
              />
            ))}
          </section>

          <form className={classes.checkoutCard} onSubmit={handleSubmit}>
            <h2>Customer details</h2>

            {error && <p className={classes.error}>{error}</p>}

            <div className={classes.formGrid}>
              <input
                placeholder="Your name"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                required
              />
              <input
                placeholder="Table number"
                value={activeTable}
                readOnly
              />
            </div>

            <div className={classes.totalLine}>
              <span>Subtotal</span>
              <b>₪{subtotal.toFixed(2)}</b>
            </div>
            <div className={`${classes.totalLine} ${classes.big}`}>
              <span>Total</span>
              <b>₪{subtotal.toFixed(2)}</b>
            </div>

            <div className={classes.paymentSection}>
              <h3>Payment method</h3>
              <label
                className={
                  isCash
                    ? `${classes.paymentOption} ${classes.paymentActive}`
                    : classes.paymentOption
                }
              >
                <input
                  type="radio"
                  name="is_cash"
                  value="1"
                  checked={isCash}
                  onChange={() => setIsCash(true)}
                />
                <span className={classes.paymentIcon}>
                  <Banknote size={22} />
                </span>
                <span>
                  <strong>Pay in cash</strong>
                  <small>Pay at the table when your order is ready</small>
                </span>
              </label>
            </div>

            <button className="btn full" type="submit" disabled={submitting}>
              <Send size={18} />
              {submitting ? "Sending..." : "Place order · Pay in cash"}
            </button>
          </form>
        </>
      )}
    </div>
  );
}
