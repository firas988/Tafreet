export const ORDER_STATUS_LABELS = {
  submitted: "New",
  processing: "Preparing",
  completed: "Ready",
  paid: "Paid",
};

export const ORDER_STATUS_COLUMNS = {
  submitted: "New",
  processing: "Preparing",
  completed: "Ready",
};

export const NEXT_ORDER_STATUS = {
  submitted: "processing",
  processing: "completed",
  completed: "paid",
};

export const WORKER_ACTION_LABELS = {
  submitted: "Start preparing",
  processing: "Mark ready",
  completed: "Mark paid",
};

export const ACTIVE_ORDER_STATUSES = ["submitted", "processing", "completed"];

export function isActiveOrderStatus(status) {
  return ACTIVE_ORDER_STATUSES.includes(status);
}

export function getStatusLabel(status) {
  return ORDER_STATUS_LABELS[status] || status;
}

export function formatOrderTime(createdAt) {
  if (!createdAt) return "";
  return new Date(createdAt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}
