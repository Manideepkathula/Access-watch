import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const loc = useLocation()
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])
  return (
    <nav style={{
      position:'fixed',top:0,left:0,right:0,zIndex:500,
      background:scrolled?'rgba(6,8,16,0.94)':'transparent',
      backdropFilter:scrolled?'blur(20px)':'none',
      borderBottom:scrolled?'1px solid rgba(255,255,255,0.06)':'none',
      transition:'all 0.3s',
    }}>
      <div style={{display:'flex',alignItems:'center',height:60,maxWidth:1300,margin:'0 auto',padding:'0 2rem'}}>
        <Link to="/" style={{display:'flex',alignItems:'center',gap:10,marginRight:'auto',textDecoration:'none'}}>
          <div style={{width:30,height:30,borderRadius:8,background:'linear-gradient(135deg,#4f8ef7,#1d4ed8)',display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 0 16px rgba(79,142,247,0.4)'}}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
          </div>
          <div>
            <div style={{fontSize:15,fontWeight:800,letterSpacing:'-0.025em',color:'var(--text)',lineHeight:1.1}}>AccessWatch</div>
            <div style={{fontSize:9,color:'var(--text3)',letterSpacing:'0.1em',textTransform:'uppercase',fontWeight:600}}>Emergency Equity Index</div>
          </div>
        </Link>
        <div style={{display:'flex',gap:2,alignItems:'center'}}>
          {[{to:'/',l:'Index'},{to:'/methodology',l:'Methodology'},{to:'/about',l:'About'}].map(({to,l})=>(
            <Link key={to} to={to} style={{fontSize:13,padding:'6px 14px',borderRadius:6,color:loc.pathname===to?'var(--accent2)':'var(--text2)',fontWeight:loc.pathname===to?600:400,background:loc.pathname===to?'rgba(79,142,247,0.1)':'transparent',transition:'all 0.15s',textDecoration:'none'}}
              onMouseEnter={e=>{if(loc.pathname!==to){e.currentTarget.style.color='var(--text)';e.currentTarget.style.background='rgba(255,255,255,0.05)'}}}
              onMouseLeave={e=>{if(loc.pathname!==to){e.currentTarget.style.color='var(--text2)';e.currentTarget.style.background='transparent'}}}
            >{l}</Link>
          ))}
          <a href="https://github.com/Manideepkathula/Access-watch" target="_blank" rel="noopener noreferrer" style={{marginLeft:10,fontSize:13,padding:'7px 16px',background:'rgba(79,142,247,0.1)',border:'1px solid rgba(79,142,247,0.25)',borderRadius:8,color:'var(--accent2)',fontWeight:500,transition:'all 0.2s',textDecoration:'none'}}
            onMouseEnter={e=>e.currentTarget.style.background='rgba(79,142,247,0.2)'}
            onMouseLeave={e=>e.currentTarget.style.background='rgba(79,142,247,0.1)'}
          >Open Source ↗</a>
        </div>
      </div>
    </nav>
  )
}
