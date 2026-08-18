import { useState, useCallback } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import Cart, { CartItem } from "@/pages/Cart";

export default function App() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const handleAddItem = useCallback((productId: string) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.productId === productId);
      if (existingItem) {
        return prevItems.map((item) =>
          item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevItems, { productId, quantity: 1 }];
    });
  }, []);

  const handleRemoveItem = useCallback((productId: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.productId !== productId));
  }, []);

  const handleIncreaseQuantity = useCallback((productId: string) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  }, []);

  const handleDecreaseQuantity = useCallback((productId: string) => {
    setCartItems((prevItems) =>
      prevItems
        .map((item) =>
          item.productId === productId ? { ...item, quantity: Math.max(0, item.quantity - 1) } : item
        )
        .filter((item) => item.quantity > 0)
    );
  }, []);


  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route
        path="/cart"
        element={
          <Cart
            items={cartItems}
            onAddItem={handleAddItem}
            onRemoveItem={handleRemoveItem}
            onIncreaseQuantity={handleIncreaseQuantity}
            onDecreaseQuantity={handleDecreaseQuantity}
          />
        }
      />
    </Routes>
  );
}
