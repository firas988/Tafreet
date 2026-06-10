import { Star } from "lucide-react";
import classes from "./ProductCard.module.css";

export default function ProductCard({ product, onAdd }) {
  return (
    <article className={classes.productCard}>
      <img src={product.image} alt={product.name} />
      {product.popular && (
        <span className={classes.floatingBadge}>
          <Star size={13} /> Popular
        </span>
      )}
      <div className={classes.productInfo}>
        <div>
          <h3>{product.name}</h3>
          <p>{product.description}</p>
        </div>
        <div className={classes.priceRow}>
          <b>₪{product.price}</b>
          <button
            className={classes.roundBtn}
            type="button"
            onClick={() => onAdd?.(product)}
            aria-label={`Add ${product.name} to cart`}
          >
            +
          </button>
        </div>
      </div>
    </article>
  );
}
