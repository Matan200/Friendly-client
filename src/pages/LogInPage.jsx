import { Button, TextField, Typography, Alert, Box } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import "./login.css";
import { useState } from "react";
import axios from "axios";
// import AccessibilityButton from "./AccessibilityButton"; // הסרנו כי nagishli עובד גלובלית
const API_BASE = process.env.REACT_APP_API || "http://localhost:4000";

const LogInPage = () => {
  const [formLogin, setFormLogin] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${API_BASE}/api/users/login`,
        formLogin
      );
      if (response.data.success) {
        alert("Login successful");
        const userData = response.data.user;
        localStorage.setItem("editor", JSON.stringify(userData));
        navigate("/posts");
      } else {
        setError("Email or password is not correct");
      }
    } catch (error) {
      console.error("Error during login client:", error);
      setError("An error occurred. Please try again later.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormLogin((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <div>
      <div className="login-page" style={{ paddingTop: "40px" }}>
        {/* כותרת משופרת - מרווח קטן יותר */}
        <Box
          className="login-page-header"
          sx={{
            textAlign: "center",
            marginBottom: "-35px", // שונה מ-4 ל-2
            marginTop: "-20px", // הוספת מרווח עליון שלילי
            padding: 3,
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.08) 100%)",
            backdropFilter: "blur(2px)", // הקטנת הטשטוש
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
              color: "#ffffff", // שינוי לצבע לבן רגיל
              textShadow: "3px 3px 6px rgba(0,0,0,0.5)", // צל חזק יותר
              letterSpacing: 2,
              margin: 0,
              filter: "none", // ביטול כל פילטר
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

        <div className="container">
          {/* טופס משופר */}
          <Box component="form" onSubmit={handleLogin}>
            {/* כותרות הטופס - מרווח קטן יותר */}
            <Box sx={{ textAlign: "center", marginBottom: 2 }}>
              {" "}
              {/* שונה מ-3 ל-2 */}
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
                  marginBottom: 1.5, // שונה מ-2 ל-1.5
                  fontSize: { xs: "1.2rem", md: "1.5rem" },
                }}
              >
                השינוי מתחיל כאן
              </Typography>
              <Typography
                variant="h6"
                component="h3"
                sx={{
                  fontWeight: 600,
                  color: "#667eea",
                  borderBottom: "2px solid #667eea",
                  paddingBottom: 1,
                  marginBottom: 2, // שונה מ-3 ל-2
                  display: "inline-block",
                }}
              >
                התחברות למערכת
              </Typography>
            </Box>

            {/* הודעת שגיאה */}
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

            {/* שדות הקלט */}
            <Box sx={{ marginBottom: 3 }}>
              <TextField
                fullWidth
                label="כתובת מייל"
                name="email"
                type="email"
                value={formLogin.email}
                onChange={handleChange}
                variant="outlined"
                required
                sx={{
                  marginBottom: 2,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    backgroundColor: "#ffffff", // רקע לבן
                    "&:hover fieldset": {
                      borderColor: "#667eea",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#667eea",
                    },
                  },
                  "& .MuiInputLabel-root": {
                    color: "#666", // צבע התווית
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: "#667eea",
                  },
                  "& .MuiOutlinedInput-input": {
                    color: "#333", // צבע הטקסט בשדה
                  },
                }}
              />

              <TextField
                fullWidth
                label="סיסמה"
                name="password"
                type="password"
                value={formLogin.password}
                onChange={handleChange}
                variant="outlined"
                required
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    backgroundColor: "#ffffff", // רקע לבן
                    "&:hover fieldset": {
                      borderColor: "#667eea",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#667eea",
                    },
                  },
                  "& .MuiInputLabel-root": {
                    color: "#666", // צבע התווית
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: "#667eea",
                  },
                  "& .MuiOutlinedInput-input": {
                    color: "#333", // צבע הטקסט בשדה
                  },
                }}
              />
            </Box>

            {/* כפתור התחברות */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              sx={{
                padding: 1.5,
                borderRadius: 2,
                fontSize: "1.2rem",
                fontWeight: "bold",
                background: "linear-gradient(45deg, #667eea, #764ba2)",
                marginBottom: 3,
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

            {/* קישור להרשמה */}
            <Box sx={{ textAlign: "center" }}>
              <Typography
                variant="body1"
                sx={{
                  marginBottom: 2,
                  color: "#666",
                  fontSize: "1.1rem",
                }}
              >
                עדיין לא רשום? 🤔
              </Typography>
              <Button
                component={Link}
                to="/signup"
                variant="outlined"
                size="large"
                sx={{
                  padding: "12px 30px",
                  borderRadius: 2,
                  fontSize: "1.1rem",
                  fontWeight: "bold",
                  borderColor: "#667eea",
                  color: "#667eea",
                  "&:hover": {
                    borderColor: "#5a6fd8",
                    color: "#5a6fd8",
                    background: "rgba(102, 126, 234, 0.04)",
                    transform: "translateY(-2px)",
                  },
                  transition: "all 0.3s ease",
                }}
              >
                👤 להרשמה
              </Button>
            </Box>
          </Box>
        </div>
      </div>
    </div>
  );
};

export default LogInPage;
