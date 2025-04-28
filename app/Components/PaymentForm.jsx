'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from './CartProvider';

const PaymentForm = () => {
  const router = useRouter();
  const { cartItems, cartTotal, clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [localCartItems, setLocalCartItems] = useState([]);
  const [localCartTotal, setLocalCartTotal] = useState(0);
  const [formData, setFormData] = useState({
    cardHolder: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    email: '',
    address: '',
    city: '',
    zipCode: '',
    country: ''
  });
  const [errors, setErrors] = useState({});

  // Ensure cart data is loaded even if coming directly to this page
  useEffect(() => {
    // Log initial state
    console.log("Initial cart items from context:", cartItems);
    console.log("Initial cart total from context:", cartTotal);
    
    // If we have cartItems from context, use those
    if (cartItems && cartItems.length > 0) {
      setLocalCartItems(cartItems);
      setLocalCartTotal(cartTotal);
      console.log("Using cart items from context");
    } else {
      // Try to load from localStorage as a fallback
      if (typeof window !== 'undefined') {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
          try {
            const parsedCart = JSON.parse(savedCart);
            console.log("Loaded cart from localStorage:", parsedCart);
            setLocalCartItems(parsedCart);
            // Calculate cart total
            const total = parsedCart.reduce(
              (sum, item) => sum + item.price * item.quantity,
              0
            );
            setLocalCartTotal(total);
            console.log("Calculated total from localStorage:", total);
          } catch (e) {
            console.error('Failed to parse cart from localStorage', e);
          }
        } else {
          console.log("No cart found in localStorage");
        }
      }
    }
  }, [cartItems, cartTotal]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear the specific error when the user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Basic validations
    if (!formData.cardHolder.trim()) newErrors.cardHolder = 'Cardholder name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    
    if (!formData.cardNumber.trim()) newErrors.cardNumber = 'Card number is required';
    else if (!/^\d{16}$/.test(formData.cardNumber.replace(/\s/g, ''))) newErrors.cardNumber = 'Card number must be 16 digits';
    
    if (!formData.expiryDate.trim()) newErrors.expiryDate = 'Expiry date is required';
    else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(formData.expiryDate)) newErrors.expiryDate = 'Use MM/YY format';
    
    if (!formData.cvv.trim()) newErrors.cvv = 'CVV is required';
    else if (!/^\d{3,4}$/.test(formData.cvv)) newErrors.cvv = 'CVV must be 3 or 4 digits';
    
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.zipCode.trim()) newErrors.zipCode = 'ZIP code is required';
    if (!formData.country.trim()) newErrors.country = 'Country is required';
    
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      clearCart();
      router.push('/checkout/success');
    }, 1500);
  };

  // Format card number with spaces
  const formatCardNumber = (e) => {
    const input = e.target;
    let { value } = input;
    value = value.replace(/\D/g, '').substring(0, 16);
    
    // Format with spaces after every 4 digits
    if (value.length > 0) {
      value = value.match(/.{1,4}/g).join(' ');
    }
    
    input.value = value;
    handleChange(e);
  };
  
  // Format expiry date as MM/YY
  const formatExpiryDate = (e) => {
    const input = e.target;
    let { value } = input;
    value = value.replace(/\D/g, '').substring(0, 4);
    
    if (value.length > 2) {
      value = value.substring(0, 2) + '/' + value.substring(2);
    }
    
    input.value = value;
    handleChange(e);
  };

  // Calculate totals
  const shippingCost = 150;
  const taxRate = 0.07;
  const taxAmount = localCartTotal * taxRate;
  const orderTotal = localCartTotal + shippingCost + taxAmount;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-black">Checkout</h1>
      
      <div className="grid md:grid-cols-5 gap-6">
        {/* Left side - Order Summary */}
        <div className="md:col-span-2 bg-gray-50 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-4 text-black">Order Summary</h2>
          
          {localCartItems.length > 0 ? (
            <>
              <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                {localCartItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 border-b pb-2">
                    <div className="w-10 h-10 bg-gray-200 rounded flex-shrink-0">
                      {item.image && <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded" />}
                    </div>
                    <div className="flex-grow">
                      <p className="text-sm font-medium text-black">{item.name}</p>
                      <p className="text-xs text-black">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-medium text-black">Rs {(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-black">
                  <span>Subtotal</span>
                  <span>Rs {localCartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-black">
                  <span>Shipping</span>
                  <span>Rs {shippingCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-black">
                  <span>Tax</span>
                  <span>Rs {taxAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-base mt-3 pt-2 border-t text-black">
                  <span>Total</span>
                  <span>Rs {orderTotal.toFixed(2)}</span>
                </div>
              </div>
            </>
          ) : (
            <p className="text-black">Your cart is empty</p>
          )}
        </div>
        
        {/* Right side - Payment Form */}
        <div className="md:col-span-3">
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3 text-black">Payment Details</h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1 text-black" htmlFor="email">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className={`w-full px-3 py-2 border rounded-md text-black ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  style={{ color: 'black', '::placeholder': { color: 'black' } }}
                />
                {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1 text-black" htmlFor="cardHolder">
                  Cardholder Name
                </label>
                <input
                  id="cardHolder"
                  name="cardHolder"
                  type="text"
                  className={`w-full px-3 py-2 border rounded-md text-black ${errors.cardHolder ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="John Smith"
                  value={formData.cardHolder}
                  onChange={handleChange}
                  style={{ color: 'black', '::placeholder': { color: 'black' } }}
                />
                {errors.cardHolder && <p className="mt-1 text-xs text-red-500">{errors.cardHolder}</p>}
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1 text-black" htmlFor="cardNumber">
                  Card Number
                </label>
                <input
                  id="cardNumber"
                  name="cardNumber"
                  type="text"
                  className={`w-full px-3 py-2 border rounded-md text-black ${errors.cardNumber ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="1234 5678 9012 3456"
                  value={formData.cardNumber}
                  onChange={(e) => formatCardNumber(e)}
                  style={{ color: 'black', '::placeholder': { color: 'black' } }}
                />
                {errors.cardNumber && <p className="mt-1 text-xs text-red-500">{errors.cardNumber}</p>}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-black" htmlFor="expiryDate">
                    Expiry Date
                  </label>
                  <input
                    id="expiryDate"
                    name="expiryDate"
                    type="text"
                    className={`w-full px-3 py-2 border rounded-md text-black ${errors.expiryDate ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="MM/YY"
                    value={formData.expiryDate}
                    onChange={(e) => formatExpiryDate(e)}
                    style={{ color: 'black', '::placeholder': { color: 'black' } }}
                  />
                  {errors.expiryDate && <p className="mt-1 text-xs text-red-500">{errors.expiryDate}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-black" htmlFor="cvv">
                    CVV
                  </label>
                  <input
                    id="cvv"
                    name="cvv"
                    type="text"
                    className={`w-full px-3 py-2 border rounded-md text-black ${errors.cvv ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="123"
                    maxLength="4"
                    value={formData.cvv}
                    onChange={handleChange}
                    style={{ color: 'black', '::placeholder': { color: 'black' } }}
                  />
                  {errors.cvv && <p className="mt-1 text-xs text-red-500">{errors.cvv}</p>}
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3 text-black">Billing Address</h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1 text-black" htmlFor="address">
                  Address
                </label>
                <input
                  id="address"
                  name="address"
                  type="text"
                  className={`w-full px-3 py-2 border rounded-md text-black ${errors.address ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="123 Main St"
                  value={formData.address}
                  onChange={handleChange}
                  style={{ color: 'black', '::placeholder': { color: 'black' } }}
                />
                {errors.address && <p className="mt-1 text-xs text-red-500">{errors.address}</p>}
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-black" htmlFor="city">
                    City
                  </label>
                  <input
                    id="city"
                    name="city"
                    type="text"
                    className={`w-full px-3 py-2 border rounded-md text-black ${errors.city ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="New York"
                    value={formData.city}
                    onChange={handleChange}
                    style={{ color: 'black', '::placeholder': { color: 'black' } }}
                  />
                  {errors.city && <p className="mt-1 text-xs text-red-500">{errors.city}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-black" htmlFor="zipCode">
                    ZIP Code
                  </label>
                  <input
                    id="zipCode"
                    name="zipCode"
                    type="text"
                    className={`w-full px-3 py-2 border rounded-md text-black ${errors.zipCode ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="10001"
                    value={formData.zipCode}
                    onChange={handleChange}
                    style={{ color: 'black', '::placeholder': { color: 'black' } }}
                  />
                  {errors.zipCode && <p className="mt-1 text-xs text-red-500">{errors.zipCode}</p>}
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1 text-black" htmlFor="country">
                  Country
                </label>
                <select
                  id="country"
                  name="country"
                  className={`w-full px-3 py-2 border rounded-md text-black ${errors.country ? 'border-red-500' : 'border-gray-300'}`}
                  value={formData.country}
                  onChange={handleChange}
                  style={{ color: 'black' }}
                >
                  <option value="" className="text-black">Select Country</option>
                  <option value="USA" className="text-black">United States</option>
                  <option value="CAN" className="text-black">Canada</option>
                  <option value="UK" className="text-black">United Kingdom</option>
                  <option value="AUS" className="text-black">Australia</option>
                  <option value="GER" className="text-black">Germany</option>
                  <option value="FRA" className="text-black">France</option>
                </select>
                {errors.country && <p className="mt-1 text-xs text-red-500">{errors.country}</p>}
              </div>
            </div>
            
            <button
              type="submit"
              disabled={isProcessing || localCartItems.length === 0}
              className={`w-full py-3 px-4 rounded-md text-white font-medium 
                ${isProcessing || localCartItems.length === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
              {isProcessing ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                `Pay Rs ${localCartItems.length > 0 ? orderTotal.toFixed(2) : '0.00'}`
              )}
            </button>
            
            <p className="text-xs text-center mt-3 text-black">
              Your payment information is encrypted and secure.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PaymentForm;