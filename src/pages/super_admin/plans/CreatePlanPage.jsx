// pages/admin/plans/create.jsx
import React, { useState } from 'react';
import { ArrowLeft, Save, CreditCard, FileText, Mail, DollarSign, Zap, CheckCircle, XCircle, Users } from 'lucide-react';
import { api } from '../../../utils/app';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const CreatePlanPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    plan_name: 'Starter',
    billing_cycle: 'monthly',
    invoice_limit: 10,
    price: 299.00,
    email_feature: false,
    payment_feature: false,
    status: 'active'
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else if (name === 'price') {
      setFormData(prev => ({
        ...prev,
        [name]: parseFloat(value) || 0
      }));
    } else if (name === 'invoice_limit') {
      // Handle invoice limit - if "unlimited" is typed, set to -1
      if (value.toLowerCase() === 'unlimited') {
        setFormData(prev => ({
          ...prev,
          [name]: -1
        }));
      } else {
        // Otherwise try to parse as number
        const numValue = parseInt(value);
        setFormData(prev => ({
          ...prev,
          [name]: isNaN(numValue) ? 0 : numValue
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const planData = {
        plan_name: formData.plan_name,
        billing_cycle: formData.billing_cycle,
        invoice_limit: formData.invoice_limit,
        price: formData.price,
        email_feature: formData.email_feature,
        payment_feature: formData.payment_feature,
        status: formData.status
      };

      console.log('Submitting plan data:', planData);
      
      const response = await api.post('/super/subscription-plans', planData);
      
      console.log('Plan created successfully:', response.data);
      if(response.data.success){
        toast.success(response.data.message)
        navigate("/admin/plans")
      }else{
        setError(response.data.message)
      }
      
    } catch (error) {
      console.error('Error creating plan:', error);
      setError(error.message || 'Failed to create plan');
    } finally {
      setLoading(false);
    }
  };

  const getInvoiceLimitDisplay = () => {
    if (formData.invoice_limit === -1) return 'Unlimited';
    return formData.invoice_limit;
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Header */}
      <header className="bg-white border-b border-[#E2E8F0] sticky top-0 z-10">
        <div className="px-8 py-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => window.location.href = '/admin/plans'}
              className="p-2 hover:bg-[#F1F5F9] rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-[#64748B]" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-[#0F172A]">Create New Plan</h1>
              <p className="text-sm text-[#64748B] mt-1">
                Define a new subscription plan for your SaaS platform
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-8">
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm overflow-hidden">
            {/* Basic Information */}
            <div className="p-6 border-b border-[#E2E8F0]">
              <h2 className="text-lg font-semibold text-[#0F172A] mb-4">Basic Information</h2>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#334155] mb-1">
                    Plan Name *
                  </label>
                  <select
                    name="plan_name"
                    value={formData.plan_name}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-[#CBD5E1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]"
                  >
                    <option value="Starter">Starter</option>
                    <option value="Professional">Professional</option>
                    <option value="Enterprise">Enterprise</option>
                    <option value="Custom">Custom</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#334155] mb-1">
                    Billing Cycle *
                  </label>
                  <select
                    name="billing_cycle"
                    value={formData.billing_cycle}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-[#CBD5E1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]"
                  >
                    <option value="monthly">Monthly</option>
                    <option value="annual">Annual</option>
                    <option value="quarterly">Quarterly</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#334155] mb-1">
                    Price (in dollars) *
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#64748B]" />
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      required
                      min="0"
                      step="0.01"
                      className="w-full pl-10 pr-4 py-2 border border-[#CBD5E1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]"
                      placeholder="29.99"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#334155] mb-1">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-[#CBD5E1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Plan Limits */}
            <div className="p-6 border-b border-[#E2E8F0]">
              <h2 className="text-lg font-semibold text-[#0F172A] mb-4">Plan Limits</h2>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#334155] mb-1">
                    Invoice Limit *
                  </label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#64748B]" />
                    <input
                      type="text"
                      name="invoice_limit"
                      value={getInvoiceLimitDisplay()}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-4 py-2 border border-[#CBD5E1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]"
                      placeholder="Enter number or type 'unlimited'"
                    />
                  </div>
                  <p className="text-xs text-[#64748B] mt-1">
                    Enter a number (e.g., 100) or type "unlimited" for no limit
                  </p>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="p-6 border-b border-[#E2E8F0]">
              <h2 className="text-lg font-semibold text-[#0F172A] mb-4">Features</h2>
              
              <div className="space-y-4">
                {/* Standard Features */}
                <div className="grid grid-cols-2 gap-4">
                  <label className="flex items-center space-x-3 p-3 border border-[#E2E8F0] rounded-lg hover:bg-[#F8FAFC] cursor-pointer">
                    <input
                      type="checkbox"
                      name="email_feature"
                      checked={formData.email_feature}
                      onChange={handleChange}
                      className="w-4 h-4 text-[#2563EB] rounded border-[#CBD5E1] focus:ring-[#2563EB]"
                    />
                    <div>
                      <span className="text-sm font-medium text-[#0F172A]">Email Integration</span>
                      <p className="text-xs text-[#64748B]">Send invoices via email</p>
                    </div>
                  </label>

                  <label className="flex items-center space-x-3 p-3 border border-[#E2E8F0] rounded-lg hover:bg-[#F8FAFC] cursor-pointer">
                    <input
                      type="checkbox"
                      name="payment_feature"
                      checked={formData.payment_feature}
                      onChange={handleChange}
                      className="w-4 h-4 text-[#2563EB] rounded border-[#CBD5E1] focus:ring-[#2563EB]"
                    />
                    <div>
                      <span className="text-sm font-medium text-[#0F172A]">Payment Processing</span>
                      <p className="text-xs text-[#64748B]">Accept online payments</p>
                    </div>
                  </label>
                </div>

                {/* Feature Preview */}
                <div className="mt-4 p-4 bg-[#F8FAFC] rounded-lg">
                  <h3 className="text-sm font-medium text-[#0F172A] mb-2">Feature Summary</h3>
                  <ul className="space-y-2">
                    <li className="flex items-center text-sm">
                      {formData.email_feature ? (
                        <CheckCircle className="w-4 h-4 text-[#22C55E] mr-2" />
                      ) : (
                        <XCircle className="w-4 h-4 text-[#EF4444] mr-2" />
                      )}
                      Email Integration
                    </li>
                    <li className="flex items-center text-sm">
                      {formData.payment_feature ? (
                        <CheckCircle className="w-4 h-4 text-[#22C55E] mr-2" />
                      ) : (
                        <XCircle className="w-4 h-4 text-[#EF4444] mr-2" />
                      )}
                      Payment Processing
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Form Preview */}
            <div className="p-6 border-b border-[#E2E8F0] bg-[#F8FAFC]">
              <h2 className="text-sm font-medium text-[#0F172A] mb-3">Plan Preview</h2>
              <div className="bg-white rounded-lg border border-[#E2E8F0] p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-[#0F172A]">{formData.plan_name}</h3>
                    <p className="text-sm text-[#64748B] capitalize">{formData.billing_cycle}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-bold text-[#0F172A]">
                      ${typeof formData.price === 'number' ? formData.price.toFixed(2) : formData.price}
                    </span>
                    <span className="text-sm text-[#64748B] ml-1">
                      /{formData.billing_cycle === 'annual' ? 'year' : 'month'}
                    </span>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-[#E2E8F0]">
                  <p className="text-sm text-[#64748B]">
                    Invoice Limit: {formData.invoice_limit === -1 ? 'Unlimited' : `${formData.invoice_limit} per month`}
                  </p>
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="px-6 py-4 bg-[#F8FAFC] border-t border-[#E2E8F0] flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => window.location.href = '/admin/plans'}
                className="px-4 py-2 border border-[#CBD5E1] rounded-lg text-sm font-medium text-[#334155] hover:bg-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 min-w-[120px] justify-center"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Creating...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Create Plan</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
};

export default CreatePlanPage;