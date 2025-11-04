import { memo, type FC, type CSSProperties } from 'react'
import clsx from 'clsx'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FiArrowLeft } from 'react-icons/fi'
import { serviceIcons } from '../../utils/techIcons'

interface ServiceHeaderProps {
  slug: string
  readableTitle: string
  description: string
  explanation: string
  isDarkMode: boolean
  shouldAnimate: boolean
  gridPatternStyle: CSSProperties
}

const ServiceHeader: FC<ServiceHeaderProps> = memo(
  ({
    slug,
    readableTitle,
    description,
    explanation,
    isDarkMode,
    shouldAnimate,
    gridPatternStyle,
  }) => {
    return (
      <>
        {/* Back button */}
        <Link
          to='/services'
          className={clsx(
            'relative inline-flex items-center mb-6 pl-2 md:pl-3 pr-4 md:pr-6 py-2 md:py-2.5',
            'hover:from-primary-400/20 hover:to-primary-500/20',
            'rounded-lg fira text-sm md:text-base',
            'overflow-hidden transition-all duration-400 group',
            isDarkMode
              ? 'bg-linear-to-br from-primary-400/10 to-primary-500/10 border border-neutral-200/20 hover:border-primary-400'
              : 'bg-linear-to-br from-primary-400/25 to-primary-500/15 border border-gray-800/20 hover:border-primary-500',
          )}
        >
          <FiArrowLeft
            className={clsx(
              'mr-2 md:mr-3 transition-all duration-500',
              'group-hover:translate-x-0.5',
              isDarkMode
                ? 'text-primary-300 md:text-primary-400'
                : 'text-primary-500 md:text-primary-600',
            )}
          />
          <span className='relative fira text-sm'>Back to Services</span>
        </Link>

        {/* Service header */}
        <motion.div
          initial={shouldAnimate ? { y: 20, opacity: 0 } : false}
          animate={shouldAnimate ? { y: 0, opacity: 1 } : {}}
          transition={shouldAnimate ? { duration: 0.5 } : {}}
          className={clsx(
            'relative mb-8 rounded-xl border p-6 overflow-hidden',
            isDarkMode
              ? 'bg-linear-to-br from-gray-900/10 via-primary-600/5 to-gray-950/10 border-neutral-200/20'
              : 'bg-linear-to-br from-gray-100 via-primary-100/30 to-gray-200/30 border-gray-800/30',
          )}
        >
          <div
            className={clsx(
              'absolute inset-0 opacity-5 bg-size[20px_20px] z-0',
              isDarkMode
                ? 'bg-[radial-gradient(circle_at_1px_1px,#fff_1px,transparent_0)]'
                : 'bg-[radial-gradient(circle_at_1px_1px,#000_1px,transparent_0)]',
            )}
            style={gridPatternStyle}
          />
          <div className='relative z-10'>
            <div className='flex items-center mb-2'>
              <div
                className={clsx(
                  'p-3 rounded-full mr-4',
                  isDarkMode
                    ? 'bg-primary-400/20 text-primary-300'
                    : 'bg-primary-500/20 text-primary-500',
                )}
              >
                {slug && slug in serviceIcons
                  ? serviceIcons[slug as keyof typeof serviceIcons]
                  : null}
              </div>
              <h1
                className={clsx(
                  'text-3xl md:text-4xl fira',
                  isDarkMode ? 'text-gray-100' : 'text-gray-800',
                )}
              >
                {readableTitle}
              </h1>
            </div>

            <p
              className={clsx('fira text-lg mt-4', isDarkMode ? 'text-gray-200' : 'text-gray-700')}
            >
              {description}
            </p>

            <div
              className={clsx(
                'mt-4 p-4 rounded-lg border',
                isDarkMode
                  ? 'bg-gray-950/90 border-neutral-200/10'
                  : 'bg-white/90 border-gray-800/10',
              )}
            >
              <h3
                className={clsx(
                  'text-sm uppercase font-bold mb-2',
                  isDarkMode ? 'text-primary-300' : 'text-primary-600',
                )}
              >
                In simple terms
              </h3>
              <p className={clsx('fira', isDarkMode ? 'text-gray-300' : 'text-gray-700')}>
                {explanation}
              </p>
            </div>
          </div>
        </motion.div>
      </>
    )
  },
)

ServiceHeader.displayName = 'ServiceHeader'

export default ServiceHeader
