import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export function useAuth() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = Cookies.get("cocobambu_token");
    const userCookie = Cookies.get("cocobambu_user");

    if (!token || !userCookie) {
      router.push("/");
    } else {
      try {
        setUser(JSON.parse(userCookie));
      } catch (e) {
        router.push("/");
      }
    }
    setLoading(false);
  }, [router]);

  const logout = () => {
    Cookies.remove("cocobambu_token");
    Cookies.remove("cocobambu_user");
    router.push("/");
  };

  return { user, loading, logout };
}
