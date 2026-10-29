import React from 'react';
import { KeyRound, ShieldAlert, User, ArrowRight } from 'lucide-react';

export default function DemoBanner({ onOpenLogin }) {
  return (
    <div className="bg-[#0B1120] text-slate-200 border-b border-slate-800 text-xs py-2.5 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2.5">
        
        {/* Credenciales */}
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-4 gap-y-1 text-center md:text-left">
          <span className="inline-flex items-center gap-1.5 font-bold uppercase tracking-wider text-[11px] text-amber-400">
            <KeyRound className="w-3.5 h-3.5" />
            Accesos de Prueba (Demo MVP):
          </span>

          {/* Empleado */}
          <div className="inline-flex items-center gap-1.5 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-slate-400">Empleado:</span>
            <span className="font-mono text-amber-300 font-semibold">empleado@imprentapro.com</span>
            <span className="text-slate-600">|</span>
            <span className="font-mono text-slate-300">admin123</span>
          </div>

          {/* Cliente */}
          <div className="inline-flex items-center gap-1.5 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800">
            <User className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-slate-400">Cliente:</span>
            <span className="font-mono text-blue-300 font-semibold">cliente@gmail.com</span>
            <span className="text-slate-600">|</span>
            <span className="font-mono text-slate-300">cliente123</span>
          </div>
        </div>

        {/* Botón Ir a Iniciar Sesión */}
        <div>
          <button
            onClick={onOpenLogin}
            className="inline-flex items-center gap-1.5 bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs py-1.5 px-3.5 rounded-lg shadow-sm transition cursor-pointer"
          >
            <span>Ir a Iniciar Sesión</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
