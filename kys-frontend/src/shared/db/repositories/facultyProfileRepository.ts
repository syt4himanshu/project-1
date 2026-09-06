import { db } from '../kysLocalDb'
import type { FacultyProfileRecord } from '../types'

export const facultyProfileRepository = {
  async getProfile(facultyId: number): Promise<FacultyProfileRecord | undefined> {
    return db.facultyProfile.get(facultyId)
  },

  async saveProfile(profile: FacultyProfileRecord): Promise<number> {
    return db.facultyProfile.put(profile)
  },

  async deleteProfile(facultyId: number): Promise<void> {
    await db.facultyProfile.delete(facultyId)
  },

  async clearForFaculty(facultyId: number): Promise<void> {
    await db.facultyProfile.delete(facultyId)
  },
}
