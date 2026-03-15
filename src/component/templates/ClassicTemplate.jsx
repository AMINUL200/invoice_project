// components/invoiceTemplates/ClassicTemplate.jsx
import React from "react";
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  Hash,
  Calendar,
  Clock,
  CreditCard,
  Copy,
  Smartphone,
  Shield,
  Copy as CopyIcon,
  QrCode,
  DollarSign,
  Landmark
} from "lucide-react";

const ClassicTemplate = ({
  invoice,
  paymentConfig,
  copySuccess,
  handleCopy,
  formatDate,
  formatCurrency
}) => {

  if (!invoice) return null;

  return (
    <div className="invoice-container max-w-5xl mx-auto bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden print:shadow-none print:border print:rounded-none print:mx-0">
      
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
          border: 1px solid #e5e7eb !important;
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
        .bg-blue-50, .bg-gray-50, .bg-green-50, .bg-blue-600 {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        
        .bg-blue-600 {
          background-color: #2563eb !important;
          color: white !important;
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
        .px-10 {
          padding-left: 2rem !important;
          padding-right: 2rem !important;
        }
        
        .py-8 {
          padding-top: 2rem !important;
          padding-bottom: 2rem !important;
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
          max-width: 20rem !important;
        }
      `}</style>

      {/* HEADER */}
      <div className="bg-blue-50 border-b px-10 py-8 flex justify-between items-start print:bg-blue-50 print:border-b print:px-8 print:py-6">

        <div>
          <h1 className="text-4xl font-bold text-blue-600 tracking-wide print:text-blue-600">
            INVOICE
          </h1>

          <div className="mt-4 space-y-1 text-sm text-gray-600">

            <div className="flex items-center gap-2">
              <Hash className="w-4 h-4 print:w-3 print:h-3" />
              <span>Invoice #{invoice.invoice_no}</span>
              <button 
                onClick={() => handleCopy(invoice.invoice_no, "invoice_no")}
                className="print:hidden"
              >
                <Copy className="w-3 h-3 text-gray-400 hover:text-gray-700"/>
              </button>
              {copySuccess === "invoice_no" && (
                <span className="text-green-500 text-xs print:hidden">Copied</span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 print:w-3 print:h-3"/>
              <span>Invoice Date: {formatDate(invoice.invoice_date)}</span>
            </div>

            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 print:w-3 print:h-3"/>
              <span>Due Date: {formatDate(invoice.due_date)}</span>
            </div>

          </div>
        </div>

        {/* CUSTOMER */}
        <div className="text-right max-w-xs">

          <h3 className="font-semibold text-gray-700 mb-3">Bill To</h3>

          <div className="space-y-2 text-sm text-gray-600">

            <div className="flex justify-end gap-2">
              <Building2 className="w-4 h-4 print:w-3 print:h-3"/>
              <span>{invoice.customer.name}</span>
            </div>

            <div className="flex justify-end gap-2">
              <Mail className="w-4 h-4 print:w-3 print:h-3"/>
              <span>{invoice.customer.email}</span>
            </div>

            <div className="flex justify-end gap-2">
              <Phone className="w-4 h-4 print:w-3 print:h-3"/>
              <span>{invoice.customer.phone}</span>
            </div>

            <div className="flex justify-end gap-2">
              <MapPin className="w-4 h-4 print:w-3 print:h-3"/>
              <span>{invoice.customer.billing_address}</span>
            </div>

            {invoice.customer.gstin && (
              <div className="flex justify-end gap-2">
                <Hash className="w-4 h-4 print:w-3 print:h-3"/>
                <span>GST: {invoice.customer.gstin}</span>
              </div>
            )}

          </div>

        </div>
      </div>

      {/* ITEMS TABLE */}
      <div className="px-10 py-8 print:px-8 print:py-6">

        <table className="w-full border border-gray-200 rounded-lg overflow-hidden print:border print:rounded-none">

          <thead className="bg-blue-600 text-white text-sm print:bg-blue-600">
            <tr>
              <th className="text-left px-4 py-3">Item</th>
              <th className="text-right px-4 py-3">Qty</th>
              <th className="text-right px-4 py-3">Price</th>
              <th className="text-right px-4 py-3">Tax</th>
              <th className="text-right px-4 py-3">Total</th>
            </tr>
          </thead>

          <tbody className="divide-y">

            {invoice.items.map((item) => (

              <tr key={item.id} className="text-sm hover:bg-gray-50 print:hover:bg-transparent">

                <td className="px-4 py-3 font-medium text-gray-700">
                  {item.item_name}
                </td>

                <td className="px-4 py-3 text-right text-gray-600">
                  {item.quantity}
                </td>

                <td className="px-4 py-3 text-right text-gray-600">
                  {formatCurrency(item.price)}
                </td>

                <td className="px-4 py-3 text-right text-gray-600">
                  {item.tax_percent}%
                </td>

                <td className="px-4 py-3 text-right font-medium">
                  {formatCurrency(item.total_amount)}
                </td>

              </tr>

            ))}

          </tbody>

        </table>

        {/* SUMMARY + PAYMENT - Wrap in container to keep together */}
        <div className="bottom-section-container grid md:grid-cols-2 gap-8 mt-10 print:mt-8 print:gap-6">

          {/* PAYMENT INFORMATION - LEFT SIDE */}
          {paymentConfig?.isEnabled && (
            <div className="payment-section border rounded-lg p-6 bg-gray-50 print:bg-gray-50 print:border print:p-4 print:w-full">
              <h3 className="font-semibold mb-4 flex items-center gap-2 text-blue-600">
                <CreditCard className="w-5 h-5 print:w-4 print:h-4" />
                Payment Information
              </h3>

              {/* QR Code Section */}
              <div className="flex items-start gap-4 mb-4">
                <div className="bg-white p-2 rounded-lg shadow-sm border flex-shrink-0 print:shadow-none print:bg-white">
                  <img
                    src={paymentConfig.razorpay.qrCodeUrl}
                    alt="Payment QR"
                    className="w-24 h-24 print:w-20 print:h-20"
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

              {/* Bank Transfer Details */}
              <div className="border-t pt-4 mb-3">
                <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-1">
                  <Landmark className="w-4 h-4 text-green-600 print:w-3 print:h-3" />
                  Bank Transfer
                </h4>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between bg-white p-2 rounded-lg border print:bg-white">
                    <span className="text-xs text-gray-500">Account:</span>
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-medium text-gray-800">
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
                  
                  <div className="flex items-center justify-between bg-white p-2 rounded-lg border print:bg-white">
                    <span className="text-xs text-gray-500">IFSC:</span>
                    <div className="flex items-center gap-1">
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
                  
                  <div className="flex items-center justify-between bg-white p-2 rounded-lg border print:bg-white">
                    <span className="text-xs text-gray-500">Bank:</span>
                    <span className="text-xs font-medium text-gray-800">
                      {paymentConfig.razorpay.bankName}
                    </span>
                  </div>
                </div>
              </div>

              {/* Powered by Razorpay */}
              <div className="flex items-center justify-center gap-1 text-xs text-gray-400 border-t pt-3">
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
              </div>
            </div>
          )}

          {/* TOTALS - RIGHT SIDE */}
          <div className="totals-section flex justify-end">
            <div className="w-80 space-y-3 text-sm print:w-72 print:max-w-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Subtotal</span>
                <span className="font-medium">{formatCurrency(invoice.subtotal)}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Tax</span>
                <span className="font-medium">{formatCurrency(invoice.tax_amount)}</span>
              </div>

              {invoice.discount_amount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-{formatCurrency(invoice.discount_amount)}</span>
                </div>
              )}

              <div className="border-t pt-3 flex justify-between text-lg font-bold text-blue-600 print:text-blue-600">
                <span>Total</span>
                <span>{formatCurrency(invoice.total_amount)}</span>
              </div>

              {/* Payment Status Message */}
              {invoice.status === "paid" ? (
                <div className="mt-4 p-2 bg-green-50 border border-green-200 rounded-lg text-center print:bg-green-50">
                  <span className="text-xs text-green-600 font-medium">
                    ✓ Payment Received
                  </span>
                </div>
              ) : paymentConfig?.isEnabled && (
                <div className="mt-4 p-2 bg-blue-50 border border-blue-200 rounded-lg text-center print:bg-blue-50">
                  <span className="text-xs text-blue-600 font-medium">
                    Complete payment using QR or bank transfer
                  </span>
                </div>
              )}
            </div>
          </div>

        </div>

      </div>

      {/* FOOTER */}
      <div className="invoice-footer text-center text-sm text-gray-500 border-t py-6 print:border-t print:py-4">
        Thank you for your business!
      </div>

    </div>
  );
};

export default ClassicTemplate;