// pages/admin/subscriptions/index.jsx
import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  Search,
  Filter,
  Download,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  Eye,
  MoreHorizontal,
  DollarSign,
  Users,
  TrendingUp,
  Calendar
} from 'lucide-react';

const SubscriptionsPage = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    pastDue: 0,
    cancelled: 0,
    revenue: 0
  });

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Dummy data
      const dummySubscriptions = [
        {
          id: 1,
          company: 'TechCorp Solutions',
          plan: 'Enterprise',
          cycle: 'annual',
          amount: 19990,
          status: 'active',
          startDate: '2024-01-01',
          nextBilling: '2024-12-31',
          paymentMethod: 'Visa ending in 4242',
          users: 45
        },
        {
          id: 2,
          company: 'Global Industries',
          plan: 'Professional',
          cycle: 'monthly',
          amount: 799,
          status: 'active',
          startDate: '2024-02-01',
          nextBilling: '2024-03-01',
          paymentMethod: 'Mastercard ending in 5555',
          users: 28
        },
        {
          id: 3,
          company: 'Innovation Labs',
          plan: 'Starter',
          cycle: 'annual',
          amount: 2990,
          status: 'past_due',
          startDate: '2024-01-15',
          nextBilling: '2024-02-15',
          paymentMethod: 'Amex ending in 1234',
          users: 12
        },
        {
          id: 4,
          company: 'Digital Dynamics',
          plan: 'Professional',
          cycle: 'monthly',
          amount: 799,
          status: 'cancelled',
          startDate: '2023-11-01',
          nextBilling: '2024-02-01',
          paymentMethod: 'Visa ending in 9876',
          users: 0
        }
      ];
      
      setSubscriptions(dummySubscriptions);
      
      // Calculate stats
      setStats({
        total: dummySubscriptions.length,
        active: dummySubscriptions.filter(s => s.status === 'active').length,
        pastDue: dummySubscriptions.filter(s => s.status === 'past_due').length,
        cancelled: dummySubscriptions.filter(s => s.status === 'cancelled').length,
        revenue: dummySubscriptions
          .filter(s => s.status === 'active' || s.status === 'past_due')
          .reduce((sum, s) => sum + (s.cycle === 'annual' ? s.amount/12 : s.amount), 0)
      });
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'active':
        return {
          bg: 'bg-[#DCFCE7]',
          text: 'text-[#15803D]',
          icon: CheckCircle,
          label: 'Active'
        };
      case 'past_due':
        return {
          bg: 'bg-[#FEF3C7]',
          text: 'text-[#B45309]',
          icon: AlertCircle,
          label: 'Past Due'
        };
      case 'cancelled':
        return {
          bg: 'bg-[#FEE2E2]',
          text: 'text-[#B91C1C]',
          icon: XCircle,
          label: 'Cancelled'
        };
      default:
        return {
          bg: 'bg-[#E2E8F0]',
          text: 'text-[#475569]',
          icon: Clock,
          label: status
        };
    }
  };

  const filteredSubscriptions = subscriptions.filter(sub => {
    const matchesSearch = sub.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sub.plan.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || sub.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Header */}
      <header className="bg-white border-b border-[#E2E8F0] sticky top-0 z-10">
        <div className="px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-[#0F172A]">Subscriptions</h1>
              <p className="text-sm text-[#64748B] mt-1">
                Monitor and manage all active subscriptions
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={fetchSubscriptions}
                className="p-2 border border-[#CBD5E1] rounded-lg hover:bg-[#F8FAFC] transition-colors"
              >
                <RefreshCw className="w-4 h-4 text-[#64748B]" />
              </button>
              
              <button
                className="px-4 py-2 border border-[#CBD5E1] rounded-lg text-sm font-medium text-[#334155] hover:bg-[#F8FAFC] transition-colors flex items-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="mt-4 flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#64748B]" />
              <input
                type="text"
                placeholder="Search by company or plan..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-[#CBD5E1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]"
              />
            </div>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-[#CBD5E1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="past_due">Past Due</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm p-4">
            <div className="flex items-center justify-between mb-2">
              <CreditCard className="w-5 h-5 text-[#2563EB]" />
            </div>
            <p className="text-2xl font-bold text-[#0F172A]">{stats.total}</p>
            <p className="text-sm text-[#64748B]">Total Subscriptions</p>
          </div>
          
          <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm p-4">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle className="w-5 h-5 text-[#22C55E]" />
            </div>
            <p className="text-2xl font-bold text-[#0F172A]">{stats.active}</p>
            <p className="text-sm text-[#64748B]">Active</p>
          </div>
          
          <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm p-4">
            <div className="flex items-center justify-between mb-2">
              <AlertCircle className="w-5 h-5 text-[#F59E0B]" />
            </div>
            <p className="text-2xl font-bold text-[#0F172A]">{stats.pastDue}</p>
            <p className="text-sm text-[#64748B]">Past Due</p>
          </div>
          
          <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm p-4">
            <div className="flex items-center justify-between mb-2">
              <XCircle className="w-5 h-5 text-[#EF4444]" />
            </div>
            <p className="text-2xl font-bold text-[#0F172A]">{stats.cancelled}</p>
            <p className="text-sm text-[#64748B]">Cancelled</p>
          </div>
          
          <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm p-4">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="w-5 h-5 text-[#F59E0B]" />
            </div>
            <p className="text-2xl font-bold text-[#0F172A]">${stats.revenue.toLocaleString()}</p>
            <p className="text-sm text-[#64748B]">Monthly Revenue</p>
          </div>
        </div>

        {/* Subscriptions Table */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#F1F5F9]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#334155] uppercase tracking-wider">
                    Company
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#334155] uppercase tracking-wider">
                    Plan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#334155] uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#334155] uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#334155] uppercase tracking-wider">
                    Next Billing
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#334155] uppercase tracking-wider">
                    Users
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-[#334155] uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {filteredSubscriptions.map((sub) => {
                  const StatusBadge = getStatusBadge(sub.status);
                  const StatusIcon = StatusBadge.icon;
                  
                  return (
                    <tr key={sub.id} className="hover:bg-[#F8FAFC] transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <p className="text-sm font-medium text-[#0F172A]">{sub.company}</p>
                          <p className="text-xs text-[#64748B]">Started {new Date(sub.startDate).toLocaleDateString()}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <p className="text-sm font-medium text-[#0F172A]">{sub.plan}</p>
                        <p className="text-xs text-[#64748B] capitalize">{sub.cycle}</p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full flex items-center w-fit gap-1 ${StatusBadge.bg} ${StatusBadge.text}`}>
                          <StatusIcon className="w-3 h-3" />
                          {StatusBadge.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <p className="text-sm font-medium text-[#0F172A]">
                          ${sub.amount.toLocaleString()}
                        </p>
                        <p className="text-xs text-[#64748B]">
                          {sub.cycle === 'annual' ? 'per year' : 'per month'}
                        </p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4 text-[#64748B]" />
                          <span className="text-sm text-[#334155]">
                            {new Date(sub.nextBilling).toLocaleDateString()}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-1">
                          <Users className="w-4 h-4 text-[#64748B]" />
                          <span className="text-sm text-[#334155]">{sub.users}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => window.location.href = `/admin/companies/${sub.id}`}
                            className="p-1 hover:bg-[#F1F5F9] rounded-lg transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4 text-[#64748B]" />
                          </button>
                          <button
                            className="p-1 hover:bg-[#F1F5F9] rounded-lg transition-colors"
                            title="More Actions"
                          >
                            <MoreHorizontal className="w-4 h-4 text-[#64748B]" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredSubscriptions.length === 0 && !loading && (
            <div className="text-center py-12">
              <CreditCard className="w-12 h-12 text-[#64748B] mx-auto mb-4" />
              <p className="text-[#0F172A] font-medium">No subscriptions found</p>
              <p className="text-sm text-[#64748B] mt-1">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default SubscriptionsPage;