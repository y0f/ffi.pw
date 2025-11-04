import { lazy, Suspense, useEffect, type FC } from 'react'
import { motion, useDragControls, useMotionValue } from 'framer-motion'
import useIsMobile from '../hooks/useIsMobile'
import TerminalWindow from '../components/home/TerminalWindow'

const MobileHome = lazy(() => import('../components/home/MobileHome'))
const terminalDragClass = 'cursor-grab relative z-[30]'

const Home: FC = () => {
  const isMobile = useIsMobile()
  const controls = useDragControls()

  const x = useMotionValue(0)
  const y = useMotionValue(0)

  useEffect(() => {
    const handleResize = () => {
      x.set(0)
      y.set(0)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
    // x and y are stable motion values, don't need to be in dependency array
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const dragProps = !isMobile
    ? {
        drag: true as const,
        dragConstraints: {
          left: -500,
          right: 500,
          top: -75,
          bottom: 155,
        },
        dragElastic: 0.5,
        dragControls: controls,
        dragMomentum: false,
      }
    : {}

  return (
    <div className='terminal-ignore-grid min-h-[70vh] pt-0 max-h-screen flex items-center justify-center p-4'>
      {isMobile ? (
        <Suspense fallback={null}>
          <MobileHome />
        </Suspense>
      ) : (
        <motion.div
          {...dragProps}
          className={terminalDragClass}
          style={{
            x,
            y,
          }}
        >
          <TerminalWindow />
        </motion.div>
      )}
    </div>
  )
}

export default Home
