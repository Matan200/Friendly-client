import { Link } from "react-router-dom";
import React from "react";
import { Button } from "@mui/material";

const HomePage = () => {
  return (
    <div className="home-page">
      <h1>Welcome home!</h1>
      <div className="home-menu">
        <Link to="/posts">
          <Button variant="contained" color="primary">
            POSTS{" "}
          </Button>
        </Link>
        <Link to="/contact">
          <Button>CONTACT</Button>
        </Link>
        <Link to="/about_us">
          <Button>ABOUT US!</Button>
        </Link>
        <Link to="/galery">
          <Button>GALERY</Button>
        </Link>
      </div>
    </div>
  );
};
export default HomePage;
