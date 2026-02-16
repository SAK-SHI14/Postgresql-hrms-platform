import { useState, useEffect } from 'react'
import { supabase } from '../services/supabase'

const DebugAuth = () => {
    const [logs, setLogs] = useState([])
    const [status, setStatus] = useState('Tests starting...')

    const addLog = (msg) => {
        setLogs(prev => [...prev, `${new Date().toLocaleTimeString()} - ${msg}`]);
        console.log(`[DebugAuth] ${msg}`);
    };

    const runTests = async () => {
        setLogs([]);
        addLog('Starting connectivity tests...');
        setStatus('Running...');

        const url = import.meta.env.VITE_SUPABASE_URL;
        const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

        addLog(`Supabase URL configured: ${!!url ? 'YES' : 'NO'}`);
        if (url) addLog(`Supabase URL Prefix: ${url.substring(0, 15)}...`);
        addLog(`Supabase Key configured: ${!!key ? 'YES' : 'NO'}`);

        try {
            const start = performance.now();
            addLog('Testing supabase.auth.getSession()...');
            const { data, error } = await supabase.auth.getSession();
            const end = performance.now();
            addLog(`getSession took ${(end - start).toFixed(2)}ms`);

            if (error) {
                addLog(`ERROR in getSession: ${error.message}`);
            } else {
                addLog(`getSession success. Session exists: ${!!data.session}`);
                if (data.session) {
                    addLog(`User: ${data.session.user.email}`);
                } else {
                    addLog('No active session (User not logged in)');
                }
            }
        } catch (e) {
            addLog(`EXCEPTION in getSession: ${e.message}`);
        }

        try {
            addLog('Testing database connection (fetching employees count)...');
            const { count, error } = await supabase
                .from('employees')
                .select('*', { count: 'exact', head: true });

            if (error) {
                addLog(`DB Error: ${error.message} (Code: ${error.code})`);
            } else {
                addLog(`DB Connection success. Employees count (approx): ${count}`);
            }
        } catch (e) {
            addLog(`EXCEPTION in DB check: ${e.message}`);
        }

        setStatus('Tests Complete');
    };

    useEffect(() => {
        runTests();
    }, []);

    return (
        <div className="p-8 max-w-2xl mx-auto bg-white rounded shadow-lg m-4">
            <h1 className="text-2xl font-bold mb-4">Auth Debugger</h1>
            <div className="mb-4">
                <button
                    onClick={runTests}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    Rerun Tests
                </button>
            </div>
            <div className={`mb-4 font-bold ${status === 'Tests Complete' ? 'text-green-600' : 'text-yellow-600'}`}>
                Status: {status}
            </div>
            <div className="bg-gray-100 p-4 rounded shadow font-mono text-xs overflow-auto h-96 border border-gray-300">
                {logs.map((log, i) => (
                    <div key={i} className="mb-1 border-b border-gray-200 pb-1">{log}</div>
                ))}
            </div>
        </div>
    );
};

export default DebugAuth;
