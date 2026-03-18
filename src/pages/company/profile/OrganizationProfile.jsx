// pages/organization/OrganizationProfile.jsx
import React, { useState, useEffect } from 'react';
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  FileText,
  CreditCard,
  Settings,
  Bell,
  Edit,
  Save,
  X,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
  Calendar,
  TrendingUp,
  Users,
  Package,
  Plus,
  File,
  Hash,
  AlignLeft,
  CheckSquare,
  Upload,
  Image as ImageIcon,
  Download,
  Eye,
  Trash2
} from 'lucide-react';
import { api } from '../../../utils/app';
import toast from 'react-hot-toast';

const OrganizationProfile = () => {
  const STORAGE_URL = import.meta.env.VITE_STORAGE_URL;
  
  const [organization, setOrganization] = useState(null);
  const [settings, setSettings] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [usage, setUsage] = useState(null);
  const [dynamicFields, setDynamicFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState({});
  const [apiError, setApiError] = useState(null);
  const [apiSuccess, setApiSuccess] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [filePreviews, setFilePreviews] = useState({});
  const [fileUploads, setFileUploads] = useState({});
  
  const [formData, setFormData] = useState({
    company_name: '',
    legal_name: '',
    email: '',
    phone: '',
    gstin: '',
    address: ''
  });
  const [dynamicFormData, setDynamicFormData] = useState({});
  const [formErrors, setFormErrors] = useState({});

  // Fetch organization data
  useEffect(() => {
    fetchOrganizationData();
  }, []);

  const fetchOrganizationData = async () => {
    setLoading(true);
    setApiError(null);
    
    try {
      const response = await api.get('/org/profile');
      
      if (response.data) {
        const data = response.data;
        setOrganization(data.organization);
        setSettings(data.settings);
        setSubscription(data.subscription);
        setUsage(data.usage);
        setDynamicFields(data.dynamic_field || []);
        
        // Initialize form data
        setFormData({
          company_name: data.organization.company_name || '',
          legal_name: data.organization.legal_name || '',
          email: data.organization.email || '',
          phone: data.organization.phone || '',
          gstin: data.organization.gstin || '',
          address: data.organization.address || ''
        });

        // Initialize dynamic fields data
        const dynamicData = {};
        const previews = {};
        
        (data.dynamic_field || []).forEach(field => {
          dynamicData[field.field_key] = field.value || '';
          
          // Initialize file previews for file type fields
          if (field.field_type === 'file' && field.value) {
            previews[field.field_key] = field.value;
          }
        });
        
        setDynamicFormData(dynamicData);
        setFilePreviews(previews);
      }
    } catch (error) {
      console.error('Error fetching organization data:', error);
      setApiError(error.message || 'Failed to fetch organization data');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleDynamicFieldChange = (fieldKey, value) => {
    setDynamicFormData(prev => ({
      ...prev,
      [fieldKey]: value
    }));
  };

  const handleFileChange = async (field, file) => {
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Only images and PDF files are allowed');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size should be less than 5MB');
      return;
    }

    // Create preview for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreviews(prev => ({
          ...prev,
          [field.field_key]: reader.result
        }));
      };
      reader.readAsDataURL(file);
    } else {
      // For PDF files, just store the file name
      setFilePreviews(prev => ({
        ...prev,
        [field.field_key]: file.name
      }));
    }

    // Store the file for upload
    setFileUploads(prev => ({
      ...prev,
      [field.field_key]: file
    }));

    // Clear error for this field
    if (formErrors[field.field_key]) {
      setFormErrors(prev => ({
        ...prev,
        [field.field_key]: ''
      }));
    }
  };

  const handleFileRemove = (fieldKey) => {
    setFilePreviews(prev => {
      const newPreviews = { ...prev };
      delete newPreviews[fieldKey];
      return newPreviews;
    });
    
    setFileUploads(prev => {
      const newUploads = { ...prev };
      delete newUploads[fieldKey];
      return newUploads;
    });

    setDynamicFormData(prev => ({
      ...prev,
      [fieldKey]: ''
    }));
  };

  const handleFileDownload = (filePath, fileName) => {
    if (!filePath) return;
    
    // If it's a full URL or path, open in new tab
    if (filePath.startsWith('http') || filePath.startsWith('/')) {
      window.open(`${STORAGE_URL}/${filePath}`, '_blank');
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.company_name?.trim()) {
      errors.company_name = 'Company name is required';
    }

    if (!formData.legal_name?.trim()) {
      errors.legal_name = 'Legal name is required';
    }

    if (!formData.email?.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }

    if (!formData.phone?.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      errors.phone = 'Phone number must be 10 digits';
    }

    if (formData.gstin && !/^\d{2}[A-Z]{5}\d{4}[A-Z]{1}\d[Z]{1}[A-Z\d]{1}$/.test(formData.gstin)) {
      errors.gstin = 'Invalid GSTIN format (e.g., 29AABCU9603R1ZM)';
    }

    if (!formData.address?.trim()) {
      errors.address = 'Address is required';
    }

    // Validate required dynamic fields
    dynamicFields.forEach(field => {
      if (field.is_required) {
        const value = dynamicFormData[field.field_key];
        const hasFile = filePreviews[field.field_key] || fileUploads[field.field_key];
        
        if (field.field_type === 'file') {
          if (!value && !hasFile) {
            errors[field.field_key] = `${field.field_label} is required`;
          }
        } else {
          if (!value?.trim()) {
            errors[field.field_key] = `${field.field_label} is required`;
          }
        }
      }
    });

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setSaving(true);
    setApiError(null);
    setApiSuccess(null);
    
    try {
      // Create FormData for file uploads
      const formDataToSend = new FormData();
      
      // Add regular fields
      formDataToSend.append('company_name', formData.company_name.trim());
      formDataToSend.append('legal_name', formData.legal_name.trim());
      formDataToSend.append('email', formData.email.trim().toLowerCase());
      formDataToSend.append('phone', formData.phone.replace(/\D/g, ''));
      formDataToSend.append('gstin', formData.gstin?.trim() || '');
      formDataToSend.append('address', formData.address.trim());

      // Add dynamic text fields
      Object.keys(dynamicFormData).forEach(key => {
        const field = dynamicFields.find(f => f.field_key === key);
        if (field && field.field_type !== 'file') {
          formDataToSend.append(key, dynamicFormData[key] || '');
        }
      });

      // Add file uploads
      Object.keys(fileUploads).forEach(key => {
        formDataToSend.append(key, fileUploads[key]);
      });

      const response = await api.post('/org/profile', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      if (response.data) {
        toast.success(response.data.message || 'Organization profile updated successfully');
        setApiSuccess('Organization profile updated successfully');
        
        // Refresh data
        await fetchOrganizationData();
        setIsEditing(false);
        setFileUploads({});
      }
    } catch (error) {
      console.error('Error updating organization:', error);
      
      // Handle validation errors from backend
      if (error.response?.data?.errors) {
        const backendErrors = {};
        Object.keys(error.response.data.errors).forEach(key => {
          backendErrors[key] = error.response.data.errors[key][0];
        });
        setFormErrors(backendErrors);
      } else {
        setApiError(error.response?.data?.message || error.message || 'Failed to update organization');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    // Reset form to original values
    setFormData({
      company_name: organization?.company_name || '',
      legal_name: organization?.legal_name || '',
      email: organization?.email || '',
      phone: organization?.phone || '',
      gstin: organization?.gstin || '',
      address: organization?.address || ''
    });

    // Reset dynamic fields to original values
    const dynamicData = {};
    const previews = {};
    
    dynamicFields.forEach(field => {
      dynamicData[field.field_key] = field.value || '';
      if (field.field_type === 'file' && field.value) {
        previews[field.field_key] = field.value;
      }
    });
    
    setDynamicFormData(dynamicData);
    setFilePreviews(previews);
    setFileUploads({});
    setFormErrors({});
    setIsEditing(false);
  };

  const getFieldIcon = (fieldType) => {
    switch (fieldType) {
      case 'text':
        return <AlignLeft className="w-4 h-4" />;
      case 'number':
        return <Hash className="w-4 h-4" />;
      case 'checkbox':
        return <CheckSquare className="w-4 h-4" />;
      case 'file':
        return <File className="w-4 h-4" />;
      default:
        return <File className="w-4 h-4" />;
    }
  };

  const renderFileField = (field) => {
    const fieldError = formErrors[field.field_key];
    const hasPreview = filePreviews[field.field_key];
    const hasFile = dynamicFormData[field.field_key];
    const isUploading = uploading[field.field_key];

    if (!isEditing) {
      // View mode
      if (!hasFile && !hasPreview) {
        return <p className="text-sm text-[#64748B] italic">No file uploaded</p>;
      }

      const fileUrl = hasPreview && hasPreview.startsWith('data:') 
        ? hasPreview 
        : `${STORAGE_URL}/${hasFile}`;

      const isImage = hasPreview?.startsWith('data:image') || 
                     (hasFile && /\.(jpg|jpeg|png|gif|webp)$/i.test(hasFile));

      return (
        <div className="flex items-center space-x-3">
          {isImage ? (
            <div className="relative group">
              <img
                src={fileUrl}
                alt={field.field_label}
                className="w-16 h-16 object-cover rounded-lg border border-[#E2E8F0]"
              />
              <button
                onClick={() => window.open(fileUrl, '_blank')}
                className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center"
              >
                <Eye className="w-5 h-5 text-white" />
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-2 bg-[#F8FAFC] px-3 py-2 rounded-lg">
              <FileText className="w-5 h-5 text-[#2563EB]" />
              <span className="text-sm text-[#0F172A]">{hasFile?.split('/').pop()}</span>
              <button
                onClick={() => handleFileDownload(hasFile, hasFile?.split('/').pop())}
                className="p-1 hover:bg-[#E2E8F0] rounded transition-colors"
                title="Download"
              >
                <Download className="w-4 h-4 text-[#64748B]" />
              </button>
            </div>
          )}
        </div>
      );
    }

    // Edit mode
    return (
      <div>
        <input
          type="file"
          id={`file-${field.field_key}`}
          accept="image/*,.pdf"
          onChange={(e) => handleFileChange(field, e.target.files[0])}
          className="hidden"
          disabled={isUploading}
        />
        
        <div className="space-y-3">
          {/* File preview */}
          {(hasPreview || hasFile) && (
            <div className="relative inline-block">
              {hasPreview && hasPreview.startsWith('data:image') ? (
                <div className="relative group">
                  <img
                    src={hasPreview}
                    alt="Preview"
                    className="w-24 h-24 object-cover rounded-lg border border-[#E2E8F0]"
                  />
                  <button
                    type="button"
                    onClick={() => handleFileRemove(field.field_key)}
                    className="absolute -top-2 -right-2 p-1 bg-[#EF4444] text-white rounded-full hover:bg-[#DC2626] transition-colors"
                    title="Remove"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ) : hasPreview ? (
                <div className="flex items-center space-x-2 bg-[#F8FAFC] px-3 py-2 rounded-lg">
                  <FileText className="w-5 h-5 text-[#2563EB]" />
                  <span className="text-sm text-[#0F172A]">{hasPreview}</span>
                  <button
                    type="button"
                    onClick={() => handleFileRemove(field.field_key)}
                    className="p-1 hover:bg-[#E2E8F0] rounded transition-colors"
                    title="Remove"
                  >
                    <X className="w-4 h-4 text-[#64748B]" />
                  </button>
                </div>
              ) : hasFile && (
                <div className="flex items-center space-x-2 bg-[#F8FAFC] px-3 py-2 rounded-lg">
                  <FileText className="w-5 h-5 text-[#2563EB]" />
                  <span className="text-sm text-[#0F172A]">{hasFile.split('/').pop()}</span>
                  <button
                    type="button"
                    onClick={() => handleFileRemove(field.field_key)}
                    className="p-1 hover:bg-[#E2E8F0] rounded transition-colors"
                    title="Remove"
                  >
                    <X className="w-4 h-4 text-[#64748B]" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Upload button */}
          <div>
            <label
              htmlFor={`file-${field.field_key}`}
              className={`inline-flex items-center px-4 py-2 border border-[#CBD5E1] rounded-lg text-sm font-medium text-[#334155] hover:bg-[#F8FAFC] cursor-pointer transition-colors ${
                isUploading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isUploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#2563EB] mr-2"></div>
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  <span>{hasPreview || hasFile ? 'Change File' : 'Upload File'}</span>
                </>
              )}
            </label>
            <p className="text-xs text-[#64748B] mt-1">
              Max size: 5MB. Allowed: Images, PDF
            </p>
          </div>
        </div>
      </div>
    );
  };

  const renderDynamicField = (field) => {
    const fieldError = formErrors[field.field_key];
    
    if (field.field_type === 'file') {
      return renderFileField(field);
    }
    
    switch (field.field_type) {
      case 'textarea':
        return (
          <textarea
            value={dynamicFormData[field.field_key] || ''}
            onChange={(e) => handleDynamicFieldChange(field.field_key, e.target.value)}
            disabled={!isEditing}
            rows="3"
            className={`w-full px-4 py-2 border ${
              fieldError ? 'border-[#EF4444]' : 'border-[#CBD5E1]'
            } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] ${
              !isEditing ? 'bg-[#F8FAFC]' : ''
            }`}
            placeholder={`Enter ${field.field_label.toLowerCase()}`}
          />
        );
      
      case 'number':
        return (
          <input
            type="number"
            value={dynamicFormData[field.field_key] || ''}
            onChange={(e) => handleDynamicFieldChange(field.field_key, e.target.value)}
            disabled={!isEditing}
            className={`w-full px-4 py-2 border ${
              fieldError ? 'border-[#EF4444]' : 'border-[#CBD5E1]'
            } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] ${
              !isEditing ? 'bg-[#F8FAFC]' : ''
            }`}
            placeholder={`Enter ${field.field_label.toLowerCase()}`}
          />
        );
      
      case 'checkbox':
        return (
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={dynamicFormData[field.field_key] || false}
              onChange={(e) => handleDynamicFieldChange(field.field_key, e.target.checked)}
              disabled={!isEditing}
              className="w-4 h-4 text-[#2563EB] rounded border-[#CBD5E1] focus:ring-[#2563EB]"
            />
            <span className="text-sm text-[#334155]">Yes</span>
          </div>
        );
      
      case 'select':
        return (
          <select
            value={dynamicFormData[field.field_key] || ''}
            onChange={(e) => handleDynamicFieldChange(field.field_key, e.target.value)}
            disabled={!isEditing}
            className={`w-full px-4 py-2 border ${
              fieldError ? 'border-[#EF4444]' : 'border-[#CBD5E1]'
            } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] ${
              !isEditing ? 'bg-[#F8FAFC]' : ''
            }`}
          >
            <option value="">Select {field.field_label}</option>
            {field.options?.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        );
      
      default: // text input
        return (
          <input
            type="text"
            value={dynamicFormData[field.field_key] || ''}
            onChange={(e) => handleDynamicFieldChange(field.field_key, e.target.value)}
            disabled={!isEditing}
            className={`w-full px-4 py-2 border ${
              fieldError ? 'border-[#EF4444]' : 'border-[#CBD5E1]'
            } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] ${
              !isEditing ? 'bg-[#F8FAFC]' : ''
            }`}
            placeholder={`Enter ${field.field_label.toLowerCase()}`}
          />
        );
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#2563EB] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#64748B]">Loading organization profile...</p>
        </div>
      </div>
    );
  }

  if (!organization) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-[#EF4444] mx-auto mb-4" />
          <p className="text-[#0F172A] font-medium">Failed to load organization data</p>
          <button
            onClick={fetchOrganizationData}
            className="mt-4 px-4 py-2 bg-[#2563EB] text-white rounded-lg text-sm font-medium"
          >
            Try Again
          </button>
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
              <h1 className="text-2xl font-bold text-[#0F172A]">Organization Profile</h1>
              <p className="text-sm text-[#64748B] mt-1">
                Manage your organization details and preferences
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={fetchOrganizationData}
                className="p-2 border border-[#CBD5E1] rounded-lg hover:bg-[#F8FAFC] transition-colors"
                title="Refresh"
              >
                <RefreshCw className="w-5 h-5 text-[#64748B]" />
              </button>
              
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-2 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  <span>Edit Profile</span>
                </button>
              ) : (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 border border-[#CBD5E1] rounded-lg text-sm font-medium text-[#334155] hover:bg-[#F8FAFC] transition-colors"
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
                        <span>Save Changes</span>
                      </>
                    )}
                  </button>
                </div>
              )}
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

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Organization Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Organization Information Card */}
            <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-[#E2E8F0] bg-[#F8FAFC]">
                <div className="flex items-center space-x-2">
                  <Building2 className="w-5 h-5 text-[#2563EB]" />
                  <h2 className="text-lg font-semibold text-[#0F172A]">Organization Information</h2>
                </div>
              </div>

              <div className="p-6">
                {isEditing ? (
                  // Edit Mode
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-[#334155] mb-1">
                          Company Name <span className="text-[#EF4444]">*</span>
                        </label>
                        <input
                          type="text"
                          name="company_name"
                          value={formData.company_name}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-2 border ${
                            formErrors.company_name ? 'border-[#EF4444]' : 'border-[#CBD5E1]'
                          } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]`}
                          placeholder="Enter company name"
                        />
                        {formErrors.company_name && (
                          <p className="text-xs text-[#EF4444] mt-1">{formErrors.company_name}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[#334155] mb-1">
                          Legal Name <span className="text-[#EF4444]">*</span>
                        </label>
                        <input
                          type="text"
                          name="legal_name"
                          value={formData.legal_name}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-2 border ${
                            formErrors.legal_name ? 'border-[#EF4444]' : 'border-[#CBD5E1]'
                          } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]`}
                          placeholder="Enter legal name"
                        />
                        {formErrors.legal_name && (
                          <p className="text-xs text-[#EF4444] mt-1">{formErrors.legal_name}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[#334155] mb-1">
                          Email <span className="text-[#EF4444]">*</span>
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-2 border ${
                            formErrors.email ? 'border-[#EF4444]' : 'border-[#CBD5E1]'
                          } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]`}
                          placeholder="Enter email"
                        />
                        {formErrors.email && (
                          <p className="text-xs text-[#EF4444] mt-1">{formErrors.email}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[#334155] mb-1">
                          Phone <span className="text-[#EF4444]">*</span>
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-2 border ${
                            formErrors.phone ? 'border-[#EF4444]' : 'border-[#CBD5E1]'
                          } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]`}
                          placeholder="10 digit mobile number"
                        />
                        {formErrors.phone && (
                          <p className="text-xs text-[#EF4444] mt-1">{formErrors.phone}</p>
                        )}
                      </div>

                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-[#334155] mb-1">
                          GSTIN
                        </label>
                        <input
                          type="text"
                          name="gstin"
                          value={formData.gstin}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-2 border ${
                            formErrors.gstin ? 'border-[#EF4444]' : 'border-[#CBD5E1]'
                          } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]`}
                          placeholder="29AABCU9603R1ZM"
                        />
                        {formErrors.gstin && (
                          <p className="text-xs text-[#EF4444] mt-1">{formErrors.gstin}</p>
                        )}
                      </div>

                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-[#334155] mb-1">
                          Address <span className="text-[#EF4444]">*</span>
                        </label>
                        <textarea
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          rows="3"
                          className={`w-full px-4 py-2 border ${
                            formErrors.address ? 'border-[#EF4444]' : 'border-[#CBD5E1]'
                          } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]`}
                          placeholder="Enter full address"
                        />
                        {formErrors.address && (
                          <p className="text-xs text-[#EF4444] mt-1">{formErrors.address}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  // View Mode
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-[#64748B] mb-1">Company Name</p>
                        <p className="text-sm font-medium text-[#0F172A]">{organization.company_name}</p>
                      </div>
                      <div>
                        <p className="text-xs text-[#64748B] mb-1">Legal Name</p>
                        <p className="text-sm font-medium text-[#0F172A]">{organization.legal_name}</p>
                      </div>
                      <div>
                        <p className="text-xs text-[#64748B] mb-1">Organization Code</p>
                        <p className="text-sm font-medium text-[#0F172A]">{organization.organization_code}</p>
                      </div>
                      <div>
                        <p className="text-xs text-[#64748B] mb-1">Status</p>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full inline-flex items-center ${
                          organization.status === 'active'
                            ? 'bg-[#DCFCE7] text-[#15803D]'
                            : 'bg-[#FEE2E2] text-[#B91C1C]'
                        }`}>
                          {organization.status === 'active' ? (
                            <CheckCircle className="w-3 h-3 mr-1" />
                          ) : (
                            <XCircle className="w-3 h-3 mr-1" />
                          )}
                          {organization.status}
                        </span>
                      </div>
                    </div>

                    <div className="border-t border-[#E2E8F0] pt-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center space-x-2">
                          <Mail className="w-4 h-4 text-[#64748B]" />
                          <div>
                            <p className="text-xs text-[#64748B]">Email</p>
                            <p className="text-sm text-[#0F172A]">{organization.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Phone className="w-4 h-4 text-[#64748B]" />
                          <div>
                            <p className="text-xs text-[#64748B]">Phone</p>
                            <p className="text-sm text-[#0F172A]">{organization.phone}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-[#E2E8F0] pt-4">
                      <div className="flex items-start space-x-2">
                        <MapPin className="w-4 h-4 text-[#64748B] mt-0.5" />
                        <div>
                          <p className="text-xs text-[#64748B]">Address</p>
                          <p className="text-sm text-[#0F172A]">{organization.address}</p>
                        </div>
                      </div>
                    </div>

                    {organization.gstin && (
                      <div className="border-t border-[#E2E8F0] pt-4">
                        <div className="flex items-center space-x-2">
                          <FileText className="w-4 h-4 text-[#64748B]" />
                          <div>
                            <p className="text-xs text-[#64748B]">GSTIN</p>
                            <p className="text-sm font-mono text-[#0F172A]">{organization.gstin}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Dynamic Fields Card */}
            {dynamicFields.length > 0 && (
              <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-[#E2E8F0] bg-[#F8FAFC]">
                  <div className="flex items-center space-x-2">
                    <File className="w-5 h-5 text-[#2563EB]" />
                    <h2 className="text-lg font-semibold text-[#0F172A]">Additional Information</h2>
                  </div>
                  <p className="text-xs text-[#64748B] mt-1">
                    Country-specific fields for {dynamicFields[0]?.country}
                  </p>
                </div>

                <div className="p-6">
                  <div className="space-y-6">
                    {dynamicFields.map((field) => (
                      <div key={field.id} className="border-b border-[#E2E8F0] last:border-0 pb-4 last:pb-0">
                        <div className="flex items-center space-x-2 mb-2">
                          {getFieldIcon(field.field_type)}
                          <label className="text-sm font-medium text-[#334155]">
                            {field.field_label}
                            {field.is_required && <span className="text-[#EF4444] ml-1">*</span>}
                          </label>
                        </div>
                        
                        {renderDynamicField(field)}
                        
                        {formErrors[field.field_key] && (
                          <p className="text-xs text-[#EF4444] mt-1">{formErrors[field.field_key]}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Invoice Details Card */}
            <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-[#E2E8F0] bg-[#F8FAFC]">
                <div className="flex items-center space-x-2">
                  <FileText className="w-5 h-5 text-[#2563EB]" />
                  <h2 className="text-lg font-semibold text-[#0F172A]">Invoice Details</h2>
                </div>
              </div>

              <div className="p-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-[#64748B] mb-1">Display Name on Invoice</p>
                    <p className="text-sm font-medium text-[#0F172A]">{organization.invoice_display_name}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-[#64748B] mb-1">Invoice Email</p>
                      <p className="text-sm text-[#0F172A]">{organization.invoice_email}</p>
                    </div>
                    <div>
                      <p className="text-xs text-[#64748B] mb-1">Invoice Phone</p>
                      <p className="text-sm text-[#0F172A]">{organization.invoice_phone}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-[#64748B] mb-1">Invoice Address</p>
                    <p className="text-sm text-[#0F172A]">{organization.invoice_address}</p>
                  </div>

                  {organization.invoice_gstin && (
                    <div>
                      <p className="text-xs text-[#64748B] mb-1">Invoice GSTIN</p>
                      <p className="text-sm font-mono text-[#0F172A]">{organization.invoice_gstin}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Settings, Subscription & Usage */}
          <div className="space-y-6">
            {/* Settings Card */}
            <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-[#E2E8F0] bg-[#F8FAFC]">
                <div className="flex items-center space-x-2">
                  <Settings className="w-5 h-5 text-[#2563EB]" />
                  <h2 className="text-lg font-semibold text-[#0F172A]">Settings</h2>
                </div>
              </div>

              <div className="p-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-[#F8FAFC] rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Mail className={`w-4 h-4 ${settings?.email_enabled ? 'text-[#22C55E]' : 'text-[#64748B]'}`} />
                      <span className="text-sm text-[#334155]">Email Notifications</span>
                    </div>
                    {settings?.email_enabled ? (
                      <CheckCircle className="w-5 h-5 text-[#22C55E]" />
                    ) : (
                      <XCircle className="w-5 h-5 text-[#EF4444]" />
                    )}
                  </div>

                  <div className="flex items-center justify-between p-3 bg-[#F8FAFC] rounded-lg">
                    <div className="flex items-center space-x-2">
                      <CreditCard className={`w-4 h-4 ${settings?.payment_enabled ? 'text-[#22C55E]' : 'text-[#64748B]'}`} />
                      <span className="text-sm text-[#334155]">Online Payments</span>
                    </div>
                    {settings?.payment_enabled ? (
                      <CheckCircle className="w-5 h-5 text-[#22C55E]" />
                    ) : (
                      <XCircle className="w-5 h-5 text-[#EF4444]" />
                    )}
                  </div>

                  <div className="flex items-center justify-between p-3 bg-[#F8FAFC] rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Settings className="w-4 h-4 text-[#64748B]" />
                      <span className="text-sm text-[#334155]">SMTP Configured</span>
                    </div>
                    {settings?.smtp_configured ? (
                      <CheckCircle className="w-5 h-5 text-[#22C55E]" />
                    ) : (
                      <XCircle className="w-5 h-5 text-[#EF4444]" />
                    )}
                  </div>

                  <div className="flex items-center justify-between p-3 bg-[#F8FAFC] rounded-lg">
                    <div className="flex items-center space-x-2">
                      <CreditCard className="w-4 h-4 text-[#64748B]" />
                      <span className="text-sm text-[#334155]">Payment Configured</span>
                    </div>
                    {settings?.payment_configured ? (
                      <CheckCircle className="w-5 h-5 text-[#22C55E]" />
                    ) : (
                      <XCircle className="w-5 h-5 text-[#EF4444]" />
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Subscription Card */}
            {subscription && (
              <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-[#E2E8F0] bg-[#F8FAFC]">
                  <div className="flex items-center space-x-2">
                    <CreditCard className="w-5 h-5 text-[#2563EB]" />
                    <h2 className="text-lg font-semibold text-[#0F172A]">Current Subscription</h2>
                  </div>
                </div>

                <div className="p-6">
                  <div className="mb-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full inline-flex items-center ${
                      subscription.status === 'active'
                        ? 'bg-[#DCFCE7] text-[#15803D]'
                        : 'bg-[#FEE2E2] text-[#B91C1C]'
                    }`}>
                      {subscription.status}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-[#64748B]">Plan</p>
                      <p className="text-sm font-medium text-[#0F172A]">{subscription.plan.plan_name}</p>
                    </div>

                    <div>
                      <p className="text-xs text-[#64748B]">Billing Cycle</p>
                      <p className="text-sm text-[#0F172A] capitalize">{subscription.plan.billing_cycle}</p>
                    </div>

                    <div>
                      <p className="text-xs text-[#64748B]">Price</p>
                      <p className="text-sm font-medium text-[#0F172A]">
                        ₹{subscription.plan.price} / {subscription.plan.billing_cycle === 'monthly' ? 'month' : 'year'}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <p className="text-xs text-[#64748B]">Start Date</p>
                        <p className="text-sm text-[#0F172A]">{formatDate(subscription.start_date)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-[#64748B]">End Date</p>
                        <p className="text-sm text-[#0F172A]">{formatDate(subscription.end_date)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Usage Card */}
            {usage && (
              <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-[#E2E8F0] bg-[#F8FAFC]">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-5 h-5 text-[#2563EB]" />
                    <h2 className="text-lg font-semibold text-[#0F172A]">Usage Overview</h2>
                  </div>
                </div>

                <div className="p-6">
                  <p className="text-xs text-[#64748B] mb-3">Month: {usage.usage_month}</p>

                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-[#64748B]">Invoice Usage</span>
                        <span className="text-xs font-medium text-[#0F172A]">
                          {usage.invoice_count} / {usage.invoice_limit}
                        </span>
                      </div>
                      <div className="w-full h-2 bg-[#E2E8F0] rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-[#2563EB] rounded-full"
                          style={{ width: `${(usage.invoice_count / usage.invoice_limit) * 100}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-[#64748B] mt-1">
                        {usage.invoice_remaining} invoices remaining
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <div className="bg-[#F8FAFC] rounded-lg p-3">
                        <FileText className="w-4 h-4 text-[#2563EB] mb-1" />
                        <p className="text-xs text-[#64748B]">Invoices</p>
                        <p className="text-lg font-bold text-[#0F172A]">{usage.invoice_count}</p>
                      </div>
                      
                      <div className="bg-[#F8FAFC] rounded-lg p-3">
                        <Package className="w-4 h-4 text-[#F59E0B] mb-1" />
                        <p className="text-xs text-[#64748B]">Purchases</p>
                        <p className="text-lg font-bold text-[#0F172A]">{usage.purchase_count}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default OrganizationProfile;