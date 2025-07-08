import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
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
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>Todo Manager</Text>
          <View style={styles.headerActions}>
            {error && (
              <TouchableOpacity onPress={clearError} style={styles.errorIndicator}>
                <WifiOff size={20} color={Colors.error} />
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => setShowForm(true)}
            >
              <Plus size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{statusCounts.total}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: Colors.warning }]}>
              {statusCounts.pending}
            </Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: Colors.success }]}>
              {statusCounts.completed}
            </Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
        </View>

        {/* Search and Filters */}
        <View style={styles.searchRow}>
          <View style={styles.searchContainer}>
            <Search style={styles.searchIcon} size={20} color={Colors.text.secondary} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search todos..."
              placeholderTextColor={Colors.text.secondary}
              value={searchText}
              onChangeText={setSearchText}
            />
          </View>
          <TouchableOpacity
            style={[styles.filterButton, showFilters && styles.filterButtonActive]}
            onPress={() => setShowFilters(!showFilters)}
          >
            <Filter size={20} color={showFilters ? Colors.primary : Colors.text.secondary} />
          </TouchableOpacity>
        </View>

        {/* Filter Options */}
        {showFilters && (
          <View style={styles.filtersContainer}>
            <View style={styles.filterGroup}>
              <Text style={styles.filterLabel}>Status:</Text>
              <View style={styles.filterOptions}>
                {[
                  { key: 'all', label: 'All' },
                  { key: 'pending', label: 'Pending' },
                  { key: 'completed', label: 'Completed' },
                ].map((option) => (
                  <TouchableOpacity
                    key={option.key}
                    style={[
                      styles.filterOption,
                      filterStatus === option.key && styles.filterOptionActive,
                    ]}
                    onPress={() => setFilterStatus(option.key)}
                  >
                    <Text
                      style={[
                        styles.filterOptionText,
                        filterStatus === option.key && styles.filterOptionTextActive,
                      ]}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.filterGroup}>
              <Text style={styles.filterLabel}>Priority:</Text>
              <View style={styles.filterOptions}>
                {[
                  { key: 'all', label: 'All' },
                  { key: 'high', label: 'High' },
                  { key: 'medium', label: 'Medium' },
                  { key: 'low', label: 'Low' },
                ].map((option) => (
                  <TouchableOpacity
                    key={option.key}
                    style={[
                      styles.filterOption,
                      filterPriority === option.key && styles.filterOptionActive,
                    ]}
                    onPress={() => setFilterPriority(option.key)}
                  >
                    <Text
                      style={[
                        styles.filterOptionText,
                        filterPriority === option.key && styles.filterOptionTextActive,
                      ]}
                    >
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
        <View style={styles.errorContainer}>
          <AlertCircle size={16} color={Colors.error} />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity onPress={clearError}>
            <Text style={styles.errorDismiss}>Dismiss</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Todo List */}
      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refreshTodos} />
        }
      >
        {sortedTodos.length === 0 ? (
          <View style={styles.emptyState}>
            <CheckSquare size={48} color={Colors.text.light} />
            <Text style={styles.emptyStateText}>
              {searchText || filterStatus !== 'all' || filterPriority !== 'all'
                ? 'No todos match your filters'
                : 'No todos yet'}
            </Text>
            <Text style={styles.emptyStateSubtext}>
              {searchText || filterStatus !== 'all' || filterPriority !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Create your first todo to get started'}
            </Text>
            {!searchText && filterStatus === 'all' && filterPriority === 'all' && (
              <TouchableOpacity
                style={styles.emptyStateButton}
                onPress={() => setShowForm(true)}
              >
                <Plus size={20} color="white" />
                <Text style={styles.emptyStateButtonText}>Create Todo</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <View style={styles.todoList}>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 48,
    paddingBottom: 16,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  errorIndicator: {
    marginRight: 12,
    padding: 4,
  },
  addButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    padding: 12,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    paddingVertical: 16,
    backgroundColor: Colors.background,
    borderRadius: 12,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  searchContainer: {
    flex: 1,
    position: 'relative',
    marginRight: 12,
  },
  searchIcon: {
    position: 'absolute',
    left: 12,
    top: 12,
    zIndex: 1,
  },
  searchInput: {
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingLeft: 44,
    paddingRight: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: Colors.text.primary,
  },
  filterButton: {
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    padding: 12,
  },
  filterButtonActive: {
    backgroundColor: Colors.primary + '20',
    borderColor: Colors.primary,
  },
  filtersContainer: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  filterGroup: {
    marginBottom: 16,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 8,
  },
  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterOption: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  filterOptionActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterOptionText: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  filterOptionTextActive: {
    color: 'white',
    fontWeight: '500',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.error + '20',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 24,
    marginBottom: 16,
    borderRadius: 8,
  },
  errorText: {
    flex: 1,
    marginLeft: 8,
    color: Colors.error,
    fontSize: 14,
  },
  errorDismiss: {
    color: Colors.error,
    fontWeight: '500',
    fontSize: 14,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: Colors.text.secondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  emptyStateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  emptyStateButtonText: {
    color: 'white',
    fontWeight: '600',
    marginLeft: 8,
  },
  todoList: {
    paddingVertical: 16,
  },
});