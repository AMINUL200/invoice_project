import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import AppLayout from "./layout/AppLayout";
import LandingPage from "./pages/landing/LandingPage";
import AdminLayout from "./layout/AdminLayout";
import AdminLogin from "./pages/super_admin/auth/AdminLogin";
import AdminDashboard from "./pages/super_admin/dashboard/AdminDashboard";
import CompaniesPage from "./pages/super_admin/companies/CompaniesPage";
import CreateCompanyPage from "./pages/super_admin/companies/CreateCompanyPage";
import CompanyDetailsPage from "./pages/super_admin/companies/CompanyDetailsPage";
import EditCompanyPage from "./pages/super_admin/companies/EditCompanyPage";
import CreatePlanPage from "./pages/super_admin/plans/CreatePlanPage";
import EditPlanPage from "./pages/super_admin/plans/EditPlanPage";
import PlansPage from "./pages/super_admin/plans/PlansPage";
import SubscriptionsPage from "./pages/super_admin/plans/SubscriptionsPage";
import SystemSettingsPage from "./component/super_admin/settings/SystemSettingsPage";
import { Toaster } from "react-hot-toast";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import CompanyDashboard from "./pages/company/dashboard/CompanyDashboard";
import HandleVendor from "./pages/company/vendor/HandleVendor";
import OrganizationProfile from "./pages/company/profile/OrganizationProfile";
import HandlePurchaseOrder from "./pages/company/vendor/HandlePurchaseOrder";
import HandlePurchaseBills from "./pages/company/vendor/HandlePurchaseBills";
import HandleVendorCreditNotes from "./pages/company/vendor/HandleVendorCreditNotes";
import HandleOrgSettings from "./pages/company/setting/HandleOrgSettings";
import HandleCustomer from "./pages/company/sales/HandleCustomer";
import HandleQuotations from "./pages/company/sales/HandleQuotations";
import HandleCreditNotes from "./pages/company/sales/HandleCreditNotes";
import HandleInvoices from "./pages/company/sales/HandleInvoices";
import HandleDebitNotes from "./pages/company/sales/HandleDebitNotes";
import DeliveryChallans from "./pages/company/sales/DeliveryChallans";
import HandleInvoicesDetailPage from "./pages/company/sales/HandleInvoicesDetailPage";
import HandleProformaInvoices from "./pages/company/sales/HandleProformaInvoices";

const App = () => {
  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        <Route element={<AppLayout />}>
          <Route index path="/" element={<LandingPage />} />
        </Route>

        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" index element={<AdminDashboard />} />
          <Route path="settings" element={<SystemSettingsPage />} />

          {/* ---------- Start Organization or Companies handle super admin */}
          <Route path="companies" element={<CompaniesPage />} />
          <Route path="companies/create" element={<CreateCompanyPage />} />
          <Route path="companies/:id" element={<CompanyDetailsPage />} />
          <Route path="companies/:id/edit" element={<EditCompanyPage />} />
          {/* ----------End ---------- */}

          {/* --------- Start Plans and Subscription ------- */}
          <Route path="plans" element={<PlansPage />} />
          <Route path="plans/create" element={<CreatePlanPage />} />
          <Route path="plans/:id/edit" element={<EditPlanPage />} />
          <Route path="subscriptions" element={<SubscriptionsPage />} />
          {/* --------- End Plans and Subscription ------- */}
        </Route>

        <Route path="/org" element={<AdminLayout />}>
          <Route path="dashboard" element={<CompanyDashboard />} />
          <Route path="profile" element={<OrganizationProfile />} />
          <Route path="settings" element={<HandleOrgSettings />} />

          {/* Purchase Side */}
          <Route path="purchase/vendors" element={<HandleVendor />} />
          <Route
            path="purchase/purchase-orders"
            element={<HandlePurchaseOrder />}
          />
          <Route
            path="purchase/purchase-bills"
            element={<HandlePurchaseBills />}
          />
          <Route
            path="purchase/vendor-credit-notes"
            element={<HandleVendorCreditNotes />}
          />

          {/* Sales Side */}
          <Route path="sales/customers" element={<HandleCustomer />} />
          <Route path="sales/quotations" element={<HandleQuotations />} />
          <Route
            path="sales/proforma-invoices"
            element={<HandleProformaInvoices />}
          />
          <Route
            path="sales/delivery-challans"
            element={<DeliveryChallans />}
          />
          <Route path="sales/invoices" element={<HandleInvoices />} />
          <Route path="sales/credit-notes" element={<HandleCreditNotes />} />
          <Route path="sales/debit-notes" element={<HandleDebitNotes />} />
        </Route>
        <Route
          path="/org/invoices/:id/preview"
          element={<HandleInvoicesDetailPage />}
        />
      </Routes>
    </Router>
  );
};

export default App;
