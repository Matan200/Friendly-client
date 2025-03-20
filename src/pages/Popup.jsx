import React from "react";
import "./popup.css"; // חיבור קובץ העיצוב

const Popup = ({ event, onClose }) => {
  if (!event) return null; // אם אין אירוע נבחר, לא להציג פופאפ

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <h2>רכישת כרטיסים עבור {event.eventName}</h2>
        <p>📍 מיקום: {event.place}</p>
        <p>📅 תאריך: {event.date} | 🕒 שעה: {event.hour}</p>
        <p>💰 מחיר כרטיס: ₪{event.price.toFixed(2)}</p>

        <table className="ticket-table">
          <thead>
            <tr>
              <th>סוג כרטיס</th>
              <th>מחיר</th>
              <th>כמות</th>
              <th>סה"כ</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>כניסה רגילה</td>
              <td>₪{event.price.toFixed(2)}</td>
              <td>
                <button>-</button>
                <span>1</span>
                <button>+</button>
              </td>
              <td>₪{event.price.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>

        <button className="close-btn" onClick={onClose}>
          סגור
        </button>
        <button className="purchase-btn">רכישה</button>
      </div>
    </div>
  );
};

export default Popup;
