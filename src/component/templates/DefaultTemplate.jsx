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
    <div className="invoice-container bg-white rounded-xl border border-[#E2E8F0] shadow-sm overflow-hidden print:shadow-none print:border print:rounded-none">
      
      {/* Print Styles */}
      <style type="text/css" media="print">{`
        @page {
          size: A4;
          margin: 1.5cm;
        }
        
        body {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
          font-family: Arial, sans-serif;
        }
        
        .invoice-container {
          max-width: 100% !important;
          margin: 0 !important;
          border: 1px solid #e2e8f0 !important;
          box-shadow: none !important;
          border-radius: 0 !important;
          background: white !important;
        }
        
        /* Keep bottom section (payment + totals) together */
        .bottom-section-container {
          page-break-inside: avoid !important;
          break-inside: avoid !important;
          display: grid !important;
          grid-template-columns: 1fr 1fr !important;
          gap: 2rem !important;
          width: 100% !important;
        }
        
        /* Force two-column layout in print */
        @media print {
          .bottom-section-container {
            display: grid !important;
            grid-template-columns: 1fr 1fr !important;
            gap: 2rem !important;
          }
          
          .payment-section {
            grid-column: 1 !important;
            width: 100% !important;
          }
          
          .totals-section {
            grid-column: 2 !important;
            width: 100% !important;
            display: flex !important;
            justify-content: flex-end !important;
          }
        }
        
        /* Table handling */
        table {
          page-break-inside: auto !important;
          break-inside: auto !important;
          border-collapse: collapse !important;
          width: 100% !important;
        }
        
        tr {
          page-break-inside: avoid !important;
          break-inside: avoid !important;
        }
        
        thead {
          display: table-header-group !important;
        }
        
        tbody {
          display: table-row-group !important;
        }
        
        /* Keep payment section together */
        .payment-section {
          page-break-inside: avoid !important;
          break-inside: avoid !important;
        }
        
        .totals-section {
          page-break-inside: avoid !important;
          break-inside: avoid !important;
        }
        
        /* Force background colors to print */
        .bg-\\[\\#F8FAFC\\], .bg-gradient-to-br, .bg-\\[\\#DCFCE7\\], .bg-\\[\\#DBEAFE\\] {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        
        .bg-\\[\\#F8FAFC\\] {
          background-color: #f8fafc !important;
        }
        
        .bg-gradient-to-br.from-\\[\\#F8FAFC\\].to-white {
          background: #f8fafc !important;
        }
        
        .bg-\\[\\#DCFCE7\\] {
          background-color: ${invoice.status === 'paid' ? '#dcfce7' : '#dbeafe'} !important;
        }
        
        .bg-\\[\\#DBEAFE\\] {
          background-color: #dbeafe !important;
        }
        
        /* Hide interactive elements */
        .print\\:hidden {
          display: none !important;
        }
        
        /* Ensure text colors print correctly */
        .text-\\[\\#2563EB\\] {
          color: #2563eb !important;
        }
        
        .text-\\[\\#15803D\\] {
          color: #15803d !important;
        }
        
        .text-\\[\\#1E40AF\\] {
          color: #1e40af !important;
        }
        
        .text-\\[\\#22C55E\\] {
          color: #22c55e !important;
        }
        
        /* Adjust spacing for print */
        .p-8 {
          padding: 2rem !important;
        }
        
        .p-6 {
          padding: 1.5rem !important;
        }
        
        .mt-6 {
          margin-top: 1.5rem !important;
        }
        
        .mb-6 {
          margin-bottom: 1.5rem !important;
        }
        
        /* Ensure borders print */
        .border, .border-t, .border-b, .border-\\[\\#E2E8F0\\] {
          border-color: #e2e8f0 !important;
        }
        
        /* QR code optimization */
        img {
          max-width: 100% !important;
          page-break-inside: avoid !important;
        }
        
        /* Force payment section to take full width in its column */
        .payment-section {
          width: 100% !important;
          margin-right: 0 !important;
        }
        
        /* Ensure totals section stays on the right */
        .totals-section {
          width: 100% !important;
        }
        
        .totals-section > div {
          width: 100% !important;
          max-width: 20rem !important;
        }
        
        /* Hide copy buttons and payment buttons in print */
        button {
          display: none !important;
        }
        
        /* QR code container adjustments */
        .bg-white.p-4.rounded-xl {
          background: white !important;
          border: 1px solid #e2e8f0 !important;
          padding: 1rem !important;
          box-shadow: none !important;
        }
        
        /* Pay Now button - hide in print */
        .bg-\\[\\#2563EB\\] {
          display: none !important;
        }
        
        /* Ensure proper grid layout in print */
        .grid-cols-1.lg\\:grid-cols-2 {
          display: grid !important;
          grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
        }
        
        /* Payment status message adjustments */
        .mt-4.p-3 {
          margin-top: 1rem !important;
          padding: 0.75rem !important;
        }
      `}</style>

      {/* Invoice Header */}
      <div className="p-8 border-b border-[#E2E8F0] bg-[#F8FAFC] print:bg-[#F8FAFC] print:border-b print:p-6">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Receipt className="w-8 h-8 text-[#2563EB] print:w-6 print:h-6" />
              <h2 className="text-2xl font-bold text-[#0F172A] print:text-xl">INVOICE</h2>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Hash className="w-4 h-4 text-[#64748B] print:w-3 print:h-3" />
                <span className="text-sm font-medium text-[#0F172A]">
                  {invoice.invoice_no}
                </span>
                <button
                  onClick={() => handleCopy(invoice.invoice_no, "invoice_no")}
                  className="p-1 hover:bg-white rounded transition-colors print:hidden"
                >
                  <Copy className="w-3 h-3 text-[#64748B]" />
                </button>
                {copySuccess === "invoice_no" && (
                  <span className="text-xs text-[#22C55E] print:hidden">Copied!</span>
                )}
              </div>
              <div className="flex items-center gap-2 text-sm text-[#64748B]">
                <Calendar className="w-4 h-4 print:w-3 print:h-3" />
                <span>Invoice Date: {formatDate(invoice.invoice_date)}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-[#64748B]">
                <Clock className="w-4 h-4 print:w-3 print:h-3" />
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
      <div className="p-8 border-b border-[#E2E8F0] print:p-6 print:border-b">
        <h3 className="text-sm font-medium text-[#64748B] mb-3">Bill To:</h3>

        {/* Single column layout */}
        <div className="space-y-3">
          {/* Customer Name */}
          <div className="flex items-start gap-2">
            <Building2 className="w-4 h-4 text-[#64748B] flex-shrink-0 mt-0.5 print:w-3 print:h-3" />
            <span className="font-medium text-[#0F172A] break-words">
              {invoice.customer.name}
            </span>
          </div>

          {/* Email with copy */}
          <div className="flex items-start gap-2 text-sm text-[#64748B]">
            <Mail className="w-4 h-4 flex-shrink-0 mt-0.5 print:w-3 print:h-3" />
            <span className="break-words">{invoice.customer.email}</span>
            <button
              onClick={() => handleCopy(invoice.customer.email, "email")}
              className="p-1 hover:bg-[#F1F5F9] rounded transition-colors flex-shrink-0 print:hidden"
              title="Copy email"
            >
              <Copy className="w-3 h-3" />
            </button>
            {copySuccess === "email" && (
              <span className="text-xs text-[#22C55E] animate-pulse print:hidden">
                Copied!
              </span>
            )}
          </div>

          {/* Phone */}
          <div className="flex items-start gap-2 text-sm text-[#64748B]">
            <Phone className="w-4 h-4 flex-shrink-0 mt-0.5 print:w-3 print:h-3" />
            <span>{invoice.customer.phone}</span>
          </div>

          {/* Address */}
          <div className="flex items-start gap-2 text-sm text-[#64748B]">
            <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5 print:w-3 print:h-3" />
            <span className="break-words">
              {invoice.customer.billing_address}
            </span>
          </div>

          {/* GSTIN with copy */}
          <div className="flex items-start gap-2 text-sm text-[#64748B]">
            <Hash className="w-4 h-4 flex-shrink-0 mt-0.5 print:w-3 print:h-3" />
            <span className="break-words">GST: {invoice.customer.gstin}</span>
            <button
              onClick={() => handleCopy(invoice.customer.gstin, "gstin")}
              className="p-1 hover:bg-[#F1F5F9] rounded transition-colors flex-shrink-0 print:hidden"
              title="Copy GSTIN"
            >
              <Copy className="w-3 h-3" />
            </button>
            {copySuccess === "gstin" && (
              <span className="text-xs text-[#22C55E] animate-pulse print:hidden">
                Copied!
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Items Table */}
      <div className="p-8 print:p-6">
        <table className="w-full">
          <thead className="bg-[#F8FAFC] print:bg-[#F8FAFC]">
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
        <div className="mt-6 pt-6 border-t border-[#E2E8F0] print:mt-4 print:pt-4">
          <div className="bottom-section-container grid grid-cols-1 lg:grid-cols-2 gap-8 print:grid-cols-2 print:gap-6">
            
            {/* Payment Information - Left Side */}
            <div className="payment-section bg-gradient-to-br from-[#F8FAFC] to-white rounded-xl border border-[#E2E8F0] p-6 print:bg-[#F8FAFC] print:shadow-none">
              <h3 className="text-lg font-semibold text-[#0F172A] mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-[#2563EB] print:w-4 print:h-4" />
                Quick Payment
              </h3>

              {/* QR Code */}
              <div className="flex flex-col items-center mb-6">
                <div className="bg-white p-4 rounded-xl shadow-sm border border-[#E2E8F0] hover:shadow-md transition-shadow print:shadow-none print:bg-white">
                  <img
                    src={paymentConfig.razorpay.qrCodeUrl}
                    alt="Payment QR Code"
                    className="w-48 h-48 print:w-40 print:h-40"
                  />
                </div>
                <p className="text-xs text-[#64748B] mt-3 flex items-center gap-1">
                  <Smartphone className="w-3 h-3 print:w-2 print:h-2" />
                  Scan with any UPI app to pay
                </p>
              </div>

              {/* Pay Now Button - Hidden in print */}
              <button
                onClick={() => {
                  /* Handle payment */
                }}
                className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-medium py-3 px-4 rounded-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-md hover:shadow-lg flex items-center justify-center gap-2 mb-4 print:hidden"
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
                <Shield className="w-3 h-3 text-[#22C55E] print:w-2 print:h-2" />
              </div>

              {/* Payment Status Message */}
              {invoice.status === "paid" ? (
                <div className="mt-4 p-3 bg-[#DCFCE7] border border-[#22C55E]/20 rounded-lg flex items-center gap-2 print:bg-[#DCFCE7]">
                  <CheckCircle className="w-5 h-5 text-[#15803D] print:w-4 print:h-4" />
                  <span className="text-sm text-[#15803D] font-medium">
                    Payment Received
                  </span>
                </div>
              ) : (
                <div className="mt-4 p-3 bg-[#DBEAFE] border border-[#2563EB]/20 rounded-lg flex items-center gap-2 print:bg-[#DBEAFE]">
                  <AlertCircle className="w-4 h-4 text-[#1E40AF] print:w-3 print:h-3" />
                  <span className="text-xs text-[#1E40AF]">
                    Complete payment using QR code
                  </span>
                </div>
              )}
            </div>

            {/* Invoice Summary - Right Side */}
            <div className="totals-section flex justify-end">
              <div className="w-80 space-y-2 print:w-72">
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
                  <span className="text-[#2563EB] print:text-[#2563EB]">
                    {formatCurrency(invoice.total_amount)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Notes */}
        <div className="invoice-footer mt-8 pt-6 border-t border-[#E2E8F0] text-center text-sm text-[#64748B] print:mt-6 print:pt-4">
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