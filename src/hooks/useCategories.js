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
          console.log('Real-time category event:', payload.eventType, payload)
          
          // Handle real-time updates based on event type
          if (payload.eventType === 'INSERT') {
            // New category added - add to local state if not already present
            const newCategory = payload.new
            console.log('Real-time INSERT: Adding category:', newCategory)
            setCategories(prev => {
              const exists = prev.find(cat => cat.id === newCategory.id)
              if (exists) {
                console.log('Real-time INSERT: Category already exists, skipping')
                return prev
              }
              console.log('Real-time INSERT: Adding to state')
              return [newCategory, ...prev]
            })
          } else if (payload.eventType === 'UPDATE') {
            // Category updated - update in local state
            const updatedCategory = payload.new
            console.log('Real-time UPDATE: Updating category:', updatedCategory)
            // Only update if the category doesn't already have the same data
            setCategories(prev => {
              const existing = prev.find(cat => cat.id === updatedCategory.id)
              if (existing && 
                  existing.name === updatedCategory.name && 
                  existing.icon === updatedCategory.icon && 
                  existing.color === updatedCategory.color) {
                console.log('Real-time UPDATE: Category already has same data, skipping')
                return prev
              }
              console.log('Real-time UPDATE: Updating category in state')
              return prev.map(cat => cat.id === updatedCategory.id ? updatedCategory : cat)
            })
          } else if (payload.eventType === 'DELETE') {
            // Category deleted - remove from local state
            const deletedCategory = payload.old
            console.log('Real-time DELETE: Removing category:', deletedCategory)
            setCategories(prev => {
              const exists = prev.find(cat => cat.id === deletedCategory.id)
              if (!exists) {
                console.log('Real-time DELETE: Category not found in state, skipping')
                return prev
              }
              console.log('Real-time DELETE: Removing category from state')
              return prev.filter(cat => cat.id !== deletedCategory.id)
            })
          }
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
      
      // Update local state immediately for dynamic UI
      const newCategory = data[0]
      setCategories(prev => {
        // Check if category already exists to prevent duplicates
        const exists = prev.find(cat => cat.id === newCategory.id)
        if (exists) return prev
        return [newCategory, ...prev]
      })
      
      console.log('Category added successfully:', newCategory)
      return newCategory
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
      
      // Update local state immediately for dynamic UI
      const updatedCategory = data[0]
      setCategories(prev => prev.map(cat => 
        cat.id === id ? updatedCategory : cat
      ))
      
      console.log('Category updated successfully:', updatedCategory)
      return updatedCategory
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
      
      // Update local state immediately for dynamic UI
      setCategories(prev => prev.filter(cat => cat.id !== id))
      
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
    deleteCategory,
    fetchCategories
  }
} 