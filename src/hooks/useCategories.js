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
      
      // Refresh categories list
      await fetchCategories()
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
      
      // Refresh categories list
      await fetchCategories()
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
      
      // Refresh categories list
      await fetchCategories()
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  return {
    categories,
    loading,
    error,
    addCategory,
    updateCategory,
    deleteCategory,
    fetchCategories,
    getCategoriesByType,
    getIncomeCategories,
    getExpenseCategories
  }
} 