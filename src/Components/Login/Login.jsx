import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BsEye, BsEyeSlash } from "react-icons/bs";
import setAuthHeaders from "../../Utils/SetAuthHeaders";
import "./Login.css";

export const Login = () => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handlePhoneNumberChange = (e) => {
    setPhoneNumber(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const params = new URLSearchParams();
      params.append("phoneNumber", phoneNumber);
      params.append("password", password);

      const response = await axios.post(
        `${apiUrl}/api/v1/login?${params.toString()}`,
        null,
        { withCredentials: true }
      );

      console.log("Response received:", response);

      if (
        response.status === 200 &&
        response.data.message === "User logged in successfully."
      ) {
        console.log("Login successful", response.data);
        localStorage.setItem("token", response.data.token);
        setAuthHeaders(response.data.token);
        navigate("/home");
      } else {
        alert("Login failed: Incorrect credentials");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Login failed: Please recheck your credentials.");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="right">
      <form onSubmit={handleSubmit}>
        <h2>Login</h2>
        <div className="inputbox">
          <input
            type="text"
            placeholder="Phone Number"
            value={phoneNumber}
            onChange={handlePhoneNumberChange}
            required
          />
        </div>
        <div className="inputbox">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={handlePasswordChange}
            required
          />
          <button type="button" onClick={togglePasswordVisibility}>
            {showPassword ? (
              <BsEyeSlash className="eye" />
            ) : (
              <BsEye className="eye" />
            )}
          </button>
        </div>
        <div className="inputbox">
          <button type="submit">Login</button>
        </div>
      </form>
    </div>
  );
};

export default Login;
