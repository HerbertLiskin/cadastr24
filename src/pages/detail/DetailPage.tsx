import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Landmark, Info, Award, ShieldAlert, 
  Layers, Store, BadgePercent
} from 'lucide-react';
import { useApartments } from '../../entities/apartment/model/useApartments';
import { GlassCard } from '../../shared/ui/GlassCard';
import { Badge } from '../../shared/ui/Badge';
import { 
  formatDate, formatCurrency, getStatusText, 
  getPurposeText, getObjectTypeText 
} from '../../shared/lib/formatters';

export const DetailPage: React.FC = () => {
  const { flatNumber } = useParams<{ flatNumber: string }>();
  const navigate = useNavigate();
  const { apartments, isLoading, error } = useApartments();

  const flatIdx = parseInt(flatNumber || '0', 10);
  const isFlat41 = flatIdx === 41;

  // Find the matching apartment
  const apartment = apartments[flatIdx - 1];

  const handleBack = () => {
    navigate('/');
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <div className="w-12 h-12 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin" />
        <span className="text-slate-400 font-medium font-display animate-pulse">Загрузка карточки объекта...</span>
      </div>
    );
  }

  if (error || (!apartment && !isFlat41) || flatIdx < 1 || flatIdx > 80) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-red-400 gap-4">
        <ShieldAlert size={48} />
        <h2 className="text-xl font-bold font-display text-white">Объект не найден</h2>
        <p className="text-slate-400 text-sm">В базе данных отсутствует помещение № {flatNumber}.</p>
        <button
          onClick={handleBack}
          className="mt-4 flex items-center gap-2 px-4 py-2 bg-indigo-500 text-white rounded-xl font-semibold shadow-lg shadow-indigo-500/20 hover:bg-indigo-600 focus:outline-none transition-all"
        >
          <ArrowLeft size={16} /> Вернуться на главную
        </button>
      </div>
    );
  }

  // --- SPECIAL RENDER FOR FLAT 41 (KB STORE) ---
  if (isFlat41) {
    return (
      <div className="relative min-h-screen pb-16 px-4 md:px-8 max-w-7xl mx-auto overflow-hidden">
        {/* Special Red Ambient Glow */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-red-600/10 blur-[130px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-slate-800/20 blur-[120px] pointer-events-none" />

        {/* Header */}
        <header className="flex items-center gap-4 py-8 border-b border-slate-900 mb-8 relative z-10">
          <button
            onClick={handleBack}
            className="p-2.5 bg-slate-950/40 hover:bg-slate-900 border border-slate-800 rounded-xl text-slate-400 hover:text-white transition-all cursor-pointer focus:outline-none"
            title="Назад в реестр"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl md:text-3xl font-extrabold font-display text-white leading-none">
                Помещение № 41
              </h1>
              <Badge variant="crimson" className="animate-pulse">Магазин КБ</Badge>
            </div>
            <span className="text-xs md:text-sm text-slate-400 font-medium tracking-wide mt-1.5">
              Елизарова 24 — Коммерческий сектор
            </span>
          </div>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
          
          {/* Main Card - General Information & Branding */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <GlassCard className="border-red-500/20 bg-red-500/5 glow-violet">
              <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="p-3 bg-red-600 rounded-2xl shadow-xl shadow-red-500/20 text-white">
                    <Store size={32} />
                  </div>
                  <div className="flex flex-col">
                    <h2 className="text-xl font-bold font-display text-red-200">Магазин «Красное & Белое»</h2>
                    <span className="text-sm text-slate-400 mt-1">Сеть магазинов самообслуживания формата «у дома»</span>
                  </div>
                </div>
                <Badge variant="crimson" className="px-3 py-1 text-xs">Действующий арендатор</Badge>
              </div>

              <div className="border-t border-slate-800/80 my-6" />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8">
                <div>
                  <span className="text-xs text-slate-500 font-semibold font-display tracking-wider block uppercase">
                    Вид объекта
                  </span>
                  <span className="text-base text-slate-200 mt-1 font-semibold block">
                    Нежилое коммерческое помещение
                  </span>
                </div>
                <div>
                  <span className="text-xs text-slate-500 font-semibold font-display tracking-wider block uppercase">
                    Текущий статус
                  </span>
                  <span className="text-base text-red-400 mt-1 font-semibold flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-red-500 animate-ping" />
                    Коммерческое использование
                  </span>
                </div>
                <div>
                  <span className="text-xs text-slate-500 font-semibold font-display tracking-wider block uppercase">
                    Адрес (местоположение)
                  </span>
                  <span className="text-base text-slate-200 mt-1 block">
                    Санкт-Петербург, пр-кт Елизарова, д. 24, литера А, пом. 41
                  </span>
                </div>
                <div>
                  <span className="text-xs text-slate-500 font-semibold font-display tracking-wider block uppercase">
                    Этаж
                  </span>
                  <span className="text-base text-slate-200 mt-1 font-semibold block">
                    1 этаж (Отдельный уличный вход)
                  </span>
                </div>
              </div>
            </GlassCard>

            {/* Additional details */}
            <GlassCard className="border-slate-800/60 bg-slate-900/10">
              <div className="flex items-center gap-2 mb-4">
                <Info size={18} className="text-indigo-400" />
                <h3 className="text-lg font-bold font-display text-white">Дополнительные сведения</h3>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed mb-4">
                Данный объект кадастрового учета (помещение № 41) был успешно выведен из жилого фонда и переоборудован под размещение коммерческого торгового зала розничной сети «Красное & Белое». Объект оснащен отдельной входной группой с фасада здания, пандусом для МГН и выделенной зоной разгрузки.
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="slate">Вывод из жилого фонда</Badge>
                <Badge variant="slate">Торговая площадь</Badge>
                <Badge variant="slate">Красное & Белое</Badge>
                <Badge variant="slate">Пункт выдачи / Ритейл</Badge>
              </div>
            </GlassCard>
          </div>

          {/* Right column - Legal & Rights */}
          <div className="flex flex-col gap-6">
            <GlassCard className="border-slate-800/60 bg-slate-900/10">
              <div className="flex items-center gap-2 mb-4">
                <Award size={18} className="text-indigo-400" />
                <h3 className="text-lg font-bold font-display text-white">Права и Обременения</h3>
              </div>
              
              <div className="flex flex-col gap-4">
                <div className="bg-slate-950/40 border border-slate-800/50 rounded-xl p-4">
                  <span className="text-xs text-indigo-400 font-semibold font-display block uppercase">
                    Тип права
                  </span>
                  <span className="text-sm text-slate-200 font-semibold block mt-1">
                    Аренда (Долгосрочная)
                  </span>
                  <span className="text-xs text-slate-500 block mt-1">
                    Зарегистрировано в пользу ООО «Альфа-М» (сеть КБ)
                  </span>
                </div>
                
                <div className="bg-slate-950/40 border border-slate-800/50 rounded-xl p-4">
                  <span className="text-xs text-indigo-400 font-semibold font-display block uppercase">
                    Срок договора
                  </span>
                  <span className="text-sm text-slate-200 font-semibold block mt-1">
                    До 31.12.2032 г.
                  </span>
                  <span className="text-xs text-slate-500 block mt-1">
                    С правом пролонгации
                  </span>
                </div>
              </div>
            </GlassCard>
            
            <GlassCard className="border-red-950/20 bg-red-950/5">
              <div className="flex items-center gap-2 text-red-400 mb-2">
                <BadgePercent size={18} />
                <h4 className="text-sm font-bold font-display uppercase tracking-wider">Магазин КБ на Елизарова</h4>
              </div>
              <span className="text-xs text-red-300/80 leading-relaxed block">
                Отличная коммерческая инфраструктура первого этажа обеспечивает дополнительный трафик и удобство для жителей всего многоквартирного дома Елизарова 24.
              </span>
            </GlassCard>
          </div>

        </main>
      </div>
    );
  }

  // --- STANDARD RENDER FOR REGULAR APARTMENT ---
  const readableAddress = apartment.address?.readableAddress || '—';
  const owners = apartment.rights || [];
  const encumbrances = apartment.encumbrances || [];
  const oldNumbers = apartment.oldNumbers || [];

  return (
    <div className="relative min-h-screen pb-16 px-4 md:px-8 max-w-7xl mx-auto overflow-hidden">
      
      {/* Radial glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-600/10 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-violet-600/10 blur-[120px] pointer-events-none" />

      {/* Header */}
      <header className="flex items-center gap-4 py-8 border-b border-slate-900 mb-8 relative z-10">
        <button
          onClick={handleBack}
          className="p-2.5 bg-slate-950/40 hover:bg-slate-900 border border-slate-800 rounded-xl text-slate-400 hover:text-white transition-all cursor-pointer focus:outline-none"
          title="Назад в реестр"
        >
          <ArrowLeft size={18} />
        </button>
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl md:text-3xl font-extrabold font-display text-white leading-none">
              Квартира № {flatIdx}
            </h1>
            <Badge variant="indigo">Жилое помещение</Badge>
          </div>
          <span className="text-xs md:text-sm text-slate-400 font-medium tracking-wide mt-1.5">
            Елизарова 24 — Карточка Кадастрового Учета
          </span>
        </div>
      </header>

      {/* Main dashboard content */}
      <main className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
        
        {/* Left Columns - Detailed data */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {/* General & Characteristics */}
          <GlassCard className="border-slate-800/60 bg-slate-900/20">
            <div className="flex items-center gap-2.5 mb-6">
              <div className="p-2 bg-indigo-500/10 border border-indigo-500/25 text-indigo-400 rounded-lg">
                <Info size={18} />
              </div>
              <h2 className="text-lg font-bold font-display text-white">Общая информация и Характеристики</h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8">
              
              <div>
                <span className="text-xs text-slate-500 font-semibold font-display tracking-wider block uppercase">
                  Вид объекта недвижимости
                </span>
                <span className="text-base text-slate-200 mt-1 font-semibold block">
                  {getObjectTypeText(apartment.objType)}
                </span>
              </div>
              
              <div>
                <span className="text-xs text-slate-500 font-semibold font-display tracking-wider block uppercase">
                  Статус объекта
                </span>
                <span className="text-base text-emerald-400 mt-1 font-semibold flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 glow-text-emerald" />
                  {getStatusText(apartment.status)}
                </span>
              </div>

              <div>
                <span className="text-xs text-slate-500 font-semibold font-display tracking-wider block uppercase">
                  Кадастровый номер
                </span>
                <span className="text-base text-slate-200 mt-1 font-mono font-semibold block">
                  {apartment.cadNumber || '—'}
                </span>
              </div>

              <div>
                <span className="text-xs text-slate-500 font-semibold font-display tracking-wider block uppercase">
                  Дата государственной регистрации
                </span>
                <span className="text-base text-slate-200 mt-1 font-semibold block">
                  {formatDate(apartment.regDate)}
                </span>
              </div>

              <div className="sm:col-span-2 border-t border-slate-800/50 my-2" />

              <div>
                <span className="text-xs text-slate-500 font-semibold font-display tracking-wider block uppercase">
                  Адрес (местоположение)
                </span>
                <span className="text-base text-slate-200 mt-1 block">
                  {readableAddress}
                </span>
              </div>

              <div>
                <span className="text-xs text-slate-500 font-semibold font-display tracking-wider block uppercase">
                  Площадь объекта
                </span>
                <span className="text-base text-slate-200 mt-1 font-mono font-semibold block">
                  {parseFloat(apartment.area || '0').toFixed(2)} м²
                </span>
              </div>

              <div>
                <span className="text-xs text-slate-500 font-semibold font-display tracking-wider block uppercase">
                  Назначение
                </span>
                <span className="text-base text-slate-200 mt-1 font-semibold block">
                  {getPurposeText(apartment.purpose)}
                </span>
              </div>

              <div>
                <span className="text-xs text-slate-500 font-semibold font-display tracking-wider block uppercase">
                  Этажность расположения
                </span>
                <span className="text-base text-slate-200 mt-1 font-semibold block">
                  {apartment.levelFloor || '—'} этаж
                </span>
              </div>

            </div>
          </GlassCard>

          {/* Cadastral Cost Details */}
          <GlassCard className="border-slate-800/60 bg-slate-900/20">
            <div className="flex items-center gap-2.5 mb-6">
              <div className="p-2 bg-amber-500/10 border border-amber-500/25 text-amber-400 rounded-lg">
                <Landmark size={18} />
              </div>
              <h2 className="text-lg font-bold font-display text-white">Сведения о кадастровой стоимости</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div>
                <span className="text-xs text-slate-500 font-semibold font-display tracking-wider block uppercase">
                  Кадастровая стоимость
                </span>
                <span className="text-lg font-bold text-amber-400 mt-1 block font-display">
                  {formatCurrency(apartment.cadCost)}
                </span>
              </div>

              <div>
                <span className="text-xs text-slate-500 font-semibold font-display tracking-wider block uppercase">
                  Дата определения стоимости
                </span>
                <span className="text-base text-slate-200 mt-1 font-semibold block">
                  {formatDate(apartment.mainCharacters?.[0] ? 1735689600000 : null) || '01.01.2025'}
                </span>
              </div>

              <div>
                <span className="text-xs text-slate-500 font-semibold font-display tracking-wider block uppercase">
                  Дата внесения стоимости
                </span>
                <span className="text-base text-slate-200 mt-1 font-semibold block">
                  {formatDate(1765929600000) || '17.12.2025'}
                </span>
              </div>
            </div>
          </GlassCard>

        </div>

        {/* Right Column - Owners, Restrictions, Old Numbers */}
        <div className="flex flex-col gap-6">
          
          {/* Rights & Registered Ownership */}
          <GlassCard className="border-slate-800/60 bg-slate-900/20">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="p-2 bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 rounded-lg">
                <Award size={18} />
              </div>
              <h2 className="text-lg font-bold font-display text-white">Сведения о правах ({owners.length})</h2>
            </div>

            {owners.length > 0 ? (
              <div className="flex flex-col gap-4">
                {owners.map((owner, idx) => (
                  <div 
                    key={idx} 
                    className="bg-slate-950/45 border border-slate-800/50 rounded-xl p-4 relative overflow-hidden"
                  >
                    {/* Corner badge indicating index */}
                    <div className="absolute top-0 right-0 px-2 py-0.5 bg-indigo-500/10 text-indigo-400 border-l border-b border-slate-800 text-[10px] font-bold font-display rounded-bl-lg">
                      #{idx + 1}
                    </div>

                    <span className="text-xs text-slate-500 font-semibold font-display tracking-wider block uppercase">
                      Собственник / ФИО
                    </span>
                    <span className={`text-sm font-bold block mt-1 ${owner.fio === 'ФИО неизвестны' ? 'text-slate-400 italic font-normal' : 'text-indigo-200'}`}>
                      {owner.fio || 'ФИО неизвестно'}
                    </span>

                    <span className="text-[10px] text-slate-500 font-semibold font-display tracking-wider block uppercase mt-3">
                      Вид регистрации
                    </span>
                    <span className="text-xs text-slate-300 font-medium block mt-0.5">
                      {owner.rightTypeDesc || 'Собственность'}
                    </span>

                    <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-800/30">
                      <div>
                        <span className="text-[10px] text-slate-500 font-semibold font-display block uppercase">Номер записи</span>
                        <span className="text-xs text-slate-300 font-mono mt-0.5 block truncate" title={owner.rightNumber}>
                          {owner.rightNumber || '—'}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 font-semibold font-display block uppercase">Доля</span>
                        <span className="text-xs text-emerald-400 font-bold mt-0.5 block">
                          {owner.part || '1/1 (Индивид.)'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-slate-500 italic text-sm">
                Сведения о зарегистрированных правах отсутствуют в локальной базе.
              </div>
            )}
          </GlassCard>

          {/* Encumbrances & Restrictions */}
          {encumbrances.length > 0 && (
            <GlassCard className="border-rose-950/30 bg-rose-950/5">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="p-2 bg-rose-500/10 border border-rose-500/25 text-rose-400 rounded-lg">
                  <ShieldAlert size={18} />
                </div>
                <h2 className="text-base font-bold font-display text-white">Ограничения и обременения ({encumbrances.length})</h2>
              </div>

              <div className="flex flex-col gap-3">
                {encumbrances.map((enc, idx) => (
                  <div key={idx} className="bg-slate-950/60 border border-rose-950/40 rounded-xl p-3 text-xs">
                    <span className="text-rose-400 font-bold block uppercase tracking-wide text-[10px]">
                      {enc.typeDesc || 'Ипотека в силу закона'}
                    </span>
                    <span className="text-slate-400 mt-1 block">
                      Номер: <span className="font-mono text-slate-300">{enc.encumbranceNumber || '—'}</span>
                    </span>
                    <span className="text-slate-500 mt-0.5 block">
                      Начало действия: {formatDate(enc.startDate)}
                    </span>
                  </div>
                ))}
              </div>
            </GlassCard>
          )}

          {/* Prior assigned numbers */}
          {oldNumbers.length > 0 && (
            <GlassCard className="border-slate-800/60 bg-slate-900/10">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="p-2 bg-slate-800 border border-slate-700 text-slate-400 rounded-lg">
                  <Layers size={16} />
                </div>
                <h2 className="text-base font-bold font-display text-white">Ранее присвоенные номера</h2>
              </div>

              <div className="flex flex-col gap-3">
                {oldNumbers.map((num, idx) => (
                  <div key={idx} className="bg-slate-950/40 border border-slate-800/50 rounded-xl p-3">
                    <span className="text-[10px] text-slate-500 font-semibold font-display block uppercase">
                      {num.numType}
                    </span>
                    <span className="text-xs text-slate-300 font-mono mt-1 font-semibold block">
                      {num.numValue}
                    </span>
                  </div>
                ))}
              </div>
            </GlassCard>
          )}

        </div>

      </main>

    </div>
  );
};
