'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import CartContext from './CartContext';

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  // Move useRouter outside of conditional
  const router = useRouter();

  // Set mounted state when component mounts
  useEffect(() => {
    setMounted(true);
  }, []);

  // Calculate cart count
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  // Calculate cart total
  const cartTotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  // Load cart from localStorage on initial render
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        try {
          setCartItems(JSON.parse(savedCart));
        } catch (e) {
          console.error('Failed to parse cart from localStorage', e);
        }
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
 // In CartProvider.jsx, update the useEffect for loading from localStorage
useEffect(() => {
  if (typeof window !== 'undefined') {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        console.log("Loading cart from localStorage:", parsedCart);
        setCartItems(parsedCart);
      } catch (e) {
        console.error('Failed to parse cart from localStorage', e);
      }
    }
  }
}, []); // Only run on mount

  // Cart functions
  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  const addItem = (product) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      
      if (existingItem) {
        // Update quantity if product already exists in cart
        return prevItems.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      } else {
        // Add new product to cart
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });
  };

  const removeItem = (productId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  const updateItemQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeItem(productId);
      return;
    }
    
    setCartItems(prevItems => 
      prevItems.map(item => 
        item.id === productId 
          ? { ...item, quantity: newQuantity } 
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
    setIsOpen(false);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('cart');
    }
  };

  // Custom checkout function that redirects to the payment page
  const handleCheckout = useCallback(() => {
    if (cartItems.length === 0) {
      alert('Your cart is empty!');
      return;
    }
    
    // Close the cart
    closeCart();
    
    // Navigate to custom payment page
    if (mounted) {
      router.push('checkout/payment');
    }
  }, [cartItems.length, mounted, router]);

  // Context value
  const value = {
    cartItems,
    cartCount,
    cartTotal,
    isOpen,
    openCart,
    closeCart,
    addItem,
    removeItem,
    updateItemQuantity,
    clearCart,
    handleCheckout
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// Re-export the useCart hook for convenience
export { useCart } from './CartContext';