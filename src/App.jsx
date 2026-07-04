import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  Settings, 
  Database, 
  FileSpreadsheet, 
  TrendingUp, 
  Users, 
  CheckCircle2, 
  MessageSquare, 
  Calendar, 
  Phone, 
  MapPin, 
  Globe, 
  X, 
  ChevronDown, 
  Download, 
  Upload, 
  AlertCircle, 
  ExternalLink, 
  RefreshCw,
  Copy,
  Check,
  Building2,
  Trash2,
  Sun,
  Moon,
  FileText,
  DollarSign
} from 'lucide-react';

// Custom inline brand icon for Instagram since Lucide-react deprecated brand icons
const Instagram = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

import { AnimatePresence, motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  LabelList
} from 'recharts';
import seedLeadsData from './seedLeads.json';
import { fetchLeadsFromSheets, syncAllLeadsToSheets } from './googleSheets';

// Priority Styles
const PRIORITY_STYLES = {
  HIGH: {
    bg: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    dot: 'bg-rose-400',
  },
  MED: {
    bg: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    dot: 'bg-amber-400',
  },
  LOW: {
    bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    dot: 'bg-emerald-400',
  }
};

// Outreach Status Styles
const STATUS_STYLES = {
  'Not Contacted': 'bg-slate-500/10 text-slate-400 border-slate-500/15',
  'Messaged': 'bg-blue-500/10 text-blue-400 border-blue-500/15',
  'Replied': 'bg-indigo-500/10 text-indigo-400 border-indigo-500/15',
  'Interested': 'bg-violet-500/10 text-violet-400 border-violet-500/15',
  'Not Interested': 'bg-zinc-700/20 text-zinc-500 border-zinc-700/30',
  'Closed Won': 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25',
  'Closed Lost': 'bg-rose-500/10 text-rose-400 border-rose-500/15'
};

const STATUS_OPTIONS = [
  'Not Contacted',
  'Messaged',
  'Replied',
  'Interested',
  'Not Interested',
  'Closed Won',
  'Closed Lost'
];

// --- RECHARTS CUSTOM COMPONENTS & TOOLTIPS ---
const CustomRevenueTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-slate-900/95 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-200 p-3 rounded-xl shadow-2xl backdrop-blur-md">
        <p className="text-[10px] text-slate-500 font-mono">{label}</p>
        <p className="text-sm font-bold text-emerald-400 mt-1">
          ${payload[0].value.toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
};

const CustomPieTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-slate-900/95 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-200 p-2.5 rounded-xl shadow-2xl backdrop-blur-md text-xs">
        <p className="font-semibold text-slate-200">{payload[0].name}</p>
        <p className="font-mono text-indigo-400 mt-1">
          {payload[0].value} leads ({Math.round(payload[0].payload.percentage)}%)
        </p>
      </div>
    );
  }
  return null;
};

const CustomBarTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-slate-900/95 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-200 p-2.5 rounded-xl shadow-2xl backdrop-blur-md text-xs">
        <p className="font-semibold text-slate-200">{payload[0].name}</p>
        <p className="font-mono text-indigo-400 mt-1">
          {payload[0].value} leads ({payload[0].payload.percentage}%)
        </p>
      </div>
    );
  }
  return null;
};

const COLORS = ['#5f5af6', '#9d4edd', '#ec4899', '#f43f5e', '#64748b'];

