import React from 'react';
import { Home, Grid, Users, Landmark } from 'lucide-react';
import { GlassCard } from '../../shared/ui/GlassCard';

interface StatsGridProps {
  metrics: {
    totalSlots: number;
    totalValid: number;
    totalArea: number;
    averageArea: number;
    totalOwners: number;
    totalCost: number;
    averageCost: number;
  };
}

export const StatsGrid: React.FC<StatsGridProps> = ({ metrics }) => {
  // Format currency helpers
  const formatCost = (val: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const statItems = [
    {
      title: 'Всего помещений',
      value: metrics.totalSlots,
      subtext: `${metrics.totalValid} жилых, 1 нежилое`,
      icon: <Home className="text-indigo-400" size={24} />,
      glow: 'indigo' as const,
    },
    {
      title: 'Общая площадь',
      value: `${metrics.totalArea.toLocaleString('ru-RU')} м²`,
      subtext: `Вкл. нежилое КБ (74.8 м²) | Средняя: ${metrics.averageArea} м²`,
      icon: <Grid className="text-violet-400" size={24} />,
      glow: 'violet' as const,
    },
    {
      title: 'Всего собственников',
      value: metrics.totalOwners,
      subtext: `На ${metrics.totalValid} квартир`,
      icon: <Users className="text-emerald-400" size={24} />,
      glow: 'none' as const,
    },
    {
      title: 'Кадастровая стоимость',
      value: formatCost(metrics.totalCost),
      subtext: `В среднем: ${formatCost(metrics.averageCost)} / кв.`,
      icon: <Landmark className="text-amber-400" size={24} />,
      glow: 'none' as const,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
      {statItems.map((item, index) => (
        <GlassCard
          key={index}
          glow={item.glow}
          hoverable
          className="border-slate-800/60 bg-slate-900/20 hover:border-slate-700/50"
        >
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-slate-400 tracking-wide font-display">
                {item.title}
              </span>
              <span className="text-3xl font-bold font-display text-white mt-2 tracking-tight">
                {item.value}
              </span>
              <span className="text-xs text-slate-500 mt-1 font-medium">
                {item.subtext}
              </span>
            </div>
            <div className="p-3 bg-slate-950/40 rounded-xl border border-slate-800/40 shadow-inner">
              {item.icon}
            </div>
          </div>
        </GlassCard>
      ))}
    </div>
  );
};
