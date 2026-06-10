const bcrypt = require("bcrypt");
const dbSingleton = require("../../Config/DB/dbSingleton.config");
const db = dbSingleton.getConnection();

const validateWorkerPassword = (password) => {
  if (!password || password.length < 8) {
    throw new Error("Password must be at least 8 characters");
  }

  if (!/[A-Z]/.test(password)) {
    throw new Error("Password must include at least one uppercase letter");
  }

  if (!/[a-z]/.test(password)) {
    throw new Error("Password must include at least one lowercase letter");
  }

  if (!/[0-9]/.test(password)) {
    throw new Error("Password must include at least one number");
  }

  if (!/[^A-Za-z0-9]/.test(password)) {
    throw new Error("Password must include at least one special character");
  }
};

const restaurantWorkers = async () => {
  try {
    const query = `
      SELECT user_id, first_name, last_name, email, role, is_active, created_at
      FROM user
      WHERE role = 'worker'
      ORDER BY created_at DESC
    `;
    const [result] = await db.promise().query(query);
    return result;
  } catch (err) {
    throw new Error(err.message || err);
  }
};

const addRestaurantWorker = async (
  first_name,
  last_name,
  email,
  password,
  is_active = 1,
) => {
  try {
    if (!first_name?.trim()) {
      throw new Error("First name is required");
    }

    if (!email?.trim()) {
      throw new Error("Email is required");
    }

    validateWorkerPassword(password);

    const normalizedEmail = email.trim().toLowerCase();
    const activeValue = Number(is_active) === 1 ? 1 : 0;
    const hashPassword = await bcrypt.hash(password, 10);

    const [existingEmail] = await db
      .promise()
      .query("SELECT user_id FROM user WHERE email = ?", [normalizedEmail]);

    if (existingEmail.length > 0) {
      throw new Error("This email is already in use");
    }

    const query = `
      INSERT INTO user (first_name, last_name, email, password, role, is_active)
      VALUES (?, ?, ?, ?, 'worker', ?)
    `;
    const [result] = await db
      .promise()
      .query(query, [
        first_name.trim(),
        last_name?.trim() || "",
        normalizedEmail,
        hashPassword,
        activeValue,
      ]);

    if (result.affectedRows === 0) {
      throw new Error("Failed to add worker");
    }

    return {
      success: true,
      message: "Worker added successfully",
      worker: {
        user_id: result.insertId,
        first_name: first_name.trim(),
        last_name: last_name?.trim() || "",
        email: normalizedEmail,
        role: "worker",
        is_active: activeValue,
      },
    };
  } catch (err) {
    throw new Error(err.message || err);
  }
};

const updateRestaurantWorker = async (
  workerId,
  first_name,
  last_name,
  email,
  is_active,
  password = null,
) => {
  try {
    if (!first_name?.trim()) {
      throw new Error("First name is required");
    }

    if (!email?.trim()) {
      throw new Error("Email is required");
    }

    const activeValue = Number(is_active) === 1 ? 1 : 0;
    const normalizedEmail = email.trim().toLowerCase();

    const [existing] = await db
      .promise()
      .query("SELECT user_id FROM user WHERE user_id = ? AND role = 'worker'", [
        workerId,
      ]);

    if (existing.length === 0) {
      throw new Error("Worker not found");
    }

    const [duplicateEmail] = await db
      .promise()
      .query(
        "SELECT user_id FROM user WHERE email = ? AND user_id != ?",
        [normalizedEmail, workerId],
      );

    if (duplicateEmail.length > 0) {
      throw new Error("This email is already in use");
    }

    const updates = [
      "first_name = ?",
      "last_name = ?",
      "email = ?",
      "is_active = ?",
    ];
    const params = [
      first_name.trim(),
      last_name?.trim() || "",
      normalizedEmail,
      activeValue,
    ];

    if (password) {
      validateWorkerPassword(password);
      const hashPassword = await bcrypt.hash(password, 10);
      updates.push("password = ?");
      params.push(hashPassword);
    }

    params.push(workerId);

    const [result] = await db
      .promise()
      .query(
        `UPDATE user SET ${updates.join(", ")} WHERE user_id = ? AND role = 'worker'`,
        params,
      );

    if (result.affectedRows === 0) {
      throw new Error("Failed to update worker");
    }

    return {
      success: true,
      message: "Worker updated successfully",
      user_id: Number(workerId),
    };
  } catch (err) {
    throw new Error(err.message || err);
  }
};

const deleteRestaurantWorker = async (workerId) => {
  try {
    const [existing] = await db
      .promise()
      .query("SELECT user_id FROM user WHERE user_id = ? AND role = 'worker'", [
        workerId,
      ]);

    if (existing.length === 0) {
      throw new Error("Worker not found");
    }

    const [result] = await db
      .promise()
      .query("DELETE FROM user WHERE user_id = ? AND role = 'worker'", [
        workerId,
      ]);

    if (result.affectedRows === 0) {
      throw new Error("Failed to delete worker");
    }

    return {
      success: true,
      message: "Worker deleted successfully",
    };
  } catch (err) {
    throw new Error(err.message || err);
  }
};

module.exports = {
  restaurantWorkers,
  addRestaurantWorker,
  updateRestaurantWorker,
  deleteRestaurantWorker,
};
