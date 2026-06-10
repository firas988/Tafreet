import { useCallback, useEffect, useMemo, useState } from "react";
import AdminLayout from "../../../components/adminLayout/AdminLayout.jsx";
import OrderCard from "../../../components/orderCard/OrderCard.jsx";
import {
  getRestaurantOrders,
  updateRestaurantOrderStatus,
} from "../../../api/restaurant.service.js";
import {
  joinWorkersRoom,
  onOrderCreated,
  onOrderUpdated,
} from "../../../socket/socket.js";
import {
  NEXT_ORDER_STATUS,
  ORDER_STATUS_COLUMNS,
} from "../../../utils/orderStatus.js";
import classes from "./AdminOrders.module.css";

const columns = ["New", "Preparing", "Ready"];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  const loadOrders = useCallback(async () => {
    setPageError("");

    try {
      const result = await getRestaurantOrders();
      if (!result.success) {
        setPageError(result.message || "Failed to load orders");
        return;
      }

      const activeOrders = (result.orders || []).filter(
        (order) => order.status !== "paid",
      );
      setOrders(activeOrders);
    } catch (err) {
      setPageError(err.response?.data?.message || "Could not load orders");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOrders();
    joinWorkersRoom();

    const handleOrderEvent = (order) => {
      setOrders((prev) => {
        if (order.status === "paid") {
          return prev.filter((item) => item.order_id !== order.order_id);
        }

        const exists = prev.some((item) => item.order_id === order.order_id);
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
  }, [loadOrders]);

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
        setOrders((prev) => {
          if (result.order.status === "paid") {
            return prev.filter(
              (item) => item.order_id !== result.order.order_id,
            );
          }

          return prev.map((item) =>
            item.order_id === result.order.order_id ? result.order : item,
          );
        });
      } else {
        await loadOrders();
      }
    } catch (err) {
      setPageError(err.response?.data?.message || "Could not update order");
    } finally {
      setUpdatingId(null);
    }
  };

  const ordersByColumn = useMemo(() => {
    return columns.reduce((acc, column) => {
      acc[column] = orders.filter(
        (order) => ORDER_STATUS_COLUMNS[order.status] === column,
      );
      return acc;
    }, {});
  }, [orders]);

  const totalActive = orders.length;

  return (
    <AdminLayout title="Admin Panel" subtitle="Live orders">
      <div className={classes.pageTitle}>
        <div>
          <h1>Live Orders</h1>
          <p>Monitor and manage incoming customer orders in real time.</p>
        </div>
        <span className={classes.liveBadge}>{totalActive} active</span>
      </div>

      {pageError && <p className={classes.error}>{pageError}</p>}
      {loading && <p className={classes.empty}>Loading orders...</p>}

      <div className={classes.kanban}>
        {columns.map((status) => (
          <section className={classes.kanbanCol} key={status}>
            <h2>
              {status}{" "}
              <span className={classes.count}>
                {ordersByColumn[status]?.length || 0}
              </span>
            </h2>
            {!loading && ordersByColumn[status]?.length === 0 && (
              <p className={classes.emptyCol}>No orders</p>
            )}
            {ordersByColumn[status]?.map((order) => (
              <OrderCard
                key={order.order_id}
                order={order}
                worker
                updating={updatingId === order.order_id}
                onAdvanceStatus={handleAdvanceStatus}
              />
            ))}
          </section>
        ))}
      </div>
    </AdminLayout>
  );
}
