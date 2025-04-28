import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from '../pages/CheckoutForm'; // your CheckoutForm component

const stripePromise = loadStripe('pk_test_51RBaRIRg7fZmIID0I3NuGMO3pd6blv6oP0PAiOvUOstR9SFjVBBhxh0BQ4cTft16P8LdnyVHy34XTcBth8qMNata00lU7oF9wo'); // Your Stripe Publishable Key

export default function CheckoutPage({ orderId, amount }) {
  const [clientSecret, setClientSecret] = useState('');

  useEffect(() => {
    // Create Payment Intent when page loads
    fetch('/api/payment/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount, orderId }),
    })
      .then(res => res.json())
      .then(data => {
        setClientSecret(data.clientSecret);
      });
  }, [orderId, amount]);

  const appearance = { theme: 'stripe' };
  const options = {
    clientSecret,
    appearance,
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      {clientSecret && (
        <Elements options={options} stripe={stripePromise}>
          <CheckoutForm orderId={orderId} onPaymentSuccess={() => alert("Payment Successful!")} />
        </Elements>
      )}
    </div>
  );
}
