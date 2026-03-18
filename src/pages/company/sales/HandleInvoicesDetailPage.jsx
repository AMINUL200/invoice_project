// pages/admin/invoices/[id].jsx
import React, { useState, useEffect, useRef } from "react";
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
import { getTemplateById, TEMPLATES } from "../../../component/templates/invoiceTemplates";
import { useReactToPrint } from "react-to-print";

const HandleInvoicesDetailPage = () => {
  const { id } = useParams();
  const STORAGE_URL = import.meta.env.VITE_STORAGE_URL;
  
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copySuccess, setCopySuccess] = useState(null);
  const [organizationSettings, setOrganizationSettings] = useState(null);
  const [invoiceTemplate, setInvoiceTemplate] = useState(null);
  const [availableTemplates, setAvailableTemplates] = useState([]);
  const navigate = useNavigate();
  const printRef = useRef();

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
      // Fetch invoice details, organization settings, and available templates in parallel
      const [
        invoiceResponse,
        settingsResponse,
        templatesResponse
      ] = await Promise.all([
        api.get(`/org/invoices/${id}`),
        api.get('/org/invoice-setting'), // Get organization settings including selected template
        api.get('/org/invoice-templates') // Get all available templates
      ]);

      const invoiceData = invoiceResponse.data.data || invoiceResponse.data;
      const settingsData = settingsResponse.data.data || settingsResponse.data;
      const templatesData = templatesResponse.data.data || [];

      setInvoice(invoiceData);
      setOrganizationSettings(settingsData);
      setAvailableTemplates(templatesData);

      // Find and set the selected template
      if (settingsData?.template) {
        // If template object is directly available in settings
        setInvoiceTemplate(settingsData.template);
      } else if (settingsData?.invoice_template_id && templatesData.length > 0) {
        // Find template by ID from the templates list
        const selectedTemplate = templatesData.find(
          t => t.id === settingsData.invoice_template_id
        );
        setInvoiceTemplate(selectedTemplate || null);
      }

    } catch (error) {
      console.error("Error fetching data:", error);
      setError(error.message || "Failed to fetch invoice details");
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get template component by name or ID
  const getTemplateComponent = () => {
    if (!invoiceTemplate) {
      // If no template found, return default template
      return TEMPLATES.DEFAULT.component;
    }

    // Try to find template by name (case-insensitive)
    const templateName = invoiceTemplate.name?.toLowerCase();
    
    // Map API template names to your component names
    const templateMap = {
      'default': TEMPLATES.DEFAULT,
      'classic': TEMPLATES.CLASSIC,
      'modern': TEMPLATES.MODERN,
      'minimal': TEMPLATES.MINIMAL,
      'professional': TEMPLATES.PROFESSIONAL
    };

    // Try to find by name first
    const matchedTemplate = templateMap[templateName];
    if (matchedTemplate) {
      return matchedTemplate.component;
    }

    // If not found by name, try by ID
    const templateById = getTemplateById(invoiceTemplate.id);
    return templateById?.component || TEMPLATES.DEFAULT.component;
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

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `invoice-${id}`,
  });

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

  // Get the template component
  const TemplateComponent = getTemplateComponent();

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
            onClick={() => navigate("/org/sales/invoices")}
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
                  {invoiceTemplate && (
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-[#F1F5F9] text-[#64748B] flex items-center gap-1">
                      <Layout className="w-3 h-3" />
                      {invoiceTemplate.name}
                    </span>
                  )}

                  {/* Show preview image if available */}
                  {invoiceTemplate?.preview_image && (
                    <button
                      onClick={() => window.open(`${STORAGE_URL}/${invoiceTemplate.preview_image}`, '_blank')}
                      className="px-2 py-1 text-xs font-medium rounded-full bg-[#F1F5F9] text-[#64748B] hover:bg-[#E2E8F0] transition-colors flex items-center gap-1"
                      title="View template preview"
                    >
                      <FileText className="w-3 h-3" />
                      Preview
                    </button>
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
        {/* Dynamic Template Rendering */}
        <div ref={printRef}>
          <TemplateComponent
            invoice={invoice}
            paymentConfig={paymentConfig}
            copySuccess={copySuccess}
            handleCopy={handleCopy}
            formatDate={formatDate}
            formatCurrency={formatCurrency}
          />
        </div>
      </main>
    </div>
  );
};

export default HandleInvoicesDetailPage;