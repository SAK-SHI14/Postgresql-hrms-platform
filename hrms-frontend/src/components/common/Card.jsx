import React from 'react'
import { cn } from '../../utils/cn'

const Card = ({ children, className, padding = "p-6" }) => {
    return (
        <div className={cn(
            "bg-white/80 backdrop-blur-sm rounded-2xl border border-white shadow-soft-xl hover:shadow-soft-2xl transition-all duration-300",
            padding,
            className
        )}>
            {children}
        </div>
    )
}

export default Card
