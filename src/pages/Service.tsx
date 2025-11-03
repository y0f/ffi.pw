import { useEffect, useMemo, type FC } from 'react'
import { useParams, Link } from 'react-router-dom'
import servicesData from '../config/services.json'
import { useTheme } from '../hooks/useTheme'
import clsx from 'clsx'
import { FiArrowLeft } from 'react-icons/fi'
import { FaCode } from 'react-icons/fa'
import { motion } from 'framer-motion'
import ServiceAccordionSection from '../components/services/ServiceAccordeonSection'
import { createTechIcons, serviceIcons } from '../utils/techIcons'
import { getReadableTitle, getServiceExplanation } from '../utils/serviceUtils'

interface Service {
  slug: string
  title: string
  description: string
  items: Array<{ title: string; description: string }>
  features: string[]
  technologies: string[]
}

interface ServicesData {
  services: Service[]
}

const typedServicesData = servicesData as ServicesData

const getGridPattern = (isDarkMode: boolean): React.CSSProperties => ({
  backgroundImage: `linear-gradient(${isDarkMode ? '#ffffff' : '#000000'} 1px, transparent 1px), linear-gradient(90deg, ${isDarkMode ? '#ffffff' : '#000000'} 1px, transparent 1px)`,
  backgroundSize: '20px 20px',
})

const Service: FC = () => {
  const { slug } = useParams<{ slug: string }>()
  const { isDarkMode } = useTheme()

  const service = useMemo(() => typedServicesData.services.find((s) => s.slug === slug), [slug])

  const techIcons = createTechIcons(isDarkMode)
  const gridPatternStyle = useMemo(() => getGridPattern(isDarkMode), [isDarkMode])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [slug])

  if (!service) {
    return (
      <div className='min-h-auto max-h-screen flex flex-col items-center justify-center p-8'>
        <h2 className={clsx('text-2xl mb-4', isDarkMode ? 'text-gray-200' : 'text-gray-800')}>
          404 - Service not found
        </h2>
        <Link
          to='/services'
          className={clsx(
            'inline-flex items-center px-4 py-2 rounded',
            isDarkMode
              ? 'bg-primary-400/20 hover:bg-primary-400/30'
              : 'bg-primary-500/20 hover:bg-primary-500/30',
            'transition-all duration-300',
          )}
        >
          <FiArrowLeft className='mr-2' /> Return to Services
        </Link>
      </div>
    )
  }

  const readableTitle = getReadableTitle(service.title)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={clsx('min-h-screen p-4 md:p-8', isDarkMode ? 'text-gray-200' : 'text-gray-800')}
    >
      <div className='max-w-4xl mx-auto'>
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
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
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
              {service.description}
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
                {getServiceExplanation(slug || '')}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Service offerings section */}
        <ServiceAccordionSection title='SERVICE OFFERINGS' initiallyOpen={true}>
          <div className='grid md:grid-cols-2 gap-4'>
            {service.items.map((item, index) => (
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
            {service.features.map((feature, index) => (
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
            {service.technologies.map((tech, index) => (
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
      </div>
    </motion.div>
  )
}

export default Service
