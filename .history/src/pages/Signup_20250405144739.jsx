import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Signup() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState('user');
  const [roleKeyword, setRoleKeyword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    let role = selectedRole;
    if (roleKeyword.trim().toLowerCase() === 'admin') {
      role = 'admin';
    }

    if (!email || !password) {
      setError('Email and password are required.');
      return;
    }

    const user = {
      id: Date.now(),
      email,
      password, // ⚠️ In real apps, never store plain passwords in localStorage!
      role,
    };

    localStorage.setItem('user', JSON.stringify(user));
    navigate(`/${role}-dashboard`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md"
      >
        <h2 className="text-3xl font-bold text-center mb-6">Sign Up</h2>

        {error && (
          <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
        )}

        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError('');
            }}
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError('');
            }}
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
            required
          />

          <div>
            <label className="block mb-1 font-medium">Choose your role</label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              <option value="user">Normal User</option>
              <option value="writer">Writer</option>
              <option value="editor">Editor</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 font-medium">
              Admin Keyword (optional)
            </label>
            <input
              type="text"
              placeholder="Enter 'admin' to become admin"
              value={roleKeyword}
              onChange={(e) => setRoleKeyword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>
        </div>

        <button
          type="submit"
          className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded font-semibold transition"
        >
          Create Account
        </button>

        <p className="mt-4 text-center text-gray-600">
          Already have an account?{' '}
          <button
            onClick={() => navigate('/login')}
            className="text-indigo-600 hover:underline"
          >
            Log In
          </button>
        </p>
      </form>
    </div>
  );
}

export default Signup;
