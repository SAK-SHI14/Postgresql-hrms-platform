import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'

const MainLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false)

    return (
        <div className="min-h-screen bg-pastel-cream flex">
            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm z-20 md:hidden transition-opacity"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            <div className="flex-1 flex flex-col md:ml-72 transition-all duration-300 w-full relative">
                {/* Background Decor */}
                <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-pastel-peach blur-[150px] opacity-40 pointer-events-none fixed"></div>
                <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-pastel-sky blur-[150px] opacity-40 pointer-events-none fixed"></div>

                <Header onMenuClick={() => setSidebarOpen(true)} />
                <main className="flex-1 p-4 md:p-8 overflow-x-hidden z-10">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}

export default MainLayout
