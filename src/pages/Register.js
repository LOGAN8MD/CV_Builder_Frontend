import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Url } from "../config";


export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    email: "",
    contact: "",
    password: ""
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  // Live validation
  const validate = (field, value) => {
    let message = "";

    if (!value) {
      message = "This field is required";
    } else {
      if (field === "email") {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) message = "Invalid email format";
      }
      if (field === "password" && value.length < 6) {
        message = "Password must be at least 6 characters";
      }
      if (field === "contact" && value && !/^\d{10}$/.test(value)) {
        message = "Contact must be 10 digits";
      }
    }

    setErrors((prev) => ({ ...prev, [field]: message }));
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    validate(field, value);
  };

  const submitForm = async () => {
    // Validate all fields
    Object.entries(form).forEach(([field, value]) => validate(field, value));

    if (Object.values(errors).some((msg) => msg)) return; // Stop if any errors

    setServerError("");
    setLoading(true);

    try {
      const res = await axios.post(`${Url}/api/auth/register`, form);
      alert(res.data.msg || "Registration successful!");
      navigate("/login");
    } catch (err) {
      setServerError(err.response?.data?.msg || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-lg border p-8 rounded w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">Register</h1>

        {serverError && <p className="bg-red-200 text-red-700 p-2 text-center mb-3 rounded">{serverError}</p>}

        <div className="space-y-4">
          <div>
            <input
              type="text"
              name="username"
              placeholder="Username*"
              className="border w-full p-2 rounded"
              value={form.username}
              onChange={(e) => handleChange("username", e.target.value)}
            />
            {errors.username && <p className="text-red-600 text-sm mt-1">{errors.username}</p>}
          </div>

          <div>
            <input
              type="email"
              name="email"
              placeholder="Email*"
              className="border w-full p-2 rounded"
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
            />
            {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
          </div>

          <div>
            <input
              type="text"
              name="contact"
              placeholder="Contact Number"
              className="border w-full p-2 rounded"
              value={form.contact}
              onChange={(e) => handleChange("contact", e.target.value)}
            />
            {errors.contact && <p className="text-red-600 text-sm mt-1">{errors.contact}</p>}
          </div>

          <div>
            <input
              type="password"
              name="password"
              placeholder="Password*"
              className="border w-full p-2 rounded"
              value={form.password}
              onChange={(e) => handleChange("password", e.target.value)}
            />
            {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password}</p>}
          </div>

          <button
            onClick={submitForm}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Registering..." : "Register"}
          </button>

        

          <p className="text-center text-sm">
            Already have an account?{" "}
            <span
              className="text-blue-600 cursor-pointer"
              onClick={() => navigate("/login")}
            >
              Login
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
