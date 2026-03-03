// pages/vendor/HandleVendor.jsx
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
  Building2,
  Mail,
  Phone,
  MapPin,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { api } from "../../../utils/app";

const HandleVendor = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingVendor, setEditingVendor] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    total: 0,
    per_page: 15,
    from: 0,
    to: 0,
  });
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    gstin: "",
    address: "",
  });
  const [formErrors, setFormErrors] = useState({});

  // Fetch vendors with pagination
  const fetchVendors = useCallback(async (page = 1) => {
    setLoading(true);
    setApiError(null);

    try {
      const response = await api.get(`/org/vendors?page=${page}`);

      if (response.data && response.data.data) {
        setVendors(response.data.data.data);
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
      console.error("Error fetching vendors:", error);
      setApiError(error.message || "Failed to fetch vendors");
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchVendors(1);
  }, [fetchVendors]);

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
      errors.name = "Vendor name is required";
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
      errors.gstin = "Invalid GSTIN format (e.g., 22AAAAA0000A1Z5)";
    }

    if (!formData.address?.trim()) {
      errors.address = "Address is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddVendor = () => {
    setEditingVendor(null);
    setFormData({
      name: "",
      email: "",
      phone: "",
      gstin: "",
      address: "",
    });
    setFormErrors({});
    setApiError(null);
    setShowModal(true);
  };

  const handleEditVendor = (vendor) => {
    setEditingVendor(vendor);
    setFormData({
      name: vendor.name || "",
      email: vendor.email || "",
      phone: vendor.phone || "",
      gstin: vendor.gstin || "",
      address: vendor.address || "",
    });
    setFormErrors({});
    setApiError(null);
    setShowModal(true);
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setModalLoading(true);
    setApiError(null);

    try {
      // Prepare data for API
      const vendorData = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.replace(/\D/g, ""),
        gstin: formData.gstin?.trim() || null,
        address: formData.address.trim(),
      };

      if (editingVendor) {
        // Update existing vendor
        const response = await api.put(
          `/org/vendors/${editingVendor.id}`,
          vendorData,
        );

        if (response.data) {
          // Update local state
          setVendors((prev) =>
            prev.map((v) =>
              v.id === editingVendor.id
                ? { ...v, ...vendorData, updated_at: new Date().toISOString() }
                : v,
            ),
          );
        }
      } else {
        // Add new vendor
        const response = await api.post("/org/vendors", vendorData);

        if (response.data && response.data.data) {
          // Add new vendor to list
          setVendors((prev) => [response.data.data, ...prev]);

          // Update pagination total if needed
          setPagination((prev) => ({
            ...prev,
            total: prev.total + 1,
          }));
        }
      }

      setShowModal(false);
    } catch (error) {
      console.error("Error saving vendor:", error);

      // Handle validation errors from backend
      if (error.data?.errors) {
        const backendErrors = {};
        Object.keys(error.data.errors).forEach((key) => {
          backendErrors[key] = error.data.errors[key][0];
        });
        setFormErrors(backendErrors);
      } else {
        setApiError(error.message || "Failed to save vendor");
      }
    } finally {
      setModalLoading(false);
    }
  };

  const handleDeleteVendor = async (vendorId) => {
    if (!window.confirm("Are you sure you want to delete this vendor?")) return;

    try {
      await api.delete(`/org/vendors/${vendorId}`);

      // Remove from local state
      setVendors((prev) => prev.filter((v) => v.id !== vendorId));

      // Update pagination total
      setPagination((prev) => ({
        ...prev,
        total: prev.total - 1,
      }));
    } catch (error) {
      console.error("Error deleting vendor:", error);
      alert(error.message || "Failed to delete vendor");
    }
  };

  const handleStatusToggle = async (vendorId, currentStatus) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";

    try {
      await api.patch(`/org/vendors/${vendorId}/status`, { status: newStatus });

      // Update local state
      setVendors((prev) =>
        prev.map((v) => (v.id === vendorId ? { ...v, status: newStatus } : v)),
      );
    } catch (error) {
      console.error("Error updating vendor status:", error);
      alert(error.message || "Failed to update status");
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.last_page) {
      fetchVendors(newPage);
    }
  };

  const handleRefresh = () => {
    fetchVendors(pagination.current_page);
  };

  const filteredVendors = vendors.filter(
    (vendor) =>
      vendor.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.phone?.includes(searchTerm),
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Header */}
      <header className="bg-white border-b border-[#E2E8F0] sticky top-0 z-10">
        <div className="px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-[#0F172A]">
                Vendor Management
              </h1>
              <p className="text-sm text-[#64748B] mt-1">
                Manage your suppliers and vendors
              </p>
            </div>

            <button
              onClick={handleAddVendor}
              className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-2 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Vendor</span>
            </button>
          </div>

          {/* Search and Filter Bar */}
          <div className="mt-4 flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#64748B]" />
              <input
                type="text"
                placeholder="Search vendors by name, email or phone..."
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

        {/* Vendors Table */}
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
                        Vendor
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[#334155] uppercase tracking-wider">
                        Contact
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[#334155] uppercase tracking-wider">
                        GSTIN
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[#334155] uppercase tracking-wider">
                        Address
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
                    {filteredVendors.length > 0 ? (
                      filteredVendors.map((vendor) => (
                        <tr
                          key={vendor.id}
                          className="hover:bg-[#F8FAFC] transition-colors"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-10 h-10 bg-[#2563EB]/10 rounded-lg flex items-center justify-center">
                                <Building2 className="w-5 h-5 text-[#2563EB]" />
                              </div>
                              <div className="ml-3">
                                <p className="text-sm font-medium text-[#0F172A]">
                                  {vendor.name}
                                </p>
                                <p className="text-xs text-[#64748B]">
                                  ID: {vendor.id}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="space-y-1">
                              <div className="flex items-center text-sm text-[#334155]">
                                <Mail className="w-4 h-4 text-[#64748B] mr-2" />
                                {vendor.email}
                              </div>
                              <div className="flex items-center text-sm text-[#334155]">
                                <Phone className="w-4 h-4 text-[#64748B] mr-2" />
                                {vendor.phone}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            {vendor.gstin ? (
                              <span className="text-sm font-mono text-[#334155]">
                                {vendor.gstin}
                              </span>
                            ) : (
                              <span className="text-sm text-[#94A3B8]">
                                Not provided
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-start space-x-2 max-w-xs">
                              <MapPin className="w-4 h-4 text-[#64748B] mt-0.5 flex-shrink-0" />
                              <span className="text-sm text-[#334155] line-clamp-2">
                                {vendor.address}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() =>
                                handleStatusToggle(vendor.id, vendor.status)
                              }
                              className={`px-2 py-1 text-xs font-medium rounded-full flex items-center w-fit gap-1 ${
                                vendor.status === "active"
                                  ? "bg-[#DCFCE7] text-[#15803D]"
                                  : "bg-[#FEE2E2] text-[#B91C1C]"
                              }`}
                            >
                              {vendor.status === "active" ? (
                                <CheckCircle className="w-3 h-3" />
                              ) : (
                                <XCircle className="w-3 h-3" />
                              )}
                              {vendor.status}
                            </button>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end space-x-2">
                              <button
                                onClick={() => handleEditVendor(vendor)}
                                className="p-1 hover:bg-[#F1F5F9] rounded-lg transition-colors"
                                title="Edit vendor"
                              >
                                <Edit className="w-4 h-4 text-[#64748B]" />
                              </button>
                              <button
                                onClick={() => handleDeleteVendor(vendor.id)}
                                className="p-1 hover:bg-[#F1F5F9] rounded-lg transition-colors"
                                title="Delete vendor"
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
                          <Building2 className="w-12 h-12 text-[#64748B] mx-auto mb-4" />
                          <p className="text-[#0F172A] font-medium">
                            No vendors found
                          </p>
                          <p className="text-sm text-[#64748B] mt-1">
                            {searchTerm
                              ? "Try adjusting your search"
                              : "Add your first vendor to get started"}
                          </p>
                          {!searchTerm && (
                            <button
                              onClick={handleAddVendor}
                              className="mt-4 px-4 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-lg text-sm font-medium inline-flex items-center space-x-2"
                            >
                              <Plus className="w-4 h-4" />
                              <span>Add Vendor</span>
                            </button>
                          )}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {vendors.length > 0 && (
                <div className="px-6 py-4 border-t border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-between">
                  <div className="text-sm text-[#64748B]">
                    Showing{" "}
                    <span className="font-medium">{pagination.from}</span> to{" "}
                    <span className="font-medium">{pagination.to}</span> of{" "}
                    <span className="font-medium">{pagination.total}</span>{" "}
                    vendors
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() =>
                        handlePageChange(pagination.current_page - 1)
                      }
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
                            ? "bg-[#2563EB] text-white"
                            : "text-[#64748B] hover:bg-[#F1F5F9]"
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}

                    <button
                      onClick={() =>
                        handlePageChange(pagination.current_page + 1)
                      }
                      disabled={
                        pagination.current_page === pagination.last_page
                      }
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

      {/* Add/Edit Vendor Modal */}
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
                  {editingVendor ? "Edit Vendor" : "Add New Vendor"}
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-1 hover:bg-[#F1F5F9] rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-[#64748B]" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6">
                <div className="space-y-4">
                  {/* Form Error Display */}
                  {apiError && (
                    <div className="bg-[#FEE2E2] border border-[#EF4444]/20 rounded-lg p-3 mb-4">
                      <p className="text-sm text-[#B91C1C]">{apiError}</p>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    {/* Vendor Name Field */}
                    <div className="col-span-2 sm:col-span-1">
                      <label className="block text-sm font-medium text-[#334155] mb-1">
                        Vendor Name <span className="text-[#EF4444]">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Enter vendor name"
                        className={`w-full px-4 py-2 border ${
                          formErrors.name
                            ? "border-[#EF4444]"
                            : "border-[#CBD5E1]"
                        } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]`}
                      />
                      {formErrors.name && (
                        <p className="text-xs text-[#EF4444] mt-1">
                          {formErrors.name}
                        </p>
                      )}
                    </div>

                    {/* Email Field */}
                    <div className="col-span-2 sm:col-span-1">
                      <label className="block text-sm font-medium text-[#334155] mb-1">
                        Email <span className="text-[#EF4444]">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="vendor@example.com"
                        className={`w-full px-4 py-2 border ${
                          formErrors.email
                            ? "border-[#EF4444]"
                            : "border-[#CBD5E1]"
                        } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]`}
                      />
                      {formErrors.email && (
                        <p className="text-xs text-[#EF4444] mt-1">
                          {formErrors.email}
                        </p>
                      )}
                    </div>

                    {/* Phone Field */}
                    <div className="col-span-2 sm:col-span-1">
                      <label className="block text-sm font-medium text-[#334155] mb-1">
                        Phone <span className="text-[#EF4444]">*</span>
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="10 digit mobile number"
                        className={`w-full px-4 py-2 border ${
                          formErrors.phone
                            ? "border-[#EF4444]"
                            : "border-[#CBD5E1]"
                        } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]`}
                      />
                      {formErrors.phone && (
                        <p className="text-xs text-[#EF4444] mt-1">
                          {formErrors.phone}
                        </p>
                      )}
                    </div>

                    {/* GSTIN Field */}
                    <div className="col-span-2 sm:col-span-1">
                      <label className="block text-sm font-medium text-[#334155] mb-1">
                        GSTIN
                      </label>
                      <input
                        type="text"
                        name="gstin"
                        value={formData.gstin}
                        onChange={handleInputChange}
                        placeholder="22AAAAA0000A1Z5"
                        className={`w-full px-4 py-2 border ${
                          formErrors.gstin
                            ? "border-[#EF4444]"
                            : "border-[#CBD5E1]"
                        } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]`}
                      />
                      {formErrors.gstin && (
                        <p className="text-xs text-[#EF4444] mt-1">
                          {formErrors.gstin}
                        </p>
                      )}
                    </div>

                    {/* Address Field */}
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-[#334155] mb-1">
                        Address <span className="text-[#EF4444]">*</span>
                      </label>
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder="Street address, city, state"
                        rows="3"
                        className={`w-full px-4 py-2 border ${
                          formErrors.address
                            ? "border-[#EF4444]"
                            : "border-[#CBD5E1]"
                        } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]`}
                      />
                      {formErrors.address && (
                        <p className="text-xs text-[#EF4444] mt-1">
                          {formErrors.address}
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
                      <span>{editingVendor ? "Update" : "Save"} Vendor</span>
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

export default HandleVendor;
