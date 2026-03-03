// pages/admin/companies/index.jsx
import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Search, 
  Filter, 
  Plus, 
  MoreHorizontal,
  CheckCircle,
  XCircle,
  AlertCircle,
  PauseCircle,
  LogIn,
  Edit,
  Trash2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Download,
  RefreshCw
} from 'lucide-react';
import CompanyStats from '../../../component/super_admin/companies/CompanyStats';
import CompanyFilters from '../../../component/super_admin/companies/CompanyFilters';
import CompanyTable from '../../../component/super_admin/companies/CompanyTable';
import ImpersonateModal from '../../../component/super_admin/companies/ImpersonateModal';
import { api } from '../../../utils/app';

const CompaniesPage = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: 'all',
    plan: 'all',
    dateRange: 'all'
  });
  const [selectedCompanies, setSelectedCompanies] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [impersonateCompany, setImpersonateCompany] = useState(null);
  const [error, setError] = useState(null);

  // Pagination states
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 15,
    total: 0,
    from: 0,
    to: 0,
    links: []
  });
  
  const [page, setPage] = useState(1);

  // Fetch companies data
  useEffect(() => {
    fetchCompanies(page);
  }, [page]);

  const fetchCompanies = async (pageNum = 1) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/super/organizations?page=${pageNum}`);
      
      // Extract data from the response structure
      const responseData = response.data;
      
      setCompanies(responseData.data || []);
      
      // Set pagination data
      if (responseData.meta) {
        setPagination({
          current_page: responseData.meta.current_page,
          last_page: responseData.meta.last_page,
          per_page: responseData.meta.per_page,
          total: responseData.meta.total,
          from: responseData.meta.from,
          to: responseData.meta.to,
          links: responseData.meta.links || []
        });
      }
    } catch (error) {
      console.error('Error fetching companies:', error);
      setError(error.message || 'Failed to fetch companies');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (companyId, newStatus) => {
    try {
      // Optimistic update
      setCompanies(prev => 
        prev.map(company => 
          company.id === companyId 
            ? { ...company, status: newStatus }
            : company
        )
      );

      // API call to update status
      await api.patch(`/super/organizations/${companyId}/status`, { status: newStatus });
      
      console.log(`Company ${companyId} status changed to ${newStatus}`);
    } catch (error) {
      console.error('Error updating company status:', error);
      // Revert on error
      fetchCompanies(page);
      setError('Failed to update company status');
    }
  };

  const handleBulkAction = async (action) => {
    try {
      console.log(`Bulk action ${action} on companies:`, selectedCompanies);
      
      // Make API call for bulk action
      await api.post('/super/organizations/bulk-action', {
        action,
        company_ids: selectedCompanies
      });
      
      // Refresh the list
      fetchCompanies(page);
      setSelectedCompanies([]);
    } catch (error) {
      console.error('Error performing bulk action:', error);
      setError('Failed to perform bulk action');
    }
  };

  const handleImpersonate = (company) => {
    setImpersonateCompany(company);
  };

  const confirmImpersonate = async () => {
    try {
      console.log(`Impersonating company: ${impersonateCompany.company_name}`);
      
      // API call to get impersonation token
      const response = await api.post(`/super/organizations/${impersonateCompany.id}/impersonate`);
      
      // Store impersonation token
      localStorage.setItem('impersonation_token', response.data.token);
      
      // Redirect to company dashboard
      window.location.href = `/admin/impersonate/${impersonateCompany.id}`;
    } catch (error) {
      console.error('Error impersonating company:', error);
      setError('Failed to impersonate company');
      setImpersonateCompany(null);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    // You might want to add debounced search here
    // For now, just filtering locally
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.last_page) {
      setPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Filter companies locally (you might want to move this to API side for better performance)
  const filteredCompanies = companies.filter(company => {
    // Search filter
    const matchesSearch = 
      company.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.organization_code?.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Status filter
    const matchesStatus = filters.status === 'all' || company.status === filters.status;
    
    // Plan filter - Note: plan might not be in the API response yet
    const matchesPlan = filters.plan === 'all' || 
                       (company.plan && company.plan.toLowerCase() === filters.plan.toLowerCase());
    
    return matchesSearch && matchesStatus && matchesPlan;
  });

  // Calculate stats from actual data
  const stats = {
    total: pagination.total || companies.length,
    active: companies.filter(c => c.status === 'active').length,
    suspended: companies.filter(c => c.status === 'suspended').length,
    inactive: companies.filter(c => c.status === 'inactive').length,
    totalRevenue: 0, // You'll need to calculate this from actual data if available
    totalUsers: 0 // You'll need to calculate this from actual data if available
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Header */}
      <header className="bg-white border-b border-[#E2E8F0] sticky top-0 z-10">
        <div className="px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-[#0F172A]">Company Management</h1>
              <p className="text-sm text-[#64748B] mt-1">
                Manage all companies in your SaaS platform
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="px-4 py-2 border border-[#CBD5E1] rounded-lg text-sm font-medium text-[#334155] hover:bg-[#F8FAFC] transition-colors flex items-center space-x-2"
              >
                <Filter className="w-4 h-4" />
                <span>Filters</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>
              
              <button
                onClick={() => fetchCompanies(page)}
                className="p-2 border border-[#CBD5E1] rounded-lg hover:bg-[#F8FAFC] transition-colors"
                disabled={loading}
              >
                <RefreshCw className={`w-4 h-4 text-[#64748B] ${loading ? 'animate-spin' : ''}`} />
              </button>
              
              <button
                onClick={() => window.location.href = '/admin/companies/create'}
                className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-2 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Company</span>
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mt-4 flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#64748B]" />
              <input
                type="text"
                placeholder="Search companies by name, email or code..."
                value={searchTerm}
                onChange={handleSearch}
                className="w-full pl-10 pr-4 py-2 border border-[#CBD5E1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]"
              />
            </div>
            
            {selectedCompanies.length > 0 && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-[#64748B]">
                  {selectedCompanies.length} selected
                </span>
                <button
                  onClick={() => handleBulkAction('activate')}
                  className="px-3 py-2 bg-[#22C55E] hover:bg-[#16A34A] text-white rounded-lg text-sm font-medium transition-colors"
                >
                  Activate
                </button>
                <button
                  onClick={() => handleBulkAction('suspend')}
                  className="px-3 py-2 bg-[#F59E0B] hover:bg-[#D97706] text-white rounded-lg text-sm font-medium transition-colors"
                >
                  Suspend
                </button>
                <button
                  onClick={() => handleBulkAction('export')}
                  className="px-3 py-2 border border-[#CBD5E1] rounded-lg text-sm font-medium text-[#334155] hover:bg-[#F8FAFC] transition-colors"
                >
                  Export
                </button>
              </div>
            )}
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

        {/* Stats Cards */}
        <CompanyStats stats={stats} />

        {/* Filters Panel */}
        {showFilters && (
          <CompanyFilters 
            filters={filters}
            setFilters={setFilters}
            onClose={() => setShowFilters(false)}
          />
        )}

        {/* Companies Table */}
        <CompanyTable 
          companies={filteredCompanies}
          loading={loading}
          onStatusChange={handleStatusChange}
          onImpersonate={handleImpersonate}
          selectedCompanies={selectedCompanies}
          setSelectedCompanies={setSelectedCompanies}
        />

        {/* Pagination */}
        {!loading && pagination.last_page > 1 && (
          <div className="mt-6 flex items-center justify-between bg-white px-4 py-3 rounded-lg border border-[#E2E8F0]">
            <div className="flex items-center text-sm text-[#64748B]">
              <span>
                Showing {pagination.from} to {pagination.to} of {pagination.total} companies
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(pagination.current_page - 1)}
                disabled={pagination.current_page === 1}
                className="p-2 border border-[#CBD5E1] rounded-lg hover:bg-[#F8FAFC] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4 text-[#64748B]" />
              </button>
              
              {pagination.links && pagination.links.map((link, index) => {
                if (link.label.includes('Previous') || link.label.includes('Next')) return null;
                
                const pageNum = parseInt(link.label);
                if (isNaN(pageNum)) return null;
                
                return (
                  <button
                    key={index}
                    onClick={() => handlePageChange(pageNum)}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                      link.active
                        ? 'bg-[#2563EB] text-white'
                        : 'text-[#64748B] hover:bg-[#F8FAFC]'
                    }`}
                  >
                    {link.label}
                  </button>
                );
              })}
              
              <button
                onClick={() => handlePageChange(pagination.current_page + 1)}
                disabled={pagination.current_page === pagination.last_page}
                className="p-2 border border-[#CBD5E1] rounded-lg hover:bg-[#F8FAFC] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4 text-[#64748B]" />
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Impersonation Modal */}
      <ImpersonateModal
        company={impersonateCompany}
        isOpen={!!impersonateCompany}
        onClose={() => setImpersonateCompany(null)}
        onConfirm={confirmImpersonate}
      />
    </div>
  );
};

export default CompaniesPage;