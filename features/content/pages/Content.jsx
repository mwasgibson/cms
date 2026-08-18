import { useEffect, useState } from "react";
import Loader from "../../../components/Loader";
import Button from "../../../components/Button";
import Input from "../../../components/Input";
import { useFetch } from "../../../hooks/useFetch";
import { getContent, updateSection } from "../services/contentService";
import { useToast } from "../../../hooks/useToast";

function Section({ title, description, children }) {
  return (
    <div className="rounded-lg border border-brand-100 bg-white p-6 shadow-sm">
      <h3 className="font-display text-lg font-semibold text-brand-900">
        {title}
      </h3>
      {description && (
        <p className="mb-5 mt-1 text-sm text-brand-500">{description}</p>
      )}
      {children}
    </div>
  );
}

function Textarea({ id, label, rows = 3, value = "", onChange }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-brand-900">
        {label}
      </label>

      <textarea
        id={id}
        rows={rows}
        value={value ?? ""}
        onChange={onChange}
        className="rounded-md border border-brand-100 px-3 py-2 text-sm outline-none focus:border-accent-500 focus:ring-1 focus:ring-accent-500"
      />
    </div>
  );
}

function SaveButton({ loading }) {
  return (
    <div className="mt-5 flex justify-end">
      <Button type="submit" loading={loading}>
        Save
      </Button>
    </div>
  );
}

function useSectionForm(initial, section, label, onSave) {
  const [form, setForm] = useState(initial || {});

  const [saving, setSaving] = useState(false);

  const { showToast } = useToast();

  useEffect(() => {
    setForm(initial || {});
  }, [initial]);

  const set = (key) => (event) => {
    setForm((prev) => ({
      ...prev,
      [key]: event.target.value,
    }));
  };

  const submit = async (event) => {
    event.preventDefault();

    setSaving(true);

    try {
      await onSave(section, form);

      showToast(`${label} saved`, "success");
    } catch (error) {
      console.error(`[Content] Failed to save ${section}:`, error);

      showToast("Could not save. Try again.", "error");
    } finally {
      setSaving(false);
    }
  };

  return {
    form,
    set,
    saving,
    submit,
  };
}

function HomeTab({ initial, onSave }) {
  const { form, set, saving, submit } = useSectionForm(
    initial,
    "home",
    "Home content",
    onSave,
  );

  return (
    <form onSubmit={submit} className="space-y-4">
      <Section
        title="Hero"
        description="These fields match the current home page hero in client/index.html."
      >
        <div className="space-y-4">
          <Textarea
            id="headline"
            label="Headline"
            value={form.headline}
            onChange={set("headline")}
          />

          <Input
            id="subheadline"
            label="Subheadline"
            value={form.subheadline}
            onChange={set("subheadline")}
          />

          <Input
            id="hero_image_url"
            label="Hero image URL"
            value={form.hero_image_url}
            onChange={set("hero_image_url")}
          />

          <Input
            id="cta_primary"
            label="Primary CTA"
            value={form.cta_primary}
            onChange={set("cta_primary")}
          />

          <Input
            id="cta_primary_url"
            label="Primary CTA URL"
            value={form.cta_primary_url}
            onChange={set("cta_primary_url")}
          />
        </div>
      </Section>

      <Section
        title="Services"
        description="The five service items currently displayed on the home page."
      >
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((n) => (
            <Input
              key={n}
              id={`service_${n}`}
              label={`Service ${n}`}
              value={form[`service_${n}`]}
              onChange={set(`service_${n}`)}
            />
          ))}
        </div>
      </Section>

      <Section
        title="Quick Link"
        description="The current home page has one quick link to room booking."
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            id="quick_link_label"
            label="Link label"
            value={form.quick_link_label}
            onChange={set("quick_link_label")}
          />

          <Input
            id="quick_link_url"
            label="Link URL"
            value={form.quick_link_url}
            onChange={set("quick_link_url")}
          />
        </div>

        <SaveButton loading={saving} />
      </Section>
    </form>
  );
}

