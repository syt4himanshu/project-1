import Dexie, { type Table } from 'dexie'
import type {
  FacultyProfileRecord,
  MenteeLocalRecord,
  MentoringMinuteLocalRecord,
  OfflineMutationRecord,
  SyncMetadataRecord,
} from './types'

export class KYSLocalDatabase extends Dexie {
  facultyProfile!: Table<FacultyProfileRecord, number>
  mentees!: Table<MenteeLocalRecord, string>
  mentoringMinutes!: Table<MentoringMinuteLocalRecord, string | number>
  offlineMutations!: Table<OfflineMutationRecord, string>
  syncMetadata!: Table<SyncMetadataRecord, string>

  constructor() {
    super('kys_offline_db')
    this.version(1).stores({
      facultyProfile: 'facultyId, email',
      mentees: 'uid, facultyId, id, [facultyId+uid], updatedAt',
      mentoringMinutes: 'id, facultyId, studentUid, studentId, [facultyId+studentUid], date',
      offlineMutations: 'idempotencyKey, sequence, facultyId, [facultyId+sequence], status, createdAt',
      syncMetadata: 'key, facultyId, entity',
    })
  }
}

export const db = new KYSLocalDatabase()
