import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

/**
 * Bootstrap the NestJS application
 * Sets up global pipes, interceptors, and Swagger documentation
 */
async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        logger: ['error', 'warn', 'log', 'debug', 'verbose'],
    });

    const configService = app.get(ConfigService);

    // Global prefix for all routes
    const apiPrefix = configService.get('API_PREFIX') || 'api/v1';
    app.setGlobalPrefix(apiPrefix);

    // Enable CORS
    app.enableCors({
        origin: configService.get('CORS_ORIGIN') || 'http://localhost:3001',
        credentials: true,
    });

    // Global validation pipe
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true, // Strip properties that don't have decorators
            forbidNonWhitelisted: true, // Throw error if non-whitelisted properties are present
            transform: true, // Automatically transform payloads to DTO instances
            transformOptions: {
                enableImplicitConversion: true,
            },
        }),
    );

    // Global interceptors
    app.useGlobalInterceptors(
        new LoggingInterceptor(),
        new TransformInterceptor(),
    );

    // Swagger API Documentation
    const config = new DocumentBuilder()
        .setTitle('Markini API')
        .setDescription('Medical Appointment Platform API Documentation')
        .setVersion('1.0')
        .addBearerAuth(
            {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
                name: 'JWT',
                description: 'Enter JWT token',
                in: 'header',
            },
            'JWT-auth',
        )
        .addTag('Authentication', 'User authentication and authorization')
        .addTag('Patients', 'Patient management endpoints')
        .addTag('Doctors', 'Doctor management endpoints')
        .addTag('Appointments', 'Appointment booking and management')
        .addTag('Payments', 'Payment processing')
        .addTag('Teleconsultation', 'Video consultation sessions')
        .addTag('Notifications', 'Notification management')
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);

    const port = configService.get('PORT') || 3000;
    await app.listen(port);

    console.log(`
    🚀 Markini Backend API is running!
    📡 API: http://localhost:${port}/${apiPrefix}
    📚 Swagger Docs: http://localhost:${port}/api/docs
    🌍 Environment: ${configService.get('NODE_ENV')}
  `);
}

bootstrap();
