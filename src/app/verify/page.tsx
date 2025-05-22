"use client"
import { useRouter } from "next/navigation";
import {useEffect, useState} from "react";
import {PixInput, PixInputMask} from "@/components/inputs/pixInputs";
import {SubmitHandler, useForm} from "react-hook-form";
import {CheckToken, RequestVerify, VerifyToken} from "@/routes/routes";
import {getCookie} from "cookies-next";
import PixButton from "@/components/button/button";

type verifyInput = {
    code: string;
}

export default function ConfirmEmailPage() {
    const router = useRouter();
    const [isSending, setIsSending] = useState(false);
    const [resendTimer, setResendTimer] = useState(60);
    const [message, setMessage] = useState("");
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<verifyInput>({ mode: "onChange" });
    const [user, setUser] = useState<{ email: string, is_verified: boolean }>();

    useEffect(() => {
        const user = JSON.parse(getCookie("user")!)
        if (user.is_verified == true) router.push("/dashboard/orders")
        setUser(user);
    }, []);

    useEffect(() => {
        if (resendTimer > 0) {
            const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [resendTimer]);

    const onSubmit: SubmitHandler<verifyInput> = async (data) => {
        data.code = data.code.replaceAll(" ", "")
        if (data.code.length !== 6) {
            setMessage("Введите корректный код");
            return;
        }

        setIsSending(true);
        setMessage("");

        try {
            if (!user?.email) return
            const res = await VerifyToken(data.code, user.email)
            if (res.status == 200) {
                const token = getCookie("token")
                if (token) {
                    CheckToken({token}).then((res) => {
                        router.push("/dashboard/orders")
                    })
                }
            } else {
                setMessage("❌ Неверный код");
            }
        } catch (error) {
            console.error(error);
            setMessage("⚠️ Произошла Ошибка");
        }

        setIsSending(false);
    };

    const handleResend = async () => {
        if (resendTimer > 0) return;

        setMessage("Отправка нового кода...");
        try {
            if (!user?.email) return
            const res = await RequestVerify(user.email);
            if (res.status == 200 || res.status == 202) {
                setResendTimer(60);
                setMessage("📨 Код повторно отправлен");
            } else {
                setMessage("⚠️ Не удалось отправить код");
            }
        } catch (err) {
            setMessage("⚠️ Ошибка при повторной отправке");
        }
    };

    const handleLogout = () => {
        router.push("/dashboard/logout"); // Или на главную: "/"
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-sm">
                <h2 className="text-xl font-semibold mb-4 text-center">Проверьте почту</h2>
                <div className="my-4">На вашу почту <span className="font-bold">{user?.email}</span> был отправлен код подтверждения</div>
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                    <PixInputMask
                        className="text-center"
                        name="code"
                        register={register}
                        mask="9 9 9 9 9 9"
                        placeholder="Введите код"
                    />

                    <PixButton value="Подтвердить" type="submit" className="w-full" />

                    <PixButton
                        onClick={handleResend}
                        disabled={resendTimer > 0}
                        className={`w-full ${
                            resendTimer > 0 ? "bg-gray-300 text-gray-600 cursor-not-allowed" : "bg-emerald-900 hover:bg-emerald-800 text-white"
                        }`}
                        value={resendTimer > 0 ? `Отправить ещё раз (${resendTimer})` : "Отправить ещё раз"}
                    >

                    </PixButton>

                    <PixButton
                        onClick={handleLogout}
                        variant="cancel"
                        value="Выйти"
                    />

                    {message && <p className="mt-4 text-center text-sm text-gray-700">{message}</p>}
                </form>
            </div>
        </div>
);
}
