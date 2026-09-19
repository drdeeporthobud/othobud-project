import { useEffect, useRef } from "react"

export function useReveal() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible")
          }
        })
      },
      { threshold: 0.08, rootMargin: "0px 0px -20px 0px" },
    )

    const observeElements = () => {
      const children = el.querySelectorAll(".reveal")
      children.forEach((child) => observer.observe(child))
      if (el.classList.contains("reveal")) observer.observe(el)
    }

    observeElements()

    // Observe any child mutations when tabs switch
    const mutationObserver = new MutationObserver(() => {
      observeElements()
    })
    mutationObserver.observe(el, { childList: true, subtree: true })

    return () => {
      observer.disconnect()
      mutationObserver.disconnect()
    }
  }, [])

  return ref
}

export function useCountUp(target: number, duration = 1800) {
  const ref = useRef<HTMLSpanElement>(null)
  const started = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !started.current) {
            started.current = true
            const start = performance.now()
            const step = (now: number) => {
              const progress = Math.min((now - start) / duration, 1)
              const eased = 1 - Math.pow(1 - progress, 3)
              el.textContent = Math.round(eased * target).toString()
              if (progress < 1) requestAnimationFrame(step)
            }
            requestAnimationFrame(step)
          }
        })
      },
      { threshold: 0.5 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [target, duration])

  return ref
}
