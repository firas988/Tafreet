const dbSingleton = require("../../Config/DB/dbSingleton.config");
const db = dbSingleton.getConnection();

const restaurantCategories = async () => {
  try {
    const query =
      "SELECT categorie_id, categorie_name, image_path FROM categories";
    const [result] = await db.promise().query(query);
    return result;
  } catch (err) {
    throw new Error(err.message || err);
  }
};

const addRestaurantCategory = async (categorie_name, imageName) => {
  try {
    if (!categorie_name || !imageName) {
      throw new Error("categorie_name and imageName are required");
    }

    const query =
      "INSERT INTO categories (categorie_name, image_path) VALUES (?, ?)";
    const [result] = await db
      .promise()
      .query(query, [categorie_name, imageName]);

    if (result.affectedRows === 0) {
      throw new Error("Failed to add category");
    }

    return {
      success: true,
      message: "Category added successfully",
      categorie_id: result.insertId,
    };
  } catch (err) {
    throw new Error(err.message || err);
  }
};

const updateRestaurantCategory = async (
  categorieId,
  categorie_name,
  imageName = null,
) => {
  try {
    if (!categorie_name?.trim()) {
      throw new Error("categorie_name is required");
    }

    const [existing] = await db
      .promise()
      .query(
        "SELECT categorie_id, image_path FROM categories WHERE categorie_id = ?",
        [categorieId],
      );

    if (existing.length === 0) {
      throw new Error("Category not found");
    }

    const previousImagePath = existing[0].image_path;

    const query = imageName
      ? "UPDATE categories SET categorie_name = ?, image_path = ? WHERE categorie_id = ?"
      : "UPDATE categories SET categorie_name = ? WHERE categorie_id = ?";

    const params = imageName
      ? [categorie_name, imageName, categorieId]
      : [categorie_name, categorieId];

    const [result] = await db.promise().query(query, params);

    if (result.affectedRows === 0) {
      throw new Error("Failed to update category");
    }

    return {
      success: true,
      message: "Category updated successfully",
      categorie_id: Number(categorieId),
      previousImagePath: imageName ? previousImagePath : null,
    };
  } catch (err) {
    throw new Error(err.message || err);
  }
};

const deleteRestaurantCategory = async (categorieId) => {
  try {
    const [existing] = await db
      .promise()
      .query(
        "SELECT categorie_id, image_path FROM categories WHERE categorie_id = ?",
        [categorieId],
      );

    if (existing.length === 0) {
      throw new Error("Category not found");
    }

    const [usedByProducts] = await db
      .promise()
      .query(
        "SELECT product_id FROM product_belongs_to_category WHERE categorie_id = ? LIMIT 1",
        [categorieId],
      );

    if (usedByProducts.length > 0) {
      throw new Error(
        "Cannot delete category because one or more products are using it.",
      );
    }

    const [result] = await db
      .promise()
      .query("DELETE FROM categories WHERE categorie_id = ?", [categorieId]);

    if (result.affectedRows === 0) {
      throw new Error("Failed to delete category");
    }

    return {
      success: true,
      message: "Category deleted successfully",
      imagePath: existing[0].image_path,
    };
  } catch (err) {
    throw new Error(err.message || err);
  }
};

module.exports = {
  restaurantCategories,
  addRestaurantCategory,
  updateRestaurantCategory,
  deleteRestaurantCategory,
};
