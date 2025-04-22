// Signup.jsx

import { useState } from 'react';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    const userData = { name, email, role };
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('role', role);
    window.location.href = '/';  // Redirect to dashboard after signup
  };

  return (
    <div className="bg-dark p-6 rounded-xl">
      <h1 className="text-white text-3xl mb-4">Sign Up</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Full Name"
          className="w-full p-2 rounded border border-gray-700 bg-gray-800 text-white"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 rounded border border-gray-700 bg-gray-800 text-white"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full p-2 rounded border border-gray-700 bg-gray-800 text-white"
        >
          <option value="user">User</option>
          <option value="writer">Writer</option>
          <option value="editor">Editor</option>
          <option value="admin">Admin</option>
        </select>
        <button className="w-full p-3 bg-grunge-green text-white rounded hover:bg-grunge-darkgreen transition duration-300">Sign Up</button>
      </form>
    </div>
  );
};

export default Signup;
