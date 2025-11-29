# Markini - Medical Appointment Platform

A comprehensive medical appointment platform similar to Doctolib, built with modern technologies and microservices architecture.

## 🏗️ Architecture Overview

- **Backend**: NestJS + TypeScript + PostgreSQL + Redis + Kafka
- **Frontend**: Next.js + React + TypeScript + TailwindCSS
- **Infrastructure**: Docker + Docker Compose
- **CI/CD**: GitHub Actions

## 📋 Features

### For Patients
- Search doctors by specialty, location, and insurance
- View available time slots in real-time
- Book, modify, and cancel appointments
- Receive SMS and email reminders
- Access medical history
- Teleconsultation via video calls
- Secure payment processing

### For Doctors
- Manage availability and schedules
- View patient appointments
- Conduct teleconsultations
- Access patient medical history
- Manage profile and specializations

### For Admins
- System monitoring and analytics
- User management
- Audit logs and compliance reports
- Platform configuration

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Docker and Docker Compose
- PostgreSQL 14+
- Redis 7+
- Kafka (optional for local development)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/your-org/markini.git
cd markini
```

2. **Install dependencies**

Backend:
```bash
cd backend
npm install
```

Frontend:
```bash
cd frontend
npm install
```

3. **Set up environment variables**

Backend:
```bash
cd backend
cp .env.example .env
# Edit .env with your configuration
```

Frontend:
```bash
cd frontend
cp .env.example .env.local
# Edit .env.local with your configuration
```

4. **Start services with Docker Compose**
```bash
docker-compose up -d
```

This will start:
- PostgreSQL (port 5432)
- Redis (port 6379)
- Kafka + Zookeeper (ports 9092, 2181)
- Backend API (port 3000)
- Frontend (port 3001)

5. **Run database migrations**
```bash
cd backend
npm run migration:run
```

6. **Seed the database (optional)**
```bash
npm run seed
```

### Development

**Backend Development**
```bash
cd backend
npm run start:dev
```

**Frontend Development**
```bash
cd frontend
npm run dev
```

**Run Tests**
```bash
# Backend tests
cd backend
npm run test

# Frontend tests
cd frontend
npm run test
```

## 📁 Project Structure

```
markini/
├── backend/                    # NestJS backend application
│   ├── src/
│   │   ├── modules/           # Feature modules
│   │   │   ├── auth/          # Authentication & authorization
│   │   │   ├── patient/       # Patient management
│   │   │   ├── doctor/        # Doctor management
│   │   │   ├── appointment/   # Appointment booking
│   │   │   ├── payment/       # Payment processing
│   │   │   ├── teleconsultation/ # Video consultations
│   │   │   ├── notification/  # SMS/Email/Push notifications
│   │   │   └── audit/         # Logging & auditing
│   │   ├── common/            # Shared utilities
│   │   ├── config/            # Configuration
│   │   └── database/          # Database migrations & seeds
│   ├── test/                  # Test files
│   └── Dockerfile
│
├── frontend/                   # Next.js frontend application
│   ├── src/
│   │   ├── app/               # Next.js app directory
│   │   ├── components/        # React components
│   │   ├── services/          # API services
│   │   ├── hooks/             # Custom React hooks
│   │   ├── utils/             # Utility functions
│   │   └── types/             # TypeScript types
│   └── Dockerfile
│
├── docker-compose.yml          # Docker services configuration
├── .github/                    # GitHub Actions workflows
└── docs/                       # Additional documentation
```

## 🔧 Configuration

### Backend Environment Variables

```env
# Database
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=markini
DATABASE_PASSWORD=your_password
DATABASE_NAME=markini_db

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# Kafka
KAFKA_BROKERS=localhost:9092

# JWT
JWT_SECRET=your_jwt_secret
JWT_EXPIRATION=1h

# External Services
STRIPE_SECRET_KEY=sk_test_...
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...
SENDGRID_API_KEY=SG...
AGORA_APP_ID=...
AGORA_APP_CERTIFICATE=...
```

### Frontend Environment Variables

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_test_...
NEXT_PUBLIC_AGORA_APP_ID=...
```

## 🗄️ Database Schema

The application uses PostgreSQL with the following main tables:

- `users` - User authentication and roles
- `patients` - Patient profiles and information
- `doctors` - Doctor profiles and specializations
- `appointments` - Appointment bookings
- `payments` - Payment transactions
- `teleconsultation_sessions` - Video consultation sessions
- `notifications` - Notification logs
- `audit_logs` - System audit trail

See [Database Schema Documentation](./docs/database-schema.md) for details.

## 📡 API Documentation

The backend API follows RESTful conventions and includes:

- **Authentication**: `/api/v1/auth/*`
- **Patients**: `/api/v1/patients/*`
- **Doctors**: `/api/v1/doctors/*`
- **Appointments**: `/api/v1/appointments/*`
- **Payments**: `/api/v1/payments/*`
- **Teleconsultation**: `/api/v1/teleconsultation/*`

API documentation is available at `http://localhost:3000/api/docs` (Swagger UI) when running the backend.

## 🧪 Testing

### Backend Testing
```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

### Frontend Testing
```bash
# Component tests
npm run test

# E2E tests with Playwright
npm run test:e2e
```

## 🚢 Deployment

### Using Docker

Build and deploy all services:
```bash
docker-compose -f docker-compose.prod.yml up -d
```

### Manual Deployment

1. Build backend:
```bash
cd backend
npm run build
npm run start:prod
```

2. Build frontend:
```bash
cd frontend
npm run build
npm run start
```

## 🔒 Security

- JWT-based authentication with refresh tokens
- 2FA support via SMS/Email
- HTTPS enforcement in production
- CORS configuration
- Rate limiting on API endpoints
- SQL injection prevention via ORM
- XSS protection
- CSRF tokens for state-changing operations
- HIPAA compliance measures

## 📊 Monitoring & Logging

- Centralized logging with Winston
- Audit trail for all critical operations
- Health check endpoints
- Prometheus metrics (optional)
- Error tracking with Sentry (optional)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Support

For support, email support@markini.com or join our Slack channel.

## 🗺️ Roadmap

- [ ] AI-powered doctor recommendations
- [ ] Prescription management
- [ ] Health records integration (HL7/FHIR)
- [ ] Wearable device integration
- [ ] Multi-language support
- [ ] Mobile apps (iOS/Android)
- [ ] Insurance claim processing

---

**Built with ❤️ by the Markini Team**
