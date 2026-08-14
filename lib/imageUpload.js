import { http, withLatency, isMock } from './apiClient'
import { API } from '../utils/constants'

/**
 * Upload a single image file.
 * Returns a URL string (hosted CDN/storage URL in production, blob URL in mock mode).
 *
 * @param {File} file - the browser File object from an <input type="file">
 * @returns {Promise<string>} - the public URL of the uploaded image
 *
 * Laravel side:
 *   POST /media/upload
 *   Content-Type: multipart/form-data
 *   Body: { file: <binary> }
 *   Response: { url: "https://storage.example.com/images/..." }
 */
export async function uploadImage(file) {
  if (isMock()) {
    // In mock mode, create an object URL so images actually render in the UI
    await withLatency(null, 400)
    return URL.createObjectURL(file)
  }

  const formData = new FormData()
  formData.append('file', file)

  const { data } = await http.post(API.UPLOAD_IMAGE, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })

  return data.url
}

/**
 * Upload multiple images in parallel (e.g. for a unit gallery).
 * Returns an array of URL strings in the same order as the input files.
 *
 * @param {File[]} files
 * @returns {Promise<string[]>}
 */
export async function uploadImages(files) {
  return Promise.all(files.map(uploadImage))
}
