import React, { useState } from "react";
import "./donate.css";

const Donate = () => {
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("credit");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`תודה על התרומה של ₪${amount} באמצעות ${paymentMethod}!`);
    setAmount("");
    setMessage("");
    setPaymentMethod("credit");
  };

  return (
    <div className="donate-wrapper">
      <div className="donate-box">
        <h2>תמכו בפעילות שלנו 💖</h2>
        <p className="donate-subtext">
          כל תרומה עוזרת לנו להמשיך ולעשות טוב 💫
        </p>

        {/* ✅ תוספת חדשה - טקסט הסבר על חשיבות התרומה */}
        <p className="donate-description">
          בואו נעשה שינוי אמיתי.
          <br />
          עזרו לנו להילחם בתופעת החרם החברתי ולתת לכל ילד להרגיש שייך.
          <br />
          התרומה שלכם מאפשרת לנו לקיים פעילויות, סדנאות ואירועים שמחזקים ילדים
          ומעניקים להם תקווה.
          <br />
          כל תרומה – קטנה כגדולה – עושה הבדל גדול. תודה שאתם איתנו.
        </p>
        {/* ✅ סוף תוספת */}

        <form onSubmit={handleSubmit}>
          <label>סכום התרומה (₪)</label>
          <input
            type="number"
            placeholder="לדוג' 50"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />

          <label>בחר אמצעי תשלום</label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
          >
            <option value="credit">כרטיס אשראי 💳</option>
            <option value="paypal">PayPal 🅿️</option>
            <option value="bit">Bit 📱</option>
          </select>

          <label>הודעה אישית (אופציונלי)</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="רוצים לומר משהו? אנחנו קוראים הכל!"
          />

          <button type="submit">בצע תרומה ✅</button>
        </form>
      </div>
    </div>
  );
};

//   return (
//     <div className="donate-wrapper">
//       <div className="donate-box">
//         <h2>תמכו בפעילות שלנו 💖</h2>
//         <p className="donate-subtext">
//           כל תרומה עוזרת לנו להמשיך ולעשות טוב 💫
//         </p>

//         <form onSubmit={handleSubmit}>
//           <label>סכום התרומה (₪)</label>
//           <input
//             type="number"
//             placeholder="לדוג' 50"
//             value={amount}
//             onChange={(e) => setAmount(e.target.value)}
//             required
//           />

//           <label>בחר אמצעי תשלום</label>
//           <select
//             value={paymentMethod}
//             onChange={(e) => setPaymentMethod(e.target.value)}
//           >
//             <option value="credit">כרטיס אשראי 💳</option>
//             <option value="paypal">PayPal 🅿️</option>
//             <option value="bit">Bit 📱</option>
//           </select>

//           <label>הודעה אישית (אופציונלי)</label>
//           <textarea
//             value={message}
//             onChange={(e) => setMessage(e.target.value)}
//             placeholder="רוצים לומר משהו? אנחנו קוראים הכל!"
//           />

//           <button type="submit">בצע תרומה ✅</button>
//         </form>
//       </div>
//     </div>
//   );
// };

export default Donate;
