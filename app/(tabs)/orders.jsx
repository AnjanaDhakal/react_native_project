import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Filter, Package, Clock, CircleCheck as CheckCircle, Circle as XCircle } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import { useAuth } from '@/context/AuthContext';
import { useOrders } from '@/context/StoreContext';

export default function Orders() {
  const [activeTab, setActiveTab] = useState('all');
  const { user } = useAuth();
  const orders = useOrders(user?.id);

  // Format orders for display
  const formattedOrders = orders.map(order => ({
    ...order,
    id: `#${order.id.slice(-4)}`,
    amount: `$${order.amount.toFixed(2)}`
  }));

  const tabs = [
    { key: 'all', label: 'All', count: formattedOrders.length },
    { key: 'pending', label: 'Pending', count: formattedOrders.filter(o => o.status === 'Pending').length },
    { key: 'processing', label: 'Processing', count: formattedOrders.filter(o => o.status === 'Processing').length },
    { key: 'completed', label: 'Completed', count: formattedOrders.filter(o => o.status === 'Completed').length },
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Pending':
        return <Clock size={16} color={Colors.warning} />;
      case 'Processing':
        return <Package size={16} color={Colors.info} />;
      case 'Completed':
        return <CheckCircle size={16} color={Colors.success} />;
      case 'Cancelled':
        return <XCircle size={16} color={Colors.error} />;
      default:
        return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'text-orange-600 bg-orange-100';
      case 'Processing':
        return 'text-blue-600 bg-blue-100';
      case 'Completed':
        return 'text-green-600 bg-green-100';
      case 'Cancelled':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const filteredOrders = activeTab === 'all' 
    ? formattedOrders 
    : formattedOrders.filter(order => order.status.toLowerCase() === activeTab);

  return (
    <View className="flex-1 bg-green-50">
      <View className="px-6 pt-12 pb-4">
        <View className="flex-row justify-between items-center mb-6">
          <Text className="text-3xl font-bold text-green-800">Orders</Text>
          <TouchableOpacity className="bg-white border border-gray-300 rounded-xl p-3">
            <Filter size={20} color="#6b7280" />
          </TouchableOpacity>
        </View>
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
          <View className="flex-row">
            {tabs.map((tab) => (
              <TouchableOpacity
                key={tab.key}
                className={`flex-row items-center px-4 py-2 rounded-2xl mr-3 ${
                  activeTab === tab.key ? 'bg-green-600' : 'bg-white border border-gray-300'
                }`}
                onPress={() => setActiveTab(tab.key)}
              >
                <Text className={`font-medium mr-1 ${
                  activeTab === tab.key ? 'text-white' : 'text-gray-600'
                }`}>
                  {tab.label}
                </Text>
                <View className={`px-2 py-0.5 rounded-xl ${
                  activeTab === tab.key ? 'bg-green-500' : 'bg-gray-200'
                }`}>
                  <Text className={`text-xs font-bold ${
                    activeTab === tab.key ? 'text-white' : 'text-gray-600'
                  }`}>
                    {tab.count}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      <ScrollView className="flex-1 px-6">
        {filteredOrders.length === 0 ? (
          <View className="items-center justify-center py-16">
            <Package size={48} color="#9ca3af" />
            <Text className="text-lg font-semibold text-gray-800 mt-4 mb-2">No orders found</Text>
            <Text className="text-sm text-gray-600 text-center">
              {activeTab === 'all' ? 'Start by creating your first order' : `No ${activeTab} orders at the moment`}
            </Text>
          </View>
        ) : (
          <View>
            {filteredOrders.map((order) => (
              <View key={order.id} className="bg-white rounded-2xl p-4 mb-4 shadow-sm">
                <View className="flex-row justify-between items-start mb-3">
                  <View>
                    <Text className="text-lg font-bold text-gray-800 mb-1">{order.id}</Text>
                    <Text className="text-sm text-gray-600 mb-0.5">{order.customer}</Text>
                    <Text className="text-xs text-gray-400">{order.date}</Text>
                  </View>
                  <View className="items-end">
                    <Text className="text-lg font-bold text-green-600 mb-0.5">{order.amount}</Text>
                    <Text className="text-xs text-gray-400">{order.items} items</Text>
                  </View>
                </View>
                
                <View className="flex-row justify-between items-center">
                  <View className={`flex-row items-center px-3 py-1 rounded-2xl ${getStatusColor(order.status)}`}>
                    {getStatusIcon(order.status)}
                    <Text className={`ml-1 text-xs font-medium ${getStatusColor(order.status).split(' ')[0]}`}>
                      {order.status}
                    </Text>
                  </View>
                  <TouchableOpacity className="bg-green-50 px-4 py-2 rounded-lg">
                    <Text className="text-green-600 font-medium">View Details</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}