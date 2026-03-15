// pages/settings/HandleInvoiceTemplate.jsx
import React, { useState, useEffect } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
  AlertCircle,
  Save,
  X,
  RefreshCw,
  Upload,
  Image as ImageIcon,
  Search,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { api } from '../../../utils/app';
import toast from 'react-hot-toast';

const HandleInvoiceTemplate = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const itemsPerPage = 10;
  const STORAGE_URL =  import.meta.env.VITE_STORAGE_URL

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    preview_image: null,
    status: true,
  });

  const [formErrors, setFormErrors] = useState({});

  // Fetch templates on component mount
  useEffect(() => {
    fetchTemplates();
  }, []);

  // Scroll to top when form is shown
  useEffect(() => {
    if (showForm) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [showForm]);

  const fetchTemplates = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/super/invoice-templates');
      if (response.data.success) {
        setTemplates(response.data.data);
      } else {
        throw new Error(response.data.message || 'Failed to fetch templates');
      }
    } catch (error) {
      console.error('Error fetching templates:', error);
      setError(error.message || 'Failed to fetch templates');
      toast.error('Failed to load templates');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name?.trim()) {
      errors.name = 'Template name is required';
    }
    if (!editingTemplate && !imageFile) {
      errors.preview_image = 'Preview image is required';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setFormErrors(prev => ({ ...prev, preview_image: 'Please select an image file' }));
        return;
      }
      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        setFormErrors(prev => ({ ...prev, preview_image: 'Image size should be less than 2MB' }));
        return;
      }

      setImageFile(file);
      setFormData(prev => ({ ...prev, preview_image: file }));

      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);

      // Clear error
      if (formErrors.preview_image) {
        setFormErrors(prev => ({ ...prev, preview_image: '' }));
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      preview_image: null,
      status: true,
    });
    setImageFile(null);
    setImagePreview(null);
    setFormErrors({});
    setEditingTemplate(null);
    setShowForm(false);
  };

  const handleEdit = (template) => {
    setEditingTemplate(template);
    setFormData({
      name: template.name,
      preview_image: null, // Don't set the file, we'll keep existing
      status: template.status,
    });
    setImagePreview(template.preview_image ? 
      `${STORAGE_URL}/${template.preview_image}` : null);
    setImageFile(null);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('status', formData.status ? '1' : '0');
      
      if (imageFile) {
        formDataToSend.append('preview_image', imageFile);
      }

      let response;
      if (editingTemplate) {
        // Update existing template
        response = await api.post(`/super/invoice-templates/${editingTemplate.id}`, formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Template updated successfully');
      } else {
        // Create new template
        response = await api.post('/super/invoice-templates', formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Template created successfully');
      }

      if (response.data.success) {
        setSuccess(editingTemplate ? 'Template updated successfully' : 'Template created successfully');
        await fetchTemplates();
        resetForm();
        
        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(null), 3000);
      } else {
        throw new Error(response.data.message || 'Failed to save template');
      }
    } catch (error) {
      console.error('Error saving template:', error);
      const errorMsg = error.response?.data?.message || error.message || 'Failed to save template';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    setSubmitting(true);
    try {
      const response = await api.delete(`/super/invoice-templates/${id}`);
      
      if (response.data.success) {
        toast.success('Template deleted successfully');
        await fetchTemplates();
        setDeleteConfirm(null);
      } else {
        throw new Error(response.data.message || 'Failed to delete template');
      }
    } catch (error) {
      console.error('Error deleting template:', error);
      toast.error(error.message || 'Failed to delete template');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (template) => {
    try {
      const response = await api.post(`/org/invoice-templates/${template.id}/toggle-status`);
      
      if (response.data.success) {
        toast.success(`Template ${template.status ? 'deactivated' : 'activated'} successfully`);
        await fetchTemplates();
      } else {
        throw new Error(response.data.message || 'Failed to toggle status');
      }
    } catch (error) {
      console.error('Error toggling status:', error);
      toast.error(error.message || 'Failed to update status');
    }
  };

  // Filter templates based on search
  const filteredTemplates = templates.filter(template =>
    template.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filteredTemplates.length / itemsPerPage);
  const paginatedTemplates = filteredTemplates.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#2563EB] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#64748B]">Loading templates...</p>
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
              <h1 className="text-2xl font-bold text-[#0F172A]">
                Invoice Templates
              </h1>
              <p className="text-sm text-[#64748B] mt-1">
                Manage your invoice templates
              </p>
            </div>

            <button
              onClick={fetchTemplates}
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
            <span>Add New Template</span>
          </button>
        )}

        {/* Form Section - Appears at top when add/edit is clicked */}
        {showForm && (
          <div className="mb-8 bg-white rounded-xl border border-[#E2E8F0] shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-between">
              <h2 className="text-lg font-semibold text-[#0F172A]">
                {editingTemplate ? 'Edit Template' : 'Add New Template'}
              </h2>
              <button
                onClick={resetForm}
                className="p-2 hover:bg-white rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-[#64748B]" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-6">
                {/* Name Field */}
                <div>
                  <label className="block text-sm font-medium text-[#334155] mb-1">
                    Template Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full max-w-md px-4 py-2 border ${
                      formErrors.name ? 'border-[#EF4444]' : 'border-[#CBD5E1]'
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]`}
                    placeholder="e.g., Modern Template"
                  />
                  {formErrors.name && (
                    <p className="text-xs text-[#EF4444] mt-1">{formErrors.name}</p>
                  )}
                </div>

                {/* Image Upload Field */}
                <div>
                  <label className="block text-sm font-medium text-[#334155] mb-1">
                    Preview Image {!editingTemplate && '*'}
                  </label>
                  <div className="flex items-start space-x-6">
                    <div className="flex-1">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                        id="image-upload"
                      />
                      <label
                        htmlFor="image-upload"
                        className="inline-flex items-center px-4 py-2 border border-[#CBD5E1] rounded-lg text-sm font-medium text-[#334155] hover:bg-[#F8FAFC] cursor-pointer transition-colors"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Choose Image
                      </label>
                      <p className="text-xs text-[#64748B] mt-2">
                        Recommended: PNG or JPG, max 2MB
                      </p>
                      {formErrors.preview_image && (
                        <p className="text-xs text-[#EF4444] mt-1">{formErrors.preview_image}</p>
                      )}
                    </div>

                    {/* Image Preview */}
                    {(imagePreview || (editingTemplate && !imageFile && formData.preview_image)) && (
                      <div className="flex-shrink-0">
                        <div className="w-32 h-32 border border-[#E2E8F0] rounded-lg overflow-hidden bg-[#F8FAFC]">
                          <img
                            src={imagePreview || `${STORAGE_URL}/${editingTemplate?.preview_image}`}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Status Field */}
                <div>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="status"
                      checked={formData.status}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-[#2563EB] rounded border-[#CBD5E1] focus:ring-[#2563EB]"
                    />
                    <span className="text-sm text-[#334155]">Active</span>
                  </label>
                  <p className="text-xs text-[#64748B] mt-1 ml-6">
                    Inactive templates won't be available for selection
                  </p>
                </div>

                {/* Form Actions */}
                <div className="flex justify-end space-x-3 pt-4 border-t border-[#E2E8F0]">
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
                        <span>{editingTemplate ? 'Update' : 'Save'} Template</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
            <input
              type="text"
              placeholder="Search templates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-[#CBD5E1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]"
            />
          </div>
        </div>

        {/* Templates Table */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#64748B] uppercase tracking-wider">
                  Preview
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#64748B] uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#64748B] uppercase tracking-wider">
                  Slug
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#64748B] uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#64748B] uppercase tracking-wider">
                  Created At
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-[#64748B] uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {paginatedTemplates.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-[#64748B]">
                    {searchTerm ? 'No templates found matching your search' : 'No templates found. Click "Add New Template" to create one.'}
                  </td>
                </tr>
              ) : (
                paginatedTemplates.map((template) => (
                  <tr key={template.id} className="hover:bg-[#F8FAFC] transition-colors">
                    <td className="px-6 py-4">
                      <div className="w-16 h-16 border border-[#E2E8F0] rounded-lg overflow-hidden bg-[#F8FAFC]">
                        <img
                          src={`${STORAGE_URL}/${template.preview_image}`}
                          alt={template.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://via.placeholder.com/64x64?text=No+Image';
                          }}
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-[#0F172A] capitalize">
                        {template.name}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-[#64748B]">
                        {template.slug}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggleStatus(template)}
                        className={`inline-flex items-center px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                          template.status
                            ? 'bg-[#22C55E] text-white hover:bg-[#16A34A]'
                            : 'bg-[#EF4444] text-white hover:bg-[#DC2626]'
                        }`}
                      >
                        {template.status ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-[#64748B]">
                        {new Date(template.created_at).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleEdit(template)}
                          className="p-1 hover:bg-[#F1F5F9] rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4 text-[#64748B]" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(template)}
                          className="p-1 hover:bg-[#F1F5F9] rounded-lg transition-colors"
                          title="Delete"
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

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-between">
              <p className="text-sm text-[#64748B]">
                Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredTemplates.length)} of {filteredTemplates.length} entries
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
                Are you sure you want to delete the template "{deleteConfirm.name}"? 
                This action cannot be undone.
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

export default HandleInvoiceTemplate;