function NavigationTab({ initial, onSave }) {
  const { form, set, saving, submit } = useSectionForm(
    initial,
    "navigation",
    "Navigation content",
    onSave,
  );

  const items = [
    "home",
    "dashboard",
    "booking",
    "reservations",
    "rooms",
    "deals",
    "events",
    "contact",
    "register",
    "login",
  ];

  return (
    <form onSubmit={submit}>
      <Section
        title="Navigation"
        description="Labels used by the current public-site navigation and promotion menu."
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {items.map((item) => (
            <Input
              key={item}
              label={item.replace(/_/g, " ")}
              value={form[item]}
              onChange={set(item)}
            />
          ))}
        </div>

        <SaveButton loading={saving} />
      </Section>
    </form>
  );
}

function ContactTab({ initial, onSave }) {
  const { form, set, saving, submit } = useSectionForm(
    initial,
    "contact",
    "Contact content",
    onSave,
  );

  return (
    <form onSubmit={submit}>
      <Section
        title="Contact page"
        description="Matches the current Contact Us page and the contact details repeated in the footer."
      >
        <div className="space-y-4">
          <Input
            label="Page title"
            value={form.title}
            onChange={set("title")}
          />

          <Input label="Phone" value={form.phone} onChange={set("phone")} />

          <Input label="Email" value={form.email} onChange={set("email")} />

          <Input
            label="Location"
            value={form.location}
            onChange={set("location")}
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="Name placeholder"
              value={form.name_placeholder}
              onChange={set("name_placeholder")}
            />

            <Input
              label="Email placeholder"
              value={form.email_placeholder}
              onChange={set("email_placeholder")}
            />

            <Input
              label="Subject placeholder"
              value={form.subject_placeholder}
              onChange={set("subject_placeholder")}
            />

            <Input
              label="Message placeholder"
              value={form.message_placeholder}
              onChange={set("message_placeholder")}
            />
          </div>

          <Input
            label="Submit button"
            value={form.submit_label}
            onChange={set("submit_label")}
          />
        </div>

        <SaveButton loading={saving} />
      </Section>
    </form>
  );
}

function FooterTab({ initial, onSave }) {
  const { form, set, saving, submit } = useSectionForm(
    initial,
    "footer",
    "Footer content",
    onSave,
  );

  return (
    <form onSubmit={submit}>
      <Section
        title="Footer"
        description="Content currently repeated across the public site's footer."
      >
        <div className="space-y-4">
          <Input
            label="Copyright"
            value={form.copyright}
            onChange={set("copyright")}
          />

          <Input
            label="Privacy Policy label"
            value={form.privacy_label}
            onChange={set("privacy_label")}
          />

          <Input
            label="Privacy Policy URL"
            value={form.privacy_url}
            onChange={set("privacy_url")}
          />

          <Input
            label="Terms label"
            value={form.terms_label}
            onChange={set("terms_label")}
          />

          <Input
            label="Terms URL"
            value={form.terms_url}
            onChange={set("terms_url")}
          />

          <Input
            label="Cookie Policy label"
            value={form.cookie_label}
            onChange={set("cookie_label")}
          />

          <Input
            label="Cookie Policy URL"
            value={form.cookie_url}
            onChange={set("cookie_url")}
          />
        </div>

        <SaveButton loading={saving} />
      </Section>
    </form>
  );
}

function SeoTab({ initial, onSave }) {
  const { form, set, saving, submit } = useSectionForm(
    initial,
    "seo",
    "SEO settings",
    onSave,
  );

  return (
    <form onSubmit={submit}>
      <Section
        title="SEO"
        description="Basic metadata for the current public pages. Dynamic rooms, deals and events remain owned by their respective CMS modules."
      >
        <div className="space-y-4">
          <Input
            label="Site title"
            value={form.site_title}
            onChange={set("site_title")}
          />

          <Textarea
            label="Site description"
            rows={3}
            value={form.site_description}
            onChange={set("site_description")}
          />

          <Input
            label="Home keywords"
            value={form.home_keywords}
            onChange={set("home_keywords")}
          />

          <Input
            label="Default social image URL"
            value={form.og_image_url}
            onChange={set("og_image_url")}
          />
        </div>

        <SaveButton loading={saving} />
      </Section>
    </form>
  );
}

