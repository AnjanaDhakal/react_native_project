import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { CheckCircle, Circle, Clock, AlertTriangle, Edit3, Trash2 } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';

export default function TodoCard({ todo, onToggleComplete, onEdit, onDelete }) {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return Colors.error;
      case 'medium':
        return Colors.warning;
      case 'low':
        return Colors.success;
      default:
        return Colors.text.secondary;
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'inventory':
        return '#3b82f6';
      case 'marketing':
        return '#8b5cf6';
      case 'orders':
        return '#10b981';
      case 'finance':
        return '#f59e0b';
      default:
        return Colors.primary;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString();
    }
  };

  const isOverdue = () => {
    if (!todo.dueDate || todo.completed) return false;
    return new Date(todo.dueDate) < new Date();
  };

  return (
    <View style={[styles.container, todo.completed && styles.completedContainer]}>
      <TouchableOpacity
        style={styles.checkboxContainer}
        onPress={() => onToggleComplete(todo.id)}
      >
        {todo.completed ? (
          <CheckCircle size={24} color={Colors.success} />
        ) : (
          <Circle size={24} color={Colors.text.secondary} />
        )}
      </TouchableOpacity>

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[
            styles.title,
            todo.completed && styles.completedText
          ]}>
            {todo.title}
          </Text>
          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => onEdit(todo)}
            >
              <Edit3 size={16} color={Colors.text.secondary} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => onDelete(todo.id)}
            >
              <Trash2 size={16} color={Colors.error} />
            </TouchableOpacity>
          </View>
        </View>

        {todo.description && (
          <Text style={[
            styles.description,
            todo.completed && styles.completedText
          ]}>
            {todo.description}
          </Text>
        )}

        <View style={styles.footer}>
          <View style={styles.tags}>
            <View style={[
              styles.priorityTag,
              { backgroundColor: getPriorityColor(todo.priority) + '20' }
            ]}>
              <Text style={[
                styles.priorityText,
                { color: getPriorityColor(todo.priority) }
              ]}>
                {todo.priority}
              </Text>
            </View>

            {todo.category && (
              <View style={[
                styles.categoryTag,
                { backgroundColor: getCategoryColor(todo.category) + '20' }
              ]}>
                <Text style={[
                  styles.categoryText,
                  { color: getCategoryColor(todo.category) }
                ]}>
                  {todo.category}
                </Text>
              </View>
            )}
          </View>

          {todo.dueDate && (
            <View style={styles.dueDateContainer}>
              {isOverdue() && <AlertTriangle size={14} color={Colors.error} />}
              <Clock size={14} color={isOverdue() ? Colors.error : Colors.text.secondary} />
              <Text style={[
                styles.dueDate,
                isOverdue() && styles.overdue
              ]}>
                {formatDate(todo.dueDate)}
              </Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  completedContainer: {
    opacity: 0.7,
  },
  checkboxContainer: {
    marginRight: 12,
    paddingTop: 2,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    flex: 1,
    marginRight: 8,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: Colors.text.secondary,
  },
  actions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 4,
    marginLeft: 8,
  },
  description: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginBottom: 12,
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tags: {
    flexDirection: 'row',
    flex: 1,
  },
  priorityTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  priorityText: {
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  categoryTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  dueDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dueDate: {
    fontSize: 12,
    color: Colors.text.secondary,
    marginLeft: 4,
  },
  overdue: {
    color: Colors.error,
    fontWeight: '500',
  },
});