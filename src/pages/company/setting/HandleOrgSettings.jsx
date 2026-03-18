// pages/settings/HandleOrgSettings.jsx
import React, { useState, useEffect } from "react";
import {
  Settings,
  Mail,
  CreditCard,
  Save,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  EyeOff,
  Globe,
  DollarSign,
  Zap,
  Lock,
  Server,
  Bell,
  Smartphone,
  Users,
  Building2,
  X,
  Plus,
  Edit2,
  Trash2,
  Power,
  ExternalLink,
  Copy,
  Upload,
  Image as ImageIcon,
  Star,
  StarOff,
} from "lucide-react";
import { api } from "../../../utils/app";

const HandleOrgSettings = () => {
  const STORAGE_URL = import.meta.env.VITE_STORAGE_URL;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("email");
  const [apiError, setApiError] = useState(null);
  const [apiSuccess, setApiSuccess] = useState(null);
  const [showSensitive, setShowSensitive] = useState({});

  // Modal state
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [editingPayment, setEditingPayment] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // SMTP Settings State
  const [smtpSettings, setSmtpSettings] = useState({
    id: null,
    driver: "smtp",
    host: "",
    port: 587,
    username: "",
    password: "",
    encryption: "tls",
    from_address: "",
    from_name: "",
    is_active: false,
  });

  // Payment Gateway Settings State
  const [paymentGateways, setPaymentGateways] = useState([]);

  // Current payment form state
  const [paymentForm, setPaymentForm] = useState({
    id: null,
    gateway: "razorpay",
    public_key: "",
    secret_key: "",
    webhook_secret: "",
    mode: "sandbox",
    is_active: false,
  });

  const [smtpErrors, setSmtpErrors] = useState({});
  const [paymentErrors, setPaymentErrors] = useState({});

  // Invoice Template settings state
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [invoicePrefix, setInvoicePrefix] = useState("");
  const [templateLoading, setTemplateLoading] = useState(false);
  const [selectedTemplateData, setSelectedTemplateData] = useState(null);

  // Banks States
  const [bankAccounts, setBankAccounts] = useState([]);
  const [showBankModal, setShowBankModal] = useState(false);
  const [editingBank, setEditingBank] = useState(null);
  const [bankImagePreview, setBankImagePreview] = useState(null);
  const [bankImageFile, setBankImageFile] = useState(null);

  const [bankForm, setBankForm] = useState({
    id: null,
    account_name: "",
    bank_name: "",
    account_holder_name: "",
    account_number: "",
    iban: "",
    swift_code: "",
    routing_number: "",
    ifsc_code: "",
    sort_code: "",
    branch_name: "",
    branch_address: "",
    bank_country: "",
    currency: "INR",
    upi_id: "",
    qr_code: null,
    is_default: false,
    status: "active",
  });

  const [bankErrors, setBankErrors] = useState({});

  // Fetch organization settings
  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([
          fetchSettings(),
          fetchBankAccounts(),
          fetchTemplates(), // ✅ handles both
        ]);
      } catch (error) {
        console.error("Error in initial data fetch:", error);
      }
    };

    fetchData();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    setApiError(null);

    try {
      const [smtpResponse, paymentResponse] = await Promise.all([
        api.get("/org/mail-settings"),
        api.get("/org/gateways"),
      ]);

      if (smtpResponse.data && smtpResponse.data.data) {
        const smtpData = smtpResponse.data.data;
        setSmtpSettings({
          id: smtpData.id,
          driver: smtpData.driver || "smtp",
          host: smtpData.host || "",
          port: smtpData.port || 587,
          username: smtpData.username || "",
          password: smtpData.password || "",
          encryption: smtpData.encryption || "tls",
          from_address: smtpData.from_address || "",
          from_name: smtpData.from_name || "",
          is_active: smtpData.is_active || false,
        });
      }

      if (paymentResponse.data && paymentResponse.data.data) {
        setPaymentGateways(paymentResponse.data.data);
      } else {
        setPaymentGateways([]);
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
      setApiError(error.message || "Failed to fetch settings");
    } finally {
      setLoading(false);
    }
  };

  const fetchTemplates = async () => {
    try {
      const response = await api.get("/org/invoice-templates");

      if (response.data?.success && response.data?.data) {
        const templatesData = response.data.data;

        setTemplates(templatesData);

        // ✅ IMPORTANT: pass templates here
        await fetchSelectedTemplate(templatesData);
      }
    } catch (error) {
      console.error("Error fetching templates:", error);
      setApiError("Failed to fetch invoice templates");
    }
  };

  const fetchSelectedTemplate = async (templatesList = []) => {
    try {
      const response = await api.get("/org/invoice-setting");

      if (response.data?.success && response.data?.data) {
        const data = response.data.data;

        setSelectedTemplate(data.invoice_template_id);
        setInvoicePrefix(data.invoice_prefix || "");
        setSelectedTemplateData(data.template);
      } else {
        // ✅ fallback if no data
        if (templatesList.length > 0) {
          const firstTemplate = templatesList[0];

          setSelectedTemplate(firstTemplate.id);
          setSelectedTemplateData(firstTemplate);
          setInvoicePrefix(firstTemplate.slug || "");
        }
      }
    } catch (error) {
      console.error("Error fetching selected template:", error);

      // ✅ fallback if API fails
      if (templatesList.length > 0) {
        const firstTemplate = templatesList[0];

        setSelectedTemplate(firstTemplate.id);
        setSelectedTemplateData(firstTemplate);
        setInvoicePrefix(firstTemplate.slug || "");
      }
    }
  };

  const handleTemplateSelect = async (templateId, templateName) => {
    try {
      setTemplateLoading(true);
      setApiError(null);

      const response = await api.post("/org/invoice-setting", {
        invoice_template_id: templateId,
        invoice_prefix: templateName.toLowerCase(), // You can customize this logic
      });

      if (response.data?.success) {
        setSelectedTemplate(templateId);
        setApiSuccess("Invoice template updated successfully");
        // Refresh selected template data
        await fetchSelectedTemplate();
      }
    } catch (error) {
      console.error("Error updating template:", error);
      setApiError(
        error.response?.data?.message || "Failed to update invoice template",
      );
    } finally {
      setTemplateLoading(false);
    }
  };

  const handleViewTemplate = (previewImage, e) => {
    e.stopPropagation();
    if (previewImage) {
      window.open(`${STORAGE_URL}/${previewImage}`, "_blank");
    }
  };

  const fetchBankAccounts = async () => {
    try {
      const res = await api.get("/org/bank-accounts");

      if (res.data?.data?.data) {
        setBankAccounts(res.data.data.data);
      } else if (res.data?.data) {
        setBankAccounts(Array.isArray(res.data.data) ? res.data.data : []);
      }
    } catch (error) {
      console.error("Error fetching bank accounts:", error);
      setApiError("Failed to fetch bank accounts");
    }
  };

  // Bank Form Validation
  const validateBankForm = () => {
    const errors = {};

    if (!bankForm.account_name?.trim()) {
      errors.account_name = "Account name is required";
    }
    if (!bankForm.bank_name?.trim()) {
      errors.bank_name = "Bank name is required";
    }
    if (!bankForm.account_holder_name?.trim()) {
      errors.account_holder_name = "Account holder name is required";
    }
    if (!bankForm.account_number?.trim()) {
      errors.account_number = "Account number is required";
    }
    if (!bankForm.ifsc_code?.trim()) {
      errors.ifsc_code = "IFSC code is required";
    }
    if (!bankForm.bank_country?.trim()) {
      errors.bank_country = "Bank country is required";
    }
    if (!bankForm.currency?.trim()) {
      errors.currency = "Currency is required";
    }

    setBankErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle Bank Image Change
  const handleBankImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setBankErrors((prev) => ({
          ...prev,
          qr_code: "Please select an image file",
        }));
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        setBankErrors((prev) => ({
          ...prev,
          qr_code: "Image size should be less than 2MB",
        }));
        return;
      }

      setBankImageFile(file);
      setBankForm((prev) => ({ ...prev, qr_code: file }));

      const reader = new FileReader();
      reader.onloadend = () => {
        setBankImagePreview(reader.result);
      };
      reader.readAsDataURL(file);

      if (bankErrors.qr_code) {
        setBankErrors((prev) => ({ ...prev, qr_code: "" }));
      }
    }
  };

  // Handle Bank Form Change
  const handleBankFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setBankForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (bankErrors[name]) {
      setBankErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Reset Bank Form
  const resetBankForm = () => {
    setBankForm({
      id: null,
      account_name: "",
      bank_name: "",
      account_holder_name: "",
      account_number: "",
      iban: "",
      swift_code: "",
      routing_number: "",
      ifsc_code: "",
      sort_code: "",
      branch_name: "",
      branch_address: "",
      bank_country: "",
      currency: "INR",
      upi_id: "",
      qr_code: null,
      is_default: false,
      status: "active",
    });
    setBankImageFile(null);
    setBankImagePreview(null);
    setBankErrors({});
    setEditingBank(null);
  };

  // Handle Edit Bank
  const handleEditBank = (bank) => {
    setShowBankModal(true);
    setEditingBank(bank);
    setBankForm({
      id: bank.id,
      account_name: bank.account_name || "",
      bank_name: bank.bank_name || "",
      account_holder_name: bank.account_holder_name || "",
      account_number: bank.account_number || "",
      iban: bank.iban || "",
      swift_code: bank.swift_code || "",
      routing_number: bank.routing_number || "",
      ifsc_code: bank.ifsc_code || "",
      sort_code: bank.sort_code || "",
      branch_name: bank.branch_name || "",
      branch_address: bank.branch_address || "",
      bank_country: bank.bank_country || "",
      currency: bank.currency || "INR",
      upi_id: bank.upi_id || "",
      qr_code: null,
      is_default: bank.is_default || false,
      status: bank.status || "active",
    });
    if (bank.qr_code) {
      setBankImagePreview(`${STORAGE_URL}/${bank.qr_code}`);
    }
    setShowBankModal(true);
  };

  // Handle Save Bank
  const handleSaveBank = async () => {
    if (!validateBankForm()) return;

    setSaving(true);
    setApiError(null);
    setApiSuccess(null);

    try {
      const formData = new FormData();

      formData.append("account_name", bankForm.account_name);
      formData.append("bank_name", bankForm.bank_name);
      formData.append("account_holder_name", bankForm.account_holder_name);
      formData.append("account_number", bankForm.account_number);
      formData.append("iban", bankForm.iban || "");
      formData.append("swift_code", bankForm.swift_code || "");
      formData.append("routing_number", bankForm.routing_number || "");
      formData.append("ifsc_code", bankForm.ifsc_code);
      formData.append("sort_code", bankForm.sort_code || "");
      formData.append("branch_name", bankForm.branch_name || "");
      formData.append("branch_address", bankForm.branch_address || "");
      formData.append("bank_country", bankForm.bank_country);
      formData.append("currency", bankForm.currency);
      formData.append("upi_id", bankForm.upi_id || "");
      formData.append("is_default", bankForm.is_default ? "1" : "0");
      formData.append("status", bankForm.status);

      if (bankImageFile) {
        formData.append("qr_code", bankImageFile);
      }

      let response;
      if (bankForm.id) {
        response = await api.post(
          `/org/bank-accounts/${bankForm.id}`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          },
        );
        setApiSuccess("Bank account updated successfully");
      } else {
        response = await api.post("/org/bank-accounts", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setApiSuccess("Bank account added successfully");
      }

      await fetchBankAccounts();
      setShowBankModal(false);
      resetBankForm();
    } catch (error) {
      console.error("Error saving bank account:", error);
      setApiError(
        error.response?.data?.message ||
          error.message ||
          "Failed to save bank account",
      );
    } finally {
      setSaving(false);
    }
  };

  // Handle Delete Bank
  const handleDeleteBank = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this bank account? This action cannot be undone.",
      )
    ) {
      return;
    }

    setSaving(true);
    setApiError(null);
    setApiSuccess(null);

    try {
      await api.delete(`/org/bank-accounts/${id}`);
      setApiSuccess("Bank account deleted successfully");
      await fetchBankAccounts();
    } catch (error) {
      console.error("Error deleting bank account:", error);
      setApiError(error.message || "Failed to delete bank account");
    } finally {
      setSaving(false);
    }
  };

  // Handle Toggle Default Bank
  const handleToggleDefault = async (bank) => {
    try {
      setSaving(true);
      await api.post(`/org/bank-accounts/${bank.id}/set-default`);
      setApiSuccess("Default bank account updated");
      await fetchBankAccounts();
    } catch (error) {
      console.error("Error setting default bank:", error);
      setApiError(error.message || "Failed to set default bank");
    } finally {
      setSaving(false);
    }
  };

  // Handle Toggle Bank Status
  const handleToggleBankStatus = async (bank) => {
    try {
      setSaving(true);
      const newStatus = bank.status === "active" ? "inactive" : "active";
      await api.post(`/org/bank-accounts/${bank.id}/make-primary`, {
        status: newStatus,
      });
      setApiSuccess(
        `Bank account ${newStatus === "active" ? "activated" : "deactivated"}`,
      );
      await fetchBankAccounts();
    } catch (error) {
      console.error("Error toggling bank status:", error);
      setApiError(error.message || "Failed to update bank status");
    } finally {
      setSaving(false);
    }
  };

  const validateSmtpForm = () => {
    const errors = {};

    if (!smtpSettings.host?.trim()) {
      errors.host = "SMTP host is required";
    }
    if (!smtpSettings.port) {
      errors.port = "Port is required";
    }
    if (!smtpSettings.username?.trim()) {
      errors.username = "Username is required";
    }
    if (!smtpSettings.password?.trim()) {
      errors.password = "Password is required";
    }
    if (!smtpSettings.from_address?.trim()) {
      errors.from_address = "From email is required";
    } else if (!/\S+@\S+\.\S+/.test(smtpSettings.from_address)) {
      errors.from_address = "Invalid email format";
    }
    if (!smtpSettings.from_name?.trim()) {
      errors.from_name = "From name is required";
    }

    setSmtpErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validatePaymentForm = () => {
    const errors = {};

    if (!paymentForm.gateway) {
      errors.gateway = "Please select a payment gateway";
    }

    if (!paymentForm.public_key?.trim()) {
      errors.public_key = `${
        paymentForm.gateway === "razorpay"
          ? "Key ID"
          : paymentForm.gateway === "stripe"
            ? "Publishable Key"
            : "Client ID"
      } is required`;
    }

    if (!paymentForm.secret_key?.trim()) {
      errors.secret_key = `${
        paymentForm.gateway === "razorpay"
          ? "Key Secret"
          : paymentForm.gateway === "stripe"
            ? "Secret Key"
            : "Client Secret"
      } is required`;
    }

    setPaymentErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSmtpChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSmtpSettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (smtpErrors[name]) {
      setSmtpErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handlePaymentFormChange = (e) => {
    const { name, value, type, checked } = e.target;

    setPaymentForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (paymentErrors[name]) {
      setPaymentErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSaveSmtp = async () => {
    if (!validateSmtpForm()) return;

    setSaving(true);
    setApiError(null);
    setApiSuccess(null);

    try {
      const smtpData = {
        driver: smtpSettings.driver,
        host: smtpSettings.host,
        port: parseInt(smtpSettings.port),
        username: smtpSettings.username,
        password: smtpSettings.password,
        encryption: smtpSettings.encryption,
        from_address: smtpSettings.from_address,
        from_name: smtpSettings.from_name,
        is_active: smtpSettings.is_active,
      };

      if (smtpSettings.id) {
        await api.post("/org/mail-settings", smtpData);
        setApiSuccess("Email settings updated successfully");
      } else {
        await api.post("/org/mail-settings", smtpData);
        setApiSuccess("Email settings saved successfully");
      }

      await fetchSettings();
    } catch (error) {
      console.error("Error saving email settings:", error);
      setApiError(error.message || "Failed to save email settings");
    } finally {
      setSaving(false);
    }
  };

  const handleSavePayment = async () => {
    if (!validatePaymentForm()) return;

    setSaving(true);
    setApiError(null);
    setApiSuccess(null);

    try {
      const paymentData = {
        gateway: paymentForm.gateway,
        public_key: paymentForm.public_key,
        secret_key: paymentForm.secret_key,
        webhook_secret: paymentForm.webhook_secret || "",
        mode: paymentForm.mode,
        is_active: paymentForm.is_active,
      };

      if (paymentForm.id) {
        await api.post(`/org/gateways/${paymentForm.id}`, paymentData);
        setApiSuccess("Payment settings updated successfully");
      } else {
        await api.post("/org/gateways", paymentData);
        setApiSuccess("Payment settings added successfully");
      }

      await fetchSettings();
      setShowPaymentModal(false);
      resetPaymentForm();
    } catch (error) {
      console.error("Error saving payment settings:", error);
      setApiError(error.message || "Failed to save payment settings");
    } finally {
      setSaving(false);
    }
  };

  const handleDeletePayment = async (id) => {
    try {
      setSaving(true);
      setApiError(null);
      setApiSuccess(null);

      await api.delete(`/org/gateways/${id}`);
      setApiSuccess("Payment settings deleted successfully");
      await fetchSettings();
      setDeleteConfirm(null);
    } catch (error) {
      console.error("Error deleting payment settings:", error);
      setApiError(error.message || "Failed to delete payment settings");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (gateway) => {
    try {
      setSaving(true);
      setApiError(null);
      setApiSuccess(null);

      await api.post(`/org/gateways/${gateway.id}/activate`);
      setApiSuccess(
        `Payment gateway ${!gateway.is_active ? "activated" : "deactivated"} successfully`,
      );
      await fetchSettings();
    } catch (error) {
      console.error("Error toggling payment gateway:", error);
      setApiError(error.message || "Failed to update payment gateway status");
    } finally {
      setSaving(false);
    }
  };

  const testSmtpConnection = async () => {
    if (!validateSmtpForm()) return;

    try {
      setSaving(true);
      setApiSuccess(null);
      setApiError(null);

      const testData = {
        host: smtpSettings.host,
        port: smtpSettings.port,
        username: smtpSettings.username,
        password: smtpSettings.password,
        encryption: smtpSettings.encryption,
        from_address: smtpSettings.from_address,
        from_name: smtpSettings.from_name,
      };

      await api.post("/org/mail-settings/test", testData);
      setApiSuccess("SMTP connection successful! Test email sent.");
    } catch (error) {
      console.error("Error testing SMTP connection:", error);
      setApiError(error.message || "Failed to test SMTP connection");
    } finally {
      setSaving(false);
    }
  };

  const testPaymentConnection = async (gateway = null) => {
    try {
      setSaving(true);
      setApiSuccess(null);
      setApiError(null);

      const testData = gateway || {
        gateway: paymentForm.gateway,
        public_key: paymentForm.public_key,
        secret_key: paymentForm.secret_key,
        mode: paymentForm.mode,
      };

      await api.post("/org/gateways/test", testData);
      setApiSuccess(`${testData.gateway} connection successful!`);
    } catch (error) {
      console.error("Error testing payment connection:", error);
      setApiError(error.message || "Failed to test payment connection");
    } finally {
      setSaving(false);
    }
  };

  const openAddPaymentModal = () => {
    resetPaymentForm();
    setShowPaymentModal(true);
  };

  const openEditPaymentModal = (gateway) => {
    setPaymentForm({
      id: gateway.id,
      gateway: gateway.gateway,
      public_key: gateway.public_key,
      secret_key: gateway.secret_key,
      webhook_secret: gateway.webhook_secret || "",
      mode: gateway.mode,
      is_active: gateway.is_active,
    });
    setEditingPayment(gateway);
    setShowPaymentModal(true);
  };

  const resetPaymentForm = () => {
    setPaymentForm({
      id: null,
      gateway: "razorpay",
      public_key: "",
      secret_key: "",
      webhook_secret: "",
      mode: "sandbox",
      is_active: false,
    });
    setPaymentErrors({});
    setEditingPayment(null);
  };

  const toggleSensitive = (key) => {
    setShowSensitive((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const getGatewayFieldLabels = (gatewayType = paymentForm.gateway) => {
    switch (gatewayType) {
      case "razorpay":
        return {
          public_key: "Key ID",
          secret_key: "Key Secret",
          public_key_placeholder: "rzp_test_...",
          secret_key_placeholder: "••••••••",
        };
      case "stripe":
        return {
          public_key: "Publishable Key",
          secret_key: "Secret Key",
          public_key_placeholder: "pk_test_...",
          secret_key_placeholder: "sk_test_...",
        };
      case "paypal":
        return {
          public_key: "Client ID",
          secret_key: "Client Secret",
          public_key_placeholder: "AYhX...",
          secret_key_placeholder: "••••••••",
        };
      default:
        return {
          public_key: "Public Key",
          secret_key: "Secret Key",
          public_key_placeholder: "Enter key",
          secret_key_placeholder: "••••••••",
        };
    }
  };

  const getGatewayLogo = (gateway) => {
    switch (gateway) {
      case "razorpay":
        return "https://razorpay.com/assets/razorpay-logo.svg";
      case "stripe":
        return "https://stripe.com/img/v3/home/twitter.png";
      case "paypal":
        return "https://www.paypalobjects.com/webstatic/mktg/logo/pp_cc_mark_37x23.jpg";
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#2563EB] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#64748B]">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Header */}
      <header className="bg-white border-b border-[#E2E8F0] sticky top-0 z-10">
        <div className="px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-[#0F172A]">
                Organization Settings
              </h1>
              <p className="text-sm text-[#64748B] mt-1">
                Configure your email and payment settings
              </p>
            </div>

            <button
              onClick={fetchSettings}
              className="p-2 border border-[#CBD5E1] rounded-lg hover:bg-[#F8FAFC] transition-colors"
              title="Refresh"
            >
              <RefreshCw className="w-5 h-5 text-[#64748B]" />
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="flex space-x-6 mt-4">
            <button
              onClick={() => setActiveTab("email")}
              className={`flex items-center space-x-2 pb-2 text-sm font-medium transition-colors relative ${
                activeTab === "email"
                  ? "text-[#2563EB] border-b-2 border-[#2563EB]"
                  : "text-[#64748B] hover:text-[#334155]"
              }`}
            >
              <Mail className="w-4 h-4" />
              <span>Email Settings</span>
            </button>

            <button
              onClick={() => setActiveTab("payment")}
              className={`flex items-center space-x-2 pb-2 text-sm font-medium transition-colors relative ${
                activeTab === "payment"
                  ? "text-[#2563EB] border-b-2 border-[#2563EB]"
                  : "text-[#64748B] hover:text-[#334155]"
              }`}
            >
              <CreditCard className="w-4 h-4" />
              <span>Payment Gateways</span>
            </button>
            <button
              onClick={() => setActiveTab("bank")}
              className={`flex items-center space-x-2 pb-2 text-sm font-medium transition-colors ${
                activeTab === "bank"
                  ? "text-[#2563EB] border-b-2 border-[#2563EB]"
                  : "text-[#64748B] hover:text-[#334155]"
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>Bank Accounts</span>
            </button>
            <button
              onClick={() => setActiveTab("invoice")}
              className={`flex items-center space-x-2 pb-2 text-sm font-medium ${
                activeTab === "invoice"
                  ? "text-[#2563EB] border-b-2 border-[#2563EB]"
                  : "text-[#64748B]"
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Invoice Template</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-8">
        {/* Success Message */}
        {apiSuccess && (
          <div className="mb-6 bg-[#DCFCE7] border border-[#22C55E]/20 rounded-lg p-4 flex items-start space-x-3">
            <CheckCircle className="w-5 h-5 text-[#15803D] flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-[#15803D]">{apiSuccess}</p>
            </div>
            <button
              onClick={() => setApiSuccess(null)}
              className="text-[#15803D] hover:text-[#0F6B3D]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Error Message */}
        {apiError && (
          <div className="mb-6 bg-[#FEE2E2] border border-[#EF4444]/20 rounded-lg p-4 flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-[#B91C1C] flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-[#B91C1C]">{apiError}</p>
            </div>
            <button
              onClick={() => setApiError(null)}
              className="text-[#B91C1C] hover:text-[#991B1B]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Email Settings Tab */}
        {activeTab === "email" && (
          <div className="max-w-3xl">
            <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-[#E2E8F0] bg-[#F8FAFC]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Mail className="w-5 h-5 text-[#2563EB]" />
                    <h2 className="text-lg font-semibold text-[#0F172A]">
                      SMTP Configuration
                    </h2>
                  </div>
                  <label className="flex items-center space-x-2">
                    <span className="text-sm text-[#64748B]">Active</span>
                    <input
                      type="checkbox"
                      name="is_active"
                      checked={smtpSettings.is_active}
                      onChange={handleSmtpChange}
                      className="w-4 h-4 text-[#2563EB] rounded border-[#CBD5E1] focus:ring-[#2563EB]"
                    />
                  </label>
                </div>
                <p className="text-sm text-[#64748B] mt-1">
                  Configure your email server settings for sending invoices and
                  notifications
                </p>
              </div>

              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <input type="hidden" name="driver" value="smtp" />

                  <div>
                    <label className="block text-sm font-medium text-[#334155] mb-1">
                      SMTP Host *
                    </label>
                    <input
                      type="text"
                      name="host"
                      value={smtpSettings.host}
                      onChange={handleSmtpChange}
                      className={`w-full px-4 py-2 border ${
                        smtpErrors.host
                          ? "border-[#EF4444]"
                          : "border-[#CBD5E1]"
                      } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]`}
                      placeholder="smtp.gmail.com"
                    />
                    {smtpErrors.host && (
                      <p className="text-xs text-[#EF4444] mt-1">
                        {smtpErrors.host}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#334155] mb-1">
                      Port *
                    </label>
                    <input
                      type="number"
                      name="port"
                      value={smtpSettings.port}
                      onChange={handleSmtpChange}
                      className={`w-full px-4 py-2 border ${
                        smtpErrors.port
                          ? "border-[#EF4444]"
                          : "border-[#CBD5E1]"
                      } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]`}
                      placeholder="587"
                    />
                    {smtpErrors.port && (
                      <p className="text-xs text-[#EF4444] mt-1">
                        {smtpErrors.port}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#334155] mb-1">
                      Encryption
                    </label>
                    <select
                      name="encryption"
                      value={smtpSettings.encryption}
                      onChange={handleSmtpChange}
                      className="w-full px-4 py-2 border border-[#CBD5E1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]"
                    >
                      <option value="tls">TLS</option>
                      <option value="ssl">SSL</option>
                      <option value="none">None</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#334155] mb-1">
                      Username *
                    </label>
                    <input
                      type="text"
                      name="username"
                      value={smtpSettings.username}
                      onChange={handleSmtpChange}
                      className={`w-full px-4 py-2 border ${
                        smtpErrors.username
                          ? "border-[#EF4444]"
                          : "border-[#CBD5E1]"
                      } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]`}
                      placeholder="your-email@example.com"
                    />
                    {smtpErrors.username && (
                      <p className="text-xs text-[#EF4444] mt-1">
                        {smtpErrors.username}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#334155] mb-1">
                      Password *
                    </label>
                    <div className="relative">
                      <input
                        type={showSensitive.smtp_password ? "text" : "password"}
                        name="password"
                        value={smtpSettings.password}
                        onChange={handleSmtpChange}
                        className={`w-full px-4 py-2 border ${
                          smtpErrors.password
                            ? "border-[#EF4444]"
                            : "border-[#CBD5E1]"
                        } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] pr-10`}
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => toggleSensitive("smtp_password")}
                        className="absolute right-2 top-1/2 -translate-y-1/2"
                      >
                        {showSensitive.smtp_password ? (
                          <EyeOff className="w-4 h-4 text-[#64748B]" />
                        ) : (
                          <Eye className="w-4 h-4 text-[#64748B]" />
                        )}
                      </button>
                    </div>
                    {smtpErrors.password && (
                      <p className="text-xs text-[#EF4444] mt-1">
                        {smtpErrors.password}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#334155] mb-1">
                      From Email *
                    </label>
                    <input
                      type="email"
                      name="from_address"
                      value={smtpSettings.from_address}
                      onChange={handleSmtpChange}
                      className={`w-full px-4 py-2 border ${
                        smtpErrors.from_address
                          ? "border-[#EF4444]"
                          : "border-[#CBD5E1]"
                      } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]`}
                      placeholder="noreply@yourcompany.com"
                    />
                    {smtpErrors.from_address && (
                      <p className="text-xs text-[#EF4444] mt-1">
                        {smtpErrors.from_address}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#334155] mb-1">
                      From Name *
                    </label>
                    <input
                      type="text"
                      name="from_name"
                      value={smtpSettings.from_name}
                      onChange={handleSmtpChange}
                      className={`w-full px-4 py-2 border ${
                        smtpErrors.from_name
                          ? "border-[#EF4444]"
                          : "border-[#CBD5E1]"
                      } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]`}
                      placeholder="Your Company Name"
                    />
                    {smtpErrors.from_name && (
                      <p className="text-xs text-[#EF4444] mt-1">
                        {smtpErrors.from_name}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t border-[#E2E8F0]">
                  <button
                    onClick={testSmtpConnection}
                    disabled={saving}
                    className="px-4 py-2 border border-[#CBD5E1] rounded-lg text-sm font-medium text-[#334155] hover:bg-[#F8FAFC] transition-colors disabled:opacity-50"
                  >
                    Test Connection
                  </button>
                  <button
                    onClick={handleSaveSmtp}
                    disabled={saving}
                    className="px-4 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 flex items-center space-x-2"
                  >
                    {saving ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        <span>Save Settings</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Payment Settings Tab */}
        {activeTab === "payment" && (
          <div className="max-w-6xl">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-lg font-semibold text-[#0F172A]">
                  Payment Gateways
                </h2>
                <p className="text-sm text-[#64748B] mt-1">
                  Manage your payment gateway configurations
                </p>
              </div>
              <button
                onClick={openAddPaymentModal}
                className="px-4 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-lg text-sm font-medium transition-colors flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add Gateway</span>
              </button>
            </div>

            <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm overflow-hidden">
              <table className="w-full">
                <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#64748B] uppercase tracking-wider">
                      Gateway
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#64748B] uppercase tracking-wider">
                      Mode
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#64748B] uppercase tracking-wider">
                      Public Key
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#64748B] uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#64748B] uppercase tracking-wider">
                      Last Updated
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-[#64748B] uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8F0]">
                  {paymentGateways.length === 0 ? (
                    <tr>
                      <td
                        colSpan="6"
                        className="px-6 py-8 text-center text-[#64748B]"
                      >
                        No payment gateways configured. Click "Add Gateway" to
                        get started.
                      </td>
                    </tr>
                  ) : (
                    paymentGateways.map((gateway) => (
                      <tr
                        key={gateway.id}
                        className="hover:bg-[#F8FAFC] transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <img
                              src={getGatewayLogo(gateway.gateway)}
                              alt={gateway.gateway}
                              className="h-6 w-auto"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = `https://via.placeholder.com/80x30?text=${gateway.gateway}`;
                              }}
                            />
                            <span className="text-sm font-medium text-[#0F172A] capitalize">
                              {gateway.gateway}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              gateway.mode === "live"
                                ? "bg-[#2563EB]/10 text-[#2563EB]"
                                : "bg-[#F59E0B]/10 text-[#F59E0B]"
                            }`}
                          >
                            {gateway.mode === "live" ? "Live" : "Sandbox"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-[#334155] font-mono">
                              {gateway.public_key?.substring(0, 8)}...
                            </span>
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(
                                  gateway.public_key,
                                );
                                setApiSuccess("Public key copied to clipboard");
                              }}
                              className="text-[#64748B] hover:text-[#334155]"
                            >
                              <Copy className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleToggleActive(gateway)}
                            disabled={saving}
                            className={`inline-flex items-center px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                              gateway.is_active
                                ? "bg-[#22C55E] text-white hover:bg-[#16A34A]"
                                : "bg-[#EF4444] text-white hover:bg-[#DC2626]"
                            }`}
                          >
                            <Power className="w-3 h-3 mr-1" />
                            {gateway.is_active ? "Active" : "Inactive"}
                          </button>
                        </td>
                        <td className="px-6 py-4 text-sm text-[#64748B]">
                          {new Date(gateway.updated_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => testPaymentConnection(gateway)}
                              className="p-1 hover:bg-[#F1F5F9] rounded-lg transition-colors"
                              title="Test Connection"
                            >
                              <ExternalLink className="w-4 h-4 text-[#64748B]" />
                            </button>
                            <button
                              onClick={() => openEditPaymentModal(gateway)}
                              className="p-1 hover:bg-[#F1F5F9] rounded-lg transition-colors"
                              title="Edit"
                            >
                              <Edit2 className="w-4 h-4 text-[#64748B]" />
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(gateway)}
                              className="p-1 hover:bg-[#F1F5F9] rounded-lg transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4 text-[#EF4444]" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="mt-6 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0] p-4">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-[#2563EB] flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-medium text-[#0F172A]">
                    About Payment Gateways
                  </h4>
                  <p className="text-xs text-[#64748B] mt-1">
                    You can configure multiple payment gateways. Use sandbox
                    mode for testing, and switch to live mode when you're ready
                    to accept real payments.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Invoice Template Tab */}
        {activeTab === "invoice" && (
          <div className="max-w-6xl">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-lg font-semibold text-[#0F172A]">
                  Invoice Templates
                </h2>
                {selectedTemplateData && (
                  <p className="text-sm text-[#64748B] mt-1">
                    Currently selected:{" "}
                    <span className="font-medium text-[#2563EB]">
                      {selectedTemplateData.name}
                    </span>
                  </p>
                )}
                {!selectedTemplateData && templates.length > 0 && (
                  <p className="text-xs text-orange-500 mt-1">
                    No template selected. Default applied.
                  </p>
                )}
              </div>
              {templateLoading && (
                <div className="flex items-center space-x-2 text-[#64748B]">
                  <div className="w-4 h-4 border-2 border-[#2563EB] border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-sm">Updating template...</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {templates.map((template) => (
                <div
                  key={template.id}
                  className={`group relative border rounded-xl overflow-hidden cursor-pointer transition ${
                    selectedTemplate === template.id
                      ? "border-[#2563EB] ring-2 ring-[#2563EB]/20"
                      : "border-[#E2E8F0] hover:border-[#2563EB]/50"
                  }`}
                  onClick={() =>
                    handleTemplateSelect(template.id, template.name)
                  }
                >
                  <div className="relative aspect-[4/4] bg-[#F8FAFC]">
                    {template.preview_image ? (
                      <img
                        src={`${STORAGE_URL}/${template.preview_image}`}
                        alt={template.name}
                        className="w-full h-full object-cover transition group-hover:scale-105"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src =
                            "https://via.placeholder.com/300x400?text=No+Preview";
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-sm text-[#64748B]">
                          No preview available
                        </span>
                      </div>
                    )}

                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        onClick={(e) =>
                          handleViewTemplate(template.preview_image, e)
                        }
                        className="p-3 bg-white rounded-full hover:bg-[#2563EB] group/btn transition-colors"
                        title="View full size"
                      >
                        <ExternalLink className="w-5 h-5 text-[#334155] group-hover/btn:text-white" />
                      </button>
                    </div>

                    {selectedTemplate === template.id && (
                      <div className="absolute top-2 right-2">
                        <CheckCircle className="w-6 h-6 text-[#22C55E] bg-white rounded-full" />
                      </div>
                    )}
                  </div>

                  <div className="p-4 bg-white">
                    <h3 className="text-sm font-medium text-[#0F172A]">
                      {template.name}
                    </h3>
                    <p className="text-xs text-[#64748B] mt-1 capitalize">
                      {template.slug}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {templates.length === 0 && (
              <div className="text-center py-12 bg-white rounded-xl border border-[#E2E8F0]">
                <p className="text-[#64748B]">No templates available</p>
              </div>
            )}
          </div>
        )}

        {/* Bank Accounts Tab */}
        {activeTab === "bank" && (
          <div className="max-w-6xl">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-lg font-semibold text-[#0F172A]">
                  Bank Accounts
                </h2>
                <p className="text-sm text-[#64748B]">
                  Manage your bank accounts for invoice payments
                </p>
              </div>

              <button
                onClick={() => {
                  resetBankForm();
                  setShowBankModal(true);
                }}
                className="px-4 py-2 bg-[#2563EB] text-white rounded-lg flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add Bank</span>
              </button>
            </div>

            <div className="max-w-[400px] md:max-w-[700px] lg:max-w-[1140px] overflow-x-auto">
              <table className="w-full min-w-[700px]">
                <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#64748B] uppercase">
                      Account
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#64748B] uppercase">
                      Bank Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#64748B] uppercase">
                      Account Number
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#64748B] uppercase">
                      IFSC/SWIFT
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#64748B] uppercase">
                      UPI/QR
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#64748B] uppercase">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-[#64748B] uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#E2E8F0]">
                  {bankAccounts.length === 0 ? (
                    <tr>
                      <td
                        colSpan="7"
                        className="px-6 py-8 text-center text-[#64748B]"
                      >
                        No bank accounts found. Click "Add Bank" to add one.
                      </td>
                    </tr>
                  ) : (
                    bankAccounts.map((bank) => (
                      <tr
                        key={bank.id}
                        className="hover:bg-[#F8FAFC] transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            {bank.is_default && (
                              <Star
                                className="w-4 h-4 text-yellow-500 fill-yellow-500"
                                title="Default Account"
                              />
                            )}
                            <div>
                              <p className="text-sm font-medium text-[#0F172A]">
                                {bank.account_name}
                              </p>
                              <p className="text-xs text-[#64748B]">
                                {bank.account_holder_name}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm font-medium text-[#0F172A]">
                            {bank.bank_name}
                          </p>
                          <p className="text-xs text-[#64748B]">
                            {bank.branch_name}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm font-mono text-[#0F172A]">
                            ****{bank.account_number?.slice(-4)}
                          </p>
                          {bank.iban && (
                            <p className="text-xs text-[#64748B]">
                              IBAN: {bank.iban}
                            </p>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm font-mono text-[#0F172A]">
                            {bank.ifsc_code}
                          </p>
                          {bank.swift_code && (
                            <p className="text-xs text-[#64748B]">
                              SWIFT: {bank.swift_code}
                            </p>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {bank.upi_id && (
                            <p className="text-sm text-[#0F172A]">
                              {bank.upi_id}
                            </p>
                          )}
                          {bank.qr_code && (
                            <button
                              onClick={() =>
                                window.open(
                                  `${STORAGE_URL}/${bank.qr_code}`,
                                  "_blank",
                                )
                              }
                              className="text-xs text-[#2563EB] hover:underline flex items-center gap-1 mt-1"
                            >
                              <ImageIcon className="w-3 h-3" />
                              View QR
                            </button>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleToggleBankStatus(bank)}
                            className={`inline-flex items-center px-2.5 py-1.5 rounded-lg text-xs font-medium ${
                              bank.status === "active"
                                ? "bg-[#22C55E] text-white hover:bg-[#16A34A]"
                                : "bg-[#EF4444] text-white hover:bg-[#DC2626]"
                            }`}
                          >
                            <Power className="w-3 h-3 mr-1" />
                            {bank.status === "active" ? "Active" : "Inactive"}
                          </button>
                        </td>
                        <td className="px-6 py-4 text-right space-x-2">
                          {!bank.is_default && (
                            <button
                              onClick={() => handleToggleDefault(bank)}
                              className="p-1 hover:bg-[#F1F5F9] rounded-lg transition-colors"
                              title="Set as Default"
                            >
                              <StarOff className="w-4 h-4 text-[#64748B]" />
                            </button>
                          )}
                          <button
                            onClick={() => handleEditBank(bank)}
                            className="p-1 hover:bg-[#F1F5F9] rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4 text-[#64748B]" />
                          </button>
                          <button
                            onClick={() => handleDeleteBank(bank.id)}
                            className="p-1 hover:bg-[#F1F5F9] rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4 text-[#EF4444]" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* Payment Gateway Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between sticky top-0 bg-white">
              <h3 className="text-lg font-semibold text-[#0F172A]">
                {editingPayment
                  ? "Edit Payment Gateway"
                  : "Add Payment Gateway"}
              </h3>
              <button
                onClick={() => {
                  setShowPaymentModal(false);
                  resetPaymentForm();
                }}
                className="p-2 hover:bg-[#F1F5F9] rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-[#64748B]" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-[#334155] mb-2">
                  Select Payment Gateway *
                </label>
                <select
                  name="gateway"
                  value={paymentForm.gateway}
                  onChange={handlePaymentFormChange}
                  className={`w-full px-4 py-2 border ${
                    paymentErrors.gateway
                      ? "border-[#EF4444]"
                      : "border-[#CBD5E1]"
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]`}
                >
                  <option value="razorpay">Razorpay</option>
                  <option value="stripe">Stripe</option>
                  <option value="paypal">PayPal</option>
                </select>
                {paymentErrors.gateway && (
                  <p className="text-xs text-[#EF4444] mt-1">
                    {paymentErrors.gateway}
                  </p>
                )}
              </div>

              <div className="flex items-center space-x-3 p-3 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0]">
                <img
                  src={getGatewayLogo(paymentForm.gateway)}
                  alt={paymentForm.gateway}
                  className="h-8 w-auto"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = `https://via.placeholder.com/100x30?text=${paymentForm.gateway}`;
                  }}
                />
                <span className="text-sm font-medium text-[#0F172A] capitalize">
                  {paymentForm.gateway} Configuration
                </span>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#334155] mb-2">
                  Mode
                </label>
                <div className="flex space-x-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="mode"
                      value="sandbox"
                      checked={paymentForm.mode === "sandbox"}
                      onChange={handlePaymentFormChange}
                      className="w-4 h-4 text-[#2563EB] border-[#CBD5E1] focus:ring-[#2563EB]"
                    />
                    <span className="text-sm text-[#334155]">
                      Sandbox (Test)
                    </span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="mode"
                      value="live"
                      checked={paymentForm.mode === "live"}
                      onChange={handlePaymentFormChange}
                      className="w-4 h-4 text-[#2563EB] border-[#CBD5E1] focus:ring-[#2563EB]"
                    />
                    <span className="text-sm text-[#334155]">Live</span>
                  </label>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#334155] mb-1">
                    {getGatewayFieldLabels().public_key} *
                  </label>
                  <div className="relative">
                    <input
                      type={showSensitive.public_key ? "text" : "password"}
                      name="public_key"
                      value={paymentForm.public_key}
                      onChange={handlePaymentFormChange}
                      className={`w-full px-4 py-2 border ${
                        paymentErrors.public_key
                          ? "border-[#EF4444]"
                          : "border-[#CBD5E1]"
                      } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] pr-10`}
                      placeholder={
                        getGatewayFieldLabels().public_key_placeholder
                      }
                    />
                    <button
                      type="button"
                      onClick={() => toggleSensitive("public_key")}
                      className="absolute right-2 top-1/2 -translate-y-1/2"
                    >
                      {showSensitive.public_key ? (
                        <EyeOff className="w-4 h-4 text-[#64748B]" />
                      ) : (
                        <Eye className="w-4 h-4 text-[#64748B]" />
                      )}
                    </button>
                  </div>
                  {paymentErrors.public_key && (
                    <p className="text-xs text-[#EF4444] mt-1">
                      {paymentErrors.public_key}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#334155] mb-1">
                    {getGatewayFieldLabels().secret_key} *
                  </label>
                  <div className="relative">
                    <input
                      type={showSensitive.secret_key ? "text" : "password"}
                      name="secret_key"
                      value={paymentForm.secret_key}
                      onChange={handlePaymentFormChange}
                      className={`w-full px-4 py-2 border ${
                        paymentErrors.secret_key
                          ? "border-[#EF4444]"
                          : "border-[#CBD5E1]"
                      } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] pr-10`}
                      placeholder={
                        getGatewayFieldLabels().secret_key_placeholder
                      }
                    />
                    <button
                      type="button"
                      onClick={() => toggleSensitive("secret_key")}
                      className="absolute right-2 top-1/2 -translate-y-1/2"
                    >
                      {showSensitive.secret_key ? (
                        <EyeOff className="w-4 h-4 text-[#64748B]" />
                      ) : (
                        <Eye className="w-4 h-4 text-[#64748B]" />
                      )}
                    </button>
                  </div>
                  {paymentErrors.secret_key && (
                    <p className="text-xs text-[#EF4444] mt-1">
                      {paymentErrors.secret_key}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#334155] mb-1">
                    Webhook Secret
                  </label>
                  <input
                    type="text"
                    name="webhook_secret"
                    value={paymentForm.webhook_secret}
                    onChange={handlePaymentFormChange}
                    className="w-full px-4 py-2 border border-[#CBD5E1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]"
                    placeholder="whsec_... (optional)"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="is_active"
                  checked={paymentForm.is_active}
                  onChange={handlePaymentFormChange}
                  className="w-4 h-4 text-[#2563EB] rounded border-[#CBD5E1] focus:ring-[#2563EB]"
                />
                <label className="text-sm text-[#334155]">
                  Set as active gateway (will be used for processing payments)
                </label>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-end space-x-3">
              <button
                onClick={() => {
                  setShowPaymentModal(false);
                  resetPaymentForm();
                }}
                className="px-4 py-2 border border-[#CBD5E1] rounded-lg text-sm font-medium text-[#334155] hover:bg-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => testPaymentConnection()}
                disabled={saving}
                className="px-4 py-2 border border-[#2563EB] rounded-lg text-sm font-medium text-[#2563EB] hover:bg-[#2563EB]/5 transition-colors"
              >
                Test Connection
              </button>
              <button
                onClick={handleSavePayment}
                disabled={saving}
                className="px-4 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 flex items-center space-x-2"
              >
                {saving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>{editingPayment ? "Update" : "Save"}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bank Account Modal */}
      {showBankModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl w-full max-w-4xl my-8">
            <div className="px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between sticky top-0 bg-white">
              <h3 className="text-lg font-semibold text-[#0F172A]">
                {editingBank ? "Edit Bank Account" : "Add Bank Account"}
              </h3>
              <button
                onClick={() => {
                  setShowBankModal(false);
                  resetBankForm();
                }}
                className="p-2 hover:bg-[#F1F5F9] rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-[#64748B]" />
              </button>
            </div>

            <div className="p-6 max-h-[calc(90vh-120px)] overflow-y-auto">
              <div className="grid grid-cols-2 gap-6">
                {/* Account Name */}
                <div>
                  <label className="block text-sm font-medium text-[#334155] mb-1">
                    Account Name *
                  </label>
                  <input
                    type="text"
                    name="account_name"
                    value={bankForm.account_name}
                    onChange={handleBankFormChange}
                    className={`w-full px-4 py-2 border ${
                      bankErrors.account_name
                        ? "border-[#EF4444]"
                        : "border-[#CBD5E1]"
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]`}
                    placeholder="e.g., Primary Business Account"
                  />
                  {bankErrors.account_name && (
                    <p className="text-xs text-[#EF4444] mt-1">
                      {bankErrors.account_name}
                    </p>
                  )}
                </div>

                {/* Bank Name */}
                <div>
                  <label className="block text-sm font-medium text-[#334155] mb-1">
                    Bank Name *
                  </label>
                  <input
                    type="text"
                    name="bank_name"
                    value={bankForm.bank_name}
                    onChange={handleBankFormChange}
                    className={`w-full px-4 py-2 border ${
                      bankErrors.bank_name
                        ? "border-[#EF4444]"
                        : "border-[#CBD5E1]"
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]`}
                    placeholder="e.g., State Bank of India"
                  />
                  {bankErrors.bank_name && (
                    <p className="text-xs text-[#EF4444] mt-1">
                      {bankErrors.bank_name}
                    </p>
                  )}
                </div>

                {/* Account Holder Name */}
                <div>
                  <label className="block text-sm font-medium text-[#334155] mb-1">
                    Account Holder Name *
                  </label>
                  <input
                    type="text"
                    name="account_holder_name"
                    value={bankForm.account_holder_name}
                    onChange={handleBankFormChange}
                    className={`w-full px-4 py-2 border ${
                      bankErrors.account_holder_name
                        ? "border-[#EF4444]"
                        : "border-[#CBD5E1]"
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]`}
                    placeholder="e.g., John Doe"
                  />
                  {bankErrors.account_holder_name && (
                    <p className="text-xs text-[#EF4444] mt-1">
                      {bankErrors.account_holder_name}
                    </p>
                  )}
                </div>

                {/* Account Number */}
                <div>
                  <label className="block text-sm font-medium text-[#334155] mb-1">
                    Account Number *
                  </label>
                  <input
                    type="text"
                    name="account_number"
                    value={bankForm.account_number}
                    onChange={handleBankFormChange}
                    className={`w-full px-4 py-2 border ${
                      bankErrors.account_number
                        ? "border-[#EF4444]"
                        : "border-[#CBD5E1]"
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]`}
                    placeholder="Account number"
                  />
                  {bankErrors.account_number && (
                    <p className="text-xs text-[#EF4444] mt-1">
                      {bankErrors.account_number}
                    </p>
                  )}
                </div>

                {/* IBAN */}
                <div>
                  <label className="block text-sm font-medium text-[#334155] mb-1">
                    IBAN
                  </label>
                  <input
                    type="text"
                    name="iban"
                    value={bankForm.iban}
                    onChange={handleBankFormChange}
                    className="w-full px-4 py-2 border border-[#CBD5E1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]"
                    placeholder="International Bank Account Number"
                  />
                </div>

                {/* SWIFT Code */}
                <div>
                  <label className="block text-sm font-medium text-[#334155] mb-1">
                    SWIFT Code
                  </label>
                  <input
                    type="text"
                    name="swift_code"
                    value={bankForm.swift_code}
                    onChange={handleBankFormChange}
                    className="w-full px-4 py-2 border border-[#CBD5E1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]"
                    placeholder="e.g., SBININBBXXX"
                  />
                </div>

                {/* Routing Number */}
                <div>
                  <label className="block text-sm font-medium text-[#334155] mb-1">
                    Routing Number
                  </label>
                  <input
                    type="text"
                    name="routing_number"
                    value={bankForm.routing_number}
                    onChange={handleBankFormChange}
                    className="w-full px-4 py-2 border border-[#CBD5E1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]"
                    placeholder="US routing number"
                  />
                </div>

                {/* IFSC Code */}
                <div>
                  <label className="block text-sm font-medium text-[#334155] mb-1">
                    IFSC Code *
                  </label>
                  <input
                    type="text"
                    name="ifsc_code"
                    value={bankForm.ifsc_code}
                    onChange={handleBankFormChange}
                    className={`w-full px-4 py-2 border ${
                      bankErrors.ifsc_code
                        ? "border-[#EF4444]"
                        : "border-[#CBD5E1]"
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]`}
                    placeholder="e.g., SBIN0001234"
                  />
                  {bankErrors.ifsc_code && (
                    <p className="text-xs text-[#EF4444] mt-1">
                      {bankErrors.ifsc_code}
                    </p>
                  )}
                </div>

                {/* Sort Code */}
                <div>
                  <label className="block text-sm font-medium text-[#334155] mb-1">
                    Sort Code
                  </label>
                  <input
                    type="text"
                    name="sort_code"
                    value={bankForm.sort_code}
                    onChange={handleBankFormChange}
                    className="w-full px-4 py-2 border border-[#CBD5E1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]"
                    placeholder="UK sort code"
                  />
                </div>

                {/* Branch Name */}
                <div>
                  <label className="block text-sm font-medium text-[#334155] mb-1">
                    Branch Name
                  </label>
                  <input
                    type="text"
                    name="branch_name"
                    value={bankForm.branch_name}
                    onChange={handleBankFormChange}
                    className="w-full px-4 py-2 border border-[#CBD5E1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]"
                    placeholder="e.g., Main Branch"
                  />
                </div>

                {/* Branch Address */}
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-[#334155] mb-1">
                    Branch Address
                  </label>
                  <textarea
                    name="branch_address"
                    value={bankForm.branch_address}
                    onChange={handleBankFormChange}
                    rows="2"
                    className="w-full px-4 py-2 border border-[#CBD5E1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]"
                    placeholder="Full branch address"
                  />
                </div>

                {/* Bank Country */}
                <div>
                  <label className="block text-sm font-medium text-[#334155] mb-1">
                    Bank Country *
                  </label>
                  <input
                    type="text"
                    name="bank_country"
                    value={bankForm.bank_country}
                    onChange={handleBankFormChange}
                    className={`w-full px-4 py-2 border ${
                      bankErrors.bank_country
                        ? "border-[#EF4444]"
                        : "border-[#CBD5E1]"
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]`}
                    placeholder="e.g., India"
                  />
                  {bankErrors.bank_country && (
                    <p className="text-xs text-[#EF4444] mt-1">
                      {bankErrors.bank_country}
                    </p>
                  )}
                </div>

                {/* Currency */}
                <div>
                  <label className="block text-sm font-medium text-[#334155] mb-1">
                    Currency *
                  </label>
                  <select
                    name="currency"
                    value={bankForm.currency}
                    onChange={handleBankFormChange}
                    className={`w-full px-4 py-2 border ${
                      bankErrors.currency
                        ? "border-[#EF4444]"
                        : "border-[#CBD5E1]"
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]`}
                  >
                    <option value="INR">INR - Indian Rupee</option>
                    <option value="USD">USD - US Dollar</option>
                    <option value="EUR">EUR - Euro</option>
                    <option value="GBP">GBP - British Pound</option>
                    <option value="AED">AED - UAE Dirham</option>
                    <option value="SGD">SGD - Singapore Dollar</option>
                  </select>
                  {bankErrors.currency && (
                    <p className="text-xs text-[#EF4444] mt-1">
                      {bankErrors.currency}
                    </p>
                  )}
                </div>

                {/* UPI ID */}
                <div>
                  <label className="block text-sm font-medium text-[#334155] mb-1">
                    UPI ID
                  </label>
                  <input
                    type="text"
                    name="upi_id"
                    value={bankForm.upi_id}
                    onChange={handleBankFormChange}
                    className="w-full px-4 py-2 border border-[#CBD5E1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]"
                    placeholder="e.g., name@upi"
                  />
                </div>

                {/* QR Code Upload */}
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-[#334155] mb-1">
                    QR Code
                  </label>
                  <div className="flex items-start space-x-6">
                    <div className="flex-1">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleBankImageChange}
                        className="hidden"
                        id="qr-code-upload"
                      />
                      <label
                        htmlFor="qr-code-upload"
                        className="inline-flex items-center px-4 py-2 border border-[#CBD5E1] rounded-lg text-sm font-medium text-[#334155] hover:bg-[#F8FAFC] cursor-pointer transition-colors"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Upload QR Code
                      </label>
                      <p className="text-xs text-[#64748B] mt-2">
                        Recommended: PNG or JPG, max 2MB
                      </p>
                      {bankErrors.qr_code && (
                        <p className="text-xs text-[#EF4444] mt-1">
                          {bankErrors.qr_code}
                        </p>
                      )}
                    </div>

                    {(bankImagePreview ||
                      (editingBank?.qr_code && !bankImageFile)) && (
                      <div className="flex-shrink-0">
                        <div className="w-24 h-24 border border-[#E2E8F0] rounded-lg overflow-hidden bg-[#F8FAFC]">
                          <img
                            src={
                              bankImagePreview ||
                              `${STORAGE_URL}/${editingBank?.qr_code}`
                            }
                            alt="QR Code Preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Status and Default */}
                <div className="col-span-2 flex items-center space-x-6">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="is_default"
                      checked={bankForm.is_default}
                      onChange={handleBankFormChange}
                      className="w-4 h-4 text-[#2563EB] rounded border-[#CBD5E1] focus:ring-[#2563EB]"
                    />
                    <span className="text-sm text-[#334155]">
                      Set as default account
                    </span>
                  </label>

                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="status"
                      checked={bankForm.status === "active"}
                      onChange={(e) =>
                        setBankForm((prev) => ({
                          ...prev,
                          status: e.target.checked ? "active" : "inactive",
                        }))
                      }
                      className="w-4 h-4 text-[#2563EB] rounded border-[#CBD5E1] focus:ring-[#2563EB]"
                    />
                    <span className="text-sm text-[#334155]">Active</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-end space-x-3">
              <button
                onClick={() => {
                  setShowBankModal(false);
                  resetBankForm();
                }}
                className="px-4 py-2 border border-[#CBD5E1] rounded-lg text-sm font-medium text-[#334155] hover:bg-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveBank}
                disabled={saving}
                className="px-4 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 flex items-center space-x-2"
              >
                {saving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>{editingBank ? "Update" : "Save"} Bank</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="px-6 py-4 border-b border-[#E2E8F0]">
              <h3 className="text-lg font-semibold text-[#0F172A]">
                Confirm Delete
              </h3>
            </div>
            <div className="p-6">
              <p className="text-[#334155]">
                Are you sure you want to delete the {deleteConfirm.gateway}{" "}
                payment gateway configuration? This action cannot be undone.
              </p>
            </div>
            <div className="px-6 py-4 border-t border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-end space-x-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 border border-[#CBD5E1] rounded-lg text-sm font-medium text-[#334155] hover:bg-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeletePayment(deleteConfirm.id)}
                disabled={saving}
                className="px-4 py-2 bg-[#EF4444] hover:bg-[#DC2626] text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 flex items-center space-x-2"
              >
                {saving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    <span>Delete</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HandleOrgSettings;
