import React from 'react';
import { UserCheck, Users, ShieldAlert, Percent } from 'lucide-react';
import { GlassCard } from '../../shared/ui/GlassCard';
import { getOwnersPlural } from '../../shared/lib/formatters';

interface OwnersAreaBreakdownProps {
  breakdown: {
    owners: number;
    totalArea: number;
    count: number;
  }[];
  totalArea: number;
}

export const OwnersAreaBreakdown: React.FC<OwnersAreaBreakdownProps> = ({ breakdown, totalArea }) => {
  return (
    <GlassCard className="border-slate-800/60 bg-slate-900/10 mb-6 py-4 px-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-2">
          <Percent size={16} className="text-indigo-400" />
          <h3 className="text-sm font-bold font-display text-white uppercase tracking-wider">
            Распределение площадей по числу собственников
          </h3>
        </div>
        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider font-display">
          Общая площадь всех помещений (с КБ): {totalArea.toLocaleString('ru-RU')} м²
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4">
        {breakdown.map((item) => {
          const isZero = item.owners === 0;
          const percentage = totalArea > 0 ? (item.totalArea / totalArea) * 100 : 0;
          
          return (
            <div 
              key={item.owners}
              className="bg-slate-950/40 border border-slate-800/50 rounded-xl p-3.5 hover:border-indigo-500/30 transition-all duration-200 group relative overflow-hidden"
            >
              {/* Subtle background progress bar indicator */}
              <div 
                className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-indigo-500 to-violet-500 opacity-60 transition-all duration-500"
                style={{ width: `${percentage}%` }}
              />

              <div className="flex items-center gap-1.5 text-slate-400 group-hover:text-indigo-300 transition-colors">
                {isZero ? (
                  <ShieldAlert size={14} className="text-slate-500" />
                ) : item.owners === 1 ? (
                  <UserCheck size={14} />
                ) : (
                  <Users size={14} />
                )}
                <span className="text-xs font-bold font-display tracking-wide">
                  {isZero ? 'Без владельцев' : getOwnersPlural(item.owners)}
                </span>
              </div>

              <div className="text-lg font-bold font-mono text-white mt-1.5 tracking-tight">
                {item.totalArea.toLocaleString('ru-RU')} <span className="text-xs text-slate-500 font-sans font-normal">м²</span>
              </div>

              <div className="flex justify-between items-center mt-1 text-[10px] font-medium text-slate-500">
                <span>{percentage.toFixed(1)}% площади</span>
                <span>{item.count} кв.</span>
              </div>
            </div>
          );
        })}
      </div>
    </GlassCard>
  );
};
