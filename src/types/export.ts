export type ExportFormat = 'xlsx';
export type ExportScope = 'all' | 'chapter' | 'phase' | 'dashboard';
export type PhaseNumber = 1 | 2 | 3 | 4 | 5;

export interface ExportOptions {
  format: ExportFormat;
  scope: ExportScope;
  chapterId?: number;
  phaseId?: PhaseNumber;
}
