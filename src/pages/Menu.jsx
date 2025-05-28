import React, { useState } from "react";
import "./menu.css";
import { useLocation, useNavigate } from "react-router-dom";

const MenuBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false); // מצב התפריט

  const hiddenMenuRoutes = ["/", "/signup"];
  if (hiddenMenuRoutes.includes(location.pathname)) return null;

  const logoutFunc = () => {
    localStorage.removeItem("editor");
    navigate("/");
  };

  return (
    <header className="header-container">
      <div className="menu-title">FRIENDLY</div>

      <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
        <div></div>
        <div></div>
        <div></div>
      </div>

      <nav className={`menu-nav ${menuOpen ? "open" : ""}`}>
        <button onClick={() => navigate("/whoarewe")} className="menu-item">מי אנחנו?</button>
        <button onClick={() => navigate("/posts")} className="menu-item">פוסטים</button>
        <button onClick={() => navigate("/events")} className="menu-item">אירועים</button>
        <button onClick={() => navigate("/myposts")} className="menu-item">השיתופים שלי</button>
        <button onClick={() => navigate("/alumni")} className="menu-item">הבוגרים שלנו</button>
        <button onClick={() => navigate("/myprofile")} className="menu-item">הפרופיל שלי</button>
        <button onClick={() => navigate("/donate")} className="menu-item">Donate</button>
        <button onClick={logoutFunc} className="logout-button">Logout</button>
      </nav>
    </header>
  );
};

export default MenuBar;
