import React, { useState } from 'react';
import ClientNavbar from './ClientNavbar';
import ClientSidebar from './ClientSidebar';
import ProductGrid from './ProductGrid';
import { CartProvider } from './CartProvider';


export default function ClientLayout({ children }) {
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [isProductView, setIsProductView] = useState(false);

  // Function to handle subcategory selection and product data
  const handleSubcategorySelect = (subcategoryName, products) => {
    console.log(`Selected subcategory: ${subcategoryName} with ${products.length} products`);
    setSelectedSubcategory(subcategoryName);
    setSelectedProducts(products);
    setIsProductView(true);
  };

  return (
    <CartProvider>
    
      <div 
        className="min-h-screen bg-cover bg-center relative"
        style={{ backgroundImage: "url('/clientbg.jpg')" }}
      >
        <div className="absolute inset-0 bg-opacity-70"></div>
        <div className="relative min-h-screen">
          <ClientNavbar />
          <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row gap-6">
              <ClientSidebar onSubcategorySelect={handleSubcategorySelect} />
              <main className="flex-1">
                {isProductView ? (
                  <ProductGrid 
                    products={selectedProducts} 
                    subcategoryName={selectedSubcategory} 
                  />
                ) : (
                  children
                )}
              </main>
            </div>
          </div>
        </div>
      </div>
      </CartProvider>
  );
}