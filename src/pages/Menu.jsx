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
        <button onClick={() => navigate("/myposts")} className="menu-item">
          השיתופים שלי
        </button>
        <button onClick={() => navigate("/alumni")} className="menu-item">
          הבוגרים שלנו
        </button>
        <button onClick={() => navigate("/myprofile")} className="menu-item">
          הפרופיל שלי
        </button>
        <button onClick={() => navigate("/donate")} className="menu-item">
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
