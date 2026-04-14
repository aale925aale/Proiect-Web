import { useState } from "react";

function AdminReviews() {
  const [reviews, setReviews] = useState(
    JSON.parse(localStorage.getItem("hp_reviews") || "[]")
  );

  const remove = (index) => {
    if (window.confirm("Ștergi recenzia?")) {
      const updated = reviews.filter((_, i) => i !== index);
      setReviews(updated);
      localStorage.setItem("hp_reviews", JSON.stringify(updated));
    }
  };

  return (
    <div>
      <div className="adm-toolbar">
        <span>{reviews.length} recenzii</span>
      </div>

      {reviews.length === 0 ? (
        <div className="adm-empty">⭐ Nicio recenzie încă.</div>
      ) : (
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead>
              <tr>
                <th>Produs</th>
                <th>User</th>
                <th>Rating</th>
                <th>Comentariu</th>
                <th>Data</th>
                <th>Acțiuni</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map((r, i) => (
                <tr key={i}>
                  <td><strong>{r.productName}</strong></td>
                  <td>{r.userName}<br/><small>{r.userEmail}</small></td>
                  <td>{"⭐".repeat(r.rating)}</td>
                  <td>{r.comment || "—"}</td>
                  <td>{r.date}</td>
                  <td>
                    <button className="adm-del-btn" onClick={() => remove(i)}>
                      🗑️ Șterge
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminReviews;