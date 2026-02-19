import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Insert lead into database
    const result = await query(
      `INSERT INTO leads (
        lead_type, source_domain, subid, click_id, campaign, 
        ad_source, keyword, landing_page, referrer,
        utm_source, utm_medium, utm_campaign, utm_term, utm_content,
        created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, NOW())
      RETURNING id`,
      [
        data.lead_type || 'unknown',
        data.source_domain || '',
        data.subid || '',
        data.click_id || '',
        data.campaign || '',
        data.ad_source || '',
        data.keyword || '',
        data.landing_page || '',
        data.referrer || '',
        data.utm_source || '',
        data.utm_medium || '',
        data.utm_campaign || '',
        data.utm_term || '',
        data.utm_content || '',
      ]
    );

    return NextResponse.json({ 
      success: true, 
      id: (result as any)[0]?.id 
    });
  } catch (error) {
    console.error("Failed to save lead:", error);
    // Return success anyway to not block the user
    return NextResponse.json({ success: true });
  }
}
