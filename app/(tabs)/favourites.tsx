import React from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import { useCanteen } from '../../context/CanteenContext';
import { canteenItems } from '../../data/canteenData';

export default function OrdersAndFavoritesScreen() {
  const { orders, favorites } = useCanteen();
  const favoriteItems = canteenItems.filter((item) => favorites.includes(item.id));

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>My Canteen Orders 🍽️ ({orders.length})</Text>

      {orders.length === 0 ? (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyText}>No active orders yet. Select a meal to order!</Text>
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.orderId}
          style={{ maxHeight: 330, marginBottom: 15 }}
          renderItem={({ item }) => (
            <View style={styles.orderCard}>
              <View style={styles.orderHeader}>
                <Text style={styles.orderTitle}>
                  {item.orderId} • {item.quantity}x {item.name}
                </Text>
                <Text style={styles.statusBadge}>{item.status}</Text>
              </View>
              <Text style={styles.orderDetail}>
                Type: {item.orderType} • Phone: {item.phone}
              </Text>
              <Text style={styles.orderDetail}>Note: {item.note}</Text>
              <View style={styles.paymentRow}>
                <Text style={styles.priceText}>{item.totalPrice}</Text>
                <Text style={styles.paymentBadge}>{item.paymentStatus}</Text>
              </View>
            </View>
          )}
        />
      )}

      <Text style={styles.sectionTitle}>Bookmarked Favorites ❤️ ({favoriteItems.length})</Text>
      {favoriteItems.length === 0 ? (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyText}>No favorites saved yet.</Text>
        </View>
      ) : (
        <FlatList
          data={favoriteItems}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.favCard}>
              <Text style={styles.favTitle}>{item.name}</Text>
              <Text style={styles.favPrice}>{item.price}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa', padding: 16 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#222', marginBottom: 10, marginTop: 4 },
  emptyBox: { backgroundColor: '#fff', padding: 16, borderRadius: 10, marginBottom: 15, alignItems: 'center' },
  emptyText: { color: '#777', fontSize: 14 },
  orderCard: { backgroundColor: '#fff', padding: 14, borderRadius: 10, marginBottom: 10, elevation: 2 },
  orderHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  orderTitle: { fontSize: 15, fontWeight: 'bold', color: '#222', flex: 1 },
  statusBadge: { backgroundColor: '#fff3cd', color: '#856404', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, fontSize: 11, fontWeight: 'bold' },
  orderDetail: { fontSize: 12, color: '#555', marginTop: 2 },
  paymentRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8, paddingTop: 6, borderTopWidth: 1, borderTopColor: '#eee' },
  priceText: { fontSize: 14, fontWeight: 'bold', color: '#27ae60' },
  paymentBadge: { fontSize: 12, fontWeight: '600', color: '#2980b9' },
  favCard: { backgroundColor: '#fff', padding: 14, borderRadius: 10, marginBottom: 8, flexDirection: 'row', justifyContent: 'space-between', elevation: 1 },
  favTitle: { fontSize: 15, fontWeight: '600', color: '#333' },
  favPrice: { fontSize: 14, fontWeight: 'bold', color: '#ff6b6b' },
});