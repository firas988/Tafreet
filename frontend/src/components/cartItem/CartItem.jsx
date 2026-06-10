import { Minus, Plus, Trash2 } from "lucide-react";
import classes from "./CartItem.module.css";

export default function CartItem({ item, onRemove, onUpdateQty }) {
  return (
    <article className={classes.cartItem}>
      <button
        className={classes.iconBtnDanger}
        type="button"
        onClick={() => onRemove(item.id)}
        aria-label={`Remove ${item.name}`}
      >
        <Trash2 size={17} />
      </button>
      <div>
        <h3>{item.name}</h3>
        <p>₪{item.price} each</p>
      </div>
      <div className={classes.qtyBox}>
        <button type="button" onClick={() => onUpdateQty(item.id, item.qty - 1)}>
          <Minus size={14} />
        </button>
        <b>{item.qty}</b>
        <button type="button" onClick={() => onUpdateQty(item.id, item.qty + 1)}>
          <Plus size={14} />
        </button>
      </div>
    </article>
  );
}
