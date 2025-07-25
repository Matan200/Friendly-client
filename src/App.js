import "./App.css";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
// import HomePage from "./pages/HomePage";
import React from "react";
import PostsPage from "./pages/PostsPage";
import SignUpPage from "./pages/SignUpPage";
import LogInPage from "./pages/LogInPage";
import EventsForm from "./pages/Events";
import MenuBar from "./pages/Menu";
import DonateForm from "./pages/DonatePage";
import MyProfilePage from "./pages/MyProfilePage";

import AccessibilityButton from "./pages/AccessibilityButton";
import TestimonialsPage from "./pages/TestimonialsPage";
import MyPosts from "./pages/MyPosts";
import Whoarewe from "./pages/WhoAreWe";
function App() {
  return (
    <Router>
      <AccessibilityButton />
      {/* <MenuBar /> */}
      <Routes>
        <Route path="/" element={<LogInPage />} />
        <Route path="/signup" element={<SignUpPage />} />

        <Route
          path="/whoarewe"
          element={
            <>
              <MenuBar />
              <Whoarewe />
            </>
          }
        />

        <Route
          path="/posts"
          element={
            <>
              <MenuBar />
              <PostsPage />
            </>
          }
        />

        <Route
          path="/events"
          element={
            <>
              <MenuBar />
              <EventsForm />
            </>
          }
        />

        <Route
          path="/alumni"
          element={
            <>
              <MenuBar />
              <TestimonialsPage />
            </>
          }
        />

        <Route
          path="/myprofile"
          element={
            <>
              <MenuBar />
              <MyProfilePage />
            </>
          }
        />

        <Route
          path="/myposts"
          element={
            <>
              <MenuBar />
              <MyPosts />
            </>
          }
        />

        <Route
          path="/donate"
          element={
            <>
              <MenuBar />
              <DonateForm />
            </>
          }
        />
        {/* <Route path="/whoarewe" element={<Whoarewe />} />
        <Route path="/posts" element={<PostsPage />} />
        <Route path="/events" element={<EventsForm />} />
        <Route path="/alumni" element={<TestimonialsPage/>}/>
        <Route path="/myprofile" element={<MyProfilePage/>}/>
        <Route path="/myposts" element={<MyPosts/>}/>
        <Route path="/donate" element={<DonateForm/>}/>
        <Route path="/myprofile" element={<MyProfilePage/>}/> */}
      </Routes>
    </Router>
  );
}

export default App;
