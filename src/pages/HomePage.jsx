import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { categories } from "../data/properties";
import { properties } from "../data/properties";
import PropertyCard from "../components/PropertyCard";
import { DateRange } from "react-date-range";
import { format } from "date-fns";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import "./HomePage.css";

export default function HomePage() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("trending");
  const [location, setLocation] = useState("");
  const [checkin, setCheckin] = useState("");
  const [checkout, setCheckout] = useState("");
  const [guests, setGuests] = useState(1);
  const [showCalendar, setShowCalendar] = useState(false);
  const calendarRef = useRef(null);
  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  const handleSelectDate = (ranges) => {
    setDateRange([ranges.selection]);
    setCheckin(format(ranges.selection.startDate, "yyyy-MM-dd"));
    if (ranges.selection.endDate && ranges.selection.startDate !== ranges.selection.endDate) {
      setCheckout(format(ranges.selection.endDate, "yyyy-MM-dd"));
    } else {
      setCheckout("");
    }
  };

  // Close calendar on outside click
  useEffect(() => {
    if (!showCalendar) return;
    const handler = (e) => {
      if (calendarRef.current && !calendarRef.current.contains(e.target)) {
        setShowCalendar(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showCalendar]);

  const filteredProperties =
    activeCategory === "all"
      ? properties
      : properties.filter((p) => p.category.toLowerCase() === activeCategory.toLowerCase());

  // Scroll reveal animation with IntersectionObserver
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );

    // Small delay to ensure DOM is painted
    const timer = setTimeout(() => {
      document.querySelectorAll(".reveal").forEach((el) => {
        el.classList.remove("revealed");
        observer.observe(el);
      });
    }, 100);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [activeCategory]);

  const handleHeroSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (location) params.set("location", location);
    if (checkin) params.set("checkin", checkin);
    if (checkout) params.set("checkout", checkout);
    if (guests > 1) params.set("guests", guests);
    navigate(`/search?${params.toString()}`);
  };

  return (
    <div className="page-wrapper">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-bg" />
        <div className="hero-overlay" />
        <div className="hero-content">
          <h1 className="hero-title">Find your next adventure</h1>
          <p className="hero-subtitle">
            Discover unique stays and experiences across the world
          </p>

          {/* Hero Search Bar */}
          <form className="hero-search-bar" onSubmit={handleHeroSearch} style={{ position: "relative" }}>
            <div className="hero-search-field">
              <label className="hero-search-label">Where</label>
              <input
                className="hero-search-input"
                type="text"
                placeholder="Search destinations"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            <div className="hero-search-divider" />
            <div 
              className="hero-search-field"
              onClick={() => setShowCalendar(true)}
              style={{ cursor: "pointer" }}
            >
              <label className="hero-search-label">Check in</label>
              <div className="hero-search-input" style={{ paddingTop: "2px", height: "auto" }}>
                {checkin ? format(dateRange[0].startDate, "MM/dd/yyyy") : <span style={{ color: "var(--color-text-tertiary)" }}>Add dates</span>}
              </div>
            </div>
            <div className="hero-search-divider" />
            <div 
              className="hero-search-field"
              onClick={() => setShowCalendar(true)}
              style={{ cursor: "pointer" }}
            >
              <label className="hero-search-label">Check out</label>
              <div className="hero-search-input" style={{ paddingTop: "2px", height: "auto" }}>
                {checkout ? format(dateRange[0].endDate, "MM/dd/yyyy") : <span style={{ color: "var(--color-text-tertiary)" }}>Add dates</span>}
              </div>
            </div>
            <div className="hero-search-divider" />
            <div className="hero-search-field">
              <label className="hero-search-label">Guests</label>
              <input
                className="hero-search-input"
                type="number"
                min="1"
                max="20"
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
                placeholder="Add guests"
              />
            </div>
            <button type="submit" className="hero-search-btn" aria-label="Search">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <span>Search</span>
            </button>

            {/* Calendar Popup */}
            {showCalendar && (
              <div
                ref={calendarRef}
                className="calendar-popup"
                style={{ position: "absolute", top: "100%", left: "50%", transform: "translateX(-50%)", zIndex: 1000, marginTop: "12px", boxShadow: "var(--shadow-xl)", borderRadius: "var(--radius-lg)", overflow: "hidden", background: "var(--color-bg)", border: "1px solid var(--color-border-light)" }}
              >
                <DateRange
                  ranges={dateRange}
                  onChange={handleSelectDate}
                  minDate={new Date()}
                  rangeColors={["var(--color-brand)"]}
                  showDateDisplay={false}
                  months={1}
                  direction="horizontal"
                />
              </div>
            )}
          </form>

          {/* Hero stats */}
          <div className="hero-stats">
            <div className="hero-stat"><strong>4M+</strong><span>Active listings</span></div>
            <div className="hero-stat-divider" />
            <div className="hero-stat"><strong>150+</strong><span>Countries</span></div>
            <div className="hero-stat-divider" />
            <div className="hero-stat"><strong>1B+</strong><span>Guest arrivals</span></div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="categories-section">
        <div className="container">
          <div className="categories-scroll">
            {categories.map((cat) => (
              <button
                key={cat.id}
                className={`category-btn ${activeCategory === cat.id ? "active" : ""}`}
                onClick={() => setActiveCategory(cat.id)}
              >
                <span className="category-icon">{cat.icon}</span>
                <span className="category-label">{cat.label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Properties Grid */}
      <section className="properties-section">
        <div className="container">
          <div className="section-header reveal">
            <h2 className="section-title">
              {filteredProperties.length > 0
                ? `${filteredProperties.length} ${activeCategory !== "all" ? categories.find((c) => c.id === activeCategory)?.label : "All"} stays`
                : "No stays in this category yet"}
            </h2>
            <button
              className="btn btn-outline btn-sm"
              onClick={() => navigate("/search")}
            >
              View all
            </button>
          </div>

          {filteredProperties.length > 0 ? (
            <div className="properties-grid reveal-stagger">
              {filteredProperties.map((property, index) => (
                <div key={property.id} className="reveal" style={{ "--reveal-index": index }}>
                  <PropertyCard property={property} priority={index < 4} />
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <span className="empty-icon">🏡</span>
              <p>No stays available in this category right now.</p>
              <button className="btn btn-brand mt-4" onClick={() => setActiveCategory("trending")}>
                See trending
              </button>
            </div>
          )}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-card reveal">
            <div className="cta-content">
              <h2 className="cta-title">Earn money as a host</h2>
              <p className="cta-desc">
                Share your space and start earning. Join millions of hosts and connect with guests from around the world.
              </p>
              <button className="btn btn-brand btn-lg" onClick={() => navigate("/host/dashboard")}>
                Start hosting
              </button>
            </div>
            <div className="cta-image">
              <img
                src="https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600&q=80"
                alt="Host your home"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
