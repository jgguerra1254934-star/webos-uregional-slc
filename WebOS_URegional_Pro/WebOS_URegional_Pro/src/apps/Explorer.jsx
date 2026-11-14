import React, { useState } from 'react';
import { Folder, FileText, ArrowLeft, Plus, Edit3, Trash2, ExternalLink, Search, FolderPlus, FilePlus, FolderOpen } from 'lucide-react';
import { getNode, addFolder, writeFile, removeNode, renameNode, exists } from '../fs';
import { useDialog } from '../Dialog';

const uniqueName = (folder, base) => {
  if (!folder.children.some(c => c.name === base)) return base;
  const [stem, ...ext] = base.split('.'); const suf = ext.length ? '.' + ext.join('.') : '';
  let i = 2; while (folder.children.some(c => c.name === `${stem} (${i})${suf}`)) i++;
  return `${stem} (${i})${suf}`;
};

export default function Explorer({ fs, setFs, onOpenFile }) {
  const [path, setPath] = useState([]);
  const [sel, setSel] = useState(null);
  const [menu, setMenu] = useState(null);
  const [q, setQ] = useState('');
  const dlg = useDialog();
  const folder = getNode(fs, path) || fs;
  const items = folder.children.filter(c => c.name.toLowerCase().includes(q.toLowerCase()))
    .sort((a, b) => (a.type === b.type ? a.name.localeCompare(b.name) : a.type === 'folder' ? -1 : 1));

  const go = p => { setPath(p); setSel(null); setQ(''); };
  const open = item => {
    if (item.type === 'folder') go([...path, item.name]);
    else if (item.name.endsWith('.url')) window.open(item.content, '_blank', 'noopener');
    else onOpenFile(path, item.name);
  };
  const create = async isFolder => {
    const name = await dlg.ask(isFolder ? 'Nombre de la nueva carpeta:' : 'Nombre del nuevo archivo:', uniqueName(folder, isFolder ? 'Nueva carpeta' : 'Nuevo archivo.txt'));
    if (!name) return;
    if (exists(fs, path, name)) return dlg.notify(`Ya existe "${name}" en esta carpeta.`);
    setFs(isFolder ? addFolder(fs, path, name) : writeFile(fs, path, name, '')); setSel(name);
  };
  const rename = async name => {
    const nw = await dlg.ask(`Renombrar "${name}" a:`, name);
    if (!nw || nw === name) return;
    if (exists(fs, path, nw)) return dlg.notify(`Ya existe "${nw}" en esta carpeta.`);
    setFs(renameNode(fs, path, name, nw)); setSel(nw);
  };
  const del = async name => {
    if (await dlg.confirm(`¿Eliminar "${name}"? Esta acción no se puede deshacer.`)) { setFs(removeNode(fs, path, name)); setSel(null); }
  };
  const onKey = e => {
    if (e.target.tagName === 'INPUT') return;
    const it = items.find(i => i.name === sel);
    if (e.key === 'Delete' && sel) del(sel);
    else if (e.key === 'F2' && sel) rename(sel);
    else if (e.key === 'Enter' && it) open(it);
    else if (e.key === 'Backspace' && path.length) go(path.slice(0, -1));
  };
  const showMenu = (e, item) => {
    e.preventDefault(); e.stopPropagation();
    const r = e.currentTarget.closest('[data-explorer]').getBoundingClientRect();
    if (item) setSel(item.name);
    setMenu({ x: Math.min(e.clientX - r.left, r.width - 170), y: Math.min(e.clientY - r.top, r.height - 190), item });
  };
  const Btn = ({ onClick, disabled, children, title }) => (
    <button onClick={onClick} disabled={disabled} title={title}
      className="px-2 py-1 rounded-lg bg-white/5 border border-white/10 hover:bg-white/15 disabled:opacity-30 flex items-center gap-1">{children}</button>
  );
  const M = ({ icon: I, label, onClick, danger }) => (
    <button onClick={() => { setMenu(null); onClick(); }} className={`w-full px-3 py-1.5 flex items-center gap-2 hover:bg-white/10 text-left ${danger ? 'text-red-300' : ''}`}><I className="w-3.5 h-3.5" /> {label}</button>
  );

  return (
    <div data-explorer tabIndex={0} onKeyDown={onKey} onClick={() => setMenu(null)}
      className="relative h-full flex flex-col bg-[#001d38] text-xs text-slate-200 outline-none">
      <div className="flex items-center gap-1.5 p-2 border-b border-white/10 flex-wrap">
        <Btn onClick={() => go(path.slice(0, -1))} disabled={!path.length} title="Subir (Retroceso)"><ArrowLeft className="w-3.5 h-3.5" /></Btn>
        <Btn onClick={() => create(true)}><FolderPlus className="w-3.5 h-3.5" /> Nueva carpeta</Btn>
        <Btn onClick={() => create(false)}><FilePlus className="w-3.5 h-3.5" /> Nuevo archivo</Btn>
        <Btn onClick={() => rename(sel)} disabled={!sel} title="F2"><Edit3 className="w-3.5 h-3.5" /></Btn>
        <Btn onClick={() => del(sel)} disabled={!sel} title="Supr"><Trash2 className="w-3.5 h-3.5" /></Btn>
        <div className="ml-auto flex items-center gap-1 bg-white/5 border border-white/10 rounded-lg px-2">
          <Search className="w-3.5 h-3.5 text-slate-400" />
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Buscar" className="bg-transparent py-1 w-24 outline-none" />
        </div>
      </div>
      <div className="px-3 py-1.5 border-b border-white/10 flex items-center gap-1 overflow-x-auto whitespace-nowrap">
        <button onClick={() => go([])} className="font-bold text-[#FF5522] hover:underline">Inicio</button>
        {path.map((p, i) => (<React.Fragment key={i}><span className="text-slate-500">/</span><button onClick={() => go(path.slice(0, i + 1))} className="hover:underline">{p}</button></React.Fragment>))}
      </div>
      <div className="flex-1 overflow-y-auto p-3 grid grid-cols-3 gap-3 content-start" onClick={() => setSel(null)} onContextMenu={e => showMenu(e, null)}>
        {items.length === 0 && <p className="col-span-3 text-center text-slate-400 mt-8">{q ? 'No hay resultados para tu búsqueda.' : 'Carpeta vacía. Haz clic derecho o usa "Nueva carpeta" para empezar.'}</p>}
        {items.map(item => (
          <div key={item.id} onClick={e => { e.stopPropagation(); setSel(item.name); }} onDoubleClick={() => open(item)} onContextMenu={e => showMenu(e, item)}
            className={`p-3 rounded-xl border flex flex-col items-center gap-1 cursor-pointer transition-colors ${sel === item.name ? 'bg-[#FF5522]/20 border-[#FF5522]/60' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}>
            {item.type === 'folder' ? <Folder className="w-8 h-8 text-amber-400" /> : item.name.endsWith('.url') ? <ExternalLink className="w-8 h-8 text-emerald-400" /> : <FileText className="w-8 h-8 text-sky-400" />}
            <span className="truncate w-full text-center text-[11px] font-medium mt-1">{item.name}</span>
          </div>
        ))}
      </div>
      <div className="px-3 py-1 border-t border-white/10 text-[10px] text-slate-400">{items.length} elemento(s){sel ? ` · seleccionado: ${sel}` : ''}</div>
      {menu && (
        <div className="absolute z-40 w-40 py-1 bg-[#002b50] border border-white/15 rounded-xl shadow-2xl" style={{ left: menu.x, top: menu.y }}>
          {menu.item ? (<>
            <M icon={FolderOpen} label="Abrir" onClick={() => open(menu.item)} />
            <M icon={Edit3} label="Renombrar" onClick={() => rename(menu.item.name)} />
            <M icon={Trash2} label="Eliminar" danger onClick={() => del(menu.item.name)} />
          </>) : (<>
            <M icon={FolderPlus} label="Nueva carpeta" onClick={() => create(true)} />
            <M icon={FilePlus} label="Nuevo archivo" onClick={() => create(false)} />
          </>)}
        </div>
      )}
      {dlg.node}
    </div>
  );
}
