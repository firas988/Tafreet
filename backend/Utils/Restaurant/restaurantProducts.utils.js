const dbSingleton = require("../../Config/DB/dbSingleton.config");
const db = dbSingleton.getConnection();

const restaurantProducts = async () => {
  try {
    const productsQuery =
      "SELECT product_id, product_name, product_price, description, image_path FROM products";
    const [products] = await db.promise().query(productsQuery);

    if (products.length === 0) {
      return [];
    }

    const productIds = products.map((p) => p.product_id);
    const categoriesQuery = `
      SELECT product_id, categorie_id
      FROM product_belongs_to_category
      WHERE product_id IN (?)
    `;
    const [categoryLinks] = await db
      .promise()
      .query(categoriesQuery, [productIds]);

    const categoriesByProduct = {};
    for (const link of categoryLinks) {
      if (!categoriesByProduct[link.product_id]) {
        categoriesByProduct[link.product_id] = [];
      }
      categoriesByProduct[link.product_id].push(link.categorie_id);
    }

    return products.map((product) => ({
      ...product,
      categorie_ids: categoriesByProduct[product.product_id] || [],
    }));
  } catch (err) {
    throw new Error(err.message || err);
  }
};

const addRestaurantProduct = async (
  product_name,
  product_price,
  description,
  imageName,
  categorie_ids = [],
) => {
  try {
    if (!product_name || product_price == null || !description || !imageName) {
      throw new Error(
        "product_name, product_price, description, and imageName are required",
      );
    }

    const productQuery =
      "INSERT INTO products (product_name, product_price, description, image_path) VALUES (?, ?, ?, ?)";
    const [productResult] = await db
      .promise()
      .query(productQuery, [
        product_name,
        product_price,
        description,
        imageName,
      ]);

    if (productResult.affectedRows === 0) {
      throw new Error("Failed to add product");
    }

    const product_id = productResult.insertId;

    if (categorie_ids.length > 0) {
      const linkValues = categorie_ids.map((categorie_id) => [
        categorie_id,
        product_id,
      ]);
      const linkQuery =
        "INSERT INTO product_belongs_to_category (categorie_id, product_id) VALUES ?";
      await db.promise().query(linkQuery, [linkValues]);
    }

    return {
      success: true,
      message: "Product added successfully",
      product_id: product_id,
    };
  } catch (err) {
    throw new Error(err.message || err);
  }
};

const updateRestaurantProduct = async (
  productId,
  product_name,
  product_price,
  description,
  categorie_ids = [],
  imageName = null,
) => {
  try {
    if (
      !product_name?.trim() ||
      product_price == null ||
      !description?.trim()
    ) {
      throw new Error(
        "product_name, product_price, and description are required",
      );
    }

    const [existing] = await db
      .promise()
      .query(
        "SELECT product_id, image_path FROM products WHERE product_id = ?",
        [productId],
      );

    if (existing.length === 0) {
      throw new Error("Product not found");
    }

    const previousImagePath = existing[0].image_path;

    const productQuery = imageName
      ? "UPDATE products SET product_name = ?, product_price = ?, description = ?, image_path = ? WHERE product_id = ?"
      : "UPDATE products SET product_name = ?, product_price = ?, description = ? WHERE product_id = ?";

    const productParams = imageName
      ? [product_name, product_price, description, imageName, productId]
      : [product_name, product_price, description, productId];

    const [productResult] = await db
      .promise()
      .query(productQuery, productParams);

    if (productResult.affectedRows === 0) {
      throw new Error("Failed to update product");
    }

    await db
      .promise()
      .query("DELETE FROM product_belongs_to_category WHERE product_id = ?", [
        productId,
      ]);

    if (categorie_ids.length > 0) {
      const linkValues = categorie_ids.map((categorie_id) => [
        categorie_id,
        productId,
      ]);
      await db
        .promise()
        .query(
          "INSERT INTO product_belongs_to_category (categorie_id, product_id) VALUES ?",
          [linkValues],
        );
    }

    return {
      success: true,
      message: "Product updated successfully",
      product_id: Number(productId),
      previousImagePath: imageName ? previousImagePath : null,
    };
  } catch (err) {
    throw new Error(err.message || err);
  }
};

const deleteRestaurantProduct = async (productId) => {
  try {
    const [existing] = await db
      .promise()
      .query(
        "SELECT product_id, image_path FROM products WHERE product_id = ?",
        [productId],
      );

    if (existing.length === 0) {
      throw new Error("Product not found");
    }

    const [usedInOrders] = await db
      .promise()
      .query(
        "SELECT order_id FROM order_contains_products WHERE product_id = ? LIMIT 1",
        [productId],
      );

    if (usedInOrders.length > 0) {
      throw new Error(
        "Cannot delete product because it is used in one or more orders.",
      );
    }

    await db
      .promise()
      .query("DELETE FROM product_belongs_to_category WHERE product_id = ?", [
        productId,
      ]);

    const [result] = await db
      .promise()
      .query("DELETE FROM products WHERE product_id = ?", [productId]);

    if (result.affectedRows === 0) {
      throw new Error("Failed to delete product");
    }

    return {
      success: true,
      message: "Product deleted successfully",
      imagePath: existing[0].image_path,
    };
  } catch (err) {
    throw new Error(err.message || err);
  }
};

module.exports = {
  restaurantProducts,
  addRestaurantProduct,
  updateRestaurantProduct,
  deleteRestaurantProduct,
};
