import { useState } from "react";

const MOCK_USERS = [
  { id: 1, name: "Alexandru", email: "test@happypaws.ro",  role: "user",  joined: "01.04.2026" },
  { id: 2, name: "Admin",     email: "admin@happypaws.ro", role: "admin", joined: "01.01.2026" },
];

function AdminUsers() {
  const [users, setUsers] = useState(MOCK_USERS);

  const remove = (id) => {
    if (window.confirm("Ștergi contul?")) {
      setUsers(prev => prev.filter(u => u.id !== id));
    }
  };

  return (
    <div>
      <div className="adm-toolbar">
        <span>{users.length} utilizatori</span>
      </div>

      <div className="adm-table-wrap">
        <table className="adm-table">
          <thead>
            <tr>
              <th>Nume</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Înregistrat</th>
              <th>Acțiuni</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id}>
                <td><strong>{u.name}</strong></td>
                <td>{u.email}</td>
                <td>
                  <span className={`adm-role adm-role--${u.role}`}>{u.role}</span>
                </td>
                <td>{u.joined}</td>
                <td>
                  {u.role !== "admin" && (
                    <button className="adm-del-btn" onClick={() => remove(u.id)}>
                      🗑️ Șterge
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminUsers;