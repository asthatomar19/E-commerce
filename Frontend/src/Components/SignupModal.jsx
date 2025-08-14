import React, { useState } from "react";
import { SignupUser } from "../Services/userService";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Modal.css";

const SignupModal = ({ closeModal, openLoginModal }) => {
  const [formData, setFormData] = useState({
    userName: "",
    userEmail: "",
    userPassword: "",
    userAddress: "",
    userContact: "",
    Gender: "",
    Age: "",

  });
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx")
    e.preventDefault();
    try {
      const res = await SignupUser(formData);
      toast.success(res.data.msg);
      closeModal();
      openLoginModal();
    } catch (error) {
      toast.error(error.response?.data?.msg || "Signup Failed");
    }
  };

  return (
    <div className="auth-modal-overlay">
      <div className="auth-modal-content">
        <span className="auth-close-button" onClick={closeModal}>
          &times;
        </span>
        <h2>Signup To MyShop</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="userName"
            placeholder="Enter Name"
            value={formData.userName}
            onChange={handleChange}
          />
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
          <input
            type="text"
            name="userAddress"
            placeholder="Enter Address"
            value={formData.userAddress}
            onChange={handleChange}
          />
          <input
            type="number"
            name="userContact"
            placeholder="Enter Contact Number"
            value={formData.userContact}
            onChange={handleChange}
          />
          <select name="Gender" value={formData.Gender} onChange={handleChange}>
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="others">Others</option>
          </select>
          <input
            type="number"
            name="Age"
            placeholder="Enter Age"
            value={formData.Age}
            onChange={handleChange}
          />
          <button type="submit">Signup</button>
        </form>

        <p className="auth-switch-text">
          Already have an account?{" "}
          <span
            onClick={() => {
              closeModal();
              openLoginModal();
            }}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default SignupModal;
