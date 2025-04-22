import { useState, useEffect, useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext'; // adjust the path based on your project

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [editingUserId, setEditingUserId] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', email: '' });

  const { isDarkMode } = useContext(ThemeContext);

  useEffect(() => {
    const storedUsers = JSON.parse(localStorage.getItem('users')) || [];
    setUsers(storedUsers);
  }, []);

  const handleDeleteUser = (userId) => {
    const updatedUsers = users.filter(user => user.id !== userId);
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
  };

  const handleChangeRole = (userId, newRole) => {
    const updatedUsers = users.map(user =>
      user.id === userId ? { ...user, role: newRole } : user
    );
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
  };

  const startEditing = (user) => {
    setEditingUserId(user.id);
    setEditForm({ name: user.name, email: user.email });
  };

  const saveEdits = () => {
    const updatedUsers = users.map(user =>
      user.id === editingUserId
        ? { ...user, name: editForm.name, email: editForm.email }
        : user
    );
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    setEditingUserId(null);
  };

  return (
    <div className={`${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'} min-h-screen p-8`}>
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard - Manage Users</h1>
      <div className="overflow-x-auto">
        <table className="w-full text-left border border-gray-300 dark:border-gray-700">
          <thead className={`${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'}`}>
            <tr>
              <th className="p-2 border-b">Name</th>
              <th className="p-2 border-b">Email</th>
              <th className="p-2 border-b">Role</th>
              <th className="p-2 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td className="p-2 border-b">
                  {editingUserId === user.id ? (
                    <input
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      className="px-2 py-1 bg-gray-100 text-black rounded"
                    />
                  ) : (
                    user.name
                  )}
                </td>
                <td className="p-2 border-b">
                  {editingUserId === user.id ? (
                    <input
                      value={editForm.email}
                      onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                      className="px-2 py-1 bg-gray-100 text-black rounded"
                    />
                  ) : (
                    user.email
                  )}
                </td>
                <td className="p-2 border-b">{user.role}</td>
                <td className="p-2 border-b">
                  {editingUserId === user.id ? (
                    <>
                      <button
                        onClick={saveEdits}
                        className="px-4 py-1 bg-green-500 text-white rounded hover:bg-green-400"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingUserId(null)}
                        className="ml-2 px-4 py-1 bg-gray-400 text-white rounded hover:bg-gray-300"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => startEditing(user)}
                        className="px-4 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-300"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() =>
                          handleChangeRole(user.id, user.role === 'admin' ? 'user' : 'admin')
                        }
                        className="ml-2 px-4 py-1 bg-purple-400 text-white rounded hover:bg-purple-300"
                      >
                        Toggle Role
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="ml-2 px-4 py-1 bg-red-400 text-white rounded hover:bg-red-300"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center py-4 text-gray-400">
                  No users found 🥲
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
