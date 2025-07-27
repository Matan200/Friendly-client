import "./events.css";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@mui/material";
const API_BASE = process.env.REACT_APP_API || "http://localhost:4000";

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [userObjectId, setUserObjectId] = useState("");
  const [expandedEvent, setExpandedEvent] = useState(null);
  // const userEmail = localStorage.getItem("editor");
  const storedUser = localStorage.getItem("editor");
  const userEmail = storedUser ? JSON.parse(storedUser).email : null;
  const usertype = storedUser ? JSON.parse(storedUser).userType : null;

  // סינון
  const [filterCity, setFilterCity] = useState("");
  const [filterGender, setFilterGender] = useState("");
  const [filterMinAge, setFilterMinAge] = useState("");
  const [filterMaxAge, setFilterMaxAge] = useState("");

  useEffect(() => {
    const fetchUserAndEvents = async () => {
      try {
        const userRes = await axios.get(
          `${API_BASE}/api/users/findByEmail/${userEmail}`
        );
        setUserObjectId(userRes.data._id);
        if (usertype !== "student") {
          setEvents([]); // לא מציג אירועים
          setFilteredEvents([]);
          return;
        }
        const eventsRes = await axios.get(`${API_BASE}/api/events`);
        setEvents(eventsRes.data);
        setFilteredEvents(eventsRes.data);
      } catch (error) {
        console.error("שגיאה בטעינת הנתונים:", error);
      }
    };

    fetchUserAndEvents();
  }, [userEmail]);

  const handleParticipate = async (eventId) => {
    try {
      const res = await axios.put(`${API_BASE}/api/events/${eventId}`, {
        userId: userEmail,
      });
      updateEventInList(res.data);
    } catch (error) {
      console.error("שגיאה בהרשמה:", error);
    }
  };

  const handleNotParticipate = async (eventId) => {
    try {
      const res = await axios.put(
        `${API_BASE}/api/events/${eventId}/remove-participant`,
        { userId: userEmail }
      );
      updateEventInList(res.data);
    } catch (error) {
      console.error("שגיאה בביטול הרשמה:", error);
    }
  };

  const updateEventInList = (updatedEvent) => {
    setEvents((prevEvents) =>
      prevEvents.map((event) =>
        event._id === updatedEvent._id ? updatedEvent : event
      )
    );
    setFilteredEvents((prevEvents) =>
      prevEvents.map((event) =>
        event._id === updatedEvent._id ? updatedEvent : event
      )
    );
  };

  const isUserParticipating = (event) => {
    return event.participants.includes(userObjectId);
  };

  const toggleDetails = (eventId) => {
    setExpandedEvent((prev) => (prev === eventId ? null : eventId));
  };

  const applyFilters = () => {
    let filtered = [...events];

    if (filterCity.trim()) {
      filtered = filtered.filter((event) =>
        event.place.toLowerCase().includes(filterCity.toLowerCase())
      );
    }

    if (filterGender.trim()) {
      filtered = filtered.filter(
        (event) => event.gender.toLowerCase() === filterGender.toLowerCase()
      );
    }

    if (filterMinAge && filterMaxAge) {
      filtered = filtered.filter((event) => {
        const [minAge, maxAge] = event.age;
        return (
          parseInt(minAge) >= parseInt(filterMinAge) &&
          parseInt(maxAge) <= parseInt(filterMaxAge)
        );
      });
    }

    setFilteredEvents(filtered);
  };

  const resetFilters = () => {
    setFilterCity("");
    setFilterGender("");
    setFilterMinAge("");
    setFilterMaxAge("");
    setFilteredEvents(events);
  };

  return (
    <div className="events-container">
      <h1>אירועים</h1>

      <div className="filters">
        <input
          type="text"
          placeholder="מיקום"
          value={filterCity}
          onChange={(e) => setFilterCity(e.target.value)}
        />
        <select
          value={filterGender}
          onChange={(e) => setFilterGender(e.target.value)}
        >
          <option value="">בחר מגדר</option>
          <option value="בנים">בנים</option>
          <option value="בנות">בנות</option>
          <option value="אחר">אחר</option>
          <option value="כולם">כולם</option>
        </select>
        <input
          type="number"
          placeholder="גיל מינימלי"
          value={filterMinAge}
          onChange={(e) => setFilterMinAge(e.target.value)}
        />
        <input
          type="number"
          placeholder="גיל מקסימלי"
          value={filterMaxAge}
          onChange={(e) => setFilterMaxAge(e.target.value)}
        />
        <Button variant="contained" onClick={applyFilters}>
          סנן
        </Button>
        <Button variant="outlined" onClick={resetFilters}>
          איפוס
        </Button>
      </div>

      {filteredEvents.length === 0 ? (
        <p style={{ textAlign: "center", fontSize: "18px", color: "red" }}>
          ❌ אין כרגע אירועים להצגה.
        </p>
      ) : (
        <ul className="events-list">
          {filteredEvents.map((event) => (
            <li key={event._id} className="event-item">
              <div className="event-header">
                <h2>{event.eventName}</h2>
                <p>
                  📍{" "}
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      event.place
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: "inherit",
                      textDecoration: "none",
                      fontWeight: "bold",
                    }}
                  >
                    {event.place}
                  </a>
                </p>

                <p>
                  🕒 {event.hour} | 📅 {event.date}
                </p>

                <Button
                  className="event-button"
                  onClick={() => toggleDetails(event._id)}
                >
                  {expandedEvent === event._id ? "סגור" : "פרטים נוספים"}
                </Button>

                {expandedEvent === event._id && (
                  <div className="event-details">
                    <p>
                      <strong>🧑‍🤝‍🧑 גילאים:</strong> {event.age[0]} -{" "}
                      {event.age[1]}
                    </p>
                    <p>
                      <strong>👥 מגדר:</strong> {event.gender}
                    </p>
                    <p>
                      <strong>📜 פרטים נוספים:</strong> {event.details}
                    </p>
                  </div>
                )}

                <div className="register-button">
                  {isUserParticipating(event) ? (
                    <Button
                      className="event-button cancel"
                      onClick={() => handleNotParticipate(event._id)}
                    >
                      בטל הרשמה
                    </Button>
                  ) : (
                    <Button
                      className="event-button"
                      onClick={() => handleParticipate(event._id)}
                    >
                      אני רוצה להרשם
                    </Button>
                  )}
                  <p>{event.participants.length} משתתפים</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default EventsPage;
