const fs = require('fs');
let code = fs.readFileSync('src/app/page.tsx', 'utf8');

// Replace phase header
code = code.replace(
  /<div className="px-2\.5 py-1 text-base font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-1\.5">([\s\S]*?)<\/div>/g,
  `<div className="px-3 py-1.5 mb-1 mt-3">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  <span className="text-emerald-500/70">{phase.id === 1 ? '01' : phase.id === 2 ? '02' : phase.id === 3 ? '03' : phase.id === 4 ? '04' : '05'}</span>
                  <span>{phase.title}</span>
                </div>
                <div className="text-[10px] text-slate-400/80 dark:text-slate-500 font-medium uppercase tracking-wider pl-5 mt-0.5">
                  {phase.subtitle}
                </div>
              </div>`
);

// Replace chapter button
code = code.replace(
  /<button\s+key=\{ch\.id\}\s+onClick=\{[^}]+\}\s+className=\{`w-full text-left px-2\.5 py-1 text-base rounded-md flex items-center gap-2 transition-colors\s+\$\{activeChapter === ch\.id\s+\?\s+'bg-emerald-50 dark:bg-emerald-950\/60 text-emerald-700 dark:text-emerald-405 font-semibold'\s+:\s+'hover:bg-slate-100\/60 dark:hover:bg-slate-900\/60 text-slate-500 dark:text-slate-400'\s+\}`\}\s+>\s+<span className="text-base shrink-0">\{ch\.icon\}<\/span>\s+<span className="truncate">Ch\.\{ch\.id\} \{ch\.title\}<\/span>\s+<\/button>/g,
  `<button
                  key={ch.id}
                  onClick={() => handleChapterClick(ch.id)}
                  className={\`w-full text-left px-3 py-1.5 text-sm rounded-md flex items-center gap-2.5 transition-colors mb-0.5
                    \${activeChapter === ch.id
                      ? 'bg-emerald-50 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 font-medium'
                      : 'hover:bg-slate-100/60 dark:hover:bg-slate-800/50 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                    }\`}
                >
                  <span className="text-sm shrink-0 opacity-80">{ch.icon}</span>
                  <span className="truncate">Ch.{ch.id} {ch.title}</span>
                </button>`
);

// Update Dashboard button
code = code.replace(
  /className=\{`w-full text-left px-2\.5 py-1\.5 text-base rounded-md flex items-center gap-2 transition-colors mb-1 \$\{[\s\S]*?\}`\}/g,
  `className={\`w-full text-left px-3 py-2 text-sm rounded-md flex items-center gap-2.5 transition-colors mb-2 \${
              showDashboard
                ? 'bg-emerald-50 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 font-medium'
                : 'hover:bg-slate-100/60 dark:hover:bg-slate-800/50 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }\`}`
);
code = code.replace(
  /<span className="text-base shrink-0">📋<\/span>\s*<span className="font-semibold">Dashboard<\/span>/g,
  `<span className="text-sm shrink-0 opacity-80">📋</span>\n            <span className="font-medium">Dashboard</span>`
);

// Replace "The Visual MBA" and "Executive Toolkit" headers
code = code.replace(
  /<h1 className="text-base font-bold text-emerald-600 dark:text-emerald-500 tracking-tight">The Visual MBA<\/h1>\s*<p className="text-base text-slate-400 dark:text-slate-500 font-medium uppercase tracking-wider">Executive Toolkit<\/p>/g,
  `<h1 className="text-lg font-bold text-emerald-600 dark:text-emerald-500 tracking-tight">The Visual MBA</h1>
            <p className="text-xs text-slate-400 dark:text-slate-500 font-medium uppercase tracking-widest mt-0.5">Executive Toolkit</p>`
);

fs.writeFileSync('src/app/page.tsx', code);
