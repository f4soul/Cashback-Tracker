import React, { useState, useEffect } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { MonthData, Bank, AppSettings } from './types';
import { getCurrentMonthId } from './utils/date';
import { CurrentMonth } from './views/CurrentMonth';
import { Archive } from './views/Archive';
import { Settings } from './views/Settings';
import { Wallet, History, Settings as SettingsIcon, Moon, Sun } from 'lucide-react';
import { clsx } from 'clsx';

export default function App() {
  const [activeTab, setActiveTab] = useState<'current' | 'archive' | 'settings'>('current');
  const [allData, setAllData] = useLocalStorage<MonthData[]>('cashback_data', []);
  const [customBanks, setCustomBanks] = useLocalStorage<Bank[]>('custom_banks', []);
  const [customCategories, setCustomCategories] = useLocalStorage<string[]>('custom_categories', []);
  const [theme, setTheme] = useLocalStorage<'light' | 'dark'>('theme', 'light');
  
  const [settings, setSettings] = useLocalStorage<AppSettings>('app_settings', {
    logoShape: 'circle',
    fontSize: 15,
    accentColor: '#10b981', // emerald-500
    percentBlockBg: '#ecfdf5', // emerald-50
    percentBlockText: '#047857', // emerald-700
    fontColor: '#111827', // gray-900
  });
  
  const [headerVisible, setHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const currentMonthId = getCurrentMonthId();

  // Handle header visibility on scroll
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setHeaderVisible(false);
      } else {
        setHeaderVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Apply theme and custom styles to document
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    
    // Apply custom colors and font size
    root.style.setProperty('--accent-color', settings.accentColor);
    root.style.setProperty('--percent-bg', settings.percentBlockBg);
    root.style.setProperty('--percent-text', settings.percentBlockText);
    root.style.setProperty('--app-font-color', settings.fontColor);
    root.style.setProperty('--app-font-size', `${settings.fontSize}px`);
  }, [theme, settings]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  // Ensure current month exists
  useEffect(() => {
    if (!allData.find(d => d.monthId === currentMonthId)) {
      setAllData(prev => [...prev, { monthId: currentMonthId, entries: [] }]);
    }
  }, [currentMonthId, allData, setAllData]);

  const currentMonthData = allData.find(d => d.monthId === currentMonthId) || { monthId: currentMonthId, entries: [] };
  const archiveData = allData.filter(d => d.monthId !== currentMonthId).sort((a, b) => b.monthId.localeCompare(a.monthId));

  const handleUpdateCurrentMonth = (updatedData: MonthData) => {
    setAllData(prev => {
      const exists = prev.find(d => d.monthId === updatedData.monthId);
      if (exists) {
        return prev.map(d => d.monthId === updatedData.monthId ? updatedData : d);
      } else {
        return [...prev, updatedData];
      }
    });
  };

  const deleteMonthEntry = (monthId: string, entryId: string) => {
    setAllData(prev => prev.map(month => 
      month.monthId === monthId 
        ? { ...month, entries: month.entries.filter(e => e.id !== entryId) }
        : month
    ));
  };

  const handleDeleteCustomBank = (bankId: string) => {
    setCustomBanks(prev => prev.filter(b => b.id !== bankId));
  };

  const handleAddCustomBank = (bank: Bank) => {
    if (!customBanks.find(b => b.id === bank.id)) {
      setCustomBanks(prev => [...prev, bank]);
    }
  };

  const handleAddCustomCategory = (category: string) => {
    if (!customCategories.includes(category)) {
      setCustomCategories(prev => [...prev, category]);
    }
  };

  return (
    <div 
      className="h-[100dvh] overflow-hidden bg-gray-50/50 dark:bg-gray-950/50 font-sans transition-colors duration-300 flex flex-col md:flex-row"
      style={{ fontSize: 'var(--app-font-size)' }}
    >
      {/* Desktop Sidebar / Mobile Header */}
      <aside className={clsx(
        "bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 z-30 transition-all duration-300",
        "md:w-64 md:h-[100dvh] md:sticky md:top-0",
        "w-full sticky top-0 md:flex md:flex-col shrink-0",
        !headerVisible && "md:translate-y-0 -translate-y-full"
      )}>
        <div className="px-6 py-4 flex flex-col md:gap-8">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-500 dark:bg-emerald-600 rounded-[22%] flex items-center justify-center shadow-lg shadow-emerald-500/10 dark:shadow-emerald-900/30">
                <Wallet className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight leading-none">Cashback</h1>
                <p className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mt-1">Tracker Pro</p>
              </div>
            </div>
            
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-2xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all hover:scale-105 active:scale-95"
              title={theme === 'light' ? 'Включить темную тему' : 'Включить светлую тему'}
            >
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex flex-col gap-2 w-full">
            <button
              onClick={() => setActiveTab('current')}
              className={clsx(
                "flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 text-sm font-semibold",
                activeTab === 'current'
                  ? "bg-[var(--percent-bg)] text-[var(--accent-color)] shadow-sm"
                  : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
              )}
            >
              <Wallet className="w-5 h-5" />
              Кэшбек
            </button>
            <button
              onClick={() => setActiveTab('archive')}
              className={clsx(
                "flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 text-sm font-semibold",
                activeTab === 'archive'
                  ? "bg-[var(--percent-bg)] text-[var(--accent-color)] shadow-sm"
                  : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
              )}
            >
              <History className="w-5 h-5" />
              Архив
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={clsx(
                "flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 text-sm font-semibold",
                activeTab === 'settings'
                  ? "bg-[var(--percent-bg)] text-[var(--accent-color)] shadow-sm"
                  : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
              )}
            >
              <SettingsIcon className="w-5 h-5" />
              Настройки
            </button>
          </nav>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full relative overflow-hidden">
        <main className="flex-1 overflow-y-auto scrollbar-hide app-content-text">
          <div className="max-w-5xl mx-auto px-4 py-4 sm:px-8 md:py-4 pb-20 md:pb-4">
            {activeTab === 'current' ? (
              <CurrentMonth 
                data={currentMonthData} 
                onUpdate={handleUpdateCurrentMonth}
                onDeleteEntry={(entryId) => deleteMonthEntry(currentMonthId, entryId)}
                customBanks={customBanks}
                customCategories={customCategories}
                onAddCustomBank={handleAddCustomBank}
                onDeleteCustomBank={handleDeleteCustomBank}
                onAddCustomCategory={handleAddCustomCategory}
                globalLogoShape={settings.logoShape}
              />
            ) : activeTab === 'archive' ? (
              <Archive 
                allData={archiveData} 
                customBanks={customBanks}
                customCategories={customCategories}
                onDeleteEntry={deleteMonthEntry}
                globalLogoShape={settings.logoShape}
              />
            ) : (
              <Settings 
                settings={settings}
                setSettings={setSettings}
                customBanks={customBanks}
                onDeleteCustomBank={handleDeleteCustomBank}
                currentMonthData={currentMonthData}
              />
            )}
          </div>
        </main>

        {/* Mobile Bottom Navigation */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-t border-gray-100 dark:border-gray-800 px-4 py-3 pb-safe z-30 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.05)] dark:shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.5)] transition-colors duration-300">
          <div className="grid grid-cols-3 w-full">
            <button
              onClick={() => setActiveTab('current')}
              className={clsx(
                "flex flex-col items-center justify-center gap-1.5 transition-all duration-300",
                activeTab === 'current'
                  ? "text-[var(--accent-color)] scale-110"
                  : "text-gray-400 dark:text-gray-500"
              )}
            >
              <Wallet className="w-6 h-6" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Кэшбек</span>
            </button>
            <button
              onClick={() => setActiveTab('archive')}
              className={clsx(
                "flex flex-col items-center justify-center gap-1.5 transition-all duration-300",
                activeTab === 'archive'
                  ? "text-[var(--accent-color)] scale-110"
                  : "text-gray-400 dark:text-gray-500"
              )}
            >
              <History className="w-6 h-6" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Архив</span>
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={clsx(
                "flex flex-col items-center justify-center gap-1.5 transition-all duration-300",
                activeTab === 'settings'
                  ? "text-[var(--accent-color)] scale-110"
                  : "text-gray-400 dark:text-gray-500"
              )}
            >
              <SettingsIcon className="w-6 h-6" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Настройки</span>
            </button>
          </div>
        </nav>
      </div>
    </div>
  );
}

