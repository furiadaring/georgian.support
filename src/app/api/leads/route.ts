import { NextRequest, NextResponse } from "next/server";
import { query, execute } from "@/lib/db";

// Ensure leads table exists
async function ensureLeadsTable() {
  try {
    await execute(`
      CREATE TABLE IF NOT EXISTS leads (
        id SERIAL PRIMARY KEY,
        lead_type VARCHAR(50),
        source_domain VARCHAR(255),
        subid VARCHAR(255),
        click_id VARCHAR(255),
        campaign VARCHAR(255),
        ad_source VARCHAR(255),
        keyword VARCHAR(255),
        landing_page TEXT,
        referrer TEXT,
        utm_source VARCHAR(255),
        utm_medium VARCHAR(255),
        utm_campaign VARCHAR(255),
        utm_term VARCHAR(255),
        utm_content VARCHAR(255),
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);
  } catch (e) {
    // Table might already exist or we don't have permissions - that's ok
    console.log("Could not create leads table:", e);
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Try to create table if needed
    await ensureLeadsTable();
    
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
