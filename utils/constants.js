// ─── ROUTES ──────────────────────────────────────────────────────────────────
// Single source of truth for all admin route paths.
// Use these everywhere instead of string literals so renames are one change.
export const ROUTES = {
  LOGIN:           '/login',
  DASHBOARD:       '/admin/dashboard',
  UNITS:           '/admin/units',
  UNIT_NEW:        '/admin/units/new',
  UNIT:            (id) => `/admin/units/${id}`,
  UNIT_EDIT:       (id) => `/admin/units/${id}/edit`,
  PROJECTS:        '/admin/projects',
  PROJECT_NEW:     '/admin/projects/new',
  PROJECT:         (id) => `/admin/projects/${id}`,
  PROJECT_EDIT:    (id) => `/admin/projects/${id}/edit`,
  LEADS:           '/admin/leads',
  LEAD:            (id) => `/admin/leads/${id}`,
  DOCUMENTS:       '/admin/documents',
  BLOG:            '/admin/blog',
  POST_NEW:        '/admin/blog/new',
  POST_EDIT:       (id) => `/admin/blog/${id}/edit`,
  CONTENT:         '/admin/content',
  SETTINGS:        '/admin/settings',
  TESTIMONIALS:    '/admin/testimonials',
  AUDIT_LOGS:      '/admin/audit-logs',
  TRASH:           '/admin/trash',
}

// ─── API ENDPOINTS ───────────────────────────────────────────────────────────
// Mirrors the Laravel route contract. Change once here, propagates everywhere.
export const API = {
  LOGIN:              '/login',
  LOGOUT:             '/logout',
  ME:                 '/me',
  UNITS:              '/units',
  UNIT:               (id) => `/units/${id}`,
  UNIT_IMAGES:        (id) => `/units/${id}/images`,
  PROJECTS:           '/projects',
  PROJECT:            (id) => `/projects/${id}`,
  MILESTONE:          (pid, mid) => `/projects/${pid}/milestones${mid ? `/${mid}` : ''}`,
  LEADS:              '/leads',
  LEAD:               (id) => `/leads/${id}`,
  DOCUMENTS:          '/documents',
  DOCUMENT:           (id) => `/documents/${id}`,
  POSTS:              '/posts',
  POST:               (id) => `/posts/${id}`,
  CONTENT:            '/content',
  CONTENT_SECTION:    (s) => `/content/${s.replace(/_/g, '-')}`,
  SETTINGS:           '/settings',
  SETTINGS_SECTION:   (s) => `/settings/${s}`,
  AUDIT_LOGS:         '/audit-logs',
  UPLOAD_IMAGE:       '/media/upload',
}

// ─── PERMISSIONS ─────────────────────────────────────────────────────────────
export const ROLES = {
  ADMIN:   'admin',
  MANAGER: 'manager',
  VIEWER:  'viewer',
}

// What each role can do. Features not in a role's list are read-only or hidden.
export const PERMISSIONS = {
  [ROLES.ADMIN]: [
    'units.create', 'units.edit', 'units.delete',
    'projects.create', 'projects.edit', 'projects.delete',
    'leads.edit', 'leads.delete',
    'documents.create', 'documents.edit', 'documents.delete',
    'blog.create', 'blog.edit', 'blog.delete',
    'content.edit',
    'settings.edit',
    'users.manage',
  ],
  [ROLES.MANAGER]: [
    'units.create', 'units.edit',
    'projects.create', 'projects.edit',
    'leads.edit',
    'documents.create', 'documents.edit',
    'blog.create', 'blog.edit',
    'content.edit',
  ],
  [ROLES.VIEWER]: [],
}

// ─── UNIT ────────────────────────────────────────────────────────────────────
export const UNIT_STATUS = {
  AVAILABLE: 'available',
  RESERVED:  'reserved',
  SOLD:      'sold',
}

