import { useState, useEffect } from "react";
import { Zap, Building2, User, Briefcase, Eye, EyeOff, ArrowRight, Shield, CheckCircle } from "lucide-react";
import { setUser, getUser, DEMO_ACCOUNTS, UserRole, redirectByRole } from "@/lib/auth";
import { toast } from "sonner";

const ROLES: { key: UserRole; label: string; sub: string; icon: any; color: string; ring: string; bg: string }[] = [
  { key: "ca", label: "CA / Owner", sub: "Practice dashboard", icon: Building2, color: "text-blue-700", ring: "border-blue-600 bg-blue-50", bg: "bg-blue-600" },
  { key: "employee", label: "Employee", sub: "My tasks & clients", icon: Briefcase, color: "text-purple-700", ring: "border-purple-600 bg-purple-50", bg: "bg-purple-600" },
  { key: "client", label: "Client", sub: "View my filings", icon: User, color: "text-green-700", ring: "border-green-600 bg-green-50", bg: "bg-green-600" },
];

const demoFor = {
  ca: [
    { label: "CA Rajesh (Firm 1)", email: "ca@demo.in", pw: "ca123" },
    { label: "CA Priya (Firm 2)", email: "ca2@demo.in", pw: "ca123" },
  ],
  employee: [
    { label: "Anita – GST Staff", email: "emp1@demo.in", pw: "emp123" },
    { label: "Mohit – ITR Manager", email: "emp2@demo.in", pw: "emp123" },
  ],
  client: [
    { label: "Rajesh Kumar", email: "client@demo.in", pw: "client123" },
    { label: "TechVision Pvt Ltd", email: "tech@demo.in", pw: "client123" },
  ],
};

