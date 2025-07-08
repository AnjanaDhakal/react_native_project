import React, { createContext, useContext, useState, useEffect } from 'react';
import { todoAPI } from '@/lib/todoApi';
import { useAuth } from './AuthContext';

const TodoContext = createContext({});

export function TodoProvider({ children }) {
  const [todos, setTodos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  // Fetch todos when user changes
  useEffect(() => {
    if (user?.id) {
      fetchTodos();
    } else {
      setTodos([]);
    }
  }, [user?.id]);

  const fetchTodos = async () => {
    if (!user?.id) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const fetchedTodos = await todoAPI.getTodos(user.id);
      setTodos(fetchedTodos);
    } catch (error) {
      console.error('Failed to fetch todos:', error);
      setError('Failed to load todos');
      // Fallback to local storage for offline functionality
      loadLocalTodos();
    } finally {
      setIsLoading(false);
    }
  };

  const loadLocalTodos = () => {
    try {
      // For demo purposes, create some sample todos
      const sampleTodos = [
        {
          id: '1',
          title: 'Review inventory levels',
          description: 'Check stock levels for all products and reorder if necessary',
          completed: false,
          priority: 'high',
          dueDate: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
          category: 'inventory',
          userId: user?.id,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '2',
          title: 'Update product descriptions',
          description: 'Improve product descriptions for better customer understanding',
          completed: false,
          priority: 'medium',
          dueDate: new Date(Date.now() + 172800000).toISOString(), // Day after tomorrow
          category: 'marketing',
          userId: user?.id,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '3',
          title: 'Process pending orders',
          description: 'Review and process all pending customer orders',
          completed: true,
          priority: 'high',
          dueDate: new Date().toISOString(), // Today
          category: 'orders',
          userId: user?.id,
          createdAt: new Date(Date.now() - 86400000).toISOString(), // Yesterday
          updatedAt: new Date().toISOString(),
        },
      ];
      setTodos(sampleTodos);
    } catch (error) {
      console.error('Failed to load local todos:', error);
    }
  };

  const createTodo = async (todoData) => {
    setError(null);
    
    const newTodo = {
      id: `todo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...todoData,
      userId: user?.id,
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Optimistic update
    setTodos(prev => [newTodo, ...prev]);

    try {
      const createdTodo = await todoAPI.createTodo(newTodo);
      // Update with server response
      setTodos(prev => prev.map(todo => 
        todo.id === newTodo.id ? createdTodo : todo
      ));
      return createdTodo;
    } catch (error) {
      console.error('Failed to create todo:', error);
      setError('Failed to create todo');
      // Keep the optimistic update for offline functionality
      return newTodo;
    }
  };

  const updateTodo = async (todoId, updates) => {
    setError(null);
    
    // Optimistic update
    setTodos(prev => prev.map(todo => 
      todo.id === todoId 
        ? { ...todo, ...updates, updatedAt: new Date().toISOString() }
        : todo
    ));

    try {
      const updatedTodo = await todoAPI.updateTodo(todoId, updates);
      // Update with server response
      setTodos(prev => prev.map(todo => 
        todo.id === todoId ? updatedTodo : todo
      ));
      return updatedTodo;
    } catch (error) {
      console.error('Failed to update todo:', error);
      setError('Failed to update todo');
      // Keep the optimistic update for offline functionality
    }
  };

  const deleteTodo = async (todoId) => {
    setError(null);
    
    // Optimistic update
    const todoToDelete = todos.find(todo => todo.id === todoId);
    setTodos(prev => prev.filter(todo => todo.id !== todoId));

    try {
      await todoAPI.deleteTodo(todoId);
    } catch (error) {
      console.error('Failed to delete todo:', error);
      setError('Failed to delete todo');
      // Revert optimistic update
      if (todoToDelete) {
        setTodos(prev => [...prev, todoToDelete]);
      }
    }
  };

  const toggleTodoComplete = async (todoId) => {
    const todo = todos.find(t => t.id === todoId);
    if (!todo) return;

    const newCompleted = !todo.completed;
    
    // Optimistic update
    setTodos(prev => prev.map(t => 
      t.id === todoId 
        ? { ...t, completed: newCompleted, updatedAt: new Date().toISOString() }
        : t
    ));

    try {
      await todoAPI.toggleTodoComplete(todoId, newCompleted);
    } catch (error) {
      console.error('Failed to toggle todo:', error);
      setError('Failed to update todo');
      // Revert optimistic update
      setTodos(prev => prev.map(t => 
        t.id === todoId 
          ? { ...t, completed: !newCompleted }
          : t
      ));
    }
  };

  const clearError = () => setError(null);

  const value = {
    todos,
    isLoading,
    error,
    createTodo,
    updateTodo,
    deleteTodo,
    toggleTodoComplete,
    refreshTodos: fetchTodos,
    clearError,
  };

  return (
    <TodoContext.Provider value={value}>
      {children}
    </TodoContext.Provider>
  );
}

export const useTodos = () => {
  const context = useContext(TodoContext);
  if (!context) {
    throw new Error('useTodos must be used within a TodoProvider');
  }
  return context;
};