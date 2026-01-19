import { NextRequest, NextResponse } from "next/server";
import { updateOrderPaymentMethod } from "@/lib/orderStorage";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await params;
    const body = await request.json();
    const { paymentMethod } = body;

    if (!paymentMethod || !["bank", "korona", "card", "crypto"].includes(paymentMethod)) {
      return NextResponse.json(
        { error: "Invalid payment method" },
        { status: 400 }
      );
    }

    const updated = await updateOrderPaymentMethod(orderId, paymentMethod);

    if (updated) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error("Payment method update error:", error);
    return NextResponse.json(
      { error: "Failed to update payment method" },
      { status: 500 }
    );
  }
}
