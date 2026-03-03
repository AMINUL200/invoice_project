// pages/admin/companies/[id].jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  Building2, 
  Mail, 
  Phone, 
  MapPin, 
  Globe,
  Calendar,
  Users,
  DollarSign,
  CreditCard,
  Activity,
  Edit,
  Trash2,
  Download,
  Mail as MailIcon,
  AlertCircle,
  CheckCircle,
  Clock,
  Copy,
  FileText,
  Hash
} from 'lucide-react';
import { api } from '../../../utils/app';

const CompanyDetailsPage = () => {
  const { id } = useParams(); // Get company ID from URL
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [copySuccess, setCopySuccess] = useState(null);

  useEffect(() => {
    if (id) {
      fetchCompanyDetails();
    }
  }, [id]);

  const fetchCompanyDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/super/organizations/${id}`);
      
      // Extract data from the response structure
      const companyData = response.data.data || response.data;
      
      setCompany(companyData);
    } catch (error) {
      console.error('Error fetching company details:', error);
      setError(error.message || 'Failed to fetch company details');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopySuccess(field);
    setTimeout(() => setCopySuccess(null), 2000);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusConfig = (status) => {
    const config = {
      active: {
        icon: CheckCircle,
        color: 'bg-[#DCFCE7] text-[#15803D]',
        label: 'Active'
      },
      suspended: {
        icon: AlertCircle,
        color: 'bg-[#FEF3C7] text-[#B45309]',
        label: 'Suspended'
      },
      inactive: {
        icon: Clock,
        color: 'bg-[#E2E8F0] text-[#475569]',
        label: 'Inactive'
      }
    };
    return config[status] || config.inactive;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#2563EB] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#64748B]">Loading company details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <p className="text-[#0F172A] font-medium text-lg mb-2">Error Loading Company</p>
          <p className="text-[#64748B] mb-4">{error}</p>
          <button
            onClick={() => window.location.href = '/admin/companies'}
            className="px-4 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-lg text-sm font-medium"
          >
            Go Back to Companies
          </button>
        </div>
      </div>
    );
  }

  if (!company) return null;

  const StatusIcon = getStatusConfig(company.status).icon;
  const statusColor = getStatusConfig(company.status).color;

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Header */}
      <header className="bg-white border-b border-[#E2E8F0] sticky top-0 z-10">
        <div className="px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => window.location.href = '/admin/companies'}
                className="p-2 hover:bg-[#F1F5F9] rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-[#64748B]" />
              </button>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold text-[#0F172A]">{company.company_name}</h1>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full flex items-center gap-1 ${statusColor}`}>
                    <StatusIcon className="w-3 h-3" />
                    {getStatusConfig(company.status).label}
                  </span>
                </div>
                <p className="text-sm text-[#64748B] mt-1">
                  Organization Code: {company.organization_code} • Created {formatDate(company.created_at)}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={() => window.location.href = `/admin/companies/${company.id}/edit`}
                className="px-4 py-2 border border-[#CBD5E1] rounded-lg text-sm font-medium text-[#334155] hover:bg-[#F8FAFC] transition-colors flex items-center space-x-2"
              >
                <Edit className="w-4 h-4" />
                <span>Edit</span>
              </button>
              <button
                onClick={() => window.location.href = `mailto:${company.email}`}
                className="px-4 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-lg text-sm font-medium transition-colors flex items-center space-x-2"
              >
                <MailIcon className="w-4 h-4" />
                <span>Contact</span>
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex space-x-6 mt-4">
            {['overview', 'invoices', 'activity'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-2 text-sm font-medium capitalize transition-colors relative ${
                  activeTab === tab
                    ? 'text-[#2563EB] border-b-2 border-[#2563EB]'
                    : 'text-[#64748B] hover:text-[#334155]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-8">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Company Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Info Card */}
              <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm p-6">
                <h3 className="text-lg font-semibold text-[#0F172A] mb-4">Company Information</h3>
                
                <div className="space-y-4">
                  {/* Organization Code */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      <Hash className="w-5 h-5 text-[#64748B] mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-mono bg-[#F1F5F9] px-2 py-1 rounded inline-block">
                          {company.organization_code}
                        </p>
                        <p className="text-xs text-[#64748B] mt-1">Organization Code</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleCopy(company.organization_code, 'code')}
                      className="p-1 hover:bg-[#F1F5F9] rounded transition-colors"
                      title="Copy code"
                    >
                      <Copy className="w-4 h-4 text-[#64748B]" />
                    </button>
                    {copySuccess === 'code' && (
                      <span className="text-xs text-[#22C55E] ml-2">Copied!</span>
                    )}
                  </div>

                  {/* Company Name */}
                  <div className="flex items-start space-x-3">
                    <Building2 className="w-5 h-5 text-[#64748B] mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-[#0F172A]">{company.company_name}</p>
                      <p className="text-xs text-[#64748B]">Company Name</p>
                    </div>
                  </div>

                  {/* Legal Name */}
                  {company.legal_name && (
                    <div className="flex items-start space-x-3">
                      <Building2 className="w-5 h-5 text-[#64748B] mt-0.5" />
                      <div>
                        <p className="text-sm text-[#0F172A]">{company.legal_name}</p>
                        <p className="text-xs text-[#64748B]">Legal Name</p>
                      </div>
                    </div>
                  )}
                  
                  {/* Email */}
                  <div className="flex items-start space-x-3">
                    <Mail className="w-5 h-5 text-[#64748B] mt-0.5" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm text-[#0F172A]">{company.email}</p>
                        <button
                          onClick={() => handleCopy(company.email, 'email')}
                          className="p-1 hover:bg-[#F1F5F9] rounded transition-colors"
                          title="Copy email"
                        >
                          <Copy className="w-3 h-3 text-[#64748B]" />
                        </button>
                        {copySuccess === 'email' && (
                          <span className="text-xs text-[#22C55E]">Copied!</span>
                        )}
                      </div>
                      <p className="text-xs text-[#64748B]">Email</p>
                    </div>
                  </div>
                  
                  {/* Phone */}
                  <div className="flex items-start space-x-3">
                    <Phone className="w-5 h-5 text-[#64748B] mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm text-[#0F172A]">{company.phone || 'N/A'}</p>
                      <p className="text-xs text-[#64748B]">Phone</p>
                    </div>
                  </div>
                  
                  {/* GSTIN */}
                  <div className="flex items-start space-x-3">
                    <FileText className="w-5 h-5 text-[#64748B] mt-0.5" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm text-[#0F172A]">{company.gstin || 'N/A'}</p>
                        {company.gstin && (
                          <>
                            <button
                              onClick={() => handleCopy(company.gstin, 'gstin')}
                              className="p-1 hover:bg-[#F1F5F9] rounded transition-colors"
                              title="Copy GSTIN"
                            >
                              <Copy className="w-3 h-3 text-[#64748B]" />
                            </button>
                            {copySuccess === 'gstin' && (
                              <span className="text-xs text-[#22C55E]">Copied!</span>
                            )}
                          </>
                        )}
                      </div>
                      <p className="text-xs text-[#64748B]">GSTIN</p>
                    </div>
                  </div>
                  
                  {/* Address */}
                  <div className="flex items-start space-x-3">
                    <MapPin className="w-5 h-5 text-[#64748B] mt-0.5" />
                    <div>
                      <p className="text-sm text-[#0F172A]">{company.address || 'N/A'}</p>
                      <p className="text-xs text-[#64748B]">Address</p>
                    </div>
                  </div>
                  
                  {/* Created Date */}
                  <div className="flex items-start space-x-3">
                    <Calendar className="w-5 h-5 text-[#64748B] mt-0.5" />
                    <div>
                      <p className="text-sm text-[#0F172A]">{formatDateTime(company.created_at)}</p>
                      <p className="text-xs text-[#64748B]">Created Date</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Stats Card */}
              <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm p-6">
                <h3 className="text-lg font-semibold text-[#0F172A] mb-4">Quick Overview</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-[#F8FAFC] rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-[#2563EB]/10 rounded-lg">
                        <Building2 className="w-5 h-5 text-[#2563EB]" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[#0F172A]">Organization Code</p>
                        <p className="text-xs text-[#64748B]">Unique identifier</p>
                      </div>
                    </div>
                    <span className="text-sm font-mono bg-white px-2 py-1 rounded border border-[#E2E8F0]">
                      {company.organization_code}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-[#F8FAFC] rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-[#22C55E]/10 rounded-lg">
                        <Mail className="w-5 h-5 text-[#22C55E]" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[#0F172A]">Email</p>
                        <p className="text-xs text-[#64748B]">Primary contact</p>
                      </div>
                    </div>
                    <span className="text-sm text-[#0F172A] truncate max-w-[150px]">
                      {company.email}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-[#F8FAFC] rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-[#F59E0B]/10 rounded-lg">
                        <Phone className="w-5 h-5 text-[#F59E0B]" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[#0F172A]">Phone</p>
                        <p className="text-xs text-[#64748B]">Contact number</p>
                      </div>
                    </div>
                    <span className="text-sm text-[#0F172A]">{company.phone || 'N/A'}</span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-[#F8FAFC] rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-[#EF4444]/10 rounded-lg">
                        <FileText className="w-5 h-5 text-[#EF4444]" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[#0F172A]">GSTIN</p>
                        <p className="text-xs text-[#64748B]">Tax identifier</p>
                      </div>
                    </div>
                    <span className="text-sm text-[#0F172A]">{company.gstin || 'N/A'}</span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-[#E2E8F0]">
                  <button
                    onClick={() => window.location.href = `/admin/companies/${company.id}/edit`}
                    className="w-full px-4 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    Edit Company Details
                  </button>
                </div>
              </div>
            </div>

            {/* Address Card */}
            {company.address && (
              <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm p-6">
                <h3 className="text-lg font-semibold text-[#0F172A] mb-4">Address Details</h3>
                
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-[#F1F5F9] rounded-lg">
                    <MapPin className="w-6 h-6 text-[#2563EB]" />
                  </div>
                  <div>
                    <p className="text-[#0F172A] whitespace-pre-line">{company.address}</p>
                    <button
                      onClick={() => {
                        const address = encodeURIComponent(company.address);
                        window.open(`https://maps.google.com/?q=${address}`, '_blank');
                      }}
                      className="mt-2 text-sm text-[#2563EB] hover:underline flex items-center space-x-1"
                    >
                      <span>View on Google Maps</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Invoices Tab */}
        {activeTab === 'invoices' && (
          <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-[#0F172A]">Invoices</h3>
              <button
                onClick={() => window.location.href = `/admin/invoices?company=${company.id}`}
                className="text-sm text-[#2563EB] hover:underline"
              >
                View All Invoices
              </button>
            </div>
            
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-[#64748B] mx-auto mb-3" />
              <p className="text-[#0F172A] font-medium">Invoice feature coming soon</p>
              <p className="text-sm text-[#64748B] mt-1">
                You'll be able to view company invoices here
              </p>
            </div>
          </div>
        )}

        {/* Activity Tab */}
        {activeTab === 'activity' && (
          <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm p-6">
            <h3 className="text-lg font-semibold text-[#0F172A] mb-4">Activity Log</h3>
            
            <div className="text-center py-8">
              <Activity className="w-12 h-12 text-[#64748B] mx-auto mb-3" />
              <p className="text-[#0F172A] font-medium">Activity log coming soon</p>
              <p className="text-sm text-[#64748B] mt-1">
                Track all activities related to this company
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default CompanyDetailsPage;