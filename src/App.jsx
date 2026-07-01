import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import City from './pages/City'
import Methodology from './pages/Methodology'
import About from './pages/About'

function ScrollTop() {
  const { pathname } = useLocation()
  useEffect(() => window.scrollTo(0, 0), [pathname])
  return null
}

export default function App() {
  return (
    <>
      <ScrollTop/>
      <Navbar/>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/city/:id" element={<City/>}/>
        <Route path="/methodology" element={<Methodology/>}/>
        <Route path="/about" element={<About/>}/>
      </Routes>
    </>
  )
}
