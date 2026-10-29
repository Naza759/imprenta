import React, { useState, useEffect, useCallback } from 'react';
import { X, Trash2, ShoppingCart, ArrowRight, Printer, CheckCircle2, Clock, Truck, ShieldAlert } from 'lucide-react';
import { createOrderApi, fetchOrdersApi, updateOrderStatusApi } from '../services/api';

export function CartDrawer({ isOpen, onClose, cart, onRemove, onClear, user, token, onOrderSuccess }) {
  const [checkingOut, setCheckingOut] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState(user?.address || 'Retiro en Taller Central');
  const [loading, setLoading] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState(null);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setPhone(user.phone || '');
      setAddress(user.address || 'Retiro en Taller Central');
    }
  }, [user]);

  if (!isOpen) return null;

  const total = cart.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);

  const handleConfirmOrder = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        items: cart.map((c) => ({
          name: c.name,
          price: c.price,
          quantity: c.quantity || 1,
        })),
        customer_name: name,
        customer_email: email,
        customer_phone: phone,
        shipping_address: address,
      };

      const result = await createOrderApi(payload, token);
      setConfirmedOrder(result);
      onClear();
      onOrderSuccess();
    } catch (err) {
      alert(err.message || 'Error al enviar orden');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div onClick={onClose} className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs" />
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white shadow-2xl flex flex-col border-l border-slate-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-[#2563EB]" />
            <h3 className="font-bold text-base text-slate-900">
              {confirmedOrder ? '¡Orden Confirmada!' : `Tu Pedido (${cart.length})`}
            </h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {confirmedOrder ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h4 className="text-xl font-bold text-slate-900">¡Trabajo enviado al Taller!</h4>
            <p className="text-xs text-slate-600">
              Número de orden: <strong className="text-[#2563EB]">#{confirmedOrder.orderId}</strong>.
            </p>
            <div className="p-4 bg-slate-50 rounded-2xl border text-xs text-left space-y-1">
              <div className="flex justify-between font-bold">
                <span>Total a facturar:</span>
                <span className="text-[#2563EB]">${confirmedOrder.total?.toFixed(2)}</span>
              </div>
              <p className="text-slate-500 pt-1">
                Estado inicial: <strong>En Revisión Técnica</strong>
              </p>
            </div>
            <button
              onClick={() => {
                setConfirmedOrder(null);
                setCheckingOut(false);
                onClose();
              }}
              className="w-full py-2.5 rounded-xl bg-[#2563EB] text-white font-bold text-xs"
            >
              Cerrar y continuar
            </button>
          </div>
        ) : (
          <>
            {/* Lista de productos */}
            <div className="flex-1 overflow-y-auto p-6 space-y-3">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-2 text-slate-400">
                  <Printer className="w-12 h-12 opacity-30" />
                  <p className="font-bold text-sm">Tu pedido está vacío</p>
                  <p className="text-xs">Usa la calculadora para generar un presupuesto a medida.</p>
                </div>
              ) : checkingOut ? (
                <form onSubmit={handleConfirmOrder} className="space-y-3 text-xs">
                  <p className="font-bold text-slate-800 text-sm">Datos para la orden y remito:</p>
                  <div>
                    <label className="block font-bold text-slate-600 mb-1">Nombre / Empresa *</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3 py-2 border rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-600 mb-1">Correo Electrónico *</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2 border rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-600 mb-1">Teléfono / WhatsApp *</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3 py-2 border rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-600 mb-1">Dirección de Entrega o Retiro *</label>
                    <input
                      type="text"
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full px-3 py-2 border rounded-xl"
                    />
                  </div>
                  <div className="pt-2 flex gap-2">
                    <button
                      type="button"
                      onClick={() => setCheckingOut(false)}
                      className="flex-1 py-2 border rounded-xl font-bold"
                    >
                      Atrás
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 py-2 bg-[#2563EB] text-white rounded-xl font-bold"
                    >
                      {loading ? 'Enviando...' : 'Confirmar Orden'}
                    </button>
                  </div>
                </form>
              ) : (
                cart.map((item, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-start justify-between gap-2">
                    <div>
                      <p className="font-bold text-xs text-slate-900">{item.name}</p>
                      <p className="text-[11px] text-slate-500 line-clamp-1">{item.description}</p>
                      <p className="text-xs font-black text-[#2563EB] mt-1">${item.price.toFixed(2)}</p>
                    </div>
                    <button onClick={() => onRemove(idx)} className="text-slate-400 hover:text-red-500 p-1">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Footer con Total */}
            {cart.length > 0 && !checkingOut && (
              <div className="p-6 border-t border-slate-200 bg-slate-50 space-y-3">
                <div className="flex justify-between items-baseline">
                  <span className="text-sm font-bold text-slate-600">Total Presupuestado:</span>
                  <span className="text-2xl font-black text-[#2563EB]">${total.toFixed(2)}</span>
                </div>
                <button
                  onClick={() => setCheckingOut(true)}
                  className="w-full py-3 px-4 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Proceder a Confirmar Orden</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}

export function OrdersModal({ isOpen, onClose, user, token }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadOrders = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchOrdersApi(token);
      setOrders(data.orders || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (isOpen) loadOrders();
  }, [isOpen, loadOrders]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatusApi(orderId, newStatus, token);
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
    } catch (err) {
      alert(err.message || 'Error al actualizar estado');
    }
  };

  if (!isOpen) return null;

  const isEmployee = user?.role === 'empleado';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden max-h-[85vh] flex flex-col">
        
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-2">
            {isEmployee ? (
              <ShieldAlert className="w-5 h-5 text-amber-500" />
            ) : (
              <Clock className="w-5 h-5 text-[#2563EB]" />
            )}
            <h3 className="font-bold text-base text-slate-900">
              {isEmployee ? 'Panel de Producción (Empleado)' : 'Mis Pedidos de Impresión'}
            </h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {loading ? (
            <p className="text-center text-xs text-slate-500 py-8">Consultando backend...</p>
          ) : orders.length === 0 ? (
            <p className="text-center text-xs text-slate-500 py-8">No hay órdenes registradas.</p>
          ) : (
            orders.map((o) => (
              <div key={o.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <span className="font-mono font-bold text-sm text-[#2563EB]">Orden #{o.id}</span>
                    <span className="text-[11px] text-slate-400 ml-2">
                      {new Date(o.created_at).toLocaleString('es-AR')}
                    </span>
                    <p className="font-bold text-xs text-slate-800 mt-0.5">
                      {o.customer_name} ({o.customer_email})
                    </p>
                  </div>

                  {isEmployee ? (
                    <select
                      value={o.status}
                      onChange={(e) => handleStatusChange(o.id, e.target.value)}
                      className="text-xs font-bold py-1 px-2.5 rounded-lg border bg-white cursor-pointer"
                    >
                      <option value="En Revisión Técnica">En Revisión Técnica</option>
                      <option value="En Impresión">En Impresión</option>
                      <option value="En Acabado">En Acabado</option>
                      <option value="Listo para Retiro">Listo para Retiro</option>
                      <option value="Entregado">Entregado</option>
                    </select>
                  ) : (
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-100 text-[#2563EB]">
                      {o.status}
                    </span>
                  )}
                </div>

                <div className="text-xs bg-white p-2.5 rounded-xl border border-slate-100">
                  <ul className="list-disc list-inside text-slate-700">
                    {o.items?.map((it, i) => (
                      <li key={i}>
                        {it.quantity}x {it.product_name} (${Number(it.price).toFixed(2)})
                      </li>
                    ))}
                  </ul>
                  <div className="flex justify-between items-center pt-2 mt-2 border-t font-bold">
                    <span>Total Orden:</span>
                    <span className="text-[#2563EB]">${Number(o.total).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
