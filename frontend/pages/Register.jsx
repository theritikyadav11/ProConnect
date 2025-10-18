import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/api";
import { useRecoilValue } from "recoil";
import { authAtom } from "../state/authAtom";

export default function Register() {
  const auth = useRecoilValue(authAtom);
  const navigate = useNavigate();

  // if already logged in, redirect to dashboard/home
  useEffect(() => {
    if (auth?.token) navigate("/");
  }, [auth, navigate]);

  const [form, setForm] = useState({
    name: "",
    email: "",
    uname: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      // backend expects { name, email, uname, password } per your sample
      await registerUser(form);
      // success -> go to login
      navigate("/login");
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>
        <form onSubmit={handleSubmit}>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            type="text"
            placeholder="Name"
            className="w-full p-2 mb-3 border rounded-md"
          />
          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            type="email"
            placeholder="Email"
            className="w-full p-2 mb-3 border rounded-md"
          />
          <input
            name="uname"
            value={form.uname}
            onChange={handleChange}
            type="text"
            placeholder="Username"
            className="w-full p-2 mb-3 border rounded-md"
          />
          <input
            name="password"
            value={form.password}
            onChange={handleChange}
            type="password"
            placeholder="Password"
            className="w-full p-2 mb-3 border rounded-md"
          />
          {error && <div className="text-red-600 mb-2 text-sm">{error}</div>}

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded-md"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
        <p className="text-center text-sm mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-green-600 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
