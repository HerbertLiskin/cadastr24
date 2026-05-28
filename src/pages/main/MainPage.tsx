import React, { useState, useMemo } from 'react';
import { Landmark, Sparkles, AlertCircle } from 'lucide-react';
import { useApartments } from '../../entities/apartment/model/useApartments';
import { StatsGrid } from '../../widgets/stats-grid/StatsGrid';
import { ApartmentFilter } from '../../features/search-filter/ApartmentFilter';
import { ApartmentTable } from '../../widgets/apartment-table/ApartmentTable';
import type { ApartmentElement } from '../../entities/apartment/model/types';

export const MainPage: React.FC = () => {
  const { apartments, isLoading, error, metrics } = useApartments();

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'residential' | 'commercial'>('all');
  const [selectedOwnerType, setSelectedOwnerType] = useState<'all' | 'has_owners' | 'no_owners'>('all');
  const [sortBy, setSortBy] = useState<'apartment' | 'area_asc' | 'area_desc' | 'owners_asc' | 'owners_desc'>('apartment');

  // Enrich data with flatNumber and process filters
  const processedApartments = useMemo(() => {
    // 1. Map and enrich flat numbers (index + 1)
    const enriched: (ApartmentElement & { flatNumber: number })[] = apartments.map((item, idx) => ({
      ...item,
      flatNumber: idx + 1,
    }));

    // 2. Filter elements
    const filtered = enriched.filter((item) => {
      const isFlat41 = item.flatNumber === 41;

      // Status Filter
      if (selectedStatus === 'residential' && isFlat41) return false;
      if (selectedStatus === 'commercial' && !isFlat41) return false;

      // Owner Presence Filter
      const ownersCount = item.rights?.length || 0;
      if (selectedOwnerType === 'has_owners') {
        if (isFlat41 || ownersCount === 0) return false;
      }
      if (selectedOwnerType === 'no_owners') {
        if (isFlat41 || ownersCount > 0) return false;
      }

      // Search Query
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase().trim();
        
        // Special case for Flat 41 (KB Store)
        if (isFlat41) {
          const matchKb = ['кб', 'красное', 'белое', 'нежилое', 'магазин', '41', 'коммерция'].some(
            (term) => term.includes(query) || query.includes(term)
          );
          if (!matchKb) return false;
        } else {
          // Regular apartment search
          const addr = (item.address?.readableAddress || '').toLowerCase();
          const cad = (item.cadNumber || '').toLowerCase();
          const flatStr = String(item.flatNumber);

          const matchesSearch = addr.includes(query) || cad.includes(query) || flatStr === query;
          if (!matchesSearch) return false;
        }
      }

      return true;
    });

    // 3. Sort elements
    filtered.sort((a, b) => {
      const isA41 = a.flatNumber === 41;
      const isB41 = b.flatNumber === 41;

      switch (sortBy) {
        case 'apartment':
          return a.flatNumber - b.flatNumber;

        case 'area_asc':
          if (isA41) return 1; // Put empty elements at the bottom
          if (isB41) return -1;
          return parseFloat(a.area || '0') - parseFloat(b.area || '0');

        case 'area_desc':
          if (isA41) return 1;
          if (isB41) return -1;
          return parseFloat(b.area || '0') - parseFloat(a.area || '0');

        case 'owners_asc':
          if (isA41) return 1;
          if (isB41) return -1;
          return (a.rights?.length || 0) - (b.rights?.length || 0);

        case 'owners_desc':
          if (isA41) return 1;
          if (isB41) return -1;
          return (b.rights?.length || 0) - (a.rights?.length || 0);

        default:
          return a.flatNumber - b.flatNumber;
      }
    });

    return filtered;
  }, [apartments, searchQuery, selectedStatus, selectedOwnerType, sortBy]);

  return (
    <div className="relative min-h-screen pb-16 px-4 md:px-8 max-w-7xl mx-auto overflow-hidden">
      
      {/* Background Decorative Ambient Glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-600/10 blur-[120px] pointer-events-none animate-glow-slow-1" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-violet-600/10 blur-[130px] pointer-events-none animate-glow-slow-2" />

      {/* Interactive Page Header */}
      <header className="flex flex-col md:flex-row items-center justify-between py-8 border-b border-slate-900 mb-8 gap-4 relative z-10">
        <div className="flex items-center gap-3.5">
          <div className="p-3 bg-gradient-to-tr from-indigo-500 to-violet-600 rounded-2xl shadow-xl shadow-indigo-500/20 border border-indigo-400/20">
            <Landmark className="text-white" size={28} />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl md:text-3xl font-extrabold font-display tracking-tight text-white m-0 leading-none">
                Кадастровый Реестр
              </h1>
              <Sparkles size={16} className="text-indigo-400 animate-pulse hidden sm:block" />
            </div>
            <span className="text-xs md:text-sm text-slate-400 font-medium tracking-wide mt-1.5">
              Елизарова 24 — Интерактивная Панель Управления
            </span>
          </div>
        </div>

        {/* Live Indicator */}
        <div className="flex items-center gap-2 bg-slate-950/45 px-4 py-2 rounded-2xl border border-slate-800/80 shadow-inner">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="text-xs text-slate-400 font-bold font-display uppercase tracking-wider">
            База актуальна
          </span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10">
        {error ? (
          <div className="flex flex-col items-center justify-center py-20 text-red-400 gap-4">
            <AlertCircle size={48} />
            <h2 className="text-xl font-bold font-display text-white">Ошибка загрузки данных</h2>
            <p className="text-slate-400 text-sm">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-2 px-4 py-2 bg-indigo-500 text-white rounded-xl font-semibold shadow-lg shadow-indigo-500/20 hover:bg-indigo-600 focus:outline-none transition-all duration-150"
            >
              Перезагрузить страницу
            </button>
          </div>
        ) : (
          <>
            {/* Stats Dashboard Grid */}
            <StatsGrid metrics={metrics} />

            {/* Filter Control Bar */}
            <ApartmentFilter
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedStatus={selectedStatus}
              setSelectedStatus={setSelectedStatus}
              selectedOwnerType={selectedOwnerType}
              setSelectedOwnerType={setSelectedOwnerType}
              sortBy={sortBy}
              setSortBy={setSortBy}
            />

            {/* Main Interactive Table */}
            <ApartmentTable apartments={processedApartments} isLoading={isLoading} />
          </>
        )}
      </main>
      
    </div>
  );
};


