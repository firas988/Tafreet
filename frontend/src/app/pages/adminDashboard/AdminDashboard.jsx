import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  DollarSign,
  ListOrdered,
  Package,
  Table2,
  Users,
} from "lucide-react";
import AdminLayout from "../../../components/adminLayout/AdminLayout.jsx";
import OrderCard from "../../../components/orderCard/OrderCard.jsx";
import {
  getProducts,
  getRestaurantOrders,
  getRestaurantProfile,
  getTables,
  getWorkers,
  updateRestaurantOrderStatus,
} from "../../../api/restaurant.service.js";
import {
  joinWorkersRoom,
  onOrderCreated,
  onOrderUpdated,
} from "../../../socket/socket.js";
import {
  isOrderToday,
  NEXT_ORDER_STATUS,
  ORDER_STATUS_COLUMNS,
} from "../../../utils/orderStatus.js";
import classes from "./AdminDashboard.module.css";

const pipelineSteps = ["New", "Preparing", "Ready"];

export default function AdminDashboard() {
  const [restaurantName, setRestaurantName] = useState("Restaurant");
  const [orders, setOrders] = useState([]);
  const [productCount, setProductCount] = useState(0);
  const [staffCount, setStaffCount] = useState(0);
  const [tableCount, setTableCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  const loadDashboard = useCallback(async () => {
    setPageError("");

    try {
      const [profileRes, ordersRes, productsRes, workersRes, tablesRes] =
        await Promise.all([
          getRestaurantProfile(),
          getRestaurantOrders(),
          getProducts(),
          getWorkers(),
          getTables(),
        ]);

      if (profileRes.success && profileRes.restaurant?.restaurant_name) {
        setRestaurantName(profileRes.restaurant.restaurant_name);
      }

      if (!ordersRes.success) {
        setPageError(ordersRes.message || "Failed to load orders");
        return;
      }

      setOrders(ordersRes.orders || []);
      setProductCount(
        productsRes.success ? (productsRes.products || []).length : 0,
      );
      setStaffCount(workersRes.success ? (workersRes.workers || []).length : 0);
      setTableCount(tablesRes.success ? (tablesRes.tables || []).length : 0);
    } catch (err) {
      setPageError(err.response?.data?.message || "Could not load dashboard");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
    joinWorkersRoom();

    const handleOrderEvent = (order) => {
      setOrders((prev) => {
        const exists = prev.some((item) => item.order_id === order.order_id);

        if (order.status === "paid") {
          if (!exists) return prev;
          return prev.map((item) =>
            item.order_id === order.order_id ? order : item,
          );
        }

        if (exists) {
          return prev.map((item) =>
            item.order_id === order.order_id ? order : item,
          );
        }

        return [order, ...prev];
      });
    };

    const unsubscribeCreated = onOrderCreated(handleOrderEvent);
    const unsubscribeUpdated = onOrderUpdated(handleOrderEvent);

    return () => {
      unsubscribeCreated();
      unsubscribeUpdated();
    };
  }, [loadDashboard]);

  const activeOrders = useMemo(
    () => orders.filter((order) => order.status !== "paid"),
    [orders],
  );

  const todayOrders = useMemo(
    () => orders.filter((order) => isOrderToday(order.created_at)),
    [orders],
  );

  const todayRevenue = useMemo(() => {
    return todayOrders
      .filter((order) => order.status === "paid")
      .reduce((sum, order) => sum + Number(order.total || 0), 0);
  }, [todayOrders]);

  const pipelineCounts = useMemo(() => {
    return pipelineSteps.reduce((acc, step) => {
      acc[step] = activeOrders.filter(
        (order) => ORDER_STATUS_COLUMNS[order.status] === step,
      ).length;
      return acc;
    }, {});
  }, [activeOrders]);

  const handleAdvanceStatus = async (order) => {
    const nextStatus = NEXT_ORDER_STATUS[order.status];
    if (!nextStatus) return;

    setUpdatingId(order.order_id);
    setPageError("");

    try {
      const result = await updateRestaurantOrderStatus(
        order.order_id,
        nextStatus,
      );
      if (!result.success) {
        setPageError(result.message || "Failed to update order");
        return;
      }

      if (result.order) {
        setOrders((prev) =>
          prev.map((item) =>
            item.order_id === result.order.order_id ? result.order : item,
          ),
        );
      } else {
        await loadDashboard();
      }
    } catch (err) {
      setPageError(err.response?.data?.message || "Could not update order");
    } finally {
      setUpdatingId(null);
    }
  };

  const livePreview = activeOrders.slice(0, 6);

  return (
    <AdminLayout title="Admin Panel" subtitle={restaurantName}>
      <div className={classes.pageTitle}>
        <div>
          <h1>Dashboard</h1>
          <p>Live restaurant overview and order queue.</p>
        </div>
        <Link to="/admin/orders" className={classes.viewAllLink}>
          View all orders <ArrowRight size={16} />
        </Link>
      </div>

      {pageError && <p className={classes.error}>{pageError}</p>}
      {loading && <p className={classes.empty}>Loading dashboard...</p>}

      {!loading && (
        <>
          <section className={classes.statsGrid}>
            <div className={`${classes.statCard} ${classes.statOrders}`}>
              <ListOrdered size={22} />
              <span>Today&apos;s orders</span>
              <b>{todayOrders.length}</b>
              <small>{activeOrders.length} active now</small>
            </div>
            <div className={`${classes.statCard} ${classes.statRevenue}`}>
              <DollarSign size={22} />
              <span>Today&apos;s revenue</span>
              <b>₪{todayRevenue.toFixed(2)}</b>
              <small>Paid orders only</small>
            </div>
            <div className={classes.statCard}>
              <Package size={22} />
              <span>Menu products</span>
              <b>{productCount}</b>
              <Link to="/admin/menu" className={classes.statLink}>
                Manage menu
              </Link>
            </div>
            <div className={classes.statCard}>
              <Users size={22} />
              <span>Staff members</span>
              <b>{staffCount}</b>
              <Link to="/admin/staff" className={classes.statLink}>
                Manage staff
              </Link>
            </div>
          </section>

          <section className={classes.pipeline}>
            {pipelineSteps.map((step) => (
              <div key={step} className={classes.pipelineStep}>
                <span>{step}</span>
                <b>{pipelineCounts[step] || 0}</b>
              </div>
            ))}
            <div className={classes.pipelineStep}>
              <Table2 size={16} />
              <span>Tables</span>
              <b>{tableCount}</b>
            </div>
          </section>

          <section className={classes.sectionHead}>
            <div>
              <h2>Live Orders</h2>
              <p>Latest orders from QR tables — update status here or in Orders</p>
            </div>
            <span className={classes.liveDot}>Live</span>
          </section>

          {livePreview.length === 0 ? (
            <p className={classes.emptyOrders}>
              No active orders right now. New orders will appear here automatically.
            </p>
          ) : (
            <div className={classes.ordersGrid}>
              {livePreview.map((order) => (
                <OrderCard
                  key={order.order_id}
                  order={order}
                  worker
                  updating={updatingId === order.order_id}
                  onAdvanceStatus={handleAdvanceStatus}
                />
              ))}
            </div>
          )}
        </>
      )}
    </AdminLayout>
  );
}
