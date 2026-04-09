import Header from '@/components/layout/Header'
import StatsGrid from '@/components/layout/StatsGrid'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import UserManagementTab from '@/components/users/UserManagementTab'
import TeachersTab from '@/components/teachers/TeachersTab'
import StudentsTab from '@/components/students/StudentsTab'
import AllocationTab from '@/components/allocation/AllocationTab'
import ReportsTab from '@/components/reports/ReportsTab'
import { BarChart3 } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'

const TAB_VALUES = ['users', 'teachers', 'students', 'allocation', 'reports'] as const
type DashboardTab = (typeof TAB_VALUES)[number]

function isDashboardTab(value: string | null): value is DashboardTab {
    return !!value && TAB_VALUES.includes(value as DashboardTab)
}

export default function AdminDashboard() {
    const [searchParams, setSearchParams] = useSearchParams()
    const tabFromUrl = searchParams.get('tab')
    const activeTab: DashboardTab = isDashboardTab(tabFromUrl) ? tabFromUrl : 'users'

    const handleTabChange = (nextTab: string) => {
        if (!isDashboardTab(nextTab)) return
        const params = new URLSearchParams(searchParams)
        params.set('tab', nextTab)
        setSearchParams(params, { replace: true })
    }

    return (
        <div className="max-w-[1500px] mx-auto px-5 py-5">
            <Header />
            <StatsGrid />
            <Tabs value={activeTab} onValueChange={handleTabChange}>
                <TabsList className="mb-7">
                    <TabsTrigger value="users">User Management</TabsTrigger>
                    <TabsTrigger value="teachers">Teachers List</TabsTrigger>
                    <TabsTrigger value="students">Students List</TabsTrigger>
                    <TabsTrigger value="allocation">Student Allocation</TabsTrigger>
                    <TabsTrigger value="reports"><BarChart3 className="w-3.5 h-3.5" /> Reports</TabsTrigger>
                </TabsList>
                <TabsContent value="users"><UserManagementTab /></TabsContent>
                <TabsContent value="teachers"><TeachersTab /></TabsContent>
                <TabsContent value="students"><StudentsTab /></TabsContent>
                <TabsContent value="allocation"><AllocationTab /></TabsContent>
                <TabsContent value="reports"><ReportsTab /></TabsContent>
            </Tabs>
        </div>
    )
}
