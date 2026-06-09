import { useEffect, useState } from "react";
import { ImageUp, UtensilsCrossed, X } from "lucide-react";
import { getUploadUrl } from "../../utils/imageUrl.js";
import modal from "../modal/modal.shared.module.css";
import classes from "./AddProductForm.module.css";

export default function AddProductForm({
  onSubmit,
  onClose,
  loading,
  error,
  categories = [],
  product = null,
}) {
  const isEdit = Boolean(product);
  const [form, setForm] = useState({
    product_name: product?.product_name || "",
    product_price: product?.product_price || "",
    description: product?.description || "",
    categorie_ids: (product?.categorie_ids || []).map(Number),
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(
    product ? getUploadUrl("products", product.image_path) : "",
  );
  const [categoryError, setCategoryError] = useState("");

  useEffect(() => {
    return () => {
      if (preview && preview.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const toggleCategory = (categorieId) => {
    const id = Number(categorieId);

    setForm((prev) => {
      const exists = prev.categorie_ids.includes(id);
      const categorie_ids = exists
        ? prev.categorie_ids.filter((item) => item !== id)
        : [...prev.categorie_ids, id];

      if (categorie_ids.length > 0) {
        setCategoryError("");
      }

      return { ...prev, categorie_ids };
    });
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!isEdit && !image) return;

    if (form.categorie_ids.length === 0) {
      setCategoryError("Select at least one category");
      return;
    }

    setCategoryError("");

    const formData = new FormData();
    formData.append("product_name", form.product_name.trim());
    formData.append("product_price", form.product_price);
    formData.append("description", form.description.trim());
    formData.append("categorie_ids", JSON.stringify(form.categorie_ids));
    if (image) formData.append("image", image);
    onSubmit(formData);
  };

  const displayError = categoryError || error;

  return (
    <div className={modal.overlay} onClick={onClose}>
      <form
        className={modal.modal}
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={modal.header}>
          <div className={modal.headerIcon}>
            <UtensilsCrossed size={22} />
          </div>
          <div>
            <span className="pill">{isEdit ? "Edit" : "New"} Product</span>
            <h2>{isEdit ? "Update Product" : "Add Product"}</h2>
            <p>Add details, categories, and a photo for the menu.</p>
          </div>
          <button className={modal.closeBtn} type="button" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className={modal.body}>
          {displayError && !categoryError && (
            <p className={modal.error}>{displayError}</p>
          )}

          <label className={modal.field}>
            <span>Product name</span>
            <input
              name="product_name"
              value={form.product_name}
              onChange={handleChange}
              placeholder="Margherita Pizza"
              required
            />
          </label>

          <label className={modal.field}>
            <span>Price (₪)</span>
            <input
              name="product_price"
              type="number"
              min="0"
              step="0.01"
              value={form.product_price}
              onChange={handleChange}
              placeholder="0.00"
              required
            />
          </label>

          <label className={modal.field}>
            <span>Description</span>
            <input
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Fresh ingredients, classic recipe..."
              required
            />
          </label>

          <div
            className={
              categoryError
                ? `${modal.field} ${classes.categoryFieldInvalid}`
                : modal.field
            }
          >
            <span>
              Categories <small className={classes.required}>(required)</small>
            </span>
            <div className={classes.categoryList}>
              {categories.length === 0 && (
                <p className={classes.empty}>Add a category first.</p>
              )}
              {categories.map((cat) => (
                <label key={cat.categorie_id} className={classes.categoryChip}>
                  <input
                    type="checkbox"
                    checked={form.categorie_ids.includes(
                      Number(cat.categorie_id),
                    )}
                    onChange={() => toggleCategory(cat.categorie_id)}
                  />
                  {cat.categorie_name}
                </label>
              ))}
            </div>
            {categoryError && (
              <p className={classes.categoryError}>{categoryError}</p>
            )}
          </div>

          <div className={modal.field}>
            <span>Image {isEdit && "(optional)"}</span>
            <label className={modal.fileDrop}>
              <div className={modal.fileDropContent}>
                <span className={modal.fileDropIcon}>
                  <div className={modal.fileDropIconContent}>
                    <ImageUp size={20} />
                  </div>
                </span>
                <span>Click to choose an image</span>
                {image && <span className={modal.fileName}>{image.name}</span>}
              </div>
              <input
                className={modal.fileInput}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                required={!isEdit}
              />
            </label>
          </div>

          {preview && (
            <img
              className={modal.preview}
              src={preview}
              alt="Product preview"
            />
          )}
        </div>

        <div className={modal.footer}>
          <div className={modal.actions}>
            <button className="btn light" type="button" onClick={onClose}>
              Cancel
            </button>
            <button className="btn" type="submit" disabled={loading}>
              {loading ? "Saving..." : isEdit ? "Save Changes" : "Add Product"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
