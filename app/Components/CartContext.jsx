'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

// Create the cart context
const CartContext = createContext();

// Custom hook to use the cart context
export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

// Export the context for direct access if needed
export default CartContext;