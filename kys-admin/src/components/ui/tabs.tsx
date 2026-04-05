import * as React from 'react'
import * as TabsPrimitive from '@radix-ui/react-tabs'
import { cn } from '@/lib/utils'

const Tabs = TabsPrimitive.Root

const TabsList = React.forwardRef<
    React.ElementRef<typeof TabsPrimitive.List>,
    React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
    <TabsPrimitive.List
        ref={ref}
        className={cn('flex border-b border-slate-200 bg-transparent rounded-none h-auto overflow-x-auto', className)}
        {...props}
    />
))
TabsList.displayName = TabsPrimitive.List.displayName

const TabsTrigger = React.forwardRef<
    React.ElementRef<typeof TabsPrimitive.Trigger>,
    React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
    <TabsPrimitive.Trigger
        ref={ref}
        className={cn(
            'rounded-none pb-3 px-4 text-sm font-medium text-slate-500 border-b-2 border-transparent whitespace-nowrap transition-colors hover:text-slate-700 data-[state=active]:text-sky-500 data-[state=active]:border-sky-500 focus-visible:outline-none',
            className
        )}
        {...props}
    />
))
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef<
    React.ElementRef<typeof TabsPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
    <TabsPrimitive.Content ref={ref} className={cn('focus-visible:outline-none', className)} {...props} />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsList, TabsTrigger, TabsContent }
