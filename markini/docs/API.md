# Markini Backend API Documentation

## Overview
The Markini backend provides a comprehensive RESTful API for managing medical appointments, patient records, doctor profiles, and teleconsultations.

## Base URL
```
http://localhost:3000/api/v1
```

## Authentication
All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `POST /auth/logout` - Logout user
- `POST /auth/refresh-token` - Refresh access token
- `POST /auth/forgot-password` - Request password reset
- `POST /auth/reset-password` - Reset password
- `POST /auth/mfa/enable` - Enable 2FA
- `POST /auth/mfa/verify` - Verify 2FA code
- `POST /auth/mfa/disable` - Disable 2FA
- `GET /auth/validate` - Validate JWT token

### Patients
- `POST /patients` - Create patient profile
- `GET /patients` - Get all patients (Admin only)
- `GET /patients/me` - Get current patient profile
- `GET /patients/:id` - Get patient by ID
- `PATCH /patients/:id` - Update patient profile
- `DELETE /patients/:id` - Delete patient (Admin only)
- `GET /patients/:id/medical-history` - Get medical history
- `POST /patients/:id/medical-history` - Add medical history entry

### Doctors
- `POST /doctors` - Create doctor profile (Admin only)
- `GET /doctors` - Search doctors
- `GET /doctors/:id` - Get doctor by ID
- `PATCH /doctors/:id` - Update doctor profile
- `GET /doctors/:id/availability` - Get doctor availability
- `POST /doctors/:id/availability` - Set doctor availability
- `GET /doctors/:id/reviews` - Get doctor reviews
- `POST /doctors/:id/reviews` - Add doctor review

### Appointments
- `POST /appointments` - Book appointment
- `GET /appointments` - Get appointments with filters
- `GET /appointments/slots/available` - Get available time slots
- `GET /appointments/:id` - Get appointment by ID
- `PATCH /appointments/:id` - Update appointment
- `POST /appointments/:id/cancel` - Cancel appointment
- `POST /appointments/:id/confirm` - Confirm appointment
- `POST /appointments/:id/complete` - Mark as completed

### Payments
- `POST /payments` - Create payment
- `GET /payments/:id` - Get payment by ID
- `POST /payments/:id/refund` - Refund payment
- `GET /payments/patient/:patientId` - Get patient payments
- `GET /payments/doctor/:doctorId` - Get doctor payments

### Teleconsultation
- `POST /teleconsultation/session` - Create session
- `GET /teleconsultation/session/:id` - Get session details
- `POST /teleconsultation/session/:id/join` - Join session
- `POST /teleconsultation/session/:id/end` - End session
- `GET /teleconsultation/session/:id/token` - Get Agora token

## Query Parameters

### Doctor Search
```
GET /doctors?specialization=cardiology&minRating=4.0
```

### Appointment Filters
```
GET /appointments?patientId=xxx&status=scheduled&date=2024-01-15
```

## Response Format
All responses follow this structure:
```json
{
  "success": true,
  "data": { ... },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## Error Responses
```json
{
  "success": false,
  "message": "Error description",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `500` - Internal Server Error

## Swagger Documentation
Interactive API documentation is available at:
```
http://localhost:3000/api/docs
```
