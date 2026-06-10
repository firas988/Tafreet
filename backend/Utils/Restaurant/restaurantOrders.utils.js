const dbSingleton = require("../../Config/DB/dbSingleton.config");
const db = dbSingleton.getConnection();

const ALLOWED_STATUSES = ["submitted", "processing", "completed", "paid"];
const ACTIVE_STATUSES = ["submitted", "processing", "completed"];

const STATUS_TRANSITIONS = {
  submitted: "processing",
  processing: "completed",
  completed: "paid",
};

const ORDER_SELECT = `
  SELECT
    o.order_id,
    o.user_name,
    t.table_number,
    o.status,
    o.created_at,
    p.payment_code,
    p.is_cash
  FROM orders o
  JOIN tables t ON o.table_id = t.table_id
  LEFT JOIN payments p ON p.order_id = o.order_id
`;

const formatOrderItems = (products = []) => {
  const items = products.map((product) => ({
    product_id: product.product_id,
    product_name: product.product_name,
    product_price: Number(product.product_price),
    quantity: product.quantity || 1,
    image_path: product.image_path || null,
  }));

  const total = items.reduce(
    (sum, item) => sum + item.product_price * item.quantity,
    0,
  );
  const items_count = items.reduce((sum, item) => sum + item.quantity, 0);

  return { items, total, items_count };
};

const formatOrder = (order, products = []) => {
  const { items, total, items_count } = formatOrderItems(products);

  return {
    order_id: order.order_id,
    user_name: order.user_name,
    table_number: order.table_number,
    status: order.status,
    created_at: order.created_at,
    customer_name: order.user_name,
    payment_code: order.payment_code || null,
    is_cash: Number(order.is_cash) === 1 ? 1 : 0,
    items,
    total,
    items_count,
  };
};

const attachProductsToOrders = async (orders) => {
  if (!orders.length) {
    return [];
  }

  const orderIds = orders.map((order) => order.order_id);
  const productsQuery = `
    SELECT
      ocp.order_id,
      p.product_id,
      p.product_name,
      p.product_price,
      p.image_path,
      SUM(ocp.quantity) AS quantity
    FROM order_contains_products ocp
    JOIN products p ON ocp.product_id = p.product_id
    WHERE ocp.order_id IN (?)
    GROUP BY ocp.order_id, p.product_id, p.product_name, p.product_price, p.image_path
  `;
  const [orderProducts] = await db.promise().query(productsQuery, [orderIds]);

  const productsByOrder = {};
  for (const item of orderProducts) {
    if (!productsByOrder[item.order_id]) {
      productsByOrder[item.order_id] = [];
    }
    productsByOrder[item.order_id].push({
      product_id: item.product_id,
      product_name: item.product_name,
      product_price: item.product_price,
      image_path: item.image_path,
      quantity: Number(item.quantity),
    });
  }

  return orders.map((order) =>
    formatOrder(order, productsByOrder[order.order_id] || []),
  );
};

const restaurantOrders = async () => {
  try {
    const [orders] = await db
      .promise()
      .query(`${ORDER_SELECT} ORDER BY o.created_at DESC`);

    return attachProductsToOrders(orders);
  } catch (err) {
    throw new Error(err.message || err);
  }
};

const getOrderById = async (orderId) => {
  try {
    const [orders] = await db
      .promise()
      .query(`${ORDER_SELECT} WHERE o.order_id = ? LIMIT 1`, [orderId]);

    if (orders.length === 0) {
      throw new Error("Order not found");
    }

    const [order] = await attachProductsToOrders(orders);
    return order;
  } catch (err) {
    throw new Error(err.message || err);
  }
};

const getActiveOrdersByTableNumber = async (tableNumber) => {
  try {
    const [orders] = await db.promise().query(
      `${ORDER_SELECT}
       WHERE t.table_number = ? AND o.status IN (?)
       ORDER BY o.created_at DESC`,
      [tableNumber, ACTIVE_STATUSES],
    );

    return attachProductsToOrders(orders);
  } catch (err) {
    throw new Error(err.message || err);
  }
};

const updateRestaurantOrderStatus = async (orderId, status) => {
  try {
    if (!ALLOWED_STATUSES.includes(status)) {
      throw new Error("Invalid order status");
    }

    const [existing] = await db
      .promise()
      .query("SELECT order_id, status FROM orders WHERE order_id = ?", [
        orderId,
      ]);

    if (existing.length === 0) {
      throw new Error("Order not found");
    }

    const currentStatus = existing[0].status;
    const expectedStatus = STATUS_TRANSITIONS[currentStatus];

    if (status !== expectedStatus) {
      throw new Error(
        `Cannot change order status from ${currentStatus} to ${status}`,
      );
    }

    const [result] = await db
      .promise()
      .query("UPDATE orders SET status = ? WHERE order_id = ?", [
        status,
        orderId,
      ]);

    if (result.affectedRows === 0) {
      throw new Error("Failed to update order status");
    }

    const order = await getOrderById(orderId);

    return {
      success: true,
      message: "Order status updated successfully",
      order_id: Number(orderId),
      status,
      order,
    };
  } catch (err) {
    throw new Error(err.message || err);
  }
};

module.exports = {
  restaurantOrders,
  getOrderById,
  getActiveOrdersByTableNumber,
  updateRestaurantOrderStatus,
  formatOrder,
  STATUS_TRANSITIONS,
  ACTIVE_STATUSES,
};
