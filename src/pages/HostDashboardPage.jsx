import { useAuth } from "../context/AuthContext";
import { useApp } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import "./HostDashboard.css";

export default function HostDashboardPage() {
  const { user } = useAuth();
  const { role } = useApp();
  const navigate = useNavigate();

  const dummyListings = [
    { id: "prop-001", title: "Beachfront Villa with Ocean View", status: "Active", price: 320, bookings: 12, rating: 4.97 },
    { id: "prop-005", title: "Sprawling Family Mansion", status: "Active", price: 580, bookings: 5, rating: 4.91 },
  ];

  if (!user) {
    return (
      <div className="page-wrapper">
        <div className="container" style={{ paddingTop: "80px", textAlign: "center" }}>
          <h2>Please log in to access your host dashboard</h2>
          <button className="btn btn-brand mt-4" onClick={() => navigate("/login")}>Log in</button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <div className="host-dashboard">
        {/* Dashboard Header */}
        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-title">Welcome back, {user.name?.split(" ")[0]} 👋</h1>
            <p className="dashboard-subtitle">Manage your listings and track your earnings</p>
          </div>
          <button className="btn btn-brand" onClick={() => navigate("/host/new-listing")}>
            + New listing
          </button>
        </div>

        {/* Stats */}
        <div className="dashboard-stats">
          {[
            { label: "Total listings", value: dummyListings.length, icon: "🏠" },
            { label: "Total bookings", value: 17, icon: "📅" },
            { label: "Avg. rating", value: "4.94", icon: "⭐" },
            { label: "Earnings (month)", value: "$3,840", icon: "💰" },
          ].map((stat) => (
            <div key={stat.label} className="stat-card">
              <span className="stat-icon">{stat.icon}</span>
              <span className="stat-value">{stat.value}</span>
              <span className="stat-label">{stat.label}</span>
            </div>
          ))}
        </div>

        {/* Listings */}
        <section className="dashboard-section">
          <h2 className="dashboard-section-title">Your listings</h2>
          <div className="listings-table">
            {dummyListings.map((listing) => (
              <div key={listing.id} className="listing-row">
                <div className="listing-info">
                  <p className="listing-row-title">{listing.title}</p>
                  <div className="listing-row-meta">
                    <span className={`listing-status ${listing.status.toLowerCase()}`}>{listing.status}</span>
                    <span>⭐ {listing.rating}</span>
                    <span>{listing.bookings} bookings</span>
                  </div>
                </div>
                <div className="listing-price">${listing.price}<span>/night</span></div>
                <div className="listing-actions">
                  <button className="btn btn-outline btn-sm" onClick={() => navigate(`/property/${listing.id}`)}>View</button>
                  <button className="btn btn-outline btn-sm">Edit</button>
                </div>
              </div>
            ))}
          </div>
          <button className="btn btn-outline btn-sm mt-4">View all listings</button>
        </section>

        {/* Calendar placeholder */}
        <section className="dashboard-section">
          <h2 className="dashboard-section-title">Upcoming reservations</h2>
          <div className="upcoming-list">
            {[
              { guest: "Diego A.", checkin: "2025-04-10", checkout: "2025-04-15", property: "Beachfront Villa", total: 1760 },
              { guest: "Ana S.", checkin: "2025-04-20", checkout: "2025-04-22", property: "Beachfront Villa", total: 704 },
            ].map((res, i) => (
              <div key={i} className="upcoming-card">
                <div className="upcoming-avatar">{res.guest[0]}</div>
                <div className="upcoming-info">
                  <p className="upcoming-guest">{res.guest}</p>
                  <p className="upcoming-dates">{res.checkin} → {res.checkout}</p>
                  <p className="upcoming-property">{res.property}</p>
                </div>
                <div className="upcoming-total">${res.total}</div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
