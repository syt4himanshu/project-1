import { useEffect } from 'react'
import DashboardPage from './pages/Dashboard'
import ProfileWizardPage from './pages/ProfileWizard'

function useStudentStyles() {
  useEffect(() => {
    void import('./styles/student.bundle.css')
  }, [])
}

export function StudentDashboardPage() {
  useStudentStyles()
  return <DashboardPage />
}

export function StudentProfilePage() {
  useStudentStyles()
  return <ProfileWizardPage />
}
