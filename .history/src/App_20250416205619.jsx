import { Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import WriterDashboard from './pages/WriterDashboard';
import UserDashboard from "./pages/UserDashboard";
import EditorDashboard from "./pages/Editordashboard";
import AdminDashboard from "./pages/Admindashboard";
import ContentEditor from "./pages/ContentEditor";
import ArticleList from './pages/ArticleList';
import MediaPage from "./pages/Media";
import ProfilePage from "./pages/ProfilePage";

import { ThemeProvider, ThemeContext } from "./ThemeContext";
import ThemeToggle from './components/ThemeToggle';
import Logout from './components/Logout';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  return (
    <ThemeProvider> 
      <Routes>
        {/* Login Route */}
        <Route path="/login" element={<Login />} />

        {/* Signup Route */}
        <Route path="/signup" element={<Signup />} />

        {/* Redirect to login if not logged in */}
        {!user && <Route path="*" element={<Navigate to="/login" replace />} />}

        {/* Routes for authenticated users */}
        {user && (
          <>
            <Route path="/" element={<Navigate to={`/${user.role}-dashboard`} replace />} />
            <Route
              path="/writer-dashboard"
              element={
                user.role === "writer" ? (
                  <Layout><WriterDashboard /></Layout>
                ) : (
                  <Navigate to="/user-dashboard" replace />
                )
              }
            />
            <Route
              path="/editor-dashboard"
              element={
                user.role === "editor" ? (
                  <Layout><EditorDashboard /></Layout>
                ) : (
                  <Navigate to="/user-dashboard" replace />
                )
              }
            />
            <Route
              path="/admin-dashboard"
              element={
                user.role === "admin" ? (
                  <Layout><AdminDashboard /></Layout>
                ) : (
                  <Navigate to="/user-dashboard" replace />
                )
              }
            />
            <Route path="/user-dashboard" element={<Layout><UserDashboard /></Layout>} />
            <Route path="/ContentEditor" element={<Layout><ContentEditor /></Layout>} />
            <Route path="/articles" element={<Layout><ArticleList /></Layout>} />
            <Route path="/media" element={<Layout><MediaPage /></Layout>} />
            <Route path="/profile" element={<Layout><ProfilePage /></Layout>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        )}
      </Routes>
    </ThemeProvider> 
  );
}

export default App;
