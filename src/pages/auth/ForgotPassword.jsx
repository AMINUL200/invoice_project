// pages/auth/ForgotPassword.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft, Send, CheckCircle, AlertCircle } from 'lucide-react';
import CustomInput from '../../component/form/CustomInput';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [apiResponse, setApiResponse] = useState(null);
  const navigate = useNavigate();

  const validateEmail = () => {
    const newErrors = {};
    
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateEmail()) return;
    
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock API response
      setApiResponse({
        message: "If that email exists, we have sent a password reset link."
      });
      
      setIsSubmitted(true);
    } catch (error) {
      console.error('Error sending reset link:', error);
      setErrors({
        general: 'An error occurred. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = () => {
    setIsSubmitted(false);
    handleSubmit(new Event('submit'));
  };

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
          onClick={() => navigate('/login')}
          className="mb-6 flex items-center space-x-2 text-[#64748B] hover:text-[#2563EB] transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back to Login</span>
        </button>

        {/* Main Card */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-xl overflow-hidden">
          {/* Header */}
          <div className="px-8 pt-8 pb-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-[#2563EB] rounded-xl shadow-lg">
                <Mail className="w-8 h-8 text-white" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-[#0F172A] mb-2">
              Forgot Password?
            </h2>
            <p className="text-[#64748B]">
              {!isSubmitted 
                ? "Enter your email address and we'll send you a link to reset your password."
                : "Check your inbox for the reset link"}
            </p>
          </div>

          {/* Form Area */}
          <div className="px-8 pb-8">
            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Field */}
                <div>
                  <CustomInput
                    label="Email Address"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) {
                        setErrors(prev => ({ ...prev, email: '' }));
                      }
                    }}
                    // placeholder="Enter your email"
                    className={errors.email ? 'border-[#EF4444] focus:ring-[#EF4444]/20' : ''}
                    autoComplete="email"
                    required
                  />
                  {errors.email && (
                    <p className="mt-2 text-sm text-[#EF4444] flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* General Error */}
                {errors.general && (
                  <div className="p-3 bg-[#FEE2E2] border border-[#EF4444]/20 rounded-lg">
                    <p className="text-sm text-[#B91C1C]">{errors.general}</p>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center items-center space-x-2 py-3 px-4 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span>Send Reset Link</span>
                    </>
                  )}
                </button>
              </form>
            ) : (
              /* Success State */
              <div className="space-y-6">
                <div className="text-center">
                  <div className="flex justify-center mb-4">
                    <div className="p-3 bg-[#DCFCE7] rounded-full">
                      <CheckCircle className="w-12 h-12 text-[#15803D]" />
                    </div>
                  </div>
                  
                  {apiResponse && (
                    <p className="text-[#0F172A] font-medium mb-2">
                      {apiResponse.message}
                    </p>
                  )}
                  
                  <p className="text-sm text-[#64748B]">
                    Didn't receive the email? Check your spam folder or{' '}
                    <button
                      onClick={handleResend}
                      className="text-[#2563EB] hover:text-[#1D4ED8] font-medium"
                    >
                      click here to resend
                    </button>
                  </p>
                </div>

                {/* Email Display */}
                <div className="bg-[#F8FAFC] rounded-lg p-4 border border-[#E2E8F0]">
                  <p className="text-xs text-[#64748B] mb-1">Email sent to:</p>
                  <p className="text-[#0F172A] font-medium">{email}</p>
                </div>

                {/* Return to Login */}
                <button
                  onClick={() => navigate('/login')}
                  className="w-full py-3 px-4 border border-[#CBD5E1] hover:bg-[#F8FAFC] text-[#334155] rounded-lg font-medium transition-colors"
                >
                  Return to Login
                </button>
              </div>
            )}
          </div>

          {/* Footer Note */}
          <div className="px-8 py-4 bg-[#F8FAFC] border-t border-[#E2E8F0]">
            <p className="text-xs text-center text-[#94A3B8]">
              For security reasons, we will only notify you if the email exists in our system.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;