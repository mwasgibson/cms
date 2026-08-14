import Loader from '../../../components/Loader'
import GeneralSettingsForm from '../components/GeneralSettingsForm'
import ContactSettingsForm from '../components/ContactSettingsForm'
import SocialLinksForm from '../components/SocialLinksForm'
import SeoSettingsForm from '../components/SeoSettingsForm'
import { useFetch } from '../../../hooks/useFetch'
import {
  getSettings,
  updateGeneralSettings,
  updateContactSettings,
  updateSocialSettings,
  updateSeoSettings,
} from '../services/settingsService'

export default function Settings() {
  const { data: settings, loading, error } = useFetch(getSettings)

  if (loading) return <Loader label="Loading settings…" />
  if (error) return <p className="text-sm text-red-600">Couldn't load settings.</p>

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-semibold text-brand-900">Settings</h1>

      <div className="flex max-w-2xl flex-col gap-6">
        <GeneralSettingsForm initialValues={settings.general} onSubmit={updateGeneralSettings} />
        <ContactSettingsForm initialValues={settings.contact} onSubmit={updateContactSettings} />
        <SocialLinksForm initialValues={settings.social} onSubmit={updateSocialSettings} />
        <SeoSettingsForm initialValues={settings.seo} onSubmit={updateSeoSettings} />
      </div>
    </div>
  )
}
