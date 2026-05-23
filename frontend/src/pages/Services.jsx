import { useCallback, useEffect, useMemo, useState } from "react";
import { AlertTriangle, Filter, Search, Star, Zap } from "lucide-react";
import toast from "react-hot-toast";
import { getServices } from "../lib/api";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const demoServices = [
  {
    id: "demo-1",
    title: "I will build an AI-powered business automation system",
    description:
      "Premium AI workflow automation using dashboards, API integrations, and smart business logic.",
    category: "AI Services",
    price: 120,
    delivery_time: 3,
    image_url:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1200&auto=format&fit=crop",
    owner_email: "ai.engineer@skillbridge.dev",
    demo: true,
  },
  {
    id: "demo-2",
    title: "I will design a glassmorphism SaaS landing page",
    description:
      "Modern responsive UI with premium layout, animations, and conversion-focused sections.",
    category: "Graphic Design",
    price: 95,
    delivery_time: 2,
    image_url:
      "https://images.unsplash.com/photo-1559028012-481c04fa702d?q=80&w=1200&auto=format&fit=crop",
    owner_email: "designer@skillbridge.dev",
    demo: true,
  },
  {
    id: "demo-3",
    title: "I will develop a full-stack MVP with React and FastAPI",
    description:
      "Complete MVP with authentication, backend APIs, database, deployment pipeline, and clean code.",
    category: "Web Development",
    price: 350,
    delivery_time: 7,
    image_url:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop",
    owner_email: "fullstack@skillbridge.dev",
    demo: true,
  },
  {
    id: "demo-4",
    title: "I will create a mobile app UI kit for your startup",
    description:
      "Beautiful mobile app screens, components, dashboard layouts, and user flows for your idea.",
    category: "Mobile App",
    price: 180,
    delivery_time: 4,
    image_url:
      "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=1200&auto=format&fit=crop",
    owner_email: "mobile.ui@skillbridge.dev",
    demo: true,
  },
  {
    id: "demo-5",
    title: "I will write SEO optimized website content",
    description:
      "High-quality landing page copy, product descriptions, blogs, and business content.",
    category: "Content Writing",
    price: 60,
    delivery_time: 2,
    image_url:
      "https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=1200&auto=format&fit=crop",
    owner_email: "writer@skillbridge.dev",
    demo: true,
  },
  {
    id: "demo-6",
    title: "I will run a digital marketing launch campaign",
    description:
      "Social media launch strategy, ad copy, marketing funnel, and campaign planning.",
    category: "Digital Marketing",
    price: 140,
    delivery_time: 5,
    image_url:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop",
    owner_email: "growth@skillbridge.dev",
    demo: true,
  },
];

const categories = [
  "All",
  "Web Development",
  "Graphic Design",
  "Mobile App",
  "Digital Marketing",
  "Content Writing",
  "AI Services",
];

