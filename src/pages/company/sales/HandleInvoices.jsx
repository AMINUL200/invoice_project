// pages/sales/HandleInvoices.jsx
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
  Copy,
  PlusCircle,
  Trash as TrashIcon,
  Percent,
  Tag,
  Maximize2,
  Minimize2,
  ChevronDown,
} from "lucide-react";
import { format } from "date-fns";
import { api } from "../../../utils/app";

// Invoice Preview Component
const InvoicePreview = ({ formData, selectedCustomer, formatCurrency }) => {
  const getStatusBadge = (status) => {
    const statusConfig = {
      draft: { bg: "bg-[#E2E8F0]", text: "text-[#475569]", label: "Draft" },
      sent: { bg: "bg-[#DBEAFE]", text: "text-[#1D4ED8]", label: "Sent" },
      paid: { bg: "bg-[#DCFCE7]", text: "text-[#15803D]", label: "Paid" },
    };
    return statusConfig[status] || statusConfig.draft;
  };

  const statusStyle = getStatusBadge(formData.status);

  return (
    <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm overflow-hidden sticky top-24">
      {/* Preview Header */}
      <div className="px-6 py-4 border-b border-[#E2E8F0] bg-[#F8FAFC]">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-[#0F172A]">
            Invoice Preview
          </h3>
          <span
            className={`px-2 py-1 text-xs font-medium rounded-full ${statusStyle.bg} ${statusStyle.text}`}
          >
            {statusStyle.label}
          </span>
        </div>
      </div>

      {/* Preview Content */}
      <div className="p-6">
        {/* Company Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold text-[#0F172A]">INVOICE</h2>
            <p className="text-sm text-[#64748B] mt-1">
              {formData.invoice_no || "INV-001"}
            </p>
          </div>
          {/* <div className="text-right">
            <p className="font-medium text-[#0F172A]">Your Company Name</p>
            <p className="text-xs text-[#64748B]">123 Business Street</p>
            <p className="text-xs text-[#64748B]">City, State - 123456</p>
            <p className="text-xs text-[#64748B]">GSTIN: 27AABCU9603R1Z1</p>
          </div> */}
        </div>

        {/* Customer Details */}
        <div className="mb-6 p-4 bg-[#F8FAFC] rounded-lg">
          <p className="text-xs font-medium text-[#64748B] uppercase mb-2">
            Bill To:
          </p>
          {selectedCustomer ? (
            <div className="space-y-1">
              <p className="font-medium text-[#0F172A]">
                {selectedCustomer.name}
              </p>
              <p className="text-sm text-[#64748B]">{selectedCustomer.email}</p>
              <p className="text-sm text-[#64748B]">{selectedCustomer.phone}</p>
              <p className="text-sm text-[#64748B]">
                {selectedCustomer.billing_address}
              </p>
              {selectedCustomer.gstin && (
                <p className="text-sm text-[#64748B]">
                  GST: {selectedCustomer.gstin}
                </p>
              )}
            </div>
          ) : (
            <p className="text-sm text-[#64748B] italic">
              Select a customer to preview
            </p>
          )}
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-xs text-[#64748B]">Invoice Date</p>
            <p className="text-sm font-medium text-[#0F172A]">
              {formData.invoice_date
                ? format(new Date(formData.invoice_date), "dd MMM yyyy")
                : "N/A"}
            </p>
          </div>
          <div>
            <p className="text-xs text-[#64748B]">Due Date</p>
            <p className="text-sm font-medium text-[#0F172A]">
              {formData.due_date
                ? format(new Date(formData.due_date), "dd MMM yyyy")
                : "N/A"}
            </p>
          </div>
        </div>

        {/* Items Table */}
        {formData.items.length > 0 && formData.items[0].item_name ? (
          <div className="mb-6">
            <table className="w-full text-sm">
              <thead className="bg-[#F1F5F9]">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-medium text-[#334155]">
                    Item
                  </th>
                  <th className="px-3 py-2 text-right text-xs font-medium text-[#334155]">
                    Qty
                  </th>
                  <th className="px-3 py-2 text-right text-xs font-medium text-[#334155]">
                    Price
                  </th>
                  <th className="px-3 py-2 text-right text-xs font-medium text-[#334155]">
                    Tax
                  </th>
                  <th className="px-3 py-2 text-right text-xs font-medium text-[#334155]">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {formData.items.map((item, index) => (
                  <tr key={index}>
                    <td className="px-3 py-2 text-[#0F172A]">
                      {item.item_name || "-"}
                    </td>
                    <td className="px-3 py-2 text-right text-[#64748B]">
                      {item.quantity}
                    </td>
                    <td className="px-3 py-2 text-right text-[#64748B]">
                      {formatCurrency(item.price)}
                    </td>
                    <td className="px-3 py-2 text-right text-[#64748B]">
                      {item.tax_percent}%
                    </td>
                    <td className="px-3 py-2 text-right font-medium text-[#0F172A]">
                      {formatCurrency(item.total_amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="mb-6 p-4 bg-[#F8FAFC] rounded-lg text-center">
            <p className="text-sm text-[#64748B]">
              Add items to preview invoice
            </p>
          </div>
        )}

        {/* Summary */}
        <div className="border-t border-[#E2E8F0] pt-4">
          <div className="flex justify-end">
            <div className="w-64 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-[#64748B]">Subtotal:</span>
                <span className="text-[#0F172A]">
                  {formatCurrency(formData.subtotal)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#64748B]">Tax:</span>
                <span className="text-[#0F172A]">
                  {formatCurrency(formData.tax_amount)}
                </span>
              </div>
              {formData.discount_amount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-[#64748B]">Discount:</span>
                  <span className="text-[#22C55E]">
                    -{formatCurrency(formData.discount_amount)}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-base font-bold pt-2 border-t border-[#E2E8F0]">
                <span className="text-[#0F172A]">Total:</span>
                <span className="text-[#2563EB]">
                  {formatCurrency(formData.total_amount)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-[#E2E8F0] text-center">
          <p className="text-xs text-[#64748B]">Thank you for your business!</p>
          <p className="text-xs text-[#64748B] mt-1">
            This is a computer generated preview
          </p>
        </div>
      </div>
    </div>
  );
};

const HandleInvoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [apiSuccess, setApiSuccess] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(true); // Set to true by default to show preview

  // Customer search states
  const [customerSearch, setCustomerSearch] = useState("");
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [filteredCustomers, setFilteredCustomers] = useState([]);

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
    customer_id: "",
    invoice_no: "",
    invoice_type: "gst",
    invoice_date: new Date().toISOString().split("T")[0],
    due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    subtotal: 0,
    tax_amount: 0,
    discount_amount: 0,
    total_amount: 0,
    status: "draft",
    items: [
      {
        item_name: "",
        quantity: 1,
        price: 0,
        tax_percent: 18,
        tax_amount: 0,
        total_amount: 0,
      },
    ],
  });
  const [formErrors, setFormErrors] = useState({});

  // Fetch customers list
  const fetchCustomers = useCallback(async () => {
    try {
      const response = await api.get("/org/customers");
      if (response.data && response.data.data) {
        setCustomers(response.data.data.data);
        setFilteredCustomers(response.data.data.data);
      }
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  }, []);

  // Fetch invoices with pagination
  const fetchInvoices = useCallback(
    async (page = 1, perPage = pagination.per_page) => {
      setLoading(true);
      setApiError(null);

      try {
        const response = await api.get(
          `/org/invoices?page=${page}&per_page=${perPage}`,
        );

        if (response.data && response.data.data) {
          setInvoices(response.data.data);
          setPagination({
            current_page: response.data.meta.current_page,
            last_page: response.data.meta.last_page,
            total: response.data.meta.total,
            per_page: response.data.meta.per_page,
            from: response.data.meta.from,
            to: response.data.meta.to,
          });
        }
      } catch (error) {
        console.error("Error fetching invoices:", error);
        setApiError(error.message || "Failed to fetch invoices");
      } finally {
        setLoading(false);
      }
    },
    [pagination.per_page],
  );

  // Initial fetch
  useEffect(() => {
    fetchCustomers();
    fetchInvoices(1, pagination.per_page);
  }, [fetchCustomers, fetchInvoices, pagination.per_page]);

  // Handle select all
  useEffect(() => {
    if (selectAll) {
      setSelectedRows(invoices.map((i) => i.id));
    } else {
      setSelectedRows([]);
    }
  }, [selectAll, invoices]);

  // Handle customer search
  useEffect(() => {
    if (customerSearch.trim() === "") {
      setFilteredCustomers(customers);
    } else {
      const filtered = customers.filter(
        (customer) =>
          customer.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
          customer.email.toLowerCase().includes(customerSearch.toLowerCase()) ||
          customer.phone.includes(customerSearch),
      );
      setFilteredCustomers(filtered);
    }
  }, [customerSearch, customers]);

  const calculateItemTotals = (items) => {
    return items.map((item) => {
      const quantity = parseFloat(item.quantity) || 0;
      const price = parseFloat(item.price) || 0;
      const taxPercent = parseFloat(item.tax_percent) || 0;

      const subtotal = quantity * price;
      const taxAmount = (subtotal * taxPercent) / 100;
      const totalAmount = subtotal + taxAmount;

      return {
        ...item,
        tax_amount: taxAmount,
        total_amount: totalAmount,
      };
    });
  };

  const calculateInvoiceTotals = (items, discount = 0) => {
    const subtotal = items.reduce(
      (sum, item) =>
        sum + (parseFloat(item.quantity) || 0) * (parseFloat(item.price) || 0),
      0,
    );
    const taxAmount = items.reduce(
      (sum, item) => sum + (parseFloat(item.tax_amount) || 0),
      0,
    );
    const discountAmount = parseFloat(discount) || 0;
    const total = subtotal + taxAmount - discountAmount;

    return {
      subtotal,
      tax_amount: taxAmount,
      total_amount: total,
    };
  };

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

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...formData.items];
    updatedItems[index][field] = value;

    // Recalculate item totals
    const calculatedItems = calculateItemTotals(updatedItems);

    // Recalculate invoice totals
    const totals = calculateInvoiceTotals(
      calculatedItems,
      formData.discount_amount,
    );

    setFormData((prev) => ({
      ...prev,
      items: calculatedItems,
      ...totals,
    }));
  };

  const addItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          item_name: "",
          quantity: 1,
          price: 0,
          tax_percent: 18,
          tax_amount: 0,
          total_amount: 0,
        },
      ],
    }));
  };

  const removeItem = (index) => {
    if (formData.items.length === 1) {
      alert("At least one item is required");
      return;
    }

    const updatedItems = formData.items.filter((_, i) => i !== index);
    const totals = calculateInvoiceTotals(
      updatedItems,
      formData.discount_amount,
    );

    setFormData((prev) => ({
      ...prev,
      items: updatedItems,
      ...totals,
    }));
  };

  const handleCustomerSelect = (customer) => {
    setSelectedCustomer(customer);
    setFormData((prev) => ({
      ...prev,
      customer_id: customer.id,
    }));
    setCustomerSearch(customer.name);
    setShowCustomerDropdown(false);

    // Clear customer error if exists
    if (formErrors.customer_id) {
      setFormErrors((prev) => ({
        ...prev,
        customer_id: "",
      }));
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.customer_id) {
      errors.customer_id = "Please select a customer";
    }

    if (!formData.invoice_no?.trim()) {
      errors.invoice_no = "Invoice number is required";
    }

    if (!formData.invoice_date) {
      errors.invoice_date = "Invoice date is required";
    }

    if (!formData.due_date) {
      errors.due_date = "Due date is required";
    } else if (new Date(formData.due_date) < new Date(formData.invoice_date)) {
      errors.due_date = "Due date must be after invoice date";
    }

    // Validate items
    let hasItemErrors = false;
    formData.items.forEach((item, index) => {
      if (!item.item_name?.trim()) {
        errors[`item_${index}_name`] = "Item name is required";
        hasItemErrors = true;
      }
      if (item.quantity <= 0) {
        errors[`item_${index}_quantity`] = "Quantity must be greater than 0";
        hasItemErrors = true;
      }
      if (item.price <= 0) {
        errors[`item_${index}_price`] = "Price must be greater than 0";
        hasItemErrors = true;
      }
    });

    if (hasItemErrors) {
      errors.items = "Please fix item errors";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const generateInvoiceNumber = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0");
    return `INV-${year}-${month}-${random}`;
  };

  const fetchNextInvoiceNumber = async () => {
    try {
      const res = await api.get("/org/invoices/last-invoice-no");
      console.log("res :: ", res);
      const lastInvoice = res.data?.last_invoice_no;
      console.log("LatestInvoice:: ",lastInvoice)

      if (!lastInvoice) {
        return "INV2026030001";
      }

     
      return lastInvoice;
    } catch (error) {
      console.error("Failed to fetch invoice number", error);
      return generateInvoiceNumber(); // fallback
    }
  };

  const handleAddInvoice = async () => {
    const newInvoiceNumber = await fetchNextInvoiceNumber();
    // console.log(newInvoiceNumber)
    setEditingInvoice(null);
    setSelectedCustomer(null);
    setCustomerSearch("");
    setIsFullScreen(true); // Set to true to show preview
    setFormData({
      customer_id: "",
      invoice_no: newInvoiceNumber,
      invoice_type: "gst",
      invoice_date: new Date().toISOString().split("T")[0],
      due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      subtotal: 0,
      tax_amount: 0,
      discount_amount: 0,
      total_amount: 0,
      status: "draft",
      items: [
        {
          item_name: "",
          quantity: 1,
          price: 0,
          tax_percent: 18,
          tax_amount: 0,
          total_amount: 0,
        },
      ],
    });
    setFormErrors({});
    setApiError(null);
    setShowModal(true);
  };

  const handleEditInvoice = (invoice) => {
    setEditingInvoice(invoice);
    setSelectedCustomer(invoice.customer);
    setCustomerSearch(invoice.customer.name);
    setIsFullScreen(true); // Set to true to show preview
    fetchInvoiceDetails(invoice.id);
  };

  const fetchInvoiceDetails = async (invoiceId) => {
    setModalLoading(true);
    try {
      const response = await api.get(`/org/invoices/${invoiceId}`);
      if (response.data) {
        const invoice = response.data;
        setFormData({
          customer_id: invoice.customer_id,
          invoice_no: invoice.invoice_no,
          invoice_type: invoice.invoice_type,
          invoice_date: invoice.invoice_date.split("T")[0],
          due_date: invoice.due_date.split("T")[0],
          subtotal: parseFloat(invoice.subtotal),
          tax_amount: parseFloat(invoice.tax_amount),
          discount_amount: parseFloat(invoice.discount_amount || 0),
          total_amount: parseFloat(invoice.total_amount),
          status: invoice.status,
          items:
            invoice.items?.map((item) => ({
              item_name: item.item_name,
              quantity: parseFloat(item.quantity),
              price: parseFloat(item.price),
              tax_percent: parseFloat(item.tax_percent),
              tax_amount: parseFloat(item.tax_amount),
              total_amount: parseFloat(item.total_amount),
            })) || [],
        });
      }
    } catch (error) {
      console.error("Error fetching invoice details:", error);
      setApiError(error.message || "Failed to fetch invoice details");
    } finally {
      setModalLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setModalLoading(true);
    setApiError(null);
    setApiSuccess(null);

    try {
      // Prepare data for API
      const invoiceData = {
        customer_id: formData.customer_id,
        invoice_no: formData.invoice_no.trim(),
        invoice_type: formData.invoice_type,
        invoice_date: formData.invoice_date,
        due_date: formData.due_date,
        subtotal: formData.subtotal,
        tax_amount: formData.tax_amount,
        discount_amount: formData.discount_amount,
        total_amount: formData.total_amount,
        status: formData.status,
        items: formData.items.map((item) => ({
          item_name: item.item_name.trim(),
          quantity: parseFloat(item.quantity),
          price: parseFloat(item.price),
          tax_percent: parseFloat(item.tax_percent),
          tax_amount: parseFloat(item.tax_amount),
          total_amount: parseFloat(item.total_amount),
        })),
      };

      let response;
      if (editingInvoice) {
        // Update existing invoice
        response = await api.put(
          `/org/invoices/${editingInvoice.id}`,
          invoiceData,
        );
        setApiSuccess("Invoice updated successfully");
      } else {
        // Add new invoice
        response = await api.post("/org/invoices", invoiceData);
        setApiSuccess("Invoice created successfully");
        console.log("api res:: ", response);
      }

      if (response.data) {
        // Refresh the list
        fetchInvoices(pagination.current_page, pagination.per_page);
        setShowModal(false);
      }
    } catch (error) {
      console.error("Error saving invoice:", error);

      // Handle validation errors from backend
      if (error.data?.errors) {
        const backendErrors = {};
        Object.keys(error.data.errors).forEach((key) => {
          backendErrors[key] = error.data.errors[key][0];
        });
        setFormErrors(backendErrors);
      } else {
        setApiError(error.message || "Failed to save invoice");
      }
    } finally {
      setModalLoading(false);
    }
  };

  const handleDeleteInvoice = async (invoiceId) => {
    if (!window.confirm("Are you sure you want to delete this invoice?"))
      return;

    try {
      await api.delete(`/org/invoices/${invoiceId}`);
      setApiSuccess("Invoice deleted successfully");
      fetchInvoices(pagination.current_page, pagination.per_page);
    } catch (error) {
      console.error("Error deleting invoice:", error);
      alert(error.message || "Failed to delete invoice");
    }
  };

  const handleBulkDelete = async () => {
    if (selectedRows.length === 0) return;

    if (
      !window.confirm(
        `Are you sure you want to delete ${selectedRows.length} invoices?`,
      )
    )
      return;

    try {
      await api.post("/org/invoices/bulk-delete", { ids: selectedRows });
      setApiSuccess(`${selectedRows.length} invoices deleted successfully`);
      setSelectedRows([]);
      setSelectAll(false);
      fetchInvoices(pagination.current_page, pagination.per_page);
    } catch (error) {
      console.error("Error deleting invoices:", error);
      alert(error.message || "Failed to delete invoices");
    }
  };

  const handleStatusChange = async (invoiceId, newStatus) => {
    try {
      await api.patch(`/org/invoices/${invoiceId}/status`, {
        status: newStatus,
      });
      fetchInvoices(pagination.current_page, pagination.per_page);
      setApiSuccess(`Invoice status updated to ${newStatus}`);
    } catch (error) {
      console.error("Error updating status:", error);
      alert(error.message || "Failed to update status");
    }
  };

  const handleDuplicate = (invoice) => {
    setEditingInvoice(null);
    setSelectedCustomer(invoice.customer);
    setCustomerSearch(invoice.customer.name);
    setFormData({
      customer_id: invoice.customer_id,
      invoice_no: generateInvoiceNumber(),
      invoice_type: invoice.invoice_type,
      invoice_date: new Date().toISOString().split("T")[0],
      due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      subtotal: parseFloat(invoice.subtotal),
      tax_amount: parseFloat(invoice.tax_amount),
      discount_amount: parseFloat(invoice.discount_amount || 0),
      total_amount: parseFloat(invoice.total_amount),
      status: "draft",
      items:
        invoice.items?.map((item) => ({
          item_name: item.item_name,
          quantity: parseFloat(item.quantity),
          price: parseFloat(item.price),
          tax_percent: parseFloat(item.tax_percent),
          tax_amount: parseFloat(item.tax_amount),
          total_amount: parseFloat(item.total_amount),
        })) || [],
    });
    setFormErrors({});
    setApiError(null);
    setShowModal(true);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.last_page) {
      fetchInvoices(newPage, pagination.per_page);
    }
  };

  const handlePerPageChange = (e) => {
    const newPerPage = parseInt(e.target.value);
    setPagination((prev) => ({ ...prev, per_page: newPerPage }));
    fetchInvoices(1, newPerPage);
  };

  const handleRefresh = () => {
    fetchCustomers();
    fetchInvoices(pagination.current_page, pagination.per_page);
  };

  const handleRowSelect = (invoiceId) => {
    setSelectedRows((prev) => {
      if (prev.includes(invoiceId)) {
        return prev.filter((id) => id !== invoiceId);
      } else {
        return [...prev, invoiceId];
      }
    });
    setSelectAll(false);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      draft: {
        bg: "bg-[#E2E8F0]",
        text: "text-[#475569]",
        icon: Clock,
        label: "Draft",
      },
      sent: {
        bg: "bg-[#DBEAFE]",
        text: "text-[#1D4ED8]",
        icon: Send,
        label: "Sent",
      },
      paid: {
        bg: "bg-[#DCFCE7]",
        text: "text-[#15803D]",
        icon: CheckCircle,
        label: "Paid",
      },
      overdue: {
        bg: "bg-[#FEE2E2]",
        text: "text-[#B91C1C]",
        icon: AlertCircle,
        label: "Overdue",
      },
      cancelled: {
        bg: "bg-[#FEF3C7]",
        text: "text-[#B45309]",
        icon: XCircle,
        label: "Cancelled",
      },
    };

    const config = statusConfig[status] || statusConfig.draft;
    const Icon = config.icon;

    return (
      <span
        className={`px-2 py-1 text-xs font-medium rounded-full flex items-center w-fit gap-1 ${config.bg} ${config.text}`}
      >
        <Icon className="w-3 h-3" />
        {config.label}
      </span>
    );
  };

  const isOverdue = (dueDate, status) => {
    return (
      status !== "paid" &&
      status !== "cancelled" &&
      new Date(dueDate) < new Date()
    );
  };

  const filteredInvoices = invoices.filter(
    (invoice) =>
      invoice.invoice_no.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.customer?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.customer?.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Header */}
      <header className="bg-white border-b border-[#E2E8F0] sticky top-0 z-10">
        <div className="px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-[#0F172A]">Invoices</h1>
              <p className="text-sm text-[#64748B] mt-1">
                Create and manage customer invoices
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
                onClick={handleAddInvoice}
                className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-2 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Create Invoice</span>
              </button>
            </div>
          </div>

          {/* Search and Filter Bar */}
          <div className="mt-4 flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#64748B]" />
              <input
                type="text"
                placeholder="Search by invoice number or customer..."
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

          {/* Bulk Actions */}
          {selectedRows.length > 0 && (
            <div className="mt-4 flex items-center space-x-3 bg-[#F1F5F9] p-2 rounded-lg">
              <span className="text-sm text-[#334155]">
                {selectedRows.length} invoice
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
                <p className="text-sm text-[#64748B]">Total Invoices</p>
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
                    invoices.reduce(
                      (sum, inv) => sum + parseFloat(inv.total_amount),
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
                <p className="text-sm text-[#64748B]">Paid</p>
                <p className="text-2xl font-bold text-[#22C55E]">
                  {invoices.filter((i) => i.status === "paid").length}
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
                <p className="text-sm text-[#64748B]">Overdue</p>
                <p className="text-2xl font-bold text-[#EF4444]">
                  {
                    invoices.filter((i) => isOverdue(i.due_date, i.status))
                      .length
                  }
                </p>
              </div>
              <div className="p-3 bg-[#EF4444]/10 rounded-lg">
                <AlertCircle className="w-5 h-5 text-[#EF4444]" />
              </div>
            </div>
          </div>
        </div>

        {/* Invoices Table */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="w-10 h-10 border-4 border-[#2563EB] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-sm text-[#64748B]">Loading invoices...</p>
              </div>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
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
                        Invoice #
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[#334155] uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[#334155] uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[#334155] uppercase tracking-wider">
                        Due Date
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
                    {filteredInvoices.length > 0 ? (
                      filteredInvoices.map((invoice) => {
                        const overdue = isOverdue(
                          invoice.due_date,
                          invoice.status,
                        );
                        const displayStatus = overdue
                          ? "overdue"
                          : invoice.status;

                        return (
                          <tr
                            key={invoice.id}
                            className="hover:bg-[#F8FAFC] transition-colors"
                          >
                            <td className="px-6 py-4">
                              <input
                                type="checkbox"
                                checked={selectedRows.includes(invoice.id)}
                                onChange={() => handleRowSelect(invoice.id)}
                                className="w-4 h-4 text-[#2563EB] rounded border-[#CBD5E1] focus:ring-[#2563EB]"
                              />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <FileText className="w-5 h-5 text-[#2563EB] mr-2" />
                                <span className="text-sm font-medium text-[#0F172A]">
                                  {invoice.invoice_no}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center space-x-2">
                                <div className="w-8 h-8 bg-[#2563EB]/10 rounded-lg flex items-center justify-center">
                                  <Users className="w-4 h-4 text-[#2563EB]" />
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-[#0F172A]">
                                    {invoice.customer?.name}
                                  </p>
                                  <p className="text-xs text-[#64748B]">
                                    {invoice.customer?.email}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center text-sm text-[#334155]">
                                <Calendar className="w-4 h-4 text-[#64748B] mr-2" />
                                {format(
                                  new Date(invoice.invoice_date),
                                  "dd MMM yyyy",
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div
                                className={`flex items-center text-sm ${overdue ? "text-[#EF4444]" : "text-[#334155]"}`}
                              >
                                <Calendar className="w-4 h-4 text-[#64748B] mr-2" />
                                {format(
                                  new Date(invoice.due_date),
                                  "dd MMM yyyy",
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="text-sm font-medium text-[#0F172A]">
                                {formatCurrency(
                                  parseFloat(invoice.total_amount),
                                )}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {getStatusBadge(displayStatus)}
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex items-center justify-end space-x-2">
                                <button
                                  onClick={() =>
                                    window.open(
                                      `/org/invoices/${invoice.id}/preview`,
                                      "_blank",
                                    )
                                  }
                                  className="p-1 hover:bg-[#F1F5F9] rounded-lg transition-colors"
                                  title="Preview"
                                >
                                  <Eye className="w-4 h-4 text-[#64748B]" />
                                </button>
                                {/* <button
                                  onClick={() => handleEditInvoice(invoice)}
                                  className="p-1 hover:bg-[#F1F5F9] rounded-lg transition-colors"
                                  title="Edit"
                                >
                                  <Edit className="w-4 h-4 text-[#64748B]" />
                                </button> */}

                                <button
                                  onClick={() =>
                                    handleDeleteInvoice(invoice.id)
                                  }
                                  className="p-1 hover:bg-[#FEE2E2] rounded-lg transition-colors"
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
                          <p className="text-[#0F172A] font-medium">
                            No invoices found
                          </p>
                          <p className="text-sm text-[#64748B] mt-1">
                            {searchTerm
                              ? "Try adjusting your search"
                              : "Create your first invoice to get started"}
                          </p>
                          {!searchTerm && (
                            <button
                              onClick={handleAddInvoice}
                              className="mt-4 px-4 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-lg text-sm font-medium inline-flex items-center space-x-2"
                            >
                              <Plus className="w-4 h-4" />
                              <span>Create Invoice</span>
                            </button>
                          )}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {invoices.length > 0 && (
                <div className="px-6 py-4 border-t border-[#E2E8F0] bg-[#F8FAFC] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="text-sm text-[#64748B]">
                    Showing{" "}
                    <span className="font-medium">{pagination.from}</span> to{" "}
                    <span className="font-medium">{pagination.to}</span> of{" "}
                    <span className="font-medium">{pagination.total}</span>{" "}
                    invoices
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

      {/* Full Screen Add/Edit Invoice Modal */}
      {showModal && (
        <div
          className={`fixed inset-0 z-50 bg-white flex flex-col ${isFullScreen ? "" : "overflow-y-auto"}`}
        >
          {/* Modal Header */}
          <div className="sticky top-0 z-10 bg-white border-b border-[#E2E8F0] px-6 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-[#F1F5F9] rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-[#64748B]" />
              </button>
              <div>
                <h2 className="text-xl font-semibold text-[#0F172A]">
                  {editingInvoice ? "Edit Invoice" : "Create New Invoice"}
                </h2>
                <p className="text-sm text-[#64748B] mt-1">
                  Fill in the invoice details. Changes are saved automatically.
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => setIsFullScreen(!isFullScreen)}
                className="p-2 hover:bg-[#F1F5F9] rounded-lg transition-colors"
                title={isFullScreen ? "Exit full screen" : "Full screen"}
              >
                {isFullScreen ? (
                  <Minimize2 className="w-5 h-5 text-[#64748B]" />
                ) : (
                  <Maximize2 className="w-5 h-5 text-[#64748B]" />
                )}
              </button>

              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border border-[#CBD5E1] rounded-lg text-sm font-medium text-[#334155] hover:bg-[#F8FAFC] transition-colors"
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
                    <span>{editingInvoice ? "Update" : "Create"} Invoice</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Modal Body - Split Layout */}
          <div className="flex-1 overflow-hidden">
            <div className="h-full flex">
              {/* Left Side - Form */}
              <div
                className={`${isFullScreen ? "w-1/2" : "w-full lg:w-1/2"} overflow-y-auto border-r border-[#E2E8F0]`}
              >
                <div className="p-6">
                  <div className="space-y-6 max-w-2xl mx-auto">
                    {/* Form Error Display */}
                    {apiError && (
                      <div className="bg-[#FEE2E2] border border-[#EF4444]/20 rounded-lg p-3">
                        <p className="text-sm text-[#B91C1C]">{apiError}</p>
                      </div>
                    )}

                    {/* Customer Selection with Search */}
                    <div className="relative">
                      <label className="block text-sm font-medium text-[#334155] mb-1">
                        Select Customer{" "}
                        <span className="text-[#EF4444]">*</span>
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
                            formErrors.customer_id
                              ? "border-[#EF4444]"
                              : "border-[#CBD5E1]"
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
                                    <p className="text-sm font-medium text-[#0F172A]">
                                      {customer.name}
                                    </p>
                                    <div className="flex items-center space-x-3 mt-1">
                                      <span className="text-xs text-[#64748B] flex items-center">
                                        <Mail className="w-3 h-3 mr-1" />{" "}
                                        {customer.email}
                                      </span>
                                      <span className="text-xs text-[#64748B] flex items-center">
                                        <Phone className="w-3 h-3 mr-1" />{" "}
                                        {customer.phone}
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
                        <p className="text-xs text-[#EF4444] mt-1">
                          {formErrors.customer_id}
                        </p>
                      )}
                    </div>

                    {/* Selected Customer Info */}
                    {selectedCustomer && (
                      <div className="bg-[#F8FAFC] rounded-lg p-4 border border-[#E2E8F0]">
                        <h4 className="text-sm font-medium text-[#0F172A] mb-2">
                          Selected Customer Details
                        </h4>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <p className="text-xs text-[#64748B]">Name</p>
                            <p className="text-sm font-medium text-[#0F172A]">
                              {selectedCustomer.name}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-[#64748B]">Email</p>
                            <p className="text-sm text-[#0F172A]">
                              {selectedCustomer.email}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-[#64748B]">Phone</p>
                            <p className="text-sm text-[#0F172A]">
                              {selectedCustomer.phone}
                            </p>
                          </div>
                          {selectedCustomer.gstin && (
                            <div>
                              <p className="text-xs text-[#64748B]">GSTIN</p>
                              <p className="text-sm font-mono text-[#0F172A]">
                                {selectedCustomer.gstin}
                              </p>
                            </div>
                          )}
                          <div className="col-span-2">
                            <p className="text-xs text-[#64748B]">
                              Billing Address
                            </p>
                            <p className="text-sm text-[#0F172A]">
                              {selectedCustomer.billing_address}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Invoice Details */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-[#334155] mb-1">
                          Invoice Number{" "}
                          <span className="text-[#EF4444]">*</span>
                        </label>
                        <input
                          type="text"
                          name="invoice_no"
                          value={formData.invoice_no}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-2 border ${
                            formErrors.invoice_no
                              ? "border-[#EF4444]"
                              : "border-[#CBD5E1]"
                          } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]`}
                          placeholder="INV-2026-001"
                        />
                        {formErrors.invoice_no && (
                          <p className="text-xs text-[#EF4444] mt-1">
                            {formErrors.invoice_no}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[#334155] mb-1">
                          Invoice Type
                        </label>
                        <select
                          name="invoice_type"
                          value={formData.invoice_type}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-[#CBD5E1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]"
                        >
                          <option value="gst">GST Invoice</option>
                          <option value="regular">Regular Invoice</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-[#334155] mb-1">
                          Invoice Date <span className="text-[#EF4444]">*</span>
                        </label>
                        <input
                          type="date"
                          name="invoice_date"
                          value={formData.invoice_date}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-2 border ${
                            formErrors.invoice_date
                              ? "border-[#EF4444]"
                              : "border-[#CBD5E1]"
                          } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]`}
                        />
                        {formErrors.invoice_date && (
                          <p className="text-xs text-[#EF4444] mt-1">
                            {formErrors.invoice_date}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[#334155] mb-1">
                          Due Date <span className="text-[#EF4444]">*</span>
                        </label>
                        <input
                          type="date"
                          name="due_date"
                          value={formData.due_date}
                          onChange={handleInputChange}
                          min={formData.invoice_date}
                          className={`w-full px-4 py-2 border ${
                            formErrors.due_date
                              ? "border-[#EF4444]"
                              : "border-[#CBD5E1]"
                          } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]`}
                        />
                        {formErrors.due_date && (
                          <p className="text-xs text-[#EF4444] mt-1">
                            {formErrors.due_date}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Invoice Items */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm font-medium text-[#0F172A]">
                          Invoice Items
                        </h4>
                        <button
                          type="button"
                          onClick={addItem}
                          className="flex items-center space-x-1 text-sm text-[#2563EB] hover:text-[#1D4ED8]"
                        >
                          <PlusCircle className="w-4 h-4" />
                          <span>Add Item</span>
                        </button>
                      </div>

                      {formErrors.items && (
                        <p className="text-xs text-[#EF4444] mb-2">
                          {formErrors.items}
                        </p>
                      )}

                      {/* Items Table */}
                      <div className="border border-[#E2E8F0] rounded-lg overflow-hidden">
                        <table className="w-full">
                          <thead className="bg-[#F1F5F9]">
                            <tr>
                              <th className="px-3 py-2 text-left text-xs font-medium text-[#334155]">
                                Item
                              </th>
                              <th className="px-3 py-2 text-right text-xs font-medium text-[#334155]">
                                Qty
                              </th>
                              <th className="px-3 py-2 text-right text-xs font-medium text-[#334155]">
                                Price
                              </th>
                              <th className="px-3 py-2 text-right text-xs font-medium text-[#334155]">
                                Tax %
                              </th>
                              <th className="px-3 py-2 text-right text-xs font-medium text-[#334155]">
                                Tax Amt
                              </th>
                              <th className="px-3 py-2 text-right text-xs font-medium text-[#334155]">
                                Total
                              </th>
                              <th className="px-3 py-2 text-center text-xs font-medium text-[#334155]"></th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[#E2E8F0]">
                            {formData.items.map((item, index) => (
                              <tr key={index}>
                                <td className="px-3 py-2">
                                  <input
                                    type="text"
                                    value={item.item_name}
                                    onChange={(e) =>
                                      handleItemChange(
                                        index,
                                        "item_name",
                                        e.target.value,
                                      )
                                    }
                                    className={`w-full px-2 py-1 border ${
                                      formErrors[`item_${index}_name`]
                                        ? "border-[#EF4444]"
                                        : "border-[#CBD5E1]"
                                    } rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]`}
                                    placeholder="Item name"
                                  />
                                  {formErrors[`item_${index}_name`] && (
                                    <p className="text-xs text-[#EF4444] mt-1">
                                      {formErrors[`item_${index}_name`]}
                                    </p>
                                  )}
                                </td>
                                <td className="px-3 py-2">
                                  <input
                                    type="number"
                                    value={item.quantity}
                                    onChange={(e) =>
                                      handleItemChange(
                                        index,
                                        "quantity",
                                        e.target.value,
                                      )
                                    }
                                    min="1"
                                    step="1"
                                    className={`w-20 px-2 py-1 border ${
                                      formErrors[`item_${index}_quantity`]
                                        ? "border-[#EF4444]"
                                        : "border-[#CBD5E1]"
                                    } rounded text-sm text-right focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]`}
                                  />
                                </td>
                                <td className="px-3 py-2">
                                  <input
                                    type="number"
                                    value={item.price}
                                    onChange={(e) =>
                                      handleItemChange(
                                        index,
                                        "price",
                                        e.target.value,
                                      )
                                    }
                                    min="0"
                                    step="0.01"
                                    className={`w-24 px-2 py-1 border ${
                                      formErrors[`item_${index}_price`]
                                        ? "border-[#EF4444]"
                                        : "border-[#CBD5E1]"
                                    } rounded text-sm text-right focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]`}
                                    placeholder="0.00"
                                  />
                                </td>
                                <td className="px-3 py-2">
                                  <input
                                    type="number"
                                    value={item.tax_percent}
                                    onChange={(e) =>
                                      handleItemChange(
                                        index,
                                        "tax_percent",
                                        e.target.value,
                                      )
                                    }
                                    min="0"
                                    max="100"
                                    step="0.01"
                                    className="w-20 px-2 py-1 border border-[#CBD5E1] rounded text-sm text-right focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]"
                                  />
                                </td>
                                <td className="px-3 py-2 text-right">
                                  <span className="text-sm text-[#334155]">
                                    {formatCurrency(item.tax_amount)}
                                  </span>
                                </td>
                                <td className="px-3 py-2 text-right">
                                  <span className="text-sm font-medium text-[#0F172A]">
                                    {formatCurrency(item.total_amount)}
                                  </span>
                                </td>
                                <td className="px-3 py-2 text-center">
                                  <button
                                    type="button"
                                    onClick={() => removeItem(index)}
                                    className="p-1 hover:bg-[#FEE2E2] rounded transition-colors"
                                  >
                                    <TrashIcon className="w-4 h-4 text-[#EF4444]" />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Invoice Summary */}
                    <div className="flex justify-end">
                      <div className="w-72 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-[#64748B]">Subtotal:</span>
                          <span className="font-medium text-[#0F172A]">
                            {formatCurrency(formData.subtotal)}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-[#64748B]">Tax Amount:</span>
                          <span className="font-medium text-[#0F172A]">
                            {formatCurrency(formData.tax_amount)}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-[#64748B]">Discount:</span>
                          <div className="flex items-center space-x-2">
                            <input
                              type="number"
                              name="discount_amount"
                              value={formData.discount_amount}
                              onChange={(e) => {
                                const discount =
                                  parseFloat(e.target.value) || 0;
                                const totals = calculateInvoiceTotals(
                                  formData.items,
                                  discount,
                                );
                                setFormData((prev) => ({
                                  ...prev,
                                  discount_amount: discount,
                                  ...totals,
                                }));
                              }}
                              min="0"
                              step="0.01"
                              className="w-24 px-2 py-1 border border-[#CBD5E1] rounded text-sm text-right focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]"
                              placeholder="0"
                            />
                          </div>
                        </div>
                        <div className="flex justify-between text-base font-bold border-t border-[#E2E8F0] pt-2">
                          <span className="text-[#0F172A]">Total:</span>
                          <span className="text-[#2563EB]">
                            {formatCurrency(formData.total_amount)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Status (for edit mode only) */}
                    {editingInvoice && (
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
                          <option value="paid">Paid</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                    )}

                    {/* Info Note */}
                    <div className="bg-[#F8FAFC] rounded-lg p-3 border border-[#E2E8F0]">
                      <p className="text-xs text-[#64748B]">
                        <span className="font-medium text-[#334155]">
                          Note:
                        </span>{" "}
                        The invoice will be sent to the customer's email address
                        when marked as sent. Make sure all details are correct.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side - Preview - Always visible when isFullScreen is true */}
              <div
                className={`${isFullScreen ? "w-1/2" : "w-0"} overflow-y-auto bg-[#F8FAFC] transition-all duration-300`}
              >
                {isFullScreen && (
                  <div className="p-6">
                    <InvoicePreview
                      formData={formData}
                      selectedCustomer={selectedCustomer}
                      formatCurrency={formatCurrency}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HandleInvoices;
