import React from 'react';

const TermsOfService: React.FC = () => {
  return (
   <main className="bg-zinc-100 md:p-4">
     <div className="container mx-auto bg-white border border-zinc-200 rounded mx-auto px-[clamp(16px,3%,40px)] py-8 max-w-screen-lg">
      <h1 className="text-3xl font-semibold mb-6 text-center">Terms of Service</h1>
      <div className="line"></div>
      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
        <p>
          By accessing and using the AppSuite application suite, you agree to comply with and be bound by these Terms of Service. If you do not agree
          with any part of these terms, you may not use our application.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">2. User Accounts and Responsibilities</h2>
        <p>
          To access certain features, you may be required to create an account and grant permissions to your Google Drive for data storage purposes.
          You are responsible for maintaining the confidentiality of your account credentials and are liable for all activities that occur under your account.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">3. Data Storage and Privacy</h2>
        <p>
          AppSuite stores all data in your Google Drive account, giving you full ownership and control. Each application module within AppSuite operates
          independently, ensuring that data from one module is not accessible by another unless explicitly authorized by you. By using the application, 
          you consent to this method of data handling.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">4. Grant of Limited License</h2>
        <p>
          AppSuite grants you a non-exclusive, non-transferable, revocable license to access and use the application for personal or business purposes.
          This license does not permit any resale or commercial use of AppSuite without explicit written consent.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">5. Third-Party Services</h2>
        <p>
          AppSuite relies on Google Drive as a third-party service for secure data storage. By granting access to your Google Drive, you understand that
          AppSuite will store and retrieve only the data necessary for application functionality. We do not share your data with other third parties.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">6. Prohibited Conduct</h2>
        <p>
          You agree not to misuse AppSuite by engaging in activities such as unauthorized access, altering application files, or compromising the application’s
          integrity or security. Violations may result in the termination of your access to AppSuite and could lead to legal action.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">7. Limitation of Liability</h2>
        <p>
          AppSuite is provided &ldquo;as is,&ldquo;` without any warranties or guarantees. To the fullest extent permitted by law, we disclaim liability for any damages,
          including direct, indirect, incidental, or consequential losses arising from your use or inability to use the application.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">8. Termination of Service</h2>
        <p>
          We reserve the right to terminate or suspend your access to AppSuite, with or without notice, for any violation of these Terms of Service or
          other reasons beyond our control. Upon termination, all rights granted to you will immediately cease.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">9. Modifications to the Terms</h2>
        <p>
          AppSuite reserves the right to update or modify these Terms of Service at any time. We encourage you to review this page periodically to stay
          informed of any changes. Continued use of the application after modifications implies your acceptance of the updated terms.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">10. Governing Law</h2>
        <p>
          These Terms of Service are governed by and construed in accordance with the laws applicable in the jurisdiction of our operation, without
          regard to conflict of law principles. Any disputes arising from these terms will be resolved in the courts of the respective jurisdiction.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">11. Contact Us</h2>
        <p>
          If you have any questions or concerns regarding these Terms of Service, please reach out to us at 
          <a href="mailto:onyeukwuhycient@gmail.com" className="text-blue-500 underline"> onyeukwuhycient@gmail.com</a>.
        </p>
      </section>
    </div>
  </main>
  );
};

export default TermsOfService;