import { Routes, Route } from 'react-router-dom'
import { lazy, Suspense, type FC } from 'react'
import Layout from './components/layout/Layout'
import LoadingSpinner from './components/ui/LoadingSpinner.tsx'
import Home from './pages/Home.tsx'

// Chunking everything but the home page to stay under 500kb chunksize for now
const Services = lazy(() => import('./pages/Services.tsx'))
const Service = lazy(() => import('./pages/Service.tsx'))
const Contact = lazy(() => import('./pages/Contact.tsx'))
const Commands = lazy(() => import('./pages/Commands.tsx'))

const App: FC = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route index element={<Home />} />
          <Route path='services' element={<Services />} />
          <Route path='services/:slug' element={<Service />} />
          <Route path='contact' element={<Contact />} />
          <Route path='commands' element={<Commands />} />
        </Route>
      </Routes>
    </Suspense>
  )
}

export default App
