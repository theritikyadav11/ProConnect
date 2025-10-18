// src/pages/Login.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser, getUserProfile } from "../services/api"; // adjust path
import { useSetRecoilState, useRecoilValue } from "recoil";
import { authAtom } from "../state/authAtom";

export default function Login() {
  const auth = useRecoilValue(authAtom);
  const setAuth = useSetRecoilState(authAtom);
  const navigate = useNavigate();

  useEffect(() => {
    if (auth?.token) navigate("/");
  }, [auth, navigate]);

  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await loginUser(form);
      // backend returns token only per your note
      const token = res.data?.token ?? res.data;
      if (!token) throw new Error("No token returned by server");

      // save token (so interceptor will attach it for future requests)
      localStorage.setItem("token", token);

      // set token in recoil immediately
      setAuth({ token, user: null });

      // fetch user profile (if backend supports it)
      try {
        const profileRes = await getUserProfile();
        const user = profileRes.data?.user ?? profileRes.data;
        setAuth((prev) => ({ ...prev, user }));
      } catch (profileErr) {
        // optional: just continue if fetching profile fails
        console.error("fetch profile error:", profileErr);
      }

      // redirect to main/dashboard (App will render the authenticated layout)
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
        <form onSubmit={handleSubmit}>
          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            type="email"
            placeholder="Email"
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
            className="w-full bg-blue-600 text-white py-2 rounded-md"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <p className="text-center text-sm mt-4">
          Don’t have an account?{" "}
          <Link to="/register" className="text-blue-600 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
