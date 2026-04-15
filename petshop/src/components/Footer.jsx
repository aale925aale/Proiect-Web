import { Link } from "react-router-dom";
import "./Footer.css";

function Footer({ darkMode, language }) {
  return (
    <footer className={`site-footer${darkMode ? " dark" : ""}`}>
      <div className="footer-container">

        <div className="footer-brand">
          <span className="footer-logo">🐾</span>
          <p className="footer-tagline">
            {language === "ro"
              ? "Creat din inimă pentru animale"
              : "Created with love for animals"}
          </p>
        </div>

        <div className="footer-links">
          <Link to="/">{language === "ro" ? "Acasă" : "Home"}</Link>
          <Link to="/products">{language === "ro" ? "Catalog" : "Catalogue"}</Link>
          <Link to="/login">{language === "ro" ? "Cont" : "Account"}</Link>
          <Link to="/contact">{language === "ro" ? "Contact" : "Contact"}</Link>
        </div>

        <div className="footer-contact">
          <p>📍 Strada Mihail Sebastian nr. 88, București</p>
          <p>📞 0712 345 678</p>
          <p>✉️ contact@happypaws.ro</p>
        </div>

      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} HappyPaws. {language === "ro" ? "Toate drepturile rezervate." : "All rights reserved."}</p>
      </div>

      <Link to="/contact">{language === "ro" ? "Contact" : "Contact"}</Link>  
    </footer>
  );
}

export default Footer;