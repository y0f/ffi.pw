import type { FC } from 'react'

const LoadingSpinner: FC = () => {
  return (
    <div className='flex justify-center items-center'>
      <div className='w-12 h-12 border-4 border-primary-500 border-dashed rounded-full animate-spin' />
    </div>
  )
}

export default LoadingSpinner
