/**
 * Notification Service Utility
 * Triggers B2B communications for order statuses.
 * In production, this binds to Twilio SMS or Nodemailer SMTP hooks.
 */

exports.sendSMSNotification = (mobile, orderId, status) => {
  const messages = {
    'Order Confirmed': `Teja Traders alert: Order ${orderId} has been confirmed. View invoice at saiteja.com.`,
    'Processing': `Teja Traders update: Order ${orderId} materials are allocated and packing.`,
    'Dispatched': `Teja Traders update: Order ${orderId} has left the Jeedimetla logistics warehouse. Vehicle tracking link active.`,
    'Out for Delivery': `Teja Traders dispatch: Transit vehicle for ${orderId} arrived in your site perimeter. Prepare unloading site.`,
    'Delivered': `Teja Traders: Materials for Order ${orderId} delivered and signed. Download tax invoice at your dashboard.`,
  };

  const text = messages[status] || `Teja Traders order update: ${orderId} changed to ${status}`;
  
  // Simulation log output
  console.log(`[Notification SMS Gateway] To: ${mobile} | Message: "${text}"`);
  return true;
};

exports.sendEmailInvoice = (email, invoiceNumber, amount) => {
  console.log(`[Notification SMTP Server] To: ${email} | Subject: Tax Invoice Generated ${invoiceNumber} | Body: "Dear builder, your payment of ₹${amount} was verified. GST invoice attached."`);
  return true;
};
