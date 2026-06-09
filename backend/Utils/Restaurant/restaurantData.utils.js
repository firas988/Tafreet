const dbSingleton = require("../../Config/DB/dbSingleton.config");
const db = dbSingleton.getConnection();
const { restaurantCategories } = require("./restaurantCategories.utils");
const { restaurantProducts } = require("./restaurantProducts.utils");
const { restaurantOrders } = require("./restaurantOrders.utils");

const getRestaurant = async (throwError = true) => {
  try {
    const query =
      "SELECT restaurant_id, restaurant_name, restaurant_image_path AS image_path FROM restaurant LIMIT 1";
    const [result] = await db.promise().query(query);
    if (result.length === 0) {
      if (throwError) {
        throw new Error("Restaurant not found");
      }
      return null;
    }
    return result[0];
  } catch (err) {
    throw new Error(err.message || err);
  }
};

const restaurantData = async () => {
  try {
    const restaurant = await getRestaurant();
    const [categories, products, orders] = await Promise.all([
      restaurantCategories(),
      restaurantProducts(),
      restaurantOrders(),
    ]);

    return {
      restaurant,
      categories,
      products,
      orders,
    };
  } catch (err) {
    throw new Error(err.message || err);
  }
};

module.exports = { getRestaurant, restaurantData };
