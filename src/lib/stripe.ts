import Stripe from "stripe";

// Initialize Stripe only if the secret key is available
// This allows the build to succeed without environment variables
let stripe: Stripe | null = null;

if (process.env.STRIPE_SECRET_KEY) {
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2026-01-28.clover",
    typescript: true,
  });
}

export { stripe };
export const STRIPE_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "";

export interface StripePaymentParams {
  orderId: string;
  amount: number; // in cents (e.g., 10050 for 100.50 GEL)
  currency: string;
  customerEmail: string;
  customerName?: string;
  description: string;
  metadata?: Record<string, string>;
  successUrl: string;
  cancelUrl: string;
}

/**
 * Create a Stripe Checkout Session for payment
 */
export async function createStripeCheckoutSession(params: StripePaymentParams): Promise<Stripe.Checkout.Session> {
  if (!stripe) {
    throw new Error("Stripe is not configured. Please set STRIPE_SECRET_KEY environment variable.");
  }

  const {
    orderId,
    amount,
    currency,
    customerEmail,
    customerName,
    description,
    metadata = {},
    successUrl,
    cancelUrl,
  } = params;

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: currency.toLowerCase(),
          product_data: {
            name: "Travel Insurance Policy",
            description: description,
          },
          unit_amount: amount, // Amount in cents
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    customer_email: customerEmail,
    client_reference_id: orderId,
    metadata: {
      orderId,
      ...metadata,
    },
    success_url: successUrl,
    cancel_url: cancelUrl,
    billing_address_collection: "auto",
    payment_intent_data: {
      metadata: {
        orderId,
        ...metadata,
      },
    },
  });

  return session;
}

/**
 * Verify a Stripe webhook signature
 */
export function verifyStripeWebhook(
  payload: string | Buffer,
  signature: string,
  webhookSecret: string
): Stripe.Event {
  if (!stripe) {
    throw new Error("Stripe is not configured. Please set STRIPE_SECRET_KEY environment variable.");
  }
  return stripe.webhooks.constructEvent(payload, signature, webhookSecret);
}

/**
 * Retrieve a Checkout Session by ID
 */
export async function getCheckoutSession(sessionId: string): Promise<Stripe.Checkout.Session> {
  if (!stripe) {
    throw new Error("Stripe is not configured. Please set STRIPE_SECRET_KEY environment variable.");
  }
  return await stripe.checkout.sessions.retrieve(sessionId);
}

/**
 * Retrieve a Payment Intent by ID with latest_charge expanded
 */
export async function getPaymentIntent(paymentIntentId: string): Promise<Stripe.PaymentIntent> {
  if (!stripe) {
    throw new Error("Stripe is not configured. Please set STRIPE_SECRET_KEY environment variable.");
  }
  return await stripe.paymentIntents.retrieve(paymentIntentId, {
    expand: ['latest_charge.balance_transaction'],
  });
}

/**
 * Retrieve a Balance Transaction by ID
 */
export async function getBalanceTransaction(balanceTransactionId: string): Promise<Stripe.BalanceTransaction> {
  if (!stripe) {
    throw new Error("Stripe is not configured. Please set STRIPE_SECRET_KEY environment variable.");
  }
  return await stripe.balanceTransactions.retrieve(balanceTransactionId);
}
