import { useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { properties } from "../data/properties";
import { reviews } from "../data/reviews";
import { useApp } from "../context/AppContext";
import { useAuth } from "../context/AuthContext";
import { DateRange } from "react-date-range";
import { format } from "date-fns";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import "./PropertyDetailPage.css";

export default function PropertyDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { formatPrice, favorites, toggleFavorite } = useApp();
  const { user } = useAuth();

  const property = properties.find((p) => p.id === id);
  const propertyReviews = reviews.filter((r) => r.propertyId === id);
  const isFav = favorites.includes(id);

  const [mainPhoto, setMainPhoto] = useState(0);
  const [checkin, setCheckin] = useState("");
  const [checkout, setCheckout] = useState("");
  const [guests, setGuests] = useState(1);
  const [showAllAmenities, setShowAllAmenities] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showLightbox, setShowLightbox] = useState(false);
  const [showReviewsModal, setShowReviewsModal] = useState(false);
  const [activeMobilePhoto, setActiveMobilePhoto] = useState(0);

  // Mouse-drag scrolling for reviews slider on desktop
  const sliderRef = useRef(null);
  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const dragScrollLeft = useRef(0);

  const handleSliderMouseDown = (e) => {
    isDragging.current = true;
    sliderRef.current.classList.add('is-dragging');
    dragStartX.current = e.pageX - sliderRef.current.offsetLeft;
    dragScrollLeft.current = sliderRef.current.scrollLeft;
  };

  const handleSliderMouseLeave = () => {
    isDragging.current = false;
    sliderRef.current?.classList.remove('is-dragging');
  };

  const handleSliderMouseUp = () => {
    isDragging.current = false;
    sliderRef.current?.classList.remove('is-dragging');
  };

  const handleSliderMouseMove = (e) => {
    if (!isDragging.current) return;
    e.preventDefault();
    const x = e.pageX - sliderRef.current.offsetLeft;
    const walk = (x - dragStartX.current) * 1.5;
    sliderRef.current.scrollLeft = dragScrollLeft.current - walk;
  };
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

  const handleMobilePhotoScroll = (e) => {
    const scrollLeft = e.target.scrollLeft;
    const width = e.target.offsetWidth;
    const newIndex = Math.round(scrollLeft / width);
    setActiveMobilePhoto(newIndex);
  };

  if (!property) {
    return (
      <div className="page-wrapper">
        <div className="container" style={{ paddingTop: "64px", textAlign: "center" }}>
          <h2>Property not found</h2>
          <button className="btn btn-brand mt-4" onClick={() => navigate("/")}>Back to home</button>
        </div>
      </div>
    );
  }

  const nightCount = () => {
    if (!checkin || !checkout) return 0;
    const d1 = dateRange[0].startDate;
    const d2 = dateRange[0].endDate;
    return Math.round(Math.max(0, (d2 - d1) / (1000 * 60 * 60 * 24)));
  };

  const nights = nightCount();
  const subtotal = nights * property.price;
  const serviceFee = Math.round(subtotal * 0.14);
  const total = subtotal + serviceFee;

  const handleReserve = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    navigate(`/booking/${property.id}?checkin=${checkin}&checkout=${checkout}&guests=${guests}`);
  };

  const displayedAmenities = showAllAmenities ? property.amenities : property.amenities.slice(0, 6);

  const getOptimizedUrl = (url, width = 800) => {
    if (!url) return "";
    if (url.includes("unsplash.com")) {
      const baseUrl = url.split("?")[0];
      return `${baseUrl}?w=${width}&q=80&fm=webp&auto=format&fit=crop`;
    }
    if (url.includes("picsum.photos")) {
      return url.replace(/\/\d+\/\d+$/, `/${width}/${Math.round(width * 0.6)}`);
    }
    return url;
  };

  return (
    <div className="page-wrapper">
      <div className="detail-container">
        {/* Header */}
        <div className="detail-header">
          <h1 className="detail-title">{property.title}</h1>
          <div className="detail-meta-row">
            <div className="detail-rating">
              ⭐ {property.rating} · <span className="underline">{property.reviewCount} reviews</span>
              {property.host?.isSuperhost && <span className="dot">·</span>}
              {property.host?.isSuperhost && <span className="superhost-tag">🏆 Superhost</span>}
              <span className="dot">·</span>
              <span className="underline">{property.location.city}, {property.location.country}</span>
            </div>
            <div className="detail-actions">
              <button className="detail-action-btn" onClick={() => toggleFavorite(id)}>
                <svg viewBox="0 0 32 32" width="16" height="16">
                  <path
                    d="M16 28c0 0-14-8.4-14-18a8 8 0 0 1 14-5.3A8 8 0 0 1 30 10c0 9.6-14 18-14 18z"
                    fill={isFav ? "var(--color-brand)" : "none"}
                    stroke={isFav ? "var(--color-brand)" : "currentColor"}
                    strokeWidth="2"
                  />
                </svg>
                {isFav ? "Saved" : "Save"}
              </button>
              <button className="detail-action-btn">
                ↑ Share
              </button>
            </div>
          </div>
        </div>

        {/* Photo Gallery - Restructured to 1+4 Grid (Desktop) */}
        <div className="photo-gallery desktop-only">
          {/* Main Photo (0) */}
          <div className="photo-main" onClick={() => setShowLightbox(true)} style={{ cursor: "pointer" }}>
            <img
              src={getOptimizedUrl(property.photos[0], 1200)}
              alt={property.title}
              fetchpriority="high"
              loading="eager"
              decoding="sync"
              onError={(e) => { e.target.src = `https://picsum.photos/seed/${id}-main/1200/800`; }}
            />
          </div>

          {/* Thumbnail Grid (1 to 4) */}
          <div className="photo-thumbs-grid">
            {property.photos.slice(1, 5).map((photo, i) => {
              const photoIdx = i + 1;
              return (
                <div
                  key={photoIdx}
                  className="photo-thumb"
                  onClick={() => { setMainPhoto(photoIdx); setShowLightbox(true); }}
                >
                  <img
                    src={getOptimizedUrl(photo, 600)}
                    alt={`Photo ${photoIdx + 1}`}
                    loading="lazy"
                    decoding="async"
                    onError={(e) => { e.target.src = `https://picsum.photos/seed/${id}-${photoIdx}/600/400`; }}
                  />
                  {photoIdx === 4 && property.photos.length > 5 && (
                    <div className="photo-thumb more-photos" onClick={(e) => { e.stopPropagation(); setShowLightbox(true); }}>
                      <span>+{property.photos.length - 5} more</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Swipeable Photo Gallery (Mobile) */}
        <div className="photo-slider-mobile mobile-only" onScroll={handleMobilePhotoScroll}>
          {property.photos.map((photo, i) => (
            <div key={i} className="mobile-slide" onClick={() => { setMainPhoto(i); setShowLightbox(true); }}>
              <img
                src={getOptimizedUrl(photo, 800)}
                alt={`${property.title} - ${i + 1}`}
                loading={i === 0 ? "eager" : "lazy"}
              />
            </div>
          ))}
          <div className="mobile-photo-badge">
            {activeMobilePhoto + 1} / {property.photos.length}
          </div>
        </div>

        {/* Fullscreen Lightbox */}
        {showLightbox && (
          <div className="lightbox-overlay" style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(0,0,0,0.9)", display: "flex", flexDirection: "column", color: "white" }}>
            <div className="lightbox-header" style={{ padding: "var(--space-4) var(--space-6)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "var(--font-size-sm)" }}>{mainPhoto + 1} / {property.photos.length}</span>
              <button 
                onClick={() => setShowLightbox(false)} 
                style={{ background: "none", border: "none", color: "white", fontSize: "var(--font-size-xl)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", width: "40px", height: "40px", borderRadius: "50%", backgroundColor: "rgba(255,255,255,0.1)" }}
              >
                ✕
              </button>
            </div>
            <div className="lightbox-content" style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", padding: "var(--space-4)" }}>
              <button 
                onClick={(e) => { e.stopPropagation(); setMainPhoto((prev) => (prev > 0 ? prev - 1 : property.photos.length - 1)); }}
                style={{ position: "absolute", left: "var(--space-6)", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", color: "white", width: "48px", height: "48px", borderRadius: "50%", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem", zIndex: 2 }}
              >
                ←
              </button>
              
              <img 
                src={getOptimizedUrl(property.photos[mainPhoto], 1600)} 
                alt="Fullscreen view" 
                loading="lazy"
                decoding="async"
                style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
                onError={(e) => { e.target.src = `https://picsum.photos/seed/${id}-${mainPhoto}/1600/1000`; }}
              />

              <button 
                onClick={(e) => { e.stopPropagation(); setMainPhoto((prev) => (prev < property.photos.length - 1 ? prev + 1 : 0)); }}
                style={{ position: "absolute", right: "var(--space-6)", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", color: "white", width: "48px", height: "48px", borderRadius: "50%", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem", zIndex: 2 }}
              >
                →
              </button>
            </div>
          </div>
        )}

        {/* Main content + Booking widget */}
        <div className="detail-main">
          <div className="detail-content">
            {/* Host info */}
            <div className="host-section">
              <div className="host-info">
                <h2 className="property-type-title">
                  {property.type} hosted by {property.host?.name}
                </h2>
                <p className="property-info-summary">
                  {property.maxGuests} guests · {property.bedrooms} bedrooms · {property.beds} beds · {property.bathrooms} bathrooms
                </p>
              </div>
              <div className="host-avatar-wrapper">
                <img
                  src={property.host?.avatar}
                  alt={property.host?.name}
                  className="host-avatar-detail"
                  loading="lazy"
                  decoding="async"
                  onError={(e) => { e.target.src = `https://i.pravatar.cc/56?u=${property.host?.id}`; }}
                />
                {property.host?.isSuperhost && <span className="host-star">⭐</span>}
              </div>
            </div>

            <hr className="divider" />

            {/* Description */}
            <section className="detail-section">
              <p className="property-description">{property.description}</p>
            </section>

            <hr className="divider" />

            {/* Amenities */}
            <section className="detail-section">
              <h3 className="detail-section-title">What this place offers</h3>
              <div className="amenities-grid">
                {displayedAmenities.map((amenity) => (
                  <div key={amenity} className="amenity-item">
                    <span className="amenity-icon">✓</span>
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
              {property.amenities.length > 6 && (
                <button
                  className="btn btn-outline mt-4"
                  onClick={() => setShowAllAmenities((s) => !s)}
                >
                  {showAllAmenities ? "Show less" : `Show all ${property.amenities.length} amenities`}
                </button>
              )}
            </section>

            <hr className="divider" />

            {/* House Rules */}
            <section className="detail-section">
              <h3 className="detail-section-title">House rules</h3>
              <ul className="rules-list">
                {property.houseRules.map((rule, i) => (
                  <li key={i} className="rule-item">
                    <span className="rule-bullet">•</span>
                    {rule}
                  </li>
                ))}
              </ul>
              <div className="checkin-info">
                <div className="checkin-info-item">
                  <span className="checkin-label">Check-in</span>
                  <span className="checkin-value">{property.checkIn}</span>
                </div>
                <div className="checkin-info-item">
                  <span className="checkin-label">Checkout</span>
                  <span className="checkin-value">{property.checkOut}</span>
                </div>
                <div className="checkin-info-item">
                  <span className="checkin-label">Cancellation</span>
                  <span className="checkin-value">{property.cancellationPolicy}</span>
                </div>
              </div>
            </section>

            <hr className="divider" />

            {/* Reviews */}
            <section className="detail-section">
              <div className="reviews-header">
                <h3 className="detail-section-title">⭐ {property.rating} · {property.reviewCount} reviews</h3>
              </div>
              {propertyReviews.length > 0 ? (
                <>
                  <div className="reviews-slider-wrapper">
                    <div
                      className="reviews-slider"
                      ref={sliderRef}
                      onMouseDown={handleSliderMouseDown}
                      onMouseLeave={handleSliderMouseLeave}
                      onMouseUp={handleSliderMouseUp}
                      onMouseMove={handleSliderMouseMove}
                    >
                      {propertyReviews.map((review) => (
                        <div key={review.id} className="review-card slider-card">
                          <div className="review-author">
                            <img
                              src={review.guestAvatar}
                              alt={review.guestName}
                              className="review-avatar"
                              loading="lazy"
                              onError={(e) => { e.target.src = `https://i.pravatar.cc/40?u=${review.userId}`; }}
                            />
                            <div>
                              <p className="review-name">{review.guestName}</p>
                              <p className="review-date">{new Date(review.date).toLocaleDateString("es-ES", { month: "long", year: "numeric" })}</p>
                            </div>
                          </div>
                          <div className="review-stars">
                            {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
                          </div>
                          <p className="review-text">{review.comment}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <button 
                    className="btn btn-outline show-all-reviews-btn mt-4" 
                    onClick={() => setShowReviewsModal(true)}
                  >
                    Mostrar {propertyReviews.length} reseñas
                  </button>
                </>
              ) : (
                <p className="text-muted">No reviews yet. Be the first!</p>
              )}
            </section>
          </div>

          {/* Booking Widget */}
          <aside className="booking-widget sticky">
            <div className="booking-widget-inner">
              <div className="booking-price-header">
                <span className="booking-price">{formatPrice(property.price)}</span>
                <span className="booking-per-night"> / night</span>
                <div className="booking-rating">⭐ {property.rating} · {property.reviewCount} reviews</div>
              </div>

              <div style={{ position: "relative" }}>
                <div 
                  className="booking-dates-grid"
                  onClick={() => setShowCalendar(true)}
                  style={{ cursor: "pointer" }}
                >
                  <div className="booking-date-field">
                    <label>CHECK-IN</label>
                    <div className="booking-date-value" style={{ fontSize: "var(--font-size-sm)", color: checkin ? "var(--color-text-primary)" : "var(--color-text-secondary)" }}>
                      {checkin ? format(dateRange[0].startDate, "MM/dd/yyyy") : "Add date"}
                    </div>
                  </div>
                  <div className="booking-date-field">
                    <label>CHECKOUT</label>
                    <div className="booking-date-value" style={{ fontSize: "var(--font-size-sm)", color: checkout ? "var(--color-text-primary)" : "var(--color-text-secondary)" }}>
                      {checkout ? format(dateRange[0].endDate, "MM/dd/yyyy") : "Add date"}
                    </div>
                  </div>
                </div>

                {showCalendar && (
                  <>
                    <div 
                      className="calendar-overlay" 
                      onClick={() => setShowCalendar(false)}
                      style={{ position: "fixed", inset: 0, zIndex: 99 }}
                    />
                    <div className="calendar-popup" style={{ position: "absolute", top: "100%", right: 0, zIndex: 100, marginTop: "12px", boxShadow: "var(--shadow-xl)", borderRadius: "var(--radius-lg)", overflow: "hidden", background: "var(--color-bg)", border: "1px solid var(--color-border-light)" }}>
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
                  </>
                )}
              </div>

              <div className="booking-guests-field">
                <label>GUESTS</label>
                <select
                  value={guests}
                  onChange={(e) => setGuests(parseInt(e.target.value))}
                >
                  {Array.from({ length: property.maxGuests }, (_, i) => i + 1).map((n) => (
                    <option key={n} value={n}>{n} guest{n > 1 ? "s" : ""}</option>
                  ))}
                </select>
              </div>

              <button className="btn btn-brand btn-lg w-full" onClick={handleReserve}>
                Reserve
              </button>

              <p className="booking-charge-note">You won't be charged yet</p>

              {nights > 0 && (
                <div className="booking-breakdown">
                  <div className="breakdown-row">
                    <span>{formatPrice(property.price)} × {nights} night{nights > 1 ? "s" : ""}</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="breakdown-row">
                    <span>Service fee (14%)</span>
                    <span>{formatPrice(serviceFee)}</span>
                  </div>
                  <hr className="divider" />
                  <div className="breakdown-row total">
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>

      {/* Mobile Fixed Bottom Bar */}
      <div className="mobile-bottom-bar mobile-only">
        <div className="mobile-price-section">
          <div className="mobile-price-row">
            <span className="mobile-price-val">{formatPrice(property.price)}</span>
            <span className="mobile-price-label">/ night</span>
          </div>
          <div className="mobile-dates-label underline" onClick={() => setShowCalendar(true)}>
            {checkin ? `${format(new Date(checkin), "MMM d")} - ${format(new Date(checkout || checkin), "MMM d")}` : "Add dates"}
          </div>
        </div>
        <button className="btn btn-brand mobile-reserve-btn" onClick={handleReserve}>
          Reserve
        </button>
      </div>

      {/* Reviews Side Panel */}
      {showReviewsModal && (
        <div className="modal-overlay" onClick={() => setShowReviewsModal(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div className="sticky-header">
              <button className="close-btn" onClick={() => setShowReviewsModal(false)}>←</button>
            </div>

            <div className="modal-body">
              {/* Big rating hero */}
              <div className="modal-rating-hero">
                <div className="modal-rating-big">
                  <svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                  {property.rating}
                </div>
                <button className="modal-reviews-link">¿Cómo funcionan las reseñas?</button>
              </div>

              {/* Rating distribution bars */}
              <div className="rating-breakdown">
                {[5, 4, 3, 2, 1].map(n => {
                  const count = propertyReviews.filter(r => r.rating === n).length;
                  const pct = propertyReviews.length > 0 ? (count / propertyReviews.length) * 100 : 0;
                  return (
                    <>
                      <span key={`lbl-${n}`} className="rating-breakdown-label">{n}</span>
                      <div key={`bar-${n}`} className="rating-bar-track">
                        <div className="rating-bar-fill" style={{ width: `${pct}%` }} />
                      </div>
                    </>
                  );
                })}
              </div>

              {/* Category scores */}
              <div className="category-scores">
                {[
                  { name: 'Limpieza', icon: '🧹', score: (property.rating - 0.1).toFixed(1) },
                  { name: 'Exactitud', icon: '✓', score: (property.rating - 0.1).toFixed(1) },
                  { name: 'Check-in', icon: '🔑', score: (property.rating).toFixed(1) },
                  { name: 'Comunicación', icon: '💬', score: (property.rating).toFixed(1) },
                  { name: 'Ubicación', icon: '🗺', score: (property.rating + 0.1).toFixed(1) },
                  { name: 'Precio', icon: '🏷', score: (property.rating + 0.1).toFixed(1) },
                ].map(cat => (
                  <div key={cat.name} className="category-score-item">
                    <span className="category-score-name">{cat.name}</span>
                    <span className="category-score-val">{cat.score}</span>
                    <span className="category-score-icon">{cat.icon}</span>
                  </div>
                ))}
              </div>

              {/* Highlight tags */}
              <div className="review-highlights">
                <h3 className="review-highlights-title">Las reseñas de los huéspedes mencionan</h3>
                <div className="review-tags">
                  {['🛌 Comodidades', '🧹 Limpieza', '🌄 Vista', '📍 Ubicación', '😊 Anfitrión'].map(tag => (
                    <button key={tag} className="review-tag">
                      <span className="review-tag-emoji">{tag.split(' ')[0]}</span>
                      <span>{tag.split(' ').slice(1).join(' ')}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Reviews list */}
              <div className="reviews-panel-list">
                <div className="reviews-panel-count">{propertyReviews.length} reseñas</div>
                {propertyReviews.map(review => (
                  <div key={review.id} className="review-card vertical-card">
                    <div className="review-author">
                      <img
                        src={review.guestAvatar}
                        alt={review.guestName}
                        className="review-avatar"
                        loading="lazy"
                        onError={e => { e.target.src = `https://i.pravatar.cc/40?u=${review.userId}`; }}
                      />
                      <div>
                        <p className="review-name">{review.guestName}</p>
                        <p className="review-date">{new Date(review.date).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}</p>
                      </div>
                    </div>
                    <div className="review-stars" style={{ color: 'var(--color-text-primary)', letterSpacing: 2, fontSize: '0.8rem', margin: '4px 0' }}>
                      {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                    </div>
                    <p className="review-text">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
