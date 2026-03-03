// components/dashboard/company/QuickActions.jsx
import React from 'react';
import { FileText, UserPlus, FileSignature, DollarSign, ShoppingBag, MoreHorizontal } from 'lucide-react';

const QuickActions = () => {
  const actions = [
    {
      label: 'New Invoice',
      icon: FileText,
      color: 'bg-[#2563EB]',
      hoverColor: 'hover:bg-[#1D4ED8]',
      onClick: () => console.log('New Invoice')
    },
    {
      label: 'Add Customer',
      icon: UserPlus,
      color: 'bg-[#22C55E]',
      hoverColor: 'hover:bg-[#16A34A]',
      onClick: () => console.log('Add Customer')
    },
    {
      label: 'Create Quotation',
      icon: FileSignature,
      color: 'bg-[#8B5CF6]',
      hoverColor: 'hover:bg-[#7C3AED]',
      onClick: () => console.log('Create Quotation')
    },
    {
      label: 'Record Payment',
      icon: DollarSign,
      color: 'bg-[#F59E0B]',
      hoverColor: 'hover:bg-[#D97706]',
      onClick: () => console.log('Record Payment')
    },
    {
      label: 'Purchase Order',
      icon: ShoppingBag,
      color: 'bg-[#EC4899]',
      hoverColor: 'hover:bg-[#DB2777]',
      onClick: () => console.log('Purchase Order')
    }
  ];

  return (
    <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-[#0F172A]">Quick Actions</h3>
        <button className="text-sm text-[#64748B] hover:text-[#334155]">Customize</button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {actions.map((action, index) => {
          const Icon = action.icon;
          return (
            <button
              key={index}
              onClick={action.onClick}
              className={`group flex flex-col items-center justify-center p-4 ${action.color} ${action.hoverColor} rounded-xl text-white transition-all transform hover:scale-105 hover:shadow-lg`}
            >
              <Icon className="w-6 h-6 mb-2" />
              <span className="text-xs font-medium text-center">{action.label}</span>
            </button>
          );
        })}
      </div>

      {/* Keyboard Shortcuts Hint */}
      <div className="mt-4 pt-3 border-t border-[#E2E8F0]">
        <p className="text-xs text-[#64748B] text-center">
          <span className="font-medium text-[#334155]">Pro tip:</span> Press{' '}
          <kbd className="px-1.5 py-0.5 bg-[#F1F5F9] border border-[#CBD5E1] rounded text-xs">N</kbd>{' '}
          for new invoice,{' '}
          <kbd className="px-1.5 py-0.5 bg-[#F1F5F9] border border-[#CBD5E1] rounded text-xs">C</kbd>{' '}
          for customer
        </p>
      </div>
    </div>
  );
};

export default QuickActions;