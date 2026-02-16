import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { User, Mail, Lock, Heart, Star, Sparkles } from 'lucide-react'
import Button from '../components/common/Button'
import Input from '../components/common/Input'

const Login = () => {
    const [isSignUp, setIsSignUp] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const { signIn, signUp } = useAuth()
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        if (!email || !password) {
            setError('Please enter both email and password.')
            setLoading(false)
            return
        }

        // Helper to timeout the promise
        const withTimeout = (promise, ms = 15000) => {
            return Promise.race([
                promise,
                new Promise((_, reject) => setTimeout(() => reject(new Error("Request timed out. Please check your internet connection or try again.")), ms))
            ]);
        };

        try {
            if (isSignUp) {
                const { data, error } = await withTimeout(signUp({ email, password }))
                if (error) throw error
                if (data.user && !data.session) {
                    setError('Account created! Please check your email to confirm.')
                    setLoading(false)
                    return
                }
                navigate('/')
            } else {
                const { error } = await withTimeout(signIn({ email, password }))
                if (error) throw error
                navigate('/')
            }
        } catch (err) {
            console.error("Auth Error:", err)
            setError(err.message || "An error occurred during authentication.")
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen w-full flex bg-pastel-cream relative overflow-hidden">
            {/* Soft Background Blobs */}
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-pastel-lavender blur-[100px] opacity-60 animate-pulse-slow"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-pastel-peach blur-[100px] opacity-60 animate-pulse-slow delay-1000"></div>
            <div className="absolute top-[30%] left-[40%] w-[30%] h-[30%] rounded-full bg-pastel-sky blur-[80px] opacity-50 animate-pulse-slow delay-2000"></div>

            <div className="w-full flex items-center justify-center p-4 z-10">
                <div className="max-w-4xl w-full bg-white/60 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 overflow-hidden flex flex-col md:flex-row">

                    {/* Left Side - Decorative */}
                    <div className="hidden md:flex w-1/2 bg-gradient-to-br from-pastel-lavender to-pastel-blue p-12 flex-col justify-between relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-full bg-white/10 backdrop-blur-[2px]"></div>

                        <div className="relative z-10">
                            <div className="bg-white/30 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-inner backdrop-blur-md">
                                <Sparkles className="w-8 h-8 text-indigo-600" />
                            </div>
                            <h1 className="text-4xl font-bold text-slate-800 mb-4 leading-tight">
                                Welcome to <span className="text-indigo-600">AstraHR</span>
                            </h1>
                            <p className="text-slate-600 text-lg">
                                Where work feels less like work and more like a <span className="italic font-medium text-pink-500">breeze</span>.
                            </p>
                        </div>

                        <div className="relative z-10 flex gap-4 mt-12">
                            <div className="bg-white/40 p-4 rounded-xl flex-1 backdrop-blur-sm border border-white/20">
                                <Heart className="w-6 h-6 text-pink-400 mb-2" />
                                <div className="h-2 w-16 bg-white/50 rounded-full mb-2"></div>
                                <div className="h-2 w-10 bg-white/50 rounded-full"></div>
                            </div>
                            <div className="bg-white/40 p-4 rounded-xl flex-1 backdrop-blur-sm border border-white/20 mt-4">
                                <Star className="w-6 h-6 text-yellow-400 mb-2" />
                                <div className="h-2 w-16 bg-white/50 rounded-full mb-2"></div>
                                <div className="h-2 w-10 bg-white/50 rounded-full"></div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Form */}
                    <div className="w-full md:w-1/2 p-8 md:p-12">
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-bold text-slate-800">
                                {isSignUp ? 'Join the Team' : 'Welcome Back'}
                            </h2>
                            <p className="text-slate-500 mt-2">
                                {isSignUp ? 'Create your account to get started' : 'Enter your details to access your dashboard'}
                            </p>
                        </div>

                        {error && (
                            <div className={`mb-6 p-4 rounded-xl text-sm flex items-center gap-2 ${error.includes('created') ? 'bg-pastel-mint text-green-700' : 'bg-pastel-rose text-red-700'}`}>
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <Input
                                id="email"
                                type="email"
                                label="Email"
                                placeholder="hello@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                icon={Mail}
                                className="bg-white/50 border-pastel-purple focus:border-indigo-400 focus:ring-indigo-200"
                            />

                            <Input
                                id="password"
                                type="password"
                                label="Password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                icon={Lock}
                                className="bg-white/50 border-pastel-purple focus:border-indigo-400 focus:ring-indigo-200"
                            />

                            {!isSignUp && (
                                <div className="flex justify-end">
                                    <a href="#" className="text-sm font-medium text-indigo-500 hover:text-indigo-600 transition-colors">
                                        Forgot Password?
                                    </a>
                                </div>
                            )}

                            <Button
                                type="submit"
                                className="w-full py-3 bg-indigo-500 hover:bg-indigo-600 shadow-lg shadow-indigo-200 transition-all transform hover:-translate-y-0.5 rounded-xl text-white font-medium"
                                isLoading={loading}
                            >
                                {isSignUp ? 'Create Account' : 'Sign In'}
                            </Button>
                        </form>

                        <div className="mt-8 text-center">
                            <p className="text-slate-500 text-sm">
                                {isSignUp ? 'Already have an account?' : "New here?"}{' '}
                                <button
                                    onClick={() => {
                                        setIsSignUp(!isSignUp)
                                        setError('')
                                    }}
                                    className="font-semibold text-indigo-500 hover:text-indigo-600 underline decoration-2 underline-offset-2 decoration-indigo-200 transition-all"
                                >
                                    {isSignUp ? 'Sign In' : 'Create Account'}
                                </button>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login
