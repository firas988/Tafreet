const express = require("express");
const router = express.Router();
const { getRestaurant } = require("../../Utils/Restaurant/restaurantData.utils");
const {
  restaurantOrders,
  updateRestaurantOrderStatus,
} = require("../../Utils/Restaurant/restaurantOrders.utils");

router.get("/orders", async (req, res) => {
  try {
    const [restaurant, orders] = await Promise.all([
      getRestaurant(),
      restaurantOrders(),
    ]);

    return res.status(200).json({
      success: true,
      restaurant,
      orders,
    });
  } catch (err) {
    return res.status(200).json({ success: false, message: err.message });
  }
});

router.put("/orders/:order_id/status", async (req, res) => {
  try {
    const { status } = req.body;
    const result = await updateRestaurantOrderStatus(
      req.params.order_id,
      status,
    );
    return res.status(200).json({ ...result });
  } catch (err) {
    return res.status(200).json({ success: false, message: err.message });
  }
});

module.exports = router;
