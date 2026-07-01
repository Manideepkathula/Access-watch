import { useEffect, useState } from 'react'

export function useMobile() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  useEffect(() => {
    const fn = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', fn)
    return () => window.removeEventListener('resize', fn)
  }, [])
  return isMobile
}

// Responsive grid helper
export function Grid({ cols = '1fr 1fr', mobileCols = '1fr', gap = 16, children, style = {} }) {
  const isMobile = useMobile()
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: isMobile ? mobileCols : cols,
      gap,
      ...style
    }}>
      {children}
    </div>
  )
}
