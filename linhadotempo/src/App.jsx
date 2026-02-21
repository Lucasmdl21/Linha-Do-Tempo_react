import { Routes, Route, Link } from 'react-router-dom'
import { useRef, useState, useEffect } from 'react'
import Calendar from './pages/Calendar'
import momentos from './data/momentos.json'
import './App.css'

const Home = () => {
  const [tocando, setTocando] = useState(false)
  const audioRef = useRef(null)
  const requestRef = useRef(null) // Usado para a animação suave no iPhone

  const fotosCoracao = [
    "foto13.png", "foto2.png", "foto3.png", "foto4.png", "foto5.png",
    "foto15.png", "foto14.png", "fotobuque.png", "foto6.png", "foto7.png",
    "foto8.png", "foto9.png", "foto10.png"
  ]

  // Função de rolagem otimizada para iOS
  const scrollStep = () => {
    window.scrollBy(0, 0.8) // Velocidade suave
    const fimDaPagina = window.innerHeight + window.scrollY >= document.body.offsetHeight - 2

    if (fimDaPagina) {
      cancelAnimationFrame(requestRef.current)
      setTocando(false)
    } else {
      requestRef.current = requestAnimationFrame(scrollStep)
    }
  }

  const iniciarExperiencia = () => {
    if (!tocando) {
      // No iPhone, o play() deve ser imediato ao clique
      audioRef.current.play()
        .then(() => {
          setTocando(true)
          requestRef.current = requestAnimationFrame(scrollStep)
        })
        .catch(err => {
          console.error("Erro ao tocar áudio no iOS:", err)
          // Fallback caso o navegador bloqueie
          setTocando(true)
          requestRef.current = requestAnimationFrame(scrollStep)
        })
    } else {
      audioRef.current.pause()
      setTocando(false)
      cancelAnimationFrame(requestRef.current)
    }
  }

  // Limpeza ao sair da página
  useEffect(() => {
    return () => cancelAnimationFrame(requestRef.current)
  }, [])

  return (
    <div className="home-timeline-page">
      <audio
        ref={audioRef}
        src={`${import.meta.env.BASE_URL}music.mp3`}
        preload="auto"
        loop
      />

      <header className="timeline-header">
        <h1>Nossa História ❤️</h1>
        <p>Cada detalhe guardado com amor</p>

        <div className="botoes-topo">
          <Link to="/calendar" className="btn-ir-calendario">📅 Calendário</Link>
          <button onClick={iniciarExperiencia} className="btn-musica">
            {tocando ? "⏸️ Pausar" : "🎵 Iniciar Experiência"}
          </button>
        </div>
      </header>

      <div className="timeline-main">
        {momentos.map((item, index) => (
          <div key={index} className={`timeline-node ${index % 2 === 0 ? "left" : "right"}`}>
            <div className="node-content">
              <span className="node-date">{item.data}</span>
              <h3>{item.titulo}</h3>
              <p>{item.desc}</p>
            </div>

            <div className="string-container">
              <div className="string-line"></div>
              <div className="polaroid-wrapper">
                <div className="washi-tape"></div>
                <img
                  src={`${import.meta.env.BASE_URL}${item.foto}`}
                  alt={item.titulo}
                  className="polaroid-img"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <section className="heart-section">
        <h2>Para Sempre Nós... ❤️</h2>
        <div className="heart-container">
          {fotosCoracao.map((src, i) => (
            <img
              key={i}
              src={`${import.meta.env.BASE_URL}${src}`}
              className="heart-photo"
              alt="Momento especial"
            />
          ))}
        </div>
        <p style={{ marginTop: "40px", color: "#ffb4c2", fontWeight: "600" }}>Amo você!</p>
      </section>
    </div>
  )
}

function App() {
  return (
    <div className="app-wrapper">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/calendar" element={<Calendar />} />
      </Routes>
    </div>
  )
}

export default App