// components/companies/ImpersonateModal.jsx
import React, { useState } from 'react';
import { X, AlertTriangle, LogIn } from 'lucide-react';

const ImpersonateModal = ({ company, isOpen, onClose, onConfirm }) => {
  const [reason, setReason] = useState('');
  const [understands, setUnderstands] = useState(false);

  if (!isOpen || !company) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative bg-white rounded-xl shadow-2xl max-w-md w-full">
          {/* Header */}
          <div className="px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-[#F59E0B]/10 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-[#F59E0B]" />
              </div>
              <h3 className="text-lg font-semibold text-[#0F172A]">Login as Company</h3>
            </div>
            <button onClick={onClose} className="p-1 hover:bg-[#F1F5F9] rounded-lg">
              <X className="w-5 h-5 text-[#64748B]" />
            </button>
          </div>

          {/* Content */}
          <div className="px-6 py-4">
            <div className="mb-4">
              <p className="text-sm text-[#64748B] mb-2">
                You are about to login as:
              </p>
              <div className="bg-[#F8FAFC] rounded-lg p-3">
                <p className="font-medium text-[#0F172A]">{company.name}</p>
                <p className="text-sm text-[#64748B]">{company.email}</p>
                <p className="text-xs text-[#64748B] mt-1">Plan: {company.plan}</p>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-[#334155] mb-1">
                Reason for impersonation <span className="text-[#EF4444]">*</span>
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="e.g., Technical support, Account review..."
                rows="3"
                className="w-full px-3 py-2 border border-[#CBD5E1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]"
              />
            </div>

            <div className="mb-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={understands}
                  onChange={(e) => setUnderstands(e.target.checked)}
                  className="rounded border-[#CBD5E1] text-[#2563EB] focus:ring-[#2563EB]"
                />
                <span className="text-sm text-[#334155]">
                  I understand that all actions will be logged for audit purposes
                </span>
              </label>
            </div>

            <div className="bg-[#FEF3C7] border border-[#F59E0B]/20 rounded-lg p-3">
              <p className="text-xs text-[#B45309]">
                <strong>Warning:</strong> You will have full access to this company's dashboard. 
                All activities will be recorded in the audit log.
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-[#F8FAFC] border-t border-[#E2E8F0] flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-[#CBD5E1] rounded-lg text-sm font-medium text-[#334155] hover:bg-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={!reason || !understands}
              className="px-4 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <LogIn className="w-4 h-4" />
              <span>Login as {company.name}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImpersonateModal;