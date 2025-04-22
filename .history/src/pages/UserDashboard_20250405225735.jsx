// UserDashboard.jsx

import { useState, useEffect } from 'react';

const UserDashboard = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  return (
    <div className="bg-dark text-white p-6 min-h-screen">
      {user ? (
        <>
          <h1 className="text-4xl mb-4">Welcome back, {user.name}!</h1>
          {/* Add the rest of your dashboard content here */}
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default UserDashboard;
