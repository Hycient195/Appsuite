import LandingPageTemplate from '@/sharedComponents/ModuleLandingPageTemplate';

export default function LandingPage() {
  return <LandingPageTemplate
    moduleName='Invoice Manager'
    titleText='Manage and compute several kind of invoices, all from one place'
    subTitleText='A user-driven, single-purpose application that empowers you to track invoice and expenditure with ease, securely storing your data in your own Google Drive.'
    fileListLink='invoice-manager/files'
    />;
};

