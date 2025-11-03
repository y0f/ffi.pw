import { useState } from 'react'
import type { FC, MouseEvent } from 'react'
import { FaTerminal, FaCode, FaLink, FaArrowRight } from 'react-icons/fa'
import type { IconType } from 'react-icons'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../../hooks/useTheme'
import { combineThemePatterns, themePatterns } from '../../utils/themeClasses'

interface Link {
  name: string
  url: string
}

interface CardContent {
  name?: string
  role?: string
  bio?: string
  links?: Link[]
}

interface Card {
  id: string
  icon: IconType
  title: string
  command: string
  action?: () => void
  content?: CardContent
}

const MobileHome: FC = () => {
  const navigate = useNavigate()
  const { isDarkMode } = useTheme()
  const [selectedCard, setSelectedCard] = useState<Card | null>(null)

  const cards: Card[] = [
    {
      id: 'whoami',
      icon: FaTerminal,
      title: 'About Me',
      command: '$ whoami',
      content: {
        name: 'Jon',
        role: 'Developer & Security Researcher',
        bio: "I've got a background in web security that started with social engineering at a young age. Over the last decade I've dabbled in reverse engineering games, building web and mobile apps, AI projects, automated pentesting tools - pretty much anything that caught my interest. I like building things, breaking things, and figuring out how they tick.",
      },
    },
    {
      id: 'services',
      icon: FaCode,
      title: 'Services',
      command: '$ services',
      action: () => navigate('/services'),
    },
    {
      id: 'links',
      icon: FaLink,
      title: 'Links',
      command: '$ links',
      content: {
        links: [{ name: 'YouTube', url: 'https://www.youtube.com/@1%D0%97%D0%977' }],
      },
    },
  ]

  const handleCardClick = (card: Card): void => {
    if (card.action) {
      card.action()
    } else {
      setSelectedCard(selectedCard?.id === card.id ? null : card)
    }
  }

  const handleBackdropClick = (): void => {
    setSelectedCard(null)
  }

  const handleContentClick = (e: MouseEvent<HTMLDivElement>): void => {
    e.stopPropagation()
  }

  const handleCloseClick = (): void => {
    setSelectedCard(null)
  }

  return (
    <>
      <div className='min-h-screen flex flex-col items-center p-4 relative overflow-hidden pb-8 pt-20'>
        <div className='w-full max-w-2xl mx-auto'>
          <div className='text-center pb-6 mb-8'>
            <h1
              className={combineThemePatterns(
                isDarkMode,
                'text-3xl md:text-4xl fira mb-2 md:mb-4',
                themePatterns.text.primary,
                themePatterns.shadow.glow,
              )}
            >
              WELCOME!
            </h1>
            <div
              className={combineThemePatterns(
                isDarkMode,
                'fira-thin text-xs sm:text-sm border-t pt-2 md:pt-3 inline-block',
                themePatterns.text.secondary,
                themePatterns.border.primary,
              )}
            >
              <span className='typed-out fira-thin'>Tap a card to explore</span>
            </div>
          </div>

          <div className='space-y-3 pb-20'>
            {cards.map((card) => (
              <div key={card.id}>
                <button
                  onClick={() => handleCardClick(card)}
                  className={`w-full text-left p-5 rounded-xl border-2 transition-all active:scale-[0.98] ${
                    isDarkMode
                      ? 'bg-gray-900/60 border-primary-500/40 active:border-primary-500'
                      : 'bg-white/90 border-primary-400/40 active:border-primary-400'
                  }`}
                >
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-4'>
                      <card.icon className='text-2xl text-primary-500' />
                      <div>
                        <div className='fira text-base font-semibold mb-1'>{card.title}</div>
                        <div
                          className={`text-xs fira-thin ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}
                        >
                          {card.command}
                        </div>
                      </div>
                    </div>
                    {!card.action && (
                      <FaArrowRight
                        className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}
                      />
                    )}
                  </div>
                </button>
              </div>
            ))}
          </div>

          <div
            className={`text-center text-xs fira-thin ${isDarkMode ? 'text-gray-600' : 'text-gray-500'}`}
          >
            For the full terminal experience, visit on desktop
          </div>
        </div>
      </div>

      {/* Full-screen modal overlay for content */}
      {selectedCard && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-200 ${
            selectedCard ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ paddingTop: '80px' }}
          onClick={handleBackdropClick}
        >
          {/* Backdrop */}
          <div
            className={`absolute inset-0 ${isDarkMode ? 'bg-black/80' : 'bg-black/50'} backdrop-blur-sm`}
          />

          {/* Content */}
          <div
            className='relative w-full max-w-lg max-h-[80vh] overflow-y-auto transition-all duration-300 ease-out'
            style={{
              transform: selectedCard ? 'scale(1) translateY(0)' : 'scale(0.9) translateY(20px)',
            }}
            onClick={handleContentClick}
          >
            <div
              className={`rounded-2xl border-2 p-6 ${
                isDarkMode ? 'bg-gray-900 border-primary-500/60' : 'bg-white border-primary-400/60'
              }`}
            >
              {/* Header */}
              <div className='flex items-center justify-between mb-4'>
                <div className='flex items-center gap-3'>
                  {selectedCard.icon && <selectedCard.icon className='text-2xl text-primary-500' />}
                  <div>
                    <div className='fira font-semibold text-base'>{selectedCard.title}</div>
                    <div
                      className={`text-xs fira-thin ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}
                    >
                      {selectedCard.command}
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleCloseClick}
                  className={`text-2xl ${isDarkMode ? 'text-gray-500 hover:text-gray-300' : 'text-gray-600 hover:text-gray-800'}`}
                >
                  ×
                </button>
              </div>

              {/* Content */}
              {selectedCard.id === 'whoami' && selectedCard.content && (
                <div>
                  <div
                    className={`text-lg fira font-semibold mb-1 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}
                  >
                    {selectedCard.content.name}
                  </div>
                  <div className='text-xs fira text-primary-500 font-semibold mb-3'>
                    {selectedCard.content.role}
                  </div>
                  <p
                    className={`text-sm fira-thin leading-relaxed ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}
                  >
                    {selectedCard.content.bio}
                  </p>
                </div>
              )}

              {selectedCard.id === 'links' && selectedCard.content && (
                <div className='space-y-3'>
                  {selectedCard.content.links?.map((link, i) => (
                    <a
                      key={i}
                      href={link.url}
                      target='_blank'
                      rel='noopener noreferrer'
                      className={`block text-sm fira-thin ${isDarkMode ? 'text-cyan-400' : 'text-cyan-600'} underline`}
                    >
                      {link.name}: {link.url.replace('https://', '')}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default MobileHome
