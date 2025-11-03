import { useState, useEffect, useCallback, useRef, type FC } from 'react'

interface Pipe {
  id: number
  x: number
  topHeight: number
  gapSize: number
  color: string
  passed: boolean
}

interface Circle {
  x: number
  y: number
  radius: number
}

interface Rectangle {
  x: number
  y: number
  width: number
  height: number
}

interface SparrowGameProps {
  onClose: () => void
}

const CONFIG = {
  GAME_WIDTH: 300,
  GAME_HEIGHT: 250,
  GRAVITY: 0.65,
  JUMP_FORCE: -8.5,
  BIRD_WIDTH: 30,
  BIRD_HEIGHT: 24,
  PIPE_WIDTH: 52,
  PIPE_GAP: { MIN: 85, MAX: 115 },
  PIPE_SPACING: { MIN: 220, MAX: 280 },
  PIPE_SPEED: { BASE: 2.2, MAX: 4 },
  COLORS: {
    BACKGROUND: '#4A6D8C',
    BIRD: '#E67E22',
    BIRD_OUTLINE: '#7D4B12',
    PIPE: ['#8E44AD', '#9B59B6', '#8E44AD', '#7D3C98'] as string[],
    PIPE_OUTLINE: '#5B2C6F',
    GROUND: '#6D4C41',
    TEXT: 'primary-600',
    BUTTON: 'primary-400',
    BORDER: 'primary-600',
  },
  HIGH_SCORE_KEY: 'SparrowHighScore',
  MIN_PIPE_HEIGHT: 40,
  GROUND_HEIGHT: 30,
  BIRD_COLLISION_RADIUS: 10,
  BIRD_X_POSITION: 80,
}

const utils = {
  random: (min: number, max: number): number => Math.floor(Math.random() * (max - min + 1)) + min,
  randomItem: <T,>(array: T[]): T => array[Math.floor(Math.random() * array.length)]!,
  circleRectIntersect: (circle: Circle, rect: Rectangle): boolean => {
    const closestX = Math.max(rect.x, Math.min(circle.x, rect.x + rect.width))
    const closestY = Math.max(rect.y, Math.min(circle.y, rect.y + rect.height))

    const distanceX = circle.x - closestX
    const distanceY = circle.y - closestY

    const distanceSquared = distanceX * distanceX + distanceY * distanceY
    return distanceSquared < circle.radius * circle.radius
  },
}

