// pages/admin/invoices/[id].jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  FileText,
  Download,
  Send,
  Edit,
  Printer,
  RefreshCw,
  AlertCircle,
  Clock,
  CheckCircle,
  XCircle,
  Layout,
} from "lucide-react";
import { api } from "../../../utils/app";
import toast from "react-hot-toast";
import { getTemplateById } from "../../../component/templates/invoiceTemplates";

const HandleInvoicesDetailPage = () => {
  const { id } = useParams();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copySuccess, setCopySuccess] = useState(null);
  const [organizationSettings, setOrganizationSettings] = useState(null);
  const navigate = useNavigate();

  // Dummy payment configuration - replace with real data from API
  const paymentConfig = {
    razorpay: {
      qrCodeUrl:
        "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=razorpay@axisbank&pn=BillSmart&am=3540&cu=INR",
      upiId: "billsmart@razorpay",
      merchantName: "BillSmart Solutions",
      accountNumber: "1234567890",
      ifscCode: "RAZR0000001",
      bankName: "Razorpay Payments Bank",
    },
    isEnabled: true,
  };

  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch both invoice details and organization settings in parallel
      const [
        invoiceResponse,
        // ,settingsResponse
      ] = await Promise.all([
        api.get(`/org/invoices/${id}`),
        // api.get('/org/settings') // Get organization settings including template preference
      ]);

      const invoiceData = invoiceResponse.data.data || invoiceResponse.data;
      // const settingsData = settingsResponse.data.data || settingsResponse.data;

      setInvoice(invoiceData);
      // setOrganizationSettings(settingsData);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(error.message || "Failed to fetch invoice details");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopySuccess(field);
    setTimeout(() => setCopySuccess(null), 2000);
  };

  const handleStatusUpdate = async () => {
    try {
      const res = await api.post(`/org/invoices/${id}/send-email`);
      if (res.data.message) {
        toast.success(res.data.message);
        fetchData();
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleDownloadPDF = async () => {
    try {
      // Implement PDF download logic
      const response = await api.get(`/org/invoices/${id}/pdf`, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `invoice-${invoice.invoice_no}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error downloading PDF:", error);
      toast.error("Failed to download PDF");
    }
  };

  const handlePrint = () => {
    window.open(`/admin/invoices/${invoice.id}/print`, "_blank");
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const getStatusConfig = (status) => {
    const config = {
      draft: {
        icon: Clock,
        color: "bg-[#E2E8F0] text-[#475569]",
        label: "Draft",
        bgLight: "bg-gray-50",
      },
      sent: {
        icon: Send,
        color: "bg-[#DBEAFE] text-[#1E40AF]",
        label: "Sent",
        bgLight: "bg-blue-50",
      },
      paid: {
        icon: CheckCircle,
        color: "bg-[#DCFCE7] text-[#15803D]",
        label: "Paid",
        bgLight: "bg-green-50",
      },
      overdue: {
        icon: AlertCircle,
        color: "bg-[#FEE2E2] text-[#B91C1C]",
        label: "Overdue",
        bgLight: "bg-red-50",
      },
      cancelled: {
        icon: XCircle,
        color: "bg-[#F1F5F9] text-[#64748B]",
        label: "Cancelled",
        bgLight: "bg-gray-50",
      },
    };
    return config[status] || config.draft;
  };

  // Get the appropriate template component
  const templateId =
    organizationSettings?.invoice_template_id ||
    Number(localStorage.getItem("invoice_template")) ||
    0;
  const TemplateComponent = getTemplateById(templateId).component;

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
          <p className="text-[#0F172A] font-medium text-lg mb-2">
            Error Loading Invoice
          </p>
          <p className="text-[#64748B] mb-4">{error}</p>
          <button
            onClick={() => (window.location.href = "/admin/invoices")}
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
                onClick={() => navigate("/org/sales/invoices")}
                className="p-2 hover:bg-[#F1F5F9] rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-[#64748B]" />
              </button>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold text-[#0F172A]">
                    Invoice {invoice.invoice_no}
                  </h1>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full flex items-center gap-1 ${statusConfig.color}`}
                  >
                    <StatusIcon className="w-3 h-3" />
                    {statusConfig.label}
                  </span>

                  {/* Template indicator */}
                  {organizationSettings?.invoice_template_id && (
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-[#F1F5F9] text-[#64748B] flex items-center gap-1">
                      <Layout className="w-3 h-3" />
                      {
                        getTemplateById(
                          organizationSettings.invoice_template_id,
                        ).name
                      }
                    </span>
                  )}
                </div>
                <p className="text-sm text-[#64748B] mt-1">
                  Created on {formatDate(invoice.created_at)}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={fetchData}
                className="p-2 border border-[#CBD5E1] rounded-lg hover:bg-[#F8FAFC] transition-colors"
                title="Refresh"
              >
                <RefreshCw className="w-4 h-4 text-[#64748B]" />
              </button>

              <button
                onClick={handlePrint}
                className="px-4 py-2 border border-[#CBD5E1] rounded-lg text-sm font-medium text-[#334155] hover:bg-[#F8FAFC] transition-colors flex items-center space-x-2"
              >
                <Printer className="w-4 h-4" />
                <span>Print</span>
              </button>

              <button
                onClick={handleDownloadPDF}
                className="px-4 py-2 border border-[#CBD5E1] rounded-lg text-sm font-medium text-[#334155] hover:bg-[#F8FAFC] transition-colors flex items-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Download</span>
              </button>

              <button
                onClick={handleStatusUpdate}
                className="px-4 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-lg text-sm font-medium flex items-center space-x-2"
              >
                <Send className="w-4 h-4" />
                <span>Send Invoice</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-8">
        {/* Status Update Buttons (if draft) */}
        {invoice.status === "draft" && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-yellow-600" />
              <span className="text-sm text-yellow-700">
                This invoice is in draft mode
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleStatusUpdate}
                className="px-3 py-1 bg-[#2563EB] text-white rounded-lg text-sm hover:bg-[#1D4ED8]"
              >
                Mark as Sent
              </button>
            </div>
          </div>
        )}

        {/* Dynamic Template Rendering */}
        <TemplateComponent
          invoice={invoice}
          paymentConfig={paymentConfig}
          copySuccess={copySuccess}
          handleCopy={handleCopy}
          formatDate={formatDate}
          formatCurrency={formatCurrency}
        />
      </main>
    </div>
  );
};

export default HandleInvoicesDetailPage;
