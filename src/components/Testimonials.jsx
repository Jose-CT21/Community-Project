import { useState, useEffect } from "react";
import { Star } from "lucide-react";
import "./Testimonials.css";

const testimonialsPool = [
  { id: 1, text: "La experiencia superó todas nuestras expectativas. El ambiente era cálido, los detalles estaban sumamente cuidados y la atención fue inigualable. Definitivamente volveremos.", author: "Elena Montero", rating: 5, context: "Lakefront Glamping Dome", contextType: "property" },
  { id: 2, text: "Un refugio perfecto para desconectar. Desde el momento en que llegamos sentimos la tranquilidad del lugar. El diseño del espacio es elegante y te hace sentir en casa.", author: "David y Clara", rating: 5, context: "Architectural Desert Oasis", contextType: "property" },
  { id: 3, text: "Las vistas son impresionantes y cada rincón tiene un encanto único. La hospitalidad del anfitrión hizo que nuestro aniversario fuera verdaderamente inolvidable.", author: "Mariana Rojas", rating: 5, context: "Panoramic Alps Chalet", contextType: "property" },
  { id: 4, text: "Me sorprendió la facilidad para explorar locaciones y contactar a los propietarios. Las herramientas de búsqueda son excelentes y me ahorraron mucho tiempo.", author: "Roberto Castillo", rating: 5, context: "Plataforma Community", contextType: "app" },
  { id: 5, text: "El lugar era aceptable, pero tuvimos algunos problemas con el wifi y el ruido de la calle.", author: "Jorge Salinas", rating: 3, context: "Urban Loft", contextType: "property" },
  { id: 6, text: "Increíble destino para viajar en familia. Los niños amaron la piscina y nosotros pudimos relajarnos por fin.", author: "Familia Gómez", rating: 5, context: "Infinity Pool Cliffside Villa", contextType: "property" },
  { id: 7, text: "Muy buena gestión y soporte 24/7. Hubo un detalle con la llave, e inmediatamente el equipo de Community nos resolvió.", author: "Andrea Vargas", rating: 4, context: "Plataforma Community", contextType: "app" },
  { id: 8, text: "No era lo que esperaba según las fotos. La limpieza dejaba un poco que desear.", author: "Luis F.", rating: 2, context: "Beachfront Condo", contextType: "property" },
  { id: 9, text: "Hermoso diseño interior, la cocina estaba totalmente equipada y pasamos unos días espectaculares cocinando y riendo.", author: "Cristina M.", rating: 5, context: "Rustic Tuscan Farmhouse", contextType: "property" },
  { id: 10, text: "Fácil, rápido y espectacular. Desde que abrí la página hasta que llegué al lugar todo fue transparente.", author: "Diego R.", rating: 5, context: "Plataforma Community", contextType: "app" },
  { id: 11, text: "La cabaña está literalmente sobre el lago. Nos despertábamos con el sonido de los pájaros. Mágico.", author: "Lucía y Tomás", rating: 5, context: "Lakefront Glamping Dome", contextType: "property" },
  { id: 12, text: "Súper recomendado para una escapada de fin de semana. Solo asegúrense de llevar buen abrigo en invierno.", author: "Pedro", rating: 4, context: "Panoramic Alps Chalet", contextType: "property" }
];

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeTestimonials, setActiveTestimonials] = useState([]);

  useEffect(() => {
    // Filter positive reviews (>= 4 stars)
    const positiveReviews = testimonialsPool.filter(t => t.rating >= 4);
    
    // Randomly shuffle and pick up to 5
    const shuffled = positiveReviews.sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 5);
    setActiveTestimonials(selected);
  }, []);

  useEffect(() => {
    if (activeTestimonials.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeTestimonials.length);
    }, 6000); // Change testimonial every 6 seconds
    return () => clearInterval(interval);
  }, [activeTestimonials]);

  if (activeTestimonials.length === 0) return null;

  return (
    <section className="testimonials-section">
      <div className="container">
        <h2 className="testimonials-title">Nuestros huéspedes opinan</h2>
        
        <div className="testimonials-container">
          {activeTestimonials.map((t, index) => {
            let slideClass = "testimonial-slide";
            if (index === currentIndex) slideClass += " active";
            else if (index === (currentIndex - 1 + activeTestimonials.length) % activeTestimonials.length) slideClass += " prev";
            else slideClass += " next";

            return (
              <div key={t.id} className={slideClass}>
                <p className="testimonial-text">"{t.text}"</p>
                <h4 className="testimonial-author">{t.author}</h4>
                <span className="testimonial-context">
                  {t.contextType === 'app' ? "Reseña de la plataforma" : `Estadía en: ${t.context}`}
                </span>
                <div className="testimonial-stars">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} size={18} fill="currentColor" stroke="none" />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="testimonial-dots">
          {activeTestimonials.map((_, idx) => (
            <button
               key={idx}
               className={`t-dot ${idx === currentIndex ? "active" : ""}`}
              onClick={() => setCurrentIndex(idx)}
              aria-label={`Ver testimonio ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
