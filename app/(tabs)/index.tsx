import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, Image, Pressable, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import * as Notifications from 'expo-notifications';
import { canteenItems } from '../../data/canteenData';
import { useCanteen } from '../../context/CanteenContext';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function MenuScreen() {
  const router = useRouter();
  const { favorites, toggleFavorite } = useCanteen();
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    (async () => {
      await Notifications.requestPermissionsAsync();
    })();
  }, []);

  const handleFavoritePress = async (id: string, name: string) => {
    const isAdded = toggleFavorite(id);
    if (isAdded) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Bookmarked! ❤️',
          body: `${name} was added to your favorites.`,
        },
        trigger: null,
      });
    }
  };

  const filteredData =
    selectedCategory === 'All'
      ? canteenItems
      : canteenItems.filter((item) => item.category === selectedCategory);

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.headerTitle}>University Canteen Menu</Text>
        <Pressable style={styles.filterBtn} onPress={() => setFilterModalVisible(true)}>
          <Text style={styles.filterBtnText}>Filter</Text>
        </Pressable>
      </View>

      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const isFav = favorites.includes(item.id);
          return (
            <Pressable style={styles.card} onPress={() => router.push(`/item/${item.id}`)}>
              <Image source={{ uri: item.image }} style={styles.image} />
              <View style={styles.cardInfo}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemCategory}>
                  {item.category} • {item.prepTime}
                </Text>
                <Text style={styles.itemPrice}>{item.price}</Text>
              </View>
              <Pressable style={styles.favBtn} onPress={() => handleFavoritePress(item.id, item.name)}>
                <Text style={{ fontSize: 20 }}>{isFav ? '❤️' : '🤍'}</Text>
              </Pressable>
            </Pressable>
          );
        }}
      />

      <Modal visible={filterModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Filter by Category</Text>
            {['All', 'Rice & Mains', 'Short Eats', 'Beverages'].map((cat) => (
              <Pressable
                key={cat}
                style={styles.categoryOption}
                onPress={() => {
                  setSelectedCategory(cat);
                  setFilterModalVisible(false);
                }}
              >
                <Text style={[styles.categoryText, selectedCategory === cat && styles.activeCategory]}>
                  {cat}
                </Text>
              </Pressable>
            ))}
            <Pressable style={styles.closeModalBtn} onPress={() => setFilterModalVisible(false)}>
              <Text style={styles.closeModalText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa', padding: 12 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, marginTop: 8 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  filterBtn: { backgroundColor: '#ff6b6b', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8 },
  filterBtnText: { color: '#fff', fontWeight: 'bold' },
  card: { flexDirection: 'row', backgroundColor: '#fff', marginBottom: 12, borderRadius: 10, elevation: 2, padding: 8, alignItems: 'center' },
  image: { width: 75, height: 75, borderRadius: 8 },
  cardInfo: { flex: 1, marginLeft: 12 },
  itemName: { fontSize: 16, fontWeight: 'bold', color: '#222' },
  itemCategory: { fontSize: 12, color: '#666', marginTop: 2 },
  itemPrice: { fontSize: 14, fontWeight: '600', color: '#ff6b6b', marginTop: 4 },
  favBtn: { padding: 8 },
  modalOverlay: { flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { backgroundColor: '#fff', marginHorizontal: 30, padding: 20, borderRadius: 12 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
  categoryOption: { paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#eee' },
  categoryText: { fontSize: 16, textAlign: 'center', color: '#444' },
  activeCategory: { color: '#ff6b6b', fontWeight: 'bold' },
  closeModalBtn: { marginTop: 15, backgroundColor: '#333', padding: 10, borderRadius: 8 },
  closeModalText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
});