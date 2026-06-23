'use client';
import React, { useState, useEffect } from 'react';
import { MBAProvider, useMBA } from '@/context/MBAContext';
import ChapterView from '@/components/chapters/ChapterView';
import Ch20Dashboard from '@/components/chapters/Ch20Dashboard';
import { HELP_CONTENT } from '@/lib/help-content';

const PHASES = [
  {
    id: 1,
    title: 'Fundação',
    subtitle: 'Estratégia & Liderança',
    chapters: [
      { id: 1, title: 'Leadership', icon: '👤' },
      { id: 2, title: '3M Framework', icon: '🔍' },
      { id: 3, title: 'Strategy', icon: '♟️' },
      { id: 4, title: "Manager's 7S", icon: '🏛️' },
      { id: 5, title: 'Decision Making', icon: '🧠' },
    ],
  },
  {
    id: 2,
    title: 'Finanças',
    subtitle: 'Planeamento & Viabilidade',
    chapters: [
      { id: 6, title: 'Financial Reporting', icon: '📊' },
      { id: 7, title: 'Managerial Accounting', icon: '🧮' },
      { id: 8, title: 'Business Finance', icon: '💰' },
      { id: 9, title: 'Entrepreneurial Finance', icon: '🚀' },
    ],
  },
  {
    id: 3,
    title: 'Produto & Operações',
    subtitle: 'Construir & Executar',
    chapters: [
      { id: 10, title: 'Operations', icon: '⚙️' },
      { id: 11, title: 'RevOps Launch Readiness', icon: '🚀' },
      { id: 12, title: 'Operating Cadences', icon: '📅' },
      { id: 13, title: 'Activity-Based Costing', icon: '🔬' },
      { id: 14, title: 'Variance Analysis', icon: '📉' },
    ],
  },
  {
    id: 4,
    title: 'Go-To-Market',
    subtitle: 'Vender & Escalar',
    chapters: [
      { id: 15, title: 'Marketing & Brand', icon: '📢' },
      { id: 16, title: 'Negotiations', icon: '🤝' },
      { id: 17, title: 'Startup Marketing', icon: '📈' },
      { id: 18, title: 'Pipeline & Forecast', icon: '📊' },
      { id: 19, title: 'Customer Journey Map', icon: '🗺️' },
      { id: 20, title: 'GTM Launch Plan', icon: '🎯' },
      { id: 21, title: 'Revenue Dashboard', icon: '📈' },
      { id: 22, title: 'Pricing & Decisions', icon: '💲' },
      { id: 23, title: 'Marketing Audit', icon: '🎯' },
    ],
  },
  {
    id: 5,
    title: 'Pessoas & Cultura',
    subtitle: 'Equipa & Crescimento',
    chapters: [
      { id: 24, title: 'HR 9-Box Matrix', icon: '👥' },
      { id: 25, title: 'Business Ethics', icon: '⚖️' },
      { id: 26, title: 'Blue Ocean (ERRC)', icon: '🌊' },
      { id: 27, title: 'Creativity (SCAMPER)', icon: '💡' },
      { id: 28, title: 'Balanced Scorecard', icon: '🎯' },
      { id: 29, title: 'CAGE Distance', icon: '🌍' },
    ],
  },
];

// Flat list for faster lookups
const ALL_CHAPTERS = PHASES.flatMap(p => p.chapters);

// Map new chapter IDs to old help content keys
const HELP_MAP: Record<number, string> = {
  1: "1", 2: "3", 3: "10", 4: "14", 5: "13",
  6: "2", 7: "4", 8: "5", 9: "12",
  10: "7", 14: "28",
  15: "6", 16: "9", 17: "17",
  22: "29", 23: "30",
  24: "8", 25: "11", 26: "15", 27: "16", 28: "18", 29: "19",
};

function HelpPanel({ chapterId, onClose }: { chapterId: number; onClose: () => void }) {
  const help = HELP_CONTENT[HELP_MAP[chapterId] || String(chapterId)];
  if (!help) return null;

  return (
    <>
      {/* Mobile overlay backdrop */}
      <div className="fixed inset-0 bg-black/40 z-40 md:hidden" onClick={onClose} />
      {/* Panel: desktop right side, mobile bottom sheet */}
      <aside className="
        fixed bottom-0 left-0 right-0 z-50 max-h-[70vh] rounded-t-2xl
        md:static md:z-auto md:max-h-none md:rounded-none
        border-t md:border-t-0 md:border-l border-slate-200 dark:border-slate-800 
        bg-white dark:bg-slate-900 
        overflow-y-auto p-5 md:p-5 shrink-0 md:w-80
        shadow-2xl md:shadow-none
        transition-all duration-300
      ">
        <div className="flex items-center justify-between mb-3 md:hidden">
          <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">📖 {help.title}</p>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 text-lg">✕</button>
        </div>
        <div className="space-y-4 text-sm text-slate-600 dark:text-slate-400">
          <div className="hidden md:block pb-3 border-b border-slate-100 dark:border-slate-800">
            <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1">📖 {help.title}</p>
          </div>
          <div>
            <p className="font-semibold text-emerald-600 dark:text-emerald-400 text-xs uppercase tracking-wider mb-1.5">🎯 Purpose</p>
            <p className="leading-relaxed">{help.purpose}</p>
          </div>
          <div>
            <p className="font-semibold text-emerald-600 dark:text-emerald-400 text-xs uppercase tracking-wider mb-1.5">📋 What You Need</p>
            <p className="leading-relaxed">{help.data}</p>
          </div>
          <div>
            <p className="font-semibold text-emerald-600 dark:text-emerald-400 text-xs uppercase tracking-wider mb-1.5">💡 How to Fill</p>
            <p className="leading-relaxed">{help.fill}</p>
          </div>
          <div>
            <p className="font-semibold text-emerald-600 dark:text-emerald-400 text-xs uppercase tracking-wider mb-1.5">📊 How to Interpret</p>
            <p className="leading-relaxed">{help.interpret}</p>
          </div>
        </div>
      </aside>
    </>
  );
}

function MBAApp() {
  const [activeChapter, setActiveChapter] = useState(20);
  const [showDashboard, setShowDashboard] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showHelp, setShowHelp] = useState(false);
  const { resetToExample, resetToBlank, isBlank } = useMBA();

  // Close sidebar on chapter change (mobile only)
  const handleChapterClick = (id: number) => {
    setActiveChapter(id);
    setShowDashboard(false);
    if (window.innerWidth < 768) setSidebarOpen(false);
  };

  const goToDashboard = () => {
    setShowDashboard(true);
    setShowHelp(false);
  };

  const chapter = !showDashboard ? ALL_CHAPTERS.find(c => c.id === activeChapter) : null;

  // Sidebar mobile drawer
  const Sidebar = () => (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/40 z-30 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-40
        flex flex-col h-full
        transition-all duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        ${sidebarOpen ? 'w-64 md:w-56' : 'w-0'}
        overflow-hidden
        border-r border-slate-200 dark:border-slate-850 
        bg-white dark:bg-slate-950
        shadow-2xl md:shadow-none
      `}>
        <div className="px-4 py-3 border-b border-slate-150 dark:border-slate-850/80 shrink-0 flex items-center justify-between">
          <div>
            <h1 className="text-sm font-bold text-emerald-600 dark:text-emerald-500 tracking-tight">The Visual MBA</h1>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium uppercase tracking-wider">Executive Toolkit</p>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 text-lg">✕</button>
        </div>
        <nav className="flex-1 overflow-y-auto overflow-x-hidden py-1.5 px-1.5 space-y-0 min-h-0">
          {/* Dashboard home button */}
          <button
            onClick={() => { goToDashboard(); if (window.innerWidth < 768) setSidebarOpen(false); }}
            className={`w-full text-left px-2.5 py-1.5 text-xs rounded-md flex items-center gap-2 transition-colors mb-1 ${
              showDashboard
                ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-405 font-semibold'
                : 'hover:bg-slate-100/60 dark:hover:bg-slate-900/60 text-slate-500 dark:text-slate-400'
            }`}
          >
            <span className="text-xs shrink-0">📋</span>
            <span className="font-semibold">Dashboard</span>
          </button>
          <div className="border-t border-slate-100 dark:border-slate-800/50 mb-1" />
          {PHASES.map(phase => (
            <div key={phase.id} className="mb-1.5">
              <div className="px-2.5 py-1 text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                <span>{phase.id === 1 ? '01' : phase.id === 2 ? '02' : phase.id === 3 ? '03' : phase.id === 4 ? '04' : '05'}</span>
                <span>{phase.title}</span>
                <span className="text-[8px] text-slate-500/60 font-normal lowercase">— {phase.subtitle}</span>
              </div>
              {phase.chapters.map(ch => (
                <button
                  key={ch.id}
                  onClick={() => handleChapterClick(ch.id)}
                  className={`w-full text-left px-2.5 py-1 text-xs rounded-md flex items-center gap-2 transition-colors
                    ${activeChapter === ch.id
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-405 font-semibold'
                      : 'hover:bg-slate-100/60 dark:hover:bg-slate-900/60 text-slate-500 dark:text-slate-400'
                    }`}
                >
                  <span className="text-xs shrink-0">{ch.icon}</span>
                  <span className="truncate">Ch.{ch.id} {ch.title}</span>
                </button>
              ))}
            </div>
          ))}
        </nav>
        <div className="p-2.5 border-t border-slate-150 dark:border-slate-850/80 bg-slate-50/40 dark:bg-slate-950/40 space-y-0.5 shrink-0">
          <button onClick={resetToBlank} className="w-full text-left px-2 py-1 text-[11px] rounded-md hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-450 transition-colors flex items-center gap-2 font-medium">
            <span>✨</span> New Canvas
          </button>
          {isBlank && (
            <button onClick={resetToExample} className="w-full text-left px-2 py-1 text-[11px] rounded-md hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-500 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-450 transition-colors flex items-center gap-2 font-medium">
              <span>📋</span> Load Example
            </button>
          )}
        </div>
      </aside>
    </>
  );

  return (
    <div className={`${darkMode ? 'dark' : ''}`}>
      <div className="flex h-screen bg-slate-50 dark:bg-[#0b0f19] text-slate-900 dark:text-slate-100">
        <Sidebar />

        {/* Main */}
        <main className="flex-1 flex flex-col overflow-hidden min-w-0">
          {/* Top bar */}
          <header className="h-12 md:h-12 border-b border-slate-200 dark:border-slate-850 flex items-center justify-between px-3 md:px-4 bg-white dark:bg-slate-900/50 backdrop-blur-sm shrink-0">
            <div className="flex items-center gap-2 md:gap-3 min-w-0">
              <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-350 text-lg transition-colors focus:outline-none cursor-pointer shrink-0">
                ☰
              </button>
              <h2 className="font-semibold text-xs md:text-sm truncate">
                {showDashboard ? (
                  <><span className="text-emerald-500">📋</span> Dashboard</>
                ) : (
                  <><span className="text-emerald-500">Ch.{chapter!.id}</span> {chapter!.title}</>
                )}
              </h2>
            </div>
            <div className="flex items-center gap-1.5 md:gap-2 shrink-0">
              {!showDashboard && chapter && HELP_MAP[chapter.id] && (
                <button
                  onClick={() => setShowHelp(!showHelp)}
                  className={`p-1.5 text-xs rounded-md border transition-colors cursor-pointer ${
                    showHelp
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-700 text-emerald-600 dark:text-emerald-400'
                      : 'border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400'
                  }`}
                  aria-label="Toggle Help"
                >
                  ?
                </button>
              )}
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-1.5 text-xs rounded-md border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                aria-label="Toggle Dark Mode"
              >
                {darkMode ? '☀️' : '🌙'}
              </button>
            </div>
          </header>

          {/* Chapter content + Help panel */}
          <div className="flex-1 flex overflow-hidden relative">
            <div className="flex-1 overflow-y-auto bg-slate-50/50 dark:bg-[#070b13] p-4 md:p-6 lg:p-8">
              {showDashboard ? <Ch20Dashboard /> : <ChapterView chapterId={activeChapter} />}
            </div>
            {showHelp && chapter && <HelpPanel chapterId={activeChapter} onClose={() => setShowHelp(false)} />}
          </div>
        </main>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <MBAProvider>
      <MBAApp />
    </MBAProvider>
  );
}
