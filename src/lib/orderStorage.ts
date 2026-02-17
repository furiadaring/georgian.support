/**
 * PostgreSQL-based order storage for Georgian Support
 * Orders are stored in the shared visitgeorgia database
 * Order IDs use GS- prefix to distinguish from VisitGeorgia's VG- orders
 */

import { query, queryOne, execute } from "./db";

export interface Order {
  orderId: string;
  createdAt: string;
  updatedAt?: string;
  planId?: number;
  planName: string;
  planPrice: number;
  planPricePerDay: string;
  numberOfDays: string;
  planPeriod: string;
  periodStart: string;
  periodEnd: string;
  citizenship: string;
  firstNameEng: string;
  lastNameEng: string;
  birthDate: string;
  passportNumber: string;
  city: string;
  mobileNumber: string;
  email: string;
  locale: string;
  paymentOption?: string;
  paymentMonths?: string;
  passportPhotoBase64?: string;
  passportPhotoName?: string;
  passportPhotoType?: string;
  insurancePdfBase64?: string;
  insurancePdfName?: string;
  status: "pending" | "paid" | "confirmed" | "cancelled" | "expired";
  notes?: string;
  source: "website" | "manual";
  sourceDomain?: string;
  subid?: string;
  clickId?: string;
  adSource?: string;
  keyword?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
  paymentId?: string;
  paymentMethod?: "bank" | "korona" | "card" | "crypto";
}

// Database row type
interface OrderRow {
  id: number;
  order_id: string;
  status: string;
  source: string;
  created_at: Date;
  updated_at: Date;
  customer: string;
  email: string;
  phone: string;
  citizenship: string;
  city: string;
  birth_date: string | null;
  passport_number: string | null;
  plan: string;
  price: string;
  plan_period: string;
  period_start: Date;
  period_end: Date;
  has_passport_photo: boolean;
  passport_photo_url: string | null;
  insurance_pdf_base64: string | null;
  insurance_pdf_name: string | null;
  notes: string | null;
  payment_id: string | null;
  payment_method: string | null;
  locale: string | null;
  payment_option: string | null;
  payment_months: number | null;
  number_of_days: number | null;
  price_per_day: string | null;
}

// Convert database row to Order object
function rowToOrder(row: OrderRow): Order {
  return {
    orderId: row.order_id,
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at?.toISOString(),
    planName: row.plan,
    planPrice: parseFloat(row.price),
    planPricePerDay: row.price_per_day || "",
    numberOfDays: row.number_of_days?.toString() || "",
    planPeriod: row.plan_period,
    periodStart: row.period_start.toISOString().split("T")[0],
    periodEnd: row.period_end.toISOString().split("T")[0],
    citizenship: row.citizenship || "",
    firstNameEng: row.customer.split(" ")[0] || "",
    lastNameEng: row.customer.split(" ").slice(1).join(" ") || "",
    birthDate: row.birth_date || "",
    passportNumber: row.passport_number || "",
    city: row.city || "",
    mobileNumber: row.phone,
    email: row.email,
    locale: row.locale || "en",
    paymentOption: row.payment_option || undefined,
    paymentMonths: row.payment_months?.toString() || undefined,
    passportPhotoBase64: row.has_passport_photo ? row.passport_photo_url || undefined : undefined,
    insurancePdfBase64: row.insurance_pdf_base64 || undefined,
    insurancePdfName: row.insurance_pdf_name || undefined,
    status: row.status as Order["status"],
    notes: row.notes || undefined,
    source: row.source as Order["source"],
    paymentId: row.payment_id || undefined,
    paymentMethod: row.payment_method as Order["paymentMethod"] || undefined,
  };
}

// ============ Public API ============

export async function getOrderById(orderId: string): Promise<Order | undefined> {
  const row = await queryOne<OrderRow>(
    "SELECT * FROM orders WHERE order_id = $1",
    [orderId]
  );
  return row ? rowToOrder(row) : undefined;
}

