import LandingPageTemplate from '@/sharedComponents/ModuleLandingPageTemplate';

export default function LandingPage() {
  return <LandingPageTemplate
      moduleName='Receipt Tracker'
      titleText='Track receipts and expenditure with ease'
      subTitleText='a user-driven, single-purpose application that empowers you to track receipts with ease, securely storing your data in your own Google Drive.'
      fileListLink='receipt-tracker/files'
    />;
};

