import React from 'react';
import { Sparkles, Zap, Activity, FileCheck2 } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-white pt-16 pb-12 sm:pt-20 sm:pb-16 px-4 sm:px-6 lg:px-8 border-b border-slate-200">
      <div className="max-w-4xl mx-auto relative z-10 text-center space-y-6">
        
        {/* Pill / Badge superior centrado con fondo azul claro */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-[#2563EB] text-xs font-black tracking-wider uppercase shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-[#2563EB]" />
          <span>SOLUCIONES GRÁFICAS PROFESIONALES</span>
        </div>

        {/* Título principal grande, en negrita y centrado */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-[1.15]">
          Cotiza y gestiona tus impresiones al instante
        </h1>

        {/* Subtítulo descriptivo */}
        <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Calcula presupuestos a medida para lonas, folletería, tarjetas y merchandising textil. Sin demoras ni esperas telefónicas.
        </p>

        {/* 3 características clave con iconos en fila horizontal */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 max-w-3xl mx-auto">
          {/* Feature 1 */}
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200 shadow-xs text-left">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-[#2563EB] shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-xs text-slate-900">
                Cotización exacta en tiempo real
              </h4>
              <p className="text-[11px] text-slate-500">Sin cotizaciones manuales</p>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200 shadow-xs text-left">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-xs text-slate-900">
                Seguimiento de estados de producción
              </h4>
              <p className="text-[11px] text-slate-500">Control etapa por etapa</p>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200 shadow-xs text-left">
            <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600 shrink-0">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-xs text-slate-900">
                Facturación digital inmediata
              </h4>
              <p className="text-[11px] text-slate-500">Comprobantes y remito oficial</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
