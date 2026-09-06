import { db } from './kysLocalDb'
import { facultyProfileRepository } from './repositories/facultyProfileRepository'
import { menteeRepository } from './repositories/menteeRepository'
import { mentoringMinuteRepository } from './repositories/mentoringMinuteRepository'
import { mutationQueueRepository } from './repositories/mutationQueueRepository'
import { syncMetadataRepository } from './repositories/syncMetadataRepository'

/**
 * Safely purges all offline IndexedDB records belonging to a specific faculty member.
 * Call during faculty user logout or account switching.
 */
export async function clearOfflineDataForFaculty(facultyId: number): Promise<void> {
  await Promise.all([
    facultyProfileRepository.clearForFaculty(facultyId),
    menteeRepository.clearForFaculty(facultyId),
    mentoringMinuteRepository.clearForFaculty(facultyId),
    mutationQueueRepository.clearForFaculty(facultyId),
    syncMetadataRepository.clearForFaculty(facultyId),
  ])
}

/**
 * Drops the entire local IndexedDB database.
 * Reserved for explicit administrative cache reset or full security teardown.
 */
export async function clearOfflineDatabase(): Promise<void> {
  await db.delete()
  await db.open()
}
