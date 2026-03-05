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
    <div className="bg-[#F5F6F8] py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white border border-gray-200 rounded-xl shadow-sm p-10">

        {/* HEADER */}
        <div className="flex justify-between items-center border-b pb-4 mb-6">
          <h1 className="text-4xl font-semibold tracking-wide text-gray-800">
            INVOICE
          </h1>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Hash className="w-4 h-4" />
            <span>{invoice.invoice_no}</span>

            {handleCopy && (
              <button onClick={() => handleCopy(invoice.invoice_no, "invoice_no")}>
                <Copy className="w-3 h-3 text-gray-400 hover:text-gray-700" />
              </button>
            )}

            {copySuccess === "invoice_no" && (
              <span className="text-xs text-green-500">Copied</span>
            )}
          </div>
        </div>

        {/* COMPANY + CUSTOMER */}
        <div className="grid grid-cols-2 gap-12 mb-8 text-sm text-gray-600">
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

        {/* ITEMS TABLE - Updated with Tax Column */}
        <div className="border border-gray-200 rounded-lg overflow-hidden mb-8">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-700">
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
                <tr key={item.id} className="hover:bg-gray-50">
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

        {/* PAYMENT + TOTAL SECTION */}
        <div className="grid grid-cols-2 gap-10">
          {/* PAYMENT INFO - Enhanced with more details */}
          {paymentConfig?.isEnabled && (
            <div className="text-sm text-gray-600">
              <div className="flex items-center gap-2 mb-4 font-semibold text-gray-700">
                <CreditCard className="w-4 h-4 text-blue-600" />
                Payment Information
              </div>

              {razorpay?.qrCodeUrl && (
                <div className="mb-4">
                  <div className="bg-white p-2 rounded-lg border inline-block">
                    <img
                      src={razorpay.qrCodeUrl}
                      alt="Payment QR"
                      className="w-24 h-24"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                    <Smartphone className="w-3 h-3" />
                    Scan with any UPI app
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <div className="flex items-center justify-between bg-gray-50 p-2 rounded border">
                  <span className="text-gray-500">UPI ID:</span>
                  <div className="flex items-center gap-1">
                    <span className="font-medium text-gray-800">
                      {razorpay?.upiId}
                    </span>
                    <button
                      onClick={() => handleCopy(razorpay?.upiId, "upi")}
                      className="p-0.5 hover:bg-blue-50 rounded"
                    >
                      <CopyIcon className="w-3 h-3 text-gray-500" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between bg-gray-50 p-2 rounded border">
                  <span className="text-gray-500">Merchant:</span>
                  <span className="font-medium text-gray-800">
                    {razorpay?.merchantName}
                  </span>
                </div>
              </div>

              {/* Bank Transfer Details */}
              <div className="mt-4 border-t pt-3">
                <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                  <Landmark className="w-4 h-4 text-green-600" />
                  Bank Transfer
                </h4>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between bg-gray-50 p-2 rounded border">
                    <span className="text-gray-500">Account:</span>
                    <div className="flex items-center gap-1">
                      <span className="font-medium text-gray-800">
                        {razorpay?.accountNumber}
                      </span>
                      <button
                        onClick={() => handleCopy(razorpay?.accountNumber, "account")}
                        className="p-0.5 hover:bg-blue-50 rounded"
                      >
                        <CopyIcon className="w-3 h-3 text-gray-500" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between bg-gray-50 p-2 rounded border">
                    <span className="text-gray-500">IFSC:</span>
                    <div className="flex items-center gap-1">
                      <span className="font-medium text-gray-800">
                        {razorpay?.ifscCode}
                      </span>
                      <button
                        onClick={() => handleCopy(razorpay?.ifscCode, "ifsc")}
                        className="p-0.5 hover:bg-blue-50 rounded"
                      >
                        <CopyIcon className="w-3 h-3 text-gray-500" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between bg-gray-50 p-2 rounded border">
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
                <Shield className="w-3 h-3 text-green-500" />
              </div>
            </div>
          )}

          {/* TOTALS */}
          <div className="flex justify-end">
            <div className="w-64 space-y-3 text-sm">
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

              <div className="flex justify-between font-semibold text-lg bg-gray-100 px-3 py-2 rounded mt-2">
                <span>Total</span>
                <span className="text-blue-600">{formatCurrency(invoice.total_amount)}</span>
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
    </div>
  );
};

export default MinimalTemplate;