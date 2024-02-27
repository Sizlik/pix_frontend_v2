import { useEffect, useState } from "react";
import LoginForm from "./login";
import RegisterForm from "./register";
import { motion, AnimatePresence } from "framer-motion";
export default function AuthForm({ className }: { className?: string }) {
  const [isLogin, setIsLogin] = useState<boolean>(true);
  return isLogin ? (
    <motion.div
      key={"login"}
      initial={{ x: -1000 }}
      animate={{ x: 0 }}
      transition={{ duration: 1, type: "spring" }}
    >
      <LoginForm setIsLogin={setIsLogin} className={className} />
    </motion.div>
  ) : (
    <motion.div
      key={"reigster"}
      initial={{ x: -1000 }}
      animate={{ x: 0 }}
      transition={{ duration: 1, type: "spring" }}
    >
      <RegisterForm className={className} setIsLogin={setIsLogin} />
    </motion.div>
  );
}
