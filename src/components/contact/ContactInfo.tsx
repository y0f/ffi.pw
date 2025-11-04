import { memo, type FC } from 'react'
import { motion } from 'framer-motion'
import { FaBluesky } from 'react-icons/fa6'
import clsx from 'clsx'
import { themePatterns } from '../../utils/themeClasses'
import EmailCopyButton from './EmailCopyButton'

interface ContactInfoProps {
  copied: boolean
  isDarkMode: boolean
  onCopyEmail: () => void
  copyAnimation: Record<string, any>
  animations: {
    slideLeft: Record<string, any>
    hoverScale: Record<string, any>
    hoverSlide: Record<string, any>
    hoverTap: Record<string, any>
    hoverY: Record<string, any>
    hoverRotate: Record<string, any>
  }
  classes: {
    sectionTitle: string
    text: string
    socialText: string
    emailBox: string
    emailText: string
  }
}

const ContactInfo: FC<ContactInfoProps> = memo(
  ({ copied, isDarkMode, onCopyEmail, copyAnimation, animations, classes }) => {
    return (
      <motion.div
        className='w-full lg:w-1/3 flex flex-col items-center lg:items-start px-0 mb-6 lg:mb-0 pb-0 md:pb-4'
        {...animations.slideLeft}
      >
        <div className=''>
          <div className='w-full max-w-md space-y-6'>
            <div className='space-y-4'>
              <motion.h2 className={classes.sectionTitle} {...animations.hoverScale}>
                Let's collaborate
              </motion.h2>
              <motion.p className={classes.text} {...animations.hoverSlide}>
                Solo engineer — available for contract work, team collabs, or real conversations
                that lead to something solid.
              </motion.p>
            </div>

            {/* Email Box */}
            <EmailCopyButton
              copied={copied}
              isDarkMode={isDarkMode}
              onClick={onCopyEmail}
              copyAnimation={copyAnimation}
              hoverTap={animations.hoverTap}
              hoverRotate={animations.hoverRotate}
              emailBoxClass={classes.emailBox}
              emailTextClass={classes.emailText}
            />

            {/* Social Icons */}
            <div className='pt-2'>
              <p className={classes.socialText}>Or connect via:</p>
              <div className='flex gap-5'>
                <motion.a
                  href='https://bsky.app/profile/ffi.pw'
                  className='group'
                  aria-label='primaryskye'
                  {...animations.hoverY}
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
    )
  },
)

ContactInfo.displayName = 'ContactInfo'

export default ContactInfo
