import { Routes, Route, Link } from 'react-router-dom'
import { useRef, useState, useEffect } from 'react'
import Calendar from './pages/Calendar'
import momentos from './data/momentos.json'
import './App.css'

const Home = () => {
  const [tocando, setTocando] = useState(false);
  const audioRef = useRef(null);
  const scrollIntervalRef = useRef(null);

  const fotosCoracao = [
    "/foto13.png", "/foto2.png", "/foto3.png", "/foto4.png", "/foto5.png",
    "/foto15.png", "/foto14.png", "/fotobuque.png", "/foto6.png", "/foto7.png",
    "/foto8.png", "/foto9.png", "/foto10.png"
  ];

  const iniciarExperiencia = () => {
    if (!tocando) {
      audioRef.current.play();
      setTocando(true);
      scrollIntervalRef.current = setInterval(() => {
        window.scrollBy(0, 1); 
        const fimDaPagina = window.innerHeight + window.scrollY >= document.body.offsetHeight;
        if (fimDaPagina) {
          clearInterval(scrollIntervalRef.current);
          setTocando(false);
        }
      }, 50); 
    } else {
      audioRef.current.pause();
      setTocando(false);
      clearInterval(scrollIntervalRef.current);
    }
  };

  useEffect(() => {
    return () => clearInterval(scrollIntervalRef.current);
  }, []);

  return (
    <div className="home-timeline-page">
      <audio ref={audioRef} src="/music.mp3" onEnded={() => { setTocando(false); clearInterval(scrollIntervalRef.current); }} />

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
          <div key={index} className={`timeline-node ${index % 2 === 0 ? 'left' : 'right'}`}>
            <div className="node-content">
              <span className="node-date">{item.data}</span>
              <h3>{item.titulo}</h3>
              <p>{item.desc}</p>
            </div>

            <div className="string-container">
              <div className="string-line"></div>
              <div className="polaroid-wrapper">
                <div className="washi-tape"></div>
                <img src={item.foto} alt={item.titulo} className="polaroid-img" />
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
              src={src} 
              className="heart-photo" 
              alt="Momento especial" 
            />
          ))}
        </div>
        <p style={{marginTop: '40px', color: '#ffb4c2', fontWeight: '600'}}>Amo você!</p>
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