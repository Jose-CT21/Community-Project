import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { AppProvider } from "./context/AppContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import BottomNav from "./components/BottomNav";
import HomePage from "./pages/HomePage";
import SearchResultsPage from "./pages/SearchResultsPage";
import PropertyDetailPage from "./pages/PropertyDetailPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import BookingPage from "./pages/BookingPage";
import MyTripsPage from "./pages/MyTripsPage";
import HostDashboardPage from "./pages/HostDashboardPage";
import HostEditPage from "./pages/HostEditPage";
import ProfilePage from "./pages/ProfilePage";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppProvider>
          <Navbar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/search" element={<SearchResultsPage />} />
            <Route path="/property/:id" element={<PropertyDetailPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/booking/:id" element={<BookingPage />} />
            <Route path="/bookings" element={<MyTripsPage />} />
            <Route path="/host/dashboard" element={<HostDashboardPage />} />
            <Route path="/host/edit/:id" element={<HostEditPage />} />
            <Route path="/host/new-listing" element={<HostEditPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route
              path="*"
              element={
                <div className="page-wrapper" style={{ display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "16px", minHeight: "80vh" }}>
                  <h1 style={{ fontSize: "72px", fontWeight: 800, color: "#222" }}>404</h1>
                  <p style={{ color: "#717171" }}>Page not found</p>
                  <a href="/" className="btn btn-brand">Back to home</a>
                </div>
              }
            />
          </Routes>
          <Footer />
          <BottomNav />
        </AppProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
