import { ShieldCheck, Award } from "lucide-react";
import "./Newsletter.css";

export default function Newsletter() {
  return (
    <section className="newsletter-section">
      <div className="container">
        <div className="newsletter-inner">
          <div className="newsletter-left">
            <h2 className="newsletter-title">Mantente informado</h2>
            <p className="newsletter-desc">Noticias, ubicaciones, guías de viaje y más...</p>
            
            <form className="newsletter-form" onSubmit={(e) => { e.preventDefault(); alert("¡Gracias por suscribirte!"); }}>
              <div className="newsletter-input-group">
                <span className="newsletter-label">
                  Suscríbete<br/>al boletín
                </span>
                <input type="email" placeholder="Email" required className="newsletter-input" />
              </div>
              <button type="submit" className="btn btn-brand newsletter-btn">Suscribirme</button>
            </form>
          </div>
          
          <div className="newsletter-badges">
            <div className="newsletter-badge">
              <Award size={28} strokeWidth={1.5} />
              <span>We are<br/><strong>premium</strong><br/>COMMUNITY</span>
            </div>
            <div className="newsletter-badge">
              <ShieldCheck size={28} strokeWidth={1.5} />
              <span>Official<br/><strong>Member</strong><br/>Host Association</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
