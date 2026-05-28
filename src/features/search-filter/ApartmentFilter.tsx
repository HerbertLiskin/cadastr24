import React from 'react';
import { Search, SlidersHorizontal, ArrowUpDown, Filter } from 'lucide-react';
import { GlassCard } from '../../shared/ui/GlassCard';
import { getOwnersPlural } from '../../shared/lib/formatters';

interface ApartmentFilterProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedStatus: 'all' | 'residential' | 'commercial';
  setSelectedStatus: (s: 'all' | 'residential' | 'commercial') => void;
  selectedOwnerType: string;
  setSelectedOwnerType: (t: string) => void;
  sortBy: 'apartment' | 'area_asc' | 'area_desc' | 'owners_asc' | 'owners_desc';
  setSortBy: (b: 'apartment' | 'area_asc' | 'area_desc' | 'owners_asc' | 'owners_desc') => void;
  ownerCountsOptions?: number[];
}

export const ApartmentFilter: React.FC<ApartmentFilterProps> = ({
  searchQuery,
  setSearchQuery,
  selectedStatus,
  setSelectedStatus,
  selectedOwnerType,
  setSelectedOwnerType,
  sortBy,
  setSortBy,
  ownerCountsOptions = [1, 2, 3, 4, 6],
}) => {
  return (
    <GlassCard className="py-4 px-6 border-slate-800/80 mb-6 bg-slate-900/30">
      <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
        
        {/* Search Input */}
        <div className="relative w-full lg:w-96 group">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-400 transition-colors">
            <Search size={18} />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Поиск по адресу, кадастровому номеру..."
            id="apartment-search"
            className="w-full pl-10 pr-4 py-2.5 bg-slate-950/50 hover:bg-slate-950/80 focus:bg-slate-950/90 text-[#F1F5F9] placeholder-slate-500 rounded-xl border border-slate-800/80 focus:border-indigo-500/50 outline-none transition-all duration-200 text-sm focus:ring-1 focus:ring-indigo-500/20"
          />
        </div>

        {/* Filter Sliders & Dropdowns */}
        <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
          
          {/* Status Filter */}
          <div className="flex items-center gap-2 bg-slate-950/30 px-3 py-1.5 rounded-xl border border-slate-800/50">
            <Filter size={14} className="text-slate-400" />
            <span className="text-xs text-slate-400 font-medium">Тип:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as any)}
              className="bg-transparent text-xs text-indigo-300 font-semibold focus:outline-none border-none cursor-pointer pr-2"
            >
              <option value="all" className="bg-slate-900 text-slate-200">Все типы</option>
              <option value="residential" className="bg-slate-900 text-slate-200">Жилые квартиры</option>
              <option value="commercial" className="bg-slate-900 text-slate-200">Нежилые (КБ)</option>
            </select>
          </div>

          {/* Owner Filter */}
          <div className="flex items-center gap-2 bg-slate-950/30 px-3 py-1.5 rounded-xl border border-slate-800/50">
            <SlidersHorizontal size={14} className="text-slate-400" />
            <span className="text-xs text-slate-400 font-medium">Собственники:</span>
            <select
              value={selectedOwnerType}
              onChange={(e) => setSelectedOwnerType(e.target.value)}
              className="bg-transparent text-xs text-indigo-300 font-semibold focus:outline-none border-none cursor-pointer pr-2"
            >
              <option value="all" className="bg-slate-900 text-slate-200">Любые</option>
              <option value="has_owners" className="bg-slate-900 text-slate-200">Есть собственники</option>
              <option value="no_owners" className="bg-slate-900 text-slate-200">Нет собственников</option>
              {ownerCountsOptions.map(count => (
                <option key={count} value={String(count)} className="bg-slate-900 text-slate-200">
                  {getOwnersPlural(count)}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Selection */}
          <div className="flex items-center gap-2 bg-slate-950/30 px-3 py-1.5 rounded-xl border border-slate-800/50">
            <ArrowUpDown size={14} className="text-slate-400" />
            <span className="text-xs text-slate-400 font-medium">Сортировка:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent text-xs text-indigo-300 font-semibold focus:outline-none border-none cursor-pointer pr-2"
            >
              <option value="apartment" className="bg-slate-900 text-slate-200">По номеру квартиры</option>
              <option value="area_asc" className="bg-slate-900 text-slate-200">Площадь (меньше → больше)</option>
              <option value="area_desc" className="bg-slate-900 text-slate-200">Площадь (больше → меньше)</option>
              <option value="owners_asc" className="bg-slate-900 text-slate-200">Собственники (меньше → больше)</option>
              <option value="owners_desc" className="bg-slate-900 text-slate-200">Собственники (больше → меньше)</option>
            </select>
          </div>

        </div>

      </div>
    </GlassCard>
  );
};

