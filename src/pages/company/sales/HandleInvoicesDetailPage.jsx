// pages/admin/invoices/[id].jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  FileText, 
  Download, 
  Send, 
  Edit, 
  Printer,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  Copy,
  Building2,
  User,
  Hash,
  CreditCard,
  DollarSign,
  Percent,
  Receipt,
  MoreVertical,
  RefreshCw
} from 'lucide-react';
import { api } from '../../../utils/app';

const HandleInvoicesDetailPage = () => {
  const { id } = useParams(); // Get invoice ID from URL
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copySuccess, setCopySuccess] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      fetchInvoiceDetails();
    }
  }, [id]);

  const fetchInvoiceDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/org/invoices/${id}`); // Adjust endpoint as needed
      console.log(response)
      // Extract data from response
      const invoiceData = response.data.data || response.data;
      setInvoice(invoiceData);
    } catch (error) {
      console.error('Error fetching invoice details:', error);
      setError(error.message || 'Failed to fetch invoice details');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopySuccess(field);
    setTimeout(() => setCopySuccess(null), 2000);
  };

  const handleStatusUpdate = async (newStatus) => {
    try {
      await api.patch(`/invoices/${id}/status`, { status: newStatus });
      setInvoice(prev => ({ ...prev, status: newStatus }));
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const getStatusConfig = (status) => {
    const config = {
      draft: {
        icon: Clock,
        color: 'bg-[#E2E8F0] text-[#475569]',
        label: 'Draft',
        bgLight: 'bg-gray-50'
      },
      sent: {
        icon: Send,
        color: 'bg-[#DBEAFE] text-[#1E40AF]',
        label: 'Sent',
        bgLight: 'bg-blue-50'
      },
      paid: {
        icon: CheckCircle,
        color: 'bg-[#DCFCE7] text-[#15803D]',
        label: 'Paid',
        bgLight: 'bg-green-50'
      },
      overdue: {
        icon: AlertCircle,
        color: 'bg-[#FEE2E2] text-[#B91C1C]',
        label: 'Overdue',
        bgLight: 'bg-red-50'
      },
      cancelled: {
        icon: XCircle,
        color: 'bg-[#F1F5F9] text-[#64748B]',
        label: 'Cancelled',
        bgLight: 'bg-gray-50'
      }
    };
    return config[status] || config.draft;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#2563EB] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#64748B]">Loading invoice details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <p className="text-[#0F172A] font-medium text-lg mb-2">Error Loading Invoice</p>
          <p className="text-[#64748B] mb-4">{error}</p>
          <button
            onClick={() => window.location.href = '/admin/invoices'}
            className="px-4 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-lg text-sm font-medium"
          >
            Go Back to Invoices
          </button>
        </div>
      </div>
    );
  }

  if (!invoice) return null;

  const statusConfig = getStatusConfig(invoice.status);
  const StatusIcon = statusConfig.icon;

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Header */}
      <header className="bg-white border-b border-[#E2E8F0] sticky top-0 z-10">
        <div className="px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/org/sales/proforma-invoices')}
                className="p-2 hover:bg-[#F1F5F9] rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-[#64748B]" />
              </button>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold text-[#0F172A]">Invoice {invoice.invoice_no}</h1>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full flex items-center gap-1 ${statusConfig.color}`}>
                    <StatusIcon className="w-3 h-3" />
                    {statusConfig.label}
                  </span>
                </div>
                <p className="text-sm text-[#64748B] mt-1">
                  Created on {formatDate(invoice.created_at)}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={fetchInvoiceDetails}
                className="p-2 border border-[#CBD5E1] rounded-lg hover:bg-[#F8FAFC] transition-colors"
                title="Refresh"
              >
                <RefreshCw className="w-4 h-4 text-[#64748B]" />
              </button>
              
              {/* {invoice.status === 'draft' && (
                <button
                  onClick={() => window.location.href = `/admin/invoices/${invoice.id}/edit`}
                  className="px-4 py-2 border border-[#CBD5E1] rounded-lg text-sm font-medium text-[#334155] hover:bg-[#F8FAFC] transition-colors flex items-center space-x-2"
                >
                  <Edit className="w-4 h-4" />
                  <span>Edit</span>
                </button>
              )} */}
              
              <button
                onClick={() => window.open(`/admin/invoices/${invoice.id}/print`, '_blank')}
                className="px-4 py-2 border border-[#CBD5E1] rounded-lg text-sm font-medium text-[#334155] hover:bg-[#F8FAFC] transition-colors flex items-center space-x-2"
              >
                <Printer className="w-4 h-4" />
                <span>Print</span>
              </button>
              
              <button
                onClick={() => {/* Download PDF */}}
                className="px-4 py-2 border border-[#CBD5E1] rounded-lg text-sm font-medium text-[#334155] hover:bg-[#F8FAFC] transition-colors flex items-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Download</span>
              </button>
              
              {invoice.status === 'draft' && (
                <button
                  onClick={() => handleStatusUpdate('sent')}
                  className="px-4 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-lg text-sm font-medium flex items-center space-x-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Invoice</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-8">
        {/* Status Update Buttons (if draft) */}
        {invoice.status === 'draft' && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-yellow-600" />
              <span className="text-sm text-yellow-700">This invoice is in draft mode</span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleStatusUpdate('cancelled')}
                className="px-3 py-1 border border-red-200 text-red-600 rounded-lg text-sm hover:bg-red-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleStatusUpdate('sent')}
                className="px-3 py-1 bg-[#2563EB] text-white rounded-lg text-sm hover:bg-[#1D4ED8]"
              >
                Mark as Sent
              </button>
            </div>
          </div>
        )}

        {/* Invoice Preview Card */}
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
                    <span className="text-sm font-medium text-[#0F172A]">{invoice.invoice_no}</span>
                    <button
                      onClick={() => handleCopy(invoice.invoice_no, 'invoice_no')}
                      className="p-1 hover:bg-white rounded transition-colors"
                    >
                      <Copy className="w-3 h-3 text-[#64748B]" />
                    </button>
                    {copySuccess === 'invoice_no' && (
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
              
              {/* Company Info */}
              {/* <div className="text-right">
                <h3 className="font-semibold text-[#0F172A]">Your Company Name</h3>
                <p className="text-sm text-[#64748B]">123 Business Street</p>
                <p className="text-sm text-[#64748B]">City, State - 123456</p>
                <p className="text-sm text-[#64748B]">GSTIN: 27AABCU9603R1Z1</p>
              </div> */}
            </div>
          </div>

          {/* Customer Details */}
          <div className="p-8 border-b border-[#E2E8F0]">
            <h3 className="text-sm font-medium text-[#64748B] mb-3">Bill To:</h3>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-[#64748B]" />
                  <span className="font-medium text-[#0F172A]">{invoice.customer.name}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-[#64748B]">
                  <Mail className="w-4 h-4" />
                  <span>{invoice.customer.email}</span>
                  <button
                    onClick={() => handleCopy(invoice.customer.email, 'email')}
                    className="p-1 hover:bg-[#F1F5F9] rounded"
                  >
                    <Copy className="w-3 h-3" />
                  </button>
                </div>
                <div className="flex items-center gap-2 text-sm text-[#64748B]">
                  <Phone className="w-4 h-4" />
                  <span>{invoice.customer.phone}</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-[#64748B]">
                  <MapPin className="w-4 h-4" />
                  <span>{invoice.customer.billing_address}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-[#64748B]">
                  <Hash className="w-4 h-4" />
                  <span>GST: {invoice.customer.gstin}</span>
                  <button
                    onClick={() => handleCopy(invoice.customer.gstin, 'gstin')}
                    className="p-1 hover:bg-[#F1F5F9] rounded"
                  >
                    <Copy className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="p-8">
            <table className="w-full">
              <thead className="bg-[#F8FAFC]">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[#64748B] uppercase tracking-wider">Item</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-[#64748B] uppercase tracking-wider">Qty</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-[#64748B] uppercase tracking-wider">Price</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-[#64748B] uppercase tracking-wider">Tax %</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-[#64748B] uppercase tracking-wider">Tax Amt</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-[#64748B] uppercase tracking-wider">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {invoice.items.map((item) => (
                  <tr key={item.id}>
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium text-[#0F172A]">{item.item_name}</p>
                    </td>
                    <td className="px-4 py-3 text-right text-sm text-[#64748B]">{item.quantity}</td>
                    <td className="px-4 py-3 text-right text-sm text-[#64748B]">{formatCurrency(item.price)}</td>
                    <td className="px-4 py-3 text-right text-sm text-[#64748B]">{item.tax_percent}%</td>
                    <td className="px-4 py-3 text-right text-sm text-[#64748B]">{formatCurrency(item.tax_amount)}</td>
                    <td className="px-4 py-3 text-right text-sm font-medium text-[#0F172A]">{formatCurrency(item.total_amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Summary */}
            <div className="mt-6 pt-6 border-t border-[#E2E8F0]">
              <div className="flex justify-end">
                <div className="w-80 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#64748B]">Subtotal:</span>
                    <span className="text-[#0F172A]">{formatCurrency(invoice.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#64748B]">Tax Amount:</span>
                    <span className="text-[#0F172A]">{formatCurrency(invoice.tax_amount)}</span>
                  </div>
                  {invoice.discount_amount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-[#64748B]">Discount:</span>
                      <span className="text-[#22C55E]">-{formatCurrency(invoice.discount_amount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-lg font-bold pt-2 border-t border-[#E2E8F0]">
                    <span className="text-[#0F172A]">Total Amount:</span>
                    <span className="text-[#2563EB]">{formatCurrency(invoice.total_amount)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Notes */}
            <div className="mt-8 pt-6 border-t border-[#E2E8F0] text-center text-sm text-[#64748B]">
              <p>Thank you for your business!</p>
              <p className="mt-1">This is a computer generated invoice, no signature required.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HandleInvoicesDetailPage;