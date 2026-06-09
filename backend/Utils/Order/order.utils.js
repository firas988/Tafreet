const dbSingleton = require("../../Config/DB/dbSingleton.config");
const db = dbSingleton.getConnection();

const createOrder = async (table_number, user_name) => {
  try {
    if (!user_name?.trim()) {
      throw new Error("User name is required");
    }

    const query =
      "INSERT INTO orders (table_number, user_name, status) VALUES (?, ?, 'submitted')";
    const [result] = await db
      .promise()
      .query(query, [table_number, user_name.trim()]);
    if (result.affectedRows === 0) {
      throw new Error("Failed to create order");
    }
    return {
      success: true,
      message: "Order created successfully",
      order_id: result.insertId,
    };
  } catch (err) {
    throw new Error(err.message);
  }
};

const addProductsToOrder = async (order_id, product_ids) => {
  try {
    const query =
      "INSERT INTO order_contains_products (order_id, product_id) VALUES (?, ?)";
    for (const product_id of product_ids) {
      const [result] = await db.promise().query(query, [order_id, product_id]);
      if (result.affectedRows === 0) {
        throw new Error("Failed to add product to order");
      }
    }
    return { success: true, message: "Products added to order successfully" };
  } catch (err) {
    throw new Error(err.message);
  }
};

module.exports = { createOrder, addProductsToOrder };
