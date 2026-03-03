import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, LogIn, ArrowLeft, Building2 } from "lucide-react";
import CustomInput from "../../component/form/CustomInput";
import toast from "react-hot-toast";
import { api } from "../../utils/app";
import { useAuth } from "../../context/AuthContext";


const LoginPage = () => {
  const { login, token } = useAuth();
  const [formData, setFormData] = useState({
    email: "owner@demo.com",
    password: "password",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

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

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
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
      const response = await api.post("/login", formData);
      console.log("Login successful:", response);
      login(response.data.user, response.data.token);
      // Handle successful login (e.g., redirect to dashboard)
      // Handle successful login here
      if (response.status === 200) {
        if (response.data.user.role === "super_admin") {
          // Redirect to super admin dashboard
          navigate("/admin/dashboard");
        } else if (response.data.user.role === "org_owner") {
          // Redirect to regular admin dashboard
          navigate("/org/dashboard");
        }
        toast.success(response.data.message || "Login successful!"); // Show success toast
      } else {
        toast.error(response.data.message || "Login failed!"); // Show error toast
      }
    } catch (error) {
      console.error("Login failed:", error);
      toast.error(error.message || "Login failed!"); // Show error toast
      // Handle login error
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

      <div className="max-w-md w-full relative z-10">
        {/* Back button */}
        <button
          onClick={() => navigate("/")}
          className="mb-6 flex items-center space-x-2 text-[#64748B] hover:text-[#2563EB] transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back to Home</span>
        </button>

        {/* Login Card */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-xl p-8">
          {/* Logo and Title */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-[#2563EB] rounded-xl shadow-lg">
                <Building2 className="w-8 h-8 text-white" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-[#0F172A] mb-2">
              Company Login
            </h2>
            <p className="text-[#64748B]">
              Sign in to access your company dashboard
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <CustomInput
                label="Email Address"
                name="email"
                type="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                placeholder=""
                className={
                  errors.email
                    ? "border-[#EF4444] focus:ring-[#EF4444]/20 focus:border-[#EF4444]"
                    : ""
                }
              />
              {errors.email && (
                <p className="mt-2 text-sm text-[#EF4444] flex items-center">
                  <span className="inline-block w-1 h-1 bg-[#EF4444] rounded-full mr-2"></span>
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <CustomInput
                label="Password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={formData.password}
                onChange={handleChange}
                placeholder=""
                className={
                  errors.password
                    ? "border-[#EF4444] focus:ring-[#EF4444]/20 focus:border-[#EF4444]"
                    : ""
                }
              />
              {errors.password && (
                <p className="mt-2 text-sm text-[#EF4444] flex items-center">
                  <span className="inline-block w-1 h-1 bg-[#EF4444] rounded-full mr-2"></span>
                  {errors.password}
                </p>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-[#2563EB] focus:ring-[#2563EB] border-[#CBD5E1] rounded cursor-pointer"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-[#64748B] cursor-pointer"
                >
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a
                  href="/forgot-password"
                  className="font-semibold text-[#2563EB] hover:text-[#1D4ED8] transition-colors"
                >
                  Forgot password?
                </a>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center space-x-2 py-3 px-4 border border-transparent rounded-lg shadow-lg text-white bg-[#2563EB] hover:bg-[#1D4ED8] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2563EB] transition-all duration-300 font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
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

          {/* Divider */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#E2E8F0]"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-[#94A3B8]">
                  Or continue with
                </span>
              </div>
            </div>
          </div>

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-[#64748B]">
              Don't have a company account?{" "}
              <a
                href="/register"
                className="font-semibold text-[#2563EB] hover:text-[#1D4ED8] transition-colors"
              >
                Register your company
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
