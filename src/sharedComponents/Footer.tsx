import Link from "next/link"

export default function Footer() {

  return (
    <footer className="p-5 pt-10 md:pt-[6%] px-[clamp(20px,4vw,120px)] md:rounded-t-[30px] lg:rounded-t-[40px] xl:rounded-t-[50px] bg-dark-blue">
      <section className="max-w-screen-2xl max-2xl:container mx-auto grid grid-cols-1 md:grid-cols-[1fr_2.4fr] gap-3 lg:gap-4 xl:gap-6">
        <div className="left min-w-[350px] flex flex-col gap-5 text-white mb-10">
          <h2 className="text-white font-semibold text-3xl lg:text-4xl leading-[2.4ch]">Transform Your Business Today with PT Partner</h2>
          <div className="grid max-md:grid-cols-2 gap-3 lg:gap-4 xl:gap-6 mt-3">
            {
              externalLinks.map((section) => (
                <div key={section.title}>
                  <p className="font-light text-lg">{section.title}</p>
                  <div className="grid grid-cols-3 w-max gap-3 xl:gap-4 mt-2">
                    {
                      section.icons.map((icon, index) => (
                        <a key={`external-icon-${index}`} href={icon.href} rel="noopener noreferrer" className="">
                          <div className="h-10 w-auto aspect-square bg-white/30 rounded-full flex items-center justify-center p-2.5">
                            {icon.icon}
                          </div>
                        </a>
                      ))
                    }
                  </div>
                </div>
              ))
            }
          </div>
        </div>
        <div className="right grid grid-cols-2 lg:grid-cols-[repeat(auto-fill,minmax(269px,1fr))] gap-y-10">
          {
            footerSections.map((section) => (
              <ul key={`footer-section-${section.title}`} className="flex flex-col gap-1 text-slate-200">
                <li className="text-white text-lg font-medium mb-3">{section.title}</li>
                {
                  section.items.map((item) => (
                    <li key={`footer-item-${item}`} className="font-light text-sm py-0.5">
                      <Link href={item.href} className="py-2">{item.text}</Link>
                    </li>
                  ))
                }
              </ul>
            ))
          }
        </div>
        <div className="h-px w-full bg-slate-200/20 md:col-span-2 mt-10" />
        <p className="font-light py-0.5 text-slate-200/60">Copyright PT Partner 2024</p>
        <ul className="flex font-light flex-row gap-3 lg:gap-5 xl:gap-6 items-center flex-wrap justify-be text-slate-200/80">
          { footerFoot.map(item => <li key={item.text} className="tracking-wide"><Link href={item.href}>{item.text}</Link></li> )}
        </ul>
      </section>
    </footer>
  )
}

const footerSections = [
  {
    title: "Solutions",
    items: [
      { text: "Call Center", href: "" },
      { text: "Support", href: "" },
      { text: "Sales", href: "" },
      { text: "Phone System", href: "" },
      { text: "Ecommerce", href: "" },
      { text: "Non-profits", href: "" },
    ]
  },
  {
    title: "Product",
    items: [
      { text: "Integrations", href: "" },
      { text: "Quality and reliability", href: "" },
      { text: "Apps", href: "" },
      { text: "Pricing", href: "" },
      { text: "Country coverage", href: "" },
      { text: "Request a demo", href: "" },
    ]
  },
  {
    title: "Features",
    items: [
      { text: "PowerDialer", href: "" },
      { text: "IVR", href: "" },
      { text: "Call Routing", href: "" },
      { text: "Call Center Analytics", href: "" },
      { text: "CTI Integration", href: "" },
      { text: "Click to Dial", href: "" },
    ]
  },
  {
    title: "Resources",
    items: [
      { text: "Knowledge Base", href: "" },
      { text: "Customer Stories", href: "" },
      { text: "Partner Stories", href: "" },
      { text: "Become a Partner", href: "" },
      { text: "Build an Integration", href: "" },
      { text: "VoIP Documentation", href: "" },
      { text: "Glossary", href: "" },
      { text: "Speed Test", href: "" },
      { text: "Uptime status", href: "" },
    ]
  },
  {
    title: "Company",
    items: [
      { text: "Contact Us", href: "" },
      { text: "About Us", href: "" },
      { text: "Careers ", href: "" },
      { text: "Press", href: "" },
      { text: "Uptime", href: "" },
      { text: "Brand", href: "" },
    ]
  },
]

