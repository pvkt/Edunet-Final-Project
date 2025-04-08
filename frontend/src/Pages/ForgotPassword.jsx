import React, { useState } from "react";
import axios from "axios";

const ForgotPassword = () => {
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const res = await axios.post("http://localhost:4000/forgot-password", {
        emailOrUsername,
      });
      setMessage(res.data.message);
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 shadow-xl rounded-xl bg-white">
      <h2 className="text-2xl font-bold mb-4">Forgot Password</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Email or Username"
          value={emailOrUsername}
          onChange={(e) => setEmailOrUsername(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded mb-4"
        />
        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">
          Send Reset Link
        </button>
      </form>
      {message && <p className="mt-4 text-green-600">{message}</p>}
      {error && <p className="mt-4 text-red-600">{error}</p>}
    </div>
  );
};

export default ForgotPassword;
