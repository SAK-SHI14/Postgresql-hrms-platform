import React, { useEffect, useState, useCallback } from 'react'
import { Plus, Search, Filter, AlertCircle, Loader2, Users, Pencil, Trash2, ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react'
import { supabase } from '../services/supabase'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/common/Table'
import Button from '../components/common/Button'
import Badge from '../components/common/Badge'
import Modal from '../components/common/Modal'
import Input from '../components/common/Input'
import Select from '../components/common/Select'
import Card from '../components/common/Card'

const PAGE_SIZE = 10

const Employees = () => {
    const [employees, setEmployees] = useState([])
    const [loading, setLoading] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')
    const [successMessage, setSuccessMessage] = useState('')
    const [searchTerm, setSearchTerm] = useState('')
    const [editingEmployee, setEditingEmployee] = useState(null)

    // Pagination state
    const [page, setPage] = useState(1)
    const [totalCount, setTotalCount] = useState(0)

    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        department: '',
        job_role: '',
        status: 'Active',
        joined_date: new Date().toISOString().split('T')[0]
    })

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            setPage(1) // Reset to page 1 on search
            fetchEmployees(1, searchTerm)
        }, 500)
        return () => clearTimeout(timer)
    }, [searchTerm])

    // Initial fetch (or page change) is handled by the pagination controls calling fetchEmployees
    useEffect(() => {
        fetchEmployees(page, searchTerm)
    }, [page]) // Only trigger on page change here. Search is handled above.

    const fetchEmployees = async (pageNo, search) => {
        setLoading(true)
        setError('')
        try {
            let query = supabase
                .from('employees')
                .select('*', { count: 'exact' })
                .order('created_at', { ascending: false })

            if (search) {
                // Search across multiple fields using "or" syntax
                // Note: accurate search requires proper text search config in PG, but ilike works for simple cases
                query = query.or(`first_name.ilike.%${search}%,last_name.ilike.%${search}%,email.ilike.%${search}%,job_role.ilike.%${search}%`)
            }

            const from = (pageNo - 1) * PAGE_SIZE
            const to = from + PAGE_SIZE - 1

            const { data, count, error } = await query.range(from, to)

            if (error) throw error

            setEmployees(data || [])
            setTotalCount(count || 0)
        } catch (err) {
            console.error('Error fetching employees:', err)
            setError('Failed to load employees. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    const handleInputChange = (e) => {
        const { id, value } = e.target
        setFormData(prev => ({
            ...prev,
            [id]: value
        }))
    }

    const resetForm = () => {
        setFormData({
            first_name: '',
            last_name: '',
            email: '',
            phone: '',
            department: '',
            job_role: '',
            status: 'Active',
            joined_date: new Date().toISOString().split('T')[0]
        })
        setEditingEmployee(null)
        setError('')
        setSuccessMessage('')
    }

    const openAddModal = () => {
        resetForm()
        setIsModalOpen(true)
    }

    const openEditModal = (employee) => {
        setEditingEmployee(employee)
        setFormData({
            first_name: employee.first_name,
            last_name: employee.last_name,
            email: employee.email,
            phone: employee.phone || '',
            department: employee.department || '',
            job_role: employee.job_role || '',
            status: employee.status || 'Active',
            joined_date: employee.joined_date || ''
        })
        setError('')
        setIsModalOpen(true)
    }

    const handleCloseModal = () => {
        setIsModalOpen(false)
        resetForm()
    }

    const validateForm = () => {
        if (!formData.first_name.trim()) return 'First name is required'
        if (!formData.last_name.trim()) return 'Last name is required'
        if (!formData.email.trim()) return 'Email is required'
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) return 'Invalid email format'
        return null
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const validationError = validateForm()
        if (validationError) {
            setError(validationError)
            return
        }

        setSaving(true)
        setError('')

        try {
            // Check for duplicate email if adding new
            // Check for duplicate email if adding new
            if (!editingEmployee) {
                console.log('Checking for duplicate email:', formData.email);
                const { data: existing, error: checkError } = await supabase
                    .from('employees')
                    .select('id')
                    .eq('email', formData.email)
                    .maybeSingle()

                if (checkError) {
                    console.error('Error checking duplicate:', checkError);
                    throw checkError;
                }

                if (existing) {
                    console.warn('Duplicate email found:', existing);
                    throw new Error('An employee with this email already exists.')
                }
            }

            if (editingEmployee) {
                // Update
                const { error } = await supabase
                    .from('employees')
                    .update(formData)
                    .eq('id', editingEmployee.id)

                if (error) throw error

                // Optimistic update
                setEmployees(employees.map(emp =>
                    emp.id === editingEmployee.id ? { ...emp, ...formData } : emp
                ))
                setSuccessMessage('Employee updated successfully!')
            } else {
                // Insert
                const { data, error } = await supabase
                    .from('employees')
                    .insert([formData])
                    .select()

                if (error) throw error

                if (data) {
                    // If on first page, prepend. If not, re-fetch might be safer but prepend is faster feedback.
                    if (page === 1) {
                        setEmployees([data[0], ...employees].slice(0, PAGE_SIZE))
                    } else {
                        // If we are on another page, just jump to page 1 to see the new entry
                        setPage(1)
                    }
                    setTotalCount(prev => prev + 1)
                }
                setSuccessMessage('Employee added successfully!')
            }
            console.log('Employee added/updated successfully');
            handleCloseModal()
            // Clear success message after 3 seconds
            setTimeout(() => setSuccessMessage(''), 3000)
        } catch (err) {
            console.error('Error saving employee:', err)
            setError(err.message || 'Failed to save employee')
        } finally {
            setSaving(false)
        }
    }

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this employee? This action cannot be undone.')) return

        try {
            const { error } = await supabase
                .from('employees')
                .delete()
                .eq('id', id)

            if (error) throw error

            setEmployees(employees.filter(emp => emp.id !== id))
            setTotalCount(prev => prev - 1)
            setSuccessMessage('Employee deleted successfully')
            setTimeout(() => setSuccessMessage(''), 3000)
        } catch (err) {
            console.error('Error deleting employee:', err)
            alert('Failed to delete employee: ' + err.message)
        }
    }

    const getStatusVariant = (status) => {
        switch (status?.toLowerCase()) {
            case 'active': return 'green'
            case 'inactive': return 'red'
            case 'on leave': return 'yellow'
            default: return 'gray'
        }
    }

    const totalPages = Math.ceil(totalCount / PAGE_SIZE)

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
                    <h1 className="text-2xl font-bold text-slate-900">Employees</h1>
                    <p className="text-slate-500 mt-1">Manage your team members ({totalCount} total)</p>
                </div>
                <Button onClick={openAddModal} icon={Plus} className="shadow-lg shadow-indigo-500/20">
                    Add Employee
                </Button>
            </div>

            <Card className="flex flex-col sm:flex-row gap-4 justify-between items-center p-4 border-white/60">
                <div className="relative w-full sm:w-96 group">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-11 sm:text-sm border-slate-200 rounded-xl py-3 border focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all bg-slate-50/50 focus:bg-white outline-none"
                        placeholder="Search by name, email, or role..."
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
                        <>
                            <Table className="border-0 shadow-none rounded-none bg-transparent">
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Employee</TableHead>
                                        <TableHead>Role</TableHead>
                                        <TableHead>Department</TableHead>
                                        <TableHead>Joined Date</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Phone</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {employees.length === 0 ? (
                                        <TableRow>
                                            <TableCell className="text-center py-16 text-slate-500" colSpan="7">
                                                <div className="flex flex-col items-center justify-center">
                                                    <div className="bg-pastel-cream p-4 rounded-full mb-3">
                                                        <Users className="h-8 w-8 text-indigo-300" />
                                                    </div>
                                                    <p className="text-lg font-bold text-slate-700">
                                                        {searchTerm ? 'No employees match your search' : 'No employees found'}
                                                    </p>
                                                    <p className="text-sm text-slate-500 mt-1">
                                                        {searchTerm ? 'Try adjusting your search terms.' : 'Get started by adding a new employee.'}
                                                    </p>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        employees.map((employee) => (
                                            <TableRow key={employee.id}>
                                                <TableCell component="th">
                                                    <div className="flex items-center">
                                                        <div className="h-11 w-11 rounded-full bg-gradient-to-tr from-pastel-lavender to-pastel-blue flex items-center justify-center text-indigo-600 font-bold mr-4 shadow-sm border-2 border-white shrink-0">
                                                            {employee.first_name?.[0]}{employee.last_name?.[0]}
                                                        </div>
                                                        <div>
                                                            <div className="text-sm font-bold text-slate-800">
                                                                {employee.first_name} {employee.last_name}
                                                            </div>
                                                            <div className="text-xs text-slate-500 font-medium">{employee.email}</div>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="font-semibold text-slate-700">{employee.job_role || 'N/A'}</TableCell>
                                                <TableCell className="text-slate-600">{employee.department || 'N/A'}</TableCell>
                                                <TableCell className="text-slate-600 font-medium text-xs">
                                                    {employee.joined_date ? new Date(employee.joined_date).toLocaleDateString() : 'N/A'}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant={getStatusVariant(employee.status)}>
                                                        {employee.status || 'Unknown'}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-slate-500 font-medium text-xs">{employee.phone || 'N/A'}</TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button
                                                            onClick={() => openEditModal(employee)}
                                                            className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-pastel-blue/50 rounded-lg transition-colors cursor-pointer"
                                                            title="Edit"
                                                        >
                                                            <Pencil className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(employee.id)}
                                                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-pastel-rose/50 rounded-lg transition-colors cursor-pointer"
                                                            title="Delete"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>

                            {/* Pagination Controls */}
                            {totalCount > PAGE_SIZE && (
                                <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-white/40">
                                    <div className="text-sm text-slate-500">
                                        Showing <span className="font-medium">{(page - 1) * PAGE_SIZE + 1}</span> to <span className="font-medium">{Math.min(page * PAGE_SIZE, totalCount)}</span> of <span className="font-medium">{totalCount}</span> results
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="secondary"
                                            size="sm"
                                            onClick={() => setPage(p => Math.max(1, p - 1))}
                                            disabled={page === 1}
                                            icon={ChevronLeft}
                                        >
                                            Previous
                                        </Button>
                                        <Button
                                            variant="secondary"
                                            size="sm"
                                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                            disabled={page === totalPages}
                                        >
                                            Next <ChevronRight className="w-4 h-4 ml-1" />
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={editingEmployee ? "Edit Employee" : "Add New Employee"}
            >
                <form onSubmit={handleSubmit} className="space-y-5">
                    {error && (
                        <div className="bg-red-50 border border-red-100 text-red-600 p-3 rounded-lg text-sm flex items-center gap-2">
                            <AlertCircle className="w-4 h-4" />
                            {error}
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            id="first_name"
                            label="First Name"
                            required
                            value={formData.first_name}
                            onChange={handleInputChange}
                            placeholder="John"
                        />
                        <Input
                            id="last_name"
                            label="Last Name"
                            required
                            value={formData.last_name}
                            onChange={handleInputChange}
                            placeholder="Doe"
                        />
                    </div>

                    <Input
                        id="email"
                        type="email"
                        label="Email Address"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="john@example.com"
                        disabled={!!editingEmployee} // Disable email edit for simplicity or add extra checks
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            id="phone"
                            type="tel"
                            label="Phone Number"
                            value={formData.phone}
                            onChange={handleInputChange}
                            placeholder="+1 (555) 000-0000"
                        />
                        <Input
                            id="joined_date"
                            type="date"
                            label="Joined Date"
                            value={formData.joined_date}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            id="department"
                            label="Department"
                            value={formData.department}
                            onChange={handleInputChange}
                            placeholder="Engineering"
                        />
                        <Input
                            id="job_role"
                            label="Job Role"
                            value={formData.job_role}
                            onChange={handleInputChange}
                            placeholder="Developer"
                        />
                    </div>

                    <Select
                        id="status"
                        label="Status"
                        value={formData.status}
                        onChange={handleInputChange}
                        options={[
                            { value: 'Active', label: 'Active' },
                            { value: 'Inactive', label: 'Inactive' },
                            { value: 'On Leave', label: 'On Leave' },
                        ]}
                    />

                    <div className="pt-4 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={handleCloseModal}
                            className="w-full sm:w-auto"
                        >
                            Cancel
                        </Button>
                        <Button type="submit" isLoading={saving} className="w-full sm:w-auto shadow-md">
                            {editingEmployee ? 'Update Employee' : 'Add Employee'}
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    )
}

export default Employees
