import { apiClient } from './api-client'

export interface Appointment {
    id: string
    patientId: string
    doctorId: string
    appointmentDate: string
    startTime: string
    endTime: string
    type: 'in-person' | 'teleconsultation'
    status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no-show'
    reason?: string
    notes?: string
}

export interface CreateAppointmentData {
    patientId: string
    doctorId: string
    appointmentDate: string
    startTime: string
    endTime: string
    type: 'in-person' | 'teleconsultation'
    reason?: string
}

/**
 * Appointment service
 * Handles appointment booking, management, and slot availability
 */
export const appointmentService = {
    /**
     * Create new appointment
     */
    async createAppointment(data: CreateAppointmentData): Promise<Appointment> {
        const response = await apiClient.post<{ data: Appointment }>('/appointments', data)
        return response.data.data
    },

    /**
     * Get appointments with filters
     */
    async getAppointments(filters?: any): Promise<Appointment[]> {
        const response = await apiClient.get<{ data: Appointment[] }>('/appointments', { params: filters })
        return response.data.data
    },

    /**
     * Get appointment by ID
     */
    async getAppointment(id: string): Promise<Appointment> {
        const response = await apiClient.get<{ data: Appointment }>(`/appointments/${id}`)
        return response.data.data
    },

    /**
     * Get available time slots
     */
    async getAvailableSlots(doctorId: string, date: string): Promise<string[]> {
        const response = await apiClient.get<{ data: string[] }>('/appointments/slots/available', {
            params: { doctorId, date },
        })
        return response.data.data
    },

    /**
     * Cancel appointment
     */
    async cancelAppointment(id: string, reason: string): Promise<Appointment> {
        const response = await apiClient.post<{ data: Appointment }>(`/appointments/${id}/cancel`, { reason })
        return response.data.data
    },

    /**
     * Confirm appointment
     */
    async confirmAppointment(id: string): Promise<Appointment> {
        const response = await apiClient.post<{ data: Appointment }>(`/appointments/${id}/confirm`)
        return response.data.data
    },
}
