import React, { useEffect, useState } from 'react'
import { Download, Search, Filter, Loader2, DollarSign, CheckCircle2, AlertCircle } from 'lucide-react'
import { supabase } from '../services/supabase'
import { useAuth } from '../context/AuthContext'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/common/Table'
import Button from '../components/common/Button'
import Badge from '../components/common/Badge'
import Card from '../components/common/Card'

const Payroll = () => {
    const { user, role } = useAuth()
    const [payrolls, setPayrolls] = useState([])
    const [loading, setLoading] = useState(true)
    const [processing, setProcessing] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const [message, setMessage] = useState(null) // { type: 'success'|'error', text: '' }

    useEffect(() => {
        if (user) fetchPayrolls()
    }, [user])

    const fetchPayrolls = async () => {
        setLoading(true)
        let query = supabase
            .from('payroll')
            .select(`
                *,
                employee:employee_id (first_name, last_name, email, job_role)
            `)
            .order('payment_date', { ascending: false })

        // If employee, only show own records
        if (role !== 'admin' && role !== 'hr') {
            query = query.eq('employee_id', user.id)
        }

        const { data, error } = await query

        if (error) {
            console.error('Error fetching payrolls:', error)
            setPayrolls([])
        } else {
            setPayrolls(data || [])
        }
        setLoading(false)
    }

    const handleRunPayroll = async () => {
        if (!window.confirm('Are you sure you want to run payroll for all active employees for this month?')) return

        setProcessing(true)
        setMessage(null)

        try {
            // 1. Get all active employees
            const { data: employees, error: empError } = await supabase
                .from('employees')
                .select('id, job_role, department') // Add salary if it was in DB, but assuming mock or fixed for now
                .eq('status', 'Active')

            if (empError) throw empError
            if (!employees || employees.length === 0) throw new Error('No active employees found')

            // 2. Check for existing payroll for this month to prevent duplicates
            const currentMonthStart = new Date().toISOString().slice(0, 7) + '-01' // YYYY-MM-01

            // Check if ANY payroll record exists for this month
            const { data: existingPayroll } = await supabase
                .from('payroll')
                .select('id')
                .gte('payment_date', currentMonthStart)
                .limit(1)

            if (existingPayroll && existingPayroll.length > 0) {
                if (!window.confirm('Payroll records for this month already exist. Do you want to proceed and potentially create duplicates?')) {
                    setProcessing(false)
                    return
                }
            }

            // Mock salary calculation
            const payrollRecords = employees.map(emp => ({
                employee_id: emp.id,
                amount: 5000.00, // Fixed mock salary for demo
                payment_date: new Date().toISOString().split('T')[0],
                status: 'Paid'
            }))

            // 3. Insert records
            const { data, error: insertError } = await supabase
                .from('payroll')
                .insert(payrollRecords)
                .select()

            if (insertError) throw insertError

            setMessage({ type: 'success', text: `Successfully processed payroll for ${payrollRecords.length} employees.` })
            fetchPayrolls() // Refresh list
        } catch (error) {
            console.error('Payroll run failed:', error)
            setMessage({ type: 'error', text: 'Failed to run payroll: ' + error.message })
        } finally {
            setProcessing(false)
        }
    }

    const filteredPayrolls = payrolls.filter(record =>
        record.employee?.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.employee?.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.employee?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.employee?.job_role?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const getStatusVariant = (status) => {
        switch (status?.toLowerCase()) {
            case 'paid': return 'green'
            case 'pending': return 'yellow'
            case 'failed': return 'red'
            default: return 'gray'
        }
    }

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A'
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount)
    }

    return (
        <div className="space-y-6 max-w-7xl mx-auto pb-10">
            {message && (
                <div className={`fixed top-20 right-4 z-50 border px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-top-2
                    ${message.type === 'success' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
                    {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                    {message.text}
                </div>
            )}

            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Payroll</h1>
                    <p className="text-slate-500 mt-1">View and manage employee salary history.</p>
                </div>
                {/* Only Admin/HR can run payroll */}
                {(role === 'admin' || role === 'hr') && (
                    <Button
                        onClick={handleRunPayroll}
                        isLoading={processing}
                        icon={DollarSign}
                        className="shadow-lg shadow-indigo-500/20"
                    >
                        Run Monthly Payroll
                    </Button>
                )}
            </div>

            <Card className="flex flex-col sm:flex-row gap-4 justify-between items-center p-4 border-white/60">
                <div className="relative w-full sm:w-96 group">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-11 sm:text-sm border-slate-200 rounded-xl py-3 border focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all bg-slate-50/50 focus:bg-white outline-none"
                        placeholder="Search payroll records..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                    <Button variant="secondary" size="md" icon={Filter} className="w-full sm:w-auto border-slate-200 text-slate-600">Filter</Button>
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
                                    <TableHead>Role</TableHead>
                                    <TableHead>Payment Date</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredPayrolls.length === 0 ? (
                                    <TableRow>
                                        <TableCell className="text-center py-16 text-slate-500" colSpan="5">
                                            No payroll records match your search.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredPayrolls.map((record) => (
                                        <TableRow key={record.id}>
                                            <TableCell>
                                                <div className="flex items-center">
                                                    <div className="h-11 w-11 rounded-full bg-gradient-to-tr from-pastel-mint to-teal-100 flex items-center justify-center text-teal-600 font-bold mr-4 shadow-sm border-2 border-white">
                                                        {record.employee?.first_name?.[0]}{record.employee?.last_name?.[0]}
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-bold text-slate-800">
                                                            {record.employee?.first_name} {record.employee?.last_name}
                                                        </div>
                                                        <div className="text-xs text-slate-500 font-medium">{record.employee?.email}</div>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="font-medium text-slate-600">{record.employee?.job_role || 'N/A'}</TableCell>
                                            <TableCell className="text-slate-500 font-medium text-xs">{formatDate(record.payment_date)}</TableCell>
                                            <TableCell className="font-bold text-slate-800">
                                                {formatCurrency(record.amount)}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={getStatusVariant(record.status)}>
                                                    {record.status || 'Unknown'}
                                                </Badge>
                                            </TableCell>
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

export default Payroll
