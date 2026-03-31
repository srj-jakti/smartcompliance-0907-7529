import { useState } from "react";
import { useLocation } from "wouter";
import { Shield, Eye, EyeOff } from "lucide-react";
import { setAdmin } from "@/lib/admin-auth";
import { toast } from "sonner";

export default function AdminLogin() {
  const [, navigate] = useLocation();
  const [email, setEmail] = useState("admin@smartcompliance.in");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) { toast.error("Invalid credentials"); return; }
      const data = await res.json();
      setAdmin(data);
      navigate("/admin");
    } catch { toast.error("Login failed"); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-500/30">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
          <p className="text-slate-400 text-sm mt-1">Smart Compliance Tracker Platform Management</p>
        </div>

        <form onSubmit={login} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-300 mb-1.5 block">Email</label>
            <input
              type="email" value={email} onChange={e => setEmail(e.target.value)} required
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-slate-500"
              placeholder="admin@smartcompliance.in"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-300 mb-1.5 block">Password</label>
            <div className="relative">
              <input
                type={show ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} required
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 pr-10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-slate-500"
                placeholder="••••••••"
              />
              <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200">
                {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <button type="submit" disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-lg font-semibold text-sm transition-colors disabled:opacity-60 mt-2">
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="text-center text-slate-600 text-xs mt-6">
          Default: admin@smartcompliance.in / admin@123
        </p>
      </div>
    </div>
  );
}
