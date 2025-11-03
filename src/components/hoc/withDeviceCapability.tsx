import { memo, type ComponentType, type FC } from 'react'
import useDeviceCapability, { type DeviceCapability } from '../../hooks/useDeviceCapability'

interface WithDeviceCapabilityOptions {
  category?: 'background' | 'animations' | 'monitoring'
  feature?: string
  fallback?: ComponentType<{ deviceInfo: DeviceCapability }>
  passDeviceProps?: boolean
}

export default function withDeviceCapability<P extends object>(
  Component: ComponentType<P & { deviceInfo?: DeviceCapability }>,
  options: WithDeviceCapabilityOptions = {},
): FC<P> {
  const { category, feature, fallback: Fallback = null, passDeviceProps = true } = options

  const WrappedComponent: FC<P> = memo((props) => {
    const deviceInfo = useDeviceCapability()
    const shouldRender = category && feature ? deviceInfo.canRender(category, feature) : true

    if (!shouldRender) {
      return Fallback ? <Fallback {...(props as object)} deviceInfo={deviceInfo} /> : null
    }

    const componentProps = passDeviceProps ? { ...props, deviceInfo } : props

    return <Component {...componentProps} />
  })

  const componentName =
    (Component as { displayName?: string }).displayName ||
    (Component as { name?: string }).name ||
    'Component'
  WrappedComponent.displayName = `withDeviceCapability(${componentName})`

  return WrappedComponent
}

export function createDeviceAware<P extends object>(
  Component: ComponentType<P & { deviceInfo?: DeviceCapability }>,
  category: 'background' | 'animations' | 'monitoring',
  feature: string,
): FC<P> {
  return withDeviceCapability(Component, { category, feature })
}
