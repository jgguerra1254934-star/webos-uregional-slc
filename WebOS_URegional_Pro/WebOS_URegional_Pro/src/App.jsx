import React, { useState, useEffect, useRef } from 'react';
import { 
  Folder, FileText, Terminal as TerminalIcon, Calculator as CalcIcon, 
  Globe, Music, Image as ImageIcon, Settings, Gamepad2, X, Minus, 
  Square, RefreshCw, Sun, Moon, Volume2, Wifi, Battery, Monitor, 
  Cpu, HardDrive, Play, Pause, SkipForward, SkipBack, Search, Plus, 
  Trash2, Edit3, ArrowLeft, ArrowRight, LayoutGrid, Sliders, PlayCircle,
  Bot, CloudSun, Bell, Layers, Maximize2, Minimize2, Sparkles, Send,
  GraduationCap, BookOpen, UserCheck, Calendar, Award, Compass, ExternalLink, MapPin, UploadCloud, CheckCircle
} from 'lucide-react';

// ==========================================
// LOGO COMPONENT INSPIRED BY THE IMAGE
// ==========================================
function URegionalLogo({ className = "", compact = false }) {
  if (compact) {
    return (
      <div className={`flex items-center gap-1.5 font-sans ${className}`}>
        <div className="w-6 h-6 bg-[#005596] border border-white/30 rounded-md flex items-center justify-center relative overflow-hidden shadow">
          <Globe className="w-4 h-4 text-white animate-spin-slow" />
          <div className="absolute bottom-0 w-full h-1.5 bg-[#FF5522]" />
        </div>
        <span className="font-extrabold tracking-tight text-white text-xs">
          UREGIONAL <span className="text-[#FF5522]">SLC</span>
        </span>
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center bg-[#004a85] p-3 rounded-xl border border-white/20 shadow-xl select-none ${className}`}>
      <div className="text-[10px] tracking-[0.25em] text-white/90 font-light uppercase">UNIVERSIDAD</div>
      <div className="flex items-center gap-1 font-black text-white text-lg tracking-wider my-0.5">
        <span>REGI</span>
        <div className="w-5 h-5 rounded-full border-2 border-white flex items-center justify-center relative bg-[#003866]">
          <Globe className="w-3.5 h-3.5 text-white" />
        </div>
        <span>NAL</span>
      </div>
      <div className="text-[9px] tracking-[0.3em] text-white/80 font-medium uppercase border-t border-b border-white/20 w-full text-center py-0.5">
        DE GUATEMALA
      </div>
      <div className="mt-1.5 bg-[#FF5522] text-white text-[10px] font-black italic px-3 py-0.5 transform -skew-x-12 shadow-md uppercase tracking-wider">
        SANTA LUCÍA COTZUMALGUAPA
      </div>
    </div>
  );
}

// ==========================================
// VIRTUAL FILE SYSTEM INITIAL STATE
// ==========================================
const initialFileSystem = {
  id: 'root',
  name: 'Root',
  type: 'folder',
  children: [
    {
      id: 'facultades',
      name: 'Facultades_URegional_SLC',
      type: 'folder',
      children: [
        { id: 'derecho', name: 'Ciencias_Juridicas_y_Sociales.txt', type: 'file', content: 'Universidad Regional de Guatemala\nSede Santa Lucía Cotzumalguapa\n\nFacultad de Ciencias Jurídicas y Sociales\nSitio web oficial: https://uregionalregion2.edu.gt/' },
        { id: 'economicas', name: 'Ciencias_Economicas.txt', type: 'file', content: 'Facultad de Ciencias Económicas - Santa Lucía Cotzumalguapa\nCursos: Administración de Empresas, Auditoría y Comercio Internacional.' },
        { id: 'ingenieria', name: 'Ingenieria_en_Sistemas.txt', type: 'file', content: 'Facultad de Ingeniería\nProyecto de Graduación: Sistema Operativo Simulado WebOS URegional Santa Lucía Cotzumalguapa.' }
      ]
    },
    {
      id: 'docs',
      name: 'Mis_Documentos',
      type: 'folder',
      children: [
        { id: 'welcome', name: 'Bienvenido_URegional_SLC.txt', type: 'file', content: '¡Bienvenido al WebOS de la Universidad Regional de Guatemala - Sede Santa Lucía Cotzumalguapa!\n\nWebsite Oficial de la Región 2:\nhttps://uregionalregion2.edu.gt/' },
        { id: 'link_oficial', name: 'Portal_Region2.url', type: 'file', content: 'https://uregionalregion2.edu.gt/' }
      ]
    }
  ]
};

const WALLPAPERS = [
  { id: 'uregional_official', name: 'Escudo Oficial Cotzumalguapa (Fondo Real)', url: 'official_slc_bg' },
  { id: 'uregional_blue', name: 'Azul Institucional Cotzumalguapa', url: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1600&q=80' },
  { id: 'campus', name: 'Campus Universitario', url: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1600&q=80' },
  { id: 'tech_blue', name: 'Tecnología Región 2', url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1600&q=80' }
];

export default function App() {
  const [theme, setTheme] = useState('dark');
  const [wallpaper, setWallpaper] = useState(WALLPAPERS[0].url);
  const [time, setTime] = useState(new Date());
  const [systemStats, setSystemStats] = useState({ cpu: 12, ram: 38, disk: 25 });
  const [fileSystem, setFileSystem] = useState(() => {
    try {
      const saved = localStorage.getItem('webos_uregional_slc_fs');
      return saved ? JSON.parse(saved) : initialFileSystem;
    } catch {
      return initialFileSystem;
    }
  });

  const [isControlCenterOpen, setIsControlCenterOpen] = useState(false);
  const [isStartMenuOpen, setIsStartMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Universidad Regional - Santa Lucía Cotzumalguapa', msg: 'Sistema WebOS Región 2 iniciado en https://uregionalregion2.edu.gt/', time: 'Ahora' }
  ]);
  const [showNotifications, setShowNotifications] = useState(false);

  const [windows, setWindows] = useState([]);
  const [activeWindowId, setActiveWindowId] = useState(null);
  const [maxZIndex, setMaxZIndex] = useState(10);

  useEffect(() => {
    localStorage.setItem('webos_uregional_slc_fs', JSON.stringify(fileSystem));
  }, [fileSystem]);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    const statsTimer = setInterval(() => {
      setSystemStats({
        cpu: Math.floor(10 + Math.random() * 15),
        ram: Math.floor(35 + Math.random() * 8),
        disk: 25
      });
    }, 2500);
    return () => {
      clearInterval(timer);
      clearInterval(statsTimer);
    };
  }, []);

  const openApp = (appId, title, IconComponent, content, defaultSize = { w: 800, h: 550 }) => {
    setIsStartMenuOpen(false);
    const existing = windows.find(w => w.id === appId);
    if (existing) {
      if (existing.minimized) {
        setWindows(windows.map(w => w.id === appId ? { ...w, minimized: false } : w));
      }
      focusWindow(appId);
      return;
    }

    const nextZ = maxZIndex + 1;
    setMaxZIndex(nextZ);
    const newWin = {
      id: appId,
      title,
      icon: IconComponent,
      content,
      x: 80 + (windows.length * 30) % 180,
      y: 50 + (windows.length * 30) % 120,
      w: defaultSize.w,
      h: defaultSize.h,
      minimized: false,
      maximized: false,
      zIndex: nextZ
    };
    setWindows([...windows, newWin]);
    setActiveWindowId(appId);
  };

  const closeWindow = (id) => {
    setWindows(windows.filter(w => w.id !== id));
    if (activeWindowId === id) setActiveWindowId(null);
  };

  const toggleMinimize = (id) => {
    setWindows(windows.map(w => w.id === id ? { ...w, minimized: !w.minimized } : w));
  };

  const toggleMaximize = (id) => {
    setWindows(windows.map(w => w.id === id ? { ...w, maximized: !w.maximized } : w));
  };

  const focusWindow = (id) => {
    if (activeWindowId === id) return;
    const nextZ = maxZIndex + 1;
    setMaxZIndex(nextZ);
    setWindows(windows.map(w => w.id === id ? { ...w, zIndex: nextZ } : w));
    setActiveWindowId(id);
  };

  const availableApps = [
    { id: 'portal', name: 'Portal Cotzumalguapa', icon: GraduationCap, color: 'from-[#FF5522] to-amber-500 text-white', component: <URegionalPortal /> },
    { id: 'browser', name: 'Sitio Web Región 2', icon: Globe, color: 'from-[#005596] to-sky-400 text-white', component: <Browser /> },
    { id: 'copilot', name: 'Copilot URegional', icon: Bot, color: 'from-amber-400 to-orange-500 text-slate-900', component: <AICopilotURegional /> },
    { id: 'files', name: 'Archivos', icon: Folder, color: 'from-[#003866] to-[#005596] text-amber-400', component: <FileManager fs={fileSystem} /> },
    { id: 'editor', name: 'Notas Académicas', icon: FileText, color: 'from-blue-600 to-indigo-600 text-white', component: <TextEditor /> },
    { id: 'terminal', name: 'Terminal URegional', icon: TerminalIcon, color: 'from-slate-900 to-[#002b50] text-emerald-400 border border-emerald-500/30', component: <Terminal fs={fileSystem} setTheme={setTheme} /> },
    { id: 'calc', name: 'Calculadora', icon: CalcIcon, color: 'from-rose-500 to-pink-600 text-white', component: <Calculator /> },
    { id: 'music', name: 'Radio / Lo-Fi', icon: Music, color: 'from-purple-600 to-pink-500 text-white', component: <MusicPlayer /> },
    { id: 'deploy', name: 'Publicar en Web', icon: UploadCloud, color: 'from-emerald-600 to-teal-500 text-white', component: <DeployGuideApp /> },
    { id: 'settings', name: 'Ajustes', icon: Settings, color: 'from-slate-700 to-slate-900 text-slate-200', component: <SettingsApp theme={theme} setTheme={setTheme} wallpaper={wallpaper} setWallpaper={setWallpaper} stats={systemStats} /> },
    { id: 'game', name: 'Snake Arcade', icon: Gamepad2, color: 'from-emerald-500 to-teal-700 text-white', component: <SnakeGame /> },
    { id: 'tictactoe', name: 'Tic-Tac-Toe IA', icon: Sparkles, color: 'from-indigo-600 to-[#FF5522] text-white', component: <TicTacToe /> }
  ];

  return (
    <div className={`h-screen w-screen overflow-hidden select-none flex flex-col font-sans ${theme === 'dark' ? 'dark text-slate-100' : 'text-slate-900'}`}>
      {/* Background Wallpaper */}
      {wallpaper === 'official_slc_bg' ? (
        <div className="absolute inset-0 bg-[#0b4d82] -z-10 flex flex-col items-center justify-center overflow-hidden transition-all duration-700">
          {/* Subtle textured grid / overlay inspired by the high-resolution photo */}
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] opacity-15" />
          <div className="absolute inset-0 bg-gradient-to-tr from-[#042847] via-[#0b4d82] to-[#0f609e] opacity-95" />
          
          {/* Giant Institutional Emblem Wallpaper Center Piece */}
          <div className="relative z-0 flex flex-col items-center justify-center p-8 text-center select-none transform hover:scale-[1.01] transition-transform duration-500">
            <div className="text-white font-light text-2xl sm:text-4xl tracking-[0.4em] uppercase mb-1 drop-shadow-lg">
              UNIVERSIDAD
            </div>
            <div className="flex items-center gap-3 font-black text-white text-5xl sm:text-7xl tracking-wider my-2 drop-shadow-2xl">
              <span>REGI</span>
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 border-white flex items-center justify-center relative bg-[#003866] shadow-2xl">
                <Globe className="w-10 h-10 sm:w-12 sm:h-12 text-white animate-spin-slow" />
              </div>
              <span>NAL</span>
            </div>
            <div className="text-white font-medium text-sm sm:text-xl tracking-[0.35em] uppercase border-t-2 border-b-2 border-white/60 w-full py-2 my-2 drop-shadow">
              DE GUATEMALA
            </div>
            <div className="mt-4 bg-[#FF5522] text-white text-lg sm:text-2xl font-black italic px-8 py-2.5 transform -skew-x-12 shadow-2xl uppercase tracking-widest border border-white/20">
              SANTA LUCÍA COTZUMALGUAPA
            </div>
            <div className="mt-6 text-xs sm:text-sm text-sky-200/80 font-mono tracking-widest bg-black/30 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10">
              Sede Oficial Región 2 • https://uregionalregion2.edu.gt/
            </div>
          </div>
        </div>
      ) : (
        <div 
          className="absolute inset-0 bg-cover bg-center transition-all duration-700 -z-10 scale-[1.01]"
          style={{ backgroundImage: `url(${wallpaper})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-[#0f3b60]/80 via-[#004a85]/50 to-slate-950/85 backdrop-blur-[0.5px]" />
        </div>
      )}

      {/* TOP BAR - UREGIONAL BLUE & ORANGE */}
      <header className="h-8 bg-[#003866]/90 backdrop-blur-md border-b border-[#FF5522]/30 flex items-center justify-between px-3 text-xs font-medium text-white shadow-md z-50">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsStartMenuOpen(!isStartMenuOpen)} 
            className="flex items-center gap-2 hover:opacity-90 transition-opacity"
          >
            <URegionalLogo compact={true} />
          </button>
          <span className="opacity-40">|</span>
          <a 
            href="https://uregionalregion2.edu.gt/" 
            target="_blank" 
            rel="noreferrer"
            className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#FF5522] hover:bg-[#e04416] text-white font-bold text-[10px] transition-colors shadow"
          >
            <span>https://uregionalregion2.edu.gt/</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={() => setShowNotifications(!showNotifications)} className="relative hover:opacity-80 p-1">
            <Bell className="w-3.5 h-3.5 text-white" />
            {notifications.length > 0 && <span className="absolute top-0 right-0 w-1.5 h-1.5 bg-[#FF5522] rounded-full" />}
          </button>
          <div className="flex items-center gap-2 opacity-80">
            <Wifi className="w-3.5 h-3.5 text-white" />
            <Volume2 className="w-3.5 h-3.5 text-white" />
            <Battery className="w-3.5 h-3.5 text-green-400" />
          </div>
          <button 
            onClick={() => setIsControlCenterOpen(!isControlCenterOpen)}
            className="hover:bg-white/10 px-2 py-0.5 rounded transition-colors text-white font-mono"
          >
            {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </button>
        </div>
      </header>

      {/* WORKSPACE & DESKTOP */}
      <main className="flex-1 relative overflow-hidden" onClick={() => { setIsStartMenuOpen(false); setIsControlCenterOpen(false); setShowNotifications(false); }}>
        {/* Main Desktop Branding Badge (Inspired by User Image) */}
        <div className="absolute top-6 left-6 pointer-events-auto flex items-center gap-4 bg-[#003866]/80 backdrop-blur-xl p-3 rounded-2xl border border-white/20 text-white shadow-2xl hover:border-[#FF5522] transition-colors">
          <URegionalLogo />
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-[11px] text-[#FF5522] font-bold">
              <MapPin className="w-3.5 h-3.5" /> Sede Santa Lucía Cotzumalguapa
            </div>
            <div className="text-[10px] text-slate-200">Sistema Operativo Institucional Región 2</div>
            <a 
              href="https://uregionalregion2.edu.gt/" 
              target="_blank" 
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-[10px] text-sky-300 hover:text-white underline"
            >
              uregionalregion2.edu.gt <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Desktop Clock Widget */}
        <div className="absolute top-6 right-6 pointer-events-none flex flex-col items-end text-white select-none drop-shadow-md">
          <div className="text-5xl font-extralight tracking-tight font-mono">{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
          <div className="text-xs font-medium uppercase tracking-widest mt-1 text-slate-200">{time.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}</div>
          <div className="flex items-center gap-2 mt-3 bg-[#003866]/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-xs">
            <CloudSun className="w-4 h-4 text-[#FF5522]" />
            <span>Santa Lucía Cotzumalguapa, Escuintla</span>
          </div>
        </div>

        {/* Desktop Shortcuts with High-End Glossy Icons */}
        <div className="pt-44 p-6 grid grid-cols-1 gap-4 w-36">
          {availableApps.slice(0, 6).map(app => {
            const Icon = app.icon;
            return (
              <button
                key={app.id}
                onDoubleClick={() => openApp(app.id, app.name, app.icon, app.component)}
                onClick={(e) => e.stopPropagation()}
                className="flex flex-col items-center justify-center p-3 rounded-2xl bg-[#002b50]/60 hover:bg-[#003866]/90 backdrop-blur-xl transition-all duration-300 group border border-white/15 hover:border-[#FF5522] shadow-xl hover:shadow-[#FF5522]/20 hover:-translate-y-1"
              >
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${app.color} p-2.5 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform relative overflow-hidden border border-white/30`}>
                  <div className="absolute top-0 left-0 w-full h-1/2 bg-white/20 rounded-t-xl" />
                  <Icon className="w-full h-full drop-shadow-md" />
                </div>
                <span className="text-[11px] text-white drop-shadow-md mt-2 text-center font-semibold leading-tight tracking-wide">{app.name}</span>
              </button>
            );
          })}
        </div>

        {/* Windows Rendering */}
        {windows.map(win => (
          <WindowContainer
            key={win.id}
            win={win}
            activeWindowId={activeWindowId}
            onFocus={() => focusWindow(win.id)}
            onClose={() => closeWindow(win.id)}
            onMinimize={() => toggleMinimize(win.id)}
            onMaximize={() => toggleMaximize(win.id)}
            setWindows={setWindows}
          />
        ))}

        {/* NOTIFICATIONS PANEL */}
        {showNotifications && (
          <div className="absolute top-2 right-20 w-80 bg-[#003866]/95 backdrop-blur-2xl border border-[#FF5522]/40 rounded-2xl p-3 shadow-2xl z-50 text-white">
            <div className="text-xs font-bold mb-2 pb-1 border-b border-white/10 flex justify-between">
              <span className="text-[#FF5522]">Universidad Regional SLC</span>
              <button onClick={() => setNotifications([])} className="text-[10px] text-slate-300 hover:text-white">Limpiar</button>
            </div>
            {notifications.map(n => (
              <div key={n.id} className="p-2.5 mb-1.5 bg-white/5 rounded-xl border border-white/5 text-xs">
                <div className="font-semibold text-[#FF5522]">{n.title}</div>
                <div className="text-slate-200 mt-0.5 leading-relaxed">{n.msg}</div>
              </div>
            ))}
          </div>
        )}

        {/* START MENU */}
        {isStartMenuOpen && (
          <div 
            onClick={(e) => e.stopPropagation()}
            className="absolute bottom-4 left-4 w-80 sm:w-96 bg-[#002b50]/95 backdrop-blur-2xl border border-[#FF5522]/40 rounded-2xl p-4 shadow-2xl z-50 animate-in fade-in slide-in-from-bottom-5 duration-200"
          >
            <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-[#004a85] to-[#FF5522]/20 rounded-xl mb-3 border border-white/10">
              <URegionalLogo compact={true} />
              <div>
                <div className="text-xs font-bold text-white">Universidad Regional de Guatemala</div>
                <div className="text-[10px] text-[#FF5522] font-semibold">Santa Lucía Cotzumalguapa - Región 2</div>
              </div>
            </div>

            <h3 className="text-xs font-semibold text-slate-300 mb-2 px-1">Aplicaciones del Sistema</h3>
            <div className="grid grid-cols-4 gap-3">
              {availableApps.map(app => {
                const Icon = app.icon;
                return (
                  <button
                    key={app.id}
                    onClick={() => openApp(app.id, app.name, app.icon, app.component)}
                    className="flex flex-col items-center p-2 rounded-xl hover:bg-white/10 transition-all text-slate-200 group"
                  >
                    <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${app.color} p-2 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform mb-1 border border-white/20`}>
                      <Icon className="w-full h-full" />
                    </div>
                    <span className="text-[11px] truncate w-full text-center">{app.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* CONTROL CENTER */}
        {isControlCenterOpen && (
          <div 
            onClick={(e) => e.stopPropagation()}
            className="absolute top-2 right-2 w-72 bg-[#002b50]/95 backdrop-blur-2xl border border-[#FF5522]/40 rounded-2xl p-4 shadow-2xl z-50 text-white"
          >
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/10">
              <span className="text-sm font-bold text-[#FF5522]">Centro de Control URegional</span>
              <span className="text-xs text-slate-300">{time.toLocaleDateString()}</span>
            </div>
            <div className="space-y-3 mb-4">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="flex items-center gap-1 text-slate-200"><Cpu className="w-3.5 h-3.5" /> Procesador</span>
                  <span className="font-mono text-[#FF5522]">{systemStats.cpu}%</span>
                </div>
                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-[#FF5522] transition-all duration-500" style={{ width: `${systemStats.cpu}%` }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="flex items-center gap-1 text-slate-200"><Monitor className="w-3.5 h-3.5" /> Memoria RAM</span>
                  <span className="font-mono text-amber-400">{systemStats.ram}%</span>
                </div>
                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 transition-all duration-500" style={{ width: `${systemStats.ram}%` }} />
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* DOCK */}
      <footer className="h-16 flex items-center justify-center pb-2 z-40">
        <div className="bg-[#002b50]/90 backdrop-blur-2xl border border-[#FF5522]/40 px-3 py-1.5 rounded-2xl flex items-center gap-2 shadow-2xl">
          <button
            onClick={() => setIsStartMenuOpen(!isStartMenuOpen)}
            className="p-1.5 hover:bg-white/10 rounded-xl transition-all hover:-translate-y-2 hover:scale-110"
            title="Inicio URegional Santa Lucía Cotzumalguapa"
          >
            <URegionalLogo compact={true} />
          </button>
          
          <div className="w-px h-6 bg-white/20 mx-1" />

          {availableApps.map(app => {
            const isOpen = windows.some(w => w.id === app.id);
            const isActive = activeWindowId === app.id;
            const Icon = app.icon;
            return (
              <button
                key={app.id}
                onClick={() => openApp(app.id, app.name, app.icon, app.component)}
                className={`relative p-1.5 rounded-xl transition-all hover:-translate-y-2 hover:scale-110 ${isActive ? 'bg-white/20 ring-1 ring-[#FF5522]' : 'hover:bg-white/10'}`}
                title={app.name}
              >
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${app.color} p-1.5 flex items-center justify-center shadow-md border border-white/20`}>
                  <Icon className="w-full h-full" />
                </div>
                {isOpen && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[#FF5522] rounded-full shadow" />
                )}
              </button>
            );
          })}
        </div>
      </footer>
    </div>
  );
}

// ==========================================
// WINDOW CONTAINER COMPONENT
// ==========================================
function WindowContainer({ win, activeWindowId, onFocus, onClose, onMinimize, onMaximize, setWindows }) {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({ w: 0, h: 0, x: 0, y: 0 });

  if (win.minimized) return null;

  const handleMouseDown = (e) => {
    onFocus();
    if (win.maximized) return;
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - win.x,
      y: e.clientY - win.y
    });
  };

  const handleResizeDown = (e) => {
    e.stopPropagation();
    onFocus();
    setIsResizing(true);
    setResizeStart({ w: win.w, h: win.h, x: e.clientX, y: e.clientY });
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDragging) {
        setWindows(prev => prev.map(w => w.id === win.id ? {
          ...w,
          x: Math.max(0, Math.min(window.innerWidth - 200, e.clientX - dragOffset.x)),
          y: Math.max(32, Math.min(window.innerHeight - 100, e.clientY - dragOffset.y))
        } : w));
      } else if (isResizing) {
        setWindows(prev => prev.map(w => w.id === win.id ? {
          ...w,
          w: Math.max(340, resizeStart.w + (e.clientX - resizeStart.x)),
          h: Math.max(240, resizeStart.h + (e.clientY - resizeStart.y))
        } : w));
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };

    if (isDragging || isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, dragOffset, resizeStart, win.id, setWindows]);

  const windowStyle = win.maximized ? {
    top: '32px',
    left: 0,
    width: '100vw',
    height: 'calc(100vh - 32px - 64px)',
    zIndex: win.zIndex
  } : {
    top: `${win.y}px`,
    left: `${win.x}px`,
    width: `${win.w}px`,
    height: `${win.h}px`,
    zIndex: win.zIndex
  };

  const isActive = activeWindowId === win.id;
  const IconComponent = win.icon;

  const renderIcon = () => {
    if (!IconComponent) return null;
    if (typeof IconComponent === 'function' || typeof IconComponent === 'object') {
      const Icon = IconComponent;
      return <Icon className="w-4 h-4 text-[#FF5522]" />;
    }
    return null;
  };

  return (
    <div
      onClick={onFocus}
      style={windowStyle}
      className={`absolute flex flex-col rounded-xl overflow-hidden shadow-2xl border transition-shadow duration-200 ${
        isActive 
          ? 'bg-[#002b50]/95 border-[#FF5522]/50 shadow-[#FF5522]/10' 
          : 'bg-[#002b50]/85 border-white/10 shadow-black/40'
      } backdrop-blur-xl`}
    >
      {/* WINDOW TITLE BAR */}
      <div 
        onMouseDown={handleMouseDown}
        className="h-9 bg-[#003866]/80 border-b border-white/10 flex items-center justify-between px-3 cursor-move select-none"
      >
        <div className="flex items-center gap-2">
          {renderIcon()}
          <span className="text-xs font-semibold text-slate-200">{win.title}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <button onClick={(e) => { e.stopPropagation(); onMinimize(); }} className="w-3 h-3 rounded-full bg-amber-500/80 hover:bg-amber-500 flex items-center justify-center text-slate-900 text-[8px] font-bold">
            <Minus className="w-2 h-2 opacity-0 hover:opacity-100" />
          </button>
          <button onClick={(e) => { e.stopPropagation(); onMaximize(); }} className="w-3 h-3 rounded-full bg-emerald-500/80 hover:bg-emerald-500 flex items-center justify-center text-slate-900 text-[8px] font-bold">
            <Square className="w-2 h-2 opacity-0 hover:opacity-100" />
          </button>
          <button onClick={(e) => { e.stopPropagation(); onClose(); }} className="w-3 h-3 rounded-full bg-rose-500/80 hover:bg-rose-500 flex items-center justify-center text-slate-900 text-[8px] font-bold">
            <X className="w-2 h-2 opacity-0 hover:opacity-100" />
          </button>
        </div>
      </div>

      {/* WINDOW CONTENT */}
      <div className="flex-1 overflow-auto text-white relative">
        {win.content}
      </div>

      {/* RESIZE HANDLE */}
      {!win.maximized && (
        <div 
          onMouseDown={handleResizeDown}
          className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize flex items-end justify-end p-0.5 opacity-50 hover:opacity-100"
        >
          <div className="w-2 h-2 border-r-2 border-b-2 border-[#FF5522]" />
        </div>
      )}
    </div>
  );
}

// ==========================================
// UREGIONAL SPECIFIC APPS (SANTA LUCÍA COTZUMALGUAPA)
// ==========================================

function DeployGuideApp() {
  return (
    <div className="p-5 bg-[#001d38] h-full text-xs text-white overflow-y-auto space-y-4">
      <div className="flex items-center justify-between bg-gradient-to-r from-emerald-600 to-[#FF5522]/30 p-4 rounded-2xl border border-white/20">
        <div>
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <UploadCloud className="w-5 h-5 text-emerald-400" /> Guía de Publicación en la Web
          </h2>
          <p className="text-[11px] text-emerald-300 mt-0.5">Cómo subir tu WebOS de URegional Cotzumalguapa gratis</p>
        </div>
        <div className="bg-[#FF5522] px-3 py-1 rounded-full text-[10px] font-bold">100% Gratis</div>
      </div>

      <div className="space-y-3">
        <div className="p-3 bg-white/5 border border-white/10 rounded-xl">
          <div className="flex items-center gap-2 text-[#FF5522] font-bold mb-1">
            <CheckCircle className="w-4 h-4" /> Opción 1: Vercel (Recomendada y más rápida)
          </div>
          <ol className="list-decimal list-inside space-y-1 text-slate-300 text-[11px] pl-1">
            <li>Crea una cuenta en <a href="https://vercel.com" target="_blank" rel="noreferrer" className="text-sky-400 underline">Vercel.com</a>.</li>
            <li>Sube este archivo React a tu repositorio de GitHub.</li>
            <li>Haz clic en <b>"New Project"</b> en Vercel e importa tu repositorio.</li>
            <li>Presiona <b>Deploy</b>. ¡Tendrás tu enlace en 30 segundos!</li>
          </ol>
        </div>

        <div className="p-3 bg-white/5 border border-white/10 rounded-xl">
          <div className="flex items-center gap-2 text-sky-400 font-bold mb-1">
            <CheckCircle className="w-4 h-4" /> Opción 2: Netlify Drop (Sin código ni consola)
          </div>
          <ol className="list-decimal list-inside space-y-1 text-slate-300 text-[11px] pl-1">
            <li>Genera la carpeta de compilación de tu proyecto (<code>npm run build</code>).</li>
            <li>Ingresa a <a href="https://app.netlify.com/drop" target="_blank" rel="noreferrer" className="text-sky-400 underline">app.netlify.com/drop</a>.</li>
            <li>Arrastra tu carpeta <code>dist</code> o <code>build</code> al cuadro indicado.</li>
            <li>¡Listo! Obtendrás una URL pública al instante.</li>
          </ol>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// UREGIONAL PORTAL COMPONENT
// ==========================================
function URegionalPortal() {
  return (
    <div className="p-5 bg-[#001d38] h-full text-xs text-white overflow-y-auto space-y-4">
      {/* Banner Principal */}
      <div className="bg-gradient-to-r from-[#004a85] to-[#FF5522]/40 p-4 rounded-2xl border border-white/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xl">
        <div>
          <div className="flex items-center gap-2 text-[#FF5522] font-black text-sm uppercase tracking-wider">
            <GraduationCap className="w-5 h-5" /> Portal Estudiantil Región 2
          </div>
          <h2 className="text-base font-extrabold text-white mt-1">Sede Santa Lucía Cotzumalguapa</h2>
          <p className="text-[11px] text-sky-200 mt-0.5">Acceso a servicios académicos y plataforma en línea</p>
        </div>
        <a 
          href="https://uregionalregion2.edu.gt/" 
          target="_blank" 
          rel="noreferrer"
          className="bg-[#FF5522] hover:bg-[#e04416] text-white px-4 py-2 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg transition-transform active:scale-95"
        >
          <span>Ir a uregionalregion2.edu.gt</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Tarjetas Informativas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3 bg-white/5 border border-white/10 rounded-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-amber-400 font-bold mb-1">
              <BookOpen className="w-4 h-4" /> Facultades
            </div>
            <p className="text-slate-300 text-[11px]">Derecho, Económicas, Ingeniería, Criminología y Humanidades.</p>
          </div>
          <span className="text-[10px] text-slate-400 mt-2 font-mono">5 Facultades Activas</span>
        </div>

        <div className="p-3 bg-white/5 border border-white/10 rounded-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 font-bold mb-1">
              <UserCheck className="w-4 h-4" /> Portal de Notas
            </div>
            <p className="text-slate-300 text-[11px]">Consulta de asignaciones, parciales y zonas del ciclo lectivo.</p>
          </div>
          <span className="text-[10px] text-emerald-400 mt-2 font-mono">● Sistema Activo</span>
        </div>

        <div className="p-3 bg-white/5 border border-white/10 rounded-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-sky-400 font-bold mb-1">
              <MapPin className="w-4 h-4" /> Ubicación
            </div>
            <p className="text-slate-300 text-[11px]">Santa Lucía Cotzumalguapa, Escuintla, Guatemala.</p>
          </div>
          <span className="text-[10px] text-sky-300 mt-2 font-mono">Región 2</span>
        </div>
      </div>

      {/* Avisos Académicos */}
      <div className="p-4 bg-[#00172e] border border-white/10 rounded-xl">
        <div className="font-bold text-[#FF5522] mb-2 flex items-center gap-2 text-xs">
          <Calendar className="w-4 h-4" /> Anuncios e Información Institucional
        </div>
        <ul className="space-y-2 text-slate-300 text-[11px] list-disc list-inside">
          <li>Asignación de cursos correspondiente al ciclo universitario 2026 habilitada en línea.</li>
          <li>Acceso directo al portal web oficial de la sede: <a href="https://uregionalregion2.edu.gt/" target="_blank" rel="noreferrer" className="text-sky-400 underline font-semibold">https://uregionalregion2.edu.gt/</a></li>
          <li>Laboratorios de Computación e Ingeniería en Sistemas equipados con WebOS Pro.</li>
        </ul>
      </div>
    </div>
  );
}

function Browser() {
  const [url, setUrl] = useState('https://uregionalregion2.edu.gt/');

  return (
    <div className="h-full flex flex-col bg-[#001d38]">
      <div className="flex items-center gap-2 p-2 bg-[#003866] border-b border-white/10">
        <Globe className="w-4 h-4 text-[#FF5522]" />
        <input 
          type="text" 
          value={url} 
          onChange={(e) => setUrl(e.target.value)}
          className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-1 text-xs text-white focus:outline-none focus:border-[#FF5522]" 
        />
        <a 
          href={url} 
          target="_blank" 
          rel="noreferrer"
          className="px-3 py-1 bg-[#FF5522] hover:bg-[#e04416] text-white font-bold rounded-lg text-xs flex items-center gap-1 shadow"
        >
          <span>Abrir</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
      <div className="flex-1 relative bg-white">
        <iframe 
          src={url} 
          title="Universidad Regional Región 2" 
          className="w-full h-full border-none"
          sandbox="allow-scripts allow-same-origin allow-forms"
        />
        <div className="absolute bottom-3 right-3 bg-[#003866] text-white text-[11px] p-3 rounded-xl border border-white/20 shadow-2xl max-w-xs">
          <div className="font-bold text-[#FF5522]">Sitio Institucional Integrado</div>
          <div className="text-[10px] text-slate-200 mt-0.5">https://uregionalregion2.edu.gt/ (Sede Santa Lucía Cotzumalguapa)</div>
        </div>
      </div>
    </div>
  );
}

function AICopilotURegional() {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: '¡Hola! Soy Copilot de la Universidad Regional de Guatemala - Sede Santa Lucía Cotzumalguapa. Puedes visitar nuestro sitio oficial en https://uregionalregion2.edu.gt/' }
  ]);
  const [input, setInput] = useState('');

  const sendMsg = () => {
    if (!input.trim()) return;
    const userMsg = input;
    setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setInput('');

    setTimeout(() => {
      let reply = 'Puedes obtener información oficial de las carreras y procesos de inscripción en el sitio web: https://uregionalregion2.edu.gt/';
      if (userMsg.toLowerCase().includes('santa lucia') || userMsg.toLowerCase().includes('cotzumalguapa')) {
        reply = 'La Sede de Santa Lucía Cotzumalguapa forma parte fundamental de la Región 2 de la Universidad Regional de Guatemala.';
      } else if (userMsg.toLowerCase().includes('carrera') || userMsg.toLowerCase().includes('facultad')) {
        reply = 'Ofrecemos carreras en Derecho, Ciencias Económicas, Ingeniería en Sistemas, Criminología y Humanidades.';
      }
      setMessages(prev => [...prev, { sender: 'bot', text: reply }]);
    }, 500);
  };

  return (
    <div className="h-full flex flex-col bg-[#001d38] p-3">
      <div className="flex items-center gap-2 pb-2 border-b border-white/10 font-bold text-[#FF5522] text-xs">
        <Bot className="w-4 h-4" /> Copilot IA URegional Cotzumalguapa
      </div>
      <div className="flex-1 overflow-y-auto my-2 space-y-2 pr-1 text-xs">
        {messages.map((m, i) => (
          <div key={i} className={`p-2.5 rounded-xl max-w-[85%] leading-relaxed ${m.sender === 'user' ? 'bg-[#FF5522] text-white ml-auto font-medium' : 'bg-white/10 text-slate-200 border border-white/5'}`}>
            {m.text}
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input 
          type="text" 
          value={input} 
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMsg()}
          placeholder="Pregunta a Copilot SLC..."
          className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#FF5522]"
        />
        <button onClick={sendMsg} className="p-2 bg-[#FF5522] hover:bg-[#e04416] text-white rounded-xl font-bold transition-colors">
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function Terminal({ fs, setTheme }) {
  const [logs, setLogs] = useState([
    'Universidad Regional de Guatemala - Sede Santa Lucía Cotzumalguapa',
    'Terminal WebOS v3.0 | https://uregionalregion2.edu.gt/'
  ]);
  const [input, setInput] = useState('');

  const handleCommand = (e) => {
    if (e.key === 'Enter') {
      const cmd = input.trim().toLowerCase();
      let res = '';
      if (cmd === 'help') {
        res = 'Comandos: uregional, site, ls, clear, date, status';
      } else if (cmd === 'uregional' || cmd === 'site') {
        res = 'Universidad Regional de Guatemala - Sede Santa Lucía Cotzumalguapa\nPortal Web: https://uregionalregion2.edu.gt/';
      } else if (cmd === 'ls') {
        res = fs.children.map(c => c.name).join('   ');
      } else if (cmd === 'clear') {
        setLogs([]);
        setInput('');
        return;
      } else if (cmd === 'date') {
        res = new Date().toLocaleString();
      } else if (cmd !== '') {
        res = `Comando no reconocido: "${cmd}". Escribe "help".`;
      }
      setLogs(prev => [...prev, `$ ${input}`, res].filter(Boolean));
      setInput('');
    }
  };

  return (
    <div className="h-full bg-[#00172e] p-3 font-mono text-xs text-emerald-400 flex flex-col">
      <div className="flex-1 overflow-y-auto space-y-1">
        {logs.map((l, i) => (
          <div key={i} className="whitespace-pre-wrap">{l}</div>
        ))}
      </div>
      <div className="flex items-center gap-2 pt-2 border-t border-white/10">
        <span className="text-[#FF5522] font-bold">uregional-slc@webos:~$</span>
        <input 
          type="text" 
          value={input} 
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleCommand}
          className="flex-1 bg-transparent text-emerald-400 outline-none"
          autoFocus
        />
      </div>
    </div>
  );
}

// ==========================================
// ADDITIONAL APP DEFINITIONS
// ==========================================
function FileManager({ fs }) {
  const [currentFolder, setCurrentFolder] = useState(fs);
  return (
    <div className="p-4 bg-[#001d38] h-full text-xs text-slate-200">
      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-white/10 font-bold text-[#FF5522]">
        <Folder className="w-4 h-4" />
        <span>Directorio: /{currentFolder.name}</span>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {currentFolder.children && currentFolder.children.map(item => (
          <div key={item.id} className="p-3 bg-white/5 border border-white/10 rounded-xl flex flex-col items-center gap-1 hover:bg-white/10 transition-colors cursor-pointer">
            {item.type === 'folder' ? <Folder className="w-8 h-8 text-amber-400" /> : <FileText className="w-8 h-8 text-sky-400" />}
            <span className="truncate w-full text-center text-[11px] font-medium mt-1">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function TextEditor() {
  const [text, setText] = useState('Universidad Regional de Guatemala\nSede Santa Lucía Cotzumalguapa\nhttps://uregionalregion2.edu.gt/\n\nAnotaciones de Clases 2026...');
  return (
    <div className="h-full flex flex-col bg-[#001d38] p-2">
      <textarea 
        value={text} 
        onChange={(e) => setText(e.target.value)} 
        className="w-full h-full bg-[#00172e] border border-white/10 rounded-xl p-3 text-xs text-white font-mono focus:outline-none focus:border-[#FF5522] resize-none"
      />
    </div>
  );
}

function Calculator() {
  const [display, setDisplay] = useState('0');
  const safeEval = (expr) => {
    try {
      const sanitized = expr.replace(/[^0-9+\-*/().]/g, '');
      return Function(`"use strict"; return (${sanitized})`)();
    } catch {
      return 'Error';
    }
  };

  const handleBtn = (val) => {
    if (val === 'C') setDisplay('0');
    else if (val === '=') setDisplay(String(safeEval(display)));
    else setDisplay(prev => prev === '0' ? val : prev + val);
  };

  return (
    <div className="p-4 bg-[#001d38] h-full flex flex-col justify-between">
      <div className="bg-[#00172e] border border-white/10 p-3 rounded-xl text-right font-mono text-xl text-[#FF5522] mb-3 overflow-hidden">
        {display}
      </div>
      <div className="grid grid-cols-4 gap-2 flex-1">
        {['7','8','9','/','4','5','6','*','1','2','3','-','C','0','=','+'].map(btn => (
          <button 
            key={btn} 
            onClick={() => handleBtn(btn)}
            className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-bold text-sm text-white flex items-center justify-center transition-colors"
          >
            {btn}
          </button>
        ))}
      </div>
    </div>
  );
}

function MusicPlayer() {
  const [playing, setPlaying] = useState(false);
  return (
    <div className="h-full flex flex-col items-center justify-center bg-[#001d38] p-6 text-center">
      <div className="w-24 h-24 bg-gradient-to-tr from-[#004a85] to-[#FF5522] rounded-2xl flex items-center justify-center shadow-xl mb-4">
        <Music className="w-12 h-12 text-white animate-pulse" />
      </div>
      <div className="text-sm font-bold text-white">Lo-Fi Academic URegional</div>
      <div className="text-xs text-slate-300 mt-1">Sede Santa Lucía Cotzumalguapa</div>
      <button 
        onClick={() => setPlaying(!playing)}
        className="mt-6 p-3 bg-[#FF5522] hover:bg-[#e04416] text-white font-bold rounded-full transition-transform transform active:scale-95 shadow-lg"
      >
        {playing ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
      </button>
    </div>
  );
}

function SettingsApp({ wallpaper, setWallpaper }) {
  return (
    <div className="p-4 bg-[#001d38] h-full text-xs text-white space-y-4">
      <div>
        <h3 className="font-bold text-[#FF5522] mb-2">Fondo de Pantalla Institucional</h3>
        <div className="grid grid-cols-2 gap-2">
          {WALLPAPERS.map(w => (
            <button 
              key={w.id} 
              onClick={() => setWallpaper(w.url)}
              className={`p-2 bg-[#00172e] border rounded-xl text-left truncate ${wallpaper === w.url ? 'border-[#FF5522] text-[#FF5522]' : 'border-white/10 text-slate-300'}`}
            >
              {w.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function SnakeGame() {
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [dir, setDir] = useState({ x: 1, y: 0 });
  const [isRunning, setIsRunning] = useState(false);

  const startGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setFood({ x: Math.floor(Math.random() * 18), y: Math.floor(Math.random() * 14) });
    setDir({ x: 1, y: 0 });
    setScore(0);
    setGameOver(false);
    setIsRunning(true);
  };

  useEffect(() => {
    if (!isRunning || gameOver) return;
    const timer = setInterval(() => {
      setSnake(prev => {
        const head = { x: prev[0].x + dir.x, y: prev[0].y + dir.y };

        if (head.x < 0 || head.x >= 20 || head.y < 0 || head.y >= 15 || prev.some(s => s.x === head.x && s.y === head.y)) {
          setGameOver(true);
          setIsRunning(false);
          return prev;
        }

        const newSnake = [head, ...prev];
        if (head.x === food.x && head.y === food.y) {
          setScore(s => s + 10);
          setFood({ x: Math.floor(Math.random() * 18), y: Math.floor(Math.random() * 14) });
        } else {
          newSnake.pop();
        }
        return newSnake;
      });
    }, 150);

    return () => clearInterval(timer);
  }, [isRunning, dir, food, gameOver]);

  return (
    <div className="h-full flex flex-col items-center justify-center bg-[#001d38] p-4 text-xs font-mono">
      <div className="flex justify-between w-full max-w-xs mb-2 text-[#FF5522] font-bold">
        <span>Snake URegional SLC</span>
        <span>Puntos: {score}</span>
      </div>
      <div className="relative w-[280px] h-[210px] bg-[#00172e] border border-white/10 rounded-xl overflow-hidden grid grid-cols-20 grid-rows-15">
        {snake.map((s, i) => (
          <div key={i} style={{ gridColumnStart: s.x + 1, gridRowStart: s.y + 1 }} className={`${i === 0 ? 'bg-[#FF5522]' : 'bg-sky-400'} rounded-sm`} />
        ))}
        <div style={{ gridColumnStart: food.x + 1, gridRowStart: food.y + 1 }} className="bg-emerald-400 rounded-full animate-ping" />
      </div>

      {gameOver && <div className="text-rose-400 font-bold mt-2">¡Game Over! Puntuación: {score}</div>}

      <div className="flex gap-2 mt-3">
        <button onClick={startGame} className="px-3 py-1 bg-[#FF5522] text-white font-bold rounded-lg hover:bg-[#e04416]">
          {isRunning ? 'Reiniciar' : 'Jugar'}
        </button>
      </div>
    </div>
  );
}

function TicTacToe() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);

  const calculateWinner = (squares) => {
    const lines = [
      [0,1,2],[3,4,5],[6,7,8],
      [0,3,6],[1,4,7],[2,5,8],
      [0,4,8],[2,4,6]
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  };

  const winner = calculateWinner(board);

  const handleClick = (i) => {
    if (board[i] || winner) return;
    const nextBoard = [...board];
    nextBoard[i] = 'X';
    setBoard(nextBoard);
    setIsXNext(false);

    setTimeout(() => {
      if (calculateWinner(nextBoard) || nextBoard.every(Boolean)) return;
      const emptyIndexes = nextBoard.map((val, idx) => val === null ? idx : null).filter(val => val !== null);
      if (emptyIndexes.length > 0) {
        const randomChoice = emptyIndexes[Math.floor(Math.random() * emptyIndexes.length)];
        nextBoard[randomChoice] = 'O';
        setBoard([...nextBoard]);
        setIsXNext(true);
      }
    }, 300);
  };

  const reset = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
  };

  return (
    <div className="h-full flex flex-col items-center justify-center bg-[#001d38] p-4 text-xs font-mono">
      <div className="text-[#FF5522] font-bold mb-3">
        {winner ? `Ganador: ${winner}` : board.every(Boolean) ? '¡Empate!' : `Turno: ${isXNext ? 'Tú (X)' : 'IA Cotzumalguapa (O)'}`}
      </div>
      <div className="grid grid-cols-3 gap-2 w-48 h-48 bg-[#00172e] p-2 rounded-xl border border-white/10">
        {board.map((cell, idx) => (
          <button 
            key={idx}
            onClick={() => handleClick(idx)}
            className="bg-white/5 border border-white/10 rounded-lg text-lg font-black flex items-center justify-center text-[#FF5522] hover:bg-white/10 transition-colors"
          >
            {cell}
          </button>
        ))}
      </div>
      <button onClick={reset} className="mt-4 px-3 py-1 bg-[#FF5522] text-white font-bold rounded-lg hover:bg-[#e04416]">
        Reiniciar Juego
      </button>
    </div>
  );
}