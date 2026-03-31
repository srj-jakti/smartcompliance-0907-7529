import { Hono } from "hono";
import { drizzle } from "drizzle-orm/d1";
import { eq, desc, and, or } from "drizzle-orm";
import * as schema from "./database/schema";
// Use Web Crypto API (works in CF Workers + Node)
const randomUUID = () => crypto.randomUUID();

type Bindings = { DB: D1Database; BUCKET: R2Bucket };
const app = new Hono<{ Bindings: Bindings }>();

// ─── SEED ────────────────────────────────────────────────────────────────────
async function seed(db: ReturnType<typeof drizzle>) {
  const existing = await db.select().from(schema.firms).limit(1);
  if (existing.length > 0) return;

  // Firm 1: CA Rajesh
  const firm1 = { id: "firm1", name: "Sharma & Associates", ownerName: "CA Rajesh Sharma", email: "ca@demo.in", phone: "9876543210", city: "Delhi", aiAutoAssign: false };
  // Firm 2: CA Priya (isolated)
  const firm2 = { id: "firm2", name: "PM Tax Consultants", ownerName: "CA Priya Mehta", email: "ca2@demo.in", phone: "9876543211", city: "Mumbai", aiAutoAssign: true };
  await db.insert(schema.firms).values([firm1, firm2]).onConflictDoNothing();

  // Employees for Firm 1
  const emp1 = { id: "emp1", firmId: "firm1", name: "Anita Singh", email: "emp1@demo.in", phone: "9876540001", role: "staff", specialization: "gst", activeTaskCount: 2, status: "active" };
  const emp2 = { id: "emp2", firmId: "firm1", name: "Mohit Verma", email: "emp2@demo.in", phone: "9876540002", role: "manager", specialization: "itr", activeTaskCount: 1, status: "active" };
  const emp3 = { id: "emp3", firmId: "firm1", name: "Rahul Kumar", email: "emp3@demo.in", phone: "9876540003", role: "staff", specialization: "tds", activeTaskCount: 3, status: "active" };
  // Employee for Firm 2
  const emp4 = { id: "emp4", firmId: "firm2", name: "Deepa Nair", email: "emp4@demo.in", phone: "9876540004", role: "staff", specialization: "audit", activeTaskCount: 1, status: "active" };
  await db.insert(schema.employees).values([emp1, emp2, emp3, emp4]).onConflictDoNothing();

  // Clients for Firm 1
  const cl1 = { id: "cl1", firmId: "firm1", name: "Rajesh Kumar", email: "client@demo.in", phone: "9876543220", pan: "ABCPK1234D", clientType: "individual", city: "Delhi", state: "Delhi", assignedEmployeeId: "emp1", status: "active" };
  const cl2 = { id: "cl2", firmId: "firm1", name: "TechVision Pvt Ltd", email: "tech@demo.in", phone: "9876543221", pan: "CDETV9012F", gstin: "27CDETV9012F1Z1", clientType: "company", city: "Noida", state: "Uttar Pradesh", assignedEmployeeId: "emp2", status: "active" };
  const cl3 = { id: "cl3", firmId: "firm1", name: "Gupta Trading Co", email: "gupta@demo.in", phone: "9876543222", pan: "EFPGT7890H", gstin: "06EFPGT7890H1Z7", clientType: "firm", city: "Jaipur", state: "Rajasthan", assignedEmployeeId: "emp1", status: "active" };
  // Client for Firm 2 (ISOLATED)
  const cl4 = { id: "cl4", firmId: "firm2", name: "Sharma Enterprises", email: "sharma2@demo.in", phone: "9876543230", pan: "BCSHM2222A", clientType: "firm", city: "Mumbai", state: "Maharashtra", assignedEmployeeId: "emp4", status: "active" };
  await db.insert(schema.clients).values([cl1, cl2, cl3, cl4]).onConflictDoNothing();

  // Tasks for Firm 1
  const tasks1 = [
    { id: "t1", firmId: "firm1", title: "GSTR-3B Filing - July 2025", category: "gst", status: "completed", priority: "high", clientId: "cl1", assignedEmployeeId: "emp1", dueDate: new Date("2025-08-20"), billingAmount: 1500 },
    { id: "t2", firmId: "firm1", title: "ITR Filing FY 2024-25", category: "itr", status: "in_progress", priority: "urgent", clientId: "cl2", assignedEmployeeId: "emp2", dueDate: new Date("2025-07-31"), billingAmount: 5000 },
    { id: "t3", firmId: "firm1", title: "TDS Return Q1", category: "tds", status: "pending", priority: "high", clientId: "cl2", assignedEmployeeId: "emp3", dueDate: new Date("2025-07-31"), billingAmount: 3000 },
    { id: "t4", firmId: "firm1", title: "GSTR-1 Filing - Gupta Trading", category: "gst", status: "overdue", priority: "urgent", clientId: "cl3", assignedEmployeeId: "emp1", dueDate: new Date("2025-07-11"), billingAmount: 1200 },
    { id: "t5", firmId: "firm1", title: "Annual Audit FY 2024-25", category: "audit", status: "in_progress", priority: "medium", clientId: "cl2", assignedEmployeeId: "emp2", dueDate: new Date("2025-09-30"), billingAmount: 25000 },
  ];
  // Tasks for Firm 2 (ISOLATED)
  const tasks2 = [
    { id: "t6", firmId: "firm2", title: "GST Audit - Sharma Enterprises", category: "audit", status: "pending", priority: "high", clientId: "cl4", assignedEmployeeId: "emp4", dueDate: new Date("2025-08-31"), billingAmount: 15000 },
  ];
  for (const t of [...tasks1, ...tasks2]) await db.insert(schema.tasks).values(t).onConflictDoNothing();

  // Invoices for Firm 1
  const inv1 = [
    { id: "inv1", firmId: "firm1", invoiceNo: "INV-F1-001", clientId: "cl1", amount: 1500, gstAmount: 270, totalAmount: 1770, status: "paid" },
    { id: "inv2", firmId: "firm1", invoiceNo: "INV-F1-002", clientId: "cl2", amount: 5000, gstAmount: 900, totalAmount: 5900, status: "unpaid", dueDate: new Date("2025-08-15") },
    { id: "inv3", firmId: "firm1", invoiceNo: "INV-F1-003", clientId: "cl3", amount: 1200, gstAmount: 216, totalAmount: 1416, status: "overdue", dueDate: new Date("2025-07-01") },
  ];
  for (const i of inv1) await db.insert(schema.invoices).values(i).onConflictDoNothing();

  // Compliance (global - no firmId)
  const compDates = [
    { id: "comp1", title: "GSTR-3B Monthly Filing", description: "Monthly GST return", dueDate: new Date("2025-08-20"), category: "gst", applicableTo: "all" },
    { id: "comp2", title: "GSTR-1 Monthly Filing", description: "Monthly outward supply return", dueDate: new Date("2025-08-11"), category: "gst", applicableTo: "all" },
    { id: "comp3", title: "ITR Filing Deadline (Non-Audit)", description: "Income Tax Return", dueDate: new Date("2025-07-31"), category: "itr", applicableTo: "individual" },
    { id: "comp4", title: "TDS Return Q1", description: "TDS/TCS return for Q1", dueDate: new Date("2025-07-31"), category: "tds", applicableTo: "all" },
    { id: "comp5", title: "Advance Tax 2nd Installment", description: "45% of advance tax", dueDate: new Date("2025-09-15"), category: "itr", applicableTo: "all" },
    { id: "comp6", title: "ROC Annual Return", description: "Annual compliance for companies", dueDate: new Date("2025-11-30"), category: "roc", applicableTo: "company" },
  ];
  for (const c of compDates) await db.insert(schema.complianceDates).values(c).onConflictDoNothing();

  // DSC for Firm 1
  const dsc1 = [
    { id: "dsc1", firmId: "firm1", clientId: "cl1", holderName: "Rajesh Kumar", dscClass: "class3", issuer: "eMudhra", serialNo: "EM2024001234", expiryDate: new Date("2026-03-31"), status: "active" },
    { id: "dsc2", firmId: "firm1", clientId: "cl3", holderName: "Gupta Trading Prop", dscClass: "class2", issuer: "Safescrypt", serialNo: "SS2022009012", expiryDate: new Date("2025-07-15"), status: "expired" },
  ];
  for (const d of dsc1) await db.insert(schema.dscRecords).values(d).onConflictDoNothing();

  // Seed initial chat messages
  const msgs = [
    // CA ↔ Client (Rajesh Kumar)
    { id: "msg1", firmId: "firm1", conversationId: "ca1_cl1", senderId: "ca1", senderName: "CA Rajesh Sharma", senderRole: "ca", receiverId: "cl1", receiverName: "Rajesh Kumar", receiverRole: "client", content: "Hello Rajesh! Your GSTR-3B for July has been filed. Please review.", isRead: true },
    { id: "msg2", firmId: "firm1", conversationId: "ca1_cl1", senderId: "cl1", senderName: "Rajesh Kumar", senderRole: "client", receiverId: "ca1", receiverName: "CA Rajesh Sharma", receiverRole: "ca", content: "Thank you CA sir! Can I get the acknowledgment copy?", isRead: true },
    { id: "msg3", firmId: "firm1", conversationId: "ca1_cl1", senderId: "ca1", senderName: "CA Rajesh Sharma", senderRole: "ca", receiverId: "cl1", receiverName: "Rajesh Kumar", receiverRole: "client", content: "Yes, I have uploaded the acknowledgment in the Documents section.", isRead: false },
    // Employee (Anita) ↔ Client (Rajesh Kumar)
    { id: "msg4", firmId: "firm1", conversationId: "cl1_emp1", senderId: "emp1", senderName: "Anita Singh", senderRole: "employee", receiverId: "cl1", receiverName: "Rajesh Kumar", receiverRole: "client", content: "Hi Rajesh ji, please share your bank statements for Q1 for TDS filing.", isRead: true },
    { id: "msg5", firmId: "firm1", conversationId: "cl1_emp1", senderId: "cl1", senderName: "Rajesh Kumar", senderRole: "client", receiverId: "emp1", receiverName: "Anita Singh", receiverRole: "employee", content: "I'll share it by tomorrow.", isRead: true },
    // CA ↔ Employee (Anita)
    { id: "msg6", firmId: "firm1", conversationId: "ca1_emp1", senderId: "ca1", senderName: "CA Rajesh Sharma", senderRole: "ca", receiverId: "emp1", receiverName: "Anita Singh", receiverRole: "employee", content: "Anita, please follow up with Rajesh Kumar for bank statements. TDS return due July 31.", isRead: true },
    { id: "msg7", firmId: "firm1", conversationId: "ca1_emp1", senderId: "emp1", senderName: "Anita Singh", senderRole: "employee", receiverId: "ca1", receiverName: "CA Rajesh Sharma", receiverRole: "ca", content: "Sure sir, I have already sent him a message. He'll share by tomorrow.", isRead: false },
    // CA ↔ Employee (Mohit)
    { id: "msg8", firmId: "firm1", conversationId: "ca1_emp2", senderId: "ca1", senderName: "CA Rajesh Sharma", senderRole: "ca", receiverId: "emp2", receiverName: "Mohit Verma", receiverRole: "employee", content: "Mohit, please prioritise TechVision ITR filing. Deadline is 31st July!", isRead: false },
  ];
  for (const m of msgs) await db.insert(schema.chatMessages).values(m).onConflictDoNothing();

  // Seed notifications for CA
  const notifs = [
    { id: "notif1", firmId: "firm1", userId: "ca_firm1", userRole: "ca", title: "⚠️ Overdue Task", message: "GSTR-1 Filing for Gupta Trading is overdue!", type: "warning", isRead: false },
    { id: "notif2", firmId: "firm1", userId: "ca_firm1", userRole: "ca", title: "🔐 DSC Expiry Alert", message: "Gupta Trading DSC expired 3 days ago. Renew immediately.", type: "error", isRead: false },
    { id: "notif3", firmId: "firm1", userId: "ca_firm1", userRole: "ca", title: "💬 New Message", message: "Anita Singh replied to your message about bank statements.", type: "info", isRead: false },
  ];
  for (const n of notifs) await db.insert(schema.notifications).values(n).onConflictDoNothing();
}

