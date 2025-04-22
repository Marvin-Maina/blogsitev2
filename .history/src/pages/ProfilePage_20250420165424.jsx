import { useState, useContext } from "react";
import { useAuth } from "../pages/Authprovider";
import { ThemeContext } from "../ThemeContext";
import { Link } from "react-router-dom";

export default function ProfilePage() {
  const { user, setUser } = useAuth();
  const [profile, setProfile] = useState({
    name: user?.name || "",
    email: user?.email || "",
    avatar: user?.avatar || "", // Use default avatar if none exists
  });
  const [isEditing, setIsEditing] = useState(false);

  const { isDarkMode } = useContext(ThemeContext); // Get dark mode state

  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile({ ...profile, avatar: reader.result }); // Save base64 image string
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle profile update
  const handleProfileUpdate = () => {
    // Update user profile info in localStorage (or backend if available)
    localStorage.setItem("user", JSON.stringify(profile));
    
    // Update the user context (so the profile is updated in the context)
    setUser({ ...profile }); // This triggers a re-render

    setIsEditing(false); // Exit editing mode
  };

  return (
    <div className={`${isDarkMode ? "bg-gray-950 text-white" : "bg-white text-gray-800"} p-6 min-h-screen`}>
      <h1 className="text-4xl font-extrabold text-purple-400 mb-10">Edit Profile</h1>

      {/* Profile Card */}
      <div className={`${isDarkMode ? "bg-gray-800" : "bg-white"} p-6 rounded-lg shadow-md mb-10`}>
        <div className="flex items-center gap-4">
          {/* Profile Picture */}
          <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-300 relative group">
            <img
              src={profile.avatar || "/default-avatar.png"}
              alt="Profile"
              className="w-full h-full object-cover"
            />

            {isEditing && (
              <label
                htmlFor="profile-picture-upload"
                className="absolute inset-0 flex items-center justify-center bg-black/50 text-white text-xs font-medium cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              >
                Change Avatar
              </label>
            )}

            <input
              type="file"
              onChange={handleImageChange}
              className="hidden"
              id="profile-picture-upload"
            />
          </div>

          {/* Editable name and email */}
          <div className="ml-4">
            <div>
              <label className="block text-sm font-medium text-gray-400">Name</label>
              {isEditing ? (
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="mt-2 p-2 bg-gray-800 text-white rounded-lg border border-gray-700 w-full"
                />
              ) : (
                <h2 className="text-2xl font-semibold text-purple-400">{profile.name}</h2>
              )}
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-400">Email</label>
              {isEditing ? (
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  className="mt-2 p-2 bg-gray-800 text-white rounded-lg border border-gray-700 w-full"
                />
              ) : (
                <p className="text-sm text-gray-300">{profile.email}</p>
              )}
            </div>
          </div>
        </div>

        {/* Edit/Save Buttons */}
        <div className="mt-6 flex gap-4">
          {isEditing ? (
            <>
              <button
                onClick={handleProfileUpdate}
                className="px-6 py-2 bg-purple-400 text-white rounded-lg shadow-md hover:bg-purple-300 transition-all duration-200"
              >
                Save Changes
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="px-6 py-2 bg-gray-600 text-white rounded-lg shadow-md hover:bg-gray-500 transition-all duration-200"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="px-6 py-2 bg-purple-400 text-white rounded-lg shadow-md hover:bg-purple-300 transition-all duration-200"
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>

      <Link
        to="/dashboard"
        className="text-purple-400 hover:text-purple-300 underline text-sm transition-colors duration-200"
      >
        Back to Dashboard
      </Link>
    </div>
  );
}
