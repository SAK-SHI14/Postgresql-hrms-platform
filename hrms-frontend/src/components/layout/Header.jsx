import React from 'react'
import { useAuth } from '../../context/AuthContext'
import { Bell, Search, Menu } from 'lucide-react'

const Header = ({ onMenuClick }) => {
    const { user } = useAuth()

    return (
        <header className="h-24 bg-white/50 backdrop-blur-xl border-b border-white/50 flex items-center justify-between px-4 md:px-8 sticky top-0 z-20 transition-all">
            <div className="flex items-center flex-1 gap-4">
                <button
                    onClick={onMenuClick}
                    className="md:hidden p-2 rounded-xl text-slate-500 hover:bg-white hover:text-indigo-500 shadow-sm transition-all"
                >
                    <Menu className="h-6 w-6" />
                </button>

                {/* Search Bar */}
                <div className="max-w-md w-full hidden md:block group">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-hover:text-indigo-400 transition-colors" />
                        <input
                            type="text"
                            placeholder="Type to search..."
                            className="w-full bg-white/70 border border-white/50 rounded-2xl py-3 pl-12 pr-4 text-sm focus:ring-2 focus:ring-indigo-100 focus:border-indigo-200 focus:bg-white text-slate-600 placeholder-slate-400 shadow-sm transition-all ease-out"
                        />
                    </div>
                </div>
            </div>

            <div className="flex items-center space-x-6">
                <button className="p-2.5 rounded-full bg-white/70 text-slate-400 hover:text-indigo-500 hover:bg-white hover:shadow-md relative transition-all border border-white/50">
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-2 right-2.5 h-2 w-2 bg-pastel-rose rounded-full border border-white"></span>
                </button>

                <div className="flex items-center pl-6 border-l border-white/30">
                    <div className="flex flex-col items-end mr-4 hidden sm:flex">
                        <span className="text-sm font-bold text-slate-700">{user?.email?.split('@')[0] || 'User'}</span>
                        <span className="text-xs text-indigo-400 font-medium bg-indigo-50 px-2 py-0.5 rounded-full">Admin</span>
                    </div>
                    <div className="h-11 w-11 rounded-full bg-gradient-to-tr from-pastel-lavender to-pastel-blue p-0.5 shadow-md">
                        <div className="h-full w-full rounded-full bg-white flex items-center justify-center">
                            <span className="font-bold text-indigo-500 text-lg">
                                {user?.email?.[0].toUpperCase() || 'U'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Header
