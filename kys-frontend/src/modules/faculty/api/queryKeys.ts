export const facultyKeys = {
  all: ['faculty'] as const,
  profile: () => [...facultyKeys.all, 'profile'] as const,
  mentees: () => [...facultyKeys.all, 'mentees'] as const,
  menteesPage: (limit: number, offset: number) =>
    [...facultyKeys.mentees(), { limit, offset }] as const,
  mentee: (uid: string) => [...facultyKeys.mentees(), uid] as const,
  menteeMinutes: (uid: string, offset?: number) =>
    [...facultyKeys.mentee(uid), 'minutes', { offset: offset ?? 0 }] as const,
  chatbot: () => [...facultyKeys.all, 'chatbot'] as const,
  changePassword: () => [...facultyKeys.all, 'change-password'] as const,
}
