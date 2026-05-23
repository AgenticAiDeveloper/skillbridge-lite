import { Link, NavLink, useNavigate } from "react-router-dom";
import { BriefcaseBusiness, LogOut, Sparkles, PlusCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out successfully");
    navigate("/");
  };

  const linkClass = ({ isActive }) =>
    isActive
      ? "text-cyan-300 font-bold"
      : "text-slate-300 hover:text-white";

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/70 backdrop-blur-2xl"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-6">
        <Link to="/" className="flex items-center gap-3 text-xl font-black text-white">
          <span className="rounded-2xl bg-cyan-400 p-2.5 text-slate-950 shadow-lg shadow-cyan-500/25">
            <BriefcaseBusiness size={20} />
          </span>
          <span>
            SkillBridge <span className="gradient-text">Lite</span>
          </span>
        </Link>

        <div className="hidden items-center gap-7 text-sm md:flex">
          <NavLink to="/services" className={linkClass}>
            Marketplace
          </NavLink>

          {user ? (
            <>
              <NavLink to="/dashboard" className={linkClass}>
                Dashboard
              </NavLink>

              <Link
                to="/create-service"
                className="inline-flex items-center gap-2 rounded-2xl bg-cyan-400 px-4 py-2 font-black text-slate-950 shadow-lg shadow-cyan-500/20 hover:scale-105"
              >
                <PlusCircle size={16} />
                Create
              </Link>

              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-white hover:bg-white/10"
              >
                <LogOut size={16} />
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={linkClass}>
                Login
              </NavLink>
              <Link
                to="/signup"
                className="inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-2 font-black text-slate-950 hover:scale-105"
              >
                <Sparkles size={16} />
                Join Now
              </Link>
            </>
          )}
        </div>

        <Link
          to={user ? "/dashboard" : "/signup"}
          className="rounded-xl bg-cyan-400 px-3 py-2 text-xs font-black text-slate-950 md:hidden"
        >
          Menu
        </Link>
      </div>
    </motion.nav>
  );
}