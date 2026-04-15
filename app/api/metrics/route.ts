import { NextResponse } from 'next/server';
import { FacebookAdsApi, AdAccount } from 'facebook-nodejs-business-sdk';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const campaignId = searchParams.get('campaignId');
  const accessToken = process.env.FACEBOOK_ACCESS_TOKEN;
  const accountId = process.env.AD_ACCOUNT_ID;

  if (!accessToken || !accountId) return NextResponse.json({ error: 'Faltan credenciales' }, { status: 500 });
  
  FacebookAdsApi.init(accessToken);
  const account = new AdAccount(accountId);

  try {
    if (campaignId) {
      const adInsights = await account.getInsights(
        ['ad_name', 'spend', 'reach', 'inline_link_clicks', 'actions'],
        { 
          time_range: { 'since': '2026-04-01', 'until': '2026-04-15' },
          level: 'ad',
          filtering: [{ field: 'campaign.id', operator: 'IN', value: [campaignId] }]
        }
      );
      return NextResponse.json(adInsights);
    } else {
      const campaigns = await account.getInsights(
        ['campaign_id', 'campaign_name', 'spend', 'reach', 'inline_link_clicks', 'inline_link_click_ctr', 'frequency', 'cost_per_inline_link_click', 'actions'],
        { time_range: { 'since': '2026-04-01', 'until': '2026-04-15' }, level: 'campaign' }
      );
      return NextResponse.json(campaigns);
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error de conexión' }, { status: 401 });
  }
}
