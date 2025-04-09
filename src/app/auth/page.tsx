"use client";
import { motion } from "framer-motion";
import AuthForm from "@/components/form/authForm";
import { useRouter } from "next/navigation";
import { deleteCookie, getCookie } from "cookies-next";
import { CheckToken } from "@/routes/routes";
import { useEffect } from "react";
import Logo from "../../../public/Logo";
import Telegram from "../../../public/Telegram";
import Mail from "../../../public/Mail";

export default function Home() {
  const router = useRouter();
  const token = getCookie("token");
  useEffect(() => {
    if (token) {
      CheckToken({ token }).then((response) => {
        if (response) router.push("/dashboard/orders");
        else deleteCookie("token");
      });
    }
  });

  return (
    <div className="w-screen lg:h-screen flex flex-col lg:flex-row justify-between items-center bg-white">
      <AuthForm className="lg:w-[50vw] w-full lg:text-left text-center lg:h-full h-[90vh] flex items-center" />
      <div className="lg:w-[50vw] w-full bg-gradient-to-b from-[#0064D0] to-[#8840FF] h-full lg:rounded-s-3xl rounded-t-3xl flex flex-col items-center justify-center z-20 lg:py-0 py-16 lg:mt-0 mt-8">
        <motion.div
          animate={{
            scale: [1, 2, 2, 1, 1],
            rotate: [0, 0, 270, 270, 0],
          }}
          transition={{
            duration: 2,
            ease: "easeInOut",
            times: [0, 0.2, 0.5, 0.8, 1],
            repeat: Infinity,
            repeatDelay: 1,
          }}
        >
          <Logo />
        </motion.div>
        <div className="text-center text-white mt-8">
          <h1 className="font-bold text-6xl">PIX Logistic</h1>
          <h2 className="text-xl mt-4">Доставка товаров из европы в Россию</h2>
        </div>
        <div className="flex mt-16 gap-8 justify-center">
          <Telegram />
          <Mail />
          {/* <Whatsapp /> */}
        </div>
      </div>
    </div>
  );
}
