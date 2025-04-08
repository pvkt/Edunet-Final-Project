import React, { useState } from "react";
import "./CSS/LoginSignup.css";


const LoginSignup = () => {
  const [state, setState] = useState("Login");

  // Form Data & Errors State
  const [formData, setFormData] = useState({
    username: "",
    gender: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    address: "",
    pincode: "",
  });

  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState(""); // Stores API error messages

  // Input Change Handler
  const changeHandler = (e) => {
    const { name, value, type } = e.target;
    if ((name === "phone" || name === "pincode") && !/^\d*$/.test(value)) return;

    setFormData({
      ...formData,
      [name]: type === "radio" ? value : value,
    });

    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  // Clear API error when user clicks on an input field
  const clearApiError = () => {
    setApiError("");
  };

  // Form Validation
  const validateForm = () => {
    let newErrors = {};

    if (!/^[a-z0-9 ]{3,15}$/.test(formData.username.trim())) {
      newErrors.username = "Username must be 3-15 characters (a-z, 0-9, space only)";
    }
        
    if (state === "Sign Up") {
      if (!formData.gender) newErrors.gender = "Please select a gender.";
      if (!/^\d{10}$/.test((formData.phone || "").trim())) { newErrors.phone = "Enter a valid 10-digit phone number.";};
      if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Enter a valid email.";
      if (formData.password.length < 8) {  //! password validation
        newErrors.password = "Password should be at least 8 characters.";
      } else if (formData.password.length > 18) {
        newErrors.password = "Password should be less than 18 characters.";
      } else if (!/^[A-Za-z0-9@#!_]+$/.test(formData.password)) {
        newErrors.password = "Password can only contain letters, numbers, and @, #, !, _.";
      } else if (!/(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[@#!_])/.test(formData.password)) {
        newErrors.password = "Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character (@, #, !, _)";
      };
      if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match.";
      if (
        !formData.address.trim() || 
        formData.address.length > 50 || 
        !/^[A-Za-z0-9\s,/-]+$/.test(formData.address)
      ) {
        newErrors.address = "Address must be < 50 characters and only allow A-Z or a-z & spaces, ',', '/', or '-' ";
      }      ;
      if (!/^\d{6}$/.test(formData.pincode)) newErrors.pincode = "Enter a valid 6-digit pincode.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  //!  API Request Handler changed code
  // API Request Handler
  const apiRequest = async (endpoint, body) => {
    try {
      const response = await fetch(`http://localhost:4000/${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        const errorMessage =
          typeof data.errors === "string"
            ? data.errors
            : Object.values(data.errors || {}).filter(Boolean).join(" | ") || "Something went wrong!";
        throw new Error(errorMessage);
      }
  
      return data;
    } catch (error) {
      console.error("API Error:", error.message);
      setApiError(error.message);
      return null;
    }
  };
  

  // Login Function
  const login = async () => {
    if (!formData.email || !formData.password) {
      setErrors({ email: "Email is required.", password: "Password is required." });
      return;
    }

    const dataObj = await apiRequest("login", { emailOrUsername: formData.email, password: formData.password });

    if (dataObj?.success) {
      localStorage.setItem("auth-token", dataObj.token);
      window.location.replace("/");
    }
  };

  // Signup Function
  const signup = async () => {
    if (!validateForm()) return;

    const dataObj = await apiRequest("signup", formData);
    if (dataObj?.success) {
      localStorage.setItem("auth-token", dataObj.token);
      localStorage.removeItem("cartItems");
      window.location.replace("/");
    }
  };

  return (
    <div className="loginsignup">
      <div className="loginsignup-container">
        <h1>{state}</h1>

        {/* Error message for invalid login */}
        {apiError && <div className="error-message">{apiError}</div>}

        <div className="loginsignup-fields">
          {state === "Login" && (
            <>
              <input type="email" placeholder="Email Address" name="email" value={formData.email} onChange={changeHandler} onFocus={clearApiError} />
              <span className="error">{errors.email}</span>

              <input type="password" placeholder="Password" name="password" value={formData.password} onChange={changeHandler} onFocus={clearApiError} />
              <span className="error">{errors.password}</span>

              <p className="text-sm text-blue-600 mt-2">
                <a href="/forgot-password">Forgot Password?</a>
              </p>
            </>
          )}

          {state === "Sign Up" && (
            <>
              <input type="text" placeholder="Username" name="username" value={formData.username} onChange={changeHandler} />
              <span className="error">{errors.username}</span>

              <div className="gender-selection">
                <label>Gender:</label>
                <div className="gender-options">
                  <label>
                    <input type="radio" name="gender" value="male" onChange={changeHandler} checked={formData.gender === "male"} />
                    Male
                  </label>
                  <label>
                    <input type="radio" name="gender" value="female" onChange={changeHandler} checked={formData.gender === "female"} />
                    Female
                  </label>
                </div>
              </div>
              <span className="error">{errors.gender}</span>

              <input type="email" placeholder="Email Address" name="email" value={formData.email} onChange={changeHandler} />
              <span className="error">{errors.email}</span>

              <input type="text" placeholder="Phone Number" name="phone" value={formData.phone} onChange={changeHandler} />
              <span className="error">{errors.phone}</span>

              <input type="password" placeholder="Password" name="password" value={formData.password} onChange={changeHandler} />
              <span className="error">{errors.password}</span>

              <input type="password" placeholder="Confirm Password" name="confirmPassword" value={formData.confirmPassword} onChange={changeHandler} />
              <span className="error">{errors.confirmPassword}</span>

              <input type="text" placeholder="Address" name="address" value={formData.address} onChange={changeHandler} />
              <span className="error">{errors.address}</span>

              <input type="text" placeholder="Pincode" name="pincode" value={formData.pincode} onChange={changeHandler} />
              <span className="error">{errors.pincode}</span>
            </>
          )}
        </div>

        <button onClick={() => (state === "Login" ? login() : signup())}>Continue</button>

        {state === "Login" ? (
          <p className="loginsignup-login">
            Create an account? <span onClick={() => { setState("Sign Up"); setApiError(""); }}>Click here</span>
          </p>
        ) : (
          <p className="loginsignup-login">
            Already have an account? <span onClick={() => { setState("Login"); setApiError(""); }}>Login here</span>
          </p>
        )}

        <div className="loginsignup-agree">
          <input type="checkbox" />
          <p>By continuing, I agree to the terms of use & privacy policy.</p>
        </div>
      </div>
    </div>
  );
};

export default LoginSignup;

