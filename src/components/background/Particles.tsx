import { useRef, useEffect, useState, useMemo, type FC } from 'react'
import { motion } from 'framer-motion'
import { useTheme } from '../../hooks/useTheme'

interface ParticlesProps {
  particleCount?: number
}

interface Particle {
  x: number
  y: number
  size: number
  speed: number
  sway: number
  angle: number
  rotation: number
  rotationSpeed: number
  drift: number
  fill: string
  stroke: string
}

interface BaseParticleProps {
  size: number
  speed: number
  sway: number
  angle: number
  rotation: number
  rotationSpeed: number
  drift: number
}

interface Dimensions {
  width: number
  height: number
}

interface Colors {
  fill: string
  stroke: string
}

const CONFIG = {
  PARTICLE_RESET_OFFSET: 20,
  CONNECTION_THRESHOLD: 80,
  BASE_HUE: 45,
  BASE_SATURATION: 15,
  MAX_DRIFT: 0.02,
  ROTATION_SPEED: 0.02,
  STROKE_OPACITY: 0.1,
  CSS_VAR_LIGHT: '--color-primary-600',
  CSS_VAR_DARK: '--color-primary-300',
  FILL_ALPHA_LIGHT: 0.6,
  FILL_ALPHA_DARK: 0.4,
} as const

