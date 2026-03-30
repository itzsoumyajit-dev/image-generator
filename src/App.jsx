import { useState, useRef, useEffect, useCallback } from 'react'
import { generateImage } from './nvidia.js'
import LoadingScreen from './components/LoadingScreen.jsx'
import ParticleCanvas from './components/ParticleCanvas.jsx'

// ─── Data ─────────────────────────────────────────────────────────────────────

const STYLES = [
  { id: 'precise',   label: 'Photorealistic', desc: 'Sharp & detailed, 8k' },
  { id: 'creative',  label: 'Artistic',       desc: 'Abstract & dreamlike' },
  { id: 'technical', label: 'Technical',      desc: 'Blueprint, schematic' },
  { id: 'concise',   label: 'Minimalist',     desc: 'Vector, flat & clean' },
]

const PLACEHOLDERS = [
  'a futuristic city lit by neon lights...',
  'a cozy cabin in snowy mountains...',
  'a cat wearing a tiny astronaut suit...',
  'a surreal floating island with waterfalls...',
  'a minimalist coffee shop logo design...',
]

const FEATURES = [
  { icon: '⚡', title: 'Instant Generation',  desc: 'From idea to image in seconds. No queue, no waiting — just pure creative velocity.' },
  { icon: '🎨', title: 'Style Intelligence',  desc: 'Four distinct visual modes — photorealistic, artistic, technical, or minimal.' },
  { icon: '🔒', title: 'Private by Default',  desc: 'Your prompts and images are never stored or shared. Your ideas stay yours.' },
  { icon: '📥', title: 'Download Ready',       desc: 'Every image is export-ready. One click saves a full-resolution JPEG.' },
]

const PROCESS = [
  {
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
    label: 'Describe', desc: 'Type your scene or concept in plain language.',
  },
  {
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
    label: 'Style', desc: 'Pick a visual mode for your image.',
  },
  {
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>,
    label: 'Generate', desc: 'Stable Diffusion 3 renders your vision instantly.',
  },
]

