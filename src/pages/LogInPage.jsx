import { Button } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import "./login.css";
import { useState } from "react";
import axios from "axios";
import AccessibilityButton from "./AccessibilityButton";

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
        "http://localhost:4000/api/users/login",
        formLogin
      );
      if (response.data.success) {
        alert("Login successful");
        localStorage.setItem("editor", formLogin.email);
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
      <AccessibilityButton />
      <div className="login-page">
        {/* <h1 className="login-title">איזה כיף לראות אותך כאן!</h1>
        <div className="login-subtitle">השינוי מתחיל כאן</div> */}

        <div className="container">
          <form onSubmit={handleLogin}>
            <h2>איזה כיף לראות אותך כאן!</h2>
            <h2>השינוי מתחיל כאן</h2>
            <h3 className="allign">התחברות</h3>
            {error && (
              <p style={{ color: "red", textAlign: "center" }}>{error}</p>
            )}
            <div className="input-box">
              <span>מייל</span>
              <input
                type="text"
                name="email"
                placeholder="הכנס את המייל"
                value={formLogin.email}
                onChange={handleChange}
              />
            </div>
            <div className="input-box">
              <span>סיסמא</span>
              <input
                type="password"
                name="password"
                placeholder="הכנס את הסיסמא"
                value={formLogin.password}
                onChange={handleChange}
              />
            </div>
            <button type="submit" className="btn">
              ✅התחבר
            </button>
            <p className="allign">? עדיין לא רשום</p>
            <div className="allign">
              <Link to="/signup">
                <Button variant="contained" color="primary">
                  👤 להרשמה
                </Button>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LogInPage;
