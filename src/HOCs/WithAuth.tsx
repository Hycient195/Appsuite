import { usePathname } from "next/navigation";
import { useRouter } from "next/router";
import { parseCookies } from "nookies";
import { useEffect, ComponentType, ReactElement } from "react";

interface WithAuthProps {
  [key: string]: unknown; // allow passing any props that the wrapped component may accept
}

export default function WithAuth<T extends WithAuthProps>(
  WrappedComponent: ComponentType<T>
) {
  const WithAuthComponent = (props: T): ReactElement | null => {
    const router = useRouter();
    const pathname = usePathname();
    const user = parseCookies()?.pmuser;

    useEffect(() => {
      if (!user) {
        router.push("/sign-in");
      }
    }, [router, pathname, user]);

    return user ? <WrappedComponent {...props} /> : null;
  };

  WithAuthComponent.displayName = `WithAuth(${getDisplayName(WrappedComponent)})`;
  return WithAuthComponent;
}

function getDisplayName<T>(WrappedComponent: ComponentType<T>): string {
  return WrappedComponent.displayName || WrappedComponent.name || "Component";
}