import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { KafkaService, KafkaTopics } from '../../common/kafka/kafka.service';
import * as sgMail from '@sendgrid/mail';

/**
 * Notification service
 * Sends SMS, Email, and Push notifications
 * Consumes events from Kafka to trigger notifications
 */
@Injectable()
export class NotificationService implements OnModuleInit {
    constructor(
        private configService: ConfigService,
        private kafkaService: KafkaService,
    ) {
        // Initialize SendGrid
        sgMail.setApiKey(this.configService.get('SENDGRID_API_KEY'));
    }

    async onModuleInit() {
        // Subscribe to appointment events
        await this.kafkaService.subscribe(
            KafkaTopics.APPOINTMENT_EVENTS,
            'notification-service',
            async (payload) => {
                const event = JSON.parse(payload.message.value.toString());
                await this.handleAppointmentEvent(event);
            },
        );

        // Subscribe to payment events
        await this.kafkaService.subscribe(
            KafkaTopics.PAYMENT_EVENTS,
            'notification-service',
            async (payload) => {
                const event = JSON.parse(payload.message.value.toString());
                await this.handlePaymentEvent(event);
            },
        );
    }

    /**
     * Handle appointment events
     */
    private async handleAppointmentEvent(event: any): Promise<void> {
        switch (event.type) {
            case 'appointment.created':
                await this.sendAppointmentConfirmation(event.data);
                break;
            case 'appointment.confirmed':
                await this.sendAppointmentConfirmed(event.data);
                break;
            case 'appointment.cancelled':
                await this.sendAppointmentCancellation(event.data);
                break;
        }
    }

    /**
     * Handle payment events
     */
    private async handlePaymentEvent(event: any): Promise<void> {
        if (event.type === 'payment.completed') {
            await this.sendPaymentConfirmation(event.data);
        }
    }

    /**
     * Send email notification
     */
    async sendEmail(to: string, subject: string, html: string): Promise<void> {
        try {
            await sgMail.send({
                to,
                from: this.configService.get('SENDGRID_FROM_EMAIL'),
                subject,
                html,
            });
            console.log(`📧 Email sent to ${to}: ${subject}`);
        } catch (error) {
            console.error('Failed to send email:', error);
        }
    }

    /**
     * Send SMS notification
     */
    async sendSMS(to: string, message: string): Promise<void> {
        // TODO: Implement Twilio SMS
        console.log(`📱 SMS to ${to}: ${message}`);
    }

    /**
     * Send push notification
     */
    async sendPushNotification(userId: string, title: string, body: string): Promise<void> {
        // TODO: Implement Firebase push notifications
        console.log(`🔔 Push to ${userId}: ${title} - ${body}`);
    }

    /**
     * Send appointment confirmation email
     */
    private async sendAppointmentConfirmation(appointment: any): Promise<void> {
        const subject = 'Appointment Confirmation - Markini';
        const html = `
      <h2>Your appointment has been booked!</h2>
      <p>Date: ${appointment.appointmentDate}</p>
      <p>Time: ${appointment.startTime}</p>
      <p>Type: ${appointment.type}</p>
    `;

        // In production, fetch patient email from database
        await this.sendEmail('patient@example.com', subject, html);
        await this.sendSMS('+1234567890', 'Your appointment has been confirmed!');
    }

    /**
     * Send appointment confirmed notification
     */
    private async sendAppointmentConfirmed(appointment: any): Promise<void> {
        const subject = 'Appointment Confirmed - Markini';
        const html = `<h2>Your appointment has been confirmed by the doctor!</h2>`;
        await this.sendEmail('patient@example.com', subject, html);
    }

    /**
     * Send appointment cancellation notification
     */
    private async sendAppointmentCancellation(appointment: any): Promise<void> {
        const subject = 'Appointment Cancelled - Markini';
        const html = `<h2>Your appointment has been cancelled</h2>`;
        await this.sendEmail('patient@example.com', subject, html);
    }

    /**
     * Send payment confirmation
     */
    private async sendPaymentConfirmation(payment: any): Promise<void> {
        const subject = 'Payment Confirmation - Markini';
        const html = `<h2>Payment of $${payment.amount} received successfully!</h2>`;
        await this.sendEmail('patient@example.com', subject, html);
    }
}
