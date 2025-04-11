import React from "react";
import "./testimonials.css";

const testimonials = [
  {
    name: "איתי שלמה",
    role: "בוגר קהילה",
    text: "תודה לקהילה שנתנה לי את המקום להיות בו מי שאני. בזכות האתר הרשמי הכרתי הרבה חברים שהרגישו כמוני",
    image: "https://cdn.pixabay.com/photo/2023/06/27/07/42/ai-generated-8091943_1280.jpg",
  },
  {
    name: "נועה גלעדי",
    role: "בוגרת קהילה",
    text: "בזכות הקהילה באתר הרגשתי שווה כמו כולם והיום אני כבר לא מתביישת",
    image: "https://cdn.pixabay.com/photo/2023/10/23/13/05/woman-8335670_1280.jpg",
  },
];

const TestimonialsPage = () => {
  return (
    <div className="testimonials-container">
      {testimonials.map((t, index) => (
        <div key={index} className="testimonial-card">
          <img src={t.image} alt={t.name} />
          <h3>{t.name}</h3>
          <p className="role">{t.role}</p>
          <p className="text">{t.text}</p>
        </div>
      ))}
    </div>
  );
};

export default TestimonialsPage;
