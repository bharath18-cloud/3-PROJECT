import React, { createContext, useState, useEffect, useContext, useMemo } from 'react';

const CartContext = createContext();

// Helper: get product ID regardless of whether it's `_id` (MongoDB) or `id` (local seed)
const getProdId = (product) => product?._id || product?.id;

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    try {
      const local = localStorage.getItem('st_cart');
      return local ? JSON.parse(local) : [];
    } catch { return []; }
  });

  const [deliveryDate, setDeliveryDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 2); // Minimum 2 days ahead for logistics scheduling
    return d.toISOString().split('T')[0];
  });

  // Persist cart to localStorage on every change
  useEffect(() => {
    localStorage.setItem('st_cart', JSON.stringify(cart));
  }, [cart]);

  // ── Add item (or increment quantity if already in cart) ────────────────────
  const addToCart = (product, quantity = 1) => {
    const id = getProdId(product);
    setCart((prev) => {
      const existing = prev.find((item) => getProdId(item.product) === id);
      if (existing) {
        return prev.map((item) =>
          getProdId(item.product) === id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
  };

  // ── Remove item ────────────────────────────────────────────────────────────
  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => getProdId(item.product) !== productId));
  };

  // ── Update quantity (remove if zero) ──────────────────────────────────────
  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        getProdId(item.product) === productId ? { ...item, quantity } : item
      )
    );
  };

  // ── Clear all ──────────────────────────────────────────────────────────────
  const clearCart = () => setCart([]);

  // ── Derived totals ─────────────────────────────────────────────────────────
  const subtotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
    [cart]
  );
  // Standard Indian B2B Construction GST: 18% (CGST 9% + SGST 9%)
  const gst      = useMemo(() => Math.round(subtotal * 0.18), [subtotal]);
  const total    = useMemo(() => subtotal + gst, [subtotal, gst]);
  const cartCount = useMemo(() => cart.reduce((sum, item) => sum + item.quantity, 0), [cart]);

  return (
    <CartContext.Provider
      value={{
        cart,
        deliveryDate,
        setDeliveryDate,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        subtotal,
        gst,
        total,
        cartCount,
        getProdId,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
