import React from 'react'
import { cn } from '../../utils/cn'

const Select = React.forwardRef(({ label, error, className, id, options = [], placeholder, ...props }, ref) => {
    return (
        <div className='w-full'>
            {label && (
                <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
                    {label}
                </label>
            )}
            <select
                ref={ref}
                id={id}
                className={cn(
                    "shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md py-2 px-3 border bg-white",
                    error && "border-red-300 text-red-900 focus:outline-none focus:ring-red-500 focus:border-red-500",
                    className
                )}
                {...props}
            >
                {placeholder && <option value="">{placeholder}</option>}
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
    )
})

export default Select
