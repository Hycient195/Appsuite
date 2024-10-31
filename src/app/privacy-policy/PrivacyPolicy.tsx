import React from 'react';

const PrivacyPolicy: React.FC = () => {
  return (
    <main className="md:p-4 bg-zinc-100">
      <div className="container bg-white border border-zinc-200 rounded mx-auto px-[clamp(16px,3%,40px)] py-8 max-w-screen-lg">
        <h1 className="text-3xl font-semibold mb-6 text-center">Privacy Policy</h1>
        <div className="line"></div>
        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
          <p>
            Welcome to the AppSuite application. Your privacy is important to us. This Privacy Policy outlines how we handle
            your personal information, especially regarding your data storage and privacy within the application.
          </p>
        </section>
        
        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">2. Data Storage and Control</h2>
          <p>
            AppSuite stores your data securely in your Google Drive account, giving you full control over your data.
            This approach means that we do not store or retain your personal data on our servers. By utilizing your Google Drive account,
            you retain complete ownership and control over your data.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">3. Independent Data for Each Module</h2>
          <p>
            Our application suite is designed as a collection of independent modules, each tailored to serve a unique purpose (e.g., Income
            & Expense tracking, task management, and other personal finance tools). Each module operates independently, meaning that data
            from one module is not accessible by other modules unless explicitly authorized by you. This modular design ensures your data&apos;s
            integrity and privacy across different tools.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">4. Data Access and Permissions</h2>
          <p>
            When you use the application, you will be asked to grant permissions to access your Google Drive. These permissions are solely
            used to read and write data relevant to the application’s functions. We strictly adhere to Google’s policies and your data is
            never accessed beyond the scope of the permissions you grant.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">5. Data Security</h2>
          <p>
            We prioritize your data’s security and take measures to ensure that your information is safeguarded. By storing data on Google
            Drive, you benefit from Google’s high security standards, ensuring that your information remains secure and private.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">6. Data Deletion and Portability</h2>
          <p>
            Since your data resides within your Google Drive account, you have full access and control to delete any or all files associated
            with the application. You can remove the application’s access at any time, which will revoke our ability to access your data. All
            data associated with the application will remain in your Google Drive until you choose to delete it.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">7. Third-Party Services</h2>
          <p>
            We do not share your data with any third parties. The application relies solely on Google Drive for data storage, and no external
            parties have access to your information unless required by law.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">8. Changes to This Privacy Policy</h2>
          <p>
            We may update this Privacy Policy periodically to reflect changes in our practices or regulatory requirements. We encourage you to
            review this page from time to time to stay informed about how we are protecting your privacy.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">9. Contact Us</h2>
          <p>
            If you have any questions or concerns regarding this Privacy Policy or the data practices of the Income Expenses application,
            please feel free to contact us at <a href="mailto:onyeukwuhycient@gmail.com" className="text-blue-500 underline">onyeukwuhycient@gmail.com</a>.
          </p>
        </section>
      </div>
    </main>
  );
};

export default PrivacyPolicy;