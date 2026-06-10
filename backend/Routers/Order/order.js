const express = require("express");
const router = express.Router();
const {
  createOrder,
  addProductsToOrder,
  recordPayment,
} = require("../../Utils/Order/order.utils");
const {
  getOrderById,
  getActiveOrdersByTableNumber,
} = require("../../Utils/Restaurant/restaurantOrders.utils");
const { emitOrderCreated } = require("../../Socket/emitters");

router.post("/createOrder", async (req, res) => {
  try {
    const { table_number, user_name, product_ids, is_cash, payment_code } =
      req.body;
    if (!product_ids?.length) {
      throw new Error("Product ids are required");
    }
    const order = await createOrder(table_number, user_name);
    await addProductsToOrder(order.order_id, product_ids);
    const payment = await recordPayment(order.order_id, {
      is_cash,
      payment_code,
    });

    const fullOrder = await getOrderById(order.order_id);
    emitOrderCreated(fullOrder);

    return res.status(200).json({
      ...order,
      payment_code: payment.payment_code,
      is_cash: payment.is_cash,
      order: fullOrder,
    });
  } catch (err) {
    return res.status(200).json({ success: false, message: err.message });
  }
});

router.get("/table/:tableNumber/active", async (req, res) => {
  try {
    const orders = await getActiveOrdersByTableNumber(req.params.tableNumber);

    return res.status(200).json({
      success: true,
      orders,
    });
  } catch (err) {
    return res.status(200).json({ success: false, message: err.message });
  }
});

router.get("/:orderId", async (req, res) => {
  try {
    const order = await getOrderById(req.params.orderId);

    return res.status(200).json({
      success: true,
      order,
    });
  } catch (err) {
    return res.status(200).json({ success: false, message: err.message });
  }
});

module.exports = router;
