import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./ProfilePage.css";

export default function ProfilePage() {
  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("personal");
  const [form, setForm] = useState({ name: user?.name || "", email: user?.email || "" });
  const [saved, setSaved] = useState(false);

  if (!user) {
    return (
      <div className="page-wrapper">
        <div className="container" style={{ paddingTop: "80px", textAlign: "center" }}>
          <h2>You must be logged in to view your profile</h2>
          <button className="btn btn-brand mt-4" onClick={() => navigate("/login")}>Log in</button>
        </div>
      </div>
    );
  }

  const handleSave = (e) => {
    e.preventDefault();
    updateUser({ name: form.name, email: form.email });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const tabs = [
    { id: "personal", label: "Personal info" },
    { id: "security", label: "Login & Security" },
    { id: "privacy", label: "Privacy" },
    { id: "payments", label: "Payments" },
  ];

  return (
    <div className="page-wrapper">
      <div className="profile-container">
        <aside className="profile-sidebar">
          <div className="profile-user-card">
            <div className="profile-avatar">
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} />
              ) : (
                <span>{user.name?.[0]?.toUpperCase()}</span>
              )}
            </div>
            <div className="profile-user-info">
              <p className="profile-user-name">{user.name}</p>
              <p className="profile-user-email">{user.email}</p>
              {user.isSuperhost && <span className="badge badge-brand">⭐ Superhost</span>}
            </div>
          </div>

          <nav className="profile-nav">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`profile-nav-item ${activeTab === tab.id ? "active" : ""}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          <button className="btn btn-outline w-full" onClick={() => { logout(); navigate("/"); }}>
            Log out
          </button>
        </aside>

        <main className="profile-main">
          {activeTab === "personal" && (
            <section className="profile-section">
              <h2 className="profile-section-title">Personal information</h2>
              <p className="profile-section-desc">Update your personal details below.</p>
              <form className="profile-form" onSubmit={handleSave}>
                <div className="form-group">
                  <label className="form-label">Full name</label>
                  <input
                    className="form-input"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Your name"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Email address</label>
                  <input
                    type="email"
                    className="form-input"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="your@email.com"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Member since</label>
                  <input className="form-input" value={user.joinedYear || "2025"} disabled />
                </div>
                <div className="profile-form-actions">
                  <button type="submit" className="btn btn-brand">Save changes</button>
                  {saved && <span className="save-success">✓ Saved!</span>}
                </div>
              </form>
            </section>
          )}

          {activeTab === "security" && (
            <section className="profile-section">
              <h2 className="profile-section-title">Login & Security</h2>
              <div className="security-items">
                <div className="security-item">
                  <div>
                    <p className="security-item-title">Password</p>
                    <p className="security-item-desc">Last updated: never</p>
                  </div>
                  <button className="btn btn-outline btn-sm">Update</button>
                </div>
                <div className="security-item">
                  <div>
                    <p className="security-item-title">Phone number</p>
                    <p className="security-item-desc">Not verified</p>
                  </div>
                  <button className="btn btn-outline btn-sm">Add</button>
                </div>
                <div className="security-item">
                  <div>
                    <p className="security-item-title">Government ID</p>
                    <p className="security-item-desc">Not verified</p>
                  </div>
                  <button className="btn btn-outline btn-sm">Verify</button>
                </div>
              </div>
            </section>
          )}

          {activeTab === "privacy" && (
            <section className="profile-section">
              <h2 className="profile-section-title">Privacy</h2>
              <div className="privacy-toggles">
                {[
                  { label: "Show my profile to other users", default: true },
                  { label: "Allow hosts to see my reviews", default: true },
                  { label: "Personalized recommendations", default: false },
                  { label: "Marketing emails", default: false },
                ].map((item) => (
                  <div key={item.label} className="privacy-toggle-item">
                    <span className="privacy-label">{item.label}</span>
                    <label className="toggle-switch">
                      <input type="checkbox" defaultChecked={item.default} />
                      <span className="toggle-slider" />
                    </label>
                  </div>
                ))}
              </div>
            </section>
          )}

          {activeTab === "payments" && (
            <section className="profile-section">
              <h2 className="profile-section-title">Payments</h2>
              <div className="payments-tabs">
                <div className="payments-empty">
                  <span style={{ fontSize: "40px" }}>💳</span>
                  <h3>No payment methods added</h3>
                  <p className="text-muted">Add a card to pay for stays quickly.</p>
                  <button className="btn btn-brand mt-4">Add payment method</button>
                </div>
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}
