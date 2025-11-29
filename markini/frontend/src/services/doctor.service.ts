import { apiClient } from './api-client'

export interface Doctor {
    id: string
    firstName: string
    lastName: string
    specialization: string[]
    licenseNumber: string
    yearsOfExperience: number
    consultationFee: number
    bio: string
    profileImageUrl: string
    rating: number
    totalReviews: number
}

export interface DoctorFilters {
    specialization?: string
    minRating?: number
    location?: string
}

/**
 * Doctor service
 * Handles doctor search, profiles, and reviews
 */
export const doctorService = {
    /**
     * Search doctors with filters
     */
    async searchDoctors(filters?: DoctorFilters): Promise<Doctor[]> {
        const response = await apiClient.get<{ data: Doctor[] }>('/doctors', { params: filters })
        return response.data.data
    },

    /**
     * Get doctor by ID
     */
    async getDoctor(id: string): Promise<Doctor> {
        const response = await apiClient.get<{ data: Doctor }>(`/doctors/${id}`)
        return response.data.data
    },

    /**
     * Get doctor availability
     */
    async getAvailability(doctorId: string): Promise<any[]> {
        const response = await apiClient.get<{ data: any[] }>(`/doctors/${doctorId}/availability`)
        return response.data.data
    },

    /**
     * Get doctor reviews
     */
    async getReviews(doctorId: string): Promise<any[]> {
        const response = await apiClient.get<{ data: any[] }>(`/doctors/${doctorId}/reviews`)
        return response.data.data
    },

    /**
     * Add doctor review
     */
    async addReview(doctorId: string, rating: number, comment: string, patientId: string): Promise<any> {
        const response = await apiClient.post<{ data: any }>(`/doctors/${doctorId}/reviews`, {
            rating,
            comment,
            patientId,
        })
        return response.data.data
    },
}
