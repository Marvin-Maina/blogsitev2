import { Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import WriterDashboard from './pages/WriterDashboard';
import UserDashboard from "./pages/UserDashboard";
import EditorDashboard from "./pages/EditorDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ContentEditor from "./pages/ContentEditor";
import ArticleList from './pages/ArticleList';
import MediaPage from "./pages/Media";
import ProfilePage from "./pages/ProfilePage";

import { ThemeProvider } from "./ThemeContext";

function ProtectedRoute({ children, role, allowedRoles }) {
  if (!allowedRoles.includes(role)) {
    return <Navigate to="/user-dashboard" replace />;
  }
  return children;
}

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

            {/* Writer Routes */}
            <Route
              path="/writer-dashboard"
              element={
                <ProtectedRoute role={user.role} allowedRoles={["writer"]}>
                  <Layout><WriterDashboard /></Layout>
                </ProtectedRoute>
              }
            />

            {/* Editor Routes */}
            <Route
              path="/editor-dashboard"
              element={
                <ProtectedRoute role={user.role} allowedRoles={["editor"]}>
                  <Layout><EditorDashboard /></Layout>
                </ProtectedRoute>
              }
            />

            {/* Admin Routes */}
            <Route
              path="/admin-dashboard"
              element={
                <ProtectedRoute role={user.role} allowedRoles={["admin"]}>
                  <Layout><AdminDashboard /></Layout>
                </ProtectedRoute>
              }
            />

            {/* User Dashboard Route */}
            <Route path="/user-dashboard" element={<Layout><UserDashboard /></Layout>} />

            {/* Other Routes */}
            <Route path="/content-editor" element={<Layout><ContentEditor /></Layout>} />
            <Route path="/articles" element={<Layout><ArticleList /></Layout>} />
            <Route path="/media" element={<Layout><MediaPage /></Layout>} />
            <Route path="/profile" element={<Layout><ProfilePage /></Layout>} />

            {/* Catch-all Route for Redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        )}
      </Routes>
    </ThemeProvider>
  );
}

export default App;
