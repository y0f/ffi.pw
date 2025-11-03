import { useRef, useEffect, useMemo, memo, type CSSProperties, type MouseEvent } from 'react'
import { Link } from 'react-router-dom'
import { MdClose, MdCropSquare, MdFilterNone } from 'react-icons/md'
import { useTheme } from '../../hooks/useTheme'
import clsx from 'clsx'

interface ServiceItem {
  title: string
  description?: string
  price?: string
}

interface ServiceCardProps {
  title?: string
  items?: ServiceItem[]
  rotation?: number
  onClose?: () => void
  onMaximize?: () => void
  isMaximized?: boolean
  zIndex?: number
  serviceSlug?: string
  description?: string
  features?: string[]
  technologies?: string[]
  isAvailable?: boolean
}

const StatusDot = memo<{ isAvailable?: boolean }>(({ isAvailable }) => (
  <span
    className={clsx(
      'inline-block ml-2 pb-0.5 rounded-full w-2 h-2  border border-primary-500 border-rounded ',
      isAvailable ? 'bg-primary-600' : 'bg-primary-300/40',
    )}
    aria-label={isAvailable ? 'Service available' : 'Service unavailable'}
  />
))

StatusDot.displayName = 'StatusDot'

// Memoize grid pattern styles to prevent recalculation
const getGridPattern = (isDarkMode: boolean): CSSProperties => ({
  backgroundImage: `linear-gradient(${isDarkMode ? '#ffffff' : '#000000'} 1px, transparent 1px), linear-gradient(90deg, ${isDarkMode ? '#ffffff' : '#000000'} 1px, transparent 1px)`,
  backgroundSize: '20px 20px',
})

