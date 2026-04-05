import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Props {
    title: string
    children: React.ReactNode
    defaultOpen?: boolean
}

export default function CollapsibleSection({ title, children, defaultOpen = false }: Props) {
    const [open, setOpen] = useState(defaultOpen)
    return (
        <div>
            <button
                type="button"
                onClick={() => setOpen(!open)}
                className={cn(
                    'w-full border rounded-lg px-5 py-3 flex justify-between items-center cursor-pointer font-semibold text-slate-800 transition-colors',
                    open
                        ? 'bg-indigo-50 border-indigo-200 text-indigo-800 rounded-b-none'
                        : 'bg-slate-50 border-slate-200'
                )}
            >
                {title}
                {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
            {open && (
                <div className="p-4 bg-white border border-t-0 border-slate-200 rounded-b-lg">
                    {children}
                </div>
            )}
        </div>
    )
}
