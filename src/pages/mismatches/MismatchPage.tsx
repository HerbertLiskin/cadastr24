import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertCircle, UserCheck, HelpCircle, Search, CheckCircle, Database } from 'lucide-react';
import { GlassCard } from '../../shared/ui/GlassCard';
import { useApartments } from '../../entities/apartment/model/useApartments';
import {
  elecFull,
  paperFull
} from '../../entities/apartment/model/votingConfig';

interface MismatchItem {
  apt: number;
  protoName: string;
  protoArea: number;
  dbName: string;
  dbShare: string;
  dbArea: string;
  reason: string;
  type: 'area' | 'fio' | 'missing_db';
}

export const MismatchPage: React.FC = () => {
  const navigate = useNavigate();
  const { apartments, isLoading, error } = useApartments();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<'all' | 'area' | 'fio' | 'missing_db'>('all');

  const mismatches: MismatchItem[] = [
    // 1. Area/Ownership mismatches
    {
      apt: 4,
      protoName: "Виктор Б.",
      protoArea: 13.7500,
      dbName: "Богданов Виктор Вячеславович (в базе: 14/34)",
      dbShare: "17/68",
      dbArea: "13.7500",
      reason: "В протоколе Виктору Б. приписана также чужая доля 13.75 м² (в базе она числится за неизвестным лицом). Богданов В.В. владеет только долей 14/34 (22.65 м²).",
      type: 'area'
    },
    {
      apt: 27,
      protoName: "Александра П.",
      protoArea: 19.0000,
      dbName: "Волкова Александра Юрьевна (в базе: 1/2)",
      dbShare: "1/2",
      dbArea: "19.0000",
      reason: "Обе доли по 19 м² записаны на Александру П., хотя вторая доля в базе числится за неизвестным лицом.",
      type: 'area'
    },
    {
      apt: 54,
      protoName: "Юлия П.",
      protoArea: 19.2000,
      dbName: "Петрова Юлия Геннадьевна (в базе: 1/4)",
      dbShare: "1/2",
      dbArea: "19.2000",
      reason: "В протоколе Юлии П. приписана доля 1/2 (19.20 м²), которая в базе числится за неизвестным лицом. Сама Юлия П. владеет только долей 1/4 (9.60 м²).",
      type: 'area'
    },
    {
      apt: 62,
      protoName: "Ольга Л.",
      protoArea: 28.9500,
      dbName: "Лосич Ольга Юрьевна (в базе: 1/2)",
      dbShare: "1/2",
      dbArea: "28.9500",
      reason: "Обе доли по 28.95 м² записаны на Ольгу Л., хотя вторая доля в базе числится за неизвестным лицом.",
      type: 'area'
    },

    // 2. FIO / Initial mismatches
    {
      apt: 20,
      protoName: "Русана Т.",
      protoArea: 55.6000,
      dbName: "Мильковская Русана Михайловна",
      dbShare: "1/1",
      dbArea: "55.6000",
      reason: "Несовпадение инициала фамилии: в протоколе «Т.», в базе «М.». Площадь совпадает полностью.",
      type: 'fio'
    },
    {
      apt: 27,
      protoName: "Александра П.",
      protoArea: 19.0000,
      dbName: "Волкова Александра Юрьевна",
      dbShare: "1/2",
      dbArea: "19.0000",
      reason: "Несовпадение фамилии: в протоколе инициал «П.», в базе «В.» (Волкова).",
      type: 'fio'
    },
    {
      apt: 74,
      protoName: "ВАРВАР А К.",
      protoArea: 19.5000,
      dbName: "Юдина Варвара Дмитриевна",
      dbShare: "1/3",
      dbArea: "19.5000",
      reason: "Несовпадение фамилии: в протоколе инициал «К.», в базе «Ю.» (Юдина).",
      type: 'fio'
    },

    // 3. Database Naming additions (Missing DB FIOs)
    {
      apt: 16,
      protoName: "Валерия М.",
      protoArea: 27.9500,
      dbName: "ФИО неизвестны",
      dbShare: "1/2",
      dbArea: "27.9500",
      reason: "Сведения внесены из протокола. В базе владелец числился неизвестным.",
      type: 'missing_db'
    },
    {
      apt: 16,
      protoName: "АННА Б.",
      protoArea: 27.9500,
      dbName: "ФИО неизвестны",
      dbShare: "1/2",
      dbArea: "27.9500",
      reason: "Сведения внесены из протокола. В базе владелец числился неизвестным.",
      type: 'missing_db'
    },
    {
      apt: 26,
      protoName: "АНДРЕЙ М.",
      protoArea: 58.3000,
      dbName: "ФИО неизвестны",
      dbShare: "1/1",
      dbArea: "58.3000",
      reason: "Сведения внесены из протокола. В базе владелец числился неизвестным.",
      type: 'missing_db'
    },
    {
      apt: 39,
      protoName: "Екатерина Ц.",
      protoArea: 37.5000,
      dbName: "ФИО неизвестны",
      dbShare: "1/1",
      dbArea: "37.5000",
      reason: "Сведения внесены из протокола. В базе владелец числился неизвестным.",
      type: 'missing_db'
    },
    {
      apt: 47,
      protoName: "Данил И.",
      protoArea: 57.8000,
      dbName: "ФИО неизвестны",
      dbShare: "1/1",
      dbArea: "57.8000",
      reason: "Сведения внесены из протокола. В базе владелец числился неизвестным.",
      type: 'missing_db'
    },
    {
      apt: 53,
      protoName: "Михаил З.",
      protoArea: 37.3000,
      dbName: "ФИО неизвестны",
      dbShare: "1/2",
      dbArea: "37.3000",
      reason: "Сведения внесены из протокола. В базе владелец числился неизвестным.",
      type: 'missing_db'
    },
    {
      apt: 53,
      protoName: "Денис Б.",
      protoArea: 37.3000,
      dbName: "ФИО неизвестны",
      dbShare: "1/2",
      dbArea: "37.3000",
      reason: "Сведения внесены из протокола. В базе владелец числился неизвестным.",
      type: 'missing_db'
    },
    {
      apt: 55,
      protoName: "Геннадий К.",
      protoArea: 57.7000,
      dbName: "ФИО неизвестны",
      dbShare: "1/1",
      dbArea: "57.7000",
      reason: "Сведения внесены из протокола. В базе владелец числился неизвестным.",
      type: 'missing_db'
    },
    {
      apt: 56,
      protoName: "Сергей Ф.",
      protoArea: 30.0000,
      dbName: "ФИО неизвестны",
      dbShare: "2/5",
      dbArea: "30.0000",
      reason: "Сведения внесены из протокола. В базе владелец числился неизвестным.",
      type: 'missing_db'
    },
    {
      apt: 56,
      protoName: "Никита Ф.",
      protoArea: 15.0000,
      dbName: "ФИО неизвестны",
      dbShare: "1/5",
      dbArea: "15.0000",
      reason: "Сведения внесены из протокола. В базе владелец числился неизвестным.",
      type: 'missing_db'
    },
    {
      apt: 72,
      protoName: "Мария А.",
      protoArea: 37.6000,
      dbName: "ФИО неизвестны",
      dbShare: "1/2",
      dbArea: "37.6000",
      reason: "Сведения внесены из протокола. В базе владелец числился неизвестным.",
      type: 'missing_db'
    },
    {
      apt: 72,
      protoName: "Александр А.",
      protoArea: 37.6000,
      dbName: "ФИО неизвестны",
      dbShare: "1/2",
      dbArea: "37.6000",
      reason: "Сведения внесены из протокола. В базе владелец числился неизвестным.",
      type: 'missing_db'
    },
    {
      apt: 73,
      protoName: "Александр С.",
      protoArea: 56.2000,
      dbName: "ФИО неизвестны",
      dbShare: "1/1",
      dbArea: "56.2000",
      reason: "Сведения внесены из протокола. В базе владелец числился неизвестным.",
      type: 'missing_db'
    },
    {
      apt: 77,
      protoName: "Антон В.",
      protoArea: 55.7000,
      dbName: "ФИО неизвестны",
      dbShare: "1/1",
      dbArea: "55.7000",
      reason: "Сведения внесены из протокола. В базе владелец числился неизвестным.",
      type: 'missing_db'
    }
  ];

  // Filter logic
  const filteredMismatches = useMemo(() => {
    return mismatches.filter(item => {
      const matchesSearch = 
        String(item.apt).includes(searchQuery) ||
        item.protoName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.dbName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.reason.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesType = selectedType === 'all' || item.type === selectedType;
      
      return matchesSearch && matchesType;
    });
  }, [searchQuery, selectedType]);

  const stats = useMemo(() => {
    return {
      total: mismatches.length,
      areaCount: mismatches.filter(m => m.type === 'area').length,
      fioCount: mismatches.filter(m => m.type === 'fio').length,
      missingCount: mismatches.filter(m => m.type === 'missing_db').length
    };
  }, []);

  const missingVoters = useMemo(() => {
    if (apartments.length === 0) return { elec: [], paper: [], totalCount: 0 };

    const protocolApts = new Set([
      4, 9, 10, 11, 13, 14, 16, 20, 26, 27, 36, 39, 47, 48, 49, 53, 54, 55, 56, 58, 60, 62, 65, 67, 72, 73, 74, 75, 76, 77, 78, 80
    ]);

    const elecNums = [...elecFull, 67, 80, 49];
    const paperNums = [...paperFull, 61];

    const elecMissing = elecNums
      .filter(n => !protocolApts.has(n))
      .map(n => {
        const apt = apartments[n - 1];
        const owners = apt?.rights?.map(r => r.fio || 'ФИО неизвестны').join(', ') || 'Нет данных';
        const area = parseFloat(apt?.area || '0');
        return { n, type: 'электронное' as const, area, owners };
      })
      .sort((a, b) => a.n - b.n);

    const paperMissing = paperNums
      .filter(n => !protocolApts.has(n))
      .map(n => {
        const apt = apartments[n - 1];
        const owners = apt?.rights?.map(r => r.fio || 'ФИО неизвестны').join(', ') || 'Нет данных';
        const area = parseFloat(apt?.area || '0');
        let shareText = '';
        if (n === 61) shareText = ' (доля 1/2)';
        return { n, type: 'бумажное' as const, area, owners, shareText };
      })
      .sort((a, b) => a.n - b.n);

    return {
      elec: elecMissing,
      paper: paperMissing,
      totalCount: elecMissing.length + paperMissing.length
    };
  }, [apartments]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <div className="w-12 h-12 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin" />
        <span className="text-slate-400 font-medium font-display animate-pulse">Загрузка данных реестра...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-red-400 gap-4">
        <AlertCircle size={48} />
        <h2 className="text-xl font-bold font-display text-white">Ошибка загрузки данных</h2>
        <p className="text-slate-400 text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen pb-16 px-4 md:px-8 max-w-7xl mx-auto overflow-hidden">
      {/* Background Decorative Ambient Glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-rose-600/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-indigo-600/5 blur-[130px] pointer-events-none" />

      {/* Header */}
      <header className="flex flex-col md:flex-row items-center justify-between py-8 border-b border-slate-900 mb-8 gap-4 relative z-10">
        <div className="flex items-center gap-3.5">
          <Link
            to="/"
            className="p-3 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white rounded-2xl shadow-lg transition-all duration-150"
          >
            <ArrowLeft size={20} />
          </Link>
          <div className="flex flex-col">
            <h1 className="text-2xl md:text-3xl font-extrabold font-display tracking-tight text-white m-0 leading-none">
              Анализ расхождений протокола
            </h1>
            <span className="text-xs md:text-sm text-slate-400 font-medium tracking-wide mt-1.5">
              Сопоставление данных официального протокола с актуальным кадастром
            </span>
          </div>
        </div>

        {/* Database Badge */}
        <div className="flex items-center gap-2 bg-rose-950/20 px-4 py-2 rounded-2xl border border-rose-800/30 shadow-inner text-rose-400">
          <Database size={15} />
          <span className="text-xs font-bold font-display uppercase tracking-wider">
            Найдено {stats.total} расхождений
          </span>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 relative z-10">
        <GlassCard className="border-rose-500/10 bg-rose-950/5 p-5">
          <div className="flex justify-between items-start">
            <span className="text-xs text-rose-400 font-bold uppercase tracking-wider">Ошибки площадей</span>
            <AlertCircle size={18} className="text-rose-400" />
          </div>
          <div className="mt-4">
            <span className="text-3xl font-bold font-mono text-white">{stats.areaCount}</span>
            <span className="text-xs text-slate-400 block mt-1">Несоответствие долевых площадей в м²</span>
          </div>
        </GlassCard>

        <GlassCard className="border-amber-500/10 bg-amber-950/5 p-5">
          <div className="flex justify-between items-start">
            <span className="text-xs text-amber-400 font-bold uppercase tracking-wider">Несоответствия ФИО</span>
            <HelpCircle size={18} className="text-amber-400" />
          </div>
          <div className="mt-4">
            <span className="text-3xl font-bold font-mono text-white">{stats.fioCount}</span>
            <span className="text-xs text-slate-400 block mt-1">Различия в написании фамилий/инициалов</span>
          </div>
        </GlassCard>

        <GlassCard className="border-indigo-500/10 bg-indigo-950/5 p-5">
          <div className="flex justify-between items-start">
            <span className="text-xs text-indigo-400 font-bold uppercase tracking-wider">Раскрытие собственников</span>
            <UserCheck size={18} className="text-indigo-400" />
          </div>
          <div className="mt-4">
            <span className="text-3xl font-bold font-mono text-white">{stats.missingCount}</span>
            <span className="text-xs text-slate-400 block mt-1">Заполнение отсутствующих ФИО в базе</span>
          </div>
        </GlassCard>
      </div>

      {/* Voted but not in Protocol section */}
      {missingVoters.totalCount > 0 && (
        <GlassCard className="border-rose-500/20 bg-rose-950/5 mb-8 glow-indigo relative overflow-hidden z-10">
          <div className="absolute top-0 right-0 w-80 h-80 bg-rose-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="flex items-center gap-3 border-b border-slate-900 pb-4 mb-4">
            <div className="p-2 bg-rose-500/10 border border-rose-500/25 text-rose-400 rounded-xl">
              <AlertCircle size={22} className="animate-pulse" />
            </div>
            <div className="flex flex-col">
              <h2 className="text-lg font-bold font-display text-white">
                Голоса, не вошедшие в официальный протокол ({missingVoters.totalCount})
              </h2>
              <span className="text-xs text-slate-400 mt-0.5">
                Квартиры, отмеченные в системе как проголосовавшие (бумажные/электронные), но отсутствующие в протоколе.
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Electronic Voters Column */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between border-b border-slate-900/60 pb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 font-display">
                  Электронное голосование ({missingVoters.elec.length})
                </span>
              </div>
              {missingVoters.elec.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {missingVoters.elec.map(item => (
                    <div
                      key={item.n}
                      onClick={() => navigate(`/apartment/${item.n}`)}
                      className="flex items-center justify-between p-3 bg-slate-900/40 hover:bg-slate-900/80 border border-slate-800 hover:border-indigo-500/30 rounded-xl cursor-pointer transition-all duration-150 group"
                    >
                      <div className="flex flex-col min-w-0 pr-2">
                        <span className="text-xs font-mono font-bold text-white group-hover:text-indigo-400 transition-colors">
                          Кв. {item.n}
                        </span>
                        <span className="text-[10px] text-slate-500 mt-0.5 truncate" title={item.owners}>
                          {item.owners}
                        </span>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-xs font-mono font-bold text-slate-300">
                          {item.area.toFixed(2)} м²
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <span className="text-xs text-slate-500 italic">Все электронные голоса учтены в протоколе</span>
              )}
            </div>

            {/* Paper Voters Column */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between border-b border-slate-900/60 pb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-violet-400 font-display">
                  Бумажные бюллетени ({missingVoters.paper.length})
                </span>
              </div>
              {missingVoters.paper.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {missingVoters.paper.map(item => (
                    <div
                      key={item.n}
                      onClick={() => navigate(`/apartment/${item.n}`)}
                      className="flex items-center justify-between p-3 bg-slate-900/40 hover:bg-slate-900/80 border border-slate-800 hover:border-violet-500/30 rounded-xl cursor-pointer transition-all duration-150 group"
                    >
                      <div className="flex flex-col min-w-0 pr-2">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <span className="text-xs font-mono font-bold text-white group-hover:text-violet-400 transition-colors">
                            Кв. {item.n}
                          </span>
                          {item.shareText && (
                            <span className="text-[9px] text-slate-500 font-medium shrink-0">
                              {item.shareText}
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-500 mt-0.5 truncate" title={item.owners}>
                          {item.owners}
                        </span>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-xs font-mono font-bold text-slate-300">
                          {item.area.toFixed(2)} м²
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <span className="text-xs text-slate-500 italic">Все бумажные голоса учтены в протоколе</span>
              )}
            </div>
          </div>
        </GlassCard>
      )}

      {/* Search & Filter bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 relative z-10">
        <div className="flex-1 relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Поиск по квартире, имени или описанию..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-slate-950/50 border border-slate-900 focus:border-indigo-500/30 rounded-2xl text-slate-200 placeholder-slate-500 focus:outline-none transition-all duration-200"
          />
        </div>
        <div className="flex gap-2">
          {(['all', 'area', 'fio', 'missing_db'] as const).map(type => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-4 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider border transition-all duration-150 cursor-pointer ${
                selectedType === type
                  ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-300'
                  : 'bg-slate-950/40 border-slate-900 text-slate-400 hover:text-slate-200'
              }`}
            >
              {type === 'all' && 'Все'}
              {type === 'area' && 'Площади'}
              {type === 'fio' && 'ФИО'}
              {type === 'missing_db' && 'Дополнения базы'}
            </button>
          ))}
        </div>
      </div>

      {/* Main Table */}
      <GlassCard className="border-slate-900 bg-slate-950/20 p-0 overflow-hidden relative z-10">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-900 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                <th className="py-4 px-6 text-center w-24">Кв.</th>
                <th className="py-4 px-6">ФИО в протоколе</th>
                <th className="py-4 px-6 text-right w-32">Площадь (м²)</th>
                <th className="py-4 px-6">Данные в базе</th>
                <th className="py-4 px-6">Тип расхождения / Комментарий</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-900/60 font-sans text-sm">
              {filteredMismatches.length > 0 ? (
                filteredMismatches.map((item, idx) => (
                  <tr
                    key={idx}
                    onClick={() => navigate(`/apartment/${item.apt}`)}
                    className="hover:bg-slate-900/20 transition-colors duration-100 cursor-pointer group"
                  >
                    {/* Apartment number */}
                    <td className="py-4 px-6 text-center font-mono font-bold text-white">
                      <span className="px-2.5 py-1 bg-slate-900 border border-slate-800 rounded-lg group-hover:border-indigo-500/20 group-hover:text-indigo-300 transition-colors">
                        {item.apt}
                      </span>
                    </td>
                    
                    {/* Protocol Owner Name */}
                    <td className="py-4 px-6 font-semibold text-slate-200">
                      {item.protoName}
                    </td>
                    
                    {/* Protocol Area */}
                    <td className="py-4 px-6 text-right font-mono font-bold text-slate-300">
                      {item.protoArea.toFixed(4)}
                    </td>
                    
                    {/* Database records */}
                    <td className="py-4 px-6 text-slate-400">
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-300">{item.dbName}</span>
                        {item.dbShare && <span className="text-[10px] text-slate-500 font-mono mt-0.5">Доля: {item.dbShare}</span>}
                      </div>
                    </td>
                    
                    {/* Discrepancy details */}
                    <td className="py-4 px-6 text-xs leading-relaxed text-slate-400">
                      <div className="flex items-start gap-2">
                        {item.type === 'area' && (
                          <span className="px-2 py-0.5 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded font-semibold text-[9px] uppercase tracking-wider shrink-0 mt-0.5">
                            Площадь
                          </span>
                        )}
                        {item.type === 'fio' && (
                          <span className="px-2 py-0.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded font-semibold text-[9px] uppercase tracking-wider shrink-0 mt-0.5">
                            ФИО
                          </span>
                        )}
                        {item.type === 'missing_db' && (
                          <span className="px-2 py-0.5 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded font-semibold text-[9px] uppercase tracking-wider shrink-0 mt-0.5">
                            Дополнение
                          </span>
                        )}
                        <span>{item.reason}</span>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-12 px-6 text-center text-slate-500">
                    <div className="flex flex-col items-center gap-2">
                      <CheckCircle size={28} className="text-slate-600" />
                      <span>Ничего не найдено по вашему запросу</span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
};
