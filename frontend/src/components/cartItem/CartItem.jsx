import { Minus, Plus, Trash2 } from "lucide-react";
import classes from "./CartItem.module.css";

export default function CartItem({ item }) {
  return (
    <article className={classes.cartItem}>
      <button className={classes.iconBtnDanger} type="button">
        <Trash2 size={17} />
      </button>
      <div>
        <h3>{item.name}</h3>
        <p>₪{item.price} each</p>
      </div>
      <div className={classes.qtyBox}>
        <button type="button">
          <Minus size={14} />
        </button>
        <b>{item.qty}</b>
        <button type="button">
          <Plus size={14} />
        </button>
      </div>
    </article>
  );
}
