import { useState } from 'react'
import Input from '../../../components/Input'
import Button from '../../../components/Button'
import { POST_STATUS, POST_STATUS_LABELS } from '../../../utils/constants'
import { isRequired } from '../../../utils/validators'
import { slugify } from '../utils/blogHelpers'

const EMPTY_FORM = {
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  featured_image: '',
  status: POST_STATUS.DRAFT,
  seo_title: '',
  seo_description: '',
  published_at: null,
}

export default function PostForm({ initialValues, onSubmit, submitting }) {
  const [form, setForm] = useState({ ...EMPTY_FORM, ...initialValues })
  const [slugTouched, setSlugTouched] = useState(!!initialValues?.slug)
  const [errors, setErrors] = useState({})

  const handleTitleChange = (e) => {
    const title = e.target.value
    setForm((f) => ({
      ...f,
      title,
      slug: slugTouched ? f.slug : slugify(title),
    }))
  }

  const handleSlugChange = (e) => {
    setSlugTouched(true)
    setForm((f) => ({ ...f, slug: slugify(e.target.value) }))
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
  }

  const validate = () => {
    const next = {
      title: isRequired(form.title),
      slug: isRequired(form.slug),
    }
    setErrors(next)
    return Object.values(next).every((v) => v === null)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return

    const becomingPublished = form.status === POST_STATUS.PUBLISHED && !form.published_at
    onSubmit({
      ...form,
      published_at: becomingPublished ? new Date().toISOString() : form.published_at,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-w-3xl flex-col gap-4">
      <Input
        id="title"
        name="title"
        label="Title"
        value={form.title}
        onChange={handleTitleChange}
        error={errors.title}
      />

      <Input
        id="slug"
        name="slug"
        label="Slug"
        value={form.slug}
        onChange={handleSlugChange}
        error={errors.slug}
      />

      <div className="flex flex-col gap-1.5">
        <label htmlFor="excerpt" className="text-sm font-medium text-brand-900">
          Excerpt
        </label>
        <textarea
          id="excerpt"
          name="excerpt"
          rows={2}
          value={form.excerpt}
          onChange={handleChange}
          placeholder="Short summary shown on the blog listing page"
          className="rounded-md border border-brand-100 px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="content" className="text-sm font-medium text-brand-900">
          Content
        </label>
        <textarea
          id="content"
          name="content"
          rows={12}
          value={form.content}
          onChange={handleChange}
          className="rounded-md border border-brand-100 px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
        />
        <p className="text-xs text-brand-500">
          Plain text for now — swap this for a rich text editor later if you want
          formatting controls.
        </p>
      </div>

      <Input
        id="featured_image"
        name="featured_image"
        label="Featured image URL"
        placeholder="https://…"
        value={form.featured_image}
        onChange={handleChange}
      />

      <div className="flex flex-col gap-1.5">
        <label htmlFor="status" className="text-sm font-medium text-brand-900">
          Status
        </label>
        <select
          id="status"
          name="status"
          value={form.status}
          onChange={handleChange}
          className="w-48 rounded-md border border-brand-100 px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
        >
          {Object.entries(POST_STATUS_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <div className="rounded-md border border-brand-100 p-4">
        <p className="mb-3 text-sm font-medium text-brand-900">SEO (optional overrides)</p>
        <div className="flex flex-col gap-4">
          <Input
            id="seo_title"
            name="seo_title"
            label="SEO title"
            placeholder="Defaults to the post title"
            value={form.seo_title}
            onChange={handleChange}
          />
          <div className="flex flex-col gap-1.5">
            <label htmlFor="seo_description" className="text-sm font-medium text-brand-900">
              SEO description
            </label>
            <textarea
              id="seo_description"
              name="seo_description"
              rows={2}
              placeholder="Defaults to the excerpt"
              value={form.seo_description}
              onChange={handleChange}
              className="rounded-md border border-brand-100 px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button type="submit" loading={submitting}>
          Save post
        </Button>
      </div>
    </form>
  )
}
