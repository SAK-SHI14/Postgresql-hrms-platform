-- Create Employees Table
CREATE TABLE IF NOT EXISTS public.employees (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone TEXT,
    department TEXT,
    job_role TEXT,
    status TEXT DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive', 'On Leave')),
    joined_date DATE DEFAULT CURRENT_DATE,
    system_role TEXT DEFAULT 'employee' CHECK (system_role IN ('admin', 'hr', 'employee'))
);

-- Enable RLS (Row Level Security) for Employees
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;

-- Create Payroll Table
CREATE TABLE IF NOT EXISTS public.payroll (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    employee_id UUID REFERENCES public.employees(id) ON DELETE CASCADE,
    amount DECIMAL(10, 2) NOT NULL,
    payment_date DATE NOT NULL,
    status TEXT DEFAULT 'Pending' CHECK (status IN ('Paid', 'Pending', 'Failed'))
);

-- Enable RLS for Payroll
ALTER TABLE public.payroll ENABLE ROW LEVEL SECURITY;

-- Create Policies (Simplified for initial setup - Allow all for now, refine later)
-- In a real production app, you would restrict these significantly.
CREATE POLICY "Allow authenticated read access" ON public.employees FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated insert access" ON public.employees FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated update access" ON public.employees FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated delete access" ON public.employees FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated read access" ON public.payroll FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated insert access" ON public.payroll FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated update access" ON public.payroll FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated delete access" ON public.payroll FOR DELETE USING (auth.role() = 'authenticated');

-- Additional helpful comments
-- Run this in the Supabase SQL Editor.
