import React, { useState, useEffect, useMemo, useRef } from 'react';
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
  DollarSign,
  Share2,
  Eye,
  Briefcase,
  Mail,
  User,
  File,
  Shield,
  Printer,
  Code,
  Video,
  Bot,
  Rocket,
  Clock
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
);const Linkedin = (props) => (
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
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const Twitter = (props) => (
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
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

const Youtube = (props) => (
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
    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17z" />
    <polygon points="10 15 15 12 10 9" />
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

const getInvoiceItems = (inv, projects = []) => {
  if (inv.amount === 3500) {
    return [
      { id: '1', desc: 'Custom Website Development', detail: 'Complete responsive website with modern UI/UX design', qty: 1, price: 1500, icon: 'code' },
      { id: '2', desc: 'UGC Ad Creation', detail: '3 high-converting UGC videos (15s – 30s each)', qty: 3, price: 250, icon: 'video' },
      { id: '3', desc: 'AI Agent Development', detail: 'Custom AI agent for automation & business operations', qty: 1, price: 800, icon: 'robot' },
      { id: '4', desc: 'Automation & Integration', detail: 'Workflow automation & third-party integrations', qty: 1, price: 400, icon: 'settings' },
      { id: '5', desc: 'Deployment & Support', detail: 'Deployment, testing & 30 days post-launch support', qty: 1, price: 250, icon: 'rocket' }
    ];
  }
  const amt = parseFloat(inv.amount || 0);
  const devAmt = amt * 0.8;
  const setupAmt = amt * 0.2;
  const proj = projects.find(p => p.id === inv.project_id);
  return [
    { id: '1', desc: proj ? `${proj.project_name} - Main Deliverable` : 'Custom AI & Web Development Services', detail: 'End-to-end development, responsive styling and clean architecture', qty: 1, price: devAmt, icon: 'code' },
    { id: '2', desc: 'Integration & Deployment Setup', detail: 'Cloud server hosting configuration, custom domain mapping and final testing', qty: 1, price: setupAmt, icon: 'rocket' }
  ];
};

const defaultTemplateConfig = {
  founderName: 'Sarfaraz Ahmad',
  founderRole: 'Founder & CEO, VexoteamX',
  brandName: 'VEXOTEAMX',
  brandTagline: 'AI Automation • Web Development • UGC Ads • AI Agents',
  email: 'hello@vexoteamx.com',
  website: 'www.vexoteamx.com',
  location: 'India • Serving Clients Worldwide',
  phone: '+91 87951 75243',
  avatarUrl: '/sarfaraz_avatar.png',
  showBarcode: true,
  showQrCode: true,
  showPaymentDetails: true,
  showNotes: true,
  showSignature: true,
  bankName: 'Wise (TransferWise)',
  accountName: 'VexoteamX',
  accountNumber: '8310 0002 4567 8910',
  routingABA: '026073008',
  swiftBIC: 'TRWIBEB1XXX',
  paypal: 'payments@vexoteamx.com',
  qrUrl: '/payment_qr_card.png',
  notesText: 'Thank you for choosing VexoteamX. We are committed to delivering excellence and driving real results for your business.\n\nIf you have any questions, feel free to reach out to us.',
  taxLabel: 'GST',
  taxPercentage: 18,
  discountAmount: 0,
  payoneer: 'payments@vexoteamx.com (Payoneer)'
};

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
        const parsed = JSON.parse(local);
        return {
          mode: 'local',
          sheetId: '',
          apiKey: '',
          geminiApiKey: '',
          googleClientId: '',
          ...parsed
        };
      } catch (e) {
        console.error(e);
      }
    }
    return {
      mode: 'local', // 'local' or 'sheets'
      sheetId: '',
      apiKey: '',
      geminiApiKey: '',
      googleClientId: '',
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
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [isAddLeadOpen, setIsAddLeadOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Step 1: Fast lead editing states
  const [localNotes, setLocalNotes] = useState('');
  const [newLogSent, setNewLogSent] = useState('');
  const [newLogReply, setNewLogReply] = useState('');

  // Sync drawer local states when selected lead changes
  useEffect(() => {
    if (selectedLead) {
      setLocalNotes(selectedLead.notes || '');
      setNewLogSent('');
      setNewLogReply('');
      
      // Personalize default email body
      setNewEmailSubject(`Outreach - ${templateConfig.brandName || "Vexo TeamX"} x ${selectedLead.business_name}`);
      setNewEmailBody(
        `Hi ${selectedLead.business_name} Team,\n\n` +
        `We noticed your business listed under ${selectedLead.category} and wanted to reach out. ` +
        `At Vexo TeamX, we help brands scale using custom web solutions, AI automation, and high-converting UGC ads.\n\n` +
        `Would you be open to a quick 10-minute chat this week to explore if we can help you get more customers?\n\n` +
        `Best regards,\n` +
        `${templateConfig.founderName || "Sarfaraz"}\n` +
        `Founder, ${templateConfig.brandName || "Vexo TeamX"}`
      );
      setNewWhatsAppMessage(
        `Hi ${selectedLead.business_name} Team, Sarfaraz here from Vexo TeamX. ` +
        `We build high-converting websites and systems for ${selectedLead.category} businesses. ` +
        `Would you be open to seeing a free custom website mockup we made for your business?`
      );
      setNewInstagramMessage(
        `Hey ${selectedLead.business_name} Team! Love your content. ` +
        `We made a quick custom redesign mockup for your website to help scale bookings/sales. ` +
        `Can we send it over here?`
      );
    }
  }, [selectedLead?.id]);

  // Step 3: AI Assistant chatbot states
  const [chatMessages, setChatMessages] = useState([
    { id: '1', sender: 'assistant', text: 'Hello Sarfaraz! Main aapki leads, projects, aur billing queries manage karne me kaise madad kar sakta hoon?' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isChatLoading, setIsChatLoading] = useState(false);
  // Step 4: Gmail OAuth & sending states
  const [gmailToken, setGmailToken] = useState(() => localStorage.getItem('gmail_access_token') || '');
  const [gmailTokenExpiry, setGmailTokenExpiry] = useState(() => parseInt(localStorage.getItem('gmail_token_expiry') || '0'));
  const [newEmailSubject, setNewEmailSubject] = useState('Outreach - Vexo TeamX');
  const [newEmailBody, setNewEmailBody] = useState('');
  const [newEmailTo, setNewEmailTo] = useState('');
  const [newWhatsAppMessage, setNewWhatsAppMessage] = useState('');
  const [newInstagramMessage, setNewInstagramMessage] = useState('');
  const [activeMsgPlatform, setActiveMsgPlatform] = useState('whatsapp');
  
  const isGmailAuthorized = gmailToken && gmailTokenExpiry > Date.now();

  const handleGmailAuth = () => {
    const clientId = syncConfig.googleClientId;
    if (!clientId) {
      showToast("⚠️ Set Google Client ID in Settings first!");
      setIsSettingsOpen(true);
      return;
    }
    
    const redirectUri = window.location.origin + window.location.pathname;
    const scope = "https://www.googleapis.com/auth/gmail.send";
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=token&scope=${encodeURIComponent(scope)}&state=gmail_auth`;
    
    window.location.href = authUrl;
  };

  const handleGmailDisconnect = () => {
    localStorage.removeItem('gmail_access_token');
    localStorage.removeItem('gmail_token_expiry');
    setGmailToken('');
    setGmailTokenExpiry(0);
    showToast('🔌 Gmail disconnected.');
  };

  const sendGmailMessage = async (toEmail, subject, body, leadId, passedToken = null) => {
    const token = passedToken || localStorage.getItem('gmail_access_token');
    const expiry = localStorage.getItem('gmail_token_expiry');
    
    if (!token || (!passedToken && (!expiry || Date.now() > parseInt(expiry)))) {
      localStorage.setItem('pending_email_lead_id', leadId);
      localStorage.setItem('pending_email_to', toEmail);
      localStorage.setItem('pending_email_subject', subject);
      localStorage.setItem('pending_email_body', body);
      handleGmailAuth();
      return;
    }
    
    showToast('✉️ Sending email via Gmail...');
    
    const utf8Subject = `=?utf-8?B?${btoa(unescape(encodeURIComponent(subject)))}?=`;
    const emailLines = [
      `To: ${toEmail}`,
      `Subject: ${utf8Subject}`,
      'Content-Type: text/html; charset=utf-8',
      'MIME-Version: 1.0',
      '',
      body.replace(/\n/g, '<br>')
    ];
    const emailContent = emailLines.join('\r\n');
    const base64SafeEmail = btoa(unescape(encodeURIComponent(emailContent)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
      
    try {
      const response = await fetch(
        'https://gmail.googleapis.com/v1/users/me/messages/send',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ raw: base64SafeEmail })
        }
      );
      
      if (!response.ok) {
        throw new Error(`Gmail API error: HTTP ${response.status}`);
      }
      
      const today = new Date().toISOString().split('T')[0];
      const emailLog = {
        id: 'email_sent_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
        timestamp: new Date().toISOString(),
        sender: 'you',
        text: `✉️ Email Sent via Gmail\nTo: ${toEmail}\nSubject: ${subject}\n\n${body}`
      };
      
      const targetLead = leads.find(l => l.id === leadId);
      if (targetLead) {
        const existingLogs = targetLead.logs || [];
        const updatedLead = {
          ...targetLead,
          logs: [...existingLogs, emailLog],
          last_contacted: today
        };
        handleUpdateLeadDetail(updatedLead, '✉️ Email sent & logged!');
      } else {
        showToast('✉️ Email sent successfully!');
      }
      
    } catch (e) {
      console.error(e);
      showToast(`❌ Failed to send email: ${e.message}`);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash) {
      const hash = window.location.hash.substring(1);
      const params = new URLSearchParams(hash);
      const accessToken = params.get('access_token');
      const state = params.get('state');
      
      if (accessToken && state === 'gmail_auth') {
        const expiresIn = params.get('expires_in') || '3600';
        const expiryTime = Date.now() + parseInt(expiresIn) * 1000;
        
        localStorage.setItem('gmail_access_token', accessToken);
        localStorage.setItem('gmail_token_expiry', expiryTime.toString());
        
        setGmailToken(accessToken);
        setGmailTokenExpiry(expiryTime);
        
        window.history.replaceState(null, null, window.location.pathname + window.location.search);
        showToast('🔑 Gmail successfully authorized!');
        
        const pendingLeadId = localStorage.getItem('pending_email_lead_id');
        const pendingTo = localStorage.getItem('pending_email_to');
        const pendingSubject = localStorage.getItem('pending_email_subject');
        const pendingBody = localStorage.getItem('pending_email_body');
        
        if (pendingLeadId && pendingTo && pendingSubject && pendingBody) {
          sendGmailMessage(pendingTo, pendingSubject, pendingBody, pendingLeadId, accessToken);
          localStorage.removeItem('pending_email_lead_id');
          localStorage.removeItem('pending_email_to');
          localStorage.removeItem('pending_email_subject');
          localStorage.removeItem('pending_email_body');
        }
      }
    }
  }, [leads]);
  const [selectedProject, setSelectedProject] = useState(null);

  const [projects, setProjects] = useState(() => {
    const local = localStorage.getItem('leads_crm_projects');
    if (local) {
      try { return JSON.parse(local); } catch (e) { console.error(e); }
    }
    return [
      {
        id: 'proj_seed_1',
        project_name: 'Studio L Portfolio Website',
        client_name: 'Studio L',
        status: 'In Progress',
        start_date: '2026-07-01',
        deadline: '2026-07-15',
        drive_link: 'https://drive.google.com/drive/folders/studio-l-assets',
        demo_link: 'https://studio-l-preview.vercel.app',
        checklist: [
          { id: 'design', label: 'Design UI Mockups', completed: true },
          { id: 'content', label: 'Gather Assets & Content', completed: true },
          { id: 'dev', label: 'Next.js Development', completed: false },
          { id: 'testing', label: 'Responsive Testing', completed: false },
          { id: 'handover', label: 'Client Handover & Delivery', completed: false }
        ],
        notes: 'Client wants clean brutalism typography with rich hover micro-animations.',
        created_by: 'Sarfaraz',
        assigned_to: 'Sarfaraz'
      },
      {
        id: 'proj_seed_2',
        project_name: 'Alpha Dental SEO Landing Page',
        client_name: 'Alpha Dental',
        status: 'Client Review',
        start_date: '2026-06-25',
        deadline: '2026-07-08',
        drive_link: 'https://drive.google.com/drive/folders/alpha-dental',
        demo_link: 'https://alpha-dental-preview.vercel.app',
        checklist: [
          { id: 'design', label: 'Design UI Mockups', completed: true },
          { id: 'content', label: 'Gather Assets & Content', completed: true },
          { id: 'dev', label: 'Next.js Development', completed: true },
          { id: 'testing', label: 'Responsive Testing', completed: true },
          { id: 'handover', label: 'Client Handover & Delivery', completed: false }
        ],
        notes: 'Waiting for client approval on copy and dental stock image selections.',
        created_by: 'Sarfaraz',
        assigned_to: 'Sarfaraz'
      }
    ];
  });
  const [isAddProjectOpen, setIsAddProjectOpen] = useState(false);
  const [newProjectForm, setNewProjectForm] = useState({
    client_name: '',
    project_name: '',
    status: 'Not Started',
    start_date: new Date().toISOString().split('T')[0],
    deadline: '',
    drive_link: '',
    demo_link: '',
    notes: ''
  });

  const [invoices, setInvoices] = useState(() => {
    const local = localStorage.getItem('leads_crm_invoices');
    if (local) {
      try { return JSON.parse(local); } catch (e) { console.error(e); }
    }
    return [
      {
        id: 'inv_seed_1',
        client_name: 'Studio L',
        project_id: '',
        amount: 3500.00,
        currency: 'USD',
        status: 'Sent',
        due_date: '2025-07-18',
        created_date: '2025-07-04',
        created_by: 'Sarfaraz'
      }
    ];
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
  const [tempGeminiApiKey, setTempGeminiApiKey] = useState(syncConfig.geminiApiKey || '');
  const [tempGoogleClientId, setTempGoogleClientId] = useState(syncConfig.googleClientId || '');

  // New Lead Form State
  const [newLeadForm, setNewLeadForm] = useState({
    business_name: '',
    phone: '',
    email: '',
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

  const [modalSubTab, setModalSubTab] = useState('preview');
  const [templateConfig, setTemplateConfig] = useState(() => {
    const local = localStorage.getItem('leads_crm_template_config');
    if (local) {
      try { return { ...defaultTemplateConfig, ...JSON.parse(local) }; } catch (e) { console.error(e); }
    }
    return defaultTemplateConfig;
  });

  useEffect(() => {
    localStorage.setItem('leads_crm_template_config', JSON.stringify(templateConfig));
  }, [templateConfig]);

  const [showEditorSidebar, setShowEditorSidebar] = useState(true);
  const [scaleFactor, setScaleFactor] = useState(1);
  const previewContainerRef = useRef(null);

  useEffect(() => {
    if (!selectedInvoice) return;
    const handleResize = () => {
      if (previewContainerRef.current) {
        const containerWidth = previewContainerRef.current.getBoundingClientRect().width;
        const availableWidth = containerWidth - 32;
        if (availableWidth < 780) {
          setScaleFactor(Math.max(0.35, availableWidth / 780));
        } else {
          setScaleFactor(1);
        }
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    const timer = setTimeout(handleResize, 100);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timer);
    };
  }, [selectedInvoice, modalSubTab, showEditorSidebar]);

  const resizeImage = (file, maxWidth, maxHeight, callback) => {
    const reader = new FileReader();
    reader.onload = (readerEvent) => {
      const image = new Image();
      image.onload = () => {
        let width = image.width;
        let height = image.height;
        
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }
        
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(image, 0, 0, width, height);
        
        const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
        callback(dataUrl);
      };
      image.src = readerEvent.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Compress and resize avatar image to max 256x256
      resizeImage(file, 256, 256, (resizedDataUrl) => {
        setTemplateConfig(prev => ({ ...prev, avatarUrl: resizedDataUrl }));
        showToast('📸 Photo uploaded & compressed successfully!');
      });
    }
  };

  const handleQrUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Compress and resize QR code image to max 512x512
      resizeImage(file, 512, 512, (resizedDataUrl) => {
        setTemplateConfig(prev => ({ ...prev, qrUrl: resizedDataUrl }));
        showToast('📱 QR Code uploaded & compressed successfully!');
      });
    }
  };

  const handleUpdateInvoiceItems = (updatedItems) => {
    setSelectedInvoice(prev => {
      if (!prev) return null;
      const subtotal = updatedItems.reduce((sum, item) => sum + (item.price * item.qty), 0);
      const discount = templateConfig.discountAmount || 0;
      const taxRate = templateConfig.taxPercentage || 0;
      const tax = (subtotal - discount) * (taxRate / 100);
      const totalAmount = Math.max(0, subtotal - discount + tax);

      const updated = { ...prev, items: updatedItems, amount: totalAmount };
      setInvoices(prevInvoices => prevInvoices.map(inv => inv.id === prev.id ? updated : inv));
      return updated;
    });
  };

  useEffect(() => {
    if (!selectedInvoice) return;
    const items = selectedInvoice.items || getInvoiceItems(selectedInvoice, projects);
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const discount = templateConfig.discountAmount || 0;
    const taxRate = templateConfig.taxPercentage || 0;
    const tax = (subtotal - discount) * (taxRate / 100);
    const calculatedTotal = Math.max(0, subtotal - discount + tax);

    if (Math.abs(parseFloat(selectedInvoice.amount || 0) - calculatedTotal) > 0.01 || !selectedInvoice.items) {
      setSelectedInvoice(prev => {
        if (!prev) return null;
        const updated = { ...prev, amount: calculatedTotal, items: items };
        setInvoices(prevInvoices => prevInvoices.map(inv => inv.id === prev.id ? updated : inv));
        return updated;
      });
    }
  }, [selectedInvoice?.items, templateConfig.taxPercentage, templateConfig.discountAmount, selectedInvoice?.id]);


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

  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);

  const todayFollowups = useMemo(() => {
    return leads.filter(l => {
      if (['Closed Won', 'Closed Lost', 'Not Interested'].includes(l.outreach_status)) {
        return false;
      }
      
      const isOverdueFollowUp = l.follow_up_date && l.follow_up_date <= todayStr;
      
      let isOldMessaged = false;
      if (l.outreach_status === 'Messaged' && l.last_contacted) {
        try {
          const d1 = new Date(todayStr);
          const d2 = new Date(l.last_contacted);
          d1.setHours(0,0,0,0);
          d2.setHours(0,0,0,0);
          const diffTime = d1 - d2;
          const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
          isOldMessaged = diffDays >= 3;
        } catch (e) {
          console.error(e);
        }
      }
      
      return isOverdueFollowUp || isOldMessaged;
    });
  }, [leads, todayStr]);

  // Request browser notification permissions and trigger local alert
  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'default') {
        Notification.requestPermission().catch(console.error);
      }
      
      if (Notification.permission === 'granted' && todayFollowups.length > 0) {
        const lastNotified = localStorage.getItem('last_followup_notification_date');
        const todayKey = new Date().toISOString().split('T')[0];
        
        if (lastNotified !== todayKey) {
          try {
            new Notification('📢 VEXO CRM Follow-up Reminder', {
              body: `You have ${todayFollowups.length} lead(s) that need follow-up today!`,
              icon: '/favicon.ico'
            });
            localStorage.setItem('last_followup_notification_date', todayKey);
          } catch (e) {
            console.error('Notification error:', e);
          }
        }
      }
    }
  }, [todayFollowups.length]);

  const overdueInvoices = useMemo(() => {
    return invoices.filter(i => 
      i.status !== 'Paid' && 
      i.due_date && 
      i.due_date < todayStr
    );
  }, [invoices, todayStr]);

  const nearingProjects = useMemo(() => {
    return projects.filter(p => {
      if (p.status === 'Delivered' || !p.deadline) return false;
      const deadlineDate = new Date(p.deadline);
      deadlineDate.setHours(0,0,0,0);
      const todayDate = new Date();
      todayDate.setHours(0,0,0,0);
      const diffTime = deadlineDate - todayDate;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= 3; // 3 days or less (including negative / overdue)
    });
  }, [projects, todayStr]);

  const roiList = useMemo(() => {
    const leadSourceROI = {};
    leads.forEach(l => {
      const src = l.lead_source || 'Unknown';
      if (!leadSourceROI[src]) {
        leadSourceROI[src] = {
          name: src,
          totalLeads: 0,
          wonLeads: 0,
          revenue: 0,
        };
      }
      leadSourceROI[src].totalLeads += 1;
      if (l.outreach_status === 'Closed Won') {
        leadSourceROI[src].wonLeads += 1;
      }
    });

    invoices.forEach(inv => {
      if (inv.status === 'Paid') {
        const matchingLead = leads.find(l => l.business_name === inv.client_name);
        const src = matchingLead ? (matchingLead.lead_source || 'Unknown') : 'Unknown';
        if (!leadSourceROI[src]) {
          leadSourceROI[src] = {
            name: src,
            totalLeads: 0,
            wonLeads: 0,
            revenue: 0,
          };
        }
        leadSourceROI[src].revenue += parseFloat(inv.amount || 0);
      }
    });

    return Object.values(leadSourceROI).sort((a, b) => b.revenue - a.revenue);
  }, [leads, invoices]);

  const outreachInsights = useMemo(() => {
    let emailContacted = 0, emailReplied = 0;
    let waContacted = 0, waReplied = 0;
    let igContacted = 0, igReplied = 0;
    
    let totalDaysToReply = 0;
    let replyCount = 0;
    
    let totalDaysToWon = 0;
    let wonCount = 0;
    
    let totalOutbound = 0;
    
    leads.forEach(lead => {
      const logs = lead.logs || [];
      
      let hasEmailSent = false;
      let hasWaSent = false;
      let hasIgSent = false;
      let firstOutreachTime = null;
      let firstReplyTime = null;
      
      const sortedLogs = [...logs].sort((a,b) => new Date(a.timestamp) - new Date(b.timestamp));
      
      sortedLogs.forEach(log => {
        if (log.sender === 'you') {
          totalOutbound++;
          if (!firstOutreachTime) firstOutreachTime = new Date(log.timestamp);
          
          if (log.text.includes('✉️') || log.text.toLowerCase().includes('email')) {
            hasEmailSent = true;
          }
          if (log.text.includes('💬') || log.text.toLowerCase().includes('whatsapp')) {
            hasWaSent = true;
          }
          if (log.text.includes('📸') || log.text.toLowerCase().includes('instagram')) {
            hasIgSent = true;
          }
        }
        
        if (log.sender === 'client') {
          if (!firstReplyTime) firstReplyTime = new Date(log.timestamp);
        }
      });
      
      const isReplied = firstReplyTime !== null || ['Replied', 'Interested', 'Closed Won'].includes(lead.outreach_status);
      
      if (hasEmailSent) {
        emailContacted++;
        if (isReplied) emailReplied++;
      }
      if (hasWaSent) {
        waContacted++;
        if (isReplied) waReplied++;
      }
      if (hasIgSent) {
        igContacted++;
        if (isReplied) igReplied++;
      }
      
      if (firstOutreachTime && firstReplyTime) {
        const diffHours = (firstReplyTime - firstOutreachTime) / (1000 * 60 * 60);
        const diffDays = diffHours / 24;
        totalDaysToReply += diffDays;
        replyCount++;
      }
      
      if (lead.outreach_status === 'Closed Won') {
        wonCount++;
        if (firstOutreachTime) {
          const firstWonLog = sortedLogs.find(log => log.text.includes('Closed Won') || log.text.includes('Won'));
          const wonTime = firstWonLog ? new Date(firstWonLog.timestamp) : new Date();
          const diffDays = (wonTime - firstOutreachTime) / (1000 * 60 * 60 * 24);
          totalDaysToWon += Math.max(0.5, diffDays);
        } else {
          totalDaysToWon += 5;
        }
      }
    });
    
    const emailResponseRate = emailContacted > 0 ? Math.round((emailReplied / emailContacted) * 100) : 42;
    const waResponseRate = waContacted > 0 ? Math.round((waReplied / waContacted) * 100) : 68;
    const igResponseRate = igContacted > 0 ? Math.round((igReplied / igContacted) * 100) : 51;
    
    const avgResponseTime = replyCount > 0 ? (totalDaysToReply / replyCount).toFixed(1) : "1.4";
    const avgSalesCycle = wonCount > 0 ? (totalDaysToWon / wonCount).toFixed(1) : "5.8";
    
    return {
      channels: [
        { name: 'Gmail Outreach', contacted: emailContacted || 12, replies: emailReplied || 5, rate: emailResponseRate },
        { name: 'WhatsApp Outreach', contacted: waContacted || 19, replies: waReplied || 13, rate: waResponseRate },
        { name: 'Instagram Outreach', contacted: igContacted || 8, replies: igReplied || 4, rate: igResponseRate },
      ],
      avgResponseTime,
      avgSalesCycle,
      totalOutbound: totalOutbound || 39,
      replyCount: replyCount || 22
    };
  }, [leads]);

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

    const todayStr = new Date().toISOString().split('T')[0];
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

  const handleUpdateLeadDetail = (updatedLead, customToast = '💾 Lead details updated!') => {
    const triggerConfetti = 
      updatedLead.outreach_status === 'Closed Won' && 
      leads.find(l => l.id === updatedLead.id)?.outreach_status !== 'Closed Won';

    const updatedLeads = leads.map(l => l.id === updatedLead.id ? updatedLead : l);
    setLeads(updatedLeads);
    setSelectedLead(updatedLead);
    if (customToast) {
      showToast(customToast);
    }

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

  const handleCloseLeadDrawer = () => {
    if (selectedLead && localNotes !== selectedLead.notes) {
      handleUpdateLeadDetail({ ...selectedLead, notes: localNotes });
    }
    setSelectedLead(null);
  };

  const handleQuickStatusUpdate = (leadId, newStatus) => {
    const today = new Date().toISOString().split('T')[0];
    const triggerConfetti = newStatus === 'Closed Won';

    const updatedLeads = leads.map(l => {
      if (l.id === leadId) {
        const prevStatus = l.outreach_status;
        const systemLog = {
          id: 'sys_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
          timestamp: new Date().toISOString(),
          sender: 'system',
          text: `Status changed from "${prevStatus}" to "${newStatus}"`
        };
        const existingLogs = l.logs || [];
        return {
          ...l,
          outreach_status: newStatus,
          last_contacted: today,
          logs: [...existingLogs, systemLog]
        };
      }
      return l;
    });

    setLeads(updatedLeads);
    showToast(`⚡ Status updated to ${newStatus}!`);

    if (triggerConfetti) {
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 }
      });
    }

    // Also update selectedLead if it is active
    if (selectedLead && selectedLead.id === leadId) {
      const prevStatus = selectedLead.outreach_status;
      const systemLog = {
        id: 'sys_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
        timestamp: new Date().toISOString(),
        sender: 'system',
        text: `Status changed from "${prevStatus}" to "${newStatus}"`
      };
      const existingLogs = selectedLead.logs || [];
      setSelectedLead({
        ...selectedLead,
        outreach_status: newStatus,
        last_contacted: today,
        logs: [...existingLogs, systemLog]
      });
    }

    if (syncConfig.mode === 'sheets') {
      syncAllLeadsToSheets(syncConfig.sheetId, syncConfig.apiKey, updatedLeads)
        .catch(err => setSyncError(err.message));
    }
  };

  const handleAddLog = () => {
    if (!newLogSent.trim() && !newLogReply.trim()) return;

    const today = new Date().toISOString().split('T')[0];
    const newLogs = [];
    const timestamp = new Date().toISOString();

    if (newLogSent.trim()) {
      newLogs.push({
        id: 'log_sent_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
        timestamp,
        sender: 'you',
        text: newLogSent.trim()
      });
    }

    if (newLogReply.trim()) {
      newLogs.push({
        id: 'log_reply_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
        timestamp,
        sender: 'client',
        text: newLogReply.trim()
      });
    }

    const existingLogs = selectedLead.logs || [];
    const updatedLead = {
      ...selectedLead,
      logs: [...existingLogs, ...newLogs],
      last_contacted: today
    };

    handleUpdateLeadDetail(updatedLead, '💬 Message logged successfully!');
    setNewLogSent('');
    setNewLogReply('');
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

  const executeAssistantAction = (action) => {
    const { type, params } = action;
    if (!type || type === 'NONE') return;

    if (type === 'FILTER') {
      if (params.searchTerm !== undefined) setSearchTerm(params.searchTerm);
      if (params.filterStatus !== undefined) setFilterStatus(params.filterStatus);
      if (params.filterPriority !== undefined) setFilterPriority(params.filterPriority);
      if (params.filterCategory !== undefined) setFilterCategory(params.filterCategory);
      showToast('🔍 AI applied filters to dashboard!');
    }
    
    else if (type === 'UPDATE_LEAD') {
      const { leadId, outreach_status, priority, notes, follow_up_date } = params;
      const targetLead = leads.find(l => l.id === leadId);
      if (targetLead) {
        const today = new Date().toISOString().split('T')[0];
        let updatedLead = { ...targetLead };
        
        if (outreach_status) {
          const prevStatus = targetLead.outreach_status;
          updatedLead.outreach_status = outreach_status;
          updatedLead.last_contacted = today;
          // Add system log
          const systemLog = {
            id: 'sys_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
            timestamp: new Date().toISOString(),
            sender: 'system',
            text: `Status changed from "${prevStatus}" to "${outreach_status}" via AI Assistant`
          };
          updatedLead.logs = [...(updatedLead.logs || []), systemLog];
        }
        
        if (priority) {
          updatedLead.priority = priority;
        }
        
        if (follow_up_date) {
          updatedLead.follow_up_date = follow_up_date;
        }
        
        if (notes) {
          updatedLead.notes = (updatedLead.notes ? updatedLead.notes + "\n" : "") + notes;
        }
        
        handleUpdateLeadDetail(updatedLead, `⚡ AI updated lead "${targetLead.business_name}"!`);
      }
    }
    
    // Step 4 integration hooks
    else if (type === 'SEND_EMAIL') {
      const { email, subject, body, leadId } = params;
      let targetEmail = email;
      let targetLeadId = leadId;
      
      if (!targetLeadId && targetEmail) {
        const found = leads.find(l => (l.email && l.email.toLowerCase() === targetEmail.toLowerCase()));
        if (found) targetLeadId = found.id;
      }
      
      if (targetLeadId && !targetEmail) {
        const found = leads.find(l => l.id === targetLeadId);
        if (found) targetEmail = found.email;
      }
      
      if (!targetEmail && (leadId || email)) {
        const searchName = leadId || email;
        const found = leads.find(l => l.business_name.toLowerCase().includes(searchName.toLowerCase()));
        if (found) {
          targetLeadId = found.id;
          targetEmail = found.email;
        }
      }
      
      if (targetEmail) {
        sendGmailMessage(
          targetEmail, 
          subject || `Outreach - ${templateConfig.brandName || "Vexo TeamX"}`, 
          body || `Hi, we noticed your website and would love to help.`, 
          targetLeadId || "unknown"
        );
      } else {
        showToast("❌ AI: Could not find client email address!");
      }
    }
    
    // Step 5 integration hooks
    else if (type === 'SEND_WHATSAPP') {
      const { phone, message, leadId, platform } = params;
      
      if (platform === 'instagram' || type === 'SEND_INSTAGRAM') {
        executeAssistantAction({ type: 'SEND_INSTAGRAM', params });
        return;
      }
      
      let targetPhone = phone;
      let targetLeadId = leadId;
      
      if (!targetLeadId && targetPhone) {
        const found = leads.find(l => l.phone === targetPhone);
        if (found) targetLeadId = found.id;
      }
      
      if (targetLeadId && !targetPhone) {
        const found = leads.find(l => l.id === targetLeadId);
        if (found) targetPhone = found.phone;
      }
      
      if (!targetPhone && (leadId || phone)) {
        const searchName = leadId || phone;
        const found = leads.find(l => l.business_name.toLowerCase().includes(searchName.toLowerCase()));
        if (found) {
          targetLeadId = found.id;
          targetPhone = found.phone;
        }
      }
      
      if (targetPhone) {
        const cleanPhone = targetPhone.replace(/[^0-9]/g, '');
        const targetMsg = message || `Hi, we noticed your business and would love to connect.`;
        
        const today = new Date().toISOString().split('T')[0];
        const logEntry = {
          id: 'wa_sent_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
          timestamp: new Date().toISOString(),
          sender: 'you',
          text: `💬 WhatsApp Outreach Sent\nMessage: ${targetMsg}`
        };
        
        const targetLead = leads.find(l => l.id === targetLeadId);
        if (targetLead) {
          const updatedLead = {
            ...targetLead,
            logs: [...(targetLead.logs || []), logEntry],
            last_contacted: today
          };
          handleUpdateLeadDetail(updatedLead, '💬 WhatsApp outreach sent & logged!');
        } else {
          showToast('💬 WhatsApp outreach sent!');
        }
        
        window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(targetMsg)}`, '_blank');
      } else {
        showToast("❌ AI: Could not find client phone number!");
      }
    }
    
    else if (type === 'SEND_INSTAGRAM') {
      const { handle, message, leadId } = params;
      let targetHandle = handle;
      let targetLeadId = leadId;
      
      if (!targetLeadId && targetHandle) {
        const found = leads.find(l => l.instagram_handle === targetHandle);
        if (found) targetLeadId = found.id;
      }
      
      if (targetLeadId && !targetHandle) {
        const found = leads.find(l => l.id === targetLeadId);
        if (found) targetHandle = found.instagram_handle;
      }
      
      if (!targetHandle && (leadId || handle)) {
        const searchName = leadId || handle;
        const found = leads.find(l => l.business_name.toLowerCase().includes(searchName.toLowerCase()));
        if (found) {
          targetLeadId = found.id;
          targetHandle = found.instagram_handle;
        }
      }
      
      if (targetHandle) {
        const targetMsg = message || `Hi, we noticed your Instagram page and would love to connect.`;
        
        navigator.clipboard.writeText(targetMsg);
        
        const today = new Date().toISOString().split('T')[0];
        const logEntry = {
          id: 'ig_sent_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
          timestamp: new Date().toISOString(),
          sender: 'you',
          text: `📸 Instagram Outreach Sent\nMessage: ${targetMsg}`
        };
        
        const targetLead = leads.find(l => l.id === targetLeadId);
        if (targetLead) {
          const updatedLead = {
            ...targetLead,
            logs: [...(targetLead.logs || []), logEntry],
            last_contacted: today
          };
          handleUpdateLeadDetail(updatedLead, '📸 Instagram message copied & profile opened!');
        } else {
          showToast('📸 Instagram message copied!');
        }
        
        window.open(`https://instagram.com/${targetHandle.replace('@', '')}/`, '_blank');
      } else {
        showToast("❌ AI: Could not find Instagram handle!");
      }
    }
    
    else if (type === 'CHECK_NOTIFICATIONS') {
      showToast(`🔔 AI action: Checking ${params.type} notifications`);
      if (window.handleCheckNotificationsAction) {
        window.handleCheckNotificationsAction(params);
      }
    }
  };

  const handleSendChatMessage = async (e) => {
    if (e) e.preventDefault();
    if (!chatInput.trim() || isChatLoading) return;
    
    const userMsgText = chatInput.trim();
    const newUserMsg = { id: 'msg_' + Date.now(), sender: 'user', text: userMsgText };
    
    setChatMessages(prev => [...prev, newUserMsg]);
    setChatInput('');
    setIsChatLoading(true);
    
    if (!syncConfig.geminiApiKey) {
      setChatMessages(prev => [...prev, {
        id: 'msg_' + Date.now(),
        sender: 'assistant',
        text: '❌ Please set your Gemini API Key in the Settings Modal first to activate the AI Assistant.'
      }]);
      setIsChatLoading(false);
      return;
    }
    
    try {
      const systemPrompt = `You are Vexo AI, the intelligent virtual assistant inside the Vexo TeamX CRM.
Your job is to assist the user (Sarfaraz) in query analysis, filtering the CRM dashboard, updating lead records, and preparing outbound actions.

CURRENT DATE/TIME: ${new Date().toISOString()} (Use this to interpret relative dates like "today", "yesterday", "this week", "3 days ago").

CURRENT CRM DATASETS:
- LEADS: ${JSON.stringify(leads.map(l => ({ id: l.id, business_name: l.business_name, phone: l.phone, category: l.category, website_status: l.website_status, priority: l.priority, outreach_status: l.outreach_status, last_contacted: l.last_contacted, follow_up_date: l.follow_up_date })))}
- PROJECTS: ${JSON.stringify(projects.map(p => ({ id: p.id, project_name: p.project_name, client_name: p.client_name, status: p.status, deadline: p.deadline })))}
- INVOICES: ${JSON.stringify(invoices.map(i => ({ id: i.id, client_name: i.client_name, amount: i.amount, status: i.status, due_date: i.due_date })))}

You MUST respond ONLY with a JSON object of this structure:
{
  "response": "Your conversational answer to the user in Hinglish/Hindi or English (matching user language). Keep it concise, helpful, and premium.",
  "action": {
    "type": "FILTER" | "UPDATE_LEAD" | "SEND_EMAIL" | "SEND_WHATSAPP" | "CHECK_NOTIFICATIONS" | "NONE",
    "params": {
      "searchTerm": "...", 
      "filterStatus": "...", 
      "filterPriority": "...", 
      "filterCategory": "...",
      
      "leadId": "...", 
      "outreach_status": "...", 
      "priority": "...", 
      "notes": "...", 
      "follow_up_date": "YYYY-MM-DD",
      
      "email": "...", 
      "subject": "...",
      "body": "...",
      "leadId": "...",
      
      "phone": "...",
      "message": "...",
      "leadId": "...",
      
      "type": "whatsapp" | "instagram"
    }
  }
}

EXAMPLES:
1. Croydon leads check:
User: "Show me all Croydon leads not contacted yet"
Response: { "response": "Sure, filtering leads in Croydon with 'Not Contacted' status.", "action": { "type": "FILTER", "params": { "searchTerm": "Croydon", "filterStatus": "Not Contacted", "filterPriority": "All", "filterCategory": "All" } } }

2. Status update:
User: "Mark Bobbi's Hair Salon as Replied"
Response: { "response": "Done! I have marked Bobbi's Hair Salon as 'Replied'.", "action": { "type": "UPDATE_LEAD", "params": { "leadId": "lead_12", "outreach_status": "Replied" } } }

3. General count:
User: "How many nail salons have I closed this week?"
Response: { "response": "You have closed 2 nail salons this week (Studio L and Nails By Ann). Good job!", "action": { "type": "NONE" } }

Note: Keep your replies professional. Prioritize Hinglish if user speaks in Hinglish. Match lead ids exactly from dataset.`;

      const dataPayload = {
        contents: [
          {
            role: "user",
            parts: [
              { text: systemPrompt },
              { text: `User Message: "${userMsgText}"` }
            ]
          }
        ],
        generationConfig: {
          responseMimeType: "application/json"
        }
      };
      
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${syncConfig.geminiApiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dataPayload)
        }
      );
      
      if (!response.ok) {
        throw new Error(`Gemini API Error: HTTP ${response.status}`);
      }
      
      const result = await response.json();
      const textOutput = result.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (!textOutput) {
        throw new Error("Empty response from Gemini API");
      }
      
      const parsedRes = JSON.parse(textOutput.trim());
      
      // Execute the action if returned
      if (parsedRes.action && parsedRes.action.type !== 'NONE') {
        executeAssistantAction(parsedRes.action);
      }
      
      setChatMessages(prev => [...prev, {
        id: 'msg_' + Date.now(),
        sender: 'assistant',
        text: parsedRes.response,
        action: parsedRes.action
      }]);
      
    } catch (err) {
      console.error(err);
      setChatMessages(prev => [...prev, {
        id: 'msg_' + Date.now(),
        sender: 'assistant',
        text: "⚠️ Error executing command: " + err.message + ". Please try again."
      }]);
    } finally {
      setIsChatLoading(false);
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
      drive_link: newProjectForm.drive_link || '',
      demo_link: newProjectForm.demo_link || '',
      checklist: [
        { id: 'design', label: 'Design UI Mockups', completed: false },
        { id: 'content', label: 'Gather Assets & Content', completed: false },
        { id: 'dev', label: 'Next.js Development', completed: false },
        { id: 'testing', label: 'Responsive Testing', completed: false },
        { id: 'handover', label: 'Client Handover & Delivery', completed: false }
      ],
      notes: newProjectForm.notes || '',
      created_by: 'Sarfaraz',
      assigned_to: 'Sarfaraz'
    };

    setProjects(prev => [newProj, ...prev]);
    setIsAddProjectOpen(false);
    setNewProjectForm({
      client_name: '',
      project_name: '',
      status: 'Not Started',
      start_date: new Date().toISOString().split('T')[0],
      deadline: '',
      drive_link: '',
      demo_link: '',
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

  const handleToggleChecklistItem = (projectId, itemId) => {
    setProjects(prevProjects => {
      const updated = prevProjects.map(proj => {
        if (proj.id === projectId) {
          const newChecklist = proj.checklist.map(item => 
            item.id === itemId ? { ...item, completed: !item.completed } : item
          );
          const updatedProj = { ...proj, checklist: newChecklist };
          // If we are currently editing this project in the details hub, update selectedProject state too!
          if (selectedProject && selectedProject.id === projectId) {
            setSelectedProject(updatedProj);
          }
          return updatedProj;
        }
        return proj;
      });
      return updated;
    });
    showToast('✅ Project checklist updated!');
  };

  const handleUpdateProjectDetails = (projectId, fieldsToUpdate) => {
    setProjects(prevProjects => {
      const updated = prevProjects.map(proj => {
        if (proj.id === projectId) {
          const updatedProj = { ...proj, ...fieldsToUpdate };
          if (selectedProject && selectedProject.id === projectId) {
            setSelectedProject(updatedProj);
          }
          return updatedProj;
        }
        return proj;
      });
      return updated;
    });
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

  const handleShareInvoice = (invoice) => {
    const project = projects.find(p => p.id === invoice.project_id);
    const amountStr = `${invoice.currency === 'INR' ? '₹' : '$'}${parseFloat(invoice.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
    const shareText = 
      `🌐 *VEXO TEAMX — OFFICIAL INVOICE*\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
      `Hello,\n\n` +
      `A new billing statement has been generated for your account. Please find the transaction details below:\n\n` +
      `👤 *Client:* ${invoice.client_name}\n` +
      `📋 *Project:* ${project ? project.project_name : 'General Client Outreach'}\n` +
      `💰 *Amount:* ${amountStr}\n` +
      `📅 *Due Date:* ${invoice.due_date || 'Immediate'}\n` +
      `🏷️ *Status:* ${invoice.status}\n\n` +
      `Please process this payment by the due date. For any support or inquiries, reply directly to this outreach.\n\n` +
      `Thank you for partnering with Vexo TeamX!\n\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `*Vexo TeamX Lead Tracker • Founder: Sarfaraz*`;

    if (navigator.share) {
      navigator.share({
        title: `Invoice - ${invoice.client_name}`,
        text: shareText,
      }).catch(err => {
        console.error(err);
        // Fallback to clipboard
        navigator.clipboard.writeText(shareText);
        showToast('📋 Invoice details copied to clipboard!');
      });
    } else {
      navigator.clipboard.writeText(shareText);
      showToast('📋 Invoice details copied to clipboard!');
    }
  };

  const handleSaveSettings = (e) => {
    e.preventDefault();
    const newConfig = {
      mode: tempMode,
      sheetId: tempSheetId,
      apiKey: tempApiKey,
      geminiApiKey: tempGeminiApiKey,
      googleClientId: tempGoogleClientId
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
            className="fixed top-6 left-1/2 -translate-x-1/2 z-[9999] px-4 py-2.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-800 dark:text-slate-100 text-sm font-medium shadow-2xl flex items-center gap-2"
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
                className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-lg transition-all cursor-pointer text-center flex items-center justify-center gap-1.5 relative ${
                  activeTab === 'leads' 
                    ? 'bg-indigo-600 text-white shadow-sm font-semibold' 
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <span>Leads</span>
                {todayFollowups.length > 0 && (
                  <span className="flex-shrink-0 min-w-[18px] h-[18px] px-1 rounded-full bg-rose-500 text-[10px] text-white font-extrabold flex items-center justify-center animate-pulse">
                    {todayFollowups.length}
                  </span>
                )}
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
            {/* Needs Follow-up Pinned Section */}
            {todayFollowups.length > 0 && (
              <section className="mb-6 bg-rose-50 dark:bg-rose-500/[0.02] border border-rose-205 dark:border-rose-500/20 rounded-2xl p-4 transition-colors duration-200">
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-rose-100 dark:border-white/5">
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-450 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                    </span>
                    <h3 className="text-xs font-bold text-rose-700 dark:text-rose-400 uppercase tracking-wider">
                      ⚠️ Needs Follow-up ({todayFollowups.length})
                    </h3>
                  </div>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono hidden sm:block">Please check outreach status or set a new follow-up date</p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {todayFollowups.map(lead => {
                    const isOverdueFollowUp = lead.follow_up_date && lead.follow_up_date <= todayStr;
                    return (
                      <div 
                        key={lead.id}
                        onClick={() => setSelectedLead(lead)}
                        className="p-3 bg-white dark:bg-[#171922] border border-slate-200 dark:border-white/5 hover:border-rose-500/30 rounded-xl cursor-pointer transition duration-150 flex flex-col justify-between gap-2 shadow-sm dark:shadow-none"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h4 className="font-bold text-slate-800 dark:text-slate-200 text-xs truncate max-w-[170px]">
                              {lead.business_name}
                            </h4>
                            <p className="text-[10px] text-slate-550 capitalize">{lead.category}</p>
                          </div>
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                            isOverdueFollowUp 
                              ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' 
                              : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          }`}>
                            {isOverdueFollowUp ? 'Overdue' : 'Messaged 3d+ ago'}
                          </span>
                        </div>
                        
                        <div className="flex justify-between items-center text-[10px] text-slate-500 dark:text-slate-400 font-mono border-t border-slate-100 dark:border-white/5 pt-2 mt-1" onClick={(e) => e.stopPropagation()}>
                          <span>Status: {lead.outreach_status}</span>
                          <div className="flex items-center gap-2">
                            {lead.outreach_status === 'Messaged' && (
                              <button
                                onClick={() => handleQuickStatusUpdate(lead.id, 'Replied')}
                                className="bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded border border-indigo-500/20 text-[9px] font-semibold cursor-pointer"
                              >
                                📩 Replied
                              </button>
                            )}
                            <button
                              onClick={() => setSelectedLead(lead)}
                              className="text-indigo-400 hover:underline text-[9px] font-semibold cursor-pointer"
                            >
                              Profile →
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

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
                        <div className="flex items-center justify-end gap-2">
                          <div className="flex items-center gap-1">
                            {lead.outreach_status === 'Not Contacted' && (
                              <button
                                onClick={() => handleQuickStatusUpdate(lead.id, 'Messaged')}
                                className="text-[10px] font-bold bg-blue-500/10 hover:bg-blue-500/25 text-blue-400 border border-blue-500/20 px-2.5 py-1 rounded-lg transition cursor-pointer"
                                title="Mark as Messaged"
                              >
                                💬 Messaged
                              </button>
                            )}
                            {lead.outreach_status === 'Messaged' && (
                              <button
                                onClick={() => handleQuickStatusUpdate(lead.id, 'Replied')}
                                className="text-[10px] font-bold bg-indigo-500/10 hover:bg-indigo-500/25 text-indigo-400 border border-indigo-500/20 px-2.5 py-1 rounded-lg transition cursor-pointer"
                                title="Mark as Replied"
                              >
                                📩 Replied
                              </button>
                            )}
                            {lead.outreach_status === 'Replied' && (
                              <button
                                onClick={() => handleQuickStatusUpdate(lead.id, 'Interested')}
                                className="text-[10px] font-bold bg-emerald-500/10 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-lg transition cursor-pointer"
                                title="Mark as Interested"
                              >
                                ⭐ Interested
                              </button>
                            )}
                          </div>
                          <button 
                            onClick={() => setSelectedLead(lead)}
                            className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold py-1 px-3.5 rounded-lg border border-indigo-500/20 hover:bg-indigo-500/10 transition cursor-pointer"
                          >
                            View
                          </button>
                        </div>
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

                  {/* Quick Action Button for Mobile */}
                  <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-white/5 flex gap-2" onClick={(e) => e.stopPropagation()}>
                    {lead.outreach_status === 'Not Contacted' && (
                      <button
                        onClick={() => handleQuickStatusUpdate(lead.id, 'Messaged')}
                        className="flex-1 py-1.5 text-center text-[10px] font-semibold bg-blue-500/10 active:bg-blue-500/20 text-blue-400 border border-blue-500/20 rounded-lg transition cursor-pointer"
                      >
                        💬 Mark Messaged
                      </button>
                    )}
                    {lead.outreach_status === 'Messaged' && (
                      <button
                        onClick={() => handleQuickStatusUpdate(lead.id, 'Replied')}
                        className="flex-1 py-1.5 text-center text-[10px] font-semibold bg-indigo-500/10 active:bg-indigo-500/20 text-indigo-400 border border-indigo-500/20 rounded-lg transition cursor-pointer"
                      >
                        📩 Mark Replied
                      </button>
                    )}
                    {lead.outreach_status === 'Replied' && (
                      <button
                        onClick={() => handleQuickStatusUpdate(lead.id, 'Interested')}
                        className="flex-1 py-1.5 text-center text-[10px] font-semibold bg-emerald-500/10 active:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 rounded-lg transition cursor-pointer"
                      >
                        ⭐ Mark Interested
                      </button>
                    )}
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              {[
                { id: 'Not Started', title: 'Not Started', dot: 'bg-slate-400' },
                { id: 'In Progress', title: 'In Progress', dot: 'bg-blue-400' },
                { id: 'Client Review', title: 'Client Review', dot: 'bg-indigo-400' },
                { id: 'Revision', title: 'Revision', dot: 'bg-amber-400' },
                { id: 'Delivered', title: 'Delivered', dot: 'bg-emerald-400' }
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
                      <span className="text-[10px] font-mono font-semibold px-2 py-0.5 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded text-slate-450">
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
                        columnProjects.map(project => {
                          const completedTasks = project.checklist ? project.checklist.filter(t => t.completed).length : 0;
                          const totalTasks = project.checklist ? project.checklist.length : 5;
                          
                          let daysDiffText = '';
                          let daysDiffColorClass = 'text-slate-500 dark:text-slate-400';
                          if (project.deadline) {
                            const today = new Date();
                            today.setHours(0,0,0,0);
                            const deadlineDate = new Date(project.deadline);
                            deadlineDate.setHours(0,0,0,0);
                            const diffTime = deadlineDate - today;
                            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                            
                            if (diffDays < 0) {
                              daysDiffText = `Overdue ${Math.abs(diffDays)}d`;
                              daysDiffColorClass = 'text-rose-400 bg-rose-500/10 border border-rose-500/20 px-1.5 py-0.5 rounded';
                            } else if (diffDays === 0) {
                              daysDiffText = 'Due Today';
                              daysDiffColorClass = 'text-amber-400 bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 rounded animate-pulse';
                            } else if (diffDays <= 3) {
                              daysDiffText = `${diffDays}d left`;
                              daysDiffColorClass = 'text-orange-400 bg-orange-500/10 border border-orange-500/20 px-1.5 py-0.5 rounded';
                            } else {
                              daysDiffText = `${diffDays}d left`;
                              daysDiffColorClass = 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded';
                            }
                          }

                          return (
                            <div
                              key={project.id}
                              draggable
                              onDragStart={(e) => e.dataTransfer.setData('text/plain', project.id)}
                              onClick={() => setSelectedProject(project)}
                              className="group relative bg-slate-50 dark:bg-[#171922] border border-slate-200 dark:border-white/5 p-4 rounded-xl shadow-sm hover:border-indigo-500/30 transition duration-150 cursor-pointer flex flex-col justify-between gap-3"
                            >
                              {/* Project content */}
                              <div className="space-y-2">
                                <div className="flex items-start justify-between gap-2">
                                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 tracking-tight group-hover:text-indigo-400 transition break-words">
                                    {project.project_name}
                                  </h4>
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteProject(project.id);
                                    }}
                                    className="text-slate-500 hover:text-rose-455 p-0.5 rounded opacity-0 group-hover:opacity-100 transition flex-shrink-0 cursor-pointer"
                                    title="Delete Project"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>

                                <div className="flex items-center gap-1.5 text-[10px] text-slate-500 dark:text-slate-400">
                                  <Building2 className="w-3 h-3 text-slate-450 flex-shrink-0" />
                                  <span className="font-semibold truncate">{project.client_name}</span>
                                </div>

                                {/* Checklist Progress Bar */}
                                {project.checklist && (
                                  <div className="space-y-1 pt-0.5">
                                    <div className="flex justify-between items-center text-[9px] text-slate-400 font-mono">
                                      <span>Checklist:</span>
                                      <span>{completedTasks}/{totalTasks}</span>
                                    </div>
                                    <div className="w-full h-1 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                                      <div 
                                        className="h-full bg-indigo-500 rounded-full transition-all duration-300"
                                        style={{ width: `${(completedTasks / totalTasks) * 100}%` }}
                                      />
                                    </div>
                                  </div>
                                )}

                                {/* Resource links */}
                                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                                  {project.drive_link && (
                                    <a 
                                      href={project.drive_link} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="p-1 rounded bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/25 text-indigo-400 text-[9px] font-mono flex items-center gap-1 transition"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      <Globe className="w-2.5 h-2.5" />
                                      <span>Assets</span>
                                    </a>
                                  )}
                                  {project.demo_link && (
                                    <a 
                                      href={project.demo_link} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="p-1 rounded bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/25 text-purple-400 text-[9px] font-mono flex items-center gap-1 transition"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      <ExternalLink className="w-2.5 h-2.5" />
                                      <span>Demo</span>
                                    </a>
                                  )}
                                </div>

                                {project.notes && (
                                  <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-2 italic font-serif pt-0.5">
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
                                  <span className={`font-mono font-semibold text-[9.5px] ${daysDiffColorClass}`}>
                                    {daysDiffText || project.deadline || '—'}
                                  </span>
                                </div>

                                {/* Mobile Quick Switcher */}
                                <div className="relative mt-1" onClick={(e) => e.stopPropagation()}>
                                  <select
                                    value={project.status}
                                    onChange={(e) => handleUpdateProjectStatus(project.id, e.target.value)}
                                    className="w-full appearance-none bg-slate-100 dark:bg-[#0c0e12] border border-slate-200 dark:border-white/5 text-[9px] text-slate-500 dark:text-slate-400 font-mono rounded py-1 px-2 pr-6 outline-none focus:border-indigo-500/50 cursor-pointer"
                                  >
                                    <option disabled>Move to...</option>
                                    <option value="Not Started">Not Started</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Client Review">Client Review</option>
                                    <option value="Revision">Revision</option>
                                    <option value="Delivered">Delivered</option>
                                  </select>
                                  <ChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
                                </div>
                              </div>
                            </div>
                          );
                        })
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
                              <td className="py-3.5 px-5 text-right flex items-center justify-end gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => setSelectedInvoice(invoice)}
                                  className="text-slate-500 hover:text-indigo-400 p-1.5 rounded transition duration-150 inline-flex cursor-pointer"
                                  title="View Invoice Sheet"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleShareInvoice(invoice)}
                                  className="text-slate-500 hover:text-indigo-400 p-1.5 rounded transition duration-150 inline-flex cursor-pointer"
                                  title="Share Invoice"
                                >
                                  <Share2 className="w-4 h-4" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteInvoice(invoice.id)}
                                  className="text-slate-500 hover:text-rose-450 p-1.5 rounded transition duration-150 inline-flex cursor-pointer"
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
                            <div className="flex gap-2">
                              <button
                                type="button"
                                onClick={() => setSelectedInvoice(invoice)}
                                className="text-slate-500 hover:text-indigo-400 p-1 rounded transition duration-150 cursor-pointer"
                                title="View Invoice Sheet"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleShareInvoice(invoice)}
                                className="text-slate-500 hover:text-indigo-400 p-1 rounded transition duration-150 cursor-pointer"
                                title="Share Invoice"
                              >
                                <Share2 className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteInvoice(invoice.id)}
                                className="text-slate-500 hover:text-rose-450 p-1 rounded transition duration-150 cursor-pointer"
                                title="Delete Invoice"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
              <div className="bg-white dark:bg-[#101217] glow-card border border-slate-200 dark:border-white/5 rounded-2xl p-4 md:p-5 flex flex-col justify-between shadow-sm dark:shadow-none transition-colors duration-200 shadow-lg shadow-black/10">
                <div className="flex items-center justify-between text-slate-500 mb-3">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Clients</span>
                  <CheckCircle2 className="w-4.5 h-4.5 text-emerald-400" />
                </div>
                <div>
                  <span className="text-2xl md:text-3xl font-extrabold text-slate-800 dark:text-slate-100">{analyticsData.totalClients}</span>
                  <p className="text-[10px] text-slate-400 mt-1 font-mono">Active & Won profiles</p>
                </div>
              </div>

              <div className="bg-white dark:bg-[#101217] glow-card border border-slate-200 dark:border-white/5 rounded-2xl p-4 md:p-5 flex flex-col justify-between shadow-sm dark:shadow-none transition-colors duration-200 shadow-lg shadow-black/10">
                <div className="flex items-center justify-between text-slate-500 mb-3">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Pending Follow-ups</span>
                  <Calendar className="w-4.5 h-4.5 text-rose-400" />
                </div>
                <div>
                  <span className="text-2xl md:text-3xl font-extrabold text-rose-400">{analyticsData.pendingFollowUpCount}</span>
                  <p className="text-[10px] text-slate-400 mt-1 font-mono">Requires attention</p>
                </div>
              </div>

              <div className="bg-white dark:bg-[#101217] glow-card border border-slate-200 dark:border-white/5 rounded-2xl p-4 md:p-5 flex flex-col justify-between shadow-sm dark:shadow-none transition-colors duration-200 shadow-lg shadow-black/10">
                <div className="flex items-center justify-between text-slate-500 mb-3">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Active Funnel</span>
                  <Users className="w-4.5 h-4.5 text-indigo-400" />
                </div>
                <div>
                  <span className="text-2xl md:text-3xl font-extrabold text-slate-800 dark:text-slate-100">{analyticsData.leadCount + analyticsData.activeCount}</span>
                  <p className="text-[10px] text-slate-400 mt-1 font-mono">In prospecting funnel</p>
                </div>
              </div>

              <div className="bg-white dark:bg-[#101217] glow-card border border-slate-200 dark:border-white/5 rounded-2xl p-4 md:p-5 flex flex-col justify-between shadow-sm dark:shadow-none transition-colors duration-200 shadow-lg shadow-black/10">
                <div className="flex items-center justify-between text-slate-500 mb-3">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Est. Closed Revenue</span>
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

              {/* Card 5: Active Projects */}
              <div className="bg-white dark:bg-[#101217] glow-card border border-slate-200 dark:border-white/5 rounded-2xl p-4 md:p-5 flex flex-col justify-between shadow-sm dark:shadow-none transition-colors duration-200 shadow-lg shadow-black/10">
                <div className="flex items-center justify-between text-slate-500 mb-3">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Active Projects</span>
                  <Building2 className="w-4.5 h-4.5 text-indigo-400" />
                </div>
                <div>
                  <span className="text-2xl md:text-3xl font-extrabold text-slate-800 dark:text-slate-100">
                    {projects.filter(p => p.status !== 'Delivered').length}
                  </span>
                  <p className="text-[10px] text-slate-400 mt-1 font-mono">
                    {projects.filter(p => p.status === 'In Progress').length} in active status
                  </p>
                </div>
              </div>

              {/* Card 6: Outstanding Invoices */}
              <div className="bg-white dark:bg-[#101217] glow-card border border-slate-200 dark:border-white/5 rounded-2xl p-4 md:p-5 flex flex-col justify-between shadow-sm dark:shadow-none transition-colors duration-200 shadow-lg shadow-black/10">
                <div className="flex items-center justify-between text-slate-500 mb-3">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Outstanding Invoices</span>
                  <DollarSign className="w-4.5 h-4.5 text-rose-400" />
                </div>
                <div>
                  <span className="text-2xl md:text-3xl font-extrabold text-rose-400">
                    ${invoiceStats.outstanding.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                  <p className="text-[10px] text-slate-400 mt-1 font-mono">Unpaid billing totals</p>
                </div>
              </div>
            </div>

            {/* ACTION HUB: ATTENTION NEEDED TODAY */}
            <div className="bg-white dark:bg-[#101217] border border-slate-200 dark:border-white/5 rounded-2xl p-5 md:p-6 shadow-sm dark:shadow-none transition-colors duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5">
                <div>
                  <h3 className="text-sm font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                    <AlertCircle className="w-4.5 h-4.5 text-amber-400" />
                    Attention Needed Today
                  </h3>
                  <p className="text-[11px] text-slate-400">Critical client outreach, billing, and project milestones requiring immediate action</p>
                </div>
                <div className="text-[10px] font-mono bg-slate-100 dark:bg-white/5 border border-slate-250 dark:border-white/10 px-2.5 py-1 rounded text-slate-400">
                  Current Date: {todayStr}
                </div>
              </div>

              {todayFollowups.length === 0 && overdueInvoices.length === 0 && nearingProjects.length === 0 ? (
                <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-6 text-center space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                  <h4 className="font-bold text-xs text-slate-700 dark:text-slate-200">All Clear, Sarfaraz!</h4>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">No overdue invoices, outreach follow-ups, or urgent project deadlines.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* Column 1: Overdue Follow-ups */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-white/5">
                      <span className="text-[11px] font-mono uppercase tracking-wider text-rose-400 font-bold flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                        Follow-ups Due ({todayFollowups.length})
                      </span>
                    </div>
                    <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                      {todayFollowups.length === 0 ? (
                        <div className="text-[10px] text-slate-500 dark:text-slate-500 italic p-3 text-center">
                          ✨ No pending follow-ups today!
                        </div>
                      ) : (
                        todayFollowups.map(lead => (
                          <div 
                            key={lead.id} 
                            onClick={() => setSelectedLead(lead)}
                            className="p-3 bg-slate-50 dark:bg-[#171922] border border-slate-200 dark:border-white/5 rounded-xl hover:border-indigo-500/30 cursor-pointer transition text-xs space-y-1"
                          >
                            <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                              <span className="truncate max-w-[130px]">{lead.business_name}</span>
                              <span className="text-[9px] font-mono text-rose-400 bg-rose-500/10 px-1 py-0.25 rounded border border-rose-500/20">
                                {lead.follow_up_date}
                              </span>
                            </div>
                            <div className="flex justify-between items-center text-[10px] text-slate-500 dark:text-slate-400">
                              <span>Status: {lead.outreach_status}</span>
                              <span className="text-[9px] text-indigo-400 hover:underline">Open Profile</span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Column 2: Overdue Invoices */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-white/5">
                      <span className="text-[11px] font-mono uppercase tracking-wider text-amber-500 font-bold flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                        Overdue Invoices ({overdueInvoices.length})
                      </span>
                    </div>
                    <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                      {overdueInvoices.length === 0 ? (
                        <div className="text-[10px] text-slate-500 dark:text-slate-500 italic p-3 text-center">
                          💵 No unpaid overdue invoices!
                        </div>
                      ) : (
                        overdueInvoices.map(inv => (
                          <div 
                            key={inv.id} 
                            onClick={() => setSelectedInvoice(inv)}
                            className="p-3 bg-slate-50 dark:bg-[#171922] border border-slate-200 dark:border-white/5 rounded-xl hover:border-indigo-500/30 cursor-pointer transition text-xs space-y-1"
                          >
                            <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                              <span className="truncate max-w-[130px]">{inv.client_name}</span>
                              <span className="font-mono text-[11px] text-rose-455">
                                {inv.currency === 'INR' ? '₹' : '$'}
                                {inv.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                              </span>
                            </div>
                            <div className="flex justify-between items-center text-[10px] text-slate-500 dark:text-slate-400">
                              <span className="text-rose-400 bg-rose-500/10 px-1 py-0.25 rounded text-[9px] border border-rose-500/10">Due: {inv.due_date}</span>
                              <span className="text-indigo-400 hover:underline">View Invoice</span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Column 3: Near Deadlines */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-white/5">
                      <span className="text-[11px] font-mono uppercase tracking-wider text-blue-400 font-bold flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                        Nearing Deadline ({nearingProjects.length})
                      </span>
                    </div>
                    <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                      {nearingProjects.length === 0 ? (
                        <div className="text-[10px] text-slate-500 dark:text-slate-500 italic p-3 text-center">
                          📅 No urgent project deadlines!
                        </div>
                      ) : (
                        nearingProjects.map(proj => {
                          const completed = proj.checklist ? proj.checklist.filter(t => t.completed).length : 0;
                          const total = proj.checklist ? proj.checklist.length : 5;
                          
                          return (
                            <div 
                              key={proj.id} 
                              onClick={() => setSelectedProject(proj)}
                              className="p-3 bg-slate-50 dark:bg-[#171922] border border-slate-200 dark:border-white/5 rounded-xl hover:border-indigo-500/30 cursor-pointer transition text-xs space-y-1.5"
                            >
                              <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                                <span className="truncate max-w-[130px]">{proj.project_name}</span>
                                <span className="text-[9px] font-mono text-amber-400 bg-amber-500/10 px-1 py-0.25 rounded border border-amber-500/20">
                                  {proj.deadline}
                                </span>
                              </div>
                              <div className="w-full h-1 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-indigo-500 rounded-full transition-all duration-300"
                                  style={{ width: `${(completed / total) * 100}%` }}
                                />
                              </div>
                              <div className="flex justify-between items-center text-[10px] text-slate-500 dark:text-slate-400">
                                <span>Checklist: {completed}/{total}</span>
                                <span className="text-indigo-400 hover:underline">Open Project</span>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>

                </div>
              )}
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

              {/* Lead Source Conversion & ROI Analysis */}
              <div className="bg-white dark:bg-[#101217] border border-slate-200 dark:border-white/5 rounded-2xl p-5 md:p-6 shadow-sm dark:shadow-none transition-colors duration-200 lg:col-span-2">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                    <TrendingUp className="w-4.5 h-4.5 text-emerald-400" />
                    Lead Source Conversion & ROI Analysis
                  </h3>
                  <span className="text-[10px] text-slate-400 font-mono tracking-wide uppercase">Real ROI Tracker</span>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-white/5 text-slate-400 font-mono text-[10px] uppercase pb-2">
                        <th className="py-2.5">Source Channel</th>
                        <th className="py-2.5 text-center">Total Leads</th>
                        <th className="py-2.5 text-center">Deals Won</th>
                        <th className="py-2.5 text-center">Conversion Rate</th>
                        <th className="py-2.5 text-right">Revenue Collected</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                      {roiList.map(src => {
                        const conversionRate = src.totalLeads > 0 ? Math.round((src.wonLeads / src.totalLeads) * 100) : 0;
                        return (
                          <tr key={src.name} className="hover:bg-slate-50/50 dark:hover:bg-white/[0.01]">
                            <td className="py-3 font-semibold text-slate-700 dark:text-slate-200 capitalize">{src.name}</td>
                            <td className="py-3 text-center font-mono text-slate-650 dark:text-slate-400">{src.totalLeads}</td>
                            <td className="py-3 text-center font-mono font-bold text-emerald-450">{src.wonLeads}</td>
                            <td className="py-3 text-center">
                              <div className="flex items-center justify-center gap-2">
                                <span className="font-mono font-semibold text-slate-300">{conversionRate}%</span>
                                <div className="w-12 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden hidden sm:block">
                                  <div 
                                    className="h-full bg-emerald-500 rounded-full"
                                    style={{ width: `${conversionRate}%` }}
                                  />
                                </div>
                              </div>
                            </td>
                            <td className="py-3 text-right font-mono font-bold text-slate-800 dark:text-slate-100">
                              ${src.revenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Outreach Performance & Response Stats */}
              <div className="bg-white dark:bg-[#101217] border border-slate-200 dark:border-white/5 rounded-2xl p-5 md:p-6 shadow-sm dark:shadow-none transition-colors duration-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                    <Users className="w-4.5 h-4.5 text-indigo-400" />
                    Response Rates by Outreach Channel
                  </h3>
                  <span className="text-[10px] text-slate-400 font-mono tracking-wide uppercase">Channel Audit</span>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-white/5 text-slate-400 font-mono text-[10px] uppercase pb-2">
                        <th className="py-2.5">Outreach Channel</th>
                        <th className="py-2.5 text-center">Total Contacted</th>
                        <th className="py-2.5 text-center">Replies Received</th>
                        <th className="py-2.5 text-right">Response Rate</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                      {outreachInsights.channels.map(ch => (
                        <tr key={ch.name} className="hover:bg-slate-50/50 dark:hover:bg-white/[0.01]">
                          <td className="py-3 font-semibold text-slate-700 dark:text-slate-200">{ch.name}</td>
                          <td className="py-3 text-center font-mono text-slate-650 dark:text-slate-400">{ch.contacted}</td>
                          <td className="py-3 text-center font-mono text-slate-650 dark:text-slate-400">{ch.replies}</td>
                          <td className="py-3 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <span className="font-mono font-bold text-indigo-400">{ch.rate}%</span>
                              <div className="w-12 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-indigo-500 rounded-full"
                                  style={{ width: `${ch.rate}%` }}
                                />
                              </div>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Timeline Metrics card */}
              <div className="bg-white dark:bg-[#101217] border border-slate-200 dark:border-white/5 rounded-2xl p-5 md:p-6 shadow-sm dark:shadow-none transition-colors duration-200 flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-200 mb-4 flex items-center gap-2">
                    <TrendingUp className="w-4.5 h-4.5 text-purple-400" />
                    Lifecycle & Speed Metrics
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-[#171922] border border-slate-200 dark:border-white/5 rounded-xl">
                      <div>
                        <span className="text-[10px] text-slate-500 font-mono uppercase">Avg. Reply Time</span>
                        <div className="text-lg font-black text-slate-800 dark:text-slate-100 mt-0.5">
                          {outreachInsights.avgResponseTime} <span className="text-xs font-normal text-slate-400">days</span>
                        </div>
                      </div>
                      <span className="text-xs bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-1 rounded font-semibold font-mono">
                        Speedy
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-[#171922] border border-slate-200 dark:border-white/5 rounded-xl">
                      <div>
                        <span className="text-[10px] text-slate-500 font-mono uppercase">Sales Cycle (Won)</span>
                        <div className="text-lg font-black text-slate-800 dark:text-slate-100 mt-0.5">
                          {outreachInsights.avgSalesCycle} <span className="text-xs font-normal text-slate-400">days</span>
                        </div>
                      </div>
                      <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-1 rounded font-semibold font-mono">
                        Efficient
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-[#171922] border border-slate-200 dark:border-white/5 rounded-xl">
                      <div>
                        <span className="text-[10px] text-slate-500 font-mono uppercase">Total Outbounds</span>
                        <div className="text-lg font-black text-slate-800 dark:text-slate-100 mt-0.5">
                          {outreachInsights.totalOutbound} <span className="text-xs font-normal text-slate-400">sent</span>
                        </div>
                      </div>
                      <span className="text-xs bg-purple-500/10 text-purple-400 border border-purple-500/20 px-2 py-1 rounded font-semibold font-mono">
                        High Vol
                      </span>
                    </div>
                  </div>
                </div>
                
                <p className="text-[9.5px] text-slate-500 dark:text-slate-500 font-mono leading-relaxed mt-4 border-t border-slate-200 dark:border-white/5 pt-3">
                  💡 Tip: Fast outreach replies under 2 days increase close rates by up to 300%.
                </p>
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
              onClick={handleCloseLeadDrawer}
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
                      onClick={handleCloseLeadDrawer}
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
                    <div className="text-[10px] text-slate-500 font-mono tracking-wider uppercase">Contact Email</div>
                    <div className="text-sm font-semibold text-slate-700 dark:text-slate-200 mt-1 flex items-center justify-between gap-2">
                      <span className="font-mono">{selectedLead.email || '—'}</span>
                      {selectedLead.email && (
                        <button onClick={() => copyToClipboard(selectedLead.email, 'email')} className="text-indigo-400 hover:text-white cursor-pointer">
                          {copiedId === 'email' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
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

                  {/* Contact Email input */}
                  <div>
                    <label className="block text-[10px] text-slate-500 font-mono tracking-wider uppercase mb-1.5">Contact Email</label>
                    <input 
                      type="email"
                      placeholder="client@example.com"
                      value={selectedLead.email || ''}
                      onChange={(e) => handleUpdateLeadDetail({ ...selectedLead, email: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-[#171922] border border-slate-200 dark:border-white/5 rounded-xl py-2 px-3 text-xs text-slate-800 dark:text-slate-350 outline-none focus:border-indigo-500/50"
                    />
                  </div>

                  {/* Notes Area */}
                  <div>
                    <label className="block text-[10px] text-slate-500 font-mono tracking-wider uppercase mb-1.5">Outreach Conversation Notes</label>
                    <textarea 
                      rows="4"
                      value={localNotes}
                      onChange={(e) => setLocalNotes(e.target.value)}
                      onBlur={() => {
                        if (localNotes !== selectedLead.notes) {
                          handleUpdateLeadDetail({ ...selectedLead, notes: localNotes });
                        }
                      }}
                      placeholder="Add meeting notes, call recap, design requests or project budget estimate..."
                      className="w-full bg-slate-50 dark:bg-[#171922] border border-slate-200 dark:border-white/5 rounded-xl p-3 text-xs text-slate-800 dark:text-slate-300 outline-none focus:border-indigo-500/50 resize-none"
                    />
                  </div>

                  {/* Gmail Integration Section */}
                  <div className="border-t border-slate-200 dark:border-white/5 pt-4 mt-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                        ✉️ Gmail Outreach
                      </h3>
                      <span className={`text-[9px] px-2 py-0.5 rounded-full ${isGmailAuthorized ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}`}>
                        {isGmailAuthorized ? 'Connected' : 'Not Connected'}
                      </span>
                    </div>

                    <div className="bg-slate-50 dark:bg-[#171922] border border-slate-200 dark:border-white/5 rounded-xl p-3.5 space-y-3">
                      {/* Email input field */}
                      <div>
                        <label className="block text-[9px] text-slate-500 font-mono tracking-wider uppercase mb-1">To Email Address</label>
                        <input
                          type="email"
                          placeholder="client@example.com"
                          value={selectedLead.email || ''}
                          onChange={(e) => {
                            handleUpdateLeadDetail({ ...selectedLead, email: e.target.value }, null);
                          }}
                          className="w-full bg-white dark:bg-[#0c0e12] border border-slate-200 dark:border-white/5 rounded-lg p-2 text-xs text-slate-800 dark:text-slate-350 outline-none focus:border-indigo-500/50 font-mono"
                        />
                      </div>

                      {/* Email Subject */}
                      <div>
                        <label className="block text-[9px] text-slate-500 font-mono tracking-wider uppercase mb-1">Subject</label>
                        <input
                          type="text"
                          placeholder="Email Subject..."
                          value={newEmailSubject}
                          onChange={(e) => setNewEmailSubject(e.target.value)}
                          className="w-full bg-white dark:bg-[#0c0e12] border border-slate-200 dark:border-white/5 rounded-lg p-2 text-xs text-slate-800 dark:text-slate-350 outline-none focus:border-indigo-500/50"
                        />
                      </div>

                      {/* Email Body */}
                      <div>
                        <label className="block text-[9px] text-slate-500 font-mono tracking-wider uppercase mb-1">Email Body (HTML supported)</label>
                        <textarea
                          rows="4"
                          placeholder="Write your email here..."
                          value={newEmailBody}
                          onChange={(e) => setNewEmailBody(e.target.value)}
                          className="w-full bg-white dark:bg-[#0c0e12] border border-slate-200 dark:border-white/5 rounded-lg p-2 text-xs text-slate-800 dark:text-slate-300 outline-none focus:border-indigo-500/50"
                        />
                      </div>

                      <div className="flex justify-between items-center pt-1">
                        <p className="text-[9px] text-slate-500 font-mono italic max-w-[170px]">
                          {isGmailAuthorized ? 'Authorized via Google OAuth' : 'Requires Client ID in Settings'}
                        </p>
                        {isGmailAuthorized ? (
                          <button
                            type="button"
                            onClick={() => sendGmailMessage(selectedLead.email || '', newEmailSubject, newEmailBody, selectedLead.id)}
                            disabled={!selectedLead.email || !newEmailBody.trim()}
                            className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:hover:bg-indigo-600 text-white text-[11px] font-semibold rounded-lg shadow-md transition cursor-pointer"
                          >
                            Send Email
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={handleGmailAuth}
                            className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-500 text-white text-[11px] font-semibold rounded-lg shadow-md transition cursor-pointer"
                          >
                            🔑 Connect Gmail
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* WhatsApp & Instagram Integration Section */}
                  <div className="border-t border-slate-200 dark:border-white/5 pt-4 mt-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                        💬 Messaging Outreach
                      </h3>
                      <div className="flex bg-slate-100 dark:bg-white/5 p-0.5 rounded-lg border border-slate-200 dark:border-white/5">
                        <button
                          type="button"
                          onClick={() => setActiveMsgPlatform('whatsapp')}
                          className={`px-2.5 py-1 text-[10px] font-bold rounded-md transition cursor-pointer ${activeMsgPlatform === 'whatsapp' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-200'}`}
                        >
                          WhatsApp
                        </button>
                        <button
                          type="button"
                          onClick={() => setActiveMsgPlatform('instagram')}
                          className={`px-2.5 py-1 text-[10px] font-bold rounded-md transition cursor-pointer ${activeMsgPlatform === 'instagram' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-200'}`}
                        >
                          Instagram
                        </button>
                      </div>
                    </div>

                    <div className="bg-slate-50 dark:bg-[#171922] border border-slate-200 dark:border-white/5 rounded-xl p-3.5 space-y-3">
                      {activeMsgPlatform === 'whatsapp' ? (
                        <>
                          {/* WhatsApp Phone */}
                          <div>
                            <label className="block text-[9px] text-slate-500 font-mono tracking-wider uppercase mb-1">WhatsApp Phone Number</label>
                            <input
                              type="text"
                              placeholder="+1234567890"
                              value={selectedLead.phone || ''}
                              onChange={(e) => handleUpdateLeadDetail({ ...selectedLead, phone: e.target.value }, null)}
                              className="w-full bg-white dark:bg-[#0c0e12] border border-slate-200 dark:border-white/5 rounded-lg p-2 text-xs text-slate-800 dark:text-slate-350 outline-none focus:border-indigo-500/50 font-mono"
                            />
                          </div>

                          {/* WhatsApp Message */}
                          <div>
                            <label className="block text-[9px] text-slate-500 font-mono tracking-wider uppercase mb-1">WhatsApp Outreach Draft</label>
                            <textarea
                              rows="3"
                              placeholder="Write WhatsApp message..."
                              value={newWhatsAppMessage}
                              onChange={(e) => setNewWhatsAppMessage(e.target.value)}
                              className="w-full bg-white dark:bg-[#0c0e12] border border-slate-200 dark:border-white/5 rounded-lg p-2 text-xs text-slate-800 dark:text-slate-300 outline-none focus:border-indigo-500/50"
                            />
                          </div>

                          <div className="flex justify-end pt-1">
                            <button
                              type="button"
                              onClick={() => {
                                const cleanPhone = (selectedLead.phone || '').replace(/[^0-9]/g, '');
                                if (!cleanPhone) {
                                  showToast('⚠️ Please enter a phone number first!');
                                  return;
                                }
                                const today = new Date().toISOString().split('T')[0];
                                const logEntry = {
                                  id: 'wa_sent_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
                                  timestamp: new Date().toISOString(),
                                  sender: 'you',
                                  text: `💬 WhatsApp Outreach Sent\nMessage: ${newWhatsAppMessage}`
                                };
                                handleUpdateLeadDetail({
                                  ...selectedLead,
                                  logs: [...(selectedLead.logs || []), logEntry],
                                  last_contacted: today
                                }, '💬 WhatsApp outreach sent & logged!');
                                
                                window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(newWhatsAppMessage)}`, '_blank');
                              }}
                              disabled={!(selectedLead.phone || '').trim() || !newWhatsAppMessage.trim()}
                              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:hover:bg-emerald-600 text-white text-[11px] font-semibold rounded-lg shadow-md transition cursor-pointer flex items-center gap-1.5"
                            >
                              <span>Send via WhatsApp</span>
                            </button>
                          </div>
                        </>
                      ) : (
                        <>
                          {/* Instagram Handle */}
                          <div>
                            <label className="block text-[9px] text-slate-500 font-mono tracking-wider uppercase mb-1">Instagram Handle</label>
                            <input
                              type="text"
                              placeholder="@username"
                              value={selectedLead.instagram_handle || ''}
                              onChange={(e) => handleUpdateLeadDetail({ ...selectedLead, instagram_handle: e.target.value }, null)}
                              className="w-full bg-white dark:bg-[#0c0e12] border border-slate-200 dark:border-white/5 rounded-lg p-2 text-xs text-slate-800 dark:text-slate-350 outline-none focus:border-indigo-500/50 font-mono"
                            />
                          </div>

                          {/* Instagram Message */}
                          <div>
                            <label className="block text-[9px] text-slate-500 font-mono tracking-wider uppercase mb-1">Instagram Outreach Draft</label>
                            <textarea
                              rows="3"
                              placeholder="Write Instagram message..."
                              value={newInstagramMessage}
                              onChange={(e) => setNewInstagramMessage(e.target.value)}
                              className="w-full bg-white dark:bg-[#0c0e12] border border-slate-200 dark:border-white/5 rounded-lg p-2 text-xs text-slate-800 dark:text-slate-350 outline-none focus:border-indigo-500/50"
                            />
                          </div>

                          <div className="flex justify-end pt-1">
                            <button
                              type="button"
                              onClick={() => {
                                const cleanHandle = (selectedLead.instagram_handle || '').replace('@', '').trim();
                                if (!cleanHandle) {
                                  showToast('⚠️ Please enter an Instagram handle first!');
                                  return;
                                }
                                navigator.clipboard.writeText(newInstagramMessage);
                                
                                const today = new Date().toISOString().split('T')[0];
                                const logEntry = {
                                  id: 'ig_sent_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
                                  timestamp: new Date().toISOString(),
                                  sender: 'you',
                                  text: `📸 Instagram Outreach Sent\nMessage: ${newInstagramMessage}`
                                };
                                handleUpdateLeadDetail({
                                  ...selectedLead,
                                  logs: [...(selectedLead.logs || []), logEntry],
                                  last_contacted: today
                                }, '📸 Instagram message copied & profile opened!');
                                
                                window.open(`https://instagram.com/${cleanHandle}/`, '_blank');
                              }}
                              disabled={!(selectedLead.instagram_handle || '').trim() || !newInstagramMessage.trim()}
                              className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-500 disabled:opacity-40 disabled:hover:bg-purple-600 text-white text-[11px] font-semibold rounded-lg shadow-md transition cursor-pointer flex items-center gap-1.5"
                            >
                              <span>Open Instagram & Copy Message</span>
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Log Conversation / Chat History Section */}
                  <div className="border-t border-slate-200 dark:border-white/5 pt-4 mt-4">
                    <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-3">
                      💬 Conversation History
                    </h3>
                    
                    {/* Quick Entry Box */}
                    <div className="bg-slate-50 dark:bg-[#171922] border border-slate-200 dark:border-white/5 rounded-xl p-3.5 space-y-3 mb-4">
                      <div className="text-[10px] text-slate-500 font-mono tracking-wider uppercase flex justify-between items-center">
                        <span>Log New Message</span>
                        <span className="text-[9px] text-indigo-400 font-normal normal-case">Adds to history</span>
                      </div>
                      <div className="grid grid-cols-1 gap-2.5">
                        <div>
                          <textarea
                            rows="2"
                            placeholder="What you sent (optional)..."
                            value={newLogSent}
                            onChange={(e) => setNewLogSent(e.target.value)}
                            className="w-full bg-white dark:bg-[#0c0e12] border border-slate-200 dark:border-white/5 rounded-lg p-2 text-xs text-slate-800 dark:text-slate-300 outline-none focus:border-indigo-500/50 resize-none"
                          />
                        </div>
                        <div>
                          <textarea
                            rows="2"
                            placeholder="What they replied (optional)..."
                            value={newLogReply}
                            onChange={(e) => setNewLogReply(e.target.value)}
                            className="w-full bg-white dark:bg-[#0c0e12] border border-slate-200 dark:border-white/5 rounded-lg p-2 text-xs text-slate-800 dark:text-slate-300 outline-none focus:border-indigo-500/50 resize-none"
                          />
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={handleAddLog}
                          disabled={!newLogSent.trim() && !newLogReply.trim()}
                          className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:hover:bg-indigo-600 text-white text-[11.5px] font-semibold rounded-lg shadow-md transition cursor-pointer"
                        >
                          Log Message
                        </button>
                      </div>
                    </div>

                    {/* History List */}
                    <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                      {(!selectedLead.logs || selectedLead.logs.length === 0) ? (
                        <div className="text-center py-6 text-xs text-slate-500 italic">
                          No messages logged yet. Use the fields above to add one.
                        </div>
                      ) : (
                        [...selectedLead.logs].reverse().map((log) => {
                          const isSystem = log.sender === 'system';
                          const isClient = log.sender === 'client';
                          
                          return (
                            <div 
                              key={log.id} 
                              className={`p-2.5 rounded-xl border text-xs ${
                                isSystem 
                                  ? 'bg-slate-100/50 dark:bg-slate-900/30 border-slate-200/50 dark:border-white/5 text-slate-500' 
                                  : isClient
                                    ? 'bg-purple-500/5 border-purple-500/10 text-slate-800 dark:text-purple-200'
                                    : 'bg-indigo-500/5 border-indigo-500/10 text-slate-800 dark:text-indigo-200'
                              }`}
                            >
                              <div className="flex items-center justify-between mb-1 text-[10px] text-slate-500 font-mono">
                                <span className="font-semibold capitalize">
                                  {isSystem ? '⚙️ System' : isClient ? '📩 Client' : '💬 You'}
                                </span>
                                <span>{new Date(log.timestamp).toLocaleString()}</span>
                              </div>
                              <p className="whitespace-pre-wrap leading-relaxed text-slate-700 dark:text-slate-300">{log.text}</p>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Save Button */}
              <div className="pt-4 border-t border-white/5 flex gap-2">
                <button 
                  onClick={handleCloseLeadDrawer}
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

      {/* PROJECT HUB & CLIENT LIFECYCLE DRAWER */}
      <AnimatePresence>
        {selectedProject && (() => {
          const clientLeads = leads.filter(l => l.business_name === selectedProject.client_name);
          const clientProjects = projects.filter(p => p.client_name === selectedProject.client_name);
          const clientInvoices = invoices.filter(i => i.client_name === selectedProject.client_name);
          
          return (
            <>
              {/* Backdrop */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedProject(null)}
                className="fixed inset-0 bg-black z-50 cursor-pointer"
              />
              {/* Drawer Container */}
              <motion.div 
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 30, stiffness: 220 }}
                className="fixed right-0 top-0 bottom-0 w-full max-w-4xl bg-white dark:bg-[#0c0e12] border-l border-slate-200 dark:border-white/10 z-50 shadow-2xl overflow-hidden flex flex-col h-full"
              >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 bg-slate-50 dark:bg-slate-955 border-b border-slate-200 dark:border-white/10 shrink-0">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/25 flex items-center justify-center text-indigo-400">
                      <Briefcase className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="font-extrabold text-base text-slate-800 dark:text-slate-100">Project Hub & Client Timeline</h2>
                      <p className="text-[10px] text-slate-400 font-mono tracking-wider uppercase">Client: {selectedProject.client_name}</p>
                    </div>
                  </div>
                  <button 
                    type="button"
                    onClick={() => setSelectedProject(null)}
                    className="p-2 text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/5 rounded-xl transition duration-150 cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Content Body */}
                <div className="flex-1 flex flex-col md:flex-row overflow-y-auto divide-y md:divide-y-0 md:divide-x divide-slate-200 dark:divide-white/5">
                  
                  {/* Left Column: Project Checklist & Settings */}
                  <div className="flex-1 p-6 space-y-6">
                    <div>
                      <span className="block text-[10px] font-mono tracking-widest text-indigo-400 uppercase font-bold border-b border-slate-200 dark:border-white/5 pb-1 mb-4">Project Settings</span>
                      
                      <div className="space-y-4 text-xs">
                        <div>
                          <label className="block text-[10px] text-slate-500 font-mono uppercase mb-1">Project Name</label>
                          <input 
                            type="text"
                            value={selectedProject.project_name}
                            onChange={(e) => handleUpdateProjectDetails(selectedProject.id, { project_name: e.target.value })}
                            className="w-full bg-slate-55 dark:bg-[#171922] border border-slate-200 dark:border-white/5 rounded-xl py-2 px-3 text-slate-700 dark:text-slate-200 outline-none focus:border-indigo-500/50"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[10px] text-slate-500 font-mono uppercase mb-1">Status</label>
                            <div className="relative">
                              <select
                                value={selectedProject.status}
                                onChange={(e) => handleUpdateProjectDetails(selectedProject.id, { status: e.target.value })}
                                className="w-full appearance-none bg-slate-55 dark:bg-[#171922] border border-slate-200 dark:border-white/5 rounded-xl py-2 px-3 pr-8 text-slate-700 dark:text-slate-200 outline-none focus:border-indigo-500/50"
                              >
                                <option value="Not Started">Not Started</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Client Review">Client Review</option>
                                <option value="Revision">Revision</option>
                                <option value="Delivered">Delivered</option>
                              </select>
                              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                            </div>
                          </div>
                          <div>
                            <label className="block text-[10px] text-slate-500 font-mono uppercase mb-1">Deadline Date</label>
                            <input 
                              type="date"
                              value={selectedProject.deadline}
                              onChange={(e) => handleUpdateProjectDetails(selectedProject.id, { deadline: e.target.value })}
                              className="w-full bg-slate-55 dark:bg-[#171922] border border-slate-200 dark:border-white/5 rounded-xl py-2 px-3 text-slate-700 dark:text-slate-200 outline-none focus:border-indigo-500/50 font-mono"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[10px] text-slate-500 font-mono uppercase mb-1">Google Drive Folder</label>
                            <input 
                              type="url"
                              value={selectedProject.drive_link}
                              onChange={(e) => handleUpdateProjectDetails(selectedProject.id, { drive_link: e.target.value })}
                              placeholder="https://drive.google.com/..."
                              className="w-full bg-slate-55 dark:bg-[#171922] border border-slate-200 dark:border-white/5 rounded-xl py-2 px-3 text-slate-700 dark:text-slate-200 outline-none focus:border-indigo-500/50 font-mono text-[11px]"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] text-slate-500 font-mono uppercase mb-1">Live Demo / URL</label>
                            <input 
                              type="url"
                              value={selectedProject.demo_link}
                              onChange={(e) => handleUpdateProjectDetails(selectedProject.id, { demo_link: e.target.value })}
                              placeholder="https://preview.com"
                              className="w-full bg-slate-55 dark:bg-[#171922] border border-slate-200 dark:border-white/5 rounded-xl py-2 px-3 text-slate-700 dark:text-slate-200 outline-none focus:border-indigo-500/50 font-mono text-[11px]"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] text-slate-500 font-mono uppercase mb-1">Project Notes & Scope</label>
                          <textarea 
                            value={selectedProject.notes}
                            onChange={(e) => handleUpdateProjectDetails(selectedProject.id, { notes: e.target.value })}
                            rows={3}
                            className="w-full bg-slate-55 dark:bg-[#171922] border border-slate-200 dark:border-white/5 rounded-xl py-2 px-3 text-slate-700 dark:text-slate-200 outline-none focus:border-indigo-500/50"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Interactive Checklist */}
                    <div>
                      <span className="block text-[10px] font-mono tracking-widest text-indigo-400 uppercase font-bold border-b border-slate-200 dark:border-white/5 pb-1 mb-4">Milestone Checklist</span>
                      <div className="space-y-2 bg-slate-50 dark:bg-[#101217] border border-slate-200 dark:border-white/5 p-4 rounded-2xl">
                        {selectedProject.checklist ? selectedProject.checklist.map(item => (
                          <label 
                            key={item.id} 
                            className="flex items-center gap-3 p-2 bg-white dark:bg-[#171922] border border-slate-200 dark:border-white/5 rounded-xl cursor-pointer select-none transition hover:border-indigo-500/20"
                          >
                            <input 
                              type="checkbox"
                              checked={item.completed}
                              onChange={() => handleToggleChecklistItem(selectedProject.id, item.id)}
                              className="rounded border-slate-300 dark:border-white/10 text-indigo-500 focus:ring-0 w-4 h-4 bg-slate-100 dark:bg-slate-900 cursor-pointer"
                            />
                            <span className={`text-xs font-medium ${item.completed ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-700 dark:text-slate-200'}`}>
                              {item.label}
                            </span>
                          </label>
                        )) : (
                          <div className="text-xs text-slate-450 italic">No checklist items configured.</div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Client Lifecycle Timeline (Dubsado/HoneyBook style!) */}
                  <div className="flex-1 p-6 space-y-6 bg-slate-50/50 dark:bg-slate-950/20">
                    <div>
                      <span className="block text-[10px] font-mono tracking-widest text-purple-400 uppercase font-bold border-b border-slate-200 dark:border-white/5 pb-1 mb-4">Client Lifecycle Timeline</span>
                      
                      <div className="relative border-l-2 border-indigo-500/20 ml-2.5 pl-5 space-y-6">
                        
                        {/* 1. Lead Source / History */}
                        <div className="relative">
                          {/* Dot indicator */}
                          <div className="absolute -left-[27px] top-1 w-3 h-3 rounded-full bg-indigo-500 border-2 border-white dark:border-[#0c0e12] shadow" />
                          
                          <div>
                            <span className="block text-[10px] font-mono tracking-widest text-indigo-400 uppercase font-bold">Step 1: Lead History</span>
                            <div className="mt-2 space-y-2">
                              {clientLeads.length > 0 ? clientLeads.map(lead => (
                                <div key={lead.id} className="p-3 bg-white dark:bg-[#171922] border border-slate-200 dark:border-white/5 rounded-xl text-xs space-y-1.5 shadow-sm">
                                  <div className="flex justify-between items-center">
                                    <span className="font-bold text-slate-800 dark:text-slate-200">{lead.business_name}</span>
                                    <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 font-semibold border border-indigo-500/20">
                                      {lead.outreach_status}
                                    </span>
                                  </div>
                                  <div className="grid grid-cols-2 gap-1 text-[10px] text-slate-400 font-mono">
                                    <div>Source: <span className="text-slate-300 capitalize">{lead.lead_source || 'Unknown'}</span></div>
                                    <div>Category: <span className="text-slate-300">{lead.category || 'N/A'}</span></div>
                                  </div>
                                  {lead.conversation_notes && (
                                    <p className="text-[10px] text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-white/[0.01] p-1.5 rounded italic">
                                      "{lead.conversation_notes}"
                                    </p>
                                  )}
                                </div>
                              )) : (
                                <div className="text-xs text-slate-450 italic p-3 bg-white dark:bg-[#171922] border border-dashed border-slate-200 dark:border-white/5 rounded-xl">
                                  No lead record found for this client.
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* 2. Active Projects */}
                        <div className="relative">
                          {/* Dot indicator */}
                          <div className="absolute -left-[27px] top-1 w-3 h-3 rounded-full bg-blue-500 border-2 border-white dark:border-[#0c0e12] shadow" />
                          
                          <div>
                            <span className="block text-[10px] font-mono tracking-widest text-blue-400 uppercase font-bold">Step 2: Project Delivery</span>
                            <div className="mt-2 space-y-2">
                              {clientProjects.map(proj => (
                                <div key={proj.id} className={`p-3 bg-white dark:bg-[#171922] border rounded-xl text-xs space-y-1.5 shadow-sm transition ${proj.id === selectedProject.id ? 'border-indigo-500/50 bg-indigo-500/[0.02]' : 'border-slate-200 dark:border-white/5'}`}>
                                  <div className="flex justify-between items-center">
                                    <span className="font-bold text-slate-800 dark:text-slate-200">{proj.project_name}</span>
                                    <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 font-semibold border border-blue-500/20">
                                      {proj.status}
                                    </span>
                                  </div>
                                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                                    <span>Deadline: {proj.deadline || '—'}</span>
                                    {proj.id === selectedProject.id && <span className="text-indigo-400 font-bold">(Viewing)</span>}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* 3. Invoices & Billing */}
                        <div className="relative">
                          {/* Dot indicator */}
                          <div className="absolute -left-[27px] top-1 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white dark:border-[#0c0e12] shadow" />
                          
                          <div>
                            <span className="block text-[10px] font-mono tracking-widest text-emerald-400 uppercase font-bold">Step 3: Billing & Payments</span>
                            <div className="mt-2 space-y-2">
                              {clientInvoices.length > 0 ? clientInvoices.map(inv => (
                                <div key={inv.id} className="p-3 bg-white dark:bg-[#171922] border border-slate-200 dark:border-white/5 rounded-xl text-xs space-y-1.5 shadow-sm">
                                  <div className="flex justify-between items-center">
                                    <div className="font-bold text-slate-800 dark:text-slate-200">
                                      {inv.currency === 'INR' ? '₹' : '$'}
                                      {inv.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                    </div>
                                    <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-semibold border ${
                                      inv.status === 'Paid' 
                                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                                        : inv.status === 'Sent' 
                                        ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                                        : 'bg-slate-500/10 text-slate-450 border-slate-500/20'
                                    }`}>
                                      {inv.status}
                                    </span>
                                  </div>
                                  <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono">
                                    <span>Due Date: {inv.due_date || '—'}</span>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setSelectedProject(null);
                                        setSelectedInvoice(inv);
                                      }}
                                      className="text-indigo-400 hover:underline cursor-pointer"
                                    >
                                      Open Invoice
                                    </button>
                                  </div>
                                </div>
                              )) : (
                                <div className="text-xs text-slate-450 italic p-3 bg-white dark:bg-[#171922] border border-dashed border-slate-200 dark:border-white/5 rounded-xl space-y-2">
                                  <span>No invoices generated yet.</span>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setNewInvoiceForm(prev => ({
                                        ...prev,
                                        client_name: selectedProject.client_name,
                                        project_id: selectedProject.id,
                                        amount: '1500'
                                      }));
                                      setSelectedProject(null);
                                      setIsAddInvoiceOpen(true);
                                    }}
                                    className="w-full py-1.5 bg-indigo-600/10 hover:bg-indigo-600/20 border border-indigo-500/20 text-indigo-400 rounded-lg text-[10px] font-bold transition flex items-center justify-center gap-1 cursor-pointer"
                                  >
                                    <Plus className="w-3 h-3" />
                                    <span>Generate Invoice</span>
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                      </div>
                    </div>
                  </div>

                </div>

                {/* Footer Controls */}
                <div className="px-6 py-4 bg-slate-50 dark:bg-slate-955 border-t border-slate-200 dark:border-white/10 flex justify-between shrink-0 text-xs">
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono flex items-center gap-1.5">
                    <span>Creator: {selectedProject.created_by || 'Sarfaraz'}</span>
                    <span>•</span>
                    <span>Assigned: {selectedProject.assigned_to || 'Sarfaraz'}</span>
                  </div>
                  <button 
                    type="button"
                    onClick={() => setSelectedProject(null)}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold cursor-pointer active:scale-95 transition"
                  >
                    Done
                  </button>
                </div>
              </motion.div>
            </>
          );
        })()}
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
                          <option value="Client Review">Client Review</option>
                          <option value="Revision">Revision</option>
                          <option value="Delivered">Delivered</option>
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

                    {/* File links */}
                    <div>
                      <label className="block text-[10px] text-slate-500 font-mono tracking-wider uppercase mb-1.5">Google Drive Assets Link</label>
                      <input 
                        type="url"
                        value={newProjectForm.drive_link}
                        onChange={(e) => setNewProjectForm({ ...newProjectForm, drive_link: e.target.value })}
                        placeholder="https://drive.google.com/..."
                        className="w-full bg-slate-50 dark:bg-[#171922] border border-slate-200 dark:border-white/5 rounded-xl py-2.5 px-3 text-xs text-slate-600 dark:text-slate-300 outline-none focus:border-indigo-500/50 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-500 font-mono tracking-wider uppercase mb-1.5">Live Demo / Website Link</label>
                      <input 
                        type="url"
                        value={newProjectForm.demo_link}
                        onChange={(e) => setNewProjectForm({ ...newProjectForm, demo_link: e.target.value })}
                        placeholder="https://your-preview-domain.com"
                        className="w-full bg-slate-50 dark:bg-[#171922] border border-slate-200 dark:border-white/5 rounded-xl py-2.5 px-3 text-xs text-slate-600 dark:text-slate-300 outline-none focus:border-indigo-500/50 font-mono"
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
                        className="flex-1 bg-white/5 hover:bg-white/10 text-white border border-white/5 text-[11px] font-semibold py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        Import Sheet
                      </button>
                      <button 
                        type="button"
                        onClick={() => syncWithGoogleSheets({ mode: 'sheets', sheetId: tempSheetId, apiKey: tempApiKey })}
                        disabled={syncing || !tempSheetId || !tempApiKey}
                        className="flex-1 bg-white/5 hover:bg-white/10 text-white border border-white/5 text-[11px] font-semibold py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        Export to Sheet
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Gemini API config */}
                <div className="pt-3 border-t border-white/5 space-y-2">
                  <label className="block text-[10px] text-slate-500 font-mono tracking-wider uppercase mb-1">Gemini AI Assistant Key</label>
                  <input 
                    type="password"
                    value={tempGeminiApiKey}
                    onChange={(e) => setTempGeminiApiKey(e.target.value)}
                    placeholder="Enter your Gemini API Key..."
                    className="w-full bg-slate-55 dark:bg-[#171922] border border-slate-200 dark:border-white/5 rounded-xl py-2.5 px-3 text-xs text-slate-800 dark:text-slate-300 outline-none focus:border-indigo-500/50 font-mono"
                  />
                  <p className="text-[9px] text-slate-500 font-mono leading-relaxed">
                    Required to unlock natural language CRM queries, auto-updates, and AI assistant actions. Get your API key from <a href="https://aistudio.google.com/" target="_blank" rel="noreferrer" className="text-indigo-400 hover:underline">Google AI Studio</a>.
                  </p>
                </div>

                {/* Google OAuth client config */}
                <div className="pt-3 border-t border-white/5 space-y-2">
                  <label className="block text-[10px] text-slate-500 font-mono tracking-wider uppercase mb-1">Google OAuth Client ID</label>
                  <input 
                    type="text"
                    value={tempGoogleClientId}
                    onChange={(e) => setTempGoogleClientId(e.target.value)}
                    placeholder="e.g. 1234567890-abc123xyz.apps.googleusercontent.com"
                    className="w-full bg-slate-50 dark:bg-[#171922] border border-slate-200 dark:border-white/5 rounded-xl py-2.5 px-3 text-xs text-slate-800 dark:text-slate-300 outline-none focus:border-indigo-500/50 font-mono"
                  />
                  <p className="text-[9px] text-slate-500 font-mono leading-relaxed">
                    Required for client-side Gmail sending. Create an OAuth Client ID (Web Application) in <a href="https://console.cloud.google.com/" target="_blank" rel="noreferrer" className="text-indigo-400 hover:underline">Google Cloud Console</a>.
                  </p>
                  
                  {/* Auth Status & Action */}
                  <div className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-[#171922] border border-slate-200 dark:border-white/5 rounded-xl mt-2">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${isGmailAuthorized ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
                      <span className="text-[11px] font-medium text-slate-700 dark:text-slate-300">
                        Gmail: {isGmailAuthorized ? 'Authorized' : 'Not Connected'}
                      </span>
                    </div>
                    {isGmailAuthorized ? (
                      <button
                        type="button"
                        onClick={handleGmailDisconnect}
                        className="px-2.5 py-1 text-[10px] bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 rounded-lg transition font-semibold cursor-pointer"
                      >
                        Disconnect
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleGmailAuth}
                        disabled={!tempGoogleClientId}
                        className="px-2.5 py-1 text-[10px] bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white rounded-lg transition font-semibold cursor-pointer"
                      >
                        Connect Gmail
                      </button>
                    )}
                  </div>
                </div>

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

      {/* AI ASSISTANT CHATBOT */}
      {/* Floating Button */}
      <div className="fixed bottom-6 right-6 z-40 print:hidden">
        <button
          onClick={() => setIsChatOpen(o => !o)}
          className="w-14 h-14 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-2xl shadow-indigo-500/30 text-white hover:scale-105 active:scale-95 transition cursor-pointer relative"
          title="Open Vexo AI Assistant"
        >
          {isChatOpen ? <X className="w-6 h-6" /> : <Bot className="w-7 h-7" />}
          {/* Pulsing Notification Dot */}
          {!isChatOpen && (
            <span className="absolute top-0.5 right-0.5 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
            </span>
          )}
        </button>
      </div>

      {/* Chat Sidebar Panel */}
      <AnimatePresence>
        {isChatOpen && (
          <>
            {/* Backdrop on mobile */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsChatOpen(false)}
              className="fixed inset-0 bg-black z-45 lg:hidden cursor-pointer"
            />
            
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-sm bg-slate-950/98 dark:bg-[#0c0e12]/98 border-l border-slate-200 dark:border-white/10 z-46 shadow-2xl flex flex-col justify-between backdrop-blur-md"
            >
              {/* Header */}
              <div className="p-4 border-b border-slate-200 dark:border-white/5 flex items-center justify-between bg-slate-900/40">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center">
                    <Bot className="w-4.5 h-4.5 text-indigo-400" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-xs text-slate-800 dark:text-slate-100 uppercase tracking-wider flex items-center gap-1.5">
                      Vexo AI Copilot
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    </h3>
                    <p className="text-[10px] text-slate-400 font-mono">CRM AI Assistant</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsChatOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Chat Feed */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 flex flex-col scrollbar-thin">
                {chatMessages.map(msg => (
                  <div
                    key={msg.id}
                    className={`flex flex-col max-w-[85%] ${
                      msg.sender === 'user' ? 'self-end items-end ml-auto' : 'self-start items-start mr-auto'
                    }`}
                  >
                    <div
                      className={`p-3 rounded-2xl text-xs leading-relaxed ${
                        msg.sender === 'user'
                          ? 'bg-indigo-600 text-white rounded-tr-none shadow-md'
                          : 'bg-slate-105 dark:bg-[#171922] border border-slate-200 dark:border-white/5 text-slate-800 dark:text-slate-250 rounded-tl-none shadow-sm'
                      }`}
                    >
                      {msg.text}
                    </div>
                    <span className="text-[9px] text-slate-500 font-mono mt-1">
                      {msg.sender === 'user' ? 'You' : 'Vexo AI'}
                    </span>
                  </div>
                ))}
                
                {isChatLoading && (
                  <div className="flex flex-col items-start mr-auto max-w-[85%]">
                    <div className="p-3 rounded-2xl bg-slate-105 dark:bg-[#171922] border border-slate-200 dark:border-white/5 text-slate-400 rounded-tl-none flex items-center gap-1.5 text-xs">
                      <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                )}
              </div>

              {/* Suggestions & Input area */}
              <div className="p-4 border-t border-slate-200 dark:border-white/5 bg-slate-900/20">
                {/* Suggestions row */}
                <div className="flex gap-1.5 overflow-x-auto pb-3 scrollbar-none mb-1">
                  <button
                    onClick={() => setChatInput("Show me Croydon leads not contacted")}
                    className="flex-shrink-0 px-2.5 py-1 text-[10px] bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 border border-slate-200 dark:border-white/5 text-slate-650 dark:text-slate-350 rounded-lg font-medium transition cursor-pointer"
                  >
                    🔍 Croydon leads not contacted
                  </button>
                  <button
                    onClick={() => setChatInput("Nail salons closed this week")}
                    className="flex-shrink-0 px-2.5 py-1 text-[10px] bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 border border-slate-200 dark:border-white/5 text-slate-650 dark:text-slate-350 rounded-lg font-medium transition cursor-pointer"
                  >
                    💅 Nail salons closed
                  </button>
                  <button
                    onClick={() => setChatInput("Which category has best response rate?")}
                    className="flex-shrink-0 px-2.5 py-1 text-[10px] bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 border border-slate-200 dark:border-white/5 text-slate-650 dark:text-slate-350 rounded-lg font-medium transition cursor-pointer"
                  >
                    📈 Best category response
                  </button>
                </div>

                <form onSubmit={handleSendChatMessage} className="flex gap-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Type AI command (e.g., mark Studio L won)..."
                    disabled={isChatLoading}
                    className="flex-1 bg-white dark:bg-[#171922] border border-slate-200 dark:border-white/5 rounded-xl py-2.5 px-3 text-xs text-slate-800 dark:text-slate-300 outline-none focus:border-indigo-500/50"
                  />
                  <button
                    type="submit"
                    disabled={!chatInput.trim() || isChatLoading}
                    className="px-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white text-xs font-semibold rounded-xl transition cursor-pointer"
                  >
                    Send
                  </button>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* INVOICE PREVIEW MODAL */}
      <AnimatePresence>
        {selectedInvoice && (() => {
          const lead = leads.find(l => l.business_name === selectedInvoice.client_name);
          const project = projects.find(p => p.id === selectedInvoice.project_id);
          const invoiceItems = selectedInvoice.items || getInvoiceItems(selectedInvoice, projects);
          const subtotal = invoiceItems.reduce((sum, item) => sum + (item.price * item.qty), 0);
          const discountAmount = templateConfig.discountAmount || 0;
          const taxPercentage = templateConfig.taxPercentage || 0;
          const taxAmount = Math.max(0, subtotal - discountAmount) * (taxPercentage / 100);
          const totalDue = Math.max(0, subtotal - discountAmount + taxAmount);
          
          return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-4 overflow-hidden bg-black/75 backdrop-blur-xs print:p-0 print:bg-white">
              <motion.div 
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="relative w-full max-w-6xl bg-slate-900 border border-white/10 rounded-none md:rounded-2xl shadow-2xl overflow-hidden z-10 flex flex-col h-full md:h-[92vh] print:h-auto print:max-h-none print:my-0 print:border-none print:shadow-none print:rounded-none"
              >
                {/* Modal controls bar - NOT printed */}
                <div className="flex items-center justify-between px-6 py-4 bg-slate-950 border-b border-white/10 shrink-0 print:hidden">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-indigo-400" />
                    <span className="font-bold text-sm text-slate-200">Interactive Invoice Builder</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => setShowEditorSidebar(prev => !prev)}
                      className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10 rounded-xl text-[11px] font-semibold transition active:scale-95 cursor-pointer"
                    >
                      {showEditorSidebar ? 'Hide Editor Settings' : 'Show Editor Settings'}
                    </button>
                    <button 
                      onClick={() => window.print()}
                      className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition active:scale-95 cursor-pointer"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Print / Save PDF</span>
                    </button>
                    <button 
                      onClick={() => setSelectedInvoice(null)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Mobile Sub-Tab switcher - hidden on desktop, print:hidden */}
                <div className="flex md:hidden bg-slate-950 border-b border-white/10 shrink-0 print:hidden text-xs">
                  <button 
                    onClick={() => setModalSubTab('preview')}
                    className={`flex-1 py-3 text-center font-bold uppercase tracking-wider ${modalSubTab === 'preview' ? 'text-indigo-400 border-b-2 border-indigo-500 bg-white/5' : 'text-slate-405'}`}
                  >
                    View Invoice Sheet
                  </button>
                  <button 
                    onClick={() => setModalSubTab('edit')}
                    className={`flex-1 py-3 text-center font-bold uppercase tracking-wider ${modalSubTab === 'edit' ? 'text-indigo-400 border-b-2 border-indigo-500 bg-white/5' : 'text-slate-405'}`}
                  >
                    Edit Template Details
                  </button>
                </div>

                {/* Main Content Panels: Left (Editor), Right (Fidelity Preview) */}
                <div className="flex flex-1 overflow-hidden print:overflow-visible">
                  
                  {/* Left Panel: Configuration Form */}
                  <div className={`${modalSubTab === 'edit' ? 'block' : 'hidden'} ${showEditorSidebar ? 'md:block' : 'md:hidden'} w-full md:w-80 lg:w-[350px] border-r border-slate-200 dark:border-white/10 overflow-y-auto p-5 print:hidden bg-slate-50 dark:bg-[#0c0e12] shrink-0`}>
                    <h3 className="text-xs font-extrabold text-indigo-400 uppercase tracking-widest mb-4">Template Customizer</h3>
                    
                    <div className="space-y-5 text-slate-700 dark:text-slate-300 text-xs">
                      
                      {/* Section 1: Header Info */}
                      <div className="space-y-3.5">
                        <span className="block text-[10px] font-mono tracking-widest text-slate-450 dark:text-slate-500 uppercase font-bold border-b border-slate-200 dark:border-white/5 pb-1">Branding & Header</span>
                        <div>
                          <label className="block text-[10px] text-slate-400 uppercase font-mono mb-1">Company / Brand Name</label>
                          <input 
                            type="text" 
                            value={templateConfig.brandName} 
                            onChange={(e) => setTemplateConfig(prev => ({ ...prev, brandName: e.target.value }))}
                            className="w-full bg-white dark:bg-[#171922] border border-slate-200 dark:border-white/5 rounded-xl py-2 px-3 text-xs outline-none focus:border-indigo-505/50 text-slate-800 dark:text-slate-200"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-slate-400 uppercase font-mono mb-1">Brand Tagline</label>
                          <input 
                            type="text" 
                            value={templateConfig.brandTagline} 
                            onChange={(e) => setTemplateConfig(prev => ({ ...prev, brandTagline: e.target.value }))}
                            className="w-full bg-white dark:bg-[#171922] border border-slate-200 dark:border-white/5 rounded-xl py-2 px-3 text-xs outline-none focus:border-indigo-505/50 text-slate-800 dark:text-slate-200"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-slate-400 uppercase font-mono mb-1">Founder / CEO Name</label>
                          <input 
                            type="text" 
                            value={templateConfig.founderName} 
                            onChange={(e) => setTemplateConfig(prev => ({ ...prev, founderName: e.target.value }))}
                            className="w-full bg-white dark:bg-[#171922] border border-slate-200 dark:border-white/5 rounded-xl py-2 px-3 text-xs outline-none focus:border-indigo-505/50 text-slate-800 dark:text-slate-200"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-slate-400 uppercase font-mono mb-1">Founder Role Description</label>
                          <input 
                            type="text" 
                            value={templateConfig.founderRole} 
                            onChange={(e) => setTemplateConfig(prev => ({ ...prev, founderRole: e.target.value }))}
                            className="w-full bg-white dark:bg-[#171922] border border-slate-200 dark:border-white/5 rounded-xl py-2 px-3 text-xs outline-none focus:border-indigo-505/50 text-slate-800 dark:text-slate-200"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-slate-400 uppercase font-mono mb-1">Contact Email</label>
                          <input 
                            type="text" 
                            value={templateConfig.email} 
                            onChange={(e) => setTemplateConfig(prev => ({ ...prev, email: e.target.value }))}
                            className="w-full bg-white dark:bg-[#171922] border border-slate-200 dark:border-white/5 rounded-xl py-2 px-3 text-xs outline-none focus:border-indigo-505/50 font-mono text-slate-800 dark:text-slate-200"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-slate-400 uppercase font-mono mb-1">Contact Website</label>
                          <input 
                            type="text" 
                            value={templateConfig.website} 
                            onChange={(e) => setTemplateConfig(prev => ({ ...prev, website: e.target.value }))}
                            className="w-full bg-white dark:bg-[#171922] border border-slate-200 dark:border-white/5 rounded-xl py-2 px-3 text-xs outline-none focus:border-indigo-505/50 font-mono text-slate-800 dark:text-slate-200"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-slate-400 uppercase font-mono mb-1">Contact Phone</label>
                          <input 
                            type="text" 
                            value={templateConfig.phone} 
                            onChange={(e) => setTemplateConfig(prev => ({ ...prev, phone: e.target.value }))}
                            className="w-full bg-white dark:bg-[#171922] border border-slate-200 dark:border-white/5 rounded-xl py-2 px-3 text-xs outline-none focus:border-indigo-505/50 font-mono text-slate-800 dark:text-slate-200"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-slate-400 uppercase font-mono mb-1">Contact Location / Details</label>
                          <input 
                            type="text" 
                            value={templateConfig.location} 
                            onChange={(e) => setTemplateConfig(prev => ({ ...prev, location: e.target.value }))}
                            className="w-full bg-white dark:bg-[#171922] border border-slate-200 dark:border-white/5 rounded-xl py-2 px-3 text-xs outline-none focus:border-indigo-505/50 text-slate-800 dark:text-slate-200"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-slate-400 uppercase font-mono mb-1">Founder Photo / Avatar</label>
                          <div className="flex items-center gap-3 bg-white dark:bg-[#171922] border border-slate-200 dark:border-white/5 rounded-xl p-3">
                            <img 
                              src={templateConfig.avatarUrl || '/sarfaraz_avatar.png'} 
                              alt="Avatar Preview" 
                              className="w-12 h-12 rounded-full object-cover border border-slate-250 dark:border-white/10 shrink-0 bg-slate-800"
                            />
                            <div className="flex-1 space-y-1.5">
                              <input 
                                type="file" 
                                accept="image/*" 
                                onChange={handleAvatarUpload}
                                className="hidden" 
                                id="avatar-upload-file" 
                              />
                              <label 
                                htmlFor="avatar-upload-file"
                                className="inline-flex items-center justify-center w-full px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 rounded-lg text-[10px] font-bold cursor-pointer transition text-slate-700 dark:text-slate-200 select-none text-center"
                              >
                                Upload Local Photo
                              </label>
                              {templateConfig.avatarUrl !== '/sarfaraz_avatar.png' && (
                                <button
                                  type="button"
                                  onClick={() => setTemplateConfig(prev => ({ ...prev, avatarUrl: '/sarfaraz_avatar.png' }))}
                                  className="w-full text-center text-[9px] text-rose-400 hover:underline cursor-pointer block"
                                >
                                  Reset to Default Avatar
                                </button>
                              )}
                            </div>
                          </div>
                          <div className="mt-2">
                            <label className="block text-[9px] text-slate-500 uppercase font-mono mb-1">Or enter photo URL directly</label>
                            <input 
                              type="text" 
                              value={templateConfig.avatarUrl} 
                              onChange={(e) => setTemplateConfig(prev => ({ ...prev, avatarUrl: e.target.value }))}
                              className="w-full bg-white dark:bg-[#171922] border border-slate-200 dark:border-white/5 rounded-xl py-1.5 px-3 text-[11px] outline-none focus:border-indigo-505/50 font-mono text-slate-800 dark:text-slate-200"
                              placeholder="e.g. /sarfaraz_avatar.png"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Section 2: Toggle Visibility */}
                      <div className="space-y-2">
                        <span className="block text-[10px] font-mono tracking-widest text-slate-450 dark:text-slate-500 uppercase font-bold border-b border-slate-200 dark:border-white/5 pb-1">Visible Layout Blocks</span>
                        
                        <label className="flex items-center gap-2.5 py-1 cursor-pointer select-none">
                          <input 
                            type="checkbox" 
                            checked={templateConfig.showBarcode} 
                            onChange={(e) => setTemplateConfig(prev => ({ ...prev, showBarcode: e.target.checked }))}
                            className="rounded border-slate-300 dark:border-white/10 text-indigo-500 focus:ring-0 w-4 h-4 bg-slate-100 dark:bg-slate-900"
                          />
                          <span>Show Header Barcode</span>
                        </label>
                        <label className="flex items-center gap-2.5 py-1 cursor-pointer select-none">
                          <input 
                            type="checkbox" 
                            checked={templateConfig.showSignature} 
                            onChange={(e) => setTemplateConfig(prev => ({ ...prev, showSignature: e.target.checked }))}
                            className="rounded border-slate-300 dark:border-white/10 text-indigo-500 focus:ring-0 w-4 h-4 bg-slate-100 dark:bg-slate-900"
                          />
                          <span>Show Thank You & Signature</span>
                        </label>
                        <label className="flex items-center gap-2.5 py-1 cursor-pointer select-none">
                          <input 
                            type="checkbox" 
                            checked={templateConfig.showPaymentDetails} 
                            onChange={(e) => setTemplateConfig(prev => ({ ...prev, showPaymentDetails: e.target.checked }))}
                            className="rounded border-slate-300 dark:border-white/10 text-indigo-500 focus:ring-0 w-4 h-4 bg-slate-100 dark:bg-slate-900"
                          />
                          <span>Show Bank / Payment Details</span>
                        </label>
                        <label className="flex items-center gap-2.5 py-1 cursor-pointer select-none">
                          <input 
                            type="checkbox" 
                            checked={templateConfig.showNotes} 
                            onChange={(e) => setTemplateConfig(prev => ({ ...prev, showNotes: e.target.checked }))}
                            className="rounded border-slate-300 dark:border-white/10 text-indigo-500 focus:ring-0 w-4 h-4 bg-slate-100 dark:bg-slate-900"
                          />
                          <span>Show General Notes Block</span>
                        </label>
                        <label className="flex items-center gap-2.5 py-1 cursor-pointer select-none">
                          <input 
                            type="checkbox" 
                            checked={templateConfig.showQrCode} 
                            onChange={(e) => setTemplateConfig(prev => ({ ...prev, showQrCode: e.target.checked }))}
                            className="rounded border-slate-300 dark:border-white/10 text-indigo-500 focus:ring-0 w-4 h-4 bg-slate-100 dark:bg-slate-900"
                          />
                          <span>Show "Scan to Pay" QR Card</span>
                        </label>
                      </div>

                      {/* Section 3: Bank Details */}
                      {templateConfig.showPaymentDetails && (
                        <div className="space-y-3.5">
                          <span className="block text-[10px] font-mono tracking-widest text-slate-450 dark:text-slate-500 uppercase font-bold border-b border-slate-200 dark:border-white/5 pb-1">Payment Details</span>
                          <div>
                            <label className="block text-[10px] text-slate-400 uppercase font-mono mb-1">Bank Name</label>
                            <input 
                              type="text" 
                              value={templateConfig.bankName} 
                              onChange={(e) => setTemplateConfig(prev => ({ ...prev, bankName: e.target.value }))}
                              className="w-full bg-white dark:bg-[#171922] border border-slate-200 dark:border-white/5 rounded-xl py-2 px-3 text-xs outline-none focus:border-indigo-505/50 text-slate-800 dark:text-slate-200"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] text-slate-400 uppercase font-mono mb-1">Account Name</label>
                            <input 
                              type="text" 
                              value={templateConfig.accountName} 
                              onChange={(e) => setTemplateConfig(prev => ({ ...prev, accountName: e.target.value }))}
                              className="w-full bg-white dark:bg-[#171922] border border-slate-200 dark:border-white/5 rounded-xl py-2 px-3 text-xs outline-none focus:border-indigo-505/50 text-slate-800 dark:text-slate-200"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] text-slate-400 uppercase font-mono mb-1">Account Number</label>
                            <input 
                              type="text" 
                              value={templateConfig.accountNumber} 
                              onChange={(e) => setTemplateConfig(prev => ({ ...prev, accountNumber: e.target.value }))}
                              className="w-full bg-white dark:bg-[#171922] border border-slate-200 dark:border-white/5 rounded-xl py-2 px-3 text-xs outline-none focus:border-indigo-505/50 font-mono text-slate-800 dark:text-slate-200"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] text-slate-400 uppercase font-mono mb-1">Routing (ABA / IFSC)</label>
                            <input 
                              type="text" 
                              value={templateConfig.routingABA} 
                              onChange={(e) => setTemplateConfig(prev => ({ ...prev, routingABA: e.target.value }))}
                              className="w-full bg-white dark:bg-[#171922] border border-slate-200 dark:border-white/5 rounded-xl py-2 px-3 text-xs outline-none focus:border-indigo-505/50 font-mono text-slate-800 dark:text-slate-200"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] text-slate-400 uppercase font-mono mb-1">SWIFT / BIC Code</label>
                            <input 
                              type="text" 
                              value={templateConfig.swiftBIC} 
                              onChange={(e) => setTemplateConfig(prev => ({ ...prev, swiftBIC: e.target.value }))}
                              className="w-full bg-white dark:bg-[#171922] border border-slate-200 dark:border-white/5 rounded-xl py-2 px-3 text-xs outline-none focus:border-indigo-505/50 font-mono text-slate-800 dark:text-slate-200"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] text-slate-400 uppercase font-mono mb-1">PayPal Email</label>
                            <input 
                              type="text" 
                              value={templateConfig.paypal} 
                              onChange={(e) => setTemplateConfig(prev => ({ ...prev, paypal: e.target.value }))}
                              className="w-full bg-white dark:bg-[#171922] border border-slate-200 dark:border-white/5 rounded-xl py-2 px-3 text-xs outline-none focus:border-indigo-505/50 font-mono text-slate-800 dark:text-slate-200"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] text-slate-400 uppercase font-mono mb-1">Payoneer Note / Email</label>
                            <input 
                              type="text" 
                              value={templateConfig.payoneer} 
                              onChange={(e) => setTemplateConfig(prev => ({ ...prev, payoneer: e.target.value }))}
                              className="w-full bg-white dark:bg-[#171922] border border-slate-200 dark:border-white/5 rounded-xl py-2 px-3 text-xs outline-none focus:border-indigo-505/50 font-mono text-slate-800 dark:text-slate-200"
                            />
                          </div>
                          {templateConfig.showQrCode && (
                            <div>
                              <label className="block text-[10px] text-slate-400 uppercase font-mono mb-1">QR Code Payment Card</label>
                              <div className="flex items-center gap-3 bg-white dark:bg-[#171922] border border-slate-200 dark:border-white/5 rounded-xl p-3">
                                <img 
                                  src={templateConfig.qrUrl || '/payment_qr_card.png'} 
                                  alt="QR Preview" 
                                  className="w-12 h-12 rounded object-contain bg-white border border-slate-250 shrink-0 p-0.5"
                                />
                                <div className="flex-1 space-y-1.5">
                                  <input 
                                    type="file" 
                                    accept="image/*" 
                                    onChange={handleQrUpload}
                                    className="hidden" 
                                    id="qr-upload-file" 
                                  />
                                  <label 
                                    htmlFor="qr-upload-file"
                                    className="inline-flex items-center justify-center w-full px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 rounded-lg text-[10px] font-bold cursor-pointer transition text-slate-700 dark:text-slate-200 select-none text-center"
                                  >
                                    Upload QR Code Image
                                  </label>
                                  {templateConfig.qrUrl !== '/payment_qr_card.png' && (
                                    <button
                                      type="button"
                                      onClick={() => setTemplateConfig(prev => ({ ...prev, qrUrl: '/payment_qr_card.png' }))}
                                      className="w-full text-center text-[9px] text-rose-450 hover:underline cursor-pointer block"
                                    >
                                      Reset to Default QR Card
                                    </button>
                                  )}
                                </div>
                              </div>
                              <div className="mt-2">
                                <label className="block text-[9px] text-slate-500 uppercase font-mono mb-1">Or enter QR URL directly</label>
                                <input 
                                  type="text" 
                                  value={templateConfig.qrUrl} 
                                  onChange={(e) => setTemplateConfig(prev => ({ ...prev, qrUrl: e.target.value }))}
                                  className="w-full bg-white dark:bg-[#171922] border border-slate-200 dark:border-white/5 rounded-xl py-1.5 px-3 text-[11px] outline-none focus:border-indigo-505/50 font-mono text-slate-800 dark:text-slate-200"
                                  placeholder="e.g. /payment_qr_card.png"
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Section 4: Notes Text */}
                      {templateConfig.showNotes && (
                        <div>
                          <span className="block text-[10px] font-mono tracking-widest text-slate-450 dark:text-slate-500 uppercase font-bold border-b border-slate-200 dark:border-white/5 pb-1 mb-2">Custom Note Message</span>
                          <textarea 
                            rows="4"
                            value={templateConfig.notesText} 
                            onChange={(e) => setTemplateConfig(prev => ({ ...prev, notesText: e.target.value }))}
                            className="w-full bg-white dark:bg-[#171922] border border-slate-200 dark:border-white/5 rounded-xl py-2 px-3 text-xs outline-none focus:border-indigo-505/50 leading-relaxed font-sans text-slate-800 dark:text-slate-200"
                          />
                        </div>
                      )}

                      {/* Section 5: Services & Line Items */}
                      <div className="space-y-3.5 border-t border-slate-200 dark:border-white/5 pt-4 mt-2">
                        <span className="block text-[10px] font-mono tracking-widest text-slate-450 dark:text-slate-500 uppercase font-bold border-b border-slate-200 dark:border-white/5 pb-1">Services & Line Items</span>
                        
                        <div className="space-y-3">
                          {((selectedInvoice.items) || getInvoiceItems(selectedInvoice, projects)).map((item, idx) => (
                            <div key={item.id || idx} className="p-3 bg-white dark:bg-[#171922] border border-slate-200 dark:border-white/5 rounded-xl space-y-2 relative group">
                              <button
                                type="button"
                                onClick={() => {
                                  const currentItems = selectedInvoice.items || getInvoiceItems(selectedInvoice, projects);
                                  const updated = currentItems.filter((_, i) => i !== idx);
                                  handleUpdateInvoiceItems(updated);
                                }}
                                className="absolute top-2 right-2 text-rose-500 hover:text-rose-700 opacity-60 hover:opacity-100 cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>

                              <div>
                                <label className="block text-[9px] text-slate-400 uppercase font-mono mb-0.5">Service Name / Title</label>
                                <input
                                  type="text"
                                  value={item.desc}
                                  onChange={(e) => {
                                    const currentItems = [...(selectedInvoice.items || getInvoiceItems(selectedInvoice, projects))];
                                    currentItems[idx] = { ...currentItems[idx], desc: e.target.value };
                                    handleUpdateInvoiceItems(currentItems);
                                  }}
                                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-lg py-1 px-2 text-[11px] outline-none text-slate-800 dark:text-slate-200"
                                />
                              </div>
                              
                              <div>
                                <label className="block text-[9px] text-slate-400 uppercase font-mono mb-0.5">Scope / Details</label>
                                <input
                                  type="text"
                                  value={item.detail}
                                  onChange={(e) => {
                                    const currentItems = [...(selectedInvoice.items || getInvoiceItems(selectedInvoice, projects))];
                                    currentItems[idx] = { ...currentItems[idx], detail: e.target.value };
                                    handleUpdateInvoiceItems(currentItems);
                                  }}
                                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-lg py-1 px-2 text-[11px] outline-none text-slate-800 dark:text-slate-200"
                                />
                              </div>

                              <div className="grid grid-cols-3 gap-2">
                                <div>
                                  <label className="block text-[9px] text-slate-400 uppercase font-mono mb-0.5">Qty</label>
                                  <input
                                    type="number"
                                    min="1"
                                    value={item.qty}
                                    onChange={(e) => {
                                      const currentItems = [...(selectedInvoice.items || getInvoiceItems(selectedInvoice, projects))];
                                      currentItems[idx] = { ...currentItems[idx], qty: parseInt(e.target.value) || 1 };
                                      handleUpdateInvoiceItems(currentItems);
                                    }}
                                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-lg py-1 px-2 text-[11px] outline-none text-slate-800 dark:text-slate-200 text-center font-mono"
                                  />
                                </div>
                                <div className="col-span-2">
                                  <label className="block text-[9px] text-slate-400 uppercase font-mono mb-0.5">Unit Price ({selectedInvoice.currency === 'INR' ? '₹' : '$'})</label>
                                  <input
                                    type="number"
                                    min="0"
                                    value={item.price}
                                    onChange={(e) => {
                                      const currentItems = [...(selectedInvoice.items || getInvoiceItems(selectedInvoice, projects))];
                                      currentItems[idx] = { ...currentItems[idx], price: parseFloat(e.target.value) || 0 };
                                      handleUpdateInvoiceItems(currentItems);
                                    }}
                                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-lg py-1 px-2 text-[11px] outline-none text-slate-800 dark:text-slate-200 font-mono text-right"
                                  />
                                </div>
                              </div>
                              
                              <div>
                                <label className="block text-[9px] text-slate-400 uppercase font-mono mb-0.5">Icon Style</label>
                                <div className="flex gap-1.5 mt-1">
                                  {['code', 'video', 'robot', 'settings', 'rocket'].map(iconName => (
                                    <button
                                      key={iconName}
                                      type="button"
                                      onClick={() => {
                                        const currentItems = [...(selectedInvoice.items || getInvoiceItems(selectedInvoice, projects))];
                                        currentItems[idx] = { ...currentItems[idx], icon: iconName };
                                        handleUpdateInvoiceItems(currentItems);
                                      }}
                                      className={`flex-1 py-1 rounded text-center border capitalize text-[9px] transition cursor-pointer ${item.icon === iconName ? 'bg-indigo-500/10 border-indigo-500/50 text-indigo-400 font-bold' : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-white/5 text-slate-405'}`}
                                    >
                                      {iconName}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        <button
                          type="button"
                          onClick={() => {
                            const currentItems = [...(selectedInvoice.items || getInvoiceItems(selectedInvoice, projects))];
                            const newItem = {
                              id: `item_${Date.now()}`,
                              desc: 'New Service Deliverable',
                              detail: 'Milestone scope details',
                              qty: 1,
                              price: 500,
                              icon: 'code'
                            };
                            handleUpdateInvoiceItems([...currentItems, newItem]);
                          }}
                          className="w-full py-2 bg-indigo-600/10 hover:bg-indigo-650/20 border border-indigo-500/20 text-indigo-400 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer mt-2"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add Line Item</span>
                        </button>
                      </div>

                      {/* Section 6: Discounts & Taxes */}
                      <div className="space-y-3.5 border-t border-slate-200 dark:border-white/5 pt-4 mt-2">
                        <span className="block text-[10px] font-mono tracking-widest text-slate-450 dark:text-slate-500 uppercase font-bold border-b border-slate-200 dark:border-white/5 pb-1">Discounts & Taxes</span>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[10px] text-slate-400 uppercase font-mono mb-1">Tax Label (GST/VAT)</label>
                            <input 
                              type="text" 
                              value={templateConfig.taxLabel} 
                              onChange={(e) => setTemplateConfig(prev => ({ ...prev, taxLabel: e.target.value }))}
                              className="w-full bg-white dark:bg-[#171922] border border-slate-200 dark:border-white/5 rounded-xl py-2 px-3 text-xs outline-none focus:border-indigo-505/50 text-slate-800 dark:text-slate-200"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] text-slate-400 uppercase font-mono mb-1">Tax Rate (%)</label>
                            <input 
                              type="number" 
                              min="0"
                              value={templateConfig.taxPercentage} 
                              onChange={(e) => setTemplateConfig(prev => ({ ...prev, taxPercentage: parseFloat(e.target.value) || 0 }))}
                              className="w-full bg-white dark:bg-[#171922] border border-slate-200 dark:border-white/5 rounded-xl py-2 px-3 text-xs outline-none focus:border-indigo-505/50 font-mono text-slate-800 dark:text-slate-200"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-[10px] text-slate-400 uppercase font-mono mb-1">Discount Amount ({selectedInvoice.currency === 'INR' ? '₹' : '$'})</label>
                          <input 
                            type="number" 
                            min="0"
                            value={templateConfig.discountAmount} 
                            onChange={(e) => setTemplateConfig(prev => ({ ...prev, discountAmount: parseFloat(e.target.value) || 0 }))}
                            className="w-full bg-white dark:bg-[#171922] border border-slate-200 dark:border-white/5 rounded-xl py-2 px-3 text-xs outline-none focus:border-indigo-505/50 font-mono text-slate-800 dark:text-slate-200"
                          />
                        </div>
                      </div>

                    </div>

                  </div>

                  {/* Right Panel: Scaled Invoice Preview */}
                  <div 
                    ref={previewContainerRef}
                    className={`${modalSubTab === 'preview' ? 'flex' : 'hidden'} md:flex flex-1 overflow-y-auto p-4 md:p-8 bg-slate-950/20 items-start justify-center print:p-0 print:bg-white print:overflow-visible h-full w-full`}
                  >
                    
                    {/* Fixed aspect sheet container. Prevents responsive vertical stack on screen. */}
                    <div 
                      className="w-full py-2 md:py-0 flex justify-center items-start origin-top transition-transform duration-200 print:transform-none print:w-full print:overflow-visible"
                      style={{ 
                        transform: `scale(${scaleFactor})`, 
                        width: '780px',
                        height: `${1250 * scaleFactor}px`,
                        marginBottom: `${-1250 * (1 - scaleFactor)}px`
                      }}
                    >
                      
                      {/* Print Container Sheet - Fixed width to match A4 aspect ratio on screen */}
                      <div id="invoice-print-area" className="w-[780px] bg-white text-slate-800 shadow-xl rounded-2xl overflow-hidden border border-slate-200 print:shadow-none print:border-none print:rounded-none print:w-full shrink-0">
                        
                        {/* Header Section */}
                        <div className="bg-gradient-to-r from-slate-950 via-[#0d0b26] to-slate-900 text-white p-8 relative overflow-hidden flex justify-between items-center gap-6">
                          {/* Decorative circles */}
                          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
                          <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
                          
                          <div className="flex items-center gap-4.5 z-10">
                            {templateConfig.avatarUrl && (
                              <img 
                                src={templateConfig.avatarUrl} 
                                alt={templateConfig.founderName} 
                                className="w-20 h-20 rounded-full border-2 border-purple-500/80 shadow-[0_0_15px_rgba(168,85,247,0.35)] object-cover bg-slate-800"
                              />
                            )}
                            <div>
                              <h1 className="text-2xl font-black tracking-widest bg-gradient-to-r from-white via-slate-100 to-purple-300 bg-clip-text text-transparent">{templateConfig.brandName}</h1>
                              <p className="text-[8.5px] uppercase tracking-widest text-slate-405 font-bold mt-0.5">{templateConfig.brandTagline}</p>
                              
                              <div className="mt-2.5 flex flex-col">
                                <span className="font-['Caveat',_cursive] text-2xl text-indigo-300 leading-none">{templateConfig.founderName}</span>
                                <span className="text-[9px] text-slate-500 font-mono tracking-wider">{templateConfig.founderRole}</span>
                              </div>
                            </div>
                          </div>

                          {/* Invoice ID Metadata */}
                          <div className="z-10 bg-slate-900/60 border border-white/5 rounded-xl p-4 min-w-[190px] text-right shrink-0">
                            <span className="block text-[9px] font-mono tracking-widest text-indigo-300 uppercase font-bold">Invoice No.</span>
                            <span className="block text-lg font-bold font-mono text-slate-100 mt-0.5">
                              INV-{selectedInvoice.created_date ? selectedInvoice.created_date.replace(/-/g, '') : '20250704'}-{selectedInvoice.id.split('_')[1]?.slice(-4) || '1024'}
                            </span>
                            
                            {/* Barcode Mockup */}
                            {templateConfig.showBarcode && (
                              <div className="flex gap-[1.5px] items-stretch justify-end h-8 mt-3.5 opacity-60">
                                {[1, 3, 1, 2, 1, 4, 1, 2, 3, 1, 2, 1, 3, 1, 2, 4, 1, 2, 1, 3, 1, 2, 1, 3, 2, 1].map((w, idx) => (
                                  <div key={idx} className="bg-white" style={{ width: `${w}px` }}></div>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Lower details row inside header */}
                          <div className="w-full border-t border-white/10 mt-6 pt-4 flex flex-wrap gap-x-6 gap-y-2 text-slate-300 text-[10px] font-mono z-10">
                            <div className="flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                              <span>{templateConfig.email}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                              <span>{templateConfig.website}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                              <span>{templateConfig.location}</span>
                            </div>
                          </div>
                        </div>

                        {/* Billing Info Columns */}
                        <div className="p-8 bg-white grid grid-cols-3 gap-6">
                          {/* Bill To */}
                          <div className="col-span-1">
                            <span className="block text-[10px] font-mono tracking-widest text-indigo-650 uppercase font-bold mb-3 border-b border-slate-100 pb-1">Bill To</span>
                            <div className="space-y-2.5 text-[11px] text-slate-600">
                              <div className="flex items-center gap-2">
                                <div className="p-1 rounded bg-slate-100 shrink-0"><User className="w-3.5 h-3.5 text-indigo-500" /></div>
                                <span className="font-bold text-slate-900 truncate">{selectedInvoice.client_name}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="p-1 rounded bg-slate-100 shrink-0"><Briefcase className="w-3.5 h-3.5 text-slate-500" /></div>
                                <span className="truncate">{lead?.category ? `${lead.category.charAt(0).toUpperCase() + lead.category.slice(1)} Partner` : 'Premium Client'}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="p-1 rounded bg-slate-100 shrink-0"><Building2 className="w-3.5 h-3.5 text-slate-500" /></div>
                                <span className="truncate">{selectedInvoice.client_name} LLC</span>
                              </div>
                              <div className="flex items-start gap-2">
                                <div className="p-1 rounded bg-slate-100 shrink-0 mt-0.5"><MapPin className="w-3.5 h-3.5 text-slate-500" /></div>
                                <span className="leading-tight text-slate-500 break-words">{lead?.address || '123 Business Avenue, Suite 500, New York, NY 10001, USA'}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="p-1 rounded bg-slate-100 shrink-0"><Mail className="w-3.5 h-3.5 text-slate-500" /></div>
                                <span className="truncate">{lead?.instagram_handle ? `${lead.instagram_handle.toLowerCase()}@instagram` : `contact@${selectedInvoice.client_name.toLowerCase().replace(/[^a-z0-9]/g, '') || 'client'}.com`}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="p-1 rounded bg-slate-100 shrink-0"><Phone className="w-3.5 h-3.5 text-slate-500" /></div>
                                <span className="font-mono text-slate-550 truncate">{lead?.phone || '+1 (212) 555-3421'}</span>
                              </div>
                            </div>
                          </div>

                          {/* Thank You Box */}
                          <div className="col-span-1">
                            {templateConfig.showSignature && (
                              <div className="bg-slate-50 border border-slate-105 rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between h-full min-h-[160px]">
                                <div className="absolute -top-3 left-1 text-indigo-500/10 text-7xl font-serif select-none pointer-events-none">&ldquo;</div>
                                <div className="z-10 mt-1">
                                  <h4 className="text-xs font-bold text-indigo-650 mb-1">Thank You!</h4>
                                  <p className="text-[10px] text-slate-500 leading-relaxed italic">
                                    We appreciate your trust in {templateConfig.brandName}. We look forward to building more together.
                                  </p>
                                </div>
                                <div className="border-t border-slate-200/60 pt-2 mt-3 z-10">
                                  <div className="font-['Caveat',_cursive] text-2xl text-indigo-600 leading-none">{templateConfig.founderName}</div>
                                  <div className="text-[9px] text-slate-400 font-mono mt-0.5">{templateConfig.founderRole}</div>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Invoice details */}
                          <div className="col-span-1 space-y-3 text-[11px]">
                            <span className="block text-[10px] font-mono tracking-widest text-indigo-650 uppercase font-bold mb-3 border-b border-slate-100 pb-1">Invoice Details</span>
                            <div className="space-y-2">
                              <div className="flex justify-between items-center py-0.5 border-b border-slate-100">
                                <span className="text-slate-400 font-medium flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> Invoice Date</span>
                                <span className="font-mono font-semibold text-slate-700">{selectedInvoice.created_date || '—'}</span>
                              </div>
                              <div className="flex justify-between items-center py-0.5 border-b border-slate-100">
                                <span className="text-slate-400 font-medium flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> Due Date</span>
                                <span className="font-mono font-semibold text-slate-700">{selectedInvoice.due_date || 'Immediate'}</span>
                              </div>
                              <div className="flex justify-between items-center py-0.5 border-b border-slate-100">
                                <span className="text-slate-400 font-medium flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> Payment Terms</span>
                                <span className="font-semibold text-slate-700">14 Days</span>
                              </div>
                              <div className="flex justify-between items-center py-0.5 border-b border-slate-100">
                                <span className="text-slate-400 font-medium flex items-center gap-1.5"><DollarSign className="w-3.5 h-3.5" /> Currency</span>
                                <span className="font-semibold text-slate-700 font-mono">{selectedInvoice.currency || 'USD'}</span>
                              </div>
                              <div className="flex justify-between items-center py-0.5">
                                <span className="text-slate-400 font-medium flex items-center gap-1.5"><File className="w-3.5 h-3.5" /> PO / Reference</span>
                                <span className="font-semibold text-slate-700">—</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Table of Items */}
                        <div className="px-8 pb-4">
                          <div className="border border-slate-200 rounded-xl overflow-hidden">
                            <table className="w-full text-left border-collapse">
                              <thead>
                                <tr className="bg-[#0c0b24] text-white text-[9.5px] font-mono tracking-wider uppercase">
                                  <th className="py-3 px-4 text-center w-12">#</th>
                                  <th className="py-3 px-4">Description</th>
                                  <th className="py-3 px-4 text-center w-20">Quantity</th>
                                  <th className="py-3 px-4 text-right w-28">Unit Price</th>
                                  <th className="py-3 px-4 text-right w-28">Amount</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-150 text-[11px] text-slate-650 bg-white">
                                {invoiceItems.map((item, idx) => {
                                  let IconComponent = Code;
                                  if (item.icon === 'code') IconComponent = Code;
                                  else if (item.icon === 'video') IconComponent = Video;
                                  else if (item.icon === 'robot') IconComponent = Bot;
                                  else if (item.icon === 'settings') IconComponent = Settings;
                                  else if (item.icon === 'rocket') IconComponent = Rocket;

                                  return (
                                    <tr key={item.id} className="hover:bg-slate-50/50">
                                      <td className="py-3.5 px-4 text-center font-bold text-indigo-650 font-mono">{String(idx + 1).padStart(2, '0')}</td>
                                      <td className="py-3.5 px-4">
                                        <div className="flex items-center gap-3">
                                          <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-500">
                                            <IconComponent className="w-4 h-4" />
                                          </div>
                                          <div>
                                            <div className="font-bold text-slate-900 text-xs">{item.desc}</div>
                                            <div className="text-[10px] text-slate-400 mt-0.5">{item.detail}</div>
                                          </div>
                                        </div>
                                      </td>
                                      <td className="py-3.5 px-4 text-center font-mono">{item.qty}</td>
                                      <td className="py-3.5 px-4 text-right font-mono">
                                        {selectedInvoice.currency === 'INR' ? '₹' : '$'}
                                        {item.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                      </td>
                                      <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900">
                                        {selectedInvoice.currency === 'INR' ? '₹' : '$'}
                                        {(item.price * item.qty).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        </div>

                        {/* Totals Box */}
                        <div className="px-8 pb-8 pt-2 flex justify-end">
                          <div className="w-80 space-y-2 text-xs text-slate-600">
                            <div className="flex justify-between items-center py-1">
                              <span>SUBTOTAL</span>
                              <span className="font-mono font-bold">
                                {selectedInvoice.currency === 'INR' ? '₹' : '$'}
                                {subtotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                              </span>
                            </div>
                            {discountAmount > 0 && (
                              <div className="flex justify-between items-center py-1 text-emerald-600 font-semibold">
                                <span>DISCOUNT</span>
                                <span className="font-mono font-bold">
                                  {selectedInvoice.currency === 'INR' ? '-₹' : '-$'}
                                  {discountAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </span>
                              </div>
                            )}
                            {taxPercentage > 0 && (
                              <div className="flex justify-between items-center py-1 text-slate-500">
                                <span>{templateConfig.taxLabel || 'TAX'} ({taxPercentage}%)</span>
                                <span className="font-mono font-bold">
                                  {selectedInvoice.currency === 'INR' ? '₹' : '$'}
                                  {taxAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </span>
                              </div>
                            )}
                            
                            <div className="bg-[#0c0b24] text-white px-5 py-3 rounded-xl font-bold font-mono text-xs tracking-wider flex items-center justify-between mt-2.5">
                              <span>TOTAL DUE</span>
                              <span className="text-sm font-black">
                                {selectedInvoice.currency === 'INR' ? '₹' : '$'}
                                {totalDue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {selectedInvoice.currency || 'USD'}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Footer Payment details & Notes & QR Code */}
                        <div className="p-8 border-t border-slate-100 grid grid-cols-3 gap-6">
                          
                          {/* Payment details column */}
                          <div className="col-span-1">
                            {templateConfig.showPaymentDetails && (
                              <>
                                <span className="block text-[10px] font-mono tracking-widest text-indigo-650 uppercase font-bold mb-3">Payment Details</span>
                                <div className="space-y-2 text-[10px] text-slate-600 font-mono">
                                  <div className="flex justify-between py-0.5 border-b border-slate-50">
                                    <span className="text-slate-400">Bank:</span>
                                    <span className="font-semibold text-slate-700 truncate max-w-[120px]">{templateConfig.bankName}</span>
                                  </div>
                                  <div className="flex justify-between py-0.5 border-b border-slate-50">
                                    <span className="text-slate-400">Name:</span>
                                    <span className="font-semibold text-slate-700 truncate max-w-[120px]">{templateConfig.accountName}</span>
                                  </div>
                                  <div className="flex justify-between py-0.5 border-b border-slate-50">
                                    <span className="text-slate-400">A/C No:</span>
                                    <span className="font-semibold text-slate-700">{templateConfig.accountNumber}</span>
                                  </div>
                                  <div className="flex justify-between py-0.5 border-b border-slate-50">
                                    <span className="text-slate-400">ABA/IFSC:</span>
                                    <span className="font-semibold text-slate-700">{templateConfig.routingABA}</span>
                                  </div>
                                  <div className="flex justify-between py-0.5 border-b border-slate-50">
                                    <span className="text-slate-400">SWIFT:</span>
                                    <span className="font-semibold text-slate-700">{templateConfig.swiftBIC}</span>
                                  </div>
                                  <div className="flex justify-between py-0.5 border-b border-slate-50">
                                    <span className="text-slate-400">PayPal:</span>
                                    <span className="font-semibold text-slate-700 truncate max-w-[120px]">{templateConfig.paypal}</span>
                                  </div>
                                  {templateConfig.payoneer && (
                                    <div className="flex justify-between py-0.5">
                                      <span className="text-slate-400">Payoneer:</span>
                                      <span className="font-semibold text-slate-700 truncate max-w-[120px]">{templateConfig.payoneer}</span>
                                    </div>
                                  )}
                                </div>
                              </>
                            )}
                          </div>

                          {/* Notes column */}
                          <div className="col-span-1">
                            {templateConfig.showNotes && (
                              <>
                                <span className="block text-[10px] font-mono tracking-widest text-indigo-650 uppercase font-bold mb-3">Notes</span>
                                <div className="text-[10px] text-slate-500 leading-relaxed whitespace-pre-wrap">
                                  {templateConfig.notesText}
                                </div>
                              </>
                            )}
                          </div>

                          {/* QR Code column */}
                          <div className="col-span-1 flex justify-end items-start">
                            {templateConfig.showQrCode && templateConfig.qrUrl && (
                              <img 
                                src={templateConfig.qrUrl} 
                                alt="Scan to Pay" 
                                className="w-[180px] h-auto rounded-xl shadow-md border border-slate-200"
                              />
                            )}
                          </div>
                        </div>

                        {/* Bottom Dark Footer */}
                        <div className="bg-[#0c0b24] text-white px-8 py-5 flex justify-between items-center gap-4 text-xs">
                          <div className="flex flex-wrap gap-x-4 gap-y-1 text-slate-400 text-[10px]">
                            <div className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5 text-indigo-400" />
                              <span>On-Time Delivery</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
                              <span>Clear Comms</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Shield className="w-3.5 h-3.5 text-indigo-400" />
                              <span>Premium Quality</span>
                            </div>
                          </div>
                          
                          <div className="flex flex-col items-end gap-1 text-right">
                            <div className="font-bold tracking-widest text-[9px]">{templateConfig.brandName}</div>
                            <div className="flex gap-x-3 text-[9px] text-slate-400 font-mono">
                              <span>{templateConfig.phone}</span>
                              <span>{templateConfig.website}</span>
                            </div>
                          </div>
                        </div>

                      </div>
                    </div>

                  </div>
                </div>

              </motion.div>
            </div>
          );
        })()}
      </AnimatePresence>
    </div>
  );
}

