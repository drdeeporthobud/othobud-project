import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  useNavigate,
} from "react-router-dom"
import { useEffect, lazy, Suspense } from "react"
import { SpeedInsights } from "@vercel/speed-insights/react"
import Navigation from "./components/Navigation"
import BookingNavigation from "./components/BookingNavigation"
import Footer from "./components/Footer"

// Eager load the landing page for maximum initial render performance
import Home from "./pages/Home"

// Route-level code-splitting for all secondary & administrative pages
const About = lazy(() => import("./pages/About"))
const Treatments = lazy(() => import("./pages/Treatments"))
const PatientResources = lazy(() => import("./pages/PatientResources"))
const Blog = lazy(() => import("./pages/Blog"))
const Gallery = lazy(() => import("./pages/Gallery"))
const Contact = lazy(() => import("./pages/Contact"))
const BookAppointment = lazy(() => import("./pages/BookAppointment"))
const MyBooking = lazy(() => import("./pages/MyBooking"))
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"))

function PageLoadingFallback() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
      <div className="w-9 h-9 border-3 border-sky-100 border-t-primary rounded-full animate-spin" />
      <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase">
        Loading...
      </span>
    </div>
  )
}

const PAGE_TITLES: Record<string, string> = {
  "/": "Dr. Deep Chakraborty | Orthopedic Surgeon in Kolkata",
  "/about": "About Dr. Deep Chakraborty | Qualifications & Experience",
  "/treatments": "Treatments & Surgeries | Robotic Knee & Hip Replacement",
  "/patient-resources": "Patient Resources & Recovery Guides | Orthobud",
  "/blog": "Orthopedic Health Blog & Articles | Dr. Deep Chakraborty",
  "/gallery": "Clinic & Surgical Gallery | Patient Care in Kolkata",
  "/contact":
    "Contact & Clinic Locations | Newtown, Salt Lake, Barasat & Anandapur",
  "/book-appointment": "Book an Appointment | Dr. Deep Chakraborty",
  "/my-booking": "Track Your Booking | Appointment Status",
  "/admin": "Staff Gateway & Admin Portal | Orthobud Practice",
}

function PageTitleManager() {
  const { pathname } = useLocation()
  useEffect(() => {
    const title =
      PAGE_TITLES[pathname] ||
      "Dr. Deep Chakraborty | Orthopedic Surgeon in Kolkata"
    document.title = title
  }, [pathname])
  return null
}

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" })
  }, [pathname])
  return null
}

function GlobalShortcutListener() {
  const navigate = useNavigate()
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl + Shift + L or Cmd + Shift + L opens /admin
      if (
        (e.ctrlKey || e.metaKey) &&
        e.shiftKey &&
        (e.key === "L" || e.key === "l")
      ) {
        e.preventDefault()
        navigate("/admin")
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [navigate])
  return null
}

function Layout() {
  const location = useLocation()
  const isAdmin = location.pathname === "/admin"
  const isBookAppointment = location.pathname === "/book-appointment"

  return (
    <>
      <PageTitleManager />
      <ScrollToTop />
      <GlobalShortcutListener />
      {!isAdmin && !isBookAppointment && <Navigation />}
      {isBookAppointment && <BookingNavigation />}
      <main>
        <Suspense fallback={<PageLoadingFallback />}>
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
        </Suspense>
      </main>
      {!isAdmin && <Footer />}
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout />
      <SpeedInsights />
    </BrowserRouter>
  )
}
