import { useState } from 'react';
import

function Signup() {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('user');  // Default to normal user
  const [roleKeyword, setRoleKeyword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    // If the keyword entered is 'admin', make the user an admin
    if (roleKeyword === 'admin') {
      role = 'admin'; // Admin role
    }

    // Save user data with the selected role
    const user = {
      id: Date.now(),  // Simple unique ID
      email,
      role, // 'admin', 'writer', 'editor', or 'user'
    };

    localStorage.setItem('user', JSON.stringify(user));

    // Redirect based on role
    if (role === 'admin') {
      window.location.href = '/admin-dashboard'; // Admin dashboard
    } else if (role === 'writer') {
      window.location.href = '/writer-dashboard'; // Writer dashboard
    } else if (role === 'editor') {
      window.location.href = '/editor-dashboard'; // Editor dashboard
    } else {
      window.location.href = '/user-dashboard'; // Regular user dashboard
    }
  };

  return (
    <div>
      <h1>Signup</h1>
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

        {/* Role selection */}
        <div>
          <label>Choose your role:</label>
          <select 
            value={role} 
            onChange={(e) => setRole(e.target.value)} 
          >
            <option value="user">Normal User</option>
            <option value="writer">Writer</option>
            <option value="editor">Editor</option>  {/* Added Editor */}
          </select>
        </div>

        {/* Admin role keyword */}
        <div>
          <label>Role Keyword (for Admins): </label>
          <input 
            type="text" 
            value={roleKeyword} 
            onChange={(e) => setRoleKeyword(e.target.value)} 
            placeholder="Enter 'admin' for admin role"
          />
        </div>

        <button type="submit">Sign Up</button>
      </form>
      {error && <p>{error}</p>}
    </div>
  );
}

export default Signup;
