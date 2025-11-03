import { Link, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import type { FC, CSSProperties } from 'react'
import { useTheme } from '../../hooks/useTheme'
import clsx from 'clsx'

interface NavItem {
  path: string
  label: string
  kanji: string
}

const backdropStyle: CSSProperties = {
  backdropFilter: 'blur(4px)',
  WebkitBackdropFilter: 'blur(4px)',
}

const MobileNavigation: FC = () => {
  const location = useLocation()
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const { isDarkMode } = useTheme()

  const isActive = (path: string): boolean => {
    return path === '/' ? location.pathname === '/' : location.pathname.startsWith(path)
  }

  const navItems: NavItem[] = [
    { path: '/', label: 'HOME', kanji: '家' },
    { path: '/services', label: 'SERVICES', kanji: '仕' },
    { path: '/contact', label: 'CONTACT', kanji: '話' },
  ]

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [isOpen])

  const toggleMenu = (): void => {
    setIsOpen(!isOpen)
  }

  const closeMenu = (): void => {
    setIsOpen(false)
  }

  return (
    <div className='md:hidden'>
      {/* Menu button - Sleek Tokyo style */}
      <button
        onClick={toggleMenu}
        className='relative flex justify-center items-center z-50 p-2'
        aria-label='Toggle menu'
      >
        <div className='relative w-7 h-7 flex flex-col items-center justify-center'>
          <span
            className={clsx(
              'absolute h-0.5 w-6 rounded-full transition-all duration-300',
              isDarkMode ? 'bg-white' : 'bg-gray-900',
              isOpen && 'bg-primary-500 rotate-45 translate-y-0',
              !isOpen && 'rotate-0 -translate-y-1.5',
            )}
            style={{ transitionTimingFunction: 'cubic-bezier(0.87, 0, 0.13, 1)' }}
          />
          <span
            className={clsx(
              'absolute h-0.5 w-6 rounded-full transition-all duration-200',
              isDarkMode ? 'bg-white' : 'bg-gray-900',
              isOpen && 'opacity-0',
              !isOpen && 'opacity-100',
            )}
          />
          <span
            className={clsx(
              'absolute h-0.5 w-6 rounded-full transition-all duration-300',
              isDarkMode ? 'bg-white' : 'bg-gray-900',
              isOpen && 'bg-primary-500 -rotate-45 translate-y-0',
              !isOpen && 'rotate-0 translate-y-1.5',
            )}
            style={{ transitionTimingFunction: 'cubic-bezier(0.87, 0, 0.13, 1)' }}
          />
        </div>
      </button>

      {/* Backdrop overlay with Tokyo night effect */}
      {isOpen && (
        <div
          className={clsx(
            'fixed inset-0 z-40 transition-opacity duration-200',
            isDarkMode ? 'bg-black/60' : 'bg-black/40',
            isOpen ? 'opacity-100' : 'opacity-0',
          )}
          style={backdropStyle}
          onClick={closeMenu}
        />
      )}

      {/* Menu panel - Tokyo cyberpunk aesthetic */}
      <div
        className={clsx(
          'fixed top-0 right-0 h-full w-72 z-50 shadow-2xl overflow-hidden transition-transform duration-250 ease-out',
          isDarkMode
            ? 'bg-linear-to-b from-gray-950 via-gray-900 to-black'
            : 'bg-linear-to-b from-white via-gray-50 to-gray-100',
          isOpen ? 'translate-x-0' : 'translate-x-full',
        )}
      >
        {/* Accent border with glow */}
        <div className='absolute top-0 left-0 w-1 h-full bg-linear-to-b from-primary-500 via-primary-400 to-primary-600 shadow-lg shadow-primary-500/50' />

        <div className='relative h-full flex flex-col pt-20 px-6'>
          {/* Logo with kanji */}
          <div
            className={clsx(
              'mb-12 transition-all duration-400 delay-100',
              isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-5',
            )}
          >
            <Link to='/' onClick={closeMenu} className='block'>
              <div className='flex items-center gap-3'>
                <span
                  className={clsx(
                    'text-3xl fira font-bold tracking-wider',
                    isDarkMode ? 'text-white' : 'text-gray-900',
                  )}
                >
                  FFI
                </span>
                <div className='h-8 w-px bg-primary-500' />
                <span className='text-2xl text-primary-500'>界</span>
              </div>
              <div
                className={clsx(
                  'text-xs fira-thin mt-1 tracking-widest',
                  isDarkMode ? 'text-gray-500' : 'text-gray-600',
                )}
              >
                DIGITAL FRONTIER
              </div>
            </Link>
          </div>

          {/* Navigation links with Tokyo aesthetic */}
          <nav className='flex-1 flex flex-col gap-2'>
            {navItems.map((item, idx) => {
              const active = isActive(item.path)
              return (
                <div
                  key={item.path}
                  className={clsx(
                    'transition-all duration-400',
                    isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-5',
                  )}
                  style={{ transitionDelay: `${150 + idx * 50}ms` }}
                >
                  <Link to={item.path} onClick={closeMenu} className='block group'>
                    <div
                      className={clsx(
                        'relative px-4 py-4 rounded-lg transition-all duration-300',
                        active
                          ? 'bg-primary-500/10'
                          : isDarkMode
                            ? 'hover:bg-white/5'
                            : 'hover:bg-gray-900/5',
                      )}
                    >
                      {/* Active indicator */}
                      {active && (
                        <div className='absolute left-0 top-1/2 -translate-y-1/2 w-1 h-10 bg-primary-500 rounded-r-full transition-all duration-300' />
                      )}

                      <div className='flex items-center justify-between'>
                        <div className='flex items-center gap-3'>
                          <span
                            className={clsx(
                              'text-2xl transition-all duration-300',
                              active
                                ? 'text-primary-500 scale-110'
                                : isDarkMode
                                  ? 'text-gray-600 group-hover:text-primary-400'
                                  : 'text-gray-400 group-hover:text-primary-500',
                            )}
                          >
                            {item.kanji}
                          </span>
                          <div>
                            <div
                              className={clsx(
                                'text-sm fira font-medium tracking-wider transition-all duration-300',
                                active
                                  ? 'text-primary-500'
                                  : isDarkMode
                                    ? 'text-gray-300 group-hover:text-white'
                                    : 'text-gray-700 group-hover:text-gray-900',
                              )}
                            >
                              {item.label}
                            </div>
                            <div
                              className={clsx(
                                'h-px w-0 group-hover:w-full transition-all duration-300',
                                active ? 'w-full bg-primary-500' : 'bg-primary-400',
                              )}
                            />
                          </div>
                        </div>

                        {/* Arrow indicator */}
                        <span
                          className={clsx(
                            'text-xs transition-all duration-300 opacity-0 group-hover:opacity-100',
                            active
                              ? 'text-primary-500 opacity-100'
                              : isDarkMode
                                ? 'text-gray-500'
                                : 'text-gray-400',
                          )}
                          style={{ transform: active ? 'translateX(0)' : 'translateX(-5px)' }}
                        >
                          →
                        </span>
                      </div>
                    </div>
                  </Link>
                </div>
              )
            })}
          </nav>

          {/* Footer accent */}
          <div
            className={clsx(
              'pb-8 pt-4 transition-opacity duration-300 delay-400',
              isOpen ? 'opacity-100' : 'opacity-0',
            )}
          >
            <div
              className={clsx(
                'h-px w-full mb-4',
                isDarkMode
                  ? 'bg-linear-to-r from-transparent via-primary-500/30 to-transparent'
                  : 'bg-linear-to-r from-transparent via-primary-400/30 to-transparent',
              )}
            />
            <div
              className={clsx(
                'text-center text-xs fira-thin tracking-widest',
                isDarkMode ? 'text-gray-600' : 'text-gray-500',
              )}
            >
              FFI.PW · 2025
            </div>
          </div>
        </div>

        {/* Floating accent orbs (reduced blur for performance) */}
        <div className='absolute top-20 right-8 w-32 h-32 bg-primary-500/10 rounded-full blur-xl' />
        <div className='absolute bottom-40 left-8 w-24 h-24 bg-primary-400/10 rounded-full blur-lg' />
      </div>
    </div>
  )
}

export default MobileNavigation
