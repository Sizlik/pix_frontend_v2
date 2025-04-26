import { getCookie } from "cookies-next";
import { useEffect, useState } from "react";
import { Wallet } from "lucide-react";
import {VaultCourses} from "@/routes/routes";

export default function Balance() {
    const [user, setUser] = useState<{ balance: number }>();
    const [rates, setRates] = useState<{ usd: number; eur: number }>();

    useEffect(() => {
        const cookieUser = getCookie("user");
        if (cookieUser) {
            setUser(JSON.parse(cookieUser));
        }

        VaultCourses()
            .then((res) => res.data)
            .then((data) => {
                const usdPln = (1 / data.rates.USD) - 0.07;
                const eurPln = (1 / data.rates.EUR) * 1.01;
                setRates({ usd: usdPln, eur: eurPln });
            });
    }, []);

    if (user?.balance == null || !rates) return null;

    return (
        <div className="fixed top-4 right-4 bg-white/90 backdrop-blur-md border border-gray-200 px-5 py-3 rounded-2xl shadow-lg flex flex-col gap-1 text-sm text-gray-800 z-50 min-w-[180px]">
            <div className="flex items-center gap-2 font-semibold text-gray-900">
                <Wallet className="w-4 h-4 text-green-600" />
                Баланс: {(user.balance / 100).toFixed(2)} $
            </div>
            <div className="text-gray-600">
                USD/PLN: {rates.usd.toFixed(2)} <br />
                EUR/PLN: {rates.eur.toFixed(2)}
            </div>
        </div>
    );
}
