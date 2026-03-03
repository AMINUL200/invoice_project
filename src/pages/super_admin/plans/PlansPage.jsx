// pages/admin/plans/index.jsx
import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Copy, 
  Trash2,
  CheckCircle,
  XCircle,
  DollarSign,
  Users,
  FileText,
  Zap,
  MoreHorizontal,
  RefreshCw
} from 'lucide-react';
import { api } from '../../../utils/app';

const PlansPage = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/super/plans'); // Adjust endpoint as needed
      
      // Extract data from the response structure
      // Assuming response.data.data contains the array of plans
      const plansData = response.data.data || response.data;
      
      setPlans(plansData);
    } catch (error) {
      console.error('Error fetching plans:', error);
      setError(error.message || 'Failed to fetch plans');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (planId, newStatus) => {
    try {
      // Optimistic update
      setPlans(prev => 
        prev.map(plan => 
          plan.id === planId 
            ? { ...plan, status: newStatus }
            : plan
        )
      );

      // Make API call
      await api.patch(`/plans/${planId}/status`, { status: newStatus });
      
      console.log(`Plan ${planId} status changed to ${newStatus}`);
    } catch (error) {
      console.error('Error updating plan status:', error);
      // Revert on error
      fetchPlans(); // Refresh the list
      setError('Failed to update plan status');
    }
  };

  const handleDeletePlan = async (planId) => {
    if (!window.confirm('Are you sure you want to delete this plan?')) return;

    try {
      // Optimistic update
      setPlans(prev => prev.filter(plan => plan.id !== planId));

      // Make API call
      await api.delete(`/plans/${planId}`);
      
      console.log(`Plan ${planId} deleted`);
    } catch (error) {
      console.error('Error deleting plan:', error);
      // Revert on error
      fetchPlans(); // Refresh the list
      setError('Failed to delete plan');
    }
  };

  const handleDuplicatePlan = async (plan) => {
    try {
      // Create a new plan object without the id
      const { id, created_at, updated_at, ...planData } = plan;
      
      // Make API call to create duplicate
      const response = await api.post('/plans', {
        ...planData,
        plan_name: `${plan.plan_name} (Copy)`
      });

      // Add the new plan to state
      const newPlan = response.data.data || response.data;
      setPlans(prev => [...prev, newPlan]);
      
      console.log('Plan duplicated:', newPlan);
    } catch (error) {
      console.error('Error duplicating plan:', error);
      setError('Failed to duplicate plan');
    }
  };

  const filteredPlans = plans.filter(plan => {
    const matchesSearch = plan.plan_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || plan.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getInvoiceLimitText = (limit) => {
    if (limit === -1) return 'Unlimited';
    if (limit === 9999) return 'Unlimited'; // Handle your unlimited value
    return `${limit} invoices/month`;
  };

  const formatPrice = (price, cycle) => {
    const numPrice = parseFloat(price);
    return cycle === 'yearly' || cycle === 'annual'
      ? `$${numPrice.toLocaleString()}/year` 
      : `$${numPrice.toLocaleString()}/month`;
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Header */}
      <header className="bg-white border-b border-[#E2E8F0] sticky top-0 z-10">
        <div className="px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-[#0F172A]">Subscription Plans</h1>
              <p className="text-sm text-[#64748B] mt-1">
                Manage pricing plans and features for your SaaS platform
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={fetchPlans}
                className="p-2 border border-[#CBD5E1] rounded-lg hover:bg-[#F8FAFC] transition-colors"
                disabled={loading}
              >
                <RefreshCw className={`w-4 h-4 text-[#64748B] ${loading ? 'animate-spin' : ''}`} />
              </button>
              
              <button
                onClick={() => window.location.href = '/admin/plans/create'}
                className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-2 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Create Plan</span>
              </button>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="mt-4 flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#64748B]" />
              <input
                type="text"
                placeholder="Search plans..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-[#CBD5E1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]"
              />
            </div>
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-[#CBD5E1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-8">
        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Plans Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-4 border-[#2563EB] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPlans.map((plan) => (
              <div 
                key={plan.id} 
                className={`bg-white rounded-xl border shadow-sm overflow-hidden transition-all hover:shadow-md ${
                  plan.status === 'active' ? 'border-[#E2E8F0]' : 'border-[#FEE2E2] bg-[#FEF2F2]'
                }`}
              >
                {/* Plan Header */}
                <div className={`px-6 py-4 border-b ${
                  plan.status === 'active' ? 'border-[#E2E8F0]' : 'border-[#FEE2E2]'
                }`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-[#0F172A]">{plan.plan_name}</h3>
                      <p className="text-sm text-[#64748B] capitalize">
                        {plan.billing_cycle === 'yearly' ? 'Annual' : 'Monthly'}
                      </p>
                    </div>
                    <div className="relative">
                      <button
                        onClick={() => {/* Toggle menu */}}
                        className="p-2 hover:bg-[#F1F5F9] rounded-lg transition-colors"
                      >
                        <MoreHorizontal className="w-5 h-5 text-[#64748B]" />
                      </button>
                      {/* Dropdown menu would go here */}
                    </div>
                  </div>
                </div>

                {/* Plan Price */}
                <div className="px-6 py-4">
                  <div className="flex items-baseline">
                    <span className="text-3xl font-bold text-[#0F172A]">
                      ${parseFloat(plan.price).toLocaleString()}
                    </span>
                    <span className="text-sm text-[#64748B] ml-1">
                      /{plan.billing_cycle === 'yearly' ? 'year' : 'month'}
                    </span>
                  </div>
                </div>

                {/* Plan Features */}
                <div className="px-6 py-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#64748B]">Invoice Limit</span>
                    <span className="text-sm font-medium text-[#0F172A]">
                      {getInvoiceLimitText(plan.invoice_limit)}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#64748B]">Email Feature</span>
                    {plan.email_feature ? (
                      <CheckCircle className="w-5 h-5 text-[#22C55E]" />
                    ) : (
                      <XCircle className="w-5 h-5 text-[#EF4444]" />
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#64748B]">Payment Feature</span>
                    {plan.payment_feature ? (
                      <CheckCircle className="w-5 h-5 text-[#22C55E]" />
                    ) : (
                      <XCircle className="w-5 h-5 text-[#EF4444]" />
                    )}
                  </div>
                </div>

                {/* Status Badge and Actions */}
                <div className="px-6 py-3 bg-[#F8FAFC] border-t border-[#E2E8F0] flex items-center justify-between">
                  <button
                    onClick={() => handleStatusChange(
                      plan.id, 
                      plan.status === 'active' ? 'inactive' : 'active'
                    )}
                    className={`px-2 py-1 text-xs font-medium rounded-full transition-colors ${
                      plan.status === 'active' 
                        ? 'bg-[#DCFCE7] text-[#15803D] hover:bg-[#BBF7D0]' 
                        : 'bg-[#FEE2E2] text-[#B91C1C] hover:bg-[#FECACA]'
                    }`}
                  >
                    {plan.status}
                  </button>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => window.location.href = `/admin/plans/${plan.id}/edit`}
                      className="p-1 hover:bg-white rounded transition-colors"
                      title="Edit Plan"
                    >
                      <Edit className="w-4 h-4 text-[#64748B]" />
                    </button>
                    {/* <button
                      onClick={() => handleDuplicatePlan(plan)}
                      className="p-1 hover:bg-white rounded transition-colors"
                      title="Duplicate Plan"
                    >
                      <Copy className="w-4 h-4 text-[#64748B]" />
                    </button> */}
                    {/* <button
                      onClick={() => handleDeletePlan(plan.id)}
                      className="p-1 hover:bg-white rounded transition-colors"
                      title="Delete Plan"
                    >
                      <Trash2 className="w-4 h-4 text-[#EF4444]" />
                    </button> */}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredPlans.length === 0 && !loading && (
          <div className="text-center py-12">
            <CreditCard className="w-12 h-12 text-[#64748B] mx-auto mb-4" />
            <p className="text-[#0F172A] font-medium">No plans found</p>
            <p className="text-sm text-[#64748B] mt-1">Create your first subscription plan</p>
            <button
              onClick={() => window.location.href = '/admin/plans/create'}
              className="mt-4 px-4 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-lg text-sm font-medium inline-flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Create Plan</span>
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default PlansPage;