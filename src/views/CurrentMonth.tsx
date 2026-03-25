import React, { useState } from 'react';
import { MonthData, CashbackEntry, Bank, LogoShape } from '../types';
import { getCurrentMonthId, formatMonthId, capitalize } from '../utils/date';
import { Modal } from '../components/ui/Modal';
import { BankForm } from '../components/BankForm';
import { CashbackTable } from '../components/CashbackTable';
import { exportToPDF, exportToExcel, exportToImage } from '../utils/export';
import { BankLogo } from '../components/BankLogo';
import { Plus, Download, FileSpreadsheet, BookImage, Edit2, Trash2, ChevronDown, ChevronUp, GripVertical, Table as TableIcon, LayoutList } from 'lucide-react';
import { getBankDetails } from '../constants';
import { clsx } from 'clsx';
import { motion, AnimatePresence } from 'motion/react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface CurrentMonthProps {
  data: MonthData;
  customBanks: Bank[];
  customCategories: string[];
  onUpdate: (data: MonthData) => void;
  onDeleteEntry: (id: string) => void;
  onAddCustomBank: (bank: Bank) => void;
  onDeleteCustomBank: (id: string) => void;
  onAddCustomCategory: (category: string) => void;
  globalLogoShape: LogoShape;
}

interface SortableBankCardProps {
  entry: CashbackEntry;
  bank: Bank;
  logoShape: LogoShape;
  onEdit: () => void;
  onDelete: () => void;
}

const SortableBankCard: React.FC<SortableBankCardProps> = ({ entry, bank, logoShape, onEdit, onDelete }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: entry.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : undefined,
  };

  const shapeClasses = {
    circle: 'w-10 h-10 rounded-full',
    square: 'w-10 h-10 rounded-[22%]',
    rectangle: 'w-10 h-14 rounded-[15%]'
  };

  const logoUrl = entry.customLogo || bank.logoUrl;

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -2 }}
      className={clsx(
        "flex items-center justify-between p-3 bg-white dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm hover:border-[var(--accent-color)]/50 hover:shadow-md transition-all duration-300",
        isDragging && "opacity-50 border-[var(--accent-color)] shadow-xl scale-105 z-50"
      )}
    >
      <div className="flex items-center gap-3 min-w-0">
        <button
          {...attributes}
          {...listeners}
          className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-grab active:cursor-grabbing shrink-0"
        >
          <GripVertical className="w-4 h-4" />
        </button>
        
        <BankLogo 
          bank={bank} 
          customLogo={entry.customLogo} 
          logoShape={logoShape} 
          size="lg"
        />
        
        <div className="min-w-0 flex-1">
          <h3 className="font-bold text-sm text-gray-900 dark:text-white truncate leading-tight">{bank.name}</h3>
          <p className="text-[10px] font-medium text-gray-500 dark:text-gray-400 truncate leading-none mt-1 uppercase tracking-wider">
            {entry.categories.length} {entry.categories.length === 1 ? 'категория' : entry.categories.length < 5 ? 'категории' : 'категорий'}
          </p>
        </div>
      </div>
      
      <div className="flex items-center gap-1 shrink-0 ml-2 relative z-10">
        <button
          type="button"
          onPointerDown={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onEdit();
          }}
          className="p-2 text-gray-400 hover:text-[var(--accent-color)] hover:bg-[var(--percent-bg)] rounded-xl transition-all"
        >
          <Edit2 className="w-4 h-4" />
        </button>
        <button
          type="button"
          onPointerDown={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onDelete();
          }}
          className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-xl transition-all"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
};

