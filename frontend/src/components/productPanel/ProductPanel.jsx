import { useMemo, useState } from "react";
import { Edit, Plus, Search, Trash2 } from "lucide-react";
import { getUploadUrl } from "../../utils/imageUrl.js";
import classes from "./ProductPanel.module.css";

export default function ProductPanel({
  products,
  categories = [],
  onAdd,
  onEdit,
  onDelete,
  deletingId,
}) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState(null);

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    return products.filter((product) => {
      const matchesCategory =
        activeCategory === null ||
        (product.categorie_ids || [])
          .map(Number)
          .includes(Number(activeCategory));

      const matchesSearch =
        !query ||
        product.product_name?.toLowerCase().includes(query) ||
        product.description?.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [products, activeCategory, search]);

  const hasFilters = Boolean(search.trim()) || activeCategory !== null;

  return (
    <div className={classes.panel}>
      <div className={classes.panelHead}>
        <div>
          <h2>Products</h2>
          <p className={classes.count}>
            {filteredProducts.length} of {products.length} shown
          </p>
        </div>
        <button className="btn light" type="button" onClick={onAdd}>
          <Plus size={16} /> Add
        </button>
      </div>

      <div className={classes.filters}>
        <label className={classes.searchBox}>
          <Search size={16} />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </label>

        {categories.length > 0 && (
          <div className={classes.categoryFilters}>
            <button
              type="button"
              className={
                activeCategory === null
                  ? `${classes.filterChip} ${classes.activeChip}`
                  : classes.filterChip
              }
              onClick={() => setActiveCategory(null)}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat.categorie_id}
                type="button"
                className={
                  Number(activeCategory) === Number(cat.categorie_id)
                    ? `${classes.filterChip} ${classes.activeChip}`
                    : classes.filterChip
                }
                onClick={() => setActiveCategory(Number(cat.categorie_id))}
              >
                {cat.categorie_name}
              </button>
            ))}
          </div>
        )}
      </div>

      {products.length === 0 && (
        <p className={classes.empty}>No products yet.</p>
      )}

      {products.length > 0 && filteredProducts.length === 0 && (
        <p className={classes.empty}>
          {hasFilters
            ? "No products match your filters."
            : "No products yet."}
        </p>
      )}

      {filteredProducts.map((product) => (
        <div className={classes.productManageRow} key={product.product_id}>
          <img
            src={getUploadUrl("products", product.image_path)}
            alt={product.product_name}
          />
          <div>
            <h3>{product.product_name}</h3>
            <p>
              ₪{product.product_price} · {product.description}
            </p>
          </div>
          <div className={classes.rowActions}>
            <button type="button" onClick={() => onEdit(product)}>
              <Edit size={16} />
            </button>
            <button
              type="button"
              onClick={() => onDelete(product)}
              disabled={deletingId === product.product_id}
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
