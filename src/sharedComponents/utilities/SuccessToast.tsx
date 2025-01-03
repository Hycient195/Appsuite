import { useRef } from "react";

type TProps = {
  // isSuccess: boolean;
  children: any
  className?: string
  scrollIntoView?: boolean;
}

export default function SuccessToast({ className, children, scrollIntoView }: TProps) {
  const containerRef = useRef<HTMLDivElement|null>(null);

  if (scrollIntoView) containerRef.current?.scrollIntoView({ behavior: "smooth" });

  return (
    <>
      {
        (
            <div ref={containerRef} className={`bg-green-100 text-green-600 py-3 px-1 text-sm rounded-md font-semibold text-center open-up ${className}`}>
              {children}
            </div>
        )
      }
    </>
  )
}
