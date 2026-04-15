import { useNavigate } from "react-router-dom";
import { MOCK_PRODUCTS as DEFAULT_PRODUCTS, PROMOS as DEFAULT_PROMOS } from "../data/products";
import { useRef, useState, useEffect } from "react";
import "./Home.css";


function Home({ darkMode, language }) {

  const MOCK_PRODUCTS = JSON.parse(localStorage.getItem("hp_products")) || DEFAULT_PRODUCTS;
  const PROMOS = JSON.parse(localStorage.getItem("hp_promos")) || DEFAULT_PROMOS;

  const promoProducts = PROMOS.map(promo => {
    const product = MOCK_PRODUCTS.find(p => p.id === promo.id);
    if (!product) return null;
    return { ...product, oldPrice: promo.oldPrice };
  }).filter(Boolean);

  const navigate = useNavigate();

  const sectionStyle = {
    backgroundColor: darkMode ? "#121212" : "#FDE8D0",
    color: darkMode ? "#f5f5f5" : "#1f1f1f",
  };
  const lightSectionStyle = {
    backgroundColor: darkMode ? "#1b1b1b" : "#fff8e1",
    color: darkMode ? "#f5f5f5" : "#1f1f1f",
  };
  const titleStyle = { color: darkMode ? "#68d391" : "#28a745" };
  const cardStyle = {
    backgroundColor: darkMode ? "#222" : "#fff",
    color: darkMode ? "#f5f5f5" : "#1f1f1f",
    border: darkMode ? "1px solid #333" : "1px solid #ddd",
  };

  const trackRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft]   = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [currentIndex, setCurrentIndex]     = useState(0);

  const checkScroll = () => {
    const el = trackRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, [promoProducts]);

  const scrollPromo = (dir) => {
    const el = trackRef.current;
    if (!el) return;
    const total = promoProducts.length;
    let next;
    if (dir === "next") {
      next = (currentIndex + 1) % total;
    } else {
      next = (currentIndex - 1 + total) % total;
    }
    setCurrentIndex(next);
    const slideWidth = el.children[0]?.offsetWidth + 24;
    el.scrollTo({ left: next * slideWidth, behavior: "smooth" });
    setTimeout(checkScroll, 400);
  };

  const aboutRef = useRef(null);
  const [aboutVisible, setAboutVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setAboutVisible(true); },
      { threshold: 0.2 }
    );
    if (aboutRef.current) observer.observe(aboutRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div>
      {/* CAROUSEL IMAGINI */}
      <div id="petshopCarousel" className="carousel slide" data-bs-ride="carousel" data-bs-interval="1500">
        <div className="carousel-indicators">
          <button type="button" data-bs-target="#petshopCarousel" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
          <button type="button" data-bs-target="#petshopCarousel" data-bs-slide-to="1" aria-label="Slide 2"></button>
          <button type="button" data-bs-target="#petshopCarousel" data-bs-slide-to="2" aria-label="Slide 3"></button>
        </div>
        <div className="carousel-inner">
          <div className="carousel-item active">
            <img src="/images/dog.jpg" className="d-block w-100" alt="Caine" style={{ height: "500px", objectFit: "cover", objectPosition: "center 40%" }} />
            <div className="carousel-caption d-none d-md-block">
              <h2>{language === "ro" ? "Produse pentru caini fericiti" : "Products for happy dogs"}</h2>
              <p>{language === "ro" ? "Hrana, jucarii si accesorii de calitate." : "Quality food, toys and accessories."}</p>
            </div>
          </div>
          <div className="carousel-item">
            <img src="https://images.unsplash.com/photo-1519052537078-e6302a4968d4?auto=format&fit=crop&w=1400&q=80" className="d-block w-100" alt="Pisica" style={{ height: "500px", objectFit: "cover" }} />
            <div className="carousel-caption d-none d-md-block">
              <h2>{language === "ro" ? "Tot ce ai nevoie pentru pisica ta" : "Everything your cat needs"}</h2>
              <p>{language === "ro" ? "Descopera produse premium pentru rasfatul ei." : "Discover premium products for her comfort."}</p>
            </div>
          </div>
          <div className="carousel-item">
            <img src="https://images.unsplash.com/photo-1444464666168-49d633b86797?auto=format&fit=crop&w=1400&q=80" className="d-block w-100" alt="Pasare" style={{ height: "500px", objectFit: "cover" }} />
            <div className="carousel-caption d-none d-md-block">
              <h2>{language === "ro" ? "Accesorii pentru toate animalele" : "Accessories for all pets"}</h2>
              <p>{language === "ro" ? "HappyPaws are grija de toti prietenii tai necuvantatori." : "HappyPaws takes care of all your lovely pets."}</p>
            </div>
          </div>
        </div>
        <button className="carousel-control-prev" type="button" data-bs-target="#petshopCarousel" data-bs-slide="prev">
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#petshopCarousel" data-bs-slide="next">
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
        </button>
      </div>

      {/* TITLU */}
      <div className="container mt-5 text-center" style={{ color: darkMode ? "#fff8e1" : "#1f1f1f" }}>
        <h1>{language === "ro" ? "Bine ai venit la HappyPaws" : "Welcome to HappyPaws"}</h1>
        <p className="lead">{language === "ro" ? "Aici gasesti produse pentru caini, pisici, pasari si alte animale de companie." : "Here you can find products for dogs, cats, birds and other pets."}</p>
      </div>

      {/* CATEGORII ANIMALE */}
      <section className="py-5 text-center" style={sectionStyle}>
        <div className="container">
          <h3 style={titleStyle} className="mb-4">{language === "ro" ? "Alege animalul" : "Choose your pet"}</h3>
          <div className="d-flex justify-content-center gap-5 flex-wrap">
            <div className="animal-card" onClick={() => navigate("/products/dogs")}>
              <img src="/images/dog_icon.jpg" alt="Dog" className="animal-img" />
              <p>{language === "ro" ? "Caini" : "Dogs"}</p>
            </div>
            <div className="animal-card" onClick={() => navigate("/products/cats")}>
              <img src="/images/cat_icon.jpg" alt="Cat" className="animal-img" />
              <p>{language === "ro" ? "Pisici" : "Cats"}</p>
            </div>
            <div className="animal-card" onClick={() => navigate("/products/birds")}>
              <img src="/images/bird_icon.jpg" alt="Bird" className="animal-img" />
              <p>{language === "ro" ? "Pasari" : "Birds"}</p>
            </div>
            <div className="animal-card" onClick={() => navigate("/products/rodents")}>
              <img src="/images/rodent_icon.jpg" alt="Rodent" className="animal-img" />
              <p>{language === "ro" ? "Rozatoare" : "Rodents"}</p>
            </div>
          </div>
        </div>
      </section>

      {/* PROMOTII */}
      <section className="py-5" style={sectionStyle}>
        <div className="container">
          <h2 className="text-center mb-4" style={titleStyle}>
            {language === "ro" ? "Promotii" : "Special offers"}
          </h2>
          <div className="promo-carousel-wrap">
            {canScrollLeft && (
              <button className="promo-arrow promo-arrow--left" onClick={() => scrollPromo("prev")}>‹</button>
            )}
            <div className="promo-track" ref={trackRef} onScroll={checkScroll}>
              {promoProducts.map((product) => (
                <div className="promo-slide" key={product.id}>
                  <div
                    className="promo-card shadow-sm"
                    style={{ ...cardStyle, cursor: "pointer" }}
                    onClick={() => product?.category && navigate(`/products/${product.category}`)}
                  >
                    <div className="promo-img-wrapper">
                      <img
                        src={product.image}
                        className="card-img-top promo-img"
                        alt={language === "ro" ? product.nameRO : product.nameEN}
                      />
                      <div className="promo-overlay">
                        <p className="promo-description">
                          {language === "ro" ? product.descriptionRO : product.descriptionEN}
                        </p>
                      </div>
                    </div>
                    <div className="card-body text-center">
                      <h5 className="card-title">
                        {language === "ro" ? product.nameRO : product.nameEN}
                      </h5>
                      <p className="mb-1">
                        <span className="old-price">{parseFloat(product.oldPrice).toFixed(2)} RON</span>
                      </p>
                      <p className="fw-bold new-price">{parseFloat(product.price).toFixed(2)} RON</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {canScrollRight && (
              <button className="promo-arrow promo-arrow--right" onClick={() => scrollPromo("next")}>›</button>
            )}
          </div>
        </div>
      </section>
    {/* DESPRE NOI */}
    <section className="py-5" style={lightSectionStyle}>
      <div
        ref={aboutRef}
        className={`container about-animate${aboutVisible ? " visible" : ""}`}
      >
        <div className="row align-items-center">
          <div className="col-md-6">
            <img src="/images/aboutus.jpg" alt="Despre noi" className="img-fluid rounded shadow" style={{ height: "350px", width: "100%", objectFit: "cover" }} />
          </div>
          <div className="col-md-6 mt-4 mt-md-0">
            <h2 style={{ color: "#28a745" }}>{language === "ro" ? "Despre noi" : "About us"}</h2>
            <p>{language === "ro" ? "La HappyPaws, iubim animalele si ne dorim sa oferim produse de calitate pentru caini, pisici, pasari si alte animale de companie." : "At HappyPaws, we love animals and want to offer quality products for dogs, cats, birds and other pets."}</p>
            <p>{language === "ro" ? "Selectam cu atentie hrana, jucariile si accesoriile, astfel incat fiecare client sa gaseasca exact ce are nevoie pentru prietenul sau blanos." : "We carefully select food, toys and accessories so every customer can find exactly what their furry friend needs."}</p>
            <p>{language === "ro" ? "Misiunea noastra este sa aducem bucurie atat animalelor, cat si stapanilor lor, prin produse utile, sigure si accesibile." : "Our mission is to bring joy to both pets and their owners through useful, safe and affordable products."}</p>
          </div>
        </div>
      </div>
    </section>

      {/* CONTACT */}
      <section className="py-5" style={sectionStyle}>
        <div className="container">
          <h2 className="text-center mb-5">{language === "ro" ? "Unde ne poti gasi?" : "Where can you find us?"}</h2>
          <div className="row">
            <div className="col-md-5 mb-4">
              <h4>{language === "ro" ? "Date de contact" : "Contact details"}</h4>
              <p><strong>{language === "ro" ? "Adresa:" : "Address:"}</strong> Strada Mihail Sebastian nr. 88, Bucuresti</p>
              <p><strong>{language === "ro" ? "Telefon:" : "Phone:"}</strong> 0712 345 678</p>
              <p><strong>Email:</strong> contact@happypaws.ro</p>
              <p><strong>{language === "ro" ? "Program:" : "Schedule:"}</strong> {language === "ro" ? "Luni - Sambata, 09:00 - 20:00" : "Monday - Saturday, 09:00 - 20:00"}</p>
            </div>
            <div className="col-md-7">
              <div className="ratio ratio-16x9">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d22798.170987842837!2d26.03898707910156!3d44.41733699999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40b1ff7630409b69%3A0x15d9052fcda4dd61!2sAnimax!5e0!3m2!1sro!2sro!4v1774603885119!5m2!1sro!2sro"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;