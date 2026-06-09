import { Link } from "react-router-dom";
import { Search, ShoppingBag, Star } from "lucide-react";
import { categories, products, restaurant } from "../data.js";

export default function CustomerMenu() {
  return (
    <div className="customerPage">
      <header className="hero">
        <div>
          <span className="pill">Table {restaurant.tableNumber}</span>
          <h1>{restaurant.name}</h1>
          <p>{restaurant.tagline}</p>
        </div>
        <Link to="/cart" className="cartBubble">
          <ShoppingBag size={22} />
          <b>3</b>
        </Link>
      </header>

      <div className="searchBox">
        <Search size={18} />
        <input placeholder="Search for pizza, drink, burger..." />
      </div>

      <section className="categoryRail">
        {categories.map((cat) => (
          <button key={cat.id} className="categoryChip">
            <span>{cat.emoji}</span>
            {cat.name}
          </button>
        ))}
      </section>

      <section className="sectionHead">
        <div>
          <h2>Popular dishes</h2>
          <p>Freshly selected by the chef</p>
        </div>
      </section>

      <section className="productGrid">
        {products.map((product) => (
          <article className="productCard" key={product.id}>
            <img src={product.image} alt={product.name} />
            {product.popular && <span className="floatingBadge"><Star size={13} /> Popular</span>}
            <div className="productInfo">
              <div>
                <h3>{product.name}</h3>
                <p>{product.description}</p>
              </div>
              <div className="priceRow">
                <b>₪{product.price}</b>
                <button className="roundBtn">+</button>
              </div>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
