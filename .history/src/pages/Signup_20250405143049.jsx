import { useState } from 'react';
import { useNavigate } from 'react-router-dom';  // For navigation
import { Navigate } from 'react-router-dom'; // Used for conditional redirects

function Signup() {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('user');  // Default to normal user
  const [roleKeyword, setRoleKeyword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();  // Hook to handle navigation

  const handleSubmit = (e) => {
    e.preventDefault();

    // Check if the role keyword is 'admin'
    if (roleKeyword === 'admin') {
      setRole('admin'); // Set the role to admin
    }

    // Validate email and role before proceeding
    if (!email || !role) {
      setError('Please fill in all fields');
      return;
    }

    // Save user data with the selected role in localStorage
    const user = {
      id: Date.now(),  // Simple unique ID
      email,
      role, // 'admin', 'writer', 'editor', or 'user'
    };

    localStorage.setItem('user', JSON.stringify(user));

    // Navigate to respective dashboard based on role
    if (role === 'admin') {
      navigate('/admin-dashboard');
    } else if (role === 'writer') {
      navigate('/writer-dashboard');
    } else if (role === 'editor') {
      navigate('/editor-dashboard');
    } else {
      navigate('/user-dashboard');
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
            <option value="editor">Editor</option>
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

      {/* Show error message if any */}
      {error && <p>{error}</p>}
    </div>
  );
}

export default Signup;
