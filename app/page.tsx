"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

export default function Dashboard() {
  const [data, setData] = useState<any[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedCampaign, setSelectedCampaign] = useState<any>(null);
  const [view, setView] = useState<'metrics' | 'ads'>('metrics');
  const [ads, setAds] = useState<any[]>([]);
  const [loadingAds, setLoadingAds] = useState(false);

  const formatNum = (num: any) => parseFloat(Number(num).toFixed(2)).toString();

  useEffect(() => {
    const fetchData = () => {
      fetch("/api/metrics")
        .then(res => res.json())
        .then(json => {
          if (json.error) setErrorMessage(json.error);
          else setData(Array.isArray(json) ? json : []);
        })
        .catch(err => console.error("Error:", err));
    };
    fetchData();
    const interval = setInterval(fetchData, 300000);
    return () => clearInterval(interval);
  }, []);

  const selectCampaign = (campaign: any) => {
    setSelectedCampaign(campaign);
    setView('metrics');
    setAds([]);
    setLoadingAds(true);
    fetch(`/api/metrics?campaignId=${campaign.campaign_id}`)
      .then(res => res.json())
      .then((adData) => { setAds(Array.isArray(adData) ? adData : []); setLoadingAds(false); });
  };

  // Lógica para obtener ventas reales
  const getPurchasesCount = (actions: any[]) => {
    if (!Array.isArray(actions)) return 0;
    const purchase = actions.find(a => a.action_type === "purchase" || a.action_type === "offsite_conversion.fb_pixel_purchase");
    return purchase ? parseFloat(purchase.value) : 0;
  };

  const getPurchasesOnly = (actions: any[]) => getPurchasesCount(actions).toString();

  // Cálculo de CPA Venta: Inversión / Compras
  const calculateCpaVenta = (spend: any, actions: any[]) => {
    const compras = getPurchasesCount(actions);
    if (compras === 0) return 0;
    return parseFloat(spend) / compras;
  };

  const renderConversionActions = (actions: any[]) => {
    if (!Array.isArray(actions)) return <p>Sin datos.</p>;
    const allowedActions = [
      { key: "offsite_conversion.fb_pixel_purchase", label: "Compras" },
      { key: "offsite_conversion.fb_pixel_add_to_cart", label: "Carrito" },
      { key: "offsite_conversion.fb_pixel_initiate_checkout", label: "Pagos iniciados" },
      { key: "offsite_conversion.fb_pixel_view_content", label: "Visualizaciones" },
      { key: "offsite_conversion.fb_pixel_search", label: "Búsquedas" }
    ];
    return (
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {actions.filter(a => allowedActions.some(al => al.key === a.action_type)).map((action: any, i: number) => (
          <div key={i} className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
            <p className="text-[10px] font-bold text-slate-400 uppercase">{allowedActions.find(a => a.key === action.action_type)?.label}</p>
            <p className="text-lg font-bold text-indigo-600">{formatNum(action.value)}</p>
          </div>
        ))}
      </div>
    );
  };

  if (errorMessage) return <div className="p-12 text-center text-red-600 font-bold text-xl">Error: {errorMessage}</div>;
  if (data.length === 0 && !errorMessage) return <div className="p-12 text-center text-slate-600">Cargando...</div>;

  return (
    <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-12 bg-slate-50 min-h-screen">
      <header className="flex flex-col items-center mb-8 border-b pb-4 border-slate-200">
        <Image src="/logo.png" alt="Logo" width={240} height={240} priority className="block" />
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight -mt-10 relative z-10">Dashboard de Marketing</h1>
      </header>

      {selectedCampaign ? (
        <div className="mb-12">
          <div className="flex gap-4 mb-6">
            <button onClick={() => setSelectedCampaign(null)} className="text-sm font-bold text-slate-500 hover:text-indigo-600">← Volver a todas las campañas</button>
            <div className="flex gap-2 bg-slate-200 p-1 rounded-xl shadow-inner">
              <button onClick={() => setView('metrics')} className={`px-6 py-2 rounded-lg text-sm font-bold transition ${view === 'metrics' ? 'bg-white shadow-sm' : 'text-slate-600'}`}>Métricas Generales</button>
              <button onClick={() => setView('ads')} className={`px-6 py-2 rounded-lg text-sm font-bold transition ${view === 'ads' ? 'bg-white shadow-sm' : 'text-slate-600'}`}>Ver Anuncios</button>
            </div>
          </div>

          {view === 'metrics' ? (
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100">
              <h2 className="text-2xl font-bold mb-6 text-slate-800">Campaña: <span className="text-indigo-600 font-black">{selectedCampaign.campaign_name}</span></h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <MetricCard title="Alcance" value={selectedCampaign.reach || 0} color="indigo" />
                <MetricCard title="Inversión" value={`$${formatNum(selectedCampaign.spend || 0)}`} color="emerald" />
                <MetricCard title="Clics" value={selectedCampaign.inline_link_clicks || 0} color="amber" />
                <MetricCard title="CTR" value={`${formatNum(selectedCampaign.inline_link_click_ctr || 0)}%`} color="rose" />
                <MetricCard title="Frecuencia" value={formatNum(selectedCampaign.frequency || 0)} color="sky" />
                <MetricCard title="CPA (Venta)" value={`$${formatNum(calculateCpaVenta(selectedCampaign.spend, selectedCampaign.actions))}`} color="violet" />
              </div>
              <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                <h3 className="text-xs font-bold text-slate-500 mb-4 uppercase tracking-widest">Detalle de Conversiones</h3>
                {selectedCampaign.actions ? renderConversionActions(selectedCampaign.actions) : <p>Sin datos.</p>}
              </div>
            </div>
          ) : (
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100">
              <h2 className="text-2xl font-bold mb-6 text-slate-800">Anuncios en <span className="text-indigo-600">{selectedCampaign.campaign_name}</span></h2>
              {loadingAds ? <p className="text-center py-10">Cargando anuncios...</p> : (
                <div className="grid gap-4">
                  {ads.map((ad, i) => (
                    <motion.div key={i} whileHover={{ scale: 1.01 }} className="flex flex-col md:flex-row justify-between items-center p-5 bg-slate-50 border border-slate-100 rounded-xl hover:border-indigo-200 transition">
                      <div className="mb-4 md:mb-0">
                        <p className="text-xs font-bold text-indigo-500 uppercase mb-1">Nombre del Anuncio</p>
                        <p className="text-lg font-bold text-slate-800">{ad.ad_name}</p>
                      </div>
                      <div className="flex gap-8 text-center">
                        <div><p className="text-[10px] text-slate-400 uppercase font-bold">Inversión</p><p className="font-bold text-slate-700">${formatNum(ad.spend || 0)}</p></div>
                        <div><p className="text-[10px] text-slate-400 uppercase font-bold">Alcance</p><p className="font-bold text-slate-700">{ad.reach}</p></div>
                        <div><p className="text-[10px] text-slate-400 uppercase font-bold">Clics</p><p className="font-bold text-slate-700">{ad.inline_link_clicks || 0}</p></div>
                        <div><p className="text-[10px] text-rose-500 uppercase font-bold">Ventas</p><p className="font-black text-rose-600 text-lg">{getPurchasesOnly(ad.actions)}</p></div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
          <h2 className="text-2xl font-bold mb-6 text-slate-800">Tus Campañas Activas</h2>
          <div className="space-y-3">
            {data.map((item, i) => (
              <motion.div key={i} whileHover={{ x: 5 }} className="flex justify-between p-5 border border-slate-100 rounded-xl cursor-pointer hover:bg-slate-50" onClick={() => selectCampaign(item)}>
                <p className="font-semibold text-lg text-slate-700">{item.campaign_name}</p>
                <button className="bg-slate-900 text-white px-5 py-2 rounded-lg text-sm font-bold">Gestionar →</button>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </motion.main>
  );
}

function MetricCard({ title, value, color }: { title: string, value: string | number, color: string }) {
  const colors:any = { indigo: "border-indigo-500 text-indigo-700", emerald: "border-emerald-500 text-emerald-700", amber: "border-amber-500 text-amber-700", rose: "border-rose-500 text-rose-700", sky: "border-sky-500 text-sky-700", violet: "border-violet-500 text-violet-700" };
  return <motion.div whileHover={{ scale: 1.02 }} className={`bg-slate-50 p-6 rounded-xl border-t-4 ${colors[color]} shadow-inner`}><p className="text-sm font-medium text-slate-500">{title}</p><p className="text-3xl font-extrabold text-slate-950 mt-1">{value}</p></motion.div>;
}
