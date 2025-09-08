/* eslint-disable @typescript-eslint/no-explicit-any */
import Stripe from 'stripe';
import { Request, Response } from 'express';
import httpStatus from 'http-status';

import config from '../config';
import catchAsync from '../utils/catchAsync';
import AppError from '../../errors/AppError';
import { UserServices } from '../../modules/User/user.services';

import sendEmail from '../../utils/sendEmail';
import BookServiceModel from '../../modules/BookService/bookservice.model';

// import billingServices from '../modules/billingModule/billing.services';

const stripe = new Stripe(config.stripe_secret_key as string);

export const stripeWebhookHandler = catchAsync(
  async (req: Request, res: Response) => {
    const sig = req.headers['stripe-signature']!;
    const webhookSecret = config.webhook_secret_key;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret!);
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message);
      throw new AppError(httpStatus.BAD_REQUEST, 'No items in the order.');
    }

    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.customer as string;

    const user = await UserServices.getSingleUserFromDB(userId);

    if (!user) throw new AppError(httpStatus.BAD_REQUEST, 'No user found.');

    switch (event.type) {
      case 'checkout.session.completed': {
        console.log('Checkout session completed');

        const bookServiceId =
          session.metadata?.bookServiceId || session.client_reference_id || '';
        console.log('book service id from webhook 2--------->', bookServiceId);
        // 1) Update the specific BookService (if you provided its id in metadata)
        if (bookServiceId) {
          try {
            await BookServiceModel.findByIdAndUpdate(
              bookServiceId,
              { $set: { paymentStatus: 'paid', paidAt: new Date() } },
              { new: true },
            );
            console.log(`BookService ${bookServiceId} marked as paid`);
          } catch (e) {
            console.error('BookService update failed:', e);
          }
        } else {
          console.warn(
            'No bookServiceId found in session metadata/client_reference_id',
          );
        }

        break;
      }

      case 'invoice.payment_failed': {
        console.warn('Payment failed for invoice', session.id);

        const content = `Your subscription purchase has failed!`;
        await sendEmail({
          from: config.smtp_user as string,
          to: user.email,
          subject: 'Illuminate Muslim Minds - Subscription Payment Failed',
          text: content,
        });
        break;
      }
    }

    res.status(200).json({ received: true });
  },
);
