import React, { useState, useContext } from "react";  // Added missing useState import
import { Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Signup from "./pages/Signup";
import WriterDashboard from "./pages/Writerdashboard";
import UserDashboard from "./pages/UserDashboard";
import EditorDashboard from "./pages/Editordashboard";
import AdminDashboard from "./pages/Admindashboard";
import ContentEditor from "./pages/ContentEditor";
import Articles from './pages/Articlelist'
import MediaPage from "./pages/Media";
import ProfilePage from "./pages/ProfilePage";


import { ThemeProvider, ThemeContext } from "./ThemeContext";
import ThemeToggle from './components/ThemeToggle';
import { Import } from "lucide-react";
import Login from "./pages/Login";
import FullArticlePage from "./pages/Fullarticlepage";

const Layout = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);  
  const { isDarkMode } = useContext(ThemeContext); 

  return (
    <div
      className={` ${isDarkMode ? "bg-gray-950 text-white" : "bg-gray-50 text-gray-800"}`}
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
  const user = JSON.parse(localStorage.getItem("user"));

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
            <Route path="/login" element={<Login />} />
            <Route path="/full-article/:title" element={<Layout><FullArticlePage /></Layout>} />

          </>
        )}
      </Routes>
    </ThemeProvider> 
  );
}

export default App;