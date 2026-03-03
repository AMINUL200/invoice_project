// pages/sales/DeliveryChallans.jsx
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
  FileText,
  Calendar,
  Users,
  MapPin,
  Phone,
  Mail,
  CheckCircle,
  AlertCircle,
  Download,
  Printer,
  Package,
  Clock
} from 'lucide-react';
import { format } from 'date-fns';
import { api } from '../../../utils/app';

const DeliveryChallans = () => {
  const [deliveryChallans, setDeliveryChallans] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingChallan, setEditingChallan] = useState(null);
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
    challan_no: '',
    challan_date: format(new Date(), 'yyyy-MM-dd'),
    status: 'open'
  });
  const [formErrors, setFormErrors] = useState({});

  // Status options
  const statusOptions = [
    { value: 'open', label: 'Open', color: 'bg-blue-100 text-blue-800' },
    // { value: 'dispatched', label: 'Dispatched', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'delivered', label: 'Delivered', color: 'bg-green-100 text-green-800' },
    // { value: 'cancelled', label: 'Cancelled', color: 'bg-red-100 text-red-800' }
  ];

  // Fetch customers list
  const fetchCustomers = useCallback(async () => {
    try {
      const response = await api.get('/org/customers/all');
      
      if (response.data && response.data) {
        const customersData = response.data.data;
        setCustomers(customersData);
        setFilteredCustomers(customersData);
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  }, []);

  // Fetch delivery challans with pagination
  const fetchDeliveryChallans = useCallback(async (page = 1, perPage = pagination.per_page) => {
    setLoading(true);
    setApiError(null);
    
    try {
      const response = await api.get(`/org/delivery-challans?page=${page}&per_page=${perPage}`);
      
      if (response.data && response.data.data) {
        setDeliveryChallans(response.data.data.data);
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
      console.error('Error fetching delivery challans:', error);
      setApiError(error.message || 'Failed to fetch delivery challans');
    } finally {
      setLoading(false);
    }
  }, [pagination.per_page]);

  // Initial fetch
  useEffect(() => {
    fetchCustomers();
    fetchDeliveryChallans(1, pagination.per_page);
  }, [fetchCustomers, fetchDeliveryChallans, pagination.per_page]);

  // Handle customer search
  useEffect(() => {
    if (customerSearch.trim() === '') {
      setFilteredCustomers(customers);
    } else {
      const filtered = customers.filter(customer =>
        customer.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
        customer.email?.toLowerCase().includes(customerSearch.toLowerCase()) ||
        customer.phone?.toLowerCase().includes(customerSearch.toLowerCase())
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
    setCustomerSearch(`${customer.name} ${customer.email ? `- ${customer.email}` : ''} ${customer.phone ? `(${customer.phone})` : ''}`);
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

    if (!formData.challan_no?.trim()) {
      errors.challan_no = 'Challan number is required';
    }

    if (!formData.challan_date) {
      errors.challan_date = 'Challan date is required';
    }

    if (!formData.status) {
      errors.status = 'Status is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const generateChallanNumber = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `DC-${year}-${month}-${random}`;
  };

  const handleAddChallan = () => {
    setEditingChallan(null);
    setSelectedCustomer(null);
    setCustomerSearch('');
    setFormData({
      customer_id: '',
      challan_no: generateChallanNumber(),
      challan_date: format(new Date(), 'yyyy-MM-dd'),
      status: 'open'
    });
    setFormErrors({});
    setApiError(null);
    setShowModal(true);
  };

  const handleEditChallan = (challan) => {
    setEditingChallan(challan);
    setSelectedCustomer(challan.customer);
    
    setCustomerSearch(`${challan.customer.name} ${challan.customer.email ? `- ${challan.customer.email}` : ''} ${challan.customer.phone ? `(${challan.customer.phone})` : ''}`);
    
    setFormData({
      customer_id: challan.customer_id,
      challan_no: challan.challan_no,
      challan_date: format(new Date(challan.challan_date), 'yyyy-MM-dd'),
      status: challan.status
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
      const challanData = {
        customer_id: formData.customer_id,
        challan_no: formData.challan_no.trim(),
        challan_date: formData.challan_date,
        status: formData.status
      };

      let response;
      if (editingChallan) {
        // Update existing challan
        response = await api.put(`/org/delivery-challans/${editingChallan.id}`, challanData);
        setApiSuccess('Delivery challan updated successfully');
      } else {
        // Add new challan
        response = await api.post('/org/delivery-challans', challanData);
        setApiSuccess('Delivery challan created successfully');
      }
      
      if (response.data) {
        // Refresh the list
        fetchDeliveryChallans(pagination.current_page, pagination.per_page);
        setShowModal(false);
      }
    } catch (error) {
      console.error('Error saving delivery challan:', error);
      
      // Handle validation errors from backend
      if (error.data?.errors) {
        const backendErrors = {};
        Object.keys(error.data.errors).forEach(key => {
          backendErrors[key] = error.data.errors[key][0];
        });
        setFormErrors(backendErrors);
      } else {
        setApiError(error.message || 'Failed to save delivery challan');
      }
    } finally {
      setModalLoading(false);
    }
  };

  const handleDeleteChallan = async (challanId) => {
    if (!window.confirm('Are you sure you want to delete this delivery challan?')) return;

    try {
      await api.delete(`/org/delivery-challans/${challanId}`);
      setApiSuccess('Delivery challan deleted successfully');
      fetchDeliveryChallans(pagination.current_page, pagination.per_page);
    } catch (error) {
      console.error('Error deleting delivery challan:', error);
      alert(error.message || 'Failed to delete delivery challan');
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.last_page) {
      fetchDeliveryChallans(newPage, pagination.per_page);
    }
  };

  const handlePerPageChange = (e) => {
    const newPerPage = parseInt(e.target.value);
    setPagination(prev => ({ ...prev, per_page: newPerPage }));
    fetchDeliveryChallans(1, newPerPage);
  };

  const handleRefresh = () => {
    fetchCustomers();
    fetchDeliveryChallans(pagination.current_page, pagination.per_page);
  };

  const handlePrint = (challan) => {
    window.open(`/company/delivery-challans/${challan.id}/print`, '_blank');
  };

  const handleDownload = (challan) => {
    window.open(`/company/delivery-challans/${challan.id}/download`, '_blank');
  };

  const getStatusBadge = (status) => {
    const statusOption = statusOptions.find(s => s.value === status) || statusOptions[0];
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusOption.color}`}>
        {statusOption.label}
      </span>
    );
  };

  const filteredChallans = deliveryChallans.filter(dc =>
    dc.challan_no.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dc.customer?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dc.customer?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dc.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Header */}
      <header className="bg-white border-b border-[#E2E8F0] sticky top-0 z-10">
        <div className="px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-[#0F172A]">Delivery Challans</h1>
              <p className="text-sm text-[#64748B] mt-1">
                Manage delivery challans for goods dispatched to customers
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
                onClick={handleAddChallan}
                className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-2 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Create Delivery Challan</span>
              </button>
            </div>
          </div>

          {/* Search and Filter Bar */}
          <div className="mt-4 flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#64748B]" />
              <input
                type="text"
                placeholder="Search by challan number, customer, status..."
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
                <p className="text-sm text-[#64748B]">Total Challans</p>
                <p className="text-2xl font-bold text-[#0F172A]">{pagination.total}</p>
              </div>
              <div className="p-3 bg-[#2563EB]/10 rounded-lg">
                <Package className="w-5 h-5 text-[#2563EB]" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#64748B]">Open</p>
                <p className="text-2xl font-bold text-[#0F172A]">
                  {deliveryChallans.filter(dc => dc.status === 'open').length}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Clock className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#64748B]">Dispatched</p>
                <p className="text-2xl font-bold text-[#0F172A]">
                  {deliveryChallans.filter(dc => dc.status === 'dispatched').length}
                </p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Package className="w-5 h-5 text-yellow-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#64748B]">Delivered</p>
                <p className="text-2xl font-bold text-[#0F172A]">
                  {deliveryChallans.filter(dc => dc.status === 'delivered').length}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Delivery Challans Table */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="w-10 h-10 border-4 border-[#2563EB] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-sm text-[#64748B]">Loading delivery challans...</p>
              </div>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[#F1F5F9]">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[#334155] uppercase tracking-wider">
                        Challan #
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[#334155] uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[#334155] uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[#334155] uppercase tracking-wider">
                        Contact
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
                    {filteredChallans.length > 0 ? (
                      filteredChallans.map((challan) => (
                        <tr key={challan.id} className="hover:bg-[#F8FAFC] transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <FileText className="w-5 h-5 text-[#2563EB] mr-2" />
                              <span className="text-sm font-medium text-[#0F172A]">{challan.challan_no}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center text-sm text-[#334155]">
                              <Calendar className="w-4 h-4 text-[#64748B] mr-2" />
                              {format(new Date(challan.challan_date), 'dd MMM yyyy')}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-2">
                              <div className="w-8 h-8 bg-[#2563EB]/10 rounded-lg flex items-center justify-center">
                                <Users className="w-4 h-4 text-[#2563EB]" />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-[#0F172A]">{challan.customer?.name}</p>
                                {challan.customer?.gstin && (
                                  <p className="text-xs text-[#64748B]">GST: {challan.customer.gstin}</p>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="space-y-1">
                              {challan.customer?.email && (
                                <div className="flex items-center text-xs text-[#64748B]">
                                  <Mail className="w-3 h-3 mr-1" />
                                  {challan.customer.email}
                                </div>
                              )}
                              {challan.customer?.phone && (
                                <div className="flex items-center text-xs text-[#64748B]">
                                  <Phone className="w-3 h-3 mr-1" />
                                  {challan.customer.phone}
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {getStatusBadge(challan.status)}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end space-x-2">
                              <button
                                onClick={() => handlePrint(challan)}
                                className="p-1 hover:bg-[#F1F5F9] rounded-lg transition-colors"
                                title="Print"
                              >
                                <Printer className="w-4 h-4 text-[#64748B]" />
                              </button>
                              <button
                                onClick={() => handleDownload(challan)}
                                className="p-1 hover:bg-[#F1F5F9] rounded-lg transition-colors"
                                title="Download PDF"
                              >
                                <Download className="w-4 h-4 text-[#64748B]" />
                              </button>
                              <button
                                onClick={() => handleEditChallan(challan)}
                                className="p-1 hover:bg-[#F1F5F9] rounded-lg transition-colors"
                                title="Edit"
                              >
                                <Edit className="w-4 h-4 text-[#64748B]" />
                              </button>
                              <button
                                onClick={() => handleDeleteChallan(challan.id)}
                                className="p-1 hover:bg-[#F1F5F9] rounded-lg transition-colors"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4 text-[#EF4444]" />
                              </button>
                              <button
                                className="p-1 hover:bg-[#F1F5F9] rounded-lg transition-colors"
                                title="More actions"
                              >
                                <MoreHorizontal className="w-4 h-4 text-[#64748B]" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="px-6 py-12 text-center">
                          <Package className="w-12 h-12 text-[#64748B] mx-auto mb-4" />
                          <p className="text-[#0F172A] font-medium">No delivery challans found</p>
                          <p className="text-sm text-[#64748B] mt-1">
                            {searchTerm ? 'Try adjusting your search' : 'Create your first delivery challan to get started'}
                          </p>
                          {!searchTerm && (
                            <button
                              onClick={handleAddChallan}
                              className="mt-4 px-4 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-lg text-sm font-medium inline-flex items-center space-x-2"
                            >
                              <Plus className="w-4 h-4" />
                              <span>Create Delivery Challan</span>
                            </button>
                          )}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {deliveryChallans.length > 0 && (
                <div className="px-6 py-4 border-t border-[#E2E8F0] bg-[#F8FAFC] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="text-sm text-[#64748B]">
                    Showing <span className="font-medium">{pagination.from}</span> to{' '}
                    <span className="font-medium">{pagination.to}</span> of{' '}
                    <span className="font-medium">{pagination.total}</span> delivery challans
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

      {/* Add/Edit Delivery Challan Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black/50" onClick={() => setShowModal(false)}></div>
          
          <div className="relative min-h-screen flex items-center justify-center p-4">
            <div className="relative bg-white rounded-xl shadow-2xl max-w-2xl w-full">
              {/* Modal Header */}
              <div className="px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between">
                <h3 className="text-lg font-semibold text-[#0F172A]">
                  {editingChallan ? 'Edit Delivery Challan' : 'Create New Delivery Challan'}
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
                      <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
                      <input
                        type="text"
                        value={customerSearch}
                        onChange={(e) => {
                          if (!editingChallan) {
                            setCustomerSearch(e.target.value);
                            setShowCustomerDropdown(true);
                            if (selectedCustomer) setSelectedCustomer(null);
                          }
                        }}
                        onFocus={() => {
                          if (!editingChallan) {
                            setShowCustomerDropdown(true);
                          }
                        }}
                        placeholder="Search by customer name, email or phone..."
                        readOnly={editingChallan}
                        className={`w-full pl-10 pr-4 py-2 border ${
                          formErrors.customer_id ? 'border-[#EF4444]' : 'border-[#CBD5E1]'
                        } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] ${
                          editingChallan ? 'bg-gray-100 cursor-not-allowed' : ''
                        }`}
                      />
                    </div>

                    {/* Customer Dropdown - Only show when not editing */}
                    {!editingChallan && showCustomerDropdown && customerSearch.length > 0 && (
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
                                  <div className="flex items-center justify-between">
                                    <p className="text-sm font-medium text-[#0F172A]">{customer.name}</p>
                                    <span className="text-xs text-[#64748B]">
                                      {customer.status === 'active' ? 'Active' : 'Inactive'}
                                    </span>
                                  </div>
                                  <div className="grid grid-cols-2 gap-2 mt-1">
                                    {customer.email && (
                                      <span className="text-xs text-[#64748B] flex items-center">
                                        <Mail className="w-3 h-3 mr-1" /> {customer.email}
                                      </span>
                                    )}
                                    {customer.phone && (
                                      <span className="text-xs text-[#64748B] flex items-center">
                                        <Phone className="w-3 h-3 mr-1" /> {customer.phone}
                                      </span>
                                    )}
                                  </div>
                                  {customer.billing_address && (
                                    <span className="text-xs text-[#64748B] flex items-center mt-1">
                                      <MapPin className="w-3 h-3 mr-1" /> {customer.billing_address}
                                    </span>
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

                    {editingChallan && (
                      <p className="text-xs text-[#64748B] mt-1">
                        <span className="font-medium">Note:</span> Customer cannot be changed after creation.
                      </p>
                    )}
                  </div>

                  {/* Selected Customer Info */}
                  {selectedCustomer && (
                    <div className="bg-[#F8FAFC] rounded-lg p-4 border border-[#E2E8F0]">
                      <h4 className="text-sm font-medium text-[#0F172A] mb-2">Selected Customer Details</h4>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <p className="text-xs text-[#64748B]">Customer Name</p>
                          <p className="text-sm font-medium text-[#0F172A]">{selectedCustomer.name}</p>
                        </div>
                        <div>
                          <p className="text-xs text-[#64748B]">Status</p>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            selectedCustomer.status === 'active' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {selectedCustomer.status === 'active' ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        {selectedCustomer.email && (
                          <div>
                            <p className="text-xs text-[#64748B]">Email</p>
                            <p className="text-sm text-[#0F172A]">{selectedCustomer.email}</p>
                          </div>
                        )}
                        {selectedCustomer.phone && (
                          <div>
                            <p className="text-xs text-[#64748B]">Phone</p>
                            <p className="text-sm text-[#0F172A]">{selectedCustomer.phone}</p>
                          </div>
                        )}
                        {selectedCustomer.gstin && (
                          <div>
                            <p className="text-xs text-[#64748B]">GSTIN</p>
                            <p className="text-sm text-[#0F172A]">{selectedCustomer.gstin}</p>
                          </div>
                        )}
                        {selectedCustomer.billing_address && (
                          <div className="col-span-2">
                            <p className="text-xs text-[#64748B]">Billing Address</p>
                            <p className="text-sm text-[#0F172A]">{selectedCustomer.billing_address}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Challan Details */}
                  <div>
                    <label className="block text-sm font-medium text-[#334155] mb-1">
                      Challan Number <span className="text-[#EF4444]">*</span>
                    </label>
                    <input
                      type="text"
                      name="challan_no"
                      value={formData.challan_no}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border ${
                        formErrors.challan_no ? 'border-[#EF4444]' : 'border-[#CBD5E1]'
                      } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]`}
                      placeholder="DC-2026-001"
                    />
                    {formErrors.challan_no && (
                      <p className="text-xs text-[#EF4444] mt-1">{formErrors.challan_no}</p>
                    )}
                  </div>

                  {/* Challan Date */}
                  <div>
                    <label className="block text-sm font-medium text-[#334155] mb-1">
                      Challan Date <span className="text-[#EF4444]">*</span>
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
                      <input
                        type="date"
                        name="challan_date"
                        value={formData.challan_date}
                        onChange={handleInputChange}
                        className={`w-full pl-10 pr-4 py-2 border ${
                          formErrors.challan_date ? 'border-[#EF4444]' : 'border-[#CBD5E1]'
                        } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]`}
                      />
                    </div>
                    {formErrors.challan_date && (
                      <p className="text-xs text-[#EF4444] mt-1">{formErrors.challan_date}</p>
                    )}
                  </div>

                  {/* Status */}
                  <div>
                    <label className="block text-sm font-medium text-[#334155] mb-1">
                      Status <span className="text-[#EF4444]">*</span>
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border ${
                        formErrors.status ? 'border-[#EF4444]' : 'border-[#CBD5E1]'
                      } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]`}
                    >
                      {statusOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    {formErrors.status && (
                      <p className="text-xs text-[#EF4444] mt-1">{formErrors.status}</p>
                    )}
                  </div>

                  {/* Info Note */}
                  <div className="bg-[#F8FAFC] rounded-lg p-3 border border-[#E2E8F0]">
                    <p className="text-xs text-[#64748B]">
                      <span className="font-medium text-[#334155]">Note:</span> Delivery challans are used to track goods dispatched to customers. You can add items to this challan after creation.
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
                      <span>{editingChallan ? 'Update' : 'Create'} Challan</span>
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

export default DeliveryChallans;