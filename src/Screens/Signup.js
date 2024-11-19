import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// import { Navigate } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    name: "",
    email: "",
    password: "",
    geolocation: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic frontend validation for name, email, and password
    if (credentials.name.length <= 5) {
      alert("Name must be greater than 5 characters");
      return;
    }

    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailPattern.test(credentials.email)) {
      alert("Invalid email format");
      return;
    }

    if (credentials.password.length <= 4) {
      alert("Password must be greater than 4 characters");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/createuser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: credentials.name,
          email: credentials.email,
          password: credentials.password,
          location: credentials.geolocation,
        }),
      });

      const data = await response.json();
      if (data.error) {
        alert(data.error); // Show error message returned by backend
      } else {
        alert("User created successfully!");
        navigate("/home");
      }
    } catch (error) {
      alert("An error occurred. Please try again.");
      console.error("Error:", error);
    }
  };

  const onChange = (event) => {
    setCredentials({ ...credentials, [event.target.name]: event.target.value });
  };

  return (
    <>
      <div className="container drp">
        <form className="drp1">
          <div className="mb-3">
            <label htmlFor="name" className="form-label">
              Name
            </label>
            <input
              type="text"
              className="form-control"
              onChange={onChange}
              name="name"
              value={credentials.name}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email address
            </label>
            <input
              type="email"
              className="form-control"
              onChange={onChange}
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
              onChange={onChange}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="geolocation" className="form-label">
              Address
            </label>
            <input
              type="text"
              className="form-control"
              name="geolocation"
              value={credentials.geolocation}
              onChange={onChange}
            />
          </div>
          <button
            type="submit"
            className="m-3 btn btn-success"
            onClick={handleSubmit}
          >
            Submit
          </button>
          <Link to="/login" className="m-3 btn btn-danger">
            Already a User
          </Link>
        </form>
      </div>
    </>
  );
}
