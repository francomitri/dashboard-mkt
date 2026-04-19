// components/WebAnalytics.tsx
"use client";
import { motion } from "framer-motion";
import { Globe, Compass, BookOpen } from "lucide-react";
import { LiteralFunnel } from "./DashboardUI";

export default function WebAnalyticsDashboard({ webData, formatNum }: any) {
  const totalChannelsUsers = webData.channels?.reduce((acc: number, curr: any) => acc + curr.users, 0) || 1;
  const webFunnelData = webData.funnel?.map((f: any) => ({ stage: f.stage, value: f.users, color: 'bg-blue-900/10 border-blue-500/10' })) || [];
  
  if(webFunnelData.length === 4) {
      webFunnelData[0].color = "bg-[#131B2F] border-white/5";
      webFunnelData[1].color = "bg-indigo-900/20 border-indigo-500/20";
      webFunnelData[2].color = "bg-purple-900/20 border-purple-500/20";
      webFunnelData[3].color = "bg-emerald-900/30 border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.1)]";
  }

  return (
    <div className="space-y-8">
        <div className="flex justify-between items-center pb-4 border-b border-white/5">
            <h2 className="text-xl font-black text-white flex items-center gap-3 tracking-wide"><div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg border border-blue-500/20"><Globe size={18}/></div> Analítica GA4 Node</h2>
        </div>
        <div className="h-[300px] bg-black/20 p-4 rounded-2xl border border-white/5">
            <LiteralFunnel title="Túnel de Tráfico Nativo" data={webFunnelData} formatNum={formatNum} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-white/5 bg-black/20 p-6 rounded-2xl shadow-inner">
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-5 flex items-center gap-2"><Compass size={14} className="text-fuchsia-400"/> Top Fuentes</p>
              <div className="space-y-4">
                  {webData.channels?.slice(0, 4).map((ch: any, idx: number) => {
                  const perc = Math.round((ch.users / totalChannelsUsers) * 100);
                  return (
                      <div key={idx}>
                      <div className="flex justify-between text-[10px] mb-1.5 font-mono">
                          <span className="text-slate-400 truncate mr-2" title={ch.name}>{ch.name}</span>
                          <span className="text-fuchsia-400">{perc}%</span>
                      </div>
                      <div className="w-full bg-white/5 rounded-full h-1 overflow-hidden">
                          <motion.div initial={{ width: 0 }} animate={{ width: `${perc}%` }} className="h-full bg-fuchsia-500" />
                      </div>
                      </div>
                  )
                  })}
              </div>
            </div>
            <div className="border border-white/5 bg-black/20 p-6 rounded-2xl shadow-inner">
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-5 flex items-center gap-2"><BookOpen size={14} className="text-cyan-400"/> Rutas Frecuentes</p>
              <div className="space-y-3">
                  {webData.topPages?.slice(0, 4).map((page: any, idx: number) => (
                  <div key={idx} className="flex items-center justify-between gap-3 border-b border-white/5 pb-2 last:border-0 rounded px-1">
                      <span className="text-[10px] font-mono text-slate-500 truncate max-w-[150px]">{page.path === '/' ? '/index' : page.path}</span>
                      <span className="text-[9px] font-black text-cyan-400">{formatNum(page.views)}</span>
                  </div>
                  ))}
              </div>
            </div>
        </div>
    </div>
  );
}
