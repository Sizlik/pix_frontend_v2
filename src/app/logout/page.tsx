"use client";
import { LogoutEndpoint } from "@/routes/routes";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Logout() {
  const router = useRouter();
  useEffect(() => {
    LogoutEndpoint().catch(() => {
      router.replace("/");
    }).then(() => {
      router.replace("/");
    });
  }, []);
  return <div></div>;
}
