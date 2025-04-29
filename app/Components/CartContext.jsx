'use client';

import { createContext, useContext } from 'react';

// Create the cart context
const CartContext = createContext(undefined);

// Custom hook to use the cart context
export function useCart() {
  const context = useContext(CartContext);
  
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  
  return context;
}

