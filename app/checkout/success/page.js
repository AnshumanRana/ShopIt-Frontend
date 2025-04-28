'use client';

import React from 'react';
import Link from 'next/link';

const OrderSuccessPage = () => {
  const orderNumber = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        
        <h1 className="text-3xl font-bold text-black mb-4">Thank You!</h1>
        <p className="text-xl mb-2 text-black">Your order has been confirmed</p>
        <p className="text-black mb-6">Order number: {orderNumber}</p>
        
        <div className="bg-gray-100 p-4 rounded-lg mb-6">
          <p className="mb-2 text-black">We've sent a confirmation email with order details and tracking information.</p>
          <p className="text-black">Your items will be shipped soon.</p>
        </div>
        
        <div className="flex flex-col space-y-3">
          <Link href="/orders" className="block w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
            View Order
          </Link>
          <Link href="/" className="block w-full py-3 bg-gray-200 text-black rounded-md hover:bg-gray-300 transition">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;