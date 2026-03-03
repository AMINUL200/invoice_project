// pages/sales/HandleQuotations.jsx
import React, { useState, useEffect, useCallback } from 'react';
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  X,
  Save,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Eye,
  FileText,
  Calendar,
  DollarSign,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  Download,
  Send,
  Printer,
  Copy,
  Users,
  Building2,
  Mail,
  Phone,
  MapPin
} from 'lucide-react';
import { format } from 'date-fns';
import { api } from '../../../utils/app';

const HandleQuotations = () => {
  const [quotations, setQuotations] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingQuotation, setEditingQuotation] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [apiSuccess, setApiSuccess] = useState(null);
  
  // Customer search states
  const [customerSearch, setCustomerSearch] = useState('');
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    total: 0,
    per_page: 15,
    from: 0,
    to: 0
  });

  // Per page options
  const perPageOptions = [10, 15, 25, 50, 100];

  const [formData, setFormData] = useState({
    customer_id: '',
    quotation_no: '',
    quotation_date: new Date().toISOString().split('T')[0],
    valid_till: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 days from now
    subtotal: '',
    tax_amount: '',
    total_amount: '',
    status: 'draft'
  });
  const [formErrors, setFormErrors] = useState({});

  // Fetch customers list
  const fetchCustomers = useCallback(async () => {
    try {
      const response = await api.get('/org/customers/all');
      if (response.data && response.data) {
        setCustomers(response.data.data);
        setFilteredCustomers(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  }, []);

  // Fetch quotations with pagination
  const fetchQuotations = useCallback(async (page = 1, perPage = pagination.per_page) => {
    setLoading(true);
    setApiError(null);
    
    try {
      const response = await api.get(`/org/quotations?page=${page}&per_page=${perPage}`);
      
      if (response.data && response.data.data) {
        setQuotations(response.data.data.data);
        setPagination({
          current_page: response.data.data.current_page,
          last_page: response.data.data.last_page,
          total: response.data.data.total,
          per_page: response.data.data.per_page,
          from: response.data.data.from,
          to: response.data.data.to
        });
      }
    } catch (error) {
      console.error('Error fetching quotations:', error);
      setApiError(error.message || 'Failed to fetch quotations');
    } finally {
      setLoading(false);
    }
  }, [pagination.per_page]);

  // Initial fetch
  useEffect(() => {
    fetchCustomers();
    fetchQuotations(1, pagination.per_page);
  }, [fetchCustomers, fetchQuotations, pagination.per_page]);

  // Handle customer search
  useEffect(() => {
    if (customerSearch.trim() === '') {
      setFilteredCustomers(customers);
    } else {
      const filtered = customers.filter(customer =>
        customer.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
        customer.email.toLowerCase().includes(customerSearch.toLowerCase()) ||
        customer.phone.includes(customerSearch) ||
        (customer.gstin && customer.gstin.toLowerCase().includes(customerSearch.toLowerCase()))
      );
      setFilteredCustomers(filtered);
    }
  }, [customerSearch, customers]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Auto-calculate total if subtotal and tax are entered
    if (name === 'subtotal' || name === 'tax_amount') {
      const subtotal = parseFloat(name === 'subtotal' ? value : formData.subtotal) || 0;
      const tax = parseFloat(name === 'tax_amount' ? value : formData.tax_amount) || 0;
      const total = subtotal + tax;
      setFormData(prev => ({
        ...prev,
        total_amount: total.toFixed(2)
      }));
    }

    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleCustomerSelect = (customer) => {
    setSelectedCustomer(customer);
    setFormData(prev => ({
      ...prev,
      customer_id: customer.id
    }));
    setCustomerSearch(customer.name);
    setShowCustomerDropdown(false);
    
    // Clear customer error if exists
    if (formErrors.customer_id) {
      setFormErrors(prev => ({
        ...prev,
        customer_id: ''
      }));
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.customer_id) {
      errors.customer_id = 'Please select a customer';
    }

    if (!formData.quotation_no?.trim()) {
      errors.quotation_no = 'Quotation number is required';
    }

    if (!formData.quotation_date) {
      errors.quotation_date = 'Quotation date is required';
    }

    if (!formData.valid_till) {
      errors.valid_till = 'Valid till date is required';
    } else if (new Date(formData.valid_till) < new Date(formData.quotation_date)) {
      errors.valid_till = 'Valid till date must be after quotation date';
    }

    if (!formData.subtotal || parseFloat(formData.subtotal) <= 0) {
      errors.subtotal = 'Subtotal must be greater than 0';
    }

    if (!formData.tax_amount || parseFloat(formData.tax_amount) < 0) {
      errors.tax_amount = 'Tax amount must be 0 or greater';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const generateQuotationNumber = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `QT-${year}-${month}-${random}`;
  };

  const handleAddQuotation = () => {
    setEditingQuotation(null);
    setSelectedCustomer(null);
    setCustomerSearch('');
    setFormData({
      customer_id: '',
      quotation_no: generateQuotationNumber(),
      quotation_date: new Date().toISOString().split('T')[0],
      valid_till: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      subtotal: '',
      tax_amount: '',
      total_amount: '',
      status: 'draft'
    });
    setFormErrors({});
    setApiError(null);
    setShowModal(true);
  };

  const handleEditQuotation = (quotation) => {
    setEditingQuotation(quotation);
    setSelectedCustomer(quotation.customer);
    setCustomerSearch(quotation.customer.name);
    setFormData({
      customer_id: quotation.customer_id,
      quotation_no: quotation.quotation_no,
      quotation_date: quotation.quotation_date.split('T')[0],
      valid_till: quotation.valid_till.split('T')[0],
      subtotal: parseFloat(quotation.subtotal).toString(),
      tax_amount: parseFloat(quotation.tax_amount).toString(),
      total_amount: parseFloat(quotation.total_amount).toString(),
      status: quotation.status
    });
    setFormErrors({});
    setApiError(null);
    setShowModal(true);
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setModalLoading(true);
    setApiError(null);
    setApiSuccess(null);
    
    try {
      // Prepare data for API
      const quotationData = {
        customer_id: formData.customer_id,
        quotation_no: formData.quotation_no.trim(),
        quotation_date: formData.quotation_date,
        valid_till: formData.valid_till,
        subtotal: parseFloat(formData.subtotal),
        tax_amount: parseFloat(formData.tax_amount),
        total_amount: parseFloat(formData.total_amount) || (parseFloat(formData.subtotal) + parseFloat(formData.tax_amount)),
        status: formData.status
      };

      let response;
      if (editingQuotation) {
        // Update existing quotation
        response = await api.put(`/org/quotations/${editingQuotation.id}`, quotationData);
        setApiSuccess('Quotation updated successfully');
      } else {
        // Add new quotation
        response = await api.post('/org/quotations', quotationData);
        setApiSuccess('Quotation created successfully');
      }
      
      if (response.data) {
        // Refresh the list
        fetchQuotations(pagination.current_page, pagination.per_page);
        setShowModal(false);
      }
    } catch (error) {
      console.error('Error saving quotation:', error);
      
      // Handle validation errors from backend
      if (error.data?.errors) {
        const backendErrors = {};
        Object.keys(error.data.errors).forEach(key => {
          backendErrors[key] = error.data.errors[key][0];
        });
        setFormErrors(backendErrors);
      } else {
        setApiError(error.message || 'Failed to save quotation');
      }
    } finally {
      setModalLoading(false);
    }
  };

  const handleDeleteQuotation = async (quotationId) => {
    if (!window.confirm('Are you sure you want to delete this quotation?')) return;

    try {
      await api.delete(`/org/quotations/${quotationId}`);
      setApiSuccess('Quotation deleted successfully');
      fetchQuotations(pagination.current_page, pagination.per_page);
    } catch (error) {
      console.error('Error deleting quotation:', error);
      alert(error.message || 'Failed to delete quotation');
    }
  };

  const handleStatusChange = async (quotationId, newStatus) => {
    try {
      await api.patch(`/org/quotations/${quotationId}/status`, { status: newStatus });
      fetchQuotations(pagination.current_page, pagination.per_page);
      setApiSuccess(`Quotation status updated to ${newStatus}`);
    } catch (error) {
      console.error('Error updating status:', error);
      alert(error.message || 'Failed to update status');
    }
  };

  const handleDuplicate = (quotation) => {
    const newQuotation = {
      ...quotation,
      id: null,
      quotation_no: generateQuotationNumber(),
      status: 'draft'
    };
    setEditingQuotation(null);
    setSelectedCustomer(quotation.customer);
    setCustomerSearch(quotation.customer.name);
    setFormData({
      customer_id: quotation.customer_id,
      quotation_no: generateQuotationNumber(),
      quotation_date: new Date().toISOString().split('T')[0],
      valid_till: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      subtotal: parseFloat(quotation.subtotal).toString(),
      tax_amount: parseFloat(quotation.tax_amount).toString(),
      total_amount: parseFloat(quotation.total_amount).toString(),
      status: 'draft'
    });
    setFormErrors({});
    setApiError(null);
    setShowModal(true);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.last_page) {
      fetchQuotations(newPage, pagination.per_page);
    }
  };

  const handlePerPageChange = (e) => {
    const newPerPage = parseInt(e.target.value);
    setPagination(prev => ({ ...prev, per_page: newPerPage }));
    fetchQuotations(1, newPerPage);
  };

  const handleRefresh = () => {
    fetchCustomers();
    fetchQuotations(pagination.current_page, pagination.per_page);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'draft': { bg: 'bg-[#E2E8F0]', text: 'text-[#475569]', icon: Clock, label: 'Draft' },
      'sent': { bg: 'bg-[#DBEAFE]', text: 'text-[#1D4ED8]', icon: Send, label: 'Sent' },
      'accepted': { bg: 'bg-[#DCFCE7]', text: 'text-[#15803D]', icon: CheckCircle, label: 'Accepted' },
      'rejected': { bg: 'bg-[#FEE2E2]', text: 'text-[#B91C1C]', icon: XCircle, label: 'Rejected' },
      'expired': { bg: 'bg-[#FEF3C7]', text: 'text-[#B45309]', icon: AlertCircle, label: 'Expired' }
    };
    
    const config = statusConfig[status] || statusConfig.draft;
    const Icon = config.icon;
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full flex items-center w-fit gap-1 ${config.bg} ${config.text}`}>
        <Icon className="w-3 h-3" />
        {config.label}
      </span>
    );
  };

  const filteredQuotations = quotations.filter(q =>
    q.quotation_no.toLowerCase().includes(searchTerm.toLowerCase()) ||
    q.customer?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    q.customer?.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const isExpired = (validTill) => {
    return new Date(validTill) < new Date();
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Header */}
      <header className="bg-white border-b border-[#E2E8F0] sticky top-0 z-10">
        <div className="px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-[#0F172A]">Quotations</h1>
              <p className="text-sm text-[#64748B] mt-1">
                Manage customer quotations and track their status
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={handleRefresh}
                className="p-2 border border-[#CBD5E1] rounded-lg hover:bg-[#F8FAFC] transition-colors"
                title="Refresh"
              >
                <RefreshCw className={`w-5 h-5 text-[#64748B] ${loading ? 'animate-spin' : ''}`} />
              </button>
              
              <button
                onClick={handleAddQuotation}
                className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-2 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Create Quotation</span>
              </button>
            </div>
          </div>

          {/* Search and Filter Bar */}
          <div className="mt-4 flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#64748B]" />
              <input
                type="text"
                placeholder="Search by quotation number or customer..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-[#CBD5E1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <select
                value={pagination.per_page}
                onChange={handlePerPageChange}
                className="px-3 py-2 border border-[#CBD5E1] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]"
              >
                {perPageOptions.map(option => (
                  <option key={option} value={option}>Show {option}</option>
                ))}
              </select>
              
              <button className="p-2 border border-[#CBD5E1] rounded-lg hover:bg-[#F8FAFC] transition-colors">
                <Filter className="w-5 h-5 text-[#64748B]" />
              </button>
            </div>
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

        {/* Error Display */}
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

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#64748B]">Total Quotations</p>
                <p className="text-2xl font-bold text-[#0F172A]">{pagination.total}</p>
              </div>
              <div className="p-3 bg-[#2563EB]/10 rounded-lg">
                <FileText className="w-5 h-5 text-[#2563EB]" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#64748B]">Total Amount</p>
                <p className="text-2xl font-bold text-[#0F172A]">
                  {formatCurrency(quotations.reduce((sum, q) => sum + parseFloat(q.total_amount), 0))}
                </p>
              </div>
              <div className="p-3 bg-[#F59E0B]/10 rounded-lg">
                <DollarSign className="w-5 h-5 text-[#F59E0B]" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#64748B]">Accepted</p>
                <p className="text-2xl font-bold text-[#22C55E]">
                  {quotations.filter(q => q.status === 'accepted').length}
                </p>
              </div>
              <div className="p-3 bg-[#22C55E]/10 rounded-lg">
                <CheckCircle className="w-5 h-5 text-[#22C55E]" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#64748B]">Draft</p>
                <p className="text-2xl font-bold text-[#64748B]">
                  {quotations.filter(q => q.status === 'draft').length}
                </p>
              </div>
              <div className="p-3 bg-[#E2E8F0] rounded-lg">
                <Clock className="w-5 h-5 text-[#64748B]" />
              </div>
            </div>
          </div>
        </div>

        {/* Quotations Table */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="w-10 h-10 border-4 border-[#2563EB] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-sm text-[#64748B]">Loading quotations...</p>
              </div>
            </div>
          ) : (
            <>
              <div className="max-w-[400px] md:max-w-[700px] lg:max-w-[1140px] overflow-x-auto">
                <table className="w-full min-w-[700px]">
                  <thead className="bg-[#F1F5F9]">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[#334155] uppercase tracking-wider">
                        Quotation #
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[#334155] uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[#334155] uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[#334155] uppercase tracking-wider">
                        Valid Till
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[#334155] uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[#334155] uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-[#334155] uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E2E8F0]">
                    {filteredQuotations.length > 0 ? (
                      filteredQuotations.map((quotation) => {
                        const expired = isExpired(quotation.valid_till) && quotation.status === 'sent';
                        
                        return (
                          <tr key={quotation.id} className="hover:bg-[#F8FAFC] transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <FileText className="w-5 h-5 text-[#2563EB] mr-2" />
                                <span className="text-sm font-medium text-[#0F172A]">{quotation.quotation_no}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div>
                                <p className="text-sm font-medium text-[#0F172A]">{quotation.customer?.name}</p>
                                <p className="text-xs text-[#64748B]">{quotation.customer?.email}</p>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center text-sm text-[#334155]">
                                <Calendar className="w-4 h-4 text-[#64748B] mr-2" />
                                {format(new Date(quotation.quotation_date), 'dd MMM yyyy')}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className={`flex items-center text-sm ${
                                expired ? 'text-[#EF4444]' : 'text-[#334155]'
                              }`}>
                                <Calendar className="w-4 h-4 text-[#64748B] mr-2" />
                                {format(new Date(quotation.valid_till), 'dd MMM yyyy')}
                                {expired && (
                                  <span className="ml-2 text-xs bg-[#FEE2E2] text-[#B91C1C] px-2 py-0.5 rounded-full">
                                    Expired
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <DollarSign className="w-4 h-4 text-[#64748B] mr-1" />
                                <span className="text-sm font-medium text-[#0F172A]">
                                  {formatCurrency(parseFloat(quotation.total_amount))}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {getStatusBadge(expired ? 'expired' : quotation.status)}
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex items-center justify-end space-x-2">
                              
                                <button
                                  onClick={() => handleEditQuotation(quotation)}
                                  className="p-1 hover:bg-[#F1F5F9] rounded-lg transition-colors"
                                  title="Edit"
                                >
                                  <Edit className="w-4 h-4 text-[#64748B]" />
                                </button>
                                <button
                                  onClick={() => handleDuplicate(quotation)}
                                  className="p-1 hover:bg-[#F1F5F9] rounded-lg transition-colors"
                                  title="Duplicate"
                                >
                                  <Copy className="w-4 h-4 text-[#64748B]" />
                                </button>
                                <button
                                  onClick={() => handleDeleteQuotation(quotation.id)}
                                  className="p-1 hover:bg-[#F1F5F9] rounded-lg transition-colors"
                                  title="Delete"
                                >
                                  <Trash2 className="w-4 h-4 text-[#EF4444]" />
                                </button>
                               
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="7" className="px-6 py-12 text-center">
                          <FileText className="w-12 h-12 text-[#64748B] mx-auto mb-4" />
                          <p className="text-[#0F172A] font-medium">No quotations found</p>
                          <p className="text-sm text-[#64748B] mt-1">
                            {searchTerm ? 'Try adjusting your search' : 'Create your first quotation to get started'}
                          </p>
                          {!searchTerm && (
                            <button
                              onClick={handleAddQuotation}
                              className="mt-4 px-4 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-lg text-sm font-medium inline-flex items-center space-x-2"
                            >
                              <Plus className="w-4 h-4" />
                              <span>Create Quotation</span>
                            </button>
                          )}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {quotations.length > 0 && (
                <div className="px-6 py-4 border-t border-[#E2E8F0] bg-[#F8FAFC] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="text-sm text-[#64748B]">
                    Showing <span className="font-medium">{pagination.from}</span> to{' '}
                    <span className="font-medium">{pagination.to}</span> of{' '}
                    <span className="font-medium">{pagination.total}</span> quotations
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handlePageChange(pagination.current_page - 1)}
                      disabled={pagination.current_page === 1}
                      className="p-2 border border-[#CBD5E1] rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4 text-[#64748B]" />
                    </button>
                    
                    <div className="flex items-center space-x-1">
                      {[...Array(Math.min(5, pagination.last_page))].map((_, i) => {
                        let pageNum;
                        if (pagination.last_page <= 5) {
                          pageNum = i + 1;
                        } else if (pagination.current_page <= 3) {
                          pageNum = i + 1;
                        } else if (pagination.current_page >= pagination.last_page - 2) {
                          pageNum = pagination.last_page - 4 + i;
                        } else {
                          pageNum = pagination.current_page - 2 + i;
                        }
                        
                        return (
                          <button
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                              pagination.current_page === pageNum
                                ? 'bg-[#2563EB] text-white'
                                : 'text-[#64748B] hover:bg-[#F1F5F9]'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                    </div>
                    
                    <button
                      onClick={() => handlePageChange(pagination.current_page + 1)}
                      disabled={pagination.current_page === pagination.last_page}
                      className="p-2 border border-[#CBD5E1] rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronRight className="w-4 h-4 text-[#64748B]" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* Add/Edit Quotation Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black/50" onClick={() => setShowModal(false)}></div>
          
          <div className="relative min-h-screen flex items-center justify-center p-4">
            <div className="relative bg-white rounded-xl shadow-2xl max-w-3xl w-full">
              {/* Modal Header */}
              <div className="px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between">
                <h3 className="text-lg font-semibold text-[#0F172A]">
                  {editingQuotation ? 'Edit Quotation' : 'Create New Quotation'}
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-1 hover:bg-[#F1F5F9] rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-[#64748B]" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 max-h-[70vh] overflow-y-auto">
                <div className="space-y-4">
                  {/* Form Error Display */}
                  {apiError && (
                    <div className="bg-[#FEE2E2] border border-[#EF4444]/20 rounded-lg p-3 mb-4">
                      <p className="text-sm text-[#B91C1C]">{apiError}</p>
                    </div>
                  )}

                  {/* Customer Selection with Search */}
                  <div className="relative">
                    <label className="block text-sm font-medium text-[#334155] mb-1">
                      Select Customer <span className="text-[#EF4444]">*</span>
                    </label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
                      <input
                        type="text"
                        value={customerSearch}
                        onChange={(e) => {
                          setCustomerSearch(e.target.value);
                          setShowCustomerDropdown(true);
                          if (selectedCustomer) setSelectedCustomer(null);
                        }}
                        onFocus={() => setShowCustomerDropdown(true)}
                        placeholder="Search customer by name, email or phone..."
                        className={`w-full pl-10 pr-4 py-2 border ${
                          formErrors.customer_id ? 'border-[#EF4444]' : 'border-[#CBD5E1]'
                        } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]`}
                      />
                    </div>

                    {/* Customer Dropdown */}
                    {showCustomerDropdown && customerSearch.length > 0 && (
                      <div className="absolute z-20 w-full mt-1 bg-white border border-[#E2E8F0] rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        {filteredCustomers.length > 0 ? (
                          filteredCustomers.map((customer) => (
                            <button
                              key={customer.id}
                              type="button"
                              onClick={() => handleCustomerSelect(customer)}
                              className="w-full px-4 py-3 text-left hover:bg-[#F8FAFC] transition-colors border-b border-[#E2E8F0] last:border-0"
                            >
                              <div className="flex items-start space-x-3">
                                <div className="flex-shrink-0">
                                  <Users className="w-5 h-5 text-[#2563EB]" />
                                </div>
                                <div className="flex-1">
                                  <p className="text-sm font-medium text-[#0F172A]">{customer.name}</p>
                                  <div className="flex items-center space-x-3 mt-1">
                                    <span className="text-xs text-[#64748B] flex items-center">
                                      <Mail className="w-3 h-3 mr-1" /> {customer.email}
                                    </span>
                                    <span className="text-xs text-[#64748B] flex items-center">
                                      <Phone className="w-3 h-3 mr-1" /> {customer.phone}
                                    </span>
                                  </div>
                                  {customer.gstin && (
                                    <p className="text-xs text-[#64748B] mt-1">
                                      GST: {customer.gstin}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </button>
                          ))
                        ) : (
                          <div className="px-4 py-3 text-sm text-[#64748B]">
                            No customers found
                          </div>
                        )}
                      </div>
                    )}

                    {formErrors.customer_id && (
                      <p className="text-xs text-[#EF4444] mt-1">{formErrors.customer_id}</p>
                    )}
                  </div>

                  {/* Selected Customer Info */}
                  {selectedCustomer && (
                    <div className="bg-[#F8FAFC] rounded-lg p-4 border border-[#E2E8F0]">
                      <h4 className="text-sm font-medium text-[#0F172A] mb-2">Selected Customer Details</h4>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <p className="text-xs text-[#64748B]">Name</p>
                          <p className="text-sm font-medium text-[#0F172A]">{selectedCustomer.name}</p>
                        </div>
                        <div>
                          <p className="text-xs text-[#64748B]">Email</p>
                          <p className="text-sm text-[#0F172A]">{selectedCustomer.email}</p>
                        </div>
                        <div>
                          <p className="text-xs text-[#64748B]">Phone</p>
                          <p className="text-sm text-[#0F172A]">{selectedCustomer.phone}</p>
                        </div>
                        {selectedCustomer.gstin && (
                          <div>
                            <p className="text-xs text-[#64748B]">GSTIN</p>
                            <p className="text-sm font-mono text-[#0F172A]">{selectedCustomer.gstin}</p>
                          </div>
                        )}
                        <div className="col-span-2">
                          <p className="text-xs text-[#64748B]">Billing Address</p>
                          <p className="text-sm text-[#0F172A]">{selectedCustomer.billing_address}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Quotation Details */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[#334155] mb-1">
                        Quotation Number <span className="text-[#EF4444]">*</span>
                      </label>
                      <input
                        type="text"
                        name="quotation_no"
                        value={formData.quotation_no}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2 border ${
                          formErrors.quotation_no ? 'border-[#EF4444]' : 'border-[#CBD5E1]'
                        } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]`}
                        placeholder="QT-2026-001"
                      />
                      {formErrors.quotation_no && (
                        <p className="text-xs text-[#EF4444] mt-1">{formErrors.quotation_no}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#334155] mb-1">
                        Status
                      </label>
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-[#CBD5E1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]"
                      >
                        <option value="draft">Draft</option>
                        <option value="sent">Sent</option>
                        <option value="accepted">Accepted</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[#334155] mb-1">
                        Quotation Date <span className="text-[#EF4444]">*</span>
                      </label>
                      <input
                        type="date"
                        name="quotation_date"
                        value={formData.quotation_date}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2 border ${
                          formErrors.quotation_date ? 'border-[#EF4444]' : 'border-[#CBD5E1]'
                        } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]`}
                      />
                      {formErrors.quotation_date && (
                        <p className="text-xs text-[#EF4444] mt-1">{formErrors.quotation_date}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#334155] mb-1">
                        Valid Till <span className="text-[#EF4444]">*</span>
                      </label>
                      <input
                        type="date"
                        name="valid_till"
                        value={formData.valid_till}
                        onChange={handleInputChange}
                        min={formData.quotation_date}
                        className={`w-full px-4 py-2 border ${
                          formErrors.valid_till ? 'border-[#EF4444]' : 'border-[#CBD5E1]'
                        } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]`}
                      />
                      {formErrors.valid_till && (
                        <p className="text-xs text-[#EF4444] mt-1">{formErrors.valid_till}</p>
                      )}
                    </div>
                  </div>

                  {/* Amount Details */}
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[#334155] mb-1">
                        Subtotal (₹) <span className="text-[#EF4444]">*</span>
                      </label>
                      <input
                        type="number"
                        name="subtotal"
                        value={formData.subtotal}
                        onChange={handleInputChange}
                        min="0"
                        step="0.01"
                        className={`w-full px-4 py-2 border ${
                          formErrors.subtotal ? 'border-[#EF4444]' : 'border-[#CBD5E1]'
                        } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]`}
                        placeholder="15000"
                      />
                      {formErrors.subtotal && (
                        <p className="text-xs text-[#EF4444] mt-1">{formErrors.subtotal}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#334155] mb-1">
                        Tax Amount (₹) <span className="text-[#EF4444]">*</span>
                      </label>
                      <input
                        type="number"
                        name="tax_amount"
                        value={formData.tax_amount}
                        onChange={handleInputChange}
                        min="0"
                        step="0.01"
                        className={`w-full px-4 py-2 border ${
                          formErrors.tax_amount ? 'border-[#EF4444]' : 'border-[#CBD5E1]'
                        } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]`}
                        placeholder="2700"
                      />
                      {formErrors.tax_amount && (
                        <p className="text-xs text-[#EF4444] mt-1">{formErrors.tax_amount}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#334155] mb-1">
                        Total Amount (₹)
                      </label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
                        <input
                          type="number"
                          name="total_amount"
                          value={formData.total_amount}
                          readOnly
                          className="w-full pl-10 pr-4 py-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg text-[#0F172A] cursor-not-allowed"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Info Note */}
                  <div className="bg-[#F8FAFC] rounded-lg p-3 border border-[#E2E8F0]">
                    <p className="text-xs text-[#64748B]">
                      <span className="font-medium text-[#334155]">Note:</span> The quotation will be sent to the customer's email address. Make sure all details are correct.
                    </p>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-4 bg-[#F8FAFC] border-t border-[#E2E8F0] flex justify-end space-x-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-[#CBD5E1] rounded-lg text-sm font-medium text-[#334155] hover:bg-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={modalLoading}
                  className="px-4 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 flex items-center space-x-2"
                >
                  {modalLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>{editingQuotation ? 'Update' : 'Create'} Quotation</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HandleQuotations;