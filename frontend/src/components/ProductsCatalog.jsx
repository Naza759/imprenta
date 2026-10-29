import React, { useState, useEffect } from 'react';
import { Layers, ShoppingCart, Check } from 'lucide-react';
import { fetchProductsApi } from '../services/api';

export default function ProductsCatalog({ onAddToCart }) {
  const [products, setProducts] = useState([]);
  const [selectedCat, setSelectedCat] = useState('Todos');
  const [justAdded, setJustAdded] = useState(null);

  useEffect(() => {
    fetchProductsApi(selectedCat)
      .then((data) => setProducts(data.products || []))
      .catch(console.error);
  }, [selectedCat]);

  const handleAdd = (p) => {
    onAddToCart({
      id: p.id,
      name: p.name,
      description: p.description,
      price: p.price,
      quantity: 1,
      category: p.category,
    });
    setJustAdded(p.id);
    setTimeout(() => setJustAdded(null), 1500);
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-[#2563EB] text-xs font-bold uppercase tracking-wider mb-1">
            <Layers className="w-4 h-4" />
            <span>Packs Frecuentes</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Packs de Impresión Estandarizados
          </h2>
          <p className="text-xs text-slate-500">
            Tiradas con descuentos aplicados listas para enviar a imprenta.
          </p>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1">
          {['Todos', 'Lonas', 'Folletería', 'Tarjetas', 'Textil'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCat(cat)}
              className={`py-1.5 px-3.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                selectedCat === cat
                  ? 'bg-[#2563EB] text-white'
                  : 'bg-white border text-slate-600 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((p) => (
          <div
            key={p.id}
            className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-lg transition flex flex-col justify-between"
          >
            <div className="relative aspect-4/3 w-full bg-slate-100">
              <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />
              <span className="absolute top-2 left-2 bg-white/90 backdrop-blur-xs text-[10px] font-bold uppercase px-2 py-0.5 rounded-full text-slate-800">
                {p.category}
              </span>
            </div>

            <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
              <div>
                <h4 className="font-bold text-sm text-slate-900 line-clamp-1">{p.name}</h4>
                <p className="text-xs text-slate-500 line-clamp-2 mt-1">{p.description}</p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t">
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold">Tirada desde</span>
                  <span className="text-base font-black text-[#2563EB]">${p.price.toFixed(2)}</span>
                </div>
                <button
                  onClick={() => handleAdd(p)}
                  className="py-1.5 px-3 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  {justAdded === p.id ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Agregado</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-3.5 h-3.5" />
                      <span>Encargar</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
