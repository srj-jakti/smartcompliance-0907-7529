import { Route, Switch, useLocation } from "wouter";
import { useEffect } from "react";
import { Provider } from "./components/provider";
import { AgentFeedback, RunableBadge } from "@runablehq/website-runtime";
import { Toaster } from "@/components/ui/sonner";
import { getUser } from "@/lib/auth";
import { getAdmin } from "@/lib/admin-auth";

// Public
import Landing from "./pages/landing";
import Login from "./pages/login";
import Privacy from "./pages/privacy";
import Terms from "./pages/terms";
import Refund from "./pages/refund";
import About from "./pages/about";
import Contact from "./pages/contact";

// CA Dashboard
import Dashboard from "./pages/dashboard/index";
import Clients from "./pages/dashboard/clients";
import ClientProfile from "./pages/dashboard/client-profile";
import Tasks from "./pages/dashboard/tasks";
import Team from "./pages/dashboard/team";
import Compliance from "./pages/dashboard/compliance";
import Invoices from "./pages/dashboard/invoices";
import Documents from "./pages/dashboard/documents";
import DSC from "./pages/dashboard/dsc";
import Attendance from "./pages/dashboard/attendance";
import Leaves from "./pages/dashboard/leaves";
import AIAssistant from "./pages/dashboard/ai-assistant";
import Reports from "./pages/dashboard/reports";
import Settings from "./pages/dashboard/settings";
import CAChat from "./pages/dashboard/chat";
import DashboardLayout from "./components/dashboard/layout";

// Employee Portal
import EmployeeDashboard from "./pages/employee/index";
import EmployeeTasks from "./pages/employee/tasks";
import EmployeeClients from "./pages/employee/clients";
import EmployeeChat from "./pages/employee/chat";
import EmployeeAttendance from "./pages/employee/attendance";
import EmployeeReports from "./pages/employee/reports";
import EmployeeLayout from "./components/employee/layout";

// Client Portal
import ClientDashboard from "./pages/client/index";
import ClientTasks from "./pages/client/tasks";
import ClientInvoices from "./pages/client/invoices";
import ClientDocuments from "./pages/client/documents";
import ClientCompliance from "./pages/client/compliance";
import ClientMessages from "./pages/client/messages";
import ClientChat from "./pages/client/chat";
import ClientSupport from "./pages/client/support";
import ClientLayout from "./components/client/layout";

// Admin Backend
import AdminLogin from "./pages/admin/login";
import AdminOverview from "./pages/admin/index";
import AdminFirms from "./pages/admin/firms";
import AdminUsers from "./pages/admin/users";
import AdminSubscriptions from "./pages/admin/subscriptions";
import AdminAIKeys from "./pages/admin/ai-keys";
import AdminSupport from "./pages/admin/support";
import AdminAnnouncements from "./pages/admin/announcements";
import AdminSettings from "./pages/admin/settings";
import AdminLayout from "./components/admin/layout";

// Auth Guards
function CARoute({ children }: { children: React.ReactNode }) {
  const [, setLocation] = useLocation();
  useEffect(() => {
    const user = getUser();
    if (!user) { setLocation("/login"); return; }
    if (user.role !== "ca") { setLocation(user.role === "employee" ? "/employee" : "/client"); }
  }, []);
  return <>{children}</>;
}

function EmployeeRoute({ children }: { children: React.ReactNode }) {
  const [, setLocation] = useLocation();
  useEffect(() => {
    const user = getUser();
    if (!user) { setLocation("/login"); return; }
    if (user.role !== "employee") { setLocation(user.role === "ca" ? "/dashboard" : "/client"); }
  }, []);
  return <>{children}</>;
}

function ClientRoute({ children }: { children: React.ReactNode }) {
  const [, setLocation] = useLocation();
  useEffect(() => {
    const user = getUser();
    if (!user) { setLocation("/login"); return; }
    if (user.role !== "client") { setLocation(user.role === "ca" ? "/dashboard" : "/employee"); }
  }, []);
  return <>{children}</>;
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const [, setLocation] = useLocation();
  useEffect(() => {
    const admin = getAdmin();
    if (!admin) { setLocation("/admin/login"); }
  }, []);
  return <>{children}</>;
}

const CA = ({ children }: any) => <CARoute><DashboardLayout>{children}</DashboardLayout></CARoute>;
const EMP = ({ children }: any) => <EmployeeRoute><EmployeeLayout>{children}</EmployeeLayout></EmployeeRoute>;
const CLI = ({ children }: any) => <ClientRoute><ClientLayout>{children}</ClientLayout></ClientRoute>;
const ADMIN = ({ children }: any) => <AdminRoute><AdminLayout>{children}</AdminLayout></AdminRoute>;

export default function App() {
  return (
    <Provider>
      <Switch>
        {/* Public */}
        <Route path="/" component={Landing} />
        <Route path="/login" component={Login} />
        <Route path="/privacy" component={Privacy} />
        <Route path="/terms" component={Terms} />
        <Route path="/refund" component={Refund} />
        <Route path="/about" component={About} />
        <Route path="/contact" component={Contact} />

        {/* CA */}
        <Route path="/dashboard"><CA><Dashboard /></CA></Route>
        <Route path="/dashboard/clients"><CA><Clients /></CA></Route>
        <Route path="/dashboard/clients/:id"><CA><ClientProfile /></CA></Route>
        <Route path="/dashboard/tasks"><CA><Tasks /></CA></Route>
        <Route path="/dashboard/team"><CA><Team /></CA></Route>
        <Route path="/dashboard/compliance"><CA><Compliance /></CA></Route>
        <Route path="/dashboard/invoices"><CA><Invoices /></CA></Route>
        <Route path="/dashboard/chat"><CA><CAChat /></CA></Route>
        <Route path="/dashboard/documents"><CA><Documents /></CA></Route>
        <Route path="/dashboard/dsc"><CA><DSC /></CA></Route>
        <Route path="/dashboard/attendance"><CA><Attendance /></CA></Route>
        <Route path="/dashboard/leaves"><CA><Leaves /></CA></Route>
        <Route path="/dashboard/ai"><CA><AIAssistant /></CA></Route>
        <Route path="/dashboard/reports"><CA><Reports /></CA></Route>
        <Route path="/dashboard/settings"><CA><Settings /></CA></Route>

        {/* Employee */}
        <Route path="/employee"><EMP><EmployeeDashboard /></EMP></Route>
        <Route path="/employee/tasks"><EMP><EmployeeTasks /></EMP></Route>
        <Route path="/employee/clients"><EMP><EmployeeClients /></EMP></Route>
        <Route path="/employee/chat"><EMP><EmployeeChat /></EMP></Route>
        <Route path="/employee/attendance"><EMP><EmployeeAttendance /></EMP></Route>
        <Route path="/employee/reports"><EMP><EmployeeReports /></EMP></Route>

        {/* Client */}
        <Route path="/client"><CLI><ClientDashboard /></CLI></Route>
        <Route path="/client/tasks"><CLI><ClientTasks /></CLI></Route>
        <Route path="/client/invoices"><CLI><ClientInvoices /></CLI></Route>
        <Route path="/client/documents"><CLI><ClientDocuments /></CLI></Route>
        <Route path="/client/compliance"><CLI><ClientCompliance /></CLI></Route>
        <Route path="/client/messages"><CLI><ClientMessages /></CLI></Route>
        <Route path="/client/chat"><CLI><ClientChat /></CLI></Route>
        <Route path="/client/support"><CLI><ClientSupport /></CLI></Route>

        {/* Admin Backend */}
        <Route path="/admin/login" component={AdminLogin} />
        <Route path="/admin"><ADMIN><AdminOverview /></ADMIN></Route>
        <Route path="/admin/firms"><ADMIN><AdminFirms /></ADMIN></Route>
        <Route path="/admin/users"><ADMIN><AdminUsers /></ADMIN></Route>
        <Route path="/admin/subscriptions"><ADMIN><AdminSubscriptions /></ADMIN></Route>
        <Route path="/admin/ai-keys"><ADMIN><AdminAIKeys /></ADMIN></Route>
        <Route path="/admin/support"><ADMIN><AdminSupport /></ADMIN></Route>
        <Route path="/admin/announcements"><ADMIN><AdminAnnouncements /></ADMIN></Route>
        <Route path="/admin/settings"><ADMIN><AdminSettings /></ADMIN></Route>
      </Switch>
      <Toaster richColors position="top-right" />
      {import.meta.env.DEV && <AgentFeedback />}
      {<RunableBadge />}
    </Provider>
  );
}

