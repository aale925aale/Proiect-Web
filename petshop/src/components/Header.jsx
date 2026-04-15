import { useState } from "react";
import { Link } from "react-router-dom";
import { FaUser, FaShoppingCart, FaBookOpen, FaPhone } from "react-icons/fa";
import "./Header.css";

function Header({ darkMode, toggleDarkMode, language, toggleLanguage, user, onLogout, cartCount, onCartClick }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  return (
    <>
      <header className={`minimal-header ${darkMode ? "dark" : ""}`}>
        <div className="header-container">
          <Link to="/" className="logo">HappyPaws</Link>

          <div className="header-icons">
            <Link to="/products" className="icon-btn" title="Catalog">
              <FaBookOpen />
            </Link>

            <Link to="/contact" className="icon-btn" title="Contact">
              <FaPhone />
            </Link>

            {/* USER / DROPDOWN */}
            {user ? (
              <div className="user-dropdown-wrap">
                <button className="user-btn-logged" onClick={() => setDropdownOpen(o => !o)}>
                  👤 <span className="user-name-text">{user.name.split(" ")[0]}</span>
                </button>
                {dropdownOpen && (
                  <div className="user-dropdown">
                    <p className="dropdown-email">{user.email}</p>
                    <Link to="/account" onClick={() => setDropdownOpen(false)}>
                      {language === "ro" ? "Profilul meu" : "My profile"}
                    </Link>
                    {/* DARK MODE */}
                    <button onClick={toggleDarkMode}>
                      {darkMode
                        ? (language === "ro" ? "☀️ Mod luminos" : "☀️ Light mode")
                        : (language === "ro" ? "🌙 Mod întunecat" : "🌙 Dark mode")}
                    </button>
                    {/* LIMBĂ */}
                    <button onClick={toggleLanguage}>
                      🌐 {language === "ro" ? "Switch to English" : "Schimbă în Română"}
                    </button>
                    {/* LOGOUT */}
                    <button
                      className="dropdown-logout"
                      onClick={() => { setShowLogoutConfirm(true); setDropdownOpen(false); }}
                    >
                      {language === "ro" ? "Deconectare" : "Sign out"}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="user-dropdown-wrap">
                <button className="icon-btn" onClick={() => setDropdownOpen(o => !o)} title="Cont">
                  <FaUser />
                </button>
                {dropdownOpen && (
                  <div className="user-dropdown">
                    <Link to="/login" onClick={() => setDropdownOpen(false)}>
                      {language === "ro" ? "Conectează-te" : "Sign in"}
                    </Link>
                    {/* DARK MODE */}
                    <button onClick={toggleDarkMode}>
                      {darkMode
                        ? (language === "ro" ? "☀️ Mod luminos" : "☀️ Light mode")
                        : (language === "ro" ? "🌙 Mod întunecat" : "🌙 Dark mode")}
                    </button>
                    {/* LIMBĂ */}
                    <button onClick={toggleLanguage}>
                      🌐 {language === "ro" ? "Switch to English" : "Schimbă în Română"}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* COȘ */}
            <button className="icon-btn cart-btn" onClick={onCartClick} title="Coș">
              <FaShoppingCart />
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </button>
          </div>
        </div>
      </header>

      {/* MODAL LOGOUT */}
      {showLogoutConfirm && (
        <div className="logout-overlay" onClick={() => setShowLogoutConfirm(false)}>
          <div className="logout-modal" onClick={e => e.stopPropagation()}>
            <div className="logout-icon">👋</div>
            <h3>{language === "ro" ? "Ne pare rău să te vedem plecând!" : "Sorry to see you go!"}</h3>
            <p>{language === "ro" ? "Ești sigur că vrei să te deconectezi?" : "Are you sure you want to sign out?"}</p>
            <div className="logout-btns">
              <button className="logout-cancel" onClick={() => setShowLogoutConfirm(false)}>
                {language === "ro" ? "Rămân" : "Stay"}
              </button>
              <button className="logout-confirm" onClick={() => { onLogout(); setShowLogoutConfirm(false); }}>
                {language === "ro" ? "Deconectare" : "Sign out"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Header;