export default function Services() {
  const [services, setServices] = useState([]);
  const [usingDemo, setUsingDemo] = useState(false);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("latest");
  const [loading, setLoading] = useState(true);

  const fetchServices = useCallback(async () => {
    try {
      setLoading(true);
      setUsingDemo(false);

      const data = await getServices({
        search: search || undefined,
        category: category !== "All" ? category : undefined,
      });

      const realServices = data.services || [];

      if (realServices.length === 0) {
        setServices(demoServices);
        setUsingDemo(true);
      } else {
        setServices(realServices);
      }
    } catch {
      setServices(demoServices);
      setUsingDemo(true);
      toast.error("Backend unavailable, showing premium demo marketplace");
    } finally {
      setLoading(false);
    }
  }, [category, search]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const visibleServices = useMemo(() => {
    let list = [...services];

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (s) =>
          s.title?.toLowerCase().includes(q) ||
          s.description?.toLowerCase().includes(q) ||
          s.category?.toLowerCase().includes(q)
      );
    }

    if (category !== "All") {
      list = list.filter((s) => s.category === category);
    }

    if (sort === "price-low") {
      list.sort((a, b) => Number(a.price) - Number(b.price));
    }

    if (sort === "price-high") {
      list.sort((a, b) => Number(b.price) - Number(a.price));
    }

    if (sort === "delivery") {
      list.sort((a, b) => Number(a.delivery_time) - Number(b.delivery_time));
    }

    return list;
  }, [services, search, category, sort]);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchServices();
  };

  return (
    <main className="min-h-screen px-5 py-10 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 glass rounded-[2rem] p-6 md:p-8">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-cyan-400/10 px-4 py-2 text-sm font-bold text-cyan-200">
                <Zap size={16} />
                Premium Service Marketplace
              </div>

              <h1 className="text-4xl font-black md:text-6xl">
                Explore <span className="gradient-text">Elite Services</span>
              </h1>
              <p className="mt-3 max-w-2xl text-slate-300">
                Browse professional services from creators, developers, designers,
                marketers, writers, and AI engineers.
              </p>

              {usingDemo && (
                <div className="mt-5 flex items-start gap-3 rounded-2xl border border-amber-300/20 bg-amber-300/10 p-4 text-sm text-amber-100">
                  <AlertTriangle size={18} className="mt-0.5 shrink-0" />
                  Backend/MongoDB is unavailable right now, so this page is showing
                  premium demo data. Real data will appear automatically after backend works.
                </div>
              )}
            </div>

            <Link
              to="/create-service"
              className="rounded-2xl bg-cyan-400 px-6 py-4 text-center font-black text-slate-950 shadow-xl shadow-cyan-500/20 hover:scale-[1.02]"
            >
              Create Service
            </Link>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 grid gap-4 lg:grid-cols-[1fr_220px_220px_120px]">
            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/70 px-4">
              <Search size={18} className="text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search AI, website, design, marketing..."
                className="w-full bg-transparent py-4 outline-none"
              />
            </div>

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-4 outline-none"
            >
              {categories.map((cat) => (
                <option key={cat}>{cat}</option>
              ))}
            </select>

            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-4 outline-none"
            >
              <option value="latest">Latest</option>
              <option value="price-low">Price Low</option>
              <option value="price-high">Price High</option>
              <option value="delivery">Fast Delivery</option>
            </select>

            <button className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-4 font-black text-slate-950">
              <Filter size={18} />
              Filter
            </button>
          </form>
        </div>

        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-96 animate-pulse rounded-[2rem] bg-white/5" />
            ))}
          </div>
        ) : visibleServices.length === 0 ? (
          <div className="glass rounded-[2rem] p-10 text-center text-slate-300">
            No services found.
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {visibleServices.map((service, index) => (
              <ServiceCard key={service.id} service={service} index={index} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

function ServiceCard({ service, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 26 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -8 }}
      className="group overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.055] shadow-2xl shadow-black/20 backdrop-blur-xl"
    >
      <div className="relative">
        {service.image_url ? (
          <img
            src={service.image_url}
            alt={service.title}
            className="h-56 w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="grid h-56 place-items-center bg-slate-900 text-slate-500">
            No Image
          </div>
        )}

        <div className="absolute left-4 top-4 rounded-full bg-slate-950/70 px-3 py-1 text-xs font-black text-cyan-200 backdrop-blur">
          {service.category}
        </div>

        {service.demo && (
          <div className="absolute right-4 top-4 rounded-full bg-amber-300 px-3 py-1 text-xs font-black text-slate-950">
            Demo
          </div>
        )}
      </div>

      <div className="p-5">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-1 text-sm text-amber-300">
            <Star size={15} fill="currentColor" />
            4.9
          </div>
          <p className="text-xs text-slate-500">{service.delivery_time} days delivery</p>
        </div>

        <h3 className="text-xl font-black leading-snug">{service.title}</h3>

        <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-400">
          {service.description}
        </p>

        <div className="mt-6 flex items-end justify-between border-t border-white/10 pt-5">
          <div>
            <p className="text-xs text-slate-500">Seller</p>
            <p className="max-w-[170px] truncate text-sm font-semibold text-slate-300">
              {service.owner_email}
            </p>
          </div>

          <div className="text-right">
            <p className="text-xs text-slate-500">Starting at</p>
            <p className="text-2xl font-black text-cyan-300">${service.price}</p>
          </div>
        </div>

        <button className="mt-5 w-full rounded-2xl bg-cyan-400 px-4 py-3 font-black text-slate-950 hover:scale-[1.02]">
          View Package
        </button>
      </div>
    </motion.div>
  );
}
