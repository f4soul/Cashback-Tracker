import React from 'react';
import { CashbackEntry, Bank, LogoShape } from '../types';
import { getBankDetails } from '../constants';
import { capitalize, formatMonthId } from '../utils/date';
import { BankLogo } from './BankLogo';
import { FileText, FileSpreadsheet, BookImage } from 'lucide-react';
import { clsx } from 'clsx';

interface CashbackTableProps {
  monthId: string;
  entries: CashbackEntry[];
  id?: string;
  customBanks?: Bank[];
  globalLogoShape: LogoShape;
  onExportPDF?: () => void;
  onExportExcel?: () => void;
  onExportImage?: () => void;
}

export const CashbackTable: React.FC<CashbackTableProps> = ({ 
  monthId, 
  entries, 
  id = 'cashback-table', 
  customBanks = [], 
  globalLogoShape,
  onExportPDF,
  onExportExcel,
  onExportImage
}) => {
  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center bg-gray-50 dark:bg-gray-800/50 rounded-3xl border border-dashed border-gray-200 dark:border-gray-700">
        <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-3">
          <span className="text-xl">🏦</span>
        </div>
        <h3 className="text-base font-medium text-gray-900 dark:text-white mb-1">Нет данных</h3>
        <p className="text-xs text-gray-500 dark:text-gray-400">Добавьте банки, чтобы увидеть таблицу кэшбека</p>
      </div>
    );
  }

  const shapeClasses = {
    circle: 'rounded-full aspect-square',
    square: 'rounded-[22%] aspect-square',
    rectangle: 'rounded-[15%] w-10 h-14 object-cover',
    octagon: 'clip-octagon aspect-square'
  };

  // Helper to process name for wrapping: replace hyphens with a space that wraps but hides the hyphen
  const formatCategoryName = (name: string) => {
    return name.replace(/[-]/g, ' ');
  };

  const formatBankName = (name: string) => {
    // If name has more than one word (including those separated by hyphen)
    // replace hyphen with space
    if (name.includes(' ') || name.includes('-')) {
      return name.replace(/-/g, ' ');
    }
    return name;
  };

  return (
    <div id={id} className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 p-3 sm:p-6 w-full max-w-3xl mx-auto overflow-hidden relative transition-all duration-500">
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4 px-1">
          <div className="flex-1 text-left">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight whitespace-nowrap flex items-center justify-start gap-1">
              <span className="text-[var(--accent-color)]">
                {capitalize(formatMonthId(monthId).split(' ')[0])}
              </span>
              <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 ml-0.5">
                {formatMonthId(monthId).split(' ')[1]}
              </span>
            </h2>
          </div>
          
          <div className="flex items-center gap-0.5 shrink-0 [.pdf-export-mode_&]:hidden">
            {onExportImage && (
              <button
                onClick={onExportImage}
                className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                title="PNG"
              >
                <BookImage className="w-4 h-4" />
              </button>
            )}
            {onExportExcel && (
              <button
                onClick={onExportExcel}
                className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                title="Excel"
              >
                <FileSpreadsheet className="w-4 h-4" />
              </button>
            )}
            {onExportPDF && (
              <button
                onClick={onExportPDF}
                className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                title="PDF"
              >
                <FileText className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-1">
          {entries.map((entry) => {
            let bank = getBankDetails(entry.bankId, entry.customBankName);
            if (!bank && entry.bankId.startsWith('custom_')) {
              bank = customBanks.find(b => b.id === entry.bankId);
            }
            if (!bank) return null;

            const logoShape = globalLogoShape || 'circle';

            return (
              <div key={entry.id} className="flex flex-row items-stretch gap-2 p-1.5 rounded-xl bg-gray-50/80 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800 hover:bg-white dark:hover:bg-gray-800 hover:shadow-sm hover:border-[var(--accent-color)] transition-all duration-300 group">
                <div className="flex flex-col items-center justify-center gap-1 w-16 shrink-0 border-r border-gray-200/60 dark:border-gray-700/60 pr-2">
                  <BankLogo 
                    bank={bank} 
                    customLogo={entry.customLogo} 
                    logoShape={logoShape} 
                    size="md"
                  />
                  <span className="text-[9px] font-bold text-center text-gray-700 dark:text-gray-300 uppercase tracking-tight leading-tight w-full break-words">{formatBankName(bank.name)}</span>
                </div>
                
                <div className="flex flex-col justify-center gap-1 flex-1 py-0.5">
                  {[...entry.categories].sort((a, b) => {
                    const getPercent = (cat: any) => {
                      if (typeof cat === 'string') return 0;
                      if (!cat.percent) return 0;
                      const match = cat.percent.match(/[\d.,]+/);
                      if (!match) return 0;
                      return parseFloat(match[0].replace(',', '.'));
                    };
                    return getPercent(a) - getPercent(b);
                  }).map((cat, idx) => {
                    const name = typeof cat === 'string' ? cat : cat.name;
                    const percent = typeof cat === 'string' ? '' : cat.percent;
                    
                    return (
                      <div key={idx} className="flex items-center justify-between text-xs font-semibold text-gray-800 dark:text-gray-200">
                        <div className="flex items-center gap-1.5 min-w-0 flex-1">
                          <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent-color)] shadow-sm shrink-0"></div>
                          <span className="leading-tight break-words">{formatCategoryName(name)}</span>
                        </div>
                        {percent && (
                          <span className="text-[var(--percent-text)] font-extrabold bg-[var(--percent-bg)] px-1.5 py-0.5 rounded text-[10px] ml-2 shrink-0">
                            {percent}%
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="hidden [.pdf-export-mode_&]:flex mt-4 pt-3 border-t border-gray-100 dark:border-gray-800 justify-between items-center text-[9px] text-gray-400 dark:text-gray-500">
          <span>Сгенерировано в приложении Cashback Tracker</span>
          <span>{new Date().toLocaleDateString('ru-RU')}</span>
        </div>
      </div>
    </div>
  );
};
