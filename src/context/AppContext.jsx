import { createContext, useContext, useState } from "react";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [role, setRole] = useState("guest"); // "guest" | "host"
  const [currency, setCurrency] = useState("USD");
  const [favorites, setFavorites] = useState(() => {
    const stored = localStorage.getItem("cp_favorites");
    return stored ? JSON.parse(stored) : [];
  });

  const toggleFavorite = (propertyId) => {
    setFavorites((prev) => {
      const next = prev.includes(propertyId)
        ? prev.filter((id) => id !== propertyId)
        : [...prev, propertyId];
      localStorage.setItem("cp_favorites", JSON.stringify(next));
      return next;
    });
  };

  const toggleRole = () => setRole((r) => (r === "guest" ? "host" : "guest"));

  const formatPrice = (price) => {
    if (currency === "CRC") {
      return `₡${(price * 530).toLocaleString()}`;
    }
    return `$${price}`;
  };

  return (
    <AppContext.Provider value={{ role, toggleRole, currency, setCurrency, favorites, toggleFavorite, formatPrice }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
