// components/invoiceTemplates/ModernTemplate.jsx
import React from "react";
import {
  Hash,
  Copy,
  Calendar,
  Clock,
  Building2,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Smartphone,
  Shield,
  DollarSign,
  Copy as CopyIcon,
  Landmark
} from "lucide-react";

const ModernTemplate = ({
  invoice,
  paymentConfig,
  copySuccess,
  handleCopy,
  formatCurrency,
  formatDate
}) => {
  if (!invoice) return null;

  // Temporary company data (replace later with API data)
  const company = {
    name: "BillSmart Solutions Pvt Ltd",
    email: "billing@billsmart.com",
    phone: "+91 9876543210",
    address: "123 Business Street, Kolkata, West Bengal 700001",
    gst: "22AAAAA0000A1Z5"
  };

  return (
    <div className="invoice-container bg-slate-100 py-10 px-4 print:bg-white print:py-0 print:px-0">
      
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
          padding: 0 !important;
          margin: 0 !important;
          background: white !important;
        }
        
        .invoice-container > div {
          box-shadow: none !important;
          border: 1px solid #e5e7eb !important;
          border-radius: 0 !important;
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
        .bg-gradient-to-r, .bg-gradient-to-br, .bg-blue-50, .bg-gray-50, .bg-green-50 {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        
        .bg-gradient-to-r.from-blue-600.to-indigo-600 {
          background: #2563eb !important;
          color: white !important;
        }
        
        .bg-gradient-to-br.from-blue-50.to-white {
          background: #eff6ff !important;
        }
        
        .bg-gradient-to-br.from-gray-50.to-white {
          background: #f9fafb !important;
        }
        
        .bg-blue-50 {
          background-color: #eff6ff !important;
        }
        
        .bg-gray-50 {
          background-color: #f9fafb !important;
        }
        
        .bg-green-50 {
          background-color: ${invoice.status === 'paid' ? '#f0fdf4' : '#eff6ff'} !important;
        }
        
        /* Hide interactive elements */
        .print\\:hidden {
          display: none !important;
        }
        
        /* Ensure text colors print correctly */
        .text-blue-600 {
          color: #2563eb !important;
        }
        
        .text-green-600 {
          color: #16a34a !important;
        }
        
        /* Adjust spacing for print */
        .p-10 {
          padding: 2rem !important;
        }
        
        .p-6 {
          padding: 1.5rem !important;
        }
        
        .mb-10 {
          margin-bottom: 1.5rem !important;
        }
        
        /* Ensure borders print */
        .border, .border-t, .border-b, .border-gray-200 {
          border-color: #e5e7eb !important;
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
          max-width: 18rem !important;
        }
        
        /* Hide copy buttons in print */
        button:has(svg) {
          display: none !important;
        }
        
        /* Modern specific adjustments */
        .h-3.bg-gradient-to-r {
          height: 0.75rem !important;
          background: #2563eb !important;
        }
      `}</style>

      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden border print:shadow-none print:border print:rounded-none">
        
        {/* Top Gradient Border */}
        <div className="h-3 bg-gradient-to-r from-blue-600 to-indigo-600 print:bg-blue-600"></div>

        <div className="p-10 print:p-8">

          {/* HEADER */}
          <div className="flex justify-between items-start mb-10 print:mb-8">

            {/* Invoice Info */}
            <div>
              <h1 className="text-4xl font-bold text-blue-600 tracking-wide print:text-blue-600">
                INVOICE
              </h1>

              <p className="text-xs text-gray-400 mt-1 print:hidden">
                Modern Billing Template
              </p>

              <div className="mt-4 space-y-2 text-sm text-gray-600">

                <div className="flex items-center gap-2">
                  <Hash className="w-4 h-4 print:w-3 print:h-3" />
                  <span>Invoice #{invoice.invoice_no}</span>

                  <button
                    onClick={() =>
                      handleCopy(invoice.invoice_no, "invoice_no")
                    }
                    className="print:hidden"
                  >
                    <Copy className="w-3 h-3 text-gray-400 hover:text-gray-700" />
                  </button>

                  {copySuccess === "invoice_no" && (
                    <span className="text-xs text-green-500 print:hidden">Copied</span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 print:w-3 print:h-3" />
                  <span>Invoice Date: {formatDate(invoice.invoice_date)}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 print:w-3 print:h-3" />
                  <span>Due Date: {formatDate(invoice.due_date)}</span>
                </div>

              </div>
            </div>

            {/* CUSTOMER CARD */}
            <div className="text-right bg-gradient-to-br from-blue-50 to-white border rounded-lg px-6 py-5 shadow-sm print:bg-blue-50 print:shadow-none">
              <h2 className="text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                Bill To
              </h2>

              <div className="space-y-1 text-sm text-gray-600">

                <div className="flex justify-end gap-2">
                  <Building2 className="w-4 h-4 print:w-3 print:h-3" />
                  <span>{invoice.customer.name}</span>
                </div>

                <div className="flex justify-end gap-2">
                  <Mail className="w-4 h-4 print:w-3 print:h-3" />
                  <span>{invoice.customer.email}</span>
                </div>

                <div className="flex justify-end gap-2">
                  <Phone className="w-4 h-4 print:w-3 print:h-3" />
                  <span>{invoice.customer.phone}</span>
                </div>

                <div className="flex justify-end gap-2">
                  <MapPin className="w-4 h-4 print:w-3 print:h-3" />
                  <span>{invoice.customer.billing_address}</span>
                </div>

                {invoice.customer.gstin && (
                  <div className="flex justify-end gap-2">
                    <Hash className="w-4 h-4 print:w-3 print:h-3" />
                    <span>GST: {invoice.customer.gstin}</span>
                  </div>
                )}

              </div>
            </div>

          </div>

          {/* COMPANY INFO */}
          <div className="mb-10 bg-gray-50 border rounded-lg p-6 print:bg-gray-50 print:mb-8">
            <h3 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">
              Company Information
            </h3>

            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">

              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 print:w-3 print:h-3" />
                {company.name}
              </div>

              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 print:w-3 print:h-3" />
                {company.email}
              </div>

              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 print:w-3 print:h-3" />
                {company.phone}
              </div>

              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 print:w-3 print:h-3" />
                {company.address}
              </div>

              <div className="flex items-center gap-2 col-span-2">
                <Hash className="w-4 h-4 print:w-3 print:h-3" />
                GSTIN: {company.gst}
              </div>

            </div>
          </div>

          {/* ITEMS TABLE */}
          <div className="overflow-hidden border rounded-lg mb-10 print:mb-8">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm print:bg-blue-600">
                <tr>
                  <th className="p-4 text-left">Description</th>
                  <th className="p-4 text-right">Qty</th>
                  <th className="p-4 text-right">Price</th>
                  <th className="p-4 text-right">Tax %</th>
                  <th className="p-4 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {invoice.items.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 print:hover:bg-transparent">
                    <td className="p-4 font-medium text-gray-700">
                      {item.item_name}
                    </td>
                    <td className="p-4 text-right text-gray-600">
                      {item.quantity}
                    </td>
                    <td className="p-4 text-right text-gray-600">
                      {formatCurrency(item.price)}
                    </td>
                    <td className="p-4 text-right text-gray-600">
                      {item.tax_percent}%
                    </td>
                    <td className="p-4 text-right font-semibold text-blue-600 print:text-blue-600">
                      {formatCurrency(item.total_amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* BOTTOM SECTION - Wrap in container to keep together */}
          <div className="bottom-section-container grid grid-cols-2 gap-10 print:grid-cols-2 print:gap-6">
            
            {/* PAYMENT INFORMATION - LEFT SIDE */}
            {paymentConfig?.isEnabled && (
              <div className="payment-section bg-gradient-to-br from-blue-50 to-white border rounded-lg p-6 h-full flex flex-col print:bg-blue-50 print:shadow-none">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-blue-600 print:w-4 print:h-4" />
                  Payment Information
                </h3>

                {/* QR Code Section */}
                <div className="flex items-start gap-4 mb-4">
                  <div className="bg-white p-2 rounded-lg shadow-sm border flex-shrink-0 print:shadow-none print:bg-white">
                    <img
                      src={paymentConfig.razorpay.qrCodeUrl}
                      alt="Payment QR"
                      className="w-20 h-20 print:w-16 print:h-16"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-700 flex items-center gap-1">
                      <Smartphone className="w-4 h-4 text-blue-600 print:w-3 print:h-3" />
                      Scan with UPI app
                    </p>
                    <div className="mt-2 space-y-2">
                      <div className="flex items-center justify-between bg-white p-2 rounded-lg border print:bg-white">
                        <span className="text-xs text-gray-500">UPI ID:</span>
                        <div className="flex items-center gap-1">
                          <span className="text-xs font-medium text-gray-800">
                            {paymentConfig.razorpay.upiId}
                          </span>
                          <button
                            onClick={() => handleCopy(paymentConfig.razorpay.upiId, "upi")}
                            className="p-0.5 hover:bg-blue-50 rounded print:hidden"
                          >
                            <CopyIcon className="w-3 h-3 text-gray-500" />
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between bg-white p-2 rounded-lg border print:bg-white">
                        <span className="text-xs text-gray-500">Merchant:</span>
                        <span className="text-xs font-medium text-gray-800">
                          {paymentConfig.razorpay.merchantName}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bank Details */}
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div className="bg-white p-2 rounded-lg border print:bg-white">
                    <p className="text-xs text-gray-500">Account</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-gray-800 truncate">
                        {paymentConfig.razorpay.accountNumber}
                      </span>
                      <button
                        onClick={() => handleCopy(paymentConfig.razorpay.accountNumber, "account")}
                        className="p-0.5 hover:bg-blue-50 rounded print:hidden"
                      >
                        <CopyIcon className="w-3 h-3 text-gray-500" />
                      </button>
                    </div>
                  </div>
                  <div className="bg-white p-2 rounded-lg border print:bg-white">
                    <p className="text-xs text-gray-500">IFSC</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-gray-800">
                        {paymentConfig.razorpay.ifscCode}
                      </span>
                      <button
                        onClick={() => handleCopy(paymentConfig.razorpay.ifscCode, "ifsc")}
                        className="p-0.5 hover:bg-blue-50 rounded print:hidden"
                      >
                        <CopyIcon className="w-3 h-3 text-gray-500" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-2 rounded-lg border mb-3 print:bg-white">
                  <p className="text-xs text-gray-500">Bank</p>
                  <p className="text-xs font-medium text-gray-800">
                    {paymentConfig.razorpay.bankName}
                  </p>
                </div>

                {/* Powered by Razorpay */}
                <div className="mt-auto flex items-center justify-center gap-1 text-xs text-gray-400 border-t pt-3">
                  <span>Powered by</span>
                  <img 
                    src="https://razorpay.com/assets/razorpay-logo.svg" 
                    alt="Razorpay" 
                    className="h-4"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://via.placeholder.com/60x20?text=Razorpay";
                    }}
                  />
                  <Shield className="w-3 h-3 text-green-500 print:w-2 print:h-2" />
                </div>
              </div>
            )}

            {/* TOTALS - RIGHT SIDE */}
            <div className="totals-section flex justify-end h-full">
              <div className="w-72 bg-gradient-to-br from-gray-50 to-white border rounded-lg p-6 space-y-3 shadow-sm h-full flex flex-col print:bg-gray-50 print:shadow-none">
                <div className="flex-1">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium text-gray-800">
                      {formatCurrency(invoice.subtotal)}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Tax</span>
                    <span className="font-medium text-gray-800">
                      {formatCurrency(invoice.tax_amount)}
                    </span>
                  </div>

                  {invoice.discount_amount > 0 && (
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">Discount</span>
                      <span className="font-medium text-green-600">
                        -{formatCurrency(invoice.discount_amount)}
                      </span>
                    </div>
                  )}
                </div>

                <div>
                  <div className="border-t pt-3 flex justify-between text-lg font-bold mb-3">
                    <span className="text-gray-700">Total</span>
                    <span className="text-blue-600 print:text-blue-600">
                      {formatCurrency(invoice.total_amount)}
                    </span>
                  </div>

                  {/* Payment Status Message */}
                  {invoice.status === "paid" ? (
                    <div className="p-2 bg-green-50 border border-green-200 rounded-lg text-center print:bg-green-50">
                      <span className="text-xs text-green-600 font-medium">
                        ✓ Payment Received
                      </span>
                    </div>
                  ) : (
                    <div className="p-2 bg-blue-50 border border-blue-200 rounded-lg text-center print:bg-blue-50">
                      <span className="text-xs text-blue-600 font-medium">
                        Complete payment
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* FOOTER */}
          <div className="invoice-footer mt-10 border-t pt-6 text-center text-sm text-gray-500 print:mt-8">
           This is a computer generated invoice. No signature required.
          </div>

        </div>
      </div>
    </div>
  );
};

export default ModernTemplate;