// ─── HELPER: get firm by login ─────────────────────────────────────────────
function getConvId(a: string, b: string) {
  return [a, b].sort().join("_");
}

// ─── AI AUTO-ASSIGN LOGIC ──────────────────────────────────────────────────
async function autoAssignEmployee(db: ReturnType<typeof drizzle>, firmId: string, task: any): Promise<string | null> {
  const employees = await db.select().from(schema.employees)
    .where(and(eq(schema.employees.firmId, firmId), eq(schema.employees.status, "active")));
  if (!employees.length) return null;

  // Score each employee: prefer matching specialization, lower active task count
  const scored = employees.map(e => {
    let score = 100 - (e.activeTaskCount || 0) * 10;
    if (e.specialization === task.category) score += 30;
    if (e.role === "manager") score += 5;
    return { ...e, score };
  }).sort((a, b) => b.score - a.score);

  return scored[0]?.id || null;
}

// ─── FIRMS ────────────────────────────────────────────────────────────────────
app.get("/api/firms/:id", async (c) => {
  const db = drizzle(c.env.DB, { schema });
  await seed(db);
  const firm = await db.select().from(schema.firms).where(eq(schema.firms.id, c.req.param("id"))).limit(1);
  return c.json(firm[0] || null);
});

app.put("/api/firms/:id", async (c) => {
  const db = drizzle(c.env.DB, { schema });
  const body = await c.req.json();
  await db.update(schema.firms).set(body).where(eq(schema.firms.id, c.req.param("id")));
  return c.json({ success: true });
});

// ─── EMPLOYEES ────────────────────────────────────────────────────────────────
app.get("/api/employees", async (c) => {
  const db = drizzle(c.env.DB, { schema });
  await seed(db);
  const firmId = c.req.query("firmId");
  if (!firmId) return c.json([]);
  const emps = await db.select().from(schema.employees).where(eq(schema.employees.firmId, firmId));
  return c.json(emps);
});

app.post("/api/employees", async (c) => {
  const db = drizzle(c.env.DB, { schema });
  const body = await c.req.json();
  const emp = { id: randomUUID(), ...body };
  await db.insert(schema.employees).values(emp);
  return c.json(emp, 201);
});

