import { AdminStatsGrid } from '../components/AdminStatsGrid'
import { SectionShell } from '../../../shared/ui'

export function AdminDashboardPage() {
  return (
    <SectionShell
      title="Admin Overview"
      subtitle="Read-only health snapshot for users, mentors, and students."
    >
      <AdminStatsGrid />
    </SectionShell>
  )
}
