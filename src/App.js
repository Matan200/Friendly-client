import "./App.css";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import React from "react";
import PostsPage from "./pages/PostsPage";
import SignUpPage from "./pages/SignUpPage";
import LogInPage from "./pages/LogInPage";
import EventsForm from "./pages/Events";
import MenuBar from "./pages/Menu";
import AccessibilityButton from "./pages/AccessibilityButton";
function App() {
  return (
    <Router>
      <AccessibilityButton />
      <MenuBar />
      <Routes>
        <Route path="/" element={<LogInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/posts" element={<PostsPage />} />
        <Route path="/events" element={<EventsForm />} />
      </Routes>
    </Router>
  );
}

export default App;
