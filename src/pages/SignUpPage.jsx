import axios from "axios";

const { Button } = require("@mui/material");

const SignUpPage = () => {
  const handleCreateUser = async () => {
    try {
      const res = await axios.post("http://localhost:4000/api/signup");
    } catch (error) {}
  };
  return (
    <div>
      <h1>Sign Up</h1>
      <div className="signFields">
        <input type="text" placeholder="name" />
        <input type="text" placeholder="email" />
        <input type="text" placeholder="password" />
        <input type="text" placeholder="id" />
        <input type="date" placeholder="01/01/2001" />
      </div>
      <Button onClick={handleCreateUser}>sign up</Button>
    </div>
  );
};
export default SignUpPage;
