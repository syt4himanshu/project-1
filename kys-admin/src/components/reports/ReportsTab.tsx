import { BarChart3, Construction, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'

// ── Feature flag ──────────────────────────────────────────────────────────────
// Reports backend endpoints (/api/admin/reports/*) do not exist yet.
// Set REPORTS_ENABLED = true once backend routes are implemented.
const REPORTS_ENABLED = false

export default function ReportsTab() {
    if (!REPORTS_ENABLED) {
        return (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-12 text-center">
                <div className="flex flex-col items-center gap-4 max-w-md mx-auto">
                    <div className="w-20 h-20 rounded-2xl bg-amber-50 border-2 border-amber-200 flex items-center justify-center">
                        <Construction className="w-10 h-10 text-amber-500" />
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold text-slate-800 mb-2">Reports Coming Soon</h2>
                        <p className="text-slate-500 text-sm leading-relaxed">
                            The analytics and reporting backend endpoints are under development.
                            This tab will be enabled once the following backend routes are available:
                        </p>
                    </div>
                    <div className="w-full text-left bg-slate-50 rounded-lg p-4 border border-slate-200 text-xs font-mono text-slate-600 space-y-1">
                        <div>GET /api/admin/reports/stats</div>
                        <div>GET /api/admin/reports/toppers</div>
                        <div>GET /api/admin/reports/semester-distribution</div>
                        <div>GET /api/admin/reports/backlogs</div>
                        <div>GET /api/admin/reports/general</div>
                        <div>GET /api/admin/reports/incomplete</div>
                        <div>GET /api/admin/reports/export/*</div>
                    </div>
                    <div className="flex gap-2 flex-wrap justify-center">
                        <Button
                            size="sm"
                            variant="outline"
                            className="border-slate-200 text-slate-400 cursor-not-allowed"
                            disabled
                            title="Backend endpoint not yet available"
                        >
                            <Download className="w-3 h-3 mr-1" /> Export All
                        </Button>
                        <Button
                            size="sm"
                            variant="outline"
                            className="border-slate-200 text-slate-400 cursor-not-allowed"
                            disabled
                            title="Backend endpoint not yet available"
                        >
                            <Download className="w-3 h-3 mr-1" /> Export Backlog
                        </Button>
                        <Button
                            size="sm"
                            variant="outline"
                            className="border-slate-200 text-slate-400 cursor-not-allowed"
                            disabled
                            title="Backend endpoint not yet available"
                        >
                            <BarChart3 className="w-3 h-3 mr-1" /> View Analytics
                        </Button>
                    </div>
                </div>
            </div>
        )
    }

    // ── Live reports UI (enabled when REPORTS_ENABLED = true) ──────────────────
    // Import and render the real report components here once backend is ready.
    return (
        <div className="text-slate-500 text-center py-12">
            Reports are enabled. Add report components here.
        </div>
    )
}
