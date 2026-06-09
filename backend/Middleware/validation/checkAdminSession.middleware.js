async function checkAdminSession(req, res, next) {
  try {
    if (!req.session.user_id) {
      throw new Error("User is not logged in");
    }
    if (req.session.user?.role !== "admin") {
      throw new Error("User is not a admin");
    }
    return next();
  } catch (err) {
    return res.status(200).json({ success: false, message: err.message });
  }
}

module.exports = { checkAdminSession };
