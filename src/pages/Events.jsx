import "./events.css"; // Make sure you import the correct CSS file
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@mui/material";

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [participatedEvents, setParticipatedEvents] = useState([]);
  const [showParticipants, setShowParticipants] = useState({});
  const [openPopup, setOpenPopup] = useState(false);
  const [currentEventId, setCurrentEventId] = useState(null);
  const [eventDetails, setEventDetails] = useState(null);
  const userId = localStorage.getItem("editor");

  useEffect(() => {
    const fetchEvents = async () => {
      alert(userId);
      try {
        const response = await axios.get("http://localhost:4000/api/events");
        setEvents(response.data);

        const participated =
          JSON.parse(localStorage.getItem("participatedEvents")) || [];
        setParticipatedEvents(participated);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };
    fetchEvents();
  }, []);

  const handleParticipate = async (eventId) => {
    try {
      const res = await axios.put(
        `http://localhost:4000/api/events/${eventId}`,
        { userId }
      );

      const updatedEvent = res.data;
      const newParticipatedEvents = [...participatedEvents, eventId];
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
      console.error("Error in addition to the event:", error);
    }
  };

  const handleNotParticipate = async (eventId) => {
    try {
      const res = await axios.put(
        `http://localhost:4000/api/events/${eventId}/remove-participant`, // Use the correct endpoint
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
      console.error("Error in removing from the event:", error);
    }
  };

  const openParticipantsPopup = (eventId) => {
    setCurrentEventId(eventId);
    setOpenPopup(true);
  };

  const openEventDetailsPopup = (event) => {
    setEventDetails(event);
    setOpenPopup(true);
  };

  const closePopup = () => {
    setOpenPopup(false);
  };

  return (
    <div>
      <h1>Events List</h1>
      <br />
      <ul>
        {events.map((event) => (
          <li key={event._id}>
            <h2>{event.eventName}</h2>
            <p>
              <strong>Place:</strong> {event.place}
            </p>
            <p>
              <strong>Age Range:</strong> {event.age[0]} - {event.age[1]}
            </p>
            <p>
              <strong>Date:</strong> {event.date}
            </p>
            <p>
              <strong>Time:</strong> {event.hour}
            </p>
            <p>
              <strong>Details:</strong> {event.details}
            </p>
            <p>
              <strong>Participants:</strong> {event.participants.length}
            </p>

            <div>
              <Button
                className="event-button"
                onClick={() => openParticipantsPopup(event._id)}
              >
                {showParticipants[event._id] ? "הסתר משתתפים" : "הצג משתתפים"}
              </Button>
            </div>

            <div>
              <Button
                className="event-button"
                onClick={() => openEventDetailsPopup(event)}
              >
                פרטים נוספים
              </Button>
            </div>

            <br />
            <div className="registerButton">
              <Button
                className="event-button"
                onClick={() => handleParticipate(event._id)}
              >
                אני רוצה להרשם
              </Button>
              <p>{event.participants.length} משתתפים</p>
            </div>

            {participatedEvents.includes(event._id) && (
              <div>
                <Button
                  className="event-button"
                  onClick={() => handleNotParticipate(event._id)}
                >
                  בטל הרשמה
                </Button>
              </div>
            )}
          </li>
        ))}
      </ul>

      {openPopup && eventDetails && (
        <div className="popup">
          <div className="popup-content">
            <span onClick={closePopup} className="close-button">
              &times;
            </span>
            <h2>Participants for Event</h2>
            <ul>
              {events
                .find((event) => event._id === currentEventId)
                ?.participants.map((participant, index) => (
                  <li key={index}>{participant.name}</li>
                ))}
            </ul>

            <h3>Details:</h3>
            <p>
              <strong>Age Range:</strong> {eventDetails.age[0]} -{" "}
              {eventDetails.age[1]}
            </p>
            <p>
              <strong>Details:</strong> {eventDetails.details}
            </p>
            <p>
              <strong>Gender:</strong> {eventDetails.gender}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventsPage;
