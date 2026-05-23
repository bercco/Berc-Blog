'use client'

import { useEffect, useRef, useCallback } from 'react'
import { useTheme } from 'next-themes'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  minDistance: number
}

export function PoissonBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { theme } = useTheme()
  const particlesRef = useRef<Particle[]>([])
  const animationRef = useRef<number | null>(null)

  const generatePoissonParticles = useCallback((width: number, height: number) => {
    const particles: Particle[] = []
    const gridSize = 60
    const minDistance = 80
    const maxDistance = minDistance * 2
    const candidatesCount = 30

    const grid: (Particle | null)[][] = Array(Math.ceil(height / gridSize))
      .fill(null)
      .map(() => Array(Math.ceil(width / gridSize)).fill(null))

    const isValid = (p: Particle) => {
      const gridX = Math.floor(p.x / gridSize)
      const gridY = Math.floor(p.y / gridSize)
      const searchRadius = Math.ceil(maxDistance / gridSize)

      for (let i = Math.max(0, gridY - searchRadius); i <= Math.min(grid.length - 1, gridY + searchRadius); i++) {
        for (let j = Math.max(0, gridX - searchRadius); j <= Math.min(grid[i].length - 1, gridX + searchRadius); j++) {
          const neighbor = grid[i][j]
          if (neighbor) {
            const dist = Math.hypot(p.x - neighbor.x, p.y - neighbor.y)
            if (dist < minDistance) return false
          }
        }
      }
      return true
    }

    const addParticle = (x: number, y: number) => {
      const particle: Particle = {
        x,
        y,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 1.5 + 0.5,
        minDistance,
      }

      if (isValid(particle)) {
        particles.push(particle)
        const gridX = Math.floor(x / gridSize)
        const gridY = Math.floor(y / gridSize)
        if (grid[gridY] && grid[gridY][gridX] !== undefined) {
          grid[gridY][gridX] = particle
        }
        return true
      }
      return false
    }

    const first = {
      x: Math.random() * width,
      y: Math.random() * height,
      vx: 0,
      vy: 0,
      radius: Math.random() * 1.5 + 0.5,
      minDistance,
    }
    particles.push(first)
    const gridX = Math.floor(first.x / gridSize)
    const gridY = Math.floor(first.y / gridSize)
    if (grid[gridY] && grid[gridY][gridX] !== undefined) {
      grid[gridY][gridX] = first
    }

    const active: Particle[] = [first]

    while (active.length > 0) {
      const idx = Math.floor(Math.random() * active.length)
      const particle = active[idx]
      let found = false

      for (let i = 0; i < candidatesCount; i++) {
        const angle = Math.random() * Math.PI * 2
        const distance = minDistance + Math.random() * (maxDistance - minDistance)
        const newX = particle.x + distance * Math.cos(angle)
        const newY = particle.y + distance * Math.sin(angle)

        if (newX >= 0 && newX < width && newY >= 0 && newY < height) {
          if (addParticle(newX, newY)) {
            active.push(particles[particles.length - 1])
            found = true
            break
          }
        }
      }

      if (!found) {
        active.splice(idx, 1)
      }
    }

    return particles
  }, [])

  const animate = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const isDark = theme === 'dark'
    const bgColor = isDark ? '#1f2937' : '#f9fafb'
    const particleColor = isDark ? 'rgba(148, 163, 184, 0.4)' : 'rgba(71, 85, 105, 0.2)'
    const lineColor = isDark ? 'rgba(148, 163, 184, 0.15)' : 'rgba(71, 85, 105, 0.08)'

    ctx.fillStyle = bgColor
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    const particles = particlesRef.current

    particles.forEach((particle) => {
      particle.x += particle.vx
      particle.y += particle.vy

      if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1
      if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1

      particle.x = Math.max(0, Math.min(canvas.width, particle.x))
      particle.y = Math.max(0, Math.min(canvas.height, particle.y))
    })

    particles.forEach((particle, i) => {
      for (let j = i + 1; j < particles.length; j++) {
        const other = particles[j]
        const dist = Math.hypot(particle.x - other.x, particle.y - other.y)

        if (dist < particle.minDistance * 1.5) {
          ctx.strokeStyle = lineColor
          ctx.lineWidth = 1
          ctx.beginPath()
          ctx.moveTo(particle.x, particle.y)
          ctx.lineTo(other.x, other.y)
          ctx.stroke()
        }
      }
    })

    particles.forEach((particle) => {
      ctx.fillStyle = particleColor
      ctx.beginPath()
      ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2)
      ctx.fill()
    })

    animationRef.current = requestAnimationFrame(animate)
  }, [theme])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight

      particlesRef.current = generatePoissonParticles(canvas.width, canvas.height)
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    if (!animationRef.current) {
      animationRef.current = requestAnimationFrame(animate)
    }

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [generatePoissonParticles, animate])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 pointer-events-none"
      style={{ background: 'transparent' }}
    />
  )
}
