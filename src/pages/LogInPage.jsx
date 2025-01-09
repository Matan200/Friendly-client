import { Button } from "@mui/material";
import { Link } from "react-router-dom";

const { SignUpPage } = require("./SignUpPage");

const LogInPage = () => {
  return (
    <diV>
      <h3>Log In</h3>
      <input type="text" placeholder="email" />
      <input type="text" placeholder="password" />
      <button>Log In</button>
      <p>don't you have already an account?</p>
      <Link to="/signup">
        <Button>sign up</Button>
      </Link>
    </diV>
  );
};
export default LogInPage;
