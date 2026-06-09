import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import AdminLayout from "../../../components/adminLayout/AdminLayout.jsx";
import CategoryPanel from "../../../components/categoryPanel/CategoryPanel.jsx";
import ProductPanel from "../../../components/productPanel/ProductPanel.jsx";
import AddCategoryForm from "../../../components/addCategoryForm/AddCategoryForm.jsx";
import AddProductForm from "../../../components/addProductForm/AddProductForm.jsx";
import ConfirmDialog from "../../../components/confirmDialog/ConfirmDialog.jsx";
import {
  addCategory,
  addProduct,
  deleteCategory,
  deleteProduct,
  getCategories,
  getProducts,
  updateCategory,
  updateProduct,
} from "../../../api/restaurant.service.js";
import classes from "./MenuManagement.module.css";

export default function MenuManagement() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deletingCategoryId, setDeletingCategoryId] = useState(null);
  const [deletingProductId, setDeletingProductId] = useState(null);
  const [pageError, setPageError] = useState("");
  const [formError, setFormError] = useState("");
  const [categoryForm, setCategoryForm] = useState(null);
  const [productForm, setProductForm] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteError, setDeleteError] = useState("");

  const loadMenu = async () => {
    setLoading(true);
    setPageError("");

    try {
      const [categoriesRes, productsRes] = await Promise.all([
        getCategories(),
        getProducts(),
      ]);

      if (!categoriesRes.success || !productsRes.success) {
        setPageError(
          categoriesRes.message ||
            productsRes.message ||
            "Failed to load menu data",
        );
        return;
      }

      setCategories(categoriesRes.categories || []);
      setProducts(productsRes.products || []);
    } catch (err) {
      setPageError(err.response?.data?.message || "Could not load menu data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMenu();
  }, []);

  const closeCategoryForm = () => {
    setCategoryForm(null);
    setFormError("");
  };

  const closeProductForm = () => {
    setProductForm(null);
    setFormError("");
  };

  const handleSaveCategory = async (formData) => {
    setSubmitting(true);
    setFormError("");

    try {
      const result =
        categoryForm === "new"
          ? await addCategory(formData)
          : await updateCategory(categoryForm.categorie_id, formData);

      if (!result.success) {
        setFormError(result.message || "Failed to save category");
        return;
      }

      closeCategoryForm();
      await loadMenu();
    } catch (err) {
      setFormError(err.response?.data?.message || "Could not save category");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSaveProduct = async (formData) => {
    setSubmitting(true);
    setFormError("");

    try {
      const result =
        productForm === "new"
          ? await addProduct(formData)
          : await updateProduct(productForm.product_id, formData);

      if (!result.success) {
        setFormError(result.message || "Failed to save product");
        return;
      }

      closeProductForm();
      await loadMenu();
    } catch (err) {
      setFormError(err.response?.data?.message || "Could not save product");
    } finally {
      setSubmitting(false);
    }
  };

  const openDeleteCategory = (category) => {
    setDeleteError("");
    setDeleteTarget({ type: "category", item: category });
  };

  const openDeleteProduct = (product) => {
    setDeleteError("");
    setDeleteTarget({ type: "product", item: product });
  };

  const getProductsUsingCategory = (categorieId) =>
    products.filter((product) =>
      (product.categorie_ids || [])
        .map(Number)
        .includes(Number(categorieId)),
    );

  const formatProductList = (items) => {
    if (items.length <= 3) {
      return items.map((product) => product.product_name).join(", ");
    }

    const shown = items
      .slice(0, 3)
      .map((product) => product.product_name)
      .join(", ");
    return `${shown}, and ${items.length - 3} more`;
  };

  const closeDeleteDialog = () => {
    if (deletingCategoryId || deletingProductId) return;
    setDeleteTarget(null);
    setDeleteError("");
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    setDeleteError("");

    if (deleteTarget.type === "category") {
      const category = deleteTarget.item;
      setDeletingCategoryId(category.categorie_id);

      try {
        const result = await deleteCategory(category.categorie_id);
        if (!result.success) {
          setDeleteError(result.message || "Failed to delete category");
          return;
        }
        setDeleteTarget(null);
        await loadMenu();
      } catch (err) {
        setDeleteError(
          err.response?.data?.message || "Could not delete category",
        );
      } finally {
        setDeletingCategoryId(null);
      }
      return;
    }

    const product = deleteTarget.item;
    setDeletingProductId(product.product_id);

    try {
      const result = await deleteProduct(product.product_id);
      if (!result.success) {
        setDeleteError(result.message || "Failed to delete product");
        return;
      }
      setDeleteTarget(null);
      await loadMenu();
    } catch (err) {
      setDeleteError(err.response?.data?.message || "Could not delete product");
    } finally {
      setDeletingProductId(null);
    }
  };

  const categoryDeleteProducts =
    deleteTarget?.type === "category"
      ? getProductsUsingCategory(deleteTarget.item.categorie_id)
      : [];
  const categoryDeleteBlocked = categoryDeleteProducts.length > 0;

  return (
    <AdminLayout title="Admin Panel" subtitle="Menu manager">
      <div className={classes.pageTitle}>
        <div>
          <h1>Manage Menu</h1>
          <p>Add, edit and remove categories or products.</p>
        </div>
        <div className={classes.pageActions}>
          <button
            className="btn light"
            type="button"
            onClick={() => setCategoryForm("new")}
          >
            <Plus size={18} /> Add Category
          </button>
          <button
            className="btn"
            type="button"
            onClick={() => setProductForm("new")}
          >
            <Plus size={18} /> Add Product
          </button>
        </div>
      </div>

      {pageError && <p className={classes.error}>{pageError}</p>}
      {loading && <p className={classes.empty}>Loading menu...</p>}

      {!loading && (
        <section className={classes.managementGrid}>
          <CategoryPanel
            categories={categories}
            onAdd={() => setCategoryForm("new")}
            onEdit={(cat) => setCategoryForm(cat)}
            onDelete={openDeleteCategory}
            deletingId={deletingCategoryId}
          />
          <ProductPanel
            products={products}
            categories={categories}
            onAdd={() => setProductForm("new")}
            onEdit={(product) => setProductForm(product)}
            onDelete={openDeleteProduct}
            deletingId={deletingProductId}
          />
        </section>
      )}

      {categoryForm && (
        <AddCategoryForm
          category={categoryForm === "new" ? null : categoryForm}
          onSubmit={handleSaveCategory}
          onClose={closeCategoryForm}
          loading={submitting}
          error={formError}
        />
      )}

      {productForm && (
        <AddProductForm
          product={productForm === "new" ? null : productForm}
          categories={categories}
          onSubmit={handleSaveProduct}
          onClose={closeProductForm}
          loading={submitting}
          error={formError}
        />
      )}

      {deleteTarget && (
        <ConfirmDialog
          title={
            deleteTarget.type === "category"
              ? categoryDeleteBlocked
                ? "Category in use"
                : "Delete category?"
              : "Delete product?"
          }
          message={
            deleteTarget.type === "category"
              ? categoryDeleteBlocked
                ? "This category cannot be deleted while products are still assigned to it."
                : "This category will be removed from your menu."
              : "This product will be removed from your menu."
          }
          itemName={
            deleteTarget.type === "category"
              ? deleteTarget.item.categorie_name
              : deleteTarget.item.product_name
          }
          warning={
            deleteTarget.type === "category"
              ? categoryDeleteBlocked
                ? `${categoryDeleteProducts.length} product(s) use this category: ${formatProductList(categoryDeleteProducts)}. Edit those products and remove this category first.`
                : "This category is not used by any products."
              : "This action cannot be undone."
          }
          confirmDisabled={categoryDeleteBlocked}
          loading={Boolean(deletingCategoryId || deletingProductId)}
          error={deleteError}
          onConfirm={handleConfirmDelete}
          onClose={closeDeleteDialog}
        />
      )}
    </AdminLayout>
  );
}
