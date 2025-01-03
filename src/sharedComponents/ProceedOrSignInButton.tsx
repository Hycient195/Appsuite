
import { isLoggedIn } from "@/sharedConstants/common";
import Link from "next/link";
// import { useRouter } from "next/navigation";

interface IProps {
  text?: string;
  href: string
}

export default function ProceedOrSignInButton({ href, text = "Start for free"}: IProps) {
  // const router = useRouter();

  // const handleProceed = () => {
  //   if (isLoggedIn) {
  //     router.forward(href);
  //   } else {
  //     router.push("/sign-in")
  //   }
  // }

  return (
    <Link href={isLoggedIn ? href : "/sign-in"} className="self-center font-bold px-7 text-center py-6 mt-10 max-w-full text-xl tracking-tight leading-tight text-white border border-gray-800 border-solid bg-primary min-h-[68px] rounded-full shadow-[0px_5px_0px_rgba(31,41,55,1)] w-full md:w-[417px]  max-md:px-10">
     {text}
    </Link>
  )
}