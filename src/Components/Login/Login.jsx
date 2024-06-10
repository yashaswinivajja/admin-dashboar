import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BsEye, BsEyeSlash } from "react-icons/bs";
import setAuthHeaders from "../../Utils/SetAuthHeaders";
import "./Login.css";

export const Login = () => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const [PhoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handlePhoneNumber = (e) => {
    const inputvalue = e.target.value;
    setPhoneNumber(inputvalue);
  };

  const handlePassword = (e) => {
    const inputvalue = e.target.value;
    setPassword(inputvalue);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${apiUrl}/api/v1/login`,
        { PhoneNumber, password },
        { withCredentials: true }
      );
      console.log(response);

      if (
        response.status === 200 &&
        response.data.message === "User login successful"
      ) {
        console.log("login successful", response.data);
        localStorage.setItem("token", response.data.token);
        setAuthHeaders(response.data.token);
        navigate("/home");
      }
    } catch (error) {
      if (
        error.response.status === 400 &&
        error.response.data.message === "User not found"
      ) {
        alert("consider signing up first");
      }
      if (
        error.response.status === 401 &&
        error.response.data.message === "Incorrect password"
      ) {
        alert("Invalid password");
      }
      if (
        error.response.status === 500 &&
        error.response.data.message === "Internal server error"
      ) {
        alert("server Error Try again");
      }
      console.error("login failed", error);
    }
  };

  const togglePasswordVisibility = (event) => {
    event.preventDefault();
    setShowPassword(!showPassword);
  };

  return (
    <div className="right">
      <form onSubmit={handleSubmit}>
        {" "}
        {/* Use onSubmit event handler */}
        <h2>Login</h2>
        <div className="inputbox">
          <input
            type="PhoneNumber"
            placeholder="PhoneNumber"
            name="PhoneNumber"
            value={PhoneNumber}
            onChange={handlePhoneNumber}
            required
          />
        </div>
        <div className="inputbox">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            name="password"
            value={password}
            onChange={handlePassword}
            required
          />
          <button type="button" onClick={togglePasswordVisibility}>
            {showPassword ? (
              <BsEye className="eye" />
            ) : (
              <BsEyeSlash className="eye" />
            )}
          </button>
        </div>
        <div className="inputbox" id="login">
          <button type="submit">Login</button>
        </div>
      </form>
    </div>
  );
};
export default Login;
