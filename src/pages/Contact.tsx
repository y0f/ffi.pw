import { useState, type FormEvent, type ChangeEvent, type FC } from 'react'
import { FaCopy, FaCheck } from 'react-icons/fa'
import { motion } from 'framer-motion'
import { FaBluesky } from 'react-icons/fa6'
import { useTheme } from '../hooks/useTheme'
import useDeviceCapability from '../hooks/useDeviceCapability'
import clsx from 'clsx'
import { createThemedClasses, combineThemePatterns, themePatterns } from '../utils/themeClasses'

interface FormData {
  name: string
  subject: string
  message: string
}

const Contact: FC = () => {
  const [formData, setFormData] = useState<FormData>({ name: '', subject: '', message: '' })
  const [isSending, setIsSending] = useState<boolean>(false)
  const [copied, setCopied] = useState<boolean>(false)
  const { isDarkMode } = useTheme()
  const { isMobile, shouldReduceMotion } = useDeviceCapability()

  const shouldAnimate = !isMobile && !shouldReduceMotion

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const copyEmail = () => {
    navigator.clipboard.writeText('contact@ffi.pw')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSending(true)
    const { name, subject, message } = formData
    const mailtoLink = `mailto:contact@ffi.pw?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
      `Name: ${name}\\n\\nMessage:\\n${message}`,
    )}`

    setTimeout(() => {
      window.location.href = mailtoLink
      setIsSending(false)
    }, 2000)
  }

  const classes = createThemedClasses(isDarkMode, {
    container:
      'h-auto sm:max-h-screen flex flex-col items-center p-3 relative overflow-hidden pb-4 sm:pb-6 z-3 bg-transparent',
    headerText: () =>
      combineThemePatterns(
        isDarkMode,
        'text-3xl md:text-4xl fira mb-2 md:mb-4 animate-fade-in',
        themePatterns.text.primary,
        themePatterns.shadow.glow,
      ),
    subtitle: () =>
      combineThemePatterns(
        isDarkMode,
        'fira-thin text-xs sm:text-sm md:text-base border-t pt-2 md:pt-3 inline-block',
        themePatterns.text.secondary,
        themePatterns.border.primary,
      ),
    sectionTitle: () =>
      combineThemePatterns(
        isDarkMode,
        'fira text-lg md:text-xl',
        themePatterns.text.secondary,
        themePatterns.shadow.subtle,
      ),
    text: () =>
      combineThemePatterns(
        isDarkMode,
        'fira-thin text-sm md:text-base leading-relaxed',
        themePatterns.text.secondary,
      ),
    emailBox: (isDark: boolean) =>
      clsx(
        'shadow-md flex items-center justify-between rounded-lg px-4 py-3 group hover:bg-opacity-70 transition-colors duration-200 cursor-pointer',
        isDark
          ? 'border border-neutral-200/20 hover:text-primary-300 hover:bg-primary-400/10 bg-linear-to-br from-gray-900/10 via-primary-600/5 to-gray-950/10'
          : 'border border-gray-400 hover:text-primary-700 hover:bg-primary-200/20 bg-linear-to-br bg-white/40 via-primary-400/10 to-gray-50/10',
      ),
    emailText: () =>
      combineThemePatterns(
        isDarkMode,
        'fira-thin text-sm md:text-base',
        themePatterns.accent.text,
        themePatterns.accent.textHover,
      ),
    socialText: () =>
      combineThemePatterns(isDarkMode, 'fira-thin text-sm mb-3', themePatterns.text.secondary),
    formContainer: (isDark: boolean) =>
      clsx(
        'shadow-md p-5 w-full md:w-1/2 lg:w-1/2 max-w-2xl border rounded-lg relative overflow-hidden',
        isDark
          ? 'border-neutral-200/20 bg-linear-to-br from-gray-900/10 via-primary-600/5 to-gray-950/10'
          : 'border-gray-400 bg-linear-to-br bg-white/40 via-primary-400/10 to-gray-50/10',
      ),
    input: () =>
      combineThemePatterns(
        isDarkMode,
        'w-full text-sm rounded-sm px-4 py-2 focus:outline-none placeholder-gray-500',
        (isDark: boolean) =>
          isDark
            ? 'bg-gray-950/70 text-white border border-neutral-200/20 hover:border-primary-400 focus:border-primary-400'
            : 'bg-gray-50/50 text-gray-800 border border-gray-400 hover:border-primary-500 focus:border-primary-500',
      ),
    button: () =>
      combineThemePatterns(
        isDarkMode,
        'cursor-pointer w-full text-sm px-6 py-3 rounded-sm transition-all duration-300 flex items-center justify-center space-x-2',
        (isDark: boolean) =>
          isDark
            ? 'bg-gray-950/70 text-white border border-neutral-200/20 hover:border-primary-400'
            : 'bg-gray-50/50 text-primary-600 border border-gray-400 hover:border-primary-500',
      ),
  })

  return (
    <div className={classes.container}>
      {/* Header */}
      <motion.div
        initial={shouldAnimate ? { opacity: 0, y: -10 } : false}
        animate={shouldAnimate ? { opacity: 1, y: 0 } : {}}
        transition={shouldAnimate ? { duration: 0.4, ease: 'easeOut' } : {}}
        className='text-center mb-4 sm:mb-6 md:mb-8 py-4 relative overflow-hidden w-full max-w-7xl pb-2'
      >
        <div className='flex items-center justify-center gap-4 mb-2'>
          <motion.div
            className='h-px w-8 sm:w-12 bg-linear-to-r from-transparent to-primary-500'
            initial={shouldAnimate ? { scaleX: 0 } : false}
            animate={shouldAnimate ? { scaleX: 1 } : {}}
            transition={shouldAnimate ? { delay: 0.2, duration: 0.5 } : {}}
          />
          <h1 className={classes.headerText}>CONTACT</h1>
          <motion.div
            className='h-px w-8 sm:w-12 bg-linear-to-l from-transparent to-primary-500'
            initial={shouldAnimate ? { scaleX: 0 } : false}
            animate={shouldAnimate ? { scaleX: 1 } : {}}
            transition={shouldAnimate ? { delay: 0.2, duration: 0.5 } : {}}
          />
        </div>
        <motion.div
          initial={shouldAnimate ? { opacity: 0 } : false}
          animate={shouldAnimate ? { opacity: 1 } : {}}
          className={classes.subtitle}
        >
          <span className='typed-out fira-thin'>Let's build something together</span>
        </motion.div>
      </motion.div>

      {/* Container */}
      <div className='relative mx-auto flex flex-col lg:flex-row items-center justify-center gap-6 md:gap-10 lg:gap-16 w-full max-w-7xl mt-0 md:mt-4 z-10 p-2 sm:p-0'>
        {/* Left Section - Contact Info */}
        <motion.div
          className='w-full lg:w-1/3 flex flex-col items-center lg:items-start px-0 mb-6 lg:mb-0 pb-0 md:pb-4'
          initial={shouldAnimate ? { x: -100, opacity: 0 } : false}
          animate={shouldAnimate ? { x: 0, opacity: 1 } : {}}
          transition={shouldAnimate ? { duration: 0.5, ease: 'easeOut' } : {}}
        >
          <div className=''>
            <div className='w-full max-w-md space-y-6'>
              <div className='space-y-4'>
                <motion.h2
                  className={classes.sectionTitle}
                  whileHover={shouldAnimate ? { scale: 1.02 } : {}}
                >
                  Let's collaborate
                </motion.h2>
                <motion.p
                  className={classes.text}
                  whileHover={shouldAnimate ? { x: 5 } : {}}
                  transition={shouldAnimate ? { type: 'spring', stiffness: 300 } : {}}
                >
                  Solo engineer — available for contract work, team collabs, or real conversations
                  that lead to something solid.
                </motion.p>
              </div>

              {/* Email Box */}
              <div className='space-y-2'>
                <p
                  className={combineThemePatterns(
                    isDarkMode,
                    'fira-thin text-sm',
                    themePatterns.text.primary,
                  )}
                >
                  Email me directly at:
                </p>
                <motion.div
                  className={clsx(classes.emailBox, 'relative overflow-hidden')}
                  onClick={copyEmail}
                  whileHover={shouldAnimate ? { scale: 1.02 } : {}}
                  whileTap={shouldAnimate ? { scale: 0.98 } : {}}
                  animate={
                    shouldAnimate && copied
                      ? {
                          boxShadow: isDarkMode
                            ? [
                                '0 0 0px rgba(34, 197, 94, 0)',
                                '0 0 20px rgba(34, 197, 94, 0.6)',
                                '0 0 0px rgba(34, 197, 94, 0)',
                              ]
                            : [
                                '0 0 0px rgba(22, 163, 74, 0)',
                                '0 0 20px rgba(22, 163, 74, 0.6)',
                                '0 0 0px rgba(22, 163, 74, 0)',
                              ],
                        }
                      : {}
                  }
                  transition={shouldAnimate ? { duration: 0.6 } : {}}
                >
                  {/* Grid pattern */}
                  <div
                    className='absolute inset-0 opacity-5 z-0'
                    style={{
                      backgroundImage: `linear-gradient(${isDarkMode ? '#ffffff' : '#000000'} 1px, transparent 1px), linear-gradient(90deg, ${isDarkMode ? '#ffffff' : '#000000'} 1px, transparent 1px)`,
                      backgroundSize: '20px 20px',
                    }}
                  />

                  <div className='flex items-center justify-between relative z-10 w-full'>
                    <span className={classes.emailText}>contact@ffi.pw</span>
                    <button
                      className='transition-colors duration-200 ml-auto'
                      aria-label='Copy email'
                    >
                      {copied ? (
                        <motion.div
                          initial={{ scale: 0.8, rotate: -90 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ type: 'spring', stiffness: 300 }}
                        >
                          <FaCheck
                            className={clsx(
                              'text-sm',
                              isDarkMode ? 'text-green-400' : 'text-green-600',
                            )}
                          />
                        </motion.div>
                      ) : (
                        <motion.div whileHover={shouldAnimate ? { rotate: 15 } : {}}>
                          <FaCopy
                            className={combineThemePatterns(
                              isDarkMode,
                              'cursor-pointer text-sm opacity-70 group-hover:opacity-100',
                              themePatterns.accent.text,
                            )}
                          />
                        </motion.div>
                      )}
                    </button>
                  </div>
                </motion.div>
              </div>

              {/* Social Icons */}
              <div className='pt-2'>
                <p className={classes.socialText}>Or connect via:</p>
                <div className='flex gap-5'>
                  <motion.a
                    href='https://bsky.app/profile/ffi.pw'
                    className='group'
                    aria-label='primaryskye'
                    whileHover={shouldAnimate ? { y: -3 } : {}}
                  >
                    <FaBluesky
                      className={clsx(
                        'text-xl group-hover:opacity-100 transition-colors duration-200',
                        themePatterns.accent.text(isDarkMode),
                        isDarkMode ? 'group-hover:text-white' : 'group-hover:text-primary-600',
                      )}
                    />
                  </motion.a>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Section - Contact Form */}
        <motion.div
          className={classes.formContainer}
          initial={shouldAnimate ? { x: 100, opacity: 0 } : false}
          animate={shouldAnimate ? { x: 0, opacity: 1 } : {}}
          transition={shouldAnimate ? { duration: 0.5, ease: 'easeOut' } : {}}
          whileHover={shouldAnimate ? { scale: 1.005 } : {}}
        >
          <motion.div
            whileHover={shouldAnimate ? { scale: 1 } : {}}
            transition={shouldAnimate ? { type: 'spring', stiffness: 300 } : {}}
          >
            {/* Grid pattern background */}
            <div
              className='absolute inset-0 opacity-5 z-0'
              style={{
                backgroundImage: `linear-gradient(${isDarkMode ? '#ffffff' : '#000000'} 1px, transparent 1px), linear-gradient(90deg, ${isDarkMode ? '#ffffff' : '#000000'} 1px, transparent 1px)`,
                backgroundSize: '20px 20px',
              }}
            />

            <form onSubmit={handleSubmit} className='space-y-4 fira relative z-10'>
              {/* Name Field */}
              <motion.div whileHover={shouldAnimate ? { x: 3 } : {}}>
                <input
                  type='text'
                  name='name'
                  value={formData.name}
                  onChange={handleChange}
                  placeholder='Your Name'
                  required
                  autoComplete='name'
                  className={classes.input}
                />
              </motion.div>

              {/* Subject Field */}
              <motion.div whileHover={shouldAnimate ? { x: 3 } : {}}>
                <input
                  type='text'
                  name='subject'
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder='Subject'
                  required
                  autoComplete='off'
                  className={classes.input}
                />
              </motion.div>

              {/* Message Field */}
              <motion.div whileHover={shouldAnimate ? { x: 3 } : {}}>
                <textarea
                  name='message'
                  value={formData.message}
                  onChange={handleChange}
                  placeholder='Message...'
                  required
                  rows={5}
                  autoComplete='off'
                  className={clsx(classes.input, 'py-3 resize-none')}
                />
              </motion.div>

              {/* Submit Button */}
              <motion.button
                type='submit'
                disabled={isSending}
                className={classes.button}
                whileHover={!isSending && shouldAnimate ? { scale: 1.02 } : {}}
                whileTap={!isSending && shouldAnimate ? { scale: 0.98 } : {}}
              >
                <span
                  className={combineThemePatterns(isDarkMode, 'fira', themePatterns.accent.text)}
                >
                  {isSending ? 'SENDING...' : 'SEND MESSAGE'}
                </span>
                {isSending && (
                  <motion.div
                    className={clsx(
                      'w-4 h-4 border-2 border-t-transparent rounded-full animate-spin',
                      isDarkMode ? 'border-white' : 'border-primary-500',
                    )}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  />
                )}
              </motion.button>
            </form>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

export default Contact
