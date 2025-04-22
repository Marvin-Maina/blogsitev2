import React, { useState, useEffect, useContext } from 'react';
import { useAuth } from './Authprovider';
import { ThemeContext } from '../ThemeContext';

const AdminDashboard = () => {
  const { user } = useAuth();
  const { isDarkMode } = useContext(ThemeContext); 
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);


  if (user?.role !== 'admin') {
    return <p>Access Denied: You are not an admin.</p>;
  }

  useEffect(() => {
   
    const usersFromStorage = JSON.parse(localStorage.getItem('users')) || [];
    setUsers(usersFromStorage);
  }, []);

  const handleDeleteUser = (userId) => {
    // Remove the user from the list
    const updatedUsers = users.filter((user) => user.id !== userId);
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers)); // Update localStorage
  };

  const handleChangeRole = (userId, newRole) => {
    // Update user role
    const updatedUsers = users.map((user) =>
      user.id === userId ? { ...user, role: newRole } : user
    );
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers)); // Update localStorage
  };

  return (
    <div className={`${isDarkMode ? "bg-gray-900 text-white" : "bg-white text-gray-800"} p-6 min-h-screen`}>
      <h1 className="text-4xl font-extrabold text-purple-400 mb-10">Admin Dashboard</h1>

      {/* Error Handling */}
      {error && <p className="text-red-500">{error}</p>}

      {/* Users List */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h2 className="text-3xl font-bold text-purple-300 mb-4">All Users</h2>
        <table className="w-full text-left">
          <thead>
            <tr>
              <th className="p-2 border-b">Name</th>
              <th className="p-2 border-b">Email</th>
              <th className="p-2 border-b">Role</th>
              <th className="p-2 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td className="p-2 border-b">{user.name}</td>
                <td className="p-2 border-b">{user.email}</td>
                <td className="p-2 border-b">{user.role}</td>
                <td className="p-2 border-b">
                  <button
                    onClick={() => handleChangeRole(user.id, user.role === 'admin' ? 'user' : 'admin')}
                    className="px-4 py-2 bg-purple-400 text-white rounded-lg shadow-md hover:bg-purple-300"
                  >
                    Toggle Role
                  </button>
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    className="ml-4 px-4 py-2 bg-red-400 text-white rounded-lg shadow-md hover:bg-red-300"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
