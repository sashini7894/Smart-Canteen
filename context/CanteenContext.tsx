import React, { createContext, useState, useContext } from 'react';

interface CanteenContextType {
  favorites: string[];
  toggleFavorite: (id: string) => boolean;
  orders: any[];
  placeOrder: (orderDetails: any) => void;
}

const CanteenContext = createContext<CanteenContextType>({
  favorites: [],
  toggleFavorite: () => false,
  orders: [],
  placeOrder: () => {},
});

export const CanteenProvider = ({ children }: { children: React.ReactNode }) => {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [orders, setOrders] = useState<any[]>([]);

  const toggleFavorite = (id: string) => {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter((favId) => favId !== id));
      return false;
    } else {
      setFavorites([...favorites, id]);
      return true;
    }
  };

  const placeOrder = (orderDetails: any) => {
    const newOrder = {
      orderId: 'ORD-' + Math.floor(1000 + Math.random() * 9000),
      ...orderDetails,
      orderTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'Preparing 🍳',
    };
    setOrders([newOrder, ...orders]);
  };

  return (
    <CanteenContext.Provider value={{ favorites, toggleFavorite, orders, placeOrder }}>
      {children}
    </CanteenContext.Provider>
  );
};

export const useCanteen = () => useContext(CanteenContext);