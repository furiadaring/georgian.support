import { NextRequest, NextResponse } from "next/server";
import { getOrderById } from "@/lib/orderStorage";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await params;

    if (!orderId) {
      return NextResponse.json(
        { error: "Order ID is required" },
        { status: 400 }
      );
    }

    const order = await getOrderById(orderId);

    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    // Return only safe public fields (no passport data, no internal IDs)
    const publicOrder = {
      orderId: order.orderId,
      status: order.status,
      planName: order.planName,
      planPrice: order.planPrice,
      periodStart: order.periodStart,
      periodEnd: order.periodEnd,
      numberOfDays: order.numberOfDays,
      customerName: `${order.firstNameEng} ${order.lastNameEng}`,
      email: order.email,
      phone: order.mobileNumber,
      paymentMethod: order.paymentMethod,
      locale: order.locale,
      createdAt: order.createdAt,
    };

    return NextResponse.json(publicOrder);
  } catch (error) {
    console.error("[API] Error fetching order:", error);
    return NextResponse.json(
      { error: "Failed to fetch order" },
      { status: 500 }
    );
  }
}