app.put("/api/employees/:id", async (c) => {
  const db = drizzle(c.env.DB, { schema });
  const body = await c.req.json();
  await db.update(schema.employees).set(body).where(eq(schema.employees.id, c.req.param("id")));
  return c.json({ success: true });
});

app.delete("/api/employees/:id", async (c) => {
  const db = drizzle(c.env.DB, { schema });
  await db.delete(schema.employees).where(eq(schema.employees.id, c.req.param("id")));
  return c.json({ success: true });
});

// ─── CLIENTS ──────────────────────────────────────────────────────────────────
app.get("/api/clients", async (c) => {
  const db = drizzle(c.env.DB, { schema });
  await seed(db);
  const firmId = c.req.query("firmId");
  const employeeId = c.req.query("employeeId");
  const search = c.req.query("search") || "";
  if (!firmId) return c.json([]);
  let all = await db.select().from(schema.clients)
    .where(eq(schema.clients.firmId, firmId))
    .orderBy(desc(schema.clients.createdAt));
  if (employeeId) all = all.filter(c => c.assignedEmployeeId === employeeId);
  if (search) all = all.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || (c.pan?.toLowerCase().includes(search.toLowerCase())));
  return c.json(all);
});

app.post("/api/clients", async (c) => {
  const db = drizzle(c.env.DB, { schema });
  const body = await c.req.json();
  const client = { id: randomUUID(), ...body };
  await db.insert(schema.clients).values(client);
  return c.json(client, 201);
});

app.get("/api/clients/:id", async (c) => {
  const db = drizzle(c.env.DB, { schema });
  const rows = await db.select().from(schema.clients).where(eq(schema.clients.id, c.req.param("id"))).limit(1);
  return rows[0] ? c.json(rows[0]) : c.json(null, 404);
});

app.put("/api/clients/:id", async (c) => {
  const db = drizzle(c.env.DB, { schema });
  const body = await c.req.json();
  await db.update(schema.clients).set(body).where(eq(schema.clients.id, c.req.param("id")));
  return c.json({ success: true });
});

app.delete("/api/clients/:id", async (c) => {
  const db = drizzle(c.env.DB, { schema });
  await db.delete(schema.clients).where(eq(schema.clients.id, c.req.param("id")));
  return c.json({ success: true });
});

// ─── TASKS ────────────────────────────────────────────────────────────────────
app.get("/api/tasks", async (c) => {
  const db = drizzle(c.env.DB, { schema });
  await seed(db);
  const firmId = c.req.query("firmId");
  const employeeId = c.req.query("employeeId");
  const clientId = c.req.query("clientId");
  if (!firmId) return c.json([]);
  let all = await db.select().from(schema.tasks)
    .where(eq(schema.tasks.firmId, firmId))
    .orderBy(desc(schema.tasks.createdAt));
  if (employeeId) all = all.filter(t => t.assignedEmployeeId === employeeId);
  if (clientId) all = all.filter(t => t.clientId === clientId);
  return c.json(all);
});

app.post("/api/tasks", async (c) => {
  const db = drizzle(c.env.DB, { schema });
  const body = await c.req.json();
  let assignedEmployeeId = body.assignedEmployeeId || null;
  let autoAssigned = false;

  // AI Auto-Assign check
  if (!assignedEmployeeId && body.firmId) {
    const firm = await db.select().from(schema.firms).where(eq(schema.firms.id, body.firmId)).limit(1);
    if (firm[0]?.aiAutoAssign) {
      assignedEmployeeId = await autoAssignEmployee(db, body.firmId, body);
      if (assignedEmployeeId) {
        autoAssigned = true;
        // Update employee task count
        const emp = await db.select().from(schema.employees).where(eq(schema.employees.id, assignedEmployeeId)).limit(1);
        if (emp[0]) {
          await db.update(schema.employees).set({ activeTaskCount: (emp[0].activeTaskCount || 0) + 1 }).where(eq(schema.employees.id, assignedEmployeeId));
        }
        // Create notification for CA
        await db.insert(schema.notifications).values({
          id: randomUUID(), firmId: body.firmId, userId: "ca_" + body.firmId,
          userRole: "ca", title: "🤖 AI Auto-Assigned Task",
          message: `Task "${body.title}" was auto-assigned to ${emp[0]?.name || "an employee"} by AI.`,
          type: "info"
        });
      }
    }
  }

  const task = { id: randomUUID(), ...body, assignedEmployeeId, autoAssigned };
  await db.insert(schema.tasks).values(task);
  return c.json({ ...task, autoAssigned, assignedEmployeeId }, 201);
});

app.put("/api/tasks/:id", async (c) => {
  const db = drizzle(c.env.DB, { schema });
  const body = await c.req.json();
  await db.update(schema.tasks).set(body).where(eq(schema.tasks.id, c.req.param("id")));
  return c.json({ success: true });
});

app.delete("/api/tasks/:id", async (c) => {
  const db = drizzle(c.env.DB, { schema });
  await db.delete(schema.tasks).where(eq(schema.tasks.id, c.req.param("id")));
  return c.json({ success: true });
});

// Assign task to employee
app.post("/api/tasks/:id/assign", async (c) => {
  const db = drizzle(c.env.DB, { schema });
  const { employeeId, firmId } = await c.req.json();
  await db.update(schema.tasks).set({ assignedEmployeeId: employeeId }).where(eq(schema.tasks.id, c.req.param("id")));
  // Update counts
  if (employeeId) {
    const emp = await db.select().from(schema.employees).where(eq(schema.employees.id, employeeId)).limit(1);
    if (emp[0]) await db.update(schema.employees).set({ activeTaskCount: (emp[0].activeTaskCount || 0) + 1 }).where(eq(schema.employees.id, employeeId));
  }
  return c.json({ success: true });
});

// ─── INVOICES ────────────────────────────────────────────────────────────────
app.get("/api/invoices", async (c) => {
  const db = drizzle(c.env.DB, { schema });
  await seed(db);
  const firmId = c.req.query("firmId");
  const clientId = c.req.query("clientId");
  if (!firmId) return c.json([]);
  let all = await db.select().from(schema.invoices).where(eq(schema.invoices.firmId, firmId)).orderBy(desc(schema.invoices.createdAt));
  if (clientId) all = all.filter(i => i.clientId === clientId);
  return c.json(all);
});

app.post("/api/invoices", async (c) => {
  const db = drizzle(c.env.DB, { schema });
  const body = await c.req.json();
  const inv = { id: randomUUID(), ...body };
  await db.insert(schema.invoices).values(inv);
  return c.json(inv, 201);
});

app.put("/api/invoices/:id", async (c) => {
  const db = drizzle(c.env.DB, { schema });
  const body = await c.req.json();
  await db.update(schema.invoices).set(body).where(eq(schema.invoices.id, c.req.param("id")));
  return c.json({ success: true });
});

// ─── COMPLIANCE ────────────────────────────────────────────────────────────────
app.get("/api/compliance", async (c) => {
  const db = drizzle(c.env.DB, { schema });
  await seed(db);
  const items = await db.select().from(schema.complianceDates).orderBy(schema.complianceDates.dueDate);
  return c.json(items);
});

