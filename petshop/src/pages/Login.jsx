import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./AuthPages.css";

const MOCK_USER = { email: "test@happypaws.ro", password: "1234", name: "Alexandru" };

function Login({ darkMode, language, onLogin }) {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email === MOCK_USER.email && password === MOCK_USER.password) {
      onLogin({ name: MOCK_USER.name, email: MOCK_USER.email });
      navigate("/");
    } else {
      setError(language === "ro" ? "Email sau parolă incorecte." : "Incorrect email or password.");
    }
  };

  return (
    <div className={`auth-page${darkMode ? " dark" : ""}`}>
      <div className={`auth-card${darkMode ? " dark" : ""}`}>
        <div className="auth-logo">🐾</div>
        <h2 className="auth-title">
          {language === "ro" ? "Bine ai revenit!" : "Welcome back!"}
        </h2>
        <p className="auth-subtitle">
          {language === "ro" ? "Conectează-te la contul tău HappyPaws" : "Sign in to your HappyPaws account"}
        </p>

        <form onSubmit={handleSubmit} className="auth-form">
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

          {error && <p className="auth-error">{error}</p>}

          <button type="submit" className="auth-btn">
            {language === "ro" ? "Conectează-te" : "Sign in"}
          </button>
        </form>

        <p className="auth-switch">
          {language === "ro" ? "Nu ai cont? " : "No account? "}
          <Link to="/register">{language === "ro" ? "Înregistrează-te" : "Register"}</Link>
        </p>

        <div className="auth-hint">
          <span>Demo: <strong>test@happypaws.ro</strong> / <strong>1234</strong></span>
        </div>
      </div>
    </div>
  );
}

export default Login;