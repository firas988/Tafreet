import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Banknote, Send } from "lucide-react";
import CartItem from "../../../components/cartItem/CartItem.jsx";
import { createOrder } from "../../../api/order.service.js";
import { useCart } from "../../../context/CartContext.jsx";
import { upsertTableOrder } from "../../../utils/tableOrderStorage.js";
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

      const placedOrder = result.order || {
        order_id: result.order_id,
        table_number: activeTable,
        is_cash: result.is_cash,
        status: "submitted",
        user_name: userName.trim(),
        total: subtotal,
      };

      upsertTableOrder(activeTable, placedOrder);

      clearCart();
      navigate(`/status/${result.order_id}?table=${activeTable}`, {
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
          <span className={classes.tablePill}>Table {activeTable}</span>
          <h1>Your Cart</h1>
          <p>Review your order before sending it to the kitchen</p>
        </div>
        {items.length > 0 && (
          <span className={classes.itemCount}>{items.length} items</span>
        )}
      </header>

      {items.length === 0 ? (
        <section className={classes.emptyCart}>
          <div className={classes.emptyIcon}>🛒</div>
          <h2>Your cart is empty</h2>
          <p>Add something delicious from the menu to get started.</p>
          <Link to={`/menu/public/table/${activeTable}`} className="btn">
            Back to menu
          </Link>
        </section>
      ) : (
        <div className={classes.cartLayout}>
          <section className={classes.cartList}>
            <div className={classes.listHead}>
              <h2>Order items</h2>
              <span>{items.length} products</span>
            </div>
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
            <h2>Checkout</h2>
            <p className={classes.checkoutHint}>
              Enter your name so the staff can bring your order to the table.
            </p>

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

            <div className={classes.totalBox}>
              <div className={classes.totalLine}>
                <span>Subtotal</span>
                <b>₪{subtotal.toFixed(2)}</b>
              </div>
              <div className={`${classes.totalLine} ${classes.big}`}>
                <span>Total</span>
                <b>₪{subtotal.toFixed(2)}</b>
              </div>
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
        </div>
      )}
    </div>
  );
}
