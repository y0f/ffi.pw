import { useState, type FC } from 'react'
import { motion } from 'framer-motion'
import { useKeenSlider } from 'keen-slider/react'
import type { KeenSliderInstance } from 'keen-slider'
import 'keen-slider/keen-slider.min.css'
import reviews from '../config/reviews.json'
import { useTheme } from '../hooks/useTheme'
import clsx from 'clsx'
import ReviewCard from '../components/reviews/ReviewCard'
import HexagonNavigation from '../components/reviews/HexagonNavigation'

interface Review {
  id: number
  name: string
  position: string
  date: string
  relationship: string
  content: string
}

const typedReviews = reviews as Review[]

const Reviews: FC = () => {
  const [currentSlide, setCurrentSlide] = useState<number>(0)
  const [loaded, setLoaded] = useState<boolean>(false)
  const { isDarkMode } = useTheme()

  const [sliderRef, slider] = useKeenSlider<HTMLDivElement>({
    initial: 0,
    slideChanged(s: KeenSliderInstance) {
      setCurrentSlide(s.track.details.rel)
    },
    created() {
      setLoaded(true)
    },
    loop: true,
    mode: 'free-snap',
    slides: {
      origin: 'center',
      perView: 1.1,
      spacing: 16,
    },
    breakpoints: {
      '(min-width: 640px)': {
        slides: {
          origin: 'center',
          perView: 1.2,
          spacing: 20,
        },
      },
      '(min-width: 768px)': {
        slides: {
          origin: 'center',
          perView: 1.5,
          spacing: 30,
        },
      },
      '(min-width: 1024px)': {
        slides: {
          origin: 'center',
          perView: 1.5,
          spacing: 40,
        },
      },
    },
  })

  const goToSlide = (index: number) => {
    if (!slider.current) return
    slider.current.moveToIdx(index)
  }

  const containerClass = clsx(
    'max-h-screen flex flex-col items-center p-3 relative overflow-hidden pb-4 sm:pb-6',
    isDarkMode ? 'bg-transparent' : 'bg-transparent',
  )

  return (
    <div className={containerClass}>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className='text-center pb-6 mb-4 sm:mb-6 md:mb-8 py-4 relative overflow-hidden w-full max-w-7xl'
      >
        <h1
          className={clsx(
            'text-3xl md:text-4xl fira mb-2 md:mb-4 animate-fade-in',
            isDarkMode
              ? 'text-white [text-shadow:0_0_6px_#fff]'
              : 'text-gray-800 [text-shadow:0_0_6px_rgba(0,0,0,0.2)]',
          )}
        >
          REVIEWS
        </h1>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={clsx(
            'fira-thin text-xs sm:text-sm md:text-base border-t pt-2 md:pt-3 inline-block',
            isDarkMode ? 'text-gray-300 border-neutral-200/20' : 'text-gray-600 border-gray-800/30',
          )}
        >
          <span className='typed-out fira-thin'>Feedback on my work</span>
        </motion.div>
      </motion.div>

      <div className='relative w-full max-w-5xl mx-auto px-2 sm:px-4 z-10 mt-0 md:mt-0'>
        <div className='relative'>
          <div
            className={clsx(
              'absolute -inset-1 sm:-inset-2 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500',
              isDarkMode ? 'bg-primary-400/20' : 'bg-primary-400/20',
            )}
          />
          <div
            ref={sliderRef}
            className='keen-slider min-h-[300px] h-screen max-h-[290px] md:max-h-[300px] lg:max-h-[310px]'
          >
            {typedReviews.map((review, index) => (
              <div key={review.id} className='keen-slider__slide'>
                <ReviewCard
                  review={review}
                  isActive={currentSlide === index}
                  isDarkMode={isDarkMode}
                />
              </div>
            ))}
          </div>
        </div>

        {loaded && (
          <HexagonNavigation
            currentSlide={currentSlide}
            totalSlides={typedReviews.length}
            onSelect={goToSlide}
            isDarkMode={isDarkMode}
          />
        )}
      </div>
    </div>
  )
}

export default Reviews
