import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useApp } from "../context/AppContext";
import { format, parseISO } from "date-fns";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import "./Navbar.css";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { role, toggleRole, currency, setCurrency } = useApp();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const currentPath = useLocation().pathname;

  const [menuOpen, setMenuOpen] = useState(false);
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const menuRef = useRef(null);
  const searchRef = useRef(null);

  const locParam = searchParams.get("location");
  const checkinParam = searchParams.get("checkin");
  const checkoutParam = searchParams.get("checkout");
  const guestsParam = searchParams.get("guests");

  const [locationStr, setLocationStr] = useState("");
  const [checkinStr, setCheckinStr] = useState("");
  const [checkoutStr, setCheckoutStr] = useState("");
  const [guestCount, setGuestCount] = useState(1);
  const [dateRange, setDateRange] = useState([
    { startDate: new Date(), endDate: new Date(), key: "selection" }
  ]);

  useEffect(() => {
    if (searchExpanded) {
      setLocationStr(locParam || "");
      setCheckinStr(checkinParam || "");
      setCheckoutStr(checkoutParam || "");
      setGuestCount(guestsParam ? parseInt(guestsParam) : 1);
      setDateRange([
        {
          startDate: checkinParam ? parseISO(checkinParam) : new Date(),
          endDate: checkoutParam ? parseISO(checkoutParam) : new Date(),
          key: "selection",
        },
      ]);
    }
  }, [searchExpanded, locParam, checkinParam, checkoutParam, guestsParam]);

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchExpanded(false);
        setShowCalendar(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSelectDate = (ranges) => {
    setDateRange([ranges.selection]);
    setCheckinStr(format(ranges.selection.startDate, "yyyy-MM-dd"));
    if (ranges.selection.endDate && ranges.selection.startDate !== ranges.selection.endDate) {
      setCheckoutStr(format(ranges.selection.endDate, "yyyy-MM-dd"));
    } else {
      setCheckoutStr("");
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (locationStr) params.set("location", locationStr);
    if (checkinStr) params.set("checkin", checkinStr);
    if (checkoutStr) params.set("checkout", checkoutStr);
    if (guestCount > 1) params.set("guests", guestCount);
    
    setSearchExpanded(false);
    setShowCalendar(false);
    navigate(`/search?${params.toString()}`);
  };

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate("/");
  };

  // Dynamic search pill content

  const displayLocation = locParam || "Anywhere";
  
  let displayDates = "Any week";
  if (checkinParam && checkoutParam) {
    try {
      const start = parseISO(checkinParam);
      const end = parseISO(checkoutParam);
      if (start.getMonth() === end.getMonth()) {
        displayDates = `${format(start, "MMM d")} - ${format(end, "d")}`;
      } else {
        displayDates = `${format(start, "MMM d")} - ${format(end, "MMM d")}`;
      }
    } catch(e) {}
  } else if (checkinParam) {
    try {
      displayDates = format(parseISO(checkinParam), "MMM d");
    } catch(e) {}
  }

  const displayGuests = guestsParam 
    ? `${guestsParam} guest${parseInt(guestsParam) > 1 ? 's' : ''}` 
    : "Add guests";

  return (
    <header className="navbar">
      <div className="navbar-inner">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <img src="/logo.png" alt="Community Logo" className="logo-img" />
          <span className="logo-text">community</span>
        </Link>

        {/* Desktop Search Bar — hidden on homepage where Hero search exists */}
        {currentPath !== "/" && !searchExpanded && (
          <div className="navbar-search" onClick={() => setSearchExpanded(true)}>
            <span className="search-pill-item">{displayLocation}</span>
            <span className="search-pill-divider" />
            <span className="search-pill-item font-semibold">{displayDates}</span>
            <span className="search-pill-divider" />
            <span className={`search-pill-item ${!guestsParam ? 'muted' : ''}`}>{displayGuests}</span>
            <button className="search-pill-btn" aria-label="Search">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
            </button>
          </div>
        )}

        {currentPath !== "/" && searchExpanded && (
          <div className="navbar-expanded-container" ref={searchRef}>
            <form className="navbar-search-form" onSubmit={handleSearchSubmit}>
              <div className="navbar-search-field">
                <label>Where</label>
                <input
                  type="text"
                  value={locationStr}
                  onChange={(e) => setLocationStr(e.target.value)}
                  placeholder="Search destinations"
                  autoFocus
                />
              </div>
              <div className="navbar-search-divider" />
              <div 
                className="navbar-search-field"
                onClick={() => setShowCalendar(true)}
              >
                <label>Check in</label>
                <div style={{ fontSize: "var(--font-size-sm)", color: checkinStr ? "var(--color-text-primary)" : "var(--color-text-secondary)" }}>
                  {checkinStr ? format(dateRange[0].startDate, "MMM d, yyyy") : "Add dates"}
                </div>
              </div>
              <div className="navbar-search-divider" />
              <div 
                className="navbar-search-field"
                onClick={() => setShowCalendar(true)}
              >
                <label>Check out</label>
                <div style={{ fontSize: "var(--font-size-sm)", color: checkoutStr ? "var(--color-text-primary)" : "var(--color-text-secondary)" }}>
                  {checkoutStr ? format(dateRange[0].endDate, "MMM d, yyyy") : "Add dates"}
                </div>
              </div>
              <div className="navbar-search-divider" />
              <div className="navbar-search-field" style={{ flex: 0.7 }}>
                <label>Guests</label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={guestCount}
                  onChange={(e) => setGuestCount(parseInt(e.target.value) || 1)}
                />
              </div>
              <button type="submit" className="navbar-search-submit">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                Search
              </button>
            </form>

            {/* Calendar Popup */}
            {showCalendar && (
              <div className="navbar-calendar-popup">
                <DateRange
                  ranges={dateRange}
                  onChange={handleSelectDate}
                  minDate={new Date()}
                  rangeColors={["var(--color-brand)"]}
                  showDateDisplay={false}
                  months={2}
                  direction="horizontal"
                />
              </div>
            )}
          </div>
        )}

        {/* Right Controls */}
        <div className="navbar-right">
          {/* Host toggle */}
          <button
            className="btn-ghost navbar-host-btn"
            onClick={() => {
              toggleRole();
              if (role === "guest") navigate("/host/dashboard");
              else navigate("/");
            }}
          >
            {role === "guest" ? "Switch to Hosting" : "Switch to Traveling"}
          </button>

          {/* Currency */}
          <select
            className="currency-select"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            aria-label="Currency selector"
          >
            <option value="USD">USD</option>
            <option value="CRC">₡ Colón</option>
          </select>

          {/* User Menu */}
          <div className="user-menu-wrapper" ref={menuRef}>
            <button
              className="user-menu-btn"
              onClick={() => setMenuOpen((o) => !o)}
              aria-label="Open user menu"
              aria-expanded={menuOpen}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
              {user ? (
                user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="user-avatar" />
                ) : (
                  <div className="user-avatar-placeholder">
                    {user.name?.[0]?.toUpperCase()}
                  </div>
                )
              ) : (
                <div className="user-avatar-placeholder" style={{ background: "transparent", color: "var(--color-text-secondary)" }}>
                  <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="presentation" focusable="false" style={{ display: "block", height: "100%", width: "100%", fill: "currentColor" }}>
                    <path d="m16 .7c-8.437 0-15.3 6.863-15.3 15.3s6.863 15.3 15.3 15.3 15.3-6.863 15.3-15.3-6.863-15.3-15.3-15.3zm0 28c-4.021 0-7.605-1.884-9.933-4.81a12.425 12.425 0 0 1 6.451-4.4 6.507 6.507 0 0 1 -3.018-5.49c0-3.584 2.916-6.5 6.5-6.5s6.5 2.916 6.5 6.5a6.513 6.513 0 0 1 -3.019 5.491 12.42 12.42 0 0 1 6.452 4.4c-2.328 2.925-5.912 4.809-9.933 4.809z"></path>
                  </svg>
                </div>
              )}
            </button>

            {menuOpen && (
              <div className="user-dropdown" role="menu">
                {user ? (
                  <>
                    <div className="dropdown-header">
                      <span className="dropdown-name">{user.name}</span>
                      <span className="dropdown-email">{user.email}</span>
                    </div>
                    <hr className="dropdown-divider" />
                    <Link to="/profile" className="dropdown-item" onClick={() => setMenuOpen(false)}>Account</Link>
                    <Link to="/bookings" className="dropdown-item" onClick={() => setMenuOpen(false)}>My Trips</Link>
                    <Link to="/profile/payments" className="dropdown-item" onClick={() => setMenuOpen(false)}>Payments</Link>
                    {role === "host" && (
                      <Link to="/host/dashboard" className="dropdown-item" onClick={() => setMenuOpen(false)}>Hosting Dashboard</Link>
                    )}
                    {role === "guest" && (
                      <Link to="/host/dashboard" className="dropdown-item" onClick={() => { setMenuOpen(false); toggleRole(); }}>Start hosting</Link>
                    )}
                    <hr className="dropdown-divider" />
                    <button className="dropdown-item" onClick={handleLogout}>Log out</button>
                  </>
                ) : (
                  <>
                    <Link to="/register" className="dropdown-item fw-bold" onClick={() => setMenuOpen(false)}>Sign up</Link>
                    <Link to="/login" className="dropdown-item" onClick={() => setMenuOpen(false)}>Log in</Link>
                    <hr className="dropdown-divider" />
                    <Link to="/host/dashboard" className="dropdown-item" onClick={() => setMenuOpen(false)}>Host your home</Link>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Mobile Search Button (Visible only on mobile) */}
          {currentPath !== "/" && (
            <button className="mobile-search-trigger md-hidden" onClick={() => setSearchExpanded(true)} aria-label="Search">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
