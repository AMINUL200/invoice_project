// pages/sales/HandleProformaInvoices.jsx
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
  DollarSign,
  Calendar,
  Users,
  Building2,
  Mail,
  Phone,
  MapPin,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  Download,
  Send,
  Printer,
  Copy
} from 'lucide-react';
import { format } from 'date-fns';
import { api } from '../../../utils/app';

const HandleProformaInvoices = () => {
  const [proformas, setProformas] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingProforma, setEditingProforma] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [apiSuccess, setApiSuccess] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  
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
    pi_no: '',
    pi_date: new Date().toISOString().split('T')[0],
    valid_till: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 15 days validity
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
      if (response.data && response.data.data) {
        setCustomers(response.data.data);
        setFilteredCustomers(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  }, []);

  // Fetch proforma invoices with pagination
  const fetchProformas = useCallback(async (page = 1, perPage = pagination.per_page) => {
    setLoading(true);
    setApiError(null);
    
    try {
      const response = await api.get(`/org/proforma-invoices?page=${page}&per_page=${perPage}`);
      
      if (response.data && response.data.data) {
        setProformas(response.data.data.data);
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
      console.error('Error fetching proforma invoices:', error);
      setApiError(error.message || 'Failed to fetch proforma invoices');
    } finally {
      setLoading(false);
    }
  }, [pagination.per_page]);

  // Initial fetch
  useEffect(() => {
    fetchCustomers();
    fetchProformas(1, pagination.per_page);
  }, [fetchCustomers, fetchProformas, pagination.per_page]);

  // Handle select all
  useEffect(() => {
    if (selectAll) {
      setSelectedRows(proformas.map(p => p.id));
    } else {
      setSelectedRows([]);
    }
  }, [selectAll, proformas]);

  // Handle customer search
  useEffect(() => {
    if (customerSearch.trim() === '') {
      setFilteredCustomers(customers);
    } else {
      const filtered = customers.filter(customer =>
        customer.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
        customer.email.toLowerCase().includes(customerSearch.toLowerCase()) ||
        customer.phone.includes(customerSearch)
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

    if (!formData.pi_no?.trim()) {
      errors.pi_no = 'Proforma invoice number is required';
    }

    if (!formData.pi_date) {
      errors.pi_date = 'Proforma invoice date is required';
    }

    if (!formData.valid_till) {
      errors.valid_till = 'Valid till date is required';
    } else if (new Date(formData.valid_till) < new Date(formData.pi_date)) {
      errors.valid_till = 'Valid till date must be after invoice date';
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

  const generatePINumber = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `PI-${year}-${month}-${random}`;
  };

  const handleAddProforma = () => {
    setEditingProforma(null);
    setSelectedCustomer(null);
    setCustomerSearch('');
    setFormData({
      customer_id: '',
      pi_no: generatePINumber(),
      pi_date: new Date().toISOString().split('T')[0],
      valid_till: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      subtotal: '',
      tax_amount: '',
      total_amount: '',
      status: 'draft'
    });
    setFormErrors({});
    setApiError(null);
    setShowModal(true);
  };

  const handleEditProforma = (proforma) => {
    setEditingProforma(proforma);
    setSelectedCustomer(proforma.customer);
    setCustomerSearch(proforma.customer.name);
    setFormData({
      customer_id: proforma.customer_id,
      pi_no: proforma.pi_no,
      pi_date: proforma.pi_date.split('T')[0],
      valid_till: proforma.valid_till.split('T')[0],
      subtotal: parseFloat(proforma.subtotal).toString(),
      tax_amount: parseFloat(proforma.tax_amount).toString(),
      total_amount: parseFloat(proforma.total_amount).toString(),
      status: proforma.status
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
      const proformaData = {
        customer_id: formData.customer_id,
        pi_no: formData.pi_no.trim(),
        pi_date: formData.pi_date,
        valid_till: formData.valid_till,
        subtotal: parseFloat(formData.subtotal),
        tax_amount: parseFloat(formData.tax_amount),
        total_amount: parseFloat(formData.total_amount) || (parseFloat(formData.subtotal) + parseFloat(formData.tax_amount)),
        status: formData.status
      };

      let response;
      if (editingProforma) {
        // Update existing proforma
        response = await api.put(`/org/proforma-invoices/${editingProforma.id}`, proformaData);
        setApiSuccess('Proforma invoice updated successfully');
      } else {
        // Add new proforma
        response = await api.post('/org/proforma-invoices', proformaData);
        setApiSuccess('Proforma invoice created successfully');
      }
      
      if (response.data) {
        // Refresh the list
        fetchProformas(pagination.current_page, pagination.per_page);
        setShowModal(false);
      }
    } catch (error) {
      console.error('Error saving proforma invoice:', error);
      
      // Handle validation errors from backend
      if (error.data?.errors) {
        const backendErrors = {};
        Object.keys(error.data.errors).forEach(key => {
          backendErrors[key] = error.data.errors[key][0];
        });
        setFormErrors(backendErrors);
      } else {
        setApiError(error.message || 'Failed to save proforma invoice');
      }
    } finally {
      setModalLoading(false);
    }
  };

  const handleDeleteProforma = async (proformaId) => {
    if (!window.confirm('Are you sure you want to delete this proforma invoice?')) return;

    try {
      await api.delete(`/org/proforma-invoices/${proformaId}`);
      setApiSuccess('Proforma invoice deleted successfully');
      fetchProformas(pagination.current_page, pagination.per_page);
    } catch (error) {
      console.error('Error deleting proforma invoice:', error);
      alert(error.message || 'Failed to delete proforma invoice');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedRows.length === 0) return;
    
    if (!window.confirm(`Are you sure you want to delete ${selectedRows.length} proforma invoices?`)) return;

    try {
      await api.post('/org/proforma-invoices/bulk-delete', { ids: selectedRows });
      setApiSuccess(`${selectedRows.length} proforma invoices deleted successfully`);
      setSelectedRows([]);
      setSelectAll(false);
      fetchProformas(pagination.current_page, pagination.per_page);
    } catch (error) {
      console.error('Error deleting proforma invoices:', error);
      alert(error.message || 'Failed to delete proforma invoices');
    }
  };

  const handleStatusChange = async (proformaId, newStatus) => {
    try {
      await api.patch(`/org/proforma-invoices/${proformaId}/status`, { status: newStatus });
      fetchProformas(pagination.current_page, pagination.per_page);
      setApiSuccess(`Proforma invoice status updated to ${newStatus}`);
    } catch (error) {
      console.error('Error updating status:', error);
      alert(error.message || 'Failed to update status');
    }
  };

  const handleDuplicate = (proforma) => {
    setEditingProforma(null);
    setSelectedCustomer(proforma.customer);
    setCustomerSearch(proforma.customer.name);
    setFormData({
      customer_id: proforma.customer_id,
      pi_no: generatePINumber(),
      pi_date: new Date().toISOString().split('T')[0],
      valid_till: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      subtotal: parseFloat(proforma.subtotal).toString(),
      tax_amount: parseFloat(proforma.tax_amount).toString(),
      total_amount: parseFloat(proforma.total_amount).toString(),
      status: 'draft'
    });
    setFormErrors({});
    setApiError(null);
    setShowModal(true);
  };

  const handleConvertToInvoice = async (proformaId) => {
    try {
      await api.post(`/org/proforma-invoices/${proformaId}/convert`);
      setApiSuccess('Proforma invoice converted to invoice successfully');
      fetchProformas(pagination.current_page, pagination.per_page);
    } catch (error) {
      console.error('Error converting proforma invoice:', error);
      alert(error.message || 'Failed to convert proforma invoice');
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.last_page) {
      fetchProformas(newPage, pagination.per_page);
    }
  };

  const handlePerPageChange = (e) => {
    const newPerPage = parseInt(e.target.value);
    setPagination(prev => ({ ...prev, per_page: newPerPage }));
    fetchProformas(1, newPerPage);
  };

  const handleRefresh = () => {
    fetchCustomers();
    fetchProformas(pagination.current_page, pagination.per_page);
  };

  const handleRowSelect = (proformaId) => {
    setSelectedRows(prev => {
      if (prev.includes(proformaId)) {
        return prev.filter(id => id !== proformaId);
      } else {
        return [...prev, proformaId];
      }
    });
    setSelectAll(false);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'draft': { bg: 'bg-[#E2E8F0]', text: 'text-[#475569]', icon: Clock, label: 'Draft' },
      'sent': { bg: 'bg-[#DBEAFE]', text: 'text-[#1D4ED8]', icon: Send, label: 'Sent' },
      'accepted': { bg: 'bg-[#DCFCE7]', text: 'text-[#15803D]', icon: CheckCircle, label: 'Accepted' },
      'expired': { bg: 'bg-[#FEF3C7]', text: 'text-[#B45309]', icon: AlertCircle, label: 'Expired' },
      'cancelled': { bg: 'bg-[#FEE2E2]', text: 'text-[#B91C1C]', icon: XCircle, label: 'Cancelled' }
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

  const isExpired = (validTill, status) => {
    return status !== 'cancelled' && new Date(validTill) < new Date();
  };

  const filteredProformas = proformas.filter(p =>
    p.pi_no.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.customer?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.customer?.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Header */}
      <header className="bg-white border-b border-[#E2E8F0] sticky top-0 z-10">
        <div className="px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-[#0F172A]">Proforma Invoices</h1>
              <p className="text-sm text-[#64748B] mt-1">
                Create and manage proforma invoices for customers
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
                onClick={handleAddProforma}
                className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-2 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Create Proforma</span>
              </button>
            </div>
          </div>

          {/* Search and Filter Bar */}
          <div className="mt-4 flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#64748B]" />
              <input
                type="text"
                placeholder="Search by PI number or customer..."
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

          {/* Bulk Actions */}
          {selectedRows.length > 0 && (
            <div className="mt-4 flex items-center space-x-3 bg-[#F1F5F9] p-2 rounded-lg">
              <span className="text-sm text-[#334155]">
                {selectedRows.length} proforma{selectedRows.length > 1 ? 's' : ''} selected
              </span>
              <button
                onClick={handleBulkDelete}
                className="px-3 py-1 bg-[#EF4444] hover:bg-[#DC2626] text-white text-sm rounded-lg transition-colors"
              >
                Delete Selected
              </button>
              <button
                onClick={() => {
                  setSelectedRows([]);
                  setSelectAll(false);
                }}
                className="px-3 py-1 border border-[#CBD5E1] bg-white text-[#334155] text-sm rounded-lg hover:bg-[#F8FAFC] transition-colors"
              >
                Clear
              </button>
            </div>
          )}
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
                <p className="text-sm text-[#64748B]">Total Proformas</p>
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
                  {formatCurrency(proformas.reduce((sum, p) => sum + parseFloat(p.total_amount), 0))}
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
                <p className="text-sm text-[#64748B]">Sent</p>
                <p className="text-2xl font-bold text-[#1D4ED8]">
                  {proformas.filter(p => p.status === 'sent').length}
                </p>
              </div>
              <div className="p-3 bg-[#DBEAFE] rounded-lg">
                <Send className="w-5 h-5 text-[#1D4ED8]" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#64748B]">Draft</p>
                <p className="text-2xl font-bold text-[#64748B]">
                  {proformas.filter(p => p.status === 'draft').length}
                </p>
              </div>
              <div className="p-3 bg-[#E2E8F0] rounded-lg">
                <Clock className="w-5 h-5 text-[#64748B]" />
              </div>
            </div>
          </div>
        </div>

        {/* Proformas Table */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="w-10 h-10 border-4 border-[#2563EB] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-sm text-[#64748B]">Loading proforma invoices...</p>
              </div>
            </div>
          ) : (
            <>
            <div className="max-w-[400px] md:max-w-[700px] lg:max-w-[1140px] overflow-x-auto pb-8">
              <table className="w-full min-w-[700px]">
                  <thead className="bg-[#F1F5F9]">
                    <tr>
                      <th className="px-6 py-3 text-left">
                        <input
                          type="checkbox"
                          checked={selectAll}
                          onChange={(e) => setSelectAll(e.target.checked)}
                          className="w-4 h-4 text-[#2563EB] rounded border-[#CBD5E1] focus:ring-[#2563EB]"
                        />
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[#334155] uppercase tracking-wider">
                        PI Number
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
                    {filteredProformas.length > 0 ? (
                      filteredProformas.map((proforma) => {
                        const expired = isExpired(proforma.valid_till, proforma.status);
                        const displayStatus = expired ? 'expired' : proforma.status;
                        
                        return (
                          <tr key={proforma.id} className="hover:bg-[#F8FAFC] transition-colors">
                            <td className="px-6 py-4">
                              <input
                                type="checkbox"
                                checked={selectedRows.includes(proforma.id)}
                                onChange={() => handleRowSelect(proforma.id)}
                                className="w-4 h-4 text-[#2563EB] rounded border-[#CBD5E1] focus:ring-[#2563EB]"
                              />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <FileText className="w-5 h-5 text-[#2563EB] mr-2" />
                                <span className="text-sm font-medium text-[#0F172A]">{proforma.pi_no}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center space-x-2">
                                <div className="w-8 h-8 bg-[#2563EB]/10 rounded-lg flex items-center justify-center">
                                  <Users className="w-4 h-4 text-[#2563EB]" />
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-[#0F172A]">{proforma.customer?.name}</p>
                                  <p className="text-xs text-[#64748B]">{proforma.customer?.email}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center text-sm text-[#334155]">
                                <Calendar className="w-4 h-4 text-[#64748B] mr-2" />
                                {format(new Date(proforma.pi_date), 'dd MMM yyyy')}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className={`flex items-center text-sm ${expired ? 'text-[#EF4444]' : 'text-[#334155]'}`}>
                                <Calendar className="w-4 h-4 text-[#64748B] mr-2" />
                                {format(new Date(proforma.valid_till), 'dd MMM yyyy')}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="text-sm font-medium text-[#0F172A]">
                                {formatCurrency(parseFloat(proforma.total_amount))}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {getStatusBadge(displayStatus)}
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex items-center justify-end space-x-2">
                               
                                <button
                                  onClick={() => handleEditProforma(proforma)}
                                  className="p-1 hover:bg-[#F1F5F9] rounded-lg transition-colors"
                                  title="Edit"
                                >
                                  <Edit className="w-4 h-4 text-[#64748B]" />
                                </button>
                               
                               
                                <button
                                  onClick={() => handleDeleteProforma(proforma.id)}
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
                        <td colSpan="8" className="px-6 py-12 text-center">
                          <FileText className="w-12 h-12 text-[#64748B] mx-auto mb-4" />
                          <p className="text-[#0F172A] font-medium">No proforma invoices found</p>
                          <p className="text-sm text-[#64748B] mt-1">
                            {searchTerm ? 'Try adjusting your search' : 'Create your first proforma invoice to get started'}
                          </p>
                          {!searchTerm && (
                            <button
                              onClick={handleAddProforma}
                              className="mt-4 px-4 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-lg text-sm font-medium inline-flex items-center space-x-2"
                            >
                              <Plus className="w-4 h-4" />
                              <span>Create Proforma</span>
                            </button>
                          )}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {proformas.length > 0 && (
                <div className="px-6 py-4 border-t border-[#E2E8F0] bg-[#F8FAFC] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="text-sm text-[#64748B]">
                    Showing <span className="font-medium">{pagination.from}</span> to{' '}
                    <span className="font-medium">{pagination.to}</span> of{' '}
                    <span className="font-medium">{pagination.total}</span> proforma invoices
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

      {/* Add/Edit Proforma Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black/50" onClick={() => setShowModal(false)}></div>
          
          <div className="relative min-h-screen flex items-center justify-center p-4">
            <div className="relative bg-white rounded-xl shadow-2xl max-w-2xl w-full">
              {/* Modal Header */}
              <div className="px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between">
                <h3 className="text-lg font-semibold text-[#0F172A]">
                  {editingProforma ? 'Edit Proforma Invoice' : 'Create New Proforma Invoice'}
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
                    <div className="bg-[#FEE2E2] border border-[#EF4444]/20 rounded-lg p-3">
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

                  {/* Proforma Details */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[#334155] mb-1">
                        PI Number <span className="text-[#EF4444]">*</span>
                      </label>
                      <input
                        type="text"
                        name="pi_no"
                        value={formData.pi_no}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2 border ${
                          formErrors.pi_no ? 'border-[#EF4444]' : 'border-[#CBD5E1]'
                        } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]`}
                        placeholder="PI-2026-001"
                      />
                      {formErrors.pi_no && (
                        <p className="text-xs text-[#EF4444] mt-1">{formErrors.pi_no}</p>
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
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[#334155] mb-1">
                        PI Date <span className="text-[#EF4444]">*</span>
                      </label>
                      <input
                        type="date"
                        name="pi_date"
                        value={formData.pi_date}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2 border ${
                          formErrors.pi_date ? 'border-[#EF4444]' : 'border-[#CBD5E1]'
                        } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]`}
                      />
                      {formErrors.pi_date && (
                        <p className="text-xs text-[#EF4444] mt-1">{formErrors.pi_date}</p>
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
                        min={formData.pi_date}
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
                        placeholder="5000"
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
                        placeholder="900"
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
                      <span className="font-medium text-[#334155]">Note:</span> Proforma invoices are preliminary documents. They can be converted to actual invoices once approved by the customer.
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
                      <span>{editingProforma ? 'Update' : 'Create'} Proforma</span>
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

export default HandleProformaInvoices;