import Stripe from 'stripe';
import config from '../app/config';



// src/utils/stripeClient.ts
export const stripe = new Stripe(config.stripe_secret_key as string, {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  apiVersion: '2025-08-27.basil' as any, 
});