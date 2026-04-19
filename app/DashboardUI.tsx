// components/DashboardUI.tsx
"use client";
import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";

// Animaciones base
const ANIMATIONS = {
  fadeUp: { hidden: { opacity: 0, y: 30, filter: "blur(8px)" }, show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { type: "spring", stiffness: 300, damping: 24 } } },
  hover: { y: -5, scale: 1.01, boxShadow: "0 25px 50px -12px rgba(99, 102, 241, 0.25)", borderColor: "rgba(129, 140, 248, 0.3)", transition: { type: "spring", stiffness: 400, damping: 20 } }
};

export const AdvancedStatCard = ({ title, value, icon: Icon, subtext, color, type, gaugeVal, miniChart }: any) => {
    const colors: Record<string, string> = {
        indigo: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20 shadow-[0_0_20px_rgba(99,102,241,0.15)]",
        fuchsia: "text-fuchsia-400 bg-fuchsia-500/10 border-fuchsia-500/20 shadow-[0_0_20px_rgba(217,70,239,0.15)]",
        emerald: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.15)]",
        cyan: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20 shadow-[0_0_20px_rgba(34,211,238,0.15)]",
    };
    const c = colors[color] || colors.indigo;

    return (
    <motion.div variants={ANIMATIONS.fadeUp} whileHover={ANIMATIONS.hover} className="p-7 rounded-3xl border bg-[#0A0D16] border-white/5 shadow-2xl flex flex-col justify-between cursor-default group relative overflow-hidden h-full min-h-[180px]">
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
        <div className="flex justify-between items-start mb-6 relative z-10">
            <div className={`p-3.5 rounded-2xl border transition-all duration-300 ${c}`}><Icon size={20} strokeWidth={2} /></div>
            {type === 'gauge' && (
                <div className="relative w-12 h-12">
                    <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                        <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="3" />
                        <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#10b981" strokeWidth="3" strokeDasharray={`${gaugeVal}, 100`} className="drop-shadow-[0_0_5px_rgba(16,185,129,0.8)]" />
                    </svg>
                </div>
            )}
        </div>
        <div className="relative z-10">
            <p className="text-[9px] font-black uppercase tracking-widest mb-2 text-slate-500 group-hover:text-slate-400 transition-colors">{title}</p>
            <p className="text-3xl md:text-4xl font-black tracking-tighter text-white drop-shadow-md">{value}</p>
            {subtext && <p className="text-[9px] font-mono text-slate-600 mt-3 border-t border-white/5 pt-3 tracking-widest uppercase">{subtext}</p>}
            {miniChart && (
                <div className="mt-4 h-8 flex items-end gap-1 w-full">
                  {miniChart.slice(-15).map((val:number, i:number) => (
                    <motion.div key={i} initial={{ height: 0 }} animate={{ height: `${Math.max(10, val)}%` }} transition={{ type: "spring", stiffness: 100, damping: 20, delay: i * 0.02 }}
                        className="flex-1 bg-indigo-900/50 rounded-t-sm group-hover:bg-indigo-500 transition-all" 
                    />
                  ))}
                </div>
            )}
        </div>
    </motion.div>
    )
};

export const DataGridCell = ({ label, value, icon: Icon, highlight }: any) => (
  <div className={`p-5 rounded-2xl border ${highlight ? 'bg-indigo-500/10 border-indigo-500/30 shadow-[0_0_20px_rgba(99,102,241,0.1)]' : 'bg-black/30 border-white/5'} flex flex-col gap-3 group`}>
     <div className="flex items-center gap-3">
        <div className={`p-2 rounded-xl ${highlight ? 'bg-indigo-500 text-white shadow-[0_0_10px_rgba(255,255,255,0.3)]':'bg-white/5 text-slate-500 border border-white/10'}`}><Icon size={14}/></div>
        <p className={`text-[8px] font-black uppercase tracking-widest ${highlight ? 'text-indigo-300' : 'text-slate-500'}`}>{label}</p>
     </div>
     <p className={`text-xl font-mono tracking-tight truncate ${highlight ? 'text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]' : 'text-slate-300'}`}>{value}</p>
  </div>
);

export function SparklineMock({ active, val }: { active: boolean, val: number }) {
    if (!active || val === 0) return <div className="w-full h-full bg-slate-800/30 rounded"></div>;
    return (
        <svg viewBox="0 0 100 30" className="w-full h-full overflow-visible">
            <polyline fill="none" stroke="#34d399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                points="0,20 20,25 40,15 60,20 80,5 100,10" className="drop-shadow-[0_0_3px_rgba(52,211,153,0.8)]"
            />
            <circle cx="100" cy="10" r="3" fill="#34d399" />
        </svg>
    )
}

export function LoaderSpinner() { 
    return <div className="w-8 h-8 border-2 border-slate-700 border-t-indigo-500 rounded-full animate-spin"></div>; 
}

export function RegionBar({ name, users, percentage, label, barColor }: any) {
  return (
    <div className="border-b border-white/5 pb-3 last:border-0 last:pb-0">
      <div className="flex justify-between items-end mb-1.5">
        <span className="font-bold text-[10px] uppercase tracking-widest text-slate-400 truncate mr-2" title={name}>{name}</span>
        <div className="text-right shrink-0">
            <span className="font-mono text-sm text-white">{percentage}%</span>
        </div>
      </div>
      <div className="w-full bg-black/50 rounded-full h-1.5 overflow-hidden border border-white/5">
        <motion.div initial={{ width: 0 }} animate={{ width: `${percentage}%` }} transition={{ type: "spring", stiffness: 60, damping: 15 }} className={`h-full rounded-full ${barColor}`} />
      </div>
    </div>
  );
}

export function LiteralFunnel({ data, title, subtitle, formatNum }: any) {
  return (
      <div className="bg-transparent h-full flex flex-col">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6 flex items-center gap-2"><TrendingUp size={14} className="text-indigo-500"/> {title}</p>
          <div className="relative w-full flex-grow flex flex-col overflow-hidden drop-shadow-2xl min-h-[250px]" style={{ clipPath: 'polygon(0 0, 100% 0, 80% 100%, 20% 100%)' }}>
              {data?.map((step: any, idx: number) => {
                  const baseUsers = data[0]?.value || 1;
                  const perc = Math.round((step.value / baseUsers) * 100);
                  return (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: idx * 0.15 }} key={idx} 
                          className={`flex-1 border-b border-white/5 flex flex-col items-center justify-center hover:brightness-125 transition-all cursor-default relative overflow-hidden backdrop-blur-xl ${step.color}`}
                      >
                          <span className="text-white/60 font-black text-[9px] md:text-[10px] uppercase tracking-widest text-center px-4 relative z-10">{step.stage}</span>
                          <div className="flex items-center gap-3 mt-1 relative z-10">
                              <span className="text-white font-mono text-lg md:text-2xl drop-shadow-lg">{formatNum ? formatNum(step.value) : step.value}</span>
                              <span className="bg-black/50 text-slate-300 text-[8px] font-black px-2 py-0.5 rounded border border-white/5">{perc}%</span>
                          </div>
                      </motion.div>
                  )
              })}
          </div>
          {subtitle && <p className="text-[8px] text-slate-600 text-center mt-6 uppercase font-black tracking-widest">{subtitle}</p>}
      </div>
  )
}
