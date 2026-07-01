import { useEffect, useRef } from 'react'

const COLORS = { A:'#22c55e', B:'#84cc16', C:'#f59e0b', D:'#f97316', F:'#ef4444' }
const LABELS = { A:'Excellent', B:'Good', C:'Moderate', D:'Poor', F:'Critical' }

export default function ScoreBadge({ score, grade, size='md', animate=false }) {
  const circleRef = useRef(null)
  const color = COLORS[grade] || '#f59e0b'
  const sz = size==='lg' ? 120 : size==='sm' ? 52 : 80
  const r = sz * 0.4
  const circ = 2 * Math.PI * r
  const offset = circ - (score / 100) * circ
  const fs = size==='lg' ? 32 : size==='sm' ? 16 : 22
  const strokeW = size==='lg' ? 7 : size==='sm' ? 4 : 5

  useEffect(() => {
    if (animate && circleRef.current) {
      circleRef.current.style.strokeDashoffset = circ
      setTimeout(() => {
        if (circleRef.current) {
          circleRef.current.style.transition = 'stroke-dashoffset 1.4s cubic-bezier(0.16,1,0.3,1)'
          circleRef.current.style.strokeDashoffset = offset
        }
      }, 200)
    }
  }, [animate, offset, circ])

  return (
    <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:6,position:'relative'}}>
      {/* Glow */}
      <div style={{position:'absolute',width:sz,height:sz,borderRadius:'50%',background:`radial-gradient(circle, ${color}20 0%, transparent 70%)`,filter:'blur(8px)',animation:'glow 3s ease-in-out infinite'}}/>
      <svg width={sz} height={sz} viewBox={`0 0 ${sz} ${sz}`} style={{transform:'rotate(-90deg)',position:'relative',zIndex:1}}>
        {/* Track */}
        <circle cx={sz/2} cy={sz/2} r={r} fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.08)" strokeWidth={strokeW}/>
        {/* Progress */}
        <circle ref={circleRef} cx={sz/2} cy={sz/2} r={r} fill="none"
          stroke={color} strokeWidth={strokeW} strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={animate ? circ : offset}
          style={{filter:`drop-shadow(0 0 ${size==='lg'?8:4}px ${color})`}}
        />
      </svg>
      <div style={{position:'absolute',inset:0,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',zIndex:2}}>
        <div style={{fontSize:fs,fontWeight:900,color,lineHeight:1,letterSpacing:'-0.04em'}}>{score}</div>
        <div style={{fontSize:fs*0.45,fontWeight:800,color,letterSpacing:'0.06em',opacity:0.8}}>{grade}</div>
      </div>
    </div>
  )
}
