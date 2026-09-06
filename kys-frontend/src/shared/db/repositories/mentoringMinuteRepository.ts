import { db } from '../kysLocalDb'
import type { MentoringMinuteLocalRecord } from '../types'

export const mentoringMinuteRepository = {
  async listMinutesForStudent(
    facultyId: number,
    studentUid: string,
  ): Promise<MentoringMinuteLocalRecord[]> {
    return db.mentoringMinutes
      .where('[facultyId+studentUid]')
      .equals([facultyId, studentUid])
      .sortBy('date')
      .then((records) => records.reverse())
  },

  async saveMinute(minute: MentoringMinuteLocalRecord): Promise<string | number> {
    return db.mentoringMinutes.put(minute)
  },

  async saveMinutes(minutes: MentoringMinuteLocalRecord[]): Promise<(string | number)[]> {
    return db.mentoringMinutes.bulkPut(minutes, { allKeys: true })
  },

  async deleteMinute(id: string | number): Promise<void> {
    await db.mentoringMinutes.delete(id)
  },

  async clearForFaculty(facultyId: number): Promise<void> {
    await db.mentoringMinutes.where('facultyId').equals(facultyId).delete()
  },
}
