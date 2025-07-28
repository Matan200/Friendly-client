import React, { useState, useEffect } from "react";
import {
  Button,
  TextField,
  Typography,
  Alert,
  Box,
  Grid,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import "./login.css";
import axios from "axios";

const API_BASE = process.env.REACT_APP_API || "http://localhost:4000";

const AuthPage = () => {
  const location = useLocation();
  const [isSignUp, setIsSignUp] = useState(location.pathname === "/signup");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // עדכון המצב לפי ה-URL
  useEffect(() => {
    setIsSignUp(location.pathname === "/signup");
  }, [location.pathname]);

  // נתוני התחברות
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  // נתוני הרשמה
  const [signupData, setSignupData] = useState({
    email: "",
    idnumber: "",
    birthdate: "",
    gender: "",
    address: "",
    school: "",
  });

  // נתוני חלונית השלמת הרשמה
  const [popupData, setPopupData] = useState({
    userName: "",
    password: "",
  });

  const [acceptTerms, setAcceptTerms] = useState(false);
  const [errors, setErrors] = useState({});
  const [isUnderage, setIsUnderage] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);

  const avatarOptions = [
    "/images/avatar1.jpg",
    "/images/avatar2.jpg",
    "/images/avatar3.jpg",
    "/images/avatar4.jpg",
  ];

  // טיפול בהתחברות
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${API_BASE}/api/users/login`,
        loginData
      );
      if (response.data.success) {
        alert("התחברות בוצעה בהצלחה!");
        const userData = response.data.user;
        localStorage.setItem("editor", JSON.stringify(userData));
        navigate("/posts");
      } else {
        setError("האימייל או הסיסמה לא נכונים");
      }
    } catch (error) {
      console.error("Error during login:", error);
      setError("אירעה שגיאה. אנא נסה שוב מאוחר יותר.");
    }
  };

  // טיפול בהרשמה
  const handleSignUp = (e) => {
    e.preventDefault();
    if (validateSignupFields()) {
      setShowPopup(true);
    }
  };

  const validateSignupFields = () => {
    const newErrors = {};
    if (!signupData.email.trim()) newErrors.email = "אימייל חובה";
    if (!signupData.idnumber.trim()) newErrors.idnumber = "תעודת זהות חובה";
    else if (signupData.idnumber.length !== 9 || isNaN(signupData.idnumber)) {
      newErrors.idnumber = "תעודת זהות חייבת להכיל בדיוק 9 ספרות";
    }
    if (!signupData.gender.trim()) newErrors.gender = "מגדר חובה";
    if (!signupData.address.trim()) newErrors.address = "כתובת חובה";
    if (!signupData.birthdate.trim()) newErrors.birthdate = "תאריך לידה חובה";
    if (isUnderage && !signupData.school.trim())
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
        ...signupData,
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
          new Date().getFullYear() -
          new Date(signupData.birthdate).getFullYear();
        const userType = age < 18 ? "student" : "adult";
        const userData = {
          email: signupData.email,
          userType: userType,
        };
        localStorage.setItem("editor", JSON.stringify(userData));
        navigate("/posts");
      }
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  const handlePopupSubmit = () => {
    const isMainFormValid = validateSignupFields();
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

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSignupChange = (e) => {
    const { name, value } = e.target;
    setSignupData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (name === "birthdate") {
      const birth_date = new Date(value);
      const age = new Date().getFullYear() - birth_date.getFullYear();
      setIsUnderage(age < 18);
    }
  };

  const handlePopupChange = (e) => {
    const { name, value } = e.target;
    setPopupData((prev) => ({
      ...prev,
      [name]: value,
    }));
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

  const switchMode = () => {
    const newPath = isSignUp ? "/" : "/signup";
    navigate(newPath);
    setError("");
    setErrors({});
    setAcceptTerms(false);
    setSelectedAvatar(null);
    setUploadedImage(null);
  };

  return (
    <div>
      <div className="login-page" style={{ paddingTop: "40px" }}>
        {/* כותרת משותפת */}
        <Box
          className="login-page-header"
          sx={{
            textAlign: "center",
            marginBottom: { xs: "30px", md: "50px" },
            marginTop: "-20px",
            padding: { xs: 2, md: 3 },
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
              color: "#c2a5fbff",
              textShadow: "3px 3px 6px rgba(0,0,0,0.5)",
              letterSpacing: 2,
              margin: 0,
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

        {/* קונטיינר מרכזי */}
        <Box
          sx={{
            maxWidth: { xs: "350px", sm: "450px", md: "600px", lg: "800px" },
            margin: "0 auto",
            padding: { xs: 2, sm: 2.5, md: 3 },
            backgroundColor: "#a388a9",
            borderRadius: 3,
            boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255,255,255,0.3)",
            marginX: { xs: 2, sm: "auto" },
          }}
        >
          {/* כפתורי מעבר בין התחברות והרשמה */}
          <Box sx={{ textAlign: "center", marginBottom: { xs: 2, md: 3 } }}>
            <Button
              variant={!isSignUp ? "contained" : "outlined"}
              onClick={() => !isSignUp || navigate("/")}
              sx={{
                marginRight: { xs: 0.5, sm: 1 },
                marginBottom: { xs: 1, sm: 0 },
                borderRadius: 2,
                fontSize: { xs: "0.9rem", sm: "1rem" },
                fontWeight: "bold",
                padding: { xs: "8px 16px", sm: "10px 20px" },
                minWidth: { xs: "120px", sm: "140px" },
                ...(!isSignUp
                  ? {
                      background: "linear-gradient(45deg, #667eea, #764ba2)",
                    }
                  : {
                      borderColor: "#667eea",
                      color: "#667eea",
                    }),
              }}
            >
              התחברות
            </Button>
            <Button
              variant={isSignUp ? "contained" : "outlined"}
              onClick={() => isSignUp || navigate("/signup")}
              sx={{
                borderRadius: 2,
                fontSize: { xs: "0.9rem", sm: "1rem" },
                fontWeight: "bold",
                padding: { xs: "8px 16px", sm: "10px 20px" },
                minWidth: { xs: "120px", sm: "140px" },
                ...(isSignUp
                  ? {
                      background: "linear-gradient(45deg, #667eea, #764ba2)",
                    }
                  : {
                      borderColor: "#667eea",
                      color: "#667eea",
                    }),
              }}
            >
              הרשמה
            </Button>
          </Box>

          {!isSignUp ? (
            // טופס התחברות
            <Box component="form" onSubmit={handleLogin}>
              <Box
                sx={{ textAlign: "center", marginBottom: { xs: 1.5, md: 2 } }}
              >
                <Typography
                  variant="h4"
                  component="h2"
                  sx={{
                    fontWeight: "bold",
                    color: "#ffffff",
                    marginBottom: { xs: 0.5, md: 1 },
                    fontSize: { xs: "1.3rem", sm: "1.5rem", md: "2rem" },
                  }}
                >
                  איזה כיף לראות אותך כאן! 🎉
                </Typography>
                <Typography
                  variant="h5"
                  component="h2"
                  sx={{
                    color: "rgba(255, 255, 255, 0.9)",
                    marginBottom: { xs: 1, md: 1.5 },
                    fontSize: { xs: "1rem", sm: "1.2rem", md: "1.5rem" },
                  }}
                >
                  השינוי מתחיל כאן
                </Typography>
                <Typography
                  variant="h6"
                  component="h3"
                  sx={{
                    fontWeight: 600,
                    color: "#ffffff",
                    borderBottom: "2px solid #ffffff",
                    paddingBottom: 1,
                    marginBottom: { xs: 1.5, md: 2 },
                    display: "inline-block",
                    fontSize: { xs: "1rem", sm: "1.1rem", md: "1.25rem" },
                  }}
                >
                  התחברות למערכת
                </Typography>
              </Box>

              {error && (
                <Alert
                  severity="error"
                  sx={{
                    marginBottom: 3,
                    borderRadius: 2,
                    "& .MuiAlert-message": {
                      textAlign: "center",
                      width: "100%",
                    },
                  }}
                >
                  {error}
                </Alert>
              )}

              <Box sx={{ marginBottom: 3 }}>
                <Box sx={{ marginBottom: 2 }}>
                  <Typography
                    variant="body1"
                    sx={{
                      color: "#ffffff",
                      fontWeight: "bold",
                      marginBottom: 1,
                      fontSize: "0.9rem",
                    }}
                  >
                    כתובת מייל
                  </Typography>
                  <TextField
                    fullWidth
                    name="email"
                    type="email"
                    value={loginData.email}
                    onChange={handleLoginChange}
                    variant="outlined"
                    required
                    placeholder="הכנס כתובת מייל"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                        backgroundColor: "#ffffff",
                        "&:hover fieldset": {
                          borderColor: "#667eea",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "#667eea",
                        },
                      },
                      "& .MuiOutlinedInput-input": {
                        color: "#333",
                        textAlign: "right",
                      },
                    }}
                  />
                </Box>

                <Box>
                  <Typography
                    variant="body1"
                    sx={{
                      color: "#ffffff",
                      fontWeight: "bold",
                      marginBottom: 1,
                      fontSize: "0.9rem",
                    }}
                  >
                    סיסמה
                  </Typography>
                  <TextField
                    fullWidth
                    name="password"
                    type="password"
                    value={loginData.password}
                    onChange={handleLoginChange}
                    variant="outlined"
                    required
                    placeholder="הכנס סיסמה"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                        backgroundColor: "#ffffff",
                        "&:hover fieldset": {
                          borderColor: "#667eea",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "#667eea",
                        },
                      },
                      "& .MuiOutlinedInput-input": {
                        color: "#333",
                        textAlign: "right",
                      },
                    }}
                  />
                </Box>
              </Box>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                sx={{
                  padding: { xs: 1.2, md: 1.5 },
                  borderRadius: 2,
                  fontSize: { xs: "1rem", sm: "1.1rem", md: "1.2rem" },
                  fontWeight: "bold",
                  background: "linear-gradient(45deg, #667eea, #764ba2)",
                  marginBottom: { xs: 2, md: 3 },
                  "&:hover": {
                    background: "linear-gradient(45deg, #5a6fd8, #6b42a0)",
                    transform: "translateY(-2px)",
                    boxShadow: "0 6px 20px rgba(0,0,0,0.3)",
                  },
                  transition: "all 0.3s ease",
                }}
              >
                ✅ התחבר
              </Button>
            </Box>
          ) : (
            // טופס הרשמה
            <Box component="form" onSubmit={handleSignUp}>
              <Box
                sx={{ textAlign: "center", marginBottom: { xs: 1.5, md: 2 } }}
              >
                <Typography
                  variant="h4"
                  component="h2"
                  sx={{
                    fontWeight: "bold",
                    color: "#ffffff",
                    marginBottom: { xs: 0.5, md: 1 },
                    fontSize: { xs: "1.3rem", sm: "1.5rem", md: "2rem" },
                  }}
                >
                  ברוכים הבאים למשפחה! 🎉
                </Typography>
                <Typography
                  variant="h5"
                  component="h2"
                  sx={{
                    color: "rgba(255, 255, 255, 0.9)",
                    marginBottom: { xs: 1, md: 1.5 },
                    fontSize: { xs: "1rem", sm: "1.2rem", md: "1.5rem" },
                  }}
                >
                  בואו ניצור עולם יותר טוב ביחד
                </Typography>
                <Typography
                  variant="h6"
                  component="h3"
                  sx={{
                    fontWeight: 600,
                    color: "#ffffff",
                    borderBottom: "2px solid #ffffff",
                    paddingBottom: 1,
                    marginBottom: { xs: 1.5, md: 2 },
                    display: "inline-block",
                    fontSize: { xs: "1rem", sm: "1.1rem", md: "1.25rem" },
                  }}
                >
                  הרשמה למערכת
                </Typography>
              </Box>

              {/* בחירת אווטאר */}
              <Box sx={{ marginBottom: { xs: 2, md: 3 }, textAlign: "center" }}>
                <Typography
                  variant="h6"
                  sx={{
                    color: "#ffffff",
                    marginBottom: { xs: 1.5, md: 2 },
                    fontSize: { xs: "1rem", sm: "1.1rem" },
                  }}
                >
                  📸 בחר תמונה אישית או אווטאר
                </Typography>

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{
                    display: "block",
                    margin: "0 auto 20px auto",
                    color: "#333",
                    backgroundColor: "#fff",
                    padding: "8px",
                    borderRadius: "4px",
                    border: "1px solid #ddd",
                    fontSize: window.innerWidth < 600 ? "14px" : "16px",
                  }}
                />

                <Grid
                  container
                  spacing={{ xs: 1, sm: 2 }}
                  justifyContent="center"
                >
                  {avatarOptions.map((avatar, index) => (
                    <Grid item key={index}>
                      <Box
                        component="img"
                        src={avatar}
                        alt={`avatar-${index}`}
                        onClick={() => handleAvatarSelect(avatar)}
                        sx={{
                          width: { xs: 50, sm: 60 },
                          height: { xs: 50, sm: 60 },
                          borderRadius: "50%",
                          cursor: "pointer",
                          border:
                            selectedAvatar === avatar
                              ? "3px solid #667eea"
                              : "2px solid transparent",
                          transition: "all 0.3s ease",
                          "&:hover": {
                            transform: "scale(1.1)",
                          },
                        }}
                      />
                    </Grid>
                  ))}
                </Grid>

                {(uploadedImage || selectedAvatar) && (
                  <Box sx={{ marginTop: { xs: 1.5, md: 2 } }}>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#ffffff",
                        marginBottom: 1,
                        fontSize: { xs: "0.8rem", sm: "0.875rem" },
                      }}
                    >
                      {uploadedImage ? "תמונה שהועלתה:" : "אווטאר שנבחר:"}
                    </Typography>
                    <Box
                      component="img"
                      src={uploadedImage || selectedAvatar}
                      alt="preview"
                      sx={{
                        width: { xs: 70, sm: 80 },
                        height: { xs: 70, sm: 80 },
                        borderRadius: "50%",
                        border: "3px solid #667eea",
                      }}
                    />
                  </Box>
                )}
              </Box>

              <Divider sx={{ marginY: 3, backgroundColor: "#ddd" }} />

              {/* שדות הטופס */}
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Box>
                    <Typography
                      variant="body1"
                      sx={{
                        color: "#ffffff",
                        fontWeight: "bold",
                        marginBottom: 1,
                        fontSize: "0.9rem",
                      }}
                    >
                      כתובת אימייל
                    </Typography>
                    <TextField
                      fullWidth
                      name="email"
                      type="email"
                      value={signupData.email}
                      onChange={handleSignupChange}
                      variant="outlined"
                      required
                      error={!!errors.email}
                      helperText={errors.email}
                      placeholder="הכנס את כתובת האימייל שלך"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Tooltip title="בבקשה הכנס אימייל תקין" arrow>
                              <IconButton sx={{ color: "#667eea" }}>
                                <HelpOutlineIcon />
                              </IconButton>
                            </Tooltip>
                          </InputAdornment>
                        ),
                        style: { direction: "rtl" },
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                          backgroundColor: "#ffffff",
                          "&:hover fieldset": {
                            borderColor: "#667eea",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "#667eea",
                          },
                        },
                        "& .MuiOutlinedInput-input": {
                          color: "#333",
                          textAlign: "right",
                        },
                      }}
                    />
                  </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Box>
                    <Typography
                      variant="body1"
                      sx={{
                        color: "#ffffff",
                        fontWeight: "bold",
                        marginBottom: 1,
                        fontSize: "0.9rem",
                      }}
                    >
                      תעודת זהות
                    </Typography>
                    <TextField
                      fullWidth
                      name="idnumber"
                      value={signupData.idnumber}
                      onChange={handleSignupChange}
                      variant="outlined"
                      required
                      error={!!errors.idnumber}
                      helperText={errors.idnumber}
                      placeholder="הכנס 9 ספרות"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Tooltip
                              title="בבקשה הכנס 9 ספרות תעודת הזהות שלך"
                              arrow
                            >
                              <IconButton sx={{ color: "#667eea" }}>
                                <HelpOutlineIcon />
                              </IconButton>
                            </Tooltip>
                          </InputAdornment>
                        ),
                        style: { direction: "rtl" },
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                          backgroundColor: "#ffffff",
                          "&:hover fieldset": {
                            borderColor: "#667eea",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "#667eea",
                          },
                        },
                        "& .MuiOutlinedInput-input": {
                          color: "#333",
                          textAlign: "right",
                        },
                      }}
                    />
                  </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Box>
                    <Typography
                      variant="body1"
                      sx={{
                        color: "#ffffff",
                        fontWeight: "bold",
                        marginBottom: 1,
                        fontSize: "0.9rem",
                      }}
                    >
                      כתובת מגורים
                    </Typography>
                    <TextField
                      fullWidth
                      name="address"
                      value={signupData.address}
                      onChange={handleSignupChange}
                      variant="outlined"
                      required
                      error={!!errors.address}
                      helperText={errors.address}
                      placeholder="רחוב, עיר, מיקוד"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Tooltip title="בבקשה הכנס את כתובת המגורים" arrow>
                              <IconButton sx={{ color: "#667eea" }}>
                                <HelpOutlineIcon />
                              </IconButton>
                            </Tooltip>
                          </InputAdornment>
                        ),
                        style: { direction: "rtl" },
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                          backgroundColor: "#ffffff",
                          "&:hover fieldset": {
                            borderColor: "#667eea",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "#667eea",
                          },
                        },
                        "& .MuiOutlinedInput-input": {
                          color: "#333",
                          textAlign: "right",
                        },
                      }}
                    />
                  </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Box>
                    <Typography
                      variant="body1"
                      sx={{
                        color: "#ffffff",
                        fontWeight: "bold",
                        marginBottom: 1,
                        fontSize: "0.9rem",
                      }}
                    >
                      תאריך לידה
                    </Typography>
                    <TextField
                      fullWidth
                      name="birthdate"
                      type="date"
                      value={signupData.birthdate}
                      onChange={handleSignupChange}
                      variant="outlined"
                      required
                      error={!!errors.birthdate}
                      helperText={errors.birthdate}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                          backgroundColor: "#ffffff",
                          "&:hover fieldset": {
                            borderColor: "#667eea",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "#667eea",
                          },
                        },
                        "& .MuiOutlinedInput-input": {
                          color: "#333",
                        },
                      }}
                    />
                  </Box>
                </Grid>

                {isUnderage && (
                  <Grid item xs={12}>
                    <Box>
                      <Typography
                        variant="body1"
                        sx={{
                          color: "#ffffff",
                          fontWeight: "bold",
                          marginBottom: 1,
                          fontSize: "0.9rem",
                        }}
                      >
                        בית ספר
                      </Typography>
                      <TextField
                        fullWidth
                        name="school"
                        value={signupData.school}
                        onChange={handleSignupChange}
                        variant="outlined"
                        required
                        error={!!errors.school}
                        helperText={errors.school}
                        placeholder="הכנס את שם בית הספר"
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 2,
                            backgroundColor: "#ffffff",
                            "&:hover fieldset": {
                              borderColor: "#667eea",
                            },
                            "&.Mui-focused fieldset": {
                              borderColor: "#667eea",
                            },
                          },
                          "& .MuiOutlinedInput-input": {
                            color: "#333",
                            textAlign: "right",
                          },
                        }}
                      />
                    </Box>
                  </Grid>
                )}

                <Grid item xs={12}>
                  <FormControl component="fieldset" error={!!errors.gender}>
                    <FormLabel
                      component="legend"
                      sx={{
                        color: "#ffffff",
                        "&.Mui-focused": { color: "#ffffff" },
                      }}
                    >
                      מגדר
                    </FormLabel>
                    <RadioGroup
                      row
                      name="gender"
                      value={signupData.gender}
                      onChange={handleSignupChange}
                      sx={{ justifyContent: "center" }}
                    >
                      <FormControlLabel
                        value="male"
                        control={<Radio sx={{ color: "#ffffff" }} />}
                        label="זכר"
                        sx={{ color: "#ffffff" }}
                      />
                      <FormControlLabel
                        value="female"
                        control={<Radio sx={{ color: "#ffffff" }} />}
                        label="נקבה"
                        sx={{ color: "#ffffff" }}
                      />
                      <FormControlLabel
                        value="other"
                        control={<Radio sx={{ color: "#ffffff" }} />}
                        label="אחר"
                        sx={{ color: "#ffffff" }}
                      />
                    </RadioGroup>
                    {errors.gender && (
                      <Typography variant="caption" sx={{ color: "#f44336" }}>
                        {errors.gender}
                      </Typography>
                    )}
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <Box
                    sx={{
                      backgroundColor: "rgba(255, 255, 255, 0.8)",
                      padding: 2,
                      borderRadius: 2,
                      border: "1px solid #ddd",
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{ color: "#333", marginBottom: 2 }}
                    >
                      כללי – בהרשמתך למערכת, הנך מסכים לתנאי התקנון ומתחייב
                      לפעול בהתאם לכללי השימוש.
                    </Typography>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={acceptTerms}
                          onChange={(e) => setAcceptTerms(e.target.checked)}
                          sx={{ color: "#667eea" }}
                        />
                      }
                      label="מאשר/ת שקראתי ומסכים/ה לתנאים"
                      sx={{ color: "#333" }}
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

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                sx={{
                  marginTop: { xs: 2, md: 3 },
                  padding: { xs: 1.2, md: 1.5 },
                  borderRadius: 2,
                  fontSize: { xs: "1rem", sm: "1.1rem", md: "1.2rem" },
                  fontWeight: "bold",
                  background: "linear-gradient(45deg, #667eea, #764ba2)",
                  "&:hover": {
                    background: "linear-gradient(45deg, #5a6fd8, #6b42a0)",
                    transform: "translateY(-2px)",
                    boxShadow: "0 6px 20px rgba(0,0,0,0.3)",
                  },
                  transition: "all 0.3s ease",
                }}
              >
                🎉 הצטרף אלינו
              </Button>
            </Box>
          )}
        </Box>
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
          <Box sx={{ marginBottom: 2 }}>
            <Typography
              variant="body1"
              sx={{
                color: "#333",
                fontWeight: "bold",
                marginBottom: 1,
                fontSize: "0.9rem",
              }}
            >
              שם משתמש
            </Typography>
            <TextField
              name="userName"
              fullWidth
              value={popupData.userName}
              onChange={handlePopupChange}
              error={!!errors.userName}
              helperText={errors.userName}
              placeholder="הכנס שם משתמש"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                },
                "& .MuiOutlinedInput-input": {
                  textAlign: "right",
                },
              }}
            />
          </Box>
          <Box>
            <Typography
              variant="body1"
              sx={{
                color: "#333",
                fontWeight: "bold",
                marginBottom: 1,
                fontSize: "0.9rem",
              }}
            >
              סיסמה
            </Typography>
            <TextField
              name="password"
              type="password"
              fullWidth
              value={popupData.password}
              onChange={handlePopupChange}
              error={!!errors.password}
              helperText={errors.password}
              placeholder="הכנס סיסמה"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                },
                "& .MuiOutlinedInput-input": {
                  textAlign: "right",
                },
              }}
            />
          </Box>
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

export default AuthPage;
