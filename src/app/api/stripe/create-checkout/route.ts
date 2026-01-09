import { NextRequest, NextResponse } from "next/server";
import { createStripeCheckoutSession } from "@/lib/stripe";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      orderId,
      amount,
      currency = "gel",
      customerEmail,
      customerName,
      planName,
      locale = "en",
    } = body;

    // Validate required fields
    if (!orderId || !amount || !customerEmail) {
      return NextResponse.json(
        { error: "Missing required fields: orderId, amount, customerEmail" },
        { status: 400 }
      );
    }

    // Convert amount to cents (Stripe expects smallest currency unit)
    const amountInCents = Math.round(amount * 100);

    // Build URLs for success and cancel redirects
    const baseUrl = request.headers.get("origin") || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3005";
    const successUrl = `${baseUrl}/${locale}/payment/success?session_id={CHECKOUT_SESSION_ID}&order_id=${orderId}`;
    const cancelUrl = `${baseUrl}/${locale}/payment/cancel?order_id=${orderId}`;

    // Create description
    const description = planName
      ? `Insurance Policy - ${planName}`
      : "Travel Insurance Policy";

    // Create Stripe Checkout Session
    const session = await createStripeCheckoutSession({
      orderId,
      amount: amountInCents,
      currency,
      customerEmail,
      customerName,
      description,
      metadata: {
        planName: planName || "",
        locale,
      },
      successUrl,
      cancelUrl,
    });

    return NextResponse.json({
      success: true,
      sessionId: session.id,
      url: session.url,
    });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to create checkout session"
      },
      { status: 500 }
    );
  }
}
