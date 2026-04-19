import { describe, expect, it } from 'vitest'
import { extractStudentPhotoUrl } from './studentPhoto'

describe('extractStudentPhotoUrl', () => {
  it('prefers personal_info.photo_url when present', () => {
    expect(extractStudentPhotoUrl({
      personal_info: {
        photo_url: 'https://res.cloudinary.com/demo/image/upload/v1/students/student-a.jpg',
      },
      photo_url: 'https://example.com/legacy.jpg',
    })).toBe('https://res.cloudinary.com/demo/image/upload/v1/students/student-a.jpg')
  })

  it('falls back to top-level admin and legacy fields', () => {
    expect(extractStudentPhotoUrl({ profilePhotoUrl: 'https://example.com/admin-photo.jpg' }))
      .toBe('https://example.com/admin-photo.jpg')

    expect(extractStudentPhotoUrl({ profile_photo: 'https://example.com/legacy-photo.jpg' }))
      .toBe('https://example.com/legacy-photo.jpg')
  })

  it('returns null when no usable photo url exists', () => {
    expect(extractStudentPhotoUrl({ personal_info: { photo_url: '  ' } })).toBeNull()
    expect(extractStudentPhotoUrl(null)).toBeNull()
  })
})
