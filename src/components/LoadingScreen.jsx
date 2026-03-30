import { useState, useEffect, useRef } from 'react'

export default function LoadingScreen({ onComplete }) {
  const [progress, setProgress] = useState(0)
  const [exiting, setExiting] = useState(false)
  const canvasRef = useRef(null)

  useEffect(() => {
    const steps = [
      [200, 25], [600, 50], [1000, 75], [1500, 95], [2000, 100],
    ]
    const timers = steps.map(([ms, val]) => setTimeout(() => setProgress(val), ms))
    const done = setTimeout(() => {
      setExiting(true)
      setTimeout(onComplete, 700)
    }, 2400)
    return () => { timers.forEach(clearTimeout); clearTimeout(done) }
  }, [onComplete])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const pts = Array.from({ length: 80 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.8 + 0.4,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      o: Math.random() * 0.4 + 0.1,
    }))

    let raf
    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      pts.forEach(p => {
        p.x += p.vx; p.y += p.vy
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(91,97,209,${p.o})`
        ctx.fill()
      })
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y
          const d = Math.sqrt(dx * dx + dy * dy)
          if (d < 100) {
            ctx.beginPath()
            ctx.moveTo(pts[i].x, pts[i].y)
            ctx.lineTo(pts[j].x, pts[j].y)
            ctx.strokeStyle = `rgba(91,97,209,${0.12 * (1 - d / 100)})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }
      }
      raf = requestAnimationFrame(draw)
    }
    draw()
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'var(--bg)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      gap: 28,
      opacity: exiting ? 0 : 1,
      transform: exiting ? 'scale(1.04)' : 'scale(1)',
      transition: 'opacity 0.7s cubic-bezier(.4,0,.2,1), transform 0.7s cubic-bezier(.4,0,.2,1)',
      pointerEvents: exiting ? 'none' : 'all',
    }}>
      <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />

      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
        {/* Logo */}
        <div style={{
          width: 80, height: 80, borderRadius: 22,
          background: 'linear-gradient(135deg,#5b61d1,#b3f5ff)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 36, fontWeight: 800, color: '#fff',
          boxShadow: '0 0 60px rgba(91,97,209,.65), 0 0 120px rgba(91,97,209,.2)',
          animation: 'ls-pulse 2s ease-in-out infinite',
          fontFamily: 'Syne, sans-serif',
        }}>T</div>

        <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 28, color: 'var(--text)', letterSpacing: '-.02em' }}>
          thoughtforge
        </div>
        <div style={{ fontFamily: 'Inter,sans-serif', fontSize: 12, color: 'var(--text-muted)', letterSpacing: '.15em', textTransform: 'uppercase' }}>
          AI Image Generation
        </div>

        {/* Progress bar */}
        <div style={{ width: 220, height: 3, background: 'var(--border)', borderRadius: 99, overflow: 'hidden', marginTop: 8 }}>
          <div style={{
            height: '100%', borderRadius: 99,
            background: 'linear-gradient(90deg,#5b61d1,#b3f5ff)',
            boxShadow: '0 0 12px rgba(91,97,209,.8)',
            width: `${progress}%`,
            transition: 'width 0.4s cubic-bezier(.4,0,.2,1)',
          }} />
        </div>

        {/* Dots */}
        <div style={{ display: 'flex', gap: 8 }}>
          {[0, 0.2, 0.4].map((d, i) => (
            <div key={i} style={{
              width: 6, height: 6, borderRadius: '50%',
              background: '#5b61d1',
              animation: `ls-dot 1.2s ease ${d}s infinite`,
            }} />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes ls-pulse { 0%,100%{transform:scale(1);box-shadow:0 0 60px rgba(91,97,209,.65)} 50%{transform:scale(1.06);box-shadow:0 0 80px rgba(91,97,209,.9)} }
        @keyframes ls-dot { 0%,100%{opacity:.3;transform:translateY(0)} 50%{opacity:1;transform:translateY(-4px)} }
      `}</style>
    </div>
  )
}
