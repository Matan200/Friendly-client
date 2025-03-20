import "./events.css"; 
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@mui/material";
import Popup from "./Popup"; // ייבוא הפופאפ

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [popupOpen, setPopupOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [participatedEvents, setParticipatedEvents] = useState([]);
  const [expandedEvent, setExpandedEvent] = useState(null);
  const userId = localStorage.getItem("editor");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/events");

        console.log("אירועים שהתקבלו מהשרת:", response.data); // בדיקה

        if (!response.data || response.data.length === 0) {
          console.warn("⚠ לא נמצאו אירועים בשרת!");
        }

        // מיון האירועים לפי תאריך
        const sortedEvents = response.data
          .filter((event) => new Date(event.date) >= new Date()) // מסנן אירועים שהתאריך שלהם עבר
          .sort((a, b) => new Date(a.date) - new Date(b.date));

        setEvents(sortedEvents);

        const participated =
          JSON.parse(localStorage.getItem("participatedEvents")) || [];
        setParticipatedEvents(participated);
      } catch (error) {
        console.error("❌ שגיאה בטעינת האירועים:", error);
      }
    };
    fetchEvents();
  }, []);

  const handleParticipate = (event) => {
    setSelectedEvent(event);
    setPopupOpen(true);
  };

  const handleNotParticipate = async (eventId) => {
    try {
      const res = await axios.put(
        `http://localhost:4000/api/events/${eventId}/remove-participant`,
        { userId }
      );

      const updatedEvent = res.data;
      const newParticipatedEvents = participatedEvents.filter(
        (id) => id !== eventId
      );
      localStorage.setItem(
        "participatedEvents",
        JSON.stringify(newParticipatedEvents)
      );
      setParticipatedEvents(newParticipatedEvents);

      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event._id === updatedEvent._id ? updatedEvent : event
        )
      );
    } catch (error) {
      console.error("שגיאה בביטול ההרשמה:", error);
    }
  };

  const toggleDetails = (eventId) => {
    setExpandedEvent(expandedEvent === eventId ? null : eventId);
  };

  return (
    <div className="events-container">
      <h1>אירועים</h1>
      <p>מצפים לראות אותך שם!</p>

      {/* אם אין אירועים כלל, הצגת הודעה למשתמש */}
      {events.length === 0 ? (
        <p style={{ textAlign: "center", fontSize: "18px", color: "red" }}>
          ❌ אין כרגע אירועים להצגה.
        </p>
      ) : (
        <ul className="events-list">
          {events.map((event) => (
            <li key={event._id} className="event-item">
              <div className="event-header">
                <div className="event-info">
                  <h2>{event.eventName}</h2>
                  <p>📍 {event.place}</p>
                  <p>🕒 {event.hour} | 📅 {event.date}</p>
                  <Button
                    className="event-button"
                    onClick={() => toggleDetails(event._id)}
                  >
                    {expandedEvent === event._id ? "סגור" : "פרטים נוספים"}
                  </Button>
                </div>
              </div>

              {expandedEvent === event._id && (
                <div className="event-details">
                  <p><strong>🧑‍🤝‍🧑 גילאים:</strong> {event.age[0]} - {event.age[1]}</p>
                  <p><strong>👥 מגדר:</strong> {event.gender}</p>
                  <p><strong>📜 פרטים נוספים:</strong> {event.details}</p>
                </div>
              )}

              <Button
                className="event-button"
                onClick={() => handleParticipate(event)}
              >
                אני רוצה להרשם
              </Button>
              <p>{event.participants.length} משתתפים</p>

              {participatedEvents.includes(event._id) && (
                <Button
                  className="event-button cancel"
                  onClick={() => handleNotParticipate(event._id)}
                >
                  בטל הרשמה
                </Button>
              )}
            </li>
          ))}
        </ul>
      )}

      {/* הצגת הפופאפ עם הנתונים של האירוע הנבחר */}
      {popupOpen && <Popup event={selectedEvent} onClose={() => setPopupOpen(false)} />}
    </div>
  );
};

export default EventsPage;
