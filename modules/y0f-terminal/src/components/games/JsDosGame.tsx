import { useEffect, useRef, useState, type FC, type CSSProperties } from 'react'
import clsx from 'clsx'

interface Control {
  key: string
  description: string
}

interface DosboxConfig {
  cycles?: string | number
  frameskip?: number
  core?: string
  memsize?: number
  blocksize?: number
  prebuffer?: number
  rate?: number
  nosound?: boolean
}

interface JsDosGameProps {
  onClose: () => void
  isDarkMode: boolean
  gamePath: string
  executable: string | string[]
  gameName: string
  controls?: Control[]
  titleColor?: string
  dosboxConfig?: DosboxConfig
  canvasClassName?: string
}

declare global {
  var Dos: (
    canvas: HTMLCanvasElement,
    config: { wdosboxUrl: string },
  ) => {
    ready: (
      callback: (
        fs: { extract: (path: string) => Promise<void> },
        main: (args: string[]) => Promise<unknown>,
      ) => void,
    ) => void
  }
}

const JsDosGame: FC<JsDosGameProps> = ({
  onClose,
  isDarkMode,
  gamePath,
  executable,
  canvasClassName = 'w-full h-full',
  gameName,
  controls,
  titleColor,
  dosboxConfig = {},
}) => {
  const dosRef = useRef<HTMLCanvasElement>(null)
  const ciRef = useRef<ReturnType<typeof Dos> | null>(null)
  const commandInterfaceRef = useRef<unknown | null>(null)
  const originalTitleRef = useRef(document.title)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!dosRef.current) return

    const canvas = dosRef.current
    canvas.style.transform = 'translateZ(0)'

    const initDosGame = () => {
      try {
        if (typeof Dos === 'undefined') {
          setError('js-dos library not loaded. Refresh the page.')
          setLoading(false)
          return
        }

        const defaultConfig: Required<DosboxConfig> = {
          cycles: 'max',
          frameskip: 0,
          core: 'dynamic',
          memsize: 16,
          blocksize: 2048,
          prebuffer: 40,
          rate: 22050,
          nosound: false,
        }

        const finalConfig = { ...defaultConfig, ...dosboxConfig }

        const ci = Dos(dosRef.current!, {
          wdosboxUrl: 'https://js-dos.com/6.22/current/wdosbox.js',
        })

        ciRef.current = ci

        ci.ready((fs, main) => {
          fs.extract(gamePath)
            .then(() => {
              const executableCommands = Array.isArray(executable)
                ? executable.flatMap((cmd) => ['-c', cmd])
                : ['-c', executable]

              const dosboxArgs = [
                `-set "cycles=${finalConfig.cycles}"`,
                `-set "frameskip=${finalConfig.frameskip}"`,
                `-set "core=${finalConfig.core}"`,
                `-set "memsize=${finalConfig.memsize}"`,
                `-set "blocksize=${finalConfig.blocksize}"`,
                `-set "prebuffer=${finalConfig.prebuffer}"`,
                `-set "rate=${finalConfig.rate}"`,
                `-set "mixer=nosound:off"`,
                `-set "sb16=oplmode:auto"`,
                `-set "sbtype=sb16"`,
                `-set "gus=false"`,
                `-set "pcspeaker=false"`,
                `-set "tandy=off"`,
                `-set "disney=false"`,
                `-set "aspect=false"`,
                ...executableCommands,
              ]
              return main(dosboxArgs)
            })
            .then((commandInterface) => {
              commandInterfaceRef.current = commandInterface
              setLoading(false)
            })
            .catch((err: Error) => {
              setError(`Load error: ${err.message || 'Unknown error'}`)
              setLoading(false)
            })
        })
      } catch (err) {
        const error = err as Error
        setError(`Init error: ${error.message || 'Unknown error'}`)
        setLoading(false)
      }
    }

    const timeout = setTimeout(() => {
      initDosGame()
    }, 500)

    return () => {
      clearTimeout(timeout)
    }
  }, [gamePath, executable, gameName])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        e.stopPropagation()

        document.title = originalTitleRef.current

        window.location.reload()
      }
    }

    window.addEventListener('keydown', handleKeyDown, { capture: true })
    return () => window.removeEventListener('keydown', handleKeyDown, { capture: true })
  }, [onClose, gameName])

  if (error) {
    setTimeout(() => onClose(), 100)
    return null
  }

  const controlsClasses = clsx(
    'absolute bottom-0 left-0 right-0 text-sm px-6 py-3 backdrop-blur-sm border-t',
    isDarkMode
      ? 'bg-black/80 border-gray-700 text-white'
      : 'bg-white/80 border-gray-300 text-gray-900',
  )

  const defaultTitleColor = isDarkMode ? 'text-red-500' : 'text-red-600'

  const loadingBgClasses = clsx('w-full h-full relative', isDarkMode ? 'bg-black' : 'bg-gray-100')

  const loadingTextClasses = clsx(
    'text-3xl font-bold animate-pulse',
    isDarkMode ? 'text-white' : 'text-gray-900',
  )

  const canvasStyle: CSSProperties = {
    display: loading ? 'none' : 'block',
    imageRendering: 'crisp-edges',
    WebkitFontSmoothing: 'none',
    willChange: 'contents',
  }

  return (
    <div className={loadingBgClasses}>
      {loading && (
        <div className='absolute inset-0 flex items-center justify-center'>
          <div className={loadingTextClasses}>Loading {gameName}...</div>
        </div>
      )}
      <canvas ref={dosRef} className={canvasClassName} style={canvasStyle} />
      {!loading && controls && (
        <div className={controlsClasses}>
          <div className='flex items-center justify-between gap-6 max-w-4xl mx-auto'>
            <div className={clsx('font-bold text-sm', titleColor || defaultTitleColor)}>
              {gameName} Controls
            </div>
            <div className='flex items-center gap-6 text-xs'>
              {controls.map((control, index) => (
                <span
                  key={index}
                  className={
                    index === controls.length - 1
                      ? clsx('pl-6 border-l', isDarkMode ? 'border-gray-700' : 'border-gray-300')
                      : ''
                  }
                >
                  {control.key} {control.description}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default JsDosGame
