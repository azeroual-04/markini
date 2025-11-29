import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';

/**
 * Payment module
 * Handles payment processing with Stripe
 */
@Module({
    imports: [TypeOrmModule.forFeature([Payment])],
    controllers: [],
    providers: [],
    exports: [],
})
export class PaymentModule { }
