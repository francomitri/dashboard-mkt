// components/AiInsightsBlock.tsx
"use client";
import { motion } from "framer-motion";
import { Sparkles, AlertOctagon, AlertTriangle, CheckCircle2, Info } from "lucide-react";

export default function AiInsightsBlock({ insights, title }: { insights: any[], title: string }) {
  return (
    <div className="bg-[#131B2F]/80 p-8 rounded-3xl border border-indigo-500/20 shadow-[0_0_40px_rgba(99,102,241,0.05)] relative overflow-hidden backdrop-blur-xl mb-4 group">
      {/* Luces volumétricas rotativas */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-500/10 blur-[80px] rounded-full pointer-events-none group-hover:scale-110 transition-transform duration-1000" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[300px] h-[300px] bg-fuchsia-500/5 blur-[80px] rounded-full pointer-events-none group-hover:scale-110 transition-transform duration-1000" />
      
      <div className="flex items-center justify-between mb-8 relative z-10 pb-4 border-b border-white/5">
        <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-500/10 rounded-xl border border-indigo-500/20 text-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
                <Sparkles size={18} />
            </div>
            <h3 className="text-sm font-black tracking-widest uppercase text-white drop-shadow-md">{title}</h3>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
        {insights.map((insight, idx) => {
          let bC = "border-indigo-500/20"; 
          let bgC = "bg-indigo-900/10"; 
          let tC = "text-indigo-200"; 
          let icon = <Info size={16} className="text-indigo-400 drop-shadow-md" />;
          
          if (insight.type === 'error') { 
              bC = "border-rose-500/30"; bgC="bg-rose-950/20"; tC="text-rose-200"; 
              icon = <AlertOctagon size={16} className="text-rose-400 drop-shadow-md" />; 
          } else if (insight.type === 'warning') { 
              bC = "border-amber-500/30"; bgC="bg-amber-950/20"; tC="text-amber-200"; 
              icon = <AlertTriangle size={16} className="text-amber-400 drop-shadow-md" />; 
          } else if (insight.type === 'success') { 
              bC = "border-emerald-500/30"; bgC="bg-emerald-950/20"; tC="text-emerald-200"; 
              icon = <CheckCircle2 size={16} className="text-emerald-400 drop-shadow-md" />; 
          }
          
          return (
            <motion.div 
                whileHover={{ scale: 1.01, backgroundColor: "rgba(255,255,255,0.02)" }} 
                key={idx} 
                className={`flex items-start gap-4 p-5 rounded-xl border ${bgC} ${bC} transition-all shadow-lg`}
            >
              <div className="mt-0.5 shrink-0 bg-black/40 p-2 rounded-lg border border-white/5 backdrop-blur-md">
                  {icon}
              </div>
              <p className={`text-xs font-medium leading-relaxed ${tC} tracking-wide`}>{insight.text}</p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
