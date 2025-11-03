import { useState, useEffect, useCallback, useRef, type FC } from 'react'
import { SNAKE_CONFIG, DIRECTION_KEYS, DIRECTIONS, KEYS } from '../../constants'

import type { GameComponentProps } from '../../hooks/useGameHandler'

type SnakeGameProps = GameComponentProps

interface Position {
  x: number
  y: number
}

const SnakeGame: FC<SnakeGameProps> = ({ onClose, isDarkMode: _ }) => {
  const [snake, setSnake] = useState<Position[]>(SNAKE_CONFIG.INITIAL_SNAKE_POSITION)
  const [food, setFood] = useState<Position>(SNAKE_CONFIG.INITIAL_FOOD_POSITION)
  const [gameOver, setGameOver] = useState(false)
  const [score, setScore] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const directionRef = useRef<string>(DIRECTIONS.RIGHT)
  const directionQueueRef = useRef<string[]>([])
  const gameLoopRef = useRef<number | undefined>(undefined)

  const generateFood = useCallback(() => {
    let newFood: Position
    do {
      newFood = {
        x: Math.floor(Math.random() * SNAKE_CONFIG.GRID_SIZE),
        y: Math.floor(Math.random() * SNAKE_CONFIG.GRID_SIZE),
      }
    } while (snake.some((segment) => segment.x === newFood.x && segment.y === newFood.y))

    setFood(newFood)
  }, [snake])

  const resetGame = useCallback(() => {
    setSnake(SNAKE_CONFIG.INITIAL_SNAKE_POSITION)
    directionRef.current = DIRECTIONS.RIGHT
    directionQueueRef.current = []
    setGameOver(false)
    setScore(0)
    setIsPaused(false)
    generateFood()
  }, [generateFood])

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const cellWidth = canvas.width / SNAKE_CONFIG.GRID_SIZE
    const cellHeight = canvas.height / SNAKE_CONFIG.GRID_SIZE

    ctx.fillStyle = SNAKE_CONFIG.COLORS.BACKGROUND
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    snake.forEach((segment, index) => {
      ctx.fillStyle = index === 0 ? SNAKE_CONFIG.COLORS.HEAD : SNAKE_CONFIG.COLORS.BODY
      ctx.fillRect(segment.x * cellWidth, segment.y * cellHeight, cellWidth - 1, cellHeight - 1)
    })

    ctx.font = `${cellWidth}px Arial`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('🍪', food.x * cellWidth + cellWidth / 2, food.y * cellHeight + cellHeight / 2)
  }, [snake, food])

  const isValidDirectionChange = (currentDirection: string, newDirection: string): boolean => {
    const invalidMoves: Record<string, string> = {
      [DIRECTIONS.UP]: DIRECTIONS.DOWN,
      [DIRECTIONS.DOWN]: DIRECTIONS.UP,
      [DIRECTIONS.LEFT]: DIRECTIONS.RIGHT,
      [DIRECTIONS.RIGHT]: DIRECTIONS.LEFT,
    }

    return newDirection !== invalidMoves[currentDirection]
  }

  const gameLoop = useCallback(() => {
    if (gameOver || isPaused) return

    const currentDirection = directionRef.current
    let nextDirection = currentDirection

    if (directionQueueRef.current.length > 0) {
      const potentialNextDirection = directionQueueRef.current[0]
      if (
        potentialNextDirection &&
        isValidDirectionChange(currentDirection, potentialNextDirection)
      ) {
        nextDirection = potentialNextDirection
        directionQueueRef.current.shift()
      } else {
        directionQueueRef.current = []
      }
    }

    directionRef.current = nextDirection

    setSnake((prevSnake) => {
      const newSnake = [...prevSnake]
      const headSegment = newSnake[0]
      if (!headSegment) return prevSnake

      const head: Position = { ...headSegment }

      switch (nextDirection) {
        case DIRECTIONS.UP:
          head.y = (head.y - 1 + SNAKE_CONFIG.GRID_SIZE) % SNAKE_CONFIG.GRID_SIZE
          break
        case DIRECTIONS.DOWN:
          head.y = (head.y + 1) % SNAKE_CONFIG.GRID_SIZE
          break
        case DIRECTIONS.LEFT:
          head.x = (head.x - 1 + SNAKE_CONFIG.GRID_SIZE) % SNAKE_CONFIG.GRID_SIZE
          break
        case DIRECTIONS.RIGHT:
          head.x = (head.x + 1) % SNAKE_CONFIG.GRID_SIZE
          break
      }

      if (newSnake.slice(1).some((segment) => segment.x === head.x && segment.y === head.y)) {
        setGameOver(true)
        return prevSnake
      }

      newSnake.unshift(head)

      const currentFood = food
      if (head.x === currentFood.x && head.y === currentFood.y) {
        setScore((s) => s + SNAKE_CONFIG.SCORE_PER_FOOD)
        generateFood()
      } else {
        newSnake.pop()
      }

      return newSnake
    })
  }, [gameOver, isPaused, generateFood, food])

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase()

      if (key === KEYS.ESCAPE) {
        onClose()
        return
      } else if (key === KEYS.ENTER && gameOver) {
        resetGame()
        return
      } else if (key === KEYS.P) {
        setIsPaused((prev) => !prev)
        return
      }

      const newDirection = DIRECTION_KEYS[key]
      if (!newDirection) return

      const currentDirection = directionRef.current
      const queueIsEmpty = directionQueueRef.current.length === 0
      const lastQueuedDirection = queueIsEmpty
        ? currentDirection
        : directionQueueRef.current[directionQueueRef.current.length - 1]

      if (lastQueuedDirection && isValidDirectionChange(lastQueuedDirection, newDirection)) {
        directionQueueRef.current.push(newDirection)
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [gameOver, onClose, resetGame])

  useEffect(() => {
    draw()
    gameLoopRef.current = window.setInterval(gameLoop, SNAKE_CONFIG.GAME_SPEED)

    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current)
      }
    }
  }, [draw, gameLoop])

  return (
    <div className='w-full max-w-md mx-auto p-4  bg-gray-800/20 rounded-lg flex flex-col'>
      <div className='flex justify-between items-center mb-1'>
        <h2
          className={`text-${SNAKE_CONFIG.COLORS.TEXT} text-sm font-semibold drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]`}
        >
          SNAKE
        </h2>
        <div className={`text-${SNAKE_CONFIG.COLORS.TEXT} font-semibold text-sm`}>
          SCORE: {score}
        </div>
        <button
          onClick={onClose}
          className={`text-xs bg-transparent border font-semibold border-${SNAKE_CONFIG.COLORS.BORDER}/50 text-${SNAKE_CONFIG.COLORS.TEXT} px-2 py-1 rounded transition-all hover:bg-${SNAKE_CONFIG.COLORS.BUTTON}/10`}
        >
          [ESC] QUIT
        </button>
      </div>

      <div className='relative flex-1 flex items-center justify-center my-1'>
        <div className='relative'>
          <canvas
            ref={canvasRef}
            width={SNAKE_CONFIG.CANVAS.WIDTH}
            height={SNAKE_CONFIG.CANVAS.HEIGHT}
            className={`border-2 border-${SNAKE_CONFIG.COLORS.BORDER} rounded-lg`}
            style={{
              width: SNAKE_CONFIG.CANVAS.DISPLAY_WIDTH,
              height: SNAKE_CONFIG.CANVAS.DISPLAY_HEIGHT,
            }}
          />

          {gameOver && (
            <div className='absolute inset-0 bg-transparent grid place-items-center rounded-lg'>
              <div
                className={`bg-black p-2 border-2 border-${SNAKE_CONFIG.COLORS.BUTTON} rounded-lg text-center`}
              >
                <h3 className={`text-${SNAKE_CONFIG.COLORS.TEXT} font-semibold mb-1`}>
                  GAME OVER!
                </h3>
                <p className={`text-${SNAKE_CONFIG.COLORS.TEXT} font-semibold mb-2`}>
                  SCORE: {score}
                </p>
                <button
                  onClick={resetGame}
                  className={`bg-black border border-${SNAKE_CONFIG.COLORS.BUTTON}/50 text-${SNAKE_CONFIG.COLORS.BUTTON} px-6 py-1 rounded transition-all hover:bg-white/20 text-sm`}
                >
                  [ENTER] PLAY AGAIN
                </button>
              </div>
            </div>
          )}

          {isPaused && !gameOver && (
            <div className='absolute inset-0 grid place-items-center rounded-lg'>
              <div
                className={`bg-transparent p-2 border-2 border-${SNAKE_CONFIG.COLORS.TEXT} rounded-lg text-center`}
              >
                <h3 className={`text-${SNAKE_CONFIG.COLORS.TEXT} font-semibold mb-1`}>PAUSED</h3>
                <button
                  onClick={() => setIsPaused(false)}
                  className={`bg-${SNAKE_CONFIG.COLORS.BUTTON}/20 border border-${SNAKE_CONFIG.COLORS.BUTTON}/50 text-${SNAKE_CONFIG.COLORS.BUTTON} px-6 py-1 rounded transition-all hover:bg-white/20 text-sm`}
                >
                  [P] RESUME
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div
        className={`text-${SNAKE_CONFIG.COLORS.TEXT} font-semibold text-xs text-center leading-snug mt-1`}
      >
        <p>WASD/ARROWS - Move • P - Pause • ESC - Quit</p>
      </div>
    </div>
  )
}

export default SnakeGame
