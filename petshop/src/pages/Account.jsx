import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Account.css";

const AVATARS = [
  { id: "dog",    src: "/images/dog_icon.jpg",    label: "Câine" },
  { id: "cat",    src: "/images/cat_icon.jpg",    label: "Pisică" },
  { id: "bird",   src: "/images/bird_icon.jpg",   label: "Papagal" },
  { id: "rodent", src: "/images/rodent_icon.jpg", label: "Hamster" },
  { id: "human1", src: "/images/avatar_human1.png", label: "Uman 1" },
  { id: "human2", src: "/images/avatar_human2.png", label: "Uman 2" },
];

function Account({ darkMode, language, user, setUser }) {
  const navigate = useNavigate();

  // Dacă nu e logat, redirecționează
  useEffect(() => {
    if (!user) navigate("/login");
  }, [user]);

  const [nickname, setNickname] = useState(
    () => localStorage.getItem("hp_nickname") || user?.name || ""
  );
  const [avatar, setAvatar] = useState(
    () => localStorage.getItem("hp_avatar") || "dog"
  );
  const [address, setAddress] = useState(
    () => localStorage.getItem("hp_address") || ""
  );
  const [saved, setSaved] = useState(false);
  const [tab, setTab] = useState("profile"); // "profile" | "reviews"

  const reviews = JSON.parse(localStorage.getItem("hp_reviews") || "[]")
    .filter(r => r.userEmail === user?.email);

  const handleSave = () => {
    localStorage.setItem("hp_nickname", nickname);
    localStorage.setItem("hp_avatar", avatar);
    localStorage.setItem("hp_address", address);
    setUser({ ...user, name: nickname });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const currentAvatar = AVATARS.find(a => a.id === avatar) || AVATARS[0];

  if (!user) return null;

  return (
    <div className={`account-page${darkMode ? " dark" : ""}`}>
      <div className="account-container">

        {/* HEADER PROFIL */}
        <div className="account-hero">
          <img src={currentAvatar.src} alt="avatar" className="account-avatar-big" />
          <div>
            <h2 className="account-name">{nickname || user.name}</h2>
            <p className="account-email">{user.email}</p>
          </div>
        </div>

        {/* TABS */}
        <div className="account-tabs">
          <button
            className={`acc-tab${tab === "profile" ? " active" : ""}`}
            onClick={() => setTab("profile")}
          >
            {language === "ro" ? "Profilul meu" : "My profile"}
          </button>
          <button
            className={`acc-tab${tab === "reviews" ? " active" : ""}`}
            onClick={() => setTab("reviews")}
          >
            {language === "ro" ? "Recenziile mele" : "My reviews"}
          </button>
        </div>

        {/* TAB PROFIL */}
        {tab === "profile" && (
          <div className="account-card">

            {/* AVATAR PICKER */}
            <div className="section-block">
              <h3>{language === "ro" ? "Alege avatarul" : "Choose avatar"}</h3>
              <div className="avatar-grid">
                {AVATARS.map(av => (
                  <div
                    key={av.id}
                    className={`avatar-option${avatar === av.id ? " selected" : ""}`}
                    onClick={() => setAvatar(av.id)}
                  >
                    <img src={av.src} alt={av.label} />
                    <span>{av.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* NICKNAME */}
            <div className="section-block">
              <h3>{language === "ro" ? "Nickname" : "Nickname"}</h3>
              <input
                className={`acc-input${darkMode ? " dark" : ""}`}
                type="text"
                value={nickname}
                onChange={e => setNickname(e.target.value)}
                placeholder={language === "ro" ? "Cum vrei să te strige alții?" : "What should others call you?"}
              />
            </div>

            {/* ADRESĂ */}
            <div className="section-block">
              <h3>{language === "ro" ? "Adresă de livrare" : "Delivery address"}</h3>
              <textarea
                className={`acc-input acc-textarea${darkMode ? " dark" : ""}`}
                value={address}
                onChange={e => setAddress(e.target.value)}
                placeholder={language === "ro" ? "Strada, număr, oraș, județ..." : "Street, number, city, county..."}
                rows={3}
              />
              <p className="acc-note">
                🔒 {language === "ro"
                  ? "Salvată local pe acest dispozitiv. Nu e transmisă nicăieri."
                  : "Saved locally on this device. Not transmitted anywhere."}
              </p>
            </div>

            <button className="acc-save-btn" onClick={handleSave}>
              {saved
                ? (language === "ro" ? "✓ Salvat!" : "✓ Saved!")
                : (language === "ro" ? "Salvează modificările" : "Save changes")}
            </button>
          </div>
        )}

        {/* TAB RECENZII */}
        {tab === "reviews" && (
          <div className="account-card">
            {reviews.length === 0 ? (
              <div className="no-reviews">
                <span>⭐</span>
                <p>{language === "ro"
                  ? "Nu ai lăsat nicio recenzie încă."
                  : "You haven't left any reviews yet."}
                </p>
              </div>
            ) : (
              reviews.map((r, i) => (
                <div key={i} className="review-item">
                  <div className="review-header">
                    <strong>{r.productName}</strong>
                    <span className="review-stars">{"⭐".repeat(r.rating)}</span>
                  </div>
                  <p>{r.comment}</p>
                  <small>{r.date}</small>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Account;