const footerFoot = [
  { text: "Privacy Polity", href: "" },
  { text: "Terms of use", href: "" },
  { text: "Security", href: "" },
  { text: "Privacy FAQs", href: "" },
  { text: "DPA", href: "" },
  { text: "Sitemap", href: "" },
  { text: "Cookies Preferences", href: "" },
]

const externalLinks = [
  {
    title: "Follow us",
    icons: [
      { 
        href: "",
        icon: <svg width="18" height="20" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clip-path="url(#clip0_369_7029)">
        <path d="M16 8.04889C16 3.60361 12.4183 0 8 0C3.58172 0 0 3.60361 0 8.04889C0 12.0663 2.92547 15.3962 6.75 16V10.3755H4.71875V8.04889H6.75V6.27562C6.75 4.25837 7.94438 3.1441 9.77172 3.1441C10.6467 3.1441 11.5625 3.3013 11.5625 3.3013V5.28208H10.5538C9.56 5.28208 9.25 5.90257 9.25 6.53972V8.04889H11.4688L11.1141 10.3755H9.25V16C13.0745 15.3962 16 12.0663 16 8.04889Z" fill="white"/>
        </g>
        <defs>
        <clipPath id="clip0_369_7029">
        <rect width="16" height="16" fill="white"/>
        </clipPath>
        </defs>
        </svg>
      },
      { 
        href: "",
        icon: <svg width="18" height="20" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M5.03344 13.5C11.0697 13.5 14.3722 8.4978 14.3722 4.16124C14.3722 4.02062 14.3691 3.87687 14.3628 3.73624C15.0052 3.27164 15.5597 2.69617 16 2.03687C15.4017 2.30307 14.7664 2.47692 14.1159 2.55249C14.8009 2.14194 15.3137 1.49698 15.5594 0.737178C14.915 1.11904 14.2104 1.38841 13.4756 1.53374C12.9806 1.00771 12.326 0.659411 11.6131 0.542701C10.9003 0.42599 10.1688 0.547367 9.53183 0.888064C8.89486 1.22876 8.38787 1.7698 8.08923 2.42754C7.7906 3.08528 7.71695 3.82308 7.87969 4.52687C6.575 4.46139 5.29862 4.12247 4.13332 3.53207C2.96802 2.94166 1.9398 2.11296 1.11531 1.09968C0.696266 1.82216 0.568038 2.6771 0.756687 3.49073C0.945337 4.30436 1.43671 5.01563 2.13094 5.47999C1.60975 5.46344 1.09998 5.32312 0.64375 5.07061V5.11124C0.643283 5.86943 0.905399 6.60439 1.38554 7.19118C1.86568 7.77797 2.53422 8.18037 3.2775 8.32999C2.7947 8.46209 2.28799 8.48133 1.79656 8.38624C2.0063 9.03829 2.41438 9.60859 2.96385 10.0176C3.51331 10.4265 4.17675 10.6537 4.86156 10.6675C3.69895 11.5807 2.26278 12.0761 0.784375 12.0737C0.522191 12.0733 0.260266 12.0573 0 12.0256C1.5019 12.9892 3.24902 13.5009 5.03344 13.5Z" fill="white"/>
        </svg>
      },
      { 
        href: "",
        icon: <svg width="18" height="20" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clip-path="url(#clip0_369_7035)">
        <path d="M14.8156 0H1.18125C0.528125 0 0 0.515625 0 1.15313V14.8438C0 15.4813 0.528125 16 1.18125 16H14.8156C15.4688 16 16 15.4813 16 14.8469V1.15313C16 0.515625 15.4688 0 14.8156 0ZM4.74687 13.6344H2.37188V5.99687H4.74687V13.6344ZM3.55938 4.95625C2.79688 4.95625 2.18125 4.34062 2.18125 3.58125C2.18125 2.82188 2.79688 2.20625 3.55938 2.20625C4.31875 2.20625 4.93437 2.82188 4.93437 3.58125C4.93437 4.3375 4.31875 4.95625 3.55938 4.95625ZM13.6344 13.6344H11.2625V9.92188C11.2625 9.0375 11.2469 7.89687 10.0281 7.89687C8.79375 7.89687 8.60625 8.8625 8.60625 9.85938V13.6344H6.2375V5.99687H8.5125V7.04063H8.54375C8.85938 6.44063 9.63438 5.80625 10.7875 5.80625C13.1906 5.80625 13.6344 7.3875 13.6344 9.44375V13.6344Z" fill="white"/>
        </g>
        <defs>
        <clipPath id="clip0_369_7035">
        <rect width="16" height="16" fill="white"/>
        </clipPath>
        </defs>
        </svg>
        
      },
    ]
  },
  {
    title: "Mobile app",
    icons: [
      { 
        href: "",
        icon: <svg width="16" height="20" viewBox="0 0 16 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M15.6647 15.5861C15.3774 16.2848 15.0374 16.928 14.6434 17.5193C14.1064 18.3255 13.6667 18.8835 13.3279 19.1934C12.8026 19.702 12.2398 19.9625 11.6371 19.9773C11.2045 19.9773 10.6827 19.8477 10.0753 19.5847C9.46598 19.323 8.90599 19.1934 8.39396 19.1934C7.85695 19.1934 7.28102 19.323 6.66499 19.5847C6.04801 19.8477 5.55099 19.9847 5.17098 19.9983C4.59305 20.0242 4.017 19.7563 3.44201 19.1934C3.07501 18.8563 2.61598 18.2786 2.06607 17.4601C1.47607 16.586 0.991001 15.5725 0.610992 14.417C0.204016 13.1689 0 11.9603 0 10.7902C0 9.44984 0.27507 8.29382 0.82603 7.32509C1.25904 6.54696 1.83509 5.93315 2.55606 5.48255C3.27703 5.03195 4.05605 4.80232 4.89497 4.78763C5.35401 4.78763 5.95597 4.93713 6.70403 5.23095C7.44998 5.52576 7.92895 5.67526 8.13894 5.67526C8.29594 5.67526 8.82802 5.50045 9.73003 5.15194C10.583 4.82874 11.3029 4.69492 11.8927 4.74763C13.4908 4.88343 14.6915 5.54675 15.49 6.74177C14.0607 7.6536 13.3537 8.93072 13.3677 10.5691C13.3806 11.8452 13.8203 12.9071 14.6845 13.7503C15.0761 14.1417 15.5134 14.4441 16 14.6589C15.8945 14.9812 15.7831 15.2898 15.6647 15.5861ZM11.9994 0.400111C11.9994 1.40034 11.6524 2.33425 10.9606 3.19867C10.1258 4.22629 9.11599 4.8201 8.02099 4.7264C8.00704 4.6064 7.99894 4.48011 7.99894 4.3474C7.99894 3.38718 8.39596 2.35956 9.10098 1.51934C9.45297 1.09392 9.90063 0.740188 10.4435 0.458011C10.9852 0.180044 11.4976 0.0263202 11.9795 0C11.9936 0.133712 11.9994 0.267436 11.9994 0.400099V0.400111Z" fill="white"/>
        </svg>        
      },
      { 
        href: "",
        icon: <svg width="18" height="20" viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" clipRule="evenodd" d="M10.148 9.13009L12.6737 6.60297L1.31052 0.190795C1.28705 0.177551 1.26463 0.162539 1.24346 0.145889C1.15591 0.0770525 1.05545 0.0276558 0.948828 0L10.148 9.13009ZM0.00276565 0.900288C-0.00135919 0.824782 0.00230986 0.749601 0.0134164 0.675829L9.39952 9.99894L0.0107198 19.3248C0.000298027 19.2522 -0.0026089 19.1783 0.0023683 19.1042C0.00315504 19.0924 0.00354872 19.0807 0.00354872 19.069V0.928977C0.00354872 0.919408 0.00328757 0.909842 0.00276565 0.900288ZM13.7248 12.8055L10.8993 9.99894L13.7137 7.2035L17.403 9.27834C17.8846 9.54826 17.9999 9.83025 17.9999 10.0003C17.9999 10.1713 17.883 10.4558 17.4005 10.7299L13.7248 12.8055ZM0.954484 20C1.06026 19.9728 1.16009 19.9244 1.24751 19.8571C1.26742 19.8417 1.2884 19.8278 1.31029 19.8155L12.6736 13.3955L10.1478 10.8683L0.954484 20Z" fill="white"/>
        </svg>
      },
    ]
  },
]