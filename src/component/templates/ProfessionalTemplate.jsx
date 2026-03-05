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
    <div className="bg-gray-100 py-10 px-4">
      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden border">
        {/* HEADER */}
        <div className="relative flex items-center justify-between bg-gradient-to-r from-slate-100 to-slate-200 px-8 py-6 overflow-hidden">
          {/* LEFT SIDE */}
          <div className="flex items-center gap-4 z-10">
           

            <div>
              <h1 className="text-3xl font-bold tracking-wide text-blue-700">
                {company.name.toUpperCase()}
              </h1>

              <p className="text-xs text-gray-500 mt-1">
                PROFESSIONAL INVOICE TEMPLATE
              </p>
            </div>
          </div>

          {/* RIGHT ANGLED BLOCK */}
          <div
            className="absolute right-0 top-0 h-full w-[320px] bg-gradient-to-r from-blue-800 to-blue-900 text-white flex items-center justify-end pr-8"
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
                  className="ml-2 text-white/80 hover:text-white"
                >
                  <Copy className="w-3 h-3 inline" />
                </button>
                {copySuccess === "invoice_no" && (
                  <span className="ml-2 text-xs text-green-300">Copied!</span>
                )}
              </p>

              <p>Invoice Date: {formatDate(invoice.invoice_date)}</p>
              <p>Due Date: {formatDate(invoice.due_date)}</p>
            </div>
          </div>
        </div>

        <div className="p-8">
          {/* COMPANY + CUSTOMER - Professional Layout */}
          <div className="grid grid-cols-2 gap-10 mb-8 border-b pb-6">
            {/* COMPANY */}
            <div className="text-sm text-gray-600">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-blue-600" />
                From
              </h3>
              <p className="font-medium text-gray-800">{company.name}</p>
              <p>{company.address}</p>
              <p>{company.city}</p>
              <div className="mt-2 space-y-1">
                <p className="flex items-center gap-2">
                  <Mail className="w-3 h-3 text-gray-400" />
                  {company.email}
                </p>
                <p className="flex items-center gap-2">
                  <Globe className="w-3 h-3 text-gray-400" />
                  {company.website}
                </p>
                <p className="flex items-center gap-2">
                  <Hash className="w-3 h-3 text-gray-400" />
                  GST: {company.gst}
                </p>
              </div>
            </div>

            {/* CUSTOMER */}
            <div className="text-sm text-gray-600">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-blue-600" />
                Bill To
              </h3>
              <p className="font-medium text-gray-800">
                {invoice.customer.name}
              </p>
              <p>{invoice.customer.billing_address}</p>
              <div className="mt-2 space-y-1">
                <p className="flex items-center gap-2">
                  <Mail className="w-3 h-3 text-gray-400" />
                  {invoice.customer.email}
                </p>
                <p className="flex items-center gap-2">
                  <Phone className="w-3 h-3 text-gray-400" />
                  {invoice.customer.phone}
                </p>
                {invoice.customer.gstin && (
                  <p className="flex items-center gap-2">
                    <Hash className="w-3 h-3 text-gray-400" />
                    GST: {invoice.customer.gstin}
                    <button
                      onClick={() =>
                        handleCopy(invoice.customer.gstin, "gstin")
                      }
                      className="ml-1 text-gray-400 hover:text-gray-600"
                    >
                      <CopyIcon className="w-3 h-3" />
                    </button>
                    {copySuccess === "gstin" && (
                      <span className="text-xs text-green-500">Copied!</span>
                    )}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* ITEMS TABLE */}
          <div className="overflow-hidden border rounded-lg mb-8">
            <table className="w-full text-sm">
              <thead className="bg-blue-900 text-white">
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
                  <tr key={item.id} className="hover:bg-gray-50">
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
                    <td className="p-3 text-right font-medium text-blue-600">
                      {formatCurrency(item.total_amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* PAYMENT + TOTALS - Professional Side by Side */}
          <div className="grid grid-cols-2 gap-8 mt-6">
            {/* PAYMENT INFORMATION - Full Details */}
            {paymentConfig?.isEnabled && (
              <div className="bg-gray-50 rounded-lg border p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-blue-600" />
                  Payment Information
                </h3>

                {/* QR Code Section */}
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
                      Quick UPI Payment
                    </p>
                    <div className="mt-2 space-y-2">
                      <div className="flex items-center justify-between bg-white p-2 rounded border">
                        <span className="text-xs text-gray-500">UPI ID:</span>
                        <div className="flex items-center gap-1">
                          <span className="text-xs font-medium text-gray-800">
                            {paymentConfig.razorpay.upiId}
                          </span>
                          <button
                            onClick={() =>
                              handleCopy(paymentConfig.razorpay.upiId, "upi")
                            }
                            className="p-0.5 hover:bg-blue-50 rounded"
                          >
                            <CopyIcon className="w-3 h-3 text-gray-500" />
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between bg-white p-2 rounded border">
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
                    <Landmark className="w-4 h-4 text-green-600" />
                    Bank Transfer
                  </h4>

                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-white p-2 rounded border">
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
                            className="p-0.5 hover:bg-blue-50 rounded"
                          >
                            <CopyIcon className="w-3 h-3 text-gray-500" />
                          </button>
                        </div>
                      </div>
                      <div className="bg-white p-2 rounded border">
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
                            className="p-0.5 hover:bg-blue-50 rounded"
                          >
                            <CopyIcon className="w-3 h-3 text-gray-500" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white p-2 rounded border">
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
                  <Shield className="w-3 h-3 text-green-500" />
                </div>
              </div>
            )}

            {/* TOTALS */}
            <div className="flex justify-end">
              <div className="w-80 space-y-3 text-sm">
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

                <div className="flex justify-between bg-blue-50 p-4 rounded-lg font-bold text-lg mt-4">
                  <span className="text-gray-700">Total Due</span>
                  <span className="text-blue-600">
                    {formatCurrency(invoice.total_amount)}
                  </span>
                </div>

                {/* Payment Status */}
                {invoice.status === "paid" ? (
                  <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg text-center">
                    <span className="text-sm text-green-600 font-medium flex items-center justify-center gap-2">
                      <Shield className="w-4 h-4" />
                      Payment Received
                    </span>
                  </div>
                ) : (
                  paymentConfig?.isEnabled && (
                    <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
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
          <div className="mt-8 pt-6 border-t text-center">
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
