import api from "../../../app/api";
import { shouldUseMocks } from "../../../utils/mockMode";
import { mockGetContent, mockUpdateSection } from "./mockContent";

const EMPTY_CONTENT = {
  home: {},
  navigation: {},
  contact: {},
  footer: {},
  seo: {},
};

function normalizeContent(raw) {
  if (!raw) return EMPTY_CONTENT;

  const source =
    raw.content &&
    typeof raw.content === "object" &&
    !Array.isArray(raw.content)
      ? raw.content
      : {};

  const records = Array.isArray(raw.records)
    ? raw.records
    : Array.isArray(raw.data)
      ? raw.data
      : Array.isArray(raw)
        ? raw
        : [];

  const grouped = {
    ...EMPTY_CONTENT,
    ...source,

    home: {
      ...EMPTY_CONTENT.home,
      ...(source.home || {}),
    },

    navigation: {
      ...EMPTY_CONTENT.navigation,
      ...(source.navigation || {}),
    },

    contact: {
      ...EMPTY_CONTENT.contact,
      ...(source.contact || {}),
    },

    footer: {
      ...EMPTY_CONTENT.footer,
      ...(source.footer || {}),
    },

    seo: {
      ...EMPTY_CONTENT.seo,
      ...(source.seo || {}),
    },
  };

  // Database records are the source of truth.
  // Records are mapped into their page object so the
  // Content.jsx fields can read them correctly.
  for (const record of records) {
    if (!record || typeof record !== "object") continue;

    const page = record.page || record.slug || record.section;

    const key = record.key || record.field || record.name;

    if (!page || !key) continue;

    if (!grouped[page] || typeof grouped[page] !== "object") {
      grouped[page] = {};
    }

    const value = record.value ?? record.content ?? "";

    grouped[page][key] = value;
  }

  return grouped;
}

export async function getContent() {
  if (shouldUseMocks()) {
    return mockGetContent();
  }

  const { data } = await api.get("/content");

  return normalizeContent(data);
}

export async function getPageContent(page) {
  if (shouldUseMocks()) {
    const content = await mockGetContent();

    return content?.[page] ?? {};
  }

  const { data } = await api.get(`/content/${encodeURIComponent(page)}`);

  const normalized = normalizeContent(data);

  return normalized?.[page] ?? {};
}

export async function createContent(payload) {
  if (shouldUseMocks()) {
    return mockUpdateSection(payload?.section, payload);
  }

  const normalizedPayload = {
    page: payload.page,
    section: payload.section,
    key: payload.key,
    value: payload.value ?? "",
    type: payload.type || "text",
  };

  const { data } = await api.post("/content", normalizedPayload);

  return data;
}

export async function updateContent(id, payload) {
  if (shouldUseMocks()) {
    return mockUpdateSection(payload?.section, payload);
  }

  const normalizedPayload = {
    page: payload.page,
    section: payload.section,
    key: payload.key,
    value: payload.value ?? "",
    type: payload.type || "text",
  };

  const { data } = await api.put(`/content/${id}`, normalizedPayload);

  return data;
}

export async function deleteContent(id) {
  if (shouldUseMocks()) {
    return {
      message: "Content deleted",
    };
  }

  const { data } = await api.delete(`/content/${id}`);

  return data;
}

export async function updateSection(section, payload = {}) {
  if (shouldUseMocks()) {
    return mockUpdateSection(section, payload);
  }

  const { data } = await api.get("/content");

  const records = Array.isArray(data?.records)
    ? data.records
    : Array.isArray(data?.data)
      ? data.data
      : Array.isArray(data)
        ? data
        : [];

  const page = payload.page || section;

  const ignoredKeys = new Set([
    "id",
    "page",
    "section",
    "key",
    "type",
    "created_at",
    "updated_at",
    "createdAt",
    "updatedAt",
  ]);

  const fields = Object.entries(payload).filter(
    ([key]) => !ignoredKeys.has(key),
  );

  const results = await Promise.all(
    fields.map(async ([key, value]) => {
      const existing = records.find(
        (record) =>
          record?.page === page &&
          record?.section === section &&
          record?.key === key,
      );

      const contentType =
        typeof value === "boolean"
          ? "boolean"
          : typeof value === "number"
            ? "number"
            : "text";

      const recordPayload = {
        page,
        section,
        key,
        value: value === null || value === undefined ? "" : String(value),
        type: contentType,
      };

      if (existing?.id) {
        return updateContent(existing.id, recordPayload);
      }

      return createContent(recordPayload);
    }),
  );

  return results;
}
