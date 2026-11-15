'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  FileText,
  ShieldCheck,
  Award,
  Clock,
  Mail,
  MapPin,
  Phone,
  Search,
  CheckCircle2,
  Printer,
  ChevronRight,
  ExternalLink,
  HelpCircle,
  AlertCircle,
  Scale,
  BookOpen,
} from 'lucide-react';

export default function TermsPage() {
  const [activeSection, setActiveSection] = useState('sec-1');
  const [searchQuery, setSearchQuery] = useState('');

  const sections = [
    { id: 'sec-1', title: '1. Introduction & Acceptance of Terms' },
    { id: 'sec-2', title: '2. Platform Nature & Educational Scope' },
    { id: 'sec-3', title: '3. Account Registration & Eligibility' },
    { id: 'sec-4', title: '4. Course Enrollment & Access' },
    { id: 'sec-5', title: '5. Lifetime Access & Course Availability' },
    { id: 'sec-6', title: '6. Intellectual Property & Copyright' },
    { id: 'sec-7', title: '7. Payment, Pricing & Billing' },
    { id: 'sec-8', title: '8. Refund Policy – 30-Day Guarantee' },
    { id: 'sec-9', title: '9. Certification & Course Completion' },
    { id: 'sec-10', title: '10. Educational Partnerships & Third-Party' },
    { id: 'sec-11', title: '11. Academic Honor Code & Integrity' },
    { id: 'sec-12', title: '12. Instructor & Content Responsibilities' },
    { id: 'sec-13', title: '13. Acceptable Use Policy' },
    { id: 'sec-14', title: '14. User-Generated Content' },
    { id: 'sec-15', title: '15. Privacy & Personal Data Protection' },
    { id: 'sec-16', title: '16. Third-Party Services & Links' },
    { id: 'sec-17', title: '17. Platform Availability & Outages' },
    { id: 'sec-18', title: '18. Disclaimer of Warranties' },
    { id: 'sec-19', title: '19. Limitation of Liability' },
    { id: 'sec-20', title: '20. Indemnification' },
    { id: 'sec-21', title: '21. Suspension & Termination' },
    { id: 'sec-22', title: '22. Modifications to These Terms' },
    { id: 'sec-23', title: '23. Force Majeure' },
    { id: 'sec-24', title: '24. Governing Law & Jurisdiction' },
    { id: 'sec-25', title: '25. Severability' },
    { id: 'sec-26', title: '26. Entire Agreement' },
    { id: 'sec-27', title: '27. Contact & Customer Support' },
    { id: 'sec-28', title: '28. Final Acknowledgement' },
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
          <div className="absolute right-1/3 bottom-0 w-64 h-64 bg-[#F5A900]/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 space-y-4 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-bold border border-white/10">
              <Scale className="w-3.5 h-3.5" />
              <span>Official Website Policy • Effective November 15, 2026</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white font-brand">
              Terms & Conditions of Service
            </h1>

            <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
              UNIVER-E Digital Academy Master Service Agreement governing platform access, course enrollment, intellectual property, examination integrity, 30-day satisfaction refunds, and verifiable certification.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-slate-300">
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#F5A900]" />
                <span>Last Updated: November 15, 2026</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#28A745]" />
                <span>Legally Binding Digital Contract</span>
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
                  <FileText className="w-4 h-4 text-[#13A8E8]" />
                  <span>Table of Contents</span>
                </h3>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                  28 Sections
                </span>
              </div>

              {/* Filter / Search Bar */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Filter sections..."
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

              {/* Quick Legal Help Box */}
              <div className="p-3.5 rounded-2xl bg-[#082B59] text-white space-y-2 text-xs">
                <div className="font-bold flex items-center gap-1.5 text-amber-300">
                  <Mail className="w-4 h-4 text-[#F5A900]" />
                  <span>Legal & Support Inquiries</span>
                </div>
                <p className="text-[11px] text-slate-200 leading-relaxed">
                  Have inquiries regarding refunds, certificates, or terms? Contact the official secretariat:
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
            
            {/* Meta Legal Information */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-gray-200 text-xs grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-600">
              <div>
                <span className="font-bold text-slate-900">Platform Name:</span> UNIVER-E
              </div>
              <div>
                <span className="font-bold text-slate-900">Legal Entity:</span> UNIVER-E Digital Academy
              </div>
              <div>
                <span className="font-bold text-slate-900">Effective Date:</span> November 15, 2026
              </div>
              <div>
                <span className="font-bold text-slate-900">Official Support:</span>{' '}
                <a href="mailto:univer-e-services@protonmail.com" className="text-[#13A8E8] font-bold hover:underline">
                  univer-e-services@protonmail.com
                </a>
              </div>
            </div>

            {/* SECTION 1 */}
            <section id="sec-1" className="space-y-4 scroll-mt-28 border-b border-gray-100 pb-8">
              <h2 className="text-xl sm:text-2xl font-black text-[#082B59] flex items-center gap-2">
                <span className="text-[#F5A900]">1.</span> Introduction and Acceptance of Terms
              </h2>
              <p className="text-xs sm:text-sm">
                Welcome to <strong>UNIVER-E Digital Academy</strong> (&quot;UNIVER-E&quot;, &quot;we&quot;, &quot;our&quot;, &quot;us&quot;, or &quot;the Platform&quot;).
              </p>
              <p className="text-xs sm:text-sm">
                UNIVER-E is an online learning and professional development platform designed to provide accessible, practical, technology-focused education through online courses, masterclasses, tutorials, assessments, projects and digital certification programs.
              </p>
              <p className="text-xs sm:text-sm">
                These Terms and Conditions (&quot;Terms&quot;) govern your access to and use of the UNIVER-E website, mobile applications (if available), learning management system, educational services, digital content, certification programs and related features.
              </p>
              <p className="text-xs sm:text-sm">
                By accessing our website, creating an account, purchasing a course, enrolling in a program or using any educational service provided by UNIVER-E, you acknowledge that you have read, understood and agreed to these Terms.
              </p>
              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-medium">
                <strong>Important:</strong> If you do not agree with these Terms, you must discontinue using the Platform immediately.
              </div>
            </section>

            {/* SECTION 2 */}
            <section id="sec-2" className="space-y-4 scroll-mt-28 border-b border-gray-100 pb-8">
              <h2 className="text-xl sm:text-2xl font-black text-[#082B59] flex items-center gap-2">
                <span className="text-[#F5A900]">2.</span> Platform Nature and Educational Scope
              </h2>
              <p className="text-xs sm:text-sm">
                <strong>2.1.</strong> UNIVER-E operates as a digital learning and educational technology platform.
              </p>
              <p className="text-xs sm:text-sm">
                <strong>2.2.</strong> The Platform provides educational content in areas including, but not limited to:
              </p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-slate-700 pl-4 list-disc">
                <li>Artificial Intelligence and Generative AI.</li>
                <li>Machine Learning and Deep Learning.</li>
                <li>Programming and Software Development.</li>
                <li>Web Development and App Development.</li>
                <li>Data Science and Data Analytics.</li>
                <li>Cybersecurity and Information Technology.</li>
                <li>Digital Marketing and Business Technology.</li>
                <li>Design, Creativity and Multimedia.</li>
                <li>Professional Development and Career Skills.</li>
              </ul>
              <p className="text-xs sm:text-sm">
                <strong>2.3.</strong> Courses may include recorded lectures, live sessions, practical demonstrations, downloadable resources, assignments, quizzes, examinations and project-based learning.
              </p>
              <p className="text-xs sm:text-sm">
                <strong>2.4.</strong> Unless a particular program explicitly states otherwise, UNIVER-E courses are professional skill-development and educational programs.
              </p>
              <p className="text-xs sm:text-sm">
                <strong>2.5.</strong> Completion certificates issued through UNIVER-E do not automatically constitute university degrees, diplomas, government-recognized qualifications or UGC/AICTE-approved academic credentials.
              </p>
              <p className="text-xs sm:text-sm">
                <strong>2.6.</strong> UNIVER-E does not guarantee university admission, employment, salary increases, professional licensing or career placement through course completion.
              </p>
            </section>

            {/* SECTION 3 */}
            <section id="sec-3" className="space-y-4 scroll-mt-28 border-b border-gray-100 pb-8">
              <h2 className="text-xl sm:text-2xl font-black text-[#082B59] flex items-center gap-2">
                <span className="text-[#F5A900]">3.</span> Account Registration and Eligibility
              </h2>
              <p className="text-xs sm:text-sm">
                <strong>3.1.</strong> Users must provide accurate, complete and up-to-date information when registering.
              </p>
              <p className="text-xs sm:text-sm">
                <strong>3.2.</strong> Each student is responsible for maintaining the confidentiality of their login credentials.
              </p>
              <p className="text-xs sm:text-sm">
                <strong>3.3.</strong> Users must not:
              </p>
              <ul className="space-y-1.5 text-xs sm:text-sm pl-4 list-disc text-slate-700">
                <li>Create accounts using false identities.</li>
                <li>Share accounts with unauthorized individuals.</li>
                <li>Sell, rent or transfer accounts.</li>
                <li>Attempt to access another user&apos;s account.</li>
                <li>Misrepresent their academic qualifications.</li>
                <li>Use the Platform for unlawful activities.</li>
              </ul>
              <p className="text-xs sm:text-sm">
                <strong>3.4.</strong> Students under the age of 18 must obtain appropriate parental or legal guardian consent wherever required by applicable law.
              </p>
              <p className="text-xs sm:text-sm">
                <strong>3.5.</strong> UNIVER-E reserves the right to suspend or restrict accounts where fraudulent activity, unauthorized access or violations of these Terms are identified.
              </p>
            </section>

            {/* SECTION 4 */}
            <section id="sec-4" className="space-y-4 scroll-mt-28 border-b border-gray-100 pb-8">
              <h2 className="text-xl sm:text-2xl font-black text-[#082B59] flex items-center gap-2">
                <span className="text-[#F5A900]">4.</span> Course Enrollment and Access
              </h2>
              <p className="text-xs sm:text-sm">
                <strong>4.1.</strong> Students may enroll in free or paid courses depending on the availability and enrollment conditions of each program.
              </p>
              <p className="text-xs sm:text-sm">
                <strong>4.2.</strong> Course access begins after successful enrollment and, where applicable, confirmation of payment.
              </p>
              <p className="text-xs sm:text-sm">
                <strong>4.3.</strong> Students must follow the course instructions, learning requirements and assessment procedures.
              </p>
              <p className="text-xs sm:text-sm">
                <strong>4.4.</strong> Some courses may include prerequisites, recommended technical knowledge or specific software requirements.
              </p>
              <p className="text-xs sm:text-sm">
                <strong>4.5.</strong> UNIVER-E reserves the right to update course descriptions, instructors, learning materials, curriculum structure and delivery methods to improve educational quality.
              </p>
              <p className="text-xs sm:text-sm">
                <strong>4.6.</strong> Course enrollment is personal and non-transferable unless expressly authorized by UNIVER-E.
              </p>
            </section>

            {/* SECTION 5 */}
            <section id="sec-5" className="space-y-4 scroll-mt-28 border-b border-gray-100 pb-8">
              <h2 className="text-xl sm:text-2xl font-black text-[#082B59] flex items-center gap-2">
                <span className="text-[#F5A900]">5.</span> Lifetime Access and Course Availability
              </h2>
              <p className="text-xs sm:text-sm">
                <strong>5.1.</strong> Where a course is advertised as offering &quot;Lifetime Access&quot;, the enrolled student receives ongoing, non-exclusive access to the purchased course materials through their registered account.
              </p>
              <p className="text-xs sm:text-sm">
                <strong>5.2.</strong> Lifetime access means access for the operational lifetime of the relevant course or service on the UNIVER-E Platform, rather than a guarantee that the Platform or course will remain available forever.
              </p>
              <p className="text-xs sm:text-sm">
                <strong>5.3.</strong> Access may be affected by technical maintenance, platform upgrades, security requirements, legal or regulatory obligations, third-party licensing restrictions, or discontinuation of a course or service.
              </p>
              <p className="text-xs sm:text-sm">
                <strong>5.4.</strong> UNIVER-E will make reasonable efforts to notify students before significant discontinuation of paid educational content, where reasonably practicable.
              </p>
              <p className="text-xs sm:text-sm">
                <strong>5.5.</strong> Students may not redistribute, reproduce, publicly broadcast, sell or commercially exploit course materials.
              </p>
            </section>

            {/* SECTION 6 */}
            <section id="sec-6" className="space-y-4 scroll-mt-28 border-b border-gray-100 pb-8">
              <h2 className="text-xl sm:text-2xl font-black text-[#082B59] flex items-center gap-2">
                <span className="text-[#F5A900]">6.</span> Intellectual Property and Copyright
              </h2>
              <p className="text-xs sm:text-sm">
                <strong>6.1.</strong> All original content owned or licensed by UNIVER-E, including educational videos, written materials, graphics, logos, website designs, course structures, assessments and learning resources, is protected by applicable intellectual property laws.
              </p>
              <p className="text-xs sm:text-sm">
                <strong>6.2.</strong> Students receive a limited, personal, non-exclusive and non-transferable license to access purchased educational materials for their individual learning purposes.
              </p>
              <p className="text-xs sm:text-sm">
                <strong>6.3.</strong> Students are strictly prohibited from:
              </p>
              <ul className="space-y-1.5 text-xs sm:text-sm pl-4 list-disc text-slate-700">
                <li>Downloading content where downloading is not authorized.</li>
                <li>Recording or redistributing protected course videos.</li>
                <li>Re-uploading course content to YouTube or other platforms without permission.</li>
                <li>Selling course notes, recordings or learning resources.</li>
                <li>Copying or reproducing proprietary assessments.</li>
                <li>Sharing paid course credentials.</li>
                <li>Removing copyright notices or ownership information.</li>
                <li>Using course materials to create competing commercial courses without authorization.</li>
              </ul>
              <p className="text-xs sm:text-sm">
                <strong>6.4.</strong> UNIVER-E may take appropriate action against copyright infringement, including content removal, account suspension and legal remedies where applicable.
              </p>
              <p className="text-xs sm:text-sm">
                <strong>6.5.</strong> Students retain ownership of original projects and assignments they independently create, subject to third-party intellectual property rights and any separately agreed licensing terms.
              </p>
            </section>

            {/* SECTION 7 */}
            <section id="sec-7" className="space-y-4 scroll-mt-28 border-b border-gray-100 pb-8">
              <h2 className="text-xl sm:text-2xl font-black text-[#082B59] flex items-center gap-2">
                <span className="text-[#F5A900]">7.</span> Payment, Pricing and Billing
              </h2>
              <p className="text-xs sm:text-sm">
                <strong>7.1.</strong> Certain courses and educational programs may require payment.
              </p>
              <p className="text-xs sm:text-sm">
                <strong>7.2.</strong> All applicable course prices will be displayed before checkout.
              </p>
              <p className="text-xs sm:text-sm">
                <strong>7.3.</strong> Payments may be processed through authorized third-party payment service providers.
              </p>
              <p className="text-xs sm:text-sm">
                <strong>7.4.</strong> UNIVER-E does not store complete payment card credentials unless expressly disclosed and lawfully supported through an authorized payment arrangement.
              </p>
              <p className="text-xs sm:text-sm">
                <strong>7.5.</strong> Students are responsible for providing accurate billing information.
              </p>
              <p className="text-xs sm:text-sm">
                <strong>7.6.</strong> Prices may change from time to time. Any change will not automatically alter the price of a previously completed purchase.
              </p>
              <p className="text-xs sm:text-sm">
                <strong>7.7.</strong> Promotional offers, discount codes, scholarships and limited-time pricing may be subject to separate conditions.
              </p>
              <p className="text-xs sm:text-sm">
                <strong>7.8.</strong> Applicable taxes, including GST where required, will be charged in accordance with applicable law.
              </p>
              <p className="text-xs sm:text-sm">
                <strong>7.9.</strong> Students must not attempt payment fraud, chargeback abuse or unauthorized payment reversals.
              </p>
            </section>

            {/* SECTION 8 */}
            <section id="sec-8" className="space-y-4 scroll-mt-28 border-b border-gray-100 pb-8">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-[#28A745] text-xs font-bold">
                  Guaranteed
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-[#082B59]">
                  <span className="text-[#F5A900]">8.</span> Refund Policy – 30-Day Satisfaction Guarantee
                </h2>
              </div>
              <p className="text-xs sm:text-sm font-medium text-slate-800">
                UNIVER-E aims to provide students with a satisfactory learning experience.
              </p>
              <p className="text-xs sm:text-sm">
                <strong>8.1.</strong> Eligible paid courses may qualify for a 30-day refund guarantee from the original purchase date.
              </p>
              <div className="p-4 rounded-2xl bg-slate-50 border border-gray-200 space-y-2 text-xs sm:text-sm">
                <p className="font-bold text-slate-900">8.2. To qualify for a refund:</p>
                <ul className="space-y-1.5 pl-4 list-disc text-slate-700">
                  <li>The request must be submitted within 30 calendar days of purchase.</li>
                  <li>The student must have consumed less than 25% of the total curriculum video duration.</li>
                  <li>An official final examination certificate must not have been issued.</li>
                  <li>The purchase must not be associated with fraudulent activity or abuse of the refund policy.</li>
                </ul>
              </div>
              <p className="text-xs sm:text-sm">
                <strong>8.3.</strong> Refund requests must be submitted through the official UNIVER-E support channel at{' '}
                <a href="mailto:univer-e-services@protonmail.com" className="text-[#13A8E8] font-bold hover:underline">
                  univer-e-services@protonmail.com
                </a>.
              </p>
              <p className="text-xs sm:text-sm">
                <strong>8.4.</strong> Approved refunds will generally be returned through the original payment method, subject to payment provider processing timelines.
              </p>
              <p className="text-xs sm:text-sm">
                <strong>8.5.</strong> Refund processing times may vary depending on the payment service provider and banking institution.
              </p>
              <p className="text-xs sm:text-sm">
                <strong>8.6.</strong> The following may be excluded from the standard refund guarantee:
              </p>
              <ul className="space-y-1 text-xs sm:text-sm pl-4 list-disc text-slate-700">
                <li>Special promotional purchases explicitly marked non-refundable, where lawful.</li>
                <li>Individually customized training services already delivered.</li>
                <li>Services that have been substantially consumed.</li>
                <li>Purchases made through unauthorized third-party sellers.</li>
                <li>Duplicate or fraudulent refund claims.</li>
              </ul>
              <p className="text-xs sm:text-sm">
                <strong>8.7.</strong> Nothing in this policy limits any mandatory consumer rights available under applicable law.
              </p>
              <p className="text-xs sm:text-sm">
                <strong>8.8.</strong> UNIVER-E reserves the right to investigate suspected refund abuse.
              </p>
            </section>

            {/* SECTION 9 */}
            <section id="sec-9" className="space-y-4 scroll-mt-28 border-b border-gray-100 pb-8">
              <h2 className="text-xl sm:text-2xl font-black text-[#082B59] flex items-center gap-2">
                <span className="text-[#F5A900]">9.</span> Certification and Course Completion
              </h2>
              <p className="text-xs sm:text-sm">
                <strong>9.1.</strong> UNIVER-E may issue digital certificates to students who successfully satisfy the applicable course completion requirements.
              </p>
              <p className="text-xs sm:text-sm">
                <strong>9.2.</strong> Certificate eligibility may depend on completing required course content, passing required quizzes or examinations, submitting mandatory assignments, completing practical projects (where applicable), meeting the minimum passing score (70%), and complying with the Academic Honor Code.
              </p>
              <p className="text-xs sm:text-sm">
                <strong>9.3.</strong> Certificates may contain the student&apos;s registered name, course title, unique certificate ID, completion date, issuing organization, authorized digital verification, and QR code verification.
              </p>
              <p className="text-xs sm:text-sm">
                <strong>9.4.</strong> Students must provide their correct names before certificate issuance.
              </p>
              <p className="text-xs sm:text-sm">
                <strong>9.5.</strong> UNIVER-E may charge a separately disclosed certificate or examination fee where applicable.
              </p>
              <p className="text-xs sm:text-sm">
                <strong>9.6.</strong> A certificate represents completion of the specified educational program. It does not guarantee employment, professional accreditation or university credit.
              </p>
              <p className="text-xs sm:text-sm">
                <strong>9.7.</strong> UNIVER-E reserves the right to revoke certificates obtained through fraud, cheating, impersonation or other serious violations.
              </p>
            </section>

            {/* SECTION 10 */}
            <section id="sec-10" className="space-y-4 scroll-mt-28 border-b border-gray-100 pb-8">
              <h2 className="text-xl sm:text-2xl font-black text-[#082B59] flex items-center gap-2">
                <span className="text-[#F5A900]">10.</span> Educational Partnerships & Third-Party Certification
              </h2>
              <p className="text-xs sm:text-sm">
                <strong>10.1.</strong> UNIVER-E may collaborate with educational institutions, training organizations, technology companies, instructors and industry partners.
              </p>
              <p className="text-xs sm:text-sm">
                <strong>10.2.</strong> Certain courses may be delivered in partnership with external organizations.
              </p>
              <p className="text-xs sm:text-sm">
                <strong>10.3.</strong> The identity and responsibilities of each partner will be disclosed in the relevant course description or partnership announcement.
              </p>
              <p className="text-xs sm:text-sm">
                <strong>10.4.</strong> Training delivery, curriculum development, assessment and certificate issuance may be handled by different organizations depending on the specific program.
              </p>
              <p className="text-xs sm:text-sm">
                <strong>10.5.</strong> Students must review the certificate issuer and accreditation status specified for their individual course.
              </p>
              <p className="text-xs sm:text-sm">
                <strong>10.6.</strong> UNIVER-E will not represent a partnership, accreditation, endorsement or institutional recognition that has not been formally authorized.
              </p>
              <p className="text-xs sm:text-sm">
                <strong>10.7.</strong> Third-party logos, trademarks, course materials and brand names remain the property of their respective owners.
              </p>
            </section>

            {/* SECTION 11 */}
            <section id="sec-11" className="space-y-4 scroll-mt-28 border-b border-gray-100 pb-8">
              <h2 className="text-xl sm:text-2xl font-black text-[#082B59] flex items-center gap-2">
                <span className="text-[#F5A900]">11.</span> Academic Honor Code and Examination Integrity
              </h2>
              <p className="text-xs sm:text-sm">
                <strong>11.1.</strong> UNIVER-E is committed to maintaining academic honesty and educational integrity.
              </p>
              <p className="text-xs sm:text-sm">
                <strong>11.2.</strong> Students agree to complete assessments honestly and independently unless collaboration is expressly permitted.
              </p>
              <p className="text-xs sm:text-sm">
                <strong>11.3.</strong> Prohibited examination practices include: impersonating another student, sharing examination answers without authorization, using unauthorized automated answer-generation scripts, manipulating assessment systems, accessing restricted examination materials, plagiarizing assignments or projects, misrepresenting project ownership, or circumventing examination security mechanisms.
              </p>
              <p className="text-xs sm:text-sm">
                <strong>11.4.</strong> AI-assisted learning may be permitted where explicitly allowed by the instructor or examination guidelines.
              </p>
              <p className="text-xs sm:text-sm">
                <strong>11.5.</strong> UNIVER-E may investigate suspected academic misconduct and take appropriate action, including invalidating assessment results or revoking certificates.
              </p>
            </section>

            {/* SECTION 12 */}
            <section id="sec-12" className="space-y-4 scroll-mt-28 border-b border-gray-100 pb-8">
              <h2 className="text-xl sm:text-2xl font-black text-[#082B59] flex items-center gap-2">
                <span className="text-[#F5A900]">12.</span> Instructor and Course Content Responsibilities
              </h2>
              <p className="text-xs sm:text-sm">
                <strong>12.1.</strong> Instructors and educational partners are expected to provide educational materials that are relevant, accurate and appropriate to the course objectives.
              </p>
              <p className="text-xs sm:text-sm">
                <strong>12.2.</strong> Course content may occasionally become outdated due to changes in technology, software versions, industry standards or regulations.
              </p>
              <p className="text-xs sm:text-sm">
                <strong>12.3.</strong> UNIVER-E does not guarantee that every course will contain the latest version of every third-party tool or technology.
              </p>
              <p className="text-xs sm:text-sm">
                <strong>12.4.</strong> Instructors must not knowingly publish unlawful, misleading, defamatory or infringing educational materials.
              </p>
              <p className="text-xs sm:text-sm">
                <strong>12.5.</strong> UNIVER-E reserves the right to review, modify, remove or replace educational content when reasonably necessary.
              </p>
            </section>

            {/* SECTION 13 */}
            <section id="sec-13" className="space-y-4 scroll-mt-28 border-b border-gray-100 pb-8">
              <h2 className="text-xl sm:text-2xl font-black text-[#082B59] flex items-center gap-2">
                <span className="text-[#F5A900]">13.</span> Acceptable Use Policy
              </h2>
              <p className="text-xs sm:text-sm">
                Students agree to use the Platform responsibly and lawfully. The following activities are strictly prohibited:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm pl-4 list-disc text-slate-700">
                <div>• Hacking or attempting unauthorized system access.</div>
                <div>• Distributing malware or malicious code.</div>
                <div>• Overloading or disrupting infrastructure.</div>
                <div>• Scraping or extracting restricted data.</div>
                <div>• Reverse engineering protected software.</div>
                <div>• Uploading unlawful or harmful content.</div>
                <div>• Harassing instructors, students or support.</div>
                <div>• Circumventing payment or access controls.</div>
                <div>• Using the Platform for fraud or impersonation.</div>
                <div>• Violating intellectual property rights.</div>
              </div>
              <p className="text-xs sm:text-sm text-slate-600">
                UNIVER-E may restrict or terminate access when violations are identified.
              </p>
            </section>

            {/* SECTION 14 */}
            <section id="sec-14" className="space-y-4 scroll-mt-28 border-b border-gray-100 pb-8">
              <h2 className="text-xl sm:text-2xl font-black text-[#082B59] flex items-center gap-2">
                <span className="text-[#F5A900]">14.</span> User-Generated Content
              </h2>
              <p className="text-xs sm:text-sm">
                <strong>14.1.</strong> Students may submit assignments, projects, comments, reviews, questions and other educational materials.
              </p>
              <p className="text-xs sm:text-sm">
                <strong>14.2.</strong> Students retain ownership of their original content.
              </p>
              <p className="text-xs sm:text-sm">
                <strong>14.3.</strong> By submitting content, students grant UNIVER-E a limited, non-exclusive license to host, store, display and process that content as reasonably necessary to operate and provide the educational services.
              </p>
              <p className="text-xs sm:text-sm">
                <strong>14.4.</strong> UNIVER-E will not claim ownership of student-created intellectual property merely because it is submitted through the Platform.
              </p>
              <p className="text-xs sm:text-sm">
                <strong>14.5.</strong> Students must not submit content that infringes third-party rights or violates applicable law.
              </p>
              <p className="text-xs sm:text-sm">
                <strong>14.6.</strong> UNIVER-E may remove content that violates these Terms.
              </p>
            </section>

            {/* SECTION 15 */}
            <section id="sec-15" className="space-y-4 scroll-mt-28 border-b border-gray-100 pb-8">
              <h2 className="text-xl sm:text-2xl font-black text-[#082B59] flex items-center gap-2">
                <span className="text-[#F5A900]">15.</span> Privacy and Personal Data Protection
              </h2>
              <p className="text-xs sm:text-sm">
                <strong>15.1.</strong> UNIVER-E respects the privacy and personal information of its users.
              </p>
              <p className="text-xs sm:text-sm">
                <strong>15.2.</strong> Information collected may include: name and contact details, email address and phone number, account credentials, enrollment and learning progress, examination and assessment results, payment transaction references, and technical information with usage analytics.
              </p>
              <p className="text-xs sm:text-sm">
                <strong>15.3.</strong> Personal information will be collected, used, stored and processed in accordance with the UNIVER-E Privacy Policy and applicable data protection laws.
              </p>
              <p className="text-xs sm:text-sm">
                <strong>15.4.</strong> UNIVER-E may use authorized third-party service providers for hosting, payment processing, analytics, communications and educational delivery.
              </p>
              <p className="text-xs sm:text-sm">
                <strong>15.5.</strong> UNIVER-E will implement reasonable security measures to protect personal information.
              </p>
              <p className="text-xs sm:text-sm">
                <strong>15.6.</strong> Students may submit privacy-related requests through{' '}
                <a href="mailto:univer-e-services@protonmail.com" className="text-[#13A8E8] font-bold hover:underline">
                  univer-e-services@protonmail.com
                </a>.
              </p>
              <p className="text-xs sm:text-sm">
                <strong>15.7.</strong> The separate <Link href="/privacy" className="text-[#13A8E8] hover:underline font-bold">Privacy Policy</Link> forms part of the Platform&apos;s legal documentation.
              </p>
            </section>

            {/* SECTION 16 */}
            <section id="sec-16" className="space-y-4 scroll-mt-28 border-b border-gray-100 pb-8">
              <h2 className="text-xl sm:text-2xl font-black text-[#082B59] flex items-center gap-2">
                <span className="text-[#F5A900]">16.</span> Third-Party Services and External Links
              </h2>
              <p className="text-xs sm:text-sm">
                <strong>16.1.</strong> The Platform may integrate or link to external services, software, websites and educational tools.
              </p>
              <p className="text-xs sm:text-sm">
                <strong>16.2.</strong> Examples may include: Google services, Microsoft services, AI platforms and APIs, video hosting platforms, payment gateways, cloud storage services, and external examination systems.
              </p>
              <p className="text-xs sm:text-sm">
                <strong>16.3.</strong> Third-party services operate under their own terms and privacy policies.
              </p>
              <p className="text-xs sm:text-sm">
                <strong>16.4.</strong> UNIVER-E is not responsible for independent third-party service interruptions, changes, security incidents or policies, except where responsibility cannot lawfully be excluded.
              </p>
            </section>

            {/* SECTION 17 */}
            <section id="sec-17" className="space-y-4 scroll-mt-28 border-b border-gray-100 pb-8">
              <h2 className="text-xl sm:text-2xl font-black text-[#082B59] flex items-center gap-2">
                <span className="text-[#F5A900]">17.</span> Platform Availability & Technical Interruptions
              </h2>
              <p className="text-xs sm:text-sm">
                <strong>17.1.</strong> UNIVER-E aims to maintain reliable access to its educational services.
              </p>
              <p className="text-xs sm:text-sm">
                <strong>17.2.</strong> However, uninterrupted or error-free availability cannot be guaranteed.
              </p>
              <p className="text-xs sm:text-sm">
                <strong>17.3.</strong> Temporary interruptions may occur due to server maintenance, hosting provider failures, internet connectivity problems, cybersecurity incidents, software upgrades, power or infrastructure failures, or events outside reasonable control.
              </p>
              <p className="text-xs sm:text-sm">
                <strong>17.4.</strong> UNIVER-E may temporarily suspend services for maintenance or security purposes.
              </p>
              <p className="text-xs sm:text-sm">
                <strong>17.5.</strong> Reasonable efforts will be made to restore affected services as soon as practicable.
              </p>
            </section>

            {/* SECTION 18 */}
            <section id="sec-18" className="space-y-4 scroll-mt-28 border-b border-gray-100 pb-8">
              <h2 className="text-xl sm:text-2xl font-black text-[#082B59] flex items-center gap-2">
                <span className="text-[#F5A900]">18.</span> Disclaimer of Warranties
              </h2>
              <p className="text-xs sm:text-sm">
                <strong>18.1.</strong> Educational services are provided on an &quot;as available&quot; basis, subject to applicable law.
              </p>
              <p className="text-xs sm:text-sm">
                <strong>18.2.</strong> UNIVER-E makes reasonable efforts to ensure educational accuracy and service quality but does not guarantee that every course will be error-free or suitable for every individual purpose.
              </p>
              <p className="text-xs sm:text-sm">
                <strong>18.3.</strong> Students are responsible for evaluating whether a particular course meets their educational or professional needs.
              </p>
              <p className="text-xs sm:text-sm">
                <strong>18.4.</strong> No educational content should be treated as a substitute for professional legal, medical, financial or other regulated advice.
              </p>
            </section>

            {/* SECTION 19 */}
            <section id="sec-19" className="space-y-4 scroll-mt-28 border-b border-gray-100 pb-8">
              <h2 className="text-xl sm:text-2xl font-black text-[#082B59] flex items-center gap-2">
                <span className="text-[#F5A900]">19.</span> Limitation of Liability
              </h2>
              <p className="text-xs sm:text-sm">
                <strong>19.1.</strong> To the maximum extent permitted by applicable law, UNIVER-E will not be liable for indirect, incidental, special or consequential losses arising from the use of the Platform.
              </p>
              <p className="text-xs sm:text-sm">
                <strong>19.2.</strong> UNIVER-E will not be responsible for losses resulting from: incorrect information supplied by users, unauthorized account sharing, third-party service interruptions, misuse of educational materials, decisions made solely on the basis of course content, or unforeseeable technical failures.
              </p>
              <p className="text-xs sm:text-sm">
                <strong>19.3.</strong> Nothing in these Terms excludes liability for fraud, wilful misconduct, gross negligence where applicable, or any liability that cannot legally be excluded or limited.
              </p>
              <p className="text-xs sm:text-sm">
                <strong>19.4.</strong> Where permitted by law, the aggregate liability of UNIVER-E for a paid course claim will not exceed the amount paid for the relevant course giving rise to the claim.
              </p>
            </section>

            {/* SECTION 20 */}
            <section id="sec-20" className="space-y-4 scroll-mt-28 border-b border-gray-100 pb-8">
              <h2 className="text-xl sm:text-2xl font-black text-[#082B59] flex items-center gap-2">
                <span className="text-[#F5A900]">20.</span> Indemnification
              </h2>
              <p className="text-xs sm:text-sm">
                Students agree not to misuse the Platform or infringe the rights of others.
              </p>
              <p className="text-xs sm:text-sm">
                To the extent permitted by law, students may be responsible for losses, claims or reasonable expenses directly resulting from their unlawful conduct, infringement of third-party rights or material breach of these Terms.
              </p>
              <p className="text-xs sm:text-sm">
                This provision does not create liability where prohibited by applicable law.
              </p>
            </section>

            {/* SECTION 21 */}
            <section id="sec-21" className="space-y-4 scroll-mt-28 border-b border-gray-100 pb-8">
              <h2 className="text-xl sm:text-2xl font-black text-[#082B59] flex items-center gap-2">
                <span className="text-[#F5A900]">21.</span> Suspension and Termination of Accounts
              </h2>
              <p className="text-xs sm:text-sm">
                <strong>21.1.</strong> UNIVER-E may suspend, restrict or terminate an account where these Terms are materially violated, fraudulent activity is detected, unauthorized access is attempted, academic misconduct is established, platform security is threatened, or required payments remain unpaid.
              </p>
              <p className="text-xs sm:text-sm">
                <strong>21.2.</strong> Where reasonably possible, UNIVER-E will provide notice and an opportunity to resolve the issue.
              </p>
              <p className="text-xs sm:text-sm">
                <strong>21.3.</strong> Students may request account closure through the official support channel at{' '}
                <a href="mailto:univer-e-services@protonmail.com" className="text-[#13A8E8] font-bold hover:underline">
                  univer-e-services@protonmail.com
                </a>.
              </p>
              <p className="text-xs sm:text-sm">
                <strong>21.4.</strong> Account closure does not automatically entitle a student to a refund.
              </p>
              <p className="text-xs sm:text-sm">
                <strong>21.5.</strong> Account termination will not eliminate obligations or liabilities that arose before termination.
              </p>
              <p className="text-xs sm:text-sm">
                <strong>21.6.</strong> Personal information will be retained or deleted in accordance with applicable law and the Privacy Policy.
              </p>
            </section>

            {/* SECTION 22 */}
            <section id="sec-22" className="space-y-4 scroll-mt-28 border-b border-gray-100 pb-8">
              <h2 className="text-xl sm:text-2xl font-black text-[#082B59] flex items-center gap-2">
                <span className="text-[#F5A900]">22.</span> Modifications to These Terms
              </h2>
              <p className="text-xs sm:text-sm">
                <strong>22.1.</strong> UNIVER-E reserves the right to update these Terms when necessary.
              </p>
              <p className="text-xs sm:text-sm">
                <strong>22.2.</strong> Updated Terms will be published on the official website with a revised effective date.
              </p>
              <p className="text-xs sm:text-sm">
                <strong>22.3.</strong> Material changes may be communicated through email, Platform notifications or other reasonable communication methods.
              </p>
              <p className="text-xs sm:text-sm">
                <strong>22.4.</strong> Continued use of the Platform after the revised Terms become effective constitutes acceptance where legally permissible.
              </p>
              <p className="text-xs sm:text-sm">
                <strong>22.5.</strong> If a student does not agree with material changes, they may discontinue using the affected services.
              </p>
            </section>

            {/* SECTION 23 */}
            <section id="sec-23" className="space-y-4 scroll-mt-28 border-b border-gray-100 pb-8">
              <h2 className="text-xl sm:text-2xl font-black text-[#082B59] flex items-center gap-2">
                <span className="text-[#F5A900]">23.</span> Force Majeure
              </h2>
              <p className="text-xs sm:text-sm">
                UNIVER-E will not be held responsible for delays or failures caused by circumstances beyond its reasonable control, including natural disasters, government restrictions, war, civil disturbances, epidemics, infrastructure failures, cyberattacks, telecommunications disruptions or other extraordinary events.
              </p>
              <p className="text-xs sm:text-sm">
                UNIVER-E will make reasonable efforts to minimize the impact and resume affected services.
              </p>
            </section>

            {/* SECTION 24 */}
            <section id="sec-24" className="space-y-4 scroll-mt-28 border-b border-gray-100 pb-8">
              <h2 className="text-xl sm:text-2xl font-black text-[#082B59] flex items-center gap-2">
                <span className="text-[#F5A900]">24.</span> Governing Law and Jurisdiction
              </h2>
              <p className="text-xs sm:text-sm">
                <strong>24.1.</strong> These Terms shall be governed by the laws of India, subject to applicable mandatory consumer protection and other statutory rights.
              </p>
              <p className="text-xs sm:text-sm">
                <strong>24.2.</strong> Any dispute arising from the use of UNIVER-E services shall be addressed through good-faith discussions and appropriate dispute resolution procedures.
              </p>
              <p className="text-xs sm:text-sm">
                <strong>24.3.</strong> Where legal proceedings become necessary, the competent courts in Bengaluru, Karnataka, India shall have jurisdiction, subject to applicable law.
              </p>
              <p className="text-xs sm:text-sm">
                <strong>24.4.</strong> Nothing in this section restricts any consumer&apos;s statutory right to approach an appropriate consumer dispute redressal authority.
              </p>
            </section>

            {/* SECTION 25 & 26 */}
            <section id="sec-25" className="space-y-4 scroll-mt-28 border-b border-gray-100 pb-8">
              <h2 className="text-xl sm:text-2xl font-black text-[#082B59] flex items-center gap-2">
                <span className="text-[#F5A900]">25.</span> Severability
              </h2>
              <p className="text-xs sm:text-sm">
                If any provision of these Terms is found invalid, unlawful or unenforceable, the remaining provisions shall continue to remain effective to the extent permitted by law.
              </p>

              <h2 id="sec-26" className="text-xl sm:text-2xl font-black text-[#082B59] pt-6 flex items-center gap-2">
                <span className="text-[#F5A900]">26.</span> Entire Agreement
              </h2>
              <p className="text-xs sm:text-sm">
                These Terms, together with the Privacy Policy, Refund Policy, applicable course-specific policies and other expressly incorporated policies, constitute the agreement governing the student&apos;s use of UNIVER-E services.
              </p>
              <p className="text-xs sm:text-sm">
                Where a course-specific policy conflicts with these general Terms, the course-specific policy will prevail only for that particular subject and only to the extent expressly stated.
              </p>
            </section>

            {/* SECTION 27: CONTACT & CUSTOMER SUPPORT */}
            <section id="sec-27" className="space-y-6 scroll-mt-28 border-b border-gray-100 pb-8">
              <h2 className="text-xl sm:text-2xl font-black text-[#082B59] flex items-center gap-2">
                <span className="text-[#F5A900]">27.</span> Contact and Customer Support
              </h2>
              <p className="text-xs sm:text-sm">
                For questions, complaints, refund requests, account-related issues or legal inquiries, students may contact UNIVER-E through the official support channels.
              </p>

              <div className="bg-gradient-to-br from-slate-50 to-blue-50/50 rounded-2xl p-6 border border-blue-100 space-y-4 text-xs sm:text-sm">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-blue-100 text-[#13A8E8] flex items-center justify-center flex-shrink-0">
                      <BookOpen className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">Organization</h4>
                      <p className="text-slate-600">UNIVER-E Digital Academy</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-amber-100 text-[#F5A900] flex items-center justify-center flex-shrink-0">
                      <ExternalLink className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">Official Website</h4>
                      <Link href="/" className="text-[#13A8E8] font-bold hover:underline">
                        https://univer-e.in
                      </Link>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-emerald-100 text-[#28A745] flex items-center justify-center flex-shrink-0">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">Support Email (Official Desk)</h4>
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
                      <Phone className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">Contact Number</h4>
                      <p className="text-slate-600">+91 (080) 4123-8900</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 sm:col-span-2">
                    <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">Business Address</h4>
                      <p className="text-slate-600">
                        UNIVER-E Tower, Tech Hub, Whitefield, Bengaluru, Karnataka 560066, India
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 sm:col-span-2">
                    <div className="w-8 h-8 rounded-xl bg-violet-100 text-violet-600 flex items-center justify-center flex-shrink-0">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">Support Hours</h4>
                      <p className="text-slate-600">
                        Monday – Saturday, 9:00 AM – 7:00 PM IST (Excluding Public Holidays)
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* SECTION 28: FINAL ACKNOWLEDGEMENT */}
            <section id="sec-28" className="space-y-4 scroll-mt-28">
              <h2 className="text-xl sm:text-2xl font-black text-[#082B59] flex items-center gap-2">
                <span className="text-[#F5A900]">28.</span> Final Acknowledgement
              </h2>
              <p className="text-xs sm:text-sm">
                By registering, enrolling in a course, purchasing educational content or accessing UNIVER-E services, you acknowledge that:
              </p>
              <div className="space-y-2.5 text-xs sm:text-sm text-slate-700">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#28A745] flex-shrink-0 mt-0.5" />
                  <span>You have read and understood these Terms and Conditions.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#28A745] flex-shrink-0 mt-0.5" />
                  <span>You agree to comply with the Platform&apos;s academic and acceptable-use policies.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#28A745] flex-shrink-0 mt-0.5" />
                  <span>You understand the distinction between professional course certificates and formally recognized academic qualifications.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#28A745] flex-shrink-0 mt-0.5" />
                  <span>You understand the applicable payment, refund and certification requirements.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#28A745] flex-shrink-0 mt-0.5" />
                  <span>You agree to use the educational services lawfully and responsibly.</span>
                </div>
              </div>

              <div className="pt-8 text-center border-t border-gray-100 space-y-2">
                <div className="font-black text-lg text-[#082B59]">UNIVER-E Digital Academy</div>
                <div className="text-xs italic text-slate-500 font-serif">
                  Learn. Build. Innovate. Achieve.
                </div>
                <div className="text-[11px] text-slate-400 font-mono pt-2">
                  End of Terms &amp; Conditions of Service.
                </div>
              </div>
            </section>

          </main>
        </div>

      </div>
    </div>
  );
}
