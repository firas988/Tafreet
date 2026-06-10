import { useCallback, useEffect, useMemo, useState } from "react";
import AdminLayout from "../../../components/adminLayout/AdminLayout.jsx";
import OrderDetailModal from "../../../components/orderDetailModal/OrderDetailModal.jsx";
import { getRestaurantOrders } from "../../../api/restaurant.service.js";
import {
  onOrderCreated,
  onOrderUpdated,
  joinWorkersRoom,
} from "../../../socket/socket.js";
import {
  formatOrderDateTime,
  getStatusLabel,
  STATUS_BADGE_CLASS,
} from "../../../utils/orderStatus.js";
import classes from "./OrderHistory.module.css";

const STATUS_OPTIONS = [
  { value: "all", label: "All status" },
  { value: "submitted", label: "New" },
  { value: "processing", label: "Preparing" },
  { value: "completed", label: "Ready" },
  { value: "paid", label: "Paid" },
];

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("paid");
  const [selectedOrder, setSelectedOrder] = useState(null);

  const loadOrders = useCallback(async () => {
    setPageError("");

    try {
      const result = await getRestaurantOrders();
      if (!result.success) {
        setPageError(result.message || "Failed to load order history");
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

    const refresh = () => loadOrders();
    const unsubscribeCreated = onOrderCreated(refresh);
    const unsubscribeUpdated = onOrderUpdated(refresh);

    return () => {
      unsubscribeCreated();
      unsubscribeUpdated();
    };
  }, [loadOrders]);

  const filteredOrders = useMemo(() => {
    const query = search.trim().toLowerCase();

    return orders.filter((order) => {
      const matchesStatus =
        statusFilter === "all" || order.status === statusFilter;

      const matchesSearch =
        !query ||
        String(order.order_id).includes(query) ||
        order.user_name?.toLowerCase().includes(query) ||
        String(order.table_number).includes(query);

      return matchesStatus && matchesSearch;
    });
  }, [orders, search, statusFilter]);

  const totalRevenue = useMemo(() => {
    return filteredOrders.reduce(
      (sum, order) => sum + Number(order.total || 0),
      0,
    );
  }, [filteredOrders]);

  return (
    <AdminLayout title="Admin Panel" subtitle="Reports">
      <div className={classes.pageTitle}>
        <div>
          <h1>Order History</h1>
          <p>Search and review previous restaurant orders.</p>
        </div>
        <div className={classes.summaryPill}>
          <span>{filteredOrders.length} orders</span>
          <b>₪{totalRevenue.toFixed(2)}</b>
        </div>
      </div>

      {pageError && <p className={classes.error}>{pageError}</p>}

      <section className={classes.panel}>
        <div className={classes.historyHeader}>
          <input
            placeholder="Search by customer, table or order id..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            {STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {loading && <p className={classes.empty}>Loading order history...</p>}

        {!loading && filteredOrders.length === 0 && (
          <p className={classes.empty}>No orders match your filters.</p>
        )}

        {!loading && filteredOrders.length > 0 && (
          <div className={classes.tableWrap}>
            <table className={classes.historyTable}>
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Customer</th>
                  <th>Table</th>
                  <th>Status</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr
                    key={order.order_id}
                    className={classes.clickableRow}
                    onClick={() => setSelectedOrder(order)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setSelectedOrder(order);
                      }
                    }}
                    tabIndex={0}
                    role="button"
                    aria-label={`View details for order ${order.order_id}`}
                  >
                    <td>
                      <strong>#{order.order_id}</strong>
                    </td>
                    <td>{order.user_name}</td>
                    <td>Table {order.table_number}</td>
                    <td>
                      <span
                        className={`status ${STATUS_BADGE_CLASS[order.status] || "new"}`}
                      >
                        {getStatusLabel(order.status)}
                      </span>
                    </td>
                    <td>{order.items_count || 0}</td>
                    <td>
                      <b>₪{Number(order.total).toFixed(2)}</b>
                    </td>
                    <td>{formatOrderDateTime(order.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </AdminLayout>
  );
}
