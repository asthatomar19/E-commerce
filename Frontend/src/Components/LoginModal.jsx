import React, { useState } from "react";
import { loginUser } from "../Services/userService";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Modal.css"

const LoginModal = ({ closeModal, openSignupModal }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    userEmail: "",
    userPassword: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await loginUser(formData);
      toast.success(res.data.msg);
      localStorage.setItem("token", res.data.token);
      closeModal();
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.msg || "Login Failed");
    }
  };
  return (
    <div className="auth-modal-overlay">
      <div className="auth-modal-content">
        <span className="auth-close-button" onClick={closeModal}>
          &times;
        </span>
        <h2>Login To MyShop</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="userEmail"
            placeholder="Enter Email"
            value={formData.userEmail}
            onChange={handleChange}
          />
          <input
            type="password"
            name="userPassword"
            placeholder="Enter Password"
            value={formData.userPassword}
            onChange={handleChange}
          />
          <button type="submit">Login</button>
        </form>

        <p className="auth-switch-text">
          Don't have an account?{" "}
          <span
            style={{ color: "blue", cursor: "pointer" }}
            onClick={() => {
              closeModal();
              openSignupModal();
            }}
          >
            Create an Account
          </span>
        </p>
      </div>
    </div>
  );
};

export default LoginModal;
