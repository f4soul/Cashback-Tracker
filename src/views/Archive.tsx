import React, { useState, useMemo } from 'react';
import { MonthData, Bank, LogoShape } from '../types';
import { formatMonthId, capitalize } from '../utils/date';
import { CashbackTable } from '../components/CashbackTable';
import { exportToPDF, exportToExcel } from '../utils/export';
import { Download, FileSpreadsheet, FileText, Search, Filter, ChevronDown, ChevronUp, Trash2 } from 'lucide-react';
import { BANKS, COMMON_CATEGORIES, getBankDetails } from '../constants';
import { BankLogo } from '../components/BankLogo';
import { clsx } from 'clsx';
import { motion, AnimatePresence } from 'motion/react';

interface ArchiveProps {
  allData: MonthData[];
  customBanks: Bank[];
  customCategories: string[];
  onDeleteEntry: (monthId: string, entryId: string) => void;
  globalLogoShape: LogoShape;
}

export const Archive: React.FC<ArchiveProps> = ({ allData, customBanks, customCategories, onDeleteEntry, globalLogoShape }) => {
  const [expandedMonth, setExpandedMonth] = useState<string | null>(allData[0]?.monthId || null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBankFilter, setSelectedBankFilter] = useState<string>('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);
  const [openBankDropdown, setOpenBankDropdown] = useState(false);
  const [openCategoryDropdown, setOpenCategoryDropdown] = useState(false);

  const allBanks = useMemo(() => [...BANKS, ...customBanks], [customBanks]);
  const allCategories = useMemo(() => Array.from(new Set([...COMMON_CATEGORIES, ...customCategories])), [customCategories]);

  // Filter the data
  const filteredData = useMemo(() => {
    return allData.map(month => {
      // Filter entries within the month
      const filteredEntries = month.entries.filter(entry => {
        let bank = getBankDetails(entry.bankId, entry.customBankName);
        if (!bank && entry.bankId.startsWith('custom_')) {
          bank = customBanks.find(b => b.id === entry.bankId);
        }
        
        // Bank filter
        if (selectedBankFilter && entry.bankId !== selectedBankFilter) return false;
        
        // Category filter
        if (selectedCategoryFilter && !entry.categories.some(c => {
          const name = typeof c === 'string' ? c : c.name;
          return name === selectedCategoryFilter;
        })) return false;
        
        // Search query (checks bank name and categories)
        if (searchQuery) {
          const q = searchQuery.toLowerCase();
          const matchesBank = bank?.name.toLowerCase().includes(q);
          const matchesCategory = entry.categories.some(c => {
            const name = typeof c === 'string' ? c : c.name;
            return name.toLowerCase().includes(q);
          });
          if (!matchesBank && !matchesCategory) return false;
        }
        
        return true;
      });

      return { ...month, entries: filteredEntries };
    }).filter(month => month.entries.length > 0); // Only keep months that have matching entries
  }, [allData, searchQuery, selectedBankFilter, selectedCategoryFilter, customBanks]);

  const toggleMonth = (monthId: string) => {
    setExpandedMonth(prev => prev === monthId ? null : monthId);
  };

  const handleExport = (monthId: string) => {
    exportToPDF(`archive-table-${monthId}`, `Кэшбек_${monthId}.pdf`);
  };

  const handleExportExcel = (month: MonthData) => {
    exportToExcel(month, customBanks, `Кэшбек_${month.monthId}.xlsx`);
  };

  const handleDeleteEntry = (monthId: string, entryId: string) => {
    if (window.confirm('Удалить этот банк из архива?')) {
      onDeleteEntry(monthId, entryId);
    }
  };

  const shapeClasses = {
    circle: 'w-10 h-10 rounded-full',
    square: 'w-10 h-10 rounded-[22%]',
    rectangle: 'w-10 h-14 rounded-[15%]'
  };

  return (
    <div className="flex flex-col gap-6 pb-24">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Архив</h1>
        <p className="text-gray-500 dark:text-gray-400">История кэшбека за прошлые месяцы</p>
      </div>

      {/* Filters Section */}
      <div className="bg-white dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-4 flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Поиск по банку или категории..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 dark:text-white transition-all"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={clsx(
              "p-2.5 rounded-xl border transition-colors flex items-center justify-center",
              showFilters || selectedBankFilter || selectedCategoryFilter
                ? "bg-emerald-50 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400"
                : "bg-gray-50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
            )}
          >
            <Filter className="w-5 h-5" />
          </button>
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gray-100 dark:border-gray-800 animate-in fade-in slide-in-from-top-2">
            {/* Bank Filter Dropdown */}
            <div className="flex flex-col gap-1.5 relative">
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Фильтр по банку</label>
              <button
                onClick={() => {
                  setOpenBankDropdown(!openBankDropdown);
                  setOpenCategoryDropdown(false);
                }}
                className="w-full flex items-center justify-between px-3 py-2.5 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 dark:text-white transition-all"
              >
                <div className="flex items-center gap-2 overflow-hidden">
                  {selectedBankFilter ? (
                    <>
                      <BankLogo 
                        bank={allBanks.find(b => b.id === selectedBankFilter)!} 
                        logoShape={globalLogoShape} 
                        size="sm"
                      />
                      <span className="truncate">{allBanks.find(b => b.id === selectedBankFilter)?.name}</span>
                    </>
                  ) : (
                    <span className="text-gray-400">Все банки</span>
                  )}
                </div>
                <ChevronDown className={clsx("w-4 h-4 text-gray-400 transition-transform", openBankDropdown && "rotate-180")} />
              </button>

              <AnimatePresence>
                {openBankDropdown && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setOpenBankDropdown(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 4, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 4, scale: 0.95 }}
                      className="absolute top-full left-0 right-0 mt-2 z-20 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-xl max-h-64 overflow-y-auto scrollbar-hide p-1.5"
                    >
                      <button
                        onClick={() => { setSelectedBankFilter(''); setOpenBankDropdown(false); }}
                        className={clsx(
                          "w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-colors",
                          !selectedBankFilter ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400" : "hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                        )}
                      >
                        <div className="w-5 h-5 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center shrink-0">
                          <Filter className="w-3 h-3" />
                        </div>
                        Все банки
                      </button>
                      {allBanks.map(b => (
                        <button
                          key={b.id}
                          onClick={() => { setSelectedBankFilter(b.id); setOpenBankDropdown(false); }}
                          className={clsx(
                            "w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-colors mt-0.5",
                            selectedBankFilter === b.id ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400" : "hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                          )}
                        >
                          <BankLogo 
                            bank={b} 
                            logoShape={globalLogoShape} 
                            size="sm"
                          />
                          <span className="truncate">{b.name}</span>
                        </button>
                      ))}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Category Filter Dropdown */}
            <div className="flex flex-col gap-1.5 relative">
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Фильтр по категории</label>
              <button
                onClick={() => {
                  setOpenCategoryDropdown(!openCategoryDropdown);
                  setOpenBankDropdown(false);
                }}
                className="w-full flex items-center justify-between px-3 py-2.5 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 dark:text-white transition-all"
              >
                <span className={clsx("truncate", !selectedCategoryFilter && "text-gray-400")}>
                  {selectedCategoryFilter || "Все категории"}
                </span>
                <ChevronDown className={clsx("w-4 h-4 text-gray-400 transition-transform", openCategoryDropdown && "rotate-180")} />
              </button>

              <AnimatePresence>
                {openCategoryDropdown && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setOpenCategoryDropdown(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 4, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 4, scale: 0.95 }}
                      className="absolute top-full left-0 right-0 mt-2 z-20 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-xl max-h-64 overflow-y-auto scrollbar-hide p-1.5"
                    >
                      <button
                        onClick={() => { setSelectedCategoryFilter(''); setOpenCategoryDropdown(false); }}
                        className={clsx(
                          "w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-colors",
                          !selectedCategoryFilter ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400" : "hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                        )}
                      >
                        Все категории
                      </button>
                      {allCategories.map(c => (
                        <button
                          key={c}
                          onClick={() => { setSelectedCategoryFilter(c); setOpenCategoryDropdown(false); }}
                          className={clsx(
                            "w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-colors mt-0.5",
                            selectedCategoryFilter === c ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400" : "hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                          )}
                        >
                          {c}
                        </button>
                      ))}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>

      {/* Results */}
      {filteredData.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center bg-gray-50 dark:bg-gray-800/30 rounded-3xl border border-dashed border-gray-200 dark:border-gray-800">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
            <Search className="w-8 h-8 text-gray-400 dark:text-gray-500" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">Ничего не найдено</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Попробуйте изменить параметры поиска или фильтры</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {filteredData.map(month => {
            const isExpanded = expandedMonth === month.monthId;
            return (
              <div key={month.monthId} className="bg-white dark:bg-gray-800/50 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
                <button
                  onClick={() => toggleMonth(month.monthId)}
                  className="w-full flex items-center justify-between p-6 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-lg">
                      {month.monthId.split('-')[1]}
                    </div>
                    <div className="text-left">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white capitalize">{formatMonthId(month.monthId)}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{month.entries.length} банков</p>
                    </div>
                  </div>
                  {isExpanded ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                </button>
                
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: 'easeInOut' }}
                          className="overflow-hidden"
                        >
                          <div className="p-6 pt-0 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/20">
                            {/* Added banks list in Archive */}
                            <div className="flex flex-col gap-3 mb-6 mt-6">
                              <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 px-1">Банки в этом месяце</h4>
                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                {month.entries.map(entry => {
                                  let bank = getBankDetails(entry.bankId, entry.customBankName);
                                  if (!bank && entry.bankId.startsWith('custom_')) {
                                    bank = customBanks.find(b => b.id === entry.bankId);
                                  }
                                  if (!bank) return null;
                                  
                                  const logoShape = globalLogoShape || 'circle';
                                  const logoUrl = entry.customLogo || bank.logoUrl;
                                  
                                  return (
                                    <motion.div 
                                      key={entry.id} 
                                      initial={{ opacity: 0, scale: 0.95 }}
                                      animate={{ opacity: 1, scale: 1 }}
                                      className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm hover:border-[var(--accent-color)]/30 transition-all group"
                                    >
                                      <div className="flex items-center gap-3 min-w-0">
                                        <BankLogo 
                                          bank={bank} 
                                          customLogo={entry.customLogo} 
                                          logoShape={logoShape} 
                                          size="md"
                                        />
                                        <div className="min-w-0">
                                          <h3 className="font-bold text-xs text-gray-900 dark:text-white truncate uppercase tracking-tight">{bank.name}</h3>
                                        </div>
                                      </div>
                                      <button
                                        onClick={() => handleDeleteEntry(month.monthId, entry.id)}
                                        className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-xl transition-all"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </button>
                                    </motion.div>
                                  );
                                })}
                              </div>
                            </div>

                            <div className="flex justify-end gap-2 mb-4">
                              <button
                                onClick={() => handleExportExcel(month)}
                                className="flex items-center gap-2 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 px-4 py-2.5 rounded-xl border border-emerald-100 dark:border-emerald-800/50 transition-all uppercase tracking-wider"
                              >
                                <FileSpreadsheet className="w-3.5 h-3.5" />
                                Excel
                              </button>
                              <button
                                onClick={() => handleExport(month.monthId)}
                                className="flex items-center gap-2 text-[10px] font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 px-4 py-2.5 rounded-xl border border-red-100 dark:border-red-800/50 transition-all uppercase tracking-wider"
                              >
                                <FileText className="w-3.5 h-3.5" />
                                PDF
                              </button>
                            </div>
                            <CashbackTable 
                              id={`archive-table-${month.monthId}`} 
                              monthId={month.monthId} 
                              entries={month.entries} 
                              customBanks={customBanks}
                              globalLogoShape={globalLogoShape}
                            />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
