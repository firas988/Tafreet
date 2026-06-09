export const restaurant = {
  name: "Luna Bistro",
  tagline: "Digital Menu & Smart Orders",
  tableNumber: 12,
};

export const categories = [
  { id: 1, name: "Pizza", emoji: "🍕" },
  { id: 2, name: "Burgers", emoji: "🍔" },
  { id: 3, name: "Pasta", emoji: "🍝" },
  { id: 4, name: "Salads", emoji: "🥗" },
  { id: 5, name: "Drinks", emoji: "🥤" },
  { id: 6, name: "Desserts", emoji: "🍰" },
];

export const products = [
  {
    id: 1,
    categoryId: 1,
    name: "Truffle Margherita",
    description: "Fresh mozzarella, basil, tomato sauce, truffle oil.",
    price: 48,
    image: "https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=900&q=80",
    popular: true,
  },
  {
    id: 2,
    categoryId: 1,
    name: "Spicy Pepperoni",
    description: "Pepperoni, chili honey, mozzarella and oregano.",
    price: 54,
    image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=900&q=80",
    popular: false,
  },
  {
    id: 3,
    categoryId: 2,
    name: "Royal Smash Burger",
    description: "Double beef patty, cheddar, pickles, secret sauce.",
    price: 62,
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=80",
    popular: true,
  },
  {
    id: 4,
    categoryId: 3,
    name: "Creamy Alfredo",
    description: "Fettuccine pasta with parmesan cream and mushrooms.",
    price: 52,
    image: "https://images.unsplash.com/photo-1645112411341-6c4fd023714a?auto=format&fit=crop&w=900&q=80",
    popular: false,
  },
  {
    id: 5,
    categoryId: 4,
    name: "Mediterranean Bowl",
    description: "Greens, grilled halloumi, olives, tomato, lemon dressing.",
    price: 44,
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=80",
    popular: false,
  },
  {
    id: 6,
    categoryId: 5,
    name: "Mint Lemonade",
    description: "Fresh lemon, mint leaves, crushed ice.",
    price: 18,
    image: "https://images.unsplash.com/photo-1621263764928-df1444c5e859?auto=format&fit=crop&w=900&q=80",
    popular: true,
  },
  {
    id: 7,
    categoryId: 6,
    name: "Chocolate Lava Cake",
    description: "Warm chocolate cake with vanilla ice cream.",
    price: 34,
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=900&q=80",
    popular: true,
  },
];

export const orders = [
  {
    id: 101,
    table: 4,
    customer: "Adam",
    phone: "052-111-2222",
    status: "New",
    total: 126,
    items: [
      { name: "Royal Smash Burger", qty: 1 },
      { name: "Mint Lemonade", qty: 2 },
    ],
    time: "12:40",
  },
  {
    id: 102,
    table: 9,
    customer: "Maya",
    phone: "053-333-4444",
    status: "Preparing",
    total: 96,
    items: [
      { name: "Truffle Margherita", qty: 2 },
    ],
    time: "12:46",
  },
  {
    id: 103,
    table: 12,
    customer: "Noor",
    phone: "054-555-6666",
    status: "Ready",
    total: 158,
    items: [
      { name: "Creamy Alfredo", qty: 1 },
      { name: "Spicy Pepperoni", qty: 1 },
      { name: "Chocolate Lava Cake", qty: 1 },
    ],
    time: "12:55",
  },
];

export const staff = [
  { id: 1, name: "Firas", email: "firas@restaurant.com", role: "Admin", active: true },
  { id: 2, name: "Tasneem", email: "tasneem@restaurant.com", role: "Worker", active: true },
  { id: 3, name: "Majd", email: "majd@restaurant.com", role: "Worker", active: false },
];
