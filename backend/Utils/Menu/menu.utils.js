const { getRestaurant } = require("../Restaurant/restaurantData.utils");
const { restaurantCategories } = require("../Restaurant/restaurantCategories.utils");
const { restaurantProducts } = require("../Restaurant/restaurantProducts.utils");
const { getTableByNumber } = require("../Restaurant/restaurantTables.utils");

const getPublicMenu = async (tableNumber) => {
  const table = await getTableByNumber(tableNumber);

  if (!table.is_active) {
    throw new Error("This table is currently unavailable");
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
    table_id: table.table_id,
    table_number: table.table_number,
  };
};

module.exports = { getPublicMenu };
