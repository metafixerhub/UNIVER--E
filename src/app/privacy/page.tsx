'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Lock,
  Eye,
  FileText,
  Mail,
  MapPin,
  Clock,
  Printer,
  Search,
  CheckCircle2,
  AlertCircle,
  Database,
  Cpu,
  UserCheck,
  Scale,
  Globe,
  Trash2,
  Share2,
} from 'lucide-react';

export default function PrivacyPage() {
  const [activeSection, setActiveSection] = useState('sec-1');
  const [searchQuery, setSearchQuery] = useState('');

  const sections = [
    { id: 'sec-1', title: '1. Introduction' },
    { id: 'sec-2', title: '2. Information We Collect' },
    { id: 'sec-3', title: '3. How We Use Your Information' },
    { id: 'sec-4', title: '4. Legal Basis and Consent' },
    { id: 'sec-5', title: "5. Children's Privacy & Age Requirements" },
    { id: 'sec-6', title: '6. Cookies & Tracking Technologies' },
    { id: 'sec-7', title: '7. Third-Party Services & Data Sharing' },
    { id: 'sec-8', title: '8. Educational Partners & Certificates' },
    { id: 'sec-9', title: '9. AI-Powered Features & Processing' },
    { id: 'sec-10', title: '10. Data Storage and Retention' },
    { id: 'sec-11', title: '11. Data Security Measures' },
    { id: 'sec-12', title: '12. Data Breach & Security Incidents' },
    { id: 'sec-13', title: '13. International Data Transfers' },
    { id: 'sec-14', title: '14. Your Privacy Rights (DPDP Act)' },
    { id: 'sec-15', title: '15. Account Deletion' },
    { id: 'sec-16', title: '16. Marketing & Promotional Communications' },
    { id: 'sec-17', title: '17. Student-Generated Content & Profiles' },
    { id: 'sec-18', title: '18. Third-Party Websites' },
    { id: 'sec-19', title: '19. Changes to This Privacy Policy' },
    { id: 'sec-20', title: '20. Grievance Redressal & Privacy Contact' },
    { id: 'sec-21', title: '21. Governing Law' },
    { id: 'sec-22', title: '22. Final Privacy Commitment' },
  ];

  const filteredSections = searchQuery.trim()
    ? sections.filter(s => s.title.toLowerCase().includes(searchQuery.toLowerCase()))
    : sections;

  return (
    <div className="bg-[#F5F8FC]/60 min-h-screen py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-[#082B59] via-[#0D3B75] to-[#082B59] text-white rounded-3xl p-8 sm:p-12 shadow-md relative overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-96 h-96 bg-[#13A8E8]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute right-1/3 bottom-0 w-64 h-64 bg-[#28A745]/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 space-y-4 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-emerald-300 text-xs font-bold border border-white/10">
              <ShieldCheck className="w-3.5 h-3.5 text-[#28A745]" />
              <span>Compliant with DPDP Act 2023 &amp; DPDP Rules 2025 (India)</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white font-brand">
              Privacy &amp; Data Governance Policy
            </h1>

            <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
              UNIVER-E Digital Academy Master Privacy Policy explaining how personal information is collected, processed, protected, and safeguarded with full transparency, zero raw card retention, and cryptographic hashing.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-slate-300">
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#F5A900]" />
                <span>Effective Date: November 15, 2026</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-[#13A8E8]" />
                <span>Jurisdiction: Republic of India</span>
              </div>
              <span>•</span>
              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 text-white hover:text-[#F5A900] underline font-bold transition ml-auto"
              >
                <Printer className="w-4 h-4" />
                <span>Print Document</span>
              </button>
            </div>
          </div>
        </div>

        {/* Master Policy Document Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Sticky Table of Contents Sidebar */}
          <aside className="lg:col-span-4 sticky top-24 space-y-4">
            <div className="bg-white rounded-3xl p-5 border border-gray-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-[#082B59] flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#28A745]" />
                  <span>Privacy Sections</span>
                </h3>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                  22 Sections
                </span>
              </div>

              {/* Filter / Search Bar */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Filter privacy topics..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-slate-50 border border-gray-200 focus:outline-none focus:ring-1 focus:ring-[#13A8E8]"
                />
              </div>

              <div className="max-h-[60vh] overflow-y-auto space-y-1 pr-1 text-xs custom-scrollbar">
                {filteredSections.map(sec => {
                  const isActive = activeSection === sec.id;
                  return (
                    <a
                      key={sec.id}
                      href={`#${sec.id}`}
                      onClick={() => setActiveSection(sec.id)}
                      className={`block px-3 py-2 rounded-xl transition text-left font-medium ${
                        isActive
                          ? 'bg-blue-50 text-[#13A8E8] font-bold border-l-4 border-[#13A8E8]'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                    >
                      {sec.title}
                    </a>
                  );
                })}
              </div>

              {/* Grievance Desk Box */}
              <div className="p-3.5 rounded-2xl bg-[#082B59] text-white space-y-2 text-xs">
                <div className="font-bold flex items-center gap-1.5 text-emerald-300">
                  <Mail className="w-4 h-4 text-[#28A745]" />
                  <span>Privacy &amp; Grievance Desk</span>
                </div>
                <p className="text-[11px] text-slate-200 leading-relaxed">
                  Have questions about your data, consent withdrawal or DPDP rights? Contact the designated privacy secretariat:
                </p>
                <a
                  href="mailto:univer-e-services@protonmail.com"
                  className="block text-amber-300 hover:text-white font-mono text-[11px] font-bold break-all transition underline"
                >
                  univer-e-services@protonmail.com
                </a>
              </div>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-12 border border-gray-200 shadow-sm space-y-12 text-slate-700 leading-relaxed">
            
            {/* Meta Governance Box */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-gray-200 text-xs grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-600">
              <div>
                <span className="font-bold text-slate-900">Platform:</span> UNIVER-E Digital Academy
              </div>
              <div>
                <span className="font-bold text-slate-900">Legal Entity:</span> UNIVER-E Digital Academy
              </div>
              <div>
                <span className="font-bold text-slate-900">Effective Date:</span> November 15, 2026
              </div>
              <div>
                <span className="font-bold text-slate-900">Jurisdiction:</span> India (DPDP Act 2023 Compliant)
              </div>
              <div className="sm:col-span-2">
                <span className="font-bold text-slate-900">Official Privacy &amp; Support Email:</span>{' '}
                <a href="mailto:univer-e-services@protonmail.com" className="text-[#13A8E8] font-bold hover:underline font-mono">
                  univer-e-services@protonmail.com
                </a>
              </div>
            </div>

            {/* SECTION 1 */}
            <section id="sec-1" className="space-y-4 scroll-mt-28 border-b border-gray-100 pb-8">
              <h2 className="text-xl sm:text-2xl font-black text-[#082B59] flex items-center gap-2">
                <span className="text-[#F5A900]">1.</span> Introduction
              </h2>
              <p className="text-xs sm:text-sm">
                Welcome to <strong>UNIVER-E Digital Academy</strong> (&quot;UNIVER-E&quot;, &quot;we&quot;, &quot;our&quot;, or &quot;us&quot;).
              </p>
              <p className="text-xs sm:text-sm">
                At UNIVER-E, we value the privacy, security and trust of our students, instructors, visitors and educational partners.
              </p>
              <p className="text-xs sm:text-sm">
                This Privacy Policy explains how we collect, use, process, store, disclose and protect personal information when you access our website, create an account, enroll in courses, participate in assessments, receive certificates or use any of our educational services.
              </p>
              <p className="text-xs sm:text-sm">
                We are committed to handling personal information responsibly and in accordance with applicable Indian data protection and privacy laws, including the <strong>Digital Personal Data Protection Act, 2023 (DPDP Act)</strong>, and the applicable <strong>Digital Personal Data Protection Rules, 2025</strong>, as their provisions become effective.
              </p>
              <p className="text-xs sm:text-sm">
                By using our services, you acknowledge that you have read this Privacy Policy.
              </p>
            </section>

            {/* SECTION 2 */}
            <section id="sec-2" className="space-y-6 scroll-mt-28 border-b border-gray-100 pb-8">
              <h2 className="text-xl sm:text-2xl font-black text-[#082B59] flex items-center gap-2">
                <span className="text-[#F5A900]">2.</span> Information We Collect
              </h2>
              <p className="text-xs sm:text-sm">
                We may collect the following categories of information:
              </p>

              <div className="space-y-4 text-xs sm:text-sm">
                <div className="p-4 rounded-2xl bg-slate-50 border border-gray-100 space-y-2">
                  <h3 className="font-bold text-[#082B59] text-sm">2.1 Personal Identification Information</h3>
                  <p>When creating an account or enrolling in a course, we may collect:</p>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pl-4 list-disc text-slate-700">
                    <li>Full name.</li>
                    <li>Email address.</li>
                    <li>Mobile phone number.</li>
                    <li>Username.</li>
                    <li>Profile photograph, if provided.</li>
                    <li>Country, state and city.</li>
                    <li>Date of birth or age information, where necessary.</li>
                    <li>Other information voluntarily provided during registration.</li>
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-gray-100 space-y-2">
                  <h3 className="font-bold text-[#082B59] text-sm">2.2 Account Information</h3>
                  <p>We may collect:</p>
                  <ul className="space-y-1 pl-4 list-disc text-slate-700">
                    <li>Login credentials and authentication information.</li>
                    <li>Account preferences.</li>
                    <li>Registration date.</li>
                    <li>Account activity.</li>
                    <li>Security and login records.</li>
                    <li>Account verification status.</li>
                  </ul>
                  <p className="text-slate-900 font-semibold pt-1">
                    🔒 Passwords are stored using secure cryptographic hashing (bcrypt/PBKDF2) rather than in readable form.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-gray-100 space-y-2">
                  <h3 className="font-bold text-[#082B59] text-sm">2.3 Educational Information</h3>
                  <p>To provide our educational services, we may collect:</p>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pl-4 list-disc text-slate-700">
                    <li>Enrolled courses.</li>
                    <li>Course completion status.</li>
                    <li>Learning progress timestamps.</li>
                    <li>Quiz and examination results.</li>
                    <li>Assignment submissions.</li>
                    <li>Project information.</li>
                    <li>Attendance records for live sessions.</li>
                    <li>Certificates and verification records.</li>
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-gray-100 space-y-2">
                  <h3 className="font-bold text-[#082B59] text-sm">2.4 Payment Information</h3>
                  <p>When purchasing courses or other services, payment-related information may include:</p>
                  <ul className="space-y-1 pl-4 list-disc text-slate-700">
                    <li>Transaction identification numbers.</li>
                    <li>Payment status.</li>
                    <li>Purchase history.</li>
                    <li>Billing information.</li>
                    <li>Refund information.</li>
                    <li>Applicable tax information (GST).</li>
                  </ul>
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 font-medium text-xs mt-2">
                    ✓ Payments are processed by authorized PCI-DSS Level 1 certified third-party providers. UNIVER-E does not store complete credit or debit card numbers, CVV codes or payment passwords on its own servers.
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-gray-100 space-y-2">
                  <h3 className="font-bold text-[#082B59] text-sm">2.5 Technical and Device Information</h3>
                  <p>When you visit our Platform, certain technical information may be collected automatically, including:</p>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pl-4 list-disc text-slate-700">
                    <li>IP address.</li>
                    <li>Browser type and version.</li>
                    <li>Device type and operating system.</li>
                    <li>Website access logs.</li>
                    <li>Session information.</li>
                    <li>Approximate location derived from technical info.</li>
                    <li>Cookies and similar technologies.</li>
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-gray-100 space-y-2">
                  <h3 className="font-bold text-[#082B59] text-sm">2.6 Communications</h3>
                  <p>
                    We collect information provided when contacting us through support emails, contact forms, feedback forms, course discussions, customer support conversations, and complaint submissions.
                  </p>
                </div>
              </div>
            </section>

            {/* SECTION 3 */}
            <section id="sec-3" className="space-y-4 scroll-mt-28 border-b border-gray-100 pb-8">
              <h2 className="text-xl sm:text-2xl font-black text-[#082B59] flex items-center gap-2">
                <span className="text-[#F5A900]">3.</span> How We Use Your Information
              </h2>
              <p className="text-xs sm:text-sm">
                UNIVER-E may use personal information for the following purposes:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                <div className="p-4 rounded-2xl bg-slate-50 border border-gray-100 space-y-1.5">
                  <h4 className="font-bold text-[#082B59]">3.1 Account Management</h4>
                  <p className="text-slate-600">Creating accounts, authenticating users, managing access, verifying ownership, and sending account notices.</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-gray-100 space-y-1.5">
                  <h4 className="font-bold text-[#082B59]">3.2 Educational Services</h4>
                  <p className="text-slate-600">Course access, progress tracking, managing exams, evaluating completion, issuing certificates, and learner help.</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-gray-100 space-y-1.5">
                  <h4 className="font-bold text-[#082B59]">3.3 Payment &amp; Finance</h4>
                  <p className="text-slate-600">Processing purchases, confirming transactions, managing refunds, financial logs, and fraud prevention.</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-gray-100 space-y-1.5">
                  <h4 className="font-bold text-[#082B59]">3.4 Communication</h4>
                  <p className="text-slate-600">Confirmations, syllabus updates, exam alerts, certificate notices, support responses, and terms changes.</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-gray-100 space-y-1.5">
                  <h4 className="font-bold text-[#082B59]">3.5 Security &amp; Fraud Prevention</h4>
                  <p className="text-slate-600">Detecting suspicious activity, stopping unauthorized access, investigating chargebacks, and protecting exam integrity.</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-gray-100 space-y-1.5">
                  <h4 className="font-bold text-[#082B59]">3.6 Platform Improvement</h4>
                  <p className="text-slate-600">Aggregated analytics to enhance video delivery, resolve bugs, understand UX, and launch new features.</p>
                </div>
              </div>
            </section>

            {/* SECTION 4 */}
            <section id="sec-4" className="space-y-4 scroll-mt-28 border-b border-gray-100 pb-8">
              <h2 className="text-xl sm:text-2xl font-black text-[#082B59] flex items-center gap-2">
                <span className="text-[#F5A900]">4.</span> Legal Basis and Consent
              </h2>
              <p className="text-xs sm:text-sm">
                <strong>4.1.</strong> UNIVER-E will process personal information only where a valid legal basis exists under applicable law.
              </p>
              <p className="text-xs sm:text-sm">
                <strong>4.2.</strong> Where consent is required, we will request consent through an appropriate mechanism.
              </p>
              <p className="text-xs sm:text-sm">
                <strong>4.3.</strong> Users will be provided with clear information about the purpose of collecting their personal data.
              </p>
              <p className="text-xs sm:text-sm">
                <strong>4.4.</strong> Users may withdraw consent through available communication or account mechanisms, subject to applicable legal requirements.
              </p>
              <p className="text-xs sm:text-sm">
                <strong>4.5.</strong> Withdrawal of consent does not affect the lawfulness of processing conducted before withdrawal.
              </p>
              <p className="text-xs sm:text-sm">
                <strong>4.6.</strong> Certain information may need to be retained to satisfy legal obligations, resolve disputes, prevent fraud or maintain legally required records.
              </p>
            </section>

            {/* SECTION 5 */}
            <section id="sec-5" className="space-y-4 scroll-mt-28 border-b border-gray-100 pb-8">
              <h2 className="text-xl sm:text-2xl font-black text-[#082B59] flex items-center gap-2">
                <span className="text-[#F5A900]">5.</span> Children&apos;s Privacy and Age Requirements
              </h2>
              <p className="text-xs sm:text-sm">
                UNIVER-E recognizes that students may include children and young learners.
              </p>
              <p className="text-xs sm:text-sm">
                <strong>5.1.</strong> We take additional precautions when handling children&apos;s personal information.
              </p>
              <p className="text-xs sm:text-sm">
                <strong>5.2.</strong> Where applicable under Indian law, processing personal data of individuals under 18 years of age requires verifiable parental or lawful guardian consent.
              </p>
              <p className="text-xs sm:text-sm">
                <strong>5.3.</strong> We will implement appropriate age-verification and parental consent procedures where legally required.
              </p>
              <p className="text-xs sm:text-sm">
                <strong>5.4.</strong> We will not knowingly engage in prohibited tracking, behavioural monitoring or targeted advertising directed at children.
              </p>
              <p className="text-xs sm:text-sm">
                <strong>5.5.</strong> Parents or lawful guardians may contact UNIVER-E at{' '}
                <a href="mailto:univer-e-services@protonmail.com" className="text-[#13A8E8] font-bold hover:underline">
                  univer-e-services@protonmail.com
                </a>{' '}
                regarding a child&apos;s personal information or consent.
              </p>
              <p className="text-xs sm:text-sm">
                <strong>5.6.</strong> We may restrict certain features where age-related legal requirements cannot be satisfied.
              </p>
            </section>

            {/* SECTION 6 */}
            <section id="sec-6" className="space-y-4 scroll-mt-28 border-b border-gray-100 pb-8">
              <h2 className="text-xl sm:text-2xl font-black text-[#082B59] flex items-center gap-2">
                <span className="text-[#F5A900]">6.</span> Cookies and Tracking Technologies
              </h2>
              <p className="text-xs sm:text-sm">
                UNIVER-E may use cookies and similar technologies to improve website functionality:
              </p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pl-4 list-disc text-xs sm:text-sm text-slate-700">
                <li>Maintaining authenticated login sessions.</li>
                <li>Remembering user language and theme preferences.</li>
                <li>Improving website navigation and course progress.</li>
                <li>Understanding website traffic trends.</li>
                <li>Maintaining website security and DDoS mitigation.</li>
                <li>Measuring Platform performance and video player bitrate.</li>
              </ul>
              <p className="text-xs sm:text-sm text-slate-600">
                Users may manage cookie preferences through browser controls. Disabling certain cookies may affect interactive features like quiz state or resume playback.
              </p>
            </section>

            {/* SECTION 7 */}
            <section id="sec-7" className="space-y-4 scroll-mt-28 border-b border-gray-100 pb-8">
              <h2 className="text-xl sm:text-2xl font-black text-[#082B59] flex items-center gap-2">
                <span className="text-[#F5A900]">7.</span> Third-Party Services and Data Sharing
              </h2>
              <p className="text-xs sm:text-sm">
                UNIVER-E may work with trusted third-party service providers to operate its Platform: website hosting, cloud storage (MongoDB Atlas), payment gateways, email delivery, authentication providers (Firebase), analytics providers, and video hosting services.
              </p>
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-amber-900 text-xs sm:text-sm space-y-1 font-medium">
                <p className="font-bold">Zero Student Data Selling Guarantee:</p>
                <p>
                  UNIVER-E does NOT sell students&apos; personal information as a business model. We do not authorize third-party providers to independently use student information for unrelated commercial purposes.
                </p>
              </div>
            </section>

            {/* SECTION 8 */}
            <section id="sec-8" className="space-y-4 scroll-mt-28 border-b border-gray-100 pb-8">
              <h2 className="text-xl sm:text-2xl font-black text-[#082B59] flex items-center gap-2">
                <span className="text-[#F5A900]">8.</span> Educational Partners and Certificate Verification
              </h2>
              <p className="text-xs sm:text-sm">
                <strong>8.1.</strong> Certain UNIVER-E courses may be conducted in collaboration with external training organizations, educational institutions or industry partners.
              </p>
              <p className="text-xs sm:text-sm">
                <strong>8.2.</strong> Where necessary, relevant student information may be shared with the applicable partner for course delivery, assessment, examination administration or certificate issuance.
              </p>
              <p className="text-xs sm:text-sm">
                <strong>8.3.</strong> The information shared will be limited strictly to what is reasonably necessary for the educational purpose.
              </p>
              <p className="text-xs sm:text-sm">
                <strong>8.4.</strong> Students will be informed where a particular course requires information sharing with an external certificate issuer.
              </p>
              <p className="text-xs sm:text-sm">
                <strong>8.5.</strong> Certificate verification involves displaying limited public data: recipient name, course title, certificate number, and completion date.
              </p>
              <p className="text-xs sm:text-sm font-semibold text-slate-900">
                <strong>8.6.</strong> Public certificate verification does NOT expose email addresses, phone numbers, marks breakdown or billing details.
              </p>
            </section>

            {/* SECTION 9 */}
            <section id="sec-9" className="space-y-4 scroll-mt-28 border-b border-gray-100 pb-8">
              <h2 className="text-xl sm:text-2xl font-black text-[#082B59] flex items-center gap-2">
                <span className="text-[#F5A900]">9.</span> AI-Powered Features and Automated Processing
              </h2>
              <p className="text-xs sm:text-sm">
                UNIVER-E may introduce AI-powered tools: learning assistants, automated quizzes, personalized recommendations, chatbots, assignment review and learning analytics.
              </p>
              <p className="text-xs sm:text-sm">
                <strong>9.1.</strong> Information submitted to AI features is processed solely to generate responses and provide educational assistance.
              </p>
              <p className="text-xs sm:text-sm">
                <strong>9.2.</strong> Where external AI service providers are used, relevant information is shared subject to strict contractual safeguards.
              </p>
              <p className="text-xs sm:text-sm">
                <strong>9.3.</strong> Students should avoid submitting passwords, financial credentials or sensitive personal information into AI chat tools.
              </p>
              <p className="text-xs sm:text-sm">
                <strong>9.4.</strong> AI feedback may contain errors and should not automatically be treated as an official examination result.
              </p>
              <p className="text-xs sm:text-sm">
                <strong>9.5.</strong> Where automated processing is used for significant educational decisions, UNIVER-E provides appropriate human review safeguards as required by law.
              </p>
            </section>

            {/* SECTION 10 */}
            <section id="sec-10" className="space-y-4 scroll-mt-28 border-b border-gray-100 pb-8">
              <h2 className="text-xl sm:text-2xl font-black text-[#082B59] flex items-center gap-2">
                <span className="text-[#F5A900]">10.</span> Data Storage and Retention
              </h2>
              <p className="text-xs sm:text-sm">
                <strong>10.1.</strong> UNIVER-E retains personal information only for as long as reasonably necessary for the purposes for which it was collected, unless a longer retention period is required or permitted by law.
              </p>
              <p className="text-xs sm:text-sm">
                <strong>10.2.</strong> Retention periods depend on account status, course enrollment, certificate verification requirements, financial/tax obligations, dispute resolution, and security auditing.
              </p>
              <p className="text-xs sm:text-sm">
                <strong>10.3.</strong> When personal information is no longer required, UNIVER-E takes appropriate steps to erase or anonymize it.
              </p>
              <p className="text-xs sm:text-sm">
                <strong>10.4.</strong> Some educational certificates and financial tax records may need to be retained after account closure in accordance with statutory requirements.
              </p>
            </section>

            {/* SECTION 11 & 12 */}
            <section id="sec-11" className="space-y-4 scroll-mt-28 border-b border-gray-100 pb-8">
              <h2 className="text-xl sm:text-2xl font-black text-[#082B59] flex items-center gap-2">
                <span className="text-[#F5A900]">11.</span> Data Security Measures
              </h2>
              <p className="text-xs sm:text-sm">
                UNIVER-E takes comprehensive technical and organizational measures to protect personal information:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-slate-700 pl-4 list-disc">
                <div>• HTTPS &amp; 256-bit TLS encrypted connections.</div>
                <div>• Secure multi-factor authentication.</div>
                <div>• Modern cryptographic password hashing.</div>
                <div>• Strict role-based administrative access.</div>
                <div>• MongoDB Atlas enterprise database security.</div>
                <div>• Continuous 24/7 server monitoring &amp; alerts.</div>
                <div>• Automated geo-redundant backup procedures.</div>
                <div>• Regular security patches &amp; audits.</div>
              </div>

              <h2 id="sec-12" className="text-xl sm:text-2xl font-black text-[#082B59] pt-6 flex items-center gap-2">
                <span className="text-[#F5A900]">12.</span> Data Breach &amp; Security Incidents
              </h2>
              <p className="text-xs sm:text-sm">
                In the event of a personal data breach, UNIVER-E will investigate the incident, contain and mitigate its effects, assess affected records, notify the Data Protection Board of India and affected individuals as mandated by the DPDP Act 2023, and take corrective measures to prevent recurrence.
              </p>
            </section>

            {/* SECTION 13 */}
            <section id="sec-13" className="space-y-4 scroll-mt-28 border-b border-gray-100 pb-8">
              <h2 className="text-xl sm:text-2xl font-black text-[#082B59] flex items-center gap-2">
                <span className="text-[#F5A900]">13.</span> International Data Transfers
              </h2>
              <p className="text-xs sm:text-sm">
                Some third-party cloud infrastructure (e.g. Firebase, video CDN nodes) may operate servers internationally. Where personal information is processed internationally, UNIVER-E complies with applicable Indian data protection requirements and restrictions issued by the Government of India, ensuring equivalent security standards.
              </p>
            </section>

            {/* SECTION 14 */}
            <section id="sec-14" className="space-y-4 scroll-mt-28 border-b border-gray-100 pb-8">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full bg-blue-50 text-[#13A8E8] text-xs font-bold">
                  DPDP Act 2023
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-[#082B59]">
                  <span className="text-[#F5A900]">14.</span> Your Privacy Rights
                </h2>
              </div>
              <p className="text-xs sm:text-sm">
                Subject to applicable law, students and registered users enjoy the following rights:
              </p>
              <div className="space-y-2 text-xs sm:text-sm text-slate-700">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#28A745] flex-shrink-0 mt-0.5" />
                  <span><strong>Right to Information:</strong> Obtain a summary of personal data being processed and processing activities.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#28A745] flex-shrink-0 mt-0.5" />
                  <span><strong>Right of Access:</strong> Access all personal data stored in your active profile.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#28A745] flex-shrink-0 mt-0.5" />
                  <span><strong>Right to Correction &amp; Completion:</strong> Correct inaccurate information or complete partial profiles.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#28A745] flex-shrink-0 mt-0.5" />
                  <span><strong>Right to Erasure:</strong> Request deletion of personal data no longer necessary for the specified purpose.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#28A745] flex-shrink-0 mt-0.5" />
                  <span><strong>Right to Withdraw Consent:</strong> Easily withdraw consent via account settings or privacy desk.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#28A745] flex-shrink-0 mt-0.5" />
                  <span><strong>Right of Grievance Redressal:</strong> Submit grievances to our Data Protection Officer.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#28A745] flex-shrink-0 mt-0.5" />
                  <span><strong>Right to Nominate:</strong> Nominate an individual to exercise rights in case of death or incapacity.</span>
                </div>
              </div>
              <p className="text-xs sm:text-sm">
                Requests may be submitted directly to{' '}
                <a href="mailto:univer-e-services@protonmail.com" className="text-[#13A8E8] font-bold hover:underline">
                  univer-e-services@protonmail.com
                </a>.
              </p>
            </section>

            {/* SECTION 15 */}
            <section id="sec-15" className="space-y-4 scroll-mt-28 border-b border-gray-100 pb-8">
              <h2 className="text-xl sm:text-2xl font-black text-[#082B59] flex items-center gap-2">
                <span className="text-[#F5A900]">15.</span> Account Deletion
              </h2>
              <p className="text-xs sm:text-sm">
                <strong>15.1.</strong> Users may request deletion of their UNIVER-E accounts.
              </p>
              <p className="text-xs sm:text-sm">
                <strong>15.2.</strong> Requests should be emailed to{' '}
                <a href="mailto:univer-e-services@protonmail.com" className="text-[#13A8E8] font-bold hover:underline">
                  univer-e-services@protonmail.com
                </a>{' '}
                with subject &quot;Account Deletion Request&quot;.
              </p>
              <p className="text-xs sm:text-sm">
                <strong>15.3.</strong> UNIVER-E will process valid requests within statutory timelines.
              </p>
              <p className="text-xs sm:text-sm">
                <strong>15.4.</strong> Information that must legally be retained (financial invoices, audit logs) will be preserved for the required period.
              </p>
              <p className="text-xs sm:text-sm">
                <strong>15.5.</strong> Deleting an account results in the loss of learning progress, unfinished courses, and personal badges.
              </p>
              <p className="text-xs sm:text-sm">
                <strong>15.6.</strong> Account deletion does not automatically entitle a student to a refund.
              </p>
            </section>

            {/* SECTION 16, 17 & 18 */}
            <section id="sec-16" className="space-y-4 scroll-mt-28 border-b border-gray-100 pb-8">
              <h2 className="text-xl sm:text-2xl font-black text-[#082B59] flex items-center gap-2">
                <span className="text-[#F5A900]">16.</span> Marketing and Promotional Communications
              </h2>
              <p className="text-xs sm:text-sm">
                Users may unsubscribe from promotional emails at any time using the 1-click unsubscribe link in any message. Essential transactional, payment and course notifications will continue as required to deliver educational services.
              </p>

              <h2 id="sec-17" className="text-xl sm:text-2xl font-black text-[#082B59] pt-6 flex items-center gap-2">
                <span className="text-[#F5A900]">17.</span> Student-Generated Content &amp; Public Profiles
              </h2>
              <p className="text-xs sm:text-sm">
                Students should avoid posting sensitive personal numbers or passwords in public course discussion boards. Students can contact support to request removal of eligible publicly posted comments.
              </p>

              <h2 id="sec-18" className="text-xl sm:text-2xl font-black text-[#082B59] pt-6 flex items-center gap-2">
                <span className="text-[#F5A900]">18.</span> Third-Party Websites
              </h2>
              <p className="text-xs sm:text-sm">
                Our website may link to external tools or documentation. We are not responsible for independent third-party privacy practices. Review their respective privacy terms before submitting personal data.
              </p>
            </section>

            {/* SECTION 19 */}
            <section id="sec-19" className="space-y-4 scroll-mt-28 border-b border-gray-100 pb-8">
              <h2 className="text-xl sm:text-2xl font-black text-[#082B59] flex items-center gap-2">
                <span className="text-[#F5A900]">19.</span> Changes to This Privacy Policy
              </h2>
              <p className="text-xs sm:text-sm">
                UNIVER-E may update this policy to reflect legislative updates (DPDP rules), new features, or security enhancements. Changes will be published here with an updated &quot;Last Updated&quot; date.
              </p>
            </section>

            {/* SECTION 20: GRIEVANCE REDRESSAL & PRIVACY CONTACT */}
            <section id="sec-20" className="space-y-6 scroll-mt-28 border-b border-gray-100 pb-8">
              <h2 className="text-xl sm:text-2xl font-black text-[#082B59] flex items-center gap-2">
                <span className="text-[#F5A900]">20.</span> Grievance Redressal and Privacy Contact
              </h2>
              <p className="text-xs sm:text-sm">
                For privacy inquiries, consent withdrawal, or statutory grievances under the Digital Personal Data Protection Act, contact our designated Data Protection Officer:
              </p>

              <div className="bg-gradient-to-br from-slate-50 to-emerald-50/40 rounded-2xl p-6 border border-emerald-100 space-y-4 text-xs sm:text-sm">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-blue-100 text-[#082B59] flex items-center justify-center flex-shrink-0">
                      <UserCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">Organization</h4>
                      <p className="text-slate-600">UNIVER-E Digital Academy</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-emerald-100 text-[#28A745] flex items-center justify-center flex-shrink-0">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">Designated Privacy Officer</h4>
                      <p className="text-slate-600">Data Protection Officer &amp; Secretariat</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-amber-100 text-[#F5A900] flex items-center justify-center flex-shrink-0">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">Official Privacy &amp; Grievance Email</h4>
                      <a
                        href="mailto:univer-e-services@protonmail.com"
                        className="text-[#13A8E8] font-mono font-bold hover:underline"
                      >
                        univer-e-services@protonmail.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-sky-100 text-[#13A8E8] flex items-center justify-center flex-shrink-0">
                      <Globe className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">Official Website</h4>
                      <Link href="/" className="text-[#13A8E8] font-bold hover:underline">
                        https://univer-e.in
                      </Link>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 sm:col-span-2">
                    <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">Registered Business Address</h4>
                      <p className="text-slate-600">
                        UNIVER-E Tower, Tech Hub, Whitefield, Bengaluru, Karnataka 560066, India
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 sm:col-span-2">
                    <div className="w-8 h-8 rounded-xl bg-violet-100 text-violet-600 flex items-center justify-center flex-shrink-0">
                      <Scale className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">Jurisdiction &amp; Response Timeline</h4>
                      <p className="text-slate-600">
                        Republic of India • Grievance response turnaround: within 48 to 72 business hours
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* SECTION 21 & 22 */}
            <section id="sec-21" className="space-y-4 scroll-mt-28">
              <h2 className="text-xl sm:text-2xl font-black text-[#082B59] flex items-center gap-2">
                <span className="text-[#F5A900]">21.</span> Governing Law
              </h2>
              <p className="text-xs sm:text-sm">
                This Privacy Policy shall be interpreted in accordance with the applicable laws of India, including the Digital Personal Data Protection Act, 2023. Any dispute shall be handled in accordance with applicable statutory dispute-resolution mechanisms.
              </p>

              <h2 id="sec-22" className="text-xl sm:text-2xl font-black text-[#082B59] pt-6 flex items-center gap-2">
                <span className="text-[#F5A900]">22.</span> Final Privacy Commitment
              </h2>
              <p className="text-xs sm:text-sm">
                At UNIVER-E, we believe that education should be accessible, secure and trustworthy. We are committed to:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-slate-700 pl-4 list-disc">
                <div>• Respecting student privacy and dignity.</div>
                <div>• Protecting personal information with zero compromise.</div>
                <div>• Being transparent about all data collection.</div>
                <div>• Limiting unnecessary data processing.</div>
                <div>• Maintaining appropriate modern security safeguards.</div>
                <div>• Respecting statutory privacy rights.</div>
                <div className="sm:col-span-2">• Building a responsible digital learning environment for India and the world.</div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-gray-200 text-center font-medium text-xs text-slate-800">
                Your trust matters to us.
              </div>

              <div className="pt-8 text-center border-t border-gray-100 space-y-2">
                <div className="font-black text-lg text-[#082B59]">UNIVER-E Digital Academy</div>
                <div className="text-xs italic text-slate-500 font-serif">
                  Learn. Build. Innovate. Achieve.
                </div>
                <div className="text-[11px] text-slate-400 font-mono pt-2">
                  End of Privacy Policy.
                </div>
              </div>
            </section>

          </main>
        </div>

      </div>
    </div>
  );
}
