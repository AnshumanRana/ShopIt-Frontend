// // app/products/page.jsx
// 'use client';
// import { useEffect, useState } from 'react';
// import { useSearchParams } from 'next/navigation';
// import Link from 'next/link';

// export default function ProductsPage() {
//   const searchParams = useSearchParams();
//   const subcategoryName = searchParams.get('subcategoryName');
  
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [sortBy, setSortBy] = useState('default');
//   const [priceFilters, setPriceFilters] = useState({
//     under25: false,
//     between25And50: false,
//     between50And100: false,
//     above100: false
//   });

//   useEffect(() => {
//     const fetchProducts = async () => {
//       if (!subcategoryName) {
//         // If no subcategory name, fetch all products
//         try {
//           setLoading(true);
//           const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`);
          
//           if (!response.ok) {
//             throw new Error(`Failed to fetch products: ${response.status}`);
//           }
          
//           const data = await response.json();
//           console.log("All products fetched:", data);
//           setProducts(data);
//           setError(null);
//         } catch (err) {
//           console.error("Error fetching all products:", err);
//           setError(err.message);
//         } finally {
//           setLoading(false);
//         }
//         return;
//       }

//       try {
//         setLoading(true);
//         // Use the endpoint that accepts subcategory name
//         const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/subcategory?name=${encodeURIComponent(subcategoryName)}`);
        
//         if (!response.ok) {
//           throw new Error(`Failed to fetch products: ${response.status}`);
//         }
        
//         const data = await response.json();
//         console.log(`Products for ${subcategoryName} fetched:`, data);
//         setProducts(data);
//         setError(null);
//       } catch (err) {
//         console.error("Error fetching products:", err);
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProducts();
//   }, [subcategoryName]);

//   // Apply sorting and filtering
//   const filteredProducts = () => {
//     // First apply price filters
//     let filtered = products;
    
//     if (priceFilters.under25 || priceFilters.between25And50 || 
//         priceFilters.between50And100 || priceFilters.above100) {
//       filtered = products.filter(product => {
//         const price = product.price;
//         if (priceFilters.under25 && price < 25) return true;
//         if (priceFilters.between25And50 && price >= 25 && price < 50) return true;
//         if (priceFilters.between50And100 && price >= 50 && price < 100) return true;
//         if (priceFilters.above100 && price >= 100) return true;
//         return false;
//       });
//     }
    
//     // Then apply sorting
//     switch (sortBy) {
//       case 'price-low-high':
//         return [...filtered].sort((a, b) => a.price - b.price);
//       case 'price-high-low':
//         return [...filtered].sort((a, b) => b.price - a.price);
//       case 'name-a-z':
//         return [...filtered].sort((a, b) => a.name.localeCompare(b.name));
//       case 'name-z-a':
//         return [...filtered].sort((a, b) => b.name.localeCompare(a.name));
//       default:
//         return filtered;
//     }
//   };

//   const handlePriceFilterChange = (filter) => {
//     setPriceFilters(prev => ({
//       ...prev,
//       [filter]: !prev[filter]
//     }));
//   };

//   if (loading) {
//     return (
//       <div className="container mx-auto px-4 py-8">
//         <div className="flex justify-center items-center h-64">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="container mx-auto px-4 py-8">
//         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
//           <strong className="font-bold">Error: </strong>
//           <span className="block sm:inline">{error}</span>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <h1 className="text-3xl font-bold mb-6">
//         {subcategoryName ? `${subcategoryName} Products` : 'All Products'}
//       </h1>
      
//       <div className="flex flex-col md:flex-row gap-8">
//         {/* Sidebar Filters - Mobile Toggle */}
//         <div className="md:hidden mb-4">
//           <button className="w-full bg-blue-500 text-white py-2 px-4 rounded">
//             Toggle Filters
//           </button>
//         </div>
        
