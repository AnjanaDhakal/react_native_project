import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { CircleCheck as CheckCircle, Circle, Clock, TriangleAlert as AlertTriangle, Edit3, Trash2 } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';

export default function TodoCard({ todo, onToggleComplete, onEdit, onDelete }) {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-100';
      case 'medium':
        return 'text-orange-600 bg-orange-100';
      case 'low':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'inventory':
        return 'text-blue-600 bg-blue-100';
      case 'marketing':
        return 'text-purple-600 bg-purple-100';
      case 'orders':
        return 'text-green-600 bg-green-100';
      case 'finance':
        return 'text-yellow-600 bg-yellow-100';
      default:
        return 'text-green-600 bg-green-100';
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
    <View className={`bg-white rounded-2xl p-4 mb-3 flex-row shadow-sm ${todo.completed ? 'opacity-70' : ''}`}>
      <TouchableOpacity
        className="mr-3 pt-0.5"
        onPress={() => onToggleComplete(todo.id)}
      >
        {todo.completed ? (
          <CheckCircle size={24} color={Colors.success} />
        ) : (
          <Circle size={24} color="#6b7280" />
        )}
      </TouchableOpacity>

      <View className="flex-1">
        <View className="flex-row justify-between items-start mb-2">
          <Text className={`text-base font-semibold flex-1 mr-2 ${
            todo.completed ? 'line-through text-gray-500' : 'text-gray-800'
          }`}>
            {todo.title}
          </Text>
          <View className="flex-row">
            <TouchableOpacity
              className="p-1 ml-2"
              onPress={() => onEdit(todo)}
            >
              <Edit3 size={16} color="#6b7280" />
            </TouchableOpacity>
            <TouchableOpacity
              className="p-1 ml-2"
              onPress={() => onDelete(todo.id)}
            >
              <Trash2 size={16} color={Colors.error} />
            </TouchableOpacity>
          </View>
        </View>

        {todo.description && (
          <Text className={`text-sm mb-3 leading-5 ${
            todo.completed ? 'line-through text-gray-500' : 'text-gray-600'
          }`}>
            {todo.description}
          </Text>
        )}

        <View className="flex-row justify-between items-center">
          <View className="flex-row flex-1">
            <View className={`px-2 py-1 rounded-xl mr-2 ${getPriorityColor(todo.priority)}`}>
              <Text className={`text-xs font-medium capitalize ${getPriorityColor(todo.priority).split(' ')[0]}`}>
                {todo.priority}
              </Text>
            </View>

            {todo.category && (
              <View className={`px-2 py-1 rounded-xl ${getCategoryColor(todo.category)}`}>
                <Text className={`text-xs font-medium capitalize ${getCategoryColor(todo.category).split(' ')[0]}`}>
                  {todo.category}
                </Text>
              </View>
            )}
          </View>

          {todo.dueDate && (
            <View className="flex-row items-center">
              {isOverdue() && <AlertTriangle size={14} color={Colors.error} />}
              <Clock size={14} color={isOverdue() ? Colors.error : '#6b7280'} />
              <Text className={`text-xs ml-1 ${
                isOverdue() ? 'text-red-600 font-medium' : 'text-gray-600'
              }`}>
                {formatDate(todo.dueDate)}
              </Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}