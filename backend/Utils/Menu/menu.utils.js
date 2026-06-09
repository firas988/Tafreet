const { getRestaurant } = require("../Restaurant/restaurantData.utils");
const { restaurantCategories } = require("../Restaurant/restaurantCategories.utils");
const { restaurantProducts } = require("../Restaurant/restaurantProducts.utils");

const getPublicMenu = async (tableNumber) => {
  const parsedTableNumber = Number(tableNumber);

  if (!Number.isInteger(parsedTableNumber) || parsedTableNumber <= 0) {
    throw new Error("Invalid table number");
  }

  const restaurant = await getRestaurant();
  const [categories, products] = await Promise.all([
    restaurantCategories(),
    restaurantProducts(),
  ]);

  return {
    restaurant,
    categories,
    products,
    table_number: parsedTableNumber,
  };
};

module.exports = { getPublicMenu };
