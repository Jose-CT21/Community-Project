import { useState } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { properties } from "../data/properties";
import { useAuth } from "../context/AuthContext";
import { useApp } from "../context/AppContext";
import { DateRange } from "react-date-range";
import { format } from "date-fns";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import "./BookingPage.css";

export default function BookingPage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, addBooking, getBookedDatesForProperty } = useAuth();
  const { formatPrice } = useApp();

  const property = properties.find((p) => p.id === id);

  const [checkin, setCheckin] = useState(searchParams.get("checkin") || "");
  const [checkout, setCheckout] = useState(searchParams.get("checkout") || "");
  const [guests, setGuests] = useState(parseInt(searchParams.get("guests") || "1"));

  const [showCalendar, setShowCalendar] = useState(false);
  const [showGuests, setShowGuests] = useState(false);
  const [dateRange, setDateRange] = useState([
    {
      startDate: searchParams.get("checkin") ? new Date(searchParams.get("checkin") + "T00:00:00") : new Date(),
      endDate: searchParams.get("checkout") ? new Date(searchParams.get("checkout") + "T00:00:00") : new Date(),
      key: "selection",
    },
  ]);

  const [paymentMethod, setPaymentMethod] = useState("card");
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCVV, setCardCVV] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [errors, setErrors] = useState({});
  const [bookingError, setBookingError] = useState("");

  // Get already-booked dates for this property
  const bookedDates = getBookedDatesForProperty(id);

  const handleSelectDate = (ranges) => {
    setDateRange([ranges.selection]);
    setCheckin(format(ranges.selection.startDate, "yyyy-MM-dd"));
    if (ranges.selection.endDate && ranges.selection.startDate !== ranges.selection.endDate) {
      setCheckout(format(ranges.selection.endDate, "yyyy-MM-dd"));
    }
  };

  if (!property) return null;

  const nights = () => {
    if (!checkin || !checkout) return 0;
    const d1 = new Date(checkin);
    const d2 = new Date(checkout);
    return Math.max(0, (d2 - d1) / (1000 * 60 * 60 * 24));
  };

  const n = nights();
  const subtotal = n * property.price;
  const serviceFee = Math.round(subtotal * 0.14);
  const cleaningFee = 50;
  const total = subtotal + serviceFee + cleaningFee;

  const validate = () => {
    const errs = {};
    if (!cardNumber.replace(/\s/g, "").match(/^\d{16}$/)) errs.cardNumber = "Enter a valid 16-digit card number";
    if (!cardName.trim()) errs.cardName = "Name is required";
    if (!cardExpiry.match(/^\d{2}\/\d{2}$/)) errs.cardExpiry = "Enter MM/YY";
    if (!cardCVV.match(/^\d{3,4}$/)) errs.cardCVV = "Invalid CVV";
    return errs;
  };

  const handleConfirm = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    const booking = addBooking({
      propertyId: property.id,
      propertyTitle: property.title,
      propertyPhoto: property.photos[0],
      propertyLocation: `${property.location.city}, ${property.location.country}`,
      checkin,
      checkout,
      guests,
      nights: n,
      total,
      status: "confirmed",
    });

    if (booking.error) {
      setBookingError(booking.error);
      return;
    }

    setBookingError("");
    setConfirmed(true);
  };

  if (confirmed) {
    return (
      <div className="page-wrapper booking-wrapper">
        <div className="booking-confirmation">
          <div className="confirmation-icon">🎉</div>
          <h1 className="confirmation-title">You're all set!</h1>
          <p className="confirmation-subtitle">
            Your reservation at <strong>{property.title}</strong> is confirmed.
          </p>
          <div className="confirmation-details">
            <div className="conf-row">
              <span>Check-in</span>
              <strong>{new Date(checkin).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</strong>
            </div>
            <div className="conf-row">
              <span>Checkout</span>
              <strong>{new Date(checkout).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</strong>
            </div>
            <div className="conf-row">
              <span>Guests</span>
              <strong>{guests}</strong>
            </div>
            <div className="conf-row total">
              <span>Total charged</span>
              <strong>{formatPrice(total)}</strong>
            </div>
          </div>
          <div className="confirmation-actions">
            <button className="btn btn-brand btn-lg" onClick={() => navigate("/bookings")}>
              View my trips
            </button>
            <button className="btn btn-outline" onClick={() => navigate("/")}>
              Back to home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper booking-wrapper">
      <div className="booking-page-grid">
        {/* Left: Payment form */}
        <div className="booking-form-section">
          <div className="booking-page-header" style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
            <button 
              className="btn-icon" 
              onClick={() => navigate(-1)} 
              aria-label="Go back"
              style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border-light)' }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <h1 className="booking-page-title" style={{ margin: 0 }}>Confirm and pay</h1>
          </div>

          {/* Trip details */}
          <div className="booking-trip-details">
            <h3 className="booking-section-heading">Your trip</h3>
            {/* Dates row */}
            <div className="trip-detail-row" style={{ position: "relative" }}>
              <div>
                <p className="trip-label">Dates</p>
                <p className="trip-value">{checkin} → {checkout}</p>
              </div>
              <button 
                className="btn-ghost btn-sm text-brand" 
                onClick={() => { setShowCalendar(!showCalendar); setShowGuests(false); }}
              >
                {showCalendar ? "Close" : "Edit"}
              </button>

              {/* Inline Calendar Popup */}
              {showCalendar && (
                <div style={{ position: "absolute", top: "100%", right: 0, zIndex: 10, marginTop: "8px", boxShadow: "var(--shadow-xl)", borderRadius: "var(--radius-lg)", overflow: "hidden", background: "var(--color-bg)", border: "1px solid var(--color-border-light)" }}>
                  <DateRange
                    ranges={dateRange}
                    onChange={handleSelectDate}
                    minDate={new Date()}
                    disabledDates={bookedDates}
                    rangeColors={["var(--color-brand)"]}
                    showDateDisplay={false}
                    months={1}
                    direction="horizontal"
                  />
                </div>
              )}
            </div>

            {/* Guests row */}
            <div className="trip-detail-row">
              <div>
                <p className="trip-label">Guests</p>
                {showGuests ? (
                  <select
                    value={guests}
                    onChange={(e) => { setGuests(parseInt(e.target.value)); setShowGuests(false); }}
                    style={{ marginTop: "4px", padding: "4px 8px", borderRadius: "var(--radius-sm)", border: "1px solid var(--color-border)", background: "var(--color-bg)", fontFamily: "var(--font-family)", fontSize: "var(--font-size-sm)" }}
                  >
                    {Array.from({ length: property.maxGuests }, (_, i) => i + 1).map((n) => (
                      <option key={n} value={n}>{n} guest{n > 1 ? "s" : ""}</option>
                    ))}
                  </select>
                ) : (
                  <p className="trip-value">{guests} guest{guests > 1 ? "s" : ""}</p>
                )}
              </div>
              <button 
                className="btn-ghost btn-sm text-brand" 
                onClick={() => { setShowGuests(!showGuests); setShowCalendar(false); }}
              >
                {showGuests ? "Close" : "Edit"}
              </button>
            </div>
          </div>

          <hr className="divider" />

          {/* Payment method */}
          <div className="payment-section">
            <h3 className="booking-section-heading">Pay with</h3>
            <div className="payment-method-tabs">
              {["card", "paypal"].map((m) => (
                <button
                  key={m}
                  className={`payment-tab ${paymentMethod === m ? "active" : ""}`}
                  onClick={() => setPaymentMethod(m)}
                >
                  {m === "card" ? "💳 Credit or debit card" : "🅿️ PayPal"}
                </button>
              ))}
            </div>

            {paymentMethod === "card" && (
              <form className="card-form" onSubmit={handleConfirm}>
                <div className="form-group">
                  <label className="form-label">Card number</label>
                  <input
                    className={`form-input ${errors.cardNumber ? "error" : ""}`}
                    placeholder="1234 5678 9012 3456"
                    value={cardNumber}
                    onChange={(e) => {
                      const v = e.target.value.replace(/\D/g, "").slice(0, 16);
                      setCardNumber(v.replace(/(.{4})/g, "$1 ").trim());
                    }}
                    maxLength={19}
                  />
                  {errors.cardNumber && <span className="form-error">{errors.cardNumber}</span>}
                </div>
                <div className="form-group">
                  <label className="form-label">Name on card</label>
                  <input
                    className={`form-input ${errors.cardName ? "error" : ""}`}
                    placeholder="John Doe"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                  />
                  {errors.cardName && <span className="form-error">{errors.cardName}</span>}
                </div>
                <div className="card-form-row">
                  <div className="form-group">
                    <label className="form-label">Expiry (MM/YY)</label>
                    <input
                      className={`form-input ${errors.cardExpiry ? "error" : ""}`}
                      placeholder="MM/YY"
                      value={cardExpiry}
                      onChange={(e) => {
                        let v = e.target.value.replace(/\D/g, "").slice(0, 4);
                        if (v.length > 2) v = v.slice(0, 2) + "/" + v.slice(2);
                        setCardExpiry(v);
                      }}
                      maxLength={5}
                    />
                    {errors.cardExpiry && <span className="form-error">{errors.cardExpiry}</span>}
                  </div>
                  <div className="form-group">
                    <label className="form-label">CVV</label>
                    <input
                      className={`form-input ${errors.cardCVV ? "error" : ""}`}
                      placeholder="123"
                      value={cardCVV}
                      onChange={(e) => setCardCVV(e.target.value.replace(/\D/g, "").slice(0, 4))}
                      maxLength={4}
                    />
                    {errors.cardCVV && <span className="form-error">{errors.cardCVV}</span>}
                  </div>
                </div>
                <p className="payment-disclaimer">
                  🔒 Your payment info is stored securely. Community Project never stores full card details.
                </p>
                {bookingError && (
                  <div style={{ background: "#fee2e2", color: "#b91c1c", padding: "12px 16px", borderRadius: "var(--radius-md)", marginBottom: "12px", fontSize: "var(--font-size-sm)", fontWeight: 600 }}>
                    ⚠️ {bookingError}
                  </div>
                )}
                <button type="submit" id="confirm-booking-btn" className="btn btn-brand btn-lg w-full">
                  Confirm and pay {formatPrice(total)}
                </button>
              </form>
            )}

            {paymentMethod === "paypal" && (
              <div className="paypal-placeholder">
                <p>You'll be redirected to PayPal to complete payment.</p>
                <button className="btn btn-brand btn-lg w-full mt-4" onClick={handleConfirm}>
                  Continue to PayPal
                </button>
              </div>
            )}
          </div>

          <hr className="divider" />

          <p className="cancellation-info">
            <strong>Cancellation policy ({property.cancellationPolicy}):</strong>{" "}
            {property.cancellationPolicy === "Flexible"
              ? "Free cancellation for 48 hours after booking."
              : property.cancellationPolicy === "Moderate"
              ? "Free cancellation 5 days before check-in."
              : "Non-refundable after 48h of booking."}
          </p>
        </div>

        {/* Right: Summary */}
        <div className="booking-summary">
          <div className="booking-summary-card">
            <div className="summary-property">
              <img
                src={property.photos[0]}
                alt={property.title}
                className="summary-property-img"
                loading="lazy"
                onError={(e) => { e.target.src = `https://picsum.photos/seed/${id}-summary/200/150`; }}
              />
              <div className="summary-property-info">
                <p className="summary-property-type">{property.type}</p>
                <p className="summary-property-title">{property.title}</p>
                <div className="summary-rating">⭐ {property.rating} · {property.reviewCount} reviews</div>
              </div>
            </div>

            <hr className="divider" />

            <h3 className="booking-section-heading">Price details</h3>
            <div className="price-breakdown">
              <div className="breakdown-row">
                <span>{formatPrice(property.price)} × {n} night{n !== 1 ? "s" : ""}</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="breakdown-row">
                <span>Cleaning fee</span>
                <span>{formatPrice(cleaningFee)}</span>
              </div>
              <div className="breakdown-row">
                <span>Service fee</span>
                <span>{formatPrice(serviceFee)}</span>
              </div>
              <hr className="divider" />
              <div className="breakdown-row total">
                <span>Total (USD)</span>
                <strong>{formatPrice(total)}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
