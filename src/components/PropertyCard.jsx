import { useState } from "react";
import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext";
import "./PropertyCard.css";

export default function PropertyCard({ property, priority = false }) {
  const { favorites, toggleFavorite, formatPrice } = useApp();
  const [currentPhoto, setCurrentPhoto] = useState(0);
  const isFav = favorites.includes(property.id);

  const getDotsTranslate = (current, total) => {
    if (total <= 5) return 0;
    // Track has 10px padding. Wrapper is 66px.
    // To center index 'current' in a 5-dot window:
    const shift = Math.max(0, Math.min(current - 2, total - 5));
    return -(shift * 10);
  };

  const getDotSizeClass = (idx, current, total) => {
    if (idx === current) return "active";
    if (total <= 5) return "";
    
    const visibleStart = Math.max(0, Math.min(current - 2, total - 5));
    const visibleEnd = visibleStart + 4;
    
    if (idx < visibleStart || idx > visibleEnd) return "hidden";
    if (idx === visibleStart && visibleStart > 0) return "small";
    if (idx === visibleEnd && visibleEnd < total - 1) return "small";
    return "";
  };

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
        {property.photos.map((photo, i) => (
          <img
            key={i}
            src={photo}
            alt={`${property.title} - ${i + 1}`}
            className={`property-card-img ${i === currentPhoto ? "active" : ""}`}
            loading={priority && i === 0 ? "eager" : "lazy"}
            decoding={priority && i === 0 ? "sync" : "async"}
            onError={(e) => {
              e.target.src = `https://picsum.photos/seed/${property.id}-${i}/400/300`;
            }}
          />
        ))}

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

            {/* Sliding Dots Carousel */}
            <div className="photo-dots-wrapper">
              <div 
                className="photo-dots-track"
                style={{
                  transform: `translateX(${getDotsTranslate(currentPhoto, property.photos.length)}px)`
                }}
              >
                {property.photos.map((_, i) => (
                  <span 
                    key={i} 
                    className={`photo-dot ${getDotSizeClass(i, currentPhoto, property.photos.length)}`} 
                  />
                ))}
              </div>
            </div>
          </>
        )}

        {/* Superhost badge */}
        {property.host?.isSuperhost && (
          <span className="superhost-badge">⭐ Superhost</span>
        )}
      </div>

      {/* Card Content Right Side */}
      <div className="property-card-content">
        <div className="property-card-body">
          <h3 className="property-card-title">
            {property.title}
          </h3>
          <p className="property-card-desc">
            {property.description || `Beautiful ${property.type.toLowerCase()} in ${property.location.city}, ${property.location.country}.`}
          </p>
        </div>
        
        <div className="property-card-footer">
          <div className="footer-left">
            <div className="property-card-price">
              <strong>${property.price}</strong> <span className="night-label">per person*</span>
            </div>
            <div className="property-card-rating">
              <span className="stars-green">
                {[...Array(5)].map((_, i) => (
                   <svg key={i} viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                     <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                   </svg>
                ))}
              </span>
              <span className="reviews-text">{property.reviewCount || 28} reviews</span>
            </div>
            <div className="disclaimer-text">*Prices may vary depending on selected date.</div>
          </div>
          <div className="footer-right">
            <button className="book-btn" onClick={(e) => { e.preventDefault(); /* Hook up to booking later */ }}>Book now</button>
          </div>
        </div>
      </div>
    </Link>
  );
}
// Trigger HMR update
