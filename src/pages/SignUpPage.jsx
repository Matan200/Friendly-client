import React, { useState } from "react";
import axios from "axios";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Tooltip,
  IconButton,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline"; // Import help icon
import "./signup.css";
const API_BASE = process.env.REACT_APP_API || "http://localhost:4000";

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    idnumber: "",
    birthdate: "",
    gender: "",
    address: "",
    school: "",
  });
  const [popupData, setPopupData] = useState({
    userName: "",
    password: "",
  }); // שדות לחלונית ה-Popup
  const avatarOptions = [
    "/images/avatar1.jpg",
    "/images/avatar2.jpg",
    "/images/avatar3.jpg",
    "/images/avatar4.jpg",
  ];
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [errors, setErrors] = useState({});
  const [isUnderage, setIsUnderage] = useState(false);
  const [showPopup, setShowPopup] = useState(false); // מצב להצגת ה-Popup
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    if (name === "birthdate") {
      const birth_date = new Date(value);
      const age = new Date().getFullYear() - birth_date.getFullYear();
      setIsUnderage(age < 18);
    }
  };

  const handlePopupChange = (e) => {
    const { name, value } = e.target;
    setPopupData({
      ...popupData,
      [name]: value,
    });
  };

  const validateFields = () => {
    const newErrors = {};
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.idnumber.trim()) newErrors.idnumber = "Id is required";
    else if (formData.idnumber.length !== 9 || isNaN(formData.idnumber)) {
      newErrors.idnumber = "תעודת זהות חייבת להכיל בדיוק 9 ספרות";
    }

    // if (!popupData.password.trim()) {
    //   newErrors.password = "Password is required";
    // } else if (popupData.password.length < 9 || isNaN(popupData.password)) {
    //   newErrors.password = "סיסמא חייבת להכיל לפחות 9 ספרות";
    // }
    if (!formData.gender.trim()) newErrors.gender = "Gender is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.birthdate.trim())
      newErrors.birthdate = "Birthdate is required";
    if (isUnderage && !formData.school.trim())
      newErrors.school = "School name is required for underage users";
    if (!acceptTerms) newErrors.acceptTerms = "You must accept the terms";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // מחזיר true אם אין שגיאות
  };

  const handleCreateUser = async () => {
    if (!popupData.userName.trim() || !popupData.password.trim()) {
      setErrors({
        userName: !popupData.userName.trim() ? "User Name is required" : "",
        password: !popupData.password.trim() ? "Password is required" : "",
      });
      return; // עצור את הפעולה אם אחד מהשדות ריקים
    }

    // בדיקה אם הסיסמא עומדת בדרישות
    if (popupData.password.length < 9 || isNaN(popupData.password)) {
      setErrors({
        password: "סיסמא חייבת להכיל לפחות 9 ספרות",
      });
      return; // עצור את הפעולה אם הסיסמא לא עומדת בדרישות
    }

    // if (!popupData.userName.trim() || !popupData.password.trim()) {
    //   setErrors({
    //     userName: !popupData.userName.trim() ? "User Name is required" : "",
    //     password: !popupData.password.trim() ? "Password is required" : "",
    //   });
    //   return;
    // }

    try {
      const res = await axios.post(`${API_BASE}/api/users/signup`, {
        ...formData,
        ...popupData,
        picture: uploadedImage || selectedAvatar,
      });
      if (res.data.existMail) {
        setErrors({ email: res.data.message });
      } else {
        alert("User successfully created!");
        const age =
          new Date().getFullYear() - new Date(formData.birthdate).getFullYear();
        const userType = age < 18 ? "student" : "adult";
        const userData = {
          email: formData.email,
          userType: userType,
        };

        localStorage.setItem("editor", JSON.stringify(userData));
        // localStorage.setItem("editor", formData.email, userType);
        navigate("/posts");
      }
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateFields()) {
      setShowPopup(true);
    }
  };

  const handlePopupSubmit = () => {
    handleCreateUser();

    //setShowPopup(false);
  };
  const handleAvatarSelect = (avatar) => {
    setSelectedAvatar(avatar);
    setUploadedImage(null); // reset if previously uploaded
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result);
        setSelectedAvatar(null); // reset if previously selected avatar
      };
      reader.readAsDataURL(file);
    }
  };
  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <div className="avatar-section">
          <p>בחר תמונה אישית או אווטאר:</p>

          <input type="file" accept="image/*" onChange={handleImageUpload} />

          <div className="avatar-options">
            {avatarOptions.map((avatar, index) => (
              <img
                key={index}
                src={avatar}
                alt={`avatar-${index}`}
                className={`avatar-img ${
                  selectedAvatar === avatar ? "selected" : ""
                }`}
                onClick={() => handleAvatarSelect(avatar)}
              />
            ))}
          </div>

          {/* Show preview */}
          {uploadedImage && (
            <div className="preview-img">
              <p>תמונה שהועלתה:</p>
              <img src={uploadedImage} alt="uploaded" />
            </div>
          )}
          {selectedAvatar && (
            <div className="preview-img">
              <p>אווטאר שנבחר:</p>
              <img src={selectedAvatar} alt="selected-avatar" />
            </div>
          )}
        </div>
        <h1>הרשמה</h1>
        <div className="input-box">
          <span>אימייל</span>
          <div className="input-with-tooltip">
            <input
              type="text"
              name="email"
              placeholder="הכנס את האימייל שלך"
              value={formData.email}
              onChange={handleChange}
            />
            <Tooltip title="בבקשה הכנס אימייל תקין" arrow>
              <IconButton>
                <HelpOutlineIcon />
              </IconButton>
            </Tooltip>
          </div>
          {errors.email && <p className="error">{errors.email}</p>}
        </div>

        <div className="input-box">
          <span>תעודת זהותd</span>
          <div className="input-with-tooltip">
            <input
              type="text"
              name="idnumber"
              placeholder="הכנס את המספר זהות שלך"
              value={formData.idnumber}
              onChange={handleChange}
            />
            <Tooltip title="בבקשה הכנס 9 ספרות תעודת הזהות שלך" arrow>
              <IconButton>
                <HelpOutlineIcon />
              </IconButton>
            </Tooltip>
          </div>
          {errors.idnumber && <p className="error">{errors.idnumber}</p>}
        </div>

        <div className="gender-radio">
          <span>מגדר</span>
          <label>
            <input
              type="radio"
              name="gender"
              value="male"
              checked={formData.gender === "male"}
              onChange={handleChange}
            />
            זכר
          </label>
          <label>
            <input
              type="radio"
              name="gender"
              value="female"
              checked={formData.gender === "female"}
              onChange={handleChange}
            />
            נקבה
          </label>
          <label>
            <input
              type="radio"
              name="gender"
              value="other"
              checked={formData.gender === "other"}
              onChange={handleChange}
            />
            אחר
          </label>
          {errors.gender && <p className="error">{errors.gender}</p>}
        </div>

        <div className="input-box">
          <span>כתובת</span>
          <div className="input-with-tooltip">
            <input
              type="text"
              name="address"
              placeholder="Enter your address"
              value={formData.address}
              onChange={handleChange}
            />
            <Tooltip title="בבקשה הכנס את כתובת המגורים" arrow>
              <IconButton>
                <HelpOutlineIcon />
              </IconButton>
            </Tooltip>
          </div>
          {errors.address && <p className="error">{errors.address}</p>}
        </div>

        <div className="input-box">
          <span>תאריך לידה</span>
          <input
            type="date"
            name="birthdate"
            value={formData.birthdate}
            onChange={handleChange}
          />
          {errors.birthdate && <p className="error">{errors.birthdate}</p>}
        </div>

        {isUnderage && (
          <div className="input-box">
            <span>בית ספר</span>
            <input
              type="text"
              name="school"
              placeholder="הכנס את בית הספר שלך"
              value={formData.school}
              onChange={handleChange}
            />
            {errors.school && <p className="error">{errors.school}</p>}
          </div>
        )}

        <div className="terms-container">
          <label htmlFor="terms">
            <div className="terms-box">
              <p>
                כללי – בהרשמתך למערכת, הנך מסכים לתנאי התקנון ומתחייב לפעול
                בהתאם לכללי השימוש.
              </p>
            </div>
          </label>
          <div className="accept-terms">
            <input
              type="checkbox"
              id="terms"
              checked={acceptTerms}
              onChange={(e) => setAcceptTerms(e.target.checked)}
            />
            <label htmlFor="terms">מאשר/ת שקראתי</label>
            {errors.acceptTerms && (
              <p className="error">{errors.acceptTerms}</p>
            )}
          </div>
        </div>

        <Button type="submit" className="btn">
          רשום אותי
        </Button>
      </form>

      {/* Popup Dialog */}
      <Dialog open={showPopup} onClose={() => setShowPopup(false)}>
        <DialogTitle>Complete Registration</DialogTitle>
        <DialogContent>
          <TextField
            label="שם משתמש"
            name="userName"
            fullWidth
            value={popupData.userName}
            onChange={handlePopupChange}
            // error={!!errors.userName}
            helperText={errors.userName}
            margin="dense"
          />
          <TextField
            label="סיסמא"
            name="password"
            type="password"
            fullWidth
            value={popupData.password}
            onChange={handlePopupChange}
            // error={!!errors.password}
            helperText={errors.password}
            margin="dense"
          />
          {errors.password && <p className="error">{errors.password}</p>}
        </DialogContent>
        <DialogActions>
          <Button onClick={handlePopupSubmit} color="primary">
            Submit
          </Button>
          <Button onClick={() => setShowPopup(false)} color="secondary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default SignUpPage;
