import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Search, ChevronUp, ChevronDown, Minus, RefreshCw, AlertTriangle, ArrowRight } from 'lucide-react'
import scores from '../data/scores.json'
import meta from '../data/meta.json'
import ScrollReveal from '../components/ScrollReveal'
import ScoreBadge from '../components/ScoreBadge'

const GRADE_COLOR = { A:'#22c55e', B:'#84cc16', C:'#f59e0b', D:'#f97316', F:'#ef4444' }
const GRADE_LABEL = { A:'Excellent', B:'Good', C:'Moderate', D:'Poor', F:'Critical' }
const GRADE_GLOW  = { A:'rgba(34,197,94,0.15)', B:'rgba(132,204,22,0.15)', C:'rgba(245,158,11,0.15)', D:'rgba(249,115,22,0.15)', F:'rgba(239,68,68,0.15)' }

export default function Home() {
  const [search, setSearch] = useState('')
  const [sortKey, setSortKey] = useState('rank')
  const [sortDir, setSortDir] = useState('asc')
  const [gradeFilter, setGradeFilter] = useState('all')
  const [mapLoaded, setMapLoaded] = useState(false)
  const [heroVisible, setHeroVisible] = useState(false)
  const mapRef = useRef(null)
  const leafletMap = useRef(null)

  useEffect(() => { setTimeout(() => setHeroVisible(true), 100) }, [])

  const filtered = scores
    .filter(c => (c.name.toLowerCase().includes(search.toLowerCase()) || c.state.toLowerCase().includes(search.toLowerCase())) && (gradeFilter==='all' || c.grade===gradeFilter))
    .sort((a,b) => {
      const d = sortDir==='asc'?1:-1
      if (sortKey==='name') return d*a.name.localeCompare(b.name)
      if (sortKey==='state') return d*a.state.localeCompare(b.state)
      return d*(a[sortKey]-b[sortKey])
    })

  const toggleSort = k => { if(sortKey===k) setSortDir(d=>d==='asc'?'desc':'asc'); else{setSortKey(k);setSortDir('asc')} }
  const SI = ({k}) => sortKey!==k?<Minus size={11} opacity={0.3}/>:sortDir==='asc'?<ChevronUp size={11}/>:<ChevronDown size={11}/>

  useEffect(() => {
    const t = setTimeout(() => {
      if (mapRef.current && !leafletMap.current) {
        import('leaflet').then(L => {
          const Lm = L.default
          const map = Lm.map(mapRef.current, { center:[39.5,-98.35], zoom:4, zoomControl:true, scrollWheelZoom:false, attributionControl:false })
          leafletMap.current = map
          Lm.tileLayer('https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png', { maxZoom:19 }).addTo(map)
          Lm.tileLayer('https://{s}.basemaps.cartocdn.com/dark_only_labels/{z}/{x}/{y}{r}.png', { maxZoom:19, pane:'shadowPane' }).addTo(map)
          scores.forEach(c => {
            const col = GRADE_COLOR[c.grade]
            const outer = Lm.circleMarker([c.lat,c.lng],{radius:14,fillColor:col,color:col,weight:1.5,opacity:0.3,fillOpacity:0.1}).addTo(map)
            const inner = Lm.circleMarker([c.lat,c.lng],{radius:5,fillColor:col,color:'rgba(6,8,16,0.8)',weight:2,opacity:1,fillOpacity:1}).addTo(map)
            const popup = `<div style="min-width:180px">
              <div style="font-size:14px;font-weight:700;margin-bottom:8px;color:#eef0f8">${c.name}, ${c.state}</div>
              <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;padding:10px;background:rgba(255,255,255,0.04);border-radius:8px;border:1px solid rgba(255,255,255,0.08)">
                <div style="font-size:32px;font-weight:900;color:${col};line-height:1;letter-spacing:-0.04em">${c.score}</div>
                <div><div style="font-size:14px;font-weight:800;color:${col}">${c.grade}</div><div style="font-size:11px;color:rgba(238,240,248,0.5)">${GRADE_LABEL[c.grade]}</div></div>
              </div>
              <div style="font-size:12px;color:rgba(238,240,248,0.5);margin-bottom:4px">EMS Equity: <span style="color:#eef0f8;font-weight:600">${c.emsScore}/100</span></div>
              <div style="font-size:12px;color:rgba(238,240,248,0.5);margin-bottom:10px">Naloxone: <span style="color:#eef0f8;font-weight:600">${c.naloxoneScore}/100</span></div>
              <a href="/city/${c.id}" style="display:block;text-align:center;background:#4f8ef7;color:white;border-radius:6px;padding:7px;font-size:12px;font-weight:700;text-decoration:none">View Full Report →</a>
            </div>`
            outer.bindPopup(popup)
            inner.bindPopup(popup)
          })
          setMapLoaded(true)
        })
      }
    }, 300)
    return () => clearTimeout(t)
  }, [])

  const avg = Math.round(scores.reduce((s,c)=>s+c.score,0)/scores.length)
  const gradeCount = scores.reduce((a,c)=>({...a,[c.grade]:(a[c.grade]||0)+1}),{})
  const best = scores[0]
  const worst = scores[scores.length-1]
  const top5 = scores.slice(0,5)
  const bottom5 = scores.slice(-5).reverse()

  return (
    <div style={{background:'var(--bg)'}}>
      <style>{`
        @keyframes gridMove{0%{background-position:0 0}100%{background-position:60px 60px}}
        @keyframes scanLine{0%{top:-5%}100%{top:105%}}
        .row-hover{transition:background 0.15s}
        .row-hover:hover{background:rgba(79,142,247,0.06)!important}
      `}</style>

      {/* ═══ HERO ═══ */}
      <div style={{position:'relative',minHeight:'100vh',display:'flex',flexDirection:'column',justifyContent:'center',overflow:'hidden',paddingTop:60}}>

        {/* Animated grid background */}
        <div style={{position:'absolute',inset:0,backgroundImage:'linear-gradient(rgba(79,142,247,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(79,142,247,0.04) 1px,transparent 1px)',backgroundSize:'60px 60px',animation:'gridMove 8s linear infinite',zIndex:0}}/>

        {/* Scanning line */}
        <div style={{position:'absolute',left:0,right:0,height:2,background:'linear-gradient(90deg,transparent,rgba(79,142,247,0.3),transparent)',animation:'scanLine 4s linear infinite',zIndex:1,pointerEvents:'none'}}/>

        {/* Radial glow center */}
        <div style={{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',width:'60vw',height:'60vw',borderRadius:'50%',background:'radial-gradient(ellipse,rgba(79,142,247,0.06) 0%,transparent 70%)',pointerEvents:'none',zIndex:0}}/>

        <div style={{maxWidth:1300,margin:'0 auto',padding:'0 2rem',position:'relative',zIndex:2,width:'100%'}}>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'4rem',alignItems:'center'}}>

            {/* Left */}
            <div style={{opacity:heroVisible?1:0,transform:heroVisible?'translateY(0)':'translateY(32px)',transition:'all 1s cubic-bezier(0.16,1,0.3,1)'}}>
              <div style={{display:'inline-flex',alignItems:'center',gap:8,padding:'5px 14px',borderRadius:100,background:'rgba(79,142,247,0.1)',border:'1px solid rgba(79,142,247,0.25)',marginBottom:'2rem'}}>
                <div style={{width:6,height:6,borderRadius:'50%',background:'#22c55e',animation:'pulse 2s infinite'}}/>
                <span style={{fontSize:11,color:'var(--accent2)',fontWeight:600,letterSpacing:'0.06em',textTransform:'uppercase'}}>
                  Live · {meta.totalCities} Cities · Updated {new Date(meta.lastUpdated).toLocaleDateString('en-US',{month:'short',year:'numeric'})}
                </span>
              </div>

              <h1 style={{fontFamily:'var(--serif)',fontSize:'clamp(40px,5.5vw,72px)',fontWeight:400,lineHeight:1.05,letterSpacing:'-0.02em',marginBottom:'1.5rem',fontStyle:'italic'}}>
                Who gets help<br/>faster in America?
              </h1>

              <p style={{fontSize:17,color:'var(--text2)',lineHeight:1.8,maxWidth:480,marginBottom:'2.5rem'}}>
                A free public index scoring every major US city on two life-or-death questions: How equitably does 911 respond? How accessible is overdose-reversal medicine?
              </p>

              <div style={{display:'flex',gap:12,marginBottom:'3rem',flexWrap:'wrap'}}>
                <Link to="/methodology" className="btn btn-primary">How scores work →</Link>
                <a href="https://github.com/Manideepkathula/Access-watch" target="_blank" rel="noopener noreferrer" className="btn btn-ghost">Source data ↗</a>
              </div>

              {/* Key finding */}
              <div style={{padding:'1rem 1.25rem',background:'rgba(245,158,11,0.08)',border:'1px solid rgba(245,158,11,0.2)',borderRadius:10,display:'flex',gap:10,alignItems:'flex-start'}}>
                <AlertTriangle size={14} color="#f59e0b" style={{flexShrink:0,marginTop:2}}/>
                <div style={{fontSize:13,color:'var(--text2)',lineHeight:1.65}}>
                  <strong style={{color:'#f59e0b'}}>Key finding: </strong>
                  No major US city achieves Grade A. National average is <strong style={{color:'var(--text)'}}>{avg}/100</strong>. Best performer: <strong style={{color:'var(--text)'}}>{best?.name} ({best?.score})</strong>. This reflects a systemic national gap.
                </div>
              </div>
            </div>

            {/* Right — 3D visual */}
            <div style={{display:'flex',flexDirection:'column',gap:'1.5rem',opacity:heroVisible?1:0,transform:heroVisible?'translateY(0)':'translateY(32px)',transition:'all 1s cubic-bezier(0.16,1,0.3,1) 0.2s'}}>

              {/* Big center score display */}
              <div style={{background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:20,padding:'2.5rem',textAlign:'center',position:'relative',overflow:'hidden',backdropFilter:'blur(20px)'}}>
                <div style={{position:'absolute',inset:0,background:'radial-gradient(ellipse at 50% 0%,rgba(79,142,247,0.08),transparent 60%)',pointerEvents:'none'}}/>
                <div style={{fontSize:11,color:'var(--text3)',letterSpacing:'0.1em',textTransform:'uppercase',marginBottom:'1.5rem',fontWeight:600}}>National average equity score</div>
                <div style={{display:'flex',justifyContent:'center',marginBottom:'1.5rem'}}>
                  <ScoreBadge score={avg} grade={avg>=80?'A':avg>=65?'B':avg>=50?'C':avg>=35?'D':'F'} size="lg" animate={heroVisible}/>
                </div>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:12}}>
                  {[{l:'Cities',v:scores.length},{l:'Best',v:`${best?.score}`},{l:'Worst',v:`${worst?.score}`}].map((s,i)=>(
                    <div key={i} style={{padding:'0.75rem',background:'rgba(255,255,255,0.03)',borderRadius:8,border:'1px solid rgba(255,255,255,0.06)'}}>
                      <div style={{fontSize:20,fontWeight:900,letterSpacing:'-0.04em',color:'var(--text)',lineHeight:1}}>{s.v}</div>
                      <div style={{fontSize:11,color:'var(--text3)',marginTop:3,textTransform:'uppercase',letterSpacing:'0.06em',fontWeight:600}}>{s.l}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top 3 + Bottom 3 */}
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
                <div style={{background:'rgba(34,197,94,0.05)',border:'1px solid rgba(34,197,94,0.15)',borderRadius:14,padding:'1.25rem'}}>
                  <div style={{fontSize:11,color:'#22c55e',fontWeight:700,letterSpacing:'0.08em',textTransform:'uppercase',marginBottom:'0.75rem'}}>🏆 Top 3</div>
                  {top5.slice(0,3).map(c=>(
                    <Link key={c.id} to={`/city/${c.id}`} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'5px 0',borderBottom:'1px solid rgba(255,255,255,0.05)',textDecoration:'none',transition:'opacity 0.2s'}}
                      onMouseEnter={e=>e.currentTarget.style.opacity='0.7'}
                      onMouseLeave={e=>e.currentTarget.style.opacity='1'}
                    >
                      <div style={{fontSize:13,color:'var(--text2)'}}>{c.name}</div>
                      <div style={{fontSize:14,fontWeight:800,color:'#22c55e'}}>{c.score}</div>
                    </Link>
                  ))}
                </div>
                <div style={{background:'rgba(239,68,68,0.05)',border:'1px solid rgba(239,68,68,0.15)',borderRadius:14,padding:'1.25rem'}}>
                  <div style={{fontSize:11,color:'#ef4444',fontWeight:700,letterSpacing:'0.08em',textTransform:'uppercase',marginBottom:'0.75rem'}}>⚠️ Bottom 3</div>
                  {bottom5.slice(0,3).map(c=>(
                    <Link key={c.id} to={`/city/${c.id}`} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'5px 0',borderBottom:'1px solid rgba(255,255,255,0.05)',textDecoration:'none',transition:'opacity 0.2s'}}
                      onMouseEnter={e=>e.currentTarget.style.opacity='0.7'}
                      onMouseLeave={e=>e.currentTarget.style.opacity='1'}
                    >
                      <div style={{fontSize:13,color:'var(--text2)'}}>{c.name}</div>
                      <div style={{fontSize:14,fontWeight:800,color:'#ef4444'}}>{c.score}</div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{position:'absolute',bottom:'2rem',left:'50%',transform:'translateX(-50%)',display:'flex',flexDirection:'column',alignItems:'center',gap:6,zIndex:2}}>
          <div style={{width:1,height:40,background:'linear-gradient(to bottom,transparent,rgba(79,142,247,0.5),transparent)',animation:'float 2s ease infinite'}}/>
          <span style={{fontSize:9,letterSpacing:'0.2em',color:'var(--text4)',textTransform:'uppercase'}}>scroll</span>
        </div>
      </div>

      {/* ═══ MARQUEE ═══ */}
      <div style={{borderTop:'1px solid rgba(255,255,255,0.06)',borderBottom:'1px solid rgba(255,255,255,0.06)',padding:'12px 0',overflow:'hidden',background:'rgba(255,255,255,0.02)'}}>
        <div style={{display:'flex',animation:'marquee 30s linear infinite',whiteSpace:'nowrap',width:'max-content'}}>
          {Array(8).fill(['EMS Response Equity','Naloxone Access','Emergency Equity Score','57 Cities Tracked','Free & Open Source','Quarterly Auto-Updates','CDC Data 2024','NEMSIS 2024 Dataset']).flat().map((t,i)=>(
            <span key={i} style={{fontSize:11,fontWeight:600,color:'var(--text3)',padding:'0 2.5rem',letterSpacing:'0.08em',textTransform:'uppercase'}}>
              <span style={{color:'var(--accent)',marginRight:'0.5rem'}}>✦</span>{t}
            </span>
          ))}
        </div>
      </div>

      {/* ═══ GRADE BREAKDOWN ═══ */}
      <div style={{padding:'5rem 2rem',background:'var(--bg2)',borderBottom:'1px solid var(--border)'}}>
        <div style={{maxWidth:1300,margin:'0 auto'}}>
          <ScrollReveal>
            <div style={{marginBottom:'2rem'}}>
              <div className="label" style={{marginBottom:'0.75rem'}}>Grade distribution</div>
              <h2 style={{fontSize:'clamp(24px,3vw,40px)',fontWeight:800,letterSpacing:'-0.03em'}}>How do US cities stack up?</h2>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:12,marginBottom:'2rem'}}>
              {['A','B','C','D','F'].map(g=>{
                const count = gradeCount[g]||0
                const pct = Math.round((count/scores.length)*100)
                const col = GRADE_COLOR[g]
                return (
                  <div key={g} className="card" style={{padding:'1.5rem',textAlign:'center',cursor:'pointer',border:`1px solid ${col}20`,background:`${col}06`}}
                    onClick={()=>setGradeFilter(gradeFilter===g?'all':g)}
                    style={{padding:'1.5rem',textAlign:'center',cursor:'pointer',border:`1px solid ${gradeFilter===g?col:col+'20'}`,background:gradeFilter===g?`${col}12`:`${col}06`,borderRadius:14,transition:'all 0.2s',backdropFilter:'blur(12px)'}}
                  >
                    <div style={{fontSize:36,fontWeight:900,color:col,letterSpacing:'-0.04em',lineHeight:1,marginBottom:4,textShadow:`0 0 20px ${col}60`}}>{count}</div>
                    <div style={{fontSize:11,color:col,fontWeight:700,letterSpacing:'0.08em',textTransform:'uppercase',marginBottom:4}}>Grade {g}</div>
                    <div style={{fontSize:12,color:'var(--text3)'}}>{GRADE_LABEL[g]}</div>
                    <div style={{fontSize:12,color:'var(--text3)',marginTop:4}}>{pct}% of cities</div>
                  </div>
                )
              })}
            </div>
            <div style={{height:12,borderRadius:6,overflow:'hidden',display:'flex',gap:1,background:'rgba(255,255,255,0.04)',border:'1px solid var(--border)'}}>
              {['A','B','C','D','F'].map(g=>{
                const count = gradeCount[g]||0
                const pct = (count/scores.length)*100
                return count>0 ? (
                  <div key={g} style={{flex:pct,background:GRADE_COLOR[g],transition:'flex 0.5s',boxShadow:`0 0 8px ${GRADE_COLOR[g]}60`,position:'relative'}}>
                    <div style={{position:'absolute',inset:0,background:'linear-gradient(to bottom,rgba(255,255,255,0.15),transparent)'}}/>
                  </div>
                ) : null
              })}
            </div>
          </ScrollReveal>
        </div>
      </div>

      {/* ═══ MAP ═══ */}
      <div style={{padding:'5rem 2rem',background:'var(--bg)'}}>
        <div style={{maxWidth:1300,margin:'0 auto'}}>
          <ScrollReveal>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-end',marginBottom:'2rem',flexWrap:'wrap',gap:'1rem'}}>
              <div>
                <div className="label" style={{marginBottom:'0.75rem'}}>Interactive map</div>
                <h2 style={{fontSize:'clamp(24px,3vw,40px)',fontWeight:800,letterSpacing:'-0.03em'}}>Emergency equity across America</h2>
              </div>
              <div style={{display:'flex',gap:'1.5rem'}}>
                {['A','B','C','D','F'].map(g=>(
                  <div key={g} style={{display:'flex',alignItems:'center',gap:5}}>
                    <div style={{width:8,height:8,borderRadius:'50%',background:GRADE_COLOR[g],boxShadow:`0 0 6px ${GRADE_COLOR[g]}`}}/>
                    <span style={{fontSize:11,color:'var(--text3)',fontWeight:600}}>{g}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{borderRadius:16,overflow:'hidden',border:'1px solid var(--border)',height:500,position:'relative',boxShadow:'0 32px 80px rgba(0,0,0,0.5)'}}>
              {!mapLoaded && (
                <div style={{position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center',background:'#080b14',zIndex:10,flexDirection:'column',gap:14}}>
                  <div style={{width:28,height:28,border:'2px solid var(--accent)',borderTopColor:'transparent',borderRadius:'50%',animation:'spin 0.8s linear infinite'}}/>
                  <span style={{fontSize:13,color:'var(--text3)'}}>Loading map...</span>
                </div>
              )}
              <div ref={mapRef} style={{width:'100%',height:'100%'}}/>
            </div>
          </ScrollReveal>
        </div>
      </div>

      {/* ═══ LEADERBOARD ═══ */}
      <div style={{padding:'0 2rem 6rem',background:'var(--bg)'}}>
        <div style={{maxWidth:1300,margin:'0 auto'}}>
          <ScrollReveal>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-end',marginBottom:'2rem',flexWrap:'wrap',gap:'1rem'}}>
              <div>
                <div className="label" style={{marginBottom:'0.75rem'}}>Full rankings</div>
                <h2 style={{fontSize:'clamp(24px,3vw,40px)',fontWeight:800,letterSpacing:'-0.03em'}}>City leaderboard</h2>
              </div>
              <div style={{display:'flex',gap:10,flexWrap:'wrap'}}>
                <div style={{position:'relative'}}>
                  <Search size={13} style={{position:'absolute',left:11,top:'50%',transform:'translateY(-50%)',color:'var(--text3)'}}/>
                  <input placeholder="Search cities..." value={search} onChange={e=>setSearch(e.target.value)}
                    style={{padding:'9px 12px 9px 32px',background:'rgba(255,255,255,0.05)',border:'1px solid var(--border2)',borderRadius:8,color:'var(--text)',fontSize:13,width:210,transition:'border-color 0.2s'}}
                    onFocus={e=>e.target.style.borderColor='rgba(79,142,247,0.5)'}
                    onBlur={e=>e.target.style.borderColor='var(--border2)'}
                  />
                </div>
                <select value={gradeFilter} onChange={e=>setGradeFilter(e.target.value)}
                  style={{padding:'9px 12px',background:'rgba(255,255,255,0.05)',border:'1px solid var(--border2)',borderRadius:8,color:'var(--text)',fontSize:13}}>
                  <option value="all">All grades</option>
                  {['A','B','C','D','F'].map(g=><option key={g} value={g}>Grade {g} — {GRADE_LABEL[g]}</option>)}
                </select>
              </div>
            </div>

            <div style={{background:'rgba(255,255,255,0.03)',border:'1px solid var(--border)',borderRadius:14,overflow:'hidden',backdropFilter:'blur(12px)'}}>
              <div style={{display:'grid',gridTemplateColumns:'52px 1fr 64px 88px 80px 80px 116px 84px',padding:'10px 20px',borderBottom:'1px solid rgba(255,255,255,0.08)',background:'rgba(255,255,255,0.04)'}}>
                {[{k:'rank',l:'#'},{k:'name',l:'City'},{k:'state',l:'State'},{k:'score',l:'Score'},{k:'emsScore',l:'EMS'},{k:'naloxoneScore',l:'Naloxone'},{k:'grade',l:'Grade'},{k:'pop',l:'Pop.'}].map(col=>(
                  <button key={col.k} onClick={()=>toggleSort(col.k)} style={{background:'none',border:'none',fontSize:11,fontWeight:700,color:'var(--text3)',letterSpacing:'0.08em',textTransform:'uppercase',display:'flex',alignItems:'center',gap:3,cursor:'pointer',padding:0}}>
                    {col.l}<SI k={col.k}/>
                  </button>
                ))}
              </div>

              {filtered.map((c,i)=>(
                <Link key={c.id} to={`/city/${c.id}`} className="row-hover" style={{display:'grid',gridTemplateColumns:'52px 1fr 64px 88px 80px 80px 116px 84px',padding:'11px 20px',borderBottom:'1px solid rgba(255,255,255,0.04)',textDecoration:'none',alignItems:'center',background:i%2===0?'transparent':'rgba(255,255,255,0.01)'}}>
                  <div style={{fontSize:13,fontWeight:700,color:'var(--text4)'}}>{c.rank}</div>
                  <div>
                    <div style={{fontSize:14,fontWeight:600,color:'var(--text)'}}>{c.name}</div>
                    {c.hasLiveData && <div style={{fontSize:9,color:'var(--accent2)',fontWeight:700,letterSpacing:'0.06em',textTransform:'uppercase'}}>Live</div>}
                  </div>
                  <div style={{fontSize:13,color:'var(--text2)'}}>{c.state}</div>
                  <div style={{fontSize:18,fontWeight:900,color:GRADE_COLOR[c.grade],letterSpacing:'-0.03em',textShadow:`0 0 12px ${GRADE_COLOR[c.grade]}60`}}>{c.score}</div>
                  <div style={{fontSize:13,color:'var(--text2)',fontWeight:500}}>{c.emsScore}</div>
                  <div style={{fontSize:13,color:'var(--text2)',fontWeight:500}}>{c.naloxoneScore}</div>
                  <div style={{display:'inline-flex',alignItems:'center',gap:5,padding:'3px 10px',borderRadius:6,background:`${GRADE_COLOR[c.grade]}12`,border:`1px solid ${GRADE_COLOR[c.grade]}30`,width:'fit-content'}}>
                    <div style={{width:6,height:6,borderRadius:'50%',background:GRADE_COLOR[c.grade],boxShadow:`0 0 6px ${GRADE_COLOR[c.grade]}`}}/>
                    <span style={{fontSize:12,fontWeight:700,color:GRADE_COLOR[c.grade]}}>{c.grade}</span>
                    <span style={{fontSize:11,color:GRADE_COLOR[c.grade],opacity:0.7}}>{GRADE_LABEL[c.grade]}</span>
                  </div>
                  <div style={{fontSize:12,color:'var(--text3)'}}>{c.pop>=1000000?(c.pop/1000000).toFixed(1)+'M':(c.pop/1000).toFixed(0)+'K'}</div>
                </Link>
              ))}

              {filtered.length===0 && <div style={{padding:'3rem',textAlign:'center',color:'var(--text3)'}}>No cities match.</div>}
            </div>

            <div style={{marginTop:'0.75rem',display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:'0.5rem'}}>
              <div style={{fontSize:12,color:'var(--text3)'}}>Showing {filtered.length} of {scores.length} · Data: {new Date(meta.lastUpdated).toLocaleDateString()}</div>
              <div style={{fontSize:12,color:'var(--text3)',display:'flex',alignItems:'center',gap:5}}><RefreshCw size={11}/> Next update: {new Date(meta.nextUpdate).toLocaleDateString('en-US',{month:'long',year:'numeric'})}</div>
            </div>
          </ScrollReveal>
        </div>
      </div>

      {/* ═══ SOURCES ═══ */}
      <div style={{borderTop:'1px solid var(--border)',padding:'4rem 2rem',background:'var(--bg2)'}}>
        <div style={{maxWidth:1300,margin:'0 auto'}}>
          <div className="label" style={{marginBottom:'1rem'}}>Data transparency</div>
          <h2 style={{fontSize:28,fontWeight:700,letterSpacing:'-0.025em',marginBottom:'1.5rem'}}>Every number is publicly sourced</h2>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(250px,1fr))',gap:10}}>
            {meta.sources.map((s,i)=>(
              <a key={i} href={s.url} target="_blank" rel="noopener noreferrer" className="card" style={{padding:'1.25rem',textDecoration:'none',display:'block'}}
                onMouseEnter={e=>{e.currentTarget.style.borderColor='rgba(79,142,247,0.3)'}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor='var(--border)'}}
              >
                <div style={{fontSize:13,fontWeight:600,color:'var(--text)',marginBottom:4,lineHeight:1.4}}>{s.name}</div>
                <div style={{fontSize:12,color:'var(--accent2)'}}>View source ↗</div>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div style={{borderTop:'1px solid var(--border)',padding:'2rem',display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:'1rem'}}>
        <div style={{fontSize:13,color:'var(--text3)'}}>Built by <a href="https://linkedin.com/in/manideepkathula" style={{color:'var(--accent2)',fontWeight:600}}>Manideep Kathula</a> · Open source · Free forever · Auto-updates quarterly</div>
        <div style={{display:'flex',gap:'1.5rem'}}>
          {[['GitHub','https://github.com/Manideepkathula/Access-watch'],['LinkedIn','https://linkedin.com/in/manideepkathula'],['Methodology','/methodology']].map(([l,h])=>(
            <a key={l} href={h} style={{fontSize:13,color:'var(--text3)',transition:'color 0.15s'}}
              onMouseEnter={e=>e.currentTarget.style.color='var(--accent2)'}
              onMouseLeave={e=>e.currentTarget.style.color='var(--text3)'}
            >{l}</a>
          ))}
        </div>
      </div>
    </div>
  )
}
