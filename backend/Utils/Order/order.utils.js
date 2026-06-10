const dbSingleton = require("../../Config/DB/dbSingleton.config");
const db = dbSingleton.getConnection();
const { getTableByNumber } = require("../Restaurant/restaurantTables.utils");

const createOrder = async (table_number, user_name) => {
  try {
    if (!user_name?.trim()) {
      throw new Error("User name is required");
    }

    const table = await getTableByNumber(table_number);

    if (!table.is_active) {
      throw new Error("This table is currently unavailable");
    }

    const query =
      "INSERT INTO orders (table_id, user_name, status) VALUES (?, ?, 'submitted')";
    const [result] = await db
      .promise()
      .query(query, [table.table_id, user_name.trim()]);
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
    const quantities = {};

    for (const product_id of product_ids) {
      const id = Number(product_id);
      if (!id) {
        throw new Error("Invalid product id");
      }
      quantities[id] = (quantities[id] || 0) + 1;
    }

    const query =
      "INSERT INTO order_contains_products (order_id, product_id, quantity) VALUES (?, ?, ?)";

    for (const [product_id, quantity] of Object.entries(quantities)) {
      const [result] = await db
        .promise()
        .query(query, [order_id, Number(product_id), quantity]);

      if (result.affectedRows === 0) {
        throw new Error("Failed to add product to order");
      }
    }

    return { success: true, message: "Products added to order successfully" };
  } catch (err) {
    throw new Error(err.message);
  }
};

const normalizeIsCash = (value) => {
  if (value === true || value === 1 || value === "1") {
    return 1;
  }

  if (typeof value === "string" && value.toLowerCase() === "cash") {
    return 1;
  }

  return 0;
};

const recordPayment = async (
  order_id,
  { is_cash = 1, payment_code = null } = {},
) => {
  try {
    const cashFlag = normalizeIsCash(is_cash);
    const code = payment_code?.trim() || null;

    const query =
      "INSERT INTO payments (order_id, payment_code, is_cash) VALUES (?, ?, ?)";
    const [result] = await db
      .promise()
      .query(query, [order_id, code, cashFlag]);

    if (result.affectedRows === 0) {
      throw new Error("Failed to record payment");
    }

    return {
      success: true,
      payment_code: code,
      is_cash: cashFlag,
    };
  } catch (err) {
    throw new Error(err.message);
  }
};

module.exports = { createOrder, addProductsToOrder, recordPayment };
