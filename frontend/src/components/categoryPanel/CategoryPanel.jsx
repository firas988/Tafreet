import { Edit, Plus, Trash2 } from "lucide-react";
import { getUploadUrl } from "../../utils/imageUrl.js";
import classes from "./CategoryPanel.module.css";

export default function CategoryPanel({
  categories,
  onAdd,
  onEdit,
  onDelete,
  deletingId,
}) {
  return (
    <div className={classes.panel}>
      <div className={classes.panelHead}>
        <h2>Categories</h2>
        <button className="btn light" type="button" onClick={onAdd}>
          <Plus size={16} /> Add
        </button>
      </div>

      {categories.length === 0 && (
        <p className={classes.empty}>No categories yet.</p>
      )}

      {categories.map((cat) => (
        <div className={classes.tableRow} key={cat.categorie_id}>
          <div className={classes.info}>
            <img
              src={getUploadUrl("categories", cat.image_path)}
              alt={cat.categorie_name}
            />
            <span>{cat.categorie_name}</span>
          </div>
          <div className={classes.rowActions}>
            <button type="button" onClick={() => onEdit(cat)}>
              <Edit size={16} />
            </button>
            <button
              type="button"
              onClick={() => onDelete(cat)}
              disabled={deletingId === cat.categorie_id}
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
