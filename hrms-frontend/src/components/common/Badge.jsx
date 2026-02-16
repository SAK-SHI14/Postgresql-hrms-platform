import React from 'react'
import { cn } from '../../utils/cn'

const Badge = ({ children, variant = 'slate', className, dot = false }) => {
    const variants = {
        slate: 'bg-slate-100 text-slate-600 border-slate-200',
        gray: 'bg-gray-100 text-gray-600 border-gray-200',
        green: 'bg-pastel-mint text-emerald-600 border-emerald-100',
        red: 'bg-pastel-rose text-red-600 border-red-100',
        yellow: 'bg-pastel-yellow text-amber-600 border-amber-100',
        blue: 'bg-pastel-blue text-blue-600 border-blue-100',
        indigo: 'bg-indigo-50 text-indigo-600 border-indigo-100',
        purple: 'bg-pastel-purple text-purple-600 border-purple-100',
        pink: 'bg-pink-50 text-pink-600 border-pink-100',
    }

    const dotColors = {
        slate: 'bg-slate-400',
        gray: 'bg-gray-400',
        green: 'bg-emerald-400',
        red: 'bg-red-400',
        yellow: 'bg-amber-400',
        blue: 'bg-blue-400',
        indigo: 'bg-indigo-400',
        purple: 'bg-purple-400',
        pink: 'bg-pink-400',
    }

    return (
        <span className={cn(
            "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border shadow-sm",
            variants[variant] || variants.slate,
            className
        )}>
            {dot && (
                <span className={cn(
                    "w-1.5 h-1.5 rounded-full mr-2",
                    dotColors[variant] || dotColors.slate
                )}></span>
            )}
            {children}
        </span>
    )
}

export default Badge
