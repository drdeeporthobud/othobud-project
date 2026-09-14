import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

export default function BookingNavigation() {
  const navigate = useNavigate()

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1)
    } else {
      navigate('/')
    }
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-border/60 shadow-2xs transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-14 sm:h-16">
          {/* Back Button */}
          <button
            onClick={handleBack}
            type="button"
            className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs sm:text-sm font-display font-700 text-navy hover:text-teal hover:bg-soft-gray transition-all cursor-pointer group"
            aria-label="Go back"
          >
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-soft-gray group-hover:bg-teal/10 flex items-center justify-center transition-colors">
              <ArrowLeft className="w-4 h-4 text-navy group-hover:text-teal transition-colors" />
            </div>
            <span>Back</span>
          </button>
        </div>
      </div>
    </header>
  )
}
