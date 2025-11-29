# Markini Platform - Deployment Guide

## Prerequisites
- Docker and Docker Compose installed
- Node.js 18+ (for local development)
- PostgreSQL 14+ (if not using Docker)
- Redis 7+ (if not using Docker)
- Kafka (if not using Docker)

## Quick Start with Docker

### 1. Clone the Repository
```bash
git clone https://github.com/your-org/markini.git
cd markini
```

### 2. Configure Environment Variables

**Backend (.env)**
```bash
cd backend
cp .env.example .env
# Edit .env with your configuration
```

**Frontend (.env.local)**
```bash
cd frontend
cp .env.example .env.local
# Edit .env.local with your configuration
```

### 3. Start All Services
```bash
# From the root directory
docker-compose up -d
```

This will start:
- PostgreSQL on port 5432
- Redis on port 6379
- Kafka on port 9092
- Backend API on port 3000
- Frontend on port 3001

### 4. Run Database Migrations
```bash
docker exec -it markini-backend npm run migration:run
```

### 5. Seed Database (Optional)
```bash
docker exec -it markini-backend npm run seed
```

### 6. Access the Application
- Frontend: http://localhost:3001
- Backend API: http://localhost:3000/api/v1
- API Documentation: http://localhost:3000/api/docs

## Local Development (Without Docker)

### Backend Setup
```bash
cd backend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Run migrations
npm run migration:run

# Start development server
npm run start:dev
```

### Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Start development server
npm run dev
```

## Production Deployment

### Using Docker Compose (Production)
```bash
# Build production images
docker-compose -f docker-compose.prod.yml build

# Start services
docker-compose -f docker-compose.prod.yml up -d
```

### Manual Deployment

#### Backend
```bash
cd backend

# Install dependencies
npm ci --only=production

# Build application
npm run build

# Run migrations
npm run migration:run

# Start production server
npm run start:prod
```

#### Frontend
```bash
cd frontend

# Install dependencies
npm ci --only=production

# Build application
npm run build

# Start production server
npm run start
```

## Cloud Deployment

### AWS Deployment
1. **Database**: Use RDS for PostgreSQL
2. **Cache**: Use ElastiCache for Redis
3. **Message Queue**: Use Amazon MSK for Kafka
4. **Backend**: Deploy to ECS or EKS
5. **Frontend**: Deploy to Vercel or Amplify
6. **Storage**: Use S3 for file uploads

### Environment Variables for Production
```bash
# Backend
NODE_ENV=production
DATABASE_HOST=your-rds-endpoint
REDIS_HOST=your-elasticache-endpoint
KAFKA_BROKERS=your-msk-brokers
JWT_SECRET=your-secure-secret
STRIPE_SECRET_KEY=your-stripe-key
SENDGRID_API_KEY=your-sendgrid-key
TWILIO_ACCOUNT_SID=your-twilio-sid

# Frontend
NEXT_PUBLIC_API_URL=https://api.markini.com/api/v1
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=your-stripe-public-key
```

## Health Checks

### Backend Health Check
```bash
curl http://localhost:3000/health
```

### Database Connection Check
```bash
docker exec -it markini-postgres psql -U markini -d markini_db -c "SELECT 1;"
```

### Redis Connection Check
```bash
docker exec -it markini-redis redis-cli ping
```

## Monitoring

### Logs
```bash
# Backend logs
docker logs -f markini-backend

# Frontend logs
docker logs -f markini-frontend

# Database logs
docker logs -f markini-postgres
```

### Metrics
- Set up Prometheus for metrics collection
- Use Grafana for visualization
- Configure alerts for critical issues

## Backup and Recovery

### Database Backup
```bash
# Create backup
docker exec markini-postgres pg_dump -U markini markini_db > backup.sql

# Restore backup
docker exec -i markini-postgres psql -U markini markini_db < backup.sql
```

### Redis Backup
```bash
# Redis automatically saves to disk
# Copy RDB file for backup
docker cp markini-redis:/data/dump.rdb ./redis-backup.rdb
```

## Scaling

### Horizontal Scaling
- Use Kubernetes for container orchestration
- Set up load balancers for backend instances
- Use CDN for frontend static assets
- Implement database read replicas

### Vertical Scaling
- Increase container resources in docker-compose.yml
- Optimize database queries and indexes
- Implement caching strategies

## Security Checklist
- [ ] Change all default passwords
- [ ] Enable HTTPS/TLS
- [ ] Configure CORS properly
- [ ] Set up rate limiting
- [ ] Enable database encryption
- [ ] Implement API key rotation
- [ ] Set up VPC and security groups
- [ ] Enable audit logging
- [ ] Configure backup retention

## Troubleshooting

### Backend won't start
- Check database connection
- Verify environment variables
- Check logs: `docker logs markini-backend`

### Frontend won't connect to backend
- Verify NEXT_PUBLIC_API_URL is correct
- Check CORS configuration
- Verify backend is running

### Database connection issues
- Check PostgreSQL is running
- Verify credentials in .env
- Check network connectivity

## Support
For issues and questions:
- GitHub Issues: https://github.com/your-org/markini/issues
- Email: support@markini.com
- Documentation: https://docs.markini.com
