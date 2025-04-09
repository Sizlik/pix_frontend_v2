import { getCookie } from "cookies-next";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

export default function Balance() {
  const [user, setUser] = useState<{ balance: number }>();

  useEffect(() => {
    setUser(JSON.parse(getCookie("user")!));
  }, []);
  if (user?.balance)
    return (
      <div className="absolute bg-white px-16 py-2 font-medium rounded-b-xl self-center left-1/2 -translate-x-1/2 shadow-lg">
        Баланс: {user.balance / 100}$
      </div>
    );
  return <div></div>;
}