const SparrowGame: FC<SparrowGameProps> = ({ onClose }) => {
  const [gameStarted, setGameStarted] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(() => {
    const savedHighScore = localStorage.getItem(CONFIG.HIGH_SCORE_KEY)
    return savedHighScore ? parseInt(savedHighScore, 10) : 0
  })
  const [birdPos, setBirdPos] = useState(CONFIG.GAME_HEIGHT / 2)
  const [pipes, setPipes] = useState<Pipe[]>([])
  const [gameSpeed, setGameSpeed] = useState<number>(CONFIG.PIPE_SPEED.BASE)

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const velocityRef = useRef(0)
  const frameCountRef = useRef(0)
  const lastPipeRef = useRef(0)
  const pipeSpacingRef = useRef(CONFIG.PIPE_SPACING.MIN)
  const animationFrameRef = useRef<number | undefined>(undefined)
  const lastUpdateTimeRef = useRef(0)

  useEffect(() => {
    if (highScore > 0) {
      localStorage.setItem(CONFIG.HIGH_SCORE_KEY, highScore.toString())
    }
  }, [highScore])

  const initGame = useCallback(() => {
    setGameStarted(false)
    setGameOver(false)
    setScore(0)
    setBirdPos(CONFIG.GAME_HEIGHT / 2)
    setGameSpeed(CONFIG.PIPE_SPEED.BASE)
    velocityRef.current = 0
    setPipes([])
    lastPipeRef.current = 0
    frameCountRef.current = 0
    pipeSpacingRef.current = utils.random(CONFIG.PIPE_SPACING.MIN, CONFIG.PIPE_SPACING.MAX)
    lastUpdateTimeRef.current = 0
  }, [])

  const resetGame = useCallback(() => initGame(), [initGame])

  const jump = useCallback(() => {
    if (!gameStarted && !gameOver) {
      setGameStarted(true)
    }

    if (!gameOver) {
      velocityRef.current = CONFIG.JUMP_FORCE
    } else {
      resetGame()
    }
  }, [gameOver, gameStarted, resetGame])

  const createPipe = useCallback((): Pipe => {
    const gapSize = utils.random(CONFIG.PIPE_GAP.MIN, CONFIG.PIPE_GAP.MAX)

    const minTopHeight = CONFIG.MIN_PIPE_HEIGHT
    const maxTopHeight =
      CONFIG.GAME_HEIGHT - gapSize - CONFIG.MIN_PIPE_HEIGHT - CONFIG.GROUND_HEIGHT

    let topHeight: number
    const positionType = Math.random()

    if (positionType < 0.7) {
      const middlePoint = (minTopHeight + maxTopHeight) / 2
      const range = (maxTopHeight - minTopHeight) * 0.6
      topHeight = utils.random(
        Math.max(minTopHeight, middlePoint - range / 2),
        Math.min(maxTopHeight, middlePoint + range / 2),
      )
    } else {
      if (Math.random() < 0.5) {
        topHeight = utils.random(minTopHeight, minTopHeight + (maxTopHeight - minTopHeight) * 0.25)
      } else {
        topHeight = utils.random(maxTopHeight - (maxTopHeight - minTopHeight) * 0.25, maxTopHeight)
      }
    }

    const pipeColor = utils.randomItem(CONFIG.COLORS.PIPE)
    pipeSpacingRef.current = utils.random(CONFIG.PIPE_SPACING.MIN, CONFIG.PIPE_SPACING.MAX)

    return {
      id: Date.now(),
      x: CONFIG.GAME_WIDTH,
      topHeight,
      gapSize,
      color: pipeColor,
      passed: false,
    }
  }, [])

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.fillStyle = CONFIG.COLORS.BACKGROUND
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    pipes.forEach((pipe) => {
      ctx.fillStyle = pipe.color || CONFIG.COLORS.PIPE[0] || '#8E44AD'
      ctx.strokeStyle = CONFIG.COLORS.PIPE_OUTLINE
      ctx.lineWidth = 2

      ctx.beginPath()
      ctx.rect(pipe.x, 0, CONFIG.PIPE_WIDTH, pipe.topHeight)
      ctx.fill()
      ctx.stroke()

      ctx.beginPath()
      ctx.rect(pipe.x - 3, pipe.topHeight - 12, CONFIG.PIPE_WIDTH + 6, 12)
      ctx.fill()
      ctx.stroke()

      const bottomPipeY = pipe.topHeight + pipe.gapSize
      ctx.beginPath()
      ctx.rect(
        pipe.x,
        bottomPipeY,
        CONFIG.PIPE_WIDTH,
        CONFIG.GAME_HEIGHT - bottomPipeY - CONFIG.GROUND_HEIGHT,
      )
      ctx.fill()
      ctx.stroke()

      ctx.beginPath()
      ctx.rect(pipe.x - 3, bottomPipeY, CONFIG.PIPE_WIDTH + 6, 12)
      ctx.fill()
      ctx.stroke()
    })

    ctx.fillStyle = CONFIG.COLORS.GROUND
    ctx.fillRect(
      0,
      CONFIG.GAME_HEIGHT - CONFIG.GROUND_HEIGHT,
      CONFIG.GAME_WIDTH,
      CONFIG.GROUND_HEIGHT,
    )

    ctx.save()

    const birdAngle = (Math.min(Math.max(velocityRef.current / 10, -0.5), 0.5) * Math.PI) / 4
    ctx.translate(CONFIG.BIRD_X_POSITION, birdPos)
    ctx.rotate(birdAngle)

    ctx.fillStyle = CONFIG.COLORS.BIRD
    ctx.strokeStyle = CONFIG.COLORS.BIRD_OUTLINE
    ctx.lineWidth = 2

    ctx.beginPath()
    ctx.ellipse(0, 0, CONFIG.BIRD_WIDTH / 2, CONFIG.BIRD_HEIGHT / 2, 0, 0, 2 * Math.PI)
    ctx.fill()
    ctx.stroke()

    ctx.fillStyle = '#000'
    ctx.beginPath()
    ctx.arc(8, -2, 3, 0, 2 * Math.PI)
    ctx.fill()

    const wingOffset = frameCountRef.current % 16 < 8 ? 3 : -1
    ctx.beginPath()
    ctx.ellipse(-5, wingOffset, 10, 5, Math.PI / 6, 0, 2 * Math.PI)
    ctx.fill()
    ctx.stroke()

    ctx.restore()

    ctx.fillStyle = '#fff'
    ctx.font = 'bold 24px Arial'
    ctx.textAlign = 'center'
    ctx.fillText(score.toString(), CONFIG.GAME_WIDTH / 2, 40)

    ctx.font = 'bold 14px Arial'
    ctx.fillText(`HIGH: ${highScore}`, CONFIG.GAME_WIDTH / 2, 60)

    if (!gameStarted && !gameOver) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'
      ctx.fillRect(0, 0, CONFIG.GAME_WIDTH, CONFIG.GAME_HEIGHT)

      ctx.fillStyle = '#fff'
      ctx.font = 'bold 18px Arial'
      ctx.textAlign = 'center'
      ctx.fillText('PRESS SPACE TO SOAR', CONFIG.GAME_WIDTH / 2, CONFIG.GAME_HEIGHT / 2)
    }

    if (gameOver) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'
      ctx.fillRect(0, 0, CONFIG.GAME_WIDTH, CONFIG.GAME_HEIGHT)

      ctx.fillStyle = '#fff'
      ctx.font = 'bold 20px Arial'
      ctx.textAlign = 'center'
      ctx.fillText('GAME OVER', CONFIG.GAME_WIDTH / 2, CONFIG.GAME_HEIGHT / 2 - 30)
      ctx.fillText(`SCORE: ${score}`, CONFIG.GAME_WIDTH / 2, CONFIG.GAME_HEIGHT / 2)
      ctx.fillText(`HIGH SCORE: ${highScore}`, CONFIG.GAME_WIDTH / 2, CONFIG.GAME_HEIGHT / 2 + 30)
      ctx.font = '16px Arial'
      ctx.fillText('PRESS SPACE TO RETRY', CONFIG.GAME_WIDTH / 2, CONFIG.GAME_HEIGHT / 2 + 60)
    }
  }, [pipes, birdPos, gameStarted, gameOver, score, highScore])

  const updatePipes = useCallback(
    (currentPipes: Pipe[], deltaTime: number): Pipe[] => {
      return currentPipes
        .map((pipe) => {
          const newX = pipe.x - gameSpeed * deltaTime

          if (!pipe.passed && newX + CONFIG.PIPE_WIDTH < CONFIG.BIRD_X_POSITION) {
            pipe.passed = true
            setScore((prevScore) => {
              const newScore = prevScore + 1

              if (newScore % 3 === 0 && newScore <= 36) {
                setGameSpeed((prevSpeed) => Math.min(CONFIG.PIPE_SPEED.MAX, prevSpeed + 0.2))
              }

              return newScore
            })
          }

          return { ...pipe, x: newX }
        })
        .filter((pipe) => pipe.x > -CONFIG.PIPE_WIDTH)
    },
    [gameSpeed],
  )

  const checkCollisions = useCallback((): boolean => {
    const birdCircle: Circle = {
      x: CONFIG.BIRD_X_POSITION,
      y: birdPos,
      radius: CONFIG.BIRD_COLLISION_RADIUS,
    }

    if (birdPos + CONFIG.BIRD_COLLISION_RADIUS > CONFIG.GAME_HEIGHT - CONFIG.GROUND_HEIGHT) {
      return true
    }

    if (birdPos - CONFIG.BIRD_COLLISION_RADIUS < 0) {
      return true
    }

    for (const pipe of pipes) {
      const topPipeBox: Rectangle = {
        x: pipe.x,
        y: 0,
        width: CONFIG.PIPE_WIDTH,
        height: pipe.topHeight,
      }

      const bottomPipeBox: Rectangle = {
        x: pipe.x,
        y: pipe.topHeight + pipe.gapSize,
        width: CONFIG.PIPE_WIDTH,
        height: CONFIG.GAME_HEIGHT - (pipe.topHeight + pipe.gapSize),
      }

      if (
        utils.circleRectIntersect(birdCircle, topPipeBox) ||
        utils.circleRectIntersect(birdCircle, bottomPipeBox)
      ) {
        return true
      }
    }

    return false
  }, [pipes, birdPos])

  const update = useCallback(
    (timestamp: number) => {
      if (!gameStarted || gameOver) return

      const deltaTime = lastUpdateTimeRef.current ? (timestamp - lastUpdateTimeRef.current) / 16 : 1
      lastUpdateTimeRef.current = timestamp

      velocityRef.current += CONFIG.GRAVITY * deltaTime
      setBirdPos((prev) => prev + velocityRef.current * deltaTime)

      setPipes((prevPipes) => updatePipes(prevPipes, deltaTime))

      frameCountRef.current += deltaTime
      if (frameCountRef.current - lastPipeRef.current >= pipeSpacingRef.current / gameSpeed) {
        setPipes((prevPipes) => [...prevPipes, createPipe()])
        lastPipeRef.current = frameCountRef.current
      }

      if (checkCollisions()) {
        setGameOver(true)
        setHighScore((prev) => Math.max(prev, score))
      }
    },
    [gameStarted, gameOver, score, checkCollisions, createPipe, updatePipes, gameSpeed],
  )

  const gameLoopRef = useRef<((timestamp: number) => void) | undefined>(undefined)

  const gameLoop = useCallback(
    (timestamp: number) => {
      update(timestamp)
      draw()

      if (!gameOver) {
        animationFrameRef.current = requestAnimationFrame(gameLoopRef.current!)
      }
    },
    [update, draw, gameOver],
  )

  useEffect(() => {
    gameLoopRef.current = gameLoop
  }, [gameLoop])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp' || e.key === ' ') {
        e.preventDefault()
        jump()
      } else if (e.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [jump, onClose])

  useEffect(() => {
    draw()

    if (!gameOver) {
      animationFrameRef.current = requestAnimationFrame(gameLoop)
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [draw, gameLoop, gameOver])

  return (
    <div className='w-full max-w-md mx-auto p-4 bg-gray-800/20 rounded-lg flex flex-col'>
      <div className='flex justify-between items-center mb-1'>
        <h2
          className={`text-${CONFIG.COLORS.TEXT} text-sm font-semibold drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]`}
        >
          SOARING SPARROW
        </h2>
        <div className='flex gap-4'>
          <div className={`text-${CONFIG.COLORS.TEXT} font-semibold text-sm`}>SCORE: {score}</div>
          <div className={`text-${CONFIG.COLORS.TEXT} font-semibold text-sm`}>
            HIGH: {highScore}
          </div>
        </div>
        <button
          onClick={onClose}
          className={`text-xs bg-transparent border font-semibold border-${CONFIG.COLORS.BORDER}/50 text-${CONFIG.COLORS.TEXT} px-2 py-1 rounded transition-all hover:bg-${CONFIG.COLORS.BUTTON}/10`}
        >
          [ESC] QUIT
        </button>
      </div>

      <div className='relative flex-1 flex items-center justify-center my-1'>
        <div className='relative'>
          <canvas
            ref={canvasRef}
            width={CONFIG.GAME_WIDTH}
            height={CONFIG.GAME_HEIGHT}
            className={`border-2 border-${CONFIG.COLORS.BORDER} rounded-lg`}
            style={{
              width: '300px',
              height: '250px',
            }}
            onClick={jump}
          />
        </div>
      </div>

      <div
        className={`text-${CONFIG.COLORS.TEXT} font-semibold text-xs text-center leading-snug mt-1`}
      >
        <p>SPACE/UP/CLICK - Jump • ESC - Quit</p>
      </div>
    </div>
  )
}

export default SparrowGame
