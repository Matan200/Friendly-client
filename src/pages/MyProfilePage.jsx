import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@mui/material";
import "./MyProfile.css";
const API_BASE = process.env.REACT_APP_API || "http://localhost:4000";

const MyProfilePage = () => {
  const [user, setUser] = useState(null);
  //const email = localStorage.getItem("editor");
  //const userId = localStorage.getItem("editor");
  const userId = localStorage.getItem("editor");

//alert(userId);
  useEffect(() => {
    const fetchUser = async () => {
      alert(userId);

      try {
      //alert(userId);
        const response = await axios.get(
          `${API_BASE}/api/users/findByEmail/${userId}`
        );
       // alert(response.data.address);
        setUser(response.data);
      } catch (error) {
        console.error("שגיאה בשליפת משתמש:", error);
      }
    };

    if (userId) {
      fetchUser();
    }
   
  }, [userId]);

  if (!user) return <p>טוען פרטים...</p>;

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

  return (
    <div className="main-container">

    <div className="profile-container">
      <h2>הפרופיל שלי</h2>
      {user.picture && (
      <div className="profile-image">
        <img src={user.picture} alt="Profile Avatar" />
      </div>
    )}
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
