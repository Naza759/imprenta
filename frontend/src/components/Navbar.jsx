import React from 'react';
import {
  Printer,
  Calculator,
  ShoppingCart,
  User as UserIcon,
  LogOut,
  ShieldAlert,
  Package,
} from 'lucide-react';

export default function Navbar({
  user,
  onLogout,
  onOpenLogin,
  onOpenRegister,
  onOpenOrders,
  cartCount,
  onOpenCart,
}) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur-md shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo a la izquierda con icono de impresora + Badge Prototipo MVP */}
          <a href="#" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-[#2563EB] flex items-center justify-center text-white shadow-md shadow-blue-500/25 group-hover:bg-blue-700 transition">
              <Printer className="w-6 h-6" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-black tracking-tight text-slate-900">
                Imprenta<span className="text-[#2563EB]">Pro</span>
              </span>
              <span className="text-[11px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full bg-blue-100 text-[#2563EB] border border-blue-200">
                Prototipo MVP
              </span>
            </div>
          </a>

          {/* Menú a la derecha */}
          <nav className="flex items-center gap-4 sm:gap-6 text-sm font-semibold text-slate-600">
            <a
              href="#cotizador"
              className="flex items-center gap-1.5 hover:text-[#2563EB] transition"
            >
              <Calculator className="w-4 h-4 text-[#2563EB]" />
              <span className="hidden sm:inline">Cotizador</span>
            </a>

            {user?.role === 'cliente' && (
              <button
                onClick={onOpenOrders}
                className="flex items-center gap-1.5 hover:text-[#2563EB] transition cursor-pointer"
              >
                <Package className="w-4 h-4 text-[#2563EB]" />
                <span className="hidden sm:inline">Mis Pedidos</span>
              </button>
            )}

            {user?.role === 'empleado' && (
              <button
                onClick={onOpenOrders}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 font-bold transition border border-amber-500/30 cursor-pointer"
              >
                <ShieldAlert className="w-4 h-4" />
                <span>Panel de Producción</span>
              </button>
            )}

            {/* Carrito */}
            <button
              onClick={onOpenCart}
              className="relative p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition flex items-center gap-1.5 cursor-pointer border border-slate-200"
            >
              <ShoppingCart className="w-4 h-4 text-[#2563EB]" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#2563EB] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
              <span className="text-xs font-bold hidden sm:inline">Carrito</span>
            </button>

            {/* Auth Buttons */}
            {user ? (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                <div className="flex items-center gap-2 bg-slate-100 py-1.5 px-3 rounded-xl border border-slate-200">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold text-white ${
                      user.role === 'empleado' ? 'bg-amber-600' : 'bg-[#2563EB]'
                    }`}
                  >
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="text-left text-xs hidden md:block">
                    <p className="font-bold text-slate-900 leading-tight max-w-[90px] truncate">
                      {user.name}
                    </p>
                    <span className="text-[10px] uppercase font-bold text-slate-500">
                      {user.role}
                    </span>
                  </div>
                </div>

                <button
                  onClick={onLogout}
                  title="Cerrar sesión"
                  className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 sm:gap-3">
                <button
                  onClick={onOpenLogin}
                  className="hover:text-[#2563EB] transition font-bold cursor-pointer text-xs sm:text-sm"
                >
                  Iniciar Sesión
                </button>
                <button
                  onClick={onOpenRegister}
                  className="bg-[#2563EB] hover:bg-blue-700 text-white font-bold py-2 px-3 sm:px-4 rounded-xl shadow-sm shadow-blue-500/25 transition flex items-center gap-1.5 cursor-pointer text-xs sm:text-sm"
                >
                  <UserIcon className="w-4 h-4" />
                  <span>Registrarse</span>
                </button>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
