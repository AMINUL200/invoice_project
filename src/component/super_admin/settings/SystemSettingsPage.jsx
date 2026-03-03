// pages/admin/settings/index.jsx
import React, { useState, useEffect } from 'react';
import {
  Settings,
  Mail,
  CreditCard,
  Palette,
  Shield,
  Globe,
  Bell,
  Database,
  AlertTriangle,
  Save,
  RefreshCw,
  Power,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
  Server,
  Lock,
  Smartphone,
  Moon,
  Sun
} from 'lucide-react';

const SystemSettingsPage = () => {
  const [activeTab, setActiveTab] = useState('smtp');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showSensitive, setShowSensitive] = useState({});
  const [settings, setSettings] = useState({
    smtp: {
      enabled: true,
      host: 'smtp.gmail.com',
      port: 587,
      encryption: 'tls',
      username: 'noreply@yourplatform.com',
      password: '••••••••••••••••',
      from_email: 'noreply@yourplatform.com',
      from_name: 'Your SaaS Platform',
      reply_to: 'support@yourplatform.com',
      test_email: 'admin@yourplatform.com'
    },
    payment: {
      enabled: true,
      gateway: 'stripe',
      test_mode: true,
      stripe: {
        publishable_key: 'pk_test_••••••••••••••••',
        secret_key: 'sk_test_••••••••••••••••',
        webhook_secret: 'whsec_••••••••••••••••'
      },
      paypal: {
        client_id: '••••••••••••••••',
        client_secret: '••••••••••••••••',
        mode: 'sandbox'
      },
      currency: 'USD',
      tax_rate: 10,
      invoice_prefix: 'INV-'
    },
    branding: {
      platform_name: 'SaaS Billing Platform',
      company_name: 'Your Company, Inc.',
      logo_url: '/logo.png',
      favicon_url: '/favicon.ico',
      primary_color: '#2563EB',
      secondary_color: '#64748B',
      accent_color: '#F59E0B',
      support_email: 'support@yourplatform.com',
      support_phone: '+1 (555) 123-4567',
      website_url: 'https://yourplatform.com',
      privacy_policy_url: '/privacy',
      terms_url: '/terms',
      copyright: '© 2026 Your Company. All rights reserved.'
    },
    maintenance: {
      enabled: false,
      message: 'We are currently performing scheduled maintenance. We will be back shortly.',
      allowed_ips: ['192.168.1.1', '10.0.0.1'],
      allow_admins: true,
      estimated_return: '2026-02-25T18:00:00',
      show_timer: true
    },
    system: {
      timezone: 'America/New_York',
      date_format: 'YYYY-MM-DD',
      time_format: 'HH:mm:ss',
      week_starts: 'monday',
      language: 'en',
      debug_mode: false,
      log_level: 'error',
      session_timeout: 120,
      max_upload_size: 10,
      allow_registration: true,
      require_email_verification: true,
      default_user_role: 'staff'
    },
    notifications: {
      email_notifications: true,
      slack_webhook: '',
      send_invoice_created: true,
      send_invoice_paid: true,
      send_invoice_overdue: true,
      send_subscription_ended: true,
      send_low_credit: true,
      daily_summary: true,
      weekly_report: true
    }
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Settings are already set with dummy data
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSettingChange = (section, field, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleNestedChange = (section, subsection, field, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [subsection]: {
          ...prev[section][subsection],
          [field]: value
        }
      }
    }));
  };

  const toggleSensitive = (key) => {
    setShowSensitive(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('Settings saved:', settings);
      // Show success message
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setSaving(false);
    }
  };

  const testConnection = async (type) => {
    console.log(`Testing ${type} connection...`);
    // Implement connection test
  };

  const tabs = [
    { id: 'smtp', label: 'SMTP Settings', icon: Mail },
    { id: 'payment', label: 'Payment Gateway', icon: CreditCard },
    { id: 'branding', label: 'Branding', icon: Palette },
    { id: 'maintenance', label: 'Maintenance', icon: Shield },
    { id: 'system', label: 'System', icon: Settings },
    { id: 'notifications', label: 'Notifications', icon: Bell }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#2563EB] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#64748B]">Loading system settings...</p>
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
              <h1 className="text-2xl font-bold text-[#0F172A]">System Configuration</h1>
              <p className="text-sm text-[#64748B] mt-1">
                Configure global settings for your SaaS platform
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={fetchSettings}
                className="p-2 border border-[#CBD5E1] rounded-lg hover:bg-[#F8FAFC] transition-colors"
              >
                <RefreshCw className="w-4 h-4 text-[#64748B]" />
              </button>
              
              <button
                onClick={handleSubmit}
                disabled={saving}
                className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-2 transition-colors disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-8">
        <div className="flex gap-6">
          {/* Sidebar Navigation */}
          <div className="w-64 flex-shrink-0">
            <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm overflow-hidden sticky top-24">
              <nav className="p-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                        activeTab === tab.id
                          ? 'bg-[#2563EB] text-white'
                          : 'text-[#64748B] hover:bg-[#F1F5F9] hover:text-[#334155]'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </nav>

              {/* System Status */}
              <div className="p-4 border-t border-[#E2E8F0] bg-[#F8FAFC]">
                <div className="flex items-center space-x-2">
                  <Server className="w-4 h-4 text-[#64748B]" />
                  <span className="text-xs text-[#64748B]">System Status</span>
                </div>
                <div className="mt-2 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#334155]">SMTP</span>
                    {settings.smtp.enabled ? (
                      <CheckCircle className="w-4 h-4 text-[#22C55E]" />
                    ) : (
                      <XCircle className="w-4 h-4 text-[#EF4444]" />
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#334155]">Payment</span>
                    {settings.payment.enabled ? (
                      <CheckCircle className="w-4 h-4 text-[#22C55E]" />
                    ) : (
                      <XCircle className="w-4 h-4 text-[#EF4444]" />
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#334155]">Maintenance</span>
                    {settings.maintenance.enabled ? (
                      <AlertTriangle className="w-4 h-4 text-[#F59E0B]" />
                    ) : (
                      <CheckCircle className="w-4 h-4 text-[#22C55E]" />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Settings Forms */}
          <div className="flex-1">
            <form onSubmit={handleSubmit}>
              {/* SMTP Settings */}
              {activeTab === 'smtp' && (
                <div className="space-y-6">
                  <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-[#E2E8F0] bg-[#F8FAFC]">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Mail className="w-5 h-5 text-[#2563EB]" />
                          <h2 className="text-lg font-semibold text-[#0F172A]">SMTP Configuration</h2>
                        </div>
                        <label className="flex items-center space-x-2">
                          <span className="text-sm text-[#64748B]">Enabled</span>
                          <input
                            type="checkbox"
                            checked={settings.smtp.enabled}
                            onChange={(e) => handleSettingChange('smtp', 'enabled', e.target.checked)}
                            className="w-4 h-4 text-[#2563EB] rounded border-[#CBD5E1] focus:ring-[#2563EB]"
                          />
                        </label>
                      </div>
                      <p className="text-sm text-[#64748B] mt-1">
                        Configure email server settings for all outgoing emails
                      </p>
                    </div>

                    <div className="p-6 space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-[#334155] mb-1">
                            SMTP Host *
                          </label>
                          <input
                            type="text"
                            value={settings.smtp.host}
                            onChange={(e) => handleSettingChange('smtp', 'host', e.target.value)}
                            className="w-full px-3 py-2 border border-[#CBD5E1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]"
                            placeholder="smtp.gmail.com"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-[#334155] mb-1">
                            Port *
                          </label>
                          <input
                            type="number"
                            value={settings.smtp.port}
                            onChange={(e) => handleSettingChange('smtp', 'port', parseInt(e.target.value))}
                            className="w-full px-3 py-2 border border-[#CBD5E1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]"
                            placeholder="587"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-[#334155] mb-1">
                            Encryption
                          </label>
                          <select
                            value={settings.smtp.encryption}
                            onChange={(e) => handleSettingChange('smtp', 'encryption', e.target.value)}
                            className="w-full px-3 py-2 border border-[#CBD5E1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]"
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
                            value={settings.smtp.username}
                            onChange={(e) => handleSettingChange('smtp', 'username', e.target.value)}
                            className="w-full px-3 py-2 border border-[#CBD5E1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]"
                            placeholder="noreply@yourplatform.com"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-[#334155] mb-1">
                            Password *
                          </label>
                          <div className="relative">
                            <input
                              type={showSensitive.smtp ? 'text' : 'password'}
                              value={settings.smtp.password}
                              onChange={(e) => handleSettingChange('smtp', 'password', e.target.value)}
                              className="w-full px-3 py-2 border border-[#CBD5E1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] pr-10"
                              placeholder="••••••••"
                            />
                            <button
                              type="button"
                              onClick={() => toggleSensitive('smtp')}
                              className="absolute right-2 top-1/2 -translate-y-1/2"
                            >
                              {showSensitive.smtp ? (
                                <EyeOff className="w-4 h-4 text-[#64748B]" />
                              ) : (
                                <Eye className="w-4 h-4 text-[#64748B]" />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="border-t border-[#E2E8F0] pt-4">
                        <h3 className="text-sm font-medium text-[#0F172A] mb-3">Sender Information</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-[#334155] mb-1">
                              From Email *
                            </label>
                            <input
                              type="email"
                              value={settings.smtp.from_email}
                              onChange={(e) => handleSettingChange('smtp', 'from_email', e.target.value)}
                              className="w-full px-3 py-2 border border-[#CBD5E1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]"
                              placeholder="noreply@yourplatform.com"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-[#334155] mb-1">
                              From Name *
                            </label>
                            <input
                              type="text"
                              value={settings.smtp.from_name}
                              onChange={(e) => handleSettingChange('smtp', 'from_name', e.target.value)}
                              className="w-full px-3 py-2 border border-[#CBD5E1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]"
                              placeholder="Your SaaS Platform"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-[#334155] mb-1">
                              Reply-To Email
                            </label>
                            <input
                              type="email"
                              value={settings.smtp.reply_to}
                              onChange={(e) => handleSettingChange('smtp', 'reply_to', e.target.value)}
                              className="w-full px-3 py-2 border border-[#CBD5E1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]"
                              placeholder="support@yourplatform.com"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-[#334155] mb-1">
                              Test Email
                            </label>
                            <div className="flex space-x-2">
                              <input
                                type="email"
                                value={settings.smtp.test_email}
                                onChange={(e) => handleSettingChange('smtp', 'test_email', e.target.value)}
                                className="flex-1 px-3 py-2 border border-[#CBD5E1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]"
                                placeholder="admin@yourplatform.com"
                              />
                              <button
                                type="button"
                                onClick={() => testConnection('smtp')}
                                className="px-4 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-lg text-sm font-medium whitespace-nowrap"
                              >
                                Test
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Payment Gateway Settings */}
              {activeTab === 'payment' && (
                <div className="space-y-6">
                  <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-[#E2E8F0] bg-[#F8FAFC]">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <CreditCard className="w-5 h-5 text-[#2563EB]" />
                          <h2 className="text-lg font-semibold text-[#0F172A]">Payment Gateway</h2>
                        </div>
                        <div className="flex items-center space-x-4">
                          <label className="flex items-center space-x-2">
                            <span className="text-sm text-[#64748B]">Test Mode</span>
                            <input
                              type="checkbox"
                              checked={settings.payment.test_mode}
                              onChange={(e) => handleSettingChange('payment', 'test_mode', e.target.checked)}
                              className="w-4 h-4 text-[#2563EB] rounded border-[#CBD5E1] focus:ring-[#2563EB]"
                            />
                          </label>
                          <label className="flex items-center space-x-2">
                            <span className="text-sm text-[#64748B]">Enabled</span>
                            <input
                              type="checkbox"
                              checked={settings.payment.enabled}
                              onChange={(e) => handleSettingChange('payment', 'enabled', e.target.checked)}
                              className="w-4 h-4 text-[#2563EB] rounded border-[#CBD5E1] focus:ring-[#2563EB]"
                            />
                          </label>
                        </div>
                      </div>
                      <p className="text-sm text-[#64748B] mt-1">
                        Configure payment processing settings
                      </p>
                    </div>

                    <div className="p-6 space-y-6">
                      {/* Gateway Selection */}
                      <div>
                        <label className="block text-sm font-medium text-[#334155] mb-2">
                          Payment Gateway *
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                          {['stripe', 'paypal', 'square'].map((gateway) => (
                            <label
                              key={gateway}
                              className={`relative flex items-center justify-center p-4 border rounded-lg cursor-pointer transition-colors ${
                                settings.payment.gateway === gateway
                                  ? 'border-[#2563EB] bg-[#2563EB]/5'
                                  : 'border-[#CBD5E1] hover:bg-[#F8FAFC]'
                              }`}
                            >
                              <input
                                type="radio"
                                name="gateway"
                                value={gateway}
                                checked={settings.payment.gateway === gateway}
                                onChange={(e) => handleSettingChange('payment', 'gateway', e.target.value)}
                                className="sr-only"
                              />
                              <span className="text-sm font-medium capitalize text-[#334155]">
                                {gateway}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Stripe Settings */}
                      {settings.payment.gateway === 'stripe' && (
                        <div className="space-y-4">
                          <h3 className="text-sm font-medium text-[#0F172A]">Stripe Configuration</h3>
                          
                          <div>
                            <label className="block text-sm font-medium text-[#334155] mb-1">
                              Publishable Key *
                            </label>
                            <div className="relative">
                              <input
                                type={showSensitive.stripe_publishable ? 'text' : 'password'}
                                value={settings.payment.stripe.publishable_key}
                                onChange={(e) => handleNestedChange('payment', 'stripe', 'publishable_key', e.target.value)}
                                className="w-full px-3 py-2 border border-[#CBD5E1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] pr-10"
                                placeholder="pk_test_..."
                              />
                              <button
                                type="button"
                                onClick={() => toggleSensitive('stripe_publishable')}
                                className="absolute right-2 top-1/2 -translate-y-1/2"
                              >
                                {showSensitive.stripe_publishable ? (
                                  <EyeOff className="w-4 h-4 text-[#64748B]" />
                                ) : (
                                  <Eye className="w-4 h-4 text-[#64748B]" />
                                )}
                              </button>
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-[#334155] mb-1">
                              Secret Key *
                            </label>
                            <div className="relative">
                              <input
                                type={showSensitive.stripe_secret ? 'text' : 'password'}
                                value={settings.payment.stripe.secret_key}
                                onChange={(e) => handleNestedChange('payment', 'stripe', 'secret_key', e.target.value)}
                                className="w-full px-3 py-2 border border-[#CBD5E1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] pr-10"
                                placeholder="sk_test_..."
                              />
                              <button
                                type="button"
                                onClick={() => toggleSensitive('stripe_secret')}
                                className="absolute right-2 top-1/2 -translate-y-1/2"
                              >
                                {showSensitive.stripe_secret ? (
                                  <EyeOff className="w-4 h-4 text-[#64748B]" />
                                ) : (
                                  <Eye className="w-4 h-4 text-[#64748B]" />
                                )}
                              </button>
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-[#334155] mb-1">
                              Webhook Secret
                            </label>
                            <input
                              type="text"
                              value={settings.payment.stripe.webhook_secret}
                              onChange={(e) => handleNestedChange('payment', 'stripe', 'webhook_secret', e.target.value)}
                              className="w-full px-3 py-2 border border-[#CBD5E1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]"
                              placeholder="whsec_..."
                            />
                          </div>
                        </div>
                      )}

                      {/* General Payment Settings */}
                      <div className="border-t border-[#E2E8F0] pt-4">
                        <h3 className="text-sm font-medium text-[#0F172A] mb-3">General Settings</h3>
                        
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-[#334155] mb-1">
                              Currency *
                            </label>
                            <select
                              value={settings.payment.currency}
                              onChange={(e) => handleSettingChange('payment', 'currency', e.target.value)}
                              className="w-full px-3 py-2 border border-[#CBD5E1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]"
                            >
                              <option value="USD">USD ($)</option>
                              <option value="EUR">EUR (€)</option>
                              <option value="GBP">GBP (£)</option>
                              <option value="CAD">CAD ($)</option>
                              <option value="AUD">AUD ($)</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-[#334155] mb-1">
                              Tax Rate (%)
                            </label>
                            <input
                              type="number"
                              value={settings.payment.tax_rate}
                              onChange={(e) => handleSettingChange('payment', 'tax_rate', parseInt(e.target.value))}
                              min="0"
                              max="100"
                              className="w-full px-3 py-2 border border-[#CBD5E1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-[#334155] mb-1">
                              Invoice Prefix
                            </label>
                            <input
                              type="text"
                              value={settings.payment.invoice_prefix}
                              onChange={(e) => handleSettingChange('payment', 'invoice_prefix', e.target.value)}
                              className="w-full px-3 py-2 border border-[#CBD5E1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]"
                              placeholder="INV-"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Test Connection */}
                      <div className="border-t border-[#E2E8F0] pt-4">
                        <button
                          type="button"
                          onClick={() => testConnection('payment')}
                          className="px-4 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-lg text-sm font-medium"
                        >
                          Test Connection
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Branding Settings */}
              {activeTab === 'branding' && (
                <div className="space-y-6">
                  <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-[#E2E8F0] bg-[#F8FAFC]">
                      <div className="flex items-center space-x-2">
                        <Palette className="w-5 h-5 text-[#2563EB]" />
                        <h2 className="text-lg font-semibold text-[#0F172A]">Platform Branding</h2>
                      </div>
                      <p className="text-sm text-[#64748B] mt-1">
                        Customize the look and feel of your platform
                      </p>
                    </div>

                    <div className="p-6 space-y-6">
                      {/* Logo Preview */}
                      <div className="flex items-center space-x-6">
                        <div className="w-20 h-20 bg-[#2563EB]/10 rounded-lg flex items-center justify-center">
                          <img
                            src={settings.branding.logo_url}
                            alt="Logo"
                            className="max-w-full max-h-full"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'https://via.placeholder.com/80';
                            }}
                          />
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-[#0F172A]">Current Logo</h3>
                          <p className="text-xs text-[#64748B] mt-1">Recommended size: 200x50px</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-[#334155] mb-1">
                            Platform Name *
                          </label>
                          <input
                            type="text"
                            value={settings.branding.platform_name}
                            onChange={(e) => handleSettingChange('branding', 'platform_name', e.target.value)}
                            className="w-full px-3 py-2 border border-[#CBD5E1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]"
                            placeholder="Your SaaS Platform"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-[#334155] mb-1">
                            Company Name *
                          </label>
                          <input
                            type="text"
                            value={settings.branding.company_name}
                            onChange={(e) => handleSettingChange('branding', 'company_name', e.target.value)}
                            className="w-full px-3 py-2 border border-[#CBD5E1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]"
                            placeholder="Your Company, Inc."
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-[#334155] mb-1">
                            Logo URL
                          </label>
                          <input
                            type="url"
                            value={settings.branding.logo_url}
                            onChange={(e) => handleSettingChange('branding', 'logo_url', e.target.value)}
                            className="w-full px-3 py-2 border border-[#CBD5E1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]"
                            placeholder="/logo.png"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-[#334155] mb-1">
                            Favicon URL
                          </label>
                          <input
                            type="url"
                            value={settings.branding.favicon_url}
                            onChange={(e) => handleSettingChange('branding', 'favicon_url', e.target.value)}
                            className="w-full px-3 py-2 border border-[#CBD5E1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]"
                            placeholder="/favicon.ico"
                          />
                        </div>
                      </div>

                      {/* Color Picker */}
                      <div className="border-t border-[#E2E8F0] pt-4">
                        <h3 className="text-sm font-medium text-[#0F172A] mb-3">Brand Colors</h3>
                        
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-[#334155] mb-1">
                              Primary Color
                            </label>
                            <div className="flex space-x-2">
                              <input
                                type="color"
                                value={settings.branding.primary_color}
                                onChange={(e) => handleSettingChange('branding', 'primary_color', e.target.value)}
                                className="w-10 h-10 p-1 border border-[#CBD5E1] rounded"
                              />
                              <input
                                type="text"
                                value={settings.branding.primary_color}
                                onChange={(e) => handleSettingChange('branding', 'primary_color', e.target.value)}
                                className="flex-1 px-3 py-2 border border-[#CBD5E1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]"
                                placeholder="#2563EB"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-[#334155] mb-1">
                              Secondary Color
                            </label>
                            <div className="flex space-x-2">
                              <input
                                type="color"
                                value={settings.branding.secondary_color}
                                onChange={(e) => handleSettingChange('branding', 'secondary_color', e.target.value)}
                                className="w-10 h-10 p-1 border border-[#CBD5E1] rounded"
                              />
                              <input
                                type="text"
                                value={settings.branding.secondary_color}
                                onChange={(e) => handleSettingChange('branding', 'secondary_color', e.target.value)}
                                className="flex-1 px-3 py-2 border border-[#CBD5E1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]"
                                placeholder="#64748B"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-[#334155] mb-1">
                              Accent Color
                            </label>
                            <div className="flex space-x-2">
                              <input
                                type="color"
                                value={settings.branding.accent_color}
                                onChange={(e) => handleSettingChange('branding', 'accent_color', e.target.value)}
                                className="w-10 h-10 p-1 border border-[#CBD5E1] rounded"
                              />
                              <input
                                type="text"
                                value={settings.branding.accent_color}
                                onChange={(e) => handleSettingChange('branding', 'accent_color', e.target.value)}
                                className="flex-1 px-3 py-2 border border-[#CBD5E1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]"
                                placeholder="#F59E0B"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Contact Information */}
                      <div className="border-t border-[#E2E8F0] pt-4">
                        <h3 className="text-sm font-medium text-[#0F172A] mb-3">Contact Information</h3>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-[#334155] mb-1">
                              Support Email
                            </label>
                            <input
                              type="email"
                              value={settings.branding.support_email}
                              onChange={(e) => handleSettingChange('branding', 'support_email', e.target.value)}
                              className="w-full px-3 py-2 border border-[#CBD5E1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]"
                              placeholder="support@yourplatform.com"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-[#334155] mb-1">
                              Support Phone
                            </label>
                            <input
                              type="tel"
                              value={settings.branding.support_phone}
                              onChange={(e) => handleSettingChange('branding', 'support_phone', e.target.value)}
                              className="w-full px-3 py-2 border border-[#CBD5E1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]"
                              placeholder="+1 (555) 123-4567"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-[#334155] mb-1">
                              Website URL
                            </label>
                            <input
                              type="url"
                              value={settings.branding.website_url}
                              onChange={(e) => handleSettingChange('branding', 'website_url', e.target.value)}
                              className="w-full px-3 py-2 border border-[#CBD5E1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]"
                              placeholder="https://yourplatform.com"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-[#334155] mb-1">
                              Copyright Text
                            </label>
                            <input
                              type="text"
                              value={settings.branding.copyright}
                              onChange={(e) => handleSettingChange('branding', 'copyright', e.target.value)}
                              className="w-full px-3 py-2 border border-[#CBD5E1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]"
                              placeholder="© 2026 Your Company"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Legal Links */}
                      <div className="border-t border-[#E2E8F0] pt-4">
                        <h3 className="text-sm font-medium text-[#0F172A] mb-3">Legal Links</h3>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-[#334155] mb-1">
                              Privacy Policy URL
                            </label>
                            <input
                              type="text"
                              value={settings.branding.privacy_policy_url}
                              onChange={(e) => handleSettingChange('branding', 'privacy_policy_url', e.target.value)}
                              className="w-full px-3 py-2 border border-[#CBD5E1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]"
                              placeholder="/privacy"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-[#334155] mb-1">
                              Terms of Service URL
                            </label>
                            <input
                              type="text"
                              value={settings.branding.terms_url}
                              onChange={(e) => handleSettingChange('branding', 'terms_url', e.target.value)}
                              className="w-full px-3 py-2 border border-[#CBD5E1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]"
                              placeholder="/terms"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Maintenance Mode */}
              {activeTab === 'maintenance' && (
                <div className="space-y-6">
                  <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-[#E2E8F0] bg-[#F8FAFC]">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Shield className="w-5 h-5 text-[#2563EB]" />
                          <h2 className="text-lg font-semibold text-[#0F172A]">Maintenance Mode</h2>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.maintenance.enabled}
                            onChange={(e) => handleSettingChange('maintenance', 'enabled', e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className={`w-11 h-6 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all ${
                            settings.maintenance.enabled ? 'bg-[#2563EB]' : 'bg-[#CBD5E1]'
                          }`}></div>
                        </label>
                      </div>
                      <p className="text-sm text-[#64748B] mt-1">
                        Put your platform in maintenance mode
                      </p>
                    </div>

                    {settings.maintenance.enabled && (
                      <div className="p-6 space-y-4">
                        {/* Warning Banner */}
                        <div className="bg-[#FEF3C7] border border-[#F59E0B]/20 rounded-lg p-4 flex items-start space-x-3">
                          <AlertTriangle className="w-5 h-5 text-[#B45309] flex-shrink-0 mt-0.5" />
                          <div>
                            <h4 className="text-sm font-medium text-[#B45309]">Maintenance Mode Active</h4>
                            <p className="text-xs text-[#B45309] mt-1">
                              Your platform is currently in maintenance mode. Only users with allowed IP addresses and admin users can access the platform.
                            </p>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-[#334155] mb-1">
                            Maintenance Message *
                          </label>
                          <textarea
                            value={settings.maintenance.message}
                            onChange={(e) => handleSettingChange('maintenance', 'message', e.target.value)}
                            rows="3"
                            className="w-full px-3 py-2 border border-[#CBD5E1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]"
                            placeholder="We are currently performing scheduled maintenance..."
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-[#334155] mb-1">
                              Estimated Return Time
                            </label>
                            <input
                              type="datetime-local"
                              value={settings.maintenance.estimated_return?.slice(0, 16)}
                              onChange={(e) => handleSettingChange('maintenance', 'estimated_return', e.target.value)}
                              className="w-full px-3 py-2 border border-[#CBD5E1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-[#334155] mb-1">
                              Allowed IPs (one per line)
                            </label>
                            <textarea
                              value={settings.maintenance.allowed_ips.join('\n')}
                              onChange={(e) => handleSettingChange('maintenance', 'allowed_ips', e.target.value.split('\n'))}
                              rows="3"
                              className="w-full px-3 py-2 border border-[#CBD5E1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]"
                              placeholder="192.168.1.1&#10;10.0.0.1"
                            />
                          </div>
                        </div>

                        <div className="flex items-center space-x-6">
                          <label className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={settings.maintenance.allow_admins}
                              onChange={(e) => handleSettingChange('maintenance', 'allow_admins', e.target.checked)}
                              className="w-4 h-4 text-[#2563EB] rounded border-[#CBD5E1] focus:ring-[#2563EB]"
                            />
                            <span className="text-sm text-[#334155]">Allow admin access</span>
                          </label>

                          <label className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={settings.maintenance.show_timer}
                              onChange={(e) => handleSettingChange('maintenance', 'show_timer', e.target.checked)}
                              className="w-4 h-4 text-[#2563EB] rounded border-[#CBD5E1] focus:ring-[#2563EB]"
                            />
                            <span className="text-sm text-[#334155]">Show countdown timer</span>
                          </label>
                        </div>

                        {/* Preview */}
                        <div className="border-t border-[#E2E8F0] pt-4">
                          <h4 className="text-sm font-medium text-[#0F172A] mb-2">Preview</h4>
                          <div className="bg-[#F8FAFC] rounded-lg p-4">
                            <h5 className="font-medium text-[#0F172A]">Maintenance Mode Preview</h5>
                            <p className="text-sm text-[#64748B] mt-1">{settings.maintenance.message}</p>
                            {settings.maintenance.show_timer && settings.maintenance.estimated_return && (
                              <p className="text-xs text-[#2563EB] mt-2">
                                Estimated return: {new Date(settings.maintenance.estimated_return).toLocaleString()}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* System Settings */}
              {activeTab === 'system' && (
                <div className="space-y-6">
                  <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-[#E2E8F0] bg-[#F8FAFC]">
                      <div className="flex items-center space-x-2">
                        <Settings className="w-5 h-5 text-[#2563EB]" />
                        <h2 className="text-lg font-semibold text-[#0F172A]">System Configuration</h2>
                      </div>
                      <p className="text-sm text-[#64748B] mt-1">
                        Configure global system settings
                      </p>
                    </div>

                    <div className="p-6 space-y-6">
                      {/* Regional Settings */}
                      <div>
                        <h3 className="text-sm font-medium text-[#0F172A] mb-3">Regional Settings</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-[#334155] mb-1">
                              Timezone
                            </label>
                            <select
                              value={settings.system.timezone}
                              onChange={(e) => handleSettingChange('system', 'timezone', e.target.value)}
                              className="w-full px-3 py-2 border border-[#CBD5E1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]"
                            >
                              <option value="America/New_York">Eastern Time</option>
                              <option value="America/Chicago">Central Time</option>
                              <option value="America/Denver">Mountain Time</option>
                              <option value="America/Los_Angeles">Pacific Time</option>
                              <option value="UTC">UTC</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-[#334155] mb-1">
                              Date Format
                            </label>
                            <select
                              value={settings.system.date_format}
                              onChange={(e) => handleSettingChange('system', 'date_format', e.target.value)}
                              className="w-full px-3 py-2 border border-[#CBD5E1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]"
                            >
                              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-[#334155] mb-1">
                              Time Format
                            </label>
                            <select
                              value={settings.system.time_format}
                              onChange={(e) => handleSettingChange('system', 'time_format', e.target.value)}
                              className="w-full px-3 py-2 border border-[#CBD5E1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]"
                            >
                              <option value="HH:mm:ss">24 Hour (14:30:00)</option>
                              <option value="hh:mm:ss A">12 Hour (02:30:00 PM)</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-[#334155] mb-1">
                              Week Starts On
                            </label>
                            <select
                              value={settings.system.week_starts}
                              onChange={(e) => handleSettingChange('system', 'week_starts', e.target.value)}
                              className="w-full px-3 py-2 border border-[#CBD5E1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]"
                            >
                              <option value="sunday">Sunday</option>
                              <option value="monday">Monday</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      {/* Security Settings */}
                      <div className="border-t border-[#E2E8F0] pt-4">
                        <h3 className="text-sm font-medium text-[#0F172A] mb-3">Security Settings</h3>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-[#334155] mb-1">
                              Session Timeout (minutes)
                            </label>
                            <input
                              type="number"
                              value={settings.system.session_timeout}
                              onChange={(e) => handleSettingChange('system', 'session_timeout', parseInt(e.target.value))}
                              min="5"
                              max="480"
                              className="w-full px-3 py-2 border border-[#CBD5E1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-[#334155] mb-1">
                              Max Upload Size (MB)
                            </label>
                            <input
                              type="number"
                              value={settings.system.max_upload_size}
                              onChange={(e) => handleSettingChange('system', 'max_upload_size', parseInt(e.target.value))}
                              min="1"
                              max="100"
                              className="w-full px-3 py-2 border border-[#CBD5E1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]"
                            />
                          </div>

                          <div className="col-span-2">
                            <label className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                checked={settings.system.debug_mode}
                                onChange={(e) => handleSettingChange('system', 'debug_mode', e.target.checked)}
                                className="w-4 h-4 text-[#2563EB] rounded border-[#CBD5E1] focus:ring-[#2563EB]"
                              />
                              <span className="text-sm text-[#334155]">Enable Debug Mode</span>
                            </label>
                            <p className="text-xs text-[#64748B] mt-1 ml-6">
                              Only enable in development environment. Never enable in production.
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* User Registration */}
                      <div className="border-t border-[#E2E8F0] pt-4">
                        <h3 className="text-sm font-medium text-[#0F172A] mb-3">User Registration</h3>
                        
                        <div className="space-y-3">
                          <label className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={settings.system.allow_registration}
                              onChange={(e) => handleSettingChange('system', 'allow_registration', e.target.checked)}
                              className="w-4 h-4 text-[#2563EB] rounded border-[#CBD5E1] focus:ring-[#2563EB]"
                            />
                            <span className="text-sm text-[#334155]">Allow new user registration</span>
                          </label>

                          <label className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={settings.system.require_email_verification}
                              onChange={(e) => handleSettingChange('system', 'require_email_verification', e.target.checked)}
                              className="w-4 h-4 text-[#2563EB] rounded border-[#CBD5E1] focus:ring-[#2563EB]"
                            />
                            <span className="text-sm text-[#334155]">Require email verification</span>
                          </label>

                          <div className="mt-3">
                            <label className="block text-sm font-medium text-[#334155] mb-1">
                              Default User Role
                            </label>
                            <select
                              value={settings.system.default_user_role}
                              onChange={(e) => handleSettingChange('system', 'default_user_role', e.target.value)}
                              className="w-full px-3 py-2 border border-[#CBD5E1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]"
                            >
                              <option value="staff">Staff</option>
                              <option value="company_admin">Company Admin</option>
                              <option value="user">Basic User</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Notifications Settings */}
              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-[#E2E8F0] bg-[#F8FAFC]">
                      <div className="flex items-center space-x-2">
                        <Bell className="w-5 h-5 text-[#2563EB]" />
                        <h2 className="text-lg font-semibold text-[#0F172A]">Notification Settings</h2>
                      </div>
                      <p className="text-sm text-[#64748B] mt-1">
                        Configure email notifications and alerts
                      </p>
                    </div>

                    <div className="p-6 space-y-6">
                      {/* Channel Settings */}
                      <div>
                        <h3 className="text-sm font-medium text-[#0F172A] mb-3">Notification Channels</h3>
                        
                        <div className="space-y-3">
                          <label className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={settings.notifications.email_notifications}
                              onChange={(e) => handleSettingChange('notifications', 'email_notifications', e.target.checked)}
                              className="w-4 h-4 text-[#2563EB] rounded border-[#CBD5E1] focus:ring-[#2563EB]"
                            />
                            <span className="text-sm text-[#334155]">Enable email notifications</span>
                          </label>

                          <div className="mt-2">
                            <label className="block text-sm font-medium text-[#334155] mb-1">
                              Slack Webhook URL (Optional)
                            </label>
                            <input
                              type="url"
                              value={settings.notifications.slack_webhook}
                              onChange={(e) => handleSettingChange('notifications', 'slack_webhook', e.target.value)}
                              className="w-full px-3 py-2 border border-[#CBD5E1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]"
                              placeholder="https://hooks.slack.com/services/..."
                            />
                          </div>
                        </div>
                      </div>

                      {/* Event Notifications */}
                      <div className="border-t border-[#E2E8F0] pt-4">
                        <h3 className="text-sm font-medium text-[#0F172A] mb-3">Email Notifications</h3>
                        
                        <div className="grid grid-cols-2 gap-3">
                          <label className="flex items-center space-x-2 p-3 border border-[#E2E8F0] rounded-lg hover:bg-[#F8FAFC]">
                            <input
                              type="checkbox"
                              checked={settings.notifications.send_invoice_created}
                              onChange={(e) => handleSettingChange('notifications', 'send_invoice_created', e.target.checked)}
                              className="w-4 h-4 text-[#2563EB] rounded border-[#CBD5E1] focus:ring-[#2563EB]"
                            />
                            <span className="text-sm text-[#334155]">Invoice Created</span>
                          </label>

                          <label className="flex items-center space-x-2 p-3 border border-[#E2E8F0] rounded-lg hover:bg-[#F8FAFC]">
                            <input
                              type="checkbox"
                              checked={settings.notifications.send_invoice_paid}
                              onChange={(e) => handleSettingChange('notifications', 'send_invoice_paid', e.target.checked)}
                              className="w-4 h-4 text-[#2563EB] rounded border-[#CBD5E1] focus:ring-[#2563EB]"
                            />
                            <span className="text-sm text-[#334155]">Invoice Paid</span>
                          </label>

                          <label className="flex items-center space-x-2 p-3 border border-[#E2E8F0] rounded-lg hover:bg-[#F8FAFC]">
                            <input
                              type="checkbox"
                              checked={settings.notifications.send_invoice_overdue}
                              onChange={(e) => handleSettingChange('notifications', 'send_invoice_overdue', e.target.checked)}
                              className="w-4 h-4 text-[#2563EB] rounded border-[#CBD5E1] focus:ring-[#2563EB]"
                            />
                            <span className="text-sm text-[#334155]">Invoice Overdue</span>
                          </label>

                          <label className="flex items-center space-x-2 p-3 border border-[#E2E8F0] rounded-lg hover:bg-[#F8FAFC]">
                            <input
                              type="checkbox"
                              checked={settings.notifications.send_subscription_ended}
                              onChange={(e) => handleSettingChange('notifications', 'send_subscription_ended', e.target.checked)}
                              className="w-4 h-4 text-[#2563EB] rounded border-[#CBD5E1] focus:ring-[#2563EB]"
                            />
                            <span className="text-sm text-[#334155]">Subscription Ended</span>
                          </label>

                          <label className="flex items-center space-x-2 p-3 border border-[#E2E8F0] rounded-lg hover:bg-[#F8FAFC]">
                            <input
                              type="checkbox"
                              checked={settings.notifications.send_low_credit}
                              onChange={(e) => handleSettingChange('notifications', 'send_low_credit', e.target.checked)}
                              className="w-4 h-4 text-[#2563EB] rounded border-[#CBD5E1] focus:ring-[#2563EB]"
                            />
                            <span className="text-sm text-[#334155]">Low Credit Alert</span>
                          </label>
                        </div>
                      </div>

                      {/* Reports */}
                      <div className="border-t border-[#E2E8F0] pt-4">
                        <h3 className="text-sm font-medium text-[#0F172A] mb-3">Reports & Summaries</h3>
                        
                        <div className="space-y-3">
                          <label className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={settings.notifications.daily_summary}
                              onChange={(e) => handleSettingChange('notifications', 'daily_summary', e.target.checked)}
                              className="w-4 h-4 text-[#2563EB] rounded border-[#CBD5E1] focus:ring-[#2563EB]"
                            />
                            <span className="text-sm text-[#334155]">Send daily summary email</span>
                          </label>

                          <label className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={settings.notifications.weekly_report}
                              onChange={(e) => handleSettingChange('notifications', 'weekly_report', e.target.checked)}
                              className="w-4 h-4 text-[#2563EB] rounded border-[#CBD5E1] focus:ring-[#2563EB]"
                            />
                            <span className="text-sm text-[#334155]">Send weekly report</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SystemSettingsPage;