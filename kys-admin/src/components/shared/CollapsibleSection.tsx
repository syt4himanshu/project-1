import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Props {
    title: string
    children: React.ReactNode
    defaultOpen?: boolean
    forceOpen?: boolean
}

export default function CollapsibleSection({ title, children, defaultOpen = false, forceOpen = false }: Props) {
    const [open, setOpen] = useState(defaultOpen)
    const isOpen = forceOpen || open

    return (
        <div className="section">
            <button
                type="button"
                onClick={() => {
                    if (!forceOpen) setOpen(!open)
                }}
                className={cn(
                    'w-full border rounded-lg px-5 py-3 flex justify-between items-center cursor-pointer font-semibold text-slate-800 transition-all duration-200 hover:-translate-y-px hover:shadow-sm',
                    isOpen
                        ? 'bg-blue-50 border-blue-200 text-blue-800 rounded-b-none'
                        : 'bg-slate-50 border-slate-200 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700'
                )}
                aria-expanded={isOpen}
            >
                {title}
                {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
            {isOpen && (
                <div className="p-4 bg-white border border-t-0 border-slate-200 rounded-b-lg">
                    {children}
                </div>
            )}
        </div>
    )
}
