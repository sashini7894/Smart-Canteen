import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  Modal,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Notifications from 'expo-notifications';
import { canteenItems } from '../../data/canteenData';
import { useCanteen } from '../../context/CanteenContext';

export default function DetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { placeOrder } = useCanteen();

  const item = canteenItems.find((i) => i.id === id);

  // Order Form States
  const [quantity, setQuantity] = useState(1);
  const [orderType, setOrderType] = useState<'Takeaway' | 'Dine-in'>('Takeaway');
  const [note, setNote] = useState('');
  const [studentPhone, setStudentPhone] = useState('');

  // Payment Modal States
  const [paymentModal, setPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'Card' | 'Cash'>('Card');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardHolder, setCardHolder] = useState('');

  if (!item) {
    return (
      <View style={styles.container}>
        <Text>Item not found!</Text>
      </View>
    );
  }

  // Extract numeric price (e.g., "LKR 450.00" -> 450)
  const unitPrice = parseFloat(item.price.replace(/[^0-9.]/g, '')) || 0;
  const totalAmount = (unitPrice * quantity).toFixed(2);

  const handleOpenCheckout = () => {
    if (!studentPhone.trim()) {
      Alert.alert('Missing Info', 'Please enter your contact number for order updates.');
      return;
    }
    setPaymentModal(true);
  };

  const handleCompletePayment = async () => {
    if (paymentMethod === 'Card') {
      if (cardNumber.length < 12 || !expiry || cvv.length < 3 || !cardHolder.trim()) {
        Alert.alert('Invalid Card Details', 'Please fill in all card payment fields properly.');
        return;
      }
    }

    const maskedCard =
      paymentMethod === 'Card' ? `Card (•••• ${cardNumber.slice(-4)})` : 'Cash at Counter';

    placeOrder({
      name: item.name,
      quantity,
      totalPrice: `LKR ${totalAmount}`,
      orderType,
      note: note.trim() || 'No special instructions',
      phone: studentPhone,
      paymentStatus: paymentMethod === 'Card' ? `Paid via ${maskedCard}` : 'Pay on Pickup',
    });

    setPaymentModal(false);

    await Notifications.scheduleNotificationAsync({
      content: {
        title: paymentMethod === 'Card' ? 'Payment & Order Confirmed! 💳' : 'Order Placed! 🍽️',
        body: `${quantity}x ${item.name} (LKR ${totalAmount}) - ${orderType}. Ready in ${item.prepTime}.`,
      },
      trigger: null,
    });

    router.push('/(tabs)/favourites');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 30 }}>
      <Image source={{ uri: item.image }} style={styles.image} />

      <View style={styles.detailsContainer}>
        <Text style={styles.category}>{item.category}</Text>
        <Text style={styles.title}>{item.name}</Text>
        <Text style={styles.price}>
          {item.price} <Text style={styles.prepText}>• Prep: {item.prepTime}</Text>
        </Text>
        <Text style={styles.description}>{item.description}</Text>

        {/* Quantity Selector */}
        <Text style={styles.sectionLabel}>Select Quantity</Text>
        <View style={styles.qtyRow}>
          <Pressable
            style={styles.qtyBtn}
            onPress={() => setQuantity(quantity > 1 ? quantity - 1 : 1)}
          >
            <Text style={styles.qtyBtnText}>-</Text>
          </Pressable>
          <Text style={styles.qtyValue}>{quantity}</Text>
          <Pressable style={styles.qtyBtn} onPress={() => setQuantity(quantity + 1)}>
            <Text style={styles.qtyBtnText}>+</Text>
          </Pressable>
          <Text style={styles.totalPreview}>Total: LKR {totalAmount}</Text>
        </View>

        {/* Order Type Toggle */}
        <Text style={styles.sectionLabel}>Order Type</Text>
        <View style={styles.toggleRow}>
          {(['Takeaway', 'Dine-in'] as const).map((type) => (
            <Pressable
              key={type}
              style={[styles.toggleBtn, orderType === type && styles.activeToggle]}
              onPress={() => setOrderType(type)}
            >
              <Text style={[styles.toggleText, orderType === type && styles.activeToggleText]}>
                {type}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Customer Contact & Special Instructions */}
        <Text style={styles.sectionLabel}>Contact Number *</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. 077 123 4567"
          keyboardType="phone-pad"
          value={studentPhone}
          onChangeText={setStudentPhone}
        />

        <Text style={styles.sectionLabel}>Special Instructions (Optional)</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Less spicy, extra chili paste..."
          value={note}
          onChangeText={setNote}
        />

        <Pressable style={styles.orderBtn} onPress={handleOpenCheckout}>
          <Text style={styles.orderBtnText}>Proceed to Payment (LKR {totalAmount}) 💳</Text>
        </Pressable>
      </View>

      {/* Card Payment & Checkout Modal */}
      <Modal visible={paymentModal} transparent={true} animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Checkout & Payment</Text>
            <Text style={styles.summaryText}>
              {quantity}x {item.name} ({orderType}) — Total: LKR {totalAmount}
            </Text>

            {/* Payment Method Selector */}
            <View style={styles.toggleRow}>
              {(['Card', 'Cash'] as const).map((method) => (
                <Pressable
                  key={method}
                  style={[styles.toggleBtn, paymentMethod === method && styles.activeToggle]}
                  onPress={() => setPaymentMethod(method)}
                >
                  <Text
                    style={[
                      styles.toggleText,
                      paymentMethod === method && styles.activeToggleText,
                    ]}
                  >
                    {method === 'Card' ? '💳 Card Payment' : '💵 Cash at Canteen'}
                  </Text>
                </Pressable>
              ))}
            </View>

            {paymentMethod === 'Card' ? (
              <View style={styles.cardForm}>
                <TextInput
                  style={styles.input}
                  placeholder="Cardholder Name (e.g. S. G. Thangalla)"
                  value={cardHolder}
                  onChangeText={setCardHolder}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Card Number (16 digits)"
                  keyboardType="numeric"
                  maxLength={16}
                  value={cardNumber}
                  onChangeText={setCardNumber}
                />
                <View style={styles.rowInputs}>
                  <TextInput
                    style={[styles.input, { flex: 1, marginRight: 8 }]}
                    placeholder="MM/YY"
                    maxLength={5}
                    value={expiry}
                    onChangeText={setExpiry}
                  />
                  <TextInput
                    style={[styles.input, { flex: 1 }]}
                    placeholder="CVV"
                    keyboardType="numeric"
                    maxLength={3}
                    secureTextEntry
                    value={cvv}
                    onChangeText={setCvv}
                  />
                </View>
              </View>
            ) : (
              <Text style={styles.cashNote}>
                You can pay LKR {totalAmount} directly at the canteen counter when collecting your order.
              </Text>
            )}

            <View style={styles.modalBtnRow}>
              <Pressable style={styles.cancelBtn} onPress={() => setPaymentModal(false)}>
                <Text style={styles.cancelText}>Cancel</Text>
              </Pressable>
              <Pressable style={styles.confirmBtn} onPress={handleCompletePayment}>
                <Text style={styles.confirmText}>
                  {paymentMethod === 'Card' ? `Pay LKR ${totalAmount}` : 'Confirm Order'}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  image: { width: '100%', height: 210 },
  detailsContainer: { padding: 18 },
  category: { fontSize: 12, color: '#ff6b6b', fontWeight: 'bold', textTransform: 'uppercase' },
  title: { fontSize: 22, fontWeight: 'bold', color: '#222', marginVertical: 4 },
  price: { fontSize: 18, fontWeight: '700', color: '#27ae60', marginBottom: 8 },
  prepText: { fontSize: 13, color: '#7f8c8d', fontWeight: 'normal' },
  description: { fontSize: 14, color: '#555', lineHeight: 20, marginBottom: 14 },
  sectionLabel: { fontSize: 14, fontWeight: 'bold', color: '#333', marginTop: 10, marginBottom: 6 },
  qtyRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  qtyBtn: { backgroundColor: '#eee', width: 36, height: 36, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  qtyBtnText: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  qtyValue: { fontSize: 18, fontWeight: 'bold', marginHorizontal: 16 },
  totalPreview: { marginLeft: 'auto', fontSize: 16, fontWeight: 'bold', color: '#222' },
  toggleRow: { flexDirection: 'row', gap: 10, marginBottom: 8 },
  toggleBtn: { flex: 1, paddingVertical: 10, borderRadius: 8, borderWidth: 1, borderColor: '#ddd', alignItems: 'center' },
  activeToggle: { backgroundColor: '#ff6b6b', borderColor: '#ff6b6b' },
  toggleText: { fontSize: 14, fontWeight: '600', color: '#555' },
  activeToggleText: { color: '#fff' },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 11, fontSize: 14, marginBottom: 10, backgroundColor: '#fafafa' },
  orderBtn: { backgroundColor: '#ff6b6b', paddingVertical: 14, borderRadius: 10, alignItems: 'center', marginTop: 12 },
  orderBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.55)', justifyContent: 'center', padding: 20 },
  modalBox: { backgroundColor: '#fff', borderRadius: 14, padding: 20 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#222', marginBottom: 6 },
  summaryText: { fontSize: 14, color: '#555', marginBottom: 14, fontWeight: '600' },
  cardForm: { marginTop: 6 },
  rowInputs: { flexDirection: 'row' },
  cashNote: { fontSize: 14, color: '#555', backgroundColor: '#f8f9fa', padding: 12, borderRadius: 8, marginVertical: 10 },
  modalBtnRow: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10, marginTop: 14 },
  cancelBtn: { paddingVertical: 11, paddingHorizontal: 16, borderRadius: 8, backgroundColor: '#eee' },
  cancelText: { color: '#333', fontWeight: '600' },
  confirmBtn: { paddingVertical: 11, paddingHorizontal: 18, borderRadius: 8, backgroundColor: '#27ae60' },
  confirmText: { color: '#fff', fontWeight: 'bold' },
});