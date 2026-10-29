import React, { useState, useEffect, useCallback } from 'react';
import {
  Calculator,
  Layers,
  FileText,
  CreditCard,
  Shirt,
  Clock,
  Sparkles,
  ShoppingCart,
  Check,
} from 'lucide-react';
import { calculateQuoteApi } from '../services/api';

export default function PrintingCalculator({ onAddToCart }) {
  const [activeTab, setActiveTab] = useState('lonas');

  // Lonas state
  const [lonaMaterial, setLonaMaterial] = useState('frontlight');
  const [lonaWidth, setLonaWidth] = useState(2.0);
  const [lonaHeight, setLonaHeight] = useState(1.0);
  const [lonaFinish, setLonaFinish] = useState('ojales');
  const [lonaQty, setLonaQty] = useState(1);

  // Folletos state
  const [folletoSize, setFolletoSize] = useState('a5');
  const [folletoPaper, setFolletoPaper] = useState('150g');
  const [folletoLamination, setFolletoLamination] = useState('brillante');
  const [folletoQty, setFolletoQty] = useState(1000);

  // Tarjetas state
  const [tarjetaFinish, setTarjetaFinish] = useState('mate-uv');
  const [tarjetaCorners, setTarjetaCorners] = useState(false);
  const [tarjetaQty, setTarjetaQty] = useState(500);

  // Textil state
  const [textilType, setTextilType] = useState('remera');
  const [textilPrintArea, setTextilPrintArea] = useState('frente-espalda');
  const [textilColor, setTextilColor] = useState('negro');
  const [textilQty, setTextilQty] = useState(10);

  // Quote Result from Backend
  const [quote, setQuote] = useState({
    title: 'Lona Frontlight 440g (2x1m)',
    description: 'Superficie: 2.00 m². Con ojales perimetrales cada 30cm.',
    unitPrice: 31.0,
    totalPrice: 31.0,
    estimatedDays: '24 a 48 hs hábiles',
  });
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState(false);

  // Fetch quote from Backend API
  const refreshQuote = useCallback(async () => {
    setLoading(true);
    let params = {};

    if (activeTab === 'lonas') {
      params = {
        material: lonaMaterial,
        width: lonaWidth,
        height: lonaHeight,
        finish: lonaFinish,
        quantity: lonaQty,
      };
    } else if (activeTab === 'folletos') {
      params = {
        size: folletoSize,
        paper: folletoPaper,
        lamination: folletoLamination,
        quantity: folletoQty,
      };
    } else if (activeTab === 'tarjetas') {
      params = {
        finish: tarjetaFinish,
        corners: tarjetaCorners,
        quantity: tarjetaQty,
      };
    } else {
      params = {
        type: textilType,
        printArea: textilPrintArea,
        color: textilColor,
        quantity: textilQty,
      };
    }

    try {
      const data = await calculateQuoteApi(activeTab, params);
      setQuote(data);
    } catch {
      // Offline / fallback calculation
      const area = Math.max(0.2, lonaWidth * lonaHeight);
      setQuote({
        title: `Trabajo de Impresión (${activeTab.toUpperCase()})`,
        description: `Medida y terminación personalizada.`,
        unitPrice: 31.0,
        totalPrice: 31.0 * (lonaQty || 1),
        estimatedDays: '48 hs hábiles',
      });
    } finally {
      setLoading(false);
    }
  }, [
    activeTab,
    lonaMaterial,
    lonaWidth,
    lonaHeight,
    lonaFinish,
    lonaQty,
    folletoSize,
    folletoPaper,
    folletoLamination,
    folletoQty,
    tarjetaFinish,
    tarjetaCorners,
    tarjetaQty,
    textilType,
    textilPrintArea,
    textilColor,
    textilQty,
  ]);

  useEffect(() => {
    refreshQuote();
  }, [refreshQuote]);

  const handleAdd = () => {
    onAddToCart({
      id: Date.now(),
      name: quote.title,
      description: quote.description,
      price: quote.totalPrice,
      quantity: 1,
      category: activeTab,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div id="cotizador" className="scroll-mt-24">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden">
        
        {/* Encabezado con contenedor de fondo azul degradado */}
        <div className="bg-gradient-to-r from-blue-700 via-[#2563EB] to-indigo-700 text-white p-6 sm:p-10 relative overflow-hidden">
          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shrink-0 shadow-lg border border-white/20">
              <Calculator className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/15 text-blue-100 text-xs font-bold uppercase tracking-wider backdrop-blur-xs">
                <Sparkles className="w-3 h-3 text-amber-300" />
                <span>API Backend Conectada (Puerto 4000)</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
                Calculadora de Presupuestos en Vivo
              </h2>
              <p className="text-xs sm:text-sm text-blue-100 max-w-2xl leading-relaxed">
                Selecciona el producto, ajusta las medidas y acabados personalizados. Obtendrás una estimación instantánea y podrás enviar tu pedido a revisión.
              </p>
            </div>
          </div>
        </div>

        {/* Pestañas de categorías */}
        <div className="border-b border-slate-200 bg-slate-50 p-3 sm:p-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: 'lonas', label: 'Lonas Vinílicas', icon: Layers },
              { id: 'folletos', label: 'Folletería & Flyers', icon: FileText },
              { id: 'tarjetas', label: 'Tarjetas Personales', icon: CreditCard },
              { id: 'textil', label: 'Merchandising Textil', icon: Shirt },
            ].map((t) => {
              const Icon = t.icon;
              const active = activeTab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={`flex items-center justify-center gap-2 py-3 px-4 rounded-2xl text-xs sm:text-sm font-bold transition cursor-pointer ${
                    active
                      ? 'bg-[#2563EB] text-white shadow-md shadow-blue-500/25'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{t.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Cuerpo: Formulario + Cotización */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 sm:p-10">
          
          {/* Formulario (Izquierda) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* LONAS */}
            {activeTab === 'lonas' && (
              <div className="space-y-5 animate-in fade-in duration-150">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                    Material de Lona
                  </label>
                  <select
                    value={lonaMaterial}
                    onChange={(e) => setLonaMaterial(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-sm font-semibold"
                  >
                    <option value="frontlight">Frontlight 440g (Estándar para carteles)</option>
                    <option value="blackout">Blackout Doble Faz (100% Opaca)</option>
                    <option value="microperforada">Microperforada (Para viento en altura)</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                      Ancho (Metros)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="0.5"
                      value={lonaWidth}
                      onChange={(e) => setLonaWidth(parseFloat(e.target.value) || 1)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                      Alto (Metros)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="0.5"
                      value={lonaHeight}
                      onChange={(e) => setLonaHeight(parseFloat(e.target.value) || 1)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                      Terminación / Acabado
                    </label>
                    <select
                      value={lonaFinish}
                      onChange={(e) => setLonaFinish(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-sm font-semibold"
                    >
                      <option value="ojales">Ojales perimetrales cada 30cm</option>
                      <option value="bolsillo">Bolsillo p/ caño superior e inferior</option>
                      <option value="ninguno">Corte al ras limpio</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                      Cantidad
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={lonaQty}
                      onChange={(e) => setLonaQty(parseInt(e.target.value, 10) || 1)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* FOLLETOS */}
            {activeTab === 'folletos' && (
              <div className="space-y-5 animate-in fade-in duration-150">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                      Tamaño de Folleto
                    </label>
                    <select
                      value={folletoSize}
                      onChange={(e) => setFolletoSize(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-sm font-semibold"
                    >
                      <option value="a5">A5 (15 x 21 cm) - Clásico</option>
                      <option value="a6">A6 (10 x 15 cm) - De mano</option>
                      <option value="triptico">Tríptico A4 Plegado</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                      Papel Ilustración
                    </label>
                    <select
                      value={folletoPaper}
                      onChange={(e) => setFolletoPaper(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-sm font-semibold"
                    >
                      <option value="150g">Couché 150g (Flexible estándar)</option>
                      <option value="300g">Couché 300g (Rígido premium)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                      Laminado
                    </label>
                    <select
                      value={folletoLamination}
                      onChange={(e) => setFolletoLamination(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-sm font-semibold"
                    >
                      <option value="brillante">Laminado Brillante</option>
                      <option value="mate">Laminado Mate Soft</option>
                      <option value="ninguno">Sin laminar</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                      Tirada / Unidades
                    </label>
                    <select
                      value={folletoQty}
                      onChange={(e) => setFolletoQty(parseInt(e.target.value, 10))}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-sm font-semibold"
                    >
                      <option value="500">500 unidades</option>
                      <option value="1000">1.000 unidades (Ahorro)</option>
                      <option value="2500">2.500 unidades</option>
                      <option value="5000">5.000 unidades</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* TARJETAS */}
            {activeTab === 'tarjetas' && (
              <div className="space-y-5 animate-in fade-in duration-150">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                    Acabado Premium
                  </label>
                  <select
                    value={tarjetaFinish}
                    onChange={(e) => setTarjetaFinish(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-sm font-semibold"
                  >
                    <option value="mate-uv">Laminado Mate + Laca UV Sectorizada</option>
                    <option value="mate">Laminado Mate Soft Touch</option>
                    <option value="clasica">Couché 350g Clásica</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                      Cantidad
                    </label>
                    <select
                      value={tarjetaQty}
                      onChange={(e) => setTarjetaQty(parseInt(e.target.value, 10))}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-sm font-semibold"
                    >
                      <option value="100">100 unidades</option>
                      <option value="250">250 unidades</option>
                      <option value="500">500 unidades</option>
                      <option value="1000">1.000 unidades</option>
                    </select>
                  </div>
                  <div className="flex items-center pt-6">
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
                      <input
                        type="checkbox"
                        checked={tarjetaCorners}
                        onChange={(e) => setTarjetaCorners(e.target.checked)}
                        className="w-4 h-4 text-[#2563EB]"
                      />
                      <span>Puntas Redondeadas</span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* TEXTIL */}
            {activeTab === 'textil' && (
              <div className="space-y-5 animate-in fade-in duration-150">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                      Prenda
                    </label>
                    <select
                      value={textilType}
                      onChange={(e) => setTextilType(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-sm font-semibold"
                    >
                      <option value="remera">Remera 100% Algodón</option>
                      <option value="buzo">Buzo Hoodie con Capucha</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                      Área Estampado DTF
                    </label>
                    <select
                      value={textilPrintArea}
                      onChange={(e) => setTextilPrintArea(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-sm font-semibold"
                    >
                      <option value="frente">Frente Único</option>
                      <option value="frente-espalda">Frente + Espalda</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                      Color
                    </label>
                    <select
                      value={textilColor}
                      onChange={(e) => setTextilColor(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-sm font-semibold capitalize"
                    >
                      <option value="negro">Negro</option>
                      <option value="blanco">Blanco</option>
                      <option value="azul">Azul Marino</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                    Cantidad de Prendas (Mín. 5)
                  </label>
                  <input
                    type="number"
                    min="5"
                    value={textilQty}
                    onChange={(e) => setTextilQty(parseInt(e.target.value, 10) || 5)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Tarjeta de Cotización en Tiempo Real (Derecha) */}
          <div className="lg:col-span-5 flex flex-col justify-between p-6 sm:p-7 rounded-3xl bg-slate-50 border border-slate-200 space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#2563EB] bg-blue-100 px-2.5 py-1 rounded-full">
                  Presupuesto Backend en Vivo
                </span>
                <span className="flex items-center gap-1 text-[11px] text-slate-500 font-semibold">
                  <Clock className="w-3.5 h-3.5 text-blue-600" />
                  {quote.estimatedDays}
                </span>
              </div>

              <div>
                <h3 className="text-lg font-black text-slate-900 leading-tight">
                  {quote.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                  {quote.description}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2 text-xs">
                <div className="flex justify-between text-slate-500">
                  <span>Precio unitario:</span>
                  <span className="font-semibold text-slate-700">
                    ${Number(quote.unitPrice || 0).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Revisión técnica de pre-prensa:</span>
                  <span className="font-semibold text-emerald-600">Bonificado 100%</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Prueba digital antes de imprimir:</span>
                  <span className="font-semibold text-slate-700">Incluida</span>
                </div>
                <div className="pt-2 border-t border-slate-100 flex justify-between items-baseline">
                  <span className="text-sm font-bold text-slate-800">Total Estimado:</span>
                  <span className="text-2xl font-black text-[#2563EB]">
                    ${Number(quote.totalPrice || 0).toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <button
                type="button"
                onClick={handleAdd}
                disabled={loading}
                className="w-full py-3 px-5 rounded-2xl bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-sm shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-50"
              >
                {added ? (
                  <>
                    <Check className="w-5 h-5 text-white" />
                    <span>¡Agregado a tu Pedido!</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-5 h-5" />
                    <span>Enviar Pedido a Revisión / Comprar</span>
                  </>
                )}
              </button>
              <p className="text-[11px] text-center text-slate-400">
                Al confirmar, un asesor técnico revisará tus archivos antes de poner las máquinas en marcha.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
