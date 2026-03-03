// pages/purchase/HandlePurchaseBills.jsx
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
  Calendar,
  DollarSign,
  Building2,
  Mail,
  Phone,
  MapPin,
  FileText,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  Download,
  Eye
} from 'lucide-react';
import { api } from '../../../utils/app';

const HandlePurchaseBills = () => {
  const [purchaseBills, setPurchaseBills] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingBill, setEditingBill] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [apiSuccess, setApiSuccess] = useState(null);
  
  // Vendor search states
  const [vendorSearch, setVendorSearch] = useState('');
  const [showVendorDropdown, setShowVendorDropdown] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [filteredVendors, setFilteredVendors] = useState([]);
  
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    total: 0,
    per_page: 15,
    from: 0,
    to: 0
  });

  const [formData, setFormData] = useState({
    vendor_id: '',
    bill_no: '',
    bill_date: new Date().toISOString().split('T')[0],
    subtotal: '',
    tax_amount: '',
    total_amount: '',
    status: 'unpaid'
  });
  const [formErrors, setFormErrors] = useState({});

  // Fetch vendors list
  const fetchVendors = useCallback(async () => {
    try {
      const response = await api.get('/org/vendors/all');
      if (response.data && response.data) {
        setVendors(response.data.data);
        setFilteredVendors(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching vendors:', error);
    }
  }, []);

  // Fetch purchase bills with pagination
  const fetchPurchaseBills = useCallback(async (page = 1) => {
    setLoading(true);
    setApiError(null);
    
    try {
      const response = await api.get(`/org/purchase-bills?page=${page}`);
      
      if (response.data && response.data.data) {
        setPurchaseBills(response.data.data.data);
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
      console.error('Error fetching purchase bills:', error);
      setApiError(error.message || 'Failed to fetch purchase bills');
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchVendors();
    fetchPurchaseBills(1);
  }, [fetchVendors, fetchPurchaseBills]);

  // Handle vendor search
  useEffect(() => {
    if (vendorSearch.trim() === '') {
      setFilteredVendors(vendors);
    } else {
      const filtered = vendors.filter(vendor =>
        vendor.name.toLowerCase().includes(vendorSearch.toLowerCase()) ||
        vendor.email.toLowerCase().includes(vendorSearch.toLowerCase()) ||
        vendor.phone.includes(vendorSearch)
      );
      setFilteredVendors(filtered);
    }
  }, [vendorSearch, vendors]);

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

  const handleVendorSelect = (vendor) => {
    setSelectedVendor(vendor);
    setFormData(prev => ({
      ...prev,
      vendor_id: vendor.id
    }));
    setVendorSearch(vendor.name);
    setShowVendorDropdown(false);
    
    // Clear vendor error if exists
    if (formErrors.vendor_id) {
      setFormErrors(prev => ({
        ...prev,
        vendor_id: ''
      }));
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.vendor_id) {
      errors.vendor_id = 'Please select a vendor';
    }

    if (!formData.bill_no?.trim()) {
      errors.bill_no = 'Bill number is required';
    }

    if (!formData.bill_date) {
      errors.bill_date = 'Bill date is required';
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

  const handleAddBill = () => {
    setEditingBill(null);
    setSelectedVendor(null);
    setVendorSearch('');
    setFormData({
      vendor_id: '',
      bill_no: generateBillNumber(),
      bill_date: new Date().toISOString().split('T')[0],
      subtotal: '',
      tax_amount: '',
      total_amount: '',
      status: 'unpaid'
    });
    setFormErrors({});
    setApiError(null);
    setShowModal(true);
  };

  const handleEditBill = (bill) => {
    setEditingBill(bill);
    setSelectedVendor(bill.vendor);
    setVendorSearch(bill.vendor.name);
    setFormData({
      vendor_id: bill.vendor_id,
      bill_no: bill.bill_no,
      bill_date: bill.bill_date.split('T')[0],
      subtotal: parseFloat(bill.subtotal).toString(),
      tax_amount: parseFloat(bill.tax_amount).toString(),
      total_amount: parseFloat(bill.total_amount).toString(),
      status: bill.status
    });
    setFormErrors({});
    setApiError(null);
    setShowModal(true);
  };

  const generateBillNumber = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `PB-${year}-${month}-${random}`;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setModalLoading(true);
    setApiError(null);
    setApiSuccess(null);
    
    try {
      // Prepare data for API
      const billData = {
        vendor_id: formData.vendor_id,
        bill_no: formData.bill_no.trim(),
        bill_date: formData.bill_date,
        subtotal: parseFloat(formData.subtotal),
        tax_amount: parseFloat(formData.tax_amount),
        total_amount: parseFloat(formData.total_amount) || (parseFloat(formData.subtotal) + parseFloat(formData.tax_amount)),
        status: formData.status || 'unpaid'
      };

      let response;
      if (editingBill) {
        // Update existing bill
        response = await api.put(`/org/purchase-bills/${editingBill.id}`, billData);
        setApiSuccess('Purchase bill updated successfully');
      } else {
        // Add new bill
        response = await api.post('/org/purchase-bills', billData);
        setApiSuccess('Purchase bill created successfully');
      }
      
      if (response.data) {
        // Refresh the list
        fetchPurchaseBills(pagination.current_page);
        setShowModal(false);
      }
    } catch (error) {
      console.error('Error saving purchase bill:', error);
      
      // Handle validation errors from backend
      if (error.data?.errors) {
        const backendErrors = {};
        Object.keys(error.data.errors).forEach(key => {
          backendErrors[key] = error.data.errors[key][0];
        });
        setFormErrors(backendErrors);
      } else {
        setApiError(error.message || 'Failed to save purchase bill');
      }
    } finally {
      setModalLoading(false);
    }
  };

  const handleDeleteBill = async (billId) => {
    if (!window.confirm('Are you sure you want to delete this purchase bill?')) return;

    try {
      await api.delete(`/org/purchase-bills/${billId}`);
      setApiSuccess('Purchase bill deleted successfully');
      fetchPurchaseBills(pagination.current_page);
    } catch (error) {
      console.error('Error deleting purchase bill:', error);
      alert(error.message || 'Failed to delete purchase bill');
    }
  };

  const handleStatusChange = async (billId, currentStatus) => {
    const newStatus = currentStatus === 'paid' ? 'unpaid' : 'paid';
    
    try {
      await api.patch(`/org/purchase-bills/${billId}/status`, { status: newStatus });
      fetchPurchaseBills(pagination.current_page);
      setApiSuccess(`Purchase bill marked as ${newStatus}`);
    } catch (error) {
      console.error('Error updating status:', error);
      alert(error.message || 'Failed to update status');
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.last_page) {
      fetchPurchaseBills(newPage);
    }
  };

  const handleRefresh = () => {
    fetchVendors();
    fetchPurchaseBills(pagination.current_page);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'paid': { 
        bg: 'bg-[#DCFCE7]', 
        text: 'text-[#15803D]', 
        icon: CheckCircle,
        label: 'Paid'
      },
      'unpaid': { 
        bg: 'bg-[#FEE2E2]', 
        text: 'text-[#B91C1C]', 
        icon: XCircle,
        label: 'Unpaid'
      }
    };
    
    const config = statusConfig[status] || statusConfig.unpaid;
    const Icon = config.icon;
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full flex items-center w-fit gap-1 ${config.bg} ${config.text}`}>
        <Icon className="w-3 h-3" />
        {config.label}
      </span>
    );
  };

  const filteredBills = purchaseBills.filter(bill =>
    bill.bill_no.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bill.vendor?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Header */}
      <header className="bg-white border-b border-[#E2E8F0] sticky top-0 z-10">
        <div className="px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-[#0F172A]">Purchase Bills</h1>
              <p className="text-sm text-[#64748B] mt-1">
                Manage vendor bills and track payments
              </p>
            </div>
            
            <button
              onClick={handleAddBill}
              className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-2 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Record Purchase Bill</span>
            </button>
          </div>

          {/* Search and Filter Bar */}
          <div className="mt-4 flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#64748B]" />
              <input
                type="text"
                placeholder="Search by bill number or vendor name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-[#CBD5E1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]"
              />
            </div>
            
            <button className="p-2 border border-[#CBD5E1] rounded-lg hover:bg-[#F8FAFC] transition-colors">
              <Filter className="w-5 h-5 text-[#64748B]" />
            </button>
            
            <button 
              onClick={handleRefresh}
              className="p-2 border border-[#CBD5E1] rounded-lg hover:bg-[#F8FAFC] transition-colors"
              title="Refresh"
            >
              <RefreshCw className="w-5 h-5 text-[#64748B]" />
            </button>
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
            <p className="text-sm text-[#64748B]">Total Bills</p>
            <p className="text-2xl font-bold text-[#0F172A]">{pagination.total}</p>
          </div>
          
          <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm p-4">
            <p className="text-sm text-[#64748B]">Total Amount</p>
            <p className="text-2xl font-bold text-[#0F172A]">
              ₹{purchaseBills.reduce((sum, bill) => sum + parseFloat(bill.total_amount), 0).toLocaleString()}
            </p>
          </div>
          
          <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm p-4">
            <p className="text-sm text-[#64748B]">Paid</p>
            <p className="text-2xl font-bold text-[#22C55E]">
              {purchaseBills.filter(b => b.status === 'paid').length}
            </p>
          </div>
          
          <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm p-4">
            <p className="text-sm text-[#64748B]">Unpaid</p>
            <p className="text-2xl font-bold text-[#EF4444]">
              {purchaseBills.filter(b => b.status === 'unpaid').length}
            </p>
          </div>
        </div>

        {/* Purchase Bills Table */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-4 border-[#2563EB] border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <>
              <div className="max-w-[400px] md:max-w-[700px] lg:max-w-[1140px] overflow-x-auto">
                <table className="w-full min-w-[700px]">
                  <thead className="bg-[#F1F5F9]">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[#334155] uppercase tracking-wider">
                        Bill Number
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[#334155] uppercase tracking-wider">
                        Vendor
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[#334155] uppercase tracking-wider">
                        Date
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
                    {filteredBills.length > 0 ? (
                      filteredBills.map((bill) => (
                        <tr key={bill.id} className="hover:bg-[#F8FAFC] transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <FileText className="w-5 h-5 text-[#2563EB] mr-2" />
                              <span className="text-sm font-medium text-[#0F172A]">{bill.bill_no}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div>
                              <p className="text-sm font-medium text-[#0F172A]">{bill.vendor?.name}</p>
                              <p className="text-xs text-[#64748B]">{bill.vendor?.email}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center text-sm text-[#334155]">
                              <Calendar className="w-4 h-4 text-[#64748B] mr-2" />
                              {new Date(bill.bill_date).toLocaleDateString()}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <DollarSign className="w-4 h-4 text-[#64748B] mr-1" />
                              <span className="text-sm font-medium text-[#0F172A]">
                                ₹{parseFloat(bill.total_amount).toLocaleString()}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button
                              onClick={() => handleStatusChange(bill.id, bill.status)}
                              className="cursor-pointer"
                              title={`Click to mark as ${bill.status === 'paid' ? 'unpaid' : 'paid'}`}
                            >
                              {getStatusBadge(bill.status)}
                            </button>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end space-x-2">
                              <button
                                onClick={() => handleEditBill(bill)}
                                className="p-1 hover:bg-[#F1F5F9] rounded-lg transition-colors"
                                title="Edit bill"
                              >
                                <Edit className="w-4 h-4 text-[#64748B]" />
                              </button>
                              <button
                                onClick={() => handleDeleteBill(bill.id)}
                                className="p-1 hover:bg-[#F1F5F9] rounded-lg transition-colors"
                                title="Delete bill"
                              >
                                <Trash2 className="w-4 h-4 text-[#EF4444]" />
                              </button>
                              {/* <button
                                className="p-1 hover:bg-[#F1F5F9] rounded-lg transition-colors"
                                title="More actions"
                              >
                                <MoreHorizontal className="w-4 h-4 text-[#64748B]" />
                              </button> */}
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="px-6 py-12 text-center">
                          <FileText className="w-12 h-12 text-[#64748B] mx-auto mb-4" />
                          <p className="text-[#0F172A] font-medium">No purchase bills found</p>
                          <p className="text-sm text-[#64748B] mt-1">
                            {searchTerm ? 'Try adjusting your search' : 'Record your first purchase bill to get started'}
                          </p>
                          {!searchTerm && (
                            <button
                              onClick={handleAddBill}
                              className="mt-4 px-4 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-lg text-sm font-medium inline-flex items-center space-x-2"
                            >
                              <Plus className="w-4 h-4" />
                              <span>Record Purchase Bill</span>
                            </button>
                          )}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {purchaseBills.length > 0 && (
                <div className="px-6 py-4 border-t border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-between">
                  <div className="text-sm text-[#64748B]">
                    Showing <span className="font-medium">{pagination.from}</span> to{' '}
                    <span className="font-medium">{pagination.to}</span> of{' '}
                    <span className="font-medium">{pagination.total}</span> purchase bills
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handlePageChange(pagination.current_page - 1)}
                      disabled={pagination.current_page === 1}
                      className="p-2 border border-[#CBD5E1] rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="w-4 h-4 text-[#64748B]" />
                    </button>
                    
                    {[...Array(pagination.last_page)].map((_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => handlePageChange(i + 1)}
                        className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                          pagination.current_page === i + 1
                            ? 'bg-[#2563EB] text-white'
                            : 'text-[#64748B] hover:bg-[#F1F5F9]'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                    
                    <button
                      onClick={() => handlePageChange(pagination.current_page + 1)}
                      disabled={pagination.current_page === pagination.last_page}
                      className="p-2 border border-[#CBD5E1] rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
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

      {/* Add/Edit Purchase Bill Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black/50" onClick={() => setShowModal(false)}></div>
          
          <div className="relative min-h-screen flex items-center justify-center p-4">
            <div className="relative bg-white rounded-xl shadow-2xl max-w-3xl w-full">
              {/* Modal Header */}
              <div className="px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between">
                <h3 className="text-lg font-semibold text-[#0F172A]">
                  {editingBill ? 'Edit Purchase Bill' : 'Record New Purchase Bill'}
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

                  {/* Vendor Selection with Search */}
                  <div className="relative">
                    <label className="block text-sm font-medium text-[#334155] mb-1">
                      Select Vendor <span className="text-[#EF4444]">*</span>
                    </label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
                      <input
                        type="text"
                        value={vendorSearch}
                        onChange={(e) => {
                          setVendorSearch(e.target.value);
                          setShowVendorDropdown(true);
                          if (selectedVendor) setSelectedVendor(null);
                        }}
                        onFocus={() => setShowVendorDropdown(true)}
                        placeholder="Search vendor by name, email or phone..."
                        className={`w-full pl-10 pr-4 py-2 border ${
                          formErrors.vendor_id ? 'border-[#EF4444]' : 'border-[#CBD5E1]'
                        } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]`}
                      />
                    </div>

                    {/* Vendor Dropdown */}
                    {showVendorDropdown && vendorSearch.length > 0 && (
                      <div className="absolute z-20 w-full mt-1 bg-white border border-[#E2E8F0] rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        {filteredVendors.length > 0 ? (
                          filteredVendors.map((vendor) => (
                            <button
                              key={vendor.id}
                              type="button"
                              onClick={() => handleVendorSelect(vendor)}
                              className="w-full px-4 py-3 text-left hover:bg-[#F8FAFC] transition-colors border-b border-[#E2E8F0] last:border-0"
                            >
                              <div className="flex items-start space-x-3">
                                <div className="flex-shrink-0">
                                  <Building2 className="w-5 h-5 text-[#2563EB]" />
                                </div>
                                <div className="flex-1">
                                  <p className="text-sm font-medium text-[#0F172A]">{vendor.name}</p>
                                  <div className="flex items-center space-x-3 mt-1">
                                    <span className="text-xs text-[#64748B] flex items-center">
                                      <Mail className="w-3 h-3 mr-1" /> {vendor.email}
                                    </span>
                                    <span className="text-xs text-[#64748B] flex items-center">
                                      <Phone className="w-3 h-3 mr-1" /> {vendor.phone}
                                    </span>
                                  </div>
                                  {vendor.gstin && (
                                    <p className="text-xs text-[#64748B] mt-1">
                                      GST: {vendor.gstin}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </button>
                          ))
                        ) : (
                          <div className="px-4 py-3 text-sm text-[#64748B]">
                            No vendors found
                          </div>
                        )}
                      </div>
                    )}

                    {formErrors.vendor_id && (
                      <p className="text-xs text-[#EF4444] mt-1">{formErrors.vendor_id}</p>
                    )}
                  </div>

                  {/* Selected Vendor Info */}
                  {selectedVendor && (
                    <div className="bg-[#F8FAFC] rounded-lg p-4 border border-[#E2E8F0]">
                      <h4 className="text-sm font-medium text-[#0F172A] mb-2">Selected Vendor Details</h4>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <p className="text-xs text-[#64748B]">Name</p>
                          <p className="text-sm font-medium text-[#0F172A]">{selectedVendor.name}</p>
                        </div>
                        <div>
                          <p className="text-xs text-[#64748B]">Email</p>
                          <p className="text-sm text-[#0F172A]">{selectedVendor.email}</p>
                        </div>
                        {/* <div>
                          <p className="text-xs text-[#64748B]">Phone</p>
                          <p className="text-sm text-[#0F172A]">{selectedVendor.phone}</p>
                        </div>
                        {selectedVendor.gstin && (
                          <div>
                            <p className="text-xs text-[#64748B]">GSTIN</p>
                            <p className="text-sm font-mono text-[#0F172A]">{selectedVendor.gstin}</p>
                          </div>
                        )} */}
                        <div className="col-span-2">
                          <p className="text-xs text-[#64748B]">Address</p>
                          <p className="text-sm text-[#0F172A]">{selectedVendor.address}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Bill Details */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[#334155] mb-1">
                        Bill Number <span className="text-[#EF4444]">*</span>
                      </label>
                      <input
                        type="text"
                        name="bill_no"
                        value={formData.bill_no}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2 border ${
                          formErrors.bill_no ? 'border-[#EF4444]' : 'border-[#CBD5E1]'
                        } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]`}
                        placeholder="PB-2026-001"
                      />
                      {formErrors.bill_no && (
                        <p className="text-xs text-[#EF4444] mt-1">{formErrors.bill_no}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#334155] mb-1">
                        Bill Date <span className="text-[#EF4444]">*</span>
                      </label>
                      <input
                        type="date"
                        name="bill_date"
                        value={formData.bill_date}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2 border ${
                          formErrors.bill_date ? 'border-[#EF4444]' : 'border-[#CBD5E1]'
                        } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]`}
                      />
                      {formErrors.bill_date && (
                        <p className="text-xs text-[#EF4444] mt-1">{formErrors.bill_date}</p>
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
                        placeholder="12000"
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
                        placeholder="2160"
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

                  {/* Status (for edit mode only) */}
                  {editingBill && (
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
                        <option value="unpaid">Unpaid</option>
                        <option value="paid">Paid</option>
                      </select>
                    </div>
                  )}
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
                      <span>{editingBill ? 'Update' : 'Save'} Bill</span>
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

export default HandlePurchaseBills;