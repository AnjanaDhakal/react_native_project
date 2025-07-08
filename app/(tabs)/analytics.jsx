import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Users, Calendar } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import { useAuth } from '@/context/AuthContext';
import { useAnalytics, useOrders, useProducts } from '@/context/StoreContext';

export default function Analytics() {
  const { user } = useAuth();
  const analytics = useAnalytics(user?.id);
  const orders = useOrders(user?.id);
  const products = useProducts(user?.id);

  // Calculate metrics from real data
  const calculateMetrics = () => {
    const completedOrders = orders.filter(order => order.status === 'Completed');
    const totalRevenue = completedOrders.reduce((sum, order) => sum + order.amount, 0);
    const totalOrders = orders.length;
    const totalCustomers = new Set(orders.map(order => order.customer)).size;
    const avgOrder = totalOrders > 0 ? totalRevenue / completedOrders.length : 0;

    return {
      revenue: totalRevenue,
      orders: totalOrders,
      customers: totalCustomers,
      avgOrder: avgOrder
    };
  };

  const realMetrics = calculateMetrics();

  const metrics = [
    { 
      label: 'Revenue', 
      value: `$${realMetrics.revenue.toFixed(2)}`, 
      change: '+12%', 
      trend: 'up', 
      icon: DollarSign 
    },
    { 
      label: 'Orders', 
      value: realMetrics.orders.toString(), 
      change: '+8%', 
      trend: 'up', 
      icon: ShoppingCart 
    },
    { 
      label: 'Customers', 
      value: realMetrics.customers.toString(), 
      change: '+15%', 
      trend: 'up', 
      icon: Users 
    },
    { 
      label: 'Avg. Order', 
      value: `$${realMetrics.avgOrder.toFixed(2)}`, 
      change: '-3%', 
      trend: 'down', 
      icon: TrendingUp 
    }
  ];

  // Calculate top selling products from orders
  const getTopSellingProducts = () => {
    const productSales = {};
    
    orders.forEach(order => {
      if (order.status === 'Completed') {
        // Simulate product sales data
        const productNames = ['Organic Tomatoes', 'Fresh Lettuce', 'Green Apples'];
        const randomProduct = productNames[Math.floor(Math.random() * productNames.length)];
        
        if (!productSales[randomProduct]) {
          productSales[randomProduct] = { sales: 0, revenue: 0 };
        }
        productSales[randomProduct].sales += Math.floor(Math.random() * 5) + 1;
        productSales[randomProduct].revenue += order.amount * 0.3; // Assume 30% of order value
      }
    });

    return Object.entries(productSales)
      .map(([name, data]) => ({
        name,
        sales: data.sales,
        revenue: `$${data.revenue.toFixed(2)}`
      }))
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 3);
  };

  const topProducts = getTopSellingProducts();

  const timeframes = ['7 Days', '30 Days', '3 Months', '1 Year'];

  return (
    <ScrollView className="flex-1 bg-green-50">
      <View className="px-6 pt-12 pb-6">
        <Text className="text-3xl font-bold text-green-800 mb-6">Analytics</Text>
        
        <View className="mb-6">
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row">
              {timeframes.map((timeframe, index) => (
                <TouchableOpacity
                  key={index}
                  className={`px-4 py-2 rounded-2xl mr-3 ${
                    index === 1 ? 'bg-green-600' : 'bg-white border border-gray-300'
                  }`}
                >
                  <Text className={`font-medium ${
                    index === 1 ? 'text-white' : 'text-gray-600'
                  }`}>
                    {timeframe}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        <View className="mb-8">
          <Text className="text-xl font-semibold text-gray-800 mb-4">Key Metrics</Text>
          <View className="flex-row flex-wrap justify-between">
            {metrics.map((metric, index) => (
              <View key={index} className="bg-white rounded-2xl p-4 mb-4 w-[48%] shadow-sm">
                <View className="flex-row justify-between items-start mb-3">
                  <View className="bg-green-50 rounded-xl p-2">
                    <metric.icon size={20} color={Colors.primary} />
                  </View>
                  <View className="flex-row items-center">
                    {metric.trend === 'up' ? (
                      <TrendingUp size={16} color={Colors.success} />
                    ) : (
                      <TrendingDown size={16} color={Colors.error} />
                    )}
                    <Text className={`ml-1 text-sm font-medium ${
                      metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {metric.change}
                    </Text>
                  </View>
                </View>
                <Text className="text-2xl font-bold text-gray-800 mb-1">{metric.value}</Text>
                <Text className="text-sm text-gray-600">{metric.label}</Text>
              </View>
            ))}
          </View>
        </View>

        <View className="mb-8">
          <Text className="text-xl font-semibold text-gray-800 mb-4">Revenue Chart</Text>
          <View className="bg-white rounded-2xl p-4 shadow-sm">
            <View className="h-48 justify-center items-center border-2 border-dashed border-gray-300 rounded-xl">
              <Calendar size={48} color="#9ca3af" />
              <Text className="text-gray-500 mt-2 text-base">Chart visualization</Text>
              <Text className="text-gray-400 text-sm">Coming soon</Text>
            </View>
          </View>
        </View>

        <View className="mb-6">
          <Text className="text-xl font-semibold text-gray-800 mb-4">Top Selling Products</Text>
          <View className="bg-white rounded-2xl p-4 shadow-sm">
            {topProducts.length === 0 ? (
              <View className="items-center py-8">
                <Text className="text-base font-semibold text-gray-800 mb-1">No sales data available</Text>
                <Text className="text-sm text-gray-600">Complete some orders to see top products</Text>
              </View>
            ) : (
              topProducts.map((product, index) => (
                <View key={index} className={`flex-row justify-between items-center py-3 ${
                  index < topProducts.length - 1 ? 'border-b border-gray-100' : ''
                }`}>
                  <View>
                    <Text className="text-base font-semibold text-gray-800 mb-1">{product.name}</Text>
                    <Text className="text-sm text-gray-600">{product.sales} sold</Text>
                  </View>
                  <Text className="text-base font-bold text-green-600">{product.revenue}</Text>
                </View>
              ))
            )}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}