import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  RefreshControl,
} from 'react-native';
import { Search, Filter, Plus, SquareCheck as CheckSquare, Square, Calendar, CircleAlert as AlertCircle, Wifi, WifiOff } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import { useAuth } from '@/context/AuthContext';
import { useTodos } from '@/context/TodoContext';
import TodoCard from '@/components/TodoCard';
import TodoForm from '@/components/TodoForm';

export default function TodoManager() {
  const [searchText, setSearchText] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // all, pending, completed
  const [filterPriority, setFilterPriority] = useState('all'); // all, high, medium, low
  const [showForm, setShowForm] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const { user } = useAuth();
  const {
    todos,
    isLoading,
    error,
    createTodo,
    updateTodo,
    deleteTodo,
    toggleTodoComplete,
    refreshTodos,
    clearError,
  } = useTodos();

  // Filter todos based on search and filters
  const filteredTodos = todos.filter(todo => {
    const matchesSearch = todo.title.toLowerCase().includes(searchText.toLowerCase()) ||
                         todo.description?.toLowerCase().includes(searchText.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' ||
                         (filterStatus === 'pending' && !todo.completed) ||
                         (filterStatus === 'completed' && todo.completed);
    
    const matchesPriority = filterPriority === 'all' || todo.priority === filterPriority;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  // Sort todos: incomplete first, then by priority, then by due date
  const sortedTodos = filteredTodos.sort((a, b) => {
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    }
    
    if (a.dueDate && b.dueDate) {
      return new Date(a.dueDate) - new Date(b.dueDate);
    }
    
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  const handleCreateTodo = async (todoData) => {
    try {
      await createTodo(todoData);
    } catch (error) {
      Alert.alert('Error', 'Failed to create todo. Please try again.');
    }
  };

  const handleUpdateTodo = async (todoData) => {
    if (!editingTodo) return;
    
    try {
      await updateTodo(editingTodo.id, todoData);
      setEditingTodo(null);
    } catch (error) {
      Alert.alert('Error', 'Failed to update todo. Please try again.');
    }
  };

  const handleDeleteTodo = (todoId) => {
    Alert.alert(
      'Delete Todo',
      'Are you sure you want to delete this todo?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteTodo(todoId),
        },
      ]
    );
  };

  const handleEditTodo = (todo) => {
    setEditingTodo(todo);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingTodo(null);
  };

  const getStatusCounts = () => {
    const pending = todos.filter(todo => !todo.completed).length;
    const completed = todos.filter(todo => todo.completed).length;
    return { pending, completed, total: todos.length };
  };

  const statusCounts = getStatusCounts();

  return (
    <View className="flex-1 bg-green-50">
      {/* Header */}
      <View className="px-6 pt-12 pb-4 bg-white border-b border-gray-200">
        <View className="flex-row justify-between items-center mb-5">
          <Text className="text-3xl font-bold text-green-800">Todo Manager</Text>
          <View className="flex-row items-center">
            {error && (
              <TouchableOpacity onPress={clearError} className="mr-3 p-1">
                <WifiOff size={20} color={Colors.error} />
              </TouchableOpacity>
            )}
            <TouchableOpacity
              className="bg-green-600 rounded-xl p-3"
              onPress={() => setShowForm(true)}
            >
              <Plus size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Stats */}
        <View className="flex-row justify-around mb-5 py-4 bg-green-50 rounded-xl">
          <View className="items-center">
            <Text className="text-2xl font-bold text-green-800 mb-1">{statusCounts.total}</Text>
            <Text className="text-sm text-gray-600">Total</Text>
          </View>
          <View className="items-center">
            <Text className="text-2xl font-bold text-orange-500 mb-1">{statusCounts.pending}</Text>
            <Text className="text-sm text-gray-600">Pending</Text>
          </View>
          <View className="items-center">
            <Text className="text-2xl font-bold text-green-600 mb-1">{statusCounts.completed}</Text>
            <Text className="text-sm text-gray-600">Completed</Text>
          </View>
        </View>

        {/* Search and Filters */}
        <View className="flex-row items-center mb-4">
          <View className="flex-1 relative mr-3">
            <Search className="absolute left-3 top-3 z-10" size={20} color="#6b7280" />
            <TextInput
              className="bg-green-50 border border-gray-300 rounded-xl pl-11 pr-4 py-3 text-base text-gray-800"
              placeholder="Search todos..."
              placeholderTextColor="#6b7280"
              value={searchText}
              onChangeText={setSearchText}
            />
          </View>
          <TouchableOpacity
            className={`bg-green-50 border rounded-xl p-3 ${showFilters ? 'border-green-600 bg-green-100' : 'border-gray-300'}`}
            onPress={() => setShowFilters(!showFilters)}
          >
            <Filter size={20} color={showFilters ? Colors.primary : '#6b7280'} />
          </TouchableOpacity>
        </View>

        {/* Filter Options */}
        {showFilters && (
          <View className="bg-green-50 rounded-xl p-4 mb-2">
            <View className="mb-4">
              <Text className="text-sm font-semibold text-gray-800 mb-2">Status:</Text>
              <View className="flex-row flex-wrap gap-2">
                {[
                  { key: 'all', label: 'All' },
                  { key: 'pending', label: 'Pending' },
                  { key: 'completed', label: 'Completed' },
                ].map((option) => (
                  <TouchableOpacity
                    key={option.key}
                    className={`px-3 py-1.5 rounded-2xl border ${
                      filterStatus === option.key 
                        ? 'bg-green-600 border-green-600' 
                        : 'bg-white border-gray-300'
                    }`}
                    onPress={() => setFilterStatus(option.key)}
                  >
                    <Text className={`text-sm ${
                      filterStatus === option.key ? 'text-white font-medium' : 'text-gray-600'
                    }`}>
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View>
              <Text className="text-sm font-semibold text-gray-800 mb-2">Priority:</Text>
              <View className="flex-row flex-wrap gap-2">
                {[
                  { key: 'all', label: 'All' },
                  { key: 'high', label: 'High' },
                  { key: 'medium', label: 'Medium' },
                  { key: 'low', label: 'Low' },
                ].map((option) => (
                  <TouchableOpacity
                    key={option.key}
                    className={`px-3 py-1.5 rounded-2xl border ${
                      filterPriority === option.key 
                        ? 'bg-green-600 border-green-600' 
                        : 'bg-white border-gray-300'
                    }`}
                    onPress={() => setFilterPriority(option.key)}
                  >
                    <Text className={`text-sm ${
                      filterPriority === option.key ? 'text-white font-medium' : 'text-gray-600'
                    }`}>
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        )}
      </View>

      {/* Error Message */}
      {error && (
        <View className="flex-row items-center bg-red-100 px-4 py-3 mx-6 mb-4 rounded-lg">
          <AlertCircle size={16} color={Colors.error} />
          <Text className="flex-1 ml-2 text-red-600 text-sm">{error}</Text>
          <TouchableOpacity onPress={clearError}>
            <Text className="text-red-600 font-medium text-sm">Dismiss</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Todo List */}
      <ScrollView
        className="flex-1 px-6"
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refreshTodos} />
        }
      >
        {sortedTodos.length === 0 ? (
          <View className="items-center justify-center py-16">
            <CheckSquare size={48} color="#9ca3af" />
            <Text className="text-lg font-semibold text-gray-800 mt-4 mb-2">
              {searchText || filterStatus !== 'all' || filterPriority !== 'all'
                ? 'No todos match your filters'
                : 'No todos yet'}
            </Text>
            <Text className="text-sm text-gray-600 text-center mb-6">
              {searchText || filterStatus !== 'all' || filterPriority !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Create your first todo to get started'}
            </Text>
            {!searchText && filterStatus === 'all' && filterPriority === 'all' && (
              <TouchableOpacity
                className="flex-row items-center bg-green-600 px-6 py-3 rounded-xl"
                onPress={() => setShowForm(true)}
              >
                <Plus size={20} color="white" />
                <Text className="text-white font-semibold ml-2">Create Todo</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <View className="py-4">
            {sortedTodos.map((todo) => (
              <TodoCard
                key={todo.id}
                todo={todo}
                onToggleComplete={toggleTodoComplete}
                onEdit={handleEditTodo}
                onDelete={handleDeleteTodo}
              />
            ))}
          </View>
        )}
      </ScrollView>

      {/* Todo Form Modal */}
      <TodoForm
        visible={showForm}
        onClose={handleCloseForm}
        onSubmit={editingTodo ? handleUpdateTodo : handleCreateTodo}
        initialTodo={editingTodo}
      />
    </View>
  );
}