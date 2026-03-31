import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

// ─── CA FIRMS ───────────────────────────────────────────────────────────────
export const firms = sqliteTable("firms", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  ownerName: text("owner_name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone"),
  gstin: text("gstin"),
  address: text("address"),
  city: text("city"),
  aiAutoAssign: integer("ai_auto_assign", { mode: "boolean" }).default(false),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// ─── EMPLOYEES (Staff of a CA Firm) ─────────────────────────────────────────
export const employees = sqliteTable("employees", {
  id: text("id").primaryKey(),
  firmId: text("firm_id").notNull(),        // which CA firm
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone"),
  role: text("role").notNull().default("staff"), // manager, staff, intern
  specialization: text("specialization"),   // gst, itr, audit, general
  activeTaskCount: integer("active_task_count").default(0),
  status: text("status").default("active"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// ─── CLIENTS ──────────────────────────────────────────────────────────────────
export const clients = sqliteTable("clients", {
  id: text("id").primaryKey(),
  firmId: text("firm_id").notNull(),        // which CA firm owns this client
  name: text("name").notNull(),
  email: text("email"),
  phone: text("phone").notNull(),
  pan: text("pan"),
  gstin: text("gstin"),
  clientType: text("client_type").notNull().default("individual"),
  address: text("address"),
  city: text("city"),
  state: text("state"),
  pincode: text("pincode"),
  assignedEmployeeId: text("assigned_employee_id"), // employee handling this client
  status: text("status").notNull().default("active"),
  notes: text("notes"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// ─── TASKS ────────────────────────────────────────────────────────────────────
export const tasks = sqliteTable("tasks", {
  id: text("id").primaryKey(),
  firmId: text("firm_id").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  clientId: text("client_id"),
  assignedEmployeeId: text("assigned_employee_id"),
  category: text("category").notNull().default("general"),
  status: text("status").notNull().default("pending"),
  priority: text("priority").notNull().default("medium"),
  dueDate: integer("due_date", { mode: "timestamp" }),
  completedAt: integer("completed_at", { mode: "timestamp" }),
  recurring: text("recurring").default("none"),
  billingAmount: real("billing_amount"),
  notes: text("notes"),
  autoAssigned: integer("auto_assigned", { mode: "boolean" }).default(false),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// ─── INVOICES ────────────────────────────────────────────────────────────────
export const invoices = sqliteTable("invoices", {
  id: text("id").primaryKey(),
  firmId: text("firm_id").notNull(),
  invoiceNo: text("invoice_no").notNull(),
  clientId: text("client_id").notNull(),
  taskId: text("task_id"),
  amount: real("amount").notNull(),
  gstAmount: real("gst_amount").default(0),
  totalAmount: real("total_amount").notNull(),
  status: text("status").notNull().default("unpaid"),
  dueDate: integer("due_date", { mode: "timestamp" }),
  paidAt: integer("paid_at", { mode: "timestamp" }),
  description: text("description"),
  billingEntity: text("billing_entity"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// ─── COMPLIANCE DATES (global + firm-specific) ────────────────────────────────
export const complianceDates = sqliteTable("compliance_dates", {
  id: text("id").primaryKey(),
  firmId: text("firm_id"),               // null = global for all
  title: text("title").notNull(),
  description: text("description"),
  dueDate: integer("due_date", { mode: "timestamp" }).notNull(),
  category: text("category").notNull(),
  applicableTo: text("applicable_to"),
  penaltyAmount: text("penalty_amount"),
  isActive: integer("is_active", { mode: "boolean" }).default(true),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// ─── DOCUMENTS ────────────────────────────────────────────────────────────────
export const documents = sqliteTable("documents", {
  id: text("id").primaryKey(),
  firmId: text("firm_id").notNull(),
  clientId: text("client_id"),
  taskId: text("task_id"),
  name: text("name").notNull(),
  fileUrl: text("file_url"),
  fileType: text("file_type"),
  fileSize: integer("file_size"),
  category: text("category").default("general"),
  uploadedBy: text("uploaded_by"),
  uploadedByRole: text("uploaded_by_role"), // ca, employee, client
  isClientVisible: integer("is_client_visible", { mode: "boolean" }).default(true),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// ─── DSC RECORDS ──────────────────────────────────────────────────────────────
export const dscRecords = sqliteTable("dsc_records", {
  id: text("id").primaryKey(),
  firmId: text("firm_id").notNull(),
  clientId: text("client_id").notNull(),
  holderName: text("holder_name").notNull(),
  dscClass: text("dsc_class").notNull(),
  issuer: text("issuer"),
  serialNo: text("serial_no"),
  expiryDate: integer("expiry_date", { mode: "timestamp" }).notNull(),
  tokenNo: text("token_no"),
  status: text("status").default("active"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// ─── ATTENDANCE ───────────────────────────────────────────────────────────────
export const attendance = sqliteTable("attendance", {
  id: text("id").primaryKey(),
  firmId: text("firm_id").notNull(),
  employeeId: text("employee_id").notNull(),
  date: text("date").notNull(),
  checkIn: text("check_in"),
  checkOut: text("check_out"),
  status: text("status").default("present"),
  workHours: real("work_hours"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// ─── CHAT MESSAGES ────────────────────────────────────────────────────────────
export const chatMessages = sqliteTable("chat_messages", {
  id: text("id").primaryKey(),
  firmId: text("firm_id").notNull(),
  // conversation key: sorted combo of senderId+receiverId
  conversationId: text("conversation_id").notNull(),
  senderId: text("sender_id").notNull(),
  senderName: text("sender_name").notNull(),
  senderRole: text("sender_role").notNull(), // ca, employee, client
  receiverId: text("receiver_id").notNull(),
  receiverName: text("receiver_name").notNull(),
  receiverRole: text("receiver_role").notNull(),
  content: text("content").notNull(),
  messageType: text("message_type").default("text"), // text, file, system
  isRead: integer("is_read", { mode: "boolean" }).default(false),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// ─── NOTIFICATIONS ────────────────────────────────────────────────────────────
export const notifications = sqliteTable("notifications", {
  id: text("id").primaryKey(),
  firmId: text("firm_id").notNull(),
  userId: text("user_id").notNull(),
  userRole: text("user_role").notNull(),
  title: text("title").notNull(),
  message: text("message").notNull(),
  type: text("type").default("info"), // info, warning, success, error
  isRead: integer("is_read", { mode: "boolean" }).default(false),
  link: text("link"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// ─── SUB-TASKS ────────────────────────────────────────────────────────────────
export const subTasks = sqliteTable("sub_tasks", {
  id: text("id").primaryKey(),
  taskId: text("task_id").notNull(),
  title: text("title").notNull(),
  status: text("status").default("pending"), // pending, in_progress, completed
  assignedTo: text("assigned_to"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// ─── TIME LOGS ────────────────────────────────────────────────────────────────
export const timeLogs = sqliteTable("time_logs", {
  id: text("id").primaryKey(),
  firmId: text("firm_id").notNull(),
  taskId: text("task_id").notNull(),
  employeeId: text("employee_id").notNull(),
  employeeName: text("employee_name").notNull(),
  hours: real("hours").notNull(),
  description: text("description"),
  logDate: text("log_date").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// ─── LEAVE REQUESTS ───────────────────────────────────────────────────────────
export const leaveRequests = sqliteTable("leave_requests", {
  id: text("id").primaryKey(),
  firmId: text("firm_id").notNull(),
  employeeId: text("employee_id").notNull(),
  employeeName: text("employee_name").notNull(),
  leaveType: text("leave_type").notNull(), // casual, sick, earned, half_day
  fromDate: text("from_date").notNull(),
  toDate: text("to_date").notNull(),
  days: real("days").notNull(),
  reason: text("reason"),
  status: text("status").default("pending"), // pending, approved, rejected
  reviewedBy: text("reviewed_by"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// ─── DEMO BOOKINGS ────────────────────────────────────────────────────────────
export const demoBookings = sqliteTable("demo_bookings", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  firmName: text("firm_name"),
  teamSize: text("team_size"),
  message: text("message"),
  status: text("status").default("pending"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});
