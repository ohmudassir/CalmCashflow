import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export const useCategories = () => {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch all categories
  const fetchCategories = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name')

      if (error) throw error
      setCategories(data || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Setup real-time subscription
  useEffect(() => {
    // Initial fetch
    fetchCategories()

    // Setup real-time subscription for categories
    const categoriesChannel = supabase
      .channel('public:categories')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to all events (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'categories',
        },
        (payload) => {
          console.log('Category change detected:', payload)
          // Re-fetch data to update UI
          fetchCategories()
        }
      )
      .subscribe()

    // Cleanup on unmount
    return () => {
      supabase.removeChannel(categoriesChannel)
    }
  }, [])

  // Get categories by type
  const getCategoriesByType = (type) => {
    return categories.filter(cat => 
      cat.type === type || cat.type === 'both'
    )
  }

  // Get income categories
  const getIncomeCategories = () => {
    return getCategoriesByType('income')
  }

  // Get expense categories
  const getExpenseCategories = () => {
    return getCategoriesByType('expense')
  }

  // Add new category
  const addCategory = async (categoryData) => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .insert([categoryData])
        .select()

      if (error) throw error
      
      // The real-time subscription will handle the UI update
      console.log('Category added successfully:', data[0])
      return data[0]
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  // Update category
  const updateCategory = async (id, updates) => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .update(updates)
        .eq('id', id)
        .select()

      if (error) throw error
      
      // The real-time subscription will handle the UI update
      console.log('Category updated successfully:', data[0])
      return data[0]
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  // Delete category
  const deleteCategory = async (id) => {
    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id)

      if (error) throw error
      
      // The real-time subscription will handle the UI update
      console.log('Category deleted successfully:', id)
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  return {
    categories,
    loading,
    error,
    getCategoriesByType,
    getIncomeCategories,
    getExpenseCategories,
    addCategory,
    updateCategory,
    deleteCategory
  }
} 