export default function App() {
  // --- STATE ---
  const [leads, setLeads] = useState(() => {
    const local = localStorage.getItem('leads_crm_data');
    if (local) {
      try { return JSON.parse(local); } catch (e) { console.error(e); }
    }
    return seedLeadsData;
  });

  const [syncConfig, setSyncConfig] = useState(() => {
    const local = localStorage.getItem('leads_crm_sync_config');
    if (local) {
      try {
        return JSON.parse(local);
      } catch (e) {
        console.error(e);
      }
    }
    return {
      mode: 'local', // 'local' or 'sheets'
      sheetId: '',
      apiKey: '',
    };
  });

  // UI state
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterCategory, setFilterCategory] = useState('All');
  const [sortBy, setSortBy] = useState('business_name'); // 'business_name', 'priority', 'last_contacted'
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' or 'desc'
  const [activeTab, setActiveTab] = useState('leads'); // 'leads' or 'analytics'
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved ? saved === 'dark' : true;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const [selectedLead, setSelectedLead] = useState(null);
  const [isAddLeadOpen, setIsAddLeadOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const [projects, setProjects] = useState(() => {
    const local = localStorage.getItem('leads_crm_projects');
    if (local) {
      try { return JSON.parse(local); } catch (e) { console.error(e); }
    }
    return [];
  });
  const [isAddProjectOpen, setIsAddProjectOpen] = useState(false);
  const [newProjectForm, setNewProjectForm] = useState({
    client_name: '',
    project_name: '',
    status: 'Not Started',
    start_date: new Date().toISOString().split('T')[0],
    deadline: '',
    notes: ''
  });

  const [invoices, setInvoices] = useState(() => {
    const local = localStorage.getItem('leads_crm_invoices');
    if (local) {
      try { return JSON.parse(local); } catch (e) { console.error(e); }
    }
    return [];
  });
  const [isAddInvoiceOpen, setIsAddInvoiceOpen] = useState(false);
  const [newInvoiceForm, setNewInvoiceForm] = useState({
    client_name: '',
    project_id: '',
    amount: '',
    currency: 'USD',
    status: 'Draft',
    due_date: '',
  });
  
  // Settings Inputs
  const [tempSheetId, setTempSheetId] = useState(syncConfig.sheetId);
  const [tempApiKey, setTempApiKey] = useState(syncConfig.apiKey);
  const [tempMode, setTempMode] = useState(syncConfig.mode);

  // New Lead Form State
  const [newLeadForm, setNewLeadForm] = useState({
    business_name: '',
    phone: '',
    address: '',
    category: '',
    website_status: 'Needs Redesign',
    instagram_handle: '',
    priority: 'MED',
    outreach_status: 'Not Contacted',
    notes: ''
  });

  // Feedback states
  const [syncing, setSyncing] = useState(false);
  const [syncError, setSyncError] = useState('');
  const [copiedId, setCopiedId] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  // Save to LocalStorage whenever leads or sync config changes
  useEffect(() => {
    localStorage.setItem('leads_crm_data', JSON.stringify(leads));
  }, [leads]);

  useEffect(() => {
    localStorage.setItem('leads_crm_projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('leads_crm_invoices', JSON.stringify(invoices));
  }, [invoices]);

  useEffect(() => {
    localStorage.setItem('leads_crm_sync_config', JSON.stringify(syncConfig));
  }, [syncConfig]);

  // Toast Helper
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // --- GOOGLE SHEETS SYNC SYNC ---
  const syncWithGoogleSheets = async (configToUse = syncConfig) => {
    if (configToUse.mode !== 'sheets') return;
    if (!configToUse.sheetId || !configToUse.apiKey) {
      setSyncError('Google Sheet ID aur API Key set karein.');
      return;
    }

    setSyncing(true);
    setSyncError('');
    try {
      // Sync local leads to sheets (overwriting/writing)
      await syncAllLeadsToSheets(configToUse.sheetId, configToUse.apiKey, leads);
      showToast('✅ Google Sheets synced successfully!');
    } catch (err) {
      console.error(err);
      setSyncError(err.message || 'Sync failed. Check credentials/permissions.');
    } finally {
      setSyncing(false);
    }
  };

  const fetchFromGoogleSheets = async () => {
    if (!syncConfig.sheetId || !syncConfig.apiKey) {
      setSyncError('Google Sheet ID aur API Key required hain.');
      return;
    }

    setSyncing(true);
    setSyncError('');
    try {
      const fetched = await fetchLeadsFromSheets(syncConfig.sheetId, syncConfig.apiKey);
      if (fetched && fetched.length > 0) {
        setLeads(fetched);
        showToast('📥 Google Sheets content imported!');
      } else {
        showToast('💡 Google Sheet is empty or invalid.');
      }
    } catch (err) {
      console.error(err);
      setSyncError(err.message || 'Import failed. Check credentials/permissions.');
    } finally {
      setSyncing(false);
    }
  };

  // --- STATS COMPUTATION ---
  const stats = useMemo(() => {
    const total = leads.length;
    const contacted = leads.filter(l => l.outreach_status !== 'Not Contacted').length;
    const replied = leads.filter(l => ['Replied', 'Interested', 'Closed Won', 'Closed Lost'].includes(l.outreach_status)).length;
    const won = leads.filter(l => l.outreach_status === 'Closed Won').length;

    const contactedPct = total > 0 ? Math.round((contacted / total) * 100) : 0;
    const repliedPct = contacted > 0 ? Math.round((replied / contacted) * 100) : 0;
    const wonPct = total > 0 ? Math.round((won / total) * 100) : 0;

    return { total, contacted, contactedPct, replied, repliedPct, won, wonPct };
  }, [leads]);

  // --- UNIQUE CATEGORIES ---
  const categories = useMemo(() => {
    const cats = new Set(leads.map(l => l.category).filter(Boolean));
    return ['All', ...Array.from(cats)];
  }, [leads]);

  // --- FILTER & SORT LEADS ---
  const filteredLeads = useMemo(() => {
    return leads
      .filter(lead => {
        // Search term matching
        const search = searchTerm.toLowerCase();
        const matchesSearch = 
          lead.business_name.toLowerCase().includes(search) ||
          lead.phone.toLowerCase().includes(search) ||
          lead.address.toLowerCase().includes(search) ||
          lead.category.toLowerCase().includes(search) ||
          (lead.instagram_handle && lead.instagram_handle.toLowerCase().includes(search));

        const matchesPriority = filterPriority === 'All' || lead.priority === filterPriority;
        const matchesStatus = filterStatus === 'All' || lead.outreach_status === filterStatus;
        const matchesCategory = filterCategory === 'All' || lead.category === filterCategory;

        return matchesSearch && matchesPriority && matchesStatus && matchesCategory;
      })
      .sort((a, b) => {
        let valA = a[sortBy] || '';
        let valB = b[sortBy] || '';

        // Priority sorting logic
        if (sortBy === 'priority') {
          const weight = { HIGH: 3, MED: 2, LOW: 1 };
          valA = weight[a.priority] || 0;
          valB = weight[b.priority] || 0;
        }

        if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
        if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
  }, [leads, searchTerm, filterPriority, filterStatus, filterCategory, sortBy, sortOrder]);

  // --- INVOICES COMPUTATIONS ---
  const invoiceStats = useMemo(() => {
    const outstanding = invoices
      .filter(inv => inv.status !== 'Paid')
      .reduce((sum, inv) => sum + parseFloat(inv.amount || 0), 0);

    const paidThisMonth = invoices
      .filter(inv => {
        if (inv.status !== 'Paid') return false;
        const dateStr = inv.created_date || ''; // YYYY-MM-DD
        if (!dateStr) return false;
        const [year, month] = dateStr.split('-');
        const now = new Date();
        const curYear = now.getFullYear().toString();
        const curMonth = (now.getMonth() + 1).toString().padStart(2, '0');
        return year === curYear && month === curMonth;
      })
      .reduce((sum, inv) => sum + parseFloat(inv.amount || 0), 0);

    return { outstanding, paidThisMonth };
  }, [invoices]);

  // --- ANALYTICS COMPUTATIONS ---
  const analyticsData = useMemo(() => {
    let leadCount = 0;
    let activeCount = 0;
    let closedCount = 0;

    leads.forEach(l => {
      const status = l.outreach_status;
      if (['Not Contacted', 'Messaged'].includes(status)) {
        leadCount++;
      } else if (['Replied', 'Interested'].includes(status)) {
        activeCount++;
      } else if (['Closed Won', 'Closed Lost', 'Not Interested'].includes(status)) {
        closedCount++;
      }
    });

    const monthlyRevenue = {};
    leads.forEach(l => {
      if (l.outreach_status === 'Closed Won') {
        let revenue = 2500; // Default estimate
        
        // Try to extract budget from notes
        const notesMatch = (l.notes || '').match(/\$([0-9,]+)/);
        if (notesMatch) {
          const parsed = parseFloat(notesMatch[1].replace(/,/g, ''));
          if (!isNaN(parsed)) {
            revenue = parsed;
          }
        }

        let monthKey = '2026-07';
        if (l.last_contacted && l.last_contacted.includes('-')) {
          const parts = l.last_contacted.split('-');
          if (parts.length >= 2) {
            monthKey = `${parts[0]}-${parts[1]}`;
          }
        }
        
        monthlyRevenue[monthKey] = (monthlyRevenue[monthKey] || 0) + revenue;
      }
    });

    const monthsSorted = Object.keys(monthlyRevenue).sort();
    const revenueTrend = monthsSorted.map(m => {
      const [year, month] = m.split('-');
      const monthNames = {
        '01': 'Jan', '02': 'Feb', '03': 'Mar', '04': 'Apr',
        '05': 'May', '06': 'Jun', '07': 'Jul', '08': 'Aug',
        '09': 'Sep', '10': 'Oct', '11': 'Nov', '12': 'Dec'
      };
      return {
        key: m,
        label: `${monthNames[month] || month} ${year}`,
        amount: monthlyRevenue[m]
      };
    });

    const todayStr = '2026-07-04';
    const pendingFollowUps = leads.filter(l => {
      const isNotClosed = !['Closed Won', 'Closed Lost', 'Not Interested'].includes(l.outreach_status);
      const hasFollowUp = !!l.follow_up_date;
      const isOverdue = l.follow_up_date <= todayStr;
      return isNotClosed && hasFollowUp && isOverdue;
    });

    const sources = {
      'Instagram DM': 0,
      'Apollo Export': 0,
      'Referral': 0,
      'Cold Email': 0,
      'Google Maps / Cold Call': 0
    };

    leads.forEach(l => {
      const notes = (l.notes || '').toLowerCase();
      if (l.instagram_handle) {
        sources['Instagram DM']++;
      } else if (notes.includes('apollo')) {
        sources['Apollo Export']++;
      } else if (notes.includes('referral') || notes.includes('referred')) {
        sources['Referral']++;
      } else if (notes.includes('email') || notes.includes('cold email')) {
        sources['Cold Email']++;
      } else {
        sources['Google Maps / Cold Call']++;
      }
    });

    const sourceList = Object.keys(sources).map(name => ({
      name,
      count: sources[name],
      percentage: leads.length > 0 ? Math.round((sources[name] / leads.length) * 100) : 0
    })).sort((a, b) => b.count - a.count);

    return {
      totalClients: activeCount + leads.filter(l => l.outreach_status === 'Closed Won').length,
      leadCount,
      activeCount,
      closedCount,
      revenueTrend,
      pendingFollowUpCount: pendingFollowUps.length,
      pendingFollowUps,
      sourceList
    };
  }, [leads]);

  // Grid and text colors for Recharts based on active theme
  const gridColor = isDarkMode ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.06)';
  const axisColor = isDarkMode ? '#64748b' : '#475569';

  // --- HANDLERS ---
  const handleAddLead = (e) => {
    e.preventDefault();
    if (!newLeadForm.business_name) {
      showToast('⚠️ Business name is required.');
      return;
    }

    const newLead = {
      ...newLeadForm,
      id: `lead_${Date.now()}`,
      last_contacted: newLeadForm.outreach_status !== 'Not Contacted' ? new Date().toISOString().split('T')[0] : '',
      follow_up_date: ''
    };

    const updated = [newLead, ...leads];
    setLeads(updated);
    setIsAddLeadOpen(false);
    showToast('✨ New Lead added!');
    
    // Reset form
    setNewLeadForm({
      business_name: '',
      phone: '',
      address: '',
      category: '',
      website_status: 'Needs Redesign',
      instagram_handle: '',
      priority: 'MED',
      outreach_status: 'Not Contacted',
      notes: ''
    });

    if (syncConfig.mode === 'sheets') {
      // Sync immediately
      syncAllLeadsToSheets(syncConfig.sheetId, syncConfig.apiKey, updated)
        .catch(err => setSyncError(err.message));
    }
  };

  const handleUpdateLeadDetail = (updatedLead) => {
    const triggerConfetti = 
      updatedLead.outreach_status === 'Closed Won' && 
      leads.find(l => l.id === updatedLead.id)?.outreach_status !== 'Closed Won';

    const updatedLeads = leads.map(l => l.id === updatedLead.id ? updatedLead : l);
    setLeads(updatedLeads);
    setSelectedLead(updatedLead);
    showToast('💾 Lead details updated!');

    if (triggerConfetti) {
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 }
      });
    }

    if (syncConfig.mode === 'sheets') {
      syncAllLeadsToSheets(syncConfig.sheetId, syncConfig.apiKey, updatedLeads)
        .catch(err => setSyncError(err.message));
    }
  };

  const handleDeleteLead = (id) => {
    if (window.confirm('Kya aap is lead ko delete karna chahte hain?')) {
      const updated = leads.filter(l => l.id !== id);
      setLeads(updated);
      setSelectedLead(null);
      showToast('🗑️ Lead deleted!');

      if (syncConfig.mode === 'sheets') {
        syncAllLeadsToSheets(syncConfig.sheetId, syncConfig.apiKey, updated)
          .catch(err => setSyncError(err.message));
      }
    }
  };

  const handleAddProject = (e) => {
    e.preventDefault();
    if (!newProjectForm.client_name || !newProjectForm.project_name) {
      alert("Please select a client and fill in the project name.");
      return;
    }
    const newProj = {
      id: `proj_${Date.now()}`,
      client_name: newProjectForm.client_name,
      project_name: newProjectForm.project_name,
      status: newProjectForm.status,
      start_date: newProjectForm.start_date || new Date().toISOString().split('T')[0],
      deadline: newProjectForm.deadline || '',
      notes: newProjectForm.notes || '',
      created_by: 'Sarfaraz'
    };

    setProjects(prev => [newProj, ...prev]);
    setIsAddProjectOpen(false);
    setNewProjectForm({
      client_name: '',
      project_name: '',
      status: 'Not Started',
      start_date: new Date().toISOString().split('T')[0],
      deadline: '',
      notes: ''
    });
    showToast('🚀 Project added successfully!');
  };

  const handleUpdateProjectStatus = (projectId, newStatus) => {
    setProjects(prev => prev.map(p => p.id === projectId ? { ...p, status: newStatus } : p));
    showToast(`💼 Project status updated to ${newStatus}`);
  };

  const handleDeleteProject = (projectId) => {
    if (window.confirm("Kya aap is project ko delete karna chahte hain?")) {
      setProjects(prev => prev.filter(p => p.id !== projectId));
      showToast('🗑️ Project deleted!');
    }
  };

  const handleAddInvoice = (e) => {
    e.preventDefault();
    if (!newInvoiceForm.client_name || !newInvoiceForm.amount) {
      alert("Please select a client and fill in the amount.");
      return;
    }
    const newInv = {
      id: `inv_${Date.now()}`,
      client_name: newInvoiceForm.client_name,
      project_id: newInvoiceForm.project_id || '',
      amount: parseFloat(newInvoiceForm.amount || 0),
      currency: newInvoiceForm.currency || 'USD',
      status: newInvoiceForm.status || 'Draft',
      due_date: newInvoiceForm.due_date || '',
      created_date: new Date().toISOString().split('T')[0],
      created_by: 'Sarfaraz'
    };

    setInvoices(prev => [newInv, ...prev]);
    setIsAddInvoiceOpen(false);
    setNewInvoiceForm({
      client_name: '',
      project_id: '',
      amount: '',
      currency: 'USD',
      status: 'Draft',
      due_date: '',
    });
    showToast('🧾 Invoice created successfully!');
  };

  const handleUpdateInvoiceStatus = (invoiceId, newStatus) => {
    setInvoices(prev => prev.map(inv => inv.id === invoiceId ? { ...inv, status: newStatus } : inv));
    showToast(`🧾 Invoice status updated to ${newStatus}`);
  };

  const handleDeleteInvoice = (invoiceId) => {
    if (window.confirm("Kya aap is invoice ko delete karna chahte hain?")) {
      setInvoices(prev => prev.filter(inv => inv.id !== invoiceId));
      showToast('🗑️ Invoice deleted!');
    }
  };

  const handleSaveSettings = (e) => {
    e.preventDefault();
    const newConfig = {
      mode: tempMode,
      sheetId: tempSheetId,
      apiKey: tempApiKey
    };
    setSyncConfig(newConfig);
    setIsSettingsOpen(false);
    showToast('⚙️ Settings updated!');

    if (newConfig.mode === 'sheets') {
      syncWithGoogleSheets(newConfig);
    }
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
    showToast('📋 Copied to clipboard');
  };

  const exportLocalCSV = () => {
    const headers = ['Business Name', 'Phone', 'Address', 'Category', 'Website Status', 'Instagram Handle', 'Priority', 'Outreach Status', 'Last Contacted', 'Notes', 'Follow Up Date', 'ID'];
    const rows = leads.map(l => [
      l.business_name,
      l.phone,
      l.address,
      l.category,
      l.website_status,
      l.instagram_handle,
      l.priority,
      l.outreach_status,
      l.last_contacted,
      l.notes,
      l.follow_up_date,
      l.id
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.map(h => `"${h}"`).join(','), ...rows.map(r => r.map(v => `"${v || ''}"`).join(','))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `nexus_leads_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const handleResetToDefault = () => {
    if (window.confirm("Kya aap sach mein CRM data ko reset karke original clean CSV data se restore karna chahte hain? Sabhi changes lost ho jayenge.")) {
      localStorage.removeItem('leads_crm_data');
      localStorage.removeItem('leads_crm_projects');
      localStorage.removeItem('leads_crm_invoices');
      setLeads(seedLeadsData);
      setProjects([]);
      setInvoices([]);
      showToast('🔄 CRM data reset to default clean CSV values!');
      setIsSettingsOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#06070a] text-slate-900 dark:text-slate-800 dark:text-slate-100 pb-12 antialiased transition-colors duration-200">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-800 dark:text-slate-100 text-sm font-medium shadow-2xl flex items-center gap-2"
          >
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* HEADER BAR */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-[#06070a]/90 backdrop-blur-md border-b border-slate-200 dark:border-white/5 py-4 px-4 md:px-8 transition-colors duration-200">
        <div className="max-w-7xl mx-auto flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          {/* Logo & Navigation Tabs */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between md:justify-start gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 flex-shrink-0">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-extrabold tracking-tight text-lg bg-gradient-to-r from-slate-800 to-slate-500 dark:from-slate-100 dark:to-slate-400 bg-clip-text text-transparent">VEXO TEAMX CRM</h1>
                <p className="text-[10px] text-slate-500 font-mono tracking-widest uppercase">Lead Tracker • Founder: Sarfaraz</p>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 p-1 rounded-xl text-xs font-medium w-full sm:w-auto justify-center gap-1">
              <button
                onClick={() => setActiveTab('leads')}
                className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-lg transition-all cursor-pointer text-center ${
                  activeTab === 'leads' 
                    ? 'bg-indigo-600 text-white shadow-sm font-semibold' 
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                Leads
              </button>
              <button
                onClick={() => setActiveTab('projects')}
                className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-lg transition-all cursor-pointer text-center ${
                  activeTab === 'projects' 
                    ? 'bg-indigo-600 text-white shadow-sm font-semibold' 
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                Projects
              </button>
              <button
                onClick={() => setActiveTab('invoices')}
                className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-lg transition-all cursor-pointer text-center ${
                  activeTab === 'invoices' 
                    ? 'bg-indigo-600 text-white shadow-sm font-semibold' 
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                Invoices
              </button>
              <button
                onClick={() => setActiveTab('analytics')}
                className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-lg transition-all cursor-pointer text-center ${
                  activeTab === 'analytics' 
                    ? 'bg-indigo-600 text-white shadow-sm font-semibold' 
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                Analytics
              </button>
            </div>
          </div>

          {/* Right Action buttons */}
          <div className="flex items-center justify-between sm:justify-end gap-2 w-full md:w-auto">
            {/* Sync Indicator */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 text-[11px] text-slate-500 dark:text-slate-400 font-mono">
              <span className={`w-2 h-2 rounded-full ${syncConfig.mode === 'sheets' ? 'bg-indigo-400 animate-pulse' : 'bg-emerald-400'}`}></span>
              {syncConfig.mode === 'sheets' ? 'Sheets Connected' : 'Local Sandbox'}
            </div>

            {syncConfig.mode === 'sheets' && (
              <button 
                onClick={() => syncWithGoogleSheets()}
                disabled={syncing}
                className="p-2.5 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/10 transition duration-150 disabled:opacity-40"
                title="Sync now"
              >
                <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
              </button>
            )}

            <button 
              onClick={() => setIsDarkMode(d => !d)}
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/10 transition duration-150 cursor-pointer"
              title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-500" />}
            </button>

            <button 
              onClick={() => setIsSettingsOpen(true)}
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/10 transition duration-150 cursor-pointer"
              title="Settings"
            >
              <Settings className="w-4 h-4" />
            </button>

            <button 
              onClick={() => setIsAddLeadOpen(true)}
              className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-semibold rounded-xl hover:brightness-110 shadow-lg shadow-indigo-500/10 transition active:scale-95 cursor-pointer flex-1 sm:flex-initial"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Lead</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-8 mt-6">
        {activeTab === 'leads' && (
          <>

        {/* STATS ROW */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Card 1: Total Leads */}
          <div className="bg-white dark:bg-[#101217] glow-card border border-slate-200 dark:border-white/5 rounded-2xl p-4 md:p-5 flex flex-col justify-between shadow-sm dark:shadow-none transition-colors duration-200">
            <div className="flex items-center justify-between text-slate-500 mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider">Total Leads</span>
              <Users className="w-4 h-4 text-indigo-400" />
            </div>
            <div>
              <span className="text-2xl md:text-3xl font-extrabold text-slate-800 dark:text-slate-800 dark:text-slate-100">{stats.total}</span>
              <p className="text-[10px] text-slate-400 mt-1 font-mono">Enriched lead profiles</p>
            </div>
          </div>

          {/* Card 2: Contacted */}
          <div className="bg-white dark:bg-[#101217] glow-card border border-slate-200 dark:border-white/5 rounded-2xl p-4 md:p-5 flex flex-col justify-between shadow-sm dark:shadow-none transition-colors duration-200">
            <div className="flex items-center justify-between text-slate-500 mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider">Contacted</span>
              <MessageSquare className="w-4 h-4 text-blue-400" />
            </div>
            <div>
              <span className="text-2xl md:text-3xl font-extrabold text-slate-800 dark:text-slate-800 dark:text-slate-100">{stats.contacted}</span>
              <p className="text-[10px] text-slate-400 mt-1 font-mono">{stats.contactedPct}% of database outreach</p>
            </div>
          </div>

          {/* Card 3: Replied */}
          <div className="bg-white dark:bg-[#101217] glow-card border border-slate-200 dark:border-white/5 rounded-2xl p-4 md:p-5 flex flex-col justify-between shadow-sm dark:shadow-none transition-colors duration-200">
            <div className="flex items-center justify-between text-slate-500 mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider">Responses</span>
              <TrendingUp className="w-4 h-4 text-purple-400" />
            </div>
            <div>
              <span className="text-2xl md:text-3xl font-extrabold text-slate-800 dark:text-slate-800 dark:text-slate-100">{stats.replied}</span>
              <p className="text-[10px] text-slate-400 mt-1 font-mono">{stats.repliedPct}% conversation rate</p>
            </div>
          </div>

          {/* Card 4: Won */}
          <div className="bg-white dark:bg-[#101217] glow-card border border-slate-200 dark:border-white/5 rounded-2xl p-4 md:p-5 flex flex-col justify-between shadow-sm dark:shadow-none transition-colors duration-200">
            <div className="flex items-center justify-between text-slate-500 mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider">Closed Won</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <span className="text-2xl md:text-3xl font-extrabold text-emerald-400">{stats.won}</span>
              <p className="text-[10px] text-slate-400 mt-1 font-mono">{stats.wonPct}% overall conversion</p>
            </div>
          </div>
        </section>

        {/* ERROR BOX */}
        {syncError && (
          <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-3 font-mono">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <div className="flex-1">
              <strong>Sync Error:</strong> {syncError}
            </div>
            <button 
              onClick={() => setSyncError('')}
              className="p-1 text-rose-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* FILTER BAR PANEL */}
        <section className="bg-white dark:bg-[#101217] border border-slate-200 dark:border-white/5 rounded-2xl p-4 mb-6 shadow-sm dark:shadow-none transition-colors duration-200">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            {/* Search */}
            <div className="relative md:col-span-4">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
              <input 
                type="text" 
                placeholder="Search leads by name, phone, handle..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-100 dark:bg-[#171922] border border-slate-200 dark:border-white/5 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-800 dark:text-slate-200 outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition"
              />
              {searchTerm && (
                <button onClick={() => setSearchTerm('')} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Filters */}
            <div className="grid grid-cols-3 gap-2 md:col-span-6">
              {/* Category */}
              <div className="relative">
                <select 
                  value={filterCategory} 
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="w-full appearance-none bg-slate-100 dark:bg-[#171922] border border-slate-200 dark:border-white/5 rounded-xl py-2.5 px-3 pr-8 text-xs text-slate-600 dark:text-slate-300 outline-none focus:border-indigo-500/50"
                >
                  <option value="All">All Categories</option>
                  {categories.filter(c => c !== 'All').map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
              </div>

              {/* Priority */}
              <div className="relative">
                <select 
                  value={filterPriority} 
                  onChange={(e) => setFilterPriority(e.target.value)}
                  className="w-full appearance-none bg-slate-100 dark:bg-[#171922] border border-slate-200 dark:border-white/5 rounded-xl py-2.5 px-3 pr-8 text-xs text-slate-600 dark:text-slate-300 outline-none focus:border-indigo-500/50"
                >
                  <option value="All">All Priority</option>
                  <option value="HIGH">High</option>
                  <option value="MED">Medium</option>
                  <option value="LOW">Low</option>
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
              </div>

              {/* Status */}
              <div className="relative">
                <select 
                  value={filterStatus} 
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full appearance-none bg-slate-100 dark:bg-[#171922] border border-slate-200 dark:border-white/5 rounded-xl py-2.5 px-3 pr-8 text-xs text-slate-600 dark:text-slate-300 outline-none focus:border-indigo-500/50"
                >
                  <option value="All">All Status</option>
                  {STATUS_OPTIONS.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
              </div>
            </div>

            {/* Sort Controls */}
            <div className="flex items-center justify-between md:col-span-2 gap-2">
              <div className="relative flex-1">
                <select 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full appearance-none bg-slate-100 dark:bg-[#171922] border border-slate-200 dark:border-white/5 rounded-xl py-2.5 px-3 pr-8 text-xs text-slate-600 dark:text-slate-300 outline-none focus:border-indigo-500/50"
                >
                  <option value="business_name">Sort Name</option>
                  <option value="priority">Sort Priority</option>
                  <option value="last_contacted">Sort Last Contact</option>
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
              </div>

              <button 
                onClick={() => setSortOrder(o => o === 'asc' ? 'desc' : 'asc')}
                className="p-2.5 bg-slate-100 dark:bg-[#171922] border border-slate-200 dark:border-white/5 text-xs text-slate-500 dark:text-slate-400 rounded-xl hover:text-white"
                title="Toggle Sort Order"
              >
                {sortOrder === 'asc' ? '↑' : '↓'}
              </button>
            </div>
          </div>
        </section>

        {/* LEADS LIST / TABLE AREA */}
        <section className="bg-white dark:bg-[#101217] border border-slate-200 dark:border-white/5 rounded-2xl overflow-hidden shadow-sm dark:shadow-none transition-colors duration-200">
          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 text-[11px] font-semibold text-slate-500 uppercase tracking-wider bg-slate-50 dark:bg-[#0c0e12]/30">
                  <th className="py-4 px-6">Business & Info</th>
                  <th className="py-4 px-4">Category</th>
                  <th className="py-4 px-4">Website</th>
                  <th className="py-4 px-4">Priority</th>
                  <th className="py-4 px-4">Outreach</th>
                  <th className="py-4 px-4">Last Contacted</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm">
                {filteredLeads.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="py-12 text-center text-slate-500 font-medium">
                      No leads match your search criteria.
                    </td>
                  </tr>
                ) : (
                  filteredLeads.map((lead) => (
                    <tr 
                      key={lead.id} 
                      onClick={() => setSelectedLead(lead)}
                      className="group hover:bg-slate-50 dark:hover:bg-white/[0.01] transition-colors cursor-pointer"
                    >
                      <td className="py-4 px-6">
                        <div>
                          <div className="font-bold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{lead.business_name}</div>
                          <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-1.5">
                            <span className="text-[10px] font-mono">{lead.phone}</span>
                            {lead.instagram_handle && (
                              <span className="text-[10px] text-purple-400/80 font-mono">@{lead.instagram_handle}</span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-xs bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/5 px-2.5 py-1 rounded-full text-slate-600 dark:text-slate-400 font-medium capitalize">
                          {lead.category}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
                          lead.website_status === 'no' || lead.website_status === 'No Website' 
                            ? 'text-rose-400/80' 
                            : 'text-emerald-400/80'
                        }`}>
                          {lead.website_status === 'no' || lead.website_status === 'No Website' ? '❌ No Web' : '✅ Active'}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`text-[10px] font-bold border px-2 py-0.5 rounded-md flex items-center gap-1.5 w-max ${PRIORITY_STYLES[lead.priority]?.bg || ''}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${PRIORITY_STYLES[lead.priority]?.dot || ''}`} />
                          {lead.priority}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`text-xs border px-2.5 py-1 rounded-full font-medium ${STATUS_STYLES[lead.outreach_status] || ''}`}>
                          {lead.outreach_status}
                        </span>
                      </td>
                      <td className="py-4 px-4 font-mono text-xs text-slate-400">
                        {lead.last_contacted || '—'}
                      </td>
                      <td className="py-4 px-6 text-right" onClick={(e) => e.stopPropagation()}>
                        <button 
                          onClick={() => setSelectedLead(lead)}
                          className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold py-1 px-3.5 rounded-lg border border-indigo-500/20 hover:bg-indigo-500/10 transition"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Card List View */}
          <div className="block lg:hidden divide-y divide-slate-200 dark:divide-white/5">
            {filteredLeads.length === 0 ? (
              <div className="py-12 text-center text-slate-500 text-sm font-medium">
                No leads match your search criteria.
              </div>
            ) : (
              filteredLeads.map((lead) => (
                <div 
                  key={lead.id} 
                  onClick={() => setSelectedLead(lead)}
                  className="p-4.5 hover:bg-slate-50 dark:hover:bg-white/[0.01] active:bg-slate-100 dark:active:bg-white/[0.02] transition-colors cursor-pointer select-none"
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <h4 className="font-extrabold text-slate-800 dark:text-slate-200 text-sm">{lead.business_name}</h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 capitalize font-medium">{lead.category} • {lead.phone}</p>
                    </div>
                    <span className={`text-[9px] font-bold border px-1.5 py-0.5 rounded-md flex items-center gap-1 ${PRIORITY_STYLES[lead.priority]?.bg || ''}`}>
                      {lead.priority}
                    </span>
                  </div>

                  <div className="flex items-center justify-between mt-3 text-xs">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border ${STATUS_STYLES[lead.outreach_status] || ''}`}>
                      {lead.outreach_status}
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono font-medium">
                      Last Contact: {lead.last_contacted || '—'}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

          </>
        )}

        {activeTab === 'projects' && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            {/* Header section */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-indigo-400" />
                  Active Client Projects
                </h2>
                <p className="text-xs text-slate-400">Track deliverables, revisions, and status on Kanban board</p>
              </div>
              <button
                onClick={() => {
                  setNewProjectForm(prev => ({
                    ...prev,
                    client_name: leads.length > 0 ? leads[0].business_name : ''
                  }));
                  setIsAddProjectOpen(true);
                }}
                className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-semibold rounded-xl hover:brightness-110 shadow-lg shadow-indigo-500/10 transition active:scale-95 cursor-pointer w-full sm:w-auto"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Project</span>
              </button>
            </div>

            {/* Kanban Board Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { id: 'Not Started', title: 'Not Started', dot: 'bg-slate-400' },
                { id: 'In Progress', title: 'In Progress', dot: 'bg-blue-400' },
                { id: 'Delivered', title: 'Delivered', dot: 'bg-emerald-400' },
                { id: 'Revision', title: 'Revision', dot: 'bg-amber-400' }
              ].map(column => {
                const columnProjects = projects.filter(p => p.status === column.id);

                return (
                  <div
                    key={column.id}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      const projectId = e.dataTransfer.getData('text/plain');
                      handleUpdateProjectStatus(projectId, column.id);
                    }}
                    className="flex flex-col bg-white dark:bg-[#101217] border border-slate-200 dark:border-white/5 rounded-2xl p-4 min-h-[500px] transition-colors duration-200"
                  >
                    {/* Column Header */}
                    <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-200 dark:border-white/5">
                      <div className="flex items-center gap-2">
                        <span className={`w-2.5 h-2.5 rounded-full ${column.dot}`}></span>
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{column.title}</span>
                      </div>
                      <span className="text-[10px] font-mono font-semibold px-2 py-0.5 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded text-slate-400">
                        {columnProjects.length}
                      </span>
                    </div>

                    {/* Column Cards Container */}
                    <div className="flex-1 flex flex-col gap-3 overflow-y-auto max-h-[600px] pr-1">
                      {columnProjects.length === 0 ? (
                        <div className="flex-1 flex flex-col items-center justify-center border border-dashed border-slate-200 dark:border-white/5 rounded-xl p-4 text-center bg-slate-50/50 dark:bg-white/[0.01]">
                          <span className="text-[10px] text-slate-500 dark:text-slate-500 font-mono">No Projects</span>
                        </div>
                      ) : (
                        columnProjects.map(project => (
                          <div
                            key={project.id}
                            draggable
                            onDragStart={(e) => e.dataTransfer.setData('text/plain', project.id)}
                            className="group relative bg-slate-50 dark:bg-[#171922] border border-slate-200 dark:border-white/5 p-4 rounded-xl shadow-sm hover:border-indigo-500/30 transition duration-150 cursor-grab active:cursor-grabbing flex flex-col justify-between gap-3"
                          >
                            {/* Project content */}
                            <div className="space-y-2">
                              <div className="flex items-start justify-between gap-2">
                                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 tracking-tight group-hover:text-indigo-400 transition break-words">
                                  {project.project_name}
                                </h4>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteProject(project.id)}
                                  className="text-slate-500 hover:text-rose-400 p-0.5 rounded opacity-0 group-hover:opacity-100 transition flex-shrink-0"
                                  title="Delete Project"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>

                              <div className="flex items-center gap-1.5 text-[10px] text-slate-500 dark:text-slate-400">
                                <Building2 className="w-3 h-3 text-slate-400 flex-shrink-0" />
                                <span className="font-semibold truncate">{project.client_name}</span>
                              </div>

                              {project.notes && (
                                <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-2 italic font-serif">
                                  "{project.notes}"
                                </p>
                              )}
                            </div>

                            {/* Card Footer / Quick Controls */}
                            <div className="flex flex-col gap-2 pt-2 border-t border-slate-200 dark:border-white/5 mt-1">
                              <div className="flex items-center justify-between text-[10px]">
                                <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                                  <Calendar className="w-3 h-3 text-slate-450" />
                                  <span>Deadline:</span>
                                </div>
                                <span className={`font-mono font-semibold ${
                                  project.deadline && new Date(project.deadline) < new Date() 
                                    ? 'text-rose-400 bg-rose-500/10 px-1.5 py-0.5 rounded border border-rose-500/20' 
                                    : 'text-slate-500 dark:text-slate-400'
                                }`}>
                                  {project.deadline || '—'}
                                </span>
                              </div>

                              {/* Mobile Quick Switcher */}
                              <div className="relative mt-1">
                                <select
                                  value={project.status}
                                  onChange={(e) => handleUpdateProjectStatus(project.id, e.target.value)}
                                  className="w-full appearance-none bg-slate-100 dark:bg-[#0c0e12] border border-slate-200 dark:border-white/5 text-[9px] text-slate-500 dark:text-slate-400 font-mono rounded py-1 px-2 pr-6 outline-none focus:border-indigo-500/50 cursor-pointer"
                                >
                                  <option disabled>Move to...</option>
                                  <option value="Not Started">Not Started</option>
                                  <option value="In Progress">In Progress</option>
                                  <option value="Delivered">Delivered</option>
                                  <option value="Revision">Revision</option>
                                </select>
                                <ChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {activeTab === 'invoices' && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            {/* Header section */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-indigo-400" />
                  Billing & Invoices
                </h2>
                <p className="text-xs text-slate-400">Manage client billing schedules, currencies, and receipts</p>
              </div>
              <button
                onClick={() => {
                  setNewInvoiceForm(prev => ({
                    ...prev,
                    client_name: leads.length > 0 ? leads[0].business_name : '',
                    project_id: ''
                  }));
                  setIsAddInvoiceOpen(true);
                }}
                className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-semibold rounded-xl hover:brightness-110 shadow-lg shadow-indigo-500/10 transition active:scale-95 cursor-pointer w-full sm:w-auto"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Invoice</span>
              </button>
            </div>

            {/* Invoices summary row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Card 1: Outstanding Invoices */}
              <div className="bg-white dark:bg-[#101217] glow-card border border-slate-200 dark:border-white/5 rounded-2xl p-4 md:p-5 flex flex-col justify-between shadow-sm dark:shadow-none transition-colors duration-200 shadow-lg shadow-black/10">
                <div className="flex items-center justify-between text-slate-500 mb-3">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Outstanding Balance</span>
                  <DollarSign className="w-4.5 h-4.5 text-rose-400" />
                </div>
                <div>
                  <span className="text-2xl md:text-3xl font-extrabold text-rose-400">
                    ${invoiceStats.outstanding.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                  <p className="text-[10px] text-slate-400 mt-1 font-mono">Unpaid or pending invoices</p>
                </div>
              </div>

              {/* Card 2: Paid This Month */}
              <div className="bg-white dark:bg-[#101217] glow-card border border-slate-200 dark:border-white/5 rounded-2xl p-4 md:p-5 flex flex-col justify-between shadow-sm dark:shadow-none transition-colors duration-200 shadow-lg shadow-black/10">
                <div className="flex items-center justify-between text-slate-500 mb-3">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Paid This Month</span>
                  <CheckCircle2 className="w-4.5 h-4.5 text-emerald-400" />
                </div>
                <div>
                  <span className="text-2xl md:text-3xl font-extrabold text-emerald-400">
                    ${invoiceStats.paidThisMonth.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                  <p className="text-[10px] text-slate-400 mt-1 font-mono">Collected in current month</p>
                </div>
              </div>
            </div>

            {/* Invoices List / Table */}
            <div className="bg-white dark:bg-[#101217] border border-slate-200 dark:border-white/5 rounded-2xl overflow-hidden transition-colors duration-200">
              {invoices.length === 0 ? (
                <div className="p-12 text-center flex flex-col items-center justify-center border border-dashed border-slate-200 dark:border-white/5 rounded-2xl m-4 bg-slate-50/50 dark:bg-white/[0.01]">
                  <FileText className="w-10 h-10 text-slate-500 mb-3" />
                  <h3 className="text-sm font-bold text-slate-350">No Invoices Found</h3>
                  <p className="text-xs text-slate-500 mt-1">Create an invoice to start tracking payments.</p>
                </div>
              ) : (
                <>
                  {/* Desktop View Table */}
                  <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-250 dark:border-white/5 bg-slate-50 dark:bg-[#171922] text-[10px] text-slate-500 font-mono tracking-wider uppercase">
                          <th className="py-3.5 px-5">Client</th>
                          <th className="py-3.5 px-5">Project</th>
                          <th className="py-3.5 px-5">Amount</th>
                          <th className="py-3.5 px-5">Status</th>
                          <th className="py-3.5 px-5">Due Date</th>
                          <th className="py-3.5 px-5">Issued Date</th>
                          <th className="py-3.5 px-5 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 dark:divide-white/5 text-xs text-slate-600 dark:text-slate-300">
                        {invoices.map(invoice => {
                          const project = projects.find(p => p.id === invoice.project_id);
                          const isOverdue = invoice.status === 'Overdue' || (invoice.status !== 'Paid' && invoice.due_date && new Date(invoice.due_date) < new Date());
                          
                          // Dynamic Status Badges Styles
                          let statusClass = 'bg-slate-500/10 text-slate-400 border-slate-500/15';
                          if (invoice.status === 'Paid') statusClass = 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25';
                          else if (invoice.status === 'Sent') statusClass = 'bg-amber-500/10 text-amber-400 border-amber-500/20';
                          else if (isOverdue || invoice.status === 'Overdue') statusClass = 'bg-rose-500/10 text-rose-400 border-rose-500/15';

                          return (
                            <tr key={invoice.id} className="hover:bg-slate-50/50 dark:hover:bg-white/[0.01] transition-colors">
                              <td className="py-3.5 px-5 font-bold text-slate-800 dark:text-slate-200">{invoice.client_name}</td>
                              <td className="py-3.5 px-5 text-slate-500">{project ? project.project_name : 'General billing'}</td>
                              <td className="py-3.5 px-5 font-mono font-bold text-slate-800 dark:text-slate-200">
                                {invoice.currency === 'INR' ? '₹' : '$'}
                                {parseFloat(invoice.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                              </td>
                              <td className="py-3.5 px-5">
                                <div className="relative inline-block">
                                  <select
                                    value={invoice.status}
                                    onChange={(e) => handleUpdateInvoiceStatus(invoice.id, e.target.value)}
                                    className={`appearance-none text-[10px] font-semibold border px-2.5 py-0.5 rounded-full outline-none cursor-pointer pr-5 font-mono ${statusClass}`}
                                  >
                                    <option value="Draft">Draft</option>
                                    <option value="Sent">Sent</option>
                                    <option value="Paid">Paid</option>
                                    <option value="Overdue">Overdue</option>
                                  </select>
                                  <ChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none" />
                                </div>
                              </td>
                              <td className={`py-3.5 px-5 font-mono ${isOverdue ? 'text-rose-400 font-semibold' : 'text-slate-500'}`}>
                                {invoice.due_date || '—'}
                              </td>
                              <td className="py-3.5 px-5 font-mono text-slate-500">{invoice.created_date || '—'}</td>
                              <td className="py-3.5 px-5 text-right">
                                <button
                                  type="button"
                                  onClick={() => handleDeleteInvoice(invoice.id)}
                                  className="text-slate-500 hover:text-rose-400 p-1.5 rounded transition duration-150 inline-flex"
                                  title="Delete Invoice"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile View List */}
                  <div className="block md:hidden divide-y divide-slate-200 dark:divide-white/5">
                    {invoices.map(invoice => {
                      const project = projects.find(p => p.id === invoice.project_id);
                      const isOverdue = invoice.status === 'Overdue' || (invoice.status !== 'Paid' && invoice.due_date && new Date(invoice.due_date) < new Date());

                      let statusClass = 'bg-slate-500/10 text-slate-400 border-slate-500/15';
                      if (invoice.status === 'Paid') statusClass = 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25';
                      else if (invoice.status === 'Sent') statusClass = 'bg-amber-500/10 text-amber-400 border-amber-500/20';
                      else if (isOverdue || invoice.status === 'Overdue') statusClass = 'bg-rose-500/10 text-rose-400 border-rose-500/15';

                      return (
                        <div key={invoice.id} className="p-4 space-y-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm">{invoice.client_name}</h4>
                              <p className="text-[10px] text-slate-500 mt-0.5">{project ? project.project_name : 'General billing'}</p>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleDeleteInvoice(invoice.id)}
                              className="text-slate-500 hover:text-rose-400 p-1 rounded transition duration-150"
                              title="Delete Invoice"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="flex justify-between items-center text-xs">
                            <span className="font-mono font-bold text-slate-800 dark:text-slate-200 text-sm">
                              {invoice.currency === 'INR' ? '₹' : '$'}
                              {parseFloat(invoice.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </span>
                            <div className="relative">
                              <select
                                value={invoice.status}
                                onChange={(e) => handleUpdateInvoiceStatus(invoice.id, e.target.value)}
                                className={`appearance-none text-[10px] font-semibold border px-2.5 py-1 rounded-full outline-none cursor-pointer pr-5 font-mono ${statusClass}`}
                              >
                                <option value="Draft">Draft</option>
                                <option value="Sent">Sent</option>
                                <option value="Paid">Paid</option>
                                <option value="Overdue">Overdue</option>
                              </select>
                              <ChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none" />
                            </div>
                          </div>

                          <div className="flex justify-between text-[10px] pt-1.5 border-t border-slate-100 dark:border-white/5 text-slate-500 font-mono">
                            <span>Issued: {invoice.created_date || '—'}</span>
                            <span className={isOverdue ? 'text-rose-400 font-semibold' : ''}>
                              Due: {invoice.due_date || '—'}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}

        {activeTab === 'analytics' && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            {/* 1. Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-[#101217] glow-card border border-slate-200 dark:border-white/5 rounded-2xl p-4 md:p-5 flex flex-col justify-between shadow-sm dark:shadow-none transition-colors duration-200 shadow-lg shadow-black/10">
                <div className="flex items-center justify-between text-slate-500 mb-3">
                  <span className="text-xs font-semibold uppercase tracking-wider">Total Clients</span>
                  <CheckCircle2 className="w-4.5 h-4.5 text-emerald-400" />
                </div>
                <div>
                  <span className="text-2xl md:text-3xl font-extrabold text-slate-800 dark:text-slate-800 dark:text-slate-100">{analyticsData.totalClients}</span>
                  <p className="text-[10px] text-slate-400 mt-1 font-mono">Active & Won profiles</p>
                </div>
              </div>

              <div className="bg-white dark:bg-[#101217] glow-card border border-slate-200 dark:border-white/5 rounded-2xl p-4 md:p-5 flex flex-col justify-between shadow-sm dark:shadow-none transition-colors duration-200 shadow-lg shadow-black/10">
                <div className="flex items-center justify-between text-slate-500 mb-3">
                  <span className="text-xs font-semibold uppercase tracking-wider">Pending Follow-ups</span>
                  <Calendar className="w-4.5 h-4.5 text-rose-400" />
                </div>
                <div>
                  <span className="text-2xl md:text-3xl font-extrabold text-rose-400">{analyticsData.pendingFollowUpCount}</span>
                  <p className="text-[10px] text-slate-400 mt-1 font-mono">Requires attention</p>
                </div>
              </div>

              <div className="bg-white dark:bg-[#101217] glow-card border border-slate-200 dark:border-white/5 rounded-2xl p-4 md:p-5 flex flex-col justify-between shadow-sm dark:shadow-none transition-colors duration-200 shadow-lg shadow-black/10">
                <div className="flex items-center justify-between text-slate-500 mb-3">
                  <span className="text-xs font-semibold uppercase tracking-wider">Active Funnel</span>
                  <Users className="w-4.5 h-4.5 text-indigo-400" />
                </div>
                <div>
                  <span className="text-2xl md:text-3xl font-extrabold text-slate-800 dark:text-slate-800 dark:text-slate-100">{analyticsData.leadCount + analyticsData.activeCount}</span>
                  <p className="text-[10px] text-slate-400 mt-1 font-mono">In prospecting funnel</p>
                </div>
              </div>

              <div className="bg-white dark:bg-[#101217] glow-card border border-slate-200 dark:border-white/5 rounded-2xl p-4 md:p-5 flex flex-col justify-between shadow-sm dark:shadow-none transition-colors duration-200 shadow-lg shadow-black/10">
                <div className="flex items-center justify-between text-slate-500 mb-3">
                  <span className="text-xs font-semibold uppercase tracking-wider">Est. Closed Revenue</span>
                  <TrendingUp className="w-4.5 h-4.5 text-purple-400" />
                </div>
                <div>
                  <span className="text-2xl md:text-3xl font-extrabold text-emerald-400">
                    ${(leads.filter(l => l.outreach_status === 'Closed Won').reduce((acc, curr) => {
                      let val = 2500;
                      const match = (curr.notes || '').match(/\$([0-9,]+)/);
                      if (match) {
                        try {
                          const parsed = parseFloat(match[1].replace(/,/g, ''));
                          if (!isNaN(parsed)) val = parsed;
                        } catch (e) {}
                      }
                      return acc + val;
                    }, 0)).toLocaleString()}
                  </span>
                  <p className="text-[10px] text-slate-400 mt-1 font-mono">Won deals value summary</p>
                </div>
              </div>
            </div>

            {/* 2. Analytical Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Funnel Breakdown (Recharts Horizontal Bar Chart) */}
              <div className="bg-white dark:bg-[#101217] border border-slate-200 dark:border-white/5 rounded-2xl p-5 md:p-6 shadow-sm dark:shadow-none transition-colors duration-200">
                <h3 className="text-sm font-bold text-slate-200 mb-4 flex items-center gap-2">
                  <Users className="w-4.5 h-4.5 text-indigo-400" />
                  Client Funnel Status Breakdown
                </h3>
                {leads.length === 0 ? (
                  <div className="h-60 flex flex-col items-center justify-center text-center border border-dashed border-white/5 rounded-xl bg-white/[0.01]">
                    <AlertCircle className="w-8 h-8 text-slate-600 mb-2" />
                    <span className="text-xs text-slate-500 font-mono">No Funnel Data Yet</span>
                  </div>
                ) : (
                  <div className="h-60 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={[
                          { name: 'Leads', value: analyticsData.leadCount, percentage: leads.length > 0 ? Math.round((analyticsData.leadCount / leads.length) * 100) : 0, fill: '#5f5af6' },
                          { name: 'Active', value: analyticsData.activeCount, percentage: leads.length > 0 ? Math.round((analyticsData.activeCount / leads.length) * 100) : 0, fill: '#9d4edd' },
                          { name: 'Closed', value: analyticsData.closedCount, percentage: leads.length > 0 ? Math.round((analyticsData.closedCount / leads.length) * 100) : 0, fill: '#10b981' }
                        ]}
                        layout="vertical"
                        margin={{ top: 10, right: 50, left: -20, bottom: 5 }}
                      >
                        <XAxis type="number" hide />
                        <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} width={80} />
                        <Tooltip content={<CustomBarTooltip />} cursor={{ fill: 'rgba(255,255,255,0.02)' }} />
                        <Bar 
                          dataKey="value" 
                          radius={[0, 6, 6, 0]} 
                          barSize={16}
                          label={(props) => {
                            const { x, y, width, value, index } = props;
                            const percentages = [
                              leads.length > 0 ? Math.round((analyticsData.leadCount / leads.length) * 100) : 0,
                              leads.length > 0 ? Math.round((analyticsData.activeCount / leads.length) * 100) : 0,
                              leads.length > 0 ? Math.round((analyticsData.closedCount / leads.length) * 100) : 0
                            ];
                            return (
                              <text x={x + width + 8} y={y + 12} fill="#cbd5e1" fontSize={10} fontFamily="monospace" textAnchor="start">
                                {value} ({percentages[index]}%)
                              </text>
                            );
                          }}
                        >
                          <Cell fill="#5f5af6" />
                          <Cell fill="#9d4edd" />
                          <Cell fill="#10b981" />
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>

              {/* Lead Source Distribution (Recharts Donut Chart) */}
              <div className="bg-white dark:bg-[#101217] border border-slate-200 dark:border-white/5 rounded-2xl p-5 md:p-6 shadow-sm dark:shadow-none transition-colors duration-200">
                <h3 className="text-sm font-bold text-slate-200 mb-4 flex items-center gap-2">
                  <Globe className="w-4.5 h-4.5 text-purple-400" />
                  Lead Source Distribution
                </h3>
                {leads.length === 0 ? (
                  <div className="h-60 flex flex-col items-center justify-center text-center border border-dashed border-white/5 rounded-xl bg-white/[0.01]">
                    <AlertCircle className="w-8 h-8 text-slate-600 mb-2" />
                    <span className="text-xs text-slate-500 font-mono">No Source Data Yet</span>
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-6 h-60">
                    <div className="relative h-44 w-44 flex-shrink-0 flex items-center justify-center">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={analyticsData.sourceList.map(src => ({
                              name: src.name,
                              value: src.count,
                              percentage: src.percentage
                            })).filter(d => d.value > 0)}
                            cx="50%"
                            cy="50%"
                            innerRadius={55}
                            outerRadius={75}
                            paddingAngle={3}
                            dataKey="value"
                          >
                            {analyticsData.sourceList.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="rgba(0,0,0,0.3)" strokeWidth={1} />
                            ))}
                          </Pie>
                          <Tooltip content={<CustomPieTooltip />} />
                        </PieChart>
                      </ResponsiveContainer>
                      
                      {/* Total Leads Center Label */}
                      <div className="absolute flex flex-col items-center justify-center text-center pointer-events-none">
                        <span className="text-2xl font-black text-slate-800 dark:text-slate-100 tracking-tight">{leads.length}</span>
                        <span className="text-[8px] text-slate-500 font-mono uppercase tracking-wider">Total Leads</span>
                      </div>
                    </div>

                    <div className="flex-1 space-y-2 w-full max-w-[200px] sm:max-w-none">
                      {analyticsData.sourceList.map((src, index) => (
                        <div key={src.name} className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                            <span className="text-slate-400 truncate">{src.name}</span>
                          </div>
                          <span className="font-semibold text-slate-300 font-mono flex-shrink-0 ml-2">{src.count} ({src.percentage}%)</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Monthly Revenue Trend (Recharts Area/Line Chart) */}
              <div className="bg-white dark:bg-[#101217] border border-slate-200 dark:border-white/5 rounded-2xl p-5 md:p-6 shadow-sm dark:shadow-none transition-colors duration-200 lg:col-span-2">
                <h3 className="text-sm font-bold text-slate-200 mb-6 flex items-center gap-2">
                  <TrendingUp className="w-4.5 h-4.5 text-emerald-400" />
                  Monthly Closed Won Revenue Trend
                </h3>
                {analyticsData.revenueTrend.length === 0 ? (
                  <div className="h-60 flex flex-col items-center justify-center text-center border border-dashed border-white/5 rounded-xl bg-white/[0.01]">
                    <AlertCircle className="w-8 h-8 text-slate-600 mb-2" />
                    <span className="text-xs text-slate-500 font-mono">No Revenue Trend Data Yet (Need Won Leads)</span>
                  </div>
                ) : (
                  <div className="h-60 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={analyticsData.revenueTrend} margin={{ top: 15, right: 15, left: -15, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#5f5af6" stopOpacity={0.25}/>
                            <stop offset="95%" stopColor="#5f5af6" stopOpacity={0.0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                        <XAxis dataKey="label" stroke={axisColor} fontSize={10} tickLine={false} axisLine={false} />
                        <YAxis stroke={axisColor} fontSize={10} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v.toLocaleString()}`} />
                        <Tooltip content={<CustomRevenueTooltip />} />
                        <Area
                          type="monotone"
                          dataKey="amount"
                          stroke="#5f5af6"
                          strokeWidth={2}
                          fillOpacity={1}
                          fill="url(#colorRevenue)"
                          activeDot={{ r: 5, stroke: '#5f5af6', strokeWidth: 2, fill: '#06070a' }}
                          dot={{ r: 3, stroke: '#5f5af6', strokeWidth: 2, fill: '#101217' }}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>

              {/* Pending Follow-ups */}
              <div className="bg-white dark:bg-[#101217] border border-slate-200 dark:border-white/5 rounded-2xl p-5 md:p-6 shadow-sm dark:shadow-none transition-colors duration-200 lg:col-span-2">
                <h3 className="text-sm font-bold text-slate-200 mb-4 flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Calendar className="w-4.5 h-4.5 text-rose-400" />
                    Overdue & Today's Follow-ups
                  </span>
                  <span className="text-xs bg-rose-500/10 text-rose-400 border border-rose-500/20 px-2 py-0.5 rounded font-semibold font-mono">
                    {analyticsData.pendingFollowUpCount} Pending
                  </span>
                </h3>

                {analyticsData.pendingFollowUps.length === 0 ? (
                  <div className="h-44 flex flex-col items-center justify-center text-center border border-dashed border-white/5 rounded-xl bg-white/[0.01]">
                    <CheckCircle2 className="w-8 h-8 text-emerald-500/80 mb-2" />
                    <span className="text-xs text-slate-500 font-mono">No follow-ups pending today! Everything is up to date.</span>
                  </div>
                ) : (
                  <div className="divide-y divide-white/5 max-h-72 overflow-y-auto pr-2">
                    {analyticsData.pendingFollowUps.map(lead => (
                      <div key={lead.id} className="py-3 flex items-center justify-between gap-4 group">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="text-xs font-bold text-slate-200 truncate">{lead.business_name}</h4>
                            <span className="text-[9px] bg-slate-900 border border-white/5 px-2 py-0.5 rounded text-slate-400 font-medium capitalize flex-shrink-0">
                              {lead.category}
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-400 truncate mt-1">
                            {lead.notes || 'No notes added'}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] text-rose-400 font-mono bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded flex-shrink-0">
                            {lead.follow_up_date}
                          </span>
                          <button 
                            type="button"
                            onClick={() => setSelectedLead(lead)}
                            className="text-[10px] text-indigo-400 hover:text-white font-semibold py-1 px-2.5 rounded border border-indigo-500/20 hover:bg-indigo-500/10 transition cursor-pointer"
                          >
                            View
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </main>

      {/* FOOTER BRANDING */}
      <footer className="max-w-7xl mx-auto px-4 md:px-8 mt-12 pb-8 text-center border-t border-slate-200 dark:border-white/5 pt-6 transition-colors duration-200">
        <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
          © 2026 Vexo TeamX. All rights reserved. Built & owned by Sarfaraz.
        </p>
      </footer>

      {/* LEAD DETAIL SLIDE DRAWER */}
      <AnimatePresence>
        {selectedLead && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedLead(null)}
              className="fixed inset-0 bg-black z-50 cursor-pointer"
            />
            {/* Drawer */}
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-lg bg-white dark:bg-[#0c0e12] border-l border-slate-200 dark:border-white/10 z-50 shadow-2xl p-6 overflow-y-auto flex flex-col justify-between"
            >
              <div>
                {/* Header */}
                <div className="flex items-center justify-between pb-5 border-b border-white/5 mb-6">
                  <div>
                    <h2 className="font-extrabold text-xl text-slate-800 dark:text-slate-100">{selectedLead.business_name}</h2>
                    <p className="text-xs text-slate-400 capitalize">{selectedLead.category} Lead Profile</p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button 
                      onClick={() => handleDeleteLead(selectedLead.id)}
                      className="p-2 text-rose-400 hover:text-white hover:bg-rose-500/10 rounded-xl transition duration-150"
                      title="Delete Lead"
                    >
                      <Trash2 className="w-4.5 h-4.5" />
                    </button>
                    <button 
                      onClick={() => setSelectedLead(null)}
                      className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition duration-150"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Lead Attributes Grid */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="p-3 bg-slate-50 dark:bg-[#171922] border border-slate-200 dark:border-white/5 rounded-xl">
                    <div className="text-[10px] text-slate-500 font-mono tracking-wider uppercase">Outreach Phone</div>
                    <div className="text-sm font-semibold text-slate-700 dark:text-slate-200 mt-1 flex items-center justify-between gap-2">
                      <span className="font-mono">{selectedLead.phone || '—'}</span>
                      {selectedLead.phone && (
                        <button onClick={() => copyToClipboard(selectedLead.phone, 'phone')} className="text-indigo-400 hover:text-white">
                          {copiedId === 'phone' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 dark:bg-[#171922] border border-slate-200 dark:border-white/5 rounded-xl">
                    <div className="text-[10px] text-slate-500 font-mono tracking-wider uppercase">Instagram Handle</div>
                    <div className="text-sm font-semibold text-slate-700 dark:text-slate-200 mt-1 flex items-center justify-between gap-2">
                      <span>{selectedLead.instagram_handle ? `@${selectedLead.instagram_handle}` : '—'}</span>
                      {selectedLead.instagram_handle && (
                        <button onClick={() => copyToClipboard(selectedLead.instagram_handle, 'ig')} className="text-purple-400 hover:text-white">
                          {copiedId === 'ig' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="col-span-2 p-3 bg-slate-50 dark:bg-[#171922] border border-slate-200 dark:border-white/5 rounded-xl">
                    <div className="text-[10px] text-slate-500 font-mono tracking-wider uppercase">Business Address</div>
                    <div className="text-xs text-slate-300 mt-1 flex items-start gap-1">
                      <MapPin className="w-3.5 h-3.5 text-rose-400 flex-shrink-0 mt-0.5" />
                      <span>{selectedLead.address || '—'}</span>
                    </div>
                  </div>
                </div>

                {/* Edit Form Fields */}
                <div className="space-y-4">
                  {/* Status Dropdowns */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] text-slate-500 font-mono tracking-wider uppercase mb-1.5">Outreach Status</label>
                      <div className="relative">
                        <select 
                          value={selectedLead.outreach_status}
                          onChange={(e) => {
                            const newStatus = e.target.value;
                            handleUpdateLeadDetail({
                              ...selectedLead,
                              outreach_status: newStatus,
                              last_contacted: newStatus !== 'Not Contacted' ? new Date().toISOString().split('T')[0] : selectedLead.last_contacted
                            });
                          }}
                          className="w-full appearance-none bg-slate-100 dark:bg-[#171922] border border-slate-200 dark:border-white/5 rounded-xl py-2.5 px-3 pr-8 text-xs text-slate-600 dark:text-slate-300 outline-none focus:border-indigo-500/50"
                        >
                          {STATUS_OPTIONS.map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] text-slate-500 font-mono tracking-wider uppercase mb-1.5">Priority</label>
                      <div className="relative">
                        <select 
                          value={selectedLead.priority}
                          onChange={(e) => handleUpdateLeadDetail({ ...selectedLead, priority: e.target.value })}
                          className="w-full appearance-none bg-slate-100 dark:bg-[#171922] border border-slate-200 dark:border-white/5 rounded-xl py-2.5 px-3 pr-8 text-xs text-slate-600 dark:text-slate-300 outline-none focus:border-indigo-500/50"
                        >
                          <option value="HIGH">High</option>
                          <option value="MED">Medium</option>
                          <option value="LOW">Low</option>
                        </select>
                        <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  {/* Dates & Status */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] text-slate-500 font-mono tracking-wider uppercase mb-1.5">Follow Up Date</label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
                        <input 
                          type="date"
                          value={selectedLead.follow_up_date || ''}
                          onChange={(e) => handleUpdateLeadDetail({ ...selectedLead, follow_up_date: e.target.value })}
                          className="w-full bg-slate-50 dark:bg-[#171922] border border-slate-200 dark:border-white/5 rounded-xl py-2 pl-9 pr-3 text-xs text-slate-300 outline-none focus:border-indigo-500/50"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] text-slate-500 font-mono tracking-wider uppercase mb-1.5">Website Status</label>
                      <div className="relative">
                        <select 
                          value={selectedLead.website_status}
                          onChange={(e) => handleUpdateLeadDetail({ ...selectedLead, website_status: e.target.value })}
                          className="w-full appearance-none bg-slate-100 dark:bg-[#171922] border border-slate-200 dark:border-white/5 rounded-xl py-2.5 px-3 pr-8 text-xs text-slate-600 dark:text-slate-300 outline-none focus:border-indigo-500/50"
                        >
                          <option value="no">No Website</option>
                          <option value="Needs Redesign">Needs Redesign</option>
                          <option value="Outdated">Outdated / Legacy</option>
                          <option value="Good">Good / Responsive</option>
                        </select>
                        <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  {/* Notes Area */}
                  <div>
                    <label className="block text-[10px] text-slate-500 font-mono tracking-wider uppercase mb-1.5">Outreach Conversation Notes</label>
                    <textarea 
                      rows="6"
                      value={selectedLead.notes || ''}
                      onChange={(e) => handleUpdateLeadDetail({ ...selectedLead, notes: e.target.value })}
                      placeholder="Add meeting notes, call recap, design requests or project budget estimate..."
                      className="w-full bg-slate-50 dark:bg-[#171922] border border-slate-200 dark:border-white/5 rounded-xl p-3 text-xs text-slate-300 outline-none focus:border-indigo-500/50 resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Action Save Button */}
              <div className="pt-4 border-t border-white/5 flex gap-2">
                <button 
                  onClick={() => setSelectedLead(null)}
                  className="flex-1 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10 py-2.5 rounded-xl text-xs font-semibold"
                >
                  Close Profile
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ADD LEAD SLIDE DRAWER */}
      <AnimatePresence>
        {isAddLeadOpen && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddLeadOpen(false)}
              className="fixed inset-0 bg-black z-50 cursor-pointer"
            />
            {/* Form Drawer */}
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-lg bg-white dark:bg-[#0c0e12] border-l border-slate-200 dark:border-white/10 z-50 shadow-2xl p-6 overflow-y-auto flex flex-col justify-between"
            >
              <form onSubmit={handleAddLead} className="h-full flex flex-col justify-between">
                <div>
                  {/* Header */}
                  <div className="flex items-center justify-between pb-5 border-b border-white/5 mb-6">
                    <div>
                      <h2 className="font-extrabold text-xl text-slate-800 dark:text-slate-100">Add New Agency Lead</h2>
                      <p className="text-xs text-slate-400">Add manually to your prospecting database</p>
                    </div>
                    <button 
                      type="button"
                      onClick={() => setIsAddLeadOpen(false)}
                      className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition duration-150"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    {/* Business Name */}
                    <div>
                      <label className="block text-[10px] text-slate-500 font-mono tracking-wider uppercase mb-1.5">Business Name *</label>
                      <input 
                        type="text"
                        required
                        value={newLeadForm.business_name}
                        onChange={(e) => setNewLeadForm({ ...newLeadForm, business_name: e.target.value })}
                        placeholder="e.g. Studio Hair & Styling"
                        className="w-full bg-slate-50 dark:bg-[#171922] border border-slate-200 dark:border-white/5 rounded-xl py-2.5 px-3 text-xs text-slate-300 outline-none focus:border-indigo-500/50"
                      />
                    </div>

                    {/* Category & Phone */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] text-slate-500 font-mono tracking-wider uppercase mb-1.5">Category</label>
                        <input 
                          type="text"
                          value={newLeadForm.category}
                          onChange={(e) => setNewLeadForm({ ...newLeadForm, category: e.target.value })}
                          placeholder="e.g. hair salon, dentist"
                          className="w-full bg-slate-50 dark:bg-[#171922] border border-slate-200 dark:border-white/5 rounded-xl py-2.5 px-3 text-xs text-slate-300 outline-none focus:border-indigo-500/50"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] text-slate-500 font-mono tracking-wider uppercase mb-1.5">Outreach Phone</label>
                        <input 
                          type="text"
                          value={newLeadForm.phone}
                          onChange={(e) => setNewLeadForm({ ...newLeadForm, phone: e.target.value })}
                          placeholder="e.g. +44 20 8304 4456"
                          className="w-full bg-slate-50 dark:bg-[#171922] border border-slate-200 dark:border-white/5 rounded-xl py-2.5 px-3 text-xs text-slate-300 outline-none focus:border-indigo-500/50 font-mono"
                        />
                      </div>
                    </div>

                    {/* Address */}
                    <div>
                      <label className="block text-[10px] text-slate-500 font-mono tracking-wider uppercase mb-1.5">Business Address</label>
                      <input 
                        type="text"
                        value={newLeadForm.address}
                        onChange={(e) => setNewLeadForm({ ...newLeadForm, address: e.target.value })}
                        placeholder="Full physical address or city info"
                        className="w-full bg-slate-50 dark:bg-[#171922] border border-slate-200 dark:border-white/5 rounded-xl py-2.5 px-3 text-xs text-slate-300 outline-none focus:border-indigo-500/50"
                      />
                    </div>

                    {/* Instagram & Website */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] text-slate-500 font-mono tracking-wider uppercase mb-1.5">Instagram Handle</label>
                        <input 
                          type="text"
                          value={newLeadForm.instagram_handle}
                          onChange={(e) => setNewLeadForm({ ...newLeadForm, instagram_handle: e.target.value })}
                          placeholder="e.g. studio_hair_design"
                          className="w-full bg-slate-50 dark:bg-[#171922] border border-slate-200 dark:border-white/5 rounded-xl py-2.5 px-3 text-xs text-slate-300 outline-none focus:border-indigo-500/50"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] text-slate-500 font-mono tracking-wider uppercase mb-1.5">Website Status</label>
                        <div className="relative">
                          <select 
                            value={newLeadForm.website_status}
                            onChange={(e) => setNewLeadForm({ ...newLeadForm, website_status: e.target.value })}
                            className="w-full appearance-none bg-slate-100 dark:bg-[#171922] border border-slate-200 dark:border-white/5 rounded-xl py-2.5 px-3 pr-8 text-xs text-slate-600 dark:text-slate-300 outline-none focus:border-indigo-500/50"
                          >
                            <option value="no">No Website</option>
                            <option value="Needs Redesign">Needs Redesign</option>
                            <option value="Outdated">Outdated / Legacy</option>
                            <option value="Good">Good / Responsive</option>
                          </select>
                          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                        </div>
                      </div>
                    </div>

                    {/* Priority & Status */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] text-slate-500 font-mono tracking-wider uppercase mb-1.5">Priority</label>
                        <div className="relative">
                          <select 
                            value={newLeadForm.priority}
                            onChange={(e) => setNewLeadForm({ ...newLeadForm, priority: e.target.value })}
                            className="w-full appearance-none bg-slate-100 dark:bg-[#171922] border border-slate-200 dark:border-white/5 rounded-xl py-2.5 px-3 pr-8 text-xs text-slate-600 dark:text-slate-300 outline-none focus:border-indigo-500/50"
                          >
                            <option value="HIGH">High</option>
                            <option value="MED">Medium</option>
                            <option value="LOW">Low</option>
                          </select>
                          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] text-slate-500 font-mono tracking-wider uppercase mb-1.5">Initial Status</label>
                        <div className="relative">
                          <select 
                            value={newLeadForm.outreach_status}
                            onChange={(e) => setNewLeadForm({ ...newLeadForm, outreach_status: e.target.value })}
                            className="w-full appearance-none bg-slate-100 dark:bg-[#171922] border border-slate-200 dark:border-white/5 rounded-xl py-2.5 px-3 pr-8 text-xs text-slate-600 dark:text-slate-300 outline-none focus:border-indigo-500/50"
                          >
                            {STATUS_OPTIONS.map(opt => (
                              <option key={opt} value={opt}>{opt}</option>
                            ))}
                          </select>
                          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                        </div>
                      </div>
                    </div>

                    {/* Notes */}
                    <div>
                      <label className="block text-[10px] text-slate-500 font-mono tracking-wider uppercase mb-1.5">Notes / Context</label>
                      <textarea 
                        rows="4"
                        value={newLeadForm.notes}
                        onChange={(e) => setNewLeadForm({ ...newLeadForm, notes: e.target.value })}
                        placeholder="Add background info, design ideas, or specific outreach hooks..."
                        className="w-full bg-slate-50 dark:bg-[#171922] border border-slate-200 dark:border-white/5 rounded-xl p-3 text-xs text-slate-300 outline-none focus:border-indigo-500/50 resize-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-white/5 flex gap-3">
                  <button 
                    type="button"
                    onClick={() => setIsAddLeadOpen(false)}
                    className="flex-1 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10 py-2.5 rounded-xl text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-2.5 rounded-xl text-xs font-semibold hover:brightness-110"
                  >
                    Save Lead
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ADD PROJECT SLIDE DRAWER */}
      <AnimatePresence>
        {isAddProjectOpen && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddProjectOpen(false)}
              className="fixed inset-0 bg-black z-50 cursor-pointer"
            />
            {/* Form Drawer */}
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-lg bg-white dark:bg-[#0c0e12] border-l border-slate-200 dark:border-white/10 z-50 shadow-2xl p-6 overflow-y-auto flex flex-col justify-between"
            >
              <form onSubmit={handleAddProject} className="h-full flex flex-col justify-between">
                <div>
                  {/* Header */}
                  <div className="flex items-center justify-between pb-5 border-b border-white/5 mb-6">
                    <div>
                      <h2 className="font-extrabold text-xl text-slate-800 dark:text-slate-100">Add New Project</h2>
                      <p className="text-xs text-slate-400">Launch a new project tracking module</p>
                    </div>
                    <button 
                      type="button"
                      onClick={() => setIsAddProjectOpen(false)}
                      className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition duration-150"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    {/* Client Name selection */}
                    <div>
                      <label className="block text-[10px] text-slate-500 font-mono tracking-wider uppercase mb-1.5">Client / Lead *</label>
                      {leads.length === 0 ? (
                        <div className="text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 p-3 rounded-xl">
                          No leads available. Please add a lead/client first.
                        </div>
                      ) : (
                        <div className="relative">
                          <select
                            required
                            value={newProjectForm.client_name}
                            onChange={(e) => setNewProjectForm({ ...newProjectForm, client_name: e.target.value })}
                            className="w-full appearance-none bg-slate-50 dark:bg-[#171922] border border-slate-200 dark:border-white/5 rounded-xl py-2.5 px-3 pr-8 text-xs text-slate-650 dark:text-slate-300 outline-none focus:border-indigo-500/50"
                          >
                            <option value="" disabled>Select a Client...</option>
                            {leads.map(lead => (
                              <option key={lead.id} value={lead.business_name}>
                                {lead.business_name}
                              </option>
                            ))}
                          </select>
                          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                        </div>
                      )}
                    </div>

                    {/* Project Name */}
                    <div>
                      <label className="block text-[10px] text-slate-500 font-mono tracking-wider uppercase mb-1.5">Project Name *</label>
                      <input 
                        type="text"
                        required
                        value={newProjectForm.project_name}
                        onChange={(e) => setNewProjectForm({ ...newProjectForm, project_name: e.target.value })}
                        placeholder="e.g. E-Commerce Website Development"
                        className="w-full bg-slate-50 dark:bg-[#171922] border border-slate-200 dark:border-white/5 rounded-xl py-2.5 px-3 text-xs text-slate-600 dark:text-slate-300 outline-none focus:border-indigo-500/50"
                      />
                    </div>

                    {/* Status selection */}
                    <div>
                      <label className="block text-[10px] text-slate-500 font-mono tracking-wider uppercase mb-1.5">Initial Status</label>
                      <div className="relative">
                        <select
                          value={newProjectForm.status}
                          onChange={(e) => setNewProjectForm({ ...newProjectForm, status: e.target.value })}
                          className="w-full appearance-none bg-slate-50 dark:bg-[#171922] border border-slate-200 dark:border-white/5 rounded-xl py-2.5 px-3 pr-8 text-xs text-slate-650 dark:text-slate-300 outline-none focus:border-indigo-500/50"
                        >
                          <option value="Not Started">Not Started</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Revision">Revision</option>
                        </select>
                        <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                      </div>
                    </div>

                    {/* Start Date & Deadline */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] text-slate-500 font-mono tracking-wider uppercase mb-1.5">Start Date</label>
                        <input 
                          type="date"
                          value={newProjectForm.start_date}
                          onChange={(e) => setNewProjectForm({ ...newProjectForm, start_date: e.target.value })}
                          className="w-full bg-slate-50 dark:bg-[#171922] border border-slate-200 dark:border-white/5 rounded-xl py-2.5 px-3 text-xs text-slate-600 dark:text-slate-300 outline-none focus:border-indigo-500/50 font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-slate-500 font-mono tracking-wider uppercase mb-1.5">Deadline</label>
                        <input 
                          type="date"
                          value={newProjectForm.deadline}
                          onChange={(e) => setNewProjectForm({ ...newProjectForm, deadline: e.target.value })}
                          className="w-full bg-slate-50 dark:bg-[#171922] border border-slate-200 dark:border-white/5 rounded-xl py-2.5 px-3 text-xs text-slate-600 dark:text-slate-300 outline-none focus:border-indigo-500/50 font-mono"
                        />
                      </div>
                    </div>

                    {/* Notes */}
                    <div>
                      <label className="block text-[10px] text-slate-500 font-mono tracking-wider uppercase mb-1.5">Project Notes</label>
                      <textarea 
                        value={newProjectForm.notes}
                        onChange={(e) => setNewProjectForm({ ...newProjectForm, notes: e.target.value })}
                        placeholder="Detail scope, technologies, or notes..."
                        rows={4}
                        className="w-full bg-slate-50 dark:bg-[#171922] border border-slate-200 dark:border-white/5 rounded-xl py-2.5 px-3 text-xs text-slate-300 outline-none focus:border-indigo-500/50 resize-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-white/5 flex gap-3 mt-6">
                  <button 
                    type="button"
                    onClick={() => setIsAddProjectOpen(false)}
                    className="flex-1 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10 py-3 rounded-xl text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={leads.length === 0}
                    className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl text-xs font-semibold hover:brightness-110 disabled:opacity-40"
                  >
                    Launch Project
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ADD INVOICE SLIDE DRAWER */}
      <AnimatePresence>
        {isAddInvoiceOpen && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddInvoiceOpen(false)}
              className="fixed inset-0 bg-black z-50 cursor-pointer"
            />
            {/* Form Drawer */}
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-lg bg-white dark:bg-[#0c0e12] border-l border-slate-200 dark:border-white/10 z-50 shadow-2xl p-6 overflow-y-auto flex flex-col justify-between"
            >
              <form onSubmit={handleAddInvoice} className="h-full flex flex-col justify-between">
                <div>
                  {/* Header */}
                  <div className="flex items-center justify-between pb-5 border-b border-white/5 mb-6">
                    <div>
                      <h2 className="font-extrabold text-xl text-slate-800 dark:text-slate-100">Add New Invoice</h2>
                      <p className="text-xs text-slate-400">Issue an outreach billing statement</p>
                    </div>
                    <button 
                      type="button"
                      onClick={() => setIsAddInvoiceOpen(false)}
                      className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition duration-150"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    {/* Client Name selection */}
                    <div>
                      <label className="block text-[10px] text-slate-500 font-mono tracking-wider uppercase mb-1.5">Client / Lead *</label>
                      {leads.length === 0 ? (
                        <div className="text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 p-3 rounded-xl">
                          No leads available. Please add a lead/client first.
                        </div>
                      ) : (
                        <div className="relative">
                          <select
                            required
                            value={newInvoiceForm.client_name}
                            onChange={(e) => {
                              setNewInvoiceForm({ 
                                ...newInvoiceForm, 
                                client_name: e.target.value,
                                project_id: '' // Reset project link on client change
                              });
                            }}
                            className="w-full appearance-none bg-slate-50 dark:bg-[#171922] border border-slate-200 dark:border-white/5 rounded-xl py-2.5 px-3 pr-8 text-xs text-slate-600 dark:text-slate-300 outline-none focus:border-indigo-500/50"
                          >
                            <option value="" disabled>Select a Client...</option>
                            {leads.map(lead => (
                              <option key={lead.id} value={lead.business_name}>
                                {lead.business_name}
                              </option>
                            ))}
                          </select>
                          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                        </div>
                      )}
                    </div>

                    {/* Project Link selection (dynamically filtered by selected client) */}
                    <div>
                      <label className="block text-[10px] text-slate-500 font-mono tracking-wider uppercase mb-1.5">Link to Project (Optional)</label>
                      {!newInvoiceForm.client_name ? (
                        <div className="text-[10px] text-slate-450 italic bg-slate-100/50 dark:bg-white/[0.02] p-2.5 border border-slate-200 dark:border-white/5 rounded-xl">
                          Please select a Client first to see active projects.
                        </div>
                      ) : (
                        <div className="relative">
                          <select
                            value={newInvoiceForm.project_id}
                            onChange={(e) => setNewInvoiceForm({ ...newInvoiceForm, project_id: e.target.value })}
                            className="w-full appearance-none bg-slate-50 dark:bg-[#171922] border border-slate-200 dark:border-white/5 rounded-xl py-2.5 px-3 pr-8 text-xs text-slate-600 dark:text-slate-300 outline-none focus:border-indigo-500/50"
                          >
                            <option value="">General (No project link)</option>
                            {projects.filter(p => p.client_name === newInvoiceForm.client_name).map(project => (
                              <option key={project.id} value={project.id}>
                                {project.project_name} ({project.status})
                              </option>
                            ))}
                          </select>
                          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                        </div>
                      )}
                    </div>

                    {/* Amount & Currency */}
                    <div className="grid grid-cols-3 gap-4">
                      <div className="col-span-2">
                        <label className="block text-[10px] text-slate-500 font-mono tracking-wider uppercase mb-1.5">Amount *</label>
                        <input 
                          type="number"
                          required
                          step="0.01"
                          min="0"
                          value={newInvoiceForm.amount}
                          onChange={(e) => setNewInvoiceForm({ ...newInvoiceForm, amount: e.target.value })}
                          placeholder="e.g. 1500.00"
                          className="w-full bg-slate-55 dark:bg-[#171922] border border-slate-200 dark:border-white/5 rounded-xl py-2.5 px-3 text-xs text-slate-600 dark:text-slate-300 outline-none focus:border-indigo-500/50 font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-slate-500 font-mono tracking-wider uppercase mb-1.5">Currency</label>
                        <div className="relative">
                          <select
                            value={newInvoiceForm.currency}
                            onChange={(e) => setNewInvoiceForm({ ...newInvoiceForm, currency: e.target.value })}
                            className="w-full appearance-none bg-slate-55 dark:bg-[#171922] border border-slate-200 dark:border-white/5 rounded-xl py-2.5 px-3 pr-8 text-xs text-slate-600 dark:text-slate-300 outline-none focus:border-indigo-500/50 font-mono"
                          >
                            <option value="USD">USD ($)</option>
                            <option value="INR">INR (₹)</option>
                          </select>
                          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                        </div>
                      </div>
                    </div>

                    {/* Initial Status */}
                    <div>
                      <label className="block text-[10px] text-slate-500 font-mono tracking-wider uppercase mb-1.5">Status</label>
                      <div className="relative">
                        <select
                          value={newInvoiceForm.status}
                          onChange={(e) => setNewInvoiceForm({ ...newInvoiceForm, status: e.target.value })}
                          className="w-full appearance-none bg-slate-55 dark:bg-[#171922] border border-slate-200 dark:border-white/5 rounded-xl py-2.5 px-3 pr-8 text-xs text-slate-600 dark:text-slate-300 outline-none focus:border-indigo-500/50"
                        >
                          <option value="Draft">Draft</option>
                          <option value="Sent">Sent</option>
                          <option value="Paid">Paid</option>
                          <option value="Overdue">Overdue</option>
                        </select>
                        <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                      </div>
                    </div>

                    {/* Due Date */}
                    <div>
                      <label className="block text-[10px] text-slate-500 font-mono tracking-wider uppercase mb-1.5">Due Date</label>
                      <input 
                        type="date"
                        value={newInvoiceForm.due_date}
                        onChange={(e) => setNewInvoiceForm({ ...newInvoiceForm, due_date: e.target.value })}
                        className="w-full bg-slate-55 dark:bg-[#171922] border border-slate-200 dark:border-white/5 rounded-xl py-2.5 px-3 text-xs text-slate-600 dark:text-slate-300 outline-none focus:border-indigo-500/50 font-mono"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-white/5 flex gap-3 mt-6">
                  <button 
                    type="button"
                    onClick={() => setIsAddInvoiceOpen(false)}
                    className="flex-1 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10 py-3 rounded-xl text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={leads.length === 0}
                    className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl text-xs font-semibold hover:brightness-110 disabled:opacity-40"
                  >
                    Create Invoice
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* SETTINGS MODAL */}
      <AnimatePresence>
        {isSettingsOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSettingsOpen(false)}
              className="absolute inset-0 bg-black cursor-pointer"
            />
            
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-lg bg-white dark:bg-[#0c0e12] border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl p-6 overflow-hidden z-10"
            >
              <div className="flex items-center justify-between pb-4 border-b border-white/5 mb-5">
                <div className="flex items-center gap-2">
                  <Settings className="w-5 h-5 text-indigo-400" />
                  <h2 className="font-extrabold text-lg text-slate-800 dark:text-slate-100">Vexo TeamX CRM Engine Config</h2>
                </div>
                <button 
                  onClick={() => setIsSettingsOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveSettings} className="space-y-4">
                {/* Database selection */}
                <div>
                  <label className="block text-[10px] text-slate-500 font-mono tracking-wider uppercase mb-2">Storage Engine Mode</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button 
                      type="button"
                      onClick={() => setTempMode('local')}
                      className={`py-3 px-4 rounded-xl border text-left flex flex-col justify-between transition ${
                        tempMode === 'local' 
                          ? 'bg-indigo-600/10 border-indigo-500 text-slate-800 dark:text-slate-100' 
                          : 'bg-[#171922] border-white/5 text-slate-400 hover:border-white/10'
                      }`}
                    >
                      <Database className="w-4.5 h-4.5 mb-1.5" />
                      <div>
                        <div className="text-xs font-bold">Local Sandbox</div>
                        <div className="text-[9px] text-slate-400 mt-0.5">Saves to LocalStorage (Fast & Offline)</div>
                      </div>
                    </button>

                    <button 
                      type="button"
                      onClick={() => setTempMode('sheets')}
                      className={`py-3 px-4 rounded-xl border text-left flex flex-col justify-between transition ${
                        tempMode === 'sheets' 
                          ? 'bg-indigo-600/10 border-indigo-500 text-slate-800 dark:text-slate-100' 
                          : 'bg-[#171922] border-white/5 text-slate-400 hover:border-white/10'
                      }`}
                    >
                      <FileSpreadsheet className="w-4.5 h-4.5 mb-1.5" />
                      <div>
                        <div className="text-xs font-bold">Google Sheets API</div>
                        <div className="text-[9px] text-slate-400 mt-0.5">Sync database to spreadsheet rows</div>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Sheets configuration */}
                {tempMode === 'sheets' && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-3 pt-2"
                  >
                    <div>
                      <label className="block text-[10px] text-slate-500 font-mono tracking-wider uppercase mb-1">Google Sheet ID</label>
                      <input 
                        type="text"
                        value={tempSheetId}
                        onChange={(e) => setTempSheetId(e.target.value)}
                        placeholder="e.g. 1a2b3c4d5e6f7g8h9i0j..."
                        className="w-full bg-slate-50 dark:bg-[#171922] border border-slate-200 dark:border-white/5 rounded-xl py-2.5 px-3 text-xs text-slate-300 outline-none focus:border-indigo-500/50 font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] text-slate-500 font-mono tracking-wider uppercase mb-1">Google Cloud API Key (v4)</label>
                      <input 
                        type="password"
                        value={tempApiKey}
                        onChange={(e) => setTempApiKey(e.target.value)}
                        placeholder="AIzaSy..."
                        className="w-full bg-slate-50 dark:bg-[#171922] border border-slate-200 dark:border-white/5 rounded-xl py-2.5 px-3 text-xs text-slate-300 outline-none focus:border-indigo-500/50 font-mono"
                      />
                    </div>
                    
                    <div className="flex gap-2">
                      <button 
                        type="button"
                        onClick={fetchFromGoogleSheets}
                        disabled={syncing || !tempSheetId || !tempApiKey}
                        className="flex-1 bg-white/5 hover:bg-white/10 text-white border border-white/5 text-[11px] font-semibold py-2 px-3 rounded-lg flex items-center justify-center gap-1.5"
                      >
                        <Download className="w-3.5 h-3.5" />
                        Import Sheet
                      </button>
                      <button 
                        type="button"
                        onClick={() => syncWithGoogleSheets({ mode: 'sheets', sheetId: tempSheetId, apiKey: tempApiKey })}
                        disabled={syncing || !tempSheetId || !tempApiKey}
                        className="flex-1 bg-white/5 hover:bg-white/10 text-white border border-white/5 text-[11px] font-semibold py-2 px-3 rounded-lg flex items-center justify-center gap-1.5"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        Export to Sheet
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* CSV export utilities */}
                <div className="pt-3 border-t border-white/5 space-y-2">
                  <label className="block text-[10px] text-slate-500 font-mono tracking-wider uppercase mb-1.5">Backup Tools</label>
                  <button 
                    type="button"
                    onClick={exportLocalCSV}
                    className="w-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 text-slate-600 dark:text-slate-300 py-2 px-4 rounded-xl text-xs font-semibold hover:bg-slate-200 dark:hover:bg-white/10 flex items-center justify-center gap-2"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download Vexo TeamX CRM Data as CSV (.csv)
                  </button>
                  <button 
                    type="button"
                    onClick={handleResetToDefault}
                    className="w-full bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 py-2 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Reset to Default Clean CSV Data
                  </button>
                </div>

                {/* About & Ownership Section */}
                <div className="pt-3 border-t border-slate-200 dark:border-white/5 space-y-2">
                  <label className="block text-[10px] text-slate-500 font-mono tracking-wider uppercase mb-1">About CRM</label>
                  <div className="bg-slate-50 dark:bg-[#171922] border border-slate-200 dark:border-white/5 rounded-xl p-3 text-xs space-y-1.5 text-slate-600 dark:text-slate-400">
                    <div className="flex justify-between">
                      <span className="font-medium text-slate-500 dark:text-slate-500">CRM Name</span>
                      <span className="font-bold text-slate-700 dark:text-slate-200">Vexo TeamX CRM</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-slate-500 dark:text-slate-500">Owner/Founder</span>
                      <span className="font-bold text-slate-700 dark:text-slate-200">Sarfaraz</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-slate-500 dark:text-slate-500">Company</span>
                      <span className="font-bold text-slate-700 dark:text-slate-200">Vexo TeamX</span>
                    </div>
                    <div className="flex flex-col pt-1 border-t border-slate-200 dark:border-white/5 mt-1 gap-0.5">
                      <span className="font-medium text-slate-500 dark:text-slate-500">Built for</span>
                      <span className="font-semibold text-slate-700 dark:text-slate-300">Internal lead management & client outreach tracking</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200 dark:border-white/5 flex gap-2">
                  <button 
                    type="button"
                    onClick={() => setIsSettingsOpen(false)}
                    className="flex-1 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10 py-2.5 rounded-xl text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-2.5 rounded-xl text-xs font-semibold hover:brightness-110"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
