import React from 'react'
import { cn } from '../../utils/cn'

export const Table = ({ children, className }) => {
    return (
        <div className={cn("overflow-hidden rounded-2xl border border-slate-100 shadow-sm bg-white/50 backdrop-blur-sm", className)}>
            <table className="min-w-full divide-y divide-slate-100">
                {children}
            </table>
        </div>
    )
}

export const TableHeader = ({ children }) => {
    return <thead className="bg-slate-50/50">{children}</thead>
}

export const TableBody = ({ children }) => {
    return <tbody className="bg-white/40 divide-y divide-slate-50/50">{children}</tbody>
}

export const TableRow = ({ children, className, onClick }) => {
    return (
        <tr
            className={cn(
                "hover:bg-indigo-50/30 transition-colors duration-150 group",
                onClick && "cursor-pointer active:bg-indigo-50/50",
                className
            )}
            onClick={onClick}
        >
            {children}
        </tr>
    )
}

export const TableHead = ({ children, className }) => {
    return (
        <th
            scope="col"
            className={cn(
                "px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider",
                className
            )}
        >
            {children}
        </th>
    )
}

export const TableCell = ({ children, className }) => {
    return (
        <td className={cn("px-6 py-4 whitespace-nowrap text-sm text-slate-600 font-medium", className)}>
            {children}
        </td>
    )
}
