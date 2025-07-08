import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Filter, Package, Clock, CircleCheck as CheckCircle, Circle as XCircle } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';

export default function Orders() {
  const [activeTab, setActiveTab] = useState('all');

  const orders = [
    { id: '#1234', customer: 'John Doe', amount: '$89.99', status: 'Pending', date: '2024-01-15', items: 3 },
    { id: '#1235', customer: 'Jane Smith', amount: '$156.50', status: 'Completed', date: '2024-01-15', items: 5 },
    { id: '#1236', customer: 'Mike Johnson', amount: '$45.75', status: 'Processing', date: '2024-01-14', items: 2 },
    { id: '#1237', customer: 'Sarah Wilson', amount: '$234.00', status: 'Cancelled', date: '2024-01-14', items: 4 },
    { id: '#1238', customer: 'Tom Brown', amount: '$67.25', status: 'Completed', date: '2024-01-13', items: 3 },
  ];

  const tabs = [
    { key: 'all', label: 'All', count: orders.length },
    { key: 'pending', label: 'Pending', count: orders.filter(o => o.status === 'Pending').length },
    { key: 'processing', label: 'Processing', count: orders.filter(o => o.status === 'Processing').length },
    { key: 'completed', label: 'Completed', count: orders.filter(o => o.status === 'Completed').length },
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
        return { color: Colors.warning, backgroundColor: '#fef3c7' };
      case 'Processing':
        return { color: Colors.info, backgroundColor: '#dbeafe' };
      case 'Completed':
        return { color: Colors.success, backgroundColor: Colors.background };
      case 'Cancelled':
        return { color: Colors.error, backgroundColor: '#fee2e2' };
      default:
        return { color: Colors.text.secondary, backgroundColor: Colors.divider };
    }
  };

  const filteredOrders = activeTab === 'all' 
    ? orders 
    : orders.filter(order => order.status.toLowerCase() === activeTab);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>Orders</Text>
          <TouchableOpacity style={styles.filterButton}>
            <Filter size={20} color={Colors.text.secondary} />
          </TouchableOpacity>
        </View>
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsContainer}>
          <View style={styles.tabsRow}>
            {tabs.map((tab) => (
              <TouchableOpacity
                key={tab.key}
                style={[
                  styles.tab,
                  activeTab === tab.key ? styles.activeTab : styles.inactiveTab
                ]}
                onPress={() => setActiveTab(tab.key)}
              >
                <Text style={[
                  styles.tabLabel,
                  activeTab === tab.key ? styles.activeTabLabel : styles.inactiveTabLabel
                ]}>
                  {tab.label}
                </Text>
                <View style={[
                  styles.tabBadge,
                  activeTab === tab.key ? styles.activeTabBadge : styles.inactiveTabBadge
                ]}>
                  <Text style={[
                    styles.tabBadgeText,
                    activeTab === tab.key ? styles.activeTabBadgeText : styles.inactiveTabBadgeText
                  ]}>
                    {tab.count}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      <ScrollView style={styles.content}>
        {filteredOrders.map((order) => (
          <View key={order.id} style={styles.orderCard}>
            <View style={styles.orderHeader}>
              <View>
                <Text style={styles.orderId}>{order.id}</Text>
                <Text style={styles.customerName}>{order.customer}</Text>
                <Text style={styles.orderDate}>{order.date}</Text>
              </View>
              <View style={styles.orderAmount}>
                <Text style={styles.amountText}>{order.amount}</Text>
                <Text style={styles.itemsText}>{order.items} items</Text>
              </View>
            </View>
            
            <View style={styles.orderFooter}>
              <View style={[styles.statusBadge, getStatusColor(order.status)]}>
                {getStatusIcon(order.status)}
                <Text style={[styles.statusText, { color: getStatusColor(order.status).color }]}>
                  {order.status}
                </Text>
              </View>
              <TouchableOpacity style={styles.detailsButton}>
                <Text style={styles.detailsButtonText}>View Details</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
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
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  filterButton: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    padding: 12,
  },
  tabsContainer: {
    marginBottom: 16,
  },
  tabsRow: {
    flexDirection: 'row',
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
  },
  activeTab: {
    backgroundColor: Colors.primary,
  },
  inactiveTab: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  tabLabel: {
    fontWeight: '500',
    marginRight: 4,
  },
  activeTabLabel: {
    color: 'white',
  },
  inactiveTabLabel: {
    color: Colors.text.secondary,
  },
  tabBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  activeTabBadge: {
    backgroundColor: Colors.green.medium,
  },
  inactiveTabBadge: {
    backgroundColor: Colors.divider,
  },
  tabBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  activeTabBadgeText: {
    color: 'white',
  },
  inactiveTabBadgeText: {
    color: Colors.text.secondary,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  orderCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  orderId: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  customerName: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginBottom: 2,
  },
  orderDate: {
    fontSize: 12,
    color: Colors.text.light,
  },
  orderAmount: {
    alignItems: 'flex-end',
  },
  amountText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 2,
  },
  itemsText: {
    fontSize: 12,
    color: Colors.text.light,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusText: {
    marginLeft: 4,
    fontSize: 12,
    fontWeight: '500',
  },
  detailsButton: {
    backgroundColor: Colors.background,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  detailsButtonText: {
    color: Colors.primary,
    fontWeight: '500',
  },
});