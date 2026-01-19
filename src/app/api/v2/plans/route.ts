import { NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
});

// Disable all caching
export const dynamic = "force-dynamic";
export const revalidate = 0;

/**
 * GET /api/v2/plans
 * Public endpoint - returns plans with pricing, discounts, features, coverage, translations
 */
export async function GET() {
  const client = await pool.connect();
  try {
    // Main plans query with pricing and discounts
    const plansResult = await client.query(`
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
        ic.id as category_id,
        ic.slug as category_slug,
        pt.label_ru as period_label,
        (
          SELECT json_build_object(
            'id', pp.id,
            'price', pp.price,
            'valid_from', pp.valid_from,
            'valid_to', pp.valid_to
          )
          FROM plan_pricing pp
          WHERE pp.plan_id = ip.id
            AND pp.is_active = true
            AND pp.valid_from <= CURRENT_DATE
            AND (pp.valid_to IS NULL OR pp.valid_to >= CURRENT_DATE)
          ORDER BY pp.valid_from DESC
          LIMIT 1
        ) as current_pricing,
        (
          SELECT json_build_object(
            'id', pd.id,
            'discount_type', pd.discount_type,
            'discount_value', pd.discount_value,
            'valid_from', pd.valid_from,
            'valid_to', pd.valid_to
          )
          FROM plan_discounts pd
          WHERE pd.plan_id = ip.id
            AND pd.is_active = true
            AND pd.valid_from <= CURRENT_DATE
            AND (pd.valid_to IS NULL OR pd.valid_to >= CURRENT_DATE)
          ORDER BY pd.valid_from DESC
          LIMIT 1
        ) as current_discount
      FROM insurance_plans ip
      LEFT JOIN insurance_categories ic ON ip.category_id = ic.id
      LEFT JOIN pricing_types pt ON ip.pricing_type = pt.code
      WHERE ip.is_active = true
      ORDER BY ip.sort_order, ip.id
    `);

    // Get translations for all plans
    const translationsResult = await client.query(`
      SELECT plan_id, locale, name, description
      FROM plan_translations
    `);

    // Build translations map
    const translationsMap = new Map<number, Record<string, { name: string; description: string }>>();
    for (const row of translationsResult.rows) {
      if (!translationsMap.has(row.plan_id)) {
        translationsMap.set(row.plan_id, {});
      }
      translationsMap.get(row.plan_id)![row.locale] = {
        name: row.name,
        description: row.description || "",
      };
    }

    // Get features for all plans from category_features + plan_feature_links
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

    // Build features map
    const featuresMap = new Map<number, Array<{
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
    }>>();

    for (const row of featuresResult.rows) {
      if (!featuresMap.has(row.plan_id)) {
        featuresMap.set(row.plan_id, []);
      }
      featuresMap.get(row.plan_id)!.push({
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

    // Get coverage items for all plans from category_coverage_items + plan_coverage_links
    const coverageResult = await client.query(`
      SELECT 
        pcl.plan_id,
        cci.id,
        cci.icon,
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

    // Build coverage map
    const coverageMap = new Map<number, Array<{
      id: number;
      icon: string;
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
    }>>();

    for (const row of coverageResult.rows) {
      if (!coverageMap.has(row.plan_id)) {
        coverageMap.set(row.plan_id, []);
      }
      coverageMap.get(row.plan_id)!.push({
        id: row.id,
        icon: row.icon,
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

    // Transform plans - same logic as admin Preview getPriceDisplay()
    const plans = plansResult.rows.map((row) => {
      // Get base price
      const basePrice = row.current_pricing?.price ? parseFloat(row.current_pricing.price) : 0;
      
      // Calculate final price with discount (same as getPriceDisplay in admin)
      let finalPrice = basePrice;
      let originalPrice: number | null = null;
      let discountPercent: number | null = null;
      let discountFixed: number | null = null;

      if (row.current_discount) {
        const discount = row.current_discount;
        if (discount.discount_type === 'percentage' && discount.discount_value) {
          discountPercent = parseFloat(discount.discount_value);
          finalPrice = Math.round(basePrice * (1 - discountPercent / 100));
          originalPrice = basePrice;
        } else if (discount.discount_type === 'fixed' && discount.discount_value) {
          discountFixed = parseFloat(discount.discount_value);
          finalPrice = basePrice - discountFixed;
          originalPrice = basePrice;
        }
      }

      // Derive period from pricing_type and slug
      let period = "day";
      if (row.pricing_type === "per_day") {
        period = "day";
      } else if (row.pricing_type === "per_month") {
        period = "month";
      } else {
        const slugLower = row.slug.toLowerCase();
        if (slugLower.includes("standard")) period = "months3";
        else if (slugLower.includes("optimum")) period = "months6";
        else if (slugLower.includes("premium")) period = "year";
      }

      // Get translations for this plan - build object with ru as fallback
      const planTranslations = translationsMap.get(row.id) || {};
      // Add Russian from main table as fallback
      if (!planTranslations.ru) {
        planTranslations.ru = {
          name: row.name,
          description: row.description_ru || "",
        };
      }

      return {
        id: row.id,
        slug: row.slug,
        name: row.name,
        descriptionRu: row.description_ru || "",
        descriptionEn: row.description_en || "",
        descriptionKa: row.description_ka || "",
        descriptionUk: row.description_uk || "",
        descriptionTr: row.description_tr || "",
        descriptionHe: row.description_he || "",
        descriptionAr: row.description_ar || "",
        subtitleRu: row.subtitle_ru || "",
        subtitleEn: row.subtitle_en || "",
        subtitleKa: row.subtitle_ka || "",
        subtitleUk: row.subtitle_uk || "",
        subtitleTr: row.subtitle_tr || "",
        subtitleHe: row.subtitle_he || "",
        subtitleAr: row.subtitle_ar || "",
        isFavorite: row.is_favorite || false,
        isLegalCompliant: row.is_legal_compliant !== false,
        price: finalPrice,
        originalPrice,
        discountPercent,
        discountFixed,
        pricingType: row.pricing_type,
        period,
        periodLabel: row.period_label || "период",
        categorySlug: row.category_slug,
        isActive: row.is_active,
        sortOrder: row.sort_order,
        translations: planTranslations,
        features: featuresMap.get(row.id) || [],
        coverageItems: coverageMap.get(row.id) || [],
        currentDiscount: row.current_discount,
      };
    });

    return NextResponse.json({ plans });
  } catch (error) {
    console.error("Error fetching plans:", error);
    return NextResponse.json(
      { error: "Failed to fetch plans", details: String(error) },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
