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
    <div className="max-w-5xl mx-auto bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">

      {/* HEADER */}
      <div className="bg-blue-50 border-b px-10 py-8 flex justify-between items-start">

        <div>
          <h1 className="text-4xl font-bold text-blue-600 tracking-wide">
            INVOICE
          </h1>

          <div className="mt-4 space-y-1 text-sm text-gray-600">

            <div className="flex items-center gap-2">
              <Hash className="w-4 h-4" />
              <span>Invoice #{invoice.invoice_no}</span>
              <button onClick={() => handleCopy(invoice.invoice_no, "invoice_no")}>
                <Copy className="w-3 h-3 text-gray-400 hover:text-gray-700"/>
              </button>
              {copySuccess === "invoice_no" && (
                <span className="text-green-500 text-xs">Copied</span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4"/>
              <span>Invoice Date: {formatDate(invoice.invoice_date)}</span>
            </div>

            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4"/>
              <span>Due Date: {formatDate(invoice.due_date)}</span>
            </div>

          </div>
        </div>


        {/* CUSTOMER */}
        <div className="text-right max-w-xs">

          <h3 className="font-semibold text-gray-700 mb-3">Bill To</h3>

          <div className="space-y-2 text-sm text-gray-600">

            <div className="flex justify-end gap-2">
              <Building2 className="w-4 h-4"/>
              <span>{invoice.customer.name}</span>
            </div>

            <div className="flex justify-end gap-2">
              <Mail className="w-4 h-4"/>
              <span>{invoice.customer.email}</span>
            </div>

            <div className="flex justify-end gap-2">
              <Phone className="w-4 h-4"/>
              <span>{invoice.customer.phone}</span>
            </div>

            <div className="flex justify-end gap-2">
              <MapPin className="w-4 h-4"/>
              <span>{invoice.customer.billing_address}</span>
            </div>

            {invoice.customer.gstin && (
              <div className="flex justify-end gap-2">
                <Hash className="w-4 h-4"/>
                <span>GST: {invoice.customer.gstin}</span>
              </div>
            )}

          </div>

        </div>
      </div>


      {/* ITEMS TABLE */}
      <div className="px-10 py-8">

        <table className="w-full border border-gray-200 rounded-lg overflow-hidden">

          <thead className="bg-blue-600 text-white text-sm">
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

              <tr key={item.id} className="text-sm hover:bg-gray-50">

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


        {/* SUMMARY + PAYMENT - UPDATED WITH FULL PAYMENT INFO */}
        <div className="grid md:grid-cols-2 gap-8 mt-10">

          {/* PAYMENT INFORMATION - FULL DETAILS */}
          {paymentConfig?.isEnabled && (
            <div className="border rounded-lg p-6 bg-gray-50">
              <h3 className="font-semibold mb-4 flex items-center gap-2 text-blue-600">
                <CreditCard className="w-5 h-5" />
                Payment Information
              </h3>

              {/* QR Code Section */}
              <div className="flex items-start gap-4 mb-4">
                <div className="bg-white p-2 rounded-lg shadow-sm border flex-shrink-0">
                  <img
                    src={paymentConfig.razorpay.qrCodeUrl}
                    alt="Payment QR"
                    className="w-24 h-24"
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

              {/* Bank Transfer Details */}
              <div className="border-t pt-4 mb-3">
                <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-1">
                  <Landmark className="w-4 h-4 text-green-600" />
                  Bank Transfer
                </h4>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between bg-white p-2 rounded-lg border">
                    <span className="text-xs text-gray-500">Account:</span>
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-medium text-gray-800">
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
                  
                  <div className="flex items-center justify-between bg-white p-2 rounded-lg border">
                    <span className="text-xs text-gray-500">IFSC:</span>
                    <div className="flex items-center gap-1">
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
                  
                  <div className="flex items-center justify-between bg-white p-2 rounded-lg border">
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


          {/* TOTALS */}
          <div className="flex justify-end">
            <div className="w-80 space-y-3 text-sm">
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

              <div className="border-t pt-3 flex justify-between text-lg font-bold text-blue-600">
                <span>Total</span>
                <span>{formatCurrency(invoice.total_amount)}</span>
              </div>

              {/* Payment Status Message */}
              {invoice.status === "paid" ? (
                <div className="mt-4 p-2 bg-green-50 border border-green-200 rounded-lg text-center">
                  <span className="text-xs text-green-600 font-medium">
                    ✓ Payment Received
                  </span>
                </div>
              ) : paymentConfig?.isEnabled && (
                <div className="mt-4 p-2 bg-blue-50 border border-blue-200 rounded-lg text-center">
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
      <div className="text-center text-sm text-gray-500 border-t py-6">
        Thank you for your business!
      </div>

    </div>
  );
};

export default ClassicTemplate;