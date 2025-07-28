import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Button } from "@mui/material";
import "./MyProfile.css";
const API_BASE = process.env.REACT_APP_API || "http://localhost:4000";

const MyProfilePage = () => {
  const [user, setUser] = useState(null);
  const [editField, setEditField] = useState(null);

  const [newImage, setNewImage] = useState(null);
  const fileInputRef = useRef();

  // const userId = localStorage.getItem("editor");
  const storedUser = localStorage.getItem("editor");
  const userId = storedUser ? JSON.parse(storedUser).email : null;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          `${API_BASE}/api/users/findByEmail/${userId}`
        );
        setUser(response.data);
      } catch (error) {
        console.error("שגיאה בשליפת משתמש:", error);
      }
    };

    if (userId) {
      fetchUser();
    }
  }, [userId]);

  const calculateAge = (birthdate) => {
    const today = new Date();
    const birth = new Date(birthdate);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const handleFieldUpdate = async (field) => {
    try {
      const updateData = {
        [field]: user[field],
      };

      // אם משנים מייל, שולחים את המייל הישן כ-currentEmail
      if (field === "email") {
        updateData.currentEmail = userId; // המייל המקורי
        updateData.email = user[field]; // המייל החדש
      } else {
        updateData.email = userId; // המייל הנוכחי למציאת המשתמש
      }

      const response = await axios.put(
        `${API_BASE}/api/users/update`,
        updateData
      );
      setUser(response.data); // עדכון מצב הפרופיל עם הערכים החדשים

      // אם עדכנו מייל, צריך לעדכן גם את ה-localStorage
      if (field === "email") {
        const storedUser = localStorage.getItem("editor");
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          userData.email = response.data.email; // עדכון המייל ב-localStorage
          localStorage.setItem("editor", JSON.stringify(userData));
          console.log(
            "localStorage updated with new email:",
            response.data.email
          );
        }
      }

      setEditField(null); // סגירת מצב העריכה
      alert("השדה עודכן בהצלחה!");
    } catch (error) {
      console.error("שגיאה בעדכון השדה:", error);
      alert("שגיאה בעדכון השדה");
    }
  };
  const handleFileChange = (e) => {
    setNewImage(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!newImage) return alert("בחרי תמונה קודם");

    // המרה ל-base64
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const response = await axios.put(
          `${API_BASE}/api/users/upload-avatar`,
          {
            email: user.email,
            picture: reader.result,
          }
        );
        setUser((prev) => ({ ...prev, picture: response.data.pictureUrl }));
        setEditField(null);
        alert("התמונה הועלתה בהצלחה!");
      } catch (error) {
        console.error("שגיאה בהעלאת תמונה:", error);
        alert("שגיאה בהעלאת התמונה");
      }
    };
    reader.readAsDataURL(newImage);
  };

  if (!user) return <p>טוען פרטים...</p>;

  return (
    <div className="main-container">
      <div className="profile-container">
        <h2>הפרופיל שלי</h2>

        <div>
          <label className="label-bold-myprofile">תמונה:</label>
          {editField === "picture" ? (
            <>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileChange}
              />
              <Button onClick={handleUpload}>עדכן</Button>
            </>
          ) : (
            <>
              <div className="profile-image">
                {user.picture ? (
                  <img src={user.picture} alt="Profile Avatar" />
                ) : (
                  <p>אין תמונה</p>
                )}
              </div>
              <Button onClick={() => setEditField("picture")}>ערוך</Button>
            </>
          )}
        </div>

        <p>
          <strong className="label-bold-myprofile">שם:</strong> {user.userName}
        </p>
        <div>
          <label className="label-bold-myprofile">אימייל: </label>
          {editField === "email" ? (
            <>
              <input
                type="email"
                value={user.email}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
              />
              <Button onClick={() => handleFieldUpdate("email")}>עדכן</Button>
            </>
          ) : (
            <>
              <span>{user.email}</span>
              <Button onClick={() => setEditField("email")}>ערוך</Button>
            </>
          )}
        </div>
        <p>
          <strong className="label-bold-myprofile">תעודת זהות:</strong>{" "}
          {user.idnumber}
        </p>
        <p>
          <strong className="label-bold-myprofile">מגדר:</strong>{" "}
          {user.gender === "male"
            ? "זכר"
            : user.gender === "female"
            ? "נקבה"
            : "אחר"}
        </p>
        <div>
          <label className="label-bold-myprofile">כתובת: </label>
          {editField === "address" ? (
            <>
              <input
                type="text"
                value={user.address}
                onChange={(e) => setUser({ ...user, address: e.target.value })}
              />
              <Button onClick={() => handleFieldUpdate("address")}>עדכן</Button>
            </>
          ) : (
            <>
              <span>{user.address}</span>
              <Button onClick={() => setEditField("address")}>ערוך</Button>
            </>
          )}
        </div>
        <div>
          <label className="label-bold-myprofile">בית ספר: </label>
          {editField === "school" ? (
            <>
              <input
                type="text"
                value={user.school || ""}
                onChange={(e) => setUser({ ...user, school: e.target.value })}
              />
              <Button onClick={() => handleFieldUpdate("school")}>עדכן</Button>
            </>
          ) : (
            <>
              <span>{user.school || "לא תלמיד"}</span>
              <Button onClick={() => setEditField("school")}>ערוך</Button>
            </>
          )}
        </div>
        <p>
          <strong className="label-bold-myprofile">תאריך לידה:</strong>{" "}
          {new Date(user.birthdate).toLocaleDateString("he-IL")}
        </p>
        <p>
          <strong className="label-bold-myprofile">גיל:</strong>{" "}
          {calculateAge(user.birthdate)}
        </p>
      </div>
    </div>
  );
};

export default MyProfilePage;
