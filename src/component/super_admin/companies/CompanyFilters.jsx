// components/companies/CompanyFilters.jsx
import React from 'react';
import { X } from 'lucide-react';

const CompanyFilters = ({ filters, setFilters, onClose }) => {
  const plans = ['All', 'Basic', 'Professional', 'Enterprise'];
  const statuses = ['All', 'Active', 'Suspended', 'Inactive'];
  const dateRanges = ['All', 'Today', 'This Week', 'This Month', 'This Quarter', 'This Year'];

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value.toLowerCase()
    }));
  };

  const clearFilters = () => {
    setFilters({
      status: 'all',
      plan: 'all',
      dateRange: 'all'
    });
  };

  return (
    <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium text-[#0F172A]">Filters</h3>
        <button onClick={onClose} className="p-1 hover:bg-[#F1F5F9] rounded-lg">
          <X className="w-4 h-4 text-[#64748B]" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Status Filter */}
        <div>
          <label className="block text-sm font-medium text-[#334155] mb-1">
            Status
          </label>
          <select
            value={filters.status === 'all' ? 'All' : filters.status.charAt(0).toUpperCase() + filters.status.slice(1)}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="w-full px-3 py-2 border border-[#CBD5E1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]"
          >
            {statuses.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>

        {/* Plan Filter */}
        <div>
          <label className="block text-sm font-medium text-[#334155] mb-1">
            Plan
          </label>
          <select
            value={filters.plan === 'all' ? 'All' : filters.plan.charAt(0).toUpperCase() + filters.plan.slice(1)}
            onChange={(e) => handleFilterChange('plan', e.target.value)}
            className="w-full px-3 py-2 border border-[#CBD5E1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]"
          >
            {plans.map(plan => (
              <option key={plan} value={plan}>{plan}</option>
            ))}
          </select>
        </div>

        {/* Date Range Filter */}
        <div>
          <label className="block text-sm font-medium text-[#334155] mb-1">
            Joined Date
          </label>
          <select
            value={filters.dateRange === 'all' ? 'All' : filters.dateRange.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
            onChange={(e) => handleFilterChange('dateRange', e.target.value)}
            className="w-full px-3 py-2 border border-[#CBD5E1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]"
          >
            {dateRanges.map(range => (
              <option key={range} value={range}>{range}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Filter Actions */}
      <div className="flex justify-end space-x-2 mt-4">
        <button
          onClick={clearFilters}
          className="px-3 py-1 text-sm text-[#64748B] hover:text-[#334155] transition-colors"
        >
          Clear All
        </button>
        <button
          onClick={onClose}
          className="px-4 py-1 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-lg text-sm font-medium transition-colors"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
};

export default CompanyFilters;