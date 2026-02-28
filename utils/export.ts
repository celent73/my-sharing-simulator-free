import { LevelData, CompensationPlanResult } from '../types';

export function exportToCsv(filename: string, data: LevelData[], totals: CompensationPlanResult) {
  const headers = [
    'Livello',
    'Utenti',
    'Gettone Una Tantum (EUR)',
    'Ricorrenza Mensile 1 Anno (EUR)',
    'Ricorrenza Mensile 2 Anno (EUR)',
    'Ricorrenza Mensile 3 Anno (EUR)',
  ];
  
  const getLevelLabel = (level: number) => {
      if (level === 0) return "0 (Tu)";
      if (level === 1) return "1 (diretto)";
      return level.toString();
  }

  const rows = data.map(d => 
    [
      getLevelLabel(d.level),
      d.users,
      d.oneTimeBonus.toFixed(2),
      d.recurringYear1.toFixed(2),
      d.recurringYear2.toFixed(2),
      d.recurringYear3.toFixed(2),
    ].join(',')
  );

  const totalsRow = [
      'TOTALI',
      totals.totalUsers,
      totals.totalOneTimeBonus.toFixed(2),
      totals.totalRecurringYear1.toFixed(2),
      totals.totalRecurringYear2.toFixed(2),
      totals.totalRecurringYear3.toFixed(2),
  ].join(',');

  const csvContent = [headers.join(','), ...rows, '', totalsRow].join('\n');
  
  const blob = new Blob([`\uFEFF${csvContent}`], { type: 'text/csv;charset=utf-8;' }); // Add BOM for Excel compatibility
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
