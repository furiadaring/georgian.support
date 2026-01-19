import { NextResponse } from "next/server";
import { Pool } from "pg";

// Force dynamic rendering - no caching
export const dynamic = "force-dynamic";
export const revalidate = 0;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
});

export interface PlanFeature {
  id: number;
  featureKey: string;
  nameRu: string;
  nameEn: string | null;
  nameKa: string | null;
  nameUk: string | null;
  nameTr: string | null;
  nameHe: string | null;
  nameAr: string | null;
  sortOrder: number;
}

export interface CoverageItem {
  id: number;
  coverageKey: string;
  titleRu: string;
  titleEn: string | null;
  titleKa: string | null;
  titleUk: string | null;
  titleTr: string | null;
  titleHe: string | null;
  titleAr: string | null;
  limitRu: string | null;
  limitEn: string | null;
  limitKa: string | null;
  limitUk: string | null;
  limitTr: string | null;
  limitHe: string | null;
  limitAr: string | null;
  sortOrder: number;
}

export interface Plan {
  id: number;
  slug: string;
  name: string;
  descriptionRu: string;
  descriptionEn: string | null;
  descriptionKa: string | null;
  descriptionUk: string | null;
  descriptionTr: string | null;
  descriptionHe: string | null;
  descriptionAr: string | null;
  subtitleRu: string | null;
  subtitleEn: string | null;
  subtitleKa: string | null;
  subtitleUk: string | null;
  subtitleTr: string | null;
  subtitleHe: string | null;
  subtitleAr: string | null;
  price: number;
  originalPrice: number | null;
  discountPercent: number | null;
  discountFixed: number | null;
  netPrice: number | null;
  pricingType: "per_day" | "fixed" | "per_month";
  period: string;
  periodLabel: string;
  isFavorite: boolean;
  isLegalCompliant: boolean;
  isActive: boolean;
  sortOrder: number;
  categorySlug: string | null;
  translations: Record<string, { name: string; description: string }>;
  features: PlanFeature[];
  coverageItems: CoverageItem[];
}

/**
 * GET /api/v2/plans
 * Extended endpoint with full plan data including features, coverage, and translations
 */
