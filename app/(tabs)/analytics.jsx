import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Users, Calendar } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';

export default function Analytics() {
  const metrics = [
    { label: 'Revenue', value: '$12,345', change: '+12%', trend: 'up', icon: DollarSign },
    { label: 'Orders', value: '89', change: '+8%', trend: 'up', icon: ShoppingCart },
    { label: 'Customers', value: '156', change: '+15%', trend: 'up', icon: Users },
    { label: 'Avg. Order', value: '$78.50', change: '-3%', trend: 'down', icon: TrendingUp },
  ];

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
            {[
              { name: 'Organic Tomatoes', sales: 45, revenue: '$224.55' },
              { name: 'Fresh Lettuce', sales: 32, revenue: '$95.68' },
              { name: 'Green Apples', sales: 28, revenue: '$97.72' },
            ].map((product, index) => (
              <View key={index} style={[
                styles.productItem,
                index < 2 && styles.productItemBorder
              ]}>
                <View>
                  <Text style={styles.productName}>{product.name}</Text>
                  <Text style={styles.productSales}>{product.sales} sold</Text>
                </View>
                <Text style={styles.productRevenue}>{product.revenue}</Text>
              </View>
            ))}
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
});