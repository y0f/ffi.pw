import { memo, type FC } from 'react'
import ServiceCard from './ServiceCard'
import type { Service } from '../../config/services.processed'

interface MaximizedCardViewProps {
  service: Service
  rotation: number
  zIndex: number
  onClose: () => void
  onMaximize: () => void
}

const MaximizedCardView: FC<MaximizedCardViewProps> = memo(
  ({ service, rotation, zIndex, onClose, onMaximize }) => {
    return (
      <div className='fixed inset-0 pt-12 p-4 z-40 flex items-center justify-center'>
        <ServiceCard
          rotation={rotation}
          title={service.title}
          items={service.items}
          onClose={onClose}
          onMaximize={onMaximize}
          isMaximized={true}
          zIndex={zIndex}
          serviceSlug={service.slug}
          description={service.description}
          features={service.features}
          technologies={service.technologies}
        />
      </div>
    )
  },
)

MaximizedCardView.displayName = 'MaximizedCardView'

export default MaximizedCardView
