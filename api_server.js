import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const DB_PATH = '/root/vexo-office/database/crm_leads.json';
const PORT = 3002;

function readLeads() {
  try {
    if (!fs.existsSync(DB_PATH)) {
      fs.writeFileSync(DB_PATH, JSON.stringify([], null, 2));
      return [];
    }
    const data = fs.readFileSync(DB_PATH, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading DB:', err);
    return [];
  }
}

function saveLeads(leads) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(leads, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error('Error saving DB:', err);
    return false;
  }
}

const server = http.createServer((req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const url = new URL(req.url, `http://${req.headers.host}`);

  // GET /api/leads
  if (req.method === 'GET' && url.pathname === '/api/leads') {
    const leads = readLeads();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(leads));
    return;
  }

  // GET /api/stats
  if (req.method === 'GET' && url.pathname === '/api/stats') {
    const leads = readLeads();
    const total = leads.length;
    const newLeads = leads.filter(l => (l.outreach_status || 'New').toLowerCase() === 'new' || (l.outreach_status || '').toLowerCase() === 'not contacted').length;
    const outreached = leads.filter(l => (l.outreach_status || '').toLowerCase() === 'outreached' || (l.outreach_status || '').toLowerCase() === 'contacted').length;
    const qualified = leads.filter(l => (l.outreach_status || '').toLowerCase() === 'qualified').length;
    const closed = leads.filter(l => (l.outreach_status || '').toLowerCase() === 'closed').length;

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      total,
      newLeads,
      outreached,
      qualified,
      closed,
      conversionRate: total > 0 ? ((closed / total) * 100).toFixed(1) + '%' : '0%'
    }));
    return;
  }

  // POST /api/leads
  if (req.method === 'POST' && url.pathname === '/api/leads') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const newLead = JSON.parse(body);
        const leads = readLeads();
        if (!newLead.id) {
          newLead.id = `lead_${Date.now()}`;
        }
        newLead.scraped_at = newLead.scraped_at || new Date().toISOString();
        newLead.outreach_status = newLead.outreach_status || 'New';
        newLead.instagram_handle = newLead.instagram_handle || '';
        newLead.facebook_url = newLead.facebook_url || '';
        newLead.google_maps_url = newLead.google_maps_url || '';
        
        leads.unshift(newLead);
        saveLeads(leads);

        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, lead: newLead }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid JSON payload' }));
      }
    });
    return;
  }

  // PUT /api/leads/:id
  if (req.method === 'PUT' && url.pathname.startsWith('/api/leads/')) {
    const id = url.pathname.replace('/api/leads/', '');
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const updates = JSON.parse(body);
        const leads = readLeads();
        const index = leads.findIndex(l => String(l.id) === String(id));
        if (index === -1) {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Lead not found' }));
          return;
        }

        leads[index] = { ...leads[index], ...updates, updated_at: new Date().toISOString() };
        saveLeads(leads);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, lead: leads[index] }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid payload' }));
      }
    });
    return;
  }

  // DELETE /api/leads/:id
  if (req.method === 'DELETE' && url.pathname.startsWith('/api/leads/')) {
    const id = url.pathname.replace('/api/leads/', '');
    let leads = readLeads();
    const initialLen = leads.length;
    leads = leads.filter(l => String(l.id) !== String(id));

    if (leads.length === initialLen) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Lead not found' }));
      return;
    }

    saveLeads(leads);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: true }));
    return;
  }

  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Not Found' }));
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`VEXO CRM API Server running on port ${PORT}`);
});
