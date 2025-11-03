import { memo, type FC } from 'react'
import withDeviceCapability from '../hoc/withDeviceCapability.tsx'
import Grid from './Grid.tsx'
import Particles from './Particles.tsx'
import Texture from './Texture.tsx'
import TokyoGlow from './TokyoGlow.tsx'

const DeviceAwareParticles = withDeviceCapability(Particles, {
  category: 'background',
  feature: 'particles',
})

const DeviceAwareTokyoGlow = withDeviceCapability(TokyoGlow, {
  category: 'background',
  feature: 'tokyoGlow',
})

const DeviceAwareTexture = withDeviceCapability(Texture, {
  category: 'background',
  feature: 'texture',
})

const DeviceAwareGrid = withDeviceCapability(Grid, {
  category: 'background',
  feature: 'grid',
})

const Background: FC = memo(() => {
  return (
    <>
      <DeviceAwareTokyoGlow />
      <DeviceAwareTexture />
      <DeviceAwareParticles />
      <DeviceAwareGrid />
    </>
  )
})

Background.displayName = 'Background'

export default Background
