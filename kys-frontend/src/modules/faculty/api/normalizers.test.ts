import { describe, expect, it } from 'vitest'
import { normalizeMenteeRow } from './normalizers'

describe('faculty normalizers', () => {
  it('preserves the nested student photo url for faculty list rendering', () => {
    const result = normalizeMenteeRow({
      id: 7,
      uid: 'STU007',
      full_name: 'Ava Patel',
      semester: 4,
      section: 'B',
      year_of_admission: 2023,
      personal_info: {
        photo_url: 'https://res.cloudinary.com/demo/image/upload/v1/students/stu007.jpg',
      },
    })

    expect(result.photo_url).toBe('https://res.cloudinary.com/demo/image/upload/v1/students/stu007.jpg')
  })
})
