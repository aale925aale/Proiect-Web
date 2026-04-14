import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminLogin.css";

const ADMIN_USER = { email: "admin@happypaws.ro", password: "admin1234" };

function AdminLogin({ onAdminLogin }) {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email === ADMIN_USER.email && password === ADMIN_USER.password) {
      onAdminLogin();
      navigate("/admin");
    } else {
      setError("Credențiale incorecte.");
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        <div className="admin-login-logo">🛡️</div>
        <h2>Admin Panel</h2>
        <p>HappyPaws Management</p>

        <form onSubmit={handleSubmit}>
          <div className="adm-field">
            <label>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="admin@happypaws.ro" required />
          </div>
          <div className="adm-field">
            <label>Parolă</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)}
              placeholder="••••••••" required />
          </div>
          {error && <p className="adm-error">{error}</p>}
          <button type="submit" className="adm-login-btn">Intră în panou</button>
        </form>

        <div className="adm-hint">
          Demo: <strong>admin@happypaws.ro</strong> / <strong>admin1234</strong>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;