export const UNIT_STATUS_LABELS = {
  [UNIT_STATUS.AVAILABLE]: 'Available',
  [UNIT_STATUS.RESERVED]:  'Reserved',
  [UNIT_STATUS.SOLD]:      'Sold',
}

export const UNIT_STATUS_COLOURS = {
  [UNIT_STATUS.AVAILABLE]: 'bg-emerald-50 text-emerald-700',
  [UNIT_STATUS.RESERVED]:  'bg-amber-50 text-amber-700',
  [UNIT_STATUS.SOLD]:      'bg-brand-100 text-brand-500',
}

export const UNIT_TYPES = {
  STUDIO:    'studio',
  ONE_BR:    '1br',
  TWO_BR:    '2br',
  THREE_BR:  '3br',
  PENTHOUSE: 'penthouse',
}

export const UNIT_TYPE_LABELS = {
  [UNIT_TYPES.STUDIO]:    'Studio',
  [UNIT_TYPES.ONE_BR]:    '1 Bedroom',
  [UNIT_TYPES.TWO_BR]:    '2 Bedroom',
  [UNIT_TYPES.THREE_BR]:  '3 Bedroom',
  [UNIT_TYPES.PENTHOUSE]: 'Penthouse',
}

// ─── PROJECT ─────────────────────────────────────────────────────────────────
export const PROJECT_STATUS = {
  PLANNING:    'planning',
  IN_PROGRESS: 'in_progress',
  COMPLETED:   'completed',
}

export const PROJECT_STATUS_LABELS = {
  [PROJECT_STATUS.PLANNING]:    'Planning',
  [PROJECT_STATUS.IN_PROGRESS]: 'In Progress',
  [PROJECT_STATUS.COMPLETED]:   'Completed',
}

export const PROJECT_STATUS_COLOURS = {
  [PROJECT_STATUS.PLANNING]:    'bg-brand-100 text-brand-500',
  [PROJECT_STATUS.IN_PROGRESS]: 'bg-amber-50 text-amber-700',
  [PROJECT_STATUS.COMPLETED]:   'bg-emerald-50 text-emerald-700',
}

// ─── MILESTONE ───────────────────────────────────────────────────────────────
export const MILESTONE_STATUS = {
  UPCOMING:    'upcoming',
  IN_PROGRESS: 'in_progress',
  COMPLETED:   'completed',
}

export const MILESTONE_STATUS_LABELS = {
  [MILESTONE_STATUS.UPCOMING]:    'Upcoming',
  [MILESTONE_STATUS.IN_PROGRESS]: 'In Progress',
  [MILESTONE_STATUS.COMPLETED]:   'Completed',
}

export const MILESTONE_STATUS_COLOURS = {
  [MILESTONE_STATUS.UPCOMING]:    'bg-brand-100 text-brand-500',
  [MILESTONE_STATUS.IN_PROGRESS]: 'bg-amber-50 text-amber-700',
  [MILESTONE_STATUS.COMPLETED]:   'bg-emerald-50 text-emerald-700',
}

// ─── LEAD ────────────────────────────────────────────────────────────────────
export const LEAD_STATUS = {
  NEW:               'new',
  CONTACTED:         'contacted',
  SITE_VISIT_BOOKED: 'site_visit_booked',
  CONVERTED:         'converted',
  LOST:              'lost',
}

export const LEAD_STATUS_LABELS = {
  [LEAD_STATUS.NEW]:               'New',
  [LEAD_STATUS.CONTACTED]:         'Contacted',
  [LEAD_STATUS.SITE_VISIT_BOOKED]: 'Site Visit Booked',
  [LEAD_STATUS.CONVERTED]:         'Converted',
  [LEAD_STATUS.LOST]:              'Lost',
}

export const LEAD_STATUS_ORDER = [
  LEAD_STATUS.NEW,
  LEAD_STATUS.CONTACTED,
  LEAD_STATUS.SITE_VISIT_BOOKED,
  LEAD_STATUS.CONVERTED,
  LEAD_STATUS.LOST,
]

