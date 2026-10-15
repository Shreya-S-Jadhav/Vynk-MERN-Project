import { useEffect, useRef } from 'react'

export default function KineticBackground({ variant = 'ambient' }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animationFrameId
    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)

    const handleResize = () => {
      if (!canvas) return
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
    }
    window.addEventListener('resize', handleResize)

    // Mouse tracker for interactive organic drift
    const mouse = {
      x: width / 2,
      y: height / 2,
      targetX: width / 2,
      targetY: height / 2,
    }

    const handleMouseMove = (e) => {
      mouse.targetX = e.clientX
      mouse.targetY = e.clientY
    }
    window.addEventListener('mousemove', handleMouseMove)

    // Luminescent floating orbs with organic sinusoidal motion
    const orbs = [
      { x: width * 0.25, y: height * 0.3, radius: Math.min(width, height) * 0.42, color: 'rgba(99, 102, 241, 0.28)', vx: 0.0008, vy: 0.0011, phase: 0 },
      { x: width * 0.75, y: height * 0.4, radius: Math.min(width, height) * 0.48, color: 'rgba(168, 85, 247, 0.22)', vx: 0.0012, vy: 0.0009, phase: Math.PI / 2 },
      { x: width * 0.5, y: height * 0.8, radius: Math.min(width, height) * 0.45, color: 'rgba(14, 165, 233, 0.20)', vx: 0.0007, vy: 0.0014, phase: Math.PI },
      { x: width * 0.85, y: height * 0.85, radius: Math.min(width, height) * 0.38, color: 'rgba(236, 72, 153, 0.16)', vx: 0.001, vy: 0.0008, phase: Math.PI * 1.5 },
    ]

    // Floating micro-stardust particles
    const particles = Array.from({ length: 42 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 1.8 + 0.6,
      speedX: (Math.random() - 0.5) * 0.3,
      speedY: (Math.random() - 0.5) * 0.3 - 0.15,
      alpha: Math.random() * 0.5 + 0.2,
      pulse: Math.random() * Math.PI * 2,
    }))

    let time = 0

    const render = () => {
      time += 0.015

      // Smooth mouse interpolation
      mouse.x += (mouse.targetX - mouse.x) * 0.04
      mouse.y += (mouse.targetY - mouse.y) * 0.04

      // Deep dark canvas fill
      ctx.fillStyle = '#07080d'
      ctx.fillRect(0, 0, width, height)

      // Draw orbs with radial gradients and subtle mouse pull
      orbs.forEach((orb, i) => {
        const driftX = Math.sin(time * orb.vx * 100 + orb.phase) * (width * 0.12)
        const driftY = Math.cos(time * orb.vy * 100 + orb.phase) * (height * 0.12)
        
        // Gentle pull towards mouse
        const pullFactor = 0.05 * (i % 2 === 0 ? 1 : -1)
        const currentX = orb.x + driftX + (mouse.x - width / 2) * pullFactor
        const currentY = orb.y + driftY + (mouse.y - height / 2) * pullFactor

        const gradient = ctx.createRadialGradient(
          currentX,
          currentY,
          0,
          currentX,
          currentY,
          orb.radius
        )
        gradient.addColorStop(0, orb.color)
        gradient.addColorStop(0.5, orb.color.replace(/[\d\.]+\)$/, '0.08)'))
        gradient.addColorStop(1, 'rgba(7, 8, 13, 0)')

        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(currentX, currentY, orb.radius, 0, Math.PI * 2)
        ctx.fill()
      })

      // Draw subtle micro stardust
      particles.forEach((p) => {
        p.x += p.speedX
        p.y += p.speedY
        p.pulse += 0.02
        const currentAlpha = p.alpha * (0.6 + 0.4 * Math.sin(p.pulse))

        if (p.x < 0) p.x = width
        if (p.x > width) p.x = 0
        if (p.y < 0) p.y = height
        if (p.y > height) p.y = 0

        ctx.fillStyle = `rgba(226, 232, 240, ${currentAlpha})`
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fill()
      })

      // Subtle atmospheric grid or scan-line accent
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.015)'
      ctx.lineWidth = 1
      const gridSize = 72
      const offsetX = (mouse.x * 0.02) % gridSize
      const offsetY = (mouse.y * 0.02) % gridSize

      for (let x = offsetX; x < width; x += gridSize) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, height)
        ctx.stroke()
      }
      for (let y = offsetY; y < height; y += gridSize) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(width, y)
        ctx.stroke()
      }

      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('mousemove', handleMouseMove)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <div className="vynk-kinetic-bg-container" aria-hidden="true">
      <canvas ref={canvasRef} className="vynk-kinetic-canvas" />
      <div className="vynk-kinetic-vignette" />
    </div>
  )
}
