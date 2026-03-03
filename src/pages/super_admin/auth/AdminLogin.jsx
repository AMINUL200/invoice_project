import React, { useState } from 'react';
import { Mail, Lock, LogIn, Shield, Building2 } from 'lucide-react';
import CustomInput from '../../../component/form/CustomInput';
import { useAuth } from '../../../context/AuthContext';
import { api } from '../../../utils/app';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const AdminLogin = () => {
  const {login, token} = useAuth();
  const [formData, setFormData] = useState({
    email: 'superadmin@billing.test',
    password: 'password'
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call
    try {
      const response = await api.post('/login', formData);
      console.log('Login successful:', response);
      login(response.data.user, response.data.token);
      // Handle successful login (e.g., redirect to dashboard)
      // Handle successful login here
      if(response.status === 200){
        if(response.data.user.role === 'super_admin'){
          // Redirect to super admin dashboard
          navigate('/admin/dashboard');
        }else if(response.data.user.role === 'org_owner'){
          // Redirect to regular admin dashboard
          navigate('/org/dashboard');
        }
        toast.success(response.data.message || 'Login successful!'); // Show success toast
      }else{
        toast.error(response.data.message || 'Login failed!'); // Show error toast
      }
    } catch (error) {
      console.error('Login failed:', error);
      toast.error(error.message || 'Login failed!'); // Show error toast
      // Handle login error
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
      {/* Background decorative elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#2563EB]/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#2563EB]/10 rounded-full blur-3xl"></div>
      </div>

      {/* Main Login Card */}
      <div className="w-full max-w-md relative">
        {/* Logo/Brand Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-[#2563EB] rounded-2xl shadow-lg mb-4">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-[#0F172A] mb-2">Super Admin</h1>
          <p className="text-[#64748B]">Sign in to manage your SaaS platform</p>
        </div>

        {/* Login Form Card */}
        <div className="bg-white rounded-xl shadow-lg border border-[#E2E8F0] overflow-hidden">
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Input */}
              <div>
                <CustomInput
                  type="email"
                  name="email"
                  label="Email Address"
                  value={formData.email}
                  onChange={handleChange}
                  className={errors.email ? 'border-[#EF4444] focus:ring-[#EF4444]/20' : ''}
                  icon={<Mail className="w-5 h-5 text-[#64748B]" />}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-[#EF4444]">{errors.email}</p>
                )}
              </div>

              {/* Password Input */}
              <div>
                <CustomInput
                  type="password"
                  name="password"
                  label="Password"
                  value={formData.password}
                  onChange={handleChange}
                  className={errors.password ? 'border-[#EF4444] focus:ring-[#EF4444]/20' : ''}
                  icon={<Lock className="w-5 h-5 text-[#64748B]" />}
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-[#EF4444]">{errors.password}</p>
                )}
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-[#CBD5E1] text-[ #2563EB]-600 focus:ring-[ #2563EB]-500"
                  />
                  <span className="text-sm text-[#64748B]">Remember me</span>
                </label>
                <button
                  type="button"
                  className="text-sm text-[ #2563EB]-600 hover:text-[ #2563EB]-700 font-medium transition-colors"
                >
                  Forgot password?
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <LogIn className="w-5 h-5" />
                    <span>Sign In</span>
                  </>
                )}
              </button>
            </form>

          

           
          </div>

          {/* Footer */}
          <div className="bg-[#F8FAFC] px-8 py-4 border-t border-[#E2E8F0]">
            <p className="text-center text-sm text-[#64748B]">
              Secure admin access only. All activities are logged.
            </p>
          </div>
        </div>

      
      </div>
    </div>
  );
};

export default AdminLogin;