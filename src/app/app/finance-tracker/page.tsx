import LandingPageTemplate from '@/sharedComponents/ModuleLandingPageTemplate';

export default function LandingPage() {
  return <LandingPageTemplate
    moduleName='Finance Tracker'
    titleText='Track income and expenditure with ease'
    subTitleText='A user-driven, single-purpose application that empowers you to track income and expenditure with ease, securely storing your data in your own Google Drive.'
    fileListLink='finance-tracker/files'
    />;
};

