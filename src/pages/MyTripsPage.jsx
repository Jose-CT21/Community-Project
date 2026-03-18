import { useAuth } from "../context/AuthContext";
import { useApp } from "../context/AppContext";
import { useNavigate, Link } from "react-router-dom";
import "./MyTripsPage.css";

export default function MyTripsPage() {
  const { user, bookings } = useAuth();
  const { formatPrice } = useApp();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="page-wrapper">
        <div className="container trips-empty-auth">
          <h2>Log in to see your trips</h2>
          <p>Once you've logged in, you'll find your trips here.</p>
          <div className="trips-auth-btns">
            <button className="btn btn-brand" onClick={() => navigate("/login")}>Log in</button>
            <button className="btn btn-outline" onClick={() => navigate("/register")}>Sign up</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <div className="trips-container">
        <h1 className="trips-title">Trips</h1>

        {bookings.length === 0 ? (
          <div className="trips-empty">
            <span className="trips-empty-icon">✈️</span>
            <h2>No trips yet — time to plan one!</h2>
            <p>Start searching for stays to begin your next adventure.</p>
            <button className="btn btn-brand btn-lg mt-4" onClick={() => navigate("/search")}>
              Explore stays
            </button>
          </div>
        ) : (
          <div className="trips-list">
            {bookings.map((booking) => (
              <div key={booking.id} className="trip-card">
                <img
                  src={booking.propertyPhoto}
                  alt={booking.propertyTitle}
                  className="trip-card-img"
                  onError={(e) => { e.target.src = `https://picsum.photos/seed/${booking.propertyId}/300/200`; }}
                />
                <div className="trip-card-info">
                  <div className="trip-card-header">
                    <h3 className="trip-card-title">{booking.propertyTitle}</h3>
                    <span className={`trip-status ${booking.status}`}>{booking.status}</span>
                  </div>
                  <p className="trip-card-location">📍 {booking.propertyLocation}</p>
                  <p className="trip-card-dates">
                    {new Date(booking.checkin).toLocaleDateString("en-US", { month: "short", day: "numeric" })} –{" "}
                    {new Date(booking.checkout).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    · {booking.nights} night{booking.nights !== 1 ? "s" : ""} · {booking.guests} guest{booking.guests !== 1 ? "s" : ""}
                  </p>
                  <p className="trip-card-total">Total: {formatPrice(booking.total)}</p>
                  <div className="trip-card-actions">
                    <Link to={`/property/${booking.propertyId}`} className="btn btn-outline btn-sm">
                      View property
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
