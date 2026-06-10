const dbSingleton = require("../../Config/DB/dbSingleton.config");
const db = dbSingleton.getConnection();

const restaurantTables = async () => {
  try {
    const query = `
      SELECT table_id, table_number, is_active
      FROM tables
      ORDER BY table_number ASC
    `;
    const [result] = await db.promise().query(query);
    return result;
  } catch (err) {
    throw new Error(err.message || err);
  }
};

const getRestaurantTableById = async (tableId) => {
  try {
    const [result] = await db
      .promise()
      .query(
        "SELECT table_id, table_number, is_active FROM tables WHERE table_id = ? LIMIT 1",
        [tableId],
      );

    if (result.length === 0) {
      throw new Error("Table not found");
    }

    return result[0];
  } catch (err) {
    throw new Error(err.message || err);
  }
};

const getTableByNumber = async (tableNumber) => {
  try {
    const parsed = Number(tableNumber);

    if (!Number.isInteger(parsed) || parsed <= 0) {
      throw new Error("Invalid table number");
    }

    const [result] = await db
      .promise()
      .query(
        "SELECT table_id, table_number, is_active FROM tables WHERE table_number = ? LIMIT 1",
        [parsed],
      );

    if (result.length === 0) {
      throw new Error("Table not found");
    }

    return result[0];
  } catch (err) {
    throw new Error(err.message || err);
  }
};

const addRestaurantTable = async (table_number, is_active = 1) => {
  try {
    const parsedNumber = Number(table_number);

    if (!Number.isInteger(parsedNumber) || parsedNumber <= 0) {
      throw new Error("Table number must be a positive whole number");
    }

    const activeValue = Number(is_active) === 1 ? 1 : 0;

    const [existing] = await db
      .promise()
      .query("SELECT table_id FROM tables WHERE table_number = ?", [
        parsedNumber,
      ]);

    if (existing.length > 0) {
      throw new Error(`Table ${parsedNumber} already exists`);
    }

    const [result] = await db
      .promise()
      .query(
        "INSERT INTO tables (table_number, is_active) VALUES (?, ?)",
        [parsedNumber, activeValue],
      );

    if (result.affectedRows === 0) {
      throw new Error("Failed to add table");
    }

    return {
      success: true,
      message: "Table added successfully",
      table_id: result.insertId,
    };
  } catch (err) {
    throw new Error(err.message || err);
  }
};

const updateRestaurantTable = async (tableId, table_number, is_active) => {
  try {
    const [existing] = await db
      .promise()
      .query(
        "SELECT table_id, table_number FROM tables WHERE table_id = ?",
        [tableId],
      );

    if (existing.length === 0) {
      throw new Error("Table not found");
    }

    const updates = [];
    const params = [];

    if (table_number != null) {
      const parsedNumber = Number(table_number);

      if (!Number.isInteger(parsedNumber) || parsedNumber <= 0) {
        throw new Error("Table number must be a positive whole number");
      }

      const [duplicate] = await db
        .promise()
        .query(
          "SELECT table_id FROM tables WHERE table_number = ? AND table_id != ?",
          [parsedNumber, tableId],
        );

      if (duplicate.length > 0) {
        throw new Error(`Table ${parsedNumber} already exists`);
      }

      updates.push("table_number = ?");
      params.push(parsedNumber);
    }

    if (is_active != null) {
      updates.push("is_active = ?");
      params.push(Number(is_active) === 1 ? 1 : 0);
    }

    if (updates.length === 0) {
      throw new Error("Nothing to update");
    }

    params.push(tableId);

    const [result] = await db
      .promise()
      .query(`UPDATE tables SET ${updates.join(", ")} WHERE table_id = ?`, params);

    if (result.affectedRows === 0) {
      throw new Error("Failed to update table");
    }

    return {
      success: true,
      message: "Table updated successfully",
      table_id: Number(tableId),
    };
  } catch (err) {
    throw new Error(err.message || err);
  }
};

const deleteRestaurantTable = async (tableId) => {
  try {
    const [existing] = await db
      .promise()
      .query("SELECT table_id FROM tables WHERE table_id = ?", [tableId]);

    if (existing.length === 0) {
      throw new Error("Table not found");
    }

    const [usedInOrders] = await db
      .promise()
      .query("SELECT order_id FROM orders WHERE table_id = ? LIMIT 1", [
        tableId,
      ]);

    if (usedInOrders.length > 0) {
      throw new Error(
        "Cannot delete table because it has existing orders. Disable it instead.",
      );
    }

    const [result] = await db
      .promise()
      .query("DELETE FROM tables WHERE table_id = ?", [tableId]);

    if (result.affectedRows === 0) {
      throw new Error("Failed to delete table");
    }

    return {
      success: true,
      message: "Table deleted successfully",
    };
  } catch (err) {
    throw new Error(err.message || err);
  }
};

module.exports = {
  restaurantTables,
  getRestaurantTableById,
  getTableByNumber,
  addRestaurantTable,
  updateRestaurantTable,
  deleteRestaurantTable,
};
