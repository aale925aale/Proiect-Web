import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./AuthPages.css";

function Register({ darkMode, language, onLogin }) {
  const [name, setName]         = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm]   = useState("");
  const [error, setError]       = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirm) {
      setError(language === "ro" ? "Parolele nu coincid." : "Passwords do not match.");
      return;
    }
    if (password.length < 4) {
      setError(language === "ro" ? "Parola trebuie să aibă minim 4 caractere." : "Password must be at least 4 characters.");
      return;
    }
    // Simulăm înregistrarea — logăm direct userul
    onLogin({ name, email });
    navigate("/");
  };

  return (
    <div className={`auth-page${darkMode ? " dark" : ""}`}>
      <div className={`auth-card${darkMode ? " dark" : ""}`}>
        <div className="auth-logo">🐾</div>
        <h2 className="auth-title">
          {language === "ro" ? "Creează un cont" : "Create an account"}
        </h2>
        <p className="auth-subtitle">
          {language === "ro" ? "Alătură-te comunității HappyPaws" : "Join the HappyPaws community"}
        </p>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-field">
            <label>{language === "ro" ? "Nume complet" : "Full name"}</label>
            <input
              type="text"
              placeholder={language === "ro" ? "Ion Popescu" : "John Doe"}
              value={name}
              onChange={e => setName(e.target.value)}
              required
              className={darkMode ? "dark" : ""}
            />
          </div>

          <div className="auth-field">
            <label>{language === "ro" ? "Adresă email" : "Email address"}</label>
            <input
              type="email"
              placeholder="exemplu@email.ro"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className={darkMode ? "dark" : ""}
            />
          </div>

          <div className="auth-field">
            <label>{language === "ro" ? "Parolă" : "Password"}</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className={darkMode ? "dark" : ""}
            />
          </div>

          <div className="auth-field">
            <label>{language === "ro" ? "Confirmă parola" : "Confirm password"}</label>
            <input
              type="password"
              placeholder="••••••••"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              required
              className={darkMode ? "dark" : ""}
            />
          </div>

          {error && <p className="auth-error">{error}</p>}

          <button type="submit" className="auth-btn">
            {language === "ro" ? "Înregistrează-te" : "Register"}
          </button>
        </form>

        <p className="auth-switch">
          {language === "ro" ? "Ai deja cont? " : "Already have an account? "}
          <Link to="/login">{language === "ro" ? "Conectează-te" : "Sign in"}</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;