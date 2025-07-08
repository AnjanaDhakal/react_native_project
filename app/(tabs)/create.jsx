import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { Search, Filter, Plus, Package } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import { useAuth } from '@/context/AuthContext';
import { useProducts, useStoreContext } from '@/context/StoreContext';

export default function Products() {
  const [searchText, setSearchText] = useState('');
  const { user } = useAuth();
  const products = useProducts(user?.id);
  const { storeHelpers } = useStoreContext();

  // Format products for display
  const formattedProducts = products.map(product => ({
    ...product,
    price: `$${product.price.toFixed(2)}`
  }));

  // Filter products based on search
  const filteredProducts = formattedProducts.filter(product =>
    product.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleAddProduct = async () => {
    if (!user?.id) return;
    
    try {
      const newProduct = {
        userId: user.id,
        name: 'New Product',
        price: 0.00,
        stock: 0,
        status: 'Out of Stock'
      };
      
      await storeHelpers.createProduct(newProduct);
    } catch (error) {
      console.error('Failed to create product:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'In Stock':
        return { color: Colors.success, backgroundColor: Colors.background };
      case 'Low Stock':
        return { color: Colors.warning, backgroundColor: '#fef3c7' };
      case 'Out of Stock':
        return { color: Colors.error, backgroundColor: '#fee2e2' };
      default:
        return { color: Colors.text.secondary, backgroundColor: Colors.divider };
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Create</Text>
        
        <View style={styles.searchRow}>
          <View style={styles.searchContainer}>
            <Search style={styles.searchIcon} size={20} color={Colors.text.secondary} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search products..."
              placeholderTextColor={Colors.text.secondary}
              value={searchText}
              onChangeText={setSearchText}
            />
          </View>
          <TouchableOpacity style={styles.filterButton}>
            <Filter size={20} color={Colors.text.secondary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.addButton} onPress={handleAddProduct}>
            <Plus size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content}>
        {filteredProducts.length === 0 ? (
          <View style={styles.emptyState}>
            <Package size={48} color={Colors.text.light} />
            <Text style={styles.emptyStateText}>
              {searchText ? 'No products found' : 'No products yet'}
            </Text>
            <Text style={styles.emptyStateSubtext}>
              {searchText 
                ? `No products match "${searchText}"`
                : 'Start by adding your first product'
              }
            </Text>
            {!searchText && (
              <TouchableOpacity style={styles.addProductButton} onPress={handleAddProduct}>
                <Plus size={20} color="white" />
                <Text style={styles.addProductButtonText}>Add Product</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <View>
        {filteredProducts.map((product) => (
          <View key={product.id} style={styles.productCard}>
            <View style={styles.productHeader}>
              <View style={styles.productInfo}>
                <View style={styles.iconContainer}>
                  <Package size={20} color={Colors.primary} />
                </View>
                <View style={styles.productDetails}>
                  <Text style={styles.productName}>{product.name}</Text>
                  <Text style={styles.productPrice}>{product.price}</Text>
                </View>
              </View>
              <View style={[styles.statusBadge, getStatusColor(product.status)]}>
                <Text style={[styles.statusText, { color: getStatusColor(product.status).color }]}>
                  {product.status}
                </Text>
              </View>
            </View>
            <View style={styles.productFooter}>
              <Text style={styles.stockText}>Stock: {product.stock} units</Text>
              <TouchableOpacity style={styles.editButton}>
                <Text style={styles.editButtonText}>Edit</Text>
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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 24,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
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
    backgroundColor: Colors.surface,
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
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    padding: 12,
    marginRight: 12,
  },
  addButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    padding: 12,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  productCard: {
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
  productHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  productInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 8,
    marginRight: 12,
  },
  productDetails: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  productFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stockText: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  editButton: {
    backgroundColor: Colors.background,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  editButtonText: {
    color: Colors.primary,
    fontWeight: '500',
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
  addProductButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  addProductButtonText: {
    color: 'white',
    fontWeight: '600',
    marginLeft: 8,
  },
});