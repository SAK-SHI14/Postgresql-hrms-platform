import React from 'react'
import { cn } from '../../utils/cn'

const Input = React.forwardRef(({ label, error, className, id, icon: Icon, ...props }, ref) => {
    return (
        <div className='w-full'>
            {label && (
                <label htmlFor={id} className="block text-sm font-semibold text-slate-600 mb-2 ml-1">
                    {label}
                </label>
            )}
            <div className="relative group">
                {Icon && (
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <Icon className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                    </div>
                )}
                <input
                    ref={ref}
                    id={id}
                    className={cn(
                        "block w-full rounded-xl border-slate-200 shadow-sm bg-slate-50/50 focus:bg-white focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10 sm:text-sm py-3 transition-all duration-200",
                        Icon ? "pl-11" : "px-4",
                        error && "border-red-300 text-red-900 placeholder-red-300 focus:ring-red-100 focus:border-red-400 bg-red-50",
                        "disabled:bg-slate-100 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none",
                        className
                    )}
                    {...props}
                />
            </div>
            {error && <p className="mt-1.5 text-sm text-red-500 flex items-center ml-1">{error}</p>}
        </div>
    )
})

export default Input
