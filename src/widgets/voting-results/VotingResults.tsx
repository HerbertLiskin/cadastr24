import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Vote, FileSpreadsheet, Keyboard, Landmark, CheckCircle, AlertTriangle, Users } from 'lucide-react';
import { GlassCard } from '../../shared/ui/GlassCard';
import type { ApartmentElement } from '../../entities/apartment/model/types';

interface VotingResultsProps {
  apartments: ApartmentElement[];
  totalArea: number;
}

export const VotingResults: React.FC<VotingResultsProps> = ({ apartments, totalArea }) => {
  const navigate = useNavigate();

  // Defined voting lists
  const elecFull = [20, 16, 4, 39, 27, 24, 21, 60, 55, 53, 48, 47, 78, 77, 76, 74, 73, 65, 62];
  const paperFull = [22, 42, 68];
  const cityFull = [1, 5, 52];

  const nonVotingNums = useMemo(() => {
    const allVotedNums = new Set([
      ...elecFull,
      ...paperFull,
      ...cityFull,
      67, 80, 49,
      17, 2, 43, 61
    ]);

    const nonVoting: number[] = [];
    for (let i = 1; i <= 80; i++) {
      if (i === 41) continue; // Skip KB Store
      if (!allVotedNums.has(i)) {
        nonVoting.push(i);
      }
    }
    return nonVoting;
  }, [apartments]);

  const votingStats = useMemo(() => {
    if (apartments.length === 0) {
      return {
        elec: 0,
        paper: 0,
        city: 0,
        total: 0,
        elecPercent: 0,
        paperPercent: 0,
        cityPercent: 0,
        totalPercent: 0,
      };
    }

    // 1. Electronic Vote Sum
    let elecSum = 0;
    elecFull.forEach(n => {
      const apt = apartments[n - 1];
      if (apt) elecSum += parseFloat(apt.area || '0');
    });
    // Custom shares
    if (apartments[67 - 1]) elecSum += parseFloat(apartments[67 - 1].area || '0') * 0.5;
    elecSum += 22.00; // Flat 80 share is 22m
    if (apartments[49 - 1]) elecSum += parseFloat(apartments[49 - 1].area || '0') * (1/3);

    // 2. Paper Vote Sum
    let paperSum = 0;
    paperFull.forEach(n => {
      const apt = apartments[n - 1];
      if (apt) paperSum += parseFloat(apt.area || '0');
    });
    // Custom shares
    if (apartments[17 - 1]) paperSum += parseFloat(apartments[17 - 1].area || '0') * (15 / 49);
    if (apartments[2 - 1]) paperSum += parseFloat(apartments[2 - 1].area || '0') * (3 / 8);
    if (apartments[43 - 1]) paperSum += parseFloat(apartments[43 - 1].area || '0') * (15 / 35);
    if (apartments[61 - 1]) paperSum += parseFloat(apartments[61 - 1].area || '0') * (1/3);

    // 3. City Ownership Sum
    let citySum = 0;
    cityFull.forEach(n => {
      const apt = apartments[n - 1];
      if (apt) citySum += parseFloat(apt.area || '0');
    });

    const totalSum = elecSum + paperSum;

    return {
      elec: parseFloat(elecSum.toFixed(2)),
      paper: parseFloat(paperSum.toFixed(2)),
      city: parseFloat(citySum.toFixed(2)),
      total: parseFloat(totalSum.toFixed(2)),
      elecPercent: totalArea > 0 ? parseFloat(((elecSum / totalArea) * 100).toFixed(2)) : 0,
      paperPercent: totalArea > 0 ? parseFloat(((paperSum / totalArea) * 100).toFixed(2)) : 0,
      cityPercent: totalArea > 0 ? parseFloat(((citySum / totalArea) * 100).toFixed(2)) : 0,
      totalPercent: totalArea > 0 ? parseFloat(((totalSum / totalArea) * 100).toFixed(2)) : 0,
    };
  }, [apartments, totalArea]);

  const hasQuorum = votingStats.totalPercent >= 50.0;

  return (
    <GlassCard className="border-indigo-500/20 bg-indigo-950/5 mb-8 glow-indigo relative overflow-hidden">
      
      {/* Glow decorative banner */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-5 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-500/10 border border-indigo-500/25 text-indigo-400 rounded-xl">
            <Vote size={22} />
          </div>
          <div className="flex flex-col">
            <h2 className="text-lg font-bold font-display text-white">Результаты Голосования Собственников</h2>
            <span className="text-xs text-slate-400 mt-0.5">Суммарный подсчет площадей проголосовавших по реестру</span>
          </div>
        </div>

        {/* Quorum Indicator */}
        <div className="flex items-center gap-2.5 bg-slate-950/40 border border-slate-800/50 rounded-2xl py-2 px-4 shadow-inner">
          {hasQuorum ? (
            <div className="flex items-center gap-2 text-emerald-400">
              <CheckCircle size={16} />
              <span className="text-xs font-bold font-display uppercase tracking-wider">Кворум достигнут ({votingStats.totalPercent}%)</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-amber-400">
              <AlertTriangle size={16} className="animate-pulse" />
              <span className="text-xs font-bold font-display uppercase tracking-wider">Кворум не набран ({votingStats.totalPercent}%)</span>
            </div>
          )}
        </div>
      </div>

      {/* Statistics breakdown cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        
        {/* Electronic voting */}
        <div className="bg-slate-950/30 border border-slate-800/60 rounded-2xl p-4 flex flex-col justify-between group hover:border-indigo-500/20 transition-all duration-200">
          <div className="flex justify-between items-start">
            <span className="text-xs text-slate-500 font-bold font-display uppercase tracking-wider">В электронном виде</span>
            <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg"><Keyboard size={16} /></div>
          </div>
          <div className="mt-4">
            <span className="text-2xl font-bold font-mono text-white block">
              {votingStats.elec.toLocaleString('ru-RU')} <span className="text-xs font-sans text-slate-500 font-normal">м²</span>
            </span>
            <div className="flex items-center justify-between mt-1 text-xs">
              <span className="text-indigo-400 font-semibold">{votingStats.elecPercent}% от дома</span>
              <span className="text-slate-500">{elecFull.length + 3} кв.</span>
            </div>
          </div>
        </div>

        {/* Paper ballots */}
        <div className="bg-slate-950/30 border border-slate-800/60 rounded-2xl p-4 flex flex-col justify-between group hover:border-violet-500/20 transition-all duration-200">
          <div className="flex justify-between items-start">
            <span className="text-xs text-slate-500 font-bold font-display uppercase tracking-wider">В бумажном виде</span>
            <div className="p-2 bg-violet-500/10 text-violet-400 rounded-lg"><FileSpreadsheet size={16} /></div>
          </div>
          <div className="mt-4">
            <span className="text-2xl font-bold font-mono text-white block">
              {votingStats.paper.toLocaleString('ru-RU')} <span className="text-xs font-sans text-slate-500 font-normal">м²</span>
            </span>
            <div className="flex items-center justify-between mt-1 text-xs">
              <span className="text-violet-400 font-semibold">{votingStats.paperPercent}% от дома</span>
              <span className="text-slate-500">{paperFull.length + 4} кв.</span>
            </div>
          </div>
        </div>

        {/* City ownership */}
        <div className="bg-slate-950/30 border border-slate-800/60 rounded-2xl p-4 flex flex-col justify-between group hover:border-amber-500/20 transition-all duration-200">
          <div className="flex justify-between items-start">
            <span className="text-xs text-slate-500 font-bold font-display uppercase tracking-wider">Собственность города</span>
            <div className="p-2 bg-amber-500/10 text-amber-400 rounded-lg"><Landmark size={16} /></div>
          </div>
          <div className="mt-4">
            <span className="text-2xl font-bold font-mono text-white block">
              {votingStats.city.toLocaleString('ru-RU')} <span className="text-xs font-sans text-slate-500 font-normal">м²</span>
            </span>
            <div className="flex items-center justify-between mt-1 text-xs">
              <span className="text-amber-400 font-semibold">{votingStats.cityPercent}% от дома</span>
              <span className="text-slate-500">{cityFull.length} кв.</span>
            </div>
          </div>
        </div>

        {/* Total Active (Quorum) */}
        <div className="bg-gradient-to-tr from-indigo-950/40 to-violet-950/40 border border-indigo-500/20 rounded-2xl p-4 flex flex-col justify-between group shadow-lg">
          <div className="flex justify-between items-start">
            <span className="text-xs text-indigo-300 font-bold font-display uppercase tracking-wider">Итого (Эл. + Бум.)</span>
            <div className="p-2 bg-gradient-to-r from-indigo-500 to-violet-500 text-white rounded-lg"><Users size={16} /></div>
          </div>
          <div className="mt-4">
            <span className="text-2xl font-bold font-mono text-indigo-200 block">
              {votingStats.total.toLocaleString('ru-RU')} <span className="text-xs font-sans text-slate-500 font-normal">м²</span>
            </span>
            <div className="flex items-center justify-between mt-1 text-xs">
              <span className="text-indigo-300 font-bold">{votingStats.totalPercent}% от дома</span>
              <span className="text-slate-400 font-semibold">{elecFull.length + paperFull.length + 8} кв.</span>
            </div>
          </div>
        </div>

      </div>

      {/* Interactive Voter Lists */}
      <div className="border-t border-slate-800/80 pt-6">
        <h3 className="text-xs font-bold font-display text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-1.5">
          <span>Списки проголосовавших квартир (клик для перехода на карточку)</span>
        </h3>

        <div className="flex flex-col gap-4.5">
          
          {/* Electronic Voters List */}
          <div className="flex flex-col sm:flex-row sm:items-start gap-2.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 font-display w-36 shrink-0 mt-1">
              Электронно ({elecFull.length + 3} кв.):
            </span>
            <div className="flex flex-wrap gap-1.5">
              {elecFull.map(n => (
                <button
                  key={n}
                  onClick={() => navigate(`/apartment/${n}`)}
                  className="px-2.5 py-0.5 text-xs bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/20 rounded-md cursor-pointer transition-all hover:scale-[1.05] focus:outline-none"
                >
                  Кв. {n}
                </button>
              ))}
              <button onClick={() => navigate('/apartment/67')} className="px-2.5 py-0.5 text-xs bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/20 rounded-md cursor-pointer transition-all hover:scale-[1.05] focus:outline-none">
                Кв. 67 <span className="text-[10px] opacity-70">(1/2)</span>
              </button>
              <button onClick={() => navigate('/apartment/80')} className="px-2.5 py-0.5 text-xs bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/20 rounded-md cursor-pointer transition-all hover:scale-[1.05] focus:outline-none">
                Кв. 80 <span className="text-[10px] opacity-70">(22м)</span>
              </button>
              <button onClick={() => navigate('/apartment/49')} className="px-2.5 py-0.5 text-xs bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/20 rounded-md cursor-pointer transition-all hover:scale-[1.05] focus:outline-none">
                Кв. 49 <span className="text-[10px] opacity-70">(1/3)</span>
              </button>
            </div>
          </div>

          {/* Paper Voters List */}
          <div className="flex flex-col sm:flex-row sm:items-start gap-2.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-violet-400 font-display w-36 shrink-0 mt-1">
              Бумажные бл. ({paperFull.length + 4} кв.):
            </span>
            <div className="flex flex-wrap gap-1.5">
              <button onClick={() => navigate('/apartment/17')} className="px-2.5 py-0.5 text-xs bg-violet-500/10 hover:bg-violet-500/20 text-violet-300 border border-violet-500/20 rounded-md cursor-pointer transition-all hover:scale-[1.05] focus:outline-none">
                Кв. 17 <span className="text-[10px] opacity-70">(15/49)</span>
              </button>
              <button onClick={() => navigate('/apartment/2')} className="px-2.5 py-0.5 text-xs bg-violet-500/10 hover:bg-violet-500/20 text-violet-300 border border-violet-500/20 rounded-md cursor-pointer transition-all hover:scale-[1.05] focus:outline-none">
                Кв. 2 <span className="text-[10px] opacity-70">(3/8)</span>
              </button>
              {paperFull.map(n => (
                <button
                  key={n}
                  onClick={() => navigate(`/apartment/${n}`)}
                  className="px-2.5 py-0.5 text-xs bg-violet-500/10 hover:bg-violet-500/20 text-violet-300 border border-violet-500/20 rounded-md cursor-pointer transition-all hover:scale-[1.05] focus:outline-none"
                >
                  Кв. {n}
                </button>
              ))}
              <button onClick={() => navigate('/apartment/43')} className="px-2.5 py-0.5 text-xs bg-violet-500/10 hover:bg-violet-500/20 text-violet-300 border border-violet-500/20 rounded-md cursor-pointer transition-all hover:scale-[1.05] focus:outline-none">
                Кв. 43 <span className="text-[10px] opacity-70">(15/35)</span>
              </button>
              <button onClick={() => navigate('/apartment/61')} className="px-2.5 py-0.5 text-xs bg-violet-500/10 hover:bg-violet-500/20 text-violet-300 border border-violet-500/20 rounded-md cursor-pointer transition-all hover:scale-[1.05] focus:outline-none">
                Кв. 61 <span className="text-[10px] opacity-70">(1/3)</span>
              </button>
            </div>
          </div>

          {/* City Ownership List */}
          <div className="flex flex-col sm:flex-row sm:items-start gap-2.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 font-display w-36 shrink-0 mt-1">
              Муниц. (город) ({cityFull.length} кв.):
            </span>
            <div className="flex flex-wrap gap-1.5">
              {cityFull.map(n => (
                <button
                  key={n}
                  onClick={() => navigate(`/apartment/${n}`)}
                  className="px-2.5 py-0.5 text-xs bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/20 rounded-md cursor-pointer transition-all hover:scale-[1.05] focus:outline-none"
                >
                  Кв. {n}
                </button>
              ))}
            </div>
          </div>

          {/* Non-Voting List */}
          <div className="flex flex-col sm:flex-row sm:items-start gap-2.5 border-t border-slate-800/40 pt-4.5 mt-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-red-400 font-display w-36 shrink-0 mt-1">
              Не голосовали ({nonVotingNums.length} кв.):
            </span>
            <div className="flex flex-wrap gap-1.5">
              {nonVotingNums.map(n => (
                <button
                  key={n}
                  onClick={() => navigate(`/apartment/${n}`)}
                  className="px-2.5 py-0.5 text-xs bg-red-500/10 hover:bg-red-500/20 text-red-300 border border-red-500/20 rounded-md cursor-pointer transition-all hover:scale-[1.05] focus:outline-none"
                >
                  Кв. {n}
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>

    </GlassCard>
  );
};