export async function GET() {
  try {
    const client = await pool.connect();
    try {
      // Main query with pricing, discounts, net prices, and category info
      const result = await client.query(`
        SELECT
          ip.id,
          ip.slug,
          ip.name,
          ip.description_ru,
          ip.description_en,
          ip.description_ka,
          ip.description_uk,
          ip.description_tr,
          ip.description_he,
          ip.description_ar,
          ip.subtitle_ru,
          ip.subtitle_en,
          ip.subtitle_ka,
          ip.subtitle_uk,
          ip.subtitle_tr,
          ip.subtitle_he,
          ip.subtitle_ar,
          ip.is_favorite,
          ip.is_legal_compliant,
          ip.pricing_type,
          ip.is_active,
          ip.sort_order,
          ic.slug as category_slug,
          pt.label_ru as pricing_type_label,
          (
            SELECT pp.price
            FROM plan_pricing pp
            WHERE pp.plan_id = ip.id
              AND pp.is_active = true
              AND pp.valid_from <= CURRENT_DATE
              AND (pp.valid_to IS NULL OR pp.valid_to >= CURRENT_DATE)
            ORDER BY pp.valid_from DESC
            LIMIT 1
          ) as current_price,
          (
            SELECT pd.discount_type
            FROM plan_discounts pd
            WHERE pd.plan_id = ip.id
              AND pd.is_active = true
              AND pd.valid_from <= CURRENT_DATE
              AND (pd.valid_to IS NULL OR pd.valid_to >= CURRENT_DATE)
            ORDER BY pd.valid_from DESC
            LIMIT 1
          ) as discount_type,
          (
            SELECT pd.discount_value
            FROM plan_discounts pd
            WHERE pd.plan_id = ip.id
              AND pd.is_active = true
              AND pd.valid_from <= CURRENT_DATE
              AND (pd.valid_to IS NULL OR pd.valid_to >= CURRENT_DATE)
            ORDER BY pd.valid_from DESC
            LIMIT 1
          ) as discount_value,
          (
            SELECT pnp.net_price
            FROM plan_net_prices pnp
            WHERE pnp.plan_id = ip.id
              AND pnp.is_active = true
              AND pnp.valid_from <= CURRENT_DATE
              AND (pnp.valid_to IS NULL OR pnp.valid_to >= CURRENT_DATE)
            ORDER BY pnp.valid_from DESC
            LIMIT 1
          ) as net_price
        FROM insurance_plans ip
        LEFT JOIN pricing_types pt ON ip.pricing_type = pt.code
        LEFT JOIN insurance_categories ic ON ip.category_id = ic.id
        WHERE ip.is_active = true
        ORDER BY ip.sort_order, ip.id
      `);

      // Features query - links plans to category features
      const featuresResult = await client.query(`
        SELECT
          pfl.plan_id,
          cf.id,
          cf.feature_key,
          cf.name_ru,
          cf.name_en,
          cf.name_ka,
          cf.name_uk,
          cf.name_tr,
          cf.name_he,
          cf.name_ar,
          COALESCE(pfl.sort_order, cf.sort_order) as sort_order
        FROM plan_feature_links pfl
        JOIN category_features cf ON pfl.feature_id = cf.id
        WHERE pfl.is_enabled = true
        ORDER BY pfl.plan_id, sort_order
      `);

      // Coverage query - links plans to coverage items with custom limits
      const coverageResult = await client.query(`
        SELECT
          pcl.plan_id,
          cci.id,
          cci.icon as coverage_key,
          cci.title_ru,
          cci.title_en,
          cci.title_ka,
          cci.title_uk,
          cci.title_tr,
          cci.title_he,
          cci.title_ar,
          COALESCE(pcl.custom_limit_ru, cci.default_limit_ru) as limit_ru,
          COALESCE(pcl.custom_limit_en, cci.default_limit_en) as limit_en,
          COALESCE(pcl.custom_limit_ka, cci.default_limit_ka) as limit_ka,
          COALESCE(pcl.custom_limit_uk, cci.default_limit_uk) as limit_uk,
          COALESCE(pcl.custom_limit_tr, cci.default_limit_tr) as limit_tr,
          COALESCE(pcl.custom_limit_he, cci.default_limit_he) as limit_he,
          COALESCE(pcl.custom_limit_ar, cci.default_limit_ar) as limit_ar,
          COALESCE(pcl.sort_order, cci.sort_order) as sort_order
        FROM plan_coverage_links pcl
        JOIN category_coverage_items cci ON pcl.coverage_id = cci.id
        WHERE pcl.is_enabled = true
        ORDER BY pcl.plan_id, sort_order
      `);

      // Translations query
      const translationsResult = await client.query(`
        SELECT plan_id, locale, name, description
        FROM plan_translations
        ORDER BY plan_id, locale
      `);

      // Build features map
      const featuresMap = new Map<number, PlanFeature[]>();
      for (const row of featuresResult.rows) {
        const planId = row.plan_id;
        if (!featuresMap.has(planId)) {
          featuresMap.set(planId, []);
        }
        featuresMap.get(planId)!.push({
          id: row.id,
          featureKey: row.feature_key,
          nameRu: row.name_ru,
          nameEn: row.name_en,
          nameKa: row.name_ka,
          nameUk: row.name_uk,
          nameTr: row.name_tr,
          nameHe: row.name_he,
          nameAr: row.name_ar,
          sortOrder: row.sort_order,
        });
      }

      // Build coverage map
      const coverageMap = new Map<number, CoverageItem[]>();
      for (const row of coverageResult.rows) {
        const planId = row.plan_id;
        if (!coverageMap.has(planId)) {
          coverageMap.set(planId, []);
        }
        coverageMap.get(planId)!.push({
          id: row.id,
          coverageKey: row.coverage_key,
          titleRu: row.title_ru,
          titleEn: row.title_en,
          titleKa: row.title_ka,
          titleUk: row.title_uk,
          titleTr: row.title_tr,
          titleHe: row.title_he,
          titleAr: row.title_ar,
          limitRu: row.limit_ru,
          limitEn: row.limit_en,
          limitKa: row.limit_ka,
          limitUk: row.limit_uk,
          limitTr: row.limit_tr,
          limitHe: row.limit_he,
          limitAr: row.limit_ar,
          sortOrder: row.sort_order,
        });
      }

      // Build translations map
      const translationsMap = new Map<number, Record<string, { name: string; description: string }>>();
      for (const row of translationsResult.rows) {
        const planId = row.plan_id;
        if (!translationsMap.has(planId)) {
          translationsMap.set(planId, {});
        }
        translationsMap.get(planId)![row.locale] = {
          name: row.name,
          description: row.description,
        };
      }

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

        // Calculate original price and discount info
        const currentPrice = parseFloat(row.current_price) || 0;
        let originalPrice: number | null = null;
        let discountPercent: number | null = null;
        let discountFixed: number | null = null;

        if (row.discount_type && row.discount_value) {
          const discountValue = parseFloat(row.discount_value);
          if (row.discount_type === "percentage") {
            discountPercent = discountValue;
            originalPrice = Math.round(currentPrice / (1 - discountValue / 100));
          } else if (row.discount_type === "fixed") {
            discountFixed = discountValue;
            originalPrice = currentPrice + discountValue;
          }
        }

        return {
          id: row.id,
          slug: row.slug,
          name: row.name,
          descriptionRu: row.description_ru || "",
          descriptionEn: row.description_en,
          descriptionKa: row.description_ka,
          descriptionUk: row.description_uk,
          descriptionTr: row.description_tr,
          descriptionHe: row.description_he,
          descriptionAr: row.description_ar,
          subtitleRu: row.subtitle_ru,
          subtitleEn: row.subtitle_en,
          subtitleKa: row.subtitle_ka,
          subtitleUk: row.subtitle_uk,
          subtitleTr: row.subtitle_tr,
          subtitleHe: row.subtitle_he,
          subtitleAr: row.subtitle_ar,
          price: currentPrice,
          originalPrice,
          discountPercent,
          discountFixed,
          netPrice: row.net_price ? parseFloat(row.net_price) : null,
          pricingType: row.pricing_type,
          period,
          periodLabel: row.pricing_type_label || period,
          isFavorite: row.is_favorite || false,
          isLegalCompliant: row.is_legal_compliant || false,
          isActive: row.is_active,
          sortOrder: row.sort_order,
          categorySlug: row.category_slug,
          translations: translationsMap.get(row.id) || {},
          features: featuresMap.get(row.id) || [],
          coverageItems: coverageMap.get(row.id) || [],
        };
      });

      return NextResponse.json({ plans });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Error fetching plans:", error);
    return NextResponse.json(
      { error: "Failed to fetch plans", details: String(error) },
      { status: 500 }
    );
  }
}
