import { useEffect, useRef } from 'react'
export default function ScrollReveal({ children, delay=0 }) {
  const ref = useRef(null)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if(e.isIntersecting) e.target.classList.add('visible') }, { threshold:0.08 })
    if(ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])
  return <div ref={ref} className="reveal" style={{transitionDelay:`${delay}ms`}}>{children}</div>
}
