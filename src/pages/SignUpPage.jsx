import React, { useState } from "react";
import axios from "axios";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import "./signup.css";
const SignUpPage = () => {
  // State for form data and errors
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
    birthdate: "",
    school: "",
  });
  const [errors, setErrors] = useState({});
  const [isUnderage, setIsUnderage] = useState(false);
  const navigate = useNavigate();
  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    if (name === "birthdate") {
      const birth_date = new Date(value);
      const age = new Date().getFullYear() - birth_date.getFullYear();
      setIsUnderage(age < 18); // אם הגיל מתחת ל-18, מגדיר isUnderage ל-true
    }
  };

  // Function to check if email already exists
  const checkIfEmailExists = async (email) => {
    try {
      const response = await axios.post(
        "http://localhost:4000/api/users/check-email",
        { email }
      );
      return response.data.exists;
    } catch (error) {
      console.error("Error checking email:", error);
      return false;
    }
  };

  // Handle form submission
  const handleCreateUser = async (e) => {
    e.preventDefault();
    setErrors({});
    const newErrors = {};
    if (!formData.userName.trim()) newErrors.userName = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.password.trim()) newErrors.password = "Password is required";
    if (!formData.birthdate.trim())
      newErrors.birthdate = "Birthdate is required";
    if (isUnderage && !formData.school.trim())
      newErrors.school = "School name is required for underage users";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:4000/api/users/signup",
        formData
      );
      if (res.data.existMail) {
        setErrors({ email: res.data.message });
      } else {
        console.log("User created:", res.data);
        alert("User successfully created!");
        navigate("/posts");
      }
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  return (
    <div className="container">
      <form onSubmit={handleCreateUser}>
        <h1>Sign Up</h1>
        <div className="input-box">
          <span>Name</span>
          <input
            type="text"
            name="userName"
            placeholder="Enter your name"
            value={formData.userName}
            onChange={handleChange}
          />
          {errors.userName && <p className="error">{errors.userName}</p>}
        </div>
        <div className="input-box">
          <span>Email</span>
          <input
            type="text"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && <p className="error">{errors.email}</p>}
        </div>
        <div className="input-box">
          <span>Password</span>
          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
          />
          {errors.password && <p className="error">{errors.password}</p>}
        </div>
        <div className="input-box">
          <span>Date of Birth</span>
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
            <span>School Name</span>
            <input
              type="text"
              name="school"
              placeholder="Enter your school name"
              value={formData.school}
              onChange={handleChange}
            />
            {errors.school && <p className="error">{errors.school}</p>}
          </div>
        )}
        <Button type="submit" className="btn">
          Sign Up
        </Button>
      </form>
    </div>
  );
};

export default SignUpPage;