const TABS = [
  {
    id: "home",
    label: "Home",
  },
  {
    id: "navigation",
    label: "Navigation",
  },
  {
    id: "contact",
    label: "Contact",
  },
  {
    id: "footer",
    label: "Footer",
  },
  {
    id: "seo",
    label: "SEO",
  },
];

const DEFAULT_CONTENT = {
  home: {
    headline: "Welcome to Our Hotel",

    subheadline: "Find comfortable rooms and book your stay online.",

    hero_image_url:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1920&q=80",

    cta_primary: "View Available Rooms",

    cta_primary_url: "rooms.html",

    service_1: "Luxury Rooms",

    service_2: "Restaurant",

    service_3: "Free Wi-Fi",

    service_4: "Conference Rooms",

    service_5: "Airport Pickup",

    quick_link_label: "Book a Room",

    quick_link_url: "booking.html",
  },

  navigation: {
    home: "Home",
    dashboard: "Dashboard",
    booking: "Booking",
    reservations: "Reservations",
    rooms: "Rooms",
    deals: "Deals",
    events: "Events",
    contact: "Contact",
    register: "Register",
    login: "Login",
  },

  contact: {
    title: "Contact Us",
    phone: "+254 108 962 037",
    email: "gibsonmwangi72@gmail.com",
    location: "Nairobi, Kenya",

    name_placeholder: "Your Name",

    email_placeholder: "Your Email",

    subject_placeholder: "Subject",

    message_placeholder: "Your Message",

    submit_label: "Send Message",
  },

  footer: {
    copyright: "© 2026 HOTEL NAME",

    privacy_label: "Privacy Policy",

    privacy_url: "#",

    terms_label: "Terms & Conditions",

    terms_url: "#",

    cookie_label: "Cookie Policy",

    cookie_url: "#",
  },

  seo: {
    site_title: "Hotel Management System",

    site_description: "Find comfortable rooms and book your stay online.",

    home_keywords: "hotel, rooms, accommodation, booking, Nairobi",

    og_image_url:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1920&q=80",
  },
};

export default function Content() {
  const { data, loading, error, setData } = useFetch(getContent);

  const [activeTab, setActiveTab] = useState("home");

  if (loading) {
    return <Loader label="Loading content…" />;
  }

  if (error) {
    return (
      <p className="text-sm text-red-600">
        Couldn't load content. Try refreshing.
      </p>
    );
  }

  const content = {
    ...DEFAULT_CONTENT,

    ...(data || {}),

    home: {
      ...DEFAULT_CONTENT.home,
      ...(data?.home || {}),
    },

    navigation: {
      ...DEFAULT_CONTENT.navigation,
      ...(data?.navigation || {}),
    },

    contact: {
      ...DEFAULT_CONTENT.contact,
      ...(data?.contact || {}),
    },

    footer: {
      ...DEFAULT_CONTENT.footer,
      ...(data?.footer || {}),
    },

    seo: {
      ...DEFAULT_CONTENT.seo,
      ...(data?.seo || {}),
    },
  };

  const handleSave = async (section, payload) => {
    await updateSection(section, payload);

    const freshContent = await getContent();

    setData(freshContent);
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-semibold text-brand-900">
          Website Content
        </h1>

        <p className="text-sm text-brand-500">
          Manage the copy and labels used by the current hotel frontend. Rooms,
          deals and event spaces are dynamic resources and remain in their own
          CMS modules.
        </p>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {TABS.map((tab) => (
          <button
            type="button"
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`rounded-md border px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? "border-accent-500 bg-accent-500 text-white shadow-sm"
                : "border-brand-100 bg-white text-brand-900 hover:bg-sand-100"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "home" && (
        <HomeTab initial={content.home} onSave={handleSave} />
      )}

      {activeTab === "navigation" && (
        <NavigationTab initial={content.navigation} onSave={handleSave} />
      )}

      {activeTab === "contact" && (
        <ContactTab initial={content.contact} onSave={handleSave} />
      )}

      {activeTab === "footer" && (
        <FooterTab initial={content.footer} onSave={handleSave} />
      )}

      {activeTab === "seo" && (
        <SeoTab initial={content.seo} onSave={handleSave} />
      )}
    </div>
  );
}
