import React, { useState, useMemo } from 'react';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import ProductImage from '../components/ProductImage';

export default function CatalogPage({ products, selectedProductId, setSelectedProductId, addToast }) {
  const { addToCart } = useCart();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [sortBy, setSortBy] = useState('name-asc');

  // Seed default product list if not provided
  const productList = products || [];

  // Unique categories and brands
  const categories = useMemo(() => ['All', ...new Set(productList.map((p) => p.category))], [productList]);
  const brands = useMemo(() => ['All', ...new Set(productList.map((p) => p.brand))], [productList]);

  // Selected product details
  const selectedProduct = useMemo(() => {
    if (!selectedProductId) return null;
    return productList.find((p) => p.id === selectedProductId);
  }, [selectedProductId, productList]);

  // Filtering
  const filteredProducts = useMemo(() => {
    return productList.filter((p) => {
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                          p.brand.toLowerCase().includes(search.toLowerCase()) ||
                          p.grade.toLowerCase().includes(search.toLowerCase());
      const matchCat = selectedCategory === 'All' || p.category === selectedCategory;
      const matchBrand = selectedBrand === 'All' || p.brand === selectedBrand;
      return matchSearch && matchCat && matchBrand;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
      return b.name.localeCompare(a.name);
    });
  }, [productList, search, selectedCategory, selectedBrand, sortBy]);

  const handleAddClick = (p, qty = 1) => {
    if (p.stock <= 0) {
      if (addToast) addToast('Product out of stock!', 'error');
      return;
    }
    addToCart(p, qty);
    if (addToast) addToast(`Added ${qty} ${p.unit} of ${p.name} to Cart.`);
  };

  return (
    <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-extrabold text-navy">Material Catalogue</h1>
        <p className="text-slate-500 text-sm mt-1">Browse and filter high-quality structural steel and cement brands.</p>
      </div>

      {/* Filters Panel */}
      <div className="bg-white rounded-2xl p-6 shadow-premium border border-slate-100 mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Search */}
        <div className="relative">
          <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-3.5 text-slate-400"></i>
          <input 
            type="text" 
            placeholder="Search steel, cement..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 rounded-xl pl-10 pr-4 py-3 text-sm text-navy focus:outline-none focus:ring-2 focus:ring-teal border border-slate-100"
          />
        </div>

        {/* Category */}
        <div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full bg-slate-50 rounded-xl px-4 py-3 text-sm text-navy focus:outline-none focus:ring-2 focus:ring-teal border border-slate-100"
          >
            {categories.map((c) => (
              <option key={c} value={c}>{c === 'All' ? 'All Categories' : c}</option>
            ))}
          </select>
        </div>

        {/* Brand */}
        <div>
          <select
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
            className="w-full bg-slate-50 rounded-xl px-4 py-3 text-sm text-navy focus:outline-none focus:ring-2 focus:ring-teal border border-slate-100"
          >
            {brands.map((b) => (
              <option key={b} value={b}>{b === 'All' ? 'All Brands' : b}</option>
            ))}
          </select>
        </div>

        {/* Sort */}
        <div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full bg-slate-50 rounded-xl px-4 py-3 text-sm text-navy focus:outline-none focus:ring-2 focus:ring-teal border border-slate-100"
          >
            <option value="name-asc">Sort: A to Z</option>
            <option value="name-desc">Sort: Z to A</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              onViewDetails={setSelectedProductId}
              addToast={addToast}
            />
          ))
        ) : (
          <div className="col-span-full bg-white rounded-2xl p-12 text-center border border-slate-100">
            <i className="fa-solid fa-magnifying-glass-minus text-4xl text-slate-300 mb-4"></i>
            <h4 className="font-display font-bold text-lg text-navy mb-1">No Materials Found</h4>
            <p className="text-slate-500 text-sm">Adjust filters or search parameters.</p>
          </div>
        )}
      </div>

      {/* Details Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 bg-navy/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full shadow-premium border border-slate-100 overflow-hidden relative">
            <button 
              onClick={() => setSelectedProductId(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-navy text-lg p-2 transition-colors z-10"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
            <div className="md:flex">
              <div className="md:w-1/2 p-6 bg-slate-50 flex items-center justify-center">
                <div className="w-56 h-56">
                  <ProductImage type={selectedProduct.image} />
                </div>
              </div>
              <div className="md:w-1/2 p-6 flex flex-col justify-between">
                <div>
                  <div className="flex gap-2 mb-2">
                    <span className="bg-teal/15 text-teal text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">{selectedProduct.category}</span>
                    <span className="bg-slate-100 text-navy text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">{selectedProduct.brand}</span>
                  </div>
                  <h2 className="font-display font-bold text-xl text-navy mb-2">{selectedProduct.name}</h2>
                  <p className="text-xs text-slate-500 leading-relaxed mb-4">{selectedProduct.spec}</p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4 border-y border-slate-100 py-3 text-xs">
                    <div>
                      <span className="text-slate-400 block uppercase font-semibold">Grade</span>
                      <span className="font-semibold text-navy">{selectedProduct.grade}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block uppercase font-semibold">Availability</span>
                      <span className={`font-semibold ${selectedProduct.stock > selectedProduct.lowStock ? 'text-green-600' : 'text-yellow-600'}`}>
                        {selectedProduct.stock.toLocaleString('en-IN')} {selectedProduct.unit}s
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block uppercase font-semibold">Live Base Price</span>
                      <span className="font-display font-extrabold text-teal">₹{selectedProduct.price.toLocaleString('en-IN')}/{selectedProduct.unit}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block uppercase font-semibold">Logistics Estimate</span>
                      <span className="font-semibold text-navy">24 - 48 Hours Dispatch</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                    <button 
                      onClick={() => {
                        const val = document.getElementById('qty-input-mod').value;
                        if (val > 1) document.getElementById('qty-input-mod').value = parseInt(val) - 1;
                      }}
                      className="px-3 py-2 text-slate-500 hover:bg-slate-200 transition-colors"
                    >
                      -
                    </button>
                    <input 
                      type="number" 
                      id="qty-input-mod" 
                      defaultValue="1" 
                      min="1"
                      max={selectedProduct.stock}
                      className="w-12 text-center bg-transparent focus:outline-none text-sm font-bold text-navy" 
                    />
                    <button 
                      onClick={() => {
                        const val = document.getElementById('qty-input-mod').value;
                        if (val < selectedProduct.stock) document.getElementById('qty-input-mod').value = parseInt(val) + 1;
                      }}
                      className="px-3 py-2 text-slate-500 hover:bg-slate-200 transition-colors"
                    >
                      +
                    </button>
                  </div>
                  <button 
                    onClick={() => {
                      const quantity = parseInt(document.getElementById('qty-input-mod').value) || 1;
                      handleAddClick(selectedProduct, quantity);
                      setSelectedProductId(null);
                    }}
                    disabled={selectedProduct.stock <= 0}
                    className={`flex-grow font-bold text-xs py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-1.5 shadow-glow text-white ${
                      selectedProduct.stock > 0 ? 'bg-teal hover:bg-teal-dark' : 'bg-slate-300 cursor-not-allowed'
                    }`}
                  >
                    <i className="fa-solid fa-cart-shopping"></i> Add To Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
