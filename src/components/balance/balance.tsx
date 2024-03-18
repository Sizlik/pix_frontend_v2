import { CheckToken } from "@/routes/routes"
import { getCookie } from "cookies-next"
import { redirect } from "next/navigation"
import { useEffect, useState } from "react"

export default function Balance() {
  const [user, setUser] = useState<{ balance: number }>()

  useEffect(() => {
    const token = getCookie("token")
    if (token) CheckToken({ token: token }).then((response) => {
      setUser(response)
    }).catch(() => {
      redirect("/")
    })
    else redirect("/")
  }, [])
  if (user?.balance) return <div className="absolute bg-white px-16 py-2 font-medium rounded-b-xl self-center left-1/2 -translate-x-1/2 shadow-lg">Баланс: {user.balance / 100}$</div>
  return <div></div>
}