import { Link } from 'react-router-dom'
import { MapPin } from 'lucide-react'
export default function About() {
  return (
    <div style={{paddingTop:56,background:'white',minHeight:'100vh'}}>
      <div style={{borderBottom:'1px solid var(--border)',padding:'3rem 2rem',background:'var(--bg)'}}>
        <div style={{maxWidth:800,margin:'0 auto'}}>
          <div style={{fontSize:11,fontWeight:700,letterSpacing:'0.1em',textTransform:'uppercase',color:'var(--text3)',marginBottom:'1rem'}}>About this project</div>
          <h1 style={{fontFamily:'var(--serif)',fontSize:'clamp(32px,5vw,60px)',fontWeight:400,fontStyle:'italic',letterSpacing:'-0.02em',marginBottom:'1rem',lineHeight:1.05}}>Why AccessWatch exists</h1>
          <p style={{fontSize:16,color:'var(--text2)',lineHeight:1.8}}>Where you live in America quietly determines how fast help arrives when your life is on the line. AccessWatch makes that gap visible — city by city, in plain language, with full data transparency.</p>
        </div>
      </div>
      <div style={{maxWidth:800,margin:'0 auto',padding:'3rem 2rem'}}>
        <p style={{fontSize:16,color:'var(--text2)',lineHeight:1.9,marginBottom:'2rem'}}>Ambulance response times are measurably slower in lower-income neighborhoods in many major US cities. Naloxone — the medication that reverses opioid overdoses in minutes — is distributed unevenly across the country. Both gaps cost lives.</p>
        <p style={{fontSize:16,color:'var(--text2)',lineHeight:1.9,marginBottom:'3rem'}}>No single, free, publicly accessible tool existed to show this gap, city by city. AccessWatch is that tool. Every score is calculated from publicly available government data using a methodology anyone can verify or build on.</p>
        <div style={{borderLeft:'3px solid var(--accent)',paddingLeft:'1.5rem',marginBottom:'3rem'}}>
          <p style={{fontSize:18,fontStyle:'italic',lineHeight:1.5,marginBottom:'0.75rem',letterSpacing:'-0.01em'}}>"The first step to fixing a problem is being able to see it clearly."</p>
          <p style={{fontSize:14,color:'var(--text2)'}}>AccessWatch does not prescribe policy. It reports facts and lets residents, journalists, and city officials decide what to do with them.</p>
        </div>
        <div style={{background:'var(--bg)',border:'1px solid var(--border)',borderRadius:12,padding:'2rem',marginBottom:'1.5rem'}}>
          <h2 style={{fontSize:20,fontWeight:700,marginBottom:'1.25rem'}}>Built by</h2>
          <div style={{display:'flex',alignItems:'center',gap:16,marginBottom:'1.25rem'}}>
            <div style={{width:52,height:52,borderRadius:'50%',background:'linear-gradient(135deg,var(--accent),#6366f1)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:22,fontWeight:800,color:'white',flexShrink:0}}>M</div>
            <div>
              <div style={{fontSize:16,fontWeight:700}}>Manideep Kathula</div>
              <div style={{fontSize:13,color:'var(--text2)',display:'flex',alignItems:'center',gap:4,marginTop:3}}><MapPin size={11}/> Warangal, India → Boston, MA · M.S. Project Management, Harrisburg University</div>
            </div>
          </div>
          <p style={{fontSize:14,color:'var(--text2)',lineHeight:1.75,marginBottom:'1.25rem'}}>I'm a Business Analyst and M.S. Project Management student with experience in data systems and product development. I built AccessWatch as an original public-interest project to make emergency equity data accessible to everyone — not just researchers with database access.</p>
          <div style={{display:'flex',gap:10,flexWrap:'wrap'}}>
            <a href="https://linkedin.com/in/manideepkathula" target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{fontSize:13}}>LinkedIn ↗</a>
            <a href="https://first-door.vercel.app" target="_blank" rel="noopener noreferrer" className="btn btn-outline" style={{fontSize:13}}>FirstDoor Project ↗</a>
            <a href="https://github.com/Manideepkathula/Access-watch" target="_blank" rel="noopener noreferrer" className="btn btn-outline" style={{fontSize:13}}>GitHub ↗</a>
          </div>
        </div>
        <div style={{background:'var(--bg)',border:'1px solid var(--border)',borderRadius:12,padding:'2rem'}}>
          <h2 style={{fontSize:18,fontWeight:700,marginBottom:'0.75rem'}}>Open Source · Free Forever</h2>
          <p style={{fontSize:14,color:'var(--text2)',lineHeight:1.75}}>All data, code, and methodology is publicly available on GitHub. Built entirely with free tools and free public data at $0/month. Researchers, journalists, and city officials are welcome to download the data, verify the calculations, or build on this work.</p>
        </div>
      </div>
    </div>
  )
}
