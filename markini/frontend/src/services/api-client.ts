import axios, { AxiosInstance, AxiosError } from 'axios'
import { toast } from 'react-toastify'

/**
 * API client configuration
 * Axios instance with interceptors for authentication and error handling
 */
class ApiClient {
    private client: AxiosInstance

    constructor() {
        this.client = axios.create({
            baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1',
            headers: {
                'Content-Type': 'application/json',
            },
        })

        // Request interceptor - add auth token
        this.client.interceptors.request.use(
            (config) => {
                const token = this.getToken()
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`
                }
                return config
            },
            (error) => Promise.reject(error)
        )

        // Response interceptor - handle errors
        this.client.interceptors.response.use(
            (response) => response,
            (error: AxiosError) => {
                if (error.response?.status === 401) {
                    this.clearToken()
                    if (typeof window !== 'undefined') {
                        window.location.href = '/auth/login'
                    }
                }

                const message = (error.response?.data as any)?.message || 'An error occurred'
                toast.error(message)

                return Promise.reject(error)
            }
        )
    }

    private getToken(): string | null {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('accessToken')
        }
        return null
    }

    private clearToken(): void {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('accessToken')
            localStorage.removeItem('refreshToken')
        }
    }

    public setToken(token: string): void {
        if (typeof window !== 'undefined') {
            localStorage.setItem('accessToken', token)
        }
    }

    public setRefreshToken(token: string): void {
        if (typeof window !== 'undefined') {
            localStorage.setItem('refreshToken', token)
        }
    }

    public get<T>(url: string, config?: any) {
        return this.client.get<T>(url, config)
    }

    public post<T>(url: string, data?: any, config?: any) {
        return this.client.post<T>(url, data, config)
    }

    public put<T>(url: string, data?: any, config?: any) {
        return this.client.put<T>(url, data, config)
    }

    public patch<T>(url: string, data?: any, config?: any) {
        return this.client.patch<T>(url, data, config)
    }

    public delete<T>(url: string, config?: any) {
        return this.client.delete<T>(url, config)
    }
}

export const apiClient = new ApiClient()
