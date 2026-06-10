import { isActiveOrderStatus } from "./orderStatus.js";

export function upsertActiveOrder(orders, incoming) {
  const list = Array.isArray(orders) ? [...orders] : [];

  if (!isActiveOrderStatus(incoming.status)) {
    return list.filter((order) => order.order_id !== incoming.order_id);
  }

  const index = list.findIndex((order) => order.order_id === incoming.order_id);

  if (index >= 0) {
    list[index] = incoming;
  } else {
    list.unshift(incoming);
  }

  return list.sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );
}
