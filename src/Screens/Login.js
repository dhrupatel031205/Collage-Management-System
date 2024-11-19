import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  let navigate = useNavigate();
  const [credentials, setcredentials] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/loginuser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password,
        }),
      });

      const result = await response.json();
      if (response.ok && result.success) {
        alert("Login successful!");
        navigate("/home"); // Redirect to the homepage
      } else {
        alert(result.error || "Invalid login credentials.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
    }
  };

  const onchange = (event) => {
    setcredentials({ ...credentials, [event.target.name]: event.target.value });
  };

  return (
    <>
      <div className="container drp">
        <form className="drp1">
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email address
            </label>
            <input
              type="email"
              className="form-control"
              onChange={onchange}
              name="email"
              value={credentials.email}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              className="form-control"
              name="password"
              value={credentials.password}
              onChange={onchange}
            />
          </div>
          <button
            type="submit"
            className="m-3 btn btn-success"
            onClick={handleSubmit}
          >
            Submit
          </button>
          <Link to="/signup" className="m-3 btn btn-danger">
            I'm a new User
          </Link>
        </form>
      </div>
    </>
  );
}
