import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { verifyStripeWebhook, getPaymentIntent, getBalanceTransaction } from "@/lib/stripe";
import { getPool } from "@/lib/db";

// Disable body parsing for webhooks (Stripe requires raw body)
export const runtime = "nodejs";

const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || "";

// Telegram notification helper
async function sendTelegramNotification(orderId: string, message: string) {
  const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_ORDER_BOT_TOKEN || process.env.TELEGRAM_BOT_TOKEN;
  const TELEGRAM_CHAT_ID = process.env.TELEGRAM_ORDER_CHAT_ID || process.env.TELEGRAM_CHAT_ID;
  
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.log("[Stripe Webhook] Telegram not configured");
    return;
  }

  try {
    await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: "HTML",
      }),
    });
    console.log(`[Stripe Webhook] Telegram notification sent for order ${orderId}`);
  } catch (error) {
    console.error("[Stripe Webhook] Failed to send Telegram notification:", error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const headersList = await headers();
    const signature = headersList.get("stripe-signature");

    if (!signature) {
      console.error("[Stripe Webhook] Missing signature");
      return NextResponse.json({ error: "Missing signature" }, { status: 400 });
    }

    if (!STRIPE_WEBHOOK_SECRET) {
      console.error("[Stripe Webhook] Webhook secret not configured");
      return NextResponse.json({ error: "Webhook not configured" }, { status: 500 });
    }

    // Verify webhook signature
    let event;
    try {
      event = verifyStripeWebhook(body, signature, STRIPE_WEBHOOK_SECRET);
    } catch (err) {
      console.error("[Stripe Webhook] Signature verification failed:", err);
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    console.log(`[Stripe Webhook] Event received: ${event.type}`);

    // Handle different event types
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        const orderId = session.client_reference_id || session.metadata?.orderId;
        const paymentStatus = session.payment_status;

        console.log(`[Stripe Webhook] Checkout completed for order ${orderId}, payment status: ${paymentStatus}`);

        if (orderId && paymentStatus === "paid") {
          try {
            const pool = getPool();

            // Fetch payment intent details to get fee information
            let stripeFeeAmount = null;
            let stripeNetAmount = null;

            if (session.payment_intent) {
              try {
                const paymentIntent = await getPaymentIntent(session.payment_intent as string);

                // Access latest_charge from the expanded PaymentIntent
                const latestCharge = (paymentIntent as any).latest_charge;
                if (latestCharge && typeof latestCharge === 'object') {
                  const balanceTransaction = latestCharge.balance_transaction;

                  if (balanceTransaction && typeof balanceTransaction === 'object') {
                    // Get exchange rate from Stripe
                    const stripeExchangeRate = (balanceTransaction as any).exchange_rate;

                    let exchangeRate = 3.14; // Default GEL/EUR rate

                    if (stripeExchangeRate) {
                      exchangeRate = 1 / stripeExchangeRate;
                      console.log(`[Stripe Webhook] Using Stripe exchange rate: 1 EUR = ${exchangeRate.toFixed(4)} GEL`);
                    }

                    // Convert EUR fee/net amounts to GEL
                    const feeInEur = balanceTransaction.fee / 100;
                    const netInEur = balanceTransaction.net / 100;
                    stripeFeeAmount = (feeInEur * exchangeRate).toFixed(2);
                    stripeNetAmount = (netInEur * exchangeRate).toFixed(2);

                    console.log(`[Stripe Webhook] Order ${orderId} - Fee: €${feeInEur.toFixed(2)} EUR × ${exchangeRate.toFixed(4)} = ${stripeFeeAmount} GEL`);
                  }
                }
              } catch (feeError) {
                console.error("[Stripe Webhook] Error fetching fee info:", feeError);
              }
            }

            // Update order status to paid with fee information
            await pool.query(
              `UPDATE orders
               SET status = $1,
                   payment_method = $2,
                   stripe_session_id = $3,
                   stripe_payment_intent = $4,
                   stripe_fee_amount = $5,
                   stripe_net_amount = $6,
                   updated_at = NOW()
               WHERE order_id = $7`,
              ["paid", "card", session.id, session.payment_intent, stripeFeeAmount, stripeNetAmount, orderId]
            );

            console.log(`[Stripe Webhook] Order ${orderId} marked as paid`);

            // Send Telegram notification
            await sendTelegramNotification(
              orderId,
              `✅ <b>PAYMENT RECEIVED (Georgian Support)</b>\n\n` +
              `🆔 Order: <code>${orderId}</code>\n` +
              `💳 Method: Card (Stripe)\n` +
              `💰 Amount: ${session.amount_total ? (session.amount_total / 100).toFixed(2) : 'N/A'} GEL\n` +
              `📧 Customer: ${session.customer_email || 'N/A'}\n\n` +
              `⏰ Time: ${new Date().toISOString()}`
            );

          } catch (dbError) {
            console.error(`[Stripe Webhook] Failed to update order ${orderId}:`, dbError);
          }
        }
        break;
      }

      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object;
        const orderId = paymentIntent.metadata?.orderId;

        console.log(`[Stripe Webhook] Payment succeeded for order ${orderId}`);

        if (orderId) {
          try {
            const pool = getPool();

            // Fetch payment intent details to get fee information
            let stripeFeeAmount = null;
            let stripeNetAmount = null;

            try {
              const fullPaymentIntent = await getPaymentIntent(paymentIntent.id);

              // Access latest_charge from the expanded PaymentIntent
              const latestCharge = (fullPaymentIntent as any).latest_charge;
              if (latestCharge && typeof latestCharge === 'object') {
                const balanceTransaction = latestCharge.balance_transaction;

                if (balanceTransaction && typeof balanceTransaction === 'object') {
                  const stripeExchangeRate = (balanceTransaction as any).exchange_rate;

                  let exchangeRate = 3.14;

                  if (stripeExchangeRate) {
                    exchangeRate = 1 / stripeExchangeRate;
                    console.log(`[Stripe Webhook] Using Stripe exchange rate: 1 EUR = ${exchangeRate.toFixed(4)} GEL`);
                  }

                  const feeInEur = balanceTransaction.fee / 100;
                  const netInEur = balanceTransaction.net / 100;
                  stripeFeeAmount = (feeInEur * exchangeRate).toFixed(2);
                  stripeNetAmount = (netInEur * exchangeRate).toFixed(2);

                  console.log(`[Stripe Webhook] Order ${orderId} - Fee: €${feeInEur.toFixed(2)} EUR × ${exchangeRate.toFixed(4)} = ${stripeFeeAmount} GEL`);
                }
              }
            } catch (feeError) {
              console.error("[Stripe Webhook] Error fetching fee info:", feeError);
            }

            // Update order status to paid with fee information
            await pool.query(
              `UPDATE orders
               SET status = $1,
                   payment_method = $2,
                   stripe_payment_intent = $3,
                   stripe_fee_amount = $4,
                   stripe_net_amount = $5,
                   updated_at = NOW()
               WHERE order_id = $6`,
              ["paid", "card", paymentIntent.id, stripeFeeAmount, stripeNetAmount, orderId]
            );

            console.log(`[Stripe Webhook] Order ${orderId} marked as paid`);

          } catch (dbError) {
            console.error(`[Stripe Webhook] Failed to update order ${orderId}:`, dbError);
          }
        }
        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object;
        const orderId = paymentIntent.metadata?.orderId;

        console.log(`[Stripe Webhook] Payment failed for order ${orderId}`);

        if (orderId) {
          try {
            const pool = getPool();
            await pool.query(
              `UPDATE orders
               SET status = $1,
                   payment_error = $2,
                   updated_at = NOW()
               WHERE order_id = $3`,
              ["payment_failed", paymentIntent.last_payment_error?.message || "Payment failed", orderId]
            );

            console.log(`[Stripe Webhook] Order ${orderId} marked as payment failed`);

            // Send Telegram notification about failed payment
            await sendTelegramNotification(
              orderId,
              `❌ <b>PAYMENT FAILED (Georgian Support)</b>\n\n` +
              `🆔 Order: <code>${orderId}</code>\n` +
              `⚠️ Error: ${paymentIntent.last_payment_error?.message || 'Unknown error'}\n\n` +
              `⏰ Time: ${new Date().toISOString()}`
            );

          } catch (dbError) {
            console.error(`[Stripe Webhook] Failed to update order ${orderId}:`, dbError);
          }
        }
        break;
      }

      case "charge.succeeded": {
        const charge = event.data.object;
        const paymentIntentId = charge.payment_intent;

        // Get orderId from payment intent metadata
        if (paymentIntentId && typeof paymentIntentId === 'string') {
          try {
            const paymentIntent = await getPaymentIntent(paymentIntentId);
            const orderId = paymentIntent.metadata?.orderId;

            if (!orderId) {
              console.log(`[Stripe Webhook] charge.succeeded: No orderId in payment intent ${paymentIntentId}`);
              break;
            }

            console.log(`[Stripe Webhook] Charge succeeded for order ${orderId}, updating fee data`);

            // Extract balance_transaction from charge
            let balanceTransaction = charge.balance_transaction;

            // If balance_transaction is a string ID, fetch it from Stripe
            if (balanceTransaction && typeof balanceTransaction === 'string') {
              console.log(`[Stripe Webhook] Fetching balance_transaction ${balanceTransaction} for order ${orderId}`);
              try {
                balanceTransaction = await getBalanceTransaction(balanceTransaction);
              } catch (fetchError) {
                console.error(`[Stripe Webhook] Failed to fetch balance_transaction:`, fetchError);
                balanceTransaction = null;
              }
            }

            if (balanceTransaction && typeof balanceTransaction === 'object') {
              const pool = getPool();

              // Get exchange rate from Stripe
              const stripeExchangeRate = (balanceTransaction as any).exchange_rate;

              let exchangeRate = 3.14;

              if (stripeExchangeRate) {
                exchangeRate = 1 / stripeExchangeRate;
                console.log(`[Stripe Webhook] Using Stripe exchange rate: 1 EUR = ${exchangeRate.toFixed(4)} GEL`);
              }

              // Convert EUR fee/net amounts to GEL
              const feeInEur = balanceTransaction.fee / 100;
              const netInEur = balanceTransaction.net / 100;
              const stripeFeeAmount = (feeInEur * exchangeRate).toFixed(2);
              const stripeNetAmount = (netInEur * exchangeRate).toFixed(2);

              console.log(`[Stripe Webhook] Order ${orderId} - Fee: €${feeInEur.toFixed(2)} EUR × ${exchangeRate.toFixed(4)} = ${stripeFeeAmount} GEL`);

              // Update fee information in database
              await pool.query(
                `UPDATE orders
                 SET stripe_fee_amount = $1,
                     stripe_net_amount = $2,
                     updated_at = NOW()
                 WHERE order_id = $3`,
                [stripeFeeAmount, stripeNetAmount, orderId]
              );

              console.log(`[Stripe Webhook] Fee data updated for order ${orderId}`);
            } else {
              console.log(`[Stripe Webhook] charge.succeeded: No balance_transaction available yet for order ${orderId}`);
            }
          } catch (error) {
            console.error(`[Stripe Webhook] Error processing charge.succeeded:`, error);
          }
        }
        break;
      }

      default:
        console.log(`[Stripe Webhook] Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("[Stripe Webhook] Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Webhook error" },
      { status: 500 }
    );
  }
}
