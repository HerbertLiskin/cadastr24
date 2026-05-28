import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Store, User, Users, AlertCircle, ShoppingBag } from 'lucide-react';
import type { ApartmentElement } from '../../entities/apartment/model/types';
import { Badge } from '../../shared/ui/Badge';
import { GlassCard } from '../../shared/ui/GlassCard';

interface ApartmentTableProps {
  apartments: ApartmentElement[];
  isLoading: boolean;
}

export const ApartmentTable: React.FC<ApartmentTableProps> = ({ apartments, isLoading }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const itemsPerPage = 15;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="relative flex items-center justify-center">
          <div className="w-12 h-12 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin" />
          <div className="absolute w-6 h-6 rounded-full border-4 border-violet-500/20 border-b-violet-500 animate-spin animate-glow-slow-1" />
        </div>
        <span className="text-slate-400 font-medium font-display animate-pulse">Загрузка кадастрового реестра...</span>
      </div>
    );
  }

  if (apartments.length === 0) {
    return (
      <GlassCard className="py-16 text-center border-slate-800/80 bg-slate-900/10">
        <AlertCircle size={48} className="text-slate-500 mx-auto mb-4" />
        <h3 className="text-lg font-bold font-display text-[#F1F5F9] mb-1">Ничего не найдено</h3>
        <p className="text-sm text-slate-400">Попробуйте изменить параметры поиска или фильтрации.</p>
      </GlassCard>
    );
  }

  // Calculate pagination
  const totalPages = Math.ceil(apartments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedItems = apartments.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      
      {/* Table Container with Glassmorphism */}
      <div className="glass-panel rounded-2xl border-slate-800/60 overflow-hidden shadow-2xl bg-slate-950/20">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800/80 bg-slate-900/40 text-slate-400 text-xs font-semibold uppercase tracking-wider font-display">
                <th className="py-4 px-6 text-center w-20">№</th>
                <th className="py-4 px-6">Объект / Адрес</th>
                <th className="py-4 px-6 w-56">Кадастровый номер</th>
                <th className="py-4 px-6 w-44">Собственники</th>
                <th className="py-4 px-6 w-36 text-right">Площадь</th>
                <th className="py-4 px-6 w-28 text-center">Этаж</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {paginatedItems.map((item) => {
                // If it is Flat 41 (KB Store)
                const isFlat41 = item.id === undefined || item.id === null || Object.keys(item).length === 0 || item.id?.includes('flat_41') || (item as any).flatNumber === 41;

                if (isFlat41) {
                  return (
                    <tr
                      key="flat-41"
                      className="bg-red-500/5 hover:bg-red-500/10 transition-colors duration-200 border-l-4 border-red-500/50 cursor-pointer"
                      onClick={() => navigate('/apartment/41')}
                    >
                      <td className="py-5 px-6 text-center font-bold text-red-400 font-display">
                        41
                      </td>
                      <td className="py-5 px-6">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-red-500/15 rounded-lg border border-red-500/20 text-red-400 shadow-sm animate-pulse">
                            <Store size={18} />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-semibold text-red-200 tracking-wide font-display">
                              Магазин «Красное & Белое»
                            </span>
                            <span className="text-xs text-red-400/80 mt-0.5">
                              Санкт-Петербург, пр-кт. Елизарова, д. 24, литера А (Нежилое коммерческое помещение)
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-5 px-6">
                        <span className="text-xs font-mono text-red-400/60 italic tracking-wider">
                          Выведено из жил. фонда
                        </span>
                      </td>
                      <td className="py-5 px-6">
                        <Badge variant="crimson" className="gap-1 animate-pulse">
                          <ShoppingBag size={12} />
                          Коммерция
                        </Badge>
                      </td>
                      <td className="py-5 px-6 text-right font-semibold font-mono text-red-400">
                        —
                      </td>
                      <td className="py-5 px-6 text-center text-red-400 font-medium font-display">
                        1 этаж
                      </td>
                    </tr>
                  );
                }

                // Regular Apartments
                const ownersCount = item.rights?.length || 0;
                const areaVal = parseFloat(item.area || '0');
                const readableAddr = item.address?.readableAddress || 'Адрес не указан';
                const cadNum = item.cadNumber || '—';
                const floor = item.levelFloor || '—';
                const flatNum = item.address?.apartment || (item as any).flatNumber || '—';

                return (
                  <tr
                    key={item.id || flatNum}
                    className="hover:bg-slate-900/30 transition-colors duration-150 text-slate-300 group cursor-pointer"
                    onClick={() => navigate(`/apartment/${flatNum}`)}
                  >
                    <td className="py-4.5 px-6 text-center font-bold text-slate-400 group-hover:text-indigo-400 transition-colors font-display">
                      {flatNum}
                    </td>
                    <td className="py-4.5 px-6">
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-[#F1F5F9] group-hover:text-white transition-colors">
                          {readableAddr.split(', кв. ')[0]}
                        </span>
                        <span className="text-xs text-slate-500 mt-0.5 group-hover:text-slate-400 transition-colors">
                          {readableAddr}
                        </span>
                      </div>
                    </td>
                    <td className="py-4.5 px-6 font-mono text-xs text-slate-400 group-hover:text-slate-300 transition-colors tracking-wide">
                      {cadNum}
                    </td>
                    <td className="py-4.5 px-6">
                      {ownersCount > 0 ? (
                        <Badge variant={ownersCount > 2 ? 'violet' : 'indigo'} className="gap-1">
                          {ownersCount === 1 ? <User size={12} /> : <Users size={12} />}
                          {ownersCount} {ownersCount === 1 ? 'собственник' : ownersCount < 5 ? 'собственника' : 'собственников'}
                        </Badge>
                      ) : (
                        <Badge variant="slate" className="italic opacity-60">
                          Нет данных
                        </Badge>
                      )}
                    </td>
                    <td className="py-4.5 px-6 text-right font-semibold font-mono text-[#F1F5F9] group-hover:text-emerald-400 transition-colors">
                      {areaVal.toFixed(2)} <span className="text-xs text-slate-500 font-sans font-normal">м²</span>
                    </td>
                    <td className="py-4.5 px-6 text-center text-slate-400 group-hover:text-slate-300 transition-colors font-medium font-display">
                      {floor} <span className="text-[10px] text-slate-600 font-normal">эт.</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-2">
          <span className="text-xs text-slate-500 font-medium">
            Показано с <span className="text-slate-400 font-bold">{startIndex + 1}</span> по{' '}
            <span className="text-slate-400 font-bold">
              {Math.min(startIndex + itemsPerPage, apartments.length)}
            </span>{' '}
            из <span className="text-slate-400 font-bold">{apartments.length}</span> помещений
          </span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1.5 text-xs font-semibold bg-slate-900/60 border border-slate-800 text-slate-400 rounded-lg hover:bg-slate-950 focus:outline-none disabled:opacity-40 disabled:hover:bg-slate-900/60 transition-all duration-150"
            >
              Назад
            </button>
            
            {Array.from({ length: totalPages }).map((_, i) => {
              const p = i + 1;
              const isSelected = p === currentPage;
              return (
                <button
                  key={p}
                  onClick={() => handlePageChange(p)}
                  className={`w-8 h-8 flex items-center justify-center text-xs font-bold rounded-lg transition-all duration-150 focus:outline-none ${
                    isSelected
                      ? 'bg-gradient-to-r from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-500/20 border border-indigo-500/30'
                      : 'bg-slate-900/60 border border-slate-800 text-slate-400 hover:bg-slate-950'
                  }`}
                >
                  {p}
                </button>
              );
            })}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 text-xs font-semibold bg-slate-900/60 border border-slate-800 text-slate-400 rounded-lg hover:bg-slate-950 focus:outline-none disabled:opacity-40 disabled:hover:bg-slate-900/60 transition-all duration-150"
            >
              Вперёд
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
