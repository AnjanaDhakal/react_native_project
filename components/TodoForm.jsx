import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
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
    { value: 'low', label: 'Low', color: Colors.success },
    { value: 'medium', label: 'Medium', color: Colors.warning },
    { value: 'high', label: 'High', color: Colors.error },
  ];

  const categories = [
    { value: 'general', label: 'General', color: Colors.primary },
    { value: 'inventory', label: 'Inventory', color: '#3b82f6' },
    { value: 'marketing', label: 'Marketing', color: '#8b5cf6' },
    { value: 'orders', label: 'Orders', color: '#10b981' },
    { value: 'finance', label: 'Finance', color: '#f59e0b' },
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
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>
            {initialTodo ? 'Edit Todo' : 'Create New Todo'}
          </Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color={Colors.text.secondary} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.section}>
            <Text style={styles.label}>Title *</Text>
            <TextInput
              style={[styles.input, errors.title && styles.inputError]}
              placeholder="Enter todo title"
              value={formData.title}
              onChangeText={(value) => updateFormData('title', value)}
              maxLength={100}
            />
            {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.textArea, errors.description && styles.inputError]}
              placeholder="Enter todo description (optional)"
              value={formData.description}
              onChangeText={(value) => updateFormData('description', value)}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              maxLength={500}
            />
            {errors.description && <Text style={styles.errorText}>{errors.description}</Text>}
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>
              <Flag size={16} color={Colors.text.primary} /> Priority
            </Text>
            <View style={styles.optionsContainer}>
              {priorities.map((priority) => (
                <TouchableOpacity
                  key={priority.value}
                  style={[
                    styles.optionButton,
                    formData.priority === priority.value && styles.selectedOption,
                    { borderColor: priority.color }
                  ]}
                  onPress={() => updateFormData('priority', priority.value)}
                >
                  <Text style={[
                    styles.optionText,
                    formData.priority === priority.value && styles.selectedOptionText,
                    { color: formData.priority === priority.value ? priority.color : Colors.text.secondary }
                  ]}>
                    {priority.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>
              <Tag size={16} color={Colors.text.primary} /> Category
            </Text>
            <View style={styles.optionsContainer}>
              {categories.map((category) => (
                <TouchableOpacity
                  key={category.value}
                  style={[
                    styles.optionButton,
                    formData.category === category.value && styles.selectedOption,
                    { borderColor: category.color }
                  ]}
                  onPress={() => updateFormData('category', category.value)}
                >
                  <Text style={[
                    styles.optionText,
                    formData.category === category.value && styles.selectedOptionText,
                    { color: formData.category === category.value ? category.color : Colors.text.secondary }
                  ]}>
                    {category.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>
              <Calendar size={16} color={Colors.text.primary} /> Due Date
            </Text>
            <TextInput
              style={[styles.input, errors.dueDate && styles.inputError]}
              placeholder="YYYY-MM-DD"
              value={formData.dueDate}
              onChangeText={(value) => updateFormData('dueDate', value)}
            />
            {errors.dueDate && <Text style={styles.errorText}>{errors.dueDate}</Text>}
            <Text style={styles.helperText}>Leave empty for no due date</Text>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={onClose}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmit}
          >
            <Text style={styles.submitButtonText}>
              {initialTodo ? 'Update' : 'Create'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text.primary,
  },
  closeButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: Colors.text.primary,
  },
  textArea: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: Colors.text.primary,
    minHeight: 100,
  },
  inputError: {
    borderColor: Colors.error,
  },
  errorText: {
    color: Colors.error,
    fontSize: 14,
    marginTop: 4,
  },
  helperText: {
    color: Colors.text.secondary,
    fontSize: 14,
    marginTop: 4,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    backgroundColor: Colors.surface,
  },
  selectedOption: {
    backgroundColor: Colors.background,
  },
  optionText: {
    fontSize: 14,
    fontWeight: '500',
  },
  selectedOptionText: {
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cancelButtonText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.secondary,
  },
  submitButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: Colors.primary,
  },
  submitButtonText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
});