import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
} from 'react-native';
import { X, Calendar, Flag, Tag } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';

export default function TodoForm({ visible, onClose, onSubmit, initialTodo = null }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    category: 'general',
    dueDate: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialTodo) {
      setFormData({
        title: initialTodo.title || '',
        description: initialTodo.description || '',
        priority: initialTodo.priority || 'medium',
        category: initialTodo.category || 'general',
        dueDate: initialTodo.dueDate ? new Date(initialTodo.dueDate).toISOString().split('T')[0] : '',
      });
    } else {
      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        category: 'general',
        dueDate: '',
      });
    }
    setErrors({});
  }, [initialTodo, visible]);

  const priorities = [
    { value: 'low', label: 'Low', color: 'border-green-500 text-green-600' },
    { value: 'medium', label: 'Medium', color: 'border-orange-500 text-orange-600' },
    { value: 'high', label: 'High', color: 'border-red-500 text-red-600' },
  ];

  const categories = [
    { value: 'general', label: 'General', color: 'border-green-600 text-green-600' },
    { value: 'inventory', label: 'Inventory', color: 'border-blue-500 text-blue-600' },
    { value: 'marketing', label: 'Marketing', color: 'border-purple-500 text-purple-600' },
    { value: 'orders', label: 'Orders', color: 'border-green-500 text-green-600' },
    { value: 'finance', label: 'Finance', color: 'border-yellow-500 text-yellow-600' },
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (formData.dueDate) {
      const selectedDate = new Date(formData.dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        newErrors.dueDate = 'Due date cannot be in the past';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    const todoData = {
      ...formData,
      dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : null,
    };

    onSubmit(todoData);
    onClose();
  };

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-green-50">
        <View className="flex-row justify-between items-center px-6 pt-15 pb-5 border-b border-gray-200">
          <Text className="text-2xl font-bold text-gray-800">
            {initialTodo ? 'Edit Todo' : 'Create New Todo'}
          </Text>
          <TouchableOpacity onPress={onClose} className="p-2">
            <X size={24} color="#6b7280" />
          </TouchableOpacity>
        </View>

        <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
          <View className="mb-6">
            <Text className="text-base font-semibold text-gray-800 mb-2">Title *</Text>
            <TextInput
              className={`bg-white border rounded-xl px-4 py-3 text-base text-gray-800 ${
                errors.title ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter todo title"
              value={formData.title}
              onChangeText={(value) => updateFormData('title', value)}
              maxLength={100}
            />
            {errors.title && <Text className="text-red-600 text-sm mt-1">{errors.title}</Text>}
          </View>

          <View className="mb-6">
            <Text className="text-base font-semibold text-gray-800 mb-2">Description</Text>
            <TextInput
              className={`bg-white border rounded-xl px-4 py-3 text-base text-gray-800 min-h-[100px] ${
                errors.description ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter todo description (optional)"
              value={formData.description}
              onChangeText={(value) => updateFormData('description', value)}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              maxLength={500}
            />
            {errors.description && <Text className="text-red-600 text-sm mt-1">{errors.description}</Text>}
          </View>

          <View className="mb-6">
            <View className="flex-row items-center mb-2">
              <Flag size={16} color="#374151" />
              <Text className="text-base font-semibold text-gray-800 ml-1">Priority</Text>
            </View>
            <View className="flex-row flex-wrap gap-2">
              {priorities.map((priority) => (
                <TouchableOpacity
                  key={priority.value}
                  className={`px-4 py-2 rounded-2xl border bg-white ${
                    formData.priority === priority.value 
                      ? priority.color 
                      : 'border-gray-300 text-gray-600'
                  }`}
                  onPress={() => updateFormData('priority', priority.value)}
                >
                  <Text className={`text-sm font-medium ${
                    formData.priority === priority.value 
                      ? priority.color.split(' ')[1] 
                      : 'text-gray-600'
                  }`}>
                    {priority.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View className="mb-6">
            <View className="flex-row items-center mb-2">
              <Tag size={16} color="#374151" />
              <Text className="text-base font-semibold text-gray-800 ml-1">Category</Text>
            </View>
            <View className="flex-row flex-wrap gap-2">
              {categories.map((category) => (
                <TouchableOpacity
                  key={category.value}
                  className={`px-4 py-2 rounded-2xl border bg-white ${
                    formData.category === category.value 
                      ? category.color 
                      : 'border-gray-300 text-gray-600'
                  }`}
                  onPress={() => updateFormData('category', category.value)}
                >
                  <Text className={`text-sm font-medium ${
                    formData.category === category.value 
                      ? category.color.split(' ')[1] 
                      : 'text-gray-600'
                  }`}>
                    {category.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View className="mb-6">
            <View className="flex-row items-center mb-2">
              <Calendar size={16} color="#374151" />
              <Text className="text-base font-semibold text-gray-800 ml-1">Due Date</Text>
            </View>
            <TextInput
              className={`bg-white border rounded-xl px-4 py-3 text-base text-gray-800 ${
                errors.dueDate ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="YYYY-MM-DD"
              value={formData.dueDate}
              onChangeText={(value) => updateFormData('dueDate', value)}
            />
            {errors.dueDate && <Text className="text-red-600 text-sm mt-1">{errors.dueDate}</Text>}
            <Text className="text-gray-600 text-sm mt-1">Leave empty for no due date</Text>
          </View>
        </ScrollView>

        <View className="flex-row px-6 py-5 border-t border-gray-200 gap-3">
          <TouchableOpacity
            className="flex-1 py-3 rounded-xl bg-white border border-gray-300"
            onPress={onClose}
          >
            <Text className="text-center text-base font-semibold text-gray-600">Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-1 py-3 rounded-xl bg-green-600"
            onPress={handleSubmit}
          >
            <Text className="text-center text-base font-semibold text-white">
              {initialTodo ? 'Update' : 'Create'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}