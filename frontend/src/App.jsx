import React, { useState, useEffect } from 'react';
import DemoBanner from './components/DemoBanner';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import PrintingCalculator from './components/PrintingCalculator';
import ProductsCatalog from './components/ProductsCatalog';
import { LoginModal, RegisterModal } from './components/AuthModals';
import { CartDrawer, OrdersModal } from './components/CartAndOrders';

export default function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [cart, setCart] = useState([]);

  // Modals
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);

  // Load saved session and cart from localStorage
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('imprentapro_user');
      const savedToken = localStorage.getItem('imprentapro_token');
      const savedCart = localStorage.getItem('imprentapro_cart');

      if (savedUser && savedToken) {
        setUser(JSON.parse(savedUser));
        setToken(savedToken);
      }
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
    } catch {
      // Ignore parse errors
    }
  }, []);

  const handleLoginSuccess = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);
    localStorage.setItem('imprentapro_user', JSON.stringify(userData));
    localStorage.setItem('imprentapro_token', userToken);
  };

  const handleLogout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('imprentapro_user');
    localStorage.removeItem('imprentapro_token');
  };

  const handleAddToCart = (item) => {
    setCart((prev) => {
      const updated = [...prev, item];
      localStorage.setItem('imprentapro_cart', JSON.stringify(updated));
      return updated;
    });
    setIsCartOpen(true);
  };

  const handleRemoveFromCart = (index) => {
    setCart((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      localStorage.setItem('imprentapro_cart', JSON.stringify(updated));
      return updated;
    });
  };

  const handleClearCart = () => {
    setCart([]);
    localStorage.removeItem('imprentapro_cart');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 antialiased">
      {/* 2. Banner Superior de Accesos (Demo Alert Banner) */}
      <DemoBanner onOpenLogin={() => setIsLoginOpen(true)} />

      {/* 1. Header / Navegación Superior */}
      <Navbar
        user={user}
        onLogout={handleLogout}
        onOpenLogin={() => setIsLoginOpen(true)}
        onOpenRegister={() => setIsRegisterOpen(true)}
        onOpenOrders={() => setIsOrdersOpen(true)}
        cartCount={cart.length}
        onOpenCart={() => setIsCartOpen(true)}
      />

      {/* 3. Sección Hero Central */}
      <main className="flex-1 space-y-12 pb-16">
        <Hero />

        {/* 4. Card / Sección Principal de la Calculadora */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <PrintingCalculator onAddToCart={handleAddToCart} />
        </section>

        {/* Packs listos para imprimir */}
        <ProductsCatalog onAddToCart={handleAddToCart} />
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-8 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 ImprentaPro (Arquitectura Frontend + Backend). Todos los derechos reservados.</p>
          <div className="flex gap-4">
            <span>Términos de servicio</span>
            <span>•</span>
            <span>Privacidad de archivos</span>
            <span>•</span>
            <span>Garantía de impresión</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      <RegisterModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        onRegisterSuccess={handleLoginSuccess}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onRemove={handleRemoveFromCart}
        onClear={handleClearCart}
        user={user}
        token={token}
        onOrderSuccess={() => setIsOrdersOpen(true)}
      />

      <OrdersModal
        isOpen={isOrdersOpen}
        onClose={() => setIsOrdersOpen(false)}
        user={user}
        token={token}
      />
    </div>
  );
}
