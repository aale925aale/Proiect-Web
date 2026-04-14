import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useState } from "react";
import Header from "./components/Header";
import Home from "./pages/Home";
import Products from "./pages/Products";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Account from "./pages/Account";
import CartSidebar from "./components/CartSidebar";
import Checkout from "./pages/Checkout";
import Admin from "./pages/Admin";
import AdminLogin from "./pages/AdminLogin";
import Footer from "./components/Footer";

function AppContent({ darkMode, toggleDarkMode, language, toggleLanguage, user, setUser,
  handleLogin, handleLogout, cart, setCart, cartOpen, setCartOpen,
  addToCart, removeFromCart, updateQty, clearCart,
  isAdmin, handleAdminLogin, handleAdminLogout }) {

  const location = useLocation();
  const isAdminPage = location.pathname.startsWith("/admin");

  return (
    <div className={darkMode ? "app dark-mode" : "app"}>
      {!isAdminPage && (
        <Header
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
          language={language}
          toggleLanguage={toggleLanguage}
          user={user}
          onLogout={handleLogout}
          cartCount={cart.reduce((s, i) => s + i.qty, 0)}
          onCartClick={() => setCartOpen(true)}
        />
      )}
      {!isAdminPage && (
        <CartSidebar
          open={cartOpen}
          onClose={() => setCartOpen(false)}
          cart={cart}
          updateQty={updateQty}
          removeFromCart={removeFromCart}
          darkMode={darkMode}
          language={language}
        />
      )}
      <main style={{ paddingTop: isAdminPage ? "0" : "90px" }}>
        <Routes>
          <Route path="/" element={<Home darkMode={darkMode} language={language} />} />
          <Route path="/account" element={
            <Account darkMode={darkMode} language={language} user={user} setUser={setUser} />
          } />
          <Route path="/products" element={
            <Products darkMode={darkMode} language={language} user={user} addToCart={addToCart} />
          } />
          <Route path="/products/:category" element={
            <Products darkMode={darkMode} language={language} user={user} addToCart={addToCart} />
          } />
          <Route path="/login" element={<Login darkMode={darkMode} language={language} onLogin={handleLogin} />} />
          <Route path="/register" element={<Register darkMode={darkMode} language={language} onLogin={handleLogin} />} />
          <Route path="/checkout" element={<Checkout darkMode={darkMode} language={language} user={user} cart={cart} clearCart={clearCart} />} />
          <Route path="/cart" element={<h1 className="text-center mt-5">Cos</h1>} />
          <Route path="/admin-login" element={<AdminLogin onAdminLogin={handleAdminLogin} />} />
          <Route path="/admin" element={
            isAdmin ? <Admin onAdminLogout={handleAdminLogout} /> : <AdminLogin onAdminLogin={handleAdminLogin} />
          } />
        </Routes>
      </main>
          
        {!isAdminPage && (
          <Footer darkMode={darkMode} language={language} />
        )}
    </div>
  );
}

function App() {
  const [darkMode, setDarkMode]   = useState(false);
  const [language, setLanguage]   = useState("ro");
  const [user, setUser]           = useState(null);
  const [cart, setCart]           = useState([]);
  const [cartOpen, setCartOpen]   = useState(false);
  const [isAdmin, setIsAdmin]     = useState(false);

  const toggleDarkMode = () => setDarkMode(!darkMode);
  const toggleLanguage = () => setLanguage(language === "ro" ? "en" : "ro");
  const handleLogin    = (userData) => setUser(userData);
  const handleLogout   = () => setUser(null);
  const handleAdminLogin  = () => setIsAdmin(true);
  const handleAdminLogout = () => setIsAdmin(false);

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...product, qty: 1 }];
    });
    setCartOpen(true);
  };

  const removeFromCart = (id) => setCart(prev => prev.filter(i => i.id !== id));
  const updateQty = (id, qty) => {
    if (qty < 1) { removeFromCart(id); return; }
    setCart(prev => prev.map(i => i.id === id ? { ...i, qty } : i));
  };
  const clearCart = () => setCart([]);

  return (
    <BrowserRouter>
      <AppContent
        darkMode={darkMode} toggleDarkMode={toggleDarkMode}
        language={language} toggleLanguage={toggleLanguage}
        user={user} setUser={setUser}
        handleLogin={handleLogin} handleLogout={handleLogout}
        cart={cart} setCart={setCart}
        cartOpen={cartOpen} setCartOpen={setCartOpen}
        addToCart={addToCart} removeFromCart={removeFromCart}
        updateQty={updateQty} clearCart={clearCart}
        isAdmin={isAdmin}
        handleAdminLogin={handleAdminLogin}
        handleAdminLogout={handleAdminLogout}
      />
    </BrowserRouter>
  );
}

export default App;