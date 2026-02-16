import React from 'react'
import { cn } from '../../utils/cn'
import { Loader2 } from 'lucide-react'

const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    className,
    isLoading,
    disabled,
    icon: Icon,
    ...props
}) => {
    const variants = {
        primary: 'bg-indigo-500 text-white hover:bg-indigo-600 active:bg-indigo-700 shadow-md hover:shadow-lg hover:-translate-y-0.5 border border-transparent',
        secondary: 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:text-indigo-600 hover:border-indigo-200 active:bg-slate-100 shadow-sm',
        outline: 'bg-transparent text-indigo-500 border border-indigo-200 hover:bg-indigo-50 active:bg-indigo-100',
        danger: 'bg-pastel-rose text-red-600 border border-red-200 hover:bg-red-50 hover:border-red-300 active:bg-red-100 shadow-sm',
        ghost: 'bg-transparent text-slate-500 hover:bg-slate-100/50 hover:text-indigo-600',
    }

    const sizes = {
        sm: 'px-3 py-1.5 text-xs',
        md: 'px-5 py-2.5 text-sm',
        lg: 'px-6 py-3 text-base',
        icon: 'p-2.5',
    }

    return (
        <button
            className={cn(
                'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:transform-none',
                variants[variant],
                sizes[size],
                className
            )}
            disabled={isLoading || disabled}
            {...props}
        >
            {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {!isLoading && Icon && <Icon className="w-4 h-4 mr-2" />}
            {children}
        </button>
    )
}

export default Button
