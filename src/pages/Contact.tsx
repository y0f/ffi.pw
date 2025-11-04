import { useState, useMemo, useCallback, type FormEvent, type ChangeEvent, type FC } from 'react'
import clsx from 'clsx'
import { useTheme } from '../hooks/useTheme'
import useDeviceCapability from '../hooks/useDeviceCapability'
import { createThemedClasses, combineThemePatterns, themePatterns } from '../utils/themeClasses'
import ContactInfo from '../components/contact/ContactInfo'
import ContactForm from '../components/contact/ContactForm'
import PageHeader from '../components/common/PageHeader'

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

  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }, [])

  const copyEmail = useCallback(() => {
    navigator.clipboard.writeText('contact@ffi.pw')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [])

  const handleSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
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
    },
    [formData],
  )

  const animations = useMemo(
    () => ({
      slideLeft: shouldAnimate
        ? {
            initial: { x: -100, opacity: 0 },
            animate: { x: 0, opacity: 1 },
            transition: { duration: 0.5, ease: 'easeOut' as const },
          }
        : { initial: false, animate: {}, transition: {} },
      slideRight: shouldAnimate
        ? {
            initial: { x: 100, opacity: 0 },
            animate: { x: 0, opacity: 1 },
            transition: { duration: 0.5, ease: 'easeOut' as const },
          }
        : { initial: false, animate: {}, transition: {} },
      hoverScale: shouldAnimate ? { whileHover: { scale: 1.02 } } : {},
      hoverTap: shouldAnimate ? { whileHover: { scale: 1.02 }, whileTap: { scale: 0.98 } } : {},
      hoverSlide: shouldAnimate
        ? { whileHover: { x: 5 }, transition: { type: 'spring' as const, stiffness: 300 } }
        : { whileHover: {}, transition: {} },
      hoverY: shouldAnimate ? { whileHover: { y: -3 } } : { whileHover: {} },
      hoverRotate: shouldAnimate ? { whileHover: { rotate: 15 } } : { whileHover: {} },
      formFieldHover: shouldAnimate ? { whileHover: { x: 3 } } : { whileHover: {} },
    }),
    [shouldAnimate],
  )

  const copyAnimation = useMemo(
    () =>
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
        : {},
    [shouldAnimate, copied, isDarkMode],
  )

  const classes = useMemo(
    () =>
      createThemedClasses(isDarkMode, {
        container:
          'h-auto sm:max-h-screen flex flex-col items-center p-3 relative overflow-hidden pb-4 sm:pb-6 z-3 bg-transparent',
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
      }),
    [isDarkMode],
  )

  return (
    <div className={classes.container}>
      {/* Header */}
      <PageHeader
        title='CONTACT'
        subtitle="Let's build something together"
        isDarkMode={isDarkMode}
        shouldAnimate={shouldAnimate}
      />

      {/* Container */}
      <div className='relative mx-auto flex flex-col lg:flex-row items-center justify-center gap-6 md:gap-10 lg:gap-16 w-full max-w-7xl mt-0 md:mt-4 z-10 p-2 sm:p-0'>
        <ContactInfo
          copied={copied}
          isDarkMode={isDarkMode}
          onCopyEmail={copyEmail}
          copyAnimation={copyAnimation}
          animations={{
            slideLeft: animations.slideLeft,
            hoverScale: animations.hoverScale,
            hoverSlide: animations.hoverSlide,
            hoverTap: animations.hoverTap,
            hoverY: animations.hoverY,
            hoverRotate: animations.hoverRotate,
          }}
          classes={{
            sectionTitle: classes.sectionTitle as string,
            text: classes.text as string,
            socialText: classes.socialText as string,
            emailBox: classes.emailBox as string,
            emailText: classes.emailText as string,
          }}
        />

        <ContactForm
          formData={formData}
          isSending={isSending}
          isDarkMode={isDarkMode}
          shouldAnimate={shouldAnimate}
          onChange={handleChange}
          onSubmit={handleSubmit}
          animations={{
            slideRight: animations.slideRight,
            formFieldHover: animations.formFieldHover,
            hoverTap: animations.hoverTap,
          }}
          classes={{
            formContainer: classes.formContainer as string,
            input: classes.input as string,
            button: classes.button as string,
          }}
        />
      </div>
    </div>
  )
}

export default Contact