// ─── DSC ──────────────────────────────────────────────────────────────────────
app.get("/api/dsc", async (c) => {
  const db = drizzle(c.env.DB, { schema });
  await seed(db);
  const firmId = c.req.query("firmId");
  if (!firmId) return c.json([]);
  const clientId = c.req.query("clientId");
  const all = await db.select().from(schema.dscRecords).where(eq(schema.dscRecords.firmId, firmId));
  return c.json(clientId ? all.filter(d => d.clientId === clientId) : all);
});

app.post("/api/dsc", async (c) => {
  const db = drizzle(c.env.DB, { schema });
  const body = await c.req.json();
  const rec = { id: randomUUID(), ...body };
  await db.insert(schema.dscRecords).values(rec);
  return c.json(rec, 201);
});

// ─── ATTENDANCE ────────────────────────────────────────────────────────────────
app.get("/api/attendance", async (c) => {
  const db = drizzle(c.env.DB, { schema });
  const firmId = c.req.query("firmId");
  if (!firmId) return c.json([]);
  const all = await db.select().from(schema.attendance).where(eq(schema.attendance.firmId, firmId)).orderBy(desc(schema.attendance.date));
  return c.json(all);
});

app.post("/api/attendance", async (c) => {
  const db = drizzle(c.env.DB, { schema });
  const body = await c.req.json();
  const rec = { id: randomUUID(), ...body };
  await db.insert(schema.attendance).values(rec);
  return c.json(rec, 201);
});

// ─── CHAT ─────────────────────────────────────────────────────────────────────
// Get all conversations for a user
app.get("/api/chat/conversations", async (c) => {
  const db = drizzle(c.env.DB, { schema });
  await seed(db);
  const userId = c.req.query("userId");
  const firmId = c.req.query("firmId");
  if (!userId || !firmId) return c.json([]);

  const msgs = await db.select().from(schema.chatMessages)
    .where(and(
      eq(schema.chatMessages.firmId, firmId),
      or(eq(schema.chatMessages.senderId, userId), eq(schema.chatMessages.receiverId, userId))
    ))
    .orderBy(desc(schema.chatMessages.createdAt));

  // Group by conversation
  const convMap = new Map<string, any>();
  for (const m of msgs) {
    if (!convMap.has(m.conversationId)) {
      const isMe = m.senderId === userId;
      convMap.set(m.conversationId, {
        conversationId: m.conversationId,
        otherId: isMe ? m.receiverId : m.senderId,
        otherName: isMe ? m.receiverName : m.senderName,
        otherRole: isMe ? m.receiverRole : m.senderRole,
        lastMessage: m.content,
        lastTime: m.createdAt,
        unread: msgs.filter(x => x.conversationId === m.conversationId && x.receiverId === userId && !x.isRead).length,
      });
    }
  }
  return c.json(Array.from(convMap.values()));
});

// Get messages in a conversation
app.get("/api/chat/messages", async (c) => {
  const db = drizzle(c.env.DB, { schema });
  const convId = c.req.query("conversationId");
  const firmId = c.req.query("firmId");
  if (!convId || !firmId) return c.json([]);
  const msgs = await db.select().from(schema.chatMessages)
    .where(and(eq(schema.chatMessages.conversationId, convId), eq(schema.chatMessages.firmId, firmId)))
    .orderBy(schema.chatMessages.createdAt);
  return c.json(msgs);
});

// Send message
app.post("/api/chat/send", async (c) => {
  const db = drizzle(c.env.DB, { schema });
  const body = await c.req.json();
  const convId = getConvId(body.senderId, body.receiverId);
  const msg = {
    id: randomUUID(),
    firmId: body.firmId,
    conversationId: convId,
    senderId: body.senderId,
    senderName: body.senderName,
    senderRole: body.senderRole,
    receiverId: body.receiverId,
    receiverName: body.receiverName,
    receiverRole: body.receiverRole,
    content: body.content,
    messageType: "text",
    isRead: false,
  };
  await db.insert(schema.chatMessages).values(msg);
  return c.json(msg, 201);
});

// Mark conversation read
app.post("/api/chat/read", async (c) => {
  const db = drizzle(c.env.DB, { schema });
  const { conversationId, userId } = await c.req.json();
  // Mark all msgs in conversation received by userId as read
  const msgs = await db.select().from(schema.chatMessages).where(eq(schema.chatMessages.conversationId, conversationId));
  for (const m of msgs) {
    if (m.receiverId === userId && !m.isRead) {
      await db.update(schema.chatMessages).set({ isRead: true }).where(eq(schema.chatMessages.id, m.id));
    }
  }
  return c.json({ success: true });
});

// Get all users in firm for CA to start chat
app.get("/api/chat/users", async (c) => {
  const db = drizzle(c.env.DB, { schema });
  await seed(db);
  const firmId = c.req.query("firmId");
  if (!firmId) return c.json([]);
  const employees = await db.select().from(schema.employees).where(eq(schema.employees.firmId, firmId));
  const clients = await db.select().from(schema.clients).where(eq(schema.clients.firmId, firmId));
  return c.json({
    employees: employees.map(e => ({ id: e.id, name: e.name, role: "employee", sub: e.role })),
    clients: clients.map(c => ({ id: c.id, name: c.name, role: "client", sub: c.clientType })),
  });
});

// ─── NOTIFICATIONS ────────────────────────────────────────────────────────────
app.get("/api/notifications", async (c) => {
  const db = drizzle(c.env.DB, { schema });
  const firmId = c.req.query("firmId");
  const userId = c.req.query("userId");
  if (!firmId) return c.json([]);
  let all = await db.select().from(schema.notifications)
    .where(eq(schema.notifications.firmId, firmId))
    .orderBy(desc(schema.notifications.createdAt));
  if (userId) all = all.filter(n => n.userId === userId || n.userId === "ca_" + firmId);
  return c.json(all.slice(0, 20));
});

app.post("/api/notifications/read/:id", async (c) => {
  const db = drizzle(c.env.DB, { schema });
  await db.update(schema.notifications).set({ isRead: true }).where(eq(schema.notifications.id, c.req.param("id")));
  return c.json({ success: true });
});

// ─── DASHBOARD STATS ──────────────────────────────────────────────────────────
app.get("/api/dashboard/stats", async (c) => {
  const db = drizzle(c.env.DB, { schema });
  await seed(db);
  const firmId = c.req.query("firmId");
  const employeeId = c.req.query("employeeId");
  if (!firmId) return c.json({});

  const allClients = await db.select().from(schema.clients).where(eq(schema.clients.firmId, firmId));
  const allTasks = await db.select().from(schema.tasks).where(eq(schema.tasks.firmId, firmId));
  const allInvoices = await db.select().from(schema.invoices).where(eq(schema.invoices.firmId, firmId));
  const allCompliance = await db.select().from(schema.complianceDates);
  const allDsc = await db.select().from(schema.dscRecords).where(eq(schema.dscRecords.firmId, firmId));
  const allEmployees = await db.select().from(schema.employees).where(eq(schema.employees.firmId, firmId));

  // If employee scoped
  const clients = employeeId ? allClients.filter(c => c.assignedEmployeeId === employeeId) : allClients;
  const tasks = employeeId ? allTasks.filter(t => t.assignedEmployeeId === employeeId) : allTasks;

  const today = new Date();
  const totalRevenue = allInvoices.filter(i => i.status === "paid").reduce((s, i) => s + (i.totalAmount || 0), 0);
  const pendingAmount = allInvoices.filter(i => i.status !== "paid").reduce((s, i) => s + (i.totalAmount || 0), 0);
  const upcoming = allCompliance.filter(c => { const d = (new Date(c.dueDate).getTime() - today.getTime()) / 86400000; return d >= 0 && d <= 30; }).length;
  const expiredDsc = allDsc.filter(d => d.status === "expired" || new Date(d.expiryDate) < today).length;
  const expiringDsc = allDsc.filter(d => { const diff = (new Date(d.expiryDate).getTime() - today.getTime()) / 86400000; return diff >= 0 && diff <= 30; }).length;

  return c.json({
    totalClients: clients.length,
    activeClients: clients.filter(c => c.status === "active").length,
    totalTasks: tasks.length,
    pendingTasks: tasks.filter(t => ["pending", "in_progress"].includes(t.status)).length,
    overdueTasks: tasks.filter(t => t.status === "overdue").length,
    completedTasks: tasks.filter(t => t.status === "completed").length,
    totalRevenue, pendingAmount,
    upcomingCompliance: upcoming,
    expiredDsc, expiringDsc, totalDsc: allDsc.length,
    totalEmployees: allEmployees.length,
    activeEmployees: allEmployees.filter(e => e.status === "active").length,
  });
});

