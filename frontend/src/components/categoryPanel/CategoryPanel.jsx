import { Edit, Trash2 } from "lucide-react";
import classes from "./CategoryPanel.module.css";

export default function CategoryPanel({ categories }) {
  return (
    <div className={classes.panel}>
      <h2>Categories</h2>
      {categories.map((cat) => (
        <div className={classes.tableRow} key={cat.id}>
          <span>
            {cat.emoji} {cat.name}
          </span>
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
