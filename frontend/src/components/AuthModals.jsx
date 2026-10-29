import React, { useState } from 'react';
import { X, KeyRound, User, ShieldAlert, Sparkles, AlertCircle, CheckCircle, UserPlus, Printer } from 'lucide-react';
import { loginApi, registerApi } from '../services/api';

export function LoginModal({ isOpen, onClose, onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const data = await loginApi(email, password);
      onLoginSuccess(data.user, data.token);
      onClose();
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  const fillClient = () => {
    setEmail('cliente@gmail.com');
    setPassword('cliente123');
    setError(null);
  };

  const fillEmployee = () => {
    setEmail('empleado@imprentapro.com');
    setPassword('admin123');
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-2">
            <Printer className="w-5 h-5 text-[#2563EB]" />
            <h3 className="font-bold text-base text-slate-900">Iniciar Sesión en ImprentaPro</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Accesos rápidos */}
          <div className="bg-[#0B1120] text-slate-200 p-3 rounded-2xl border border-slate-800 space-y-2 text-xs">
            <div className="flex items-center gap-1.5 text-amber-400 font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Accesos Rápidos Demo (1 clic):</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={fillClient}
                className="py-1.5 px-2 rounded-xl bg-slate-900 border border-slate-700 text-blue-300 hover:bg-slate-800 flex items-center justify-center gap-1 cursor-pointer font-semibold"
              >
                <User className="w-3 h-3 text-blue-400" />
                <span>Como Cliente</span>
              </button>
              <button
                type="button"
                onClick={fillEmployee}
                className="py-1.5 px-2 rounded-xl bg-slate-900 border border-slate-700 text-amber-300 hover:bg-slate-800 flex items-center justify-center gap-1 cursor-pointer font-semibold"
              >
                <ShieldAlert className="w-3 h-3 text-amber-400" />
                <span>Como Empleado</span>
              </button>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 text-xs text-red-700 bg-red-50 rounded-xl border border-red-200">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3 text-xs">
            <div>
              <label className="block font-bold uppercase text-slate-600 mb-1">Correo Electrónico</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="usuario@ejemplo.com"
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
              />
            </div>

            <div>
              <label className="block font-bold uppercase text-slate-600 mb-1">Contraseña</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-500/25 transition disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
            >
              <KeyRound className="w-4 h-4" />
              <span>{loading ? 'Verificando con Backend...' : 'Entrar a mi Cuenta'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export function RegisterModal({ isOpen, onClose, onRegisterSuccess }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const data = await registerApi({ name, email, password, phone, address });
      onRegisterSuccess(data.user, data.token);
      onClose();
    } catch (err) {
      setError(err.message || 'Error al registrar cliente');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
        
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-[#2563EB]" />
            <h3 className="font-bold text-base text-slate-900">Crear Cuenta de Cliente</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 text-xs text-red-700 bg-red-50 rounded-xl border border-red-200">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="p-2.5 bg-blue-50 rounded-xl border border-blue-100 text-[11px] text-blue-800">
            🛡️ <strong>Exclusivo Clientes:</strong> Las cuentas de empleado de taller son asignadas internamente.
          </div>

          <form onSubmit={handleSubmit} className="space-y-3 text-xs">
            <div>
              <label className="block font-bold uppercase text-slate-600 mb-1">Nombre o Empresa *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej. Estudio Creativo / Juan Pérez"
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300"
              />
            </div>

            <div>
              <label className="block font-bold uppercase text-slate-600 mb-1">Correo Electrónico *</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="cliente@ejemplo.com"
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300"
              />
            </div>

            <div>
              <label className="block font-bold uppercase text-slate-600 mb-1">Contraseña (Mínimo 6) *</label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-bold uppercase text-slate-600 mb-1">Teléfono</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+54 9 11..."
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300"
                />
              </div>
              <div>
                <label className="block font-bold uppercase text-slate-600 mb-1">Dirección</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Calle, Ciudad"
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-500/25 transition disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              <span>{loading ? 'Creando cuenta...' : 'Crear Cuenta de Cliente'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