// ─── AI ASSIGN ────────────────────────────────────────────────────────────────
app.post("/api/ai/assign", async (c) => {
  const db = drizzle(c.env.DB, { schema });
  const { firmId, taskId } = await c.req.json();
  const task = await db.select().from(schema.tasks).where(eq(schema.tasks.id, taskId)).limit(1);
  if (!task[0]) return c.json({ error: "Task not found" }, 404);

  const empId = await autoAssignEmployee(db, firmId, task[0]);
  if (!empId) return c.json({ error: "No employees available" }, 400);

  await db.update(schema.tasks).set({ assignedEmployeeId: empId, autoAssigned: true }).where(eq(schema.tasks.id, taskId));
  const emp = await db.select().from(schema.employees).where(eq(schema.employees.id, empId)).limit(1);
  if (emp[0]) await db.update(schema.employees).set({ activeTaskCount: (emp[0].activeTaskCount || 0) + 1 }).where(eq(schema.employees.id, empId));

  return c.json({ success: true, assignedTo: emp[0], message: `Task auto-assigned to ${emp[0]?.name}` });
});

// ─── AI CHAT ──────────────────────────────────────────────────────────────────
app.post("/api/ai/chat", async (c) => {
  const body = await c.req.json();
  const message = body.message || "";
  const history = body.history || []; // [{role, content}]
  const firmId = body.firmId || "";

  const baseUrl = c.env.AI_GATEWAY_BASE_URL || "https://api.openai.com/v1";
  const apiKey = c.env.AI_GATEWAY_API_KEY;

  // Fallback if no API key
  if (!apiKey) {
    const msg = message.toLowerCase();
    const responses: Record<string, string> = {
      gstr: "📋 **GSTR Deadlines:**\n• GSTR-1: 11th of next month\n• GSTR-3B: 20th of next month\n• GSTR-9 Annual: 31st December\n\nLate penalty: ₹50/day, max ₹5,000",
      itr: "📊 **ITR FY 2024-25:**\n• Non-audit: 31st July 2025\n• Audit cases: 31st October 2025\n\nLate fee: ₹5,000 (₹1,000 if income < ₹5L)",
      tds: "💰 **TDS Deadlines:**\n• Deposit: 7th of next month\n• Q1 return: July 31\n• Q2 return: Oct 31\n\nInterest: 1.5% per month on late deposit",
      dsc: "🔐 **DSC Tips:**\n• Class 3 DSC: 1–3 years validity\n• Renew 30 days before expiry\n• Required for MCA, GST portal, IT portal",
      penalty: "⚠️ **Common Penalties:**\n• Late GST: ₹50/day\n• Late ITR: ₹5,000\n• TDS default: 1.5%/month\n• ROC late filing: ₹100/day",
    };
    let reply = "I'm your Smart Compliance AI. Ask about GST, ITR, TDS, DSC, deadlines, or penalties!";
    for (const [k, v] of Object.entries(responses)) { if (msg.includes(k)) { reply = v; break; } }
    return c.json({ reply, timestamp: new Date().toISOString() });
  }

  // Fetch live context for the firm
  let context = "";
  if (firmId) {
    try {
      const db = drizzle(c.env.DB, { schema });
      const today = new Date();
      const [tasks, invoices, compliance, dscs] = await Promise.all([
        db.select().from(schema.tasks).where(eq(schema.tasks.firmId, firmId)).limit(20),
        db.select().from(schema.invoices).where(eq(schema.invoices.firmId, firmId)).limit(10),
        db.select().from(schema.complianceDates).orderBy(schema.complianceDates.dueDate).limit(10),
        db.select().from(schema.dscRecords).where(eq(schema.dscRecords.firmId, firmId)).limit(10),
      ]);
      const overdueTasks = tasks.filter(t => t.status === "overdue" || (t.dueDate && new Date(t.dueDate) < today && t.status !== "completed"));
      const unpaidInvoices = invoices.filter(i => i.status !== "paid");
      const expiringDsc = dscs.filter(d => {
        const exp = new Date(d.expiryDate);
        const days = Math.ceil((exp.getTime() - today.getTime()) / 86400000);
        return days <= 30;
      });
      context = `\nFirm context (live data):
- Total tasks: ${tasks.length} (${overdueTasks.length} overdue)
- Unpaid invoices: ${unpaidInvoices.length} totaling ₹${unpaidInvoices.reduce((s, i) => s + (i.totalAmount || 0), 0).toLocaleString("en-IN")}
- DSCs expiring in 30 days: ${expiringDsc.length}
- Upcoming compliance deadlines: ${compliance.slice(0, 3).map(c => `${c.title} (${new Date(c.dueDate).toLocaleDateString("en-IN")})`).join(", ")}`;
    } catch (_) { /* skip context on error */ }
  }

  const systemPrompt = `You are SmartCompliance AI, an expert CA practice management assistant for Indian chartered accountants. You help with:
- GST filings, deadlines, penalties (GSTR-1, GSTR-3B, GSTR-9)
- Income Tax (ITR filing, TDS, advance tax)
- ROC/MCA compliance for companies
- DSC management
- Client and task management advice
- Billing and invoicing best practices

Be concise, use markdown formatting, include specific Indian tax deadlines and amounts. Always respond in the context of Indian tax laws and CA practice.${context}`;

  try {
    const messages = [
      { role: "system", content: systemPrompt },
      ...history.slice(-8), // last 8 messages for context window
      { role: "user", content: message },
    ];

    const res = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "gpt-4o",
        messages,
        max_tokens: 600,
        temperature: 0.7,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("OpenAI error:", errText);
      return c.json({ reply: "Sorry, AI service is temporarily unavailable. Please try again.", timestamp: new Date().toISOString() });
    }

    const data: any = await res.json();
    const reply = data.choices?.[0]?.message?.content || "I couldn't generate a response. Please try again.";
    return c.json({ reply, timestamp: new Date().toISOString() });
  } catch (e: any) {
    console.error("AI chat error:", e);
    return c.json({ reply: "AI service error. Please try again.", timestamp: new Date().toISOString() });
  }
});

