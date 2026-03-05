// components/invoiceTemplates/DefaultTemplate.jsx
import React from 'react';
import {
  Receipt,
  Hash,
  Calendar,
  Clock,
  Building2,
  Mail,
  Phone,
  MapPin,
  Copy,
  CreditCard,
  DollarSign,
  Smartphone,
  Shield,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

const DefaultTemplate = ({ 
  invoice, 
  paymentConfig, 
  copySuccess, 
  handleCopy,
  formatDate,
  formatCurrency 
}) => {
  return (
    <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm overflow-hidden">
      {/* Invoice Header */}
      <div className="p-8 border-b border-[#E2E8F0] bg-[#F8FAFC]">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Receipt className="w-8 h-8 text-[#2563EB]" />
              <h2 className="text-2xl font-bold text-[#0F172A]">INVOICE</h2>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Hash className="w-4 h-4 text-[#64748B]" />
                <span className="text-sm font-medium text-[#0F172A]">
                  {invoice.invoice_no}
                </span>
                <button
                  onClick={() => handleCopy(invoice.invoice_no, "invoice_no")}
                  className="p-1 hover:bg-white rounded transition-colors"
                >
                  <Copy className="w-3 h-3 text-[#64748B]" />
                </button>
                {copySuccess === "invoice_no" && (
                  <span className="text-xs text-[#22C55E]">Copied!</span>
                )}
              </div>
              <div className="flex items-center gap-2 text-sm text-[#64748B]">
                <Calendar className="w-4 h-4" />
                <span>Invoice Date: {formatDate(invoice.invoice_date)}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-[#64748B]">
                <Clock className="w-4 h-4" />
                <span>Due Date: {formatDate(invoice.due_date)}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-[#64748B]">Invoice Type:</span>
                <span className="px-2 py-0.5 bg-[#F1F5F9] text-[#334155] rounded text-xs font-medium uppercase">
                  {invoice.invoice_type}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Details */}
      <div className="p-8 border-b border-[#E2E8F0]">
        <h3 className="text-sm font-medium text-[#64748B] mb-3">Bill To:</h3>

        {/* Single column layout */}
        <div className="space-y-3">
          {/* Customer Name */}
          <div className="flex items-start gap-2">
            <Building2 className="w-4 h-4 text-[#64748B] flex-shrink-0 mt-0.5" />
            <span className="font-medium text-[#0F172A] break-words">
              {invoice.customer.name}
            </span>
          </div>

          {/* Email with copy */}
          <div className="flex items-start gap-2 text-sm text-[#64748B]">
            <Mail className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span className="break-words">{invoice.customer.email}</span>
            <button
              onClick={() => handleCopy(invoice.customer.email, "email")}
              className="p-1 hover:bg-[#F1F5F9] rounded transition-colors flex-shrink-0"
              title="Copy email"
            >
              <Copy className="w-3 h-3" />
            </button>
            {copySuccess === "email" && (
              <span className="text-xs text-[#22C55E] animate-pulse">
                Copied!
              </span>
            )}
          </div>

          {/* Phone */}
          <div className="flex items-start gap-2 text-sm text-[#64748B]">
            <Phone className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{invoice.customer.phone}</span>
          </div>

          {/* Address */}
          <div className="flex items-start gap-2 text-sm text-[#64748B]">
            <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span className="break-words">
              {invoice.customer.billing_address}
            </span>
          </div>

          {/* GSTIN with copy */}
          <div className="flex items-start gap-2 text-sm text-[#64748B]">
            <Hash className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span className="break-words">GST: {invoice.customer.gstin}</span>
            <button
              onClick={() => handleCopy(invoice.customer.gstin, "gstin")}
              className="p-1 hover:bg-[#F1F5F9] rounded transition-colors flex-shrink-0"
              title="Copy GSTIN"
            >
              <Copy className="w-3 h-3" />
            </button>
            {copySuccess === "gstin" && (
              <span className="text-xs text-[#22C55E] animate-pulse">
                Copied!
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Items Table */}
      <div className="p-8">
        <table className="w-full">
          <thead className="bg-[#F8FAFC]">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-[#64748B] uppercase tracking-wider">
                Item
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-[#64748B] uppercase tracking-wider">
                Qty
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-[#64748B] uppercase tracking-wider">
                Price
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-[#64748B] uppercase tracking-wider">
                Tax %
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-[#64748B] uppercase tracking-wider">
                Tax Amt
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-[#64748B] uppercase tracking-wider">
                Total
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2E8F0]">
            {invoice.items.map((item) => (
              <tr key={item.id}>
                <td className="px-4 py-3">
                  <p className="text-sm font-medium text-[#0F172A]">
                    {item.item_name}
                  </p>
                </td>
                <td className="px-4 py-3 text-right text-sm text-[#64748B]">
                  {item.quantity}
                </td>
                <td className="px-4 py-3 text-right text-sm text-[#64748B]">
                  {formatCurrency(item.price)}
                </td>
                <td className="px-4 py-3 text-right text-sm text-[#64748B]">
                  {item.tax_percent}%
                </td>
                <td className="px-4 py-3 text-right text-sm text-[#64748B]">
                  {formatCurrency(item.tax_amount)}
                </td>
                <td className="px-4 py-3 text-right text-sm font-medium text-[#0F172A]">
                  {formatCurrency(item.total_amount)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Summary with Payment Info */}
        <div className="mt-6 pt-6 border-t border-[#E2E8F0]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Payment Information - Left Side */}
            <div className="bg-gradient-to-br from-[#F8FAFC] to-white rounded-xl border border-[#E2E8F0] p-6">
              <h3 className="text-lg font-semibold text-[#0F172A] mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-[#2563EB]" />
                Quick Payment
              </h3>

              {/* QR Code */}
              <div className="flex flex-col items-center mb-6">
                <div className="bg-white p-4 rounded-xl shadow-sm border border-[#E2E8F0] hover:shadow-md transition-shadow">
                  <img
                    src={paymentConfig.razorpay.qrCodeUrl}
                    alt="Payment QR Code"
                    className="w-48 h-48"
                  />
                </div>
                <p className="text-xs text-[#64748B] mt-3 flex items-center gap-1">
                  <Smartphone className="w-3 h-3" />
                  Scan with any UPI app to pay
                </p>
              </div>

              {/* Pay Now Button */}
              <button
                onClick={() => {
                  /* Handle payment */
                }}
                className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-medium py-3 px-4 rounded-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-md hover:shadow-lg flex items-center justify-center gap-2 mb-4"
              >
                <DollarSign className="w-5 h-5" />
                Pay Now ₹{invoice.total_amount}
              </button>

              {/* Razorpay Branding */}
              <div className="flex items-center justify-center gap-2 text-xs text-[#94A3B8] border-t border-[#E2E8F0] pt-4">
                <span>Secure payments by</span>
                <img
                  src="https://razorpay.com/assets/razorpay-logo.svg"
                  alt="Razorpay"
                  className="h-5"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      "https://via.placeholder.com/80x20?text=Razorpay";
                  }}
                />
                <Shield className="w-3 h-3 text-[#22C55E]" />
              </div>

              {/* Payment Status Message */}
              {invoice.status === "paid" ? (
                <div className="mt-4 p-3 bg-[#DCFCE7] border border-[#22C55E]/20 rounded-lg flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-[#15803D]" />
                  <span className="text-sm text-[#15803D] font-medium">
                    Payment Received
                  </span>
                </div>
              ) : (
                <div className="mt-4 p-3 bg-[#DBEAFE] border border-[#2563EB]/20 rounded-lg flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-[#1E40AF]" />
                  <span className="text-xs text-[#1E40AF]">
                    Complete payment using QR code
                  </span>
                </div>
              )}
            </div>

            {/* Invoice Summary - Right Side */}
            <div className="flex justify-end">
              <div className="w-80 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-[#64748B]">Subtotal:</span>
                  <span className="text-[#0F172A]">
                    {formatCurrency(invoice.subtotal)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#64748B]">Tax Amount:</span>
                  <span className="text-[#0F172A]">
                    {formatCurrency(invoice.tax_amount)}
                  </span>
                </div>
                {invoice.discount_amount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-[#64748B]">Discount:</span>
                    <span className="text-[#22C55E]">
                      -{formatCurrency(invoice.discount_amount)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold pt-2 border-t border-[#E2E8F0]">
                  <span className="text-[#0F172A]">Total Amount:</span>
                  <span className="text-[#2563EB]">
                    {formatCurrency(invoice.total_amount)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Notes */}
        <div className="mt-8 pt-6 border-t border-[#E2E8F0] text-center text-sm text-[#64748B]">
          <p>Thank you for your business!</p>
          <p className="mt-1">
            This is a computer generated invoice, no signature required.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DefaultTemplate;