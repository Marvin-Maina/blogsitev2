import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../pages/Authprovider";
import {
  LogOut,
  Menu,
  Home,
  PenSquare,
  FilePen,
  FileText,
  BarChart,
  Settings,
  UploadCloud,
  User,
} from "lucide-react";
import ThemeToggle from "./ThemeToggle";

const iconMap = {
  Home,
  PenSquare,
  FilePen,
  FileText,
  BarChart,
  Settings,
  UploadCloud,
  User
};

const Sidebar = ({ isCollapsed, toggleCollapse }) => {
  const location = useLocation();
  const { role } = useAuth();
  const navigate = useNavigate();

  const routes = [
    { to: "/", label: "Dashboard", icon: "Home", roles: ["writer", "editor", "admin", "user"] },
    { to: "/ArticleManagement", label: "Article Management", icon: "PenSquare", roles: ["editor"] },
    { to: "/ContentEditor", label: "Content Editor", icon: "FilePen", roles: ["writer"] },
    { to: "/articles", label: "Articles", icon: "FileText", roles: ["writer"] },
    { to: "/media", label: "Media", icon: "UploadCloud", roles: ["writer", "editor", "admin"] },
    { to: "/Profile", label: "Profile", icon: "User", roles: ["writer", "editor", "admin", "user"]} 
  ];

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("articles");
    navigate("/signup");
  };

  return (
    <aside
      className={`fixed top-0 left-0 h-screen ${
        isCollapsed ? "w-16" : "w-64"
      } bg-gray-800 text-white transition-all duration-300 shadow-lg z-50`}
    >
      <div className="p-4 flex items-center justify-between">
        {!isCollapsed && <h1 className="text-xl font-bold">Blogsite</h1>}
        <button onClick={toggleCollapse} className="ml-auto">
          <Menu size={24} />
        </button>
      </div>

      <nav className="flex flex-col gap-2 mt-4">
        {routes
          .filter((route) => route.roles.includes(role))
          .map(({ to, label, icon }) => {
            const IconComponent = iconMap[icon];
            return (
              <Link
                to={to}
                key={to}
                className={`flex items-center ${
                  isCollapsed ? "justify-center" : ""
                } px-4 py-3 transition-all rounded-lg mx-2 hover:bg-gray-700`}
              >
                {IconComponent && (
                  <IconComponent
                    size={isCollapsed ? 28 : 20}
                    className={`transition-all duration-200 ${
                      isCollapsed ? "" : "mr-2"
                    }`}
                  />
                )}
                {!isCollapsed && <span className="text-sm font-medium">{label}</span>}
              </Link>
            );
          })}

        <button
          onClick={handleLogout}
          className={`flex items-center ${
            isCollapsed ? "justify-center" : ""
          } px-4 py-3 transition-all rounded-lg mx-2 hover:bg-gray-700`}
        >
          <LogOut
            size={isCollapsed ? 28 : 20}
            className={`transition-all duration-200 ${isCollapsed ? "" : "mr-2"}`}
          />
          {!isCollapsed && <span className="text-sm font-medium">Logout</span>}
        </button>

        <div className={`absolute bottom-4 ${isCollapsed ? "left-1/2 transform -translate-x-1/2" : "left-4"}`}>
          <ThemeToggle />
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
