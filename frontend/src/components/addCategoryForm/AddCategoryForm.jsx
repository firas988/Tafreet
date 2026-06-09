import { useEffect, useState } from "react";

import { FolderPlus, ImageUp, X } from "lucide-react";

import { getUploadUrl } from "../../utils/imageUrl.js";

import modal from "../modal/modal.shared.module.css";

export default function AddCategoryForm({
  onSubmit,

  onClose,

  loading,

  error,

  category = null,
}) {
  const isEdit = Boolean(category);

  const [name, setName] = useState(category?.categorie_name || "");

  const [image, setImage] = useState(null);

  const [preview, setPreview] = useState(
    category ? getUploadUrl("categories", category.image_path) : "",
  );

  useEffect(() => {
    return () => {
      if (preview && preview.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setImage(file);

    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!isEdit && !image) return;

    const formData = new FormData();

    formData.append("categorie_name", name.trim());

    if (image) formData.append("image", image);

    onSubmit(formData);
  };

  return (
    <div className={modal.overlay} onClick={onClose}>
      <form
        className={modal.modal}
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={modal.header}>
          <div className={modal.headerIcon}>
            <FolderPlus size={22} />
          </div>

          <div>
            <span className="pill">{isEdit ? "Edit" : "New"} Category</span>

            <h2>{isEdit ? "Update Category" : "Add Category"}</h2>

            <p>Upload a clear image so customers can browse easily.</p>
          </div>

          <button className={modal.closeBtn} type="button" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className={modal.body}>
          {error && <p className={modal.error}>{error}</p>}

          <label className={modal.field}>
            <span>Category name</span>

            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Pizza, Burgers, Drinks..."
              required
            />
          </label>

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
              alt="Category preview"
            />
          )}
        </div>

        <div className={modal.footer}>
          <div className={modal.actions}>
            <button className="btn light" type="button" onClick={onClose}>
              Cancel
            </button>

            <button className="btn" type="submit" disabled={loading}>
              {loading ? "Saving..." : isEdit ? "Save Changes" : "Add Category"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
