import React from 'react';
import ProductImage from './ProductImage';
import { useCart } from '../context/CartContext';

/**
 * ProductCard - Reusable catalogue item card.
 * @param {Object}   product           - Product data object
 * @param {Function} onViewDetails     - Opens the product detail modal
 * @param {Function} addToast          - Toast notification callback
 */
export default function ProductCard({ product, onViewDetails, addToast }) {
  const { addToCart } = useCart();

  const isLowStock = product.stock <= product.lowStock;
  const isOutOfStock = product.stock === 0;

  const handleAddToCart = () => {
    if (isOutOfStock) {
      if (addToast) addToast('This product is currently out of stock!', 'error');
      return;
    }
    addToCart(product, 1);
    if (addToast) addToast(`Added 1 ${product.unit} of ${product.name} to cart.`);
  };

  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-premium border border-slate-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
      {/* Image */}
      <div className="relative h-44 w-full p-4 flex items-center justify-center bg-slate-50/60">
        <ProductImage type={product.image} />

        {/* Stock badge */}
        {isLowStock && (
          <span
            className={`absolute top-3 right-3 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded shadow ${
              isOutOfStock ? 'bg-red-500 text-white' : 'bg-yellow-400 text-navy'
            }`}
          >
            {isOutOfStock ? 'Out of Stock' : 'Low Stock'}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-5 flex-grow">
        <div className="flex justify-between items-center mb-2">
          <span className="text-[10px] bg-slate-100 text-navy font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
            {product.brand}
          </span>
          <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
            {product.grade}
          </span>
        </div>

        <h3 className="font-display font-bold text-base text-navy line-clamp-2 mb-2 leading-snug">
          {product.name}
        </h3>

        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-3">
          {product.spec}
        </p>

        {/* Stock indicator */}
        <div className="flex items-center gap-1.5">
          <span
            className={`w-2 h-2 rounded-full flex-shrink-0 ${
              isOutOfStock ? 'bg-red-500' : isLowStock ? 'bg-yellow-500' : 'bg-green-500'
            }`}
          ></span>
          <span className="text-xs text-slate-500">
            Stock:{' '}
            <strong className="text-navy">
              {product.stock.toLocaleString('en-IN')} {product.unit}
            </strong>
          </span>
        </div>
      </div>

      {/* Footer */}
      <div className="px-5 pb-5 pt-3 border-t border-slate-50 bg-slate-50/50">
        <div className="flex justify-between items-baseline mb-3">
          <span className="text-[10px] text-slate-400 uppercase font-semibold">Live Price</span>
          <span className="font-display font-extrabold text-navy text-lg">
            ₹{product.price.toLocaleString('en-IN')}
            <span className="text-xs font-normal text-slate-400">/{product.unit}</span>
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => onViewDetails && onViewDetails(product.id)}
            className="bg-slate-100 hover:bg-slate-200 text-navy font-semibold text-xs py-2.5 rounded-lg transition-colors text-center"
          >
            <i className="fa-solid fa-eye mr-1"></i> Specs
          </button>
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`font-bold text-xs py-2.5 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              isOutOfStock
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                : 'bg-teal hover:bg-teal-dark text-white shadow-glow'
            }`}
          >
            <i className="fa-solid fa-cart-plus"></i>
            {isOutOfStock ? 'Unavailable' : 'Add'}
          </button>
        </div>
      </div>
    </div>
  );
}
