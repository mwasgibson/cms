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

  let source = {};
  let records = [];

  if (
    raw.content &&
    typeof raw.content === "object" &&
    !Array.isArray(raw.content)
  ) {
    source = raw.content;
  } else if (
    raw.data &&
    typeof raw.data === "object" &&
    !Array.isArray(raw.data)
  ) {
    source = raw.data;
  } else if (!Array.isArray(raw) && typeof raw === "object") {
    source = raw;
  }

  if (Array.isArray(raw)) {
    records = raw;
  } else if (Array.isArray(raw.records)) {
    records = raw.records;
  } else if (Array.isArray(raw.data)) {
    records = raw.data;
  } else if (Array.isArray(raw.content)) {
    records = raw.content;
  } else if (source && Array.isArray(source.records)) {
    records = source.records;
  }

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

  for (const record of records) {
    if (!record || typeof record !== "object") continue;

    const page = record.page || record.slug || record.section;
    const key = record.key || record.field || record.name;

    if (!page || !key) continue;

    if (!grouped[page] || typeof grouped[page] !== "object") {
      grouped[page] = {};
    }

    let value = record.value ?? record.content ?? "";

    if (record.type === "json" && typeof value === "string") {
      try {
        value = JSON.parse(value);
      } catch {
        // Keep the original value if it is not valid JSON.
      }
    }

    grouped[page][key] = value;
  }

  return grouped;
}

function serializeValue(value) {
  if (value === null || value === undefined) {
    return "";
  }

  if (typeof value === "object") {
    return JSON.stringify(value);
  }

  return String(value);
}

function getContentType(value) {
  if (typeof value === "boolean") {
    return "boolean";
  }

  if (typeof value === "number") {
    return "number";
  }

  if (value !== null && typeof value === "object") {
    return "json";
  }

  return "text";
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

  const value = payload.value ?? "";
  const type = payload.type || getContentType(value);

  const normalizedPayload = {
    page: payload.page,
    section: payload.section,
    key: payload.key,
    value: serializeValue(value),
    type,
  };

  const { data } = await api.post("/content", normalizedPayload);

  return data;
}

export async function updateContent(id, payload) {
  if (shouldUseMocks()) {
    return mockUpdateSection(payload?.section, payload);
  }

  const value = payload.value ?? "";
  const type = payload.type || getContentType(value);

  const normalizedPayload = {
    page: payload.page,
    section: payload.section,
    key: payload.key,
    value: serializeValue(value),
    type,
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
        : Array.isArray(data?.content)
          ? data.content
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
          (record?.key === key || record?.content_key === key),
      );

      const contentType = getContentType(value);

      const recordPayload = {
        page,
        section,
        key,
        value: serializeValue(value),
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
