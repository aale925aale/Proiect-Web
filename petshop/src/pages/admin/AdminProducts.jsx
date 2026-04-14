import { useState } from "react";
import { MOCK_PRODUCTS, PROMOS } from "../../data/products";

const EMPTY = { nameRO: "", nameEN: "", category: "dogs", type: "food", price: "", image: "", descriptionRO: "", descriptionEN: "" };

function AdminProducts() {

  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem("hp_products");
    return saved ? JSON.parse(saved) : MOCK_PRODUCTS;
  });
  const [promos, setPromos] = useState(() => {
    const saved = localStorage.getItem("hp_promos");
    return saved ? JSON.parse(saved) : PROMOS;
  });
  const [editing, setEditing]               = useState(null);
  const [form, setForm]                     = useState(EMPTY);
  const [isNew, setIsNew]                   = useState(false);
  const [search, setSearch]                 = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterType, setFilterType]         = useState("all");

  const saveProducts = (updated) => {
    setProducts(updated);
    localStorage.setItem("hp_products", JSON.stringify(updated));
  };
  const savePromos = (updated) => {
    setPromos(updated);
    localStorage.setItem("hp_promos", JSON.stringify(updated));
  };

  const openEdit = (p) => { setEditing(p.id); setForm({ ...p }); setIsNew(false); };
  const openNew  = () => { setEditing("new"); setForm({ ...EMPTY, id: Date.now() }); setIsNew(true); };
  const cancel   = () => { setEditing(null); setForm(EMPTY); };

  const save = () => {
    if (!form.nameRO || !form.price) return;
    if (isNew) {
      saveProducts([...products, { ...form, price: parseFloat(form.price) }]);
    } else {
      saveProducts(products.map(p => p.id === editing ? { ...form, price: parseFloat(form.price) } : p));
    }
    cancel();
  };

  const remove = (id) => {
    if (window.confirm("Ștergi produsul?")) {
      saveProducts(products.filter(p => p.id !== id));
      savePromos(promos.filter(p => p.id !== id));
    }
  };

  const togglePromo = (id, price) => {
    if (promos.find(p => p.id === id)) {
      savePromos(promos.filter(p => p.id !== id));
    } else {
      savePromos([...promos, { id, oldPrice: parseFloat((parseFloat(price) * 1.3).toFixed(2)) }]);
    }
  };

  const filtered = products.filter(p => {
    const matchSearch =
      p.nameRO.toLowerCase().includes(search.toLowerCase()) ||
      p.nameEN.toLowerCase().includes(search.toLowerCase());
    const matchCat  = filterCategory === "all" || p.category === filterCategory;
    const matchType = filterType === "all" || p.type === filterType;
    return matchSearch && matchCat && matchType;
  });

  return (
    <div>
      <div className="adm-toolbar">
        <span>{filtered.length} / {products.length} produse</span>
        <button className="adm-add-btn" onClick={openNew}>+ Adaugă produs</button>
      </div>

      {/* SEARCH + FILTRE */}
      <div className="adm-filters">
        <input
          className="adm-search"
          type="text"
          placeholder="🔍 Caută produs..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select className="adm-select" value={filterCategory} onChange={e => setFilterCategory(e.target.value)}>
          <option value="all">Toate categoriile</option>
          <option value="dogs">Câini</option>
          <option value="cats">Pisici</option>
          <option value="birds">Păsări</option>
          <option value="rodents">Rozătoare</option>
        </select>
        <select className="adm-select" value={filterType} onChange={e => setFilterType(e.target.value)}>
          <option value="all">Toate tipurile</option>
          <option value="food">Hrană</option>
          <option value="accessory">Accesoriu</option>
          <option value="toy">Jucărie</option>
        </select>
        {(search || filterCategory !== "all" || filterType !== "all") && (
          <button className="adm-clear-btn" onClick={() => { setSearch(""); setFilterCategory("all"); setFilterType("all"); }}>
            ✕ Resetează
          </button>
        )}
      </div>

      {editing && (
        <div className="adm-form-card">
          <h3>{isNew ? "Produs nou" : "Editează produsul"}</h3>
          <div className="adm-form-grid">
            <div className="adm-form-field">
              <label>Nume RO</label>
              <input value={form.nameRO} onChange={e => setForm({...form, nameRO: e.target.value})} />
            </div>
            <div className="adm-form-field">
              <label>Nume EN</label>
              <input value={form.nameEN} onChange={e => setForm({...form, nameEN: e.target.value})} />
            </div>
            <div className="adm-form-field">
              <label>Categorie</label>
              <select value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
                <option value="dogs">Câini</option>
                <option value="cats">Pisici</option>
                <option value="birds">Păsări</option>
                <option value="rodents">Rozătoare</option>
              </select>
            </div>
            <div className="adm-form-field">
              <label>Tip</label>
              <select value={form.type} onChange={e => setForm({...form, type: e.target.value})}>
                <option value="food">Hrană</option>
                <option value="accessory">Accesoriu</option>
                <option value="toy">Jucărie</option>
              </select>
            </div>
            <div className="adm-form-field">
              <label>Preț (RON)</label>
              <input type="number" value={form.price} onChange={e => setForm({...form, price: e.target.value})} />
            </div>
            <div className="adm-form-field">
              <label>URL Imagine</label>
              <input value={form.image} onChange={e => setForm({...form, image: e.target.value})} placeholder="/images/produs.jpg" />
            </div>
            <div className="adm-form-field full">
              <label>Descriere RO</label>
              <textarea value={form.descriptionRO} onChange={e => setForm({...form, descriptionRO: e.target.value})} rows={2} />
            </div>
            <div className="adm-form-field full">
              <label>Descriere EN</label>
              <textarea value={form.descriptionEN} onChange={e => setForm({...form, descriptionEN: e.target.value})} rows={2} />
            </div>
          </div>
          <div className="adm-form-actions">
            <button className="adm-save-btn" onClick={save}>💾 Salvează</button>
            <button className="adm-cancel-btn" onClick={cancel}>Anulează</button>
          </div>
        </div>
      )}

      <div className="adm-table-wrap">
        <table className="adm-table">
          <thead>
            <tr>
              <th>Imagine</th>
              <th>Nume</th>
              <th>Categorie</th>
              <th>Tip</th>
              <th>Preț</th>
              <th>Promo</th>
              <th>Acțiuni</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(p => (
              <tr key={p.id}>
                <td><img src={p.image} alt={p.nameRO} className="adm-product-img" /></td>
                <td>
                  <p className="adm-pname">{p.nameRO}</p>
                  <p className="adm-pname-en">{p.nameEN}</p>
                </td>
                <td><span className={`adm-cat adm-cat--${p.category}`}>{p.category}</span></td>
                <td>{p.type}</td>
                <td className="adm-price">{parseFloat(p.price).toFixed(2)} RON</td>
                <td>
                  <button
                    className={`adm-promo-toggle${promos.find(x => x.id === p.id) ? " on" : ""}`}
                    onClick={() => togglePromo(p.id, p.price)}
                  >
                    {promos.find(x => x.id === p.id) ? "🔥 DA" : "—"}
                  </button>
                </td>
                <td className="adm-actions">
                  <button className="adm-edit-btn" onClick={() => openEdit(p)}>✏️ Edit</button>
                  <button className="adm-del-btn" onClick={() => remove(p.id)}>🗑️ Șterge</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminProducts;