import React from "react";
import "./menu.css"; // קובץ עיצוב לתפריט
import { useLocation, useNavigate } from "react-router-dom";

const MenuBar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // רשימת דפים שבהם התפריט הראשי לא יוצג
  const hiddenMenuRoutes = ["/", "/signup"];

  if (hiddenMenuRoutes.includes(location.pathname)) {
    return null; // לא מציג את התפריט
  }
  const logoutFunc = () => {
    localStorage.removeItem("editor"); 
    navigate("/"); 
  };
  return (
    <header className="header-container">
      <div className="menu-title">FRIENDLY</div>
      <nav className="menu-nav">
        <button onClick={() => navigate("/posts")} className="menu-item">
          Posts
        </button>
        <button onClick={() => navigate("/events")} className="menu-item">
          Events
        </button>
        <button onClick={() => navigate("/profile")} className="menu-item">
          My Profile
        </button>
        <button onClick={() => alert("Filter options coming soon!")} className="menu-item">
          Filter
        </button>
        <button onClick={() => alert("Redirecting to Donate page...")} className="menu-item">
          Donate
        </button>
        <button onClick={logoutFunc} className="logout-button">
          Logout
        </button>
      </nav>
    </header>
  );
};

export default MenuBar;
