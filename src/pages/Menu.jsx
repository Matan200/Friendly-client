import React, { useState } from "react";
import "./menu.css"; // קובץ עיצוב לתפריט
import { useLocation, useNavigate } from "react-router-dom";

const MenuBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // רשימת דפים שבהם התפריט הראשי לא יוצג
  const hiddenMenuRoutes = ["/", "/signup"];

  if (hiddenMenuRoutes.includes(location.pathname)) {
    return null; // לא מציג את התפריט
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleFilter = () => {
    alert("Filter options coming soon!");
  };

  const handleDonate = () => {
    alert("Redirecting to Donate page...");
  };

  const handleProfile = () => {
    alert("Opening My Profile...");
  };

  const handleEvents = () => {
    navigate("/events");
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="header-container">
      <button className="menu-toggle" onClick={toggleMenu}>
        ☰ Menu
      </button>
      {isMenuOpen && (
        <div className="menu-dropdown">
          <button onClick={handleFilter} className="menu-item">
            Filter
          </button>
          <button onClick={handleDonate} className="menu-item">
            Donate
          </button>
          <button onClick={handleProfile} className="menu-item">
            My Profile
          </button>
          <button onClick={handleEvents} className="menu-item">
            events Info
          </button>
        </div>
      )}
    </header>
  );
};

export default MenuBar;
