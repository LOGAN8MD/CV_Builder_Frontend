import axios from "axios";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { Url } from "../config";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  // Live validation
  const validate = (field, value) => {
    let message = "";

    if (!value) {
      message = "This field is required";
    } else if (field === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) message = "Invalid email format";
    } else if (field === "password") {
      if (value.length < 6) message = "Password must be at least 6 characters";
    }

    setErrors((prev) => ({ ...prev, [field]: message }));
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    validate(field, value);
  };

  // const submit = async () => {
  //   // Check all fields before submit
  //   Object.entries(form).forEach(([field, value]) => validate(field, value));

  //   if (Object.values(errors).some((msg) => msg)) return; // Stop if any validation errors
  //   setServerError("");
  //   setLoading(true);

  //   try {
  //     const res = await axios.post(`${Url}/api/auth/login`, form);
  //     login(res.data.user, res.data.token);
  //   } catch (err) {
  //     setServerError(err.response?.data?.msg || "Something went wrong");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const submit = async () => {
  // Validate all fields
  let validationErrors = {};
  Object.entries(form).forEach(([field, value]) => {
    let message = "";
    if (!value) message = "This field is required";
    else if (field === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) message = "Invalid email format";
    } else if (field === "password") {
      if (value.length < 6) message = "Password must be at least 6 characters";
    }
    if (message) validationErrors[field] = message;
  });

  setErrors(validationErrors);

  if (Object.keys(validationErrors).length > 0) return; // Stop if any errors

  setServerError("");
  setLoading(true);

  try {
    const res = await axios.post(`${Url}/api/auth/login`, form);
   
    // Save user and token
    login(res.data.user, res.data.token);
     console.log(res.data)
    // Redirect to dashboard
    navigate("/");

  } catch (err) {
    setServerError(err.response?.data?.msg || "Something went wrong");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-lg border p-8 rounded w-full max-w-md space-y-4">
        <h1 className="text-2xl font-bold text-center mb-4">Login</h1>

        {serverError && <p className="bg-red-200 text-red-700 p-2 text-center rounded">{serverError}</p>}

        <div>
          <input
            type="email"
            placeholder="Email"
            className="border w-full p-2 rounded"
            value={form.email}
            onChange={(e) => handleChange("email", e.target.value)}
          />
          {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
        </div>

        <div>
          <input
            type="password"
            placeholder="Password"
            className="border w-full p-2 rounded"
            value={form.password}
            onChange={(e) => handleChange("password", e.target.value)}
          />
          {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password}</p>}
        </div>

        <button
          onClick={submit}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="text-center text-sm">
          Don't have an account?{" "}
          <span
            className="text-blue-600 cursor-pointer"
            onClick={() => navigate("/register")}
          >
            Register
          </span>
        </p>
      </div>
    </div>
  );
}
