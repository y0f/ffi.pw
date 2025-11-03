import type { FC } from 'react'
import { Link, useLocation } from 'react-router-dom'
import MobileNavigation from './MobileNavbar.tsx'
import ToggleMusic from '../ui/ToggleMusic.tsx'
import TogglePetals from '../ui/TogglePetals.tsx'
import ToggleColors from '../ui/ToggleColors.tsx'
import ToggleTheme from '../ui/ToggleTheme.tsx'
import ToggleSmoke from '../ui/ToggleSmoke.tsx'
import NavLink from './NavLink.tsx'
import Logo from '../ui/Logo.tsx'
import { useTheme } from '../../hooks/useTheme'
import useIsMobile from '../../hooks/useIsMobile'
import clsx from 'clsx'

interface NavItem {
  path: string
  label: string
}

interface NavbarProps {
  isSmokingActive?: boolean
  onSmokingToggle: (isActive: boolean) => void
  owlVisible?: boolean
}

const Navbar: FC<NavbarProps> = ({
  isSmokingActive = false,
  onSmokingToggle,
  owlVisible = false,
}) => {
  const location = useLocation()
  const { isDarkMode } = useTheme()
  const isMobile = useIsMobile()

  const isActive = (path: string): boolean => {
    return path === '/' ? location.pathname === '/' : location.pathname.startsWith(path)
  }

  const navItems: NavItem[] = [
    { path: '/', label: '/HOME' },
    { path: '/services', label: '/SERVICES' },
    { path: '/contact', label: '/CONTACT' },
  ]

  const styles = {
    navbar: clsx('w-full z-50 duration-300', isDarkMode ? 'text-white' : 'text-gray-800'),
    topBar: clsx(
      'flex items-center justify-between py-2 border-b',
      isDarkMode ? 'border-neutral-200/20' : 'border-gray-800/30',
    ),
    logo: clsx(
      'text-xl md:text-2xl fira transition-colors flex items-center group',
      isDarkMode ? 'text-white' : 'text-gray-800',
    ),
    logoText: clsx(
      'transition-all',
      isDarkMode
        ? '[text-shadow:_0_0_10px_rgba(255,255,255,0.9)] group-hover:[text-shadow:_0_0_15px_rgba(255,255,255,0.9)]'
        : '[text-shadow:_0_0_10px_rgba(0,0,0,0.2)] group-hover:[text-shadow:_0_0_15px_rgba(0,0,0,0.5)]',
    ),
    linkBase: clsx(
      'fira text-sm px-4 py-2 relative transition-all duration-200 z-10',
      isDarkMode ? 'text-white' : 'text-gray-800',
    ),
  }

  return (
    <nav className={styles.navbar}>
      <div className='max-w-[1800px] mx-auto px-4 md:px-6'>
        <div className={styles.topBar}>
          <Link to='/' className={styles.logo} aria-label='Home'>
            <Logo className='h-8 w-10 md:h-10 md:w-10 transition-all group-hover:scale-105' />
            <span className='ml-2 h-4 w-2 animate-pulse'></span>
          </Link>

          <div className='flex items-center gap-1.5'>
            {!isMobile ? (
              <>
                <TogglePetals />
                <ToggleMusic />
                <ToggleColors />
                {owlVisible && (
                  <ToggleSmoke isActive={isSmokingActive} onToggle={onSmokingToggle} />
                )}
                <ToggleTheme />
              </>
            ) : (
              <MobileNavigation />
            )}
          </div>
        </div>

        <div className='hidden md:flex space-x-1 pt-1 pb-3'>
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              path={item.path}
              label={item.label}
              isActive={isActive(item.path)}
              isDarkMode={isDarkMode}
              linkBaseClass={styles.linkBase}
            />
          ))}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
