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
    <div className="bg-slate-100 py-10 px-4">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden border">

        {/* Top Gradient Border */}
        <div className="h-3 bg-gradient-to-r from-blue-600 to-indigo-600"></div>

        <div className="p-10">

          {/* HEADER */}
          <div className="flex justify-between items-start mb-10">

            {/* Invoice Info */}
            <div>
              <h1 className="text-4xl font-bold text-blue-600 tracking-wide">
                INVOICE
              </h1>

              <p className="text-xs text-gray-400 mt-1">
                Modern Billing Template
              </p>

              <div className="mt-4 space-y-2 text-sm text-gray-600">

                <div className="flex items-center gap-2">
                  <Hash className="w-4 h-4" />
                  <span>Invoice #{invoice.invoice_no}</span>

                  <button
                    onClick={() =>
                      handleCopy(invoice.invoice_no, "invoice_no")
                    }
                  >
                    <Copy className="w-3 h-3 text-gray-400 hover:text-gray-700" />
                  </button>

                  {copySuccess === "invoice_no" && (
                    <span className="text-xs text-green-500">Copied</span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>Invoice Date: {formatDate(invoice.invoice_date)}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>Due Date: {formatDate(invoice.due_date)}</span>
                </div>

              </div>
            </div>

            {/* CUSTOMER CARD */}
            <div className="text-right bg-gradient-to-br from-blue-50 to-white border rounded-lg px-6 py-5 shadow-sm">
              <h2 className="text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                Bill To
              </h2>

              <div className="space-y-1 text-sm text-gray-600">

                <div className="flex justify-end gap-2">
                  <Building2 className="w-4 h-4" />
                  <span>{invoice.customer.name}</span>
                </div>

                <div className="flex justify-end gap-2">
                  <Mail className="w-4 h-4" />
                  <span>{invoice.customer.email}</span>
                </div>

                <div className="flex justify-end gap-2">
                  <Phone className="w-4 h-4" />
                  <span>{invoice.customer.phone}</span>
                </div>

                <div className="flex justify-end gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{invoice.customer.billing_address}</span>
                </div>

                {invoice.customer.gstin && (
                  <div className="flex justify-end gap-2">
                    <Hash className="w-4 h-4" />
                    <span>GST: {invoice.customer.gstin}</span>
                  </div>
                )}

              </div>
            </div>

          </div>

          {/* COMPANY INFO */}
          <div className="mb-10 bg-gray-50 border rounded-lg p-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">
              Company Information
            </h3>

            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">

              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                {company.name}
              </div>

              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                {company.email}
              </div>

              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                {company.phone}
              </div>

              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                {company.address}
              </div>

              <div className="flex items-center gap-2 col-span-2">
                <Hash className="w-4 h-4" />
                GSTIN: {company.gst}
              </div>

            </div>
          </div>

          {/* ITEMS TABLE - Updated with Tax Column */}
          <div className="overflow-hidden border rounded-lg mb-10">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm">
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
                  <tr key={item.id} className="hover:bg-gray-50">
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
                    <td className="p-4 text-right font-semibold text-blue-600">
                      {formatCurrency(item.total_amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* BOTTOM SECTION - Balanced Height Columns */}
          <div className="grid grid-cols-2 gap-10">
            {/* PAYMENT INFORMATION */}
            {paymentConfig?.isEnabled && (
              <div className="bg-gradient-to-br from-blue-50 to-white border rounded-lg p-6 h-full flex flex-col">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-blue-600" />
                  Payment Information
                </h3>

                {/* QR Code Section - Compact */}
                <div className="flex items-start gap-4 mb-4">
                  <div className="bg-white p-2 rounded-lg shadow-sm border flex-shrink-0">
                    <img
                      src={paymentConfig.razorpay.qrCodeUrl}
                      alt="Payment QR"
                      className="w-20 h-20"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-700 flex items-center gap-1">
                      <Smartphone className="w-4 h-4 text-blue-600" />
                      Scan with UPI app
                    </p>
                    <div className="mt-2 space-y-2">
                      <div className="flex items-center justify-between bg-white p-2 rounded-lg border">
                        <span className="text-xs text-gray-500">UPI ID:</span>
                        <div className="flex items-center gap-1">
                          <span className="text-xs font-medium text-gray-800">
                            {paymentConfig.razorpay.upiId}
                          </span>
                          <button
                            onClick={() => handleCopy(paymentConfig.razorpay.upiId, "upi")}
                            className="p-0.5 hover:bg-blue-50 rounded"
                          >
                            <CopyIcon className="w-3 h-3 text-gray-500" />
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between bg-white p-2 rounded-lg border">
                        <span className="text-xs text-gray-500">Merchant:</span>
                        <span className="text-xs font-medium text-gray-800">
                          {paymentConfig.razorpay.merchantName}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bank Details - Compact Grid */}
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div className="bg-white p-2 rounded-lg border">
                    <p className="text-xs text-gray-500">Account</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-gray-800 truncate">
                        {paymentConfig.razorpay.accountNumber}
                      </span>
                      <button
                        onClick={() => handleCopy(paymentConfig.razorpay.accountNumber, "account")}
                        className="p-0.5 hover:bg-blue-50 rounded"
                      >
                        <CopyIcon className="w-3 h-3 text-gray-500" />
                      </button>
                    </div>
                  </div>
                  <div className="bg-white p-2 rounded-lg border">
                    <p className="text-xs text-gray-500">IFSC</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-gray-800">
                        {paymentConfig.razorpay.ifscCode}
                      </span>
                      <button
                        onClick={() => handleCopy(paymentConfig.razorpay.ifscCode, "ifsc")}
                        className="p-0.5 hover:bg-blue-50 rounded"
                      >
                        <CopyIcon className="w-3 h-3 text-gray-500" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-2 rounded-lg border mb-3">
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
                  <Shield className="w-3 h-3 text-green-500" />
                </div>
              </div>
            )}

            {/* TOTALS - Same height container */}
            <div className="flex justify-end h-full">
              <div className="w-72 bg-gradient-to-br from-gray-50 to-white border rounded-lg p-6 space-y-3 shadow-sm h-full flex flex-col">
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
                    <span className="text-blue-600">
                      {formatCurrency(invoice.total_amount)}
                    </span>
                  </div>

                  {/* Payment Status Message */}
                  {invoice.status === "paid" ? (
                    <div className="p-2 bg-green-50 border border-green-200 rounded-lg text-center">
                      <span className="text-xs text-green-600 font-medium">
                        ✓ Payment Received
                      </span>
                    </div>
                  ) : (
                    <div className="p-2 bg-blue-50 border border-blue-200 rounded-lg text-center">
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
          <div className="mt-10 border-t pt-6 text-center text-sm text-gray-500">
            Thank you for your business!
          </div>

        </div>
      </div>
    </div>
  );
};

export default ModernTemplate;