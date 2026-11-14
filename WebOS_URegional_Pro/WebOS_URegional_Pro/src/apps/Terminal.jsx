import React, { useState, useRef, useEffect } from 'react';
import { getNode, resolvePath, addFolder, writeFile, removeNode } from '../fs';
import { procInfo } from './TaskManager';

const BANNER = [
  'Universidad Regional de Guatemala - Sede Santa Lucía Cotzumalguapa',
  'Terminal WebOS v4.0 | https://uregionalregion2.edu.gt/',
  'Escribe "help" para ver los comandos.',
];

export default function Terminal({ fs, setFs, theme, setTheme, windows, closeWindow }) {
  const [logs, setLogs] = useState(BANNER);
  const [input, setInput] = useState('');
  const [cwd, setCwd] = useState([]);
  const [hist, setHist] = useState([]);
  const [hi, setHi] = useState(-1);
  const end = useRef(null);
  useEffect(() => { end.current?.scrollIntoView(); }, [logs]);
  const prompt = `uregional-slc@webos:/${cwd.join('/')}$`;

  const run = raw => {
    const [cmd, ...args] = raw.trim().split(/\s+/);
    const arg = args.join(' ');
    const here = getNode(fs, cwd);
    const target = resolvePath(cwd, arg);
    switch ((cmd || '').toLowerCase()) {
      case '': return '';
      case 'help': return 'help, pwd, ls [ruta], cd <ruta>, cat <archivo>, mkdir <nombre>, touch <archivo>,\nrm <nombre>, echo <texto> > <archivo>, clear, date, whoami, uregional,\nstatus, theme dark|light, ps, kill <pid>, neofetch, logout';
      case 'pwd': return '/' + cwd.join('/');
      case 'ls': { const n = arg ? getNode(fs, target) : here; return !n ? `ls: no existe "${arg}"` : n.type === 'file' ? n.name : n.children.map(c => (c.type === 'folder' ? c.name + '/' : c.name)).join('   ') || '(vacío)'; }
      case 'cd': { const n = getNode(fs, target); if (!n || n.type !== 'folder') return `cd: no existe la carpeta "${arg}"`; setCwd(target); return ''; }
      case 'cat': { const n = getNode(fs, target); return !n || n.type !== 'file' ? `cat: no existe el archivo "${arg}"` : n.content || '(archivo vacío)'; }
      case 'mkdir': if (!arg) return 'mkdir: falta el nombre'; if (getNode(fs, target)) return 'mkdir: ya existe'; setFs(addFolder(fs, target.slice(0, -1), target.at(-1))); return '';
      case 'touch': if (!arg) return 'touch: falta el nombre'; if (!getNode(fs, target)) setFs(writeFile(fs, target.slice(0, -1), target.at(-1), '')); return '';
      case 'rm': if (!getNode(fs, target)) return `rm: no existe "${arg}"`; setFs(removeNode(fs, target.slice(0, -1), target.at(-1))); return '';
      case 'echo': {
        const m = raw.match(/^echo\s+(.*?)\s*>\s*(\S+)$/i);
        if (!m) return args.join(' ');
        const p = resolvePath(cwd, m[2]); setFs(writeFile(fs, p.slice(0, -1), p.at(-1), m[1].replace(/^["']|["']$/g, ''))); return '';
      }
      case 'date': return new Date().toLocaleString('es-GT');
      case 'whoami': return 'estudiante@uregional-slc';
      case 'uregional': case 'site': return 'Universidad Regional de Guatemala - Sede Santa Lucía Cotzumalguapa\nPortal Web: https://uregionalregion2.edu.gt/';
      case 'status': { const r = windows.map((w, i) => procInfo(w.id, i)); return `Procesos activos: ${windows.length}\nCPU: ${Math.min(99, 3 + r.reduce((a, x) => a + x.cpu, 0))}%\nRAM: ${320 + r.reduce((a, x) => a + x.ram, 0)} MB\nTema: ${theme}`; }
      case 'theme': if (arg !== 'dark' && arg !== 'light') return 'Uso: theme dark|light'; setTheme(arg); return `Tema cambiado a ${arg}`;
      case 'ps': case 'processes': return ['PID    PROCESO', '1      webos-kernel', ...windows.map((w, i) => `${1000 + i}   ${w.title}`)].join('\n');
      case 'kill': { const i = Number(arg) - 1000; const w = windows[i]; if (!w) return `kill: no existe el PID ${arg}`; closeWindow(w.id); return `Proceso ${arg} (${w.title}) finalizado`; }
      case 'neofetch': return ['  _   _ ____             OS: WebOS URegional 4.0', ' | | | |  _ \\            Sede: Santa Lucía Cotzumalguapa', ' | | | | |_) |           Región: 2', ' | |_| |  _ <            Shell: uregional-sh', '  \\___/|_| \\_\\           Tema: ' + theme, `                          Procesos: ${windows.length}`].join('\n');
      case 'logout': sessionStorage.removeItem('webos_session'); window.location.reload(); return 'Cerrando sesión...';
      case 'clear': setLogs([]); return null;
      default: return `Comando no reconocido: "${cmd}". Escribe "help".`;
    }
  };

  const onKey = e => {
    if (e.key === 'Enter') {
      const res = run(input);
      if (res !== null) setLogs(l => [...l, `${prompt} ${input}`, res].filter(x => x !== ''));
      if (input.trim()) setHist(h => [input, ...h]);
      setInput(''); setHi(-1);
    } else if (e.key === 'ArrowUp') { e.preventDefault(); const n = Math.min(hi + 1, hist.length - 1); if (hist[n] !== undefined) { setHi(n); setInput(hist[n]); } }
    else if (e.key === 'ArrowDown') { e.preventDefault(); const n = hi - 1; setHi(n); setInput(n >= 0 ? hist[n] : ''); }
  };

  return (
    <div className="h-full bg-[#00172e] p-3 font-mono text-xs text-emerald-400 flex flex-col" onClick={e => e.currentTarget.querySelector('input')?.focus()}>
      <div className="flex-1 overflow-y-auto space-y-1">
        {logs.map((l, i) => <div key={i} className="whitespace-pre-wrap">{l}</div>)}
        <div ref={end} />
      </div>
      <div className="flex items-center gap-2 pt-2 border-t border-white/10">
        <span className="text-[#FF5522] font-bold shrink-0">{prompt}</span>
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={onKey} className="flex-1 bg-transparent text-emerald-400 outline-none" autoFocus spellCheck={false} />
      </div>
    </div>
  );
}
