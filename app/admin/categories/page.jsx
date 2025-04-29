'use client'

import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState, useEffect } from 'react'

// Zod schema for validation
const categorySchema = z.object({
  name: z.string().min(1, 'Category name is required'),
})

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://causal-scarab-455004-u9.df.r.appspot.com';

export default function CategoryPage() {
  const [categories, setCategories] = useState([])
  const [editingIndex, setEditingIndex] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(categorySchema),
  })

  // Load categories on component mount
  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_URL}/categories`)
      if (!response.ok) {
        throw new Error('Failed to fetch categories')
      }
      const data = await response.json()
      setCategories(data)
      setError(null)
    } catch (err) {
      console.error('Error fetching categories:', err)
      setError('Failed to load categories. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (data) => {
    try {
      if (editingIndex !== null) {
        // Update existing category
        const categoryId = categories[editingIndex].id
        const response = await fetch(`${NEXT_PUBLIC_API_URL}/categories/${categoryId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        })

        if (!response.ok) {
          throw new Error('Failed to update category')
        }

        // Fetch all categories again to ensure we have the latest data
        await fetchCategories()
        setEditingIndex(null)
      } else {
        // Create new category
        const response = await fetch(`${API_URL}/categories`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        })

        if (!response.ok) {
          throw new Error('Failed to create category')
        }

        // Fetch all categories again to ensure we have the latest data
        await fetchCategories()
      }
      reset()
      setError(null)
    } catch (err) {
      console.error('Error saving category:', err)
      setError('Failed to save category. Please try again.')
    }
  }

  const handleEdit = (index) => {
    const category = categories[index]
    setValue('name', category.name)
    setEditingIndex(index)
  }

  const handleDelete = async (index) => {
    try {
      const categoryId = categories[index].id
      const response = await fetch(`${API_URL}/categories/${categoryId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete category')
      }

      // Fetch all categories again to ensure we have the latest data
      await fetchCategories()
      
      if (editingIndex === index) {
        reset()
        setEditingIndex(null)
      }
      setError(null)
    } catch (err) {
      console.error('Error deleting category:', err)
      setError('Failed to delete category. Please try again.')
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen p-4">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-black">
          {editingIndex !== null ? 'Edit Category' : 'Add Category'}
        </h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block mb-1 text-black">Category Name</label>
            <input
              {...register('name')}
              className="w-full border border-black p-2 rounded text-black"
              disabled={isSubmitting}
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}
          </div>

          <button
            type="submit"
            className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 w-full disabled:bg-gray-400"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Processing...' : editingIndex !== null ? 'Update' : 'Add Category'}
          </button>
        </form>

        <h3 className="text-lg font-semibold mt-6 mb-2 text-black">Category List</h3>
        {loading ? (
          <p>Loading categories...</p>
        ) : categories.length === 0 ? (
          <p>No categories found. Add one above.</p>
        ) : (
          <ul className="space-y-2">
            {categories.map((cat, idx) => (
              <li
                key={cat.id}
                className="text-black flex justify-between items-center border border-black rounded p-2"
              >
                <span>{cat.name}</span>
                <div className="space-x-2">
                  <button
                    onClick={() => handleEdit(idx)}
                    className="text-sm px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(idx)}
                    className="text-sm px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}