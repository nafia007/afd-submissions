import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-24 md:py-32">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Link 
            to="/" 
            className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>

          {/* Header */}
          <div className="mb-12">
            <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4">
              African Film DAO Platform Privacy Policy
            </h1>
            <p className="text-lg text-muted-foreground">
              Last Updated: January 21, 2026
            </p>
          </div>

          {/* Content */}
          <div className="prose prose-lg max-w-none">
            <section className="mb-10">
              <h2 className="font-heading text-2xl font-bold mb-4 text-primary">1. Introduction</h2>
              <p className="text-foreground/90 leading-relaxed mb-4">
                Welcome to the African Film DAO ("we," "us," "our," "the DAO") platform. We are committed to empowering African filmmakers and protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your personal information when you use our submission platform at <code className="bg-muted px-2 py-1 rounded text-sm">https://afd-submissions.lovable.app/</code> (the "Platform") and related services.
              </p>
              <p className="text-foreground/90 leading-relaxed">
                By accessing or using our Platform, you agree to the terms of this Privacy Policy. If you do not agree with the terms, please do not access or use the Platform.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="font-heading text-2xl font-bold mb-4 text-primary">2. Information We Collect</h2>
              
              <h3 className="font-semibold text-xl mb-3 text-foreground">2.1 Personal Information</h3>
              <p className="text-foreground/90 leading-relaxed mb-4">
                We may collect personal information that you voluntarily provide to us when you register on the Platform, submit a film project, or interact with our services, including:
              </p>
              <ul className="list-disc pl-6 text-foreground/90 space-y-2 mb-4">
                <li>Full name and contact information (email address, phone number)</li>
                <li>Professional information (biography, filmography, portfolio links)</li>
                <li>Identity verification documents (government-issued ID, passport)</li>
                <li>Financial information for payment processing (bank account details, cryptocurrency wallet addresses)</li>
                <li>Project details (synopses, scripts, budgets, production timelines)</li>
                <li>Communication records (emails, messages, feedback)</li>
              </ul>

              <h3 className="font-semibold text-xl mb-3 text-foreground">2.2 Technical Information</h3>
              <p className="text-foreground/90 leading-relaxed mb-4">
                We automatically collect certain technical information when you use our Platform:
              </p>
              <ul className="list-disc pl-6 text-foreground/90 space-y-2 mb-4">
                <li>IP address and device information</li>
                <li>Browser type and version</li>
                <li>Operating system</li>
                <li>Usage data (pages visited, time spent, click patterns)</li>
                <li>Referring website addresses</li>
                <li>Blockchain transaction data (wallet addresses, transaction hashes)</li>
              </ul>

              <h3 className="font-semibold text-xl mb-3 text-foreground">2.3 Cookies and Tracking Technologies</h3>
              <p className="text-foreground/90 leading-relaxed">
                We use cookies, web beacons, and similar tracking technologies to enhance your experience, analyze usage patterns, and deliver personalized content. You can control cookie preferences through your browser settings.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="font-heading text-2xl font-bold mb-4 text-primary">3. How We Use Your Information</h2>
              <p className="text-foreground/90 leading-relaxed mb-4">
                We use the information we collect for various purposes, including:
              </p>
              <ul className="list-disc pl-6 text-foreground/90 space-y-2 mb-4">
                <li><strong>Platform Services:</strong> To process your film submissions, manage your account, and provide our services</li>
                <li><strong>Communication:</strong> To respond to your inquiries, send updates about your projects, and provide customer support</li>
                <li><strong>Community Building:</strong> To connect filmmakers with investors and facilitate collaboration opportunities</li>
                <li><strong>Analytics:</strong> To understand usage patterns and improve our Platform functionality</li>
                <li><strong>Security:</strong> To protect against fraud, unauthorized access, and other security threats</li>
                <li><strong>Legal Compliance:</strong> To comply with applicable laws, regulations, and legal processes</li>
                <li><strong>Marketing:</strong> To send you information about new features, opportunities, and events (with your consent where required)</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="font-heading text-2xl font-bold mb-4 text-primary">4. Information Sharing and Disclosure</h2>
              
              <h3 className="font-semibold text-xl mb-3 text-foreground">4.1 Third-Party Service Providers</h3>
              <p className="text-foreground/90 leading-relaxed mb-4">
                We may share your information with trusted third-party service providers who assist us in operating our Platform, including:
              </p>
              <ul className="list-disc pl-6 text-foreground/90 space-y-2 mb-4">
                <li>Cloud hosting and infrastructure providers</li>
                <li>Payment processors and financial institutions</li>
                <li>Identity verification services</li>
                <li>Analytics and marketing platforms</li>
                <li>Customer support tools</li>
              </ul>

              <h3 className="font-semibold text-xl mb-3 text-foreground">4.2 Community and Investors</h3>
              <p className="text-foreground/90 leading-relaxed mb-4">
                When you submit a film project, certain information (project details, filmmaker profile) may be visible to registered investors and community members to facilitate funding opportunities and collaboration. We will clearly indicate which information is public and which remains private.
              </p>

              <h3 className="font-semibold text-xl mb-3 text-foreground">4.3 Legal Requirements</h3>
              <p className="text-foreground/90 leading-relaxed mb-4">
                We may disclose your information if required by law, such as in response to a subpoena, court order, or government request, or to protect our rights, property, or safety, or that of others.
              </p>

              <h3 className="font-semibold text-xl mb-3 text-foreground">4.4 Business Transfers</h3>
              <p className="text-foreground/90 leading-relaxed">
                In the event of a merger, acquisition, or sale of assets, your information may be transferred as part of the transaction. We will notify you of any such change in ownership or control of your personal information.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="font-heading text-2xl font-bold mb-4 text-primary">5. Data Security</h2>
              <p className="text-foreground/90 leading-relaxed mb-4">
                We implement industry-standard security measures to protect your personal information:
              </p>
              <ul className="list-disc pl-6 text-foreground/90 space-y-2 mb-4">
                <li>Encryption of data in transit (TLS/SSL) and at rest</li>
                <li>Regular security audits and vulnerability assessments</li>
                <li>Access controls and authentication mechanisms</li>
                <li>Secure blockchain infrastructure for transaction data</li>
                <li>Employee training on data protection</li>
              </ul>
              <p className="text-foreground/90 leading-relaxed">
                However, no method of transmission over the internet or electronic storage is 100% secure. We cannot guarantee absolute security of your information.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="font-heading text-2xl font-bold mb-4 text-primary">6. Your Rights and Choices</h2>
              
              <h3 className="font-semibold text-xl mb-3 text-foreground">6.1 Access and Correction</h3>
              <p className="text-foreground/90 leading-relaxed mb-4">
                You have the right to access, update, or correct your personal information at any time through your account settings or by contacting us.
              </p>

              <h3 className="font-semibold text-xl mb-3 text-foreground">6.2 Data Deletion</h3>
              <p className="text-foreground/90 leading-relaxed mb-4">
                You may request deletion of your account and personal information, subject to legal obligations and legitimate business needs. Some information may be retained for compliance, dispute resolution, or as required by law.
              </p>

              <h3 className="font-semibold text-xl mb-3 text-foreground">6.3 Marketing Communications</h3>
              <p className="text-foreground/90 leading-relaxed mb-4">
                You can opt out of marketing communications at any time by clicking the "unsubscribe" link in emails or adjusting your notification preferences in your account settings.
              </p>

              <h3 className="font-semibold text-xl mb-3 text-foreground">6.4 Cookie Management</h3>
              <p className="text-foreground/90 leading-relaxed mb-4">
                You can manage cookie preferences through your browser settings. Note that disabling certain cookies may affect Platform functionality.
              </p>

              <h3 className="font-semibold text-xl mb-3 text-foreground">6.5 Data Portability</h3>
              <p className="text-foreground/90 leading-relaxed">
                Upon request, we will provide your personal information in a structured, commonly used, and machine-readable format.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="font-heading text-2xl font-bold mb-4 text-primary">7. Blockchain and Cryptocurrency Data</h2>
              <p className="text-foreground/90 leading-relaxed mb-4">
                Our Platform utilizes blockchain technology for tokenized film IP assets and transactions. Please note:
              </p>
              <ul className="list-disc pl-6 text-foreground/90 space-y-2 mb-4">
                <li>Blockchain transactions are inherently public and permanent</li>
                <li>Wallet addresses and transaction data may be visible on public ledgers</li>
                <li>We cannot modify or delete blockchain records once confirmed</li>
                <li>Your wallet address may be linked to your identity through our Platform</li>
                <li>Smart contract interactions may expose certain transaction details</li>
              </ul>
              <p className="text-foreground/90 leading-relaxed">
                We recommend using separate wallet addresses for different purposes to enhance privacy.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="font-heading text-2xl font-bold mb-4 text-primary">8. International Data Transfers</h2>
              <p className="text-foreground/90 leading-relaxed mb-4">
                The African Film DAO operates globally, and your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your information in accordance with this Privacy Policy, including:
              </p>
              <ul className="list-disc pl-6 text-foreground/90 space-y-2 mb-4">
                <li>Standard contractual clauses approved by relevant authorities</li>
                <li>Adequacy decisions for certain jurisdictions</li>
                <li>Other legally recognized transfer mechanisms</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="font-heading text-2xl font-bold mb-4 text-primary">9. Children's Privacy</h2>
              <p className="text-foreground/90 leading-relaxed mb-4">
                Our Platform is not intended for use by individuals under the age of 18. We do not knowingly collect personal information from children under 18. If we become aware that we have collected such information, we will take steps to delete it promptly.
              </p>
              <p className="text-foreground/90 leading-relaxed">
                If you are a parent or guardian and believe your child has provided personal information, please contact us immediately.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="font-heading text-2xl font-bold mb-4 text-primary">10. Third-Party Links and Services</h2>
              <p className="text-foreground/90 leading-relaxed mb-4">
                Our Platform may contain links to third-party websites or services. We are not responsible for the privacy practices or content of these third parties. We encourage you to review their privacy policies before providing any personal information.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="font-heading text-2xl font-bold mb-4 text-primary">11. Changes to This Privacy Policy</h2>
              <p className="text-foreground/90 leading-relaxed mb-4">
                We may update this Privacy Policy from time to time to reflect changes in our practices, technology, legal requirements, or other factors. We will notify you of material changes by:
              </p>
              <ul className="list-disc pl-6 text-foreground/90 space-y-2 mb-4">
                <li>Posting the updated policy on our Platform with a new "Last Updated" date</li>
                <li>Sending you an email notification (if you have provided an email address)</li>
                <li>Displaying a prominent notice on our Platform</li>
              </ul>
              <p className="text-foreground/90 leading-relaxed">
                We encourage you to review this Privacy Policy periodically. Your continued use of the Platform after any changes constitutes acceptance of the updated policy.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="font-heading text-2xl font-bold mb-4 text-primary">12. Contact Us</h2>
              <p className="text-foreground/90 leading-relaxed mb-4">
                If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:
              </p>
              <div className="bg-muted/50 rounded-lg p-6 border border-border">
                <p className="text-foreground/90 mb-2">
                  <strong>Email:</strong> privacy@africanfilmdao.org
                </p>
                <p className="text-foreground/90 mb-2">
                  <strong>Subject Line:</strong> Privacy Policy Inquiry
                </p>
                <p className="text-foreground/90">
                  We will respond to your inquiry within 30 days of receipt. For urgent matters, please include "URGENT" in your subject line.
                </p>
              </div>
            </section>

            <section className="mb-10">
              <h2 className="font-heading text-2xl font-bold mb-4 text-primary">13. Governing Law</h2>
              <p className="text-foreground/90 leading-relaxed">
                This Privacy Policy is governed by and construed in accordance with applicable laws and regulations. Any disputes arising from this policy will be resolved through appropriate legal channels in the relevant jurisdiction.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="font-heading text-2xl font-bold mb-4 text-primary">14. Effective Date</h2>
              <p className="text-foreground/90 leading-relaxed">
                This Privacy Policy is effective as of January 21, 2026, and supersedes all previous versions.
              </p>
            </section>
          </div>

          {/* Footer Note */}
          <div className="mt-16 pt-8 border-t border-border text-center text-muted-foreground text-sm">
            <p>
              African Film DAO Platform - Empowering African filmmakers through blockchain technology
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;