// ─── AI INVOICE EXTRACTION ────────────────────────────────────────────────────
app.post("/api/ai/extract-invoice", async (c) => {
  const body = await c.req.json();
  const { image, mimeType, fileName } = body;
  const baseUrl = c.env.AI_GATEWAY_BASE_URL || "https://api.openai.com/v1";
  const apiKey = c.env.AI_GATEWAY_API_KEY;
  if (!apiKey) return c.json({ error: "No API key" }, 500);

  const prompt = `You are an invoice data extraction expert. Extract all key information from this invoice image and return a JSON object with these exact fields:
{
  "vendor": "vendor/seller name",
  "invoiceNo": "invoice number",
  "date": "invoice date as DD/MM/YYYY",
  "amount": "base amount without GST as number string",
  "gst": "GST/tax amount as number string",
  "total": "total amount including GST as number string",
  "description": "brief description of goods/services",
  "gstin": "GSTIN if present or empty string",
  "buyerName": "buyer name if present"
}
Return ONLY the JSON object, no explanation. If a field is not found, use empty string or "0" for amounts.`;

  try {
    const res = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [{
          role: "user",
          content: [
            { type: "text", text: prompt },
            { type: "image_url", image_url: { url: `data:${mimeType || "image/jpeg"};base64,${image}`, detail: "high" } }
          ]
        }],
        max_tokens: 500,
        temperature: 0
      })
    });
    if (!res.ok) {
      const err = await res.text();
      return c.json({ vendor: fileName || "Unknown", invoiceNo: "", date: "", amount: "0", gst: "0", total: "0", description: `API error: ${res.status}` });
    }
    const data: any = await res.json();
    const content = data.choices?.[0]?.message?.content || "{}";
    const cleaned = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    const extracted = JSON.parse(cleaned);
    return c.json(extracted);
  } catch (e: any) {
    return c.json({ vendor: fileName || "Unknown", invoiceNo: "", date: "", amount: "0", gst: "0", total: "0", description: `Extraction failed: ${e.message}` });
  }
});

// ─── SUB-TASKS ────────────────────────────────────────────────────────────────
app.get("/api/tasks/:id/subtasks", async (c) => {
  const db = drizzle(c.env.DB, { schema });
  const { id } = c.req.param();
  const rows = await db.select().from(schema.subTasks).where(eq(schema.subTasks.taskId, id)).orderBy(schema.subTasks.createdAt);
  return c.json(rows);
});
app.post("/api/tasks/:id/subtasks", async (c) => {
  const db = drizzle(c.env.DB, { schema });
  const { id } = c.req.param();
  const body = await c.req.json();
  const row = { id: randomUUID(), taskId: id, title: body.title, status: body.status || "pending", assignedTo: body.assignedTo || null };
  await db.insert(schema.subTasks).values(row);
  return c.json(row, 201);
});
app.put("/api/subtasks/:id", async (c) => {
  const db = drizzle(c.env.DB, { schema });
  const { id } = c.req.param();
  const body = await c.req.json();
  await db.update(schema.subTasks).set(body).where(eq(schema.subTasks.id, id));
  return c.json({ success: true });
});
app.delete("/api/subtasks/:id", async (c) => {
  const db = drizzle(c.env.DB, { schema });
  const { id } = c.req.param();
  await db.delete(schema.subTasks).where(eq(schema.subTasks.id, id));
  return c.json({ success: true });
});

// ─── TIME TRACKING ────────────────────────────────────────────────────────────
app.get("/api/time-logs", async (c) => {
  const db = drizzle(c.env.DB, { schema });
  const firmId = c.req.query("firmId") || "";
  const taskId = c.req.query("taskId");
  const conditions = [eq(schema.timeLogs.firmId, firmId)];
  if (taskId) conditions.push(eq(schema.timeLogs.taskId, taskId));
  const rows = await db.select().from(schema.timeLogs).where(and(...conditions)).orderBy(desc(schema.timeLogs.createdAt));
  return c.json(rows);
});
app.post("/api/time-logs", async (c) => {
  const db = drizzle(c.env.DB, { schema });
  const body = await c.req.json();
  const row = { id: randomUUID(), firmId: body.firmId, taskId: body.taskId, employeeId: body.employeeId, employeeName: body.employeeName, hours: body.hours, description: body.description || null, logDate: body.logDate || new Date().toISOString().slice(0, 10) };
  await db.insert(schema.timeLogs).values(row);
  return c.json(row, 201);
});
app.delete("/api/time-logs/:id", async (c) => {
  const db = drizzle(c.env.DB, { schema });
  const { id } = c.req.param();
  await db.delete(schema.timeLogs).where(eq(schema.timeLogs.id, id));
  return c.json({ success: true });
});

// ─── LEAVE MANAGEMENT ─────────────────────────────────────────────────────────
app.get("/api/leaves", async (c) => {
  const db = drizzle(c.env.DB, { schema });
  const firmId = c.req.query("firmId") || "";
  const empId = c.req.query("employeeId");
  const conditions = [eq(schema.leaveRequests.firmId, firmId)];
  if (empId) conditions.push(eq(schema.leaveRequests.employeeId, empId));
  const rows = await db.select().from(schema.leaveRequests).where(and(...conditions)).orderBy(desc(schema.leaveRequests.createdAt));
  return c.json(rows);
});
app.post("/api/leaves", async (c) => {
  const db = drizzle(c.env.DB, { schema });
  const body = await c.req.json();
  const row = { id: randomUUID(), firmId: body.firmId, employeeId: body.employeeId, employeeName: body.employeeName, leaveType: body.leaveType, fromDate: body.fromDate, toDate: body.toDate, days: body.days, reason: body.reason || null, status: "pending" };
  await db.insert(schema.leaveRequests).values(row);
  return c.json(row, 201);
});
app.put("/api/leaves/:id", async (c) => {
  const db = drizzle(c.env.DB, { schema });
  const { id } = c.req.param();
  const body = await c.req.json();
  await db.update(schema.leaveRequests).set(body).where(eq(schema.leaveRequests.id, id));
  return c.json({ success: true });
});
app.delete("/api/leaves/:id", async (c) => {
  const db = drizzle(c.env.DB, { schema });
  const { id } = c.req.param();
  await db.delete(schema.leaveRequests).where(eq(schema.leaveRequests.id, id));
  return c.json({ success: true });
});

// ─── DOCUMENTS ───────────────────────────────────────────────────────────────
app.get("/api/documents", async (c) => {
  const db = drizzle(c.env.DB, { schema });
  const firmId = c.req.query("firmId");
  const clientId = c.req.query("clientId");
  if (!firmId) return c.json([]);
  let q = db.select().from(schema.documents).where(eq(schema.documents.firmId, firmId));
  const rows = await q;
  const result = clientId
    ? rows.filter(d => d.clientId === clientId && d.isClientVisible !== false)
    : rows;
  return c.json(result);
});

