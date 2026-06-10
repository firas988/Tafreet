const express = require("express");
const router = express.Router();
const {
  createOrder,
  addProductsToOrder,
  recordPayment,
} = require("../../Utils/Order/order.utils");

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

    return res.status(200).json({
      ...order,
      payment_code: payment.payment_code,
      is_cash: payment.is_cash,
    });
  } catch (err) {
    return res.status(200).json({ success: false, message: err.message });
  }
});

module.exports = router;
