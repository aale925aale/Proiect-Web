import { useNavigate } from "react-router-dom";
import "./CartSidebar.css";

function CartSidebar({ open, onClose, cart, updateQty, removeFromCart, darkMode, language }) {
  const navigate = useNavigate();
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);

  const goCheckout = () => {
    onClose();
    navigate("/checkout");
  };

  return (
    <>
      {/* Overlay */}
      {open && <div className="cart-overlay" onClick={onClose} />}

      {/* Sidebar */}
      <div className={`cart-sidebar${open ? " open" : ""}${darkMode ? " dark" : ""}`}>
        <div className="cart-header">
          <h3>🛒 {language === "ro" ? "Coșul tău" : "Your cart"}</h3>
          <button className="cart-close" onClick={onClose}>✕</button>
        </div>

        {cart.length === 0 ? (
          <div className="cart-empty">
            <span>🛍️</span>
            <p>{language === "ro" ? "Coșul tău e gol." : "Your cart is empty."}</p>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {cart.map(item => (
                <div key={item.id} className="cart-item">
                  <img
                    src={item.image}
                    alt={language === "ro" ? item.nameRO : item.nameEN}
                    className="cart-item-img"
                  />
                  <div className="cart-item-info">
                    <p className="cart-item-name">
                      {language === "ro" ? item.nameRO : item.nameEN}
                    </p>
                    <p className="cart-item-price">{item.price.toFixed(2)} RON</p>
                    <div className="cart-qty">
                      <button onClick={() => updateQty(item.id, item.qty - 1)}>−</button>
                      <span>{item.qty}</span>
                      <button onClick={() => updateQty(item.id, item.qty + 1)}>+</button>
                    </div>
                  </div>
                  <button
                    className="cart-remove"
                    onClick={() => removeFromCart(item.id)}
                  >✕</button>
                </div>
              ))}
            </div>

            <div className="cart-footer">
              <div className="cart-total">
                <span>{language === "ro" ? "Total:" : "Total:"}</span>
                <strong>{total.toFixed(2)} RON</strong>
              </div>
              <button className="cart-checkout-btn" onClick={goCheckout}>
                {language === "ro" ? "Finalizează comanda" : "Checkout"} →
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default CartSidebar;