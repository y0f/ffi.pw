import { useState, useEffect, useRef, type FC } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaMusic, FaCompactDisc, FaPlay, FaPause, FaLock } from 'react-icons/fa'
import { useTheme } from '../../hooks/useTheme'
import { useMenuManager } from '../../hooks/useMenuManager'
import clsx from 'clsx'

interface SongOption {
  name: string
  value: string
  path: string
  available: boolean
}

const MusicPlayer: FC = () => {
  const { isDarkMode } = useTheme()
  const [isPlaying, setIsPlaying] = useState(false)
  const [rotation, setRotation] = useState(0)
  const [currentSong, setCurrentSong] = useState('piano-intro')
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const VOLUME_LEVEL = 0.05

  const { isOpen: isMenuOpen, toggleMenu, closeMenu } = useMenuManager('music-player-menu')

  const songOptions: SongOption[] = [
    { name: 'Piano Intro', value: 'piano-intro', path: '/music/piano.mp3', available: true },
    { name: 'Lofi Beats', value: 'lofi-beats', path: '/music/lofi-beats.mp3', available: false },
    { name: 'Jazz Vibes', value: 'jazz-vibes', path: '/music/jazz-vibes.mp3', available: false },
    { name: 'Study Focus', value: 'study-focus', path: '/music/study-focus.mp3', available: false },
    {
      name: 'Ambient Space',
      value: 'ambient-space',
      path: '/music/ambient-space.mp3',
      available: false,
    },
  ]

  const initAudio = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio('/music/piano.mp3')
      audioRef.current.loop = true
      audioRef.current.volume = VOLUME_LEVEL
      audioRef.current.preload = 'none'
    }
  }

  useEffect(() => {
    return () => {
      audioRef.current?.pause()
      audioRef.current = null
    }
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: globalThis.MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        closeMenu()
      }
    }

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isMenuOpen, closeMenu])

  const toggleMusic = () => {
    initAudio()
    if (isPlaying) {
      audioRef.current?.pause()
    } else {
      audioRef.current?.play().catch((e) => console.error('Audio playback failed:', e))
    }
    setIsPlaying(!isPlaying)
  }

  const handleButtonClick = () => {
    setRotation((prev) => prev + 360)
    toggleMenu()
  }

  const handleSongSelect = (songValue: string, isAvailable: boolean) => {
    if (!isAvailable) return

    setCurrentSong(songValue)
  }

  const buttonClass = clsx(
    'cursor-pointer relative flex items-center justify-center w-9 h-9 border rounded-md focus:outline-none transition-all duration-300',
    isDarkMode
      ? 'bg-gray-950 hover:bg-black text-white border-neutral-200/30'
      : 'bg-black/10 hover:bg-white/20 text-gray-800 border-gray-800/30',
  )

  const iconClass = clsx(
    'h-full w-full transition-colors duration-300',
    isPlaying &&
      (isDarkMode
        ? 'drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]'
        : 'drop-shadow-[0_0_6px_rgba(0,0,0,0.2)]'),
    isDarkMode ? 'text-white' : 'text-gray-800 ',
  )

  const dropdownClass = clsx(
    'absolute right-0 mt-5 rounded-lg shadow-lg z-50 min-w-max overflow-hidden border translate-x-21',
    isDarkMode
      ? 'border-neutral-200/20 bg-gray-950 bg-linear-to-br from-gray-900/50 to-gray-900/30'
      : 'border-gray-400 bg-gray-200 bg-linear-to-br from-white/40 via-primary-400/10 to-gray-50/10',
  )

  const optionClass = (isSelected: boolean, isAvailable: boolean) =>
    clsx(
      'flex items-center justify-between px-3 py-1.5 rounded-md transition-all duration-200',
      isAvailable ? 'cursor-pointer' : 'cursor-not-allowed opacity-60',
      isSelected
        ? isDarkMode
          ? 'bg-primary-600/20 border rounded-md border-neutral-200/10'
          : 'bg-primary-300/50 border rounded-md border-gray-800/20'
        : isDarkMode
          ? isAvailable
            ? 'hover:bg-gray-800/30 border rounded-md border-neutral-200/10'
            : 'border rounded-md border-neutral-200/10'
          : isAvailable
            ? 'hover:bg-gray-100/50 border rounded-md border-gray-800/20'
            : 'border rounded-md border-gray-800/20',
    )

  const textClass = clsx(
    'fira-thin text-xs flex-1 pr-2',
    isDarkMode ? 'text-gray-200' : 'text-gray-600',
  )

  const playButtonClass = clsx(
    'w-full text-xs py-1.5 px-2 rounded flex items-center justify-center space-x-1 fira-thin cursor-pointer',
    isDarkMode
      ? 'bg-gray-800/70 hover:bg-gray-800 text-gray-200 border border-neutral-200/10'
      : 'bg-gray-100/80 hover:bg-gray-100 text-gray-600 border border-gray-800/20',
  )

  const iconVariants = {
    initial: { rotate: 0, scale: 1 },
    playing: {
      rotate: 360,
      transition: { repeat: Infinity, duration: 4, ease: 'linear' as const },
    },
  }

  return (
    <div className='relative' ref={menuRef}>
      <button onClick={handleButtonClick} aria-label='Open music player' className={buttonClass}>
        <motion.div
          animate={{ rotate: rotation }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 15,
            velocity: 50,
          }}
          className='relative z-20 h-4 w-4'
        >
          <motion.div animate={isPlaying ? 'playing' : 'initial'} variants={iconVariants}>
            {isPlaying ? (
              <FaCompactDisc className={iconClass} />
            ) : (
              <FaMusic className={iconClass} />
            )}
          </motion.div>
        </motion.div>
        <motion.div className='absolute inset-0 rounded-full opacity-0 hover:opacity-100 transition-opacity' />
      </button>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: 'spring', stiffness: 500, damping: 25 }}
            style={{ transformOrigin: 'top right' }}
            className={dropdownClass}
          >
            <div className='p-2 flex flex-col gap-1.5'>
              {songOptions.map((option) => (
                <motion.button
                  key={option.value}
                  whileHover={option.available ? { scale: 1.03 } : {}}
                  whileTap={option.available ? { scale: 0.97 } : {}}
                  onClick={() => handleSongSelect(option.value, option.available)}
                  className={optionClass(currentSong === option.value, option.available)}
                  aria-label={`Select ${option.name}`}
                  disabled={!option.available}
                >
                  <div className='flex items-center space-x-3'>
                    <div
                      className={clsx(
                        'w-3 h-3 flex items-center justify-center rounded-full',
                        currentSong === option.value && 'ring-1 ring-offset-1',
                        isDarkMode
                          ? 'ring-white ring-offset-gray-900'
                          : 'ring-gray-600 ring-offset-white',
                      )}
                    >
                      <FaMusic className='w-2 h-2' />
                    </div>
                    <span className={textClass}>{option.name}</span>
                  </div>

                  {!option.available && (
                    <FaLock
                      className={clsx(
                        'w-2.5 h-2.5',
                        isDarkMode ? 'text-gray-500' : 'text-gray-400',
                      )}
                    />
                  )}
                </motion.button>
              ))}
            </div>
            <div
              className={clsx(
                'px-2 py-1.5 border-t',
                isDarkMode ? 'border-neutral-200/20' : 'border-gray-300/30',
              )}
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={toggleMusic}
                className={playButtonClass}
              >
                {isPlaying ? (
                  <>
                    <FaPause className='w-2.5 h-2.5 mr-1' />
                    <span>Pause</span>
                  </>
                ) : (
                  <>
                    <FaPlay className='w-2.5 h-2.5 mr-1' />
                    <span>Play</span>
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default MusicPlayer
