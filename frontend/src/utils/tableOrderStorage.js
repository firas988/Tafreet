const storageKey = (tableNumber) => `tafreet_table_orders_${tableNumber}`;

const toStoredOrder = (order) => ({
  orderId: order.order_id,
  tableNumber: Number(order.table_number),
  isCash: Number(order.is_cash) === 1,
  status: order.status,
  userName: order.user_name || "",
});

export function saveTableOrders(tableNumber, orders = []) {
  if (!tableNumber) return;

  sessionStorage.setItem(
    storageKey(tableNumber),
    JSON.stringify(orders.map(toStoredOrder)),
  );
}

export function upsertTableOrder(tableNumber, order) {
  if (!tableNumber || !order?.order_id) return;

  const current = getStoredTableOrders(tableNumber);
  const without = current.filter((item) => item.orderId !== order.order_id);

  if (order.status === "paid") {
    saveTableOrders(tableNumber, without);
    return;
  }

  saveTableOrders(tableNumber, [toStoredOrder(order), ...without]);
}

export function getStoredTableOrders(tableNumber) {
  const raw = sessionStorage.getItem(storageKey(tableNumber));
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : parsed?.orderId ? [parsed] : [];
  } catch {
    return [];
  }
}

export function getStoredTableOrder(tableNumber) {
  const orders = getStoredTableOrders(tableNumber);
  return orders[0] || null;
}

export function clearTableOrders(tableNumber) {
  sessionStorage.removeItem(storageKey(tableNumber));
}

export function clearTableOrder(tableNumber) {
  clearTableOrders(tableNumber);
}
