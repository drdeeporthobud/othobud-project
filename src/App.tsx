import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import Navigation from './components/Navigation'
import BookingNavigation from './components/BookingNavigation'
import Footer from './components/Footer'
import Home from './pages/Home'
import About from './pages/About'
import Treatments from './pages/Treatments'
import PatientResources from './pages/PatientResources'
import Blog from './pages/Blog'
import Gallery from './pages/Gallery'
import Contact from './pages/Contact'
import BookAppointment from './pages/BookAppointment'
import MyBooking from './pages/MyBooking'
import AdminDashboard from './pages/AdminDashboard'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname])
  return null
}

function GlobalShortcutListener() {
  const navigate = useNavigate()
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl + Shift + L or Cmd + Shift + L opens /admin
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'L' || e.key === 'l')) {
        e.preventDefault()
        navigate('/admin')
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [navigate])
  return null
}

function Layout() {
  const location = useLocation()
  const isAdmin = location.pathname === '/admin'
  const isBookAppointment = location.pathname === '/book-appointment'

  return (
    <>
      <ScrollToTop />
      <GlobalShortcutListener />
      {!isAdmin && !isBookAppointment && <Navigation />}
      {isBookAppointment && <BookingNavigation />}
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/treatments" element={<Treatments />} />
          <Route path="/patient-resources" element={<PatientResources />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/book-appointment" element={<BookAppointment />} />
          <Route path="/my-booking" element={<MyBooking />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </main>
      {!isAdmin && <Footer />}
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  )
}
