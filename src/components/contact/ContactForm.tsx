import { memo, type FC, type FormEvent, type ChangeEvent } from 'react'
import { motion } from 'framer-motion'
import clsx from 'clsx'
import { combineThemePatterns, themePatterns } from '../../utils/themeClasses'
import GridPattern from '../common/GridPattern'

interface FormData {
  name: string
  subject: string
  message: string
}

interface ContactFormProps {
  formData: FormData
  isSending: boolean
  isDarkMode: boolean
  shouldAnimate: boolean
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  onSubmit: (e: FormEvent<HTMLFormElement>) => void
  animations: {
    slideRight: Record<string, any>
    formFieldHover: Record<string, any>
    hoverTap: Record<string, any>
  }
  classes: {
    formContainer: string
    input: string
    button: string
  }
}

const ContactForm: FC<ContactFormProps> = memo(
  ({ formData, isSending, isDarkMode, shouldAnimate, onChange, onSubmit, animations, classes }) => {
    return (
      <motion.div
        className={classes.formContainer}
        {...animations.slideRight}
        whileHover={shouldAnimate ? { scale: 1.005 } : {}}
      >
        <motion.div
          whileHover={shouldAnimate ? { scale: 1 } : {}}
          transition={shouldAnimate ? { type: 'spring', stiffness: 300 } : {}}
        >
          <GridPattern isDarkMode={isDarkMode} />

          <form onSubmit={onSubmit} className='space-y-4 fira relative z-10'>
            {/* Name Field */}
            <motion.div {...animations.formFieldHover}>
              <input
                type='text'
                name='name'
                value={formData.name}
                onChange={onChange}
                placeholder='Your Name'
                required
                autoComplete='name'
                className={classes.input}
              />
            </motion.div>

            {/* Subject Field */}
            <motion.div {...animations.formFieldHover}>
              <input
                type='text'
                name='subject'
                value={formData.subject}
                onChange={onChange}
                placeholder='Subject'
                required
                autoComplete='off'
                className={classes.input}
              />
            </motion.div>

            {/* Message Field */}
            <motion.div {...animations.formFieldHover}>
              <textarea
                name='message'
                value={formData.message}
                onChange={onChange}
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
              {...(!isSending ? animations.hoverTap : {})}
            >
              <span className={combineThemePatterns(isDarkMode, 'fira', themePatterns.accent.text)}>
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
    )
  },
)

ContactForm.displayName = 'ContactForm'

export default ContactForm
