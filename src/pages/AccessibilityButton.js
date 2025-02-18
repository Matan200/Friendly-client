import React, { useState } from "react";
import "./AccessibilityButton.css"; // קובץ CSS לעיצוב הכפתור

const AccessibilityButton = () => {
  const [fontSize, setFontSize] = useState(16);
  const [highContrast, setHighContrast] = useState(false);
  const [increaseText, setIncreaseText] = useState(false);
  const [decreaseText, setDecreaseText] = useState(false);

  // פונקציה להגדלת גודל הטקסט
  const increaseFontSize = () => {
    setIncreaseText((prev) => !prev);
    document.body.classList.toggle("inc");
    //setIncreaseText("חזור למקורי");
  };

  // פונקציה להקטנת גודל הטקסט
  const decreaseFontSize = () => {
    if (fontSize > 10) {
      setDecreaseText((prev) => !prev);
      document.body.classList.toggle("dec");
      //setDecreaseText("חזור למקורי");
    }
  };

  // פונקציה להחלפת מצב ניגודיות גבוהה (רקע כהה)
  const toggleHighContrast = () => {
    setHighContrast((prev) => !prev);
    document.body.classList.toggle("high-contrast");
  };

  return (
    <div className="accessibility-container">
      <button
        onClick={increaseFontSize}
        className="accessibility-button"
        aria-label="הגדלת טקסט"
      >
        {increaseText ? "חזור לגודל" : "הגדל טקסט "}
      </button>
      <button
        onClick={decreaseFontSize}
        className="accessibility-button"
        aria-label="הקטנת טקסט"
      >
        {decreaseText ? "חזור לגודל" : "הקטן טקסט "}
      </button>
      <button
        onClick={toggleHighContrast}
        className="accessibility-button"
        aria-label="הפעלת ניגודיות גבוהה"
      >
        {highContrast ? "בטל ניגודיות" : "ניגודיות גבוהה"}
      </button>
    </div>
  );
};

export default AccessibilityButton;
