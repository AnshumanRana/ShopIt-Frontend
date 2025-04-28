'use client'

import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState, useEffect } from 'react'

// Zod schema
const subcategorySchema = z.object({
  name: z.string().min(1, 'Subcategory name is required'),
  categoryId: z.string().min(1, 'Please select a parent category'),
})

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

export default function SubcategoryPage() {
  const [subcategories, setSubcategories] = useState([])
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
    resolver: zodResolver(subcategorySchema),
  })

  // Load data on component mount
  useEffect(() => {
    fetchCategories()
    fetchSubcategories()
  }, [])

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
      setLoading(true)
      const response = await fetch(`${API_URL}/subcategories`)
      if (!response.ok) {
        throw new Error('Failed to fetch subcategories')
      }
      const data = await response.json()
      setSubcategories(data)
      setError(null)
    } catch (err) {
      console.error('Error fetching subcategories:', err)
      setError('Failed to load subcategories. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (data) => {
    try {
      if (editingIndex !== null) {
        // Update existing subcategory
        const subcategoryId = subcategories[editingIndex].id
        const response = await fetch(`${API_URL}/subcategories/${subcategoryId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: data.name,
            categoryId: Number(data.categoryId)
          }),
        })

        if (!response.ok) {
          throw new Error('Failed to update subcategory')
        }

        // Fetch all subcategories again to ensure we have the latest data
        await fetchSubcategories()
        setEditingIndex(null)
      } else {
        // Create new subcategory
        const response = await fetch(`${API_URL}/subcategories`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: data.name,
            categoryId: Number(data.categoryId)
          }),
        })

        if (!response.ok) {
          throw new Error('Failed to create subcategory')
        }

        // Fetch all subcategories again to ensure we have the latest data
        await fetchSubcategories()
      }
      reset()
      setError(null)
    } catch (err) {
      console.error('Error saving subcategory:', err)
      setError('Failed to save subcategory. Please try again.')
    }
  }

  const handleEdit = (index) => {
    const subcategory = subcategories[index]
    setValue('name', subcategory.name)
    setValue('categoryId', subcategory.category.id.toString())
    setEditingIndex(index)
  }

  const handleDelete = async (index) => {
    try {
      const subcategoryId = subcategories[index].id
      const response = await fetch(`${API_URL}/subcategories/${subcategoryId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete subcategory')
      }

      // Fetch all subcategories again to ensure we have the latest data
      await fetchSubcategories()
      
      if (editingIndex === index) {
        reset()
        setEditingIndex(null)
      }
      setError(null)
    } catch (err) {
      console.error('Error deleting subcategory:', err)
      setError('Failed to delete subcategory. Please try again.')
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen p-4">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-black">
          {editingIndex !== null ? 'Edit Subcategory' : 'Add Subcategory'}
        </h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block mb-1 text-black">Subcategory Name</label>
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
            <label className="block mb-1 text-black">Parent Category</label>
            <select
              {...register('categoryId')}
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
            {errors.categoryId && (
              <p className="text-red-500 text-sm">
                {errors.categoryId.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 w-full disabled:bg-gray-400"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Processing...' : editingIndex !== null ? 'Update Subcategory' : 'Add Subcategory'}
          </button>
        </form>

        <h3 className="text-lg font-semibold mt-6 mb-2 text-black">
          Subcategory List
        </h3>
        {loading ? (
          <p>Loading subcategories...</p>
        ) : subcategories.length === 0 ? (
          <p>No subcategories found. Add one above.</p>
        ) : (
          <ul className="space-y-2">
            {subcategories.map((sub, idx) => (
              <li
                key={sub.id}
                className="flex justify-between items-center border border-black rounded p-2"
              >
                <div className="text-black">
                  {sub.name}{' '}
                  <span className="text-gray-500">
                    (under {sub.category.name})
                  </span>
                </div>
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