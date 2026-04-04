"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  description?: string;
  image_url?: string;
  category?: string;
  is_veg?: boolean;
  calories?: number;
  prep_time?: number;
}

export interface CartItem {
  item: MenuItem;
  qty: number;
}

interface CartContextType {
  cart: CartItem[];
  addToTray: (item: MenuItem) => void;
  removeFromTray: (id: string) => void;
  updateQty: (id: string, delta: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  // Load from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('bennett-cart');
    if (savedCart) {
      try {
        const parsed = JSON.parse(savedCart);
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setCart(parsed);
      } catch (e) {
        console.error("Failed to parse cart", e);
      }
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('bennett-cart', JSON.stringify(cart));
  }, [cart]);

  const addToTray = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(c => c.item.id === item.id);
      if (existing) {
        return prev.map(c => c.item.id === item.id ? { ...c, qty: c.qty + 1 } : c);
      }
      return [...prev, { item, qty: 1 }];
    });
  };

  const removeFromTray = (id: string) => {
    setCart(prev => prev.filter(c => c.item.id !== id));
  };

  const updateQty = (id: string, delta: number) => {
    setCart(prev => prev.map(c => {
      if (c.item.id === id) {
        const newQty = Math.max(0, c.qty + delta);
        return { ...c, qty: newQty };
      }
      return c;
    }).filter(c => c.qty > 0));
  };

  const clearCart = () => setCart([]);

  const totalItems = cart.reduce((acc, curr) => acc + curr.qty, 0);
  const totalPrice = cart.reduce((acc, curr) => acc + (curr.item.price * curr.qty), 0);

  return (
    <CartContext.Provider value={{ cart, addToTray, removeFromTray, updateQty, clearCart, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
