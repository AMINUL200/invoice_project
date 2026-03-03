// pages/sales/HandleCustomer.jsx
import React, { useState, useEffect, useCallback } from "react";
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
  Users,
  Mail,
  Phone,
  MapPin,
  FileText,
  CheckCircle,
  XCircle,
  AlertCircle,
  Download,
  UserPlus,
} from "lucide-react";
import { api } from "../../../utils/app";

const HandleCustomer = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [apiSuccess, setApiSuccess] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  // Pagination states
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    total: 0,
    per_page: 15,
    from: 0,
    to: 0,
  });

  // Per page options
  const perPageOptions = [10, 15, 25, 50, 100];

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    gstin: "",
    billing_address: "",
  });
  const [formErrors, setFormErrors] = useState({});

  // Fetch customers with pagination
  const fetchCustomers = useCallback(
    async (page = 1, perPage = pagination.per_page) => {
      setLoading(true);
      setApiError(null);

      try {
        const response = await api.get(
          `/org/customers?page=${page}&per_page=${perPage}`,
        );

        if (response.data && response.data.data) {
          setCustomers(response.data.data.data);
          setPagination({
            current_page: response.data.data.current_page,
            last_page: response.data.data.last_page,
            total: response.data.data.total,
            per_page: response.data.data.per_page,
            from: response.data.data.from,
            to: response.data.data.to,
          });
        }
      } catch (error) {
        console.error("Error fetching customers:", error);
        setApiError(error.message || "Failed to fetch customers");
      } finally {
        setLoading(false);
      }
    },
    [pagination.per_page],
  );

  // Initial fetch
  useEffect(() => {
    fetchCustomers(1, pagination.per_page);
  }, [fetchCustomers, pagination.per_page]);

  // Handle select all
  useEffect(() => {
    if (selectAll) {
      setSelectedRows(customers.map((c) => c.id));
    } else {
      setSelectedRows([]);
    }
  }, [selectAll, customers]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.name?.trim()) {
      errors.name = "Customer name is required";
    }

    if (!formData.email?.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email is invalid";
    }

    if (!formData.phone?.trim()) {
      errors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ""))) {
      errors.phone = "Phone number must be 10 digits";
    }

    if (
      formData.gstin &&
      !/^\d{2}[A-Z]{5}\d{4}[A-Z]{1}\d[Z]{1}[A-Z\d]{1}$/.test(formData.gstin)
    ) {
      errors.gstin = "Invalid GSTIN format (e.g., 27AABCU9603R1Z1)";
    }

    if (!formData.billing_address?.trim()) {
      errors.billing_address = "Billing address is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddCustomer = () => {
    setEditingCustomer(null);
    setFormData({
      name: "",
      email: "",
      phone: "",
      gstin: "",
      billing_address: "",
    });
    setFormErrors({});
    setApiError(null);
    setShowModal(true);
  };

  const handleEditCustomer = (customer) => {
    setEditingCustomer(customer);
    setFormData({
      name: customer.name || "",
      email: customer.email || "",
      phone: customer.phone || "",
      gstin: customer.gstin || "",
      billing_address: customer.billing_address || "",
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
      const customerData = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.replace(/\D/g, ""),
        gstin: formData.gstin?.trim() || null,
        billing_address: formData.billing_address.trim(),
      };

      let response;
      if (editingCustomer) {
        // Update existing customer
        response = await api.put(
          `/org/customers/${editingCustomer.id}`,
          customerData,
        );
        setApiSuccess("Customer updated successfully");
      } else {
        // Add new customer
        response = await api.post("/org/customers", customerData);
        setApiSuccess("Customer created successfully");
      }

      if (response.data) {
        // Refresh the list
        fetchCustomers(pagination.current_page, pagination.per_page);
        setShowModal(false);
      }
    } catch (error) {
      console.error("Error saving customer:", error);

      // Handle validation errors from backend
      if (error.data?.errors) {
        const backendErrors = {};
        Object.keys(error.data.errors).forEach((key) => {
          backendErrors[key] = error.data.errors[key][0];
        });
        setFormErrors(backendErrors);
      } else {
        setApiError(error.message || "Failed to save customer");
      }
    } finally {
      setModalLoading(false);
    }
  };

  const handleDeleteCustomer = async (customerId) => {
    if (!window.confirm("Are you sure you want to delete this customer?"))
      return;

    try {
      await api.delete(`/org/customers/${customerId}`);
      setApiSuccess("Customer deleted successfully");
      fetchCustomers(pagination.current_page, pagination.per_page);
    } catch (error) {
      console.error("Error deleting customer:", error);
      alert(error.message || "Failed to delete customer");
    }
  };

  const handleBulkDelete = async () => {
    if (selectedRows.length === 0) return;

    if (
      !window.confirm(
        `Are you sure you want to delete ${selectedRows.length} customers?`,
      )
    )
      return;

    try {
      await api.post("/org/customers/bulk-delete", { ids: selectedRows });
      setApiSuccess(`${selectedRows.length} customers deleted successfully`);
      setSelectedRows([]);
      setSelectAll(false);
      fetchCustomers(pagination.current_page, pagination.per_page);
    } catch (error) {
      console.error("Error deleting customers:", error);
      alert(error.message || "Failed to delete customers");
    }
  };

  const handleStatusToggle = async (customerId, currentStatus) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";

    try {
      await api.patch(`/org/customers/${customerId}/status`, {
        status: newStatus,
      });
      fetchCustomers(pagination.current_page, pagination.per_page);
      setApiSuccess(`Customer marked as ${newStatus}`);
    } catch (error) {
      console.error("Error updating status:", error);
      alert(error.message || "Failed to update status");
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.last_page) {
      fetchCustomers(newPage, pagination.per_page);
    }
  };

  const handlePerPageChange = (e) => {
    const newPerPage = parseInt(e.target.value);
    setPagination((prev) => ({ ...prev, per_page: newPerPage }));
    fetchCustomers(1, newPerPage);
  };

  const handleRefresh = () => {
    fetchCustomers(pagination.current_page, pagination.per_page);
  };

  const handleExport = async () => {
    try {
      const response = await api.get("/org/customers/export", {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "customers.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error exporting customers:", error);
      alert("Failed to export customers");
    }
  };

  const handleRowSelect = (customerId) => {
    setSelectedRows((prev) => {
      if (prev.includes(customerId)) {
        return prev.filter((id) => id !== customerId);
      } else {
        return [...prev, customerId];
      }
    });
    setSelectAll(false);
  };

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone?.includes(searchTerm) ||
      customer.gstin?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const getStatusBadge = (status) => {
    return status === "active" ? (
      <span className="px-2 py-1 text-xs font-medium rounded-full flex items-center w-fit gap-1 bg-[#DCFCE7] text-[#15803D]">
        <CheckCircle className="w-3 h-3" />
        Active
      </span>
    ) : (
      <span className="px-2 py-1 text-xs font-medium rounded-full flex items-center w-fit gap-1 bg-[#FEE2E2] text-[#B91C1C]">
        <XCircle className="w-3 h-3" />
        Inactive
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Header */}
      <header className="bg-white border-b border-[#E2E8F0] sticky top-0 z-10">
        <div className="px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-[#0F172A]">
                Customer Management
              </h1>
              <p className="text-sm text-[#64748B] mt-1">
                Manage your customers and their information
              </p>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={handleExport}
                className="px-4 py-2 border border-[#CBD5E1] rounded-lg text-sm font-medium text-[#334155] hover:bg-[#F8FAFC] transition-colors flex items-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>

              <button
                onClick={handleAddCustomer}
                className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-2 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Customer</span>
              </button>
            </div>
          </div>

          {/* Search and Filter Bar */}
          <div className="mt-4 flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#64748B]" />
              <input
                type="text"
                placeholder="Search customers by name, email, phone or GSTIN..."
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
                {perPageOptions.map((option) => (
                  <option key={option} value={option}>
                    Show {option}
                  </option>
                ))}
              </select>

              <button className="p-2 border border-[#CBD5E1] rounded-lg hover:bg-[#F8FAFC] transition-colors">
                <Filter className="w-5 h-5 text-[#64748B]" />
              </button>

              <button
                onClick={handleRefresh}
                className="p-2 border border-[#CBD5E1] rounded-lg hover:bg-[#F8FAFC] transition-colors"
                title="Refresh"
              >
                <RefreshCw
                  className={`w-5 h-5 text-[#64748B] ${loading ? "animate-spin" : ""}`}
                />
              </button>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedRows.length > 0 && (
            <div className="mt-4 flex items-center space-x-3 bg-[#F1F5F9] p-2 rounded-lg">
              <span className="text-sm text-[#334155]">
                {selectedRows.length} customer
                {selectedRows.length > 1 ? "s" : ""} selected
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
                <p className="text-sm text-[#64748B]">Total Customers</p>
                <p className="text-2xl font-bold text-[#0F172A]">
                  {pagination.total}
                </p>
              </div>
              <div className="p-3 bg-[#2563EB]/10 rounded-lg">
                <Users className="w-5 h-5 text-[#2563EB]" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#64748B]">Active</p>
                <p className="text-2xl font-bold text-[#22C55E]">
                  {customers.filter((c) => c.status === "active").length}
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
                <p className="text-sm text-[#64748B]">Inactive</p>
                <p className="text-2xl font-bold text-[#EF4444]">
                  {customers.filter((c) => c.status === "inactive").length}
                </p>
              </div>
              <div className="p-3 bg-[#EF4444]/10 rounded-lg">
                <XCircle className="w-5 h-5 text-[#EF4444]" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#64748B]">With GST</p>
                <p className="text-2xl font-bold text-[#F59E0B]">
                  {customers.filter((c) => c.gstin).length}
                </p>
              </div>
              <div className="p-3 bg-[#F59E0B]/10 rounded-lg">
                <FileText className="w-5 h-5 text-[#F59E0B]" />
              </div>
            </div>
          </div>
        </div>

        {/* Customers Table */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="w-10 h-10 border-4 border-[#2563EB] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-sm text-[#64748B]">Loading customers...</p>
              </div>
            </div>
          ) : (
            <>
              <div className="max-w-[400px] md:max-w-[700px] lg:max-w-[1140px] overflow-x-auto">
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
                        Customer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[#334155] uppercase tracking-wider">
                        Contact
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[#334155] uppercase tracking-wider">
                        GSTIN
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[#334155] uppercase tracking-wider">
                        Billing Address
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
                    {filteredCustomers.length > 0 ? (
                      filteredCustomers.map((customer) => (
                        <tr
                          key={customer.id}
                          className="hover:bg-[#F8FAFC] transition-colors"
                        >
                          <td className="px-6 py-4">
                            <input
                              type="checkbox"
                              checked={selectedRows.includes(customer.id)}
                              onChange={() => handleRowSelect(customer.id)}
                              className="w-4 h-4 text-[#2563EB] rounded border-[#CBD5E1] focus:ring-[#2563EB]"
                            />
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <div className="w-10 h-10 bg-[#2563EB]/10 rounded-lg flex items-center justify-center">
                                <Users className="w-5 h-5 text-[#2563EB]" />
                              </div>
                              <div className="ml-3">
                                <p className="text-sm font-medium text-[#0F172A]">
                                  {customer.name}
                                </p>
                                <p className="text-xs text-[#64748B]">
                                  ID: {customer.id}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="space-y-1">
                              <div className="flex items-center text-sm text-[#334155]">
                                <Mail className="w-4 h-4 text-[#64748B] mr-2 flex-shrink-0" />
                                <span className="truncate max-w-[200px]">
                                  {customer.email}
                                </span>
                              </div>
                              <div className="flex items-center text-sm text-[#334155]">
                                <Phone className="w-4 h-4 text-[#64748B] mr-2 flex-shrink-0" />
                                <span>{customer.phone}</span>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            {customer.gstin ? (
                              <span className="text-sm font-mono text-[#334155] bg-[#F1F5F9] px-2 py-1 rounded">
                                {customer.gstin}
                              </span>
                            ) : (
                              <span className="text-sm text-[#94A3B8]">—</span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-start space-x-2 max-w-xs">
                              <MapPin className="w-4 h-4 text-[#64748B] mt-0.5 flex-shrink-0" />
                              <span className="text-sm text-[#334155] line-clamp-2">
                                {customer.billing_address}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() =>
                                handleStatusToggle(customer.id, customer.status)
                              }
                              className="cursor-pointer"
                              title={`Click to mark as ${customer.status === "active" ? "inactive" : "active"}`}
                            >
                              {getStatusBadge(customer.status)}
                            </button>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end space-x-2">
                              <button
                                onClick={() => handleEditCustomer(customer)}
                                className="p-1 hover:bg-[#F1F5F9] rounded-lg transition-colors"
                                title="Edit customer"
                              >
                                <Edit className="w-4 h-4 text-[#64748B]" />
                              </button>
                              <button
                                onClick={() =>
                                  handleDeleteCustomer(customer.id)
                                }
                                className="p-1 hover:bg-[#F1F5F9] rounded-lg transition-colors"
                                title="Delete customer"
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
                        <td colSpan="7" className="px-6 py-12 text-center">
                          <Users className="w-12 h-12 text-[#64748B] mx-auto mb-4" />
                          <p className="text-[#0F172A] font-medium">
                            No customers found
                          </p>
                          <p className="text-sm text-[#64748B] mt-1">
                            {searchTerm
                              ? "Try adjusting your search"
                              : "Add your first customer to get started"}
                          </p>
                          {!searchTerm && (
                            <button
                              onClick={handleAddCustomer}
                              className="mt-4 px-4 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-lg text-sm font-medium inline-flex items-center space-x-2"
                            >
                              <UserPlus className="w-4 h-4" />
                              <span>Add Customer</span>
                            </button>
                          )}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {customers.length > 0 && (
                <div className="px-6 py-4 border-t border-[#E2E8F0] bg-[#F8FAFC] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="text-sm text-[#64748B]">
                    Showing{" "}
                    <span className="font-medium">{pagination.from}</span> to{" "}
                    <span className="font-medium">{pagination.to}</span> of{" "}
                    <span className="font-medium">{pagination.total}</span>{" "}
                    customers
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() =>
                        handlePageChange(pagination.current_page - 1)
                      }
                      disabled={pagination.current_page === 1}
                      className="p-2 border border-[#CBD5E1] rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4 text-[#64748B]" />
                    </button>

                    <div className="flex items-center space-x-1">
                      {[...Array(Math.min(5, pagination.last_page))].map(
                        (_, i) => {
                          let pageNum;
                          if (pagination.last_page <= 5) {
                            pageNum = i + 1;
                          } else if (pagination.current_page <= 3) {
                            pageNum = i + 1;
                          } else if (
                            pagination.current_page >=
                            pagination.last_page - 2
                          ) {
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
                                  ? "bg-[#2563EB] text-white"
                                  : "text-[#64748B] hover:bg-[#F1F5F9]"
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        },
                      )}
                    </div>

                    <button
                      onClick={() =>
                        handlePageChange(pagination.current_page + 1)
                      }
                      disabled={
                        pagination.current_page === pagination.last_page
                      }
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

      {/* Add/Edit Customer Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setShowModal(false)}
          ></div>

          <div className="relative min-h-screen flex items-center justify-center p-4">
            <div className="relative bg-white rounded-xl shadow-2xl max-w-2xl w-full">
              {/* Modal Header */}
              <div className="px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between">
                <h3 className="text-lg font-semibold text-[#0F172A]">
                  {editingCustomer ? "Edit Customer" : "Add New Customer"}
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

                  <div className="grid grid-cols-2 gap-4">
                    {/* Customer Name */}
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-[#334155] mb-1">
                        Customer Name <span className="text-[#EF4444]">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2 border ${
                          formErrors.name
                            ? "border-[#EF4444]"
                            : "border-[#CBD5E1]"
                        } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]`}
                        placeholder="Enter customer name"
                      />
                      {formErrors.name && (
                        <p className="text-xs text-[#EF4444] mt-1">
                          {formErrors.name}
                        </p>
                      )}
                    </div>

                    {/* Email */}
                    <div className="col-span-2 sm:col-span-1">
                      <label className="block text-sm font-medium text-[#334155] mb-1">
                        Email <span className="text-[#EF4444]">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2 border ${
                          formErrors.email
                            ? "border-[#EF4444]"
                            : "border-[#CBD5E1]"
                        } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]`}
                        placeholder="customer@example.com"
                      />
                      {formErrors.email && (
                        <p className="text-xs text-[#EF4444] mt-1">
                          {formErrors.email}
                        </p>
                      )}
                    </div>

                    {/* Phone */}
                    <div className="col-span-2 sm:col-span-1">
                      <label className="block text-sm font-medium text-[#334155] mb-1">
                        Phone <span className="text-[#EF4444]">*</span>
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2 border ${
                          formErrors.phone
                            ? "border-[#EF4444]"
                            : "border-[#CBD5E1]"
                        } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]`}
                        placeholder="10 digit mobile number"
                      />
                      {formErrors.phone && (
                        <p className="text-xs text-[#EF4444] mt-1">
                          {formErrors.phone}
                        </p>
                      )}
                    </div>

                    {/* GSTIN */}
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-[#334155] mb-1">
                        GSTIN
                      </label>
                      <input
                        type="text"
                        name="gstin"
                        value={formData.gstin}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2 border ${
                          formErrors.gstin
                            ? "border-[#EF4444]"
                            : "border-[#CBD5E1]"
                        } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]`}
                        placeholder="27AABCU9603R1Z1"
                      />
                      {formErrors.gstin && (
                        <p className="text-xs text-[#EF4444] mt-1">
                          {formErrors.gstin}
                        </p>
                      )}
                    </div>

                    {/* Billing Address */}
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-[#334155] mb-1">
                        Billing Address{" "}
                        <span className="text-[#EF4444]">*</span>
                      </label>
                      <textarea
                        name="billing_address"
                        value={formData.billing_address}
                        onChange={handleInputChange}
                        rows="3"
                        className={`w-full px-4 py-2 border ${
                          formErrors.billing_address
                            ? "border-[#EF4444]"
                            : "border-[#CBD5E1]"
                        } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]`}
                        placeholder="Enter complete billing address"
                      />
                      {formErrors.billing_address && (
                        <p className="text-xs text-[#EF4444] mt-1">
                          {formErrors.billing_address}
                        </p>
                      )}
                    </div>
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
                      <span>
                        {editingCustomer ? "Update" : "Save"} Customer
                      </span>
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

export default HandleCustomer;
