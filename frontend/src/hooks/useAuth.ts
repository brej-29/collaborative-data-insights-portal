import { useEffect, useState } from "react";

export default function useAuth() {
  const [user, setUser] = useState<{ username: string } | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch("http://localhost:8080/api/user/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setUser(data))
      .catch(() => {
        localStorage.removeItem("token");
      });
  }, []);

  return {
    user,
    logout: () => {
      localStorage.removeItem("token");
      window.location.href = "/login";
    },
  };
}