// pages/super-admin/OrganizationSettings.jsx
import React, { useState, useEffect, useRef } from 'react';
import {
  Settings,
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Globe,
  FileText,
  ToggleLeft,
  ToggleRight,
  Eye,
  EyeOff,
  Power,
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
} from 'lucide-react';
import { api } from '../../../utils/app';
import toast from 'react-hot-toast';

const OrganizationSettings = () => {
  const [fields, setFields] = useState([]);
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingField, setEditingField] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [filterCountry, setFilterCountry] = useState('all');
  const itemsPerPage = 10;

  // Country search dropdown state
  const [countrySearchTerm, setCountrySearchTerm] = useState('');
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const countryDropdownRef = useRef(null);

  // Field types
  const fieldTypes = [
    { value: 'text', label: 'Text' },
    { value: 'number', label: 'Number' },
    { value: 'email', label: 'Email' },
    { value: 'date', label: 'Date' },
    { value: 'file', label: 'File Upload' },
    { value: 'select', label: 'Dropdown' },
    { value: 'checkbox', label: 'Checkbox' },
    { value: 'radio', label: 'Radio Button' },
    { value: 'textarea', label: 'Text Area' },
  ];

  // Form state - changed from country_id to country
  const [formData, setFormData] = useState({
    country: '',
    field_key: '',
    field_label: '',
    field_type: 'text',
    is_required: true,
    is_active: true,
  });

  const [formErrors, setFormErrors] = useState({});

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  // Handle click outside to close country dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (countryDropdownRef.current && !countryDropdownRef.current.contains(event.target)) {
        setIsCountryDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Scroll to top when form is shown
  useEffect(() => {
    if (showForm) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [showForm]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch both countries and fields in parallel
      const [countriesResponse, fieldsResponse] = await Promise.all([
        api.get('/super/countries'),
        api.get('/super/country-fields')
      ]);

      if (countriesResponse.data.success) {
        setCountries(countriesResponse.data.data);
      } else {
        throw new Error(countriesResponse.data.message || 'Failed to fetch countries');
      }

      if (fieldsResponse.data.success) {
        setFields(fieldsResponse.data.data);
      } else {
        throw new Error(fieldsResponse.data.message || 'Failed to fetch fields');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setError(error.message || 'Failed to fetch data');
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.country) {
      errors.country = 'Country is required';
    }
    if (!formData.field_key?.trim()) {
      errors.field_key = 'Field key is required';
    } else if (!/^[a-z_]+$/.test(formData.field_key)) {
      errors.field_key = 'Field key must contain only lowercase letters and underscores';
    }
    if (!formData.field_label?.trim()) {
      errors.field_label = 'Field label is required';
    }
    if (!formData.field_type) {
      errors.field_type = 'Field type is required';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
    setFormData(prev => ({
      ...prev,
      country: country.slug // Send slug to API
    }));
    setCountrySearchTerm('');
    setIsCountryDropdownOpen(false);
    if (formErrors.country) {
      setFormErrors(prev => ({ ...prev, country: '' }));
    }
  };

  const resetForm = () => {
    setFormData({
      country: '',
      field_key: '',
      field_label: '',
      field_type: 'text',
      is_required: true,
      is_active: true,
    });
    setSelectedCountry(null);
    setCountrySearchTerm('');
    setFormErrors({});
    setEditingField(null);
    setShowForm(false);
  };

  const handleEdit = (field) => {
    setEditingField(field);
    // Find the country object for this field
    const country = countries.find(c => c.slug === field.country);
    setSelectedCountry(country || null);
    
    setFormData({
      country: field.country,
      field_key: field.field_key,
      field_label: field.field_label,
      field_type: field.field_type,
      is_required: field.is_required,
      is_active: field.is_active,
    });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      let response;
      if (editingField) {
        // Update existing field
        response = await api.put(`/super/country-fields/${editingField.id}`, formData);
        toast.success('Field updated successfully');
      } else {
        // Create new field
        response = await api.post('/super/country-fields', formData);
        toast.success('Field created successfully');
      }

      if (response.data.success) {
        setSuccess(editingField ? 'Field updated successfully' : 'Field created successfully');
        await fetchData(); // Refresh both countries and fields
        resetForm();
        
        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(null), 3000);
      } else {
        throw new Error(response.data.message || 'Failed to save field');
      }
    } catch (error) {
      console.error('Error saving field:', error);
      const errorMsg = error.response?.data?.message || error.message || 'Failed to save field';
      
      // Handle validation errors
      if (error.response?.data?.errors) {
        const backendErrors = {};
        Object.keys(error.response.data.errors).forEach(key => {
          backendErrors[key] = error.response.data.errors[key][0];
        });
        setFormErrors(backendErrors);
      } else {
        setError(errorMsg);
      }
      
      toast.error(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    setSubmitting(true);
    try {
      const response = await api.delete(`/super/country-fields/${id}`);
      
      if (response.data.success) {
        toast.success('Field deleted successfully');
        await fetchData();
        setDeleteConfirm(null);
      } else {
        throw new Error(response.data.message || 'Failed to delete field');
      }
    } catch (error) {
      console.error('Error deleting field:', error);
      toast.error(error.message || 'Failed to delete field');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (field) => {
    try {
      const response = await api.post(`/super-admin/country-fields/${field.id}/toggle-status`);
      
      if (response.data.success) {
        toast.success(`Field ${field.is_active ? 'deactivated' : 'activated'} successfully`);
        await fetchData();
      } else {
        throw new Error(response.data.message || 'Failed to toggle status');
      }
    } catch (error) {
      console.error('Error toggling status:', error);
      toast.error(error.message || 'Failed to update status');
    }
  };

  const handleToggleRequired = async (field) => {
    try {
      const response = await api.post(`/super-admin/country-fields/${field.id}/toggle-required`);
      
      if (response.data.success) {
        toast.success(`Field ${field.is_required ? 'optional' : 'required'} updated`);
        await fetchData();
      } else {
        throw new Error(response.data.message || 'Failed to toggle required');
      }
    } catch (error) {
      console.error('Error toggling required:', error);
      toast.error(error.message || 'Failed to update required status');
    }
  };

  // Get country name by slug
  const getCountryName = (countrySlug) => {
    const country = countries.find(c => c.slug === countrySlug);
    return country ? country.name : countrySlug;
  };

  // Filter countries for dropdown search
  const filteredCountries = countries
    .filter(country => country.is_active)
    .filter(country => 
      country.name.toLowerCase().includes(countrySearchTerm.toLowerCase()) ||
      country.slug.toLowerCase().includes(countrySearchTerm.toLowerCase())
    );

  // Filter fields based on search and country
  const filteredFields = fields.filter(field => {
    const countryName = getCountryName(field.country).toLowerCase();
    const matchesSearch = field.field_label.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         field.field_key.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         countryName.includes(searchTerm.toLowerCase());
    const matchesCountry = filterCountry === 'all' || field.country === filterCountry;
    return matchesSearch && matchesCountry;
  });

  // Pagination
  const totalPages = Math.ceil(filteredFields.length / itemsPerPage);
  const paginatedFields = filteredFields.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getFieldTypeIcon = (type) => {
    switch (type) {
      case 'file':
        return <FileText className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#2563EB] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#64748B]">Loading organization fields...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Header */}
      <header className="bg-white border-b border-[#E2E8F0] sticky top-0 z-10">
        <div className="px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-[#0F172A] flex items-center gap-2">
                <Settings className="w-6 h-6 text-[#2563EB]" />
                Organization Settings
              </h1>
              <p className="text-sm text-[#64748B] mt-1">
                Manage country-specific fields for organization registration
              </p>
            </div>

            <button
              onClick={fetchData}
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
        {success && (
          <div className="mb-6 bg-[#DCFCE7] border border-[#22C55E]/20 rounded-lg p-4 flex items-start space-x-3">
            <CheckCircle className="w-5 h-5 text-[#15803D] flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-[#15803D]">{success}</p>
            </div>
            <button
              onClick={() => setSuccess(null)}
              className="text-[#15803D] hover:text-[#0F6B3D]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-[#FEE2E2] border border-[#EF4444]/20 rounded-lg p-4 flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-[#B91C1C] flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-[#B91C1C]">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-[#B91C1C] hover:text-[#991B1B]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Add Button */}
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="mb-6 px-4 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-lg text-sm font-medium transition-colors flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Field</span>
          </button>
        )}

        {/* Form Section */}
        {showForm && (
          <div className="mb-8 bg-white rounded-xl border border-[#E2E8F0] shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-between">
              <h2 className="text-lg font-semibold text-[#0F172A]">
                {editingField ? 'Edit Field' : 'Add New Field'}
              </h2>
              <button
                onClick={resetForm}
                className="p-2 hover:bg-white rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-[#64748B]" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-2 gap-6">
                {/* Country Field with Search */}
                <div ref={countryDropdownRef}>
                  <label className="block text-sm font-medium text-[#334155] mb-1">
                    Country *
                  </label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
                      className={`w-full px-4 py-2 border ${
                        formErrors.country ? 'border-[#EF4444]' : 'border-[#CBD5E1]'
                      } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] flex items-center justify-between bg-white`}
                    >
                      <span className={selectedCountry ? 'text-[#0F172A]' : 'text-[#94A3B8]'}>
                        {selectedCountry ? selectedCountry.name : 'Select a country...'}
                      </span>
                      <ChevronDown className="w-4 h-4 text-[#64748B]" />
                    </button>

                    {isCountryDropdownOpen && (
                      <div className="absolute z-50 w-full mt-1 bg-white border border-[#E2E8F0] rounded-lg shadow-lg max-h-96 overflow-hidden">
                        {/* Search input */}
                        <div className="p-2 border-b border-[#E2E8F0]">
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
                            <input
                              type="text"
                              placeholder="Search countries..."
                              value={countrySearchTerm}
                              onChange={(e) => setCountrySearchTerm(e.target.value)}
                              className="w-full pl-9 pr-4 py-2 border border-[#CBD5E1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] text-sm"
                              autoFocus
                            />
                          </div>
                        </div>

                        {/* Countries list */}
                        <div className="max-h-60 overflow-y-auto">
                          {filteredCountries.length === 0 ? (
                            <div className="px-4 py-3 text-sm text-[#64748B] text-center">
                              No countries found
                            </div>
                          ) : (
                            filteredCountries.map(country => (
                              <button
                                key={country.id}
                                type="button"
                                onClick={() => handleCountrySelect(country)}
                                className={`w-full px-4 py-2.5 text-left hover:bg-[#F8FAFC] transition-colors flex items-center gap-2 ${
                                  selectedCountry?.id === country.id ? 'bg-[#EFF6FF]' : ''
                                }`}
                              >
                                <Globe className={`w-4 h-4 ${
                                  selectedCountry?.id === country.id ? 'text-[#2563EB]' : 'text-[#64748B]'
                                }`} />
                                <div>
                                  <span className={`text-sm ${
                                    selectedCountry?.id === country.id ? 'font-medium text-[#2563EB]' : 'text-[#0F172A]'
                                  }`}>
                                    {country.name}
                                  </span>
                                  <span className="text-xs text-[#64748B] ml-2">
                                    ({country.slug})
                                  </span>
                                </div>
                              </button>
                            ))
                          )}
                        </div>

                        {/* Footer with count */}
                        <div className="px-4 py-2 border-t border-[#E2E8F0] bg-[#F8FAFC]">
                          <p className="text-xs text-[#64748B]">
                            {filteredCountries.length} countries found
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                  {formErrors.country && (
                    <p className="text-xs text-[#EF4444] mt-1">{formErrors.country}</p>
                  )}
                </div>

                {/* Field Type */}
                <div>
                  <label className="block text-sm font-medium text-[#334155] mb-1">
                    Field Type *
                  </label>
                  <select
                    name="field_type"
                    value={formData.field_type}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border ${
                      formErrors.field_type ? 'border-[#EF4444]' : 'border-[#CBD5E1]'
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]`}
                  >
                    {fieldTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                  {formErrors.field_type && (
                    <p className="text-xs text-[#EF4444] mt-1">{formErrors.field_type}</p>
                  )}
                </div>

                {/* Field Key */}
                <div>
                  <label className="block text-sm font-medium text-[#334155] mb-1">
                    Field Key *
                  </label>
                  <input
                    type="text"
                    name="field_key"
                    value={formData.field_key}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border ${
                      formErrors.field_key ? 'border-[#EF4444]' : 'border-[#CBD5E1]'
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]`}
                    placeholder="e.g., tax_file, business_license"
                  />
                  {formErrors.field_key && (
                    <p className="text-xs text-[#EF4444] mt-1">{formErrors.field_key}</p>
                  )}
                  <p className="text-xs text-[#64748B] mt-1">
                    Unique identifier for the field (snake_case)
                  </p>
                </div>

                {/* Field Label */}
                <div>
                  <label className="block text-sm font-medium text-[#334155] mb-1">
                    Field Label *
                  </label>
                  <input
                    type="text"
                    name="field_label"
                    value={formData.field_label}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border ${
                      formErrors.field_label ? 'border-[#EF4444]' : 'border-[#CBD5E1]'
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]`}
                    placeholder="e.g., Income Tax File"
                  />
                  {formErrors.field_label && (
                    <p className="text-xs text-[#EF4444] mt-1">{formErrors.field_label}</p>
                  )}
                </div>

                {/* Status Toggles */}
                <div className="col-span-2 flex items-center space-x-6 pt-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="is_required"
                      checked={formData.is_required}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-[#2563EB] rounded border-[#CBD5E1] focus:ring-[#2563EB]"
                    />
                    <span className="text-sm text-[#334155]">Required field</span>
                  </label>

                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="is_active"
                      checked={formData.is_active}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-[#2563EB] rounded border-[#CBD5E1] focus:ring-[#2563EB]"
                    />
                    <span className="text-sm text-[#334155]">Active</span>
                  </label>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end space-x-3 pt-6 mt-4 border-t border-[#E2E8F0]">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 border border-[#CBD5E1] rounded-lg text-sm font-medium text-[#334155] hover:bg-[#F8FAFC] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 flex items-center space-x-2"
                >
                  {submitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>{editingField ? 'Update' : 'Save'} Field</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Filters and Search */}
        <div className="mb-6 flex items-center space-x-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
            <input
              type="text"
              placeholder="Search fields..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-[#CBD5E1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]"
            />
          </div>

          <select
            value={filterCountry}
            onChange={(e) => {
              setFilterCountry(e.target.value);
              setCurrentPage(1);
            }}
            className="px-4 py-2 border border-[#CBD5E1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]"
          >
            <option value="all">All Countries</option>
            {countries
              .filter(country => country.is_active)
              .map(country => (
                <option key={country.id} value={country.slug}>
                  {country.name}
                </option>
              ))}
          </select>
        </div>

        {/* Fields Table */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#64748B] uppercase tracking-wider">
                  Country
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#64748B] uppercase tracking-wider">
                  Field Key
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#64748B] uppercase tracking-wider">
                  Field Label
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#64748B] uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#64748B] uppercase tracking-wider">
                  Required
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#64748B] uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#64748B] uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-[#64748B] uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {paginatedFields.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-8 text-center text-[#64748B]">
                    {searchTerm || filterCountry !== 'all' 
                      ? 'No fields found matching your filters' 
                      : 'No fields found. Click "Add New Field" to create one.'}
                  </td>
                </tr>
              ) : (
                paginatedFields.map((field) => {
                  const countryName = getCountryName(field.country);
                  return (
                    <tr key={field.id} className="hover:bg-[#F8FAFC] transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Globe className="w-4 h-4 text-[#64748B]" />
                          <span className="text-sm font-medium text-[#0F172A]">
                            {countryName}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <code className="text-sm bg-[#F1F5F9] px-2 py-1 rounded text-[#334155]">
                          {field.field_key}
                        </code>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-[#0F172A]">
                          {field.field_label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {getFieldTypeIcon(field.field_type)}
                          <span className="text-sm text-[#64748B] capitalize">
                            {field.field_type}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleToggleRequired(field)}
                          className={`inline-flex items-center px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                            field.is_required
                              ? 'bg-[#F59E0B] text-white hover:bg-[#D97706]'
                              : 'bg-[#94A3B8] text-white hover:bg-[#64748B]'
                          }`}
                        >
                          {field.is_required ? 'Required' : 'Optional'}
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleToggleStatus(field)}
                          className={`inline-flex items-center px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                            field.is_active
                              ? 'bg-[#22C55E] text-white hover:bg-[#16A34A]'
                              : 'bg-[#EF4444] text-white hover:bg-[#DC2626]'
                          }`}
                        >
                          <Power className="w-3 h-3 mr-1" />
                          {field.is_active ? 'Active' : 'Inactive'}
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-[#64748B]">
                          {new Date(field.created_at).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleEdit(field)}
                            className="p-1 hover:bg-[#F1F5F9] rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4 text-[#64748B]" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(field)}
                            className="p-1 hover:bg-[#F1F5F9] rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4 text-[#EF4444]" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-between">
              <p className="text-sm text-[#64748B]">
                Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredFields.length)} of {filteredFields.length} entries
              </p>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-2 border border-[#CBD5E1] rounded-lg hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4 text-[#64748B]" />
                </button>
                <span className="text-sm text-[#64748B]">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="p-2 border border-[#CBD5E1] rounded-lg hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-4 h-4 text-[#64748B]" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Info Card */}
        <div className="mt-6 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0] p-4">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-[#2563EB] flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-[#0F172A]">
                About Organization Fields
              </h4>
              <p className="text-xs text-[#64748B] mt-1">
                These fields determine what information organizations need to provide when registering 
                in different countries. You can make fields required or optional, and activate/deactivate 
                them as needed. Field keys should be unique and use snake_case format.
              </p>
              <p className="text-xs text-[#64748B] mt-2">
                <span className="font-medium">Total Countries:</span> {countries.length} | 
                <span className="font-medium ml-2">Active Countries:</span> {countries.filter(c => c.is_active).length} |
                <span className="font-medium ml-2">Total Fields:</span> {fields.length}
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="px-6 py-4 border-b border-[#E2E8F0]">
              <h3 className="text-lg font-semibold text-[#0F172A]">
                Confirm Delete
              </h3>
            </div>
            <div className="p-6">
              <p className="text-[#334155]">
                Are you sure you want to delete the field "{deleteConfirm.field_label}"? 
                This action cannot be undone and may affect organization registrations.
              </p>
            </div>
            <div className="px-6 py-4 border-t border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-end space-x-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 border border-[#CBD5E1] rounded-lg text-sm font-medium text-[#334155] hover:bg-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm.id)}
                disabled={submitting}
                className="px-4 py-2 bg-[#EF4444] hover:bg-[#DC2626] text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 flex items-center space-x-2"
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    <span>Delete</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrganizationSettings;