import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import InvoiceModal from './components/InvoiceModal';
import Toast from './components/Toast';
import PriceTicker from './components/PriceTicker';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import HomePage from './pages/HomePage';
import CatalogPage from './pages/CatalogPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import TrackingPage from './pages/TrackingPage';
import CustomerDashboard from './pages/CustomerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import AuthPage from './pages/AuthPage';

// ─── Default Seed Data ────────────────────────────────────────────────────────
const defaultProducts = [
  {
    id: 'p1', name: 'JSW NeoSteel TMT Rebars', category: 'Steel TMT Bars',
    brand: 'JSW', grade: 'Fe-550D', price: 54500, unit: 'Ton', stock: 120, lowStock: 25,
    spec: 'High ductility, earthquake-resistant ribbed design, available in 8mm–32mm sizes. Corrosion-resistant coating.',
    image: 'steel-jsw'
  },
  {
    id: 'p2', name: 'Tata Tiscon 550SD', category: 'Steel TMT Bars',
    brand: 'Tata', grade: 'Fe-550SD', price: 56200, unit: 'Ton', stock: 85, lowStock: 20,
    spec: 'Super Ductile rebars, micro-alloyed for superior bendability, rust-resistant ribs for maximum concrete bond.',
    image: 'steel-tata'
  },
  {
    id: 'p3', name: 'Vizag Steel TMT Bars', category: 'Steel TMT Bars',
    brand: 'Vizag', grade: 'Fe-500D', price: 51900, unit: 'Ton', stock: 6, lowStock: 15,
    spec: 'RINL Vizag steel, exceptionally clean with low sulphur & phosphorus. Ideal for high-seismic zones.',
    image: 'steel-vizag'
  },
  {
    id: 'p4', name: 'UltraTech Premium OPC 53', category: 'Cement',
    brand: 'UltraTech', grade: 'Grade 53', price: 425, unit: 'Bag', stock: 1450, lowStock: 200,
    spec: 'Ordinary Portland Cement with high 28-day compressive strength. Ideal for RCC structures.',
    image: 'cement-ultratech'
  },
  {
    id: 'p5', name: 'Dalmia Supreme PPC Cement', category: 'Cement',
    brand: 'Dalmia', grade: 'PPC', price: 385, unit: 'Bag', stock: 950, lowStock: 150,
    spec: 'Portland Pozzolana Cement, crack-resistant, low heat of hydration. Excellent for wet environments.',
    image: 'cement-dalmia'
  },
  {
    id: 'p6', name: 'ACC Gold Water Shield', category: 'Cement',
    brand: 'ACC', grade: 'Grade 53', price: 445, unit: 'Bag', stock: 18, lowStock: 50,
    spec: 'Premium water-repellent cement with Active Water Shield™ technology. Perfect for basements.',
    image: 'cement-acc'
  },
  {
    id: 'p7', name: 'Tata Wiron Gi Binding Wire', category: 'Binding Wire',
    brand: 'Tata', grade: '18 Gauge', price: 7900, unit: 'Bundle', stock: 45, lowStock: 10,
    spec: 'Hot-dip galvanized iron wire. Highly flexible for binding rebar cages. Bundle weight: 25 kg.',
    image: 'wire-tata'
  },
  {
    id: 'p8', name: 'Standard Concrete Cover Blocks', category: 'Construction Materials',
    brand: 'Local', grade: '20/25/30mm', price: 350, unit: 'Box', stock: 120, lowStock: 30,
    spec: 'Pre-cast concrete spacer blocks ensuring specified rebar cover in slabs and columns.',
    image: 'materials-cover'
  },
];

const defaultPricesHistory = [
  { category: 'Steel TMT Bars', currentPrice: 54500, previousPrice: 55000, lastUpdated: 'Today' },
  { category: 'Cement',         currentPrice: 425,   previousPrice: 420,   lastUpdated: 'Today' },
  { category: 'Binding Wire',   currentPrice: 7900,  previousPrice: 7850,  lastUpdated: 'Yesterday' },
];

const defaultOrders = [
  {
    id: 'ORD-98721',
    customerName: 'Bharath Builders',
    customerMobile: '9876543210',
    customerGST: '36AAAAA1111A1Z1',
    deliveryAddress: 'Plot 42, Hitec City, Hyderabad, 500081',
    date: '2026-06-18',
    deliveryDate: '2026-06-21',
    items: [
      { productId: 'p1', name: 'JSW NeoSteel TMT Rebars', quantity: 2, price: 54500, unit: 'Ton' },
      { productId: 'p4', name: 'UltraTech Premium OPC 53', quantity: 100, price: 425, unit: 'Bag' },
    ],
    subtotal: 151500,
    gst: 27270,
    total: 178770,
    paymentMethod: 'Credit Account',
    paymentStatus: 'Paid',
    deliveryStatus: 'Processing',
    trackingHistory: [
      { status: 'Order Confirmed', time: '2026-06-18 10:30 AM', comment: 'Order placed and B2B credit check completed.' },
      { status: 'Processing',      time: '2026-06-18 02:45 PM', comment: 'Inventory allocated at warehouse.' },
    ],
  },
];

// ─── App Root ─────────────────────────────────────────────────────────────────
export default function App() {
  const [activePage,              setActivePage]              = useState('home');
  const [selectedProductId,       setSelectedProductId]       = useState(null);
  const [trackingOrderId,         setTrackingOrderId]         = useState('');
  const [selectedOrderForInvoice, setSelectedOrderForInvoice] = useState(null);
  const [toasts,                  setToasts]                  = useState([]);

  // LocalStorage-backed state for offline/standalone mode
  const [products, setProducts] = useState(() => {
    try { return JSON.parse(localStorage.getItem('st_prod_db')) || defaultProducts; }
    catch { return defaultProducts; }
  });

  const [pricesHistory, setPricesHistory] = useState(() => {
    try { return JSON.parse(localStorage.getItem('st_price_db')) || defaultPricesHistory; }
    catch { return defaultPricesHistory; }
  });

  const [orders, setOrders] = useState(() => {
    try { return JSON.parse(localStorage.getItem('st_order_db')) || defaultOrders; }
    catch { return defaultOrders; }
  });

  // Sync to localStorage on change
  useEffect(() => { localStorage.setItem('st_prod_db',  JSON.stringify(products));      }, [products]);
  useEffect(() => { localStorage.setItem('st_price_db', JSON.stringify(pricesHistory)); }, [pricesHistory]);
  useEffect(() => { localStorage.setItem('st_order_db', JSON.stringify(orders));        }, [orders]);

  // ── Toast helper ────────────────────────────────────────────────────────────
  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4200);
  };

  // ── Navigation helper ────────────────────────────────────────────────────────
  const navigate = (page) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setActivePage(page);
  };

  // ── Order success handler ────────────────────────────────────────────────────
  const handleOrderSuccess = (newOrder) => {
    setOrders((prev) => [newOrder, ...prev]);
    setSelectedOrderForInvoice(newOrder);
  };

  // ─── Determine if ticker should be visible (not on auth/home pages) ──────────
  const showTicker = !['home', 'auth'].includes(activePage);

  return (
    <AuthProvider>
      <CartProvider>
        <div className="min-h-screen flex flex-col justify-between bg-lightBg font-sans text-navy">

          {/* ── Toast Notifications ── */}
          <Toast toasts={toasts} />

          {/* ── Navigation Bar ── */}
          <Navbar activePage={activePage} navigate={navigate} />

          {/* ── Live Price Ticker (visible on all pages except home & auth) ── */}
          {showTicker && (
            <div className="pt-20">
              <PriceTicker pricesHistory={pricesHistory} />
            </div>
          )}

          {/* ── Page Router ── */}
          <main className={`flex-grow ${showTicker ? '' : 'pt-20'}`}>

            {activePage === 'home' && (
              <HomePage
                navigate={navigate}
                pricesHistory={pricesHistory}
                products={products}
                setSelectedProductId={(id) => { setSelectedProductId(id); navigate('catalog'); }}
              />
            )}

            {activePage === 'catalog' && (
              <CatalogPage
                products={products}
                selectedProductId={selectedProductId}
                setSelectedProductId={setSelectedProductId}
                addToast={addToast}
                navigate={navigate}
              />
            )}

            {activePage === 'cart' && (
              <CartPage
                navigate={navigate}
                addToast={addToast}
              />
            )}

            {activePage === 'checkout' && (
              <ProtectedRoute navigate={navigate} addToast={addToast}>
                <CheckoutPage
                  navigate={navigate}
                  addToast={addToast}
                  onOrderSuccess={handleOrderSuccess}
                  setSelectedOrderForInvoice={setSelectedOrderForInvoice}
                />
              </ProtectedRoute>
            )}

            {activePage === 'tracking' && (
              <TrackingPage
                orders={orders}
                trackingOrderId={trackingOrderId}
                setTrackingOrderId={setTrackingOrderId}
              />
            )}

            {activePage === 'customer' && (
              <ProtectedRoute navigate={navigate} addToast={addToast} role="customer">
                <CustomerDashboard
                  orders={orders}
                  navigate={navigate}
                  setTrackingOrderId={setTrackingOrderId}
                  setSelectedOrderForInvoice={setSelectedOrderForInvoice}
                />
              </ProtectedRoute>
            )}

            {activePage === 'admin' && (
              <ProtectedRoute navigate={navigate} addToast={addToast} role="admin">
                <AdminDashboard
                  products={products}
                  setProducts={setProducts}
                  orders={orders}
                  setOrders={setOrders}
                  pricesHistory={pricesHistory}
                  setPricesHistory={setPricesHistory}
                  addToast={addToast}
                  setSelectedOrderForInvoice={setSelectedOrderForInvoice}
                  navigate={navigate}
                />
              </ProtectedRoute>
            )}

            {activePage === 'auth' && (
              <AuthPage
                navigate={navigate}
                addToast={addToast}
              />
            )}

          </main>

          {/* ── Invoice Modal Overlay ── */}
          {selectedOrderForInvoice && (
            <InvoiceModal
              order={selectedOrderForInvoice}
              onClose={() => setSelectedOrderForInvoice(null)}
            />
          )}

          {/* ── Footer ── */}
          <Footer navigate={navigate} />

        </div>
      </CartProvider>
    </AuthProvider>
  );
}
