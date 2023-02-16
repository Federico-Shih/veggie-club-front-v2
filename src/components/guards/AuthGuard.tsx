import { ReactNode, useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "@firebase/auth";
import { useRouter } from "next/router";
import LoadingPage from "@components/containers/global/LoadingPage";

interface IProps {
  children: ReactNode;
}

export function AuthGuard({ children }: IProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, async (user) => {
      if (!user) {
        return router.push("/auth");
      }
      if (!sessionStorage.getItem("token")) {
        sessionStorage.setItem("token", await user.getIdToken());
      }
      setLoading(false);
    });
  }, [router]);
  if (loading) return <LoadingPage />;
  return <>{children}</>;
}
