const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="bg-card rounded-lg shadow-lg p-8 md:p-12 border border-border">
          <h1 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">Terms of Service</h1>
          
          <p className="text-sm text-muted-foreground mb-8">
            Last Updated: January 21, 2026
          </p>

          <div className="prose prose-lg max-w-none text-foreground space-y-6">
            <section>
              <p className="text-lg leading-relaxed">
                Welcome to the African Film DAO Platform. These Terms of Service ("Terms") govern your access to and use of the website and services located at <code className="bg-muted px-2 py-1 rounded text-sm">https://afd-submissions.lovable.app/</code> (the "Platform"), operated by the African Film DAO community ("we," "us," "our," or the "DAO").
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-foreground">1. Acceptance of Terms</h2>
              <p className="leading-relaxed">
                By accessing or using the Platform—including submitting film projects, interacting with analytics, or participating in community features—you agree to be bound by these Terms. If you do not agree, you may not use the Platform.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-foreground">2. The African Film DAO Ecosystem</h2>
              <p className="leading-relaxed mb-4">
                The Platform is a tool for the African Film DAO, a decentralized autonomous organization. Its purpose is to empower African filmmakers by:
              </p>
              <ul className="list-disc pl-6 space-y-2 leading-relaxed">
                <li>Facilitating project submissions for community review and potential funding.</li>
                <li>Providing analytics and insights related to African cinema.</li>
                <li>Serving as an information hub about the DAO's mission and operations.</li>
              </ul>
              <p className="leading-relaxed mt-4">
                All significant decisions, including project funding, are made by the DAO community through its decentralized governance processes, not by the Platform alone.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-foreground">3. User Accounts and Responsibilities</h2>
              <p className="leading-relaxed mb-4">
                You are responsible for all activities under your account. You agree to:
              </p>
              <ul className="list-disc pl-6 space-y-2 leading-relaxed">
                <li>Provide accurate and complete information.</li>
                <li>Maintain the security of your credentials.</li>
                <li>Use the Platform lawfully and not submit harmful or infringing content.</li>
                <li>Comply with all applicable local and international laws.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-foreground">4. Intellectual Property & Project Submissions</h2>
              
              <h3 className="text-xl font-semibold mb-3 mt-6 text-foreground">Your Content</h3>
              <p className="leading-relaxed mb-4">
                You retain all ownership rights to the film projects, ideas, and materials ("Submissions") you submit through the Platform.
              </p>

              <h3 className="text-xl font-semibold mb-3 mt-6 text-foreground">License to the DAO</h3>
              <p className="leading-relaxed mb-4">
                By making a Submission, you grant the African Film DAO a non-exclusive, royalty-free license to view, assess, and share your Submission internally within the DAO community for the sole purpose of evaluation, governance, and potential support. This is not a transfer of ownership.
              </p>

              <h3 className="text-xl font-semibold mb-3 mt-6 text-foreground">DAO Content</h3>
              <p className="leading-relaxed mb-4">
                All other content on the Platform, including its design, logo, and aggregated analytics, is the property of the African Film DAO or its licensors.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-foreground">5. Disclaimer of Warranties & Limitation of Liability</h2>
              <p className="leading-relaxed mb-4">
                The Platform and all content are provided "as is" and "as available" without any warranties.
              </p>
              <p className="leading-relaxed mb-4">
                The DAO does not guarantee that any project will receive funding, that the Platform will be uninterrupted, or that any analytics are error-free.
              </p>
              <p className="leading-relaxed mb-4">
                To the fullest extent permitted by law, the DAO and its contributors shall not be liable for any indirect or consequential damages arising from your use of the Platform or participation in the DAO ecosystem.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-foreground">6. Governance, Proposals, and Voting</h2>
              <p className="leading-relaxed mb-4">
                Interaction with the DAO's core functions (e.g., token-based voting on proposals) may occur through linked third-party platforms (like Snapshot) or smart contracts. Such activities are governed by the DAO's separate governance framework and are beyond the scope of these Platform-specific Terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-foreground">7. Modifications</h2>
              <p className="leading-relaxed mb-4">
                The African Film DAO community reserves the right to modify these Terms at any time. Continued use of the Platform after changes constitutes acceptance of the new Terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-foreground">8. Governing Law and Dispute Resolution</h2>
              <p className="leading-relaxed mb-4">
                These Terms shall be governed by the laws of [Insert Jurisdiction, e.g., Republic of Kenya]. Any disputes shall be resolved through good-faith negotiation within the DAO community framework, or if necessary, in the courts of the aforementioned jurisdiction.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-foreground">9. Contact</h2>
              <p className="leading-relaxed mb-4">
                For questions about these Terms, please contact the community via the designated channels on the African Film DAO's official communication platforms.
              </p>
            </section>

            <section className="pt-8 border-t border-border mt-8">
              <p className="text-sm text-muted-foreground italic">
                These Terms of Service are effective as of January 21, 2026, and govern all use of the African Film DAO Platform.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;