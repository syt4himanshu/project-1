import { db } from '../kysLocalDb'
import type { MenteeLocalRecord } from '../types'

export const menteeRepository = {
  async getMentee(facultyId: number, uid: string): Promise<MenteeLocalRecord | undefined> {
    const record = await db.mentees.get(uid)
    if (record && record.facultyId === facultyId) {
      return record
    }
    return undefined
  },

  async listMenteesForFaculty(facultyId: number): Promise<MenteeLocalRecord[]> {
    return db.mentees.where('facultyId').equals(facultyId).toArray()
  },

  async saveMentee(mentee: MenteeLocalRecord): Promise<string> {
    return db.mentees.put(mentee)
  },

  async saveMentees(mentees: MenteeLocalRecord[]): Promise<string[]> {
    return db.mentees.bulkPut(mentees, { allKeys: true })
  },

  async deleteMentee(uid: string): Promise<void> {
    await db.mentees.delete(uid)
  },

  async clearForFaculty(facultyId: number): Promise<void> {
    await db.mentees.where('facultyId').equals(facultyId).delete()
  },
}
