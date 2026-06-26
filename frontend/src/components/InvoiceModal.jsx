import React from 'react';

export default function InvoiceModal({ order, onClose }) {
  const handlePrint = () => {
    window.print();
  };

  const invoiceNumber = 'INV-' + order.id.replace('ORD-', '');
  const cgst = Math.round(order.gst / 2);
  const sgst = Math.round(order.gst / 2);

  return (
    <div className="fixed inset-0 z-50 bg-navy/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full shadow-premium border border-slate-100 overflow-hidden my-8">
        {/* Modal Header */}
        <div className="bg-navy text-white px-6 py-4 flex justify-between items-center print:hidden">
          <span className="font-display font-bold text-sm">GST Tax Invoice Generated</span>
          <div className="flex gap-2">
            <button 
              onClick={handlePrint}
              className="bg-teal hover:bg-teal-dark text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors"
            >
              <i className="fa-solid fa-print"></i> Print / Save PDF
            </button>
            <button 
              onClick={onClose}
              className="bg-slate-700 hover:bg-slate-600 text-slate-300 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>

        {/* Invoice PDF Print Canvas */}
        <div id="print-area" className="p-8 sm:p-12 space-y-8 bg-white text-slate-800 text-xs">
          {/* Header */}
          <div className="flex justify-between items-start border-b border-slate-200 pb-6">
            <div>
              <h1 className="font-display font-extrabold text-2xl text-navy">SAI TEJA TRADERS</h1>
              <span className="text-[10px] text-slate-400 block font-semibold">STEEL & CEMENT SUPPLY HUB</span>
              <p className="text-[10px] text-slate-500 mt-2 max-w-xs">
                Industrial Estate, Jeedimetla, Hyderabad, Telangana, 500055. <br/>
                Email: finance@saitejatraders.com | Support: +91 90001 23456
              </p>
            </div>
            <div className="text-right">
              <h2 className="font-display font-black text-xl text-teal uppercase">TAX INVOICE</h2>
              <div className="mt-2 text-slate-500 space-y-0.5">
                <p>GSTIN: <strong>36AAAAA1111A1Z1</strong></p>
                <p>Invoice No: <strong>{invoiceNumber}</strong></p>
                <p>Date of Issue: <strong>{order.date}</strong></p>
              </div>
            </div>
          </div>

          {/* Bill To & Ship To */}
          <div className="grid grid-cols-2 gap-8 border-b border-slate-200 pb-6">
            <div>
              <h3 className="font-bold text-[10px] uppercase text-slate-400 mb-2">Billed To (Customer Details):</h3>
              <p className="font-bold text-sm text-navy">{order.customerName}</p>
              <p className="text-slate-500 mt-1">Mobile: {order.customerMobile}</p>
              <p className="text-slate-500">Corporate GSTIN: <strong className="uppercase">{order.customerGST}</strong></p>
            </div>
            <div>
              <h3 className="font-bold text-[10px] uppercase text-slate-400 mb-2">Logistics Site Address:</h3>
              <p className="text-slate-600 leading-relaxed">{order.deliveryAddress}</p>
              <p className="text-slate-500 mt-2">Preferred Delivery Date: <strong>{order.deliveryDate}</strong></p>
            </div>
          </div>

          {/* Items Table */}
          <div>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-300 text-slate-400 font-bold uppercase text-[9px]">
                  <th className="py-2.5">Material Description</th>
                  <th className="py-2.5 text-right">Qty</th>
                  <th className="py-2.5 text-right">Unit Price (₹)</th>
                  <th className="py-2.5 text-right">Total (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-navy font-medium">
                {order.items.map((it, idx) => (
                  <tr key={idx}>
                    <td className="py-3 font-semibold text-sm">{it.name}</td>
                    <td className="py-3 text-right">{it.quantity} {it.unit}s</td>
                    <td className="py-3 text-right">₹{it.price.toLocaleString('en-IN')}</td>
                    <td className="py-3 text-right">₹{(it.price * it.quantity).toLocaleString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="border-t border-slate-200 pt-6 flex justify-end">
            <div className="w-64 space-y-2 text-slate-500 font-semibold text-right">
              <div className="flex justify-between">
                <span>Taxable Value (Subtotal):</span>
                <span className="text-navy">₹{order.subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span>Integrated CGST (9%):</span>
                <span className="text-navy">₹{cgst.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span>Integrated SGST (9%):</span>
                <span className="text-navy">₹{sgst.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span>Logistics Flat Transport:</span>
                <span className="text-green-600 font-bold">FREE</span>
              </div>
              <hr className="border-slate-200 my-1" />
              <div className="flex justify-between text-sm font-display font-extrabold text-navy">
                <span>Total Tax-Paid Bill:</span>
                <span className="text-teal text-base">₹{order.total.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Signatures */}
          <div className="flex justify-between items-end border-t border-slate-100 pt-8 text-[9px] text-slate-400">
            <div>
              <p>Payment Mode: <strong>{order.paymentMethod}</strong></p>
              <p>Payment Status: <strong>{order.paymentStatus}</strong></p>
            </div>
            <div className="text-center">
              <div className="w-28 border-b border-slate-300 mx-auto mb-1"></div>
              <span>Authorized Signature</span>
              <p className="font-bold text-navy mt-0.5">Sai Teja Traders Finance</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
