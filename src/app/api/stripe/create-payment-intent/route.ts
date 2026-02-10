import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2026-01-28.clover",
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      orderId,
      amount,
      customerEmail,
      customerName,
    } = body;

    // Validate required fields
    if (!orderId || !amount || !customerEmail) {
      return NextResponse.json(
        { error: "Missing required fields: orderId, amount, customerEmail" },
        { status: 400 }
      );
    }

    // Calculate Stripe fee (2.9% + €0.30) and convert to customer payment
    // Formula: customerPays = (orderAmount + fixedFee) / (1 - percentFee)
    // Add 2.5% buffer to account for exchange rate fluctuations and double conversion
    const orderAmount = parseFloat(amount);
    const stripeFeePercent = 0.029; // 2.9%
    const stripeFixedFee = 0.30; // €0.30 in EUR
    const bufferPercent = 0.025; // 2.5% buffer for exchange rate differences + double conversion

    // Convert fixed fee from EUR to GEL (approximate)
    const exchangeRate = 3.14; // Default GEL/EUR rate
    const stripeFixedFeeGel = stripeFixedFee * exchangeRate;

    // Calculate total with fee passed to customer (with buffer)
    const totalWithFee = (orderAmount + stripeFixedFeeGel) / (1 - stripeFeePercent - bufferPercent);
    const processingFee = totalWithFee - orderAmount;

    // Convert to cents for Stripe
    const amountInCents = Math.round(totalWithFee * 100);

    // Create Payment Intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: "gel",
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        orderId,
        originalAmount: orderAmount.toFixed(2),
        processingFee: processingFee.toFixed(2),
      },
      description: `Insurance Order ${orderId}`,
      receipt_email: customerEmail,
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      processingFee: processingFee.toFixed(2),
      totalAmount: totalWithFee.toFixed(2),
    });
  } catch (error) {
    console.error("Error creating payment intent:", error);
    return NextResponse.json(
      { error: "Failed to create payment intent" },
      { status: 500 }
    );
  }
}
