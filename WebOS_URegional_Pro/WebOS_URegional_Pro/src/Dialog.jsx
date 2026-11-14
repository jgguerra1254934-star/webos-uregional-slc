import React, { useState, useCallback, useRef, useEffect } from 'react';

// Diálogos propios del sistema: reemplazan prompt/confirm/alert del navegador.
export function useDialog() {
  const [d, setD] = useState(null);
  const ask = useCallback((msg, def = '') => new Promise(res => setD({ kind: 'ask', msg, def, res })), []);
  const confirm = useCallback(msg => new Promise(res => setD({ kind: 'confirm', msg, res })), []);
  const notify = useCallback(msg => new Promise(res => setD({ kind: 'notify', msg, res })), []);
  const ref = useRef(null);
  useEffect(() => { if (d?.kind === 'ask') { ref.current?.focus(); ref.current?.select(); } }, [d]);
  const close = ok => {
    const v = d.kind === 'ask' ? (ok ? ref.current.value.trim().replace(/[\/\\]/g, '') : null) : ok;
    d.res(v); setD(null);
  };
  const node = d && (
    <div className="absolute inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onMouseDown={e => e.stopPropagation()}>
      <form onSubmit={e => { e.preventDefault(); close(true); }} onKeyDown={e => e.key === 'Escape' && close(false)}
        className="w-full max-w-xs bg-[#002b50] border border-[#FF5522]/40 rounded-2xl p-4 shadow-2xl text-xs text-white">
        <p className="mb-3 font-medium leading-relaxed">{d.msg}</p>
        {d.kind === 'ask' && <input ref={ref} defaultValue={d.def} className="w-full mb-3 bg-[#00172e] border border-white/15 rounded-lg px-3 py-2 focus:outline-none focus:border-[#FF5522]" />}
        <div className="flex justify-end gap-2">
          {d.kind !== 'notify' && <button type="button" onClick={() => close(false)} className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20">Cancelar</button>}
          <button autoFocus={d.kind !== 'ask'} className="px-3 py-1.5 rounded-lg bg-[#FF5522] hover:bg-[#e04416] font-bold">{d.kind === 'confirm' ? 'Eliminar' : 'Aceptar'}</button>
        </div>
      </form>
    </div>
  );
  return { ask, confirm, notify, node };
}
