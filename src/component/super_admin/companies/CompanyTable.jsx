// components/companies/CompanyTable.jsx
import React, { useState } from "react";
import {
  MoreHorizontal,
  Edit,
  Trash2,
  LogIn,
  CheckCircle,
  XCircle,
  AlertCircle,
  PauseCircle,
  Eye,
  Download,
  Mail,
  Building2,
  Copy,
  FileText,
} from "lucide-react";

const statusConfig = {
  active: {
    icon: CheckCircle,
    color: "bg-[#DCFCE7] text-[#15803D]",
    label: "Active",
  },
  suspended: {
    icon: AlertCircle,
    color: "bg-[#FEF3C7] text-[#B45309]",
    label: "Suspended",
  },
  inactive: {
    icon: PauseCircle,
    color: "bg-[#E2E8F0] text-[#475569]",
    label: "Inactive",
  },
};

const CompanyTable = ({
  companies,
  loading,
  onStatusChange,
  onImpersonate,
  onDelete,
  selectedCompanies,
  setSelectedCompanies,
}) => {
  const [actionMenu, setActionMenu] = useState(null);
  const [copySuccess, setCopySuccess] = useState(null);

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedCompanies(companies.map((c) => c.id));
    } else {
      setSelectedCompanies([]);
    }
  };

  const handleSelectCompany = (companyId) => {
    setSelectedCompanies((prev) => {
      if (prev.includes(companyId)) {
        return prev.filter((id) => id !== companyId);
      } else {
        return [...prev, companyId];
      }
    });
  };

  const handleAction = (action, company) => {
    setActionMenu(null);
    switch (action) {
      case "edit":
        window.location.href = `/admin/companies/${company.id}/edit`;
        break;
      case "view":
        window.location.href = `/admin/companies/${company.id}`;
        break;
      case "impersonate":
        onImpersonate(company);
        break;
      case "activate":
        onStatusChange(company.id, "active");
        break;
      case "suspend":
        onStatusChange(company.id, "suspended");
        break;
      case "deactivate":
        onStatusChange(company.id, "inactive");
        break;
      case "delete":
        if (
          window.confirm(
            `Are you sure you want to delete ${company.company_name}?`,
          )
        ) {
          onDelete(company.id);
        }
        break;
      case "copyCode":
        navigator.clipboard.writeText(company.organization_code);
        setCopySuccess(company.id);
        setTimeout(() => setCopySuccess(null), 2000);
        break;
      default:
        break;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm p-8">
        <div className="flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-[#2563EB] border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm overflow-hidden">
      <div className="max-w-[400px] md:max-w-[700px] lg:max-w-[1140px] overflow-x-auto">
        <table className="w-full min-w-[700px]">
          <thead className="bg-[#F1F5F9]">
            <tr>
              <th className="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  checked={
                    selectedCompanies.length === companies.length &&
                    companies.length > 0
                  }
                  onChange={handleSelectAll}
                  className="rounded border-[#CBD5E1] text-[#2563EB] focus:ring-[#2563EB]"
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#334155] uppercase tracking-wider">
                Company Details
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#334155] uppercase tracking-wider">
                Organization Code
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#334155] uppercase tracking-wider">
                GSTIN
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#334155] uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#334155] uppercase tracking-wider">
                Phone
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#334155] uppercase tracking-wider">
                Created Date
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-[#334155] uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2E8F0]">
            {companies.map((company) => {
              const StatusIcon =
                statusConfig[company.status]?.icon || CheckCircle;
              const statusColor =
                statusConfig[company.status]?.color ||
                "bg-[#E2E8F0] text-[#475569]";

              return (
                <tr
                  key={company.id}
                  className="hover:bg-[#F8FAFC] transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedCompanies.includes(company.id)}
                      onChange={() => handleSelectCompany(company.id)}
                      className="rounded border-[#CBD5E1] text-[#2563EB] focus:ring-[#2563EB]"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-start">
                      <div className="w-10 h-10 bg-[#2563EB]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Building2 className="w-5 h-5 text-[#2563EB]" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-[#0F172A]">
                          {company.company_name}
                        </p>
                        <p className="text-xs text-[#64748B] mt-0.5">
                          {company.legal_name}
                        </p>
                        <p className="text-xs text-[#64748B] mt-0.5 flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {company.email}
                        </p>
                        <p
                          className="text-xs text-[#64748B] mt-0.5 truncate max-w-[250px]"
                          title={company.address}
                        >
                          {company.address}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-mono bg-[#F1F5F9] px-2 py-1 rounded">
                        {company.organization_code}
                      </span>
                      <button
                        onClick={() => handleAction("copyCode", company)}
                        className="p-1 hover:bg-[#F1F5F9] rounded transition-colors"
                        title="Copy code"
                      >
                        <Copy className="w-4 h-4 text-[#64748B]" />
                      </button>
                      {copySuccess === company.id && (
                        <span className="text-xs text-[#22C55E]">Copied!</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-[#0F172A]">
                      {company.gstin || "N/A"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full flex items-center w-fit gap-1 ${statusColor}`}
                    >
                      <StatusIcon className="w-3 h-3" />
                      {statusConfig[company.status]?.label || company.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-[#64748B]">
                      {company.phone || "N/A"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <span className="text-sm text-[#64748B]">
                        {formatDate(company.created_at)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm relative">
                    <button
                      onClick={() =>
                        setActionMenu(
                          actionMenu === company.id ? null : company.id,
                        )
                      }
                      className="p-1 hover:bg-[#F1F5F9] rounded-lg transition-colors"
                    >
                      <MoreHorizontal className="w-5 h-5 text-[#64748B]" />
                    </button>

                    {actionMenu === company.id && (
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-[#E2E8F0] z-10">
                        <div className="py-1">
                          <button
                            onClick={() => handleAction("view", company)}
                            className="w-full px-4 py-2 text-left text-sm text-[#334155] hover:bg-[#F8FAFC] flex items-center space-x-2"
                          >
                            <Eye className="w-4 h-4" />
                            <span>View Details</span>
                          </button>
                          <button
                            onClick={() => handleAction("edit", company)}
                            className="w-full px-4 py-2 text-left text-sm text-[#334155] hover:bg-[#F8FAFC] flex items-center space-x-2"
                          >
                            <Edit className="w-4 h-4" />
                            <span>Edit Company</span>
                          </button>
                          <button
                            onClick={() => handleAction("impersonate", company)}
                            className="w-full px-4 py-2 text-left text-sm text-[#334155] hover:bg-[#F8FAFC] flex items-center space-x-2"
                          >
                            <LogIn className="w-4 h-4" />
                            <span>Login as Company</span>
                          </button>

                          <div className="border-t border-[#E2E8F0] my-1"></div>

                          <button
                            onClick={() =>
                              window.open(
                                `/admin/invoices?company=${company.id}`,
                                "_blank",
                              )
                            }
                            className="w-full px-4 py-2 text-left text-sm text-[#334155] hover:bg-[#F8FAFC] flex items-center space-x-2"
                          >
                            <FileText className="w-4 h-4" />
                            <span>View Invoices</span>
                          </button>

                          <div className="border-t border-[#E2E8F0] my-1"></div>

                          {company.status !== "active" && (
                            <button
                              onClick={() => handleAction("activate", company)}
                              className="w-full px-4 py-2 text-left text-sm text-[#22C55E] hover:bg-[#F8FAFC] flex items-center space-x-2"
                            >
                              <CheckCircle className="w-4 h-4" />
                              <span>Activate Company</span>
                            </button>
                          )}
                          {company.status !== "suspended" &&
                            company.status === "active" && (
                              <button
                                onClick={() => handleAction("suspend", company)}
                                className="w-full px-4 py-2 text-left text-sm text-[#F59E0B] hover:bg-[#F8FAFC] flex items-center space-x-2"
                              >
                                <AlertCircle className="w-4 h-4" />
                                <span>Suspend Company</span>
                              </button>
                            )}
                          {company.status !== "inactive" && (
                            <button
                              onClick={() =>
                                handleAction("deactivate", company)
                              }
                              className="w-full px-4 py-2 text-left text-sm text-[#EF4444] hover:bg-[#F8FAFC] flex items-center space-x-2"
                            >
                              <PauseCircle className="w-4 h-4" />
                              <span>Deactivate Company</span>
                            </button>
                          )}

                          <div className="border-t border-[#E2E8F0] my-1"></div>

                          <button
                            onClick={() => handleAction("delete", company)}
                            className="w-full px-4 py-2 text-left text-sm text-[#EF4444] hover:bg-[#F8FAFC] flex items-center space-x-2"
                          >
                            <Trash2 className="w-4 h-4" />
                            <span>Delete Company</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {companies.length === 0 && (
        <div className="text-center py-12">
          <Building2 className="w-12 h-12 text-[#64748B] mx-auto mb-4" />
          <p className="text-[#0F172A] font-medium">No companies found</p>
          <p className="text-sm text-[#64748B] mt-1">
            Try adjusting your search or filters
          </p>
        </div>
      )}
    </div>
  );
};

export default CompanyTable;