export const LEAD_STATUS_COLOURS = {
  [LEAD_STATUS.NEW]:               'bg-blue-50 text-blue-700',
  [LEAD_STATUS.CONTACTED]:         'bg-amber-50 text-amber-700',
  [LEAD_STATUS.SITE_VISIT_BOOKED]: 'bg-purple-50 text-purple-700',
  [LEAD_STATUS.CONVERTED]:         'bg-emerald-50 text-emerald-700',
  [LEAD_STATUS.LOST]:              'bg-brand-100 text-brand-500',
}

export const LEAD_SOURCE = {
  WEBSITE_FORM:       'website_form',
  SITE_VISIT_REQUEST: 'site_visit_request',
  PHONE:              'phone',
  REFERRAL:           'referral',
  WALK_IN:            'walk_in',
  OTHER:              'other',
}

export const LEAD_SOURCE_LABELS = {
  [LEAD_SOURCE.WEBSITE_FORM]:       'Website Form',
  [LEAD_SOURCE.SITE_VISIT_REQUEST]: 'Site Visit Request',
  [LEAD_SOURCE.PHONE]:              'Phone',
  [LEAD_SOURCE.REFERRAL]:           'Referral',
  [LEAD_SOURCE.WALK_IN]:            'Walk-in',
  [LEAD_SOURCE.OTHER]:              'Other',
}

// ─── DOCUMENT ────────────────────────────────────────────────────────────────
export const DOCUMENT_CATEGORY = {
  BROCHURE:        'brochure',
  FLOOR_PLAN:      'floor_plan',
  INVESTMENT_DECK: 'investment_deck',
  OTHER:           'other',
}

export const DOCUMENT_CATEGORY_LABELS = {
  [DOCUMENT_CATEGORY.BROCHURE]:        'Brochure',
  [DOCUMENT_CATEGORY.FLOOR_PLAN]:      'Floor Plan',
  [DOCUMENT_CATEGORY.INVESTMENT_DECK]: 'Investment Deck',
  [DOCUMENT_CATEGORY.OTHER]:           'Other',
}

export const DOCUMENT_CATEGORY_COLOURS = {
  [DOCUMENT_CATEGORY.BROCHURE]:        'bg-amber-50 text-amber-700',
  [DOCUMENT_CATEGORY.FLOOR_PLAN]:      'bg-blue-50 text-blue-700',
  [DOCUMENT_CATEGORY.INVESTMENT_DECK]: 'bg-purple-50 text-purple-700',
  [DOCUMENT_CATEGORY.OTHER]:           'bg-brand-100 text-brand-500',
}

// ─── BLOG ────────────────────────────────────────────────────────────────────
export const POST_STATUS = {
  DRAFT:     'draft',
  PUBLISHED: 'published',
}

export const POST_STATUS_LABELS = {
  [POST_STATUS.DRAFT]:     'Draft',
  [POST_STATUS.PUBLISHED]: 'Published',
}

export const POST_STATUS_COLOURS = {
  [POST_STATUS.DRAFT]:     'bg-brand-100 text-brand-500',
  [POST_STATUS.PUBLISHED]: 'bg-emerald-50 text-emerald-700',
}

// ─── AUDIT ───────────────────────────────────────────────────────────────────
export const AUDIT_ACTIONS = {
  CREATE:  'create',
  UPDATE:  'update',
  DELETE:  'delete',
  RESTORE: 'restore',
  LOGIN:   'login',
  LOGOUT:  'logout',
}

export const AUDIT_ACTION_LABELS = {
  [AUDIT_ACTIONS.CREATE]:  'Created',
  [AUDIT_ACTIONS.UPDATE]:  'Updated',
  [AUDIT_ACTIONS.DELETE]:  'Deleted',
  [AUDIT_ACTIONS.RESTORE]: 'Restored',
  [AUDIT_ACTIONS.LOGIN]:   'Logged in',
  [AUDIT_ACTIONS.LOGOUT]:  'Logged out',
}
