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
} from "lucide-react";
import { api } from "../../../utils/app";
import { TEMPLATE_PREVIEWS, TEMPLATES } from "../../../config/invoiceTemplates";

const HandleOrgSettings = () => {
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

  // SMTP Settings State - Updated to match API response
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

  // Payment Gateway Settings State - List of payment gateways
  const [paymentGateways, setPaymentGateways] = useState([]);

  // Current payment form state (for add/edit)
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

  const [selectedTemplate, setSelectedTemplate] = useState(
    localStorage.getItem("invoice_template") || 1,
  );

  const handleTemplateSelect = (id) => {
    setSelectedTemplate(id);
    localStorage.setItem("invoice_template", id);
    setApiSuccess("Invoice template updated");
  };

  // Fetch organization settings
  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    setApiError(null);

    try {
      // Fetch both settings in parallel
      const [smtpResponse, paymentResponse] = await Promise.all([
        api.get("/org/mail-settings"), // Your email settings endpoint
        api.get("/org/gateways"), // Your payment settings endpoint
      ]);

      // Handle SMTP settings
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

      // Handle Payment settings - store as array
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
    // Clear error for this field
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

    // Clear error for this field
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
      // Prepare the data in the format your API expects
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
        // Update existing SMTP settings
        await api.post("/org/mail-settings", smtpData);
        setApiSuccess("Email settings updated successfully");
      } else {
        // Create new SMTP settings
        await api.post("/org/mail-settings", smtpData);
        setApiSuccess("Email settings saved successfully");
      }

      // Refresh settings to get updated data
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
      // Prepare the data in the format your API expects
      const paymentData = {
        gateway: paymentForm.gateway,
        public_key: paymentForm.public_key,
        secret_key: paymentForm.secret_key,
        webhook_secret: paymentForm.webhook_secret || "",
        mode: paymentForm.mode,
        is_active: paymentForm.is_active,
      };

      if (paymentForm.id) {
        // Update existing payment settings
        await api.post(`/org/gateways/${paymentForm.id}`, paymentData);
        setApiSuccess("Payment settings updated successfully");
      } else {
        // Create new payment settings
        await api.post("/org/gateways", paymentData);
        setApiSuccess("Payment settings added successfully");
      }

      // Refresh settings to get updated data
      await fetchSettings();

      // Close modal and reset form
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

      // Refresh settings
      await fetchSettings();

      // Close delete confirmation
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

      // Refresh settings
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

  // Get field labels based on selected gateway
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

        {/* Email Settings Tab - Updated with working form */}
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
                  {/* Driver (hidden since it's always smtp) */}
                  <input type="hidden" name="driver" value="smtp" />

                  {/* SMTP Host */}
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

                  {/* Port */}
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

                  {/* Encryption */}
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

                  {/* Username */}
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

                  {/* Password */}
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

                  {/* From Address */}
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

                  {/* From Name */}
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

                {/* Action Buttons */}
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

            {/* Email Info Card */}
            <div className="mt-6 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0] p-4">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-[#2563EB] flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-medium text-[#0F172A]">
                    About Email Settings
                  </h4>
                  <p className="text-xs text-[#64748B] mt-1">
                    These settings are used for sending invoices, payment
                    receipts, and notifications to your customers. Make sure to
                    use a reliable SMTP provider for better deliverability.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Payment Settings Tab - Table View */}
        {activeTab === "payment" && (
          <div className="max-w-6xl">
            {/* Header with Add Button */}
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

            {/* Payment Gateways Table */}
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

            {/* Payment Info Card */}
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
                    to accept real payments. The active gateway will be used for
                    processing customer payments.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "invoice" && (
          <div className="max-w-6xl">
            <h2 className="text-lg font-semibold text-[#0F172A] mb-4">
              Invoice Templates
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Object.values(TEMPLATES).map((template) => (
                <div
                  key={template.id}
                  className={`border rounded-xl overflow-hidden cursor-pointer transition ${
                    selectedTemplate == template.id
                      ? "border-[#2563EB] ring-2 ring-[#2563EB]/20"
                      : "border-[#E2E8F0]"
                  }`}
                  onClick={() => handleTemplateSelect(template.id)}
                >
                  {/* Image */}
                  <img
                    src={TEMPLATE_PREVIEWS[template.id]}
                    alt={template.name}
                    className="w-full h-56 object-cover"
                  />

                  {/* Footer */}
                  <div className="p-3 flex items-center justify-between">
                    <span className="text-sm font-medium text-[#0F172A]">
                      {template.name}
                    </span>

                    {selectedTemplate == template.id && (
                      <CheckCircle className="w-4 h-4 text-[#22C55E]" />
                    )}
                  </div>
                </div>
              ))}
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
              {/* Gateway Selection */}
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

              {/* Gateway Preview */}
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

              {/* Mode Selection */}
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

              {/* API Keys */}
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

              {/* Active Status */}
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

            {/* Modal Footer */}
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

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="px-6 py-4 border-b border-[#E2E8F0]">
              <h3 className="text-lg font-semibold text-[#0F172A">
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
