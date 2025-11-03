import type { FC } from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../navigation/Navbar.tsx'
import Background from '../background/Index.tsx'
import Footer from './Footer.tsx'
import { lazy, Suspense } from 'react'
import { useTheme } from '../../hooks/useTheme'
import { useOwl } from '../../hooks/useOwl'
import { combineThemePatterns, themePatterns } from '../../utils/themeClasses'

const Layout: FC = () => {
  const { isDarkMode } = useTheme()
  const { owlVisible, owlIsSmoking, setOwlIsSmoking } = useOwl()
  const isProduction = !['localhost', '127.0.0.1'].includes(window.location.hostname)

  const CookieConsentBanner = lazy(() =>
    isProduction
      ? import('./CookieConsentBanner.tsx').catch(() => ({ default: () => null }))
      : Promise.resolve({ default: () => null }),
  )

  const containerClass = combineThemePatterns(
    isDarkMode,
    'sm:min-h-screen transition-colors duration-300',
    themePatterns.container.main,
  )

  return (
    <div className={containerClass}>
      <Navbar
        isSmokingActive={owlIsSmoking}
        onSmokingToggle={setOwlIsSmoking}
        owlVisible={owlVisible}
      />
      <Background />
      <div>
        <Outlet />
        {isProduction && (
          <Suspense fallback={null}>
            <CookieConsentBanner />
          </Suspense>
        )}
      </div>
      <Footer isSmoking={owlIsSmoking} owlVisible={owlVisible} />
    </div>
  )
}

export default Layout
