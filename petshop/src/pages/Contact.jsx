import { useState } from "react";
import "./Contact.css";

function Contact({ darkMode, language }) {
  const [form, setForm]       = useState({ name: "", email: "", message: "" });
  const [sent, setSent]       = useState(false);
  const [loading, setLoading] = useState(false);

 const handleSubmit = (e) => {
  e.preventDefault();
  setLoading(true);
  setTimeout(() => {
    // Salvează mesajul în localStorage
    const messages = JSON.parse(localStorage.getItem("hp_messages") || "[]");
    const newMessage = {
      id: Date.now(),
      name: form.name,
      email: form.email,
      message: form.message,
      date: new Date().toLocaleDateString("ro-RO"),
      read: false,
    };
    localStorage.setItem("hp_messages", JSON.stringify([newMessage, ...messages]));
    setSent(true);
    setLoading(false);
    setForm({ name: "", email: "", message: "" });
  }, 1200);
};

  return (
    <div className={`contact-page${darkMode ? " dark" : ""}`}>
      <div className="contact-container">

        {/* HEADER */}
        <div className="contact-header">
          <h1>🐾 {language === "ro" ? "Contactează-ne" : "Contact us"}</h1>
          <p>{language === "ro" ? "Suntem aici pentru tine și animalul tău!" : "We're here for you and your pet!"}</p>
        </div>

        <div className="contact-grid">

          {/* FORMULAR */}
          <div className={`contact-card${darkMode ? " dark" : ""}`}>
            <h2>{language === "ro" ? "Trimite un mesaj" : "Send a message"}</h2>

            {sent ? (
              <div className="contact-success">
                <span>✅</span>
                <p>{language === "ro" ? "Mesaj trimis! Te vom contacta în curând." : "Message sent! We'll contact you soon."}</p>
                <button onClick={() => setSent(false)}>
                  {language === "ro" ? "Trimite alt mesaj" : "Send another"}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="contact-form">
                <div className="cf-field">
                  <label>{language === "ro" ? "Numele tău" : "Your name"}</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={e => setForm({...form, name: e.target.value})}
                    placeholder={language === "ro" ? "Ion Popescu" : "John Doe"}
                    required
                    className={darkMode ? "dark" : ""}
                  />
                </div>
                <div className="cf-field">
                  <label>Email</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={e => setForm({...form, email: e.target.value})}
                    placeholder="exemplu@email.ro"
                    required
                    className={darkMode ? "dark" : ""}
                  />
                </div>
                <div className="cf-field">
                  <label>{language === "ro" ? "Mesajul tău" : "Your message"}</label>
                  <textarea
                    value={form.message}
                    onChange={e => setForm({...form, message: e.target.value})}
                    placeholder={language === "ro" ? "Scrie mesajul tău aici..." : "Write your message here..."}
                    rows={5}
                    required
                    className={darkMode ? "dark" : ""}
                  />
                </div>
                <button type="submit" className="cf-submit" disabled={loading}>
                  {loading
                    ? (language === "ro" ? "Se trimite..." : "Sending...")
                    : (language === "ro" ? "✉️ Trimite mesajul" : "✉️ Send message")}
                </button>
              </form>
            )}
          </div>

          {/* DATE CONTACT + HARTA */}
          <div className="contact-info">
            <div className={`contact-card${darkMode ? " dark" : ""}`}>
              <h2>{language === "ro" ? "Date de contact" : "Contact details"}</h2>
              <div className="contact-details">
                <div className="cd-item">
                  <span>📍</span>
                  <div>
                    <strong>{language === "ro" ? "Adresă" : "Address"}</strong>
                    <p>Strada Mihail Sebastian nr. 88, București</p>
                  </div>
                </div>
                <div className="cd-item">
                  <span>📞</span>
                  <div>
                    <strong>{language === "ro" ? "Telefon" : "Phone"}</strong>
                    <p>0712 345 678</p>
                  </div>
                </div>
                <div className="cd-item">
                  <span>✉️</span>
                  <div>
                    <strong>Email</strong>
                    <p>contact@happypaws.ro</p>
                  </div>
                </div>
                <div className="cd-item">
                  <span>🕐</span>
                  <div>
                    <strong>{language === "ro" ? "Program" : "Schedule"}</strong>
                    <p>{language === "ro" ? "Luni - Sâmbătă, 09:00 - 20:00" : "Monday - Saturday, 09:00 - 20:00"}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* HARTA */}
            <div className={`contact-card contact-map-card${darkMode ? " dark" : ""}`}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d22798.170987842837!2d26.03898707910156!3d44.41733699999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40b1ff7630409b69%3A0x15d9052fcda4dd61!2sAnimax!5e0!3m2!1sro!2sro!4v1774603885119!5m2!1sro!2sro"
                style={{ border: 0, width: "100%", height: "220px", borderRadius: "10px" }}
                allowFullScreen=""
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;