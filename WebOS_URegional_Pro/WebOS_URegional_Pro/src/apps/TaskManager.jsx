import React from 'react';
import { Cpu, HardDrive, X } from 'lucide-react';

export const procInfo = (id, i) => {
  const h = [...id].reduce((a, c) => a + c.charCodeAt(0), 0);
  return { pid: 1000 + i, cpu: 2 + (h % 9), ram: 40 + (h % 160) };
};

export default function TaskManager({ windows, onClose, onFocus }) {
  const rows = windows.map((w, i) => ({ w, ...procInfo(w.id, i) }));
  const cpu = Math.min(99, 3 + rows.reduce((a, r) => a + r.cpu, 0));
  const ram = 320 + rows.reduce((a, r) => a + r.ram, 0);
  const Bar = ({ icon: I, label, value, pct }) => (
    <div className="flex-1">
      <div className="flex justify-between mb-1"><span className="flex items-center gap-1"><I className="w-3.5 h-3.5" /> {label}</span><span className="font-mono text-[#FF5522]">{value}</span></div>
      <div className="h-1.5 bg-white/10 rounded-full overflow-hidden"><div className="h-full bg-[#FF5522] transition-all" style={{ width: `${pct}%` }} /></div>
    </div>
  );
  return (
    <div className="h-full flex flex-col bg-[#001d38] text-xs text-slate-200 p-3 gap-3">
      <div className="flex gap-4"><Bar icon={Cpu} label="CPU" value={`${cpu}%`} pct={cpu} /><Bar icon={HardDrive} label="RAM" value={`${ram} MB`} pct={Math.min(100, ram / 40)} /></div>
      <div className="flex-1 overflow-y-auto border border-white/10 rounded-xl">
        <table className="w-full text-left">
          <thead className="sticky top-0 bg-[#002b50] text-slate-300"><tr><th className="p-2">PID</th><th>Proceso</th><th>Estado</th><th>CPU</th><th>RAM</th><th /></tr></thead>
          <tbody>
            <tr className="border-t border-white/5 text-slate-400"><td className="p-2 font-mono">1</td><td>webos-kernel</td><td>Sistema</td><td>3%</td><td>320 MB</td><td /></tr>
            {rows.map(({ w, pid, cpu: c, ram: r }) => (
              <tr key={w.id} onClick={() => onFocus(w.id)} className="border-t border-white/5 hover:bg-white/5 cursor-pointer">
                <td className="p-2 font-mono">{pid}</td><td className="font-medium">{w.title}</td>
                <td>{w.minimized ? 'Minimizado' : 'Activo'}</td><td>{c}%</td><td>{r} MB</td>
                <td><button onClick={e => { e.stopPropagation(); onClose(w.id); }} className="px-2 py-0.5 rounded-lg bg-red-500/20 hover:bg-red-500/40 text-red-300 flex items-center gap-1"><X className="w-3 h-3" /> Finalizar</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-[10px] text-slate-400">Simulación académica: cada ventana abierta es un proceso. Las cifras son demostrativas.</p>
    </div>
  );
}
