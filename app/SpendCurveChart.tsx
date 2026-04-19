// components/SpendCurveChart.tsx
"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function SpendCurveChart({ data, labels, formatNum, selectedPoint, onSelectPoint }: any) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  
  let safeData = data && data.length > 0 ? data : [0, 0];
  let safeLabels = labels && labels.length > 0 ? labels : ['-', '-'];

  if (safeData.length === 1) {
      safeData = [safeData[0], safeData[0]];
      safeLabels = [safeLabels[0], safeLabels[0]];
  }
  
  const width = 1000;
  const height = 240;
  const max = Math.max(...safeData, 1); 
  const len = safeData.length - 1; 
  
  const paddingX = 40; 
  const innerWidth = width - paddingX * 2;

  const points = safeData.map((d: number, i: number) => ({
      x: paddingX + (i / len) * innerWidth,
      y: height - (d / max) * height * 0.85 - 10 
  }));

  let path = `M ${points[0].x},${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i === 0 ? 0 : i - 1];
      const p1 = points[i];
      const p2 = points[i + 1];
      const p3 = points[i + 2 === points.length ? i + 1 : i + 2];

      const cp1x = p1.x + (p2.x - p0.x) * 0.15;
      const cp1y = p1.y + (p2.y - p0.y) * 0.15;
      const cp2x = p2.x - (p3.x - p1.x) * 0.15;
      const cp2y = p2.y - (p3.y - p1.y) * 0.15;

      path += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y}`;
  }
  
  const areaPath = `${path} L ${points[points.length - 1].x},${height} L ${points[0].x},${height} Z`;

  return (
      <div className="w-full overflow-x-auto scrollbar-thin scrollbar-thumb-white/10 pb-4">
          <div className="min-w-[700px] w-full relative px-2">
              <div className="h-[200px] md:h-[280px] w-full relative mt-10">
                  <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible" preserveAspectRatio="none">
                      <defs>
                          <linearGradient id="curveGradDark2" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.4" />
                              <stop offset="100%" stopColor="#4f46e5" stopOpacity="0" />
                          </linearGradient>
                      </defs>
                      <path d={areaPath} fill="url(#curveGradDark2)" />
                      <path d={path} fill="none" stroke="#6366f1" strokeWidth="3" strokeLinecap="round" style={{ filter: 'drop-shadow(0px 0px 5px rgba(99,102,241,0.8))' }} />
                      
                      {points.map((p: any, i: number) => {
                          const isSelected = selectedPoint === i;
                          return (
                             <g key={i} onMouseEnter={() => setHoverIndex(i)} onMouseLeave={() => setHoverIndex(null)} onClick={() => onSelectPoint(isSelected ? null : i)} className="cursor-pointer">
                                 <circle cx={p.x} cy={p.y} r="30" fill="transparent" />
                                 <circle cx={p.x} cy={p.y} r={isSelected ? "7" : (hoverIndex === i ? "6" : "3")} fill={isSelected ? "#22d3ee" : (hoverIndex === i ? "#c084fc" : "#0A0D16")} stroke={isSelected ? "#22d3ee" : "#6366f1"} strokeWidth={isSelected ? "3" : "2"} style={{ transition: 'all 0.2s ease', filter: isSelected ? 'drop-shadow(0px 0px 8px rgba(34,211,238,0.8))' : 'none' }} />
                             </g>
                          )
                      })}
                  </svg>
                  <AnimatePresence>
                      {hoverIndex !== null && hoverIndex !== selectedPoint && (
                          <motion.div initial={{ opacity: 0, y: 10, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.9 }}
                              className="absolute bg-[#0A0D16] text-white px-4 py-2 rounded-xl text-center shadow-[0_10px_30px_rgba(0,0,0,0.9)] border border-white/10 pointer-events-none z-50 whitespace-nowrap backdrop-blur-md"
                              style={{ left: `${(points[hoverIndex].x / width) * 100}%`, top: `calc(${(points[hoverIndex].y / height) * 100}% - 55px)`, transform: `translateX(${hoverIndex === len ? '-80%' : hoverIndex === 0 ? '-20%' : '-50%'})` }}
                          >
                              <p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest mb-0.5">{safeLabels[hoverIndex]}</p>
                              <p className="text-sm font-mono tracking-tight">${formatNum(safeData[hoverIndex])}</p>
                          </motion.div>
                      )}
                  </AnimatePresence>
              </div>
              <div className="relative w-full h-20 mt-4 border-t border-white/5">
                  {safeLabels.map((l: string, i: number) => {
                      const isHovered = hoverIndex === i || selectedPoint === i;
                      return (
                        <div key={i} onClick={() => onSelectPoint(selectedPoint === i ? null : i)}
                            className={`absolute top-4 text-[9px] cursor-pointer origin-top-left -rotate-45 font-mono uppercase transition-all duration-300 whitespace-nowrap ${isHovered ? 'text-indigo-400 scale-110 z-10 drop-shadow-[0_0_5px_rgba(99,102,241,0.8)]' : 'text-slate-600 hover:text-slate-400 z-0'}`}
                            style={{ left: `${(points[i].x / width) * 100}%`, transform: `translateX(-50%) rotate(-45deg)` }}
                        > {l} </div>
                      )
                  })}
              </div>
          </div>
      </div>
  )
}
