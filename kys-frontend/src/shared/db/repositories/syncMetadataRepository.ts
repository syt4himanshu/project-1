import { db } from '../kysLocalDb'
import type { SyncMetadataRecord } from '../types'

export const syncMetadataRepository = {
  async getSyncMetadata(
    facultyId: number,
    entity: string,
  ): Promise<SyncMetadataRecord | undefined> {
    const key = `${facultyId}:${entity}`
    return db.syncMetadata.get(key)
  },

  async updateSyncMetadata(
    facultyId: number,
    entity: string,
    lastSuccessfulSync: string | null,
    status: 'idle' | 'syncing' | 'error' = 'idle',
  ): Promise<string> {
    const key = `${facultyId}:${entity}`
    const record: SyncMetadataRecord = {
      key,
      facultyId,
      entity,
      lastSuccessfulSync,
      status,
      updatedAt: new Date().toISOString(),
    }
    return db.syncMetadata.put(record)
  },

  async clearForFaculty(facultyId: number): Promise<void> {
    await db.syncMetadata.where('facultyId').equals(facultyId).delete()
  },
}
