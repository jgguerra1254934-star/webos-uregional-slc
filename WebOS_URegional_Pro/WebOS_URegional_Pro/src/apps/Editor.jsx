import React, { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import { getNode, writeFile, exists } from '../fs';
import { useDialog } from '../Dialog';

export default function Editor({ fs, setFs, file, setFile }) {
  const [text, setText] = useState('');
  const [saved, setSaved] = useState(true);
  const dlg = useDialog();
  useEffect(() => {
    const n = file ? getNode(fs, [...file.parts, file.name]) : null;
    setText(n?.content ?? ''); setSaved(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file?.name, (file?.parts || []).join('/')]);
  const save = async () => {
    if (file) { setFs(writeFile(fs, file.parts, file.name, text)); setSaved(true); return; }
    let name = await dlg.ask('Guardar en Mis_Documentos como:', 'apuntes.txt');
    if (!name) return;
    if (!name.includes('.')) name += '.txt';
    if (exists(fs, ['Mis_Documentos'], name) && !(await dlg.confirm(`"${name}" ya existe. ¿Reemplazar?`))) return;
    setFs(writeFile(fs, ['Mis_Documentos'], name, text));
    setFile({ parts: ['Mis_Documentos'], name }); setSaved(true);
  };
  return (
    <div className="relative h-full flex flex-col bg-[#001d38] p-2 gap-2">
      <div className="flex items-center justify-between text-xs text-slate-300 px-1">
        <span className="truncate font-medium">{file ? `/${[...file.parts, file.name].join('/')}` : 'Documento sin guardar'}{!saved && ' •'}</span>
        <button onClick={save} className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#FF5522] hover:bg-[#e04416] text-white font-bold"><Save className="w-3.5 h-3.5" /> Guardar</button>
      </div>
      <textarea value={text} onChange={e => { setText(e.target.value); setSaved(false); }}
        onKeyDown={e => { if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') { e.preventDefault(); save(); } }}
        placeholder="Escribe tus notas. Ctrl+S para guardar."
        className="flex-1 w-full bg-[#00172e] border border-white/10 rounded-xl p-3 text-xs text-white font-mono focus:outline-none focus:border-[#FF5522] resize-none" />
      {dlg.node}
    </div>
  );
}
