import React, { useState, useEffect } from 'react';
import './Calendar.css';

const Calendar = () => {
  /* --- ESTADOS INICIAIS E CONFIGURAÇÕES ---
     Aqui definimos a data que o calendário mostra primeiro e o controle 
     do modo de marcação de dias passados. 
  --- */
  const [dataExibida, setDataExibida] = useState(new Date(2026, 0, 1));
  const [modoMarcar, setModoMarcar] = useState(false);
  const [diaSelecionado, setDiaSelecionado] = useState(null);
  const [textoEvento, setTextoEvento] = useState('');
  const [corEvento, setCorEvento] = useState('#ff4d6d');
  const [corMarcacao, setCorMarcacao] = useState('#d1d5db'); 

  /* --- PERSISTÊNCIA DE DADOS (LocalStorage) ---
     Estes blocos buscam os dados salvos no navegador para que, ao fechar a página,
     as marcações e eventos não sumam.
  --- */
  const [eventos, setEventos] = useState(() => {
    const salvo = localStorage.getItem('eventos-timeline-v6');
    return salvo ? JSON.parse(salvo) : {};
  });

  const [diasLidos, setDiasLidos] = useState(() => {
    const salvo = localStorage.getItem('dias-lidos-v6');
    return salvo ? JSON.parse(salvo) : {};
  });

  useEffect(() => {
    localStorage.setItem('eventos-timeline-v6', JSON.stringify(eventos));
    localStorage.setItem('dias-lidos-v6', JSON.stringify(diasLidos));
  }, [eventos, diasLidos]);

  /* --- CÁLCULOS DO CALENDÁRIO ---
     Bloco responsável por descobrir qual o mês atual, o ano e quantos 
     espaços vazios precisamos deixar antes do dia 1 (para alinhar com o dia da semana).
  --- */
  const mes = dataExibida.getMonth();
  const ano = dataExibida.getFullYear();
  const nomeMes = dataExibida.toLocaleDateString('pt-BR', { month: 'long' });
  const primeiroDiaSemana = new Date(ano, mes, 1).getDay();
  const diasNoMes = new Date(ano, mes + 1, 0).getDate();

  /* --- LÓGICA DE CLIQUE E INTERAÇÃO ---
     Este bloco decide o que acontece quando você clica em um dia:
     Se estiver no 'Modo Marcar', ele pinta o dia. Se não, ele abre o modal para escrever.
  --- */
  const handleCliqueDia = (idDia, ev) => {
    if (modoMarcar) {
      if (diasLidos[idDia]) {
        const novosLidos = { ...diasLidos };
        delete novosLidos[idDia];
        setDiasLidos(novosLidos);
      } else {
        setDiasLidos({ ...diasLidos, [idDia]: corMarcacao });
      }
    } else {
      setDiaSelecionado(idDia);
      setTextoEvento(ev?.texto || '');
      setCorEvento(ev?.cor || '#ff4d6d');
    }
  };

  const salvarEvento = () => {
    setEventos({ ...eventos, [diaSelecionado]: { texto: textoEvento, cor: corEvento } });
    setDiaSelecionado(null);
  };

  return (
    <div className="calendar-app">
      <div className="calendar-container">
        
        {/* CABEÇALHO DE NAVEGAÇÃO: Controla as setas de trocar o mês */}
        <div className="calendar-nav-header">
          <button className="arrow-btn" onClick={() => setDataExibida(new Date(ano, mes - 1, 1))}>‹</button>
          <div className="title-stack">
            <h2 className="current-month">{nomeMes}</h2>
            <span className="current-year">{ano}</span>
          </div>
          <button className="arrow-btn" onClick={() => setDataExibida(new Date(ano, mes + 1, 1))}>›</button>
        </div>

        {/* PAINEL DE CONTROLE: Ativa o modo de marcar dias e escolhe a cor da tinta */}
        <div className={`painel-marcar ${modoMarcar ? 'ativo' : ''}`}>
          <button className="btn-modo-marcar" onClick={() => setModoMarcar(!modoMarcar)}>
            {modoMarcar ? "✨ Modo Marcar Ativo" : "✅ Marcar dias que passaram"}
          </button>
          
          {modoMarcar && (
            <div className="seletor-cor-marcar">
              <span>Cor da marcação:</span>
              <input type="color" value={corMarcacao} onChange={(e) => setCorMarcacao(e.target.value)} />
            </div>
          )}
        </div>

        {/* GRADE DE DIAS: Desenha os nomes da semana e cada quadradinho dos dias */}
        <div className="days-grid">
          {['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'].map(d => (
            <div key={d} className="week-label">{d}</div>
          ))}

          {Array.from({ length: primeiroDiaSemana }).map((_, i) => (
            <div key={`empty-${i}`} className="day-slot empty"></div>
          ))}

          {Array.from({ length: diasNoMes }, (_, i) => i + 1).map(dia => {
            const idDia = `${ano}-${mes}-${dia}`;
            const ev = eventos[idDia];
            const corLido = diasLidos[idDia];
            
            let estiloDinamico = {};
            if (corLido) {
              estiloDinamico = { backgroundColor: corLido, color: 'white', opacity: 0.8 };
            } else if (ev) {
              estiloDinamico = { backgroundColor: ev.cor, color: 'white' };
            }

            return (
              <div 
                key={dia} 
                className={`day-slot ${ev ? 'has-event' : ''} ${corLido ? 'is-read' : ''}`}
                style={estiloDinamico}
                onClick={() => handleCliqueDia(idDia, ev)}
              >
                <span className="number">{dia}</span>
                {ev && !corLido && <span className="label-text">{ev.texto}</span>}
                {corLido && <span className="check-icon">✔</span>}
              </div>
            );
          })}
        </div>
      </div>

      {/* JANELA MODAL: Aparece apenas quando você clica em um dia para salvar uma memória */}
      {diaSelecionado && (
        <div className="overlay" onClick={() => setDiaSelecionado(null)}>
          <div className="pink-modal" onClick={e => e.stopPropagation()}>
            <h3>Dia {diaSelecionado.split('-')[2]}</h3>
            <input type="text" value={textoEvento} onChange={(e) => setTextoEvento(e.target.value)} placeholder="O que vai rolar?" />
            <div className="color-select">
              <label>Cor do Evento:</label>
              <input type="color" value={corEvento} onChange={(e) => setCorEvento(e.target.value)} />
            </div>
            <div className="actions-column">
              <button className="save-button" onClick={salvarEvento}>Salvar Data</button>
              <button className="back-button" onClick={() => setDiaSelecionado(null)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;