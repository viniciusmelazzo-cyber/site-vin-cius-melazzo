import { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { SectionCard } from "@/components/ui/section-card";
import { proximosVencimentos, mesesFull, fmt } from "@/data/mockData";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";

export default function Calendario() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay();

  const vencimentosByDay: Record<number, typeof proximosVencimentos> = {};
  proximosVencimentos.forEach((v) => {
    if (!vencimentosByDay[v.dia]) vencimentosByDay[v.dia] = [];
    vencimentosByDay[v.dia].push(v);
  });

  const today = new Date();
  const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;
  const selectedVencimentos = selectedDay ? vencimentosByDay[selectedDay] || [] : [];
  const totalMes = proximosVencimentos.reduce((s, v) => s + v.valor, 0);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Operacional"
        title="Calendário de Vencimentos"
        description="Visão consolidada de obrigações financeiras com vencimento próximo."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <SectionCard className="lg:col-span-2" title="Mês Corrente" subtitle={`Total de compromissos: ${fmt(totalMes)}`} icon={<CalendarIcon className="h-5 w-5" />}>
          <div className="flex items-center justify-between mb-4">
            <button onClick={() => setCurrentDate(new Date(year, month - 1, 1))} className="p-2 rounded hover:bg-secondary">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="font-display text-lg font-semibold text-navy">
              {mesesFull[month]} {year}
            </span>
            <button onClick={() => setCurrentDate(new Date(year, month + 1, 1))} className="p-2 rounded hover:bg-secondary">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-2">
            {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((d) => (
              <div key={d} className="text-center text-[10px] text-gold-dark font-semibold uppercase tracking-wider py-2">{d}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: firstDayOfWeek }).map((_, i) => (
              <div key={`e-${i}`} />
            ))}
            {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
              const has = !!vencimentosByDay[day];
              const isToday = isCurrentMonth && today.getDate() === day;
              const isSelected = selectedDay === day;
              const total = vencimentosByDay[day]?.reduce((s, v) => s + v.valor, 0) || 0;
              return (
                <button
                  key={day}
                  onClick={() => setSelectedDay(isSelected ? null : day)}
                  className={`relative p-2 h-16 rounded text-left transition-all border ${
                    isSelected ? "bg-navy text-linen border-gold" :
                    isToday ? "bg-gold/15 border-gold text-navy font-bold" :
                    has ? "border-border hover:border-gold/50 bg-card" :
                    "border-transparent hover:bg-secondary/40 text-muted-foreground"
                  }`}
                >
                  <span className="text-sm font-semibold">{day}</span>
                  {has && (
                    <p className={`text-[9px] mt-0.5 tabular truncate ${isSelected ? "text-gold" : "text-gold-dark"}`}>
                      {fmt(total)}
                    </p>
                  )}
                </button>
              );
            })}
          </div>
        </SectionCard>

        <SectionCard title="Detalhes" subtitle={selectedDay ? `Vencimentos do dia ${selectedDay}` : "Selecione um dia para detalhar"}>
          {selectedDay ? (
            selectedVencimentos.length === 0 ? (
              <p className="text-sm text-muted-foreground py-8 text-center">Nenhum vencimento neste dia.</p>
            ) : (
              <div className="space-y-2">
                {selectedVencimentos.map((v, i) => (
                  <div key={i} className="p-3 rounded bg-secondary/60 border border-border">
                    <p className="text-sm font-medium text-navy">{v.descricao}</p>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-xs text-gold-dark">{v.tipo}</span>
                      <span className="text-sm tabular font-semibold text-negative">{fmt(v.valor)}</span>
                    </div>
                  </div>
                ))}
                <div className="pt-3 border-t border-border flex justify-between">
                  <span className="text-sm font-display font-semibold text-navy">Total do dia</span>
                  <span className="tabular font-bold text-navy">{fmt(selectedVencimentos.reduce((s, v) => s + v.valor, 0))}</span>
                </div>
              </div>
            )
          ) : (
            <div className="space-y-2">
              <p className="kpi-label mb-2">Próximos compromissos</p>
              {proximosVencimentos.slice(0, 5).map((v, i) => (
                <div key={i} className="flex justify-between items-center text-xs py-1.5 border-b border-border/30">
                  <span className="text-foreground">Dia {v.dia} · {v.descricao}</span>
                  <span className="tabular text-gold-dark font-semibold">{fmt(v.valor)}</span>
                </div>
              ))}
            </div>
          )}
        </SectionCard>
      </div>
    </div>
  );
}
