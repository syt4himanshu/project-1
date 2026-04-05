import * as React from 'react'
import { Controller, FormProvider, useFormContext, type ControllerProps, type FieldPath, type FieldValues } from 'react-hook-form'
import { Label } from './label'
import { cn } from '@/lib/utils'

const Form = FormProvider

type FormFieldContextValue<TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>> = {
    name: TName
}

const FormFieldContext = React.createContext<FormFieldContextValue>({} as FormFieldContextValue)

const FormField = <TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>>({
    ...props
}: ControllerProps<TFieldValues, TName>) => {
    return (
        <FormFieldContext.Provider value={{ name: props.name }}>
            <Controller {...props} />
        </FormFieldContext.Provider>
    )
}

const useFormField = () => {
    const fieldContext = React.useContext(FormFieldContext)
    const { getFieldState, formState } = useFormContext()
    const fieldState = getFieldState(fieldContext.name, formState)
    return { name: fieldContext.name, ...fieldState }
}

const FormItemContext = React.createContext<{ id: string }>({} as { id: string })

const FormItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => {
    const id = React.useId()
    return (
        <FormItemContext.Provider value={{ id }}>
            <div ref={ref} className={cn('space-y-1', className)} {...props} />
        </FormItemContext.Provider>
    )
})
FormItem.displayName = 'FormItem'

const FormLabel = React.forwardRef<React.ElementRef<typeof Label>, React.ComponentPropsWithoutRef<typeof Label>>(
    ({ className, ...props }, ref) => {
        const { error } = useFormField()
        return <Label ref={ref} className={cn(error && 'text-red-500', className)} {...props} />
    }
)
FormLabel.displayName = 'FormLabel'

const FormControl = React.forwardRef<React.ElementRef<'div'>, React.ComponentPropsWithoutRef<'div'>>(({ ...props }, ref) => {
    return <div ref={ref} {...props} />
})
FormControl.displayName = 'FormControl'

const FormMessage = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
    ({ className, children, ...props }, ref) => {
        const { error } = useFormField()
        const body = error ? String(error?.message) : children
        if (!body) return null
        return (
            <p ref={ref} className={cn('text-xs font-medium text-red-500', className)} {...props}>
                {body}
            </p>
        )
    }
)
FormMessage.displayName = 'FormMessage'

export { Form, FormField, FormItem, FormLabel, FormControl, FormMessage, useFormField }
