const express = require("express");
const router = express.Router();
const { createOrder, addProductsToOrder } = require("../../Utils/Order/order.utils");

router.post("/createOrder", async (req, res) => {
  try {
    const { table_number, user_name, product_ids } = req.body;
    if (!product_ids?.length) {
      throw new Error("Product ids are required");
    }
    const order = await createOrder(table_number, user_name);
    await addProductsToOrder(order.order_id, product_ids);

    return res.status(200).json({ ...order });
  } catch (err) {
    return res.status(200).json({ success: false, message: err.message });
  }
});

module.exports = router;
