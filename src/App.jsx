import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  Filter,
  Plus,
  TrendingUp,
  Users,
  CheckCircle2,
  MessageSquare,
  Calendar,
  Phone,
  MapPin,
  Globe,
  X,
  RefreshCw,
  ExternalLink,
  Trash2,
  Edit,
  Mail,
  Shield,
  Building2,
  Zap,
  LayoutGrid,
  List,
  Sparkles,
  ArrowUpRight,
  Database,
  Bot,
  Compass,
  Share2,
  MoreHorizontal,
  ChevronDown
} from 'lucide-react';

const API_BASE = '/api';

// Custom Brands SVG Icons
const InstagramIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const FacebookIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const GoogleMapsIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

// Fallback seed data in case API is temporarily unavailable
import seedLeadsData from './seedLeads.json';

export default function App() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'grid'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState(null);
  const [notification, setNotification] = useState(null);

  // Form State for Add/Edit Modal
  const [formData, setFormData] = useState({
    business_name: '',
    category: '',
    address: '',
    phone: '',
    email: '',
    website_status: 'no',
    priority: 'MED',
    outreach_status: 'New',
    instagram_handle: '',
    facebook_url: '',
    google_maps_url: '',
    notes: ''
  });

  const showToast = (msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3500);
  };

  // Fetch leads from API (or fallback to seedLeadsData)
  const fetchLeads = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/leads`);
      if (res.ok) {
        const data = await res.json();
        setLeads(data);
      } else {
        setLeads(seedLeadsData);
      }
    } catch (err) {
      console.warn('API unavailable, using seed data:', err);
      setLeads(seedLeadsData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  // Filter Categories
  const categories = useMemo(() => {
    const set = new Set();
    leads.forEach(l => {
      if (l.category) set.add(l.category.toLowerCase().trim());
    });
    return Array.from(set);
  }, [leads]);

  // Filtered Leads Calculation
  const filteredLeads = useMemo(() => {
    return leads.filter(lead => {
      const name = (lead.business_name || '').toLowerCase();
      const cat = (lead.category || '').toLowerCase();
      const addr = (lead.address || '').toLowerCase();
      const phone = (lead.phone || '').toLowerCase();
      const email = (lead.email || '').toLowerCase();
      const insta = (lead.instagram_handle || '').toLowerCase();
      const q = searchQuery.toLowerCase();

      const matchesSearch =
        !q ||
        name.includes(q) ||
        cat.includes(q) ||
        addr.includes(q) ||
        phone.includes(q) ||
        email.includes(q) ||
        insta.includes(q);

      const status = (lead.outreach_status || 'New').toUpperCase();
      const matchesStatus =
        selectedStatus === 'ALL' ||
        (selectedStatus === 'NEW' && (status === 'NEW' || status === 'NOT CONTACTED')) ||
        (selectedStatus === 'OUTREACHED' && (status === 'OUTREACHED' || status === 'CONTACTED')) ||
        (selectedStatus === 'QUALIFIED' && status === 'QUALIFIED') ||
        (selectedStatus === 'CLOSED' && status === 'CLOSED');

      const matchesCategory =
        selectedCategory === 'ALL' ||
        cat === selectedCategory.toLowerCase();

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [leads, searchQuery, selectedStatus, selectedCategory]);

  // Analytics Counters
  const stats = useMemo(() => {
    const total = leads.length;
    let newLeads = 0;
    let outreached = 0;
    let qualified = 0;
    let closed = 0;

    leads.forEach(l => {
      const s = (l.outreach_status || 'New').toUpperCase();
      if (s === 'NEW' || s === 'NOT CONTACTED') newLeads++;
      else if (s === 'OUTREACHED' || s === 'CONTACTED') outreached++;
      else if (s === 'QUALIFIED') qualified++;
      else if (s === 'CLOSED') closed++;
      else newLeads++;
    });

    const conversionRate = total > 0 ? ((closed / total) * 100).toFixed(1) : 0;
    return { total, newLeads, outreached, qualified, closed, conversionRate };
  }, [leads]);

  // Handlers for API Mutations
  const handleUpdateStatus = async (leadId, newStatus) => {
    setLeads(prev =>
      prev.map(l => (l.id === leadId ? { ...l, outreach_status: newStatus } : l))
    );

    try {
      const res = await fetch(`${API_BASE}/leads/${leadId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ outreach_status: newStatus })
      });
      if (res.ok) {
        showToast(`Status updated to ${newStatus}`);
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const handleDeleteLead = async leadId => {
    if (!window.confirm('Are you sure you want to delete this lead?')) return;

    setLeads(prev => prev.filter(l => l.id !== leadId));

    try {
      const res = await fetch(`${API_BASE}/leads/${leadId}`, { method: 'DELETE' });
      if (res.ok) {
        showToast('Lead deleted successfully');
      }
    } catch (err) {
      console.error('Failed to delete lead:', err);
    }
  };

  const handleSaveLead = async e => {
    e.preventDefault();
    if (!formData.business_name) {
      alert('Please provide a Business Name');
      return;
    }

    if (editingLead) {
      setLeads(prev =>
        prev.map(l => (l.id === editingLead.id ? { ...l, ...formData } : l))
      );
      try {
        await fetch(`${API_BASE}/leads/${editingLead.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        showToast('Lead details saved!');
      } catch (err) {
        console.error('Save failed:', err);
      }
    } else {
      const newLead = {
        id: `lead_${Date.now()}`,
        ...formData,
        scraped_at: new Date().toISOString()
      };
      setLeads(prev => [newLead, ...prev]);

      try {
        await fetch(`${API_BASE}/leads`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newLead)
        });
        showToast('New lead added to CRM!');
      } catch (err) {
        console.error('Create failed:', err);
      }
    }

    setIsModalOpen(false);
    setEditingLead(null);
  };

  const openAddModal = () => {
    setEditingLead(null);
    setFormData({
      business_name: '',
      category: 'Real Estate',
      address: '',
      phone: '',
      email: '',
      website_status: 'no',
      priority: 'MED',
      outreach_status: 'New',
      instagram_handle: '',
      facebook_url: '',
      google_maps_url: '',
      notes: ''
    });
    setIsModalOpen(true);
  };

  const openEditModal = lead => {
    setEditingLead(lead);
    setFormData({
      business_name: lead.business_name || '',
      category: lead.category || '',
      address: lead.address || '',
      phone: lead.phone || '',
      email: lead.email || '',
      website_status: lead.website_status || 'no',
      priority: lead.priority || 'MED',
      outreach_status: lead.outreach_status || 'New',
      instagram_handle: lead.instagram_handle || '',
      facebook_url: lead.facebook_url || '',
      google_maps_url: lead.google_maps_url || '',
      notes: lead.notes || ''
    });
    setIsModalOpen(true);
  };

  // Helper for Initials Avatar
  const getInitials = name => {
    if (!name || typeof name !== 'string') return 'EX';
    const parts = name.trim().split(' ').filter(Boolean);
    if (parts.length >= 2 && parts[0][0] && parts[1][0]) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  // Avatar Gradient Colors
  const getAvatarGradient = name => {
    const charCode = (name || 'A').charCodeAt(0);
    const gradients = [
      'from-indigo-600 to-purple-600',
      'from-sky-500 to-indigo-600',
      'from-emerald-500 to-teal-600',
      'from-rose-500 to-pink-600',
      'from-amber-500 to-orange-600',
      'from-purple-600 to-pink-600'
    ];
    return gradients[charCode % gradients.length];
  };

  // Pastel Category Badges
  const getCategoryPill = category => {
    const cat = (category || '').toLowerCase();
    if (cat.includes('salon') || cat.includes('hair') || cat.includes('beauty'))
      return 'bg-pink-500/15 text-pink-300 border-pink-500/30';
    if (cat.includes('real estate') || cat.includes('property') || cat.includes('broker'))
      return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
    if (cat.includes('dentist') || cat.includes('doctor') || cat.includes('health'))
      return 'bg-sky-500/15 text-sky-300 border-sky-500/30';
    if (cat.includes('food') || cat.includes('restaurant') || cat.includes('cafe'))
      return 'bg-amber-500/15 text-amber-300 border-amber-500/30';
    return 'bg-purple-500/15 text-purple-300 border-purple-500/30';
  };

  // Glowing Status Badges
  const getStatusBadge = status => {
    const s = (status || 'New').toUpperCase();
    if (s === 'NEW' || s === 'NOT CONTACTED')
      return 'bg-sky-500/20 text-sky-300 border-sky-500/40 glow-sky font-semibold';
    if (s === 'OUTREACHED' || s === 'CONTACTED')
      return 'bg-amber-500/20 text-amber-300 border-amber-500/40 glow-amber font-semibold';
    if (s === 'QUALIFIED')
      return 'bg-purple-500/20 text-purple-300 border-purple-500/40 glow-purple font-semibold';
    if (s === 'CLOSED')
      return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 glow-emerald font-semibold';
    return 'bg-slate-500/20 text-slate-300 border-slate-500/40 font-semibold';
  };

  return (
    <div className="min-h-screen bg-[#06080E] text-slate-100 font-sans selection:bg-indigo-500 selection:text-white pb-20">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-3 bg-slate-900/90 border border-emerald-500/40 text-emerald-300 px-5 py-3.5 rounded-2xl shadow-2xl backdrop-blur-xl animate-fade-in">
          <Sparkles className="w-5 h-5 text-emerald-400" />
          <span className="font-semibold text-sm">{notification.msg}</span>
        </div>
      )}

      {/* MODERN SLEEK TOP NAV BAR */}
      <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-[#0B0F17]/90 backdrop-blur-xl px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Logo & Subtitle */}
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-sky-400 p-0.5 shadow-xl shadow-indigo-600/25">
              <div className="w-full h-full bg-[#090C14] rounded-[14px] flex items-center justify-center">
                <Database className="w-5 h-5 text-indigo-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="font-extrabold text-2xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                  VEXO CRM
                </h1>
                <span className="text-[10px] font-mono tracking-widest font-bold uppercase px-2.5 py-0.5 rounded-md bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                  Pro SaaS Edition
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium mt-0.5">
                Central Intelligence Engine for Scraper Agent & Zara Sales Assistant
              </p>
            </div>
          </div>

          {/* Controls & Action Buttons */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="hidden lg:flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs font-mono text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>CRM API: 3002</span>
            </div>

            <div className="hidden lg:flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs font-mono text-slate-300">
              <Bot className="w-4 h-4 text-indigo-400" />
              <span>Agents Synced</span>
            </div>

            <button
              onClick={fetchLeads}
              className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 transition-all hover:text-white"
              title="Refresh CRM Data"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>

            <button
              onClick={openAddModal}
              className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm px-5 py-2.5 rounded-xl shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Plus className="w-4.5 h-4.5" />
              <span>Add New Lead</span>
            </button>
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="max-w-7xl mx-auto px-6 pt-8 space-y-8">
        {/* METRICS HEADER CARDS WITH GLASSMORPHISM & TREND TAGS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Card 1: Total Pipeline */}
          <div className="glass-card p-5 rounded-2xl relative overflow-hidden group">
            <div className="flex items-center justify-between text-slate-400 text-xs font-bold tracking-wider uppercase mb-3">
              <span>TOTAL PIPELINE</span>
              <div className="w-8 h-8 rounded-xl bg-indigo-500/15 flex items-center justify-center text-indigo-400 border border-indigo-500/20">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-white tracking-tight">{stats.total}</div>
            <div className="text-[11px] font-semibold text-emerald-400 mt-2 flex items-center gap-1">
              <span className="px-1.5 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/30">↑ 100%</span>
              <span className="text-slate-400 font-normal">Active DB</span>
            </div>
          </div>

          {/* Card 2: New Leads */}
          <div className="glass-card p-5 rounded-2xl relative overflow-hidden group">
            <div className="flex items-center justify-between text-slate-400 text-xs font-bold tracking-wider uppercase mb-3">
              <span>NEW LEADS</span>
              <div className="w-8 h-8 rounded-xl bg-sky-500/15 flex items-center justify-center text-sky-400 border border-sky-500/20 glow-sky">
                <Sparkles className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-sky-400 tracking-tight">{stats.newLeads}</div>
            <div className="text-[11px] font-semibold text-sky-400 mt-2 flex items-center gap-1">
              <span className="px-1.5 py-0.5 rounded bg-sky-500/15 border border-sky-500/30">↑ 12%</span>
              <span className="text-slate-400 font-normal">Ready for outreach</span>
            </div>
          </div>

          {/* Card 3: Outreached */}
          <div className="glass-card p-5 rounded-2xl relative overflow-hidden group">
            <div className="flex items-center justify-between text-slate-400 text-xs font-bold tracking-wider uppercase mb-3">
              <span>OUTREACHED</span>
              <div className="w-8 h-8 rounded-xl bg-amber-500/15 flex items-center justify-center text-amber-400 border border-amber-500/20 glow-amber">
                <MessageSquare className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-amber-400 tracking-tight">{stats.outreached}</div>
            <div className="text-[11px] font-semibold text-amber-400 mt-2 flex items-center gap-1">
              <span className="px-1.5 py-0.5 rounded bg-amber-500/15 border border-amber-500/30">↑ 8%</span>
              <span className="text-slate-400 font-normal">Zara chat active</span>
            </div>
          </div>

          {/* Card 4: Qualified */}
          <div className="glass-card p-5 rounded-2xl relative overflow-hidden group">
            <div className="flex items-center justify-between text-slate-400 text-xs font-bold tracking-wider uppercase mb-3">
              <span>QUALIFIED</span>
              <div className="w-8 h-8 rounded-xl bg-purple-500/15 flex items-center justify-center text-purple-400 border border-purple-500/20 glow-purple">
                <Zap className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-purple-400 tracking-tight">{stats.qualified}</div>
            <div className="text-[11px] font-semibold text-purple-400 mt-2 flex items-center gap-1">
              <span className="px-1.5 py-0.5 rounded bg-purple-500/15 border border-purple-500/30">↑ 15%</span>
              <span className="text-slate-400 font-normal">High interest</span>
            </div>
          </div>

          {/* Card 5: Closed Deals */}
          <div className="glass-card p-5 rounded-2xl relative overflow-hidden group">
            <div className="flex items-center justify-between text-slate-400 text-xs font-bold tracking-wider uppercase mb-3">
              <span>CLOSED DEALS</span>
              <div className="w-8 h-8 rounded-xl bg-emerald-500/15 flex items-center justify-center text-emerald-400 border border-emerald-500/20 glow-emerald">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-emerald-400 tracking-tight">{stats.closed}</div>
            <div className="text-[11px] font-semibold text-emerald-400 mt-2 flex items-center gap-1">
              <span className="px-1.5 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/30">
                {stats.conversionRate}
              </span>
              <span className="text-slate-400 font-normal">Win rate</span>
            </div>
          </div>
        </div>

        {/* TOOLBAR & SEARCH BAR */}
        <div className="glass-panel p-4.5 rounded-2xl shadow-xl space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative w-full md:w-96">
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search leads, categories, phone, instagram..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-[#090D16] border border-slate-800 text-slate-100 text-sm rounded-xl pl-11 pr-4 py-2.5 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-slate-500 font-medium"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Category Select & View Switcher */}
            <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
              <div className="flex items-center gap-2 bg-[#090D16] border border-slate-800 rounded-xl px-3.5 py-2 text-xs font-medium">
                <Filter className="w-3.5 h-3.5 text-indigo-400" />
                <select
                  value={selectedCategory}
                  onChange={e => setSelectedCategory(e.target.value)}
                  className="bg-transparent text-slate-200 focus:outline-none cursor-pointer capitalize font-semibold"
                >
                  <option value="ALL" className="bg-[#090D16] text-slate-200">
                    All Niches ({categories.length})
                  </option>
                  {categories.map(cat => (
                    <option key={cat} value={cat} className="bg-[#090D16] text-slate-200 capitalize">
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* View Switcher */}
              <div className="flex items-center bg-[#090D16] border border-slate-800 p-1 rounded-xl">
                <button
                  onClick={() => setViewMode('table')}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === 'table' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
                  }`}
                  title="Dense Table View"
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === 'grid' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
                  }`}
                  title="Grid Cards View"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* STATUS TABS */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 border-t border-slate-800/60 no-scrollbar">
            {['ALL', 'NEW', 'OUTREACHED', 'QUALIFIED', 'CLOSED'].map(status => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap border ${
                  selectedStatus === status
                    ? 'bg-indigo-600/20 text-indigo-300 border-indigo-500/50 shadow-md shadow-indigo-600/10'
                    : 'bg-slate-900/40 text-slate-400 border-slate-800 hover:bg-slate-800/60 hover:text-slate-200'
                }`}
              >
                {status === 'ALL' ? 'All Leads' : status}
              </button>
            ))}
          </div>
        </div>

        {/* DATA CONTAINER: TABLE VIEW OR GRID VIEW */}
        {loading ? (
          <div className="p-16 text-center text-slate-400 space-y-3 glass-panel rounded-2xl">
            <RefreshCw className="w-8 h-8 text-indigo-400 animate-spin mx-auto" />
            <p className="text-sm font-semibold">Loading live VEXO CRM pipeline...</p>
          </div>
        ) : filteredLeads.length === 0 ? (
          <div className="p-16 text-center space-y-4 glass-panel rounded-2xl">
            <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-slate-400">
              <Search className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-200">No matching leads found</h3>
              <p className="text-xs text-slate-400 mt-1">Try broadening your search query or status filter.</p>
            </div>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedStatus('ALL');
                setSelectedCategory('ALL');
              }}
              className="text-xs text-indigo-400 hover:underline font-bold"
            >
              Reset All Filters
            </button>
          </div>
        ) : viewMode === 'table' ? (
          /* TABLE VIEW WITH MICRO-CONTRAST & INITIAL AVATARS */
          <div className="glass-panel rounded-2xl overflow-hidden shadow-2xl border border-slate-800/80">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-[#090D16] text-slate-400 text-xs font-medium uppercase tracking-wider border-b border-slate-800/80">
                  <tr>
                    <th className="px-6 py-3.5 font-medium tracking-wider">BUSINESS & NICHE</th>
                    <th className="px-6 py-3.5 font-medium tracking-wider">LOCATION & ADDRESS</th>
                    <th className="px-6 py-3.5 font-medium tracking-wider">SOCIALS & CONTACT LINKS</th>
                    <th className="px-6 py-3.5 font-medium tracking-wider">OUTREACH STATUS</th>
                    <th className="px-6 py-3.5 font-medium tracking-wider text-right">QUICK ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/40">
                  {filteredLeads.map((lead, idx) => (
                    <tr
                      key={lead.id}
                      className={`transition-colors hover:bg-indigo-950/20 group ${
                        idx % 2 === 0 ? 'bg-[#0E131F]/90' : 'bg-[#0B0E17]/90'
                      }`}
                    >
                      {/* Business Name, Initial Avatar & Category */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {/* 32x32 Initials Avatar Badge */}
                          <div
                            className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${getAvatarGradient(
                              lead.business_name
                            )} flex items-center justify-center text-white font-extrabold text-xs shadow-md shrink-0`}
                          >
                            {getInitials(lead.business_name)}
                          </div>
                          <div>
                            <div className="font-bold text-slate-100 text-sm group-hover:text-indigo-300 transition-colors">
                              {lead.business_name}
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <span
                                className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${getCategoryPill(
                                  lead.category
                                )}`}
                              >
                                {lead.category || 'General'}
                              </span>
                              {lead.website_status === 'yes' && (
                                <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                                  <Globe className="w-3 h-3" /> Website Live
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Location & Address */}
                      <td className="px-6 py-4 max-w-xs text-slate-300 font-medium">
                        <div className="flex items-start gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                          <span className="line-clamp-2 text-xs text-slate-300">{lead.address || 'Global / Remote'}</span>
                        </div>
                      </td>

                      {/* Social Media & Contact Links */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 flex-wrap">
                          {/* WhatsApp */}
                          {lead.phone && (
                            <a
                              href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}`}
                              target="_blank"
                              rel="noreferrer"
                              className="p-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition-all hover:scale-105"
                              title={`WhatsApp: ${lead.phone}`}
                            >
                              <Phone className="w-3.5 h-3.5" />
                            </a>
                          )}

                          {/* Email */}
                          {lead.email && (
                            <a
                              href={`mailto:${lead.email}`}
                              className="p-2 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 transition-all hover:scale-105"
                              title={`Email: ${lead.email}`}
                            >
                              <Mail className="w-3.5 h-3.5" />
                            </a>
                          )}

                          {/* Instagram */}
                          {lead.instagram_handle && (
                            <a
                              href={`https://instagram.com/${lead.instagram_handle.replace('@', '')}`}
                              target="_blank"
                              rel="noreferrer"
                              className="p-2 rounded-lg bg-pink-500/10 hover:bg-pink-500/20 text-pink-400 border border-pink-500/30 transition-all hover:scale-105"
                              title={`Instagram: ${lead.instagram_handle}`}
                            >
                              <InstagramIcon className="w-3.5 h-3.5" />
                            </a>
                          )}

                          {/* Facebook */}
                          {lead.facebook_url && (
                            <a
                              href={lead.facebook_url}
                              target="_blank"
                              rel="noreferrer"
                              className="p-2 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border border-sky-500/30 transition-all hover:scale-105"
                              title="Facebook Page"
                            >
                              <FacebookIcon className="w-3.5 h-3.5" />
                            </a>
                          )}

                          {/* Google Maps */}
                          {lead.google_maps_url ? (
                            <a
                              href={lead.google_maps_url}
                              target="_blank"
                              rel="noreferrer"
                              className="p-2 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 transition-all hover:scale-105"
                              title="Google Maps Location"
                            >
                              <GoogleMapsIcon className="w-3.5 h-3.5" />
                            </a>
                          ) : (
                            <a
                              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                                lead.business_name + ' ' + (lead.address || '')
                              )}`}
                              target="_blank"
                              rel="noreferrer"
                              className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 border border-slate-700 transition-all"
                              title="Search on Google Maps"
                            >
                              <GoogleMapsIcon className="w-3.5 h-3.5" />
                            </a>
                          )}
                        </div>
                      </td>

                      {/* Outreach Status Selector */}
                      <td className="px-6 py-4">
                        <div className="relative inline-block">
                          <select
                            value={lead.outreach_status || 'New'}
                            onChange={e => handleUpdateStatus(lead.id, e.target.value)}
                            className={`text-xs font-bold rounded-xl pl-3 pr-7 py-1.5 border appearance-none focus:outline-none cursor-pointer transition-all ${getStatusBadge(
                              lead.outreach_status
                            )}`}
                          >
                            <option value="New" className="bg-[#090D16] text-slate-200 font-semibold">
                              NEW
                            </option>
                            <option value="Outreached" className="bg-[#090D16] text-slate-200 font-semibold">
                              OUTREACHED
                            </option>
                            <option value="Qualified" className="bg-[#090D16] text-slate-200 font-semibold">
                              QUALIFIED
                            </option>
                            <option value="Closed" className="bg-[#090D16] text-slate-200 font-semibold">
                              CLOSED
                            </option>
                          </select>
                          <ChevronDown className="w-3.5 h-3.5 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-current opacity-80" />
                        </div>
                      </td>

                      {/* Quick Hover Action Column */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditModal(lead)}
                            className="p-2 rounded-xl bg-slate-800/80 hover:bg-indigo-600 text-slate-300 hover:text-white transition-all shadow"
                            title="Edit Lead"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteLead(lead.id)}
                            className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-all"
                            title="Delete Lead"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* GRID CARDS VIEW */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLeads.map(lead => (
              <div
                key={lead.id}
                className="glass-card p-6 rounded-2xl flex flex-col justify-between space-y-5 group"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${getAvatarGradient(
                          lead.business_name
                        )} flex items-center justify-center text-white font-extrabold text-sm shadow-md shrink-0`}
                      >
                        {getInitials(lead.business_name)}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-100 text-base group-hover:text-indigo-300 transition-colors">
                          {lead.business_name}
                        </h3>
                        <span
                          className={`inline-block mt-1 px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${getCategoryPill(
                            lead.category
                          )}`}
                        >
                          {lead.category || 'General'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs text-slate-400 pt-3 border-t border-slate-800/80">
                    <div className="flex items-center gap-2 text-slate-300 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{lead.address || 'Global / Remote'}</span>
                    </div>

                    {/* Social links row inside grid card */}
                    <div className="flex items-center gap-2 pt-2">
                      {lead.phone && (
                        <a
                          href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
                          title="WhatsApp"
                        >
                          <Phone className="w-3.5 h-3.5" />
                        </a>
                      )}
                      {lead.email && (
                        <a
                          href={`mailto:${lead.email}`}
                          className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20"
                          title="Email"
                        >
                          <Mail className="w-3.5 h-3.5" />
                        </a>
                      )}
                      {lead.instagram_handle && (
                        <a
                          href={`https://instagram.com/${lead.instagram_handle.replace('@', '')}`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 rounded-lg bg-pink-500/10 text-pink-400 hover:bg-pink-500/20"
                          title="Instagram"
                        >
                          <InstagramIcon className="w-3.5 h-3.5" />
                        </a>
                      )}
                      {lead.facebook_url && (
                        <a
                          href={lead.facebook_url}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 rounded-lg bg-sky-500/10 text-sky-400 hover:bg-sky-500/20"
                          title="Facebook"
                        >
                          <FacebookIcon className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-800/80">
                  <div className="relative inline-block">
                    <select
                      value={lead.outreach_status || 'New'}
                      onChange={e => handleUpdateStatus(lead.id, e.target.value)}
                      className={`text-xs font-bold rounded-xl pl-3 pr-7 py-1.5 border appearance-none focus:outline-none cursor-pointer transition-all ${getStatusBadge(
                        lead.outreach_status
                      )}`}
                    >
                      <option value="New" className="bg-[#090D16] text-slate-200 font-semibold">
                        NEW
                      </option>
                      <option value="Outreached" className="bg-[#090D16] text-slate-200 font-semibold">
                        OUTREACHED
                      </option>
                      <option value="Qualified" className="bg-[#090D16] text-slate-200 font-semibold">
                        QUALIFIED
                      </option>
                      <option value="Closed" className="bg-[#090D16] text-slate-200 font-semibold">
                        CLOSED
                      </option>
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-current opacity-80" />
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEditModal(lead)}
                      className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-colors"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteLead(lead.id)}
                      className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* OPEN-DESIGN ADD / EDIT MODAL WITH SOCIAL FIELDS */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fade-in">
          <div className="w-full max-w-lg bg-[#0A0E17] border border-slate-800 rounded-3xl shadow-2xl p-6 space-y-6 relative overflow-hidden">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2.5">
                <Building2 className="w-5 h-5 text-indigo-400" />
                <span>{editingLead ? 'Edit Lead Details' : 'Add New Lead'}</span>
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveLead} className="space-y-4 text-xs font-medium">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Business Name *</label>
                <input
                  type="text"
                  required
                  value={formData.business_name}
                  onChange={e => setFormData({ ...formData, business_name: e.target.value })}
                  placeholder="e.g. Studio L Hair Salon"
                  className="w-full bg-[#06080E] border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 focus:outline-none focus:border-indigo-500 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Category / Niche</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                    placeholder="e.g. Hair Salon, Real Estate"
                    className="w-full bg-[#06080E] border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 focus:outline-none focus:border-indigo-500 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Phone / WhatsApp</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+44 20 8311 1301"
                    className="w-full bg-[#06080E] border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 focus:outline-none focus:border-indigo-500 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Email Address</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  placeholder="contact@studiol.com"
                  className="w-full bg-[#06080E] border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 focus:outline-none focus:border-indigo-500 text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Address / Location</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={e => setFormData({ ...formData, address: e.target.value })}
                  placeholder="46 Lessness Ave, London, UK"
                  className="w-full bg-[#06080E] border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 focus:outline-none focus:border-indigo-500 text-xs"
                />
              </div>

              {/* SOCIAL MEDIA FIELDS */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Instagram Handle</label>
                  <input
                    type="text"
                    value={formData.instagram_handle}
                    onChange={e => setFormData({ ...formData, instagram_handle: e.target.value })}
                    placeholder="@studiol_official"
                    className="w-full bg-[#06080E] border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 focus:outline-none focus:border-indigo-500 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Facebook URL</label>
                  <input
                    type="text"
                    value={formData.facebook_url}
                    onChange={e => setFormData({ ...formData, facebook_url: e.target.value })}
                    placeholder="https://facebook.com/studiol"
                    className="w-full bg-[#06080E] border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 focus:outline-none focus:border-indigo-500 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Google Maps Link</label>
                <input
                  type="text"
                  value={formData.google_maps_url}
                  onChange={e => setFormData({ ...formData, google_maps_url: e.target.value })}
                  placeholder="https://maps.google.com/..."
                  className="w-full bg-[#06080E] border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 focus:outline-none focus:border-indigo-500 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Priority</label>
                  <select
                    value={formData.priority}
                    onChange={e => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full bg-[#06080E] border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 focus:outline-none focus:border-indigo-500 text-xs"
                  >
                    <option value="HIGH">HIGH</option>
                    <option value="MED">MED</option>
                    <option value="LOW">LOW</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Outreach Status</label>
                  <select
                    value={formData.outreach_status}
                    onChange={e => setFormData({ ...formData, outreach_status: e.target.value })}
                    className="w-full bg-[#06080E] border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 focus:outline-none focus:border-indigo-500 text-xs"
                  >
                    <option value="New">New</option>
                    <option value="Outreached">Outreached</option>
                    <option value="Qualified">Qualified</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold shadow-lg shadow-indigo-600/30 transition-all"
                >
                  Save Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
