import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, AppState } from 'react-native';
import { useCanteen } from '../../context/CanteenContext';

export default function ProfileScreen() {
  const { orders, favorites } = useCanteen();
  const [appState, setAppState] = useState(AppState.currentState);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      setAppState(nextAppState);
    });
    return () => subscription.remove();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.avatar}>🎓</Text>
        <Text style={styles.name}>University Student</Text>
        <Text style={styles.subText}>Smart Canteen Member</Text>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{orders.length}</Text>
          <Text style={styles.statLabel}>Total Orders</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{favorites.length}</Text>
          <Text style={styles.statLabel}>Favorites</Text>
        </View>
      </View>

      <View style={styles.stateBox}>
        <Text style={styles.stateTitle}>App Lifecycle State:</Text>
        <Text style={styles.stateValue}>{appState.toUpperCase()}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa', padding: 20 },
  card: { backgroundColor: '#fff', padding: 24, borderRadius: 12, alignItems: 'center', elevation: 2, marginBottom: 16 },
  avatar: { fontSize: 48, marginBottom: 8 },
  name: { fontSize: 20, fontWeight: 'bold', color: '#222' },
  subText: { fontSize: 14, color: '#666', marginTop: 4 },
  statsRow: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  statBox: { flex: 1, backgroundColor: '#fff', padding: 18, borderRadius: 12, alignItems: 'center', elevation: 2 },
  statNumber: { fontSize: 24, fontWeight: 'bold', color: '#ff6b6b' },
  statLabel: { fontSize: 13, color: '#555', marginTop: 4 },
  stateBox: { backgroundColor: '#fff', padding: 16, borderRadius: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', elevation: 2 },
  stateTitle: { fontSize: 14, fontWeight: '600', color: '#333' },
  stateValue: { fontSize: 14, fontWeight: 'bold', color: '#27ae60' },
});