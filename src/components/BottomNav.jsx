import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./BottomNav.css";

export default function BottomNav() {
  const location = useLocation();
  const { user } = useAuth();
  
  // Hide bottom nav on property detail pages to give full focus to the booking bar
  if (location.pathname.startsWith("/property/")) {
    return null;
  }

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="bottom-nav">
      <Link to="/" className={`bottom-nav-item ${isActive("/") || isActive("/search") ? "active" : ""}`}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <span>Explorar</span>
      </Link>
      
      <Link to="/#favoritos" className="bottom-nav-item">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
        </svg>
        <span>Favoritos</span>
      </Link>
      
      <Link to={user ? "/bookings" : "/login"} className={`bottom-nav-item ${isActive("/bookings") ? "active" : ""}`}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <polyline points="12 6 12 12 16 14"></polyline>
        </svg>
        <span>Viajes</span>
      </Link>
      
      <Link to={user ? "/profile" : "/login"} className={`bottom-nav-item ${isActive("/profile") || isActive("/login") || isActive("/register") ? "active" : ""}`}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
        <span>Perfil</span>
      </Link>
    </nav>
  );
}
