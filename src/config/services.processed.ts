import servicesData from './services.json'

export interface ServiceItem {
  title: string
  price?: string
  description?: string
}

export interface Service {
  id: string
  title: string
  slug: string
  description: string
  items: ServiceItem[]
  features: string[]
  technologies: string[]
  available?: boolean
}

// Freeze for immutability and optimization
export const SERVICES: readonly Service[] = Object.freeze(
  servicesData.services.map((service) =>
    Object.freeze({
      ...service,
      items: Object.freeze(service.items),
      features: Object.freeze(service.features),
      technologies: Object.freeze(service.technologies),
    }),
  ),
) as readonly Service[]

export const SERVICES_BY_ID = new Map<string, Service>(
  SERVICES.map((service) => [service.id, service]),
)

export const SERVICES_BY_SLUG = new Map<string, Service>(
  SERVICES.map((service) => [service.slug, service]),
)

export const AVAILABLE_SERVICES = SERVICES.filter((s) => s.available !== false)

// Pre-calculate initial z-indices
export const getInitialZIndices = (): Record<string, number> =>
  Object.fromEntries(SERVICES.map((service, index) => [service.id, index + 1]))

// Pre-calculate rotations based on device type
export const getServiceRotations = (isMobile: boolean): number[] =>
  SERVICES.map(() => (isMobile ? Math.random() * 0.5 - 0.25 : Math.random() * 1.5 - 0.75))
