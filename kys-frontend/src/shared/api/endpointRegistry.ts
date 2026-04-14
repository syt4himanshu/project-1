export const ENDPOINTS = {
  auth: {
    login: '/api/auth/login',
    verify: '/api/auth/verify',
    logout: '/api/auth/logout',
    registerBulkStudents: '/api/auth/register/bulk',
    registerBulkFaculty: '/api/auth/register/faculty/bulk',
  },
  admin: {
    statistics: '/api/admin/statistics',
    users: '/api/admin/users',
    resetPassword: '/api/admin/reset-password',
    faculty: '/api/admin/faculty',
    allocation: '/api/admin/allocation',
    reports: {
      stats: '/api/admin/reports/stats',
      toppers: '/api/admin/reports/toppers',
      semesterDistribution: '/api/admin/reports/semester-distribution',
      backlogs: '/api/admin/reports/backlogs',
      general: '/api/admin/reports/general',
      incomplete: '/api/admin/reports/incomplete',
      exportAll: '/api/admin/reports/export/all',
      exportBacklogs: '/api/admin/reports/export/backlogs',
      exportIncomplete: '/api/admin/reports/export/incomplete',
    },
  },
  students: {
    search: '/api/students',
  },
} as const
