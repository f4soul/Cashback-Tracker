import React from 'react';
import { AppSettings, LogoShape, Bank, MonthData } from '../types';
import { BankLogo } from '../components/BankLogo';
import { Circle, Square, RectangleHorizontal, Type, Palette, Download, BookImage, FileSpreadsheet, FileText, Check, RotateCcw } from 'lucide-react';
import { clsx } from 'clsx';
import { exportToPDF, exportToExcel, exportToImage } from '../utils/export';
import { CashbackTable } from '../components/CashbackTable';

interface SettingsProps {
  settings: AppSettings;
  setSettings: (settings: AppSettings) => void;
  customBanks: Bank[];
  onDeleteCustomBank: (id: string) => void;
  currentMonthData: MonthData;
}

export const Settings: React.FC<SettingsProps> = ({ settings, setSettings, customBanks, onDeleteCustomBank, currentMonthData }) => {
  const updateSetting = <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    setSettings({ ...settings, [key]: value });
  };

  const colors = [
    { name: 'Emerald', value: '#10b981', bg: '#ecfdf5', text: '#047857' },
    { name: 'Blue', value: '#3b82f6', bg: '#eff6ff', text: '#1d4ed8' },
    { name: 'Indigo', value: '#6366f1', bg: '#eef2ff', text: '#4338ca' },
    { name: 'Purple', value: '#a855f7', bg: '#faf5ff', text: '#7e22ce' },
    { name: 'Rose', value: '#f43f5e', bg: '#fff1f2', text: '#be123c' },
    { name: 'Orange', value: '#f97316', bg: '#fff7ed', text: '#c2410c' },
    { name: 'Amber', value: '#f59e0b', bg: '#fffbeb', text: '#b45309' },
  ];

  const fontColors = [
    { name: 'Slate', value: '#334155' },
    { name: 'Gray', value: '#4b5563' },
    { name: 'Black', value: '#000000' },
    { name: 'White', value: '#ffffff' },
    { name: 'Zinc', value: '#52525b' },
    { name: 'Neutral', value: '#525252' },
    { name: 'Stone', value: '#57534e' },
  ];

  const handleCustomColorChange = (hex: string) => {
    if (/^#[0-9A-F]{3,6}$/i.test(hex)) {
      setSettings(prev => ({
        ...prev,
        accentColor: hex,
        percentBlockBg: `${hex}15`,
        percentBlockText: hex
      }));
    } else {
      updateSetting('accentColor', hex);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="px-2">
        <p className="text-[8px] text-gray-500 font-bold uppercase tracking-wider">Персонализация интерфейса и управление данными</p>
      </div>

      <div className="flex flex-col gap-3 max-w-xl mx-auto w-full">
        {/* Logo Shape */}
        <section className="space-y-2">
            <div className="flex items-center gap-2 text-gray-900 dark:text-white font-semibold px-2">
              <Circle className="w-3.5 h-3.5 text-[var(--accent-color)]" />
              <h2 className="text-xs uppercase tracking-wider">Форма логотипов</h2>
            </div>
            <div className="grid grid-cols-3 gap-2 sm:gap-4">
              {(['circle', 'square', 'rectangle'] as LogoShape[]).map((shape) => (
                <button
                  key={shape}
                  onClick={() => updateSetting('logoShape', shape)}
                  className={clsx(
                    "flex items-center justify-center p-2 rounded-2xl border transition-all hover:scale-105 active:scale-95",
                    settings.logoShape === shape
                      ? "border-[var(--accent-color)] bg-[var(--percent-bg)] text-[var(--accent-color)] shadow-md shadow-[var(--accent-color)]/10"
                      : "border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-800 text-gray-400 hover:border-gray-200 dark:hover:border-gray-700"
                  )}
                >
                  <div className={clsx(
                    "border-2 border-current",
                    shape === 'circle' && "w-4 h-4 sm:w-6 sm:h-6 rounded-full",
                    shape === 'square' && "w-4 h-4 sm:w-6 sm:h-6 rounded-[22%]",
                    shape === 'rectangle' && "w-3 h-4 sm:w-4 sm:h-7 rounded-[15%]"
                  )} />
                </button>
              ))}
            </div>
          </section>

          {/* Accent Color */}
          <section className="space-y-2">
            <div className="flex items-center gap-2 text-gray-900 dark:text-white font-semibold px-2">
              <Palette className="w-3.5 h-3.5 text-[var(--accent-color)]" />
              <h2 className="text-xs uppercase tracking-wider">Акцентный цвет</h2>
            </div>
            <div className="p-2 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm min-h-[3rem] flex items-center">
              <div className="flex flex-nowrap items-center gap-2 sm:gap-2 w-full">
                <div className="flex items-center justify-between gap-1 sm:gap-2 flex-1">
                  {colors.map((color) => (
                    <button
                      key={color.name}
                      type="button"
                      onClick={() => {
                        setSettings(prev => ({
                          ...prev,
                          accentColor: color.value,
                          percentBlockBg: color.bg,
                          percentBlockText: color.text
                        }));
                      }}
                      className={clsx(
                        "w-6 h-6 sm:w-7 sm:h-7 md:w-9 md:h-9 rounded-md border-2 transition-all flex items-center justify-center shrink-0",
                        settings.accentColor === color.value
                          ? "border-gray-900 dark:border-white scale-110 shadow-sm z-10"
                          : "border-transparent hover:scale-110"
                      )}
                      style={{ backgroundColor: color.value }}
                    >
                      {settings.accentColor === color.value && <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 text-white mix-blend-difference" />}
                    </button>
                  ))}
                </div>
                
                <div className="hidden sm:block h-8 w-px bg-gray-100 dark:bg-gray-700 shrink-0" />

                <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                  <div className="relative w-20 sm:w-24 md:w-28 flex items-center">
                    <input
                      type="text"
                      value={settings.accentColor}
                      onChange={(e) => handleCustomColorChange(e.target.value)}
                      className="w-full pl-2 pr-6 sm:pr-7 py-1 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-md text-[10px] sm:text-[11px] md:text-xs font-mono focus:outline-none focus:ring-1 focus:ring-[var(--accent-color)] h-7 sm:h-8 md:h-9"
                      placeholder="#000"
                    />
                    <div 
                      className="absolute right-1.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 rounded-[3px] border border-gray-200 dark:border-gray-600 shadow-inner"
                      style={{ backgroundColor: settings.accentColor }}
                    />
                  </div>
                  <div className="relative w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-md overflow-hidden shrink-0 border border-gray-200 dark:border-gray-700 shadow-sm transition-transform hover:scale-105">
                    <div className="absolute inset-0" style={{ backgroundColor: settings.accentColor }} />
                    <input
                      type="color"
                      value={settings.accentColor}
                      onChange={(e) => handleCustomColorChange(e.target.value)}
                      className="absolute inset-[-10px] w-[calc(100%+20px)] h-[calc(100%+20px)] cursor-pointer opacity-0"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>
        {/* Typography */}
        <section className="space-y-2">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-2 text-gray-900 dark:text-white font-semibold">
                <Type className="w-3.5 h-3.5 text-[var(--accent-color)]" />
                <h2 className="text-xs uppercase tracking-wider">Оформление текста</h2>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden flex flex-col">
              {/* Font Size Slider */}
              <div className="p-2 border-b border-gray-50 dark:border-gray-700/50 space-y-2">
                <div className="flex justify-between items-center text-[8px] sm:text-[10px] text-gray-500 font-bold uppercase tracking-wider px-1">
                  <span>Мелкий</span>
                  <div className="flex items-center gap-2">
                    {settings.fontSize !== 15 && (
                      <button
                        onClick={() => updateSetting('fontSize', 15)}
                        className="flex items-center gap-1 text-gray-500 hover:text-[var(--accent-color)] transition-colors font-bold uppercase tracking-wider text-[8px] sm:text-[10px]"
                        title="Сбросить размер шрифта"
                      >
                        <RotateCcw className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                        СБРОС
                      </button>
                    )}
                    <span className="text-[var(--accent-color)] text-[10px] sm:text-xs">{settings.fontSize}px</span>
                  </div>
                  <span>Крупный</span>
                </div>
                <input
                  type="range"
                  min="12"
                  max="20"
                  step="1"
                  value={settings.fontSize}
                  onChange={(e) => updateSetting('fontSize', parseInt(e.target.value))}
                  className="w-full h-1 sm:h-1.5 bg-gray-100 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[var(--accent-color)]"
                />
              </div>
              
              {/* Font Color Picker */}
              <div className="p-2 flex flex-col justify-center">
                <div className="flex flex-nowrap items-center gap-2 sm:gap-2 w-full min-h-[2.5rem]">
                  <div className="flex items-center justify-between gap-1 sm:gap-2 flex-1">
                    {fontColors.map((color) => (
                      <button
                        key={color.name}
                        type="button"
                        onClick={() => updateSetting('fontColor', color.value)}
                        className={clsx(
                          "w-6 h-6 sm:w-7 sm:h-7 md:w-9 md:h-9 rounded-md border-2 transition-all flex items-center justify-center shrink-0",
                          settings.fontColor === color.value
                            ? "border-gray-900 dark:border-white scale-110 shadow-sm z-10"
                            : "border-transparent hover:scale-110"
                        )}
                        style={{ backgroundColor: color.value }}
                      >
                        {settings.fontColor === color.value && <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 text-white mix-blend-difference" />}
                      </button>
                    ))}
                  </div>
                  
                  <div className="hidden sm:block h-8 w-px bg-gray-100 dark:bg-gray-700 shrink-0" />

                  <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                    <div className="relative w-20 sm:w-24 md:w-28 flex items-center">
                      <input
                        type="text"
                        value={settings.fontColor}
                        onChange={(e) => updateSetting('fontColor', e.target.value)}
                        className="w-full pl-2 pr-6 sm:pr-7 py-1 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-md text-[10px] sm:text-[11px] md:text-xs font-mono focus:outline-none focus:ring-1 focus:ring-[var(--accent-color)] h-7 sm:h-8 md:h-9"
                        placeholder="#000"
                      />
                      <div 
                        className="absolute right-1.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 rounded-[3px] border border-gray-200 dark:border-gray-600 shadow-inner"
                        style={{ backgroundColor: settings.fontColor }}
                      />
                    </div>
                    <div className="relative w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-md overflow-hidden shrink-0 border border-gray-200 dark:border-gray-700 shadow-sm transition-transform hover:scale-105">
                      <div className="absolute inset-0" style={{ backgroundColor: settings.fontColor }} />
                      <input
                        type="color"
                        value={settings.fontColor}
                        onChange={(e) => updateSetting('fontColor', e.target.value)}
                        className="absolute inset-[-10px] w-[calc(100%+20px)] h-[calc(100%+20px)] cursor-pointer opacity-0"
                      />
                    </div>
                  </div>
                </div>
                <p className="text-[9px] text-gray-400 dark:text-gray-500 italic px-1 mt-2">
                  * Влияет на основной текст и заголовки.
                </p>
              </div>
            </div>
          </section>

          {/* Export Settings */}
          <section className="space-y-2">
            <div className="flex items-center gap-2 text-gray-900 dark:text-white font-semibold px-2">
              <Download className="w-4 h-4 text-[var(--accent-color)]" />
              <h2 className="text-xs uppercase tracking-wider">Экспорт данных</h2>
            </div>
            <div className="p-2 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-800 space-y-2 shadow-sm">
              <div className="grid grid-cols-3 gap-2 sm:gap-4">
                <button 
                  onClick={() => exportToImage('settings-export-table', `Кэшбек_${currentMonthData.monthId}.png`)}
                  className="flex flex-col items-center gap-1.5 sm:gap-2 p-2 sm:p-3 rounded-xl border border-blue-100 dark:border-blue-900/30 bg-blue-50/30 dark:bg-blue-900/10 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all group"
                >
                  <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-lg bg-blue-500 flex items-center justify-center shrink-0 shadow-sm group-hover:scale-110 transition-transform">
                    <BookImage className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <span className="font-bold text-[8px] sm:text-[10px] text-blue-700 dark:text-blue-400 uppercase">Image</span>
                </button>

                <button 
                  onClick={() => exportToExcel(currentMonthData, customBanks, `Кэшбек_${currentMonthData.monthId}.xlsx`)}
                  className="flex flex-col items-center gap-1.5 sm:gap-2 p-2 sm:p-3 rounded-xl border border-emerald-100 dark:border-emerald-900/30 bg-emerald-50/30 dark:bg-emerald-900/10 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all group"
                >
                  <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-lg bg-emerald-500 flex items-center justify-center shrink-0 shadow-sm group-hover:scale-110 transition-transform">
                    <FileSpreadsheet className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <span className="font-bold text-[8px] sm:text-[10px] text-emerald-700 dark:text-emerald-400 uppercase">Excel</span>
                </button>

                <button 
                  onClick={() => exportToPDF('settings-export-table', `Кэшбек_${currentMonthData.monthId}.pdf`)}
                  className="flex flex-col items-center gap-1.5 sm:gap-2 p-2 sm:p-3 rounded-xl border border-red-100 dark:border-red-900/30 bg-red-50/30 dark:bg-red-900/10 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all group"
                >
                  <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-lg bg-red-500 flex items-center justify-center shrink-0 shadow-sm group-hover:scale-110 transition-transform">
                    <FileText className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <span className="font-bold text-[8px] sm:text-[10px] text-red-700 dark:text-red-400 uppercase">PDF</span>
                </button>
              </div>
              
              <p className="text-[8px] text-gray-400 dark:text-gray-500 pt-2 border-t border-gray-50 dark:border-gray-700 text-center italic">
                * Экспорт текущего месяца ({currentMonthData.monthId}).
              </p>
            </div>
          </section>

          {/* Hidden table for export */}
          <div className="fixed -left-[2000px] top-0 pointer-events-none opacity-0">
            <div id="settings-export-table">
              <CashbackTable 
                monthId={currentMonthData.monthId}
                entries={currentMonthData.entries}
                customBanks={customBanks}
                globalLogoShape={settings.logoShape}
              />
            </div>
          </div>
        </div>
      </div>

  );
};
