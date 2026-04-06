import { useState, useMemo, useEffect } from "react";
import { useParams } from "react-router-dom";
import ReviewModal from "../components/ReviewModal";
import "./Products.css";
// ─── DATE HARDCODATE ───────────────────────────────────────────────────────────
// Structura identică cu ce va returna API-ul Node.js mai târziu.
// Când ai backend, înlocuiești acest array cu:
//   const [products, setProducts] = useState([]);
//   useEffect(() => { fetch("/api/products").then(r=>r.json()).then(setProducts); }, []);
import { MOCK_PRODUCTS, PROMOS } from "../data/products";

const CATEGORIES = [
  { value: "all",     labelRO: "Toate",      labelEN: "All",      icon: "🐾" },
  { value: "dogs",    labelRO: "Caini",      labelEN: "Dogs",     icon: "🐶" },
  { value: "cats",    labelRO: "Pisici",     labelEN: "Cats",     icon: "🐱" },
  { value: "birds",   labelRO: "Pasari",     labelEN: "Birds",    icon: "🦜" },
  { value: "rodents", labelRO: "Rozatoare",  labelEN: "Rodents",  icon: "🐹" },
];

const TYPES = [
  { value: "all",       labelRO: "Toate tipurile", labelEN: "All types"   },
  { value: "food",      labelRO: "Hrana",          labelEN: "Food"        },
  { value: "accessory", labelRO: "Accesorii",       labelEN: "Accessories" },
  { value: "toy",       labelRO: "Jucarii",         labelEN: "Toys"        },
];

const ITEMS_PER_PAGE = 6;

function ProductCard({ product, darkMode, language, user, addToCart }) {
  const [flipped, setFlipped]       = useState(false);
  const [showReview, setShowReview] = useState(false);

  const promo = PROMOS.find(p => p.id === product.id); // NOU

  const reviews = JSON.parse(localStorage.getItem("hp_reviews") || "[]")
    .filter(r => r.productId === product.id);
  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  return (
    <>
      <div className={`pc-wrapper${flipped ? " flipped" : ""}`} onClick={() => setFlipped(f => !f)}>
        <div className="pc-inner">
          <div className={`pc-front${darkMode ? " dark" : ""}`}>
            <div className="pc-img-wrap">
              <img src={product.image} alt={language === "ro" ? product.nameRO : product.nameEN} className="pc-img" />
              <span className={`pc-badge pc-badge--${product.type}`}>
                {product.type === "food"  ? (language === "ro" ? "Hrana" : "Food")
                : product.type === "toy" ? (language === "ro" ? "Jucarie" : "Toy")
                :                          (language === "ro" ? "Accesoriu" : "Accessory")}
              </span>
              {/* BADGE PROMOȚIE — NOU */}
              {promo && <span className="pc-promo-badge">🔥 PROMO</span>}
            </div>
            <div className="pc-body">
              <h4 className="pc-name">{language === "ro" ? product.nameRO : product.nameEN}</h4>
              {avgRating && <p className="pc-rating">⭐ {avgRating} ({reviews.length})</p>}
              <div className="pc-footer">
              <div>
                {promo && <p className="pc-old-price">{promo.oldPrice.toFixed(2)} RON</p>}
                <p className="pc-price">{product.price.toFixed(2)} RON</p>
              </div>
              <button className="pc-btn" onClick={e => { e.stopPropagation(); addToCart(product); }}>
                {language === "ro" ? "Adaugă în coș" : "Add to cart"}
              </button>
            </div>
              <button className="pc-review-btn" onClick={e => { e.stopPropagation(); setShowReview(true); }}>
                ⭐ {language === "ro" ? "Recenzie" : "Review"}
              </button>
            </div>
          </div>

          {/* SPATE — neschimbat */}
          <div className={`pc-back${darkMode ? " dark" : ""}`}>
            <h4 className="pc-name">{language === "ro" ? product.nameRO : product.nameEN}</h4>
            <p className="pc-desc">{language === "ro" ? product.descriptionRO : product.descriptionEN}</p>
            {reviews.length > 0 && (
              <div className="pc-reviews-preview">
                {reviews.slice(0, 2).map((r, i) => (
                  <div key={i} className="pc-review-mini">
                    <span>{"⭐".repeat(r.rating)}</span>
                    <span>{r.userName}: {r.comment?.slice(0, 50)}{r.comment?.length > 50 ? "..." : ""}</span>
                  </div>
                ))}
              </div>
            )}
            {promo && <p className="pc-old-price">{promo.oldPrice.toFixed(2)} RON</p>}
            <p className="pc-price">{product.price.toFixed(2)} RON</p>
            <button className="pc-btn" onClick={e => { e.stopPropagation(); addToCart(product); }}>
              {language === "ro" ? "Adaugă în coș" : "Add to cart"}
            </button>
            <p className="pc-hint">{language === "ro" ? "Click pentru a întoarce" : "Click to flip"}</p>
          </div>
        </div>
      </div>

      {showReview && (
        <ReviewModal product={product} user={user} language={language} darkMode={darkMode} onClose={() => setShowReview(false)} />
      )}
    </>
  );
}

