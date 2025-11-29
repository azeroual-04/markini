'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { authService } from '@/services/auth.service'
import { toast } from 'react-toastify'

/**
 * Login page
 * Handles user authentication with email/password and optional 2FA
 */
export default function LoginPage() {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [mfaCode, setMfaCode] = useState('')
    const [showMfa, setShowMfa] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const credentials = { email, password, ...(showMfa && { mfaCode }) }
            const response = await authService.login(credentials)

            toast.success('Login successful!')

            // Redirect based on user role
            const role = response.user.role
            if (role === 'patient') {
                router.push('/patient/dashboard')
            } else if (role === 'doctor') {
                router.push('/doctor/dashboard')
            } else if (role === 'admin') {
                router.push('/admin/dashboard')
            }
        } catch (error: any) {
            if (error.response?.data?.message?.includes('MFA')) {
                setShowMfa(true)
                toast.info('Please enter your 2FA code')
            } else {
                toast.error(error.response?.data?.message || 'Login failed')
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100">
            <div className="card max-w-md w-full">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-primary-600 mb-2">Markini</h1>
                    <h2 className="text-2xl font-semibold text-gray-800">Welcome Back</h2>
                    <p className="text-gray-600 mt-2">Sign in to your account</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                            Email Address
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="input-field"
                            placeholder="you@example.com"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="input-field"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    {showMfa && (
                        <div>
                            <label htmlFor="mfaCode" className="block text-sm font-medium text-gray-700 mb-1">
                                2FA Code
                            </label>
                            <input
                                id="mfaCode"
                                type="text"
                                value={mfaCode}
                                onChange={(e) => setMfaCode(e.target.value)}
                                className="input-field"
                                placeholder="123456"
                                maxLength={6}
                                required
                            />
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary w-full"
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <Link href="/auth/forgot-password" className="text-sm text-primary-600 hover:text-primary-700">
                        Forgot your password?
                    </Link>
                </div>

                <div className="mt-4 text-center">
                    <span className="text-sm text-gray-600">Don't have an account? </span>
                    <Link href="/auth/register" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                        Sign up
                    </Link>
                </div>
            </div>
        </div>
    )
}
