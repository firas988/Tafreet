const dbSingleton = require("../../Config/DB/dbSingleton.config");
const db = dbSingleton.getConnection();

const updateRestaurantProfile = async (restaurant_name, imageName = null) => {
  try {
    if (!restaurant_name?.trim()) {
      throw new Error("Restaurant name is required");
    }

    const [existing] = await db
      .promise()
      .query(
        "SELECT restaurant_id, restaurant_name, restaurant_image_path FROM restaurant LIMIT 1",
      );

    if (existing.length === 0) {
      throw new Error("Restaurant not found");
    }

    const previousImagePath = existing[0].restaurant_image_path;

    const query = imageName
      ? "UPDATE restaurant SET restaurant_name = ?, restaurant_image_path = ? WHERE restaurant_id = ?"
      : "UPDATE restaurant SET restaurant_name = ? WHERE restaurant_id = ?";

    const params = imageName
      ? [restaurant_name.trim(), imageName, existing[0].restaurant_id]
      : [restaurant_name.trim(), existing[0].restaurant_id];

    const [result] = await db.promise().query(query, params);

    if (result.affectedRows === 0) {
      throw new Error("Failed to update restaurant profile");
    }

    return {
      success: true,
      message: "Restaurant profile updated successfully",
      restaurant: {
        restaurant_id: existing[0].restaurant_id,
        restaurant_name: restaurant_name.trim(),
        image_path: imageName || previousImagePath || "",
      },
      previousImagePath:
        imageName && previousImagePath && previousImagePath !== imageName
          ? previousImagePath
          : null,
    };
  } catch (err) {
    throw new Error(err.message || err);
  }
};

module.exports = { updateRestaurantProfile };
