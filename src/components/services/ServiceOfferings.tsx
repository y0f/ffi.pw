import { memo, type FC, type CSSProperties } from 'react'
import clsx from 'clsx'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FaCode } from 'react-icons/fa'
import ServiceAccordionSection from './ServiceAccordeonSection'
import type { ServiceItem } from '../../config/services.processed'

interface ServiceOfferingsProps {
  slug: string
  readableTitle: string
  items: ServiceItem[]
  features: string[]
  technologies: string[]
  techIcons: Record<string, React.ReactElement>
  isDarkMode: boolean
  gridPatternStyle: CSSProperties
}

const ServiceOfferings: FC<ServiceOfferingsProps> = memo(
  ({
    slug,
    readableTitle,
    items,
    features,
    technologies,
    techIcons,
    isDarkMode,
    gridPatternStyle,
  }) => {
    return (
      <>
        {/* Service offerings section */}
        <ServiceAccordionSection title='SERVICE OFFERINGS' initiallyOpen={true}>
          <div className='grid md:grid-cols-2 gap-4'>
            {items.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className={clsx(
                  'relative p-5 rounded-lg border transition-all duration-300 overflow-hidden',
                  isDarkMode
                    ? 'bg-linear-to-br from-gray-900/10 via-primary-600/5 to-gray-950/10 border-neutral-200/20 hover:border-primary-400/70'
                    : 'bg-linear-to-br from-gray-100 via-primary-100/30 to-gray-200/30 border-gray-800/30 hover:border-primary-500/70',
                  'hover:shadow-md',
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
                  <h3
                    className={clsx(
                      'fira text-md font-bold pb-2',
                      isDarkMode ? 'text-gray-100' : 'text-gray-800',
                    )}
                  >
                    {item.title}
                  </h3>
                  <p
                    className={clsx('fira text-sm', isDarkMode ? 'text-gray-300' : 'text-gray-700')}
                  >
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </ServiceAccordionSection>

        {/* Features section */}
        <ServiceAccordionSection title="WHAT'S INCLUDED" initiallyOpen={true}>
          <div className='grid md:grid-cols-2 gap-4'>
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className={clsx(
                  'relative p-4 rounded-lg border overflow-hidden',
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
                <div className='flex items-center relative z-10'>
                  <div className='shrink-0'>
                    <div
                      className={clsx(
                        'flex items-center justify-center h-8 w-8 rounded-full',
                        isDarkMode
                          ? 'bg-primary-400/20 text-primary-300'
                          : 'bg-primary-500/20 text-primary-600',
                      )}
                    >
                      <svg
                        className='h-4 w-4'
                        fill='none'
                        viewBox='0 0 24 24'
                        stroke='currentColor'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M5 13l4 4L19 7'
                        />
                      </svg>
                    </div>
                  </div>
                  <div className='ml-4'>
                    <p className={clsx('fira', isDarkMode ? 'text-gray-200' : 'text-gray-800')}>
                      {feature}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </ServiceAccordionSection>

        {/* Technologies section */}
        <ServiceAccordionSection title='TECHNOLOGIES' initiallyOpen={true}>
          <div
            className={clsx(
              'mb-4 p-4 rounded-lg border',
              isDarkMode
                ? 'bg-gray-950/30 border-neutral-200/10'
                : 'bg-white/50 border-gray-800/10',
            )}
          >
            <p className={clsx('fira', isDarkMode ? 'text-gray-300' : 'text-gray-700')}>
              {slug === 'web-development' &&
                'These are the modern technologies I use to build robust, responsive websites and web applications.'}
              {slug === 'mobile-development' &&
                'These specialized tools enable me to create high-performance mobile apps that work on both iOS and Android.'}
              {slug === 'web-security' &&
                'Professional security testing tools to identify vulnerabilities before hackers can exploit them.'}
            </p>
          </div>

          <div className='grid grid-cols-2 md:grid-cols-3 gap-3'>
            {technologies.map((tech, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2, delay: index * 0.03 }}
                className={clsx(
                  'relative flex items-center p-3 rounded-lg border hover:border-primary-400 transition-colors overflow-hidden',
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
                <div className='text-2xl mr-3 fira relative z-10'>
                  {(tech in techIcons ? techIcons[tech as keyof typeof techIcons] : null) || (
                    <FaCode
                      className={clsx(isDarkMode ? 'text-primary-200' : 'text-primary-500')}
                    />
                  )}
                </div>
                <div
                  className={clsx(
                    'fira relative z-10',
                    isDarkMode ? 'text-gray-200' : 'text-gray-800',
                  )}
                >
                  {tech}
                </div>
              </motion.div>
            ))}
          </div>
        </ServiceAccordionSection>

        {/* CTA section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className={clsx(
            'relative mt-12 mb-10 p-8 text-center rounded-xl border overflow-hidden',
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
            <h3
              className={clsx('text-2xl fira mb-4', isDarkMode ? 'text-gray-100' : 'text-gray-800')}
            >
              Ready to discuss your project?
            </h3>
            <p
              className={clsx('mb-6 fira text-lg', isDarkMode ? 'text-gray-200' : 'text-gray-700')}
            >
              Let's talk about how I can help bring your vision to life with professional{' '}
              {readableTitle.toLowerCase()} services.
            </p>
            <Link
              to='/contact'
              className={clsx(
                'inline-block px-8 py-3 rounded-lg fira transition-all duration-300 text-lg border',
                isDarkMode
                  ? 'bg-primary-400/20 hover:bg-primary-400/30 text-primary-200 hover:text-primary-100 border-primary-400/50 hover:border-primary-300'
                  : 'bg-primary-500/20 hover:bg-primary-500/30 text-primary-700 hover:text-primary-800 border-primary-500/50 hover:border-primary-600',
                'hover:shadow-lg',
              )}
            >
              Contact Me Now
            </Link>
          </div>
        </motion.div>
      </>
    )
  },
)

ServiceOfferings.displayName = 'ServiceOfferings'

export default ServiceOfferings
