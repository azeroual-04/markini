import { apiClient } from './api-client'

export interface LoginCredentials {
    email: string
    password: string
    mfaCode?: string
}

export interface RegisterData {
    email: string
    password: string
    role: 'patient' | 'doctor' | 'admin'
}

export interface AuthResponse {
    user: any
    accessToken: string
    refreshToken: string
}

/**
 * Authentication service
 * Handles login, registration, and token management
 */
export const authService = {
    /**
     * Login user
     */
    async login(credentials: LoginCredentials): Promise<AuthResponse> {
        const response = await apiClient.post<{ data: AuthResponse }>('/auth/login', credentials)
        const { accessToken, refreshToken } = response.data.data

        apiClient.setToken(accessToken)
        apiClient.setRefreshToken(refreshToken)

        return response.data.data
    },

    /**
     * Register new user
     */
    async register(data: RegisterData): Promise<AuthResponse> {
        const response = await apiClient.post<{ data: AuthResponse }>('/auth/register', data)
        const { accessToken } = response.data.data

        apiClient.setToken(accessToken)

        return response.data.data
    },

    /**
     * Logout user
     */
    async logout(): Promise<void> {
        await apiClient.post('/auth/logout')

        if (typeof window !== 'undefined') {
            localStorage.removeItem('accessToken')
            localStorage.removeItem('refreshToken')
        }
    },

    /**
     * Refresh access token
     */
    async refreshToken(): Promise<{ accessToken: string; refreshToken: string }> {
        const refreshToken = typeof window !== 'undefined' ? localStorage.getItem('refreshToken') : null

        if (!refreshToken) {
            throw new Error('No refresh token available')
        }

        const response = await apiClient.post<{ data: { accessToken: string; refreshToken: string } }>(
            '/auth/refresh-token',
            { refreshToken }
        )

        const { accessToken, refreshToken: newRefreshToken } = response.data.data
        apiClient.setToken(accessToken)
        apiClient.setRefreshToken(newRefreshToken)

        return response.data.data
    },

    /**
     * Enable 2FA
     */
    async enableMfa(): Promise<{ secret: string; qrCode: string }> {
        const response = await apiClient.post<{ data: { secret: string; qrCode: string } }>('/auth/mfa/enable')
        return response.data.data
    },

    /**
     * Verify MFA code
     */
    async verifyMfa(code: string): Promise<boolean> {
        const response = await apiClient.post<{ data: { success: boolean } }>('/auth/mfa/verify', { code })
        return response.data.data.success
    },
}
