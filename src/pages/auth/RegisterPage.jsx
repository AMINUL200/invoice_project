// pages/RegisterPage.jsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  UserPlus,
  ArrowLeft,
  Building2,
  Mail,
  Phone,
  MapPin,
  User,
  Lock,
  FileText,
  Globe,
  Search,
  ChevronDown,
  X
} from "lucide-react";
import CustomInput from "../../component/form/CustomInput";
import toast from "react-hot-toast";
import { api } from "../../utils/app";

const RegisterPage = () => {
  const [countries, setCountries] = useState([]);
  const [loadingCountries, setLoadingCountries] = useState(true);
  const [formData, setFormData] = useState({
    country: "", // This will store the country slug
    company_name: "",
    legal_name: "",
    email: "",
    phone: "",
    gstin: "",
    address: "",
    owner_name: "",
    owner_email: "",
    owner_password: "",
    owner_phone: "",
  });
  
  // Country dropdown state
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [countrySearchTerm, setCountrySearchTerm] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(null);
  const countryDropdownRef = useRef(null);
  
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch countries on component mount
  useEffect(() => {
    fetchCountries();
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

  const fetchCountries = async () => {
    setLoadingCountries(true);
    try {
      const response = await api.get("/countries-active");
      if (response.data.success) {
        setCountries(response.data.data);
      } else {
        toast.error("Failed to load countries");
      }
    } catch (error) {
      console.error("Error fetching countries:", error);
      toast.error("Failed to load countries");
    } finally {
      setLoadingCountries(false);
    }
  };

  // Filter countries based on search
  const filteredCountries = countries.filter(country =>
    country.name.toLowerCase().includes(countrySearchTerm.toLowerCase()) ||
    country.slug.toLowerCase().includes(countrySearchTerm.toLowerCase())
  );

  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
    setFormData(prev => ({
      ...prev,
      country: country.slug // Store the slug in formData
    }));
    setCountrySearchTerm("");
    setIsCountryDropdownOpen(false);
    // Clear error when country is selected
    if (errors.country) {
      setErrors(prev => ({ ...prev, country: "" }));
    }
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    // Country Validation
    if (!formData.country) {
      newErrors.country = "Please select a country";
    }

    // Company Details Validation
    if (!formData.company_name.trim()) {
      newErrors.company_name = "Company name is required";
    }

    if (!formData.legal_name.trim()) {
      newErrors.legal_name = "Legal name is required";
    }

    if (!formData.email) {
      newErrors.email = "Company email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.phone) {
      newErrors.phone = "Company phone is required";
    } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ""))) {
      newErrors.phone = "Phone number must be 10 digits";
    }

    if (!formData.gstin.trim()) {
      newErrors.gstin = "GSTIN is required";
    } else if (!/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(formData.gstin)) {
      newErrors.gstin = "Invalid GSTIN format";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    }

    // Owner Details Validation
    if (!formData.owner_name.trim()) {
      newErrors.owner_name = "Owner name is required";
    } else if (formData.owner_name.trim().length < 3) {
      newErrors.owner_name = "Name must be at least 3 characters";
    }

    if (!formData.owner_email) {
      newErrors.owner_email = "Owner email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.owner_email)) {
      newErrors.owner_email = "Email is invalid";
    }

    if (!formData.owner_phone) {
      newErrors.owner_phone = "Owner phone is required";
    } else if (!/^\d{10}$/.test(formData.owner_phone.replace(/\D/g, ""))) {
      newErrors.owner_phone = "Phone number must be 10 digits";
    }

    if (!formData.owner_password) {
      newErrors.owner_password = "Password is required";
    } else if (formData.owner_password.length < 6) {
      newErrors.owner_password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await api.post("/organizations/register", formData);
      console.log("Registration successful:", response);
      
      if (response.status === 200 || response.status === 201) {
        toast.success(response.data.message || "Registration successful! Please login.");
        // Redirect to login page after successful registration
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        toast.error(response.data.message || "Registration failed!");
      }
    } catch (error) {
      console.error("Registration failed:", error);
      
      // Handle validation errors from backend
      if (error.response?.data?.errors) {
        const backendErrors = {};
        Object.keys(error.response.data.errors).forEach(key => {
          backendErrors[key] = error.response.data.errors[key][0];
        });
        setErrors(backendErrors);
      } else {
        toast.error(error.response?.data?.message || error.message || "Registration failed!");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] py-12 px-4 sm:px-6 lg:px-8">
      {/* Background decoration with brand colors */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#2563EB]/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#2563EB]/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-2xl w-full relative z-10">
        {/* Back button */}
        <button
          onClick={() => navigate("/")}
          className="mb-6 flex items-center space-x-2 text-[#64748B] hover:text-[#2563EB] transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back to Home</span>
        </button>

        {/* Register Card */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-xl p-8">
          {/* Logo and Title */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-[#2563EB] rounded-xl shadow-lg">
                <Building2 className="w-8 h-8 text-white" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-[#0F172A] mb-2">
              Register Your Company
            </h2>
            <p className="text-[#64748B]">
              Fill in the details to create your company account
            </p>
          </div>

          {/* Register Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Country Selection */}
            <div>
              <h3 className="text-lg font-semibold text-[#0F172A] mb-4 pb-2 border-b border-[#E2E8F0]">
                Select Country
              </h3>
              <div ref={countryDropdownRef} className="relative">
                <button
                  type="button"
                  onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
                  className={`w-full px-4 py-3 border ${
                    errors.country ? 'border-[#EF4444]' : 'border-[#CBD5E1]'
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] flex items-center justify-between bg-white`}
                >
                  <div className="flex items-center gap-2">
                    <Globe className={`w-5 h-5 ${selectedCountry ? 'text-[#2563EB]' : 'text-[#64748B]'}`} />
                    <span className={selectedCountry ? 'text-[#0F172A] font-medium' : 'text-[#94A3B8]'}>
                      {selectedCountry ? selectedCountry.name : 'Select your country...'}
                    </span>
                  </div>
                  <ChevronDown className={`w-5 h-5 text-[#64748B] transition-transform ${isCountryDropdownOpen ? 'rotate-180' : ''}`} />
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
                        {countrySearchTerm && (
                          <button
                            type="button"
                            onClick={() => setCountrySearchTerm("")}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-[#F1F5F9] rounded-full"
                          >
                            <X className="w-3 h-3 text-[#64748B]" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Countries list */}
                    <div className="max-h-60 overflow-y-auto">
                      {loadingCountries ? (
                        <div className="px-4 py-3 text-sm text-[#64748B] text-center">
                          Loading countries...
                        </div>
                      ) : filteredCountries.length === 0 ? (
                        <div className="px-4 py-3 text-sm text-[#64748B] text-center">
                          No countries found
                        </div>
                      ) : (
                        filteredCountries.map((country) => (
                          <button
                            key={country.slug}
                            type="button"
                            onClick={() => handleCountrySelect(country)}
                            className={`w-full px-4 py-2.5 text-left hover:bg-[#F8FAFC] transition-colors flex items-center gap-2 ${
                              selectedCountry?.slug === country.slug ? 'bg-[#EFF6FF]' : ''
                            }`}
                          >
                            <Globe className={`w-4 h-4 ${
                              selectedCountry?.slug === country.slug ? 'text-[#2563EB]' : 'text-[#64748B]'
                            }`} />
                            <div>
                              <span className={`text-sm ${
                                selectedCountry?.slug === country.slug ? 'font-medium text-[#2563EB]' : 'text-[#0F172A]'
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

                {errors.country && (
                  <p className="mt-2 text-sm text-[#EF4444] flex items-center">
                    <span className="inline-block w-1 h-1 bg-[#EF4444] rounded-full mr-2"></span>
                    {errors.country}
                  </p>
                )}
              </div>
            </div>

            {/* Company Details Section */}
            <div>
              <h3 className="text-lg font-semibold text-[#0F172A] mb-4 pb-2 border-b border-[#E2E8F0]">
                Company Details
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Company Name */}
                <div>
                  <CustomInput
                    label="Company Name"
                    name="company_name"
                    type="text"
                    value={formData.company_name}
                    onChange={handleChange}
                    icon={<Building2 className="w-5 h-5 text-[#64748B]" />}
                    className={errors.company_name ? "border-[#EF4444] focus:ring-[#EF4444]/20 focus:border-[#EF4444]" : ""}
                  />
                  {errors.company_name && (
                    <p className="mt-2 text-sm text-[#EF4444] flex items-center">
                      <span className="inline-block w-1 h-1 bg-[#EF4444] rounded-full mr-2"></span>
                      {errors.company_name}
                    </p>
                  )}
                </div>

                {/* Legal Name */}
                <div>
                  <CustomInput
                    label="Legal Name"
                    name="legal_name"
                    type="text"
                    value={formData.legal_name}
                    onChange={handleChange}
                    icon={<FileText className="w-5 h-5 text-[#64748B]" />}
                    className={errors.legal_name ? "border-[#EF4444] focus:ring-[#EF4444]/20 focus:border-[#EF4444]" : ""}
                  />
                  {errors.legal_name && (
                    <p className="mt-2 text-sm text-[#EF4444] flex items-center">
                      <span className="inline-block w-1 h-1 bg-[#EF4444] rounded-full mr-2"></span>
                      {errors.legal_name}
                    </p>
                  )}
                </div>

                {/* Company Email */}
                <div>
                  <CustomInput
                    label="Company Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    icon={<Mail className="w-5 h-5 text-[#64748B]" />}
                    className={errors.email ? "border-[#EF4444] focus:ring-[#EF4444]/20 focus:border-[#EF4444]" : ""}
                  />
                  {errors.email && (
                    <p className="mt-2 text-sm text-[#EF4444] flex items-center">
                      <span className="inline-block w-1 h-1 bg-[#EF4444] rounded-full mr-2"></span>
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Company Phone */}
                <div>
                  <CustomInput
                    label="Company Phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    icon={<Phone className="w-5 h-5 text-[#64748B]" />}
                    className={errors.phone ? "border-[#EF4444] focus:ring-[#EF4444]/20 focus:border-[#EF4444]" : ""}
                  />
                  {errors.phone && (
                    <p className="mt-2 text-sm text-[#EF4444] flex items-center">
                      <span className="inline-block w-1 h-1 bg-[#EF4444] rounded-full mr-2"></span>
                      {errors.phone}
                    </p>
                  )}
                </div>

                {/* GSTIN */}
                <div className="md:col-span-2">
                  <CustomInput
                    label="GSTIN"
                    name="gstin"
                    type="text"
                    value={formData.gstin}
                    onChange={handleChange}
                    icon={<FileText className="w-5 h-5 text-[#64748B]" />}
                    className={errors.gstin ? "border-[#EF4444] focus:ring-[#EF4444]/20 focus:border-[#EF4444]" : ""}
                  />
                  {errors.gstin && (
                    <p className="mt-2 text-sm text-[#EF4444] flex items-center">
                      <span className="inline-block w-1 h-1 bg-[#EF4444] rounded-full mr-2"></span>
                      {errors.gstin}
                    </p>
                  )}
                </div>

                {/* Address */}
                <div className="md:col-span-2">
                  <CustomInput
                    label="Address"
                    name="address"
                    type="text"
                    value={formData.address}
                    onChange={handleChange}
                    icon={<MapPin className="w-5 h-5 text-[#64748B]" />}
                    className={errors.address ? "border-[#EF4444] focus:ring-[#EF4444]/20 focus:border-[#EF4444]" : ""}
                  />
                  {errors.address && (
                    <p className="mt-2 text-sm text-[#EF4444] flex items-center">
                      <span className="inline-block w-1 h-1 bg-[#EF4444] rounded-full mr-2"></span>
                      {errors.address}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Owner Details Section */}
            <div>
              <h3 className="text-lg font-semibold text-[#0F172A] mb-4 pb-2 border-b border-[#E2E8F0]">
                Owner Details
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Owner Name */}
                <div>
                  <CustomInput
                    label="Owner Name"
                    name="owner_name"
                    type="text"
                    value={formData.owner_name}
                    onChange={handleChange}
                    icon={<User className="w-5 h-5 text-[#64748B]" />}
                    className={errors.owner_name ? "border-[#EF4444] focus:ring-[#EF4444]/20 focus:border-[#EF4444]" : ""}
                  />
                  {errors.owner_name && (
                    <p className="mt-2 text-sm text-[#EF4444] flex items-center">
                      <span className="inline-block w-1 h-1 bg-[#EF4444] rounded-full mr-2"></span>
                      {errors.owner_name}
                    </p>
                  )}
                </div>

                {/* Owner Email */}
                <div>
                  <CustomInput
                    label="Owner Email"
                    name="owner_email"
                    type="email"
                    value={formData.owner_email}
                    onChange={handleChange}
                    icon={<Mail className="w-5 h-5 text-[#64748B]" />}
                    className={errors.owner_email ? "border-[#EF4444] focus:ring-[#EF4444]/20 focus:border-[#EF4444]" : ""}
                  />
                  {errors.owner_email && (
                    <p className="mt-2 text-sm text-[#EF4444] flex items-center">
                      <span className="inline-block w-1 h-1 bg-[#EF4444] rounded-full mr-2"></span>
                      {errors.owner_email}
                    </p>
                  )}
                </div>

                {/* Owner Phone */}
                <div>
                  <CustomInput
                    label="Owner Phone"
                    name="owner_phone"
                    type="tel"
                    value={formData.owner_phone}
                    onChange={handleChange}
                    icon={<Phone className="w-5 h-5 text-[#64748B]" />}
                    className={errors.owner_phone ? "border-[#EF4444] focus:ring-[#EF4444]/20 focus:border-[#EF4444]" : ""}
                  />
                  {errors.owner_phone && (
                    <p className="mt-2 text-sm text-[#EF4444] flex items-center">
                      <span className="inline-block w-1 h-1 bg-[#EF4444] rounded-full mr-2"></span>
                      {errors.owner_phone}
                    </p>
                  )}
                </div>

                {/* Owner Password */}
                <div>
                  <CustomInput
                    label="Password"
                    name="owner_password"
                    type="password"
                    value={formData.owner_password}
                    onChange={handleChange}
                    icon={<Lock className="w-5 h-5 text-[#64748B]" />}
                    className={errors.owner_password ? "border-[#EF4444] focus:ring-[#EF4444]/20 focus:border-[#EF4444]" : ""}
                  />
                  {errors.owner_password && (
                    <p className="mt-2 text-sm text-[#EF4444] flex items-center">
                      <span className="inline-block w-1 h-1 bg-[#EF4444] rounded-full mr-2"></span>
                      {errors.owner_password}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-center">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                className="h-4 w-4 text-[#2563EB] focus:ring-[#2563EB] border-[#CBD5E1] rounded cursor-pointer"
                onChange={(e) => {
                  if (!e.target.checked) {
                    setErrors(prev => ({ ...prev, terms: "You must agree to the terms and conditions" }));
                  } else {
                    setErrors(prev => ({ ...prev, terms: "" }));
                  }
                }}
              />
              <label
                htmlFor="terms"
                className="ml-2 block text-sm text-[#64748B] cursor-pointer"
              >
                I agree to the{" "}
                <a
                  href="/terms"
                  className="font-semibold text-[#2563EB] hover:text-[#1D4ED8] transition-colors"
                >
                  Terms and Conditions
                </a>{" "}
                and{" "}
                <a
                  href="/privacy"
                  className="font-semibold text-[#2563EB] hover:text-[#1D4ED8] transition-colors"
                >
                  Privacy Policy
                </a>
              </label>
            </div>
            {errors.terms && (
              <p className="mt-2 text-sm text-[#EF4444] flex items-center">
                <span className="inline-block w-1 h-1 bg-[#EF4444] rounded-full mr-2"></span>
                {errors.terms}
              </p>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center space-x-2 py-3 px-4 border border-transparent rounded-lg shadow-lg text-white bg-[#2563EB] hover:bg-[#1D4ED8] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2563EB] transition-all duration-300 font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Registering...</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  <span>Register Company</span>
                </>
              )}
            </button>
          </form>

          {/* Sign In Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-[#64748B]">
              Already have an account?{" "}
              <a
                href="/login"
                className="font-semibold text-[#2563EB] hover:text-[#1D4ED8] transition-colors"
              >
                Sign in here
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;