import { Link } from "react-router-dom";
import {
  ArrowRight,
  Boxes,
  BriefcaseBusiness,
  Rocket,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  UploadCloud,
  WalletCards,
} from "lucide-react";
import { motion } from "framer-motion";

const categories = [
  "AI Automation",
  "Web Apps",
  "UI/UX Design",
  "Mobile Apps",
  "Branding",
  "SEO",
];

const featured = [
  {
    title: "AI Business Automation",
    price: "$120",
    tag: "AI Services",
    rating: "4.9",
  },
  {
    title: "Premium SaaS Landing Page",
    price: "$95",
    tag: "Web Design",
    rating: "5.0",
  },
  {
    title: "Full-Stack MVP Development",
    price: "$350",
    tag: "Development",
    rating: "4.8",
  },
];

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden text-white">
      <div className="hero-grid pointer-events-none absolute inset-0 opacity-50" />
      <div className="pointer-events-none absolute left-[-10rem] top-16 h-96 w-96 rounded-full bg-cyan-500/20 blur-3xl" />
      <div className="pointer-events-none absolute right-[-10rem] top-32 h-96 w-96 rounded-full bg-purple-500/20 blur-3xl" />

      <section className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 md:py-24 lg:grid-cols-[1.05fr_0.95fr]">
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65 }}
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-sm font-semibold text-cyan-100">
            <Sparkles size={16} />
            Firebase Auth + FastAPI + MongoDB + Cloudinary
          </div>

          <h1 className="max-w-4xl text-5xl font-black leading-[1.02] tracking-tight md:text-7xl">
            Build, sell, and hire digital services on a{" "}
            <span className="gradient-text">premium marketplace.</span>
          </h1>

          <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-300">
            SkillBridge Lite is a professional freelance marketplace with secure login,
            service publishing, image uploads, powerful discovery, and a glass-dashboard
            experience designed like a real SaaS product.
          </p>

          <div className="mt-9 flex flex-col gap-4 sm:flex-row">
            <Link
              to="/services"
              className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-cyan-400 px-7 py-4 font-black text-slate-950 shadow-2xl shadow-cyan-500/25 hover:scale-[1.03]"
            >
              Explore Marketplace
              <ArrowRight className="group-hover:translate-x-1" size={20} />
            </Link>

            <Link
              to="/create-service"
              className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-7 py-4 font-bold text-white hover:bg-white/10"
            >
              Become a Seller
            </Link>
          </div>

          <div className="mt-10 grid max-w-2xl grid-cols-3 gap-3">
            <Stat value="2.8K+" label="Creators" />
            <Stat value="$1.2M" label="Projects" />
            <Stat value="4.9/5" label="Rating" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.1 }}
          className="glass relative rounded-[2rem] p-4 md:p-6"
        >
          <div className="rounded-[1.6rem] border border-white/10 bg-slate-950/70 p-5">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Live marketplace</p>
                <h3 className="text-2xl font-black">Featured Services</h3>
              </div>
              <div className="rounded-2xl bg-cyan-400/10 p-3 text-cyan-300">
                <BriefcaseBusiness />
              </div>
            </div>

            <div className="grid gap-4">
              {featured.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, x: 22 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.25 + index * 0.12 }}
                  className="rounded-3xl border border-white/10 bg-white/[0.055] p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className="rounded-full bg-cyan-400/10 px-3 py-1 text-xs font-bold text-cyan-300">
                        {item.tag}
                      </span>
                      <h4 className="mt-3 text-lg font-black">{item.title}</h4>
                      <div className="mt-2 flex items-center gap-1 text-sm text-amber-300">
                        <Star size={15} fill="currentColor" />
                        {item.rating}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-500">From</p>
                      <p className="text-2xl font-black text-cyan-300">{item.price}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-5 grid grid-cols-2 gap-4">
              <MiniCard icon={<ShieldCheck />} title="Secure Auth" />
              <MiniCard icon={<UploadCloud />} title="Image Upload" />
            </div>
          </div>
        </motion.div>
      </section>

      <section className="relative mx-auto max-w-7xl px-5 pb-20">
        <div className="grid gap-5 md:grid-cols-3">
          <Feature icon={<Search />} title="Smart Discovery" text="Search and filter services with a clean marketplace experience." />
          <Feature icon={<WalletCards />} title="Order Ready" text="Structure supports orders, status tracking, and buyer dashboards." />
          <Feature icon={<Rocket />} title="Deploy Ready" text="Frontend for Vercel, backend for Render, database for Atlas." />
        </div>

        <div className="mt-10 glass rounded-[2rem] p-6">
          <div className="mb-5 flex items-center gap-3">
            <Boxes className="text-cyan-300" />
            <h2 className="text-2xl font-black">Popular Categories</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            {categories.map((cat) => (
              <Link
                to="/services"
                key={cat}
                className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-bold text-slate-200 hover:border-cyan-300/40 hover:bg-cyan-300/10 hover:text-cyan-200"
              >
                {cat}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

function Stat({ value, label }) {
  return (
    <div className="glass-soft rounded-3xl p-4">
      <h3 className="text-2xl font-black text-cyan-300">{value}</h3>
      <p className="text-sm text-slate-400">{label}</p>
    </div>
  );
}

function MiniCard({ icon, title }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-4">
      <div className="mb-3 text-cyan-300">{icon}</div>
      <h4 className="font-black">{title}</h4>
    </div>
  );
}

function Feature({ icon, title, text }) {
  return (
    <motion.div
      whileHover={{ y: -7 }}
      className="glass rounded-[2rem] p-6"
    >
      <div className="mb-5 inline-flex rounded-2xl bg-cyan-400/10 p-3 text-cyan-300">
        {icon}
      </div>
      <h3 className="text-xl font-black">{title}</h3>
      <p className="mt-3 leading-7 text-slate-400">{text}</p>
    </motion.div>
  );
}