app.post("/api/documents/upload", async (c) => {
  const db = drizzle(c.env.DB, { schema });
  const formData = await c.req.formData();
  const file = formData.get("file") as File | null;
  const firmId = formData.get("firmId") as string;
  const clientId = formData.get("clientId") as string || null;
  const category = (formData.get("category") as string) || "other";
  const uploadedBy = (formData.get("uploadedBy") as string) || "Admin";
  const uploadedByRole = (formData.get("uploadedByRole") as string) || "ca";

  if (!file || !firmId) return c.json({ error: "Missing file or firmId" }, 400);

  const ext = file.name.split(".").pop() || "bin";
  const key = `${firmId}/${randomUUID()}.${ext}`;
  const arrayBuffer = await file.arrayBuffer();

  await c.env.BUCKET.put(key, arrayBuffer, {
    httpMetadata: { contentType: file.type },
  });

  const fileUrl = `/api/documents/file/${key}`;
  const doc = {
    id: randomUUID(),
    firmId,
    clientId,
    name: file.name,
    fileUrl,
    fileType: ext,
    fileSize: file.size,
    category,
    uploadedBy,
    uploadedByRole,
    isClientVisible: true,
  };
  await db.insert(schema.documents).values(doc);
  return c.json(doc, 201);
});

app.get("/api/documents/file/*", async (c) => {
  // key = firmId/uuid.ext (everything after /api/documents/file/)
  const key = c.req.path.replace("/api/documents/file/", "");
  const obj = await c.env.BUCKET.get(key);
  if (!obj) return c.json({ error: "Not found" }, 404);
  const headers = new Headers();
  obj.writeHttpMetadata(headers);
  headers.set("etag", obj.httpEtag);
  return new Response(obj.body, { headers });
});

app.delete("/api/documents/:id", async (c) => {
  const db = drizzle(c.env.DB, { schema });
  const { id } = c.req.param();
  const rows = await db.select().from(schema.documents).where(eq(schema.documents.id, id)).limit(1);
  if (rows[0]?.fileUrl) {
    const key = rows[0].fileUrl.replace("/api/documents/file/", "");
    await c.env.BUCKET.delete(key).catch(() => {});
  }
  await db.delete(schema.documents).where(eq(schema.documents.id, id));
  return c.json({ success: true });
});

// ─── DEMO BOOKING ────────────────────────────────────────────────────────────
app.post("/api/demo", async (c) => {
  const db = drizzle(c.env.DB, { schema });
  const body = await c.req.json();
  await db.insert(schema.demoBookings).values({ id: randomUUID(), ...body });
  return c.json({ success: true, message: "Demo booked! We'll contact you within 24 hours." }, 201);
});

export default app;

// ═══════════════════════════════════════════════════════════════════════════════
// ─── ADMIN BACKEND API ───────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════════

// Seed default superadmin
async function seedAdmin(db: any) {
  await db.insert(schema.adminUsers).values({
    id: "admin1",
    name: "Platform Admin",
    email: "admin@smartcompliance.in",
    password: "admin@123",
    role: "superadmin",
  }).onConflictDoNothing();
}

// ─── ADMIN AUTH ───────────────────────────────────────────────────────────────
app.post("/api/admin/login", async (c) => {
  const db = drizzle(c.env.DB, { schema });
  await seedAdmin(db);
  const { email, password } = await c.req.json();
  const admins = await db.select().from(schema.adminUsers)
    .where(and(eq(schema.adminUsers.email, email), eq(schema.adminUsers.password, password), eq(schema.adminUsers.isActive, true)))
    .limit(1);
  if (!admins.length) return c.json({ error: "Invalid credentials" }, 401);
  return c.json(admins[0]);
});

// ─── ADMIN OVERVIEW ───────────────────────────────────────────────────────────
app.get("/api/admin/stats", async (c) => {
  const db = drizzle(c.env.DB, { schema });
  const [allFirms, allClients, allEmployees, allTasks, allInvoices, openTickets, subs] = await Promise.all([
    db.select().from(schema.firms),
    db.select().from(schema.clients),
    db.select().from(schema.employees),
    db.select().from(schema.tasks),
    db.select().from(schema.invoices),
    db.select().from(schema.supportTickets).where(eq(schema.supportTickets.status, "open")),
    db.select().from(schema.subscriptions),
  ]);
  const totalRevenue = allInvoices.filter(i => i.status === "paid").reduce((s, i) => s + (i.totalAmount || 0), 0);
  const mrr = subs.filter(s => s.status === "active").reduce((s, sub) => s + (sub.amount || 0), 0);
  return c.json({
    totalFirms: allFirms.length,
    totalClients: allClients.length,
    totalEmployees: allEmployees.length,
    totalTasks: allTasks.length,
    totalRevenue,
    mrr,
    openTickets: openTickets.length,
    activeSubs: subs.filter(s => s.status === "active").length,
  });
});

// ─── FIRMS MANAGEMENT ────────────────────────────────────────────────────────
app.get("/api/admin/firms", async (c) => {
  const db = drizzle(c.env.DB, { schema });
  const firms = await db.select().from(schema.firms).orderBy(desc(schema.firms.createdAt));
  // Enrich with sub info
  const subs = await db.select().from(schema.subscriptions);
  const subMap = Object.fromEntries(subs.map(s => [s.firmId, s]));
  return c.json(firms.map(f => ({ ...f, subscription: subMap[f.id] || null })));
});

app.post("/api/admin/firms", async (c) => {
  const db = drizzle(c.env.DB, { schema });
  const body = await c.req.json();
  const id = randomUUID();
  await db.insert(schema.firms).values({ id, ...body });
  // Auto-create free subscription
  await db.insert(schema.subscriptions).values({ id: randomUUID(), firmId: id, plan: "free", status: "active", seats: 5, amount: 0 }).onConflictDoNothing();
  return c.json({ id, ...body }, 201);
});

app.put("/api/admin/firms/:id", async (c) => {
  const db = drizzle(c.env.DB, { schema });
  const { id } = c.req.param();
  const body = await c.req.json();
  await db.update(schema.firms).set(body).where(eq(schema.firms.id, id));
  return c.json({ success: true });
});

app.delete("/api/admin/firms/:id", async (c) => {
  const db = drizzle(c.env.DB, { schema });
  const { id } = c.req.param();
  await db.delete(schema.firms).where(eq(schema.firms.id, id));
  return c.json({ success: true });
});

// ─── USERS (all roles) ────────────────────────────────────────────────────────
app.get("/api/admin/users", async (c) => {
  const db = drizzle(c.env.DB, { schema });
  const [firms, employees, clients] = await Promise.all([
    db.select().from(schema.firms).orderBy(desc(schema.firms.createdAt)),
    db.select().from(schema.employees).orderBy(desc(schema.employees.createdAt)),
    db.select().from(schema.clients).orderBy(desc(schema.clients.createdAt)),
  ]);
  return c.json({ firms, employees, clients });
});

// ─── SUBSCRIPTIONS ────────────────────────────────────────────────────────────
app.get("/api/admin/subscriptions", async (c) => {
  const db = drizzle(c.env.DB, { schema });
  const subs = await db.select().from(schema.subscriptions).orderBy(desc(schema.subscriptions.createdAt));
  const firms = await db.select().from(schema.firms);
  const firmMap = Object.fromEntries(firms.map(f => [f.id, f]));
  return c.json(subs.map(s => ({ ...s, firm: firmMap[s.firmId] || null })));
});

