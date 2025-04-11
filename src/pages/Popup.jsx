import React from "react";
import "./popup.css";

const Popup = ({ event, onClose, onParticipate }) => {
  if (!event) return null;

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <h2>פרטי האירוע</h2>
        <p><strong>שם:</strong> {event.eventName}</p>
        <p><strong>מקום:</strong> {event.place}</p>
        <p><strong>תאריך:</strong> {event.date}</p>
        <p><strong>שעה:</strong> {event.hour}</p>
        <p><strong>פרטים נוספים:</strong> {event.details}</p>

        <div className="popup-buttons">
          <button onClick={onParticipate}>✅ השתתפות</button>
          <button onClick={onClose}>❌ סגור</button>
        </div>
      </div>
    </div>
  );
};

export default Popup;
