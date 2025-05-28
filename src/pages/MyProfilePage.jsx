// הוספנו useRef ו־FormData
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Button } from "@mui/material";
import "./MyProfile.css";
const API_BASE = process.env.REACT_APP_API || "http://localhost:4000";

const MyProfilePage = () => {
  const [user, setUser] = useState(null);
  const [newImage, setNewImage] = useState(null);
  const fileInputRef = useRef();

  const userId = localStorage.getItem("editor");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`${API_BASE}/api/users/findByEmail/${userId}`);
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

  const handleFileChange = (e) => {
    setNewImage(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!newImage) return alert("בחרי תמונה קודם");
    const formData = new FormData();
    formData.append("email", user.email);
    formData.append("avatar", newImage);

    try {
      const response = await axios.put(`${API_BASE}/api/users/upload-avatar`, formData);
      setUser((prev) => ({ ...prev, picture: response.data.newAvatar }));
      alert("התמונה הועלתה בהצלחה!");
    } catch (error) {
      console.error("שגיאה בהעלאת תמונה:", error);
    }
  };

  if (!user) return <p>טוען פרטים...</p>;

  return (
    <div className="main-container">
      <div className="profile-container">
        <h2>הפרופיל שלי</h2>

        <div className="profile-image">
          {user.picture ? (
            <img src={user.picture} alt="Profile Avatar" />
          ) : (
            <p>אין תמונה</p>
          )}
        </div>

        {/* העלאת תמונה */}
        <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} />
        <Button variant="outlined" onClick={handleUpload}>
          עדכן תמונה
        </Button>

        <p><strong>שם:</strong> {user.userName}</p>
        <p><strong>אימייל:</strong> {user.email}</p>
        <p><strong>תעודת זהות:</strong> {user.idnumber}</p>
        <p><strong>מגדר:</strong> {user.gender}</p>
        <p><strong>כתובת:</strong> {user.address}</p>
        <p><strong>בית ספר:</strong> {user.school || "לא תלמיד"}</p>
        <p><strong>תאריך לידה:</strong> {new Date(user.birthdate).toLocaleDateString("he-IL")}</p>
        <p><strong>גיל:</strong> {calculateAge(user.birthdate)}</p>
      </div>
    </div>
  );
};

export default MyProfilePage;
