// components/invoiceTemplates/ProfessionalTemplate.jsx
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
  Landmark,
  Globe,
  ExternalLink,
} from "lucide-react";

const ProfessionalTemplate = ({
  invoice,
  paymentConfig,
  formatCurrency,
  handleCopy,
  formatDate,
  copySuccess,
}) => {
  if (!invoice) return null;

  // Dummy company data (replace later with API)
  const company = {
    name: "Your Company Name",
    address: "123 Business Street",
    city: "City, State Code",
    email: "info@company.com",
    website: "www.company.com",
    gst: "22AAAAA0000A1Z5",
  };

  return (
    <div className="invoice-container bg-gray-100 py-10 px-4 print:bg-white print:py-0 print:px-0">
      
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
          border-radius: 0 !important;
          border: 1px solid #e5e7eb !important;
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
        .bg-gradient-to-r, .bg-blue-900, .bg-blue-50, .bg-gray-50, .bg-green-50 {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        
        .bg-gradient-to-r.from-slate-100.to-slate-200 {
          background: #f1f5f9 !important;
        }
        
        .bg-gradient-to-r.from-blue-800.to-blue-900 {
          background: #1e3a8a !important;
        }
        
        .bg-blue-900 {
          background-color: #1e3a8a !important;
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
        .text-blue-600, .text-blue-700 {
          color: #2563eb !important;
        }
        
        .text-green-600 {
          color: #16a34a !important;
        }
        
        /* Adjust spacing for print */
        .p-8 {
          padding: 2rem !important;
        }
        
        .px-8 {
          padding-left: 2rem !important;
          padding-right: 2rem !important;
        }
        
        .py-6 {
          padding-top: 1.5rem !important;
          padding-bottom: 1.5rem !important;
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
        
        /* Clip path handling for print */
        .clip-path-element {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
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
        
        /* Professional header print adjustments */
        .professional-header-right {
          background: #1e3a8a !important;
          color: white !important;
        }
        
        /* Hide copy buttons in print */
        button:has(svg) {
          display: none !important;
        }
      `}</style>

      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden border print:shadow-none print:border print:rounded-none">
        
        {/* HEADER */}
        <div className="relative flex items-center justify-between bg-gradient-to-r from-slate-100 to-slate-200 px-8 py-6 overflow-hidden print:bg-slate-100">
          
          {/* LEFT SIDE */}
          <div className="flex items-center gap-4 z-10">
            <div>
              <h1 className="text-3xl font-bold tracking-wide text-blue-700 print:text-blue-700">
                {company.name.toUpperCase()}
              </h1>

              <p className="text-xs text-gray-500 mt-1 print:hidden">
                PROFESSIONAL INVOICE TEMPLATE
              </p>
            </div>
          </div>

          {/* RIGHT ANGLED BLOCK */}
          <div
            className="professional-header-right absolute right-0 top-0 h-full w-[320px] bg-gradient-to-r from-blue-800 to-blue-900 text-white flex items-center justify-end pr-8 print:bg-blue-900"
            style={{
              clipPath: "polygon(20% 0, 100% 0, 100% 100%, 0% 100%)",
            }}
          >
            <div className="text-sm text-right space-y-1">
              <p>
                Invoice #:{" "}
                <span className="font-semibold">{invoice.invoice_no}</span>
                <button
                  onClick={() => handleCopy(invoice.invoice_no, "invoice_no")}
                  className="ml-2 text-white/80 hover:text-white print:hidden"
                >
                  <Copy className="w-3 h-3 inline" />
                </button>
                {copySuccess === "invoice_no" && (
                  <span className="ml-2 text-xs text-green-300 print:hidden">Copied!</span>
                )}
              </p>

              <p>Invoice Date: {formatDate(invoice.invoice_date)}</p>
              <p>Due Date: {formatDate(invoice.due_date)}</p>
            </div>
          </div>
        </div>

        <div className="p-8 print:p-6">
          {/* COMPANY + CUSTOMER - Professional Layout */}
          <div className="grid grid-cols-2 gap-10 mb-8 border-b pb-6 print:grid-cols-2 print:gap-8 print:mb-6 print:pb-4">
            
            {/* COMPANY */}
            <div className="text-sm text-gray-600">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-blue-600 print:w-3 print:h-3" />
                From
              </h3>
              <p className="font-medium text-gray-800">{company.name}</p>
              <p>{company.address}</p>
              <p>{company.city}</p>
              <div className="mt-2 space-y-1">
                <p className="flex items-center gap-2">
                  <Mail className="w-3 h-3 text-gray-400 print:w-2 print:h-2" />
                  {company.email}
                </p>
                <p className="flex items-center gap-2">
                  <Globe className="w-3 h-3 text-gray-400 print:w-2 print:h-2" />
                  {company.website}
                </p>
                <p className="flex items-center gap-2">
                  <Hash className="w-3 h-3 text-gray-400 print:w-2 print:h-2" />
                  GST: {company.gst}
                </p>
              </div>
            </div>

            {/* CUSTOMER */}
            <div className="text-sm text-gray-600">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-blue-600 print:w-3 print:h-3" />
                Bill To
              </h3>
              <p className="font-medium text-gray-800">
                {invoice.customer.name}
              </p>
              <p>{invoice.customer.billing_address}</p>
              <div className="mt-2 space-y-1">
                <p className="flex items-center gap-2">
                  <Mail className="w-3 h-3 text-gray-400 print:w-2 print:h-2" />
                  {invoice.customer.email}
                </p>
                <p className="flex items-center gap-2">
                  <Phone className="w-3 h-3 text-gray-400 print:w-2 print:h-2" />
                  {invoice.customer.phone}
                </p>
                {invoice.customer.gstin && (
                  <p className="flex items-center gap-2">
                    <Hash className="w-3 h-3 text-gray-400 print:w-2 print:h-2" />
                    GST: {invoice.customer.gstin}
                    <button
                      onClick={() =>
                        handleCopy(invoice.customer.gstin, "gstin")
                      }
                      className="ml-1 text-gray-400 hover:text-gray-600 print:hidden"
                    >
                      <CopyIcon className="w-3 h-3" />
                    </button>
                    {copySuccess === "gstin" && (
                      <span className="text-xs text-green-500 print:hidden">Copied!</span>
                    )}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* ITEMS TABLE */}
          <div className="overflow-hidden border rounded-lg mb-8 print:mb-6">
            <table className="w-full text-sm">
              <thead className="bg-blue-900 text-white print:bg-blue-900">
                <tr>
                  <th className="p-3 text-left">Description</th>
                  <th className="p-3 text-right">Qty</th>
                  <th className="p-3 text-right">Unit Price</th>
                  <th className="p-3 text-right">Tax %</th>
                  <th className="p-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {invoice.items.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 print:hover:bg-transparent">
                    <td className="p-3 text-gray-700 font-medium">
                      {item.item_name}
                    </td>
                    <td className="p-3 text-right">{item.quantity}</td>
                    <td className="p-3 text-right">
                      {formatCurrency(item.price)}
                    </td>
                    <td className="p-3 text-right text-gray-500">
                      {item.tax_percent}%
                    </td>
                    <td className="p-3 text-right font-medium text-blue-600 print:text-blue-600">
                      {formatCurrency(item.total_amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* PAYMENT + TOTALS - Professional Side by Side */}
          <div className="bottom-section-container grid grid-cols-2 gap-8 mt-6 print:grid-cols-2 print:gap-6">
            
            {/* PAYMENT INFORMATION - LEFT SIDE */}
            {paymentConfig?.isEnabled && (
              <div className="payment-section bg-gray-50 rounded-lg border p-6 print:bg-gray-50 print:p-4">
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
                      Quick UPI Payment
                    </p>
                    <div className="mt-2 space-y-2">
                      <div className="flex items-center justify-between bg-white p-2 rounded border print:bg-white">
                        <span className="text-xs text-gray-500">UPI ID:</span>
                        <div className="flex items-center gap-1">
                          <span className="text-xs font-medium text-gray-800">
                            {paymentConfig.razorpay.upiId}
                          </span>
                          <button
                            onClick={() =>
                              handleCopy(paymentConfig.razorpay.upiId, "upi")
                            }
                            className="p-0.5 hover:bg-blue-50 rounded print:hidden"
                          >
                            <CopyIcon className="w-3 h-3 text-gray-500" />
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between bg-white p-2 rounded border print:bg-white">
                        <span className="text-xs text-gray-500">Merchant:</span>
                        <span className="text-xs font-medium text-gray-800">
                          {paymentConfig.razorpay.merchantName}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bank Transfer Details */}
                <div className="border-t pt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-1">
                    <Landmark className="w-4 h-4 text-green-600 print:w-3 print:h-3" />
                    Bank Transfer
                  </h4>

                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-white p-2 rounded border print:bg-white">
                        <p className="text-xs text-gray-500">Account</p>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-xs font-medium text-gray-800 truncate">
                            {paymentConfig.razorpay.accountNumber}
                          </span>
                          <button
                            onClick={() =>
                              handleCopy(
                                paymentConfig.razorpay.accountNumber,
                                "account",
                              )
                            }
                            className="p-0.5 hover:bg-blue-50 rounded print:hidden"
                          >
                            <CopyIcon className="w-3 h-3 text-gray-500" />
                          </button>
                        </div>
                      </div>
                      <div className="bg-white p-2 rounded border print:bg-white">
                        <p className="text-xs text-gray-500">IFSC</p>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-xs font-medium text-gray-800">
                            {paymentConfig.razorpay.ifscCode}
                          </span>
                          <button
                            onClick={() =>
                              handleCopy(
                                paymentConfig.razorpay.ifscCode,
                                "ifsc",
                              )
                            }
                            className="p-0.5 hover:bg-blue-50 rounded print:hidden"
                          >
                            <CopyIcon className="w-3 h-3 text-gray-500" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white p-2 rounded border print:bg-white">
                      <p className="text-xs text-gray-500">Bank</p>
                      <p className="text-xs font-medium text-gray-800 mt-1">
                        {paymentConfig.razorpay.bankName}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Powered by Razorpay */}
                <div className="mt-4 flex items-center justify-center gap-1 text-xs text-gray-400 border-t pt-3">
                  <span>Secure payments by</span>
                  <img
                    src="https://razorpay.com/assets/razorpay-logo.svg"
                    alt="Razorpay"
                    className="h-4"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "https://via.placeholder.com/60x20?text=Razorpay";
                    }}
                  />
                  <Shield className="w-3 h-3 text-green-500 print:w-2 print:h-2" />
                </div>
              </div>
            )}

            {/* TOTALS - RIGHT SIDE */}
            <div className="totals-section flex justify-end">
              <div className="w-80 space-y-3 text-sm print:w-72">
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium text-gray-800">
                    {formatCurrency(invoice.subtotal)}
                  </span>
                </div>

                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-600">Tax Amount</span>
                  <span className="font-medium text-gray-800">
                    {formatCurrency(invoice.tax_amount)}
                  </span>
                </div>

                {invoice.discount_amount > 0 && (
                  <div className="flex justify-between border-b pb-2 text-green-600">
                    <span>Discount</span>
                    <span>-{formatCurrency(invoice.discount_amount)}</span>
                  </div>
                )}

                <div className="flex justify-between bg-blue-50 p-4 rounded-lg font-bold text-lg mt-4 print:bg-blue-50">
                  <span className="text-gray-700">Total Due</span>
                  <span className="text-blue-600 print:text-blue-600">
                    {formatCurrency(invoice.total_amount)}
                  </span>
                </div>

                {/* Payment Status */}
                {invoice.status === "paid" ? (
                  <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg text-center print:bg-green-50">
                    <span className="text-sm text-green-600 font-medium flex items-center justify-center gap-2">
                      <Shield className="w-4 h-4 print:w-3 print:h-3" />
                      Payment Received
                    </span>
                  </div>
                ) : (
                  paymentConfig?.isEnabled && (
                    <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg print:bg-blue-50">
                      <p className="text-xs text-blue-600 text-center">
                        Complete payment using QR code or bank transfer
                      </p>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>

          {/* FOOTER - Professional Note */}
          <div className="invoice-footer mt-8 pt-6 border-t text-center print:mt-6 print:pt-4">
            <p className="text-sm text-gray-500">
              This is a computer generated invoice. No signature required.
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Thank you for your business!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalTemplate;