// app/checkout/payment/page.js
'use client';

import React from 'react';
import { CartProvider } from '../../Components/CartProvider';
import PaymentForm from '../../Components/PaymentForm';

export default function CheckoutPage() {
  return (
    <CartProvider>
      <PaymentForm />
    </CartProvider>
  );
}