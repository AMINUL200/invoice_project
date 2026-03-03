// pages/sales/HandleDebitNotes.jsx
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
  FileText,
  DollarSign,
  Calendar,
  Users,
  MessageSquare,
  CheckCircle,
  AlertCircle,
  Download,
  Printer,
} from "lucide-react";
import { format } from "date-fns";
import { api } from "../../../utils/app";

const HandleDebitNotes = () => {
  const [debitNotes, setDebitNotes] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingDebitNote, setEditingDebitNote] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [apiSuccess, setApiSuccess] = useState(null);

  // Invoice search states
  const [invoiceSearch, setInvoiceSearch] = useState("");
  const [showInvoiceDropdown, setShowInvoiceDropdown] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [filteredInvoices, setFilteredInvoices] = useState([]);

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
    invoice_id: "",
    debit_note_no: "",
    amount: "",
    reason: "",
  });
  const [formErrors, setFormErrors] = useState({});

  // Fetch invoices list
  const fetchInvoices = useCallback(async () => {
    try {
      const response = await api.get("/org/invoices");

      if (response.data && response.data.data) {
        const invoicesData = response.data.data;
        setInvoices(invoicesData);
        setFilteredInvoices(invoicesData);
      }
    } catch (error) {
      console.error("Error fetching invoices:", error);
    }
  }, []);

  // Fetch debit notes with pagination
  const fetchDebitNotes = useCallback(
    async (page = 1, perPage = pagination.per_page) => {
      setLoading(true);
      setApiError(null);

      try {
        const response = await api.get(
          `/org/debit-notes?page=${page}&per_page=${perPage}`,
        );

        if (response.data && response.data.data) {
          setDebitNotes(response.data.data.data);
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
        console.error("Error fetching debit notes:", error);
        setApiError(error.message || "Failed to fetch debit notes");
      } finally {
        setLoading(false);
      }
    },
    [pagination.per_page],
  );

  // Initial fetch
  useEffect(() => {
    fetchInvoices();
    fetchDebitNotes(1, pagination.per_page);
  }, [fetchInvoices, fetchDebitNotes, pagination.per_page]);

  // Handle invoice search
  useEffect(() => {
    if (invoiceSearch.trim() === "") {
      setFilteredInvoices(invoices);
    } else {
      const filtered = invoices.filter(
        (invoice) =>
          invoice.invoice_no
            .toLowerCase()
            .includes(invoiceSearch.toLowerCase()) ||
          invoice.customer?.name
            ?.toLowerCase()
            .includes(invoiceSearch.toLowerCase()) ||
          invoice.customer?.email
            ?.toLowerCase()
            .includes(invoiceSearch.toLowerCase()),
      );
      setFilteredInvoices(filtered);
    }
  }, [invoiceSearch, invoices]);

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

  const handleInvoiceSelect = (invoice) => {
    setSelectedInvoice(invoice);
    setFormData((prev) => ({
      ...prev,
      invoice_id: invoice.id,
    }));
    setInvoiceSearch(
      `${invoice.invoice_no} - ${invoice.customer?.name || ""} (₹${parseFloat(invoice.total_amount).toLocaleString()})`,
    );
    setShowInvoiceDropdown(false);

    // Clear invoice error if exists
    if (formErrors.invoice_id) {
      setFormErrors((prev) => ({
        ...prev,
        invoice_id: "",
      }));
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.invoice_id) {
      errors.invoice_id = "Please select an invoice";
    }

    if (!formData.debit_note_no?.trim()) {
      errors.debit_note_no = "Debit note number is required";
    }

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      errors.amount = "Amount must be greater than 0";
    }

    if (!formData.reason?.trim()) {
      errors.reason = "Reason is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const generateDebitNoteNumber = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0");
    return `DN-${year}-${month}-${random}`;
  };

  const handleAddDebitNote = () => {
    setEditingDebitNote(null);
    setSelectedInvoice(null);
    setInvoiceSearch("");
    setFormData({
      invoice_id: "",
      debit_note_no: generateDebitNoteNumber(),
      amount: "",
      reason: "",
    });
    setFormErrors({});
    setApiError(null);
    setShowModal(true);
  };

  const handleEditDebitNote = (debitNote) => {
    setEditingDebitNote(debitNote);
    setSelectedInvoice(debitNote.invoice);

    const customerName = debitNote.invoice?.customer?.name || "";
    setInvoiceSearch(
      `${debitNote.invoice.invoice_no} - ${customerName} (₹${parseFloat(debitNote.invoice?.total_amount || 0).toLocaleString()})`,
    );

    setFormData({
      invoice_id: debitNote.invoice_id,
      debit_note_no: debitNote.debit_note_no,
      amount: parseFloat(debitNote.amount).toString(),
      reason: debitNote.reason || "",
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
      const debitNoteData = {
        invoice_id: formData.invoice_id,
        debit_note_no: formData.debit_note_no.trim(),
        amount: parseFloat(formData.amount),
        reason: formData.reason.trim(),
      };

      let response;
      if (editingDebitNote) {
        // Update existing debit note
        response = await api.put(
          `/org/debit-notes/${editingDebitNote.id}`,
          debitNoteData,
        );
        setApiSuccess("Debit note updated successfully");
      } else {
        // Add new debit note
        response = await api.post("/org/debit-notes", debitNoteData);
        setApiSuccess("Debit note created successfully");
      }

      if (response.data) {
        // Refresh the list
        fetchDebitNotes(pagination.current_page, pagination.per_page);
        setShowModal(false);
      }
    } catch (error) {
      console.error("Error saving debit note:", error);

      // Handle validation errors from backend
      if (error.data?.errors) {
        const backendErrors = {};
        Object.keys(error.data.errors).forEach((key) => {
          backendErrors[key] = error.data.errors[key][0];
        });
        setFormErrors(backendErrors);
      } else {
        setApiError(error.message || "Failed to save debit note");
      }
    } finally {
      setModalLoading(false);
    }
  };

  const handleDeleteDebitNote = async (debitNoteId) => {
    if (!window.confirm("Are you sure you want to delete this debit note?"))
      return;

    try {
      await api.delete(`/org/debit-notes/${debitNoteId}`);
      setApiSuccess("Debit note deleted successfully");
      fetchDebitNotes(pagination.current_page, pagination.per_page);
    } catch (error) {
      console.error("Error deleting debit note:", error);
      alert(error.message || "Failed to delete debit note");
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.last_page) {
      fetchDebitNotes(newPage, pagination.per_page);
    }
  };

  const handlePerPageChange = (e) => {
    const newPerPage = parseInt(e.target.value);
    setPagination((prev) => ({ ...prev, per_page: newPerPage }));
    fetchDebitNotes(1, newPerPage);
  };

  const handleRefresh = () => {
    fetchInvoices();
    fetchDebitNotes(pagination.current_page, pagination.per_page);
  };

  const handlePrint = (debitNote) => {
    window.open(`/company/debit-notes/${debitNote.id}/print`, "_blank");
  };

  const handleDownload = (debitNote) => {
    window.open(`/company/debit-notes/${debitNote.id}/download`, "_blank");
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const filteredDebitNotes = debitNotes.filter(
    (dn) =>
      dn.debit_note_no.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dn.invoice?.invoice_no.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dn.invoice?.customer?.name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      dn.reason?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Header */}
      <header className="bg-white border-b border-[#E2E8F0] sticky top-0 z-10">
        <div className="px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-[#0F172A]">Debit Notes</h1>
              <p className="text-sm text-[#64748B] mt-1">
                Manage debit notes issued by vendors against purchases
              </p>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={handleRefresh}
                className="p-2 border border-[#CBD5E1] rounded-lg hover:bg-[#F8FAFC] transition-colors"
                title="Refresh"
              >
                <RefreshCw
                  className={`w-5 h-5 text-[#64748B] ${loading ? "animate-spin" : ""}`}
                />
              </button>

              <button
                onClick={handleAddDebitNote}
                className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-2 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Create Debit Note</span>
              </button>
            </div>
          </div>

          {/* Search and Filter Bar */}
          <div className="mt-4 flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#64748B]" />
              <input
                type="text"
                placeholder="Search by debit note number, invoice, vendor or reason..."
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#64748B]">Total Debit Notes</p>
                <p className="text-2xl font-bold text-[#0F172A]">
                  {pagination.total}
                </p>
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
                  {formatCurrency(
                    debitNotes.reduce(
                      (sum, dn) => sum + parseFloat(dn.amount),
                      0,
                    ),
                  )}
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
                <p className="text-sm text-[#64748B]">Average Amount</p>
                <p className="text-2xl font-bold text-[#0F172A]">
                  {debitNotes.length > 0
                    ? formatCurrency(
                        debitNotes.reduce(
                          (sum, dn) => sum + parseFloat(dn.amount),
                          0,
                        ) / debitNotes.length,
                      )
                    : formatCurrency(0)}
                </p>
              </div>
              <div className="p-3 bg-[#8B5CF6]/10 rounded-lg">
                <Users className="w-5 h-5 text-[#8B5CF6]" />
              </div>
            </div>
          </div>
        </div>

        {/* Debit Notes Table */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="w-10 h-10 border-4 border-[#2563EB] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-sm text-[#64748B]">Loading debit notes...</p>
              </div>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[#F1F5F9]">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[#334155] uppercase tracking-wider">
                        Debit Note #
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[#334155] uppercase tracking-wider">
                        Invoice Details
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[#334155] uppercase tracking-wider">
                        Vendor
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[#334155] uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[#334155] uppercase tracking-wider">
                        Reason
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[#334155] uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-[#334155] uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E2E8F0]">
                    {filteredDebitNotes.length > 0 ? (
                      filteredDebitNotes.map((debitNote) => (
                        <tr
                          key={debitNote.id}
                          className="hover:bg-[#F8FAFC] transition-colors"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <FileText className="w-5 h-5 text-[#2563EB] mr-2" />
                              <span className="text-sm font-medium text-[#0F172A]">
                                {debitNote.debit_note_no}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div>
                              <p className="text-sm font-medium text-[#0F172A]">
                                {debitNote.invoice?.invoice_no}
                              </p>
                              <p className="text-xs text-[#64748B]">
                                Amount:{" "}
                                {formatCurrency(
                                  parseFloat(
                                    debitNote.invoice?.total_amount || 0,
                                  ),
                                )}
                              </p>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-2">
                              <div className="w-8 h-8 bg-[#2563EB]/10 rounded-lg flex items-center justify-center">
                                <Users className="w-4 h-4 text-[#2563EB]" />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-[#0F172A]">
                                  {debitNote.invoice?.customer?.name ||
                                    "Unknown Vendor"}
                                </p>
                                <p className="text-xs text-[#64748B]">
                                  {debitNote.invoice?.customer?.email ||
                                    "No email"}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm font-medium text-[#0F172A]">
                              {formatCurrency(parseFloat(debitNote.amount))}
                            </span>
                          </td>
                          <td className="px-6 py-4 max-w-xs">
                            <div className="flex items-start space-x-2">
                              <MessageSquare className="w-4 h-4 text-[#64748B] mt-0.5 flex-shrink-0" />
                              <p className="text-sm text-[#334155] line-clamp-2">
                                {debitNote.reason}
                              </p>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center text-sm text-[#334155]">
                              <Calendar className="w-4 h-4 text-[#64748B] mr-2" />
                              {format(
                                new Date(debitNote.created_at),
                                "dd MMM yyyy",
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end space-x-2">
                              <button
                                onClick={() => handlePrint(debitNote)}
                                className="p-1 hover:bg-[#F1F5F9] rounded-lg transition-colors"
                                title="Print"
                              >
                                <Printer className="w-4 h-4 text-[#64748B]" />
                              </button>
                              <button
                                onClick={() => handleDownload(debitNote)}
                                className="p-1 hover:bg-[#F1F5F9] rounded-lg transition-colors"
                                title="Download PDF"
                              >
                                <Download className="w-4 h-4 text-[#64748B]" />
                              </button>
                              <button
                                onClick={() => handleEditDebitNote(debitNote)}
                                className="p-1 hover:bg-[#F1F5F9] rounded-lg transition-colors"
                                title="Edit"
                              >
                                <Edit className="w-4 h-4 text-[#64748B]" />
                              </button>
                              <button
                                onClick={() =>
                                  handleDeleteDebitNote(debitNote.id)
                                }
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
                        <td colSpan="7" className="px-6 py-12 text-center">
                          <FileText className="w-12 h-12 text-[#64748B] mx-auto mb-4" />
                          <p className="text-[#0F172A] font-medium">
                            No debit notes found
                          </p>
                          <p className="text-sm text-[#64748B] mt-1">
                            {searchTerm
                              ? "Try adjusting your search"
                              : "Create your first debit note to get started"}
                          </p>
                          {!searchTerm && (
                            <button
                              onClick={handleAddDebitNote}
                              className="mt-4 px-4 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-lg text-sm font-medium inline-flex items-center space-x-2"
                            >
                              <Plus className="w-4 h-4" />
                              <span>Create Debit Note</span>
                            </button>
                          )}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {debitNotes.length > 0 && (
                <div className="px-6 py-4 border-t border-[#E2E8F0] bg-[#F8FAFC] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="text-sm text-[#64748B]">
                    Showing{" "}
                    <span className="font-medium">{pagination.from}</span> to{" "}
                    <span className="font-medium">{pagination.to}</span> of{" "}
                    <span className="font-medium">{pagination.total}</span>{" "}
                    debit notes
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

      {/* Add/Edit Debit Note Modal */}
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
                  {editingDebitNote
                    ? "Edit Debit Note"
                    : "Create New Debit Note"}
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

                  {/* Invoice Selection with Search */}
                  <div className="relative">
                    <label className="block text-sm font-medium text-[#334155] mb-1">
                      Select Invoice <span className="text-[#EF4444]">*</span>
                    </label>
                    <div className="relative">
                      <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
                      <input
                        type="text"
                        value={invoiceSearch}
                        onChange={(e) => {
                          if (!editingDebitNote) {
                            setInvoiceSearch(e.target.value);
                            setShowInvoiceDropdown(true);
                            if (selectedInvoice) setSelectedInvoice(null);
                          }
                        }}
                        onFocus={() => {
                          if (!editingDebitNote) {
                            setShowInvoiceDropdown(true);
                          }
                        }}
                        placeholder="Search by invoice number or vendor..."
                        readOnly={editingDebitNote}
                        className={`w-full pl-10 pr-4 py-2 border ${
                          formErrors.invoice_id
                            ? "border-[#EF4444]"
                            : "border-[#CBD5E1]"
                        } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] ${
                          editingDebitNote
                            ? "bg-gray-100 cursor-not-allowed"
                            : ""
                        }`}
                      />
                    </div>

                    {/* Invoice Dropdown - Only show when not editing */}
                    {!editingDebitNote &&
                      showInvoiceDropdown &&
                      invoiceSearch.length > 0 && (
                        <div className="absolute z-20 w-full mt-1 bg-white border border-[#E2E8F0] rounded-lg shadow-lg max-h-60 overflow-y-auto">
                          {filteredInvoices.length > 0 ? (
                            filteredInvoices.map((invoice) => (
                              <button
                                key={invoice.id}
                                type="button"
                                onClick={() => handleInvoiceSelect(invoice)}
                                className="w-full px-4 py-3 text-left hover:bg-[#F8FAFC] transition-colors border-b border-[#E2E8F0] last:border-0"
                              >
                                <div className="flex items-start space-x-3">
                                  <div className="flex-shrink-0">
                                    <FileText className="w-5 h-5 text-[#2563EB]" />
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                      <p className="text-sm font-medium text-[#0F172A]">
                                        {invoice.invoice_no}
                                      </p>
                                      <span className="text-xs font-medium text-[#2563EB]">
                                        {formatCurrency(
                                          parseFloat(invoice.total_amount),
                                        )}
                                      </span>
                                    </div>
                                    <div className="flex items-center space-x-2 mt-1">
                                      <span className="text-xs text-[#64748B] flex items-center">
                                        <Users className="w-3 h-3 mr-1" />{" "}
                                        {invoice.customer?.name ||
                                          "Unknown Vendor"}
                                      </span>
                                      <span className="text-xs text-[#64748B]">
                                        {format(
                                          new Date(invoice.invoice_date),
                                          "dd MMM yyyy",
                                        )}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </button>
                            ))
                          ) : (
                            <div className="px-4 py-3 text-sm text-[#64748B]">
                              No invoices found
                            </div>
                          )}
                        </div>
                      )}

                    {formErrors.invoice_id && (
                      <p className="text-xs text-[#EF4444] mt-1">
                        {formErrors.invoice_id}
                      </p>
                    )}

                    {editingDebitNote && (
                      <p className="text-xs text-[#64748B] mt-1">
                        <span className="font-medium">Note:</span> Invoice
                        cannot be changed after creation.
                      </p>
                    )}
                  </div>

                  {/* Selected Invoice Info */}
                  {selectedInvoice && (
                    <div className="bg-[#F8FAFC] rounded-lg p-4 border border-[#E2E8F0]">
                      <h4 className="text-sm font-medium text-[#0F172A] mb-2">
                        Selected Invoice Details
                      </h4>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <p className="text-xs text-[#64748B]">
                            Invoice Number
                          </p>
                          <p className="text-sm font-medium text-[#0F172A]">
                            {selectedInvoice.invoice_no}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-[#64748B]">Invoice Date</p>
                          <p className="text-sm text-[#0F172A]">
                            {format(
                              new Date(selectedInvoice.invoice_date),
                              "dd MMM yyyy",
                            )}
                          </p>
                        </div>
                        {!editingDebitNote && (
                          <div>
                            <p className="text-xs text-[#64748B]">Customer</p>
                            <p className="text-sm text-[#0F172A]">
                              {selectedInvoice.customer?.name ||
                                "Unknown Customer"}
                            </p>
                          </div>
                        )}

                        <div>
                          <p className="text-xs text-[#64748B]">
                            Invoice Total
                          </p>
                          <p className="text-sm font-medium text-[#0F172A]">
                            {formatCurrency(
                              parseFloat(selectedInvoice.total_amount),
                            )}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-[#64748B]">Status</p>
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                            {selectedInvoice.status?.toUpperCase() || "DRAFT"}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Debit Note Details */}
                  <div>
                    <label className="block text-sm font-medium text-[#334155] mb-1">
                      Debit Note Number{" "}
                      <span className="text-[#EF4444]">*</span>
                    </label>
                    <input
                      type="text"
                      name="debit_note_no"
                      value={formData.debit_note_no}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border ${
                        formErrors.debit_note_no
                          ? "border-[#EF4444]"
                          : "border-[#CBD5E1]"
                      } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]`}
                      placeholder="DN-2026-001"
                    />
                    {formErrors.debit_note_no && (
                      <p className="text-xs text-[#EF4444] mt-1">
                        {formErrors.debit_note_no}
                      </p>
                    )}
                  </div>

                  {/* Amount */}
                  <div>
                    <label className="block text-sm font-medium text-[#334155] mb-1">
                      Amount (₹) <span className="text-[#EF4444]">*</span>
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
                      <input
                        type="number"
                        name="amount"
                        value={formData.amount}
                        onChange={handleInputChange}
                        min="0"
                        step="0.01"
                        className={`w-full pl-10 pr-4 py-2 border ${
                          formErrors.amount
                            ? "border-[#EF4444]"
                            : "border-[#CBD5E1]"
                        } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]`}
                        placeholder="200"
                      />
                    </div>
                    {formErrors.amount && (
                      <p className="text-xs text-[#EF4444] mt-1">
                        {formErrors.amount}
                      </p>
                    )}
                  </div>

                  {/* Reason */}
                  <div>
                    <label className="block text-sm font-medium text-[#334155] mb-1">
                      Reason <span className="text-[#EF4444]">*</span>
                    </label>
                    <textarea
                      name="reason"
                      value={formData.reason}
                      onChange={handleInputChange}
                      rows="4"
                      className={`w-full px-4 py-2 border ${
                        formErrors.reason
                          ? "border-[#EF4444]"
                          : "border-[#CBD5E1]"
                      } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]`}
                      placeholder="Enter reason for debit note (e.g., Price increase, Additional charges, etc.)"
                    />
                    {formErrors.reason && (
                      <p className="text-xs text-[#EF4444] mt-1">
                        {formErrors.reason}
                      </p>
                    )}
                  </div>

                  {/* Info Note */}
                  <div className="bg-[#F8FAFC] rounded-lg p-3 border border-[#E2E8F0]">
                    <p className="text-xs text-[#64748B]">
                      <span className="font-medium text-[#334155]">Note:</span>{" "}
                      Debit notes are used to record additional charges or
                      amounts owed to vendors.
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
                      <span>
                        {editingDebitNote ? "Update" : "Create"} Debit Note
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

export default HandleDebitNotes;
