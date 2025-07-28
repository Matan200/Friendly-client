import React, { useState } from "react";
import axios from "axios";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Box,
  Alert,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  Grid,
  Paper,
  Divider,
  IconButton,
  Tooltip,
} from "@mui/material";
import { useNavigate, Link } from "react-router-dom";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
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
  });
  const avatarOptions = [
    "/images/avatar1.jpg",
    "/images/avatar2.jpg",
    "/images/avatar3.jpg",
    "/images/avatar4.jpg",
  ];
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [errors, setErrors] = useState({});
  const [isUnderage, setIsUnderage] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
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
    if (!formData.email.trim()) newErrors.email = "אימייל חובה";
    if (!formData.idnumber.trim()) newErrors.idnumber = "תעודת זהות חובה";
    else if (formData.idnumber.length !== 9 || isNaN(formData.idnumber)) {
      newErrors.idnumber = "תעודת זהות חייבת להכיל בדיוק 9 ספרות";
    }
    if (!formData.gender.trim()) newErrors.gender = "מגדר חובה";
    if (!formData.address.trim()) newErrors.address = "כתובת חובה";
    if (!formData.birthdate.trim()) newErrors.birthdate = "תאריך לידה חובה";
    if (isUnderage && !formData.school.trim())
      newErrors.school = "שם בית ספר חובה למשתמשים מתחת לגיל 18";
    if (!acceptTerms) newErrors.acceptTerms = "חובה לאשר את התנאים";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateUser = async () => {
    if (!popupData.userName.trim() || !popupData.password.trim()) {
      setErrors({
        userName: !popupData.userName.trim() ? "שם משתמש חובה" : "",
        password: !popupData.password.trim() ? "סיסמה חובה" : "",
      });
      return;
    }

    if (popupData.password.length < 9 || isNaN(popupData.password)) {
      setErrors({
        password: "סיסמא חייבת להכיל לפחות 9 ספרות",
      });
      return;
    }

    try {
      const res = await axios.post(`${API_BASE}/api/users/signup`, {
        ...formData,
        ...popupData,
        picture: uploadedImage || selectedAvatar,
      });
      if (res.data.existMail) {
        setErrors({ email: res.data.message });
      } else if (res.data.existId) {
        setErrors({ idnumber: res.data.message });
      } else {
        // alert("משתמש נוצר בהצלחה!");
        const age =
          new Date().getFullYear() - new Date(formData.birthdate).getFullYear();
        const userType = age < 18 ? "student" : "adult";
        const userData = {
          email: formData.email,
          userType: userType,
        };
        localStorage.setItem("editor", JSON.stringify(userData));
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
    const isMainFormValid = validateFields();
    const popupErrors = {};
    if (!popupData.userName.trim()) {
      popupErrors.userName = "שם משתמש חובה";
    }
    if (!popupData.password.trim()) {
      popupErrors.password = "סיסמה חובה";
    } else if (popupData.password.length < 9 || isNaN(popupData.password)) {
      popupErrors.password = "סיסמא חייבת להכיל לפחות 9 ספרות";
    }

    if (Object.keys(popupErrors).length > 0 || !isMainFormValid) {
      setErrors({ ...errors, ...popupErrors });
      return;
    }

    setShowPopup(false);
    handleCreateUser();
  };

  const handleAvatarSelect = (avatar) => {
    setSelectedAvatar(avatar);
    setUploadedImage(null);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result);
        setSelectedAvatar(null);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="signup-page">
      {/* כותרת ראשית זהה לדף התחברות */}
      <Box
        className="signup-page-header"
        sx={{
          textAlign: "center",
          marginBottom: "-35px",
          marginTop: "-20px",
          padding: 3,
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.08) 100%)",
          backdropFilter: "blur(2px)",
          borderRadius: 3,
          border: "1px solid rgba(255,255,255,0.3)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
        }}
      >
        <Typography
          variant="h1"
          component="h1"
          sx={{
            fontSize: { xs: "3rem", md: "4rem" },
            fontWeight: "bold",
            color: "#ffffff",
            textShadow: "3px 3px 6px rgba(0,0,0,0.5)",
            letterSpacing: 2,
            margin: 0,
            filter: "none",
          }}
        >
          FRIENDLY ✨
        </Typography>
        <Typography
          variant="h5"
          sx={{
            color: "rgba(255,255,255,0.9)",
            fontWeight: 300,
            marginTop: 1,
            textShadow: "1px 1px 2px rgba(0,0,0,0.2)",
          }}
        >
          חברים אמיתיים
        </Typography>
      </Box>

      {/* קונטיינר הטופס */}
      <div className="container">
        <Paper
          elevation={20}
          sx={{
            padding: 4,
            borderRadius: 4,
            background: "rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
          }}
        >
          {/* כותרת הטופס */}
          <Box sx={{ textAlign: "center", marginBottom: 2 }}>
            <Typography
              variant="h4"
              component="h2"
              sx={{
                fontWeight: "bold",
                color: "#333",
                marginBottom: 1,
                fontSize: { xs: "1.5rem", md: "2rem" },
              }}
            >
              איזה כיף לראות אותך כאן! 🎉
            </Typography>
            <Typography
              variant="h5"
              component="h2"
              sx={{
                color: "#555",
                marginBottom: 1.5,
                fontSize: { xs: "1.2rem", md: "1.5rem" },
              }}
            >
              בואו ניצור עולם יותר טוב ביחד
            </Typography>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                color: "#333",
                marginBottom: 1,
              }}
            >
              הרשמה למערכת
            </Typography>
          </Box>

          {/* טופס הרשמה */}
          <Box component="form" onSubmit={handleSubmit}>
            {/* בחירת אווטאר */}
            <Box sx={{ marginBottom: 3 }}>
              <Typography
                variant="h6"
                sx={{
                  color: "#333",
                  marginBottom: 2,
                  textAlign: "center",
                  fontWeight: 600,
                }}
              >
                📸 בחר תמונה אישית או אווטאר
              </Typography>

              <Box sx={{ textAlign: "center", marginBottom: 2 }}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{
                    padding: "8px 12px",
                    border: "2px solid #ddd",
                    borderRadius: "8px",
                    backgroundColor: "#f9f9f9",
                    fontSize: "14px",
                    cursor: "pointer",
                  }}
                />
              </Box>

              <Grid
                container
                spacing={2}
                justifyContent="center"
                sx={{ marginBottom: 2 }}
              >
                {avatarOptions.map((avatar, index) => (
                  <Grid item key={index}>
                    <Box
                      component="img"
                      src={avatar}
                      alt={`avatar-${index}`}
                      onClick={() => handleAvatarSelect(avatar)}
                      sx={{
                        width: 70,
                        height: 70,
                        borderRadius: "50%",
                        cursor: "pointer",
                        border:
                          selectedAvatar === avatar
                            ? "3px solid #1976d2"
                            : "2px solid #ddd",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          transform: "scale(1.1)",
                          boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                        },
                      }}
                    />
                  </Grid>
                ))}
              </Grid>

              {/* תצוגה מקדימה */}
              {(uploadedImage || selectedAvatar) && (
                <Box sx={{ textAlign: "center", marginTop: 2 }}>
                  <Typography
                    variant="body2"
                    sx={{ color: "#333", marginBottom: 1, fontWeight: 500 }}
                  >
                    {uploadedImage ? "תמונה שהועלתה:" : "אווטאר שנבחר:"}
                  </Typography>
                  <Box
                    component="img"
                    src={uploadedImage || selectedAvatar}
                    alt="preview"
                    sx={{
                      width: 100,
                      height: 100,
                      borderRadius: "50%",
                      border: "3px solid #1976d2",
                      boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                    }}
                  />
                </Box>
              )}
            </Box>

            <Divider sx={{ marginY: 3, backgroundColor: "#ddd" }} />

            {/* שדות הטופס */}
            <Grid container spacing={3}>
              {/* אימייל */}
              <Grid item xs={12} md={6}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <TextField
                    fullWidth
                    label="כתובת אימייל"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    variant="outlined"
                    required
                    error={!!errors.email}
                    helperText={errors.email}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                        background: "rgba(255, 255, 255, 0.95)",
                        "& fieldset": {
                          borderColor: "#ddd",
                        },
                        "&:hover fieldset": {
                          borderColor: "#1976d2",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "#1976d2",
                        },
                      },
                      "& .MuiInputLabel-root": {
                        color: "rgba(0, 0, 0, 0.7)",
                      },
                    }}
                  />
                  <Tooltip title="בבקשה הכנס אימייל תקין" arrow>
                    <IconButton sx={{ color: "#666" }}>
                      <HelpOutlineIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Grid>

              {/* תעודת זהות */}
              <Grid item xs={12} md={6}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <TextField
                    fullWidth
                    label="תעודת זהות"
                    name="idnumber"
                    value={formData.idnumber}
                    onChange={handleChange}
                    variant="outlined"
                    required
                    error={!!errors.idnumber}
                    helperText={errors.idnumber}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                        background: "rgba(255, 255, 255, 0.95)",
                        "& fieldset": {
                          borderColor: "#ddd",
                        },
                        "&:hover fieldset": {
                          borderColor: "#1976d2",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "#1976d2",
                        },
                      },
                      "& .MuiInputLabel-root": {
                        color: "rgba(0, 0, 0, 0.7)",
                      },
                    }}
                  />
                  <Tooltip title="בבקשה הכנס 9 ספרות תעודת הזהות שלך" arrow>
                    <IconButton sx={{ color: "#666" }}>
                      <HelpOutlineIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Grid>

              {/* כתובת */}
              <Grid item xs={12} md={6}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <TextField
                    fullWidth
                    label="כתובת מגורים"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    variant="outlined"
                    required
                    error={!!errors.address}
                    helperText={errors.address}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                        background: "rgba(255, 255, 255, 0.95)",
                        "& fieldset": {
                          borderColor: "#ddd",
                        },
                        "&:hover fieldset": {
                          borderColor: "#1976d2",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "#1976d2",
                        },
                      },
                      "& .MuiInputLabel-root": {
                        color: "rgba(0, 0, 0, 0.7)",
                      },
                    }}
                  />
                  <Tooltip title="בבקשה הכנס את כתובת המגורים" arrow>
                    <IconButton sx={{ color: "#666" }}>
                      <HelpOutlineIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Grid>

              {/* תאריך לידה */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="תאריך לידה"
                  name="birthdate"
                  type="date"
                  value={formData.birthdate}
                  onChange={handleChange}
                  variant="outlined"
                  required
                  error={!!errors.birthdate}
                  helperText={errors.birthdate}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      background: "rgba(255, 255, 255, 0.95)",
                      "& fieldset": {
                        borderColor: "#ddd",
                      },
                      "&:hover fieldset": {
                        borderColor: "#1976d2",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#1976d2",
                      },
                    },
                    "& .MuiInputLabel-root": {
                      color: "rgba(0, 0, 0, 0.7)",
                    },
                  }}
                />
              </Grid>

              {/* בית ספר (אם קטין) */}
              {isUnderage && (
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="בית ספר"
                    name="school"
                    value={formData.school}
                    onChange={handleChange}
                    variant="outlined"
                    required
                    error={!!errors.school}
                    helperText={errors.school}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                        background: "rgba(255, 255, 255, 0.95)",
                        "& fieldset": {
                          borderColor: "#ddd",
                        },
                        "&:hover fieldset": {
                          borderColor: "#1976d2",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "#1976d2",
                        },
                      },
                      "& .MuiInputLabel-root": {
                        color: "rgba(0, 0, 0, 0.7)",
                      },
                    }}
                  />
                </Grid>
              )}

              {/* מגדר */}
              <Grid item xs={12}>
                <FormControl component="fieldset" error={!!errors.gender}>
                  <FormLabel
                    component="legend"
                    sx={{ color: "white", "&.Mui-focused": { color: "white" } }}
                  >
                    מגדר
                  </FormLabel>
                  <RadioGroup
                    row
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    sx={{ justifyContent: "center" }}
                  >
                    <FormControlLabel
                      value="male"
                      control={<Radio sx={{ color: "white" }} />}
                      label="זכר"
                      sx={{ color: "white" }}
                    />
                    <FormControlLabel
                      value="female"
                      control={<Radio sx={{ color: "white" }} />}
                      label="נקבה"
                      sx={{ color: "white" }}
                    />
                    <FormControlLabel
                      value="other"
                      control={<Radio sx={{ color: "white" }} />}
                      label="אחר"
                      sx={{ color: "white" }}
                    />
                  </RadioGroup>
                  {errors.gender && (
                    <Typography variant="caption" sx={{ color: "#f44336" }}>
                      {errors.gender}
                    </Typography>
                  )}
                </FormControl>
              </Grid>

              {/* תנאי השימוש */}
              <Grid item xs={12}>
                <Box
                  sx={{
                    background: "rgba(255, 255, 255, 0.1)",
                    padding: 2,
                    borderRadius: 2,
                    border: "1px solid rgba(255, 255, 255, 0.3)",
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{ color: "white", marginBottom: 2 }}
                  >
                    כללי – בהרשמתך למערכת, הנך מסכים לתנאי התקנון ומתחייב לפעול
                    בהתאם לכללי השימוש.
                  </Typography>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={acceptTerms}
                        onChange={(e) => setAcceptTerms(e.target.checked)}
                        sx={{ color: "white" }}
                      />
                    }
                    label="מאשר/ת שקראתי ומסכים/ה לתנאים"
                    sx={{ color: "white" }}
                  />
                  {errors.acceptTerms && (
                    <Typography
                      variant="caption"
                      sx={{ color: "#f44336", display: "block" }}
                    >
                      {errors.acceptTerms}
                    </Typography>
                  )}
                </Box>
              </Grid>
            </Grid>

            {/* כפתור הרשמה */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              sx={{
                marginTop: 3,
                padding: 1.5,
                borderRadius: 2,
                fontSize: "1.2rem",
                fontWeight: "bold",
                background: "rgba(255, 255, 255, 0.2)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.3)",
                color: "white",
                "&:hover": {
                  background: "rgba(255, 255, 255, 0.3)",
                  transform: "translateY(-2px)",
                  boxShadow: "0 6px 20px rgba(0,0,0,0.2)",
                },
                transition: "all 0.3s ease",
              }}
            >
              🎉 הצטרף אלינו
            </Button>

            {/* קישור לחזרה להתחברות */}
            <Box sx={{ textAlign: "center", marginTop: 3 }}>
              <Typography
                variant="body1"
                sx={{
                  marginBottom: 2,
                  color: "rgba(255, 255, 255, 0.9)",
                  textShadow: "1px 1px 2px rgba(0,0,0,0.2)",
                }}
              >
                כבר יש לך חשבון? 🤔
              </Typography>
              <Button
                component={Link}
                to="/"
                variant="outlined"
                size="large"
                sx={{
                  padding: "12px 30px",
                  borderRadius: 2,
                  fontSize: "1.1rem",
                  fontWeight: "bold",
                  borderColor: "rgba(255, 255, 255, 0.5)",
                  color: "white",
                  background: "rgba(255, 255, 255, 0.1)",
                  "&:hover": {
                    borderColor: "rgba(255, 255, 255, 0.8)",
                    color: "white",
                    background: "rgba(255, 255, 255, 0.2)",
                    transform: "translateY(-2px)",
                  },
                  transition: "all 0.3s ease",
                }}
              >
                🔙 התחבר
              </Button>
            </Box>
          </Box>
        </Paper>
      </div>

      {/* Dialog לחלונית השלמת הרשמה */}
      <Dialog
        open={showPopup}
        onClose={() => setShowPopup(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle
          sx={{
            textAlign: "center",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
          }}
        >
          השלמת הרשמה 🎯
        </DialogTitle>
        <DialogContent sx={{ padding: 3 }}>
          <TextField
            label="שם משתמש"
            name="userName"
            fullWidth
            value={popupData.userName}
            onChange={handlePopupChange}
            error={!!errors.userName}
            helperText={errors.userName}
            margin="normal"
            sx={{
              marginBottom: 2,
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
              },
            }}
          />
          <TextField
            label="סיסמה"
            name="password"
            type="password"
            fullWidth
            value={popupData.password}
            onChange={handlePopupChange}
            error={!!errors.password}
            helperText={errors.password}
            margin="normal"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
              },
            }}
          />
        </DialogContent>
        <DialogActions sx={{ padding: 2, justifyContent: "center", gap: 2 }}>
          <Button
            onClick={handlePopupSubmit}
            variant="contained"
            sx={{
              background: "linear-gradient(45deg, #667eea, #764ba2)",
              "&:hover": {
                background: "linear-gradient(45deg, #5a6fd8, #6b42a0)",
              },
            }}
          >
            ✅ רשום אותי
          </Button>
          <Button
            onClick={() => setShowPopup(false)}
            variant="outlined"
            color="secondary"
          >
            ❌ ביטול
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default SignUpPage;
