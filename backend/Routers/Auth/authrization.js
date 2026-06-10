const express = require("express");
const router = express.Router();

const { loginUtils } = require("../../Utils/Auth/login.utils");

// login router.
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await loginUtils(email, password);

    req.session.user_id = result.user.user_id;
    req.session.user = result.user;
    req.session.role = result.user.role;

    return res.status(200).json({ ...result });
  } catch (err) {
    return res.status(200).json({ success: false, message: err.message });
  }
});


// check login.
router.get("/check-login", async (req, res) => {
  try {
    if (req.session.user_id) {
      return res.status(200).json({
        success: true,
        message: "User is logged in",
        user: req.session.user,
      });
    }
    throw new Error("User is not logged in");
  } catch (err) {
    return res.status(200).json({ success: false, message:err.message });
  }
});
// logout router.
router.post("/logout", (req, res) => {
  try {
    req.session.destroy();
    return res.status(200).json({ success: true, message: "User logged out" });
  } catch (error) {
    return res.status(200).json({ success: false, message: error.message });
  }
});

module.exports = router;