export default function Login() {
  const [role, setRole] = useState<UserRole | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  // If already logged in, redirect to correct portal
  useEffect(() => {
    const user = getUser();
    if (user) redirectByRole(user.role);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!role) { toast.error("Select your role first"); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    const match = DEMO_ACCOUNTS.find(a => a.email === email && a.password === password && a.role === role);
    if (match) {
      const { password: _, ...user } = match;
      setUser(user);
      toast.success(`Welcome, ${user.name}!`);
      redirectByRole(role);
    } else {
      toast.error("Invalid credentials. Try demo accounts below.");
    }
    setLoading(false);
  };

  const fillDemo = (email: string, pw: string, r: UserRole) => {
    setRole(r);
    setEmail(email);
    setPassword(pw);
    // just fills the form — user must click Sign In
  };

  const selectedRoleData = ROLES.find(r => r.key === role);

  return (
    <div className="min-h-screen flex" style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e3a8a 60%, #1d4ed8 100%)" }}>
      {/* Left */}
      <div className="hidden lg:flex flex-col justify-between p-12 w-[44%]">
        <div>
          <div className="flex items-center gap-3 mb-14">
            <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-white font-bold text-xl">Smart<span className="text-blue-300">Compliance</span></p>
              <p className="text-blue-300 text-xs">CA Practice Suite</p>
            </div>
          </div>
          <h2 className="text-4xl font-bold text-white mb-4 leading-tight">One platform.<br />Three portals.</h2>
          <p className="text-blue-200 text-lg mb-10">CA firms, employees, and clients — each with their own secure, isolated dashboard.</p>
          <div className="space-y-4">
            {[
              { icon: "🏢", title: "CA Portal", desc: "Full practice management, team, AI auto-assign, billing" },
              { icon: "👨‍💼", title: "Employee Portal", desc: "Assigned tasks, clients, attendance, chat" },
              { icon: "👤", title: "Client Portal", desc: "Filings, invoices, documents, messaging" },
            ].map((p, i) => (
              <div key={i} className="flex items-start gap-3 bg-white/10 rounded-xl p-4">
                <span className="text-2xl">{p.icon}</span>
                <div>
                  <p className="text-white font-semibold">{p.title}</p>
                  <p className="text-blue-200 text-sm">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-3 text-blue-300 text-sm">
          <Shield className="w-4 h-4" />
          <span>Data isolated per firm • AWS India Hosted • 2FA</span>
        </div>
      </div>

      {/* Right */}
      <div className="flex-1 flex items-center justify-center p-5">
        <div className="w-full max-w-md">
          <div className="flex items-center gap-2 mb-6 lg:hidden">
            <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center"><Zap className="w-5 h-5 text-white" /></div>
            <span className="text-white font-bold text-lg">Smart<span className="text-blue-300">Compliance</span></span>
          </div>

          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="p-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-1">Sign In</h1>
              <p className="text-gray-500 text-sm mb-5">Choose your role to continue</p>

              {/* Role Selector */}
              <div className="grid grid-cols-3 gap-2 mb-5">
                {ROLES.map(r => {
                  const Icon = r.icon;
                  const active = role === r.key;
                  return (
                    <button key={r.key} onClick={() => { setRole(r.key); setEmail(""); setPassword(""); }}
                      className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${active ? r.ring : "border-gray-200 hover:border-gray-300"}`}>
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${active ? r.bg : "bg-gray-100"}`}>
                        <Icon className={`w-5 h-5 ${active ? "text-white" : "text-gray-500"}`} />
                      </div>
                      <div className="text-center">
                        <p className={`font-semibold text-xs ${active ? r.color : "text-gray-600"}`}>{r.label}</p>
                        <p className="text-gray-400 text-xs leading-tight">{r.sub}</p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Form */}
              <form onSubmit={handleLogin} className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Email</label>
                  <input required type="email" value={email} onChange={e => setEmail(e.target.value)}
                    disabled={!role} placeholder={role ? `Enter ${role} email` : "Select role first"}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-400" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Password</label>
                  <div className="relative">
                    <input required type={showPass ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)}
                      disabled={!role} placeholder="Enter password"
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50" />
                    <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                      {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <button type="submit" disabled={loading || !role}
                  className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed
                    ${role === "employee" ? "bg-purple-600 hover:bg-purple-700 text-white" : role === "client" ? "bg-green-600 hover:bg-green-700 text-white" : "btn-blue"}`}>
                  {loading
                    ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    : <><span>Sign In{role ? ` as ${ROLES.find(r => r.key === role)?.label}` : ""}</span><ArrowRight className="w-4 h-4" /></>
                  }
                </button>
              </form>
            </div>

            {/* Demo Credentials */}
            <div className="px-6 pb-6">
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <p className="text-xs font-bold text-gray-400 uppercase mb-3 tracking-wide">Demo Accounts — click to fill credentials</p>
                <div className="space-y-3">
                  {Object.entries(demoFor).map(([r, accs]) => {
                    const rd = ROLES.find(x => x.key === r as UserRole)!;
                    const Icon = rd.icon;
                    return (
                      <div key={r}>
                        <div className="flex items-center gap-1.5 mb-1.5">
                          <Icon className={`w-3.5 h-3.5 ${rd.color}`} />
                          <span className={`text-xs font-semibold uppercase tracking-wide ${rd.color}`}>{rd.label}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          {accs.map((a, i) => (
                            <button key={i} onClick={() => fillDemo(a.email, a.pw, r as UserRole)}
                              className={`text-left p-2.5 rounded-lg border hover:opacity-90 transition-opacity
                                ${r === "ca" ? "bg-blue-50 border-blue-100" : r === "employee" ? "bg-purple-50 border-purple-100" : "bg-green-50 border-green-100"}`}>
                              <p className={`text-xs font-semibold ${rd.color}`}>{a.label}</p>
                              <p className="text-xs text-gray-400">{a.email}</p>
                              <p className="text-xs text-gray-300">{a.pw}</p>
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="px-6 pb-5 text-center">
              <a href="/" className="text-sm text-gray-400 hover:text-blue-600">← Back to homepage</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
