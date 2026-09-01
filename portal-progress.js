// ==========================================================================
// NYGHTO CLIENT PORTAL - LINEAR & VERCEL-GRADE REACT PROJECT PROGRESS APP
// ==========================================================================

const { useState, useEffect, useMemo } = React;

function ProjectProgressApp({ initialUser, initialProjectId }) {
  const [user, setUser] = useState(initialUser || window.currentUser || window.DEMO_USER);
  const [selectedProjectId, setSelectedProjectId] = useState(initialProjectId || null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [activeProjectTab, setActiveProjectTab] = useState('ROADMAP'); // 'ROADMAP' | 'DELIVERABLES' | 'CHANGELOG'
  const [checkedTasks, setCheckedTasks] = useState({});
  const [quickFeatureText, setQuickFeatureText] = useState('');
  const [quickFeatureStatus, setQuickFeatureStatus] = useState('');
  const [isFeatureDrawerOpen, setIsFeatureDrawerOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(null);

  // Sync with global window user updates
  useEffect(() => {
    const handleUserUpdate = (e) => {
      if (e.detail?.user) {
        setUser(e.detail.user);
        if (e.detail.selectedProjectId !== undefined) {
          setSelectedProjectId(e.detail.selectedProjectId);
        }
      }
    };
    window.addEventListener('nyghto_user_changed', handleUserUpdate);
    return () => window.removeEventListener('nyghto_user_changed', handleUserUpdate);
  }, []);

  const projects = useMemo(() => {
    return (user?.projects && Array.isArray(user.projects)) ? user.projects : [];
  }, [user]);

  const selectedProject = useMemo(() => {
    if (!selectedProjectId) return null;
    return projects.find(p => p.id === selectedProjectId) || null;
  }, [projects, selectedProjectId]);

  const filteredProjects = useMemo(() => {
    return projects.filter(p => {
      const matchesSearch = !searchQuery || 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        (p.category && p.category.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const isReview = p.status === 'Waiting for Review' || p.status === 'Under Review';
      const isCompleted = p.status === 'Completed';
      const isInProgress = !isReview && !isCompleted;

      let matchesFilter = true;
      if (statusFilter === 'REVIEW') matchesFilter = isReview;
      else if (statusFilter === 'IN_PROGRESS') matchesFilter = isInProgress;
      else if (statusFilter === 'COMPLETED') matchesFilter = isCompleted;

      return matchesSearch && matchesFilter;
    });
  }, [projects, searchQuery, statusFilter]);

  const handleOpenProject = (id) => {
    setSelectedProjectId(id);
    setActiveProjectTab('ROADMAP');
    window.scrollTo({ top: 180, behavior: 'smooth' });
  };

  const handleBackToProjects = () => {
    setSelectedProjectId(null);
  };

  const toggleTask = (taskId) => {
    setCheckedTasks(prev => ({ ...prev, [taskId]: !prev[taskId] }));
  };

  const copyToClipboard = (text, key) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedLink(key);
      setTimeout(() => setCopiedLink(null), 2000);
    }
  };

  const handleAddFeatureSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!quickFeatureText.trim() || !selectedProject) return;

    setQuickFeatureStatus('Submitting to engineering sprint queue...');
    
    // Webhook dispatch
    try {
      const DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/1337482483256037417/qf6p2o1e9P5iN3g0wK-Tz7v3J3_6e_Yn9Xq_L8u4m1k2j5h8g7f6d5s4a3p2o1i0';
      const payload = {
        username: "Nyghto Client Portal",
        embeds: [
          {
            title: "💡 Client Sprint Scope Request",
            color: 0x01249D,
            description: `**Client**: ${user?.name || 'Client'} (${user?.email || 'N/A'})\n**Project**: ${selectedProject.name} (${selectedProject.id})\n\n**Feature Request**:\n${quickFeatureText}`,
            footer: { text: "Nyghto Sprint Engine" },
            timestamp: new Date().toISOString()
          }
        ]
      };
      fetch(DISCORD_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).catch(err => console.warn(err));
    } catch(err) {
      console.warn(err);
    }

    setQuickFeatureStatus('✓ Feature request submitted! Added to review queue.');
    setTimeout(() => {
      setQuickFeatureText('');
      setQuickFeatureStatus('');
      setIsFeatureDrawerOpen(false);
    }, 1500);
  };

  // =========================================================================
  // VIEW: SINGLE PROJECT DETAIL ROADMAP (LINEAR-GRADE)
  // =========================================================================
  if (selectedProject) {
    const isCompleted = selectedProject.status === 'Completed';
    const isReview = selectedProject.status === 'Waiting for Review' || selectedProject.status === 'Under Review';

    // SPECIAL STATE: UNDER REVIEW ONLY (Seamless Minimal Reference Layout)
    if (isReview) {
      return (
        <div className="react-sprint-container font-sans" style={{ animation: 'fadeInSlideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) both', padding: '2rem 1rem 4rem', textAlign: 'center', maxWidth: '580px', margin: '0 auto' }}>
          
          {/* Top Breadcrumb Navigation */}
          <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '2.5rem' }}>
            <button 
              type="button" 
              className="nyghto-back-btn font-mono" 
              onClick={handleBackToProjects}
              style={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '8px',
                background: 'transparent',
                border: 'none',
                padding: '4px 0',
                cursor: 'pointer',
                color: '#64748B',
                fontWeight: 600,
                fontSize: '0.84rem'
              }}
            >
              <span>← Back to Projects</span>
            </button>
          </div>

          {/* Seamless Centerpiece Vector Illustration */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
            <svg width="105" height="105" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Barrier Board in Background */}
              <g stroke="#1E1E1E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="24" y="38" width="56" height="42" rx="4" transform="rotate(-12 24 38)" fill="#E11D48" />
                <path d="M28 48L78 38" stroke="#FFFFFF" strokeWidth="7" />
                <path d="M30 66L80 56" stroke="#FFFFFF" strokeWidth="7" />
                <circle cx="28" cy="42" r="2.5" fill="#1E1E1E" />
                <circle cx="78" cy="32" r="2.5" fill="#1E1E1E" />
              </g>

              {/* Traffic Cone in Foreground */}
              <g stroke="#1E1E1E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                {/* Isometric Cone Base */}
                <path d="M36 94L62 104L98 92L72 84L36 94Z" fill="#9F1239" />
                <path d="M40 92L62 99L92 90L70 84L40 92Z" fill="#E11D48" />

                {/* Cone Red Body */}
                <path d="M48 88L62 26H70L84 86L48 88Z" fill="#E11D48" />

                {/* Lower White Band */}
                <path d="M52 78L55 65H77L80 76L52 78Z" fill="#FFFFFF" />

                {/* Upper White Band */}
                <path d="M58 54L60 44H72L74 52L58 54Z" fill="#FFFFFF" />

                {/* Cone Rounded Tip */}
                <path d="M62 26C62 23 64 21 66 21C68 21 70 23 70 26V28H62V26Z" fill="#E11D48" />
              </g>
            </svg>
          </div>

          {/* Clean Bold Title */}
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0F172A', margin: '0 0 8px 0', letterSpacing: '-0.025em' }}>
            Site is Under review
          </h2>

          {/* Subtitle Message */}
          <p style={{ color: '#64748B', fontSize: '0.9rem', lineHeight: 1.6, maxWidth: '400px', margin: '0 auto 1.8rem auto' }}>
            You can still reach us at our team lines and direct channels
          </p>

          {/* Minimal Circular Contact Icons */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '2rem' }}>
            
            {/* Phone */}
            <a 
              href="tel:+917012028379" 
              title="Call Us"
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                border: '1px solid #CBD5E1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#0F172A',
                textDecoration: 'none',
                background: '#FFFFFF',
                transition: 'all 0.15s ease'
              }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
            </a>

            {/* WhatsApp */}
            <a 
              href="https://wa.me/917012028379?text=Hi%20Nyghto%20Team%2C%20I%20just%20submitted%20a%20project%20in%20the%20portal%21" 
              target="_blank" 
              rel="noopener noreferrer"
              title="WhatsApp"
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                border: '1px solid #CBD5E1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#0F172A',
                textDecoration: 'none',
                background: '#FFFFFF',
                transition: 'all 0.15s ease'
              }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
              </svg>
            </a>

            {/* Email */}
            <a 
              href="mailto:sales@nyghto.in" 
              title="Email Us"
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                border: '1px solid #CBD5E1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#0F172A',
                textDecoration: 'none',
                background: '#FFFFFF',
                transition: 'all 0.15s ease'
              }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
            </a>

          </div>

          {/* Minimal Bordered Contact Box */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '0.84rem', color: '#475569' }}>
            <span>Send us an Email</span>
            <a 
              href="mailto:sales@nyghto.in" 
              style={{
                display: 'inline-block',
                border: '1px solid #0F172A',
                borderRadius: '6px',
                padding: '4px 12px',
                color: '#0F172A',
                fontWeight: 600,
                textDecoration: 'none',
                fontSize: '0.84rem',
                fontFamily: 'monospace'
              }}
            >
              sales@nyghto.in
            </a>
          </div>

        </div>
      );
    }

    const pct = selectedProject.progress !== undefined ? selectedProject.progress : (isCompleted ? 100 : 75);
    const phases = selectedProject.phases || [
      { name: "Phase 1: Scope & Architecture Review", status: "DONE", pct: "100%", items: ["Technical requirements definition", "Figma prototype & design tokens", "Database & API wireframing"] },
      { name: "Phase 2: Core Engineering & Integrations", status: "ACTIVE", pct: "75%", items: ["Frontend application build (Next.js 15)", "Backend endpoint integrations & Auth", "Database schema migrations"] },
      { name: "Phase 3: QA & Staging Verification", status: "UPCOMING", pct: "0%", items: ["Mobile viewport QA & Cross-browser", "Performance audit & security hardening", "Payment gateway validation"] },
      { name: "Phase 4: Production CDN & Launch", status: "UPCOMING", pct: "0%", items: ["Domain DNS connection & SSL", "Edge CDN optimization", "Final source code repo handover"] }
    ];

    const changelogs = [
      { tag: "v1.4.2", title: "Staging deployment updated with responsive layouts", time: "Today, 4:20 PM", author: "Zack (Founder)" },
      { tag: "v1.4.0", title: "API endpoints & database schema verified", time: "Yesterday, 6:15 PM", author: "Nyghto Engineering" },
      { tag: "v1.2.0", title: "Figma UI tokens and interactive component prototype locked", time: "May 12, 2026", author: "Studio Lead" }
    ];

    const deliverables = [
      { id: "del-git", title: "GitHub Code Repository", desc: "Clean TypeScript codebase built with Next.js 15 & PostgreSQL", link: "#", tag: "GITHUB REPO", icon: "GIT", isCode: true },
      { id: "del-staging", title: "Live Staging Environment", desc: "Active work-in-progress build running on edge CDN", link: "http://localhost:5173", tag: "LIVE DEMO", icon: "WEB" }
    ];

    return (
      <div className="react-sprint-container font-sans" style={{ animation: 'fadeInSlideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) both' }}>
        
        {/* Navigation Breadcrumb Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem', flexWrap: 'wrap', gap: '10px' }}>
          <button 
            type="button" 
            className="nyghto-back-btn font-mono" 
            onClick={handleBackToProjects}
            style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '6px',
              background: '#FFFFFF',
              border: '1px solid #E2E8F0',
              padding: '6px 14px',
              borderRadius: '8px',
              cursor: 'pointer',
              color: '#0F172A',
              fontWeight: 600
            }}
          >
            <span>← Back to All Projects</span>
          </button>

          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span className="font-mono" style={{ fontSize: '0.72rem', background: '#F1F5F9', padding: '4px 10px', borderRadius: '6px', color: '#475569', fontWeight: 600 }}>
              ID: {selectedProject.id}
            </span>
            <button 
              type="button"
              className="nyghto-btn-outline font-sans"
              onClick={() => setIsFeatureDrawerOpen(!isFeatureDrawerOpen)}
              style={{ padding: '6px 14px', fontSize: '0.78rem' }}
            >
              <span>{isFeatureDrawerOpen ? '✕ Close Feature' : '+ Request Feature'}</span>
            </button>
          </div>
        </div>

        {/* Feature Request Drawer */}
        {isFeatureDrawerOpen && (
          <div style={{ background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '14px', padding: '1.3rem', marginBottom: '1.4rem', boxShadow: '0 4px 16px rgba(0,0,0,0.04)', animation: 'fadeInSlideUp 0.2s ease both' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <h4 style={{ margin: 0, fontSize: '0.96rem', fontWeight: 700, color: '#0F172A' }}>
                Request a Feature / Scope Adjustment
              </h4>
              <span className="font-mono" style={{ fontSize: '0.7rem', color: '#64748B' }}>DIRECT TEAM DISPATCH</span>
            </div>
            <p style={{ margin: '0 0 10px 0', fontSize: '0.82rem', color: '#64748B' }}>
              Describe what you want to add or modify in <strong>{selectedProject.name}</strong>. Our engineering leads review requests instantly.
            </p>
            <form onSubmit={handleAddFeatureSubmit} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <input 
                type="text" 
                placeholder="e.g. Add Google Login to user auth and integrate automated Stripe receipts..."
                value={quickFeatureText}
                onChange={(e) => setQuickFeatureText(e.target.value)}
                style={{ flex: 1, minWidth: '260px', padding: '9px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.86rem', outline: 'none' }}
                required
                autoFocus
              />
              <button 
                type="submit" 
                className="nyghto-btn-solid font-sans"
                style={{ padding: '9px 20px', fontSize: '0.86rem' }}
              >
                <span>Submit ↗</span>
              </button>
            </form>
            {quickFeatureStatus && (
              <div className="font-mono" style={{ fontSize: '0.78rem', color: '#059669', marginTop: '8px', fontWeight: 700 }}>
                {quickFeatureStatus}
              </div>
            )}
          </div>
        )}

        {/* Project Hero Header Card */}
        <div style={{ background: '#FFFFFF', padding: '1.8rem 2rem', borderRadius: '16px', border: '1px solid #E2E8F0', marginBottom: '1.2rem', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.2rem' }}>
            
            <div style={{ flex: 1, minWidth: '280px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
                <span className={isReview ? "pulse-amber-pip" : "nyghto-pulse-pip"}></span>
                <span className="font-mono" style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.05em', color: isReview ? '#D97706' : (isCompleted ? '#16A34A' : '#0284C7') }}>
                  {selectedProject.sprintTag || (isReview ? 'WAITING FOR NYGHTO REVIEW' : (isCompleted ? 'COMPLETED & LIVE' : 'ACTIVE SPRINT'))}
                </span>
                <span className="font-mono" style={{ fontSize: '0.72rem', color: '#94A3B8' }}>•</span>
                <span className="font-mono" style={{ fontSize: '0.72rem', background: '#F8FAFC', border: '1px solid #E2E8F0', padding: '2px 8px', borderRadius: '4px', color: '#475569', fontWeight: 600 }}>
                  {selectedProject.category || 'Web Application'}
                </span>
              </div>

              <h2 style={{ fontSize: '1.65rem', fontWeight: 800, color: '#0F172A', margin: '0 0 6px 0', letterSpacing: '-0.02em' }}>
                {selectedProject.name}
              </h2>
              <p style={{ color: '#475569', fontSize: '0.9rem', margin: 0, lineHeight: 1.5 }}>
                {selectedProject.brief}
              </p>
            </div>

            {/* Direct Founder Connect Buttons */}
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
              <a 
                href="tel:+917012028379" 
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: '#0F172A',
                  color: '#FFFFFF',
                  padding: '9px 18px',
                  borderRadius: '8px',
                  fontSize: '0.86rem',
                  fontWeight: 600,
                  textDecoration: 'none',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  transition: 'all 0.15s ease'
                }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
                <span>Call Us: +91 70120 28379</span>
              </a>

              <a 
                href="https://wa.me/917012028379?text=Hi%20Nyghto%20Team%2C%20I%20am%20reviewing%20my%20project%20in%20the%20portal%21" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: '#FFFFFF',
                  color: '#047857',
                  border: '1px solid #A7F3D0',
                  padding: '9px 16px',
                  borderRadius: '8px',
                  fontSize: '0.86rem',
                  fontWeight: 600,
                  textDecoration: 'none'
                }}
              >
                <span>WhatsApp Team ↗</span>
              </a>
            </div>

          </div>
        </div>

        {/* Waiting for Review Call Banner */}
        {isReview && (
          <div className="nyghto-review-call-card font-sans">
            <div className="nyghto-review-left">
              <div className="nyghto-review-badge font-mono">
                <span className="review-pulse-dot"></span>
                <span>WAITING FOR NYGHTO REVIEW</span>
              </div>
              <h4 className="nyghto-review-heading">Your Project is Under Founder Review</h4>
              <p className="nyghto-review-sub">
                We have received your project scope. Our engineering leads are analyzing requirements, technical architecture, and sprint timelines. Call or message us directly to fast-track your kick-off.
              </p>
            </div>
            <div className="nyghto-review-btns">
              <a href="tel:+917012028379" className="nyghto-review-call-btn font-sans">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
                <span>Call Us: +91 70120 28379</span>
              </a>
              <a 
                href="https://wa.me/917012028379?text=Hi%20Nyghto%20Team%2C%20I%20just%20submitted%20a%20project%20in%20the%20portal%21" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="nyghto-review-wa-btn font-sans"
              >
                <span>WhatsApp Team ↗</span>
              </a>
            </div>
          </div>
        )}

        {/* 4-Column Key Metrics Strip */}
        <div className="nyghto-metrics-strip font-sans" style={{ marginBottom: '1.4rem' }}>
          <div className="nyghto-m-col">
            <span className="nyghto-m-label font-mono">SPRINT HEALTH &amp; COMPLETION</span>
            <span className="nyghto-m-val" style={{ color: isReview ? '#D97706' : (isCompleted ? '#16A34A' : '#0284C7'), fontWeight: 800 }}>
              {pct}% Completed
            </span>
          </div>
          <div className="nyghto-m-divider"></div>
          <div className="nyghto-m-col">
            <span className="nyghto-m-label font-mono">CURRENT STAGE</span>
            <span className="nyghto-m-val">{selectedProject.stage || (isReview ? 'Waiting for Nyghto Review' : 'Production Sprint')}</span>
          </div>
          <div className="nyghto-m-divider"></div>
          <div className="nyghto-m-col">
            <span className="nyghto-m-label font-mono">TARGET LAUNCH</span>
            <span className="nyghto-m-val">{selectedProject.targetDate || (isReview ? 'Under Review' : 'Aug 22, 2026')}</span>
          </div>
          <div className="nyghto-m-divider"></div>
          <div className="nyghto-m-col">
            <span className="nyghto-m-label font-mono">ASSIGNED SPRINT LEAD</span>
            <span className="nyghto-m-val">{selectedProject.lead || 'Nyghto Team'}</span>
          </div>
        </div>

        {/* Linear-Style Segmented Milestone Stepper Bar */}
        <div style={{ marginBottom: '1.6rem' }}>
          <div style={{ display: 'flex', gap: '6px', height: '6px', borderRadius: '8px', overflow: 'hidden', background: '#E2E8F0' }}>
            {phases.map((ph, pIdx) => {
              const isDone = ph.status === 'DONE';
              const isActive = ph.status === 'ACTIVE';
              const segColor = isDone ? '#16A34A' : (isActive ? (isReview ? '#D97706' : '#01249D') : '#E2E8F0');
              return (
                <div 
                  key={pIdx} 
                  style={{ 
                    flex: 1, 
                    background: segColor, 
                    transition: 'all 0.3s ease',
                    position: 'relative'
                  }}
                  title={`Phase ${pIdx + 1}: ${ph.name} (${ph.status})`}
                />
              );
            })}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px' }}>
            {phases.map((ph, pIdx) => (
              <span key={pIdx} className="font-mono" style={{ fontSize: '0.66rem', color: ph.status === 'DONE' ? '#16A34A' : (ph.status === 'ACTIVE' ? '#0F172A' : '#94A3B8'), fontWeight: 600 }}>
                {ph.status === 'DONE' ? `✓ Ph 0${pIdx+1}` : `Ph 0${pIdx+1}`}
              </span>
            ))}
          </div>
        </div>

        {/* Optimized 2nd Sub-Navigation Pill Strip */}
        <div style={{ 
          display: 'flex', 
          gap: '6px', 
          overflowX: 'auto',
          WebkitOverflowScrolling: 'touch',
          whiteSpace: 'nowrap',
          scrollbarWidth: 'none',
          borderBottom: '1px solid #E2E8F0', 
          paddingBottom: '0.8rem', 
          marginBottom: '1.4rem' 
        }}>
          {[
            { key: 'ROADMAP', label: 'Milestone Roadmap', count: `${phases.length} Phases`, icon: '🗺️' },
            { key: 'DELIVERABLES', label: 'Deliverables & Code', count: '3 Files', icon: '📦' },
            { key: 'CHANGELOG', label: 'Changelog & Activity', count: 'Live', icon: '⚡' }
          ].map(tab => {
            const isActive = activeProjectTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveProjectTab(tab.key)}
                style={{
                  background: isActive ? '#0F172A' : '#F8FAFC',
                  color: isActive ? '#FFFFFF' : '#475569',
                  border: '1px solid',
                  borderColor: isActive ? '#0F172A' : '#E2E8F0',
                  borderRadius: '9999px',
                  padding: '6px 14px',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  flexShrink: 0,
                  transition: 'all 0.15s cubic-bezier(0.16, 1, 0.3, 1)',
                  boxShadow: isActive ? '0 2px 8px rgba(15, 23, 42, 0.15)' : 'none'
                }}
              >
                <span style={{ fontSize: '0.85rem' }}>{tab.icon}</span>
                <span>{tab.label}</span>
                <span className="font-mono" style={{ 
                  fontSize: '0.66rem', 
                  background: isActive ? 'rgba(255,255,255,0.2)' : '#E2E8F0',
                  color: isActive ? '#FFFFFF' : '#64748B',
                  padding: '1px 6px',
                  borderRadius: '10px',
                  fontWeight: 700
                }}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: MILESTONE ROADMAP (WITH INTERACTIVE TASKS) */}
        {activeProjectTab === 'ROADMAP' && (
          <div className="nyghto-roadmap-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
            {phases.map((ph, idx) => {
              const isDone = ph.status === 'DONE';
              const isActive = ph.status === 'ACTIVE';
              const cardClass = isDone ? 'phase-card-done' : (isActive ? 'phase-card-active' : 'phase-card-pending');

              return (
                <div 
                  key={idx} 
                  className={`nyghto-phase-card ${cardClass} font-sans`}
                  style={{
                    background: '#FFFFFF',
                    border: isActive ? '1.5px solid #0284C7' : (isDone ? '1px solid #BBF7D0' : '1px solid #E2E8F0'),
                    borderRadius: '14px',
                    padding: '1.4rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                    boxShadow: isActive ? '0 4px 14px rgba(2, 132, 199, 0.08)' : 'none'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="font-mono" style={{ fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.06em', color: isDone ? '#16A34A' : (isActive ? '#0284C7' : '#94A3B8') }}>
                      PHASE 0{idx + 1} • {ph.status}
                    </span>
                    <span className="font-mono" style={{ fontSize: '0.72rem', fontWeight: 700, color: isDone ? '#16A34A' : '#0F172A' }}>
                      {isDone ? `✓ 100%` : ph.pct}
                    </span>
                  </div>

                  <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>
                    {ph.name}
                  </h4>

                  {/* Interactive Checklist */}
                  {ph.items && ph.items.length > 0 && (
                    <div style={{ marginTop: '6px', display: 'flex', flexDirection: 'column', gap: '8px', borderTop: '1px solid #F1F5F9', paddingTop: '10px' }}>
                      {ph.items.map((item, itemIdx) => {
                        const taskId = `${selectedProject.id}-ph${idx}-item${itemIdx}`;
                        const isTaskChecked = checkedTasks[taskId] !== undefined ? checkedTasks[taskId] : isDone;

                        return (
                          <div 
                            key={itemIdx} 
                            onClick={() => toggleTask(taskId)}
                            style={{ 
                              display: 'flex', 
                              alignItems: 'flex-start', 
                              gap: '8px', 
                              fontSize: '0.82rem', 
                              color: isTaskChecked ? '#64748B' : '#334155',
                              cursor: 'pointer',
                              userSelect: 'none'
                            }}
                          >
                            <span style={{ 
                              color: isTaskChecked ? '#16A34A' : (isActive ? '#0284C7' : '#CBD5E1'), 
                              fontWeight: 700,
                              fontSize: '0.9rem' 
                            }}>
                              {isTaskChecked ? '☑' : '☐'}
                            </span>
                            <span style={{ textDecoration: isTaskChecked ? 'line-through' : 'none', lineHeight: 1.4 }}>
                              {item}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* TAB 2: DELIVERABLES & ASSETS */}
        {activeProjectTab === 'DELIVERABLES' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
            {deliverables.map((del) => (
              <div 
                key={del.id}
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  borderRadius: '14px',
                  padding: '1.4rem',
                  display: 'flex',
                  gap: '14px',
                  alignItems: 'flex-start',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
                }}
              >
                <div 
                  className="font-mono"
                  style={{
                    background: del.icon === 'WEB' ? '#E0F2FE' : '#F1F5F9',
                    color: del.icon === 'WEB' ? '#0284C7' : '#0F172A',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    padding: '10px 12px',
                    borderRadius: '8px'
                  }}
                >
                  {del.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="font-mono" style={{ fontSize: '0.66rem', color: '#64748B', fontWeight: 700 }}>
                      {del.tag}
                    </span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(del.link, del.id)}
                      className="font-mono"
                      style={{ background: 'none', border: 'none', color: '#0284C7', cursor: 'pointer', fontSize: '0.68rem', fontWeight: 600 }}
                    >
                      {copiedLink === del.id ? '✓ Copied' : 'Copy Link'}
                    </button>
                  </div>
                  <h4 style={{ margin: '2px 0 4px 0', fontSize: '0.96rem', fontWeight: 700, color: '#0F172A' }}>
                    {del.title}
                  </h4>
                  <p style={{ margin: '0 0 10px 0', fontSize: '0.8rem', color: '#64748B', lineHeight: 1.4 }}>
                    {del.desc}
                  </p>
                  <a 
                    href={del.link} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="font-mono"
                    onClick={(e) => {
                      if (del.isCode) {
                        e.preventDefault();
                        alert(`Code repository access is linked to ${user?.email || 'your account'}. Contact founders on WhatsApp for GitHub invite.`);
                      }
                    }}
                    style={{ fontSize: '0.78rem', color: '#0284C7', fontWeight: 700, textDecoration: 'none' }}
                  >
                    Open Deliverable ↗
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 3: CHANGELOG & ACTIVITY */}
        {activeProjectTab === 'CHANGELOG' && (
          <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '14px', padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
              <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#0F172A' }}>
                Recent Deployments &amp; Sprint Commits
              </h4>
              <span className="font-mono" style={{ fontSize: '0.72rem', color: '#16A34A', fontWeight: 700 }}>● PRODUCTION PIPELINE ACTIVE</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {changelogs.map((log, lIdx) => (
                <div key={lIdx} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', borderBottom: lIdx < changelogs.length - 1 ? '1px solid #F1F5F9' : 'none', paddingBottom: '12px' }}>
                  <span className="font-mono" style={{ background: '#F1F5F9', color: '#0F172A', padding: '3px 8px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 700 }}>
                    {log.tag}
                  </span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#0F172A' }}>
                      {log.title}
                    </div>
                    <div className="font-mono" style={{ fontSize: '0.72rem', color: '#64748B', marginTop: '2px' }}>
                      {log.time} • by {log.author}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    );
  }

  // =========================================================================
  // VIEW: ALL PROJECTS DIRECTORY (LINEAR / VERCEL-INSPIRED CARDS)
  // =========================================================================
  return (
    <div className="react-projects-view font-sans">
      
      {/* Header & New Project Trigger */}
      <div className="nyghto-progress-header font-sans" style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 className="nyghto-progress-title font-sans" style={{ fontSize: '1.55rem', fontWeight: 800, color: '#0F172A', margin: '0 0 4px 0', letterSpacing: '-0.02em' }}>
            Your Projects
          </h2>
          <p className="nyghto-progress-sub font-sans" style={{ color: '#64748B', fontSize: '0.88rem', margin: 0 }}>
            Select any project to view active sprint milestones, live status, and deliverable checklist.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button 
            type="button" 
            className="nyghto-btn-solid font-sans" 
            onClick={() => window.openNewProjectModal && window.openNewProjectModal()}
            style={{ padding: '9px 18px', fontSize: '0.86rem' }}
          >
            <span>+ New Project</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', marginBottom: '1.4rem', flexWrap: 'wrap' }}>
        
        {/* Status Filter Pills (Swipeable on Mobile) */}
        <div style={{ 
          display: 'flex', 
          gap: '6px', 
          overflowX: 'auto',
          WebkitOverflowScrolling: 'touch',
          whiteSpace: 'nowrap',
          scrollbarWidth: 'none',
          padding: '2px 0'
        }}>
          {[
            { key: 'ALL', label: `All (${projects.length})` },
            { key: 'IN_PROGRESS', label: 'In Progress' },
            { key: 'REVIEW', label: 'Waiting for Review' },
            { key: 'COMPLETED', label: 'Completed' }
          ].map(tab => {
            const isActive = statusFilter === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setStatusFilter(tab.key)}
                style={{
                  background: isActive ? '#0F172A' : '#FFFFFF',
                  color: isActive ? '#FFFFFF' : '#64748B',
                  border: '1px solid',
                  borderColor: isActive ? '#0F172A' : '#E2E8F0',
                  borderRadius: '9999px',
                  padding: '6px 13px',
                  fontSize: '0.76rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  flexShrink: 0,
                  transition: 'all 0.15s cubic-bezier(0.16, 1, 0.3, 1)',
                  boxShadow: isActive ? '0 2px 6px rgba(15, 23, 42, 0.12)' : 'none'
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Fast Search Input */}
        <div style={{ position: 'relative', minWidth: '240px' }}>
          <input
            type="text"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              background: '#FFFFFF',
              border: '1px solid #CBD5E1',
              borderRadius: '8px',
              padding: '7px 12px 7px 32px',
              fontSize: '0.82rem',
              color: '#0F172A',
              outline: 'none',
              boxSizing: 'border-box'
            }}
          />
          <svg 
            width="14" 
            height="14" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="#94A3B8" 
            strokeWidth="2"
            style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }}
          >
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </div>

      </div>

      {/* Projects Grid (Linear / Vercel Card Aesthetics) */}
      {filteredProjects.length === 0 ? (
        <div className="nyghto-empty-projects font-sans" style={{ textAlign: 'center', padding: '3.5rem 1.5rem', background: '#FFFFFF', border: '1px dashed #CBD5E1', borderRadius: '16px' }}>
          <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0F172A', margin: '0 0 6px' }}>No projects match your filter</h4>
          <p style={{ color: '#64748B', fontSize: '0.86rem', margin: '0 0 1.2rem' }}>Try clearing your search or start a new project sprint.</p>
          <button 
            type="button" 
            className="nyghto-btn-solid font-sans"
            onClick={() => { setSearchQuery(''); setStatusFilter('ALL'); }}
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="nyghto-project-cards-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
          {filteredProjects.map((p) => {
            const isCompleted = p.status === 'Completed';
            const isReview = p.status === 'Waiting for Review' || p.status === 'Under Review';
            const pct = p.progress !== undefined ? p.progress : (isCompleted ? 100 : (isReview ? 5 : 75));
            const statusClass = isCompleted ? 'status-completed' : (isReview ? 'status-pending' : 'status-accepted');
            const statusLabel = isCompleted ? 'COMPLETED' : (isReview ? 'WAITING FOR REVIEW' : (p.status || 'IN PROGRESS').toUpperCase());

            return (
              <div 
                key={p.id}
                className="nyghto-project-select-card font-sans"
                onClick={() => handleOpenProject(p.id)}
                style={{
                  background: '#FFFFFF',
                  border: isReview ? '1.5px solid #FDE68A' : '1px solid #E2E8F0',
                  borderRadius: '16px',
                  padding: '1.5rem',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)',
                  transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
              >
                {/* Card Top Row */}
                <div className="nyghto-p-card-top" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div className="nyghto-p-card-tags font-mono" style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                    <span className="nyghto-p-tag-cat font-mono" style={{ fontSize: '0.68rem', background: '#F1F5F9', color: '#475569', padding: '3px 8px', borderRadius: '4px', fontWeight: 600 }}>
                      {p.category || 'Web Application'}
                    </span>
                    <span className={`nyghto-badge-status ${statusClass} font-mono`} style={{ fontSize: '0.66rem' }}>
                      {statusLabel}
                    </span>
                  </div>
                  <span className="nyghto-p-pct font-mono" style={{ fontSize: '0.84rem', fontWeight: 800, color: isReview ? '#D97706' : (isCompleted ? '#16A34A' : '#0F172A') }}>
                    {pct}%
                  </span>
                </div>

                {/* Title & Desc */}
                <div>
                  <h3 className="nyghto-p-card-title font-sans" style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0F172A', margin: '0 0 4px 0' }}>
                    {p.name}
                  </h3>
                  <p className="nyghto-p-card-desc font-sans" style={{ fontSize: '0.84rem', color: '#64748B', lineHeight: 1.5, margin: 0 }}>
                    {p.brief}
                  </p>
                </div>

                {/* Linear-Style Segmented Progress Bar */}
                <div style={{ marginTop: 'auto' }}>
                  <div style={{ height: '4px', background: '#F1F5F9', borderRadius: '4px', overflow: 'hidden' }}>
                    <div 
                      style={{ 
                        width: `${pct}%`, 
                        height: '100%', 
                        background: isReview ? '#D97706' : (isCompleted ? '#16A34A' : '#01249D'),
                        borderRadius: '4px',
                        transition: 'width 0.3s ease'
                      }}
                    />
                  </div>
                </div>

                {/* Card Footer Info */}
                <div className="nyghto-p-card-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #F8FAFC', paddingTop: '0.8rem' }}>
                  <div className="nyghto-p-footer-meta font-mono" style={{ fontSize: '0.7rem', color: '#64748B' }}>
                    <span>STAGE: <strong>{p.stage || (isReview ? 'Waiting for Nyghto Review' : 'Production Sprint')}</strong></span>
                  </div>
                  <span className="nyghto-p-open-link font-mono" style={{ fontSize: '0.74rem', fontWeight: 700, color: '#0284C7' }}>
                    View Roadmap ↗
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}

// Global Mount Helper
window.renderReactProjectProgress = function(user, selectedProjectId) {
  const container = document.getElementById('reactProjectProgressRoot');
  if (!container) return;

  if (window.ReactDOM && window.ReactDOM.createRoot) {
    if (!window._nyghtoReactRoot) {
      window._nyghtoReactRoot = window.ReactDOM.createRoot(container);
    }
    window._nyghtoReactRoot.render(
      <ProjectProgressApp initialUser={user} initialProjectId={selectedProjectId} />
    );
  }
};