app.put("/api/admin/subscriptions/:firmId", async (c) => {
  const db = drizzle(c.env.DB, { schema });
  const { firmId } = c.req.param();
  const body = await c.req.json();
  const existing = await db.select().from(schema.subscriptions).where(eq(schema.subscriptions.firmId, firmId)).limit(1);
  if (existing.length) {
    await db.update(schema.subscriptions).set(body).where(eq(schema.subscriptions.firmId, firmId));
  } else {
    await db.insert(schema.subscriptions).values({ id: randomUUID(), firmId, ...body });
  }
  return c.json({ success: true });
});

// ─── AI KEYS ──────────────────────────────────────────────────────────────────
app.get("/api/admin/ai-keys", async (c) => {
  const db = drizzle(c.env.DB, { schema });
  const keys = await db.select().from(schema.firmAiKeys);
  const firms = await db.select().from(schema.firms);
  const firmMap = Object.fromEntries(firms.map(f => [f.id, f]));
  return c.json(keys.map(k => ({ ...k, firm: firmMap[k.firmId] || null })));
});

app.put("/api/admin/ai-keys/:firmId", async (c) => {
  const db = drizzle(c.env.DB, { schema });
  const { firmId } = c.req.param();
  const body = await c.req.json();
  const existing = await db.select().from(schema.firmAiKeys).where(eq(schema.firmAiKeys.firmId, firmId)).limit(1);
  if (existing.length) {
    await db.update(schema.firmAiKeys).set(body).where(eq(schema.firmAiKeys.firmId, firmId));
  } else {
    await db.insert(schema.firmAiKeys).values({ id: randomUUID(), firmId, ...body });
  }
  return c.json({ success: true });
});

app.delete("/api/admin/ai-keys/:firmId", async (c) => {
  const db = drizzle(c.env.DB, { schema });
  const { firmId } = c.req.param();
  await db.delete(schema.firmAiKeys).where(eq(schema.firmAiKeys.firmId, firmId));
  return c.json({ success: true });
});

// ─── SUPPORT TICKETS ──────────────────────────────────────────────────────────
app.get("/api/admin/tickets", async (c) => {
  const db = drizzle(c.env.DB, { schema });
  const status = c.req.query("status");
  let q = db.select().from(schema.supportTickets).orderBy(desc(schema.supportTickets.createdAt));
  const tickets = await q;
  return c.json(status ? tickets.filter(t => t.status === status) : tickets);
});

app.put("/api/admin/tickets/:id", async (c) => {
  const db = drizzle(c.env.DB, { schema });
  const { id } = c.req.param();
  const body = await c.req.json();
  await db.update(schema.supportTickets).set({ ...body, updatedAt: new Date() }).where(eq(schema.supportTickets.id, id));
  return c.json({ success: true });
});

app.get("/api/admin/tickets/:id/replies", async (c) => {
  const db = drizzle(c.env.DB, { schema });
  const { id } = c.req.param();
  const replies = await db.select().from(schema.supportReplies).where(eq(schema.supportReplies.ticketId, id)).orderBy(schema.supportReplies.createdAt);
  return c.json(replies);
});

app.post("/api/admin/tickets/:id/reply", async (c) => {
  const db = drizzle(c.env.DB, { schema });
  const { id } = c.req.param();
  const body = await c.req.json();
  const reply = { id: randomUUID(), ticketId: id, ...body };
  await db.insert(schema.supportReplies).values(reply);
  await db.update(schema.supportTickets).set({ status: "in_progress", updatedAt: new Date() }).where(eq(schema.supportTickets.id, id));
  return c.json(reply, 201);
});

// ─── PUBLIC: Submit support ticket (from CA/client portal) ───────────────────
app.post("/api/support/tickets", async (c) => {
  const db = drizzle(c.env.DB, { schema });
  const body = await c.req.json();
  const ticket = { id: randomUUID(), ...body };
  await db.insert(schema.supportTickets).values(ticket);
  return c.json(ticket, 201);
});

app.get("/api/support/tickets", async (c) => {
  const db = drizzle(c.env.DB, { schema });
  const firmId = c.req.query("firmId");
  const userId = c.req.query("userId");
  if (!firmId) return c.json([]);
  const all = await db.select().from(schema.supportTickets).where(eq(schema.supportTickets.firmId, firmId)).orderBy(desc(schema.supportTickets.createdAt));
  return c.json(userId ? all.filter(t => t.userId === userId) : all);
});

app.get("/api/support/tickets/:id/replies", async (c) => {
  const db = drizzle(c.env.DB, { schema });
  const { id } = c.req.param();
  return c.json(await db.select().from(schema.supportReplies).where(eq(schema.supportReplies.ticketId, id)).orderBy(schema.supportReplies.createdAt));
});

app.post("/api/support/tickets/:id/reply", async (c) => {
  const db = drizzle(c.env.DB, { schema });
  const { id } = c.req.param();
  const body = await c.req.json();
  const reply = { id: randomUUID(), ticketId: id, ...body };
  await db.insert(schema.supportReplies).values(reply);
  return c.json(reply, 201);
});

// ─── ANNOUNCEMENTS ────────────────────────────────────────────────────────────
app.get("/api/admin/announcements", async (c) => {
  const db = drizzle(c.env.DB, { schema });
  return c.json(await db.select().from(schema.announcements).orderBy(desc(schema.announcements.createdAt)));
});

app.post("/api/admin/announcements", async (c) => {
  const db = drizzle(c.env.DB, { schema });
  const body = await c.req.json();
  const row = { id: randomUUID(), ...body };
  await db.insert(schema.announcements).values(row);
  return c.json(row, 201);
});

app.put("/api/admin/announcements/:id", async (c) => {
  const db = drizzle(c.env.DB, { schema });
  const { id } = c.req.param();
  const body = await c.req.json();
  await db.update(schema.announcements).set(body).where(eq(schema.announcements.id, id));
  return c.json({ success: true });
});

app.delete("/api/admin/announcements/:id", async (c) => {
  const db = drizzle(c.env.DB, { schema });
  const { id } = c.req.param();
  await db.delete(schema.announcements).where(eq(schema.announcements.id, id));
  return c.json({ success: true });
});

// ─── PUBLIC: Get active announcements ────────────────────────────────────────
app.get("/api/announcements", async (c) => {
  const db = drizzle(c.env.DB, { schema });
  const role = c.req.query("role") || "all";
  const all = await db.select().from(schema.announcements).where(eq(schema.announcements.isActive, true)).orderBy(desc(schema.announcements.createdAt));
  return c.json(all.filter(a => a.targetRole === "all" || a.targetRole === role));
});

// ─── ADMIN USERS MANAGEMENT ───────────────────────────────────────────────────
app.get("/api/admin/admins", async (c) => {
  const db = drizzle(c.env.DB, { schema });
  await seedAdmin(db);
  return c.json(await db.select().from(schema.adminUsers).orderBy(desc(schema.adminUsers.createdAt)));
});

app.post("/api/admin/admins", async (c) => {
  const db = drizzle(c.env.DB, { schema });
  const body = await c.req.json();
  const row = { id: randomUUID(), ...body };
  await db.insert(schema.adminUsers).values(row);
  return c.json(row, 201);
});

app.put("/api/admin/admins/:id", async (c) => {
  const db = drizzle(c.env.DB, { schema });
  const { id } = c.req.param();
  const body = await c.req.json();
  await db.update(schema.adminUsers).set(body).where(eq(schema.adminUsers.id, id));
  return c.json({ success: true });
});
