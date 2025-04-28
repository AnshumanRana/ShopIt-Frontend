// app/Components/ClientSidebar.jsx
import React, { useState, useEffect } from 'react';

// Updated to include products in the callback
export default function ClientSidebar({ onSubcategorySelect = (subcategoryName, products) => {} }) {
  const [categories, setCategories] = useState([]);
  const [expandedCategories, setExpandedCategories] = useState({});
  const [subcategories, setSubcategories] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all categories when component mounts
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        console.log("Fetching categories...");
        setLoading(true);
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch categories: ${response.status}`);
        }
        
        const data = await response.json();
        console.log("Categories fetched:", data);
        setCategories(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Toggle category expansion and fetch subcategories
  const toggleCategory = async (categoryId) => {
    console.log(`Toggling category ${categoryId}`);
    
    // Toggle expanded state
    setExpandedCategories(prev => {
      const newState = { ...prev, [categoryId]: !prev[categoryId] };
      console.log("New expanded state:", newState);
      return newState;
    });
    
    // If expanding and we don't have subcategories for this category yet, fetch them
    if (!expandedCategories[categoryId] && !subcategories[categoryId]) {
      try {
        console.log(`Fetching subcategories for category ${categoryId}...`);
        // Use the correct endpoint that filters by category ID
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/subcategories/category/${categoryId}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch subcategories: ${response.status}`);
        }
        
        const data = await response.json();
        console.log(`Subcategories for category ${categoryId} fetched:`, data);
        
        setSubcategories(prev => ({
          ...prev,
          [categoryId]: data
        }));
      } catch (err) {
        console.error(`Error fetching subcategories for category ${categoryId}:`, err);
        setError(err.message);
      }
    }
  };

  // Updated to fetch products directly and pass them to callback
  const handleSubcategoryClick = (categoryId, subcategoryName) => {
    console.log(`Subcategory clicked: ${subcategoryName} from category ${categoryId}`);
    
    // Call the API to fetch products by subcategory name
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/subcategory?name=${encodeURIComponent(subcategoryName)}`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Failed to fetch products: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log(`Products for subcategory ${subcategoryName} fetched:`, data);
        onSubcategorySelect(subcategoryName, data); // Pass both subcategory name and products data
      })
      .catch(error => {
        console.error(`Error fetching products for subcategory ${subcategoryName}:`, error);
      });
  };

  if (loading) {
    return (
      <div className="w-full md:w-64 bg-white shadow-md rounded-lg p-4">
        <p className="text-gray-500">Loading categories...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full md:w-64 bg-white shadow-md rounded-lg p-4">
        <p className="text-red-500">Error: {error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="w-full md:w-64 bg-white shadow-md rounded-lg p-4">
      <h3 className="text-lg font-semibold mb-4 text-black">Categories</h3>
      
      {/* Categories List */}
      <ul className="space-y-2">
        {categories.length === 0 ? (
          <li className="text-gray-500">No categories found</li>
        ) : (
          categories.map(category => (
            <li key={category.id} className="border-b pb-2">
              <button
                onClick={() => toggleCategory(category.id)}
                className="flex justify-between items-center w-full py-2 px-3 rounded hover:bg-gray-100 text-gray-700 text-left"
              >
                <span>{category.name}</span>
                <span>{expandedCategories[category.id] ? '▼' : '▶'}</span>
              </button>
              
              {/* Subcategories */}
              {expandedCategories[category.id] && (
                <ul className="ml-4 mt-1 space-y-1">
                  {subcategories[category.id] ? (
                    subcategories[category.id].length > 0 ? (
                      subcategories[category.id].map(subcategory => (
                        <li key={subcategory.id}>
                          <button
                            onClick={() => handleSubcategoryClick(category.id, subcategory.name)}
                            className="block w-full text-left py-1 px-3 rounded hover:bg-gray-100 text-gray-600"
                          >
                            {subcategory.name}
                          </button>
                        </li>
                      ))
                    ) : (
                      <li className="text-gray-500 text-sm ml-3">No subcategories</li>
                    )
                  ) : (
                    <li className="text-gray-500 text-sm ml-3">Loading subcategories...</li>
                  )}
                </ul>
              )}
            </li>
          ))
        )}
      </ul>
    </div>
  );
}