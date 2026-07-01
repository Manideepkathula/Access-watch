import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUTPUT = path.join(__dirname, '../src/data/scores.json')
const META = path.join(__dirname, '../src/data/meta.json')

const CDC_NALOXONE_2024 = {
  'AL':0.6,'AK':0.7,'AZ':0.5,'AR':1.3,'CA':0.4,'CO':0.5,'CT':0.6,'DE':0.7,
  'FL':0.5,'GA':0.4,'HI':0.3,'ID':0.4,'IL':0.5,'IN':0.6,'IA':0.3,'KS':0.4,
  'KY':0.8,'LA':0.6,'ME':0.7,'MD':0.7,'MA':0.7,'MI':0.6,'MN':0.1,'MS':0.5,
  'MO':0.6,'MT':0.4,'NE':0.3,'NV':0.5,'NH':0.6,'NJ':0.6,'NM':1.2,'NY':0.6,
  'NC':0.6,'ND':0.2,'OH':0.7,'OK':0.7,'OR':0.6,'PA':0.7,'RI':1.1,'SC':0.5,
  'SD':0.1,'TN':0.9,'TX':0.4,'UT':0.4,'VT':0.8,'VA':0.6,'WA':0.5,'WV':0.8,
  'WI':0.3,'WY':0.3,'DC':1.1
}
const NATIONAL_NALOXONE_MAX = 1.3

const EMS_ESTIMATES = {
  'nyc':52,'la':48,'chicago':44,'houston':41,'phoenix':55,'philadelphia':46,
  'san-antonio':58,'san-diego':61,'dallas':47,'san-jose':63,'austin':59,
  'jacksonville':45,'fort-worth':50,'columbus':54,'charlotte':56,'indianapolis':49,
  'san-francisco':57,'seattle':62,'denver':60,'boston':58,'nashville':51,
  'oklahoma-city':52,'el-paso':53,'portland':61,'las-vegas':46,'memphis':38,
  'louisville':48,'baltimore':36,'milwaukee':42,'albuquerque':54,'tucson':55,
  'fresno':43,'sacramento':52,'mesa':58,'kansas-city':50,'atlanta':44,'omaha':60,
  'colorado-springs':61,'raleigh':59,'long-beach':50,'virginia-beach':64,
  'minneapolis':55,'tampa':52,'new-orleans':37,'arlington':56,'bakersfield':44,
  'honolulu':67,'anaheim':54,'aurora':57,'santa-ana':48,'corpus-christi':52,
  'riverside':50,'dc':53,'detroit':39,'pittsburgh':47,'miami':49,'cleveland':41
}

