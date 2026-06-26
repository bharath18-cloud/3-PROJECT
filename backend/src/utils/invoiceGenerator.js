/**
 * Tax Invoice Generator Utility
 * Prepares detailed layout data representing compliant B2B receipts.
 * In a production server, this could compile to real PDF binaries using libraries like pdfkit or html-pdf.
 */

exports.generateInvoiceText = (invoice, order) => {
  const lineItems = order.items
    .map(
      (item) =>
        `${item.name.padEnd(35)} | ${item.quantity.toString().padStart(5)} ${item.unit.padEnd(6)} | ₹${item.price.toString().padStart(8)} | ₹${(item.price * item.quantity).toString().padStart(10)}`
    )
    .join('\n');

  return `
================================================================================
                           SAI TEJA TRADERS - TAX INVOICE
================================================================================
Corporate Office: D-No 12-42, Industrial Area, Jeedimetla, Hyderabad, 500055
GSTIN: 36AAAAA1111A1Z1  |  Email: finance@saitejatraders.com
--------------------------------------------------------------------------------
INVOICE NO: ${invoice.invoiceNumber.padEnd(20)} | DATE OF ISSUE: ${invoice.invoiceDate.toLocaleDateString()}
ORDER ID: ${order.orderId.padEnd(22)} | PAYMENT METHOD: ${order.paymentMethod}
--------------------------------------------------------------------------------
BILLED TO:                                SHIP TO:
Name: ${order.customerName.padEnd(34)} Site Address:
Phone: ${order.customerMobile.padEnd(33)} ${order.deliveryAddress}
GSTIN: ${invoice.customerGST.padEnd(33)} Delivery Scheduled: ${new Date(order.deliveryDate).toLocaleDateString()}
--------------------------------------------------------------------------------
MATERIAL DESCRIPTION                |   QTY   UNIT   | UNIT PRICE | TOTAL VALUE 
--------------------------------------------------------------------------------
${lineItems}
--------------------------------------------------------------------------------
                                              SUBTOTAL:       ₹${invoice.subtotal.toLocaleString('en-IN')}
                                              CGST (9.0%):    ₹${invoice.cgst.toLocaleString('en-IN')}
                                              SGST (9.0%):    ₹${invoice.sgst.toLocaleString('en-IN')}
                                              TRANSPORT LOGS: FREE
                                              ----------------------------------
                                              GRAND TOTAL:    ₹${invoice.total.toLocaleString('en-IN')}
================================================================================
Thank you for your B2B partnership. This is a computer-generated tax document.
No physical signature is required under section 37 of Indian GST Acts.
================================================================================
`;
};
