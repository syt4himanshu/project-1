import { useEffect } from 'react'
import { AllocationPageContent } from '../components/allocation/AllocationPageContent'

export function AdminAllocationPage() {
  useEffect(() => {
    document.title = 'Student-Faculty Allocation - KYS'
  }, [])

  return (
    <AllocationPageContent />
  )
}