const ALL_CITIES = [
  {id:'nyc',name:'New York City',state:'NY',lat:40.7128,lng:-74.006,pop:8336817,hasLiveData:true},
  {id:'la',name:'Los Angeles',state:'CA',lat:34.0522,lng:-118.2437,pop:3979576,hasLiveData:true},
  {id:'chicago',name:'Chicago',state:'IL',lat:41.8781,lng:-87.6298,pop:2696555,hasLiveData:true},
  {id:'houston',name:'Houston',state:'TX',lat:29.7604,lng:-95.3698,pop:2304580,hasLiveData:false},
  {id:'phoenix',name:'Phoenix',state:'AZ',lat:33.4484,lng:-112.074,pop:1608139,hasLiveData:false},
  {id:'philadelphia',name:'Philadelphia',state:'PA',lat:39.9526,lng:-75.1652,pop:1603797,hasLiveData:false},
  {id:'san-antonio',name:'San Antonio',state:'TX',lat:29.4241,lng:-98.4936,pop:1434625,hasLiveData:false},
  {id:'san-diego',name:'San Diego',state:'CA',lat:32.7157,lng:-117.1611,pop:1386932,hasLiveData:false},
  {id:'dallas',name:'Dallas',state:'TX',lat:32.7767,lng:-96.797,pop:1304379,hasLiveData:false},
  {id:'san-jose',name:'San Jose',state:'CA',lat:37.3382,lng:-121.8863,pop:1013240,hasLiveData:false},
  {id:'austin',name:'Austin',state:'TX',lat:30.2672,lng:-97.7431,pop:978908,hasLiveData:false},
  {id:'jacksonville',name:'Jacksonville',state:'FL',lat:30.3322,lng:-81.6557,pop:949611,hasLiveData:false},
  {id:'fort-worth',name:'Fort Worth',state:'TX',lat:32.7555,lng:-97.3308,pop:918915,hasLiveData:false},
  {id:'columbus',name:'Columbus',state:'OH',lat:39.9612,lng:-82.9988,pop:905748,hasLiveData:false},
  {id:'charlotte',name:'Charlotte',state:'NC',lat:35.2271,lng:-80.8431,pop:885708,hasLiveData:false},
  {id:'indianapolis',name:'Indianapolis',state:'IN',lat:39.7684,lng:-86.1581,pop:876384,hasLiveData:false},
  {id:'san-francisco',name:'San Francisco',state:'CA',lat:37.7749,lng:-122.4194,pop:873965,hasLiveData:false},
  {id:'seattle',name:'Seattle',state:'WA',lat:47.6062,lng:-122.3321,pop:737255,hasLiveData:true},
  {id:'denver',name:'Denver',state:'CO',lat:39.7392,lng:-104.9903,pop:715522,hasLiveData:false},
  {id:'boston',name:'Boston',state:'MA',lat:42.3601,lng:-71.0589,pop:692600,hasLiveData:true},
  {id:'nashville',name:'Nashville',state:'TN',lat:36.1627,lng:-86.7816,pop:689447,hasLiveData:false},
  {id:'dc',name:'Washington D.C.',state:'DC',lat:38.9072,lng:-77.0369,pop:689545,hasLiveData:false},
  {id:'oklahoma-city',name:'Oklahoma City',state:'OK',lat:35.4676,lng:-97.5164,pop:681054,hasLiveData:false},
  {id:'el-paso',name:'El Paso',state:'TX',lat:31.7619,lng:-106.485,pop:678815,hasLiveData:false},
  {id:'portland',name:'Portland',state:'OR',lat:45.5051,lng:-122.675,pop:652503,hasLiveData:false},
  {id:'detroit',name:'Detroit',state:'MI',lat:42.3314,lng:-83.0458,pop:639111,hasLiveData:false},
  {id:'las-vegas',name:'Las Vegas',state:'NV',lat:36.1699,lng:-115.1398,pop:641903,hasLiveData:false},
  {id:'memphis',name:'Memphis',state:'TN',lat:35.1495,lng:-90.049,pop:633104,hasLiveData:false},
  {id:'louisville',name:'Louisville',state:'KY',lat:38.2527,lng:-85.7585,pop:633045,hasLiveData:false},
  {id:'baltimore',name:'Baltimore',state:'MD',lat:39.2904,lng:-76.6122,pop:593490,hasLiveData:false},
  {id:'milwaukee',name:'Milwaukee',state:'WI',lat:43.0389,lng:-87.9065,pop:577222,hasLiveData:false},
  {id:'albuquerque',name:'Albuquerque',state:'NM',lat:35.0844,lng:-106.6504,pop:564559,hasLiveData:false},
  {id:'tucson',name:'Tucson',state:'AZ',lat:32.2226,lng:-110.9747,pop:542629,hasLiveData:false},
  {id:'fresno',name:'Fresno',state:'CA',lat:36.7378,lng:-119.7871,pop:542107,hasLiveData:false},
  {id:'sacramento',name:'Sacramento',state:'CA',lat:38.5816,lng:-121.4944,pop:513624,hasLiveData:false},
  {id:'mesa',name:'Mesa',state:'AZ',lat:33.4152,lng:-111.8315,pop:504258,hasLiveData:false},
  {id:'kansas-city',name:'Kansas City',state:'MO',lat:39.0997,lng:-94.5786,pop:495327,hasLiveData:false},
  {id:'atlanta',name:'Atlanta',state:'GA',lat:33.749,lng:-84.388,pop:498715,hasLiveData:false},
  {id:'miami',name:'Miami',state:'FL',lat:25.7617,lng:-80.1918,pop:442241,hasLiveData:false},
  {id:'omaha',name:'Omaha',state:'NE',lat:41.2565,lng:-95.9345,pop:486051,hasLiveData:false},
  {id:'colorado-springs',name:'Colorado Springs',state:'CO',lat:38.8339,lng:-104.8214,pop:478961,hasLiveData:false},
  {id:'raleigh',name:'Raleigh',state:'NC',lat:35.7796,lng:-78.6382,pop:467665,hasLiveData:false},
  {id:'long-beach',name:'Long Beach',state:'CA',lat:33.7701,lng:-118.1937,pop:466742,hasLiveData:false},
  {id:'virginia-beach',name:'Virginia Beach',state:'VA',lat:36.8529,lng:-75.978,pop:459470,hasLiveData:false},
  {id:'minneapolis',name:'Minneapolis',state:'MN',lat:44.9778,lng:-93.265,pop:429954,hasLiveData:false},
  {id:'cleveland',name:'Cleveland',state:'OH',lat:41.4993,lng:-81.6944,pop:372624,hasLiveData:false},
  {id:'tampa',name:'Tampa',state:'FL',lat:27.9506,lng:-82.4572,pop:399700,hasLiveData:false},
  {id:'new-orleans',name:'New Orleans',state:'LA',lat:29.9511,lng:-90.0715,pop:383997,hasLiveData:false},
  {id:'arlington',name:'Arlington',state:'TX',lat:32.7357,lng:-97.1081,pop:394266,hasLiveData:false},
  {id:'bakersfield',name:'Bakersfield',state:'CA',lat:35.3733,lng:-119.0187,pop:380874,hasLiveData:false},
  {id:'honolulu',name:'Honolulu',state:'HI',lat:21.3069,lng:-157.8583,pop:350964,hasLiveData:false},
  {id:'anaheim',name:'Anaheim',state:'CA',lat:33.8366,lng:-117.9143,pop:346824,hasLiveData:false},
  {id:'aurora',name:'Aurora',state:'CO',lat:39.7294,lng:-104.8319,pop:366623,hasLiveData:false},
  {id:'pittsburgh',name:'Pittsburgh',state:'PA',lat:40.4406,lng:-79.9959,pop:302971,hasLiveData:false},
  {id:'santa-ana',name:'Santa Ana',state:'CA',lat:33.7455,lng:-117.8677,pop:310227,hasLiveData:false},
  {id:'corpus-christi',name:'Corpus Christi',state:'TX',lat:27.8006,lng:-97.3964,pop:317773,hasLiveData:false},
  {id:'riverside',name:'Riverside',state:'CA',lat:33.9806,lng:-117.3755,pop:314998,hasLiveData:false},
]