const Particles: FC<ParticlesProps> = ({ particleCount = 60 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particles = useRef<Particle[]>([])
  const animFrame = useRef<number | undefined>(undefined)
  const petalPath = useRef<Path2D | null>(null)
  const resizeObserver = useRef<ResizeObserver | null>(null)
  const dimensions = useRef<Dimensions>({ width: 0, height: 0 })
  const { isDarkMode } = useTheme()
  const [isPaused, setIsPaused] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [themeKey, setThemeKey] = useState(0)
  const isPausedRef = useRef(isPaused)

  useEffect(() => {
    isPausedRef.current = isPaused
  }, [isPaused])

  useEffect(() => {
    const handler = (e: Event) => {
      const customEvent = e as CustomEvent<boolean>
      if (!customEvent.detail) {
        setIsPaused(true)
        setIsVisible(false)
      } else {
        setIsVisible(true)
        setIsPaused(false)
      }
    }
    document.addEventListener('petalsToggle', handler)
    return () => document.removeEventListener('petalsToggle', handler)
  }, [])

  useEffect(() => {
    const observer = new MutationObserver((mutations: MutationRecord[]) => {
      mutations.forEach((mutation: MutationRecord) => {
        if (mutation.attributeName === 'data-theme') {
          setThemeKey((prev) => prev + 1)
        }
      })
    })
    observer.observe(document.documentElement, { attributes: true })
    return () => observer.disconnect()
  }, [])

  const colors = useMemo((): Colors => {
    const varName = isDarkMode ? CONFIG.CSS_VAR_DARK : CONFIG.CSS_VAR_LIGHT
    const raw =
      getComputedStyle(document.documentElement).getPropertyValue(varName).trim() ||
      (isDarkMode ? '#1f2937' : '#64748B')
    const alpha = isDarkMode ? CONFIG.FILL_ALPHA_DARK : CONFIG.FILL_ALPHA_LIGHT

    let fill: string
    if (/^#([0-9A-F]{3}){1,2}$/i.test(raw)) {
      const hex = raw.length === 4 ? `#${raw[1]}${raw[1]}${raw[2]}${raw[2]}${raw[3]}${raw[3]}` : raw
      const a = Math.round(alpha * 255)
        .toString(16)
        .padStart(2, '0')
      fill = `${hex}${a}`
    } else if (raw.startsWith('rgb(')) {
      fill = raw.replace(/rgb\(([^)]+)\)/, `rgba($1, ${alpha})`)
    } else {
      fill = raw
    }

    const stroke = isDarkMode
      ? `hsla(${CONFIG.BASE_HUE}, ${CONFIG.BASE_SATURATION}%, 95%, ${CONFIG.STROKE_OPACITY})`
      : `hsla(${CONFIG.BASE_HUE}, ${CONFIG.BASE_SATURATION}%, 20%, ${CONFIG.STROKE_OPACITY})`

    return { fill, stroke }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDarkMode, themeKey])

  useEffect(() => {
    petalPath.current = new Path2D()
    petalPath.current.moveTo(0, 0)
    petalPath.current.bezierCurveTo(1, -0.5, 1.5, -1.5, 0, -2)
    petalPath.current.bezierCurveTo(-1.5, -1.5, -1, -0.5, 0, 0)
    petalPath.current.closePath()
  }, [])

  useEffect(() => {
    if (!canvasRef.current || !petalPath.current) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    let running = true
    const thresholdSq = CONFIG.CONNECTION_THRESHOLD ** 2

    const baseProps: BaseParticleProps[] = Array.from({ length: particleCount }, () => ({
      size: Math.random() * 1.8 + 0.8,
      speed: Math.random() * 0.4 + 0.2,
      sway: Math.random() * 0.03,
      angle: Math.random() * Math.PI * 2,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * CONFIG.ROTATION_SPEED,
      drift: Math.random() * CONFIG.MAX_DRIFT * 2 - CONFIG.MAX_DRIFT,
    }))

    const init = (preserve: boolean) => {
      particles.current = baseProps.map((p, i) => {
        const prev = particles.current[i]
        const x = preserve && prev ? prev.x : Math.random() * dimensions.current.width
        const y = preserve && prev ? prev.y : Math.random() * -dimensions.current.height
        return { ...p, x, y, fill: colors.fill, stroke: colors.stroke }
      })
    }

    const onResize = () => {
      const w = canvas.offsetWidth
      const h = canvas.offsetHeight
      if (w === dimensions.current.width && h === dimensions.current.height) return
      dimensions.current = { width: w, height: h }
      canvas.width = w
      canvas.height = h
      init(true)
    }

    const draw = () => {
      ctx.clearRect(0, 0, dimensions.current.width, dimensions.current.height)

      if (!isPausedRef.current) {
        particles.current.forEach((p) => {
          p.y += p.speed
          p.x += Math.cos(p.angle) * p.sway + p.drift
          p.angle += 0.004
          p.rotation += p.rotationSpeed
          if (p.y > dimensions.current.height + CONFIG.PARTICLE_RESET_OFFSET) {
            p.y = -10
            p.x = Math.random() * dimensions.current.width
          }
          p.fill = colors.fill
          p.stroke = colors.stroke
        })
      }

      particles.current.forEach((p) => {
        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate(p.rotation)
        ctx.scale(p.size * 0.8, p.size)
        ctx.fillStyle = p.fill
        if (petalPath.current) ctx.fill(petalPath.current)
        ctx.strokeStyle = p.stroke
        ctx.lineWidth = 0.15
        if (petalPath.current) ctx.stroke(petalPath.current)
        ctx.restore()
      })

      particles.current.forEach((p1, i) => {
        for (let j = i + 1; j < particles.current.length; ++j) {
          const p2 = particles.current[j]
          if (!p2) continue
          const dx = p1.x - p2.x
          const dy = p1.y - p2.y
          const d2 = dx * dx + dy * dy
          if (d2 < thresholdSq) {
            const a = 0.1 - (Math.sqrt(d2) / CONFIG.CONNECTION_THRESHOLD) * 0.1
            ctx.beginPath()
            ctx.moveTo(p1.x, p1.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.strokeStyle = p1.stroke
            ctx.lineWidth = 0.2 - Math.sqrt(d2) / 500
            ctx.globalAlpha = a
            ctx.stroke()
            ctx.globalAlpha = 1
          }
        }
      })

      if (running) animFrame.current = requestAnimationFrame(draw)
    }

    resizeObserver.current = new ResizeObserver(onResize)
    resizeObserver.current.observe(canvas)
    onResize()
    init(false)
    draw()

    return () => {
      running = false
      resizeObserver.current?.disconnect()
      if (animFrame.current) cancelAnimationFrame(animFrame.current)
      particles.current = []
    }
  }, [particleCount, isDarkMode, colors])

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: isVisible ? 0.6 : 0 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
      className='fixed inset-0 w-full h-full pointer-events-none z-1'
    >
      <canvas ref={canvasRef} className='w-full h-full' aria-hidden='true' />
    </motion.div>
  )
}

export default Particles
