import { LogoIcon } from "@/sharedComponents/CustomIcons";

export default function Loading() {
  return (
    <main className="bg-white fixed flex h-[100dvh] z-[5] top-0 left-0 w-full p-5 items-center justify-center">
      <div className="w-max z-[-2] h-auto aspect-square relative flex items-center justify-center p-10">
        <div className="absolute p-10 z-[-1] flex animate-spin [animation-duration:500ms] bg-primary-red h-full w-full aspect-square rounded-full after:w-[98%] after:h-[98%] after:bg-white after:absolute after:my-auto after:mx-auto after:rounded-full after:top-0 after:bottom-0 after:left-0 after:right-0" style={{ background: "conic-gradient(#EDF6F9 0.55% 50.08%, #002037 60.08% 200.68%)"}} />
        <div className="w-max h-auto aspect-square">
          <LogoIcon className="!size-16 lg:!size-20" />
        </div>
      </div>
    </main>
  )
}