import { NextRequest, NextResponse } from "next/server";
import { query, execute } from "@/lib/db";

// Ensure leads table exists with all columns
async function ensureLeadsTable() {
  try {
    await execute(`
      CREATE TABLE IF NOT EXISTS leads (
        id SERIAL PRIMARY KEY,
        lead_type VARCHAR(50),
        source_domain VARCHAR(255),
        name VARCHAR(255),
        phone VARCHAR(50),
        email VARCHAR(255),
        message TEXT,
        plan_interest VARCHAR(100),
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
    
    // Add columns if they don't exist (for existing tables)
    await execute(`ALTER TABLE leads ADD COLUMN IF NOT EXISTS name VARCHAR(255)`);
    await execute(`ALTER TABLE leads ADD COLUMN IF NOT EXISTS phone VARCHAR(50)`);
    await execute(`ALTER TABLE leads ADD COLUMN IF NOT EXISTS email VARCHAR(255)`);
    await execute(`ALTER TABLE leads ADD COLUMN IF NOT EXISTS message TEXT`);
    await execute(`ALTER TABLE leads ADD COLUMN IF NOT EXISTS plan_interest VARCHAR(100)`);
  } catch (e) {
    // Table might already exist or we don't have permissions - that's ok
    console.log("Could not create/update leads table:", e);
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Try to create/update table if needed
    await ensureLeadsTable();
    
    // Insert lead into database
    const result = await query(
      `INSERT INTO leads (
        lead_type, source_domain, name, phone, email, message, plan_interest,
        subid, click_id, campaign, ad_source, keyword, landing_page, referrer,
        utm_source, utm_medium, utm_campaign, utm_term, utm_content,
        created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, NOW())
      RETURNING id`,
      [
        data.lead_type || 'unknown',
        data.source_domain || '',
        data.name || '',
        data.phone || '',
        data.email || '',
        data.message || '',
        data.plan_interest || '',
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
