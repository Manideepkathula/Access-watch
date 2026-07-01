import { useParams, Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Info } from 'lucide-react'
import { useEffect, useRef } from 'react'
import scores from '../data/scores.json'
import ScoreBadge from '../components/ScoreBadge'
import ScrollReveal from '../components/ScrollReveal'

const GRADE_COLOR = { A:'#22c55e', B:'#84cc16', C:'#f59e0b', D:'#f97316', F:'#ef4444' }
const GRADE_LABEL = { A:'Excellent', B:'Good', C:'Moderate', D:'Poor', F:'Critical' }

function AnimatedBar({ value, color }) {
  const ref = useRef(null)
  useEffect(() => {
    if (ref.current) {
      ref.current.style.width = '0%'
      setTimeout(() => {
        if (ref.current) {
          ref.current.style.transition = 'width 1.2s cubic-bezier(0.16,1,0.3,1)'
          ref.current.style.width = `${value}%`
        }
      }, 300)
    }
  }, [value])
  return (
    <div style={{width:'100%',height:10,borderRadius:5,background:'rgba(255,255,255,0.06)',overflow:'hidden',position:'relative',border:'1px solid rgba(255,255,255,0.05)'}}>
      <div ref={ref} style={{height:'100%',borderRadius:5,background:`linear-gradient(90deg,${color}80,${color})`,boxShadow:`0 0 12px ${color}60`}}/>
    </div>
  )
}

export default function City() {
  const { id } = useParams()
  const city = scores.find(c => c.id === id)
  if (!city) return (
    <div style={{paddingTop:100,textAlign:'center',padding:'8rem 2rem'}}>
      <div style={{fontSize:18,fontWeight:600,marginBottom:'1rem'}}>City not found</div>
      <Link to="/" className="btn btn-primary">← Back to Index</Link>
    </div>
  )
  const color = GRADE_COLOR[city.grade]
  const nearby = scores.filter(c => c.id!==id && Math.abs(c.lat-city.lat)<6 && Math.abs(c.lng-city.lng)<9).slice(0,5)

  return (
    <div style={{paddingTop:60,background:'var(--bg)',minHeight:'100vh'}}>
      <style>{`@keyframes gridMove{0%{background-position:0 0}100%{background-position:60px 60px}}`}</style>

      {/* Header */}
      <div style={{position:'relative',padding:'3.5rem 2rem 3rem',borderBottom:'1px solid var(--border)',overflow:'hidden'}}>
        <div style={{position:'absolute',inset:0,backgroundImage:'linear-gradient(rgba(79,142,247,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(79,142,247,0.03) 1px,transparent 1px)',backgroundSize:'60px 60px',animation:'gridMove 8s linear infinite'}}/>
        <div style={{position:'absolute',inset:0,background:`radial-gradient(ellipse 60% 100% at 80% 50%,${color}08 0%,transparent 70%)`,pointerEvents:'none'}}/>
        <div style={{maxWidth:1100,margin:'0 auto',position:'relative'}}>
          <Link to="/" style={{display:'inline-flex',alignItems:'center',gap:6,fontSize:13,color:'var(--text2)',marginBottom:'2rem',textDecoration:'none',transition:'color 0.15s'}}
            onMouseEnter={e=>e.currentTarget.style.color='var(--accent2)'}
            onMouseLeave={e=>e.currentTarget.style.color='var(--text2)'}
          ><ArrowLeft size={14}/> Back to Index</Link>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',gap:'2rem',flexWrap:'wrap'}}>
            <div>
              <div className="label" style={{marginBottom:'0.75rem'}}>City Report · Rank #{city.rank} of {scores.length}</div>
              <h1 style={{fontFamily:'var(--serif)',fontSize:'clamp(32px,5vw,64px)',fontWeight:400,fontStyle:'italic',letterSpacing:'-0.02em',marginBottom:'0.5rem',lineHeight:1.05}}>{city.name}</h1>
              <div style={{fontSize:15,color:'var(--text2)',marginBottom:'1.5rem'}}>{city.state} · Pop. {city.pop.toLocaleString()}</div>
              <div style={{display:'flex',gap:10,flexWrap:'wrap',alignItems:'center'}}>
                <div style={{display:'inline-flex',alignItems:'center',gap:8,padding:'7px 16px',borderRadius:8,background:`${color}12`,border:`1px solid ${color}30`,boxShadow:`0 0 16px ${color}20`}}>
                  <div style={{width:8,height:8,borderRadius:'50%',background:color,boxShadow:`0 0 8px ${color}`}}/>
                  <span style={{fontSize:14,fontWeight:800,color}}>Grade {city.grade} — {GRADE_LABEL[city.grade]}</span>
                </div>
                <div style={{display:'inline-flex',alignItems:'center',gap:6,padding:'7px 14px',borderRadius:8,background:'rgba(255,255,255,0.05)',border:'1px solid var(--border2)',fontSize:12,color:'var(--text2)'}}>
                  {city.hasLiveData ? '🔴 Live API data' : '📊 Research estimate'}
                </div>
              </div>
            </div>
            <ScoreBadge score={city.score} grade={city.grade} size="lg" animate={true}/>
          </div>
        </div>
      </div>

      <div style={{maxWidth:1100,margin:'0 auto',padding:'3rem 2rem'}}>
        <div style={{display:'grid',gridTemplateColumns:'1fr 300px',gap:'2rem',alignItems:'start'}}>
          <div style={{display:'flex',flexDirection:'column',gap:'1.5rem'}}>

            {/* EMS */}
            <ScrollReveal>
              <div className="card" style={{padding:'2rem'}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'1.5rem',gap:'1rem'}}>
                  <div style={{flex:1}}>
                    <div className="label" style={{marginBottom:'0.5rem',color:'var(--accent2)'}}>Component 1 · 50% weight</div>
                    <h2 style={{fontSize:22,fontWeight:700,letterSpacing:'-0.02em',marginBottom:'0.75rem'}}>EMS Response Equity</h2>
                    <p style={{fontSize:14,color:'var(--text2)',lineHeight:1.7}}>
                      {city.emsScore>=65?`${city.name} shows relatively equitable EMS response times across income levels.`
                      :city.emsScore>=50?`${city.name} shows moderate EMS equity with measurable gaps between wealthier and lower-income neighborhoods.`
                      :`${city.name} shows significant EMS response time disparities. Lower-income neighborhoods experience notably longer wait times.`}
                    </p>
                  </div>
                  <div style={{textAlign:'right',flexShrink:0}}>
                    <div style={{fontSize:44,fontWeight:900,color,letterSpacing:'-0.04em',lineHeight:1,textShadow:`0 0 20px ${color}60`}}>{city.emsScore}</div>
                    <div style={{fontSize:12,color:'var(--text3)'}}>out of 100</div>
                  </div>
                </div>
                <AnimatedBar value={city.emsScore} color={color}/>
                <div style={{marginTop:'1.25rem',padding:'1rem',background:'rgba(255,255,255,0.03)',borderRadius:8,border:'1px solid var(--border)'}}>
                  <div style={{fontSize:12,fontWeight:600,color:'var(--text2)',marginBottom:4,display:'flex',alignItems:'center',gap:5}}><Info size={12}/> What this measures</div>
                  <p style={{fontSize:13,color:'var(--text3)',lineHeight:1.65}}>Disparity in 911/ambulance response times between high-income and low-income areas. Score of 100 = no gap. Score of 0 = extreme disparity.</p>
                </div>
                <div style={{marginTop:'1rem',fontSize:12,color:'var(--text4)'}}>Source: {city.sources.ems} · {city.lastUpdated}</div>
              </div>
            </ScrollReveal>

            {/* Naloxone */}
            <ScrollReveal delay={80}>
              <div className="card" style={{padding:'2rem'}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'1.5rem',gap:'1rem'}}>
                  <div style={{flex:1}}>
                    <div className="label" style={{marginBottom:'0.5rem',color:'var(--accent2)'}}>Component 2 · 50% weight</div>
                    <h2 style={{fontSize:22,fontWeight:700,letterSpacing:'-0.02em',marginBottom:'0.75rem'}}>Naloxone Access</h2>
                    <p style={{fontSize:14,color:'var(--text2)',lineHeight:1.7}}>
                      {city.naloxoneScore>=65?`${city.state} has above-average naloxone dispensing — better community access to overdose-reversal medicine.`
                      :city.naloxoneScore>=40?`${city.state} has moderate naloxone access, near the US average of 0.4 per 100 persons.`
                      :`${city.state} has below-average naloxone dispensing, indicating limited community access.`}
                    </p>
                  </div>
                  <div style={{textAlign:'right',flexShrink:0}}>
                    <div style={{fontSize:44,fontWeight:900,color:'var(--accent2)',letterSpacing:'-0.04em',lineHeight:1,textShadow:'0 0 20px rgba(122,179,255,0.4)'}}>{city.naloxoneScore}</div>
                    <div style={{fontSize:12,color:'var(--text3)'}}>out of 100</div>
                  </div>
                </div>
                <AnimatedBar value={city.naloxoneScore} color="var(--accent)"/>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginTop:'1.25rem'}}>
                  <div style={{padding:'1rem',background:'rgba(79,142,247,0.06)',borderRadius:8,border:'1px solid rgba(79,142,247,0.15)'}}>
                    <div className="label" style={{marginBottom:4}}>State rate 2024</div>
                    <div style={{fontSize:26,fontWeight:900,color:'var(--accent2)'}}>{city.naloxoneRate}<span style={{fontSize:13,color:'var(--text3)'}}>/100</span></div>
                    <div style={{fontSize:12,color:'var(--text3)'}}>Rx per 100 persons/yr</div>
                  </div>
                  <div style={{padding:'1rem',background:'rgba(255,255,255,0.03)',borderRadius:8,border:'1px solid var(--border)'}}>
                    <div className="label" style={{marginBottom:4}}>vs National avg</div>
                    <div style={{fontSize:26,fontWeight:900,color:'var(--text2)'}}>0.4<span style={{fontSize:13,color:'var(--text3)'}}>/100</span></div>
                    <div style={{fontSize:12,fontWeight:600,color:city.naloxoneRate>0.4?'#22c55e':city.naloxoneRate<0.4?'#ef4444':'var(--text3)'}}>
                      {city.naloxoneRate>0.4?`↑ ${((city.naloxoneRate-0.4)/0.4*100).toFixed(0)}% above avg`:city.naloxoneRate<0.4?'↓ Below average':'→ At average'}
                    </div>
                  </div>
                </div>
                <div style={{marginTop:'1rem',fontSize:12,color:'var(--text4)'}}>Source: {city.sources.naloxone} · {city.lastUpdated}</div>
              </div>
            </ScrollReveal>
          </div>

          {/* Sidebar */}
          <div style={{display:'flex',flexDirection:'column',gap:'1.25rem'}}>
            <ScrollReveal delay={40}>
              <div className="card" style={{padding:'1.5rem'}}>
                <div className="label" style={{marginBottom:'1rem'}}>Score summary</div>
                {[
                  {l:'Overall score',v:`${city.score}/100`,c:color},
                  {l:'EMS equity',v:`${city.emsScore}/100`,c:color},
                  {l:'Naloxone access',v:`${city.naloxoneScore}/100`,c:'var(--accent2)'},
                  {l:'National rank',v:`#${city.rank} of ${scores.length}`,c:'var(--text)'},
                ].map(r=>(
                  <div key={r.l} style={{display:'flex',justifyContent:'space-between',padding:'9px 0',borderBottom:'1px solid var(--border)'}}>
                    <span style={{fontSize:13,color:'var(--text2)'}}>{r.l}</span>
                    <span style={{fontSize:14,fontWeight:700,color:r.c}}>{r.v}</span>
                  </div>
                ))}
              </div>
            </ScrollReveal>
            <ScrollReveal delay={100}>
              <div className="card" style={{padding:'1.5rem'}}>
                <div className="label" style={{marginBottom:'1rem'}}>Data sources</div>
                <div style={{fontSize:12,color:'var(--text2)',lineHeight:1.7,marginBottom:'0.5rem'}}><strong style={{color:'var(--text)'}}>EMS:</strong> {city.sources.ems}</div>
                <div style={{fontSize:12,color:'var(--text2)',lineHeight:1.7,marginBottom:'0.5rem'}}><strong style={{color:'var(--text)'}}>Naloxone:</strong> {city.sources.naloxone}</div>
                <div style={{fontSize:12,color:'var(--text2)',lineHeight:1.7}}><strong style={{color:'var(--text)'}}>Demographics:</strong> {city.sources.demographics}</div>
                <div style={{marginTop:'1rem',paddingTop:'0.75rem',borderTop:'1px solid var(--border)',fontSize:12}}>
                  <Link to="/methodology" style={{color:'var(--accent2)'}}>Full methodology →</Link>
                </div>
              </div>
            </ScrollReveal>
            {nearby.length>0 && (
              <ScrollReveal delay={140}>
                <div className="card" style={{padding:'1.5rem'}}>
                  <div className="label" style={{marginBottom:'1rem'}}>Nearby cities</div>
                  {nearby.map(c=>(
                    <Link key={c.id} to={`/city/${c.id}`} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'8px 0',borderBottom:'1px solid var(--border)',textDecoration:'none',transition:'opacity 0.15s'}}
                      onMouseEnter={e=>e.currentTarget.style.opacity='0.65'}
                      onMouseLeave={e=>e.currentTarget.style.opacity='1'}
                    >
                      <div>
                        <div style={{fontSize:13,fontWeight:600}}>{c.name}</div>
                        <div style={{fontSize:11,color:'var(--text3)'}}>#{c.rank}</div>
                      </div>
                      <div style={{fontSize:16,fontWeight:900,color:GRADE_COLOR[c.grade],textShadow:`0 0 10px ${GRADE_COLOR[c.grade]}60`}}>{c.score}</div>
                    </Link>
                  ))}
                </div>
              </ScrollReveal>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
