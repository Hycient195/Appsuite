import { useRef } from "react";

type TProps = {
  isSuccess: boolean;
  children: JSX.Element|React.ReactNode
  className?: string
  scrollIntoView?: boolean;
}

export default function SuccessBlock({ isSuccess, className, children, scrollIntoView }: TProps) {
  const containerRef = useRef<HTMLDivElement|null>(null);

  if (scrollIntoView) containerRef.current?.scrollIntoView({ behavior: "smooth" });

  return (
    <>
      {
        isSuccess
        // true
          && (
            <div ref={containerRef} className={`bg-green-100 text-green-600 p-3 rounded-md font-semibold text-center open-up ${className}`}>
              {children}
            </div>
        )
      }
    </>
  )
}