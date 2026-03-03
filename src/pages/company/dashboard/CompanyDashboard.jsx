// pages/company/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { 
  Menu, 
  X, 
  Bell, 
  User,
  Search,
  ChevronDown,
  Settings,
  LogOut
} from 'lucide-react';
import FinancialStats from '../../../component/company/dashboard/FinancialStats';
import OperationalStats from '../../../component/company/dashboard/OperationalStats';
import SalesChart from '../../../component/company/dashboard/SalesChart';
import PaymentStatus from '../../../component/company/dashboard/PaymentStatus';
import RecentActivity from '../../../component/company/dashboard/RecentActivity';
import QuickActions from '../../../component/company/dashboard/QuickActions';
import PurchaseOverview from '../../../component/company/dashboard/PurchaseOverview';
import AlertsPanel from '../../../component/company/dashboard/AlertsPanel';
import BusinessStatus from '../../../component/company/dashboard/BusinessStatus';

const CompanyDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setDashboardData({
        financial: {
          totalSales: 485000,
          amountReceived: 385000,
          outstanding: 100000,
          purchaseExpense: 185000
        },
        operational: {
          totalCustomers: 156,
          totalVendors: 45,
          activeInvoices: 28,
          overdueInvoices: 8
        },
        businessConfig: {
          email: true,
          payment: false,
          gst: true
        }
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDismissAlert = (alertId) => {
    console.log('Dismiss alert:', alertId);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#2563EB] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#64748B]">Loading your business dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-10">
    

     

      {/* Main Dashboard Content */}
      <main className="p-4 sm:p-6 lg:p-8">
        {/* Welcome Banner */}
        {/* <div className="mb-6 bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] rounded-xl p-6 text-white">
          <h2 className="text-2xl font-bold mb-2">Welcome back, Rahul! 👋</h2>
          <p className="text-[#CBD5F5]">Here's what's happening with your business today.</p>
        </div> */}

        {/* Financial Stats */}
        <FinancialStats data={dashboardData.financial} />

        {/* Operational Stats */}
        <OperationalStats data={dashboardData.operational} />

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* Sales Chart - takes 2 columns on large screens */}
          <div className="lg:col-span-2">
            <SalesChart />
          </div>

          {/* Payment Status - takes 1 column */}
          <div className="lg:col-span-1">
            <PaymentStatus />
          </div>
        </div>

        {/* Second Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* Recent Activity */}
          <div className="lg:col-span-1">
            <RecentActivity />
          </div>

          {/* Purchase Overview */}
          <div className="lg:col-span-1">
            <PurchaseOverview />
          </div>

          {/* Alerts & Business Status */}
          <div className="lg:col-span-1 space-y-6">
            <AlertsPanel onDismiss={handleDismissAlert} />
            {/* <BusinessStatus config={dashboardData.businessConfig} /> */}
          </div>
        </div>

        {/* Quick Actions - Full Width */}
        <div className="mt-6">
          <QuickActions />
        </div>

        {/* Footer Info */}
        <div className="mt-6 text-center text-xs text-[#94A3B8]">
          <p>Last updated: Just now • <button className="text-[#2563EB] hover:underline">Refresh</button></p>
        </div>
      </main>
    </div>
  );
};

export default CompanyDashboard;