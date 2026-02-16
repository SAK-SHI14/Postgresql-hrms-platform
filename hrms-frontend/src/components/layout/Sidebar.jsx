import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, Users, FileText, Calendar, LogOut, Settings, HelpCircle, X, Sparkles } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { cn } from '../../utils/cn'

const Sidebar = ({ isOpen, onClose }) => {
    const location = useLocation()
    const { signOut, role } = useAuth()

    const navigation = [
        { name: 'Dashboard', href: '/', icon: LayoutDashboard },
        { name: 'Employees', href: '/employees', icon: Users, roles: ['admin', 'hr'] },
        { name: 'Payroll', href: '/payroll', icon: FileText },
        { name: 'Leave Requests', href: '/leaves', icon: Calendar },
    ]

    const filteredNavigation = navigation.filter(item => {
        if (!item.roles) return true
        return role && item.roles.includes(role)
    })

    const secondaryNavigation = [
        { name: 'Settings', href: '#', icon: Settings },
        { name: 'Support', href: '#', icon: HelpCircle },
    ]

    return (
        <div className={cn(
            "flex flex-col w-72 bg-white/80 backdrop-blur-xl h-screen text-slate-600 fixed left-0 top-0 border-r border-white/50 shadow-soft-xl z-30 transition-transform duration-300 ease-in-out md:translate-x-0",
            isOpen ? "translate-x-0" : "-translate-x-full"
        )}>
            {/* Logo Section */}
            <div className="flex items-center justify-between px-8 h-24 border-b border-pastel-purple/30">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-pastel-lavender to-pastel-blue flex items-center justify-center shadow-sm">
                        <Sparkles className="w-6 h-6 text-indigo-500" />
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-800">
                        Astra<span className="text-indigo-500">HR</span>
                    </h1>
                </div>
                <button onClick={onClose} className="md:hidden text-slate-400 hover:text-indigo-500 transition-colors">
                    <X className="h-6 w-6" />
                </button>
            </div>

            {/* Navigation */}
            <div className="flex-1 overflow-y-auto py-8 px-6 space-y-8">
                <div>
                    <h3 className="text-xs font-bold text-indigo-300 uppercase tracking-wider mb-4 px-4">
                        Main Menu
                    </h3>
                    <nav className="space-y-2">
                        {filteredNavigation.map((item) => {
                            const isActive = location.pathname === item.href
                            const Icon = item.icon

                            return (
                                <Link
                                    key={item.name}
                                    to={item.href}
                                    className={cn(
                                        'group flex items-center px-4 py-3.5 text-sm font-medium rounded-2xl transition-all duration-200',
                                        isActive
                                            ? 'bg-gradient-to-r from-pastel-lavender/50 to-pastel-blue/50 text-indigo-600 shadow-sm'
                                            : 'text-slate-500 hover:bg-white hover:text-indigo-500 hover:shadow-sm'
                                    )}
                                >
                                    <Icon className={cn('mr-3 h-5 w-5 transition-colors',
                                        isActive ? 'text-indigo-500' : 'text-slate-400 group-hover:text-indigo-400'
                                    )} />
                                    {item.name}
                                </Link>
                            )
                        })}
                    </nav>
                </div>

                <div>
                    <h3 className="text-xs font-bold text-indigo-300 uppercase tracking-wider mb-4 px-4">
                        System
                    </h3>
                    <nav className="space-y-2">
                        {secondaryNavigation.map((item) => {
                            const Icon = item.icon
                            return (
                                <Link
                                    key={item.name}
                                    to={item.href}
                                    className="group flex items-center px-4 py-3.5 text-sm font-medium rounded-2xl text-slate-500 hover:bg-white hover:text-indigo-500 hover:shadow-sm transition-all duration-200"
                                >
                                    <Icon className="mr-3 h-5 w-5 text-slate-400 group-hover:text-indigo-400 transition-colors" />
                                    {item.name}
                                </Link>
                            )
                        })}
                    </nav>
                </div>
            </div>

            {/* Footer / User Profile Brief */}
            <div className="p-6 border-t border-pastel-purple/30 bg-pastel-cream/50">
                <button
                    onClick={signOut}
                    className="flex items-center w-full px-4 py-3.5 text-sm font-medium text-slate-500 rounded-2xl hover:bg-pastel-rose hover:text-red-500 transition-all duration-200 group"
                >
                    <LogOut className="mr-3 h-5 w-5 text-slate-400 group-hover:text-red-400 transition-colors" />
                    Sign Out
                </button>
            </div>
        </div>
    )
}

export default Sidebar
