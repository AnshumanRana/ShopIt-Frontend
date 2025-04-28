import React from 'react';
import Link from 'next/link';
import { UserButton } from '@clerk/nextjs';
import { useCart } from './CartProvider'; // Import the cart context hook

export default function ClientNavbar() {
  // Use the cart context for the cart button
  const { cartCount, openCart } = useCart(); // Import openCart from context
  
  return (
    <nav className="backdrop-filter backdrop-blur-md bg-white bg-opacity-20 border-b border-white border-opacity-10 shadow-sm py-4 relative">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-blue-600">ShopIT</Link>
        
        <div className="hidden md:flex items-center space-x-6">
          <h1 className="text-3xl font-bold text-gray-800">Happy Shopping</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Cart button - now calls openCart function instead of navigating */}
          <button 
            onClick={openCart}
            className="text-gray-700 hover:text-blue-600 flex items-center"
          >
            <span className="flex items-center">
              <div className="relative">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="ml-1">Cart</span>
            </span>
          </button>
          <UserButton afterSignOutUrl="/sign-in" />
        </div>
      </div>
    </nav>
  );
}