import React from "react";
import "./testimonials.css";

const testimonials = [
  {
    name: "מתן לוין",
    role: "בוגר קהילה",
    text: "תודה לקהילה שנתנה לי את המקום להיות בו מי שאני. בזכות האתר הרשמי הכרתי הרבה חברים שהרגישו כמוני",
    image: "/images/matanphoto.jpeg",
  },
  {
    name: "בר גלעדי",
    role: " בוגרת קהילה",
    text: "בזכות הקהילה באתר הרגשתי שווה כמו כולם והיום אני כבר לא מתביישת",
    image: "/images/avatar1.jpg",
  },
  {
    name: "בן עמר",
    role: "בוגר קהילה",
    text: "זכיתי להיות מהבוגרים של מקיף א רעננה, ולהשפיע על ילדים שצריכים את העזרה כמו שאני הייתי צריך!",
    image: "/images/avatar4.jpg",
  },
];

const TestimonialsPage = () => {
  return (
    <div className="testimonials-container">
      {testimonials.map((t, index) => (
        <div key={index} className="testimonial-card">
          <img src={t.image} alt={t.name} />
          <h3>{t.name}</h3>
          <p className="name">{t.name}</p>
          <p className="role">{t.role}</p>
          <p className="text">{t.text}</p>
        </div>
      ))}
    </div>
  );
};

export default TestimonialsPage;
