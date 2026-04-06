import { useState, useEffect } from "react";
import "./ReviewModal.css";

function ReviewModal({ product, user, language, darkMode, onClose }) {
  const [rating, setRating]   = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // Verifică dacă userul a mai lăsat deja recenzie
  const existing = JSON.parse(localStorage.getItem("hp_reviews") || "[]")
    .find(r => r.productId === product.id && r.userEmail === user?.email);

  useEffect(() => {
    if (existing) {
      setRating(existing.rating);
      setComment(existing.comment);
    }
  }, []);

  const handleSubmit = () => {
    if (!rating) return;
    const all = JSON.parse(localStorage.getItem("hp_reviews") || "[]")
      .filter(r => !(r.productId === product.id && r.userEmail === user.email));

    const newReview = {
      productId:   product.id,
      productName: language === "ro" ? product.nameRO : product.nameEN,
      userEmail:   user.email,
      userName:    localStorage.getItem("hp_nickname") || user.name,
      rating,
      comment,
      date: new Date().toLocaleDateString("ro-RO"),
    };

    localStorage.setItem("hp_reviews", JSON.stringify([...all, newReview]));
    setSubmitted(true);
    setTimeout(onClose, 1500);
  };

  const productName = language === "ro" ? product.nameRO : product.nameEN;

  return (
    <div className="review-overlay" onClick={onClose}>
      <div
        className={`review-modal${darkMode ? " dark" : ""}`}
        onClick={e => e.stopPropagation()}
      >
        <button className="review-close" onClick={onClose}>✕</button>

        <h3 className="review-modal-title">
          {language === "ro" ? "Lasă o recenzie" : "Leave a review"}
        </h3>
        <p className="review-product-name">{productName}</p>

        {submitted ? (
          <div className="review-success">
            ✅ {language === "ro" ? "Recenzie salvată!" : "Review saved!"}
          </div>
        ) : (
          <>
            {/* STELE */}
            <div className="star-picker">
              {[1,2,3,4,5].map(s => (
                <span
                  key={s}
                  className={`star${s <= (hovered || rating) ? " active" : ""}`}
                  onMouseEnter={() => setHovered(s)}
                  onMouseLeave={() => setHovered(0)}
                  onClick={() => setRating(s)}
                >★</span>
              ))}
            </div>
            <p className="star-label">
              {rating === 1 ? (language === "ro" ? "Slab" : "Poor") :
               rating === 2 ? (language === "ro" ? "Acceptabil" : "Fair") :
               rating === 3 ? (language === "ro" ? "Bun" : "Good") :
               rating === 4 ? (language === "ro" ? "Foarte bun" : "Very good") :
               rating === 5 ? (language === "ro" ? "Excelent!" : "Excellent!") : ""}
            </p>

            {/* COMENTARIU */}
            <textarea
              className={`review-textarea${darkMode ? " dark" : ""}`}
              rows={4}
              placeholder={language === "ro" ? "Spune-ne părerea ta..." : "Share your thoughts..."}
              value={comment}
              onChange={e => setComment(e.target.value)}
            />

            {!user && (
              <p className="review-login-warn">
                ⚠️ {language === "ro"
                  ? "Trebuie să fii conectat pentru a lăsa o recenzie."
                  : "You must be logged in to leave a review."}
              </p>
            )}

            <button
              className="review-submit-btn"
              onClick={handleSubmit}
              disabled={!rating || !user}
            >
              {existing
                ? (language === "ro" ? "Actualizează recenzia" : "Update review")
                : (language === "ro" ? "Trimite recenzia" : "Submit review")}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default ReviewModal;