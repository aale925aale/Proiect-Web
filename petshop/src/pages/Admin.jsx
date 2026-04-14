import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminProducts from "./admin/AdminProducts";
import AdminUsers    from "./admin/AdminUsers";
import AdminReviews  from "./admin/AdminReviews";
import AdminStats    from "./admin/AdminStats";
import "./Admin.css";

const MENU = [
  { key: "stats",    icon: "📊", label: "Dashboard"  },
  { key: "products", icon: "📦", label: "Produse"     },
  { key: "users",    icon: "👥", label: "Utilizatori" },
  { key: "reviews",  icon: "⭐", label: "Recenzii"    },
];

function Admin({ onAdminLogout }) {
  const [section, setSection] = useState("stats");
  const navigate = useNavigate();

  const handleLogout = () => {
    onAdminLogout();
    navigate("/admin-login");
  };

  return (
    <div className="admin-layout">
      {/* SIDEBAR */}
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <span>🛡️</span>
          <div>
            <p className="brand-title">HappyPaws</p>
            <p className="brand-sub">Admin Panel</p>
          </div>
        </div>

        <nav className="admin-nav">
          {MENU.map(item => (
            <button
              key={item.key}
              className={`admin-nav-btn${section === item.key ? " active" : ""}`}
              onClick={() => setSection(item.key)}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <button className="admin-back-btn" onClick={() => navigate("/")}>
            ← Înapoi la site
          </button>
          <button className="admin-logout-btn" onClick={handleLogout}>
            🚪 Deconectare
          </button>
        </div>
      </aside>

      {/* CONȚINUT */}
      <main className="admin-main">
        <div className="admin-topbar">
          <h1 className="admin-page-title">
            {MENU.find(m => m.key === section)?.icon}{" "}
            {MENU.find(m => m.key === section)?.label}
          </h1>
          <span className="admin-badge">👤 admin@happypaws.ro</span>
        </div>

        <div className="admin-content">
          {section === "stats"    && <AdminStats />}
          {section === "products" && <AdminProducts />}
          {section === "users"    && <AdminUsers />}
          {section === "reviews"  && <AdminReviews />}
        </div>
      </main>
    </div>
  );
}

export default Admin;