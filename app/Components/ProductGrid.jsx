import React, { useState } from 'react';
import { useCart } from './CartProvider'; // Import the cart context hook

export default function ProductGrid({ products = [], subcategoryName = '' }) {
  const [sortBy, setSortBy] = useState('default');
  
  // Update to use the correct function names from CartProvider
  const { 
    cartItems, // changed from cart
    isOpen, // changed from showCart 
    openCart, // will use this instead of toggleCart
    closeCart, // will use this for closing
    addItem, // changed from addToCart
    removeItem, // changed from removeFromCart
    updateItemQuantity, // changed from updateQuantity
    cartTotal, // changed from calculateTotal
    handleCheckout 
  } = useCart();

  // Toggle cart function since your component uses it
  const toggleCart = () => {
    if (isOpen) {
      closeCart();
    } else {
      openCart();
    }
  };

  // Sort products based on the selected option
  const sortProducts = (products, sortOption) => {
    switch (sortOption) {
      case 'price-low':
        return [...products].sort((a, b) => a.price - b.price);
      case 'price-high':
        return [...products].sort((a, b) => b.price - a.price);
      case 'name-asc':
        return [...products].sort((a, b) => a.name.localeCompare(b.name));
      case 'name-desc':
        return [...products].sort((a, b) => b.name.localeCompare(a.name));
      default:
        return products;
    }
  };

  // Handle sort change
  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  // Sort products whenever sortBy changes
  const displayedProducts = sortProducts(products, sortBy);

  return (
    <div className="w-full relative">
      {/* Header Section - without cart button */}
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-black">
            {subcategoryName ? subcategoryName : 'All Products'}
          </h1>
          <p className="text-black mt-1">
            {products.length} {products.length === 1 ? 'product' : 'products'} found
          </p>
        </div>

        <div className="flex items-center">
          <select
            value={sortBy}
            onChange={handleSortChange}
            className="p-2 border border-gray-300 rounded bg-white text-black"
          >
            <option value="default">Sort by: Featured</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="name-asc">Name: A to Z</option>
            <option value="name-desc">Name: Z to A</option>
          </select>
        </div>
      </div>

      {/* Cart Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-40">
          {/* Semi-transparent overlay */}
          <div className="fixed inset-0 bg-black bg-opacity-30" onClick={toggleCart}></div>
          
          {/* Left side white area with interests */}
          <div className="fixed inset-0 flex z-50">
            <div 
              className="bg-white flex-grow p-6 overflow-y-auto"
              onClick={toggleCart}
            >
              <div className="max-w-3xl mx-auto">
                <h2 className="text-2xl font-bold text-black mb-6">
                  Hey, these are the things you were interested in
                </h2>
                
                {cartItems.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Display interested items in a grid */}
                    {cartItems.map(item => (
                      <div key={`interest-${item.id}`} className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
                        <div className="w-full h-40 bg-gray-200 mb-4 rounded overflow-hidden">
                          {item.imageUrl ? (
                            <img
                              src={item.imageUrl}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="flex items-center justify-center w-full h-full text-black">
                              No Image
                            </div>
                          )}
                        </div>
                        <h3 className="font-medium text-lg text-black">{item.name}</h3>
                        <p className="text-black mb-2">Rs {item.price.toFixed(2)}</p>
                        <p className="text-sm text-black">
                          Added to cart ({item.quantity})
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-black mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                    <p className="text-black text-xl">
                      You haven't shown interest in any products yet
                    </p>
                    <p className="text-black mt-2">
                      Browse our products and add them to your cart
                    </p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Original cart drawer on the right */}
            <div 
              className="w-full max-w-md bg-white shadow-xl h-full p-4 overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4 pb-2 border-b">
                <h2 className="text-xl font-bold text-black">Your Cart</h2>
                <button onClick={toggleCart} className="text-black hover:text-gray-700">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {cartItems.length === 0 ? (
                <div className="text-center py-8">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-black mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <p className="text-black text-lg">Your cart is empty</p>
                  <button 
                    onClick={toggleCart}
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <>
                  <div className="space-y-4 mb-4">
                    {cartItems.map(item => (
                      <div key={item.id} className="flex items-center border-b pb-4">
                        <div className="w-16 h-16 bg-gray-200 mr-4 rounded overflow-hidden">
                          {item.imageUrl ? (
                            <img
                              src={item.imageUrl}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="flex items-center justify-center w-full h-full text-black text-xs">
                              No Image
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-sm font-medium text-black">{item.name}</h3>
                          <p className="text-sm text-black">Rs {item.price.toFixed(2)}</p>
                          <div className="flex items-center mt-2">
                            <button 
                              onClick={() => updateItemQuantity(item.id, item.quantity - 1)}
                              className="w-6 h-6 bg-blue-500 rounded-l flex items-center justify-center hover:bg-blue-300"
                            >
                              -
                            </button>
                            <span className="w-10 text-center text-black">{item.quantity}</span>
                            <button 
                              onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                              className="w-6 h-6 bg-blue-500 rounded-r flex items-center justify-center hover:bg-blue-300"
                            >
                              +
                            </button>
                          </div>
                        </div>
                        <div className="flex flex-col items-end ml-2">
                          <span className="font-medium text-black">Rs {(item.price * item.quantity).toFixed(2)}</span>
                          <button 
                            onClick={() => removeItem(item.id)}
                            className="text-red-500 hover:text-red-700 text-sm mt-2"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-lg font-medium text-black">Total:</span>
                      <span className="text-xl font-bold text-black">Rs {cartTotal.toFixed(2)}</span>
                    </div>
                    <button 
                      onClick={handleCheckout}
                      className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
                    >
                      Proceed to Checkout
                    </button>
                    <button 
                      onClick={toggleCart}
                      className="w-full py-2 mt-2 text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Continue Shopping
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* No Products State */}
      {products.length === 0 && (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h3 className="text-lg font-semibold text-black mb-2">No Products Found</h3>
          <p className="text-black">
            {subcategoryName
              ? `There are no products available in ${subcategoryName} at the moment.`
              : 'Please select a category or subcategory to view products.'}
          </p>
        </div>
      )}

      {/* Product Grid */}
      {products.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayedProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-48 bg-gray-200 relative">
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full text-black">
                    No Image Available
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-black mb-1">{product.name}</h3>
                <p className="text-black text-sm mb-2 line-clamp-2 h-12 overflow-hidden">
                  {product.description}
                </p>
                <div className="flex justify-between items-center mt-2">
                  <div className="flex items-baseline">
                    <span className="text-lg font-bold text-black">
                      Rs {product.price ? product.price.toFixed(2) : '0.00'}
                    </span>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <span className="text-sm text-black line-through ml-2">
                        Rs {product.originalPrice.toFixed(2)}
                      </span>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <a
                      href={`/product/${product.id}`}
                      className="px-3 py-1 bg-gray-200 text-black rounded hover:bg-gray-300"
                    >
                      View
                    </a>
                    <button
                      onClick={() => addItem(product)} 
                      className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Cart
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}