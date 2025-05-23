"use client";
import { LogoutEndpoint } from "@/routes/routes";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Logout() {
  const router = useRouter();
  useEffect(() => {
    LogoutEndpoint().then(() => {
      router.replace("/");
    });
  }, []);
  return <div></div>;
}
