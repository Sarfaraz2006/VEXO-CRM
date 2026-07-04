// Google Sheets API v4 Integrations using lightweight HTTP fetch

/**
 * Fetch all leads from Google Sheets
 * @param {string} spreadsheetId 
 * @param {string} apiKey 
 * @returns {Promise<Array>}
 */
export async function fetchLeadsFromSheets(spreadsheetId, apiKey) {
  const range = 'Sheet1!A2:L500'; // Fetch up to 500 leads
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=${apiKey}`;
  
  const response = await fetch(url);
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error?.message || 'Failed to fetch from Google Sheets');
  }
  
  const data = await response.json();
  const rows = data.values || [];
  
  // Map rows to Lead objects
  return rows.map((row, index) => ({
    id: row[11] || `sheet_lead_${index + 1}`,
    business_name: row[0] || '',
    phone: row[1] || '',
    address: row[2] || '',
    category: row[3] || '',
    website_status: row[4] || '',
    instagram_handle: row[5] || '',
    priority: row[6] || 'MED',
    outreach_status: row[7] || 'Not Contacted',
    last_contacted: row[8] || '',
    notes: row[9] || '',
    follow_up_date: row[10] || '',
    rowIndex: index + 2 // Row index in sheet (header is row 1, data starts at row 2)
  }));
}

/**
 * Sync all leads to Google Sheets (creates headers and overwrites all values)
 * @param {string} spreadsheetId 
 * @param {string} apiKey 
 * @param {Array} leads 
 */
export async function syncAllLeadsToSheets(spreadsheetId, apiKey, leads) {
  const range = 'Sheet1!A1:L500';
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?valueInputOption=USER_ENTERED&key=${apiKey}`;
  
  const headers = [
    'Business Name', 'Phone', 'Address', 'Category', 'Website Status', 
    'Instagram Handle', 'Priority', 'Outreach Status', 'Last Contacted', 
    'Notes', 'Follow Up Date', 'ID'
  ];
  
  const values = [
    headers,
    ...leads.map(lead => [
      lead.business_name || '',
      lead.phone || '',
      lead.address || '',
      lead.category || '',
      lead.website_status || '',
      lead.instagram_handle || '',
      lead.priority || 'MED',
      lead.outreach_status || 'Not Contacted',
      lead.last_contacted || '',
      lead.notes || '',
      lead.follow_up_date || '',
      lead.id || ''
    ])
  ];
  
  const response = await fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ values })
  });
  
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error?.message || 'Failed to sync to Google Sheets');
  }
}
