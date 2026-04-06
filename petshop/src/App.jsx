import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Header from "./components/Header";
import Home from "./pages/Home";
import Products from "./pages/Products";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Account from "./pages/Account";
import CartSidebar from "./components/CartSidebar";
import Checkout from "./pages/Checkout";

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState("ro");
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);

  const toggleDarkMode = () => setDarkMode(!darkMode);
  const toggleLanguage = () => setLanguage(language === "ro" ? "en" : "ro");
  const handleLogin  = (userData) => setUser(userData);
  const handleLogout = () => setUser(null);

   const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) {
        return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...prev, { ...product, qty: 1 }];
    });
    setCartOpen(true); // deschide sidebar la adăugare
  };

  const removeFromCart = (id) => setCart(prev => prev.filter(i => i.id !== id));

  const updateQty = (id, qty) => {
    if (qty < 1) { removeFromCart(id); return; }
    setCart(prev => prev.map(i => i.id === id ? { ...i, qty } : i));
  };

  const clearCart = () => setCart([]);



  return (
    <BrowserRouter>
      <div className={darkMode ? "app dark-mode" : "app"}>
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
         <CartSidebar
          open={cartOpen}
          onClose={() => setCartOpen(false)}
          cart={cart}
          updateQty={updateQty}
          removeFromCart={removeFromCart}
          darkMode={darkMode}
          language={language}
        />
        <main style={{ paddingTop: "90px" }}>
          <Routes>
            <Route path="/" element={<Home darkMode={darkMode} language={language} />} />
            <Route path="/account" element={
            <Account darkMode={darkMode} language={language} user={user} setUser={setUser} />
          } />
          <Route path="/products" element={
            <Products darkMode={darkMode} language={language} user={user} addToCart={addToCart}/>
          } />
          <Route path="/products/:category" element={
            <Products darkMode={darkMode} language={language} user={user} addToCart={addToCart}/>
          } />
            <Route path="/login" element={<Login darkMode={darkMode} language={language} onLogin={handleLogin} />} />
            <Route path="/register" element={<Register darkMode={darkMode} language={language} onLogin={handleLogin} />} />
            <Route path="/checkout" element={<Checkout darkMode={darkMode} language={language} user={user} cart={cart} clearCart={clearCart} />} />
            <Route path="/cart" element={<h1 className="text-center mt-5">Cos</h1>} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;