export const CurrentMonth: React.FC<CurrentMonthProps> = ({ 
  data, 
  customBanks,
  customCategories,
  onUpdate,
  onDeleteEntry,
  onAddCustomBank,
  onDeleteCustomBank,
  onAddCustomCategory,
  globalLogoShape
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<CashbackEntry | undefined>(undefined);
  const [activeSubTab, setActiveSubTab] = useState<'table' | 'list'>('table');

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleSaveEntry = (entryData: Omit<CashbackEntry, 'id'>) => {
    let newEntries = [...data.entries];
    if (editingEntry) {
      newEntries = newEntries.map(e => e.id === editingEntry.id ? { ...entryData, id: editingEntry.id } : e);
    } else {
      newEntries.push({ ...entryData, id: crypto.randomUUID() });
    }
    
    onUpdate({ ...data, entries: newEntries });
    setIsModalOpen(false);
    setEditingEntry(undefined);
  };

  const handleDeleteEntry = (id: string) => {
    onDeleteEntry(id);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = data.entries.findIndex((e) => e.id === active.id);
      const newIndex = data.entries.findIndex((e) => e.id === over.id);

      const newEntries = arrayMove(data.entries, oldIndex, newIndex);
      onUpdate({ ...data, entries: newEntries });
    }
  };

  const handleExport = () => {
    exportToPDF('current-cashback-table', `Кэшбек_${data.monthId}.pdf`);
  };

  const handleExportExcel = () => {
    exportToExcel(data, customBanks, `Кэшбек_${data.monthId}.xlsx`);
  };

  const handleExportImage = () => {
    exportToImage('current-cashback-table', `Кэшбек_${data.monthId}.png`);
  };

  return (
    <div className="flex flex-col gap-2 pb-24 relative">
      <button
        onClick={() => {
          setEditingEntry(undefined);
          setIsModalOpen(true);
        }}
        title="Добавить банк"
        className="fixed bottom-[15%] right-6 md:bottom-10 md:right-10 w-14 h-14 bg-[var(--accent-color)] text-white rounded-full flex items-center justify-center shadow-2xl shadow-[var(--accent-color)]/40 hover:opacity-90 transition-all hover:scale-110 active:scale-95 z-40 animate-in zoom-in duration-300"
      >
        <Plus className="w-7 h-7" />
      </button>

      {/* Internal Tabs */}
      <div className="flex p-1 bg-gray-200/80 dark:bg-gray-800 rounded-xl">
        <button
          onClick={() => setActiveSubTab('table')}
          className={clsx(
            "flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all",
            activeSubTab === 'table'
              ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
              : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          )}
        >
          <TableIcon className="w-3.5 h-3.5" />
          Таблица
        </button>
        <button
          onClick={() => setActiveSubTab('list')}
          className={clsx(
            "flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all",
            activeSubTab === 'list'
              ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
              : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          )}
        >
          <LayoutList className="w-3.5 h-3.5" />
          Список банков
        </button>
      </div>

      {activeSubTab === 'table' ? (
        <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <CashbackTable 
            id="current-cashback-table" 
            monthId={data.monthId} 
            entries={data.entries} 
            customBanks={customBanks}
            globalLogoShape={globalLogoShape}
            onExportPDF={handleExport}
            onExportExcel={handleExportExcel}
            onExportImage={handleExportImage}
          />
        </div>
      ) : (
        <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
          {data.entries.length === 0 ? (
            <button
              onClick={() => {
                setEditingEntry(undefined);
                setIsModalOpen(true);
              }}
              className="flex flex-col items-center justify-center p-12 text-center bg-gray-50 dark:bg-gray-800/50 rounded-3xl border border-dashed border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group w-full"
            >
              <Plus className="w-10 h-10 text-gray-300 mb-4 group-hover:text-[var(--accent-color)] transition-colors" />
              <p className="text-sm text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300">Добавьте первый банк</p>
            </button>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={data.entries.map(e => e.id)}
                strategy={verticalListSortingStrategy}
              >
                <motion.div 
                  layout
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                >
                  <AnimatePresence mode="popLayout">
                    {data.entries.map(entry => {
                      let bank = getBankDetails(entry.bankId, entry.customBankName);
                      if (!bank && entry.bankId.startsWith('custom_')) {
                        bank = customBanks.find(b => b.id === entry.bankId);
                      }
                      if (!bank) return null;
                      
                      // @ts-ignore - entry.logoShape might exist in data but not in type yet
                      const logoShape = entry.logoShape || globalLogoShape || 'circle';
                      
                      return (
                        <SortableBankCard
                          key={entry.id}
                          entry={entry}
                          bank={bank}
                          logoShape={logoShape}
                          onEdit={() => {
                            setEditingEntry(entry);
                            setIsModalOpen(true);
                          }}
                          onDelete={() => handleDeleteEntry(entry.id)}
                        />
                      );
                    })}
                  </AnimatePresence>
                </motion.div>
              </SortableContext>
            </DndContext>
          )}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingEntry ? 'Редактировать банк' : 'Добавить банк'}
      >
        <BankForm
          initialEntry={editingEntry}
          customBanks={customBanks}
          customCategories={customCategories}
          onSave={handleSaveEntry}
          onCancel={() => setIsModalOpen(false)}
          onAddCustomBank={onAddCustomBank}
          onDeleteCustomBank={onDeleteCustomBank}
          onAddCustomCategory={onAddCustomCategory}
          globalLogoShape={globalLogoShape}
        />
      </Modal>
    </div>
  );
};
