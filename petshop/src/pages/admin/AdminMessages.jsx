import { useState } from "react";

function AdminMessages() {
  const [messages, setMessages] = useState(
    JSON.parse(localStorage.getItem("hp_messages") || "[]")
  );
  const [selected, setSelected] = useState(null);

  const markRead = (id) => {
    const updated = messages.map(m => m.id === id ? { ...m, read: true } : m);
    setMessages(updated);
    localStorage.setItem("hp_messages", JSON.stringify(updated));
  };

  const remove = (id) => {
    if (window.confirm("Ștergi mesajul?")) {
      const updated = messages.filter(m => m.id !== id);
      setMessages(updated);
      localStorage.setItem("hp_messages", JSON.stringify(updated));
      if (selected?.id === id) setSelected(null);
    }
  };

  const unreadCount = messages.filter(m => !m.read).length;

  return (
    <div>
      <div className="adm-toolbar">
        <span>
          {messages.length} mesaje
          {unreadCount > 0 && <span className="msg-unread-badge">{unreadCount} necitite</span>}
        </span>
      </div>

      {messages.length === 0 ? (
        <div className="adm-empty">✉️ Niciun mesaj încă.</div>
      ) : (
        <div className="messages-layout">
          {/* LISTA MESAJE */}
          <div className="messages-list">
            {messages.map(m => (
              <div
                key={m.id}
                className={`message-item${m.read ? "" : " unread"}${selected?.id === m.id ? " active" : ""}`}
                onClick={() => { setSelected(m); markRead(m.id); }}
              >
                <div className="message-item-header">
                  <strong>{m.name}</strong>
                  <span className="message-date">{m.date}</span>
                </div>
                <p className="message-email">{m.email}</p>
                <p className="message-preview">{m.message.slice(0, 60)}{m.message.length > 60 ? "..." : ""}</p>
              </div>
            ))}
          </div>

          {/* DETALIU MESAJ */}
          <div className="message-detail">
            {selected ? (
              <>
                <div className="message-detail-header">
                  <div>
                    <h3>{selected.name}</h3>
                    <p>{selected.email} · {selected.date}</p>
                  </div>
                  <button className="adm-del-btn" onClick={() => remove(selected.id)}>
                    🗑️ Șterge
                  </button>
                </div>
                <div className="message-detail-body">
                  <p>{selected.message}</p>
                </div>
                <a href={`mailto:${selected.email}`} className="message-reply-btn">
                  ✉️ Răspunde prin email
                </a>
              </>
            ) : (
              <div className="message-empty">
                <span>📨</span>
                <p>Selectează un mesaj pentru a-l citi</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminMessages;