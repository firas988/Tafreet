import { Plus } from "lucide-react";
import AdminLayout from "../../../components/adminLayout/AdminLayout.jsx";
import CategoryPanel from "../../../components/categoryPanel/CategoryPanel.jsx";
import ProductPanel from "../../../components/productPanel/ProductPanel.jsx";
import classes from "./MenuManagement.module.css";

export default function MenuManagement() {
  const categories = [];
  const products = [];
  return (
    <AdminLayout title="Admin Panel" subtitle="Menu manager">
      <div className={classes.pageTitle}>
        <div>
          <h1>Manage Menu</h1>
          <p>Add, edit and remove categories or products.</p>
        </div>
        <button className="btn" type="button">
          <Plus size={18} /> Add Product
        </button>
      </div>

      <section className={classes.managementGrid}>
        <CategoryPanel categories={categories} />
        <ProductPanel products={products} />
      </section>
    </AdminLayout>
  );
}
