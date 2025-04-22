import React, { useState, useContext, useEffect } from "react"; 
import { Routes, Route, Navigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";  // Firebase Auth import
import Sidebar from "./components/Sidebar";
import Signup from "./pages/Signup";
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

const Layout = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);  
  const { isDarkMode } = useContext(ThemeContext); 

  return (
    <div
      className={`flex h-screen ${isDarkMode ? "bg-gray-950 text-white" : "bg-gray-50 text-gray-800"}`}
    >
      <Sidebar isCollapsed={isCollapsed} toggleCollapse={() => setIsCollapsed(prev => !prev)} />
      <main
        className={`transition-all duration-300 flex-1 p-4 ${isCollapsed ? "ml-16" : "ml-64"}`}
      >
        {children}
      </main>
    </div>
  );
};

function App() {
  const [user, setUser] = useState(null);  // Track Firebase user
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        // Fetch user role from Firestore
        const userRole = firebaseUser.email.endsWith("@admin.com") ? "admin" : "user";  // Example logic
        setUser({ uid: firebaseUser.uid, email: firebaseUser.email, role: userRole });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();  // Cleanup on unmount
  }, []);

  if (loading) {
    return <div>Loading...</div>;  // Optional loading state while Firebase loads
  }

  return (
    <ThemeProvider> 
      <Routes>
        <Route path="/signup" element={<Signup />} />

        {!user && <Route path="*" element={<Navigate to="/signup" replace />} />}

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
