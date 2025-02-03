import { Button } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import "./login.css";
import { useState } from "react";
import axios from "axios";

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
      //במידה וכל הנתונים תקינים
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
    <div className="container">
      <form onSubmit={handleLogin}>
        <h3 className="allign">Log In</h3>
        {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
        <div className="input-box">
          <span>Email</span>
          <input
            type="text"
            name="email"
            placeholder="Enter your email"
            value={formLogin.email}
            onChange={handleChange}
          />
        </div>
        <div className="input-box">
          <span>Password</span>
          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            value={formLogin.password}
            onChange={handleChange}
          />
        </div>
        <button type="submit" className="btn">
          Log In
        </button>
        <p className="allign">Don't have an account?</p>
        <div className="allign">
          <Link to="/signup">
            <Button variant="contained" color="primary">
              Sign Up
            </Button>
          </Link>
        </div>
      </form>
    </div>
  );
};

export default LogInPage;
