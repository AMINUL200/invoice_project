import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  CheckCircle,
  Download,
  Mail,
  Printer,
  Home,
  FileText,
  Calendar,
  Clock,
  CreditCard,
  IndianRupee,
  Building2,
  ArrowRight,
  Share2,
  Check,
  Sparkles
} from 'lucide-react';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [countdown, setCountdown] = useState(10);
  
  // Get payment details from URL params (you can customize these based on your actual params)
  const paymentDetails = {
    amount: searchParams.get('amount') || '1,500',
    transactionId: searchParams.get('transaction_id') || 'TXN' + Math.random().toString(36).substring(7).toUpperCase(),
    invoiceNo: searchParams.get('invoice_no') || 'INV-2024-001',
    date: new Date().toLocaleDateString('en-US', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    }),
    time: new Date().toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    }),
    paymentMethod: searchParams.get('method') || 'Credit Card',
    customerName: searchParams.get('name') || 'Valued Customer',
    companyName: 'BillSmart'
  };

  // Auto-redirect countdown
  // useEffect(() => {
  //   const timer = setInterval(() => {
  //     setCountdown((prev) => {
  //       if (prev <= 1) {
  //         clearInterval(timer);
  //         navigate('/dashboard');
  //         return 0;
  //       }
  //       return prev - 1;
  //     });
  //   }, 1000);

  //   return () => clearInterval(timer);
  // }, [navigate]);

  const handleDownloadReceipt = () => {
    // Implement receipt download logic
    console.log('Downloading receipt...');
  };

  const handleEmailReceipt = () => {
    // Implement email receipt logic
    console.log('Emailing receipt...');
  };

  const handlePrintReceipt = () => {
    // Implement print logic
    window.print();
  };

  const handleShare = () => {
    // Implement share logic
    if (navigator.share) {
      navigator.share({
        title: 'Payment Receipt',
        text: `Payment of ₹${paymentDetails.amount} was successful`,
        url: window.location.href,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F0F9FF] via-white to-[#F0F9FF] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#2563EB]/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#2563EB]/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#2563EB]/[0.02] rounded-full blur-3xl"></div>
      </div>

      {/* Success Card */}
      <div className="max-w-2xl w-full relative animate-fadeIn">
        {/* Success Badge */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2">
          <div className="relative">
            <div className="w-24 h-24 bg-gradient-to-br from-[#22C55E] to-[#16A34A] rounded-full flex items-center justify-center shadow-xl animate-bounce-slow">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
            <div className="absolute -top-1 -right-1">
              <Sparkles className="w-6 h-6 text-yellow-400 animate-pulse" />
            </div>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl overflow-hidden mt-12">
          {/* Gradient Header */}
          <div className="bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] px-8 py-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                  <Building2 className="w-6 h-6" />
                </div>
                <span className="text-lg font-semibold tracking-wider">{paymentDetails.companyName}</span>
              </div>
              <div className="px-3 py-1 bg-white/20 rounded-full backdrop-blur-sm flex items-center space-x-1">
                <Check className="w-4 h-4" />
                <span className="text-sm font-medium">Payment Successful</span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Thank You Message */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-[#0F172A] mb-2">
                Thank You, {paymentDetails.customerName}!
              </h1>
              <p className="text-[#64748B]">
                Your payment has been processed successfully
              </p>
            </div>

            {/* Amount Display */}
            <div className="bg-gradient-to-r from-[#F8FAFC] to-[#F1F5F9] rounded-2xl p-6 mb-8 text-center border border-[#E2E8F0]">
              <p className="text-sm text-[#64748B] mb-2">Total Amount Paid</p>
              <div className="flex items-center justify-center">
                <IndianRupee className="w-8 h-8 text-[#2563EB]" />
                <span className="text-5xl font-bold text-[#0F172A]">{paymentDetails.amount}</span>
              </div>
              <p className="text-xs text-[#64748B] mt-2">in Indian Rupees</p>
            </div>

            {/* Payment Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <div className="bg-[#F8FAFC] rounded-xl p-4 border border-[#E2E8F0] hover:border-[#2563EB] transition-colors group">
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-white rounded-lg group-hover:bg-[#2563EB] transition-colors">
                    <FileText className="w-4 h-4 text-[#64748B] group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <p className="text-xs text-[#64748B]">Invoice Number</p>
                    <p className="text-sm font-semibold text-[#0F172A]">{paymentDetails.invoiceNo}</p>
                  </div>
                </div>
              </div>

              <div className="bg-[#F8FAFC] rounded-xl p-4 border border-[#E2E8F0] hover:border-[#2563EB] transition-colors group">
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-white rounded-lg group-hover:bg-[#2563EB] transition-colors">
                    <CreditCard className="w-4 h-4 text-[#64748B] group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <p className="text-xs text-[#64748B]">Payment Method</p>
                    <p className="text-sm font-semibold text-[#0F172A]">{paymentDetails.paymentMethod}</p>
                  </div>
                </div>
              </div>

              <div className="bg-[#F8FAFC] rounded-xl p-4 border border-[#E2E8F0] hover:border-[#2563EB] transition-colors group">
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-white rounded-lg group-hover:bg-[#2563EB] transition-colors">
                    <Calendar className="w-4 h-4 text-[#64748B] group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <p className="text-xs text-[#64748B]">Date</p>
                    <p className="text-sm font-semibold text-[#0F172A]">{paymentDetails.date}</p>
                  </div>
                </div>
              </div>

              <div className="bg-[#F8FAFC] rounded-xl p-4 border border-[#E2E8F0] hover:border-[#2563EB] transition-colors group">
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-white rounded-lg group-hover:bg-[#2563EB] transition-colors">
                    <Clock className="w-4 h-4 text-[#64748B] group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <p className="text-xs text-[#64748B]">Time</p>
                    <p className="text-sm font-semibold text-[#0F172A]">{paymentDetails.time}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Transaction ID */}
            <div className="bg-[#F8FAFC] rounded-xl p-4 mb-8 border border-[#E2E8F0]">
              <div className="flex items-center justify-between">
                <p className="text-sm text-[#64748B]">Transaction ID</p>
                <p className="text-sm font-mono font-semibold text-[#0F172A]">{paymentDetails.transactionId}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
              <button
                onClick={handleDownloadReceipt}
                className="flex items-center justify-center space-x-2 px-4 py-3 bg-white border border-[#E2E8F0] rounded-xl hover:border-[#2563EB] hover:shadow-lg transition-all group"
              >
                <Download className="w-4 h-4 text-[#64748B] group-hover:text-[#2563EB] transition-colors" />
                <span className="text-sm font-medium text-[#334155] group-hover:text-[#2563EB] transition-colors">Download</span>
              </button>

              <button
                onClick={handleEmailReceipt}
                className="flex items-center justify-center space-x-2 px-4 py-3 bg-white border border-[#E2E8F0] rounded-xl hover:border-[#2563EB] hover:shadow-lg transition-all group"
              >
                <Mail className="w-4 h-4 text-[#64748B] group-hover:text-[#2563EB] transition-colors" />
                <span className="text-sm font-medium text-[#334155] group-hover:text-[#2563EB] transition-colors">Email</span>
              </button>

              <button
                onClick={handlePrintReceipt}
                className="flex items-center justify-center space-x-2 px-4 py-3 bg-white border border-[#E2E8F0] rounded-xl hover:border-[#2563EB] hover:shadow-lg transition-all group"
              >
                <Printer className="w-4 h-4 text-[#64748B] group-hover:text-[#2563EB] transition-colors" />
                <span className="text-sm font-medium text-[#334155] group-hover:text-[#2563EB] transition-colors">Print</span>
              </button>

              <button
                onClick={handleShare}
                className="flex items-center justify-center space-x-2 px-4 py-3 bg-white border border-[#E2E8F0] rounded-xl hover:border-[#2563EB] hover:shadow-lg transition-all group"
              >
                <Share2 className="w-4 h-4 text-[#64748B] group-hover:text-[#2563EB] transition-colors" />
                <span className="text-sm font-medium text-[#334155] group-hover:text-[#2563EB] transition-colors">Share</span>
              </button>
            </div>

          

           
          </div>

          {/* Footer */}
          <div className="px-8 py-4 bg-[#F8FAFC] border-t border-[#E2E8F0]">
            <p className="text-xs text-center text-[#64748B]">
              A confirmation email has been sent to your registered email address
            </p>
          </div>
        </div>

        
      </div>

      {/* Add custom animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out;
        }

        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .animate-bounce-slow {
          animation: bounce-slow 2s infinite;
        }

        .delay-1000 {
          animation-delay: 1s;
        }
      `}</style>
    </div>
  );
};

export default PaymentSuccess;