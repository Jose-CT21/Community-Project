import { Link } from "react-router-dom";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-top">
          <div className="footer-col">
            <h4 className="footer-heading">Support</h4>
            <ul className="footer-links">
              <li><Link to="/help">Help Center</Link></li>
              <li><Link to="/safety">Safety information</Link></li>
              <li><Link to="/cancellation">Cancellation options</Link></li>
              <li><Link to="/disability">Disability support</Link></li>
              <li><Link to="/report">Report a concern</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4 className="footer-heading">Community</h4>
            <ul className="footer-links">
              <li><Link to="/diversity">Diversity & Belonging</Link></li>
              <li><Link to="/accessibility">Accessibility</Link></li>
              <li><Link to="/frontline">Frontline Stays</Link></li>
              <li><Link to="/invite">Invite a Host</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4 className="footer-heading">Hosting</h4>
            <ul className="footer-links">
              <li><Link to="/host/dashboard">Host your home</Link></li>
              <li><Link to="/host/resources">Resources for hosts</Link></li>
              <li><Link to="/host/community">Community forum</Link></li>
              <li><Link to="/host/responsible">Responsible hosting</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4 className="footer-heading">About</h4>
            <ul className="footer-links">
              <li><Link to="/about">About us</Link></li>
              <li><Link to="/careers">Careers</Link></li>
              <li><Link to="/news">Newsroom</Link></li>
              <li><Link to="/investors">Investors</Link></li>
            </ul>
          </div>
        </div>

        <hr className="footer-divider" />

        <div className="footer-bottom">
          <span className="footer-copy">© 2025 Community Project, Inc. · All rights reserved.</span>
          <div className="footer-legal-links">
            <Link to="/privacy">Privacy</Link>
            <span>·</span>
            <Link to="/terms">Terms</Link>
            <span>·</span>
            <Link to="/sitemap">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
