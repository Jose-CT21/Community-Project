import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { properties } from "../data/properties";
import "./HostEditPage.css";

export default function HostEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  // Initial state for form
  const [formData, setFormData] = useState({
    title: "",
    type: "Entire home",
    description: "",
    price: "",
    category: "beachfront",
    location: { city: "", country: "" },
    amenities: "",
    maxGuests: 4,
    photos: ["", "", "", "", ""]
  });

  useEffect(() => {
    if (isEditing) {
      // In a real app we'd fetch the property data, here we mock it or find it from static data
      // For demo purposes, we will fetch from our dummy data if it exists
      const existing = properties.find((p) => p.id === id);
      if (existing) {
        setFormData({
          title: existing.title,
          type: existing.type,
          description: existing.description,
          price: existing.price,
          category: existing.category,
          location: { ...existing.location },
          mapUrl: existing.mapUrl || "",
          amenities: existing.amenities.join(", "),
          maxGuests: existing.maxGuests || 4,
          photos: existing.photos ? [...existing.photos] : []
        });
      } else {
        // Mock data for dummy dashboard listings not in main db
        setFormData({
          title: "Beachfront Villa with Ocean View",
          type: "Entire home",
          description: "Luxurious villa right on the beach.",
          price: 320,
          category: "beachfront",
          location: { city: "Cancun", country: "Mexico" },
          mapUrl: "https://maps.google.com/maps?q=21.1619,-86.8515&hl=es&z=14&output=embed",
          amenities: "Wifi, Pool, Kitchen, AC",
          maxGuests: 8,
          photos: ["https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800"]
        });
      }
    }
  }, [id, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData(prev => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => {
          const newPhotos = [...prev.photos];
          if (newPhotos.length < 30) {
            newPhotos.push(reader.result);
          }
          return { ...prev, photos: newPhotos };
        });
      };
      reader.readAsDataURL(file);
    });
  };

  const removePhoto = (index) => {
    setFormData(prev => {
      const newPhotos = prev.photos.filter((_, i) => i !== index);
      return { ...prev, photos: newPhotos };
    });
  };

  // Auto-generate Map URL based on City and Country
  const getDynamicMapUrl = () => {
    const { city, country } = formData.location;
    if (!city && !country) return "";
    const query = encodeURIComponent(`${city || ""}, ${country || ""}`);
    return `https://maps.google.com/maps?q=${query}&output=embed`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate save
    alert("Listing saved successfully!");
    navigate("/host/dashboard");
  };

  return (
    <div className="page-wrapper host-edit-page">
      <div className="container">
        <div className="host-edit-header">
          <button className="btn-icon back-btn" onClick={() => navigate(-1)} aria-label="Go back">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <h2>{isEditing ? "Edita tu espacio" : "Publica tu espacio"}</h2>
        </div>

        <form className="host-edit-form" onSubmit={handleSubmit}>
          
          <div className="form-section">
            <h3 className="form-section-title">Lo esencial</h3>
            
            <div className="form-group">
              <label className="form-label">Título del anuncio</label>
              <input 
                required 
                className="form-input" 
                name="title" 
                value={formData.title} 
                onChange={handleChange} 
                placeholder="Ej. Acogedora Cabaña en el Bosque" 
              />
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Tipo de alojamiento</label>
                <select className="form-input" name="type" value={formData.type} onChange={handleChange}>
                  <option value="Entire home">Casa o apartamento entero</option>
                  <option value="Private room">Habitación privada</option>
                  <option value="Shared room">Habitación compartida</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Categoría</label>
                <select className="form-input" name="category" value={formData.category} onChange={handleChange}>
                  <option value="beachfront">Frente a la playa</option>
                  <option value="cabins">Cabañas</option>
                  <option value="castles">Castillos</option>
                  <option value="design">Diseño especial</option>
                  <option value="amazing-views">Vistas increíbles</option>
                  <option value="lakefront">Cerca del lago</option>
                </select>
              </div>
            </div>
            
            <div className="form-group">
              <label className="form-label">Descripción</label>
              <textarea 
                required
                className="form-input" 
                name="description" 
                value={formData.description} 
                onChange={handleChange} 
                rows="4"
                placeholder="Describe qué hace único a tu espacio..." 
              />
            </div>
          </div>

          <hr className="divider" />

          <div className="form-section">
            <h3 className="form-section-title">Ubicación y Precio</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Ciudad</label>
                <input required className="form-input" name="location.city" value={formData.location.city} onChange={handleChange} placeholder="Ej. Madrid" />
              </div>
              <div className="form-group">
                <label className="form-label">País</label>
                <input required className="form-input" name="location.country" value={formData.location.country} onChange={handleChange} placeholder="Ej. España" />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Precio por noche (USD)</label>
                <input required type="number" min="10" className="form-input" name="price" value={formData.price} onChange={handleChange} placeholder="Ej. 120" />
              </div>
              <div className="form-group">
                <label className="form-label">Huéspedes Máximos</label>
                <input required type="number" min="1" max="16" className="form-input" name="maxGuests" value={formData.maxGuests} onChange={handleChange} />
              </div>
            </div>
            <div className="form-group map-preview-group">
              <label className="form-label">Vista Previa de Ubicación en Google Maps</label>
              {(formData.location.city || formData.location.country) ? (
                <div className="map-iframe-container" style={{ width: "100%", height: "250px", borderRadius: "12px", overflow: "hidden", border: "1px solid var(--color-border)" }}>
                  <iframe 
                    src={getDynamicMapUrl()} 
                    width="100%" 
                    height="100%" 
                    style={{ border: 0 }} 
                    allowFullScreen="" 
                    loading="lazy" 
                  ></iframe>
                </div>
              ) : (
                <div className="map-placeholder" style={{ width: "100%", height: "250px", borderRadius: "12px", background: "var(--color-bg-secondary)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-text-tertiary)" }}>
                  Ingresa una ciudad y país para ver el mapa
                </div>
              )}
            </div>
          </div>

          <hr className="divider" />

          <div className="form-section">
            <h3 className="form-section-title">Amenidades y Fotos</h3>
            
            <div className="form-group">
              <label className="form-label">Servicios (separados por coma)</label>
              <input className="form-input" name="amenities" value={formData.amenities} onChange={handleChange} placeholder="Ej. Wifi, Piscina, Estacionamiento gratuito, Cocina" />
            </div>
            
            <div className="form-group">
              <label className="form-label">Fotos del espacio (Máximo 30)</label>
              
              <div className="thumbnails-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))", gap: "16px", marginBottom: "16px" }}>
                {formData.photos.map((photo, i) => (
                  <div key={i} className="thumbnail-container" style={{ position: "relative", aspectRatio: "1", borderRadius: "8px", overflow: "hidden", border: "1px solid var(--color-border)" }}>
                    <img src={photo} alt={`Preview ${i}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    <button 
                      type="button" 
                      onClick={() => removePhoto(i)}
                      style={{ position: "absolute", top: "4px", right: "4px", background: "rgba(0,0,0,0.6)", color: "white", border: "none", borderRadius: "50%", width: "24px", height: "24px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0 }}
                    >
                      ×
                    </button>
                    {i === 0 && <span style={{ position: "absolute", bottom: "4px", left: "4px", background: "var(--color-brand)", color: "white", fontSize: "10px", padding: "2px 6px", borderRadius: "4px" }}>Portada</span>}
                  </div>
                ))}
              </div>

              {formData.photos.length < 30 && (
                <div className="photo-upload-dropzone" style={{ border: "2px dashed var(--color-border-light)", borderRadius: "12px", padding: "32px", textAlign: "center", position: "relative", transition: "all 0.2s ease" }}>
                  <input 
                    type="file" 
                    accept="image/*"
                    multiple
                    className="file-input-hidden" 
                    onChange={handlePhotoUpload} 
                    style={{ position: "absolute", inset: 0, opacity: 0, cursor: "pointer" }}
                  />
                  <div style={{ color: "var(--color-text-secondary)" }}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginBottom: "8px" }}>
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <polyline points="21 15 16 10 5 21" />
                    </svg>
                    <p style={{ margin: 0, fontWeight: "500", color: "var(--color-text-primary)" }}>Haz clic o arrastra imágenes aquí</p>
                    <p style={{ margin: "4px 0 0", fontSize: "12px" }}>Puedes subir hasta {30 - formData.photos.length} fotos más</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="host-edit-actions">
            <button type="button" className="btn btn-outline btn-lg" onClick={() => navigate("/host/dashboard")}>Cancelar</button>
            <button type="submit" className="btn btn-brand btn-lg">{isEditing ? "Guardar cambios" : "Publicar anuncio"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
