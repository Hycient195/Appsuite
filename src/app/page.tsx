"use client"

import { LogoIcon } from "@/sharedComponents/CustomIcons";
import Link from "next/link";
import { useState } from "react";

const links = [
  // {
  //   text: "Features",
  //   path: "/",
  //   id: "features"
  // },
  {
    text: "About",
    path: "",
    id: "about"
  },
  {
    text: "Contact",
    path: "",
    id: "contact"
  },
]

function App() {
  const [ isMobileNavOpen, setIsMobileNavOpen ] = useState<boolean>(false);

  return (
    <div className="bg-white relative text-primaryColor min-h-screen flex flex-col">
      {/* Header */}
      <header className="w-full sticky top-0 z-[3] bg-white flex justify-between items-center">
        {/* <div className="text-xl font-bold text-primary">AppSuite</div>
        <nav className="flex space-x-6">
          <a href="#features" className="hover:text-highlightColor transition-colors">Features</a>
          <a href="#about" className="hover:text-highlightColor transition-colors">About</a>
          <a href="#contact" className="hover:text-highlightColor transition-colors">Contact</a>
          <a href="#sign-in" className="text-highlightColor font-semibold">Sign In</a>
        </nav> */}
         <nav className="shadow w-full  bg-gradient-to-t [&_*]:borde [&_*]:border-dashed [&_*]:border-black">
          <div className="mx-auto spread-out max-w-screen-2xl px-4 py-4 max-md:py-3.5 flex flex-row gap-2 items-center">
            <Link href="/" className="logo flex flex-row gap-1 lg:gap-2 items-center">
              <LogoIcon />
              <span style={{ animationDuration: "700ms"}} className="text-slate-800  text-2xl font-medium">AppSuite</span>
            </Link>
            <div style={{ animationDuration: "1000ms"}} className="md:ml-[4%] max-md:hidden">
              { links.map(link => <Link key={link.text} className="capitalize py-3 px-4 text-zinc-700 xl:px-5" href={`${link.path}${link.id?`#${link.id}`:""}`}>{link.text}</Link>)}
              {/* { links.map(link => <Link key={link.text} className="capitalize py-3 px-4 text-slate-600 xl:px-5" href={{ pathname: `${link.path}`, hash: `${link.id?`${link.id}`:""}`}} preventScrollReset >{link.text}</Link>)} */}
            </div>
            <Link href="/sign-in" className="px-6 max-md:hidden ml-auto py-2.5 rounded-full font-medium bg-black text-white bg-blue">Try for Free</Link>
            <button onClick={() => setIsMobileNavOpen(true)} className="ml-auto md:hidden ">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-9 text-slate-700">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>
          </div>
        </nav>
      </header>

      {/* Main content */}
      <main className="flex-grow ">
        {/* Hero section */}
        <section className="text-center mb-20 relative bg-[url(/images/home/hero-bg.jpg)] flex items-center justify-center bg-cover bg-no-repeat h-[clamp(400px,60vh,700px)] after:absolute after:h-full after:w-full after:left-0 after:top-0 after:bg-white/50">
          <div className=" p-[clamp(16px,3vw,40px)] z-[1]">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-primaryColor">Welcome to AppSuite</h1>
            <p className="text-lg md:text-xl text-secondary mb-8">
              Your precisely and efficiently tailored special-purpose apps, all in one suite.
            </p>
            {/* <a href="#features" className="bg-highlightColor text-white py-3 px-6 rounded-full shadow-lg hover:bg-purple-700 transition-all">
              Explore Features
            </a> */}
            <Link href="/sign-in" className="bg-black/90 text-white py-3 px-6 rounded-full shadow-lg duration-500 hover:bg-black/70 transition-all">
              Try for Free
            </Link>
          </div>
        </section>

        {/* Features section */}
        {/* <section id="features" className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-10">Features</h2>
          <div className="grid md:grid-cols-3 gap-10">
            <div className="p-6 bg-gray-100 rounded-lg shadow-lg text-center">
              <h3 className="text-xl font-semibold mb-4">Income & Expense Tracker</h3>
              <p className="text-secondary mb-6">
                Track your finances effortlessly and keep your data safe in your Google Drive.
              </p>
              <a href="#income-expense" className="text-highlightColor font-semibold">Learn More</a>
            </div>
            <div className="p-6 bg-gray-100 rounded-lg shadow-lg text-center">
              <h3 className="text-xl font-semibold mb-4">Finance Tracker Manager</h3>
              <p className="text-secondary mb-6">
                Create and organize your balance sheets with ease, featuring multi-page support and CSV export.
              </p>
              <a href="#finance-tracker" className="text-highlightColor font-semibold">Learn More</a>
            </div>
            <div className="p-6 bg-gray-100 rounded-lg shadow-lg text-center">
              <h3 className="text-xl font-semibold mb-4">Single-Purpose Utilities</h3>
              <p className="text-secondary mb-6">
                Each tool is designed to solve a specific need—keeping your tasks focused and organized.
              </p>
              <a href="#utilities" className="text-highlightColor font-semibold">Learn More</a>
            </div>
          </div>
        </section> */}

        {/* About section */}
        <section id="about" className="mb-20 px-4">
          <h2 className="text-3xl font-bold text-center mb-10">About AppSuite</h2>
          <div className="max-w-3xl mx-auto text-center text-secondary">
            <p className="mb-6">
              AppSuite is built with simplicity and privacy in mind. Each app in our suite serves a distinct purpose, and all data is securely stored in your Google Drive, putting you in control of your information.
            </p>
            <p className="mb-6">
              Our goal is to offer straightforward tools that solve specific problems efficiently, whether it’s managing finances or organizing data across various fields.
            </p>
          </div>
        </section>

        {/* Contact / Call-to-Action */}
        <section id="contact" className="text-center px-4 py-10 bg-zinc-100 shadow-inner">
          <h3 className="text-2xl font-semibold mb-4">Get in Touch</h3>
          <p className="text-secondary mb-6">
            Have questions? Reach out to our team to learn more about AppSuite and how it can help you manage your tasks efficiently.
          </p>
          <a href="mailto:onyeukwuhycient@gmail.com" className="text-highlightColor font-semibold underline">
            onyeukwuhycient@gmail.com
          </a>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-zinc-200 py-6">
        <div className="container mx-auto px-8 flex flex-wrap gap-6 max-md:justify-center justify-between items-center">
          <div className="text-secondary">
            © {new Date().getFullYear()} AppSuite. All rights reserved.
          </div>
          <nav className="flex space-x-6 text-secondary">
            <a href="/terms-of-service" className="hover:text-highlightColor">Terms of Service</a>
            <a href="/privacy-policy" className="hover:text-highlightColor">Privacy Policy</a>
            <a href="#contact" className="hover:text-highlightColor">Contact Us</a>
          </nav>
        </div>
      </footer>
      <MobileNav isMobileNavOpen={isMobileNavOpen} setIsMobileNavOpen={setIsMobileNavOpen} />
    </div>
  );
}

export default App;


interface IProps {
  isMobileNavOpen: boolean
  setIsMobileNavOpen: React.Dispatch<React.SetStateAction<boolean>>
}

function MobileNav({ isMobileNavOpen, setIsMobileNavOpen }: IProps){
  return (
    <section className={`fixed animate-screen-slide-in-right [animation-duration:500ms] lg:hidden flex flex-col scroll w-full left-0 top-0 bg-primary min-h-screen bg-white text-slate-800 backdrop-blur-[7px] !z-[10] ${!isMobileNavOpen && "!hidden"}`}>
      <div className="flex shadow py-4 px-5 flex-row items-center gap-4 justify-between bg-zinc-100">
        <Link href="/" className="logo flex flex-row gap-2 xl:gap-3 items-center">
          <LogoIcon />
          <span style={{ animationDuration: "700ms"}} className="text-slate-800  text-2xl font-medium">AppSuite</span>
        </Link>
        <button onClick={() => setIsMobileNavOpen(false)} className="">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="p-5 mt-4">
        {
          links.map((link) => (
            <div key={link.text} className=" border-b !p-0 border-b-outline py-3 cursor-pointer relative text-white text-xl font-medium flex flex-col gap-x-1">
              <div className="[&::-webkit-details-marker]:hidden flex flex-row text-2xl bg-tes items-center gap-5 justify-between">
                <Link onClick={() => setIsMobileNavOpen(false)} className="capitalize py-5 w-full text-slate-700" href={link.path as string}>{link.text}</Link>
              </div>
            </div>
          ))
        }
        <div className=" border-b !p-0 border-b-outline py-3 cursor-pointer relative text-white text-xl font-medium flex flex-col gap-x-1">
          <div className="[&::-webkit-details-marker]:hidden flex flex-row text-2xl bg-tes items-center gap-5 justify-between">
            <Link onClick={() => setIsMobileNavOpen(false)} className="capitalize py-5 w-full text-slate-700" href="/sign-in">Try Free</Link>
          </div>
        </div>
      </div>
    </section>
  )
}