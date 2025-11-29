import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';

/**
 * Notification module
 * Handles SMS, Email, and Push notifications
 */
@Module({
    providers: [NotificationService],
    exports: [NotificationService],
})
export class NotificationModule { }
