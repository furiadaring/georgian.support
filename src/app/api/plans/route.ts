import { NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
});

export interface Plan {
  id: number;
  slug: string;
  name: string;
  price: number;
  netPrice: number | null;
  pricingType: "per_day" | "fixed" | "per_month";
  period: string; // "day", "month", "months3", "months6", "year"
  isActive: boolean;
  sortOrder: number;
  translations: Record<string, { name: string; description: string }>;
}

/**
 * GET /api/plans
 * Public endpoint to fetch all active insurance plans with current prices
 */
export async function GET() {
  try {
    const client = await pool.connect();
    try {
      // Simple query - just get plans with pricing
      const result = await client.query(`
        SELECT
          ip.id,
          ip.slug,
          ip.name,
          ip.pricing_type,
          ip.is_active,
          ip.sort_order,
          (
            SELECT pp.price
            FROM plan_pricing pp
            WHERE pp.plan_id = ip.id
              AND pp.is_active = true
              AND pp.valid_from <= CURRENT_DATE
              AND (pp.valid_to IS NULL OR pp.valid_to >= CURRENT_DATE)
            ORDER BY pp.valid_from DESC
            LIMIT 1
          ) as current_price
        FROM insurance_plans ip
        WHERE ip.is_active = true
        ORDER BY ip.sort_order, ip.id
      `);

      // Map to response format
      const plans: Plan[] = result.rows.map((row) => {
        // Derive period from pricing_type and slug
        let period = "day";
        if (row.pricing_type === "per_day") {
          period = "day";
        } else if (row.pricing_type === "per_month") {
          period = "month";
        } else {
          // Fixed pricing - determine from slug
          const slugLower = row.slug.toLowerCase();
          if (slugLower.includes("standard")) {
            period = "months3";
          } else if (slugLower.includes("optimum")) {
            period = "months6";
          } else if (slugLower.includes("premium")) {
            period = "year";
          }
        }

        return {
          id: row.id,
          slug: row.slug,
          name: row.name,
          price: parseFloat(row.current_price) || 0,
          netPrice: null,
          pricingType: row.pricing_type,
          period,
          isActive: row.is_active,
          sortOrder: row.sort_order,
          translations: {},
        };
      });

      return NextResponse.json({ plans });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Error fetching plans:", error);
    return NextResponse.json({ error: "Failed to fetch plans", details: String(error) }, { status: 500 });
  }
}