const ServiceCard = memo<ServiceCardProps>(function ServiceCard({
  title = '',
  items = [],
  rotation = 0,
  onClose = () => {},
  onMaximize = () => {},
  isMaximized = false,
  zIndex = 1,
  serviceSlug = '',
  description = '',
  features = [],
  technologies = [],
  isAvailable = false,
}) {
  const terminalRef = useRef<HTMLDivElement>(null)
  const { isDarkMode } = useTheme()

  // Memoize grid pattern style
  const gridPatternStyle = useMemo(() => getGridPattern(isDarkMode), [isDarkMode])

  useEffect(() => {
    if (!isMaximized) return

    const handleClickOutside = (event: globalThis.MouseEvent) => {
      if (terminalRef.current && !terminalRef.current.contains(event.target as Node)) {
        onMaximize()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isMaximized, onMaximize])

  const handleFocus = () => {
    if (terminalRef.current && !isMaximized) {
      terminalRef.current.style.zIndex = String(zIndex + 100)
    }
  }

  return (
    <div
      ref={terminalRef}
      className={clsx(
        'group relative rounded-xl overflow-hidden border shadow-lg transition-all duration-300 ease-in-out flex flex-col',
        isDarkMode
          ? 'text-gray-200 border-neutral-200/20  shadow-gray-950 bg-linear-to-br from-gray-900/10 via-primary-600/5 to-gray-950/10'
          : 'text-gray-800 border-gray-800/30  shadow-sm bg-linear-to-br from-gray-100 via-primary-100/30 to-gray-200/30',
        isMaximized
          ? 'pb-12 md:pb-2 fixed inset-0 m-auto mb-12 w-[95vw] h-[90vh] md:w-[90vw] md:h-[85vh] lg:w-[85vw] lg:h-[80vh] z-70'
          : 'hover:shadow-xl hover:-translate-y-2 w-full h-full',
      )}
      style={{
        transform: isMaximized ? 'none' : `rotate(${rotation}deg)`,
        zIndex: isMaximized ? 100 : zIndex,
      }}
      onClick={handleFocus}
    >
      {/* Grid pattern - optimized with memoized style */}
      <div
        className={clsx(
          'absolute inset-0 opacity-5 bg-size[20px_20px] z-0',
          isDarkMode
            ? 'bg-[radial-gradient(circle_at_1px_1px,#fff_1px,transparent_0)]'
            : 'bg-[radial-gradient(circle_at_1px_1px,#000_1px,transparent_0)]',
        )}
        style={gridPatternStyle}
      />

      <div
        className={clsx(
          'service-card-header flex items-center justify-between px-3 py-2 border-b flex-none relative z-10',
          isDarkMode
            ? ' bg-gray-950/70 border-b  border-white/30'
            : ' bg-white/40 border-b border-gray-800/30 ',
        )}
      >
        <div
          className={clsx(
            'text-xs truncate mx-1.5 flex-1',
            isDarkMode
              ? 'text-white fira'
              : 'text-gray-800 text-shadow-2xs fira hover:text-primary-600',
          )}
        >
          {title}
          {!isMaximized && <StatusDot isAvailable={isAvailable} />}
        </div>
        <div className='flex items-center space-x-2'>
          <button
            onClick={(e: MouseEvent<HTMLButtonElement>) => {
              e.stopPropagation()
              onMaximize()
            }}
            className={clsx(
              'cursor-pointer focus:outline-none transition-colors duration-150',
              isDarkMode
                ? 'text-gray-400 hover:text-gray-200'
                : 'text-gray-800 text-shadow-2xs fira hover:text-primary-600 ',
            )}
            aria-label={isMaximized ? 'Restore' : 'Maximize'}
          >
            {isMaximized ? <MdFilterNone size={16} /> : <MdCropSquare size={16} />}
          </button>
          <button
            onClick={(e: MouseEvent<HTMLButtonElement>) => {
              e.stopPropagation()
              onClose()
            }}
            className={clsx(
              'cursor-pointer focus:outline-none transition-colors duration-150',
              isDarkMode
                ? 'text-gray-400 hover:text-gray-200'
                : 'text-gray-800 text-shadow-2xs fira0 hover:text-primary-600',
            )}
            aria-label='Close'
          >
            <MdClose size={16} />
          </button>
        </div>
      </div>

      <div className='p-4 fira text-sm flex-1 flex flex-col min-h-0 relative z-10'>
        <div
          className={clsx(
            'mb-0 pl-0.5 pt-1 pb-1 pr-1 text-sm/6 tracking-[.03em]',
            isDarkMode ? ' text-primary-400' : 'text-primary-600',
          )}
        >
          $ service list {title.toLowerCase()}
        </div>

        <div
          className={clsx(
            'flex-1 overflow-y-auto pr-1 scrollbar-thin hover:scrollbar-thumb-primary-400',
            isDarkMode
              ? 'scrollbar-thumb-gray-200 scrollbar-track-transparent'
              : 'scrollbar-thumb-gray-800 /20 scrollbar-track-transparent',
          )}
        >
          {isMaximized ? (
            <div className='space-y-6 p-2'>
              <div>
                <h2
                  className={clsx(
                    'mb-3 border-b pb-2 font-bold fira ',
                    isDarkMode ? 'border-gray-500' : 'border-gray-800/20',
                  )}
                >
                  SERVICES_OFFERED
                </h2>
                <ul className='list-none p-0 pr-1 m-0 space-y-3'>
                  {items.map((item, index) => (
                    <li
                      key={index}
                      className={clsx(
                        'p-3 rounded border animate-fade-in',
                        isDarkMode
                          ? 'bg-gray-900/40 border-gray-600'
                          : 'bg-white border-gray-800/20',
                      )}
                    >
                      <div className='flex justify-between items-start'>
                        <div>
                          <div
                            className={clsx(
                              'flex items-center',
                              isDarkMode ? 'text-gray-200' : 'text-gray-800 ',
                            )}
                          >
                            <span
                              className={clsx(
                                ' mr-2',
                                isDarkMode ? ' text-primary-400' : 'text-primary-600',
                              )}
                            >
                              +
                            </span>
                            <span className='font-medium fira'>{item.title}</span>
                          </div>
                          {item.description && (
                            <div
                              className={clsx(
                                'mt-2 text-xs leading-relaxed',
                                isDarkMode ? 'text-gray-200' : 'text-gray-800',
                              )}
                            >
                              {item.description}
                            </div>
                          )}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {description && (
                <div>
                  <h2
                    className={clsx(
                      'mb-3 border-b pb-2 font-bold fira ',
                      isDarkMode
                        ? 'border-gray-500 text-primary-400'
                        : 'border-gray-800/20 text-primary-600',
                    )}
                  >
                    DESCRIPTION
                  </h2>
                  <p
                    className={clsx(
                      'text-sm leading-relaxed',
                      isDarkMode ? 'text-gray-200' : 'text-gray-800',
                    )}
                  >
                    {description}
                  </p>
                </div>
              )}

              {features.length > 0 && (
                <div>
                  <h2
                    className={clsx(
                      'mb-3 border-b pb-2 font-bold fira ',
                      isDarkMode
                        ? 'border-gray-500 text-primary-400'
                        : 'border-gray-800/20 text-primary-600',
                    )}
                  >
                    KEY_FEATURES
                  </h2>
                  <ul
                    className={clsx(
                      'space-y-2 text-sm',
                      isDarkMode ? 'text-gray-200' : 'text-gray-800',
                    )}
                  >
                    {features.map((feature, index) => (
                      <li key={index} className='flex items-start'>
                        <span className='text-primary-400 mr-2'>▪</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {technologies.length > 0 && (
                <div>
                  <h2
                    className={clsx(
                      'mb-3 border-b pb-2 font-bold fira',
                      isDarkMode
                        ? 'border-gray-500 text-primary-400'
                        : 'border-gray-800/20 text-primary-600',
                    )}
                  >
                    TECHNOLOGIES
                  </h2>
                  <div className='flex flex-wrap gap-2 pb-1'>
                    {technologies.map((tech, index) => (
                      <span
                        key={index}
                        className={clsx(
                          'fira px-2 py-1 rounded border animate-fade-in text-xs transition-colors',
                          isDarkMode
                            ? 'bg-gray-900/40 border-gray-600 text-gray-200 hover:border-primary-400'
                            : 'bg-white border-gray-800/20 text-gray-800  hover:border-primary-400',
                        )}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <ul className='list-none m-0 pl-0.5 pt-3 pb-1 space-y-1'>
              {items.map((item, index) => (
                <Link key={`${serviceSlug}-${index}`} to={`/services/${serviceSlug}`}>
                  <li
                    className={clsx(
                      'py-1 rounded flex justify-between items-baseline text-sm cursor-pointer group pr-2 transition-colors',
                      isDarkMode
                        ? 'hover:bg-primary-400/10 text-gray-200'
                        : 'hover:bg-primary-400/10 text-gray-800 ',
                    )}
                  >
                    <span className='fira-thin flex items-center'>
                      <span
                        className={clsx(
                          'mr-2 text-lg transition-transform group-hover:translate-x-1',
                          isDarkMode ? ' text-primary-400' : 'text-primary-600',
                        )}
                      >
                        +
                      </span>
                      {item.title}
                    </span>
                  </li>
                </Link>
              ))}
            </ul>
          )}
        </div>
        {serviceSlug && (
          <div className='mt-4 pt-4'>
            <div className='absolute bottom-0 right-0 pb-0.5'>
              <Link
                to={`/services/${serviceSlug}`}
                className={clsx(
                  'px-5 py-1 text-xs transition-colors',
                  isDarkMode
                    ? 'fira bg-gray-950/70 text-primary-400 hover:text-primary-300 border-neutral-200/20 hover:bg-primary-400/30 border-l border-t rounded-tl-lg'
                    : 'fira bg-gray-200/70 text-primary-600 hover:text-primary-500 border-gray-800/30 hover:bg-primary-200 border-l border-t rounded-tl-lg',
                  isMaximized ? 'hidden' : '',
                )}
              >
                DETAILS
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
})

export default ServiceCard
