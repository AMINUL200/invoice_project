// pages/superadmin/CountrySettings.jsx
import React, { useState, useEffect } from 'react';
import {
  Globe,
  Plus,
  Edit2,
  Trash2,
  X,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
  Search,
  Power,
  Save
} from 'lucide-react';
import { api } from '../../../utils/app';
import toast from 'react-hot-toast';

const CountrySettings = () => {
  const [countries, setCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [apiSuccess, setApiSuccess] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editingCountry, setEditingCountry] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    is_active: true
  });
  const [formErrors, setFormErrors] = useState({});

  // Fetch countries on component mount
  useEffect(() => {
    fetchCountries();
  }, []);

  // Filter countries based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredCountries(countries);
    } else {
      const filtered = countries.filter(country =>
        country.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCountries(filtered);
    }
  }, [searchTerm, countries]);

  const fetchCountries = async () => {
    setLoading(true);
    setApiError(null);
    
    try {
      const response = await api.get('/super/countries');
      
      if (response.data?.success && response.data?.data) {
        setCountries(response.data.data);
        setFilteredCountries(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching countries:', error);
      setApiError(error.response?.data?.message || 'Failed to fetch countries');
      toast.error('Failed to fetch countries');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.name?.trim()) {
      errors.name = 'Country name is required';
    } else if (formData.name.length < 2) {
      errors.name = 'Country name must be at least 2 characters';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const resetForm = () => {
    setFormData({
      name: '',
      is_active: true
    });
    setFormErrors({});
    setEditingCountry(null);
  };

  const handleAddClick = () => {
    resetForm();
    setShowModal(true);
  };

  const handleEditClick = (country) => {
    setEditingCountry(country);
    setFormData({
      name: country.name,
      is_active: country.is_active
    });
    setShowModal(true);
  };

  const handleDeleteClick = (country) => {
    setDeleteConfirm(country);
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setSaving(true);
    setApiError(null);
    setApiSuccess(null);

    try {
      const payload = {
        name: formData.name.trim(),
        is_active: formData.is_active
      };

      let response;
      if (editingCountry) {
        // Update existing country
        response = await api.put(`/super/countries/${editingCountry.id}`, payload);
        toast.success(response.data?.message || 'Country updated successfully');
      } else {
        // Create new country
        response = await api.post('/super/countries', payload);
        toast.success(response.data?.message || 'Country added successfully');
      }

      setApiSuccess(response.data?.message || (editingCountry ? 'Country updated successfully' : 'Country added successfully'));
      
      // Refresh the list
      await fetchCountries();
      
      // Close modal and reset form
      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error('Error saving country:', error);
      
      // Handle validation errors
      if (error.response?.data?.errors) {
        const backendErrors = {};
        Object.keys(error.response.data.errors).forEach(key => {
          backendErrors[key] = error.response.data.errors[key][0];
        });
        setFormErrors(backendErrors);
      } else {
        const errorMessage = error.response?.data?.message || error.message || 'Failed to save country';
        setApiError(errorMessage);
        toast.error(errorMessage);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;

    setSaving(true);
    setApiError(null);
    setApiSuccess(null);

    try {
      const response = await api.delete(`/super/countries/${deleteConfirm.id}`);
      
      toast.success(response.data?.message || 'Country deleted successfully');
      setApiSuccess('Country deleted successfully');
      
      // Refresh the list
      await fetchCountries();
      
      // Close delete confirmation
      setDeleteConfirm(null);
    } catch (error) {
      console.error('Error deleting country:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to delete country';
      setApiError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async (country) => {
    try {
      setSaving(true);
      
      const response = await api.post(`/superadmin/countries/${country.id}/toggle-status`);
      
      toast.success(response.data?.message || `Country ${country.is_active ? 'deactivated' : 'activated'} successfully`);
      
      // Refresh the list
      await fetchCountries();
    } catch (error) {
      console.error('Error toggling country status:', error);
      toast.error(error.response?.data?.message || 'Failed to update country status');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#2563EB] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#64748B]">Loading countries...</p>
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
              <h1 className="text-2xl font-bold text-[#0F172A]">Country Settings</h1>
              <p className="text-sm text-[#64748B] mt-1">
                Manage countries and their availability across the platform
              </p>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={fetchCountries}
                className="p-2 border border-[#CBD5E1] rounded-lg hover:bg-[#F8FAFC] transition-colors"
                title="Refresh"
              >
                <RefreshCw className="w-5 h-5 text-[#64748B]" />
              </button>

              <button
                onClick={handleAddClick}
                className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-2 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Country</span>
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

        {/* Error Message */}
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

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#64748B]" />
            <input
              type="text"
              placeholder="Search countries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-[#CBD5E1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]"
            />
          </div>
        </div>

        {/* Countries Table */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm overflow-hidden">
         <div className="max-w-[400px] md:max-w-[700px] lg:max-w-[1140px] overflow-x-auto">
              <table className="w-full min-w-[700px]"> 
              <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-[#64748B] uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-[#64748B] uppercase tracking-wider">
                    Country Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-[#64748B] uppercase tracking-wider">
                    Slug
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-[#64748B] uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-[#64748B] uppercase tracking-wider">
                    Created At
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-[#64748B] uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {filteredCountries.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-[#64748B]">
                      {searchTerm ? 'No countries match your search' : 'No countries found. Click "Add Country" to add one.'}
                    </td>
                  </tr>
                ) : (
                  filteredCountries.map((country) => (
                    <tr key={country.id} className="hover:bg-[#F8FAFC] transition-colors">
                      <td className="px-6 py-4 text-sm text-[#64748B]">
                        #{country.id}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <Globe className="w-5 h-5 text-[#2563EB]" />
                          <span className="text-sm font-medium text-[#0F172A]">
                            {country.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <code className="text-sm text-[#64748B] bg-[#F1F5F9] px-2 py-1 rounded">
                          {country.slug}
                        </code>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleToggleStatus(country)}
                          disabled={saving}
                          className={`inline-flex items-center px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                            country.is_active
                              ? 'bg-[#22C55E] text-white hover:bg-[#16A34A]'
                              : 'bg-[#EF4444] text-white hover:bg-[#DC2626]'
                          }`}
                        >
                          <Power className="w-3 h-3 mr-1" />
                          {country.is_active ? 'Active' : 'Inactive'}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-sm text-[#64748B]">
                        {new Date(country.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleEditClick(country)}
                            className="p-2 hover:bg-[#F1F5F9] rounded-lg transition-colors"
                            title="Edit Country"
                          >
                            <Edit2 className="w-4 h-4 text-[#64748B]" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(country)}
                            className="p-2 hover:bg-[#F1F5F9] rounded-lg transition-colors"
                            title="Delete Country"
                          >
                            <Trash2 className="w-4 h-4 text-[#EF4444]" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Footer with count */}
          <div className="px-6 py-4 border-t border-[#E2E8F0] bg-[#F8FAFC]">
            <p className="text-sm text-[#64748B]">
              Showing {filteredCountries.length} of {countries.length} countries
            </p>
          </div>
        </div>
      </main>

      {/* Add/Edit Country Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between">
              <h3 className="text-lg font-semibold text-[#0F172A]">
                {editingCountry ? 'Edit Country' : 'Add New Country'}
              </h3>
              <button
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className="p-2 hover:bg-[#F1F5F9] rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-[#64748B]" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#334155] mb-1">
                  Country Name <span className="text-[#EF4444]">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border ${
                    formErrors.name ? 'border-[#EF4444]' : 'border-[#CBD5E1]'
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]`}
                  placeholder="e.g., United States"
                  autoFocus
                />
                {formErrors.name && (
                  <p className="text-xs text-[#EF4444] mt-1">{formErrors.name}</p>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="is_active"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-[#2563EB] rounded border-[#CBD5E1] focus:ring-[#2563EB]"
                />
                <label htmlFor="is_active" className="text-sm text-[#334155]">
                  Active (country will be available for selection)
                </label>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-end space-x-3">
              <button
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className="px-4 py-2 border border-[#CBD5E1] rounded-lg text-sm font-medium text-[#334155] hover:bg-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={saving}
                className="px-4 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 flex items-center space-x-2"
              >
                {saving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>{editingCountry ? 'Update' : 'Save'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="px-6 py-4 border-b border-[#E2E8F0]">
              <h3 className="text-lg font-semibold text-[#0F172A]">Confirm Delete</h3>
            </div>
            
            <div className="p-6">
              <div className="flex items-center space-x-3 text-[#EF4444] mb-4">
                <AlertCircle className="w-6 h-6" />
                <p className="text-sm">
                  Are you sure you want to delete <span className="font-semibold">{deleteConfirm.name}</span>?
                </p>
              </div>
              <p className="text-xs text-[#64748B]">
                This action cannot be undone. This will permanently delete the country and may affect organizations using it.
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
                onClick={handleDelete}
                disabled={saving}
                className="px-4 py-2 bg-[#EF4444] hover:bg-[#DC2626] text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 flex items-center space-x-2"
              >
                {saving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    <span>Delete Country</span>
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

export default CountrySettings;