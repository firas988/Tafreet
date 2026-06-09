const express = require("express");
const router = express.Router();
const { getPublicMenu } = require("../../Utils/Menu/menu.utils");

router.get("/public/table/:tableNumber", async (req, res) => {
  try {
    const data = await getPublicMenu(req.params.tableNumber);
    return res.status(200).json({ success: true, ...data });
  } catch (err) {
    return res.status(200).json({ success: false, message: err.message });
  }
});

module.exports = router;
