// components/invoiceTemplates/MinimalTemplate.jsx
import React from "react";
import { Hash, Copy, CreditCard, Smartphone, Shield, Copy as CopyIcon, Landmark } from "lucide-react";

const MinimalTemplate = ({
  invoice,
  paymentConfig,
  formatCurrency,
  formatDate,
  handleCopy,
  copySuccess
}) => {
  if (!invoice) return null;

  const razorpay = paymentConfig?.razorpay;

  return (
    <div className="invoice-container bg-[#F5F6F8] py-10 px-4 print:bg-white print:py-0 print:px-0">
      
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
          background: white !important;
          padding: 0 !important;
          margin: 0 !important;
        }
        
        .invoice-container > div {
          max-width: 100% !important;
          box-shadow: none !important;
          border: 1px solid #e5e7eb !important;
          border-radius: 0 !important;
          padding: 2rem !important;
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
        .bg-gray-50, .bg-gray-100, .bg-green-50, .bg-blue-50 {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        
        .bg-gray-50 {
          background-color: #f9fafb !important;
        }
        
        .bg-gray-100 {
          background-color: #f3f4f6 !important;
        }
        
        .bg-green-50 {
          background-color: ${invoice.status === 'paid' ? '#f0fdf4' : '#eff6ff'} !important;
        }
        
        .bg-blue-50 {
          background-color: #eff6ff !important;
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
        
        .mb-8 {
          margin-bottom: 1.5rem !important;
        }
        
        .mb-6 {
          margin-bottom: 1rem !important;
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
          max-width: 16rem !important;
        }
        
        /* Hide copy buttons in print */
        button:has(svg) {
          display: none !important;
        }
        
        /* Minimal specific adjustments */
        .bg-\\[\\#F5F6F8\\] {
          background: white !important;
        }
        
        /* Ensure proper grid layout in print */
        .grid-cols-2 {
          display: grid !important;
          grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
        }
      `}</style>

      <div className="max-w-4xl mx-auto bg-white border border-gray-200 rounded-xl shadow-sm p-10 print:shadow-none print:border print:rounded-none print:p-8">
        
        {/* HEADER */}
        <div className="flex justify-between items-center border-b pb-4 mb-6 print:pb-3 print:mb-4">
          <h1 className="text-4xl font-semibold tracking-wide text-gray-800 print:text-3xl">
            INVOICE
          </h1>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Hash className="w-4 h-4 print:w-3 print:h-3" />
            <span>{invoice.invoice_no}</span>

            {handleCopy && (
              <button onClick={() => handleCopy(invoice.invoice_no, "invoice_no")} className="print:hidden">
                <Copy className="w-3 h-3 text-gray-400 hover:text-gray-700" />
              </button>
            )}

            {copySuccess === "invoice_no" && (
              <span className="text-xs text-green-500 print:hidden">Copied</span>
            )}
          </div>
        </div>

        {/* COMPANY + CUSTOMER */}
        <div className="grid grid-cols-2 gap-12 mb-8 text-sm text-gray-600 print:grid-cols-2 print:gap-8 print:mb-6">
          <div>
            <h3 className="font-semibold text-gray-800 mb-2">
              Company Name
            </h3>

            <p>123 Business Street</p>
            <p>City, Business Street</p>
            <p>City, State ZIP Code</p>
          </div>

          <div className="text-right">
            <h3 className="font-semibold text-gray-800 mb-2">
              {invoice.customer.name}
            </h3>

            <p>{invoice.customer.billing_address}</p>
            <p>Ph: {invoice.customer.phone}</p>
          </div>
        </div>

        {/* ITEMS TABLE */}
        <div className="border border-gray-200 rounded-lg overflow-hidden mb-8 print:mb-6">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-700 print:bg-gray-50">
              <tr>
                <th className="p-3 text-left">Description</th>
                <th className="p-3 text-right">Qty</th>
                <th className="p-3 text-right">Price</th>
                <th className="p-3 text-right">Tax %</th>
                <th className="p-3 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {invoice.items.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 print:hover:bg-transparent">
                  <td className="p-3 text-gray-700">
                    {item.item_name}
                  </td>
                  <td className="p-3 text-right">
                    {item.quantity}
                  </td>
                  <td className="p-3 text-right">
                    {formatCurrency(item.price)}
                  </td>
                  <td className="p-3 text-right text-gray-500">
                    {item.tax_percent}%
                  </td>
                  <td className="p-3 text-right font-medium">
                    {formatCurrency(item.total_amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* PAYMENT + TOTAL SECTION - Wrap in container to keep together */}
        <div className="bottom-section-container grid grid-cols-2 gap-10 print:grid-cols-2 print:gap-6">
          
          {/* PAYMENT INFO - LEFT SIDE */}
          {paymentConfig?.isEnabled && (
            <div className="payment-section text-sm text-gray-600">
              <div className="flex items-center gap-2 mb-4 font-semibold text-gray-700">
                <CreditCard className="w-4 h-4 text-blue-600 print:w-3 print:h-3" />
                Payment Information
              </div>

              {razorpay?.qrCodeUrl && (
                <div className="mb-4">
                  <div className="bg-white p-2 rounded-lg border inline-block print:bg-white print:shadow-none">
                    <img
                      src={razorpay.qrCodeUrl}
                      alt="Payment QR"
                      className="w-24 h-24 print:w-20 print:h-20"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                    <Smartphone className="w-3 h-3 print:w-2 print:h-2" />
                    Scan with any UPI app
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <div className="flex items-center justify-between bg-gray-50 p-2 rounded border print:bg-gray-50">
                  <span className="text-gray-500">UPI ID:</span>
                  <div className="flex items-center gap-1">
                    <span className="font-medium text-gray-800">
                      {razorpay?.upiId}
                    </span>
                    <button
                      onClick={() => handleCopy(razorpay?.upiId, "upi")}
                      className="p-0.5 hover:bg-blue-50 rounded print:hidden"
                    >
                      <CopyIcon className="w-3 h-3 text-gray-500" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between bg-gray-50 p-2 rounded border print:bg-gray-50">
                  <span className="text-gray-500">Merchant:</span>
                  <span className="font-medium text-gray-800">
                    {razorpay?.merchantName}
                  </span>
                </div>
              </div>

              {/* Bank Transfer Details */}
              <div className="mt-4 border-t pt-3">
                <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                  <Landmark className="w-4 h-4 text-green-600 print:w-3 print:h-3" />
                  Bank Transfer
                </h4>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between bg-gray-50 p-2 rounded border print:bg-gray-50">
                    <span className="text-gray-500">Account:</span>
                    <div className="flex items-center gap-1">
                      <span className="font-medium text-gray-800">
                        {razorpay?.accountNumber}
                      </span>
                      <button
                        onClick={() => handleCopy(razorpay?.accountNumber, "account")}
                        className="p-0.5 hover:bg-blue-50 rounded print:hidden"
                      >
                        <CopyIcon className="w-3 h-3 text-gray-500" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between bg-gray-50 p-2 rounded border print:bg-gray-50">
                    <span className="text-gray-500">IFSC:</span>
                    <div className="flex items-center gap-1">
                      <span className="font-medium text-gray-800">
                        {razorpay?.ifscCode}
                      </span>
                      <button
                        onClick={() => handleCopy(razorpay?.ifscCode, "ifsc")}
                        className="p-0.5 hover:bg-blue-50 rounded print:hidden"
                      >
                        <CopyIcon className="w-3 h-3 text-gray-500" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between bg-gray-50 p-2 rounded border print:bg-gray-50">
                    <span className="text-gray-500">Bank:</span>
                    <span className="font-medium text-gray-800">
                      {razorpay?.bankName}
                    </span>
                  </div>
                </div>
              </div>

              {/* Powered by Razorpay */}
              <div className="mt-4 flex items-center justify-center gap-1 text-xs text-gray-400 border-t pt-3">
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
          <div className="totals-section flex justify-end">
            <div className="w-64 space-y-3 text-sm print:w-56">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span className="font-medium">{formatCurrency(invoice.subtotal)}</span>
              </div>

              <div className="flex justify-between text-gray-600 border-t pt-2">
                <span>Tax Amount</span>
                <span className="font-medium">{formatCurrency(invoice.tax_amount)}</span>
              </div>

              {invoice.discount_amount > 0 && (
                <div className="flex justify-between text-green-600 border-t pt-2">
                  <span>Discount</span>
                  <span>-{formatCurrency(invoice.discount_amount)}</span>
                </div>
              )}

              <div className="flex justify-between font-semibold text-lg bg-gray-100 px-3 py-2 rounded mt-2 print:bg-gray-100">
                <span>Total</span>
                <span className="text-blue-600 print:text-blue-600">
                  {formatCurrency(invoice.total_amount)}
                </span>
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
    </div>
  );
};

export default MinimalTemplate;