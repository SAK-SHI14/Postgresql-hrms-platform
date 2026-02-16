import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../services/supabase'

const AuthContext = createContext({})

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [role, setRole] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        console.log('Auth: Effect mounted');

        // Safety timeout to prevent infinite loading
        const safetyTimeout = setTimeout(() => {
            setLoading((currentLoading) => {
                if (currentLoading) {
                    console.error('Auth check timed out! Forcing application load.');
                    alert('Auth check timed out! The backend might be unreachable. Forcing load...');
                    return false;
                }
                return currentLoading;
            });
        }, 5000);

        const getSession = async () => {
            console.log('Auth: Starting getSession...');
            try {
                const { data: { session }, error } = await supabase.auth.getSession()
                if (error) throw error

                console.log('Auth: Session retrieved', session ? 'User found' : 'No user');

                if (session?.user) {
                    const userRole = await fetchUserRole(session.user.email)
                    setUser({ ...session.user, role: userRole })
                    setRole(userRole)
                } else {
                    setUser(null)
                    setRole(null)
                }
            } catch (error) {
                console.error('Auth Init Error:', error)
                // alert('Auth Init Error: ' + error.message) 
            } finally {
                console.log('Auth: Finished getSession, turning off loading');
                setLoading(false)
                clearTimeout(safetyTimeout); // Clear timeout if successful
            }
        }

        getSession()

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            console.log('Auth: Auth state changed', _event);
            if (session?.user) {
                // Prepare user immediately to avoid UI flicker, then fetch role
                setUser(session.user)
                // Only set loading if we don't have a role yet to prevent flickering
                // But normally we want to ensure role is up to date.
                // setLoading(true) 
                // Commenting out setLoading(true) in auth change to see if it fixes the hang
                // or we manage it more carefully.

                const userRole = await fetchUserRole(session.user.email)
                setUser({ ...session.user, role: userRole })
                setRole(userRole)
            } else {
                setUser(null)
                setRole(null)
            }
            setLoading(false)
        })

        return () => {
            subscription.unsubscribe()
            clearTimeout(safetyTimeout)
        }
    }, [])

    const fetchUserRole = async (email) => {
        console.log('Auth: Fetching user role for', email);
        try {
            const { data, error } = await supabase
                .from('employees')
                .select('system_role')
                .eq('email', email)
                .single()

            if (error) {
                console.warn('Error fetching user role:', error.message)
                return 'employee' // Default role
            }
            return data?.system_role || 'employee'
        } catch (error) {
            console.error('Unexpected error fetching role:', error)
            return 'employee'
        }
    }

    const value = {
        signUp: (data) => supabase.auth.signUp(data),
        signIn: (data) => supabase.auth.signInWithPassword(data),
        signOut: () => supabase.auth.signOut(),
        user,
        role,
        loading
    }

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    )
}
