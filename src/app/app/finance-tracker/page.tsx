import { InstagramIcon, LogoAndText, LogoAndTextWhite, LogoWhite, TelegramIcon, YoutubeIcon } from '@/sharedComponents/CustomIcons';
import ProceedOrSignInButton from '@/sharedComponents/ProceedOrSignInButton';
import Image from 'next/image';
import Link from 'next/link';
import ModuleLandingPageNav from '../_components/ModuleLandingPageNav';

export interface FeatureCardProps {
  title: string;
  description: string;
  link: string
}

export interface SocialIconProps {
  src: string;
  alt: string;
  width: string;
  aspectRatio: string;
}

export interface FooterLinkProps {
  text: string;
}

export interface NavigationLinkProps {
  text: string;
}

const features = [
  {
    title: "Finance Tracker",
    description: "Gain clarity over your finances with tools to track expenses, income, and savings in one streamlined dashboard.",
    link: "/app/finance-tracker"
  },
  {
    title: "Receipt Tracker",
    description: "Effortlessly organize and store receipts digitally for quick access and better financial management.",
    link: "/app/receipt-tracker"
  },
  {
    title: "Grades Tracker",
    description: "Effortlessly organize track your grades.",
    link: "/app/grades-tracker"
  }
];

const socialIcons = [
  {
    href: "",
    icon: <TelegramIcon />
  },
  {
    href: "",
    icon: <InstagramIcon />
  },
  {
    href: "",
    icon: <YoutubeIcon />
  },
];

export default function LandingPage() {
  return (
    <div className="fle relative grid  grid-cols-1 justify-center w-full min-h-dvh flex-col bg-[url(/images/home/hero-bg.png)] bg-contain bg-no-repeat bg-left-top">
      <ModuleLandingPageNav />       

      <div className="flex flex-col self-center text-primary max-w-screen-md mx-auto px-3">
        <div className="w-20 h-20 rounded-full justify-center items-center flex bg-sky-100 self-start mt-28 ml-16 animate-float text-4xl tracking-tighter leading-none text-center max-md:mt-10 max-md:ml-2.5">
          🎓
        </div>
        <div className="flex flex-wrap gap-1.5 self-end text-center max-md:mr-1.5">
          <h1 className="flex-auto text-7xl tracking-tighter leading-[91px] max-md:max-w-full max-md:text-5xl max-md:leading-[1.8ch] ">
            Track income and expenditure with ease
          </h1>
          <div className="px-3 my-auto w-20 h-20 animate-float delay-150 text-4xl flex place-items-center justify-center tracking-tighter leading-none whitespace-nowrap bg-sky-100 min-h-[80px] rounded-[99px]">
            🛠️
          </div>
        </div>
        <div className="self-center animate-float delay-200 mt-0 text-4xl tracking-tighter leading-none text-center w-20 h-20 rounded-full justify-center items-center flex bg-sky-100">
          💶
        </div>
        <div className="mt-3.5 text-xl lg:text-2xl text-center text-slate-500 max-md:mr-1.5 max-md:max-w-full">
          A user-driven, single-purpose application that empowers you to track income and expenditure with ease, securely storing your data in your own Google Drive.
        </div>
        <ProceedOrSignInButton href='files' />
      </div>

      <div id='features' className="flex overflow-hidden max-w-[100vw] flex-col pt-12 mt-11 w-full max-md:mt-10 max-md:max-w-full">
        <div className="flex overflow-hidden  flex-col  w-full leading-none font-[146] max-md:max-w-full">
          <div className="flex gap-8 min-h-[258px] animate-scroll-left bg-tes">
            {[ ...features, ...features ].map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </div>
          <div className="px-4 max-w-screen-lg mx-auto h-full w-full">
            <div className=" relative aspect-[1.6/1] w-full mx-auto h-auto -m-4 -mb-14 z-[1]">
              <Image src="/images/home/module-1.png" fill alt='Module 1' />
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-center  w-full  px-4 py-20 lg:py-28 ">
          <LogoAndText className='aspect-[4/1] h-auto w-full max-w-screen-lg mx-auto ' />
        </div>
      </div>

      <footer id='about' className="bg-primary w-full">
        <div className="flex overflow-hidden flex-wrap gap-4 px-32 py-16 max-w-screen-2xl mx-auto w-full max-md:px-5 max-md:mt-10 max-md:max-w-full">
          <div className="flex flex-col flex-1 shrink justify-between items-start basis-0 min-w-[240px] max-md:max-w-full">
            <LogoAndTextWhite className='aspect-[4/1] w-auto h-8' />
            <div className="flex gap-4 justify-center items-center mt-44 max-md:mt-10">
              {socialIcons.map((icon, index) => (
                <a key={`social-icon-${index}`} href={icon.href} className="">{icon.icon}</a>
              ))}
            </div>
          </div>
          <div className="flex flex-col self-start leading-snug text-white min-w-[240px] w-[484px] max-md:max-w-full">
            <div className="flex flex-wra gap-10 items-start w-full max-md:max-w-full">
              <nav className="flex flex-col whitespace-nowrap w-[234px]">
                <h2 className="text-xs font-medium tracking-wide uppercase">NAVIGATION</h2>
                <div className="flex flex-col mt-6 w-full text-sm">
                  <button className="text-left">Home</button>
                  <button className="mt-1.5 text-left">About</button>
                  <button className="mt-1.5 text-left">Features</button>
                  <button className="mt-1.5 text-left">Contact</button>
                </div>
              </nav>
              <div className="flex flex-col flex-1 shrink basis-0">
                <h2 className="text-xs font-medium tracking-wide uppercase">Contacts us</h2>
                <div className="flex flex-col mt-6 w-full text-sm">
                  <div>Get in touch with us</div>
                  <a href="mailto:onyeukwuhycient@gmail.com" className="mt-1.5">onyeukwuhycient@gmail.com</a>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-10 justify-between items-start mt-20 w-full text-xs font-medium text-right max-md:mt-10 max-md:max-w-full">
              <button className="rotate-[1.6081230200044232e-16rad]">Privacy</button>
              <button className="rotate-[1.6081230200044232e-16rad]">Terms of Service</button>
              <div className="rotate-[1.6081230200044232e-16rad]">© 2024 — Copyright</div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, link }) => {
  return (
    <div className="flex overflow-hidden flex-col justify-center px-14 py-2 bg-white rounded-xl min-w-[240px] border border-b-white border-slate-200 md:min-w-[580px] max-md:px-5 max-md:max-w-full">
      <div className="flex flex-col w-full max-md:max-w-full">
        <div className="text-2xl tracking-tight font-bold text-primary max-md:max-w-full">
          {title}
        </div>
        <div className="mt-5 text-base leading-5 text-gray-800 font-[68] max-md:max-w-full">
          {description}
        </div>
        <Link href={link} className="mt-5 text-lg tracking-tight font-semibold text-indigo-500 max-md:max-w-full">
          Learn More
        </Link>
      </div>
    </div>
  );
};