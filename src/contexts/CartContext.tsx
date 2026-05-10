import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { Product } from '@/lib/products';

export interface CartItem extends Product {
  qty: number;
}

interface CartContextType {
  cart: Record<string, CartItem>;
  addToCart: (product: Product) => void;
  changeQty: (id: string, delta: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  totalQty: number;
  totalPrice: number;
  lastAdded: Product | null;
  clearLastAdded: () => void;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Record<string, CartItem>>(() => {
    try {
      const raw = localStorage.getItem('vb_cart_v3');
      return raw ? JSON.parse(raw) : {};
    } catch { return {}; }
  });
  const [lastAdded, setLastAdded] = useState<Product | null>(null);

  useEffect(() => {
    try { localStorage.setItem('vb_cart_v3', JSON.stringify(cart)); } catch {}
  }, [cart]);

  const addToCart = useCallback((product: Product) => {
    setCart(prev => {
      const existing = prev[product.id];
      return { ...prev, [product.id]: { ...product, qty: existing ? existing.qty + 1 : 1 } };
    });
    setLastAdded(product);
  }, []);

  const changeQty = useCallback((id: string, delta: number) => {
    setCart(prev => {
      const item = prev[id];
      if (!item) return prev;
      const newQty = item.qty + delta;
      if (newQty <= 0) {
        const { [id]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [id]: { ...item, qty: newQty } };
    });
  }, []);

  const removeFromCart = useCallback((id: string) => {
    setCart(prev => {
      const { [id]: _, ...rest } = prev;
      return rest;
    });
  }, []);

  const clearCart = useCallback(() => setCart({}), []);
  const clearLastAdded = useCallback(() => setLastAdded(null), []);

  const items = Object.values(cart);
  const totalQty = items.reduce((s, i) => s + i.qty, 0);
  const totalPrice = items.reduce((s, i) => s + i.price * i.qty, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, changeQty, removeFromCart, clearCart, totalQty, totalPrice, lastAdded, clearLastAdded }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be inside CartProvider');
  return ctx;
}
