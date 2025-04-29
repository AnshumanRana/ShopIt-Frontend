'use client'

import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState, useEffect } from 'react'

// Zod schema for product
const productSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  description: z.string().optional(),
  subcategoryId: z.string().min(1, 'Subcategory is required'),
  price: z
    .number({ invalid_type_error: 'Price must be a number' })
    .min(0, 'Price must be positive'),
})

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://causal-scarab-455004-u9.df.r.appspot.com/api';

export default function ProductPage() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [subcategories, setSubcategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('')
  const [filteredSubcategories, setFilteredSubcategories] = useState([])
  const [editingIndex, setEditingIndex] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState('')

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(productSchema),
  })
  
  // Watch for category selection to filter subcategories
  const watchSelectedCategory = watch('selectedCategory')
  
  // Load data on component mount
  useEffect(() => {
    fetchCategories()
    fetchSubcategories()
    fetchProducts()
  }, [])
  
  // Filter subcategories when category changes
  useEffect(() => {
    if (selectedCategory) {
      const filteredSubs = subcategories.filter(
        sub => sub.category && sub.category.id === parseInt(selectedCategory)
      )
      setFilteredSubcategories(filteredSubs)
      
      // Clear subcategory selection when category changes
      setValue('subcategoryId', '')
    } else {
      setFilteredSubcategories([])
    }
  }, [selectedCategory, subcategories, setValue])
  
  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_URL}/categories`)
      if (!response.ok) {
        throw new Error('Failed to fetch categories')
      }
      const data = await response.json()
      setCategories(data)
    } catch (err) {
      console.error('Error fetching categories:', err)
      setError('Failed to load categories. Please try again later.')
    }
  }
  
  const fetchSubcategories = async () => {
    try {
      const response = await fetch(`${API_URL}/subcategories`)
      if (!response.ok) {
        throw new Error('Failed to fetch subcategories')
      }
      const data = await response.json()
      setSubcategories(data)
    } catch (err) {
      console.error('Error fetching subcategories:', err)
      setError('Failed to load subcategories. Please try again later.')
    }
  }
  
  const fetchProducts = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_URL}/products`)
      if (!response.ok) {
        throw new Error('Failed to fetch products')
      }
      const data = await response.json()
      setProducts(data)
      setError(null)
    } catch (err) {
      console.error('Error fetching products:', err)
      setError('Failed to load products. Please try again later.')
    } finally {
      setLoading(false)
    }
  }
  
  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value)
  }
  
  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImageFile(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const onSubmit = async (data) => {
    try {
      // Create FormData for multipart/form-data request
      const formData = new FormData()
      
      // Convert product data to JSON and add to FormData
      const productData = {
        name: data.name,
        description: data.description || '',
        price: data.price,
        subcategoryId: Number(data.subcategoryId)
      }
      
      formData.append('product', JSON.stringify(productData))
      
      // Add image if selected
      if (imageFile) {
        formData.append('image', imageFile)
      }
      
      if (editingIndex !== null) {
        // Update existing product
        const productId = products[editingIndex].id
        const response = await fetch(`${API_URL}/products/${productId}`, {
          method: 'PUT',
          body: formData,
        })

        if (!response.ok) {
          throw new Error('Failed to update product')
        }

        // Fetch all products again to ensure we have the latest data
        await fetchProducts()
        setEditingIndex(null)
      } else {
        // Create new product
        const response = await fetch(`${API_URL}/products`, {
          method: 'POST',
          body: formData,
        })

        if (!response.ok) {
          throw new Error('Failed to create product')
        }

        // Fetch all products again to ensure we have the latest data
        await fetchProducts()
      }
      
      // Reset form and state
      reset()
      setSelectedCategory('')
      setImageFile(null)
      setImagePreview('')
      setError(null)
    } catch (err) {
      console.error('Error saving product:', err)
      setError('Failed to save product. Please try again.')
    }
  }

  const handleEdit = (index) => {
    const product = products[index]
    
    // Find the category ID for the product's subcategory
    const categoryId = product.subcategory?.category?.id.toString() || ''
    
    setValue('name', product.name)
    setValue('description', product.description || '')
    setValue('price', product.price)
    setSelectedCategory(categoryId)
    
    // Need to wait for filtered subcategories to update
    setTimeout(() => {
      setValue('subcategoryId', product.subcategory?.id.toString() || '')
    }, 0)
    
    if (product.imageUrl) {
      setImagePreview(product.imageUrl)
    } else {
      setImagePreview('')
    }
    
    setEditingIndex(index)
  }

  const handleDelete = async (index) => {
    try {
      const productId = products[index].id
      const response = await fetch(`${API_URL}/products/${productId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete product')
      }

      // Fetch all products again to ensure we have the latest data
      await fetchProducts()
      
      if (editingIndex === index) {
        reset()
        setSelectedCategory('')
        setImageFile(null)
        setImagePreview('')
        setEditingIndex(null)
      }
      
      setError(null)
    } catch (err) {
      console.error('Error deleting product:', err)
      setError('Failed to delete product. Please try again.')
    }
  }

  // Get category name by subcategory ID
  const getCategoryNameBySubcategoryId = (subcategoryId) => {
    const subcategory = subcategories.find(sub => sub.id === subcategoryId)
    return subcategory?.category?.name || 'Unknown'
  }

  return (
    <div className="flex justify-center items-center min-h-screen p-4 bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-black">
          {editingIndex !== null ? 'Edit Product' : 'Add Product'}
        </h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block mb-1 text-black">Product Name</label>
            <input
              {...register('name')}
              className="w-full border border-black p-2 rounded text-black"
              disabled={isSubmitting}
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}
          </div>
          
          <div>
            <label className="block mb-1 text-black">Description (optional)</label>
            <textarea
              {...register('description')}
              className="w-full border border-black p-2 rounded text-black"
              rows={3}
              disabled={isSubmitting}
            />
          </div>
          
          <div>
            <label className="block mb-1 text-black">Category</label>
            <select
              value={selectedCategory}
              onChange={handleCategoryChange}
              className="w-full border border-black p-2 rounded text-black"
              disabled={isSubmitting}
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block mb-1 text-black">Subcategory</label>
            <select
              {...register('subcategoryId')}
              className="w-full border border-black p-2 rounded text-black"
              disabled={!selectedCategory || isSubmitting}
            >
              <option value="">Select Subcategory</option>
              {filteredSubcategories.map((sub) => (
                <option key={sub.id} value={sub.id}>
                  {sub.name}
                </option>
              ))}
            </select>
            {errors.subcategoryId && (
              <p className="text-red-500 text-sm">{errors.subcategoryId.message}</p>
            )}
          </div>

          <div>
            <label className="block mb-1 text-black">Price (₹)</label>
            <input
              type="number"
              step="0.01"
              {...register('price', { valueAsNumber: true })}
              className="w-full border border-black p-2 rounded text-black"
              disabled={isSubmitting}
            />
            {errors.price && (
              <p className="text-red-500 text-sm">{errors.price.message}</p>
            )}
          </div>
          
          <div>
            <label className="block mb-1 text-black">Product Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full border border-black p-2 rounded text-black"
              disabled={isSubmitting}
            />
            {imagePreview && (
              <div className="mt-2">
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  className="max-h-40 rounded border"
                />
              </div>
            )}
          </div>

          <button
            type="submit"
            className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 w-full disabled:bg-gray-400"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Processing...' : editingIndex !== null ? 'Update Product' : 'Add Product'}
          </button>
        </form>

        <h3 className="text-lg font-semibold mt-6 mb-2 text-black">Product List</h3>
        {loading ? (
          <p>Loading products...</p>
        ) : products.length === 0 ? (
          <p>No products found. Add one above.</p>
        ) : (
          <div className="space-y-3">
            {products.map((product, idx) => (
              <div
                key={product.id}
                className="border border-gray-300 rounded-lg p-4 flex items-center justify-between bg-gray-50"
              >
                <div className="text-black flex items-center">
                  {product.imageUrl && (
                    <img 
                      src={product.imageUrl} 
                      alt={product.name} 
                      className="w-16 h-16 object-cover rounded mr-3"
                    />
                  )}
                  <div>
                    <p className="font-medium">{product.name}</p>
                    {product.description && (
                      <p className="text-sm text-gray-600 line-clamp-1">{product.description}</p>
                    )}
                    <p className="text-sm text-gray-600">
                      {product.subcategory?.category?.name || 'Unknown'} &gt; {product.subcategory?.name || 'Unknown'}
                    </p>
                    <p className="text-sm font-semibold">₹{product.price}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(idx)}
                    className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(idx)}
                    className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}