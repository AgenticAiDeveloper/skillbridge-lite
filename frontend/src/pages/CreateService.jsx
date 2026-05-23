import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ImagePlus, Rocket, ShieldCheck, Sparkles } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { createService, getApiErrorMessage } from "../lib/api";
import { motion } from "framer-motion";

export default function CreateService() {
  const { getToken } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "AI Services",
    price: "",
    delivery_time: "",
    image: null,
  });

  const [loading, setLoading] = useState(false);

  const previewUrl = useMemo(() => {
    if (!form.image) return null;
    return URL.createObjectURL(form.image);
  }, [form.image]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title || !form.description || !form.price || !form.delivery_time) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);

      const token = await getToken();

      if (!token) {
        toast.error("Please login first");
        return;
      }

      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("category", form.category);
      formData.append("price", form.price);
      formData.append("delivery_time", form.delivery_time);

      if (form.image) {
        formData.append("image", form.image);
      }

      await createService(formData, token);

      toast.success("Service created successfully");
      navigate("/services");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to create service"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen px-5 py-10 text-white">
      <div className="mx-auto max-w-7xl">
        <Link
          to="/dashboard"
          className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-cyan-300 hover:text-cyan-200"
        >
          <ArrowLeft size={17} />
          Back to dashboard
        </Link>

        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <motion.form
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleSubmit}
            className="glass rounded-[2rem] p-6 md:p-8"
          >
            <div className="mb-7">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-cyan-400/10 px-4 py-2 text-sm font-bold text-cyan-200">
                <Rocket size={16} />
                Launch a new service
              </div>

              <h1 className="text-4xl font-black md:text-5xl">
                Create <span className="gradient-text">Premium Service</span>
              </h1>
              <p className="mt-3 text-slate-300">
                Add a professional service listing with image, category, price, and delivery time.
              </p>
            </div>

            <div className="space-y-5">
              <Field label="Service Title">
                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Example: I will build an AI chatbot for your business"
                  className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-4 outline-none focus:border-cyan-400"
                />
              </Field>

              <Field label="Description">
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Explain what you will deliver, your process, and why clients should hire you..."
                  rows="6"
                  className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-4 outline-none focus:border-cyan-400"
                />
              </Field>

              <div className="grid gap-5 md:grid-cols-2">
                <Field label="Category">
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-4 outline-none focus:border-cyan-400"
                  >
                    <option>AI Services</option>
                    <option>Web Development</option>
                    <option>Graphic Design</option>
                    <option>Mobile App</option>
                    <option>Digital Marketing</option>
                    <option>Content Writing</option>
                  </select>
                </Field>

                <Field label="Service Image">
                  <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-dashed border-white/15 bg-slate-950/70 px-4 py-4 text-slate-300 hover:border-cyan-400">
                    <ImagePlus size={18} />
                    <span className="truncate">
                      {form.image ? form.image.name : "Choose image"}
                    </span>
                    <input
                      name="image"
                      type="file"
                      accept="image/*"
                      onChange={handleChange}
                      className="hidden"
                    />
                  </label>
                </Field>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <Field label="Price USD">
                  <input
                    name="price"
                    type="number"
                    value={form.price}
                    onChange={handleChange}
                    placeholder="120"
                    className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-4 outline-none focus:border-cyan-400"
                  />
                </Field>

                <Field label="Delivery Time">
                  <input
                    name="delivery_time"
                    type="number"
                    value={form.delivery_time}
                    onChange={handleChange}
                    placeholder="3"
                    className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-4 outline-none focus:border-cyan-400"
                  />
                </Field>
              </div>

              <button
                disabled={loading}
                className="w-full rounded-2xl bg-cyan-400 px-4 py-4 font-black text-slate-950 shadow-xl shadow-cyan-500/20 hover:scale-[1.01] disabled:opacity-60"
              >
                {loading ? "Publishing..." : "Publish Service"}
              </button>
            </div>
          </motion.form>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass rounded-[2rem] p-6 md:p-8"
          >
            <div className="mb-5 flex items-center gap-3">
              <Sparkles className="text-cyan-300" />
              <h2 className="text-2xl font-black">Live Preview</h2>
            </div>

            <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/70">
              {previewUrl ? (
                <img src={previewUrl} alt="Preview" className="h-64 w-full object-cover" />
              ) : (
                <div className="grid h-64 place-items-center bg-slate-900 text-slate-500">
                  Image preview will appear here
                </div>
              )}

              <div className="p-5">
                <span className="rounded-full bg-cyan-400/10 px-3 py-1 text-xs font-bold text-cyan-300">
                  {form.category}
                </span>

                <h3 className="mt-4 text-2xl font-black">
                  {form.title || "Your service title"}
                </h3>

                <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-400">
                  {form.description || "Your service description will appear here."}
                </p>

                <div className="mt-6 flex items-end justify-between border-t border-white/10 pt-5">
                  <div>
                    <p className="text-xs text-slate-500">Delivery</p>
                    <p className="font-bold">{form.delivery_time || 0} days</p>
                  </div>

                  <div className="text-right">
                    <p className="text-xs text-slate-500">Starting at</p>
                    <p className="text-3xl font-black text-cyan-300">
                      ${form.price || 0}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-5 rounded-3xl border border-cyan-300/20 bg-cyan-300/10 p-5">
              <div className="flex items-start gap-3">
                <ShieldCheck className="mt-1 shrink-0 text-cyan-300" />
                <p className="text-sm leading-6 text-cyan-50">
                  This form is connected with Firebase token authentication, MongoDB Atlas,
                  and Cloudinary image storage.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold text-slate-300">{label}</span>
      {children}
    </label>
  );
}
