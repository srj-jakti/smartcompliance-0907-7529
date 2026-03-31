# SmartCompliance — Full Product Analysis
Date: March 31, 2026

## CRITICAL BUGS (Break the app)

1. **Client portal shows ALL firm data** — `client/tasks.tsx` fetches `?firmId=` with NO clientId filter. Every client sees every task in the firm. Same bug in `client/compliance.tsx`, `client/invoices.tsx`.
2. **Documents page is fake** — uses hardcoded `sampleDocs[]`. No real DB reads/writes. Upload does nothing.
3. **employee/chat.tsx is 15 lines** — just an empty stub. Chat doesn't work for employees.
4. **client/chat.tsx is 15 lines** — same stub. Client messaging is broken.
5. **No client isolation in employee portal** — employees see all firm tasks, not just their assigned ones... depends on API filter which is inconsistently applied.

## WHAT'S MISSING (Big gaps vs PRD)

### CA Dashboard
- No Client 360 view — clicking a client shows nothing about that client. Just list + edit.
- No per-client tasks, invoices, compliance history in one place
- Reports Export button does nothing (no CSV/PDF)
- AI Assistant is keyword-matching only, not real AI
- Settings page has no real functionality (just forms that don't save anything meaningful)

### Employee Portal  
- Only 5 pages: Dashboard, Tasks, Clients, Attendance, Reports, Chat(broken)
- No leave application for employees (can only be applied by CA)
- No time logging from employee side
- No sub-task visibility
- No performance/productivity view

### Client Portal
- Shows ALL firm data instead of own data (critical bug)
- Support page does nothing
- No invoice payment tracking (just view)
- No document upload by client
- No notification system working

## WHAT TO REMOVE / SIMPLIFY

- `pages/index.tsx` (empty redirect file, unnecessary)
- Remove `Badge` import from clients.tsx (not used)
- `landing.tsx` is 547 lines — over-engineered for a SaaS landing, needs trimming

## IMPROVEMENT PLAN (Priority Order)

### P0 — Fix bugs first
1. Fix client portal data isolation (filter by clientId)
2. Fix documents page (connect to real DB + R2 storage)
3. Fix chat pages for employee and client

### P1 — Client 360 View (your example)
- Click any client → opens full client profile page
- Shows: profile info, all tasks, all invoices, all documents, compliance status, DSC, chat history
- CA and employee both get this view

### P2 — Employee improvements  
- Leave apply from employee side
- Time logging from employee tasks
- Performance dashboard (tasks completed, hours logged, on-time rate)

### P3 — Real AI
- Replace keyword AI chat with actual GPT-4o calls
- AI suggestions on task creation
- Smart compliance reminders

### P4 — Polish
- Real document upload (R2 storage)
- Reports export working
- Settings actually save
- Notification bell working
