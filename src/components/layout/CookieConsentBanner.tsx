import type { FC } from 'react'
import CookieConsent from 'react-cookie-consent'
import { useTheme } from '../../hooks/useTheme'
import clsx from 'clsx'

const CookieConsentBanner: FC = () => {
  const { isDarkMode } = useTheme()

  const containerClasses = clsx(
    'fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-[90vw] max-w-md px-4',
    isDarkMode ? 'text-white' : 'text-gray-800',
  )

  const contentClasses = clsx('fira text-xs', isDarkMode ? 'text-white' : 'text-gray-800')

  const buttonClasses = clsx(
    'fira text-xs py-1.5 px-4 border focus:outline-none rounded-none min-w-[80px] transition-colors',
    isDarkMode
      ? 'border-white text-white hover:bg-white/10'
      : 'border-gray-800 text-gray-800 hover:bg-gray-800/10',
  )

  const declineButtonClasses = clsx(
    'fira text-xs py-1.5 px-4 border focus:outline-none rounded-none min-w-[80px] transition-colors',
    isDarkMode
      ? 'border-white/50 text-white/50 hover:border-white hover:text-white'
      : 'border-gray-500 text-gray-500 hover:border-gray-800 hover:text-gray-800',
  )

  const overlayClasses = clsx(
    'fixed inset-0 z-40 backdrop-blur-sm',
    isDarkMode ? 'bg-gray-950/80' : 'bg-white/80',
  )

  const boxClasses = clsx(
    'border p-4 shadow-[0_0_15px_rgba(0,0,0,0.1)]',
    isDarkMode
      ? 'border-white shadow-[0_0_15px_rgba(255,255,255,0.2)]'
      : 'border-gray-800 shadow-[0_0_15px_rgba(0,0,0,0.1)]',
  )

  const dividerClasses = clsx(
    'text-[0.65rem] fira border-t pt-2',
    isDarkMode ? 'border-white text-white' : 'border-gray-800 text-gray-800',
  )

  const symbolClasses = clsx('mr-2 mt-0.5', isDarkMode ? 'text-white' : 'text-gray-800')

  const handleAccept = (): void => {
    console.log('Cookies accepted')
  }

  const handleDecline = (): void => {
    console.log('Cookies declined')
  }

  return (
    <CookieConsent
      buttonText='ACCEPT'
      declineButtonText='DENY'
      enableDeclineButton
      disableStyles={true}
      onAccept={handleAccept}
      onDecline={handleDecline}
      containerClasses={containerClasses}
      contentClasses={contentClasses}
      buttonWrapperClasses='flex justify-center gap-3 mt-4'
      buttonClasses={buttonClasses}
      declineButtonClasses={declineButtonClasses}
      overlayClasses={overlayClasses}
      overlay
    >
      <div className={boxClasses}>
        <div className='flex items-start'>
          <span className={symbolClasses}>$</span>
          <div>
            <p className={clsx('mb-3', isDarkMode ? 'text-white' : 'text-gray-800')}>
              This site uses essential cookies for basic functionality.
            </p>
            <div className={dividerClasses}>[COOKIE_NOTICE v2.1] TERMS:PRIVACY</div>
          </div>
        </div>
      </div>
    </CookieConsent>
  )
}

export default CookieConsentBanner
