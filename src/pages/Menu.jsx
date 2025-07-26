import React, { useState, useEffect } from "react";
import "./menu.css";
import { useLocation, useNavigate } from "react-router-dom";

const MenuBar = () => {
  console.log("MenuBar loaded");

  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false); // מצב התפריט

  // ✅ הוספה:
  const [showPopup, setShowPopup] = useState(false);
  const [userAge, setUserType] = useState(null);
  // ⛔ סוף הוספה

  // ✅ הוספה – שליפת גיל המשתמש מה-localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("editor");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUserType(parsedUser.userType); // נניח שקיים שדה age
    }
  }, []);
  // ⛔ סוף הוספה

  const hiddenMenuRoutes = ["/", "/signup"];
  if (hiddenMenuRoutes.includes(location.pathname)) return null;

  const logoutFunc = () => {
    localStorage.removeItem("editor");
    navigate("/");
  };

  // ✅ הוספה – טיפול בלחיצה על Donate
  const handleDonateClick = () => {
    if (userAge !== null && userAge < 18) {
      setShowPopup(true);
    } else {
      navigate("/donate");
    }
  };
  // ⛔ סוף הוספה

  return (
    <header className="header-container">
      <div className="menu-title">FRIENDLY</div>

      <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
        <div></div>
        <div></div>
        <div></div>
      </div>

      <nav className={`menu-nav ${menuOpen ? "open" : ""}`}>
        <button onClick={() => navigate("/whoarewe")} className="menu-item">
          מי אנחנו?
        </button>
        <button onClick={() => navigate("/posts")} className="menu-item">
          פוסטים
        </button>
        <button onClick={() => navigate("/events")} className="menu-item">
          אירועים
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
        {/* <button onClick={() => navigate("/donate")} className="menu-item">Donate</button> */}
        {/* <button onClick={logoutFunc} className="logout-button">Logout</button> */}

        {/* ✅ החלפה של ניווט רגיל ב־handleDonateClick */}
        <button onClick={handleDonateClick} className="menu-item">
          Donate
        </button>

        <button onClick={logoutFunc} className="logout-button">
          Logout
        </button>

        {/* ✅ הוספה – חלון popup */}
        {showPopup && (
          <div className="popup-overlay">
            <div className="popup">
              <h3>לא ניתן לתרום</h3>
              <p>התרומה פתוחה רק למשתמשים מעל גיל 18.</p>
              <button onClick={() => setShowPopup(false)}>סגור</button>
            </div>
          </div>
        )}
        {/* ⛔ סוף הוספה */}
      </nav>
    </header>
  );
};

export default MenuBar;
