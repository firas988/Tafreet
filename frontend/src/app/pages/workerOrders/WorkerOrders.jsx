import { useCallback, useEffect, useMemo, useState } from "react";
import AdminLayout from "../../../components/adminLayout/AdminLayout.jsx";
import OrderCard from "../../../components/orderCard/OrderCard.jsx";
import {
  getWorkerOrders,
  updateWorkerOrderStatus,
} from "../../../api/worker.service.js";
import {
  joinWorkersRoom,
  onOrderCreated,
  onOrderUpdated,
} from "../../../socket/socket.js";
import {
  NEXT_ORDER_STATUS,
  ORDER_STATUS_COLUMNS,
} from "../../../utils/orderStatus.js";
import classes from "./WorkerOrders.module.css";

const columns = ["New", "Preparing", "Ready"];

export default function WorkerOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  const loadOrders = useCallback(async () => {
    setPageError("");

    try {
      const result = await getWorkerOrders();
      if (!result.success) {
        setPageError(result.message || "Failed to load orders");
        return;
      }

      setOrders(result.orders || []);
    } catch (err) {
      setPageError(err.response?.data?.message || "Could not load orders");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOrders();
    joinWorkersRoom();

    const unsubscribeCreated = onOrderCreated((order) => {
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
    });

    const unsubscribeUpdated = onOrderUpdated((order) => {
      setOrders((prev) => {
        if (order.status === "paid") {
          return prev.filter((item) => item.order_id !== order.order_id);
        }

        const exists = prev.some((item) => item.order_id === order.order_id);
        if (!exists) {
          return [order, ...prev];
        }

        return prev.map((item) =>
          item.order_id === order.order_id ? order : item,
        );
      });
    });

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
      const result = await updateWorkerOrderStatus(order.order_id, nextStatus);
      if (!result.success) {
        setPageError(result.message || "Failed to update order");
        return;
      }

      if (result.order) {
        setOrders((prev) => {
          if (result.order.status === "paid") {
            return prev.filter((item) => item.order_id !== result.order.order_id);
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

  return (
    <AdminLayout
      title="Worker Panel"
      subtitle="Kitchen live queue"
      variant="worker"
    >
      <div className={classes.pageTitle}>
        <div>
          <h1>Kitchen Orders</h1>
          <p>Accept, prepare and complete customer orders in real time.</p>
        </div>
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
