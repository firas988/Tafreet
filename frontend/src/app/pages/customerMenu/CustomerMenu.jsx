import { Link } from "react-router-dom";
import { Search, ShoppingBag } from "lucide-react";
import ProductCard from "../../../components/productCard/ProductCard.jsx";
import classes from "./CustomerMenu.module.css";

export default function CustomerMenu() {
  const restaurant = { name: "", tagline: "", tableNumber: "" };
  const categories = [];
  const products = [];
  return (
    <div className={classes.customerPage}>
      <header className={classes.hero}>
        <div>
          <span className="pill">Table {restaurant.tableNumber}</span>
          <h1>{restaurant.name}</h1>
          <p>{restaurant.tagline}</p>
        </div>
        <Link to="/cart" className={classes.cartBubble}>
          <ShoppingBag size={22} />
          <b>3</b>
        </Link>
      </header>

      <div className={classes.searchBox}>
        <Search size={18} />
        <input placeholder="Search for pizza, drink, burger..." />
      </div>

      <section className={classes.categoryRail}>
        {categories.map((cat) => (
          <button key={cat.id} className={classes.categoryChip} type="button">
            <span>{cat.emoji}</span>
            {cat.name}
          </button>
        ))}
      </section>

      <section className={classes.sectionHead}>
        <div>
          <h2>Popular dishes</h2>
          <p>Freshly selected by the chef</p>
        </div>
      </section>

      <section className={classes.productGrid}>
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </section>
    </div>
  );
}
