import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Checkout.css";

const STEPS = ["cos", "adresa", "plata", "confirmare"];

function Checkout({ darkMode, language, user, cart, clearCart }) {
  const navigate  = useNavigate();
  const [step, setStep] = useState(0);

  const savedAddress = localStorage.getItem("hp_address") || "";
  const [address, setAddress] = useState(savedAddress);
  const [card, setCard]       = useState({ name: "", number: "", expiry: "", cvv: "" });
  const [errors, setErrors]   = useState({});

  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);

  const validateAddress = () => {
    if (!address.trim()) {
      setErrors({ address: language === "ro" ? "Adresa este obligatorie." : "Address is required." });
      return false;
    }
    setErrors({});
    return true;
  };

  const validateCard = () => {
    const e = {};
    if (!card.name.trim())          e.name   = language === "ro" ? "Nume obligatoriu." : "Name required.";
    if (card.number.replace(/\s/g,"").length < 16) e.number = language === "ro" ? "Număr card invalid." : "Invalid card number.";
    if (!card.expiry.match(/^\d{2}\/\d{2}$/))      e.expiry = language === "ro" ? "Format: MM/YY" : "Format: MM/YY";
    if (card.cvv.length < 3)        e.cvv    = language === "ro" ? "CVV invalid." : "Invalid CVV.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const nextStep = () => {
    if (step === 1 && !validateAddress()) return;
    if (step === 2 && !validateCard())   return;
    if (step === 2) {
      // Salvează comanda în localStorage
      const orders = JSON.parse(localStorage.getItem("hp_orders") || "[]");
      const newOrder = {
        id: Date.now(),
        date: new Date().toLocaleDateString("ro-RO"),
        address,
        items: cart.map(i => ({
          nameRO: i.nameRO,
          nameEN: i.nameEN,
          qty: i.qty,
          price: i.price,
        })),
        total: cart.reduce((s, i) => s + i.price * i.qty, 0).toFixed(2),
      };
      localStorage.setItem("hp_orders", JSON.stringify([newOrder, ...orders]));
      clearCart();
    }
    setStep(s => s + 1);
  };
  const formatCardNumber = (val) => {
    const digits = val.replace(/\D/g,"").slice(0,16);
    return digits.replace(/(.{4})/g,"$1 ").trim();
  };

  const formatExpiry = (val) => {
    const digits = val.replace(/\D/g,"").slice(0,4);
    if (digits.length >= 3) return digits.slice(0,2) + "/" + digits.slice(2);
    return digits;
  };

  if (cart.length === 0 && step < 3) {
    return (
      <div className={`checkout-page${darkMode ? " dark" : ""}`}>
        <div className="checkout-empty">
          <span>🛒</span>
          <p>{language === "ro" ? "Coșul tău e gol." : "Your cart is empty."}</p>
          <button onClick={() => navigate("/products")}>
            {language === "ro" ? "Mergi la produse" : "Go to products"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`checkout-page${darkMode ? " dark" : ""}`}>
      <div className="checkout-container">

        {/* STEPS INDICATOR */}
        <div className="steps-bar">
          {["🛒", "📍", "💳", "✅"].map((icon, i) => (
            <div key={i} className={`step-dot${i <= step ? " done" : ""}${i === step ? " current" : ""}`}>
              <span className="step-icon">{icon}</span>
              <span className="step-label">
                {i === 0 ? (language === "ro" ? "Coș" : "Cart") :
                 i === 1 ? (language === "ro" ? "Adresă" : "Address") :
                 i === 2 ? (language === "ro" ? "Plată" : "Payment") :
                           (language === "ro" ? "Confirmare" : "Confirmed")}
              </span>
            </div>
          ))}
        </div>

        {/* STEP 0 — COȘ */}
        {step === 0 && (
          <div className="checkout-card">
            <h2>{language === "ro" ? "Produsele tale" : "Your items"}</h2>
            {cart.map(item => (
              <div key={item.id} className="checkout-item">
                <img src={item.image} alt={language === "ro" ? item.nameRO : item.nameEN} />
                <div>
                  <p className="ci-name">{language === "ro" ? item.nameRO : item.nameEN}</p>
                  <p className="ci-qty">{language === "ro" ? "Cantitate" : "Qty"}: {item.qty}</p>
                </div>
                <p className="ci-price">{(item.price * item.qty).toFixed(2)} RON</p>
              </div>
            ))}
            <div className="checkout-total">
              <span>{language === "ro" ? "Total:" : "Total:"}</span>
              <strong>{total.toFixed(2)} RON</strong>
            </div>
            <button className="checkout-btn" onClick={nextStep}>
              {language === "ro" ? "Continuă" : "Continue"} →
            </button>
          </div>
        )}

        {/* STEP 1 — ADRESA */}
        {step === 1 && (
          <div className="checkout-card">
            <h2>{language === "ro" ? "Adresă de livrare" : "Delivery address"}</h2>
            <textarea
              className={`co-input${darkMode ? " dark" : ""}`}
              rows={4}
              placeholder={language === "ro" ? "Strada, număr, oraș, județ..." : "Street, number, city, county..."}
              value={address}
              onChange={e => setAddress(e.target.value)}
            />
            {errors.address && <p className="co-error">{errors.address}</p>}
            {savedAddress && (
              <button className="co-autofill" onClick={() => setAddress(savedAddress)}>
                📍 {language === "ro" ? "Folosește adresa din profil" : "Use address from profile"}
              </button>
            )}
            <div className="checkout-nav">
              <button className="checkout-btn-back" onClick={() => setStep(s => s - 1)}>← {language === "ro" ? "Înapoi" : "Back"}</button>
              <button className="checkout-btn" onClick={nextStep}>{language === "ro" ? "Continuă" : "Continue"} →</button>
            </div>
          </div>
        )}

        {/* STEP 2 — PLATA */}
        {step === 2 && (
          <div className="checkout-card">
            <h2>{language === "ro" ? "Date plată" : "Payment details"}</h2>
            <p className="co-secure">🔒 {language === "ro" ? "Conexiune securizată. Datele nu sunt stocate." : "Secure connection. Data is not stored."}</p>

            <div className="co-field">
              <label>{language === "ro" ? "Nume pe card" : "Name on card"}</label>
              <input className={`co-input${darkMode ? " dark" : ""}`} placeholder="Ion Popescu"
                value={card.name} onChange={e => setCard({...card, name: e.target.value})} />
              {errors.name && <p className="co-error">{errors.name}</p>}
            </div>

            <div className="co-field">
              <label>{language === "ro" ? "Număr card" : "Card number"}</label>
              <input className={`co-input${darkMode ? " dark" : ""}`} placeholder="1234 5678 9012 3456"
                value={card.number}
                onChange={e => setCard({...card, number: formatCardNumber(e.target.value)})} />
              {errors.number && <p className="co-error">{errors.number}</p>}
            </div>

            <div className="co-row">
              <div className="co-field">
                <label>{language === "ro" ? "Expiră" : "Expiry"}</label>
                <input className={`co-input${darkMode ? " dark" : ""}`} placeholder="MM/YY"
                  value={card.expiry}
                  onChange={e => setCard({...card, expiry: formatExpiry(e.target.value)})} />
                {errors.expiry && <p className="co-error">{errors.expiry}</p>}
              </div>
              <div className="co-field">
                <label>CVV</label>
                <input className={`co-input${darkMode ? " dark" : ""}`} placeholder="123"
                  maxLength={4} value={card.cvv}
                  onChange={e => setCard({...card, cvv: e.target.value.replace(/\D/g,"")})} />
                {errors.cvv && <p className="co-error">{errors.cvv}</p>}
              </div>
            </div>

            <div className="checkout-total">
              <span>{language === "ro" ? "Total de plată:" : "Total to pay:"}</span>
              <strong>{total.toFixed(2)} RON</strong>
            </div>

            <div className="checkout-nav">
              <button className="checkout-btn-back" onClick={() => setStep(s => s - 1)}>← {language === "ro" ? "Înapoi" : "Back"}</button>
              <button className="checkout-btn" onClick={nextStep}>💳 {language === "ro" ? "Plătește" : "Pay"}</button>
            </div>
          </div>

        )}

        {/* STEP 3 — CONFIRMARE */}
        {step === 3 && (
          <div className="checkout-card checkout-success">
            <div className="success-icon">🎉</div>
            <h2>{language === "ro" ? "Comandă plasată!" : "Order placed!"}</h2>
            <p>{language === "ro"
              ? "Îți mulțumim pentru comandă! Vei primi un email de confirmare în curând."
              : "Thank you for your order! You'll receive a confirmation email soon."}
            </p>
            <p className="success-address">📍 {address}</p>
            <button className="checkout-btn" onClick={() => navigate("/")}>
              {language === "ro" ? "Înapoi la pagina principală" : "Back to home"}
            </button>
          </div>
        )}
      </div>
    </div>
    
  );
}

export default Checkout;