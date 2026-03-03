
// pages/auth/ResetPassword.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Lock, Eye, EyeOff, ArrowLeft, CheckCircle, AlertCircle, Key } from 'lucide-react';
import CustomInput from '../../component/form/CustomInput';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    email: searchParams.get('email') || '',
    password: '',
    password_confirmation: ''
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [token, setToken] = useState(searchParams.get('token') || '');

  // Validate token exists
  useEffect(() => {
    if (!token) {
      setErrors({
        general: 'Invalid or missing reset token. Please request a new password reset link.'
      });
    }
  }, [token]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'New password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
    }

    if (!formData.password_confirmation) {
      newErrors.password_confirmation = 'Please confirm your password';
    } else if (formData.password !== formData.password_confirmation) {
      newErrors.password_confirmation = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // Prepare data for API
      const resetData = {
        email: formData.email,
        token: token,
        password: formData.password,
        password_confirmation: formData.password_confirmation
      };

      console.log('Reset password data:', resetData);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Mock successful response
      setIsSuccess(true);
    } catch (error) {
      console.error('Error resetting password:', error);
      setErrors({
        general: 'Failed to reset password. The link may have expired. Please request a new one.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, label: 'No password' };
    
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/(?=.*[a-z])/.test(password)) strength += 1;
    if (/(?=.*[A-Z])/.test(password)) strength += 1;
    if(/(?=.*\d)/.test(password)) strength += 1;
    
    const labels = ['Weak', 'Fair', 'Good', 'Strong'];
    const colors = ['#EF4444', '#F59E0B', '#22C55E', '#15803D'];
    
    return {
      strength: strength,
      label: labels[strength - 1] || 'Very Weak',
      color: colors[strength - 1] || '#EF4444'
    };
  };

  const passwordStrength = getPasswordStrength(formData.password);

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] py-12 px-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-xl p-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-[#DCFCE7] rounded-full">
                <CheckCircle className="w-12 h-12 text-[#15803D]" />
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-[#0F172A] mb-2">
              Password Reset Successfully!
            </h2>
            
            <p className="text-[#64748B] mb-6">
              Your password has been reset. You can now log in with your new password.
            </p>

            <button
              onClick={() => navigate('/login')}
              className="w-full py-3 px-4 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-lg font-medium transition-colors"
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] py-12 px-4 sm:px-6 lg:px-8">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#2563EB]/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#2563EB]/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-md w-full relative z-10">
        {/* Back button */}
        <button
          onClick={() => navigate('/forgot-password')}
          className="mb-6 flex items-center space-x-2 text-[#64748B] hover:text-[#2563EB] transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back to Forgot Password</span>
        </button>

        {/* Main Card */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-xl overflow-hidden">
          {/* Header */}
          <div className="px-8 pt-8 pb-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-[#2563EB] rounded-xl shadow-lg">
                <Key className="w-8 h-8 text-white" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-[#0F172A] mb-2">
              Reset Password
            </h2>
            <p className="text-[#64748B]">
              Enter your new password below
            </p>
          </div>

          {/* Form Area */}
          <div className="px-8 pb-8">
            {/* Token Error */}
            {errors.general && (
              <div className="mb-6 p-4 bg-[#FEE2E2] border border-[#EF4444]/20 rounded-lg">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="w-5 h-5 text-[#B91C1C] flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-[#B91C1C]">{errors.general}</p>
                </div>
                <button
                  onClick={() => navigate('/forgot-password')}
                  className="mt-3 text-sm text-[#2563EB] hover:text-[#1D4ED8] font-medium"
                >
                  Request new reset link →
                </button>
              </div>
            )}

            {!errors.general && (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email (Read-only) */}
                <div>
                  <CustomInput
                    // label="Email Address"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    readOnly
                    className="bg-[#F8FAFC] border-[#E2E8F0] text-[#64748B] cursor-not-allowed"
                  />
                  <p className="mt-1 text-xs text-[#94A3B8]">
                    This email is associated with the reset request
                  </p>
                </div>

                {/* New Password */}
                <div>
                  <CustomInput
                    label="New Password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
                    className={errors.password ? 'border-[#EF4444] focus:ring-[#EF4444]/20' : ''}
                    icon={<Lock className="w-5 h-5 text-[#64748B]" />}
                  />
                  
                  {/* Password Strength Indicator */}
                  {formData.password && (
                    <div className="mt-2">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-[#64748B]">Password strength:</span>
                        <span className="text-xs font-medium" style={{ color: passwordStrength.color }}>
                          {passwordStrength.label}
                        </span>
                      </div>
                      <div className="h-1.5 bg-[#E2E8F0] rounded-full overflow-hidden">
                        <div 
                          className="h-full transition-all duration-300 rounded-full"
                          style={{ 
                            width: `${(passwordStrength.strength / 4) * 100}%`,
                            backgroundColor: passwordStrength.color 
                          }}
                        ></div>
                      </div>
                      <ul className="mt-2 space-y-1">
                        <li className="flex items-center text-xs">
                          {formData.password.length >= 8 ? (
                            <CheckCircle className="w-3 h-3 text-[#22C55E] mr-1" />
                          ) : (
                            <AlertCircle className="w-3 h-3 text-[#EF4444] mr-1" />
                          )}
                          <span className={formData.password.length >= 8 ? 'text-[#15803D]' : 'text-[#64748B]'}>
                            At least 8 characters
                          </span>
                        </li>
                        <li className="flex items-center text-xs">
                          {/(?=.*[a-z])/.test(formData.password) ? (
                            <CheckCircle className="w-3 h-3 text-[#22C55E] mr-1" />
                          ) : (
                            <AlertCircle className="w-3 h-3 text-[#EF4444] mr-1" />
                          )}
                          <span className={/(?=.*[a-z])/.test(formData.password) ? 'text-[#15803D]' : 'text-[#64748B]'}>
                            One lowercase letter
                          </span>
                        </li>
                        <li className="flex items-center text-xs">
                          {/(?=.*[A-Z])/.test(formData.password) ? (
                            <CheckCircle className="w-3 h-3 text-[#22C55E] mr-1" />
                          ) : (
                            <AlertCircle className="w-3 h-3 text-[#EF4444] mr-1" />
                          )}
                          <span className={/(?=.*[A-Z])/.test(formData.password) ? 'text-[#15803D]' : 'text-[#64748B]'}>
                            One uppercase letter
                          </span>
                        </li>
                        <li className="flex items-center text-xs">
                          {/(?=.*\d)/.test(formData.password) ? (
                            <CheckCircle className="w-3 h-3 text-[#22C55E] mr-1" />
                          ) : (
                            <AlertCircle className="w-3 h-3 text-[#EF4444] mr-1" />
                          )}
                          <span className={/(?=.*\d)/.test(formData.password) ? 'text-[#15803D]' : 'text-[#64748B]'}>
                            One number
                          </span>
                        </li>
                      </ul>
                    </div>
                  )}
                  
                  {errors.password && (
                    <p className="mt-2 text-sm text-[#EF4444]">{errors.password}</p>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <CustomInput
                    label="Confirm New Password"
                    name="password_confirmation"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.password_confirmation}
                    onChange={handleChange}
                    className={errors.password_confirmation ? 'border-[#EF4444] focus:ring-[#EF4444]/20' : ''}
                    icon={<Lock className="w-5 h-5 text-[#64748B]" />}
                  />
                  {errors.password_confirmation && (
                    <p className="mt-2 text-sm text-[#EF4444]">{errors.password_confirmation}</p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading || !token}
                  className="w-full flex justify-center items-center space-x-2 py-3 px-4 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Resetting Password...</span>
                    </>
                  ) : (
                    <>
                      <Key className="w-5 h-5" />
                      <span>Reset Password</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Footer Note */}
          <div className="px-8 py-4 bg-[#F8FAFC] border-t border-[#E2E8F0]">
            <p className="text-xs text-center text-[#94A3B8]">
              This link will expire in 24 hours for security reasons.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;