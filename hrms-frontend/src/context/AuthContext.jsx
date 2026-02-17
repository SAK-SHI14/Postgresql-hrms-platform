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
        let mounted = true;

        // Safety timeout to prevent infinite loading
        const safetyTimeout = setTimeout(() => {
            if (mounted) {
                setLoading((currentLoading) => {
                    if (currentLoading) {
                        console.warn('Auth check timed out! Forcing application load.');
                        return false;
                    }
                    return currentLoading;
                });
            }
        }, 5000);

        const initAuth = async () => {
            console.log('Auth: Initializing...');
            try {
                // Check current session first
                const { data: { session }, error } = await supabase.auth.getSession();
                if (error) throw error;

                if (mounted) {
                    if (session?.user) {
                        console.log('Auth: Initial session found for', session.user.email);
                        const userRole = await fetchUserRole(session.user.email);
                        if (mounted) {
                            setUser({ ...session.user, role: userRole });
                            setRole(userRole);
                        }
                    } else {
                        console.log('Auth: No initial session');
                        // Don't explicitly set null here if we want to rely on onAuthStateChange, 
                        // but usually it's safe to assume null if getSession is null.
                    }
                }
            } catch (e) {
                console.error('Auth: Init error', e);
            } finally {
                if (mounted) {
                    setLoading(false);
                    clearTimeout(safetyTimeout);
                }
            }
        };

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            console.log('Auth: State Changed:', _event);
            if (!mounted) return;

            if (session?.user) {
                // Set user immediately
                setUser(prev => {
                    // If we already have this user, don't trigger unnecessary updates
                    if (prev?.id === session.user.id) return prev;
                    return session.user;
                });

                // Fetch role in background
                const userRole = await fetchUserRole(session.user.email);
                if (mounted) {
                    setUser(prev => ({ ...session.user, role: userRole }));
                    setRole(userRole);
                }
            } else {
                setUser(null);
                setRole(null);
            }
            setLoading(false);
        });

        initAuth();

        return () => {
            mounted = false;
            subscription.unsubscribe();
            clearTimeout(safetyTimeout);
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
