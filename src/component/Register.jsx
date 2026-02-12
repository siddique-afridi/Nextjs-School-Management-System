import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {

    const navigate = useNavigate()
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // here the form is submitted to backend and database through register api
    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      // here we are getting response from backend whether we got success or have some error
      const data = await res.json();
      if (res.ok) {
        alert( data.message);
        setEmail("");
        setPassword("");
        setUsername("");
        navigate("/login")
      } else {
        alert("Error:" + data.message);
      }
    } 
    catch (err) {
      alert(","+ err.message);
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 to-blue-200 flex justify-center items-center">
      <div className="w-full bg-white max-w-md p-8 shadow-xl rounded-2xl">
        <div className="flex flex-col justify-center items-center">
          <h1 className="text-3xl font-bold text-gray-800 text-center mb-1">
            Registration Form
          </h1>
          <p className="mb-12">Sign up to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your name"
              className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
             className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          <button
            className="w-full block mx-auto px-4 py-2 bg-blue-600 text-white rounded-lg"
            type="submit"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
