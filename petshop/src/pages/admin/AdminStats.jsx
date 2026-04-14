import { useState } from "react";
import { MOCK_PRODUCTS as DEFAULT_PRODUCTS } from "../../data/products";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid, Legend, PieChart, Pie, Cell } from "recharts";
const COLORS = ["#6366f1", "#10b981", "#f59e0b", "#f87171", "#60a5fa"];

function AdminStats() {
  const MOCK_PRODUCTS = JSON.parse(localStorage.getItem("hp_products")) || DEFAULT_PRODUCTS;
  const reviews = JSON.parse(localStorage.getItem("hp_reviews") || "[]");
  const orders = Object.keys(localStorage)
    .filter(k => k.startsWith("hp_orders"))
    .flatMap(k => {
      try { return JSON.parse(localStorage.getItem(k) || "[]"); }
      catch { return []; }
    });
  const [period, setPeriod] = useState("all");

  const rated = MOCK_PRODUCTS.map(p => {
    const r = reviews.filter(r => r.productId === p.id);
    const avg = r.length ? (r.reduce((s, x) => s + x.rating, 0) / r.length).toFixed(1) : null;
    return { ...p, avg, reviewCount: r.length };
  }).filter(p => p.avg).sort((a, b) => b.avg - a.avg);

  const soldMap = {};
  orders.forEach(order => {
    order.items?.forEach(item => {
      soldMap[item.nameRO] = (soldMap[item.nameRO] || 0) + item.qty;
    });
  });
  const bestSellersData = Object.entries(soldMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, qty]) => ({ name: name.length > 15 ? name.slice(0, 15) + "…" : name, qty }));

  const monthMap = {};
  orders.forEach(order => {
    if (!order.date) return;
    const parts = order.date.split(".");
    const key = parts.length === 3 ? `${parts[1]}.${parts[2]}` : order.date;
    monthMap[key] = (monthMap[key] || 0) + parseFloat(order.total || 0);
  });
  const profitData = Object.entries(monthMap)
    .sort()
    .map(([luna, total]) => ({ luna, total: parseFloat(total.toFixed(2)) }));

  const catMap = {};
  orders.forEach(order => {
    order.items?.forEach(item => {
      const product = MOCK_PRODUCTS.find(p => p.nameRO === item.nameRO);
      if (product) catMap[product.category] = (catMap[product.category] || 0) + item.qty;
    });
  });
  const categoryData = Object.entries(catMap).map(([cat, qty]) => ({ name: cat, value: qty }));
  const totalRevenue = orders.reduce((s, o) => s + parseFloat(o.total || 0), 0);

  // Filtrare după perioadă
  const filteredProfitData = (() => {
    if (period === "all") return profitData;
    const now = new Date();
    return orders.filter(order => {
      if (!order.date) return false;
      const parts = order.date.split(".");
      if (parts.length !== 3) return false;
      const orderDate = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
      const diffDays = (now - orderDate) / (1000 * 60 * 60 * 24);
      if (period === "week")  return diffDays <= 7;
      if (period === "month") return diffDays <= 30;
      if (period === "year")  return diffDays <= 365;
      return true;
    }).reduce((acc, order) => {
      const parts = order.date.split(".");
      const key = `${parts[1]}.${parts[2]}`;
      const existing = acc.find(x => x.luna === key);
      if (existing) existing.total = parseFloat((existing.total + parseFloat(order.total)).toFixed(2));
      else acc.push({ luna: key, total: parseFloat(order.total) });
      return acc;
    }, []).sort((a, b) => a.luna.localeCompare(b.luna));
  })();

  return (
    <div>
      {/* CARDURI SUMAR */}
      <div className="stats-cards">
        <div className="stat-card">
          <span className="stat-icon">📦</span>
          <div>
            <p className="stat-value">{MOCK_PRODUCTS.length}</p>
            <p className="stat-label">Produse</p>
          </div>
        </div>
        <div className="stat-card">
          <span className="stat-icon">🛒</span>
          <div>
            <p className="stat-value">{orders.length}</p>
            <p className="stat-label">Comenzi</p>
          </div>
        </div>
        <div className="stat-card">
          <span className="stat-icon">⭐</span>
          <div>
            <p className="stat-value">{reviews.length}</p>
            <p className="stat-label">Recenzii</p>
          </div>
        </div>
        <div className="stat-card">
          <span className="stat-icon">💰</span>
          <div>
            <p className="stat-value">{totalRevenue.toFixed(2)} RON</p>
            <p className="stat-label">Venituri totale</p>
          </div>
        </div>
      </div>

      {/* GRAFICE RÂ ND 1 */}
      <div className="charts-row">
        <div className="chart-box">
          <h3>🔥 Cele mai vândute produse</h3>
          {bestSellersData.length === 0 ? (
            <p className="no-data">Nicio comandă încă.</p>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={bestSellersData} margin={{ top: 10, right: 10, left: 0, bottom: 40 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a3a4a" />
                <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 11 }} angle={-25} textAnchor="end" interval={0} />
                <YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} allowDecimals={false} />
                <Tooltip contentStyle={{ background: "#1e293b", border: "1px solid #2a3a4a", borderRadius: 8 }} labelStyle={{ color: "#e2e8f0" }} itemStyle={{ color: "#10b981" }} />
                <Bar dataKey="qty" name="Cantitate" radius={[6, 6, 0, 0]}>
                  {bestSellersData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="chart-box">
          <h3>🐾 Vânzări pe categorii</h3>
          {categoryData.length === 0 ? (
            <p className="no-data">Nicio comandă încă.</p>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={categoryData} cx="50%" cy="50%" outerRadius={90} dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={{ stroke: "#94a3b8" }}>
                  {categoryData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "#1e293b", border: "1px solid #2a3a4a", borderRadius: 8 }} itemStyle={{ color: "#e2e8f0" }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* LINE CHART CU FILTRE */}
      <div className="chart-box chart-box--full">
        <div className="chart-header">
          <h3>📈 Venituri pe luni</h3>
          <div className="period-filters">
            {[
              { key: "week",  label: "7 zile"     },
              { key: "month", label: "30 zile"    },
              { key: "year",  label: "12 luni"    },
              { key: "all",   label: "Tot timpul" },
            ].map(p => (
              <button
                key={p.key}
                className={`period-btn${period === p.key ? " active" : ""}`}
                onClick={() => setPeriod(p.key)}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {filteredProfitData.length === 0 ? (
          <p className="no-data">Nicio comandă în perioada selectată.</p>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={filteredProfitData} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a3a4a" />
              <XAxis dataKey="luna" tick={{ fill: "#94a3b8", fontSize: 12 }} />
              <YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} unit=" RON" />
              <Tooltip contentStyle={{ background: "#1e293b", border: "1px solid #2a3a4a", borderRadius: 8 }} labelStyle={{ color: "#e2e8f0" }} itemStyle={{ color: "#6366f1" }} formatter={(val) => [`${val} RON`, "Venituri"]} />
              <Legend wrapperStyle={{ color: "#94a3b8" }} />
              <Line type="monotone" dataKey="total" name="Venituri" stroke="#6366f1" strokeWidth={3} dot={{ fill: "#6366f1", r: 5 }} activeDot={{ r: 7, fill: "#818cf8" }} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* LISTE */}
      <div className="stats-grid">
        <div className="stats-box">
          <h3>⭐ Cele mai apreciate produse</h3>
          {rated.length === 0 ? (
            <p className="no-data">Nicio recenzie încă.</p>
          ) : (
            rated.map((p, i) => (
              <div key={p.id} className="stats-row">
                <span className="stats-rank">#{i + 1}</span>
                <span className="stats-name">{p.nameRO}</span>
                <span className="stats-val">⭐ {p.avg} ({p.reviewCount})</span>
              </div>
            ))
          )}
        </div>

        <div className="stats-box">
          <h3>🔥 Top vânzări (cantitate)</h3>
          {bestSellersData.length === 0 ? (
            <p className="no-data">Nicio comandă încă.</p>
          ) : (
            bestSellersData.map((item, i) => (
              <div key={item.name} className="stats-row">
                <span className="stats-rank">#{i + 1}</span>
                <span className="stats-name">{item.name}</span>
                <span className="stats-val">{item.qty} buc.</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminStats;