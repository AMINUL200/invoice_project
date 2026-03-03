// pages/LandingPage.jsx
import React, { useState, useEffect } from 'react';
import {
  Menu,
  X,
  CheckCircle,
  ArrowRight,
  Star,
  Users,
  FileText,
  CreditCard,
  Shield,
  Clock,
  TrendingUp,
  Download,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  ChevronRight
} from 'lucide-react';

const LandingPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      icon: FileText,
      title: 'Smart Invoicing',
      description: 'Create professional invoices in seconds with our intuitive interface',
      color: 'bg-[#2563EB]/10',
      iconColor: 'text-[#2563EB]'
    },
    {
      icon: CreditCard,
      title: 'Payment Integration',
      description: 'Accept payments via Razorpay, Stripe, and PayPal seamlessly',
      color: 'bg-[#22C55E]/10',
      iconColor: 'text-[#22C55E]'
    },
    {
      icon: Shield,
      title: 'Secure & Compliant',
      description: 'Bank-level security with GST compliance and audit trails',
      color: 'bg-[#F59E0B]/10',
      iconColor: 'text-[#F59E0B]'
    },
    {
      icon: Users,
      title: 'Multi-user Access',
      description: 'Role-based access for Super Admin, Company Admin, and Staff',
      color: 'bg-[#8B5CF6]/10',
      iconColor: 'text-[#8B5CF6]'
    },
    {
      icon: Clock,
      title: 'Real-time Updates',
      description: 'Track invoice status, payments, and overdue alerts instantly',
      color: 'bg-[#EC4899]/10',
      iconColor: 'text-[#EC4899]'
    },
    {
      icon: TrendingUp,
      title: 'Analytics Dashboard',
      description: 'Comprehensive reports and insights for your business',
      color: 'bg-[#2563EB]/10',
      iconColor: 'text-[#2563EB]'
    }
  ];

  const testimonials = [
    {
      name: 'Rahul Sharma',
      role: 'Business Owner',
      content: 'This platform has transformed how I manage my invoices. The dashboard gives me complete control over my finances.',
      rating: 5,
      company: 'Sharma Enterprises'
    },
    {
      name: 'Priya Patel',
      role: 'Finance Manager',
      content: 'The multi-role access is perfect for our team. Staff can create invoices while admins maintain oversight.',
      rating: 5,
      company: 'Patel & Co'
    },
    {
      name: 'Amit Kumar',
      role: 'CA',
      content: 'GST compliance and detailed reports make tax filing effortless. Highly recommended for Indian businesses.',
      rating: 5,
      company: 'Kumar & Associates'
    }
  ];

  const pricingPlans = [
    {
      name: 'Starter',
      price: '299',
      period: 'month',
      features: [
        '10 invoices/month',
        'Basic reporting',
        'Email support',
        'Single user'
      ],
      buttonText: 'Start Free Trial',
      popular: false
    },
    {
      name: 'Professional',
      price: '799',
      period: 'month',
      features: [
        '50 invoices/month',
        'Advanced analytics',
        'Priority support',
        'Up to 5 users',
        'Payment integration'
      ],
      buttonText: 'Get Started',
      popular: true
    },
    {
      name: 'Enterprise',
      price: '1999',
      period: 'month',
      features: [
        'Unlimited invoices',
        'Custom reports',
        '24/7 phone support',
        'Unlimited users',
        'API access',
        'Dedicated account manager'
      ],
      buttonText: 'Contact Sales',
      popular: false
    }
  ];

  const stats = [
    { value: '10K+', label: 'Active Users' },
    { value: '50K+', label: 'Invoices Created' },
    { value: '₹100M+', label: 'Transactions Processed' },
    { value: '99.9%', label: 'Uptime' }
  ];

  const navigation = [
    { name: 'Features', href: '#features' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'About', href: '#about' },
    { name: 'Contact', href: '#contact' }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
    

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center space-x-2 bg-[#2563EB]/10 text-[#2563EB] px-4 py-2 rounded-full mb-6">
                <Star className="w-4 h-4" />
                <span className="text-sm font-medium">Trusted by 10,000+ businesses</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#0F172A] leading-tight mb-6">
                Smart Invoicing for{' '}
                <span className="text-[#2563EB]">Modern Businesses</span>
              </h1>
              <p className="text-lg text-[#64748B] mb-8 max-w-lg">
                Create, manage, and track invoices effortlessly. Accept payments online, stay GST compliant, and grow your business with our all-in-one billing solution.
              </p>
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                <button className="px-6 py-3 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-lg font-medium transition-all transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2">
                  <span>Start Free Trial</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button className="px-6 py-3 border border-[#CBD5E1] hover:bg-[#F8FAFC] text-[#334155] rounded-lg font-medium transition-colors flex items-center justify-center space-x-2">
                  <span>Watch Demo</span>
                </button>
              </div>
              <div className="flex items-center space-x-4 mt-8">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full bg-[#2563EB]/20 border-2 border-white flex items-center justify-center"
                    >
                      <Users className="w-4 h-4 text-[#2563EB]" />
                    </div>
                  ))}
                </div>
                <p className="text-sm text-[#64748B]">
                  <span className="font-semibold text-[#0F172A]">Join 10,000+</span> businesses already using BillSmart
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#2563EB]/10 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-[#F59E0B]/10 rounded-full blur-3xl"></div>
              <div className="relative bg-white rounded-2xl shadow-2xl border border-[#E2E8F0] p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-[#2563EB] rounded-lg flex items-center justify-center">
                      <FileText className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-semibold text-[#0F172A]">Recent Invoice</span>
                  </div>
                  <span className="px-2 py-1 bg-[#DCFCE7] text-[#15803D] text-xs font-medium rounded-full">
                    Paid
                  </span>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[#64748B]">Invoice #INV-2024-001</span>
                    <span className="font-semibold text-[#0F172A]">₹25,000</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#64748B]">Customer</span>
                    <span className="text-[#0F172A]">Rahul Traders</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#64748B]">Due Date</span>
                    <span className="text-[#0F172A]">Mar 15, 2024</span>
                  </div>
                  <div className="pt-3 border-t border-[#E2E8F0]">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-[#0F172A]">Total</span>
                      <span className="text-xl font-bold text-[#2563EB]">₹25,000</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white border-y border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <p className="text-3xl font-bold text-[#0F172A]">{stat.value}</p>
                <p className="text-sm text-[#64748B] mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-[#0F172A] mb-4">
              Everything you need to manage invoices
            </h2>
            <p className="text-lg text-[#64748B]">
              Powerful features that streamline your billing process and help you get paid faster
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-xl border border-[#E2E8F0] p-6 hover:shadow-lg transition-shadow"
                >
                  <div className={`w-12 h-12 ${feature.color} rounded-lg flex items-center justify-center mb-4`}>
                    <Icon className={`w-6 h-6 ${feature.iconColor}`} />
                  </div>
                  <h3 className="text-lg font-semibold text-[#0F172A] mb-2">{feature.title}</h3>
                  <p className="text-[#64748B]">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-white px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-[#0F172A] mb-4">
              Simple, transparent pricing
            </h2>
            <p className="text-lg text-[#64748B]">
              Choose the plan that's right for your business
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <div
                key={index}
                className={`relative bg-white rounded-xl border ${
                  plan.popular ? 'border-[#2563EB] shadow-xl scale-105' : 'border-[#E2E8F0]'
                } p-6`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-[#2563EB] text-white px-3 py-1 rounded-full text-xs font-medium">
                      Most Popular
                    </span>
                  </div>
                )}
                <h3 className="text-xl font-bold text-[#0F172A] mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-3xl font-bold text-[#0F172A]">₹{plan.price}</span>
                  <span className="text-[#64748B]">/{plan.period}</span>
                </div>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start space-x-2">
                      <CheckCircle className="w-5 h-5 text-[#22C55E] flex-shrink-0" />
                      <span className="text-[#64748B]">{feature}</span>
                    </li>
                  ))}
                </ul>
                <button
                  className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                    plan.popular
                      ? 'bg-[#2563EB] hover:bg-[#1D4ED8] text-white'
                      : 'border border-[#CBD5E1] hover:bg-[#F8FAFC] text-[#334155]'
                  }`}
                >
                  {plan.buttonText}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-[#0F172A] mb-4">
              Loved by business owners
            </h2>
            <p className="text-lg text-[#64748B]">
              See what our customers have to say about BillSmart
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-xl border border-[#E2E8F0] p-6">
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-[#F59E0B] fill-current" />
                  ))}
                </div>
                <p className="text-[#64748B] mb-4">"{testimonial.content}"</p>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-[#2563EB]/10 rounded-full flex items-center justify-center">
                    <span className="text-[#2563EB] font-semibold">
                      {testimonial.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-[#0F172A]">{testimonial.name}</p>
                    <p className="text-xs text-[#64748B]">{testimonial.role} • {testimonial.company}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#2563EB] px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to streamline your billing?
          </h2>
          <p className="text-lg text-[#CBD5F5] mb-8">
            Join thousands of businesses that trust BillSmart for their invoicing needs
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
            <button className="px-6 py-3 bg-white hover:bg-[#F8FAFC] text-[#2563EB] rounded-lg font-medium transition-colors shadow-lg">
              Start Free Trial
            </button>
            <button className="px-6 py-3 border border-white hover:bg-white/10 text-white rounded-lg font-medium transition-colors">
              Contact Sales
            </button>
          </div>
        </div>
      </section>

     
    </div>
  );
};

export default LandingPage;