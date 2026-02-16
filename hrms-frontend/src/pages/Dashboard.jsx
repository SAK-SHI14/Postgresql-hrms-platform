import React, { useEffect, useState } from 'react'
import { supabase } from '../services/supabase'
import { Users, Calendar, Clock, TrendingUp, Activity, ArrowUpRight } from 'lucide-react'
import Card from '../components/common/Card'

const StatCard = ({ title, value, icon: Icon, trend, color, loading }) => {
    const colorStyles = {
        indigo: 'bg-pastel-lavender/50 text-indigo-600',
        amber: 'bg-pastel-yellow/50 text-amber-600',
        emerald: 'bg-pastel-mint/50 text-emerald-600',
        blue: 'bg-pastel-blue/50 text-blue-600',
    }

    return (
        <Card className="relative overflow-hidden group hover:shadow-soft-xl transition-all duration-300 border-white/60">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-semibold text-slate-500">{title}</p>
                    {loading ? (
                        <div className="h-8 w-24 bg-slate-100/50 animate-pulse rounded-lg mt-2"></div>
                    ) : (
                        <h3 className="text-3xl font-bold text-slate-800 mt-2 tracking-tight">{value}</h3>
                    )}
                </div>
                <div className={`p-3.5 rounded-2xl ${colorStyles[color] || 'bg-slate-100 text-slate-600'} transition-colors duration-300`}>
                    <Icon className="h-6 w-6" />
                </div>
            </div>

            {/* Trend Indicator (Static for now) */}
            {!loading && (
                <div className="mt-4 flex items-center text-sm">
                    <span className="text-emerald-600 flex items-center font-bold bg-emerald-50 px-2 py-0.5 rounded-full">
                        <ArrowUpRight className="h-3.5 w-3.5 mr-1" />
                        12%
                    </span>
                    <span className="text-slate-400 ml-2 font-medium">from last month</span>
                </div>
            )}
        </Card>
    )
}

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalEmployees: 0,
        activeLeaves: 0,
        pendingRequests: 0,
        totalPayroll: 0
    })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchStats()
    }, [])

    const fetchStats = async () => {
        setLoading(true)

        try {
            const today = new Date().toISOString().split('T')[0] // YYYY-MM-DD

            // Promise.all to fetch all stats in parallel
            const [
                { count: employeeCount },
                { count: pendingCount },
                { data: payrollData },
                { count: activeLeavesCount }
            ] = await Promise.all([
                supabase.from('employees').select('*', { count: 'exact', head: true }),
                supabase.from('leave_request').select('*', { count: 'exact', head: true }).eq('status', 'Pending'),
                supabase.from('payroll').select('amount'),
                supabase.from('leave_request')
                    .select('*', { count: 'exact', head: true })
                    .eq('status', 'Approved')
                    .lte('start_date', today)
                    .gte('end_date', today)
            ])

            const totalSalary = payrollData?.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0) || 0

            setStats({
                totalEmployees: employeeCount || 0,
                activeLeaves: activeLeavesCount || 0,
                pendingRequests: pendingCount || 0,
                totalPayroll: totalSalary
            })
        } catch (error) {
            console.error('Error fetching dashboard stats:', error)
        } finally {
            setLoading(false)
        }
    }

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0
        }).format(amount)
    }

    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Dashboard Overview</h1>
                    <p className="text-slate-500 mt-1 font-medium">Welcome back, here's what's happening today.</p>
                </div>
                <div className="flex gap-3">
                    <select className="bg-white/80 border border-white shadow-sm text-slate-600 text-sm rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 outline-none hover:bg-white transition-colors cursor-pointer font-medium">
                        <option>Last 7 Days</option>
                        <option>Last 30 Days</option>
                        <option>This Year</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Employees"
                    value={stats.totalEmployees}
                    icon={Users}
                    color="indigo"
                    loading={loading}
                />
                <StatCard
                    title="Pending Requests"
                    value={stats.pendingRequests}
                    icon={Clock}
                    color="amber"
                    loading={loading}
                />
                <StatCard
                    title="Total Payroll"
                    value={formatCurrency(stats.totalPayroll)}
                    icon={TrendingUp}
                    color="emerald"
                    loading={loading}
                />
                <StatCard
                    title="On Leave"
                    value={stats.activeLeaves}
                    icon={Calendar}
                    color="blue"
                    loading={loading}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content Area */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="min-h-[400px] flex flex-col border-white/60">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold text-slate-800">Activity Overview</h3>
                            <button className="text-sm text-indigo-500 font-semibold hover:text-indigo-600 transition-colors">View Report</button>
                        </div>
                        <div className="flex-1 flex items-center justify-center border-2 border-dashed border-slate-100 rounded-2xl bg-slate-50/30">
                            <div className="text-center text-slate-400">
                                <Activity className="h-10 w-10 mx-auto mb-2 opacity-50 text-indigo-300" />
                                <p className="font-medium">Chart visualization would go here</p>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Sidebar Area */}
                <div className="space-y-6">
                    <Card className="border-white/60">
                        <h3 className="text-lg font-bold text-slate-800 mb-4">Quick Actions</h3>
                        <div className="space-y-3">
                            <button className="w-full group p-3 border border-slate-100 rounded-2xl hover:border-indigo-100 hover:shadow-md hover:bg-white text-left transition-all duration-300 bg-slate-50/30">
                                <div className="flex items-center">
                                    <div className="h-10 w-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-500 group-hover:scale-110 transition-transform">
                                        <Users className="h-5 w-5" />
                                    </div>
                                    <div className="ml-3">
                                        <p className="font-bold text-slate-700 text-sm group-hover:text-indigo-600 transition-colors">Add Employee</p>
                                        <p className="text-xs text-slate-500">Create new record</p>
                                    </div>
                                </div>
                            </button>
                            <button className="w-full group p-3 border border-slate-100 rounded-2xl hover:border-emerald-100 hover:shadow-md hover:bg-white text-left transition-all duration-300 bg-slate-50/30">
                                <div className="flex items-center">
                                    <div className="h-10 w-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
                                        <Calendar className="h-5 w-5" />
                                    </div>
                                    <div className="ml-3">
                                        <p className="font-bold text-slate-700 text-sm group-hover:text-emerald-600 transition-colors">Approve Leaves</p>
                                        <p className="text-xs text-slate-500">Check pending</p>
                                    </div>
                                </div>
                            </button>
                        </div>
                    </Card>

                    <Card className="border-white/60">
                        <h3 className="text-lg font-bold text-slate-800 mb-4">System Status</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center group">
                                <span className="text-slate-600 text-sm font-medium">Database</span>
                                <span className="flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600 border border-emerald-100">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-2 animate-pulse"></span>
                                    Operational
                                </span>
                            </div>
                            <div className="flex justify-between items-center group">
                                <span className="text-slate-600 text-sm font-medium">API Gateway</span>
                                <span className="flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600 border border-emerald-100">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-2 animate-pulse"></span>
                                    Operational
                                </span>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    )
}

export default Dashboard
