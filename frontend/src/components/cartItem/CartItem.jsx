import { Minus, Plus, Trash2 } from "lucide-react";
import classes from "./CartItem.module.css";

export default function CartItem({ item, onRemove, onUpdateQty }) {
  const lineTotal = Number(item.price) * item.qty;

  return (
    <article className={classes.cartItem}>
      {item.image ? (
        <img className={classes.thumb} src={item.image} alt={item.name} />
      ) : (
        <div className={classes.thumbFallback}>{item.name?.[0] || "?"}</div>
      )}

      <div className={classes.itemInfo}>
        <h3>{item.name}</h3>
        <p>₪{Number(item.price).toFixed(2)} each</p>
      </div>

      <div className={classes.itemActions}>
        <div className={classes.qtyBox}>
          <button
            type="button"
            onClick={() => onUpdateQty(item.id, item.qty - 1)}
            aria-label={`Decrease ${item.name} quantity`}
          >
            <Minus size={14} />
          </button>
          <b>{item.qty}</b>
          <button
            type="button"
            onClick={() => onUpdateQty(item.id, item.qty + 1)}
            aria-label={`Increase ${item.name} quantity`}
          >
            <Plus size={14} />
          </button>
        </div>

        <div className={classes.lineTotal}>₪{lineTotal.toFixed(2)}</div>

        <button
          className={classes.iconBtnDanger}
          type="button"
          onClick={() => onRemove(item.id)}
          aria-label={`Remove ${item.name}`}
        >
          <Trash2 size={16} />
        </button>
      </div>
    </article>
  );
}
