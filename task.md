# Admin Backend Dashboard — Build Plan

## Route: /admin (separate from /dashboard, /employee, /client)
## Auth: hardcoded superadmin credentials (admin@smartcompliance.in / admin@123)
## Style: Dark sidebar (slate-900), distinct from green CA dashboard

## Pages to build:
1. /admin/login — separate login page
2. /admin — Overview (platform KPIs: total firms, MRR, active users, tickets)
3. /admin/firms — All CA firms (view/suspend/delete + create new)
4. /admin/users — All users across all firms (CA + employees + clients)
5. /admin/subscriptions — Plan management (Free/Starter/Pro/Enterprise per firm)
6. /admin/ai-keys — Global AI key + per-firm overrides
7. /admin/support — Support tickets (from client/CA "contact support" flow)
8. /admin/announcements — Broadcast messages to all firms
9. /admin/settings — Platform settings (plans pricing, feature flags)

## New DB tables needed:
- admin_users (id, email, password, name, role: superadmin/support)
- subscriptions (id, firmId, plan, status, seats, billingCycle, amount, renewsAt)
- support_tickets (id, firmId, userId, userRole, subject, message, status, priority, createdAt)
- support_replies (id, ticketId, authorId, authorRole, message, createdAt)
- announcements (id, title, message, targetRole, isActive, createdAt)
- firm_ai_keys (id, firmId, aiKey, baseUrl, model, createdAt)

## Auth: role "admin" added to auth.ts, route guard AdminRoute
## Status: IN PROGRESS
