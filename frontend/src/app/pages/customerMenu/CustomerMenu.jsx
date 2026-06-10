import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ClipboardList, Search, ShoppingBag } from "lucide-react";
import ProductCard from "../../../components/productCard/ProductCard.jsx";
import { getPublicMenu } from "../../../api/menu.service.js";
import { getActiveTableOrders } from "../../../api/order.service.js";
import { useCart } from "../../../context/CartContext.jsx";
import {
  joinTableRoom,
  onOrderCreated,
  onOrderUpdated,
} from "../../../socket/socket.js";
import { getUploadUrl } from "../../../utils/imageUrl.js";
import { getStatusLabel } from "../../../utils/orderStatus.js";
import { upsertActiveOrder } from "../../../utils/activeOrders.js";
import { saveTableOrders } from "../../../utils/tableOrderStorage.js";
import classes from "./CustomerMenu.module.css";

export default function CustomerMenu() {
  const { tableNumber = "1" } = useParams();
  const { cartCount, initTable, addToCart } = useCart();
  const [restaurant, setRestaurant] = useState({ restaurant_name: "", image_path: "" });
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeOrders, setActiveOrders] = useState([]);

  useEffect(() => {
    initTable(Number(tableNumber));
  }, [tableNumber, initTable]);

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

  useEffect(() => {
    const loadActiveOrders = async () => {
      try {
        const result = await getActiveTableOrders(tableNumber);
        if (result.success) {
          const orders = result.orders || [];
          setActiveOrders(orders);
          saveTableOrders(tableNumber, orders);
          return;
        }

        setActiveOrders([]);
      } catch {
        setActiveOrders([]);
      }
    };

    loadActiveOrders();
    joinTableRoom(tableNumber);

    const handleOrderEvent = (order) => {
      if (Number(order.table_number) !== Number(tableNumber)) return;

      setActiveOrders((prev) => {
        const next = upsertActiveOrder(prev, order);
        saveTableOrders(tableNumber, next);
        return next;
      });
    };

    const unsubscribeCreated = onOrderCreated(handleOrderEvent);
    const unsubscribeUpdated = onOrderUpdated(handleOrderEvent);

    return () => {
      unsubscribeCreated();
      unsubscribeUpdated();
    };
  }, [tableNumber]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const categoryIds = (product.categorie_ids || []).map(Number);
      const matchesCategory =
        activeCategory === null ||
        categoryIds.includes(Number(activeCategory));

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

  const heroImageUrl = getUploadUrl("profile", restaurant.image_path);

  return (
    <div className={classes.customerPage}>
      <div className={classes.heroSection}>
      <header
        className={
          heroImageUrl
            ? `${classes.hero} ${classes.heroWithImage}`
            : classes.hero
        }
      >
        {heroImageUrl && (
          <img
            className={classes.heroImage}
            src={heroImageUrl}
            alt=""
            aria-hidden="true"
          />
        )}
        <div className={classes.heroOverlay} aria-hidden="true" />
        <div className={classes.heroInner}>
          <div>
            <span className="pill">Table {tableNumber}</span>
            <h1>{restaurant.restaurant_name || "Menu"}</h1>
            <p>Order directly from your table</p>
          </div>
          <Link
            to={`/cart?table=${tableNumber}`}
            className={classes.cartBubble}
          >
            <ShoppingBag size={22} />
            <b>{cartCount}</b>
          </Link>
        </div>
      </header>

      <div className={classes.searchBox}>
        <Search size={18} />
        <input
          placeholder="Search for pizza, drink, burger..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      </div>

      {activeOrders.length > 0 && (
        <section className={classes.activeOrdersSection}>
          <div className={classes.activeOrdersHead}>
            <h3>Active orders</h3>
            <span>{activeOrders.length} in progress</span>
          </div>
          <div className={classes.activeOrdersList}>
            {activeOrders.map((order) => (
              <Link
                key={order.order_id}
                to={`/status/${order.order_id}?table=${tableNumber}`}
                className={classes.activeOrderBanner}
              >
                <ClipboardList size={20} />
                <div>
                  <strong>Order #{order.order_id}</strong>
                  <span>
                    {order.user_name} · {getStatusLabel(order.status)} · ₪
                    {Number(order.total).toFixed(2)}
                  </span>
                </div>
                <span className={classes.trackLink}>Track</span>
              </Link>
            ))}
          </div>
        </section>
      )}

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
                  Number(activeCategory) === Number(cat.categorie_id)
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
                <ProductCard
                  key={product.id}
                  product={product}
                  onAdd={addToCart}
                />
              ))}
            </section>
          )}
        </>
      )}
    </div>
  );
}
