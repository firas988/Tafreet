import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Search, ShoppingBag } from "lucide-react";
import ProductCard from "../../../components/productCard/ProductCard.jsx";
import { getPublicMenu } from "../../../api/menu.service.js";
import { getUploadUrl } from "../../../utils/imageUrl.js";
import classes from "./CustomerMenu.module.css";

export default function CustomerMenu() {
  const { tableNumber = "1" } = useParams();
  const [restaurant, setRestaurant] = useState({ name: "", image_path: "" });
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadMenu = async () => {
      setLoading(true);
      setError("");

      try {
        const result = await getPublicMenu(tableNumber);
        if (!result.success) {
          setError(result.message || "Failed to load menu");
          return;
        }

        setRestaurant(result.restaurant || {});
        setCategories(result.categories || []);
        setProducts(result.products || []);
      } catch (err) {
        setError(err.response?.data?.message || "Could not load menu");
      } finally {
        setLoading(false);
      }
    };

    loadMenu();
  }, [tableNumber]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory =
        !activeCategory ||
        product.categorie_ids?.includes(activeCategory);

      const query = search.trim().toLowerCase();
      const matchesSearch =
        !query ||
        product.product_name?.toLowerCase().includes(query) ||
        product.description?.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [products, activeCategory, search]);

  const mappedProducts = filteredProducts.map((product) => ({
    id: product.product_id,
    name: product.product_name,
    price: product.product_price,
    description: product.description,
    image: getUploadUrl("products", product.image_path),
  }));

  return (
    <div className={classes.customerPage}>
      <header
        className={classes.hero}
        style={
          restaurant.image_path
            ? {
                backgroundImage: `linear-gradient(135deg, rgba(32, 20, 13, 0.94), rgba(114, 75, 45, 0.72)), url(${getUploadUrl("profile", restaurant.image_path)})`,
              }
            : undefined
        }
      >
        <div>
          <span className="pill">Table {tableNumber}</span>
          <h1>{restaurant.restaurant_name || "Menu"}</h1>
          <p>Order directly from your table</p>
        </div>
        <Link to="/cart" className={classes.cartBubble}>
          <ShoppingBag size={22} />
          <b>0</b>
        </Link>
      </header>

      <div className={classes.searchBox}>
        <Search size={18} />
        <input
          placeholder="Search for pizza, drink, burger..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {error && <p className={classes.error}>{error}</p>}
      {loading && <p className={classes.empty}>Loading menu...</p>}

      {!loading && !error && (
        <>
          <section className={classes.categoryRail}>
            <button
              className={
                activeCategory === null
                  ? `${classes.categoryChip} ${classes.activeChip}`
                  : classes.categoryChip
              }
              type="button"
              onClick={() => setActiveCategory(null)}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat.categorie_id}
                className={
                  activeCategory === cat.categorie_id
                    ? `${classes.categoryChip} ${classes.activeChip}`
                    : classes.categoryChip
                }
                type="button"
                onClick={() => setActiveCategory(cat.categorie_id)}
              >
                {cat.categorie_name}
              </button>
            ))}
          </section>

          <section className={classes.sectionHead}>
            <div>
              <h2>Menu</h2>
              <p>{filteredProducts.length} items available</p>
            </div>
          </section>

          {mappedProducts.length === 0 ? (
            <p className={classes.empty}>No products found.</p>
          ) : (
            <section className={classes.productGrid}>
              {mappedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </section>
          )}
        </>
      )}
    </div>
  );
}
