import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  BarChart3,
  BriefcaseBusiness,
  Clock,
  DollarSign,
  Mail,
  PlusCircle,
  ShieldCheck,
  Star,
  TrendingUp,
  User,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { deleteService, getApiErrorMessage, getServices } from "../lib/api";

export default function Dashboard() {
  const { getToken, user } = useAuth();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchServices = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getServices();
      setServices(
        (data.services || []).filter((service) => service.owner_uid === user?.uid)
      );
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to load dashboard services"));
    } finally {
      setLoading(false);
    }
  }, [user?.uid]);

  useEffect(() => {
    if (user?.uid) {
      fetchServices();
    }
  }, [fetchServices, user?.uid]);

  const totalValue = useMemo(
    () => services.reduce((sum, service) => sum + Number(service.price || 0), 0),
    [services]
  );

  const fastestDelivery = useMemo(() => {
    if (services.length === 0) return "0d";
    return `${Math.min(...services.map((service) => Number(service.delivery_time || 0)))}d`;
  }, [services]);

  const handleDelete = async (serviceId) => {
    try {
      const token = await getToken();
      await deleteService(serviceId, token);
      setServices((current) => current.filter((service) => service.id !== serviceId));
      toast.success("Service deleted");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to delete service"));
    }
  };

  return (
    <main className="min-h-screen px-5 py-10 text-white">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-[2rem] p-6 md:p-8"
        >
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-cyan-400/10 px-4 py-2 text-sm font-bold text-cyan-200">
                <ShieldCheck size={16} />
                Seller Workspace
              </div>
              <h1 className="text-4xl font-black md:text-6xl">
                Welcome, <span className="gradient-text">{user?.displayName || "Creator"}</span>
              </h1>
              <p className="mt-3 text-slate-300">
                Manage your services, track performance, and build your freelance brand.
              </p>
            </div>

            <Link
              to="/create-service"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-cyan-400 px-6 py-4 font-black text-slate-950 shadow-xl shadow-cyan-500/20"
            >
              <PlusCircle size={20} />
              Create Service
            </Link>
          </div>
        </motion.div>

        <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          <Stat icon={<BriefcaseBusiness />} label="Active Services" value={services.length} />
          <Stat icon={<DollarSign />} label="Listed Value" value={`$${totalValue}`} />
          <Stat icon={<Star />} label="Profile Status" value="Live" />
          <Stat icon={<TrendingUp />} label="Fastest Delivery" value={fastestDelivery} />
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="glass rounded-[2rem] p-6">
            <div className="mb-6 flex items-center gap-3">
              <User className="text-cyan-300" />
              <h2 className="text-2xl font-black">Profile</h2>
            </div>

            <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-5">
              <div className="grid h-20 w-20 place-items-center rounded-3xl bg-cyan-400 text-3xl font-black text-slate-950">
                {(user?.displayName || user?.email || "U").charAt(0).toUpperCase()}
              </div>

              <h3 className="mt-5 text-2xl font-black">
                {user?.displayName || "SkillBridge User"}
              </h3>

              <div className="mt-3 flex items-center gap-2 text-slate-400">
                <Mail size={16} />
                {user?.email}
              </div>

              <div className="mt-5 rounded-2xl bg-cyan-400/10 p-4 text-sm text-cyan-100">
                Your Firebase account is active and protected.
              </div>
            </div>
          </div>

          <div className="glass rounded-[2rem] p-6">
            <div className="mb-6 flex items-center gap-3">
              <BarChart3 className="text-cyan-300" />
              <h2 className="text-2xl font-black">Your Services</h2>
            </div>

            {loading ? (
              <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-5 text-slate-300">
                Loading services...
              </div>
            ) : services.length === 0 ? (
              <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-5 text-slate-300">
                No services published yet.
              </div>
            ) : (
              <div className="space-y-4">
                {services.map((service) => (
                  <Activity
                    key={service.id}
                    title={service.title}
                    time={`$${service.price} • ${service.delivery_time}d`}
                    onDelete={() => handleDelete(service.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

function Stat({ icon, label, value }) {
  return (
    <motion.div whileHover={{ y: -6 }} className="glass rounded-[2rem] p-6">
      <div className="mb-5 inline-flex rounded-2xl bg-cyan-400/10 p-3 text-cyan-300">
        {icon}
      </div>
      <p className="text-sm text-slate-400">{label}</p>
      <h3 className="mt-1 text-3xl font-black">{value}</h3>
    </motion.div>
  );
}

function Activity({ title, time, onDelete }) {
  return (
    <div className="flex items-center justify-between rounded-3xl border border-white/10 bg-slate-950/60 p-4">
      <div className="flex items-center gap-3">
        <div className="rounded-2xl bg-cyan-400/10 p-3 text-cyan-300">
          <Clock size={18} />
        </div>
        <h4 className="font-bold">{title}</h4>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-sm text-slate-500">{time}</span>
        {onDelete && (
          <button
            onClick={onDelete}
            className="rounded-xl bg-red-500/10 px-3 py-2 text-xs font-black text-red-200 hover:bg-red-500/20"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}
