import { Edit, Trash2 } from "lucide-react";
import classes from "./ProductPanel.module.css";

export default function ProductPanel({ products }) {
  return (
    <div className={classes.panel}>
      <h2>Products</h2>
      {products.map((product) => (
        <div className={classes.productManageRow} key={product.id}>
          <img src={product.image} alt={product.name} />
          <div>
            <h3>{product.name}</h3>
            <p>
              ₪{product.price} · {product.description}
            </p>
          </div>
          <div className={classes.rowActions}>
            <button type="button">
              <Edit size={16} />
            </button>
            <button type="button">
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
