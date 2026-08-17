// ─── ROUTES ──────────────────────────────────────────────────────────────────
// Single source of truth for all admin route paths.
// Use these everywhere instead of string literals so renames are one change.

export const ROUTES = {
  LOGIN: "/login",
  DASHBOARD: "/admin/dashboard",

  ROOMS: "/admin/rooms",
  ROOM_NEW: "/admin/rooms/new",
  ROOM_EDIT: (roomNumber) => `/admin/rooms/${roomNumber}/edit`,

  DEALS: "/admin/deals",
  DEAL_NEW: "/admin/deals/new",
  DEAL_EDIT: (id) => `/admin/deals/${id}/edit`,

  DOCUMENTS: "/admin/documents",

  BLOG: "/admin/blog",
  CONTENT: "/admin/content",
  SETTINGS: "/admin/settings",
  AUDIT_LOGS: "/admin/audit-logs",
  TRASH: "/admin/trash",
};

// ─── API ENDPOINTS ───────────────────────────────────────────────────────────
// These paths point to the hotel Express backend.
// The backend is responsible for authentication, authorization,
// database access, and resource handling.

export const API = {
  // ─── AUTH ──────────────────────────────────────────────────────────────────
  // Authentication uses the HTTP-only token cookie supplied by the
  // hotel backend. The CMS does not store the token itself.

  LOGIN: "/auth/login",
  LOGOUT: "/auth/logout",
  ME: "/auth/profile",

  // ─── ROOMS ────────────────────────────────────────────────────────────────
  ROOMS: "/rooms",
  ROOM: (roomNumber) => `/rooms/${roomNumber}`,

  // ─── DEALS ────────────────────────────────────────────────────────────────
  DEALS: "/deals",
  DEAL: (id) => `/deals/${id}`,
  DEALS_ADMIN: "/deals/admin",

  // ─── DOCUMENTS ────────────────────────────────────────────────────────────
  DOCUMENTS: "/documents",
  DOCUMENT: (id) => `/documents/${id}`,

  // ─── BLOG ─────────────────────────────────────────────────────────────────
  // These endpoints will be implemented in the hotel Express backend.

  POSTS: "/posts",
  POST: (id) => `/posts/${id}`,

  // ─── CONTENT ──────────────────────────────────────────────────────────────
  // These endpoints will be implemented in the hotel Express backend.

  CONTENT: "/content",
  CONTENT_SECTION: (section) => `/content/${section.replace(/_/g, "-")}`,

  // ─── SETTINGS ─────────────────────────────────────────────────────────────
  // These endpoints will be implemented in the hotel Express backend.

  SETTINGS: "/settings",
  SETTINGS_SECTION: (section) => `/settings/${section}`,

  // ─── AUDIT LOGS ───────────────────────────────────────────────────────────
  // Backend audit endpoints will be added later.
  // Authentication identifies the acting user through req.user.

  AUDIT_LOGS: "/audit-logs",

  // ─── MEDIA ────────────────────────────────────────────────────────────────
  UPLOAD_IMAGE: "/media/upload",
};

// ─── PERMISSIONS ─────────────────────────────────────────────────────────────
// The hotel backend currently uses the roles:
// admin, receptionist, guest.
//
// The CMS is restricted to administrators.

export const ROLES = {
  ADMIN: "admin",
};

export const PERMISSIONS = {
  [ROLES.ADMIN]: [
    "rooms.create",
    "rooms.edit",
    "rooms.delete",

    "deals.create",
    "deals.edit",
    "deals.delete",

    "documents.create",
    "documents.delete",

    "blog.create",
    "blog.edit",
    "blog.delete",

    "content.edit",

    "settings.edit",
  ],
};

// ─── ROOM ────────────────────────────────────────────────────────────────────

export const ROOM_TYPES = {
  SINGLE: "single",
  STANDARD: "standard",
  DELUXE: "deluxe",
  DOUBLE: "double",
  SUITE: "suite",
  EXECUTIVE: "executive",
};

export const ROOM_TYPES_LABELS = {
  [ROOM_TYPES.SINGLE]: "Single",
  [ROOM_TYPES.STANDARD]: "Standard",
  [ROOM_TYPES.DELUXE]: "Deluxe",
  [ROOM_TYPES.DOUBLE]: "Double",
  [ROOM_TYPES.SUITE]: "Suite",
  [ROOM_TYPES.EXECUTIVE]: "Executive",
};

// ─── DOCUMENT ────────────────────────────────────────────────────────────────

export const DOCUMENT_CATEGORY = {
  MENU: "menu",
  POLICY: "policy",
  FLOOR_PLAN: "floor_plan",
  BROCHURE: "brochure",
  OTHER: "other",
};

export const DOCUMENT_CATEGORY_LABELS = {
  [DOCUMENT_CATEGORY.MENU]: "Menu",
  [DOCUMENT_CATEGORY.POLICY]: "Policy",
  [DOCUMENT_CATEGORY.FLOOR_PLAN]: "Floor Plan",
  [DOCUMENT_CATEGORY.BROCHURE]: "Brochure",
  [DOCUMENT_CATEGORY.OTHER]: "Other",
};

export const DOCUMENT_CATEGORY_COLOURS = {
  [DOCUMENT_CATEGORY.MENU]: "bg-amber-50 text-amber-700",

  [DOCUMENT_CATEGORY.POLICY]: "bg-brand-100 text-brand-500",

  [DOCUMENT_CATEGORY.FLOOR_PLAN]: "bg-blue-50 text-blue-700",

  [DOCUMENT_CATEGORY.BROCHURE]: "bg-purple-50 text-purple-700",

  [DOCUMENT_CATEGORY.OTHER]: "bg-brand-100 text-brand-500",
};

// ─── BLOG ────────────────────────────────────────────────────────────────────

export const POST_STATUS = {
  DRAFT: "draft",
  PUBLISHED: "published",
};

export const POST_STATUS_LABELS = {
  [POST_STATUS.DRAFT]: "Draft",
  [POST_STATUS.PUBLISHED]: "Published",
};

export const POST_STATUS_COLOURS = {
  [POST_STATUS.DRAFT]: "bg-brand-100 text-brand-500",

  [POST_STATUS.PUBLISHED]: "bg-emerald-50 text-emerald-700",
};

// ─── AUDIT ───────────────────────────────────────────────────────────────────

export const AUDIT_ACTIONS = {
  CREATE: "create",
  UPDATE: "update",
  DELETE: "delete",
  RESTORE: "restore",
  LOGIN: "login",
  LOGOUT: "logout",
};

export const AUDIT_ACTION_LABELS = {
  [AUDIT_ACTIONS.CREATE]: "Created",
  [AUDIT_ACTIONS.UPDATE]: "Updated",
  [AUDIT_ACTIONS.DELETE]: "Deleted",
  [AUDIT_ACTIONS.RESTORE]: "Restored",
  [AUDIT_ACTIONS.LOGIN]: "Logged in",
  [AUDIT_ACTIONS.LOGOUT]: "Logged out",
};