const MARQUEE_ITEMS = ['THOUGHTFORGE', 'AI IMAGES', 'STABLE DIFFUSION', 'NVIDIA POWERED', 'THOUGHTFORGE', 'AI IMAGES', 'STABLE DIFFUSION', 'NVIDIA POWERED']

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  const apiKey = import.meta.env.VITE_NVIDIA_API_KEY || ''

  const [appLoading,  setAppLoading]  = useState(true)
  const [theme,       setTheme]       = useState('dark')
  const [thought,     setThought]     = useState('')
  const [style,       setStyle]       = useState('precise')
  const [result,      setResult]      = useState('')
  const [generating,  setGenerating]  = useState(false)
  const [error,       setError]       = useState('')
  const [charCount,   setCharCount]   = useState(0)
  const [history,     setHistory]     = useState([])
  const [showHistory, setShowHistory] = useState(false)
  const [placeholder] = useState(() => PLACEHOLDERS[Math.floor(Math.random() * PLACEHOLDERS.length)])

  const textareaRef = useRef(null)
  const resultRef   = useRef(null)
  const mainRef     = useRef(null)

  // Apply theme to <html>
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  // Scroll reveal with IntersectionObserver
  useEffect(() => {
    if (appLoading) return
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') }),
      { threshold: 0.12 }
    )
    document.querySelectorAll('.reveal').forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [appLoading])

  // 3D card tilt
  const onTilt = useCallback(e => {
    const card = e.currentTarget
    const { left, top, width, height } = card.getBoundingClientRect()
    const x = e.clientX - left, y = e.clientY - top
    const rx = ((y - height / 2) / (height / 2)) * -7
    const ry = ((x - width  / 2) / (width  / 2)) *  7
    card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(6px)`
    card.style.transition = 'transform 0.08s ease'
  }, [])

  const onTiltReset = useCallback(e => {
    e.currentTarget.style.transform = ''
    e.currentTarget.style.transition = 'transform 0.5s cubic-bezier(.25,.46,.45,.94)'
  }, [])

  useEffect(() => { if (!appLoading) textareaRef.current?.focus() }, [appLoading])
  useEffect(() => { setCharCount(thought.length) }, [thought])

  async function handleGenerate() {
    if (!thought.trim() || generating) return
    if (!apiKey) { setError('No API key — set VITE_NVIDIA_API_KEY in .env'); return }
    setGenerating(true); setError(''); setResult('')
    try {
      const out = await generateImage(thought.trim(), style, apiKey)
      setResult(out)
      setHistory(p => [{ thought: thought.trim(), style, result: out, ts: Date.now() }, ...p.slice(0, 9)])
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 120)
    } catch (e) { setError(e.message) }
    finally    { setGenerating(false) }
  }

  function handleClear()    { setThought(''); setResult(''); setError(''); textareaRef.current?.focus() }
  function handleDownload() {
    if (!result) return
    const a = document.createElement('a'); a.href = result
    a.download = `thoughtforge-${Date.now()}.jpg`; a.click()
  }
  function handleKeyDown(e) { if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') handleGenerate() }

  function toggleTheme() { setTheme(t => t === 'dark' ? 'light' : 'dark') }

  if (appLoading) return <LoadingScreen onComplete={() => setAppLoading(false)} />

  return (
    <>
      <ParticleCanvas theme={theme} />
      <div className="bg-grid" />
      <div className="glow-top" />
      <div className="glow-right" />
      <div className="glow-orb-left" />
      <div className="glow-orb-mid" />

      {/* ── NAVBAR ── */}
      <nav className="navbar">
        <a href="#" className="nav-logo">
          <div className="nav-logo-icon">T</div>
          thoughtforge
        </a>
        <ul className="nav-links">
          <li><a href="#features">Features</a></li>
          <li><a href="#process">Process</a></li>
          <li><a href="#generate">Generate</a></li>
        </ul>
        <div className="nav-actions">
          {history.length > 0 && (
            <button className="btn-nav-signin" onClick={() => setShowHistory(v => !v)}>
              {showHistory ? 'Close' : `History (${history.length})`}
            </button>
          )}
          <button className="theme-btn" onClick={toggleTheme} title="Toggle theme">
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
          <button className="btn-primary" onClick={() => mainRef.current?.scrollIntoView({ behavior: 'smooth' })}>
            Generate Free
          </button>
        </div>
      </nav>

      {/* ── HISTORY ── */}
      {showHistory && (
        <div className="history-panel" style={{ marginTop: 64 }}>
          {history.map(item => (
            <button key={item.ts} className="history-item"
              onClick={() => { setThought(item.thought); setStyle(item.style); setResult(item.result); setShowHistory(false) }}>
              <span className="history-style">{item.style}</span>
              <span className="history-thought">{item.thought.slice(0, 90)}{item.thought.length > 90 ? '…' : ''}</span>
            </button>
          ))}
        </div>
      )}

      <div style={{ position: 'relative', zIndex: 1 }}>

        {/* ── HERO ── */}
        <section className="hero">
          <div className="hero-badge">
            <span className="hero-badge-dot" />
            AI Image Generation · Stable Diffusion 3
          </div>
          <h1 className="hero-title">
            Your next stunning visual<br />
            <span className="accent">already exists.</span>
          </h1>
          <p className="hero-sub">
            Describe any scene, pick a style, and let AI bring it to life in seconds. No design skills required.
          </p>

          {/* ── APP PANELS ── */}
          <div id="generate" ref={mainRef}
            style={{ width: '100%', maxWidth: 660, display: 'flex', flexDirection: 'column', gap: 12, animation: 'fadeUp .9s ease .3s both' }}>

            {/* Style picker */}
            <div className="app-panel">
              <div className="panel-header">
                <div className="panel-label">
                  <div className="panel-icon">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <circle cx="12" cy="12" r="3"/>
                      <path d="M20.188 10.934c.326.914.326 1.218 0 2.132A8 8 0 0 1 12 20a8 8 0 0 1-8.188-6.934"/>
                    </svg>
                  </div>
                  Image Style
                </div>
              </div>
              <div className="style-grid">
                {STYLES.map(st => (
                  <button key={st.id} className={`style-chip${style === st.id ? ' active' : ''}`} onClick={() => setStyle(st.id)}>
                    <span className="style-chip-label">{st.label}</span>
                    <span className="style-chip-desc">{st.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Prompt + generate */}
            <div className="app-panel">
              <div className="char-row">
                <div className="panel-label" style={{ margin: 0 }}>
                  <div className="panel-icon">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                    </svg>
                  </div>
                  Describe Your Vision
                </div>
                <span className="char-count" style={{ color: charCount > 8000 ? '#f87171' : undefined }}>
                  {charCount} / 10000
                </span>
              </div>

              <textarea
                ref={textareaRef}
                className="panel-textarea"
                value={thought}
                onChange={e => setThought(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                rows={4}
                maxLength={10000}
              />

              {error && (
                <div className="error-box">
                  <span style={{ fontWeight: 700, flexShrink: 0 }}>⚠</span> {error}
                </div>
              )}

              <div className="btn-actions" style={{ marginTop: 14 }}>
                {thought && <button className="btn-clear" onClick={handleClear}>Clear</button>}
                <button className="btn-generate" onClick={handleGenerate}
                  disabled={!thought.trim() || generating} style={{ flex: 1 }}>
                  {generating
                    ? <><div className="spinner" />&nbsp;Generating…</>
                    : <>✦ Generate the image &nbsp;<span style={{ opacity: .5, fontWeight: 400, fontSize: 12 }}>⌘↵</span></>
                  }
                </button>
              </div>
            </div>

            {/* Result */}
            {result && (
              <div ref={resultRef} className="result-wrap">
                <div className="result-header">
                  <span className="result-label">Generated Image</span>
                  <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                    <span className="blur-pill">✦ {style}</span>
                    <button className="btn-download" onClick={handleDownload}>↓ Download</button>
                  </div>
                </div>
                {/* Image with blur-reveal animation + frosted hover overlay */}
                <div className="result-img-wrap">
                  <img src={result} alt="Generated artwork" />
                  <div className="result-img-overlay">
                    <div className="result-overlay-icon">🖼️</div>
                    <div className="result-overlay-text">
                      "{thought.slice(0, 72)}{thought.length > 72 ? '…' : ''}"
                    </div>
                    <button className="result-overlay-btn" onClick={handleDownload}>
                      ↓ Save Image
                    </button>
                  </div>
                </div>
                <div className="result-info-bar">
                  <span className="blur-pill">✦ {style}</span>
                  <span style={{ fontSize: 11, color: 'var(--text-d)', fontStyle: 'italic', flex: 1, textAlign:'right' }}>
                    Hover image for details
                  </span>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ── MARQUEE ── */}
        <div className="marquee-track" style={{ marginTop: 60 }}>
          <div className="marquee-inner">
            {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
              <span key={i} className="marquee-item">{item}</span>
            ))}
          </div>
        </div>

        {/* ── FEATURES ── */}
        <section id="features" style={{ maxWidth: 960, margin: '0 auto', padding: '100px 24px 80px' }}>
          <div className="section-title reveal">
            The <span className="accent">Features</span> of AI Visuals
          </div>
          <p className="section-sub reveal rv1">
            Everything you need to turn a raw idea into breathtaking imagery — no design tools required.
          </p>
          <div className="feature-grid" style={{ marginTop: 48 }}>
            {FEATURES.map((f, i) => (
              <div key={f.title}
                className={`feature-card reveal rv${i + 1}`}
                onMouseMove={onTilt}
                onMouseLeave={onTiltReset}>
                <div className="feature-icon-box">{f.icon}</div>
                <div className="feature-title">{f.title}</div>
                <div className="feature-desc">{f.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── PROCESS ── */}
        <section id="process" style={{ maxWidth: 960, margin: '0 auto', padding: '20px 24px 100px' }}>
          <div style={{ display: 'flex', gap: 40, alignItems: 'flex-start', flexWrap: 'wrap' }}>
            <div style={{ flex: '0 0 280px' }} className="reveal">
              <div className="section-title" style={{ textAlign: 'left', fontSize: 'clamp(26px,3vw,38px)' }}>
                From blank page to<br />
                <span className="accent">stunning image</span><br />
                in seconds.
              </div>
              <p style={{ marginTop: 14, fontSize: 14, color: 'var(--text-m)', lineHeight: '1.7', fontWeight: 300 }}>
                We've distilled visual creation into three effortless steps — so you focus on the idea, not the tools.
              </p>
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', paddingTop: 6 }}>
              {PROCESS.map((step, i) => (
                <div key={step.label} className={`reveal rv${i + 1}`}>
                  <div style={{ display: 'flex', gap: 20, padding: '20px 0' }}>
                    <div className="process-icon-ring">{step.icon}</div>
                    <div>
                      <div className="process-step-label">{step.label}</div>
                      <div className="process-step-desc">{step.desc}</div>
                    </div>
                  </div>
                  {i < PROCESS.length - 1 && <div className="separator" />}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section style={{ maxWidth: 960, margin: '0 auto', padding: '0 24px 100px' }}>
          <div className="cta-card reveal" onMouseMove={onTilt} onMouseLeave={onTiltReset}>
            <div className="cta-title">
              Ready to create<br />
              <span className="accent">stunning visuals?</span>
            </div>
            <p className="cta-sub">No design tools. No experience needed. Just your imagination.</p>
            <div className="cta-btns">
              <button className="btn-primary" style={{ padding: '13px 28px', fontSize: 15 }}
                onClick={() => mainRef.current?.scrollIntoView({ behavior: 'smooth' })}>
                Generate Free →
              </button>
              <button className="btn-outline" style={{ padding: '13px 28px', fontSize: 15 }}>
                👑 View Styles
              </button>
            </div>
            <p className="cta-note">No account needed · Powered by NVIDIA Stable Diffusion 3</p>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer style={{ maxWidth: 960, margin: '0 auto', padding: '0 24px 32px' }}>
          <div className="footer">
            <a href="#" className="nav-logo" style={{ textDecoration: 'none' }}>
              <div className="nav-logo-icon">T</div>
              thoughtforge
            </a>
            <div className="footer-links">
              <a href="#features">Features</a>
              <a href="#process">Process</a>
              <a href="#generate">Generate</a>
            </div>
            <span className="footer-copy">© 2026 thoughtforge. All rights reserved.</span>
          </div>
        </footer>

      </div>
    </>
  )
}
