async function checkWorkerSession(req, res, next) {
  try {
    if (!req.session.user_id) {
      throw new Error("User is not logged in");
    }
    if (req.session.user?.role !== "worker") {
      throw new Error("User is not a worker");
    }
    return next();
  } catch (err) {
    return res.status(200).json({ success: false, message: err.message });
  }
}

module.exports = { checkWorkerSession };
