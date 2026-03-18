import { useState } from "react";
import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext";
import "./PropertyCard.css";

export default function PropertyCard({ property }) {
  const { favorites, toggleFavorite, formatPrice } = useApp();
  const [currentPhoto, setCurrentPhoto] = useState(0);
  const isFav = favorites.includes(property.id);

  const prevPhoto = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentPhoto((p) => (p - 1 + property.photos.length) % property.photos.length);
  };

  const nextPhoto = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentPhoto((p) => (p + 1) % property.photos.length);
  };

  const handleFav = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(property.id);
  };

  return (
    <Link to={`/property/${property.id}`} className="property-card">
      {/* Image area */}
      <div className="property-card-img-wrapper">
        <img
          src={property.photos[currentPhoto]}
          alt={property.title}
          className="property-card-img"
          loading="lazy"
          onError={(e) => {
            e.target.src = `https://picsum.photos/seed/${property.id}-${currentPhoto}/400/300`;
          }}
        />

        {/* Favorite button */}
        <button
          className={`fav-btn ${isFav ? "active" : ""}`}
          onClick={handleFav}
          aria-label={isFav ? "Remove from favorites" : "Add to favorites"}
        >
          <svg viewBox="0 0 32 32" className="heart-icon">
            <path d="M16 28c0 0-14-8.4-14-18a8 8 0 0 1 14-5.3A8 8 0 0 1 30 10c0 9.6-14 18-14 18z" />
          </svg>
        </button>

        {/* Navigation arrows */}
        {property.photos.length > 1 && (
          <>
            <button className="photo-nav prev" onClick={prevPhoto} aria-label="Previous photo">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <button className="photo-nav next" onClick={nextPhoto} aria-label="Next photo">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>

            {/* Dots */}
            <div className="photo-dots">
              {property.photos.map((_, i) => (
                <span key={i} className={`photo-dot ${i === currentPhoto ? "active" : ""}`} />
              ))}
            </div>
          </>
        )}

        {/* Superhost badge */}
        {property.host?.isSuperhost && (
          <span className="superhost-badge">⭐ Superhost</span>
        )}
      </div>

      {/* Card info */}
      <div className="property-card-info">
        <div className="property-card-row">
          <h3 className="property-card-title">
            {property.location.city}, {property.location.country}
          </h3>
          <div className="property-card-rating">
            <svg viewBox="0 0 24 24" width="12" height="12" fill="var(--color-text-primary)">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            {property.rating}
          </div>
        </div>
        <p className="property-card-type">{property.type}</p>
        <p className="property-card-meta">
          {property.bedrooms} bedroom{property.bedrooms !== 1 ? "s" : ""} · {property.beds} bed{property.beds !== 1 ? "s" : ""}
        </p>
        <p className="property-card-price">
          <strong>{formatPrice(property.price)}</strong> <span className="night-label">/ night</span>
        </p>
      </div>
    </Link>
  );
}
