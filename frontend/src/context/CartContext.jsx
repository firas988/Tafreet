import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

export const CartContext = createContext(null);

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

export function CartProvider({ children }) {
  const [tableNumber, setTableNumber] = useState(null);
  const [items, setItems] = useState([]);

  const addToCart = useCallback((product) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);

      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item,
        );
      }

      return [...prev, { ...product, qty: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((productId) => {
    setItems((prev) => prev.filter((item) => item.id !== productId));
  }, []);

  const updateQty = useCallback((productId, qty) => {
    if (qty <= 0) {
      setItems((prev) => prev.filter((item) => item.id !== productId));
      return;
    }

    setItems((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, qty } : item,
      ),
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const initTable = useCallback((number) => {
    setTableNumber((current) => {
      if (current !== null && current !== number) {
        setItems([]);
      }
      return Number(number);
    });
  }, []);

  const cartCount = useMemo(
    () => items.reduce((sum, item) => sum + item.qty, 0),
    [items],
  );

  const subtotal = useMemo(
    () =>
      items.reduce(
        (sum, item) => sum + Number(item.price) * item.qty,
        0,
      ),
    [items],
  );

  const productIds = useMemo(
    () => items.flatMap((item) => Array(item.qty).fill(item.id)),
    [items],
  );

  return (
    <CartContext.Provider
      value={{
        tableNumber,
        items,
        cartCount,
        subtotal,
        productIds,
        initTable,
        addToCart,
        removeFromCart,
        updateQty,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
