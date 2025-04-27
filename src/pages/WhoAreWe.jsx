import React from "react";
import "./WhoAreWe.css";

const Whoarewe = () => {
  return (
    <div className="who-container">
      <div className="who-image">
        <p>😀 😃 😄 😁 😆 😊 🙂</p>
        
      </div>
      <div className="who-text">
        <h2>מי אנחנו ?</h2>
        <div className="underline"></div>
        <p>
          אנחנו אתר חברתי ראשון מסוגו בארץ! <br />
          כאן תוכל פשוט להיות אתה :) <br />
          להכיר חברים חדשים, לשתף ולתת יד לאחר
        </p>
      </div>
    </div>
  );
};

export default Whoarewe;
