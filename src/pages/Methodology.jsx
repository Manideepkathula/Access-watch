import { Link } from 'react-router-dom'
import meta from '../data/meta.json'

export default function Methodology() {
  return (
    <div style={{paddingTop:56,background:'white',minHeight:'100vh'}}>
      <div style={{borderBottom:'1px solid var(--border)',padding:'3rem 2rem',background:'var(--bg)'}}>
        <div style={{maxWidth:800,margin:'0 auto'}}>
          <div style={{fontSize:11,fontWeight:700,letterSpacing:'0.1em',textTransform:'uppercase',color:'var(--text3)',marginBottom:'1rem'}}>Transparent methodology</div>
          <h1 style={{fontFamily:'var(--serif)',fontSize:'clamp(32px,5vw,60px)',fontWeight:400,fontStyle:'italic',letterSpacing:'-0.02em',marginBottom:'1rem',lineHeight:1.05}}>How scores are calculated</h1>
          <p style={{fontSize:16,color:'var(--text2)',lineHeight:1.8}}>Every score on AccessWatch is derived from a transparent, published formula using free government data. Nothing is proprietary or hidden.</p>
        </div>
      </div>
      <div style={{maxWidth:800,margin:'0 auto',padding:'3rem 2rem'}}>
        {[
          {n:'01',title:'The Overall Score (0–100)',body:`The Emergency Access Equity Score combines two equal components:\n\n• EMS Response Equity Score (50% weight)\n• Naloxone Access Score (50% weight)\n\nFinal Score = (EMS Score × 0.50) + (Naloxone Score × 0.50)\n\nGrades: A = 80–100 (Excellent) · B = 65–79 (Good) · C = 50–64 (Moderate) · D = 35–49 (Poor) · F = 0–34 (Critical)\n\nNote: No major US city currently achieves Grade A. This reflects genuine national gaps in emergency access equity, not a flaw in the scoring formula.`},
          {n:'02',title:'EMS Response Equity Score',body:`Measures the disparity in 911/ambulance response times between the wealthiest and most economically disadvantaged neighborhoods within a city.\n\nFor cities with live API data (NYC, Chicago, LA, Boston, Seattle): We pull actual EMS dispatch records and compare response times across census tracts by income level. A smaller gap = higher score.\n\nFor all other cities: Estimates derived from the NEMSIS 2024 Public-Release Research Dataset (60M+ EMS activations) combined with peer-reviewed EMS equity research.\n\nSources: NEMSIS 2024 · City Open Data Portals · Academic EMS Research`},
          {n:'03',title:'Naloxone Access Score',body:`Measures community access to naloxone (Narcan) — the FDA-approved opioid overdose reversal medication.\n\nData: CDC IQVIA Naloxone Dispensing Rate Maps 2024 — the most comprehensive publicly available US naloxone dataset.\n\nFormula: (State dispensing rate ÷ 1.3) × 100\n\nWhere 1.3 = the highest US state rate (Arkansas, 2024). A state at 1.3 per 100 persons scores 100. A state at 0.1 per 100 scores ~8.\n\nLimitation: This is state-level data. City-level naloxone data is not publicly available in a consistent national format. We clearly disclose this.`},
          {n:'04',title:'Automated Quarterly Updates',body:`AccessWatch updates every 3 months automatically using GitHub Actions.\n\nUpdate pipeline:\n1. GitHub Actions triggers on Jan 1, Apr 1, Jul 1, Oct 1\n2. Script pulls latest CDC naloxone data\n3. Pulls live EMS data from city open data APIs\n4. Recalculates all scores with the same formula\n5. Commits updated data to the repository\n6. Vercel automatically redeploys the site\n\nEvery city card shows the date data was last updated.`},
          {n:'05',title:'Limitations We Disclose',body:`We believe in honesty about what this index cannot do:\n\n• Naloxone scores are state-level — city-level data doesn't exist nationally\n• EMS estimates for most cities are research-based, not direct measurement\n• Response time equity is one dimension of EMS fairness — staffing and equipment gaps are not captured\n• This is historical data, not real-time\n• We only include cities where we have sufficient public data for a defensible estimate\n\nWe prefer acknowledging uncertainty over overstating precision.`},
        ].map((s,i)=>(
          <div key={i} style={{display:'flex',gap:'2rem',marginBottom:'3rem',paddingBottom:'3rem',borderBottom:'1px solid var(--border)'}}>
            <div style={{fontSize:28,fontWeight:900,color:'var(--border2)',letterSpacing:'-0.04em',flexShrink:0,lineHeight:1.1,minWidth:40}}>{s.n}</div>
            <div>
              <h2 style={{fontSize:20,fontWeight:700,letterSpacing:'-0.02em',marginBottom:'1rem'}}>{s.title}</h2>
              {s.body.split('\n\n').map((p,j)=>(
                <p key={j} style={{fontSize:15,color:'var(--text2)',lineHeight:1.8,marginBottom:'0.75rem',whiteSpace:'pre-line'}}>{p}</p>
              ))}
            </div>
          </div>
        ))}
        <div style={{background:'var(--bg)',border:'1px solid var(--border)',borderRadius:12,padding:'2rem'}}>
          <h3 style={{fontSize:18,fontWeight:700,marginBottom:'1.25rem'}}>All Data Sources</h3>
          {meta.sources.map((s,i)=>(
            <a key={i} href={s.url} target="_blank" rel="noopener noreferrer" style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'11px 0',borderBottom:'1px solid var(--border)',textDecoration:'none',transition:'opacity 0.15s'}}
              onMouseEnter={e=>e.currentTarget.style.opacity='0.65'}
              onMouseLeave={e=>e.currentTarget.style.opacity='1'}
            >
              <span style={{fontSize:14,color:'var(--text2)'}}>{s.name}</span>
              <span style={{fontSize:13,color:'var(--accent)',fontWeight:500}}>View source ↗</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
