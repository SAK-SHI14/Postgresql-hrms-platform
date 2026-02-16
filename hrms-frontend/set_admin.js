
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://phfathzgwdmdlqxrzkyv.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBoZmF0aHpnd2RtZGxxeHJ6a3l2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA3MTA2ODAsImV4cCI6MjA4NjI4NjY4MH0.S3lIRUDi8r5CK9rbcNsKU2Wwtf3Rs6yiFcHqgya-3R4'

const supabase = createClient(supabaseUrl, supabaseKey)

const emailToPromote = process.argv[2]

if (!emailToPromote) {
    console.error('Please provide an email address as an argument.')
    console.log('Usage: node set_admin.js <email>')
    process.exit(1)
}

async function setAdmin() {
    console.log(`Promoting ${emailToPromote} to admin...`)

    // 1. Check if user exists in employees table
    const { data: employee, error: findError } = await supabase
        .from('employees')
        .select('id, system_role')
        .eq('email', emailToPromote)
        .single()

    if (findError) {
        console.error('Error finding employee:', findError.message)
        return
    }

    if (!employee) {
        console.error('Employee not found with that email.')
        return
    }

    // 2. Update role
    const { error: updateError } = await supabase
        .from('employees')
        .update({ system_role: 'admin' })
        .eq('email', emailToPromote)

    if (updateError) {
        console.error('Error updating role:', updateError.message)
    } else {
        console.log(`Success! ${emailToPromote} is now an ADMIN.`)
        console.log('Please log out and log back in to see the changes.')
    }
}

setAdmin()
