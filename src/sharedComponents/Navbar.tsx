import Link from "next/link";
import { useState } from "react";

const links = [
  // {
  //   text: "Solutions",
  //   path: "/",
  //   id: "what-we-are-currently-up-href"
  // },
  // {
  //   text: "Why PT-P",
  //   path: "/about-us",
  //   id: ""
  // },
  {
    text: "Pricing",
    path: "/pricing",
    id: ""
  },
  {
    text: "Resources",
    path: "/contact-us",
    id: ""
  },
]

export default function Navbar() {
  const [ isMobileNavOpen, setIsMobileNavOpen ] = useState<boolean>(false);
  return (
    <>
      <nav className="shadow sticky top-0 z-[3] bg-gradient-to-t from-sky-blue via-white to-white [&_*]:borde [&_*]:border-dashed [&_*]:border-black">
        <div className="mx-auto max-w-screen-2xl px-4 py-4 max-md:py-3.5 flex flex-row gap-2 items-center">
          <Link href="/" className="logo flex flex-row gap-2 xl:gap-3 items-center">
            <div  className="w-10 h-auto aspect-square bg-blue rounded-xl" />
            <span style={{ animationDuration: "700ms"}} className="text-slate-800  text-2xl font-medium">PT Partner</span>
          </Link>
          <div style={{ animationDuration: "1000ms"}} className="md:ml-[4%] max-md:hidden">
            { links.map(link => <Link key={link.text} className="capitalize py-3 px-4 text-slate-600 xl:px-5" href={`${link.path}${link.id?`#${link.id}`:""}`}>{link.text}</Link>)}
            {/* { links.map(link => <Link key={link.text} className="capitalize py-3 px-4 text-slate-600 xl:px-5" href={{ pathname: `${link.path}`, hash: `${link.id?`${link.id}`:""}`}} preventScrollReset >{link.text}</Link>)} */}
          </div>
          <Link href="/calculator" className="px-6 max-md:hidden ml-auto py-3 rounded-full font-medium text-white bg-blue">Try for free</Link>
          <button onClick={() => setIsMobileNavOpen(true)} className="ml-auto md:hidden ">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-9 text-slate-700">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
        </div>
      </nav>
      <MobileNav isMobileNavOpen={isMobileNavOpen} setIsMobileNavOpen={setIsMobileNavOpen} />
    </>
  )
}

interface IProps {
  isMobileNavOpen: boolean
  setIsMobileNavOpen: React.Dispatch<React.SetStateAction<boolean>>
}

function MobileNav({ isMobileNavOpen, setIsMobileNavOpen }: IProps){
  return (
    <section className={`fixed animate-screen-slide-in-right [animation-duration:500ms] lg:hidden flex flex-col scroll w-full left-0 top-0 bg-primary min-h-screen bg-white text-slate-800 backdrop-blur-[7px] !z-[10] ${!isMobileNavOpen && "!hidden"}`}>
      <div className="flex py-4 px-5 flex-row items-center gap-4 justify-between bg-pale-blue">
        <Link href="/" className="logo flex flex-row gap-2 xl:gap-3 items-center">
          <div  className="w-10 h-auto aspect-square bg-blue rounded-xl" />
          <span style={{ animationDuration: "700ms"}} className="text-slate-800  text-2xl font-medium">PT Partner</span>
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
            <Link onClick={() => setIsMobileNavOpen(false)} className="capitalize py-5 w-full text-slate-700" href="/calculator">Try Free</Link>
          </div>
        </div>
      </div>
    </section>
  )
}