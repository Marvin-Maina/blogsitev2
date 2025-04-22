import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Signup() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [selectedRole, setSelectedRole] = useState('user');
  const [roleKeyword, setRoleKeyword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    // Determine role
    let role = selectedRole;
    if (roleKeyword.trim().toLowerCase() === 'admin') {
      role = 'admin';
    }

    const user = {
      id: Date.now(),
      email,
      role, // now uses the local `role` variable
    };

    localStorage.setItem('user', JSON.stringify(user));

    // Redirect to the proper dashboard
    navigate(`/${role}-dashboard`);
  };

  return (
    <div className="signup-container">
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email: </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Choose your role:</label>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
          >
            <option value="user">Normal User</option>
            <option value="writer">Writer</option>
            <option value="editor">Editor</option>
          </select>
        </div>

        <div>
          <label>Admin Keyword (optional): </label>
          <input
            type="text"
            value={roleKeyword}
            onChange={(e) => setRoleKeyword(e.target.value)}
            placeholder="Enter 'admin' for admin role"
          />
        </div>

        <button type="submit">Sign Up</button>
      </form>
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}

export default Signup;
