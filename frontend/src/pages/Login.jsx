import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { getAuthErrorMessage, useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      setLoading(true);
      await login(form.email, form.password);
      toast.success("Logged in successfully");
      navigate("/dashboard");
    } catch (error) {
      toast.error(getAuthErrorMessage(error, "Login failed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen place-items-center bg-slate-950 px-5 text-white">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-[2rem] border border-white/10 bg-white/5 p-8"
      >
        <h1 className="text-3xl font-black">Welcome Back</h1>
        <p className="mt-2 text-slate-400">Login to manage your services.</p>

        <div className="mt-6 space-y-4">
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email address"
            className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 outline-none focus:border-cyan-400"
          />

          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 outline-none focus:border-cyan-400"
          />

          <button
            disabled={loading}
            className="w-full rounded-2xl bg-cyan-400 px-4 py-3 font-black text-slate-950 disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </div>

        <p className="mt-5 text-center text-sm text-slate-400">
          New here?{" "}
          <Link to="/signup" className="font-bold text-cyan-300">
            Create account
          </Link>
        </p>
      </form>
    </div>
  );
}
