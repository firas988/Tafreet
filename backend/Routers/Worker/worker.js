const express = require("express");
const router = express.Router();
const { getRestaurant } = require("../../Utils/Restaurant/restaurantData.utils");
const {
  restaurantOrders,
  updateRestaurantOrderStatus,
} = require("../../Utils/Restaurant/restaurantOrders.utils");
const { emitOrderUpdated } = require("../../Socket/emitters");

router.get("/orders", async (req, res) => {
  try {
    const [restaurant, orders] = await Promise.all([
      getRestaurant(false),
      restaurantOrders(),
    ]);

    const activeOrders = orders.filter((order) => order.status !== "paid");

    return res.status(200).json({
      success: true,
      restaurant,
      orders: activeOrders,
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

    if (result.order) {
      emitOrderUpdated(result.order);
    }

    return res.status(200).json({ ...result });
  } catch (err) {
    return res.status(200).json({ success: false, message: err.message });
  }
});

module.exports = router;
