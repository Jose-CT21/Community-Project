import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("cp_user");
    return stored ? JSON.parse(stored) : null;
  });

  const [bookings, setBookings] = useState(() => {
    const stored = localStorage.getItem("cp_bookings");
    return stored ? JSON.parse(stored) : [];
  });

  const login = (userData) => {
    const u = { ...userData, role: userData.role || "guest" };
    setUser(u);
    localStorage.setItem("cp_user", JSON.stringify(u));
  };

  const register = (userData) => {
    const newUser = {
      id: `user-${Date.now()}`,
      ...userData,
      avatar: null,
      isSuperhost: false,
      joinedYear: new Date().getFullYear(),
      role: "guest",
    };
    setUser(newUser);
    localStorage.setItem("cp_user", JSON.stringify(newUser));
    return newUser;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("cp_user");
  };

  const addBooking = (booking) => {
    // Check for date overlap before allowing booking
    if (!isDateRangeAvailable(booking.propertyId, booking.checkin, booking.checkout)) {
      return { error: "These dates are already booked for this property." };
    }
    const newBooking = { ...booking, id: `booking-${Date.now()}`, createdAt: new Date().toISOString() };
    const updated = [newBooking, ...bookings];
    setBookings(updated);
    localStorage.setItem("cp_bookings", JSON.stringify(updated));
    return newBooking;
  };

  // Returns an array of Date objects that are already booked for a given property
  const getBookedDatesForProperty = (propertyId) => {
    const propertyBookings = bookings.filter(
      (b) => b.propertyId === propertyId && b.status === "confirmed"
    );
    const dates = [];
    propertyBookings.forEach((b) => {
      const start = new Date(b.checkin + "T00:00:00");
      const end = new Date(b.checkout + "T00:00:00");
      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        dates.push(new Date(d));
      }
    });
    return dates;
  };

  // Checks if a date range is available (no overlap with existing bookings)
  const isDateRangeAvailable = (propertyId, checkin, checkout) => {
    const propertyBookings = bookings.filter(
      (b) => b.propertyId === propertyId && b.status === "confirmed"
    );
    const newStart = new Date(checkin + "T00:00:00");
    const newEnd = new Date(checkout + "T00:00:00");
    return !propertyBookings.some((b) => {
      const existStart = new Date(b.checkin + "T00:00:00");
      const existEnd = new Date(b.checkout + "T00:00:00");
      return newStart < existEnd && newEnd > existStart;
    });
  };

  const updateUser = (data) => {
    const updated = { ...user, ...data };
    setUser(updated);
    localStorage.setItem("cp_user", JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, bookings, addBooking, updateUser, getBookedDatesForProperty, isDateRangeAvailable }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