export async function saveOrder(order: Order): Promise<void> {
  const customer = `${order.firstNameEng} ${order.lastNameEng}`.trim();
  const hasPassportPhoto = !!order.passportPhotoBase64;

  // Check if order exists
  const existing = await queryOne<OrderRow>(
    "SELECT id FROM orders WHERE order_id = $1",
    [order.orderId]
  );

  if (existing) {
    // Update existing order
    await execute(
      `UPDATE orders SET
        status = $1,
        customer = $2,
        email = $3,
        phone = $4,
        citizenship = $5,
        city = $6,
        birth_date = $7,
        passport_number = $8,
        plan_id = $9,
        plan = $10,
        price = $11,
        plan_period = $12,
        period_start = $13,
        period_end = $14,
        has_passport_photo = $15,
        passport_photo_url = $16,
        notes = $17,
        payment_id = $18,
        source = $19,
        source_domain = $20,
        payment_method = $21,
        locale = $22,
        payment_option = $23,
        payment_months = $24,
        number_of_days = $25,
        price_per_day = $26,
        updated_at = NOW()
      WHERE order_id = $27`,
      [
        order.status,
        customer,
        order.email,
        order.mobileNumber,
        order.citizenship,
        order.city,
        order.birthDate || null,
        order.passportNumber || null,
        order.planId || null,
        order.planName,
        order.planPrice,
        order.planPeriod,
        order.periodStart,
        order.periodEnd,
        hasPassportPhoto,
        order.passportPhotoBase64 || null,
        order.notes || null,
        order.paymentId || null,
        order.source,
        order.sourceDomain || null,
        order.paymentMethod || null,
        order.locale || null,
        order.paymentOption || null,
        order.paymentMonths ? parseInt(order.paymentMonths) : null,
        order.numberOfDays ? parseInt(order.numberOfDays) : null,
        order.planPricePerDay ? parseFloat(order.planPricePerDay) : null,
        order.orderId,
      ]
    );
  } else {
    // Insert new order
    await execute(
      `INSERT INTO orders (
        order_id, status, source, source_domain, customer, email, phone, citizenship, city,
        birth_date, passport_number, plan_id,
        plan, price, plan_period, period_start, period_end,
        has_passport_photo, passport_photo_url, notes, payment_id, payment_method,
        locale, payment_option, payment_months, number_of_days, price_per_day,
        subid, click_id, ad_source, utm_source, utm_campaign, utm_term, utm_content
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34)`,
      [
        order.orderId,
        order.status,
        order.source,
        order.sourceDomain || null,
        customer,
        order.email,
        order.mobileNumber,
        order.citizenship,
        order.city,
        order.birthDate || null,
        order.passportNumber || null,
        order.planId || null,
        order.planName,
        order.planPrice,
        order.planPeriod,
        order.periodStart,
        order.periodEnd,
        hasPassportPhoto,
        order.passportPhotoBase64 || null,
        order.notes || null,
        order.paymentId || null,
        order.paymentMethod || null,
        order.locale || null,
        order.paymentOption || null,
        order.paymentMonths ? parseInt(order.paymentMonths) : null,
        order.numberOfDays ? parseInt(order.numberOfDays) : null,
        order.planPricePerDay ? parseFloat(order.planPricePerDay) : null,
        order.subid || null,
        order.clickId || null,
        order.adSource || null,
        order.utmSource || null,
        order.utmCampaign || null,
        order.utmTerm || null,
        order.utmContent || null,
      ]
    );
  }

  console.log(`[OrderStorage] Saved order: ${order.orderId}`);
}

export async function updateOrderPaymentMethod(
  orderId: string,
  paymentMethod: "bank" | "korona" | "card" | "crypto"
): Promise<boolean> {
  const rowCount = await execute(
    "UPDATE orders SET payment_method = $1, updated_at = NOW() WHERE order_id = $2",
    [paymentMethod, orderId]
  );

  if (rowCount > 0) {
    console.log(`[OrderStorage] Updated order ${orderId} payment method to: ${paymentMethod}`);
    return true;
  }

  return false;
}

export async function updateOrderStatus(
  orderId: string,
  status: Order["status"]
): Promise<boolean> {
  const rowCount = await execute(
    "UPDATE orders SET status = $1, updated_at = NOW() WHERE order_id = $2",
    [status, orderId]
  );

  if (rowCount > 0) {
    console.log(`[OrderStorage] Updated order ${orderId} status to: ${status}`);
    return true;
  }

  return false;
}

// Generate order ID with GS- prefix (Georgian Support)
export function generateOrderId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `GS-${timestamp}-${random}`.toUpperCase();
}

// SMS tracking types
export interface OrderSMS {
  id: number;
  orderId: string;
  phone: string;
  message: string;
  locale: string;
  sentAt: string;
  apiResponse: string | null;
  success: boolean;
  errorCode: number | null;
  errorMessage: string | null;
}

// Save SMS record
export async function saveSMSRecord(sms: {
  orderId: string;
  phone: string;
  message: string;
  locale: string;
  apiResponse: string;
  success: boolean;
  errorCode?: number;
  errorMessage?: string;
}): Promise<void> {
  await execute(
    `INSERT INTO order_sms (order_id, phone, message, locale, api_response, success, error_code, error_message)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
    [
      sms.orderId,
      sms.phone,
      sms.message,
      sms.locale,
      sms.apiResponse,
      sms.success,
      sms.errorCode || null,
      sms.errorMessage || null,
    ]
  );
}

// Get SMS records for an order
export async function getOrderSMSRecords(orderId: string): Promise<OrderSMS[]> {
  interface SMSRow {
    id: number;
    order_id: string;
    phone: string;
    message: string;
    locale: string;
    sent_at: Date;
    api_response: string | null;
    success: boolean;
    error_code: number | null;
    error_message: string | null;
  }

  const rows = await query<SMSRow>(
    "SELECT * FROM order_sms WHERE order_id = $1 ORDER BY sent_at DESC",
    [orderId]
  );

  return rows.map((row) => ({
    id: row.id,
    orderId: row.order_id,
    phone: row.phone,
    message: row.message,
    locale: row.locale || "en",
    sentAt: row.sent_at.toISOString(),
    apiResponse: row.api_response,
    success: row.success,
    errorCode: row.error_code,
    errorMessage: row.error_message,
  }));
}