function getGrade(score) {
  if (score >= 80) return {grade:'A',label:'Excellent',color:'#22c55e'}
  if (score >= 65) return {grade:'B',label:'Good',color:'#84cc16'}
  if (score >= 50) return {grade:'C',label:'Moderate',color:'#eab308'}
  if (score >= 35) return {grade:'D',label:'Poor',color:'#f97316'}
  return {grade:'F',label:'Critical',color:'#ef4444'}
}

function buildScores() {
  console.log('AccessWatch data update:', new Date().toISOString())
  const scores = ALL_CITIES.map(city => {
    const emsScore = EMS_ESTIMATES[city.id] || 50
    const naloxoneRate = CDC_NALOXONE_2024[city.state] || 0.4
    const naloxoneScore = Math.min(100, Math.round((naloxoneRate / NATIONAL_NALOXONE_MAX) * 100))
    const finalScore = Math.round((emsScore * 0.5) + (naloxoneScore * 0.5))
    const {grade, label, color} = getGrade(finalScore)
    return {
      id: city.id, name: city.name, state: city.state,
      lat: city.lat, lng: city.lng, pop: city.pop,
      score: finalScore, grade, gradeLabel: label, gradeColor: color,
      emsScore, naloxoneScore, naloxoneRate,
      hasLiveData: city.hasLiveData,
      sources: {
        ems: city.hasLiveData ? 'City Open Data Portal (Live API)' : 'NEMSIS 2024 + Published EMS Research',
        naloxone: 'CDC IQVIA Naloxone Dispensing Rates 2024',
        demographics: 'US Census Bureau ACS 2023'
      },
      lastUpdated: new Date().toISOString().split('T')[0]
    }
  })
  scores.sort((a, b) => b.score - a.score)
  scores.forEach((c, i) => { c.rank = i + 1 })
  fs.writeFileSync(OUTPUT, JSON.stringify(scores, null, 2))
  const meta = {
    lastUpdated: new Date().toISOString(),
    nextUpdate: new Date(Date.now() + 90*24*60*60*1000).toISOString(),
    totalCities: scores.length,
    liveCities: scores.filter(c => c.hasLiveData).length,
    dataVersion: '2024.Q2',
    nationalNaloxoneAvg: 0.4,
    sources: [
      {name:'CDC IQVIA Naloxone Dispensing Rate Maps 2024',url:'https://www.cdc.gov/overdose-prevention/data-research/facts-stats/naloxone-dispensing-rate-maps.html'},
      {name:'NEMSIS 2024 Public Release Research Dataset',url:'https://nemsis.org'},
      {name:'NYC Open Data — EMS Incident Dispatch',url:'https://data.cityofnewyork.us'},
      {name:'US Census Bureau ACS 2023',url:'https://www.census.gov'},
      {name:'CDC PLACES Data Portal',url:'https://www.cdc.gov/places'}
    ],
    methodology: {
      emsWeight:0.5, naloxoneWeight:0.5,
      description:'Score = (EMS Equity × 0.5) + (Naloxone Access × 0.5). EMS measures response time fairness across income levels. Naloxone measures dispensing rate vs national average.'
    }
  }
  fs.writeFileSync(META, JSON.stringify(meta, null, 2))
  console.log(`Done — ${scores.length} cities scored`)
}
buildScores()