function Products({ darkMode, language, user,  addToCart }) {
  const [search, setSearch]         = useState("");
  const [category, setCategory]     = useState("all");
  const [type, setType]             = useState("all");
  const [minPrice, setMinPrice]     = useState("");
  const [maxPrice, setMaxPrice]     = useState("");
  const [page, setPage]             = useState(1);
  const [flipping, setFlipping]     = useState(false);
  const [flipDir, setFlipDir]       = useState("next");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // În interiorul funcției Products, după useState-uri — adaugă:
    const { category: urlCategory } = useParams();

    useEffect(() => {
      if (urlCategory) {
        setCategory(urlCategory);
        setPage(1);
      }
    }, [urlCategory]);

  const filtered = useMemo(() => {
    return MOCK_PRODUCTS.filter(p => {
    const matchSearch = 
      p.nameRO.toLowerCase().includes(search.toLowerCase()) ||
      p.nameEN.toLowerCase().includes(search.toLowerCase()) ||
      p.descriptionRO.toLowerCase().includes(search.toLowerCase()) ||
      p.descriptionEN.toLowerCase().includes(search.toLowerCase());
      const matchCategory = category === "all" || p.category === category;
      const matchType     = type === "all" || p.type === type;
      const matchMin      = minPrice === "" || p.price >= parseFloat(minPrice);
      const matchMax      = maxPrice === "" || p.price <= parseFloat(maxPrice);
      return matchSearch && matchCategory && matchType && matchMin && matchMax;
    });
  }, [search, category, type, minPrice, maxPrice]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const safePage   = Math.min(page, totalPages);
  const pageItems  = filtered.slice((safePage - 1) * ITEMS_PER_PAGE, safePage * ITEMS_PER_PAGE);

  const changePage = (dir) => {
    const next = dir === "next" ? safePage + 1 : safePage - 1;
    if (next < 1 || next > totalPages) return;
    setFlipDir(dir);
    setFlipping(true);
    setTimeout(() => {
      setPage(next);
      setFlipping(false);
    }, 400);
  };

  const resetFilters = () => {
    setSearch(""); setCategory("all"); setType("all");
    setMinPrice(""); setMaxPrice(""); setPage(1);
  };

  const bg  = darkMode ? "#121212" : "#FEFAE0";
  const clr = darkMode ? "#f5f5f5" : "#1f1f1f";

  return (
    <div className="products-root" style={{ background: bg, color: clr, minHeight: "100vh" }}>

      {/* ── HEADER PAGINĂ ── */}
      <div className="products-header">
        <h1 className="products-title">
          {language === "ro" ? "Catalogul nostru" : "Our Catalogue"}
        </h1>
        <p className="products-subtitle">
          {language === "ro"
            ? "Descoperă toate produsele HappyPaws pentru animalul tău preferat"
            : "Discover all HappyPaws products for your favourite pet"}
        </p>

        {/* SEARCH BAR */}
        <div className="search-wrap">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className={`search-input${darkMode ? " dark" : ""}`}
            placeholder={language === "ro" ? "Caută produse..." : "Search products..."}
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
          />
          {search && (
            <button className="search-clear" onClick={() => setSearch("")}>✕</button>
          )}
        </div>
      </div>

      <div className="products-layout">

        {/* ── SIDEBAR FILTRE ── */}
        <aside className={`sidebar${sidebarOpen ? " open" : " closed"}${darkMode ? " dark" : ""}`}>
          <div className="sidebar-header">
            <span className="sidebar-title">
              {language === "ro" ? "Filtre" : "Filters"}
            </span>
            <button className="sidebar-toggle" onClick={() => setSidebarOpen(o => !o)}>
              {sidebarOpen ? "◀" : "▶"}
            </button>
          </div>

          {sidebarOpen && (
            <>
              {/* Categorie */}
              <div className="filter-group">
                <label className="filter-label">
                  {language === "ro" ? "Animal" : "Pet type"}
                </label>
                {CATEGORIES.map(c => (
                  <button
                    key={c.value}
                    className={`filter-chip${category === c.value ? " active" : ""}${darkMode ? " dark" : ""}`}
                    onClick={() => { setCategory(c.value); setPage(1); }}
                  >
                    <span className="chip-icon">{c.icon}</span> {language === "ro" ? c.labelRO : c.labelEN}
                  </button>
                ))}
              </div>

              {/* Tip produs */}
              <div className="filter-group">
                <label className="filter-label">
                  {language === "ro" ? "Tip produs" : "Product type"}
                </label>
                {TYPES.map(t => (
                  <button
                    key={t.value}
                    className={`filter-chip${type === t.value ? " active" : ""}${darkMode ? " dark" : ""}`}
                    onClick={() => { setType(t.value); setPage(1); }}
                  >
                    {language === "ro" ? t.labelRO : t.labelEN}
                  </button>
                ))}
              </div>

              {/* Preț */}
              <div className="filter-group">
                <label className="filter-label">
                  {language === "ro" ? "Preț (RON)" : "Price (RON)"}
                </label>
                <div className="price-inputs">
                  <input
                    type="number"
                    className={`price-input${darkMode ? " dark" : ""}`}
                    placeholder="Min"
                    value={minPrice}
                    min="0"
                    onChange={e => { setMinPrice(e.target.value); setPage(1); }}
                  />
                  <span className="price-sep">—</span>
                  <input
                    type="number"
                    className={`price-input${darkMode ? " dark" : ""}`}
                    placeholder="Max"
                    value={maxPrice}
                    min="0"
                    onChange={e => { setMaxPrice(e.target.value); setPage(1); }}
                  />
                </div>
              </div>

              <button className="reset-btn" onClick={resetFilters}>
                {language === "ro" ? "Resetează filtrele" : "Reset filters"}
              </button>
            </>
          )}
        </aside>

        {/* ── ZONA CATALOG ── */}
        <main className="catalog-area">

          {/* Rezultate count */}
          <div className="catalog-meta">
            <span className="results-count">
              {filtered.length} {language === "ro" ? "produse găsite" : "products found"}
            </span>
            <span className="page-info">
              {language === "ro" ? "Pagina" : "Page"} {safePage} / {totalPages}
            </span>
          </div>

          {/* Grid produse */}
          {pageItems.length === 0 ? (
            <div className="no-results">
              <span>😿</span>
              <p>{language === "ro" ? "Niciun produs găsit." : "No products found."}</p>
              <button className="reset-btn" onClick={resetFilters}>
                {language === "ro" ? "Resetează filtrele" : "Reset filters"}
              </button>
            </div>
          ) : (
            <div className={`catalog-grid${flipping ? ` flip-${flipDir}` : ""}`}>
              {pageItems.map(product => (
                <ProductCard key={product.id} product={product} darkMode={darkMode} language={language} user={user} addToCart={addToCart}/>
              ))}
            </div>
          )}

          {/* Navigare pagini */}
          {totalPages > 1 && (
            <div className="pagination">
              <button
                className={`page-btn page-btn--prev${safePage === 1 ? " disabled" : ""}`}
                onClick={() => changePage("prev")}
                disabled={safePage === 1}
              >
                ‹ {language === "ro" ? "Pagina anterioară" : "Previous page"}
              </button>

              <div className="page-dots">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    className={`page-dot${safePage === i + 1 ? " active" : ""}`}
                    onClick={() => {
                      setFlipDir(i + 1 > safePage ? "next" : "prev");
                      setFlipping(true);
                      setTimeout(() => { setPage(i + 1); setFlipping(false); }, 400);
                    }}
                  />
                ))}
              </div>

              <button
                className={`page-btn page-btn--next${safePage === totalPages ? " disabled" : ""}`}
                onClick={() => changePage("next")}
                disabled={safePage === totalPages}
              >
                {language === "ro" ? "Pagina următoare" : "Next page"} ›
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default Products;