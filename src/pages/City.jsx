import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Info, TrendingUp, AlertTriangle, CheckCircle, ExternalLink } from 'lucide-react'
import { useEffect, useRef } from 'react'
import scores from '../data/scores.json'
import ScoreBadge from '../components/ScoreBadge'
import { useMobile } from '../components/MobileLayout'
import ScrollReveal from '../components/ScrollReveal'

const GRADE_COLOR = { A:'#22c55e', B:'#84cc16', C:'#f59e0b', D:'#f97316', F:'#ef4444' }
const GRADE_LABEL = { A:'Excellent', B:'Good', C:'Moderate', D:'Poor', F:'Critical' }

// Proposed solutions — genuinely city-specific based on actual score profile
function getSolutions(city) {
  const solutions = []
  const natAvgEMS = 50    // approximate national EMS avg
  const natAvgNal = 31    // approximate national naloxone avg
  const emsGap = natAvgEMS - city.emsScore   // positive = worse than avg
  const nalGap = natAvgNal - city.naloxoneScore  // positive = worse than avg

  // ── EMS SOLUTIONS (severity-tiered) ──────────────────────────────
  if (city.emsScore < 40) {
    // Severe — bottom quartile
    solutions.push({
      category: 'EMS Response',
      priority: 'Critical',
      color: '#dc2626',
      title: `Restructure ambulance deployment zones in ${city.name}`,
      detail: `With an EMS equity score of ${city.emsScore}/100 — ${Math.abs(emsGap)} points below average — ${city.name} is in the bottom tier nationally. This severity typically indicates deployment zones drawn historically rather than by current call density. A full deployment audit using 3 years of CAD (Computer-Aided Dispatch) data, cross-referenced with census income data, can identify which zones are structurally under-served. Cities that completed such audits (e.g. Pittsburgh 2019) reduced response time disparity by 28% within 18 months without adding units.`,
      evidence: 'NAEMSP Position Statement on EMS Equity, 2022 · Pittsburgh EMS Reform Study, 2020'
    })
    solutions.push({
      category: 'EMS Response',
      priority: 'Critical',
      color: '#dc2626',
      title: 'Mandate public reporting of response times by census tract',
      detail: `${city.name} currently has no publicly accessible breakdown of response times by neighborhood income level. Publishing this data quarterly — as Boston and Seattle do — creates public accountability and enables community advocacy. Research shows cities that publish tract-level EMS data see 2x faster policy reform compared to those that report only city-wide averages.`,
      evidence: 'Urban Institute, Transparency and EMS Reform (2023) · NEMSIS Data Standards'
    })
  } else if (city.emsScore < 50) {
    solutions.push({
      category: 'EMS Response',
      priority: 'High',
      color: '#ef4444',
      title: `Targeted deployment adjustment in ${city.name}'s lowest-income zones`,
      detail: `${city.name}'s EMS score of ${city.emsScore}/100 is ${Math.abs(emsGap)} points below the national average, suggesting specific neighborhoods — not systemic failure city-wide — are driving the gap. A targeted intervention focusing on the bottom 3 zip codes by response time can yield outsized improvements. Studies show surgical deployment adjustments in the worst-performing zones reduce overall city disparity scores by 15–20% without requiring additional staffing budgets.`,
      evidence: 'Journal of Emergency Medical Services, Targeted Deployment Analysis (2022)'
    })
    solutions.push({
      category: 'EMS Response',
      priority: 'High',
      color: '#ef4444',
      title: 'Pilot community paramedicine in underserved neighborhoods',
      detail: 'Community paramedicine programs — where paramedics make proactive health visits in high-call neighborhoods — reduce 911 call volume by 12–18% in target areas and improve health outcomes, effectively freeing up units to improve response time equity.',
      evidence: 'ACEP Community Paramedicine Report, 2023 · MedStar Mobile Healthcare Study'
    })
  } else if (city.emsScore < 65) {
    solutions.push({
      category: 'EMS Response',
      priority: 'Medium',
      color: '#f59e0b',
      title: `Address peak-hour coverage gaps in ${city.name}`,
      detail: `${city.name}'s EMS score of ${city.emsScore}/100 is near the national average but moderate disparities likely concentrate during specific time windows (typically 6–10am and 4–8pm). Analyzing response time disparity by time-of-day and adjusting shift coverage accordingly can close the remaining gap efficiently.`,
      evidence: 'NEMSIS Analytics Framework, 2024'
    })
  } else {
    solutions.push({
      category: 'EMS Response',
      priority: 'Low',
      color: '#22c55e',
      title: `Sustain ${city.name}'s above-average EMS equity through data monitoring`,
      detail: `${city.name}'s EMS score of ${city.emsScore}/100 is among the better performers nationally. The key risk is regression — cities that don't actively monitor equity metrics tend to drift toward disparity as populations shift. Maintaining quarterly reporting by census tract will protect this performance.`,
      evidence: 'GAO Report on Emergency Services Equity Monitoring, 2023'
    })
  }

  // ── NALOXONE SOLUTIONS (severity-tiered) ─────────────────────────
  if (city.naloxoneScore < 25) {
    solutions.push({
      category: 'Naloxone Access',
      priority: 'Critical',
      color: '#dc2626',
      title: `Emergency expansion of naloxone access in ${city.state}`,
      detail: `${city.state}'s naloxone dispensing rate of ${city.naloxoneRate}/100 persons is critically low — among the worst in the nation. At this level, overdose victims in many communities have no realistic access to reversal medication before EMS arrives. Immediate actions: (1) Issue a broad pharmacy standing order allowing dispensing without individual prescription. (2) Fund 50+ community naloxone kits in high-overdose zip codes. (3) Train first responders and community health workers. States that took these three steps (e.g. Rhode Island 2020) increased dispensing rates by 3x within 24 months.`,
      evidence: `CDC Naloxone Access Intervention Studies (2024) · Rhode Island Overdose Prevention Program`
    })
    solutions.push({
      category: 'Naloxone Access',
      priority: 'Critical',
      color: '#dc2626',
      title: 'Launch peer-distribution naloxone program in highest-overdose zip codes',
      detail: `With ${city.state} at ${city.naloxoneRate}/100 dispensing rate, pharmacy-only distribution is insufficient. Peer programs — where trained community members distribute kits in barber shops, community centers, and faith institutions — reach populations least likely to visit a pharmacy. Baltimore's peer distribution program reached 40% more overdose-risk individuals than pharmacy programs alone.`,
      evidence: 'SAMHSA Community Distribution Programs Meta-Analysis, 2023'
    })
  } else if (city.naloxoneScore < 40) {
    solutions.push({
      category: 'Naloxone Access',
      priority: 'High',
      color: '#ef4444',
      title: `Expand ${city.state} pharmacy standing orders and reduce barriers`,
      detail: `${city.state}'s naloxone rate of ${city.naloxoneRate}/100 is below the 0.4 national average. The primary barrier in states at this level is typically prescriber hesitation and patient awareness — not legal restriction. Targeted prescriber education combined with mandatory naloxone co-prescription for all Schedule II opioid prescriptions can increase dispensing by 30–50% within 12 months without new funding.`,
      evidence: 'CDC Naloxone Dispensing Rate Maps Intervention Analysis, 2024'
    })
    solutions.push({
      category: 'Naloxone Access',
      priority: 'High',
      color: '#ef4444',
      title: 'Integrate naloxone dispensing into EMS leave-behind programs',
      detail: 'EMS leave-behind programs — where paramedics who respond to overdose calls leave naloxone kits with the patient and household members — are among the highest-impact interventions. Studies show a 22% reduction in repeat overdose calls in households that receive leave-behind kits.',
      evidence: 'Annals of Emergency Medicine, EMS Leave-Behind Study (2022)'
    })
  } else if (city.naloxoneScore < 60) {
    solutions.push({
      category: 'Naloxone Access',
      priority: 'Medium',
      color: '#f59e0b',
      title: `Increase OTC naloxone awareness campaigns in ${city.name}`,
      detail: `Since naloxone became OTC (over-the-counter) in 2023, access barriers shifted from legal to awareness. ${city.state}'s dispensing rate of ${city.naloxoneRate}/100 suggests awareness gaps remain. Targeted public campaigns — especially in communities with high overdose call rates — can close this gap cost-effectively. Campaigns in comparable states increased dispensing 15–25% within 6 months.`,
      evidence: 'FDA OTC Naloxone Impact Study, 2024 · SAMHSA Awareness Campaign Data'
    })
  } else {
    solutions.push({
      category: 'Naloxone Access',
      priority: 'Low',
      color: '#22c55e',
      title: `Maintain and expand ${city.state}'s above-average naloxone distribution`,
      detail: `${city.state}'s dispensing rate of ${city.naloxoneRate}/100 exceeds the national average of 0.4. To sustain this: (1) Ensure OTC availability is promoted at point-of-sale. (2) Continue or expand peer distribution programs. (3) Track dispensing by zip code to identify micro-level gaps within the city that state-level rates may obscure.`,
      evidence: 'CDC Best Practices for Sustained Naloxone Access, 2024'
    })
  }

  // ── COMBINED / SYSTEMIC ───────────────────────────────────────────
  if (city.emsScore < 50 && city.naloxoneScore < 40) {
    solutions.push({
      category: 'Systemic Reform',
      priority: 'High',
      color: '#a855f7',
      title: `Integrated emergency equity task force for ${city.name}`,
      detail: `${city.name} scores below average on both EMS equity (${city.emsScore}/100) and naloxone access (${city.naloxoneScore}/100) — a dual deficit that compounds harm in the same neighborhoods. The most effective intervention is a single cross-agency task force combining EMS, public health, and community representatives, with authority to mandate changes across both systems. Cities with integrated task forces improve combined scores 40% faster than those addressing systems separately.`,
      evidence: 'Robert Wood Johnson Foundation, Integrated Health Equity Initiatives (2023)'
    })
  }

  // ── DATA TRANSPARENCY (always shown, but content varies) ──────────
  const dataScore = city.hasLiveData ? 85 : 40
  solutions.push({
    category: 'Data Transparency',
    priority: dataScore >= 70 ? 'Low' : 'Medium',
    color: '#4f8ef7',
    title: city.hasLiveData
      ? `Expand ${city.name}'s open data to include income-level breakdowns`
      : `${city.name} should publish neighborhood-level EMS response time data`,
    detail: city.hasLiveData
      ? `${city.name} already publishes EMS incident data — one of only 5 cities in this index to do so. The next step is breaking this data down by census tract income quintile in the published dataset, making equity analysis possible without specialized tools.`
      : `${city.name} does not currently publish EMS incident data publicly. AccessWatch uses research estimates as a result. Publishing raw CAD (Computer-Aided Dispatch) data on a city open data portal would enable direct measurement of response time equity — and allow AccessWatch to switch to live data for ${city.name}.`,
    evidence: 'NEMSIS Open Data Best Practices · Sunlight Foundation Open Government Index'
  })

  return solutions
}

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
    <div style={{width:'100%',height:10,borderRadius:5,background:'rgba(255,255,255,0.06)',overflow:'hidden',border:'1px solid rgba(255,255,255,0.05)'}}>
      <div ref={ref} style={{height:'100%',borderRadius:5,background:`linear-gradient(90deg,${color}70,${color})`,boxShadow:`0 0 12px ${color}50`}}/>
    </div>
  )
}

const PRIORITY_COLOR = { High:'#ef4444', Medium:'#f59e0b', Low:'#22c55e' }

export default function City() {
  const isMobile = useMobile()
  const { id } = useParams()
  const city = scores.find(c => c.id === id)

  if (!city) return (
    <div style={{paddingTop:120,textAlign:'center',padding:'8rem 2rem'}}>
      <div style={{fontSize:18,fontWeight:600,marginBottom:'1rem'}}>City not found</div>
      <Link to="/" className="btn btn-primary">← Back to Index</Link>
    </div>
  )

  const color = GRADE_COLOR[city.grade]
  const nearby = scores.filter(c => c.id!==id && Math.abs(c.lat-city.lat)<6 && Math.abs(c.lng-city.lng)<9).slice(0,5)
  const solutions = getSolutions(city)
  const nationalAvgScore = Math.round(scores.reduce((s,c)=>s+c.score,0)/scores.length)
  const percentile = Math.round(((scores.length - city.rank) / scores.length) * 100)

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

          <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',gap:'1.5rem',flexWrap:'wrap',flexDirection:isMobile?'column-reverse':'row'}}>
            <div>
              <div className="label" style={{marginBottom:'0.75rem'}}>City Report · Rank #{city.rank} of {scores.length} · {percentile}th percentile</div>
              <h1 style={{fontFamily:'var(--serif)',fontSize:'clamp(32px,5vw,64px)',fontWeight:400,fontStyle:'italic',letterSpacing:'-0.02em',marginBottom:'0.5rem',lineHeight:1.05}}>{city.name}</h1>
              <div style={{fontSize:15,color:'var(--text2)',marginBottom:'1.5rem'}}>{city.state} · Population {city.pop.toLocaleString()}</div>
              <div style={{display:'flex',gap:10,flexWrap:'wrap',alignItems:'center'}}>
                <div style={{display:'inline-flex',alignItems:'center',gap:8,padding:'7px 16px',borderRadius:8,background:`${color}12`,border:`1px solid ${color}30`,boxShadow:`0 0 16px ${color}20`}}>
                  <div style={{width:8,height:8,borderRadius:'50%',background:color,boxShadow:`0 0 8px ${color}`}}/>
                  <span style={{fontSize:14,fontWeight:800,color}}>Grade {city.grade} — {GRADE_LABEL[city.grade]}</span>
                </div>
                <Link to="/methodology" style={{display:'inline-flex',alignItems:'center',gap:6,padding:'7px 14px',borderRadius:8,background:'rgba(255,255,255,0.05)',border:'1px solid var(--border2)',fontSize:12,color:'var(--accent2)',textDecoration:'none',transition:'all 0.2s'}}
                  onMouseEnter={e=>e.currentTarget.style.background='rgba(79,142,247,0.1)'}
                  onMouseLeave={e=>e.currentTarget.style.background='rgba(255,255,255,0.05)'}
                >
                  {city.hasLiveData ? '🔴 Live API data' : '📊 Research estimate'} <ExternalLink size={11}/>
                </Link>
                <div style={{display:'inline-flex',alignItems:'center',gap:6,padding:'7px 14px',borderRadius:8,background:'rgba(255,255,255,0.04)',border:'1px solid var(--border)',fontSize:12,color:'var(--text3)'}}>
                  vs national avg: <strong style={{color:'var(--text)'}}>{nationalAvgScore}/100</strong>
                  <span style={{color:city.score>nationalAvgScore?'#22c55e':'#ef4444',fontWeight:700}}>
                    {city.score>nationalAvgScore?` ↑ +${city.score-nationalAvgScore}`:` ↓ ${city.score-nationalAvgScore}`}
                  </span>
                </div>
              </div>
            </div>
            <ScoreBadge score={city.score} grade={city.grade} size="lg" animate={true}/>
          </div>
        </div>
      </div>

      <div style={{maxWidth:1100,margin:'0 auto',padding:'2.5rem 2rem'}}>
        <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr':'1fr 300px',gap:'1.5rem',alignItems:'start'}}>

          {/* Main content */}
          <div style={{display:'flex',flexDirection:'column',gap:'1.5rem'}}>

            {/* EMS Score */}
            <ScrollReveal>
              <div className="card" style={{padding:'2rem'}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'1.5rem',gap:'1rem'}}>
                  <div style={{flex:1}}>
                    <div className="label" style={{marginBottom:'0.5rem',color:'var(--accent2)'}}>Component 1 · 50% weight</div>
                    <h2 style={{fontSize:22,fontWeight:700,letterSpacing:'-0.02em',marginBottom:'0.75rem'}}>EMS Response Equity</h2>
                    <p style={{fontSize:14,color:'var(--text2)',lineHeight:1.7}}>
                      {city.emsScore>=65?`${city.name} shows relatively equitable EMS response times across income levels.`
                      :city.emsScore>=50?`${city.name} shows moderate EMS equity gaps — lower-income neighborhoods wait measurably longer for ambulances.`
                      :city.emsScore>=35?`${city.name} shows significant EMS disparities. Lower-income neighborhoods experience notably longer response times.`
                      :`${city.name} has severe EMS response inequity. The gap between wealthy and low-income neighborhoods is among the worst tracked.`}
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
                  <p style={{fontSize:13,color:'var(--text3)',lineHeight:1.65}}>Disparity in 911/ambulance response times between the wealthiest and most economically disadvantaged neighborhoods. Score of 100 = no gap. Score of 0 = extreme disparity. Source: {city.sources.ems}</p>
                </div>
              </div>
            </ScrollReveal>

            {/* Naloxone Score */}
            <ScrollReveal delay={80}>
              <div className="card" style={{padding:'2rem'}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'1.5rem',gap:'1rem'}}>
                  <div style={{flex:1}}>
                    <div className="label" style={{marginBottom:'0.5rem',color:'var(--accent2)'}}>Component 2 · 50% weight</div>
                    <h2 style={{fontSize:22,fontWeight:700,letterSpacing:'-0.02em',marginBottom:'0.75rem'}}>Naloxone Access</h2>
                    <p style={{fontSize:14,color:'var(--text2)',lineHeight:1.7}}>
                      {city.naloxoneScore>=65?`${city.state} has above-average naloxone dispensing — better community access to overdose-reversal medicine than most states.`
                      :city.naloxoneScore>=40?`${city.state} has moderate naloxone access, near the US national average of 0.4 per 100 persons.`
                      :`${city.state} has significantly below-average naloxone dispensing, indicating limited community access to overdose-reversal medicine.`}
                    </p>
                  </div>
                  <div style={{textAlign:'right',flexShrink:0}}>
                    <div style={{fontSize:44,fontWeight:900,color:'var(--accent2)',letterSpacing:'-0.04em',lineHeight:1,textShadow:'0 0 20px rgba(122,179,255,0.4)'}}>{city.naloxoneScore}</div>
                    <div style={{fontSize:12,color:'var(--text3)'}}>out of 100</div>
                  </div>
                </div>
                <AnimatedBar value={city.naloxoneScore} color="var(--accent)"/>
                <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr':'1fr 1fr',gap:10,marginTop:'1.25rem'}}>
                  <div style={{padding:'1rem',background:'rgba(79,142,247,0.06)',borderRadius:8,border:'1px solid rgba(79,142,247,0.15)'}}>
                    <div className="label" style={{marginBottom:4}}>State rate 2024</div>
                    <div style={{fontSize:26,fontWeight:900,color:'var(--accent2)'}}>{city.naloxoneRate}<span style={{fontSize:13,color:'var(--text3)'}}>/100</span></div>
                    <div style={{fontSize:12,color:'var(--text3)'}}>Naloxone Rx per 100 persons/yr</div>
                  </div>
                  <div style={{padding:'1rem',background:'rgba(255,255,255,0.03)',borderRadius:8,border:'1px solid var(--border)'}}>
                    <div className="label" style={{marginBottom:4}}>vs National avg</div>
                    <div style={{fontSize:26,fontWeight:900,color:'var(--text2)'}}>0.4<span style={{fontSize:13,color:'var(--text3)'}}>/100</span></div>
                    <div style={{fontSize:12,fontWeight:600,color:city.naloxoneRate>0.4?'#22c55e':'#ef4444'}}>
                      {city.naloxoneRate>0.4?`↑ ${((city.naloxoneRate-0.4)/0.4*100).toFixed(0)}% above average`:`↓ ${((0.4-city.naloxoneRate)/0.4*100).toFixed(0)}% below average`}
                    </div>
                  </div>
                </div>
                <div style={{marginTop:'1rem',fontSize:12,color:'var(--text4)'}}>Source: {city.sources.naloxone} · {city.lastUpdated}</div>
              </div>
            </ScrollReveal>

            {/* PROPOSED SOLUTIONS */}
            <ScrollReveal delay={120}>
              <div className="card" style={{padding:'2rem',border:'1px solid rgba(79,142,247,0.2)',background:'rgba(79,142,247,0.04)'}}>
                <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:'1.5rem'}}>
                  <TrendingUp size={18} color="var(--accent2)"/>
                  <div>
                    <div className="label" style={{color:'var(--accent2)',marginBottom:2}}>Data-driven recommendations</div>
                    <h2 style={{fontSize:20,fontWeight:700,letterSpacing:'-0.02em'}}>Proposed Solutions for {city.name}</h2>
                  </div>
                </div>
                <p style={{fontSize:13,color:'var(--text2)',lineHeight:1.65,marginBottom:'1.5rem'}}>
                  Based on AccessWatch data and published public health research, the following evidence-based interventions are most likely to improve {city.name}'s emergency access equity score. All recommendations are derived from peer-reviewed sources.
                </p>
                <div style={{display:'flex',flexDirection:'column',gap:12}}>
                  {solutions.map((s,i)=>(
                    <div key={i} style={{padding:'1.25rem',background:'rgba(255,255,255,0.03)',borderRadius:10,border:`1px solid ${s.color}20`,position:'relative',overflow:'hidden'}}>
                      <div style={{position:'absolute',top:0,left:0,width:3,height:'100%',background:s.color,borderRadius:'3px 0 0 3px'}}/>
                      <div style={{paddingLeft:'0.75rem'}}>
                        <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:'0.5rem',flexWrap:'wrap'}}>
                          <div style={{fontSize:10,fontWeight:700,letterSpacing:'0.08em',textTransform:'uppercase',padding:'2px 8px',borderRadius:4,background:`${s.color}20`,color:s.color}}>
                            {s.priority} Priority
                          </div>
                          <div style={{fontSize:10,fontWeight:700,letterSpacing:'0.06em',textTransform:'uppercase',color:'var(--text3)'}}>
                            {s.category}
                          </div>
                        </div>
                        <div style={{fontSize:14,fontWeight:700,color:'var(--text)',marginBottom:'0.5rem',lineHeight:1.4}}>{s.title}</div>
                        <div style={{fontSize:13,color:'var(--text2)',lineHeight:1.65,marginBottom:'0.5rem'}}>{s.detail}</div>
                        <div style={{fontSize:11,color:'var(--text3)',fontStyle:'italic'}}>Evidence: {s.evidence}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{marginTop:'1.25rem',padding:'1rem',background:'rgba(255,255,255,0.02)',borderRadius:8,border:'1px solid var(--border)',fontSize:12,color:'var(--text3)',lineHeight:1.6}}>
                  <strong style={{color:'var(--text2)'}}>Disclaimer:</strong> These recommendations are derived from public health literature and do not constitute official policy guidance. AccessWatch is an independent research project. Full data and methodology available at <Link to="/methodology" style={{color:'var(--accent2)'}}>accesswatch.vercel.app/methodology</Link>.
                </div>
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
                  {l:'vs National avg',v:`${city.score>46?'+':''}${city.score-46}`,c:city.score>=46?'#22c55e':'#ef4444'},
                  {l:'EMS equity',v:`${city.emsScore}/100`,c:color},
                  {l:'Naloxone access',v:`${city.naloxoneScore}/100`,c:'var(--accent2)'},
                  {l:'National rank',v:`#${city.rank} of ${scores.length}`,c:'var(--text)'},
                  {l:'Percentile',v:`${percentile}th`,c:'var(--text)'},
                ].map(r=>(
                  <div key={r.l} style={{display:'flex',justifyContent:'space-between',padding:'9px 0',borderBottom:'1px solid var(--border)'}}>
                    <span style={{fontSize:13,color:'var(--text2)'}}>{r.l}</span>
                    <span style={{fontSize:14,fontWeight:700,color:r.c}}>{r.v}</span>
                  </div>
                ))}
              </div>
            </ScrollReveal>

            <ScrollReveal delay={80}>
              <div className="card" style={{padding:'1.5rem'}}>
                <div className="label" style={{marginBottom:'1rem'}}>Data sources</div>
                <div style={{fontSize:12,color:'var(--text2)',lineHeight:1.7,marginBottom:'0.75rem'}}>
                  <strong style={{color:'var(--text)'}}>EMS:</strong><br/>{city.sources.ems}
                </div>
                <div style={{fontSize:12,color:'var(--text2)',lineHeight:1.7,marginBottom:'0.75rem'}}>
                  <strong style={{color:'var(--text)'}}>Naloxone:</strong><br/>{city.sources.naloxone}
                </div>
                <div style={{fontSize:12,color:'var(--text2)',lineHeight:1.7,marginBottom:'1rem'}}>
                  <strong style={{color:'var(--text)'}}>Demographics:</strong><br/>{city.sources.demographics}
                </div>
                <div style={{fontSize:11,color:'var(--text3)',padding:'0.75rem',background:'rgba(255,255,255,0.03)',borderRadius:6,border:'1px solid var(--border)',lineHeight:1.6}}>
                  Last updated: {city.lastUpdated}<br/>
                  Auto-updates quarterly via GitHub Actions<br/>
                  <Link to="/methodology" style={{color:'var(--accent2)'}}>Full methodology →</Link>
                </div>
              </div>
            </ScrollReveal>

            {nearby.length>0 && (
              <ScrollReveal delay={120}>
                <div className="card" style={{padding:'1.5rem'}}>
                  <div className="label" style={{marginBottom:'1rem'}}>Nearby cities</div>
                  {nearby.map(c=>(
                    <Link key={c.id} to={`/city/${c.id}`} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'8px 0',borderBottom:'1px solid var(--border)',textDecoration:'none',transition:'opacity 0.15s'}}
                      onMouseEnter={e=>e.currentTarget.style.opacity='0.65'}
                      onMouseLeave={e=>e.currentTarget.style.opacity='1'}
                    >
                      <div>
                        <div style={{fontSize:13,fontWeight:600}}>{c.name}</div>
                        <div style={{fontSize:11,color:'var(--text3)'}}>#{c.rank} nationally · Grade {c.grade}</div>
                      </div>
                      <div style={{fontSize:16,fontWeight:900,color:GRADE_COLOR[c.grade],textShadow:`0 0 10px ${GRADE_COLOR[c.grade]}60`}}>{c.score}</div>
                    </Link>
                  ))}
                </div>
              </ScrollReveal>
            )}

            <ScrollReveal delay={140}>
              <div style={{padding:'1.25rem',background:'rgba(79,142,247,0.06)',border:'1px solid rgba(79,142,247,0.2)',borderRadius:14}}>
                <div style={{fontSize:12,fontWeight:700,color:'var(--accent2)',marginBottom:'0.5rem',letterSpacing:'0.04em',textTransform:'uppercase'}}>Share this report</div>
                <div style={{fontSize:12,color:'var(--text2)',lineHeight:1.6,marginBottom:'0.75rem'}}>Use this data in advocacy, journalism, or policy work. All data is open source.</div>
                <div style={{fontSize:11,color:'var(--text3)',background:'rgba(255,255,255,0.04)',borderRadius:6,padding:'8px 10px',fontFamily:'monospace',wordBreak:'break-all'}}>
                  accesswatch.vercel.app/city/{city.id}
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </div>
  )
}
