import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { properties } from "../data/properties";
import PropertyCard from "../components/PropertyCard";
import "./SearchResultsPage.css";

export default function SearchResultsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const initialLocation = searchParams.get("location") || "";
  const initialCheckin = searchParams.get("checkin") || "";
  const initialCheckout = searchParams.get("checkout") || "";
  const initialGuests = parseInt(searchParams.get("guests") || "1");

  const location = initialLocation;
  const guests = initialGuests;
  
  const [sortBy, setSortBy] = useState("rating");
  const [showMap, setShowMap] = useState(false);
  const [priceMin, setPriceMin] = useState(0);
  const [priceMax, setPriceMax] = useState(1000);
  const [filterOpen, setFilterOpen] = useState(false);


  const filtered = properties
    .filter((p) => {
      if (location && !p.location.city.toLowerCase().includes(location.toLowerCase()) &&
          !p.location.country.toLowerCase().includes(location.toLowerCase())) return false;
      if (p.price < priceMin || p.price > priceMax) return false;
      if (p.maxGuests < guests) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      return 0;
    });

  return (
    <div className="page-wrapper search-results-page">

      <div className="search-results-layout">
        <aside className="filters-sidebar">
          {/* Mobile/Tablet filter controls */}
          <div className="filters-mobile-header">
            <button
              className="btn btn-outline btn-sm"
              onClick={() => setFilterOpen((o) => !o)}
            >
              ⚙️ Filters
            </button>
            <div className="filters-mobile-actions">
              <select
                className="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                aria-label="Sort results"
              >
                <option value="rating">Top rated</option>
                <option value="price-asc">Price: low to high</option>
                <option value="price-desc">Price: high to low</option>
              </select>
              <button
                className={`btn btn-sm ${showMap ? "btn-brand" : "btn-outline"}`}
                onClick={() => setShowMap((s) => !s)}
              >
                🗺️ {showMap ? "Hide" : "Map"}
              </button>
            </div>
          </div>

          {/* Desktop sidebar content (always visible on large) / Mobile panel */}
          <div className={`filters-content ${filterOpen ? "is-open" : ""}`}>
            <h3 className="filter-title hide-on-mobile">Filters</h3>
            
            <div className="filter-group hide-on-mobile" style={{ marginBottom: "var(--space-4)" }}>
              <label className="filter-label">Sort By</label>
              <select
                className="sort-select full-width"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                aria-label="Sort results"
              >
                <option value="rating">Top rated</option>
                <option value="price-asc">Price: low to high</option>
                <option value="price-desc">Price: high to low</option>
              </select>
            </div>

            <div className="filter-group">
              <label className="filter-label">Price range (per night)</label>
              <div className="price-range-inputs">
                <div className="form-group">
                  <label className="form-label">Min $</label>
                  <input
                    type="number"
                    className="form-input full-width"
                    value={priceMin}
                    min="0"
                    onChange={(e) => setPriceMin(parseInt(e.target.value) || 0)}
                  />
                </div>
                <span>—</span>
                <div className="form-group">
                  <label className="form-label">Max $</label>
                  <input
                    type="number"
                    className="form-input full-width"
                    value={priceMax}
                    min="0"
                    onChange={(e) => setPriceMax(parseInt(e.target.value) || 1000)}
                  />
                </div>
              </div>
            </div>

            <div className="filter-group hide-on-mobile" style={{ marginTop: "var(--space-6)" }}>
              <button
                className={`btn full-width ${showMap ? "btn-brand" : "btn-outline"}`}
                onClick={() => setShowMap((s) => !s)}
              >
                🗺️ {showMap ? "Hide map view" : "Show interactive map"}
              </button>
            </div>
          </div>
        </aside>

      {/* Main content */}
      <div className={`results-content ${showMap ? "with-map" : ""}`}>
        <div className="results-list">
          <p className="results-count">
            {filtered.length} stay{filtered.length !== 1 ? "s" : ""} found
            {location ? ` in "${location}"` : ""}
          </p>
          {filtered.length > 0 ? (
            <div className="properties-grid">
              {filtered.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <span className="empty-icon">🔍</span>
              <p>No stays match your search criteria.</p>
              <button
                className="btn btn-brand mt-4"
                onClick={() => { setLocation(""); setPriceMin(0); setPriceMax(1000); setGuests(1); }}
              >
                Clear filters
              </button>
            </div>
          )}
        </div>

        {/* Map Placeholder */}
        {showMap && (
          <div className="results-map">
            <div className="map-placeholder">
              <span>🗺️</span>
              <p>Map view</p>
              <p className="text-muted">Interactive map coming soon</p>
              {filtered.map((p) => (
                <div key={p.id} className="map-price-pin" style={{ top: `${Math.random() * 70 + 10}%`, left: `${Math.random() * 70 + 10}%` }}>
                  ${p.price}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
  );
}
