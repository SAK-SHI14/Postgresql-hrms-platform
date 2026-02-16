import React, { useEffect, useState } from 'react'
import { Check, X, Search, Filter, Loader2, CheckCircle2, Clock, CheckCircle, XCircle } from 'lucide-react'
import { supabase } from '../services/supabase'
import { useAuth } from '../context/AuthContext'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/common/Table'
import Button from '../components/common/Button'
import Badge from '../components/common/Badge'
import Card from '../components/common/Card'

const Leaves = () => {
    const { user, role } = useAuth()
    const [leaves, setLeaves] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState('Pending') // 'All', 'Pending', 'Approved', 'Rejected'
    const [successMessage, setSuccessMessage] = useState('')

    useEffect(() => {
        if (user) fetchLeaves()
    }, [statusFilter, user])

    const fetchLeaves = async () => {
        setLoading(true)

        let query = supabase
            .from('leave_request')
            .select(`
                *,
                employee:employee_id (first_name, last_name, email)
            `)
            .order('start_date', { ascending: false })

        // If not admin/hr, only show own leaves
        if (role !== 'admin' && role !== 'hr') {
            query = query.eq('employee_id', user.id)
        }

        if (statusFilter !== 'All') {
            query = query.eq('status', statusFilter)
        }

        const { data, error } = await query

        if (error) {
            // Try plural 'leave_requests' if singular failed? Or just log error.
            console.error('Error fetching leaves:', error)
            // fallback to empty if error (maybe table name issue)
            setLeaves([])
        } else {
            setLeaves(data || [])
        }
        setLoading(false)
    }

    const filteredLeaves = leaves.filter(leave =>
    (leave.employee?.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        leave.employee?.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        leave.leave_type?.toLowerCase().includes(searchTerm.toLowerCase()))
    )

    const updateStatus = async (id, newStatus) => {
        try {
            const { error } = await supabase
                .from('leave_request')
                .update({ status: newStatus })
                .eq('id', id)

            if (error) throw error

            setLeaves(leaves.filter(leave => leave.id !== id)) // Remove from current view if filtering by status
            setSuccessMessage(`Leave request ${newStatus.toLowerCase()} successfully`)
            setTimeout(() => setSuccessMessage(''), 3000)
        } catch (err) {
            console.error('Error updating leave status:', err)
            alert('Failed to update status')
        }
    }

    const getStatusVariant = (status) => {
        switch (status?.toLowerCase()) {
            case 'approved': return 'green'
            case 'rejected': return 'red'
            case 'pending': return 'yellow'
            default: return 'gray'
        }
    }

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A'
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        })
    }

    const tabs = [
        { id: 'Pending', label: 'Pending Requests', icon: Clock },
        { id: 'Approved', label: 'Approved', icon: CheckCircle },
        { id: 'Rejected', label: 'Rejected', icon: XCircle },
        { id: 'All', label: 'All History', icon: Filter },
    ]

    return (
        <div className="space-y-6 max-w-7xl mx-auto pb-10">
            {successMessage && (
                <div className="fixed top-20 right-4 z-50 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    {successMessage}
                </div>
            )}

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Leave Requests</h1>
                    <p className="text-slate-500 mt-1">Manage employee time-off requests.</p>
                </div>
            </div>

            {/* Status Tabs */}
            <div className="flex space-x-1 bg-slate-100/50 p-1 rounded-xl w-full sm:w-fit overflow-x-auto">
                {tabs.map((tab) => {
                    const Icon = tab.icon
                    const isActive = statusFilter === tab.id
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setStatusFilter(tab.id)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap
                                ${isActive
                                    ? 'bg-white text-indigo-600 shadow-sm'
                                    : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
                                }`}
                        >
                            <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-500' : 'text-slate-400'}`} />
                            {tab.label}
                        </button>
                    )
                })}
            </div>

            <Card className="flex flex-col sm:flex-row gap-4 justify-between items-center p-4 border-white/60">
                <div className="relative w-full sm:w-96 group">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-11 sm:text-sm border-slate-200 rounded-xl py-3 border focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all bg-slate-50/50 focus:bg-white outline-none"
                        placeholder="Search requests..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </Card>

            <div className="bg-white/60 backdrop-blur-md rounded-2xl shadow-soft-xl border border-white/60 overflow-hidden flex flex-col">
                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="flex justify-center py-20">
                            <Loader2 className="animate-spin text-indigo-500 h-10 w-10" />
                        </div>
                    ) : (
                        <Table className="border-0 shadow-none rounded-none bg-transparent">
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Employee</TableHead>
                                    <TableHead>Leave Type</TableHead>
                                    <TableHead>Duration</TableHead>
                                    <TableHead>Reason</TableHead>
                                    <TableHead>Status</TableHead>
                                    {(role === 'admin' || role === 'hr') && <TableHead>Actions</TableHead>}
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredLeaves.length === 0 ? (
                                    <TableRow>
                                        <TableCell className="text-center py-16 text-slate-500" colSpan="6">
                                            <div className="flex flex-col items-center justify-center">
                                                <div className="bg-pastel-cream p-4 rounded-full mb-3">
                                                    <Clock className="h-8 w-8 text-indigo-300" />
                                                </div>
                                                <p className="text-lg font-bold text-slate-700">
                                                    No {statusFilter === 'All' ? '' : statusFilter.toLowerCase()} requests found
                                                </p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredLeaves.map((leave) => (
                                        <TableRow key={leave.id}>
                                            <TableCell>
                                                <div className="flex items-center">
                                                    <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-pastel-peach to-orange-100 flex items-center justify-center text-orange-600 font-bold mr-3 border-2 border-white shadow-sm shrink-0">
                                                        {leave.employee?.first_name?.[0]}{leave.employee?.last_name?.[0]}
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-bold text-slate-800">
                                                            {leave.employee?.first_name} {leave.employee?.last_name}
                                                        </div>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="font-medium text-slate-700">{leave.leave_type}</TableCell>
                                            <TableCell>
                                                <span className="text-slate-500 font-medium text-xs bg-slate-100/50 px-2 py-1 rounded-lg border border-slate-100 whitespace-nowrap">
                                                    {formatDate(leave.start_date)} - {formatDate(leave.end_date)}
                                                </span>
                                            </TableCell>
                                            <TableCell className="max-w-xs truncate text-slate-500 italic" title={leave.reason}>
                                                "{leave.reason || 'No reason provided'}"
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={getStatusVariant(leave.status)}>
                                                    {leave.status || 'Pending'}
                                                </Badge>
                                            </TableCell>
                                            {(role === 'admin' || role === 'hr') && (
                                                <TableCell>
                                                    {leave.status === 'Pending' && (
                                                        <div className="flex space-x-2">
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 p-1.5 rounded-lg"
                                                                onClick={(e) => { e.stopPropagation(); updateStatus(leave.id, 'Approved'); }}
                                                                title="Approve"
                                                            >
                                                                <Check className="h-4 w-4" />
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="text-red-600 hover:bg-red-50 hover:text-red-700 p-1.5 rounded-lg"
                                                                onClick={(e) => { e.stopPropagation(); updateStatus(leave.id, 'Rejected'); }}
                                                                title="Reject"
                                                            >
                                                                <X className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    )}
                                                </TableCell>
                                            )}
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Leaves
