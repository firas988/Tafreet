import AdminLayout from "../components/AdminLayout.jsx";
import { categories, products } from "../data.js";
import { Edit, Plus, Trash2 } from "lucide-react";

export default function MenuManagement() {
  return (
    <AdminLayout title="Admin Panel" subtitle="Menu manager">
      <div className="pageTitle">
        <div>
          <h1>Manage Menu</h1>
          <p>Add, edit and remove categories or products.</p>
        </div>
        <button className="btn"><Plus size={18} /> Add Product</button>
      </div>

      <section className="managementGrid">
        <div className="panel">
          <h2>Categories</h2>
          {categories.map((cat) => (
            <div className="tableRow" key={cat.id}>
              <span>{cat.emoji} {cat.name}</span>
              <div className="rowActions">
                <button><Edit size={16} /></button>
                <button><Trash2 size={16} /></button>
              </div>
            </div>
          ))}
        </div>

        <div className="panel">
          <h2>Products</h2>
          {products.map((product) => (
            <div className="productManageRow" key={product.id}>
              <img src={product.image} alt={product.name} />
              <div>
                <h3>{product.name}</h3>
                <p>₪{product.price} · {product.description}</p>
              </div>
              <div className="rowActions">
                <button><Edit size={16} /></button>
                <button><Trash2 size={16} /></button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </AdminLayout>
  );
}