//         {/* Filters Sidebar */}
//         <div className="w-full md:w-64 bg-white shadow-md rounded-lg p-4 h-fit">
//           <div className="mb-6">
//             <h3 className="text-lg font-semibold mb-3">Sort By</h3>
//             <select 
//               className="w-full p-2 border rounded-md"
//               value={sortBy}
//               onChange={(e) => setSortBy(e.target.value)}
//             >
//               <option value="default">Default</option>
//               <option value="price-low-high">Price: Low to High</option>
//               <option value="price-high-low">Price: High to Low</option>
//               <option value="name-a-z">Name: A to Z</option>
//               <option value="name-z-a">Name: Z to A</option>
//             </select>
//           </div>
          
//           <div>
//             <h3 className="text-lg font-semibold mb-3">Price Range</h3>
//             <div className="space-y-2">
//               <div className="flex items-center">
//                 <input 
//                   id="price1" 
//                   type="checkbox" 
//                   className="mr-2"
//                   checked={priceFilters.under25}
//                   onChange={() => handlePriceFilterChange('under25')}
//                 />
//                 <label htmlFor="price1">Under $25</label>
//               </div>
//               <div className="flex items-center">
//                 <input 
//                   id="price2" 
//                   type="checkbox" 
//                   className="mr-2"
//                   checked={priceFilters.between25And50}
//                   onChange={() => handlePriceFilterChange('between25And50')}
//                 />
//                 <label htmlFor="price2">$25 to $50</label>
//               </div>
//               <div className="flex items-center">
//                 <input 
//                   id="price3" 
//                   type="checkbox" 
//                   className="mr-2"
//                   checked={priceFilters.between50And100}
//                   onChange={() => handlePriceFilterChange('between50And100')}
//                 />
//                 <label htmlFor="price3">$50 to $100</label>
//               </div>
//               <div className="flex items-center">
//                 <input 
//                   id="price4" 
//                   type="checkbox" 
//                   className="mr-2"
//                   checked={priceFilters.above100}
//                   onChange={() => handlePriceFilterChange('above100')}
//                 />
//                 <label htmlFor="price4">$100 & Above</label>
//               </div>
//             </div>
//           </div>
//         </div>
        
//         {/* Products Grid */}
//         <div className="flex-1">
//           {/* Product Count and Sort (Mobile) */}
//           <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
//             <p className="text-gray-600 mb-3 sm:mb-0">
//               {filteredProducts().length} products found
//             </p>
//             <div className="w-full sm:w-auto">
//               <select 
//                 className="w-full p-2 border rounded-md md:hidden"
//                 value={sortBy}
//                 onChange={(e) => setSortBy(e.target.value)}
//               >
//                 <option value="default">Sort: Default</option>
//                 <option value="price-low-high">Sort: Price Low to High</option>
//                 <option value="price-high-low">Sort: Price High to Low</option>
//                 <option value="name-a-z">Sort: Name A to Z</option>
//                 <option value="name-z-a">Sort: Name Z to A</option>
//               </select>
//             </div>
//           </div>
          
//           {filteredProducts().length === 0 ? (
//             <div className="bg-gray-100 p-8 rounded-lg text-center">
//               <p className="text-lg text-gray-600">No products found.</p>
//               <p className="mt-2 text-gray-500">Try adjusting your filters or search criteria.</p>
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//               {filteredProducts().map(product => (
//                 <Link href={`/products/${product.id}`} key={product.id}>
//                   <div className="border rounded-lg overflow-hidden shadow-md transition-all hover:shadow-lg bg-white h-full flex flex-col">
//                     <div className="relative h-48 bg-gray-200">
//                       {product.imageUrl ? (
//                         <img 
//                           src={product.imageUrl} 
//                           alt={product.name}
//                           className="w-full h-full object-cover"
//                         />
//                       ) : (
//                         <div className="flex items-center justify-center h-full">
//                           <span className="text-gray-400">No image</span>
//                         </div>
//                       )}
//                     </div>
//                     <div className="p-4 flex-1 flex flex-col">
//                       <h2 className="text-lg font-semibold line-clamp-2">{product.name}</h2>
//                       <p className="text-gray-600 mt-2 text-sm flex-1 line-clamp-3">{product.description}</p>
//                       <div className="mt-4">
//                         <p className="text-blue-600 font-bold text-xl">${product.price.toFixed(2)}</p>
//                         <button className="mt-3 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full transition">
//                           Add to Cart
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 </Link>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }