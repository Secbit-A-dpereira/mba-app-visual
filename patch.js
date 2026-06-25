const fs = require('fs');
const path = 'src/components/chapters/Ch8NineBox.tsx';
let content = fs.readFileSync(path, 'utf8');

// Update description
content = content.replace(
  'Click a member card to cycle their position.',
  'Hover a member card to use arrows to cycle their position.'
);

// Replace the div
const searchStr = `                    {members.map((member) => (
                      <div
                        key={member.id}
                        onClick={() => {
                          const nextPerf = nextPosition(perf);
                          moveMember(member.id, nextPerf as 1|2|3, pot);
                        }}
                        title="Click to cycle performance level"
                        className={\`
                          group relative px-2.5 py-1.5 rounded-lg text-xs cursor-pointer transition-all
                          \${isHovered
                            ? 'bg-white/20 text-white hover:bg-white/30'
                            : 'bg-slate-50 dark:bg-slate-950/60 border border-slate-150 dark:border-slate-850 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900/80 shadow-sm'
                          }
                        \`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold truncate">{member.name}</span>
                          <button
                            onClick={(e) => { e.stopPropagation(); removeMember(member.id); }}
                            className={\`opacity-0 group-hover:opacity-100 transition-opacity ml-1 \${
                              isHovered ? 'text-white/70 hover:text-white' : 'text-slate-400 hover:text-red-500'
                            }\`}
                            title="Remove member"
                          >
                            ✕
                          </button>
                        </div>
                        <span className={\`block truncate mt-0.5 \${
                          isHovered ? 'text-white/70 text-[10px]' : 'text-slate-500 dark:text-slate-500 text-[10px]'
                        }\`}>
                          {member.role}
                        </span>
                        {/* Cycle indicator */}
                        {!isHovered && (
                          <span className="absolute right-1 bottom-1 text-[9px] text-slate-300 dark:text-slate-600 opacity-0 group-hover:opacity-100">
                            ⇄
                          </span>
                        )}
                      </div>`;

const replaceStr = `                    {members.map((member) => (
                      <div
                        key={member.id}
                        className={\`
                          group relative px-2.5 py-1.5 rounded-lg text-xs transition-all
                          \${isHovered
                            ? 'bg-white/20 text-white hover:bg-white/30'
                            : 'bg-slate-50 dark:bg-slate-950/60 border border-slate-150 dark:border-slate-850 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900/80 shadow-sm'
                          }
                        \`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold truncate">{member.name}</span>
                          <button
                            onClick={(e) => { e.stopPropagation(); removeMember(member.id); }}
                            className={\`opacity-0 group-hover:opacity-100 transition-opacity ml-1 \${
                              isHovered ? 'text-white/70 hover:text-white' : 'text-slate-400 hover:text-red-500'
                            }\`}
                            title="Remove member"
                          >
                            ✕
                          </button>
                        </div>
                        <span className={\`block truncate mt-0.5 \${
                          isHovered ? 'text-white/70 text-[10px]' : 'text-slate-500 dark:text-slate-500 text-[10px]'
                        }\`}>
                          {member.role}
                        </span>
                        {/* Action buttons */}
                        <div className="absolute right-1 bottom-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={(e) => { e.stopPropagation(); moveMember(member.id, perf, nextPosition(pot) as 1|2|3); }}
                            className="bg-slate-200/50 hover:bg-slate-300/80 dark:bg-slate-800/50 dark:hover:bg-slate-700/80 rounded px-1 text-[10px] cursor-pointer"
                            aria-label="Cycle Potential"
                            title="Cycle Potential"
                          >
                            ↔
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); moveMember(member.id, nextPosition(perf) as 1|2|3, pot); }}
                            className="bg-slate-200/50 hover:bg-slate-300/80 dark:bg-slate-800/50 dark:hover:bg-slate-700/80 rounded px-1 text-[10px] cursor-pointer"
                            aria-label="Cycle Performance"
                            title="Cycle Performance"
                          >
                            ↕
                          </button>
                        </div>
                      </div>`;

if (!content.includes(searchStr)) {
  console.log("Could not find exact block to replace");
} else {
  content = content.replace(searchStr, replaceStr);
  fs.writeFileSync(path, content, 'utf8');
  console.log("Patched successfully");
}
