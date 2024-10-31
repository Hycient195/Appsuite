import { useRouter } from "next/navigation";
import { useEffect } from "react";

const ScrollToTop = ({ children }: { children: React.ReactNode|JSX.Element }) => {
  const router = useRouter();

  useEffect(() => {
      window.scrollTo({top: 0, left: 0, behavior: 'instant' });
    }, [router]);
    return <>
      {children}
    </>
  };

export default ScrollToTop;