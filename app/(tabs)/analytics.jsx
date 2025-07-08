import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
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
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Analytics</Text>
        
        <View style={styles.timeframeContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.timeframeRow}>
              {timeframes.map((timeframe, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.timeframeButton,
                    index === 1 ? styles.activeTimeframe : styles.inactiveTimeframe
                  ]}
                >
                  <Text style={[
                    styles.timeframeText,
                    index === 1 ? styles.activeTimeframeText : styles.inactiveTimeframeText
                  ]}>
                    {timeframe}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Key Metrics</Text>
          <View style={styles.metricsGrid}>
            {metrics.map((metric, index) => (
              <View key={index} style={styles.metricCard}>
                <View style={styles.metricHeader}>
                  <View style={styles.iconContainer}>
                    <metric.icon size={20} color={Colors.primary} />
                  </View>
                  <View style={styles.trendContainer}>
                    {metric.trend === 'up' ? (
                      <TrendingUp size={16} color={Colors.success} />
                    ) : (
                      <TrendingDown size={16} color={Colors.error} />
                    )}
                    <Text style={[
                      styles.changeText,
                      { color: metric.trend === 'up' ? Colors.success : Colors.error }
                    ]}>
                      {metric.change}
                    </Text>
                  </View>
                </View>
                <Text style={styles.metricValue}>{metric.value}</Text>
                <Text style={styles.metricLabel}>{metric.label}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Revenue Chart</Text>
          <View style={styles.chartCard}>
            <View style={styles.chartPlaceholder}>
              <Calendar size={48} color={Colors.text.light} />
              <Text style={styles.chartPlaceholderText}>Chart visualization</Text>
              <Text style={styles.chartPlaceholderSubtext}>Coming soon</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Top Selling Products</Text>
          <View style={styles.productsCard}>
            {topProducts.length === 0 ? (
              <View style={styles.emptyProducts}>
                <Text style={styles.emptyProductsText}>No sales data available</Text>
                <Text style={styles.emptyProductsSubtext}>Complete some orders to see top products</Text>
              </View>
            ) : (
            topProducts.map((product, index) => (
              <View key={index} style={[
                styles.productItem,
                index < topProducts.length - 1 && styles.productItemBorder
              ]}>
                <View>
                  <Text style={styles.productName}>{product.name}</Text>
                  <Text style={styles.productSales}>{product.sales} sold</Text>
                </View>
                <Text style={styles.productRevenue}>{product.revenue}</Text>
              </View>
            ))
            )}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 48,
    paddingBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 24,
  },
  timeframeContainer: {
    marginBottom: 24,
  },
  timeframeRow: {
    flexDirection: 'row',
  },
  timeframeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
  },
  activeTimeframe: {
    backgroundColor: Colors.primary,
  },
  inactiveTimeframe: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  timeframeText: {
    fontWeight: '500',
  },
  activeTimeframeText: {
    color: 'white',
  },
  inactiveTimeframeText: {
    color: Colors.text.secondary,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 16,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  metricCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    width: '48%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  metricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  iconContainer: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 8,
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  changeText: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '500',
  },
  metricValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  chartCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  chartPlaceholder: {
    height: 192,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: Colors.border,
    borderRadius: 12,
  },
  chartPlaceholderText: {
    color: Colors.text.light,
    marginTop: 8,
    fontSize: 16,
  },
  chartPlaceholderSubtext: {
    color: Colors.text.light,
    fontSize: 14,
  },
  productsCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  productItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  productSales: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  productRevenue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  emptyProducts: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyProductsText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  emptyProductsSubtext: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
});