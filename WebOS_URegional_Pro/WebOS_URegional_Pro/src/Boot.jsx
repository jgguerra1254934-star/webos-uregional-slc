import React, { useState, useEffect } from 'react';

const STEPS = [
  [0, 'Iniciando WebOS URegional…'], [30, 'Cargando sistema de archivos…'],
  [60, 'Iniciando servicios de la Sede Santa Lucía Cotzumalguapa…'], [90, 'Preparando el escritorio…'],
];

export default function Boot({ Logo, onDone }) {
  const [pct, setPct] = useState(0);
  const [stage, setStage] = useState('boot');
  const [user, setUser] = useState('Estudiante');
  const [pass, setPass] = useState('');
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    if (sessionStorage.getItem('webos_session')) return onDone();
    const t = setInterval(() => setPct(p => { if (p >= 100) { clearInterval(t); setStage('login'); return 100; } return p + 2; }), 45);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => { const t = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(t); }, []);
  const msg = [...STEPS].reverse().find(s => pct >= s[0])[1];
  const hour = now.getHours();
  const greet = hour < 12 ? 'Buenos días' : hour < 19 ? 'Buenas tardes' : 'Buenas noches';
  const enter = e => { e.preventDefault(); sessionStorage.setItem('webos_session', user || 'Estudiante'); onDone(); };
  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#00172e] to-[#003866] text-white p-6 text-center">
      <Logo className="w-28 h-28 mb-6" />
      {stage === 'boot' ? (
        <>
          <h1 className="text-xl font-bold">WebOS URegional</h1>
          <p className="text-sm text-slate-300 mb-5">Sede Santa Lucía Cotzumalguapa</p>
          <div className="w-64 h-1.5 bg-white/10 rounded-full overflow-hidden"><div className="h-full bg-[#FF5522]" style={{ width: `${pct}%` }} /></div>
          <p className="text-xs text-slate-400 mt-3 h-4">{msg}</p>
        </>
      ) : (
        <form onSubmit={enter} className="flex flex-col items-center gap-3 w-64">
          <div className="text-5xl font-light tabular-nums">{now.toLocaleTimeString('es-GT', { hour: '2-digit', minute: '2-digit' })}</div>
          <p className="text-sm text-slate-300 mb-2">{greet}, {user || 'estudiante'}</p>
          <input value={user} onChange={e => setUser(e.target.value)} aria-label="Usuario" placeholder="Usuario" className="w-full bg-white/10 border border-white/15 rounded-xl px-3 py-2 text-sm text-center focus:outline-none focus:border-[#FF5522]" />
          <input type="password" value={pass} onChange={e => setPass(e.target.value)} aria-label="Contraseña" placeholder="Contraseña (cualquiera)" className="w-full bg-white/10 border border-white/15 rounded-xl px-3 py-2 text-sm text-center focus:outline-none focus:border-[#FF5522]" autoFocus />
          <button className="w-full py-2 rounded-xl bg-[#FF5522] hover:bg-[#e04416] font-bold text-sm">Iniciar sesión</button>
          <p className="text-[11px] text-slate-400">Simulación académica: no se valida ninguna contraseña.</p>
        </form>
      )}
    </div>
  );
}
