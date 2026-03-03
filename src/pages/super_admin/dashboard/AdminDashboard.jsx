// AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Users, 
  DollarSign, 
  FileText,
  TrendingUp,
  Calendar,
  Download,
  RefreshCw
} from 'lucide-react';
import StatsCard from '../../../component/super_admin/dashboard/StatsCard';
import RevenuePieChart from '../../../component/super_admin/dashboard/RevenuePieChart';
import RecentInvoicesTable from '../../../component/super_admin/dashboard/RecentInvoicesTable';

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalCompanies: 0,
    activeSubscriptions: 0,
    totalRevenue: 0,
    totalInvoices: 0,
    revenueChange: '+12.5%',
    companiesChange: '+8.2%'
  });

  const [pieData, setPieData] = useState([
    { name: 'Active', value: 245000 },
    { name: 'Pending', value: 85000 },
    { name: 'Overdue', value: 32000 },
    { name: 'Draft', value: 18000 },
    { name: 'Cancelled', value: 5000 }
  ]);

  const [recentInvoices, setRecentInvoices] = useState([
    { id: 'INV-2024-001', company: 'TechCorp Solutions', amount: 2500, status: 'Paid', date: '2024-01-15' },
    { id: 'INV-2024-002', company: 'Global Industries', amount: 4800, status: 'Pending', date: '2024-01-14' },
    { id: 'INV-2024-003', company: 'Innovation Labs', amount: 1250, status: 'Overdue', date: '2024-01-10' },
    { id: 'INV-2024-004', company: 'Digital Dynamics', amount: 3200, status: 'Paid', date: '2024-01-13' },
    { id: 'INV-2024-005', company: 'Future Systems', amount: 5600, status: 'Draft', date: '2024-01-12' }
  ]);

  useEffect(() => {
    // Simulate API call to fetch dashboard data
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setStats({
          totalCompanies: 156,
          activeSubscriptions: 142,
          totalRevenue: 385000,
          totalInvoices: 1248,
          revenueChange: '+12.5%',
          companiesChange: '+8.2%'
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#2563EB] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#64748B]">Loading dashboard...</p>
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
              <h1 className="text-2xl font-bold text-[#0F172A]">Super Admin Dashboard</h1>
              <p className="text-sm text-[#64748B] mt-1">Welcome back, Super Admin</p>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Date Range Selector */}
              <div className="flex items-center space-x-2 bg-[#F1F5F9] rounded-lg px-4 py-2">
                <Calendar className="w-4 h-4 text-[#64748B]" />
                <span className="text-sm text-[#334155]">Jan 1 - Jan 31, 2024</span>
              </div>
              
              {/* Refresh Button */}
              <button 
                onClick={handleRefresh}
                className="p-2 hover:bg-[#F1F5F9] rounded-lg transition-colors"
              >
                <RefreshCw className="w-5 h-5 text-[#64748B]" />
              </button>
              
              {/* Download Report Button */}
              <button className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-2 transition-colors">
                <Download className="w-4 h-4" />
                <span>Download Report</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Companies"
            value={stats.totalCompanies}
            change={stats.companiesChange}
            icon={Building2}
            changeType="increase"
            bgColor="bg-[#2563EB]/10"
          />
          
          <StatsCard
            title="Active Subscriptions"
            value={stats.activeSubscriptions}
            change="+5.3%"
            icon={Users}
            changeType="increase"
            bgColor="bg-[#22C55E]/10"
          />
          
          <StatsCard
            title="Total Revenue"
            value={formatCurrency(stats.totalRevenue)}
            change={stats.revenueChange}
            icon={DollarSign}
            changeType="increase"
            bgColor="bg-[#F59E0B]/10"
          />
          
          <StatsCard
            title="Total Invoices"
            value={stats.totalInvoices}
            change="+15.2%"
            icon={FileText}
            changeType="increase"
            bgColor="bg-[#EF4444]/10"
          />
        </div>

        {/* Charts and Analytics Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Revenue Overview Card */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-[#E2E8F0] shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-[#0F172A] font-semibold">Revenue Overview</h3>
                <p className="text-sm text-[#64748B] mt-1">Monthly revenue distribution</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="flex items-center text-sm text-[#64748B]">
                  <TrendingUp className="w-4 h-4 mr-1 text-[#22C55E]" />
                  +23.5% vs last month
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-[#F8FAFC] rounded-lg p-4">
                <p className="text-sm text-[#64748B] mb-1">This Month</p>
                <p className="text-xl font-bold text-[#0F172A]">{formatCurrency(125000)}</p>
              </div>
              <div className="bg-[#F8FAFC] rounded-lg p-4">
                <p className="text-sm text-[#64748B] mb-1">Last Month</p>
                <p className="text-xl font-bold text-[#0F172A]">{formatCurrency(98000)}</p>
              </div>
            </div>

            <RevenuePieChart data={pieData} />
          </div>

          {/* Quick Actions Card */}
          <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm p-6">
            <h3 className="text-[#0F172A] font-semibold mb-4">Quick Actions</h3>
            
            <div className="space-y-3">
              <button className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-4 py-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-2">
                <Building2 className="w-4 h-4" />
                <span>Add New Company</span>
              </button>
              
              <button className="w-full bg-white border border-[#CBD5E1] hover:bg-[#F8FAFC] text-[#334155] px-4 py-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-2">
                <FileText className="w-4 h-4" />
                <span>Create Invoice</span>
              </button>
              
              <button className="w-full bg-white border border-[#CBD5E1] hover:bg-[#F8FAFC] text-[#334155] px-4 py-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-2">
                <Users className="w-4 h-4" />
                <span>Manage Users</span>
              </button>
            </div>

            <div className="mt-6 pt-6 border-t border-[#E2E8F0]">
              <h4 className="text-sm font-medium text-[#0F172A] mb-3">System Status</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[#64748B]">API Health</span>
                  <span className="text-xs bg-[#DCFCE7] text-[#15803D] px-2 py-1 rounded-full">Operational</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[#64748B]">Database</span>
                  <span className="text-xs bg-[#DCFCE7] text-[#15803D] px-2 py-1 rounded-full">Healthy</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[#64748B]">Last Backup</span>
                  <span className="text-xs text-[#64748B]">2 hours ago</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Invoices Table */}
        <RecentInvoicesTable invoices={recentInvoices} />
      </main>
    </div>
  );
};

export default AdminDashboard;