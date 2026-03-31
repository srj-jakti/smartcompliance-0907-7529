export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "superadmin" | "support";
}

export function getAdmin(): AdminUser | null {
  try {
    const raw = localStorage.getItem("sc_admin");
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

export function setAdmin(user: AdminUser) {
  localStorage.setItem("sc_admin", JSON.stringify(user));
}

export function logoutAdmin() {
  localStorage.removeItem("sc_admin");
  window.location.href = "/admin/login";
}
