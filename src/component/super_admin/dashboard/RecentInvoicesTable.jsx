// components/dashboard/RecentInvoicesTable.jsx
import React, { useState } from 'react';
import { Eye, X, Download, Send, Printer, FileText, Calendar, DollarSign, Building2, User, Clock, CheckCircle, AlertCircle } from 'lucide-react';

const statusColors = {
  'Paid': 'bg-[#DCFCE7] text-[#15803D]',
  'Pending': 'bg-[#FEF3C7] text-[#B45309]',
  'Overdue': 'bg-[#FEE2E2] text-[#B91C1C]',
  'Draft': 'bg-[#DBEAFE] text-[#1D4ED8]',
  'Cancelled': 'bg-[#E2E8F0] text-[#475569]'
};

const statusIcons = {
  'Paid': CheckCircle,
  'Pending': Clock,
  'Overdue': AlertCircle,
  'Draft': FileText,
  'Cancelled': X
};

const InvoiceDetailModal = ({ invoice, isOpen, onClose }) => {
  if (!isOpen || !invoice) return null;

  const StatusIcon = statusIcons[invoice.status] || FileText;

  // Dummy line items for the invoice
  const lineItems = [
    { id: 1, description: 'Professional Service Hours', quantity: 10, rate: 150, amount: 1500 },
    { id: 2, description: 'Software License (Annual)', quantity: 2, rate: 500, amount: 1000 },
    { id: 3, description: 'Consultation Fee', quantity: 1, rate: 750, amount: 750 },
  ];

  const subtotal = lineItems.reduce((sum, item) => sum + item.amount, 0);
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + tax;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-[#E2E8F0] px-6 py-4 flex items-center justify-between z-10">
            <div className="flex items-center space-x-4">
              <div className={`p-2 rounded-lg ${statusColors[invoice.status].split(' ')[0]}`}>
                <StatusIcon className={`w-6 h-6 ${statusColors[invoice.status].split(' ')[1]}`} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#0F172A]">Invoice Details</h2>
                <p className="text-sm text-[#64748B]">{invoice.id}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button className="p-2 hover:bg-[#F1F5F9] rounded-lg transition-colors">
                <Download className="w-5 h-5 text-[#64748B]" />
              </button>
              <button className="p-2 hover:bg-[#F1F5F9] rounded-lg transition-colors">
                <Send className="w-5 h-5 text-[#64748B]" />
              </button>
              <button className="p-2 hover:bg-[#F1F5F9] rounded-lg transition-colors">
                <Printer className="w-5 h-5 text-[#64748B]" />
              </button>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-[#F1F5F9] rounded-lg transition-colors ml-2"
              >
                <X className="w-5 h-5 text-[#64748B]" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Status Badge */}
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-sm text-[#64748B]">Status:</span>
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${statusColors[invoice.status]}`}>
                  {invoice.status}
                </span>
              </div>
              <span className="text-sm text-[#64748B]">Issued: {invoice.date}</span>
            </div>

            {/* Company Info Grid */}
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="bg-[#F8FAFC] rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-3">
                  <Building2 className="w-4 h-4 text-[#2563EB]" />
                  <h3 className="font-medium text-[#0F172A]">From</h3>
                </div>
                <p className="font-medium text-[#0F172A]">Your Company Name</p>
                <p className="text-sm text-[#64748B]">123 Business St.</p>
                <p className="text-sm text-[#64748B]">San Francisco, CA 94105</p>
                <p className="text-sm text-[#64748B]">tax@company.com</p>
              </div>

              <div className="bg-[#F8FAFC] rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-3">
                  <User className="w-4 h-4 text-[#2563EB]" />
                  <h3 className="font-medium text-[#0F172A]">To</h3>
                </div>
                <p className="font-medium text-[#0F172A]">{invoice.company}</p>
                <p className="text-sm text-[#64748B]">Attn: Accounts Payable</p>
                <p className="text-sm text-[#64748B]">456 Corporate Ave.</p>
                <p className="text-sm text-[#64748B]">New York, NY 10001</p>
              </div>
            </div>

            {/* Invoice Details */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="border border-[#E2E8F0] rounded-lg p-3">
                <p className="text-xs text-[#64748B] mb-1">Invoice Date</p>
                <p className="font-medium text-[#0F172A]">January 15, 2024</p>
              </div>
              <div className="border border-[#E2E8F0] rounded-lg p-3">
                <p className="text-xs text-[#64748B] mb-1">Due Date</p>
                <p className="font-medium text-[#0F172A]">February 14, 2024</p>
              </div>
              <div className="border border-[#E2E8F0] rounded-lg p-3">
                <p className="text-xs text-[#64748B] mb-1">Payment Terms</p>
                <p className="font-medium text-[#0F172A]">Net 30</p>
              </div>
            </div>

            {/* Line Items Table */}
            <div className="mb-8">
              <h3 className="font-medium text-[#0F172A] mb-4">Invoice Items</h3>
              <table className="w-full">
                <thead className="bg-[#F1F5F9]">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[#334155] uppercase">Description</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-[#334155] uppercase">Quantity</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-[#334155] uppercase">Rate</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-[#334155] uppercase">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8F0]">
                  {lineItems.map((item) => (
                    <tr key={item.id}>
                      <td className="px-4 py-3 text-sm text-[#334155]">{item.description}</td>
                      <td className="px-4 py-3 text-sm text-right text-[#64748B]">{item.quantity}</td>
                      <td className="px-4 py-3 text-sm text-right text-[#64748B]">${item.rate}</td>
                      <td className="px-4 py-3 text-sm text-right font-medium text-[#0F172A]">${item.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Summary */}
            <div className="flex justify-end mb-8">
              <div className="w-72">
                <div className="flex justify-between py-2">
                  <span className="text-sm text-[#64748B]">Subtotal:</span>
                  <span className="text-sm font-medium text-[#0F172A]">${subtotal}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-sm text-[#64748B]">Tax (10%):</span>
                  <span className="text-sm font-medium text-[#0F172A]">${tax}</span>
                </div>
                <div className="flex justify-between py-2 border-t border-[#E2E8F0] mt-2 pt-2">
                  <span className="font-medium text-[#0F172A]">Total:</span>
                  <span className="font-bold text-[#2563EB]">${total}</span>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="border-t border-[#E2E8F0] pt-6">
              <h4 className="text-sm font-medium text-[#0F172A] mb-2">Notes</h4>
              <p className="text-sm text-[#64748B]">
                Thank you for your business. Please make payment by the due date to avoid late fees.
              </p>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="sticky bottom-0 bg-[#F8FAFC] border-t border-[#E2E8F0] px-6 py-4 flex justify-end space-x-3">
            <button className="px-4 py-2 border border-[#CBD5E1] rounded-lg text-sm font-medium text-[#334155] hover:bg-white transition-colors">
              Send Reminder
            </button>
            <button className="px-4 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-lg text-sm font-medium transition-colors">
              Mark as Paid
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const RecentInvoicesTable = ({ invoices }) => {
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewDetails = (invoice) => {
    setSelectedInvoice(invoice);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedInvoice(null);
  };

  return (
    <>
      <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-[#E2E8F0] flex justify-between items-center">
          <h3 className="text-[#0F172A] font-semibold">Recent Invoices</h3>
          <button className="text-sm text-[#2563EB] hover:text-[#1D4ED8] font-medium">
            View All
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#F1F5F9]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#334155] uppercase tracking-wider">
                  Invoice ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#334155] uppercase tracking-wider">
                  Company
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#334155] uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#334155] uppercase tracking-wider">
                  Status
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
              {invoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-[#F8FAFC] transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#334155]">
                    {invoice.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#64748B]">
                    {invoice.company}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#0F172A]">
                    ${invoice.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[invoice.status]}`}>
                      {invoice.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#64748B]">
                    {invoice.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <button 
                      onClick={() => handleViewDetails(invoice)}
                      className="text-[#64748B] hover:text-[#2563EB] transition-colors"
                      title="View Details"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invoice Detail Modal */}
      <InvoiceDetailModal 
        invoice={selectedInvoice}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  );
};

export default RecentInvoicesTable;