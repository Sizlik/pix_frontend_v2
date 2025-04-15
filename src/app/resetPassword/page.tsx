"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { PixInput, PixInputMask } from "@/components/inputs/pixInputs";
import PixButton from "@/components/button/button";
import { ForgotPassword, ResetPassword } from "@/routes/routes";

type FormInput = {
    email: string;
    code: string;
    password: string;
};

export default function ConfirmEmailPage() {
    const router = useRouter();
    const [step, setStep] = useState<1 | 2>(1);
    const [isSending, setIsSending] = useState(false);
    const [resendTimer, setResendTimer] = useState(60);
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm<FormInput>({ mode: "onChange" });

    useEffect(() => {
        if (resendTimer > 0 && step === 2) {
            const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [resendTimer, step]);

    const handleEmailSubmit: SubmitHandler<FormInput> = async (data) => {
        setMessage("");
        setIsSending(true);

        try {
            const res = await ForgotPassword(data.email);
            if (res.status === 202) {
                setEmail(data.email);
                setStep(2);
                setResendTimer(60);
            }
        } catch (err) {
            console.error(err);
        }

        setIsSending(false);
    };

    const handleResetSubmit: SubmitHandler<FormInput> = async (data) => {
        setMessage("");
        setIsSending(true);

        try {
            const res = await ResetPassword(data.code.replaceAll(" ", ""), email, data.password);
            if (res.status === 200) {
                setMessage("✅ Пароль успешно изменён");
                router.replace("/")
            }
        } catch (error) {
            console.error(error);
            setMessage("⚠️ Ошибка сервера");
        }

        setIsSending(false);
    };

    const handleResend = async () => {
        if (resendTimer > 0 || !email) return;

        try {
            const res = await ForgotPassword(email);
            if (res.status === 200) {
                setResendTimer(60);
                setMessage("📨 Код отправлен снова");
            }
        } catch {
            setMessage("⚠️ Ошибка сервера");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-sm">
                <h2 className="text-xl font-semibold mb-4 text-center">Восстановление пароля</h2>

                {step === 1 ? (
                    <form onSubmit={handleSubmit(handleEmailSubmit)} className="flex flex-col gap-4">
                        <PixInput
                            name="email"
                            register={register}
                            placeholder="Введите почту"
                            type="email"
                        />
                        <PixButton
                            type="submit"
                            className="w-full"
                            disabled={isSending}
                            value={isSending ? "Отправка..." : "Отправить код"}
                        />
                        {message && <p className="mt-4 text-center text-sm text-gray-700">{message}</p>}
                    </form>
                ) : (
                    <form onSubmit={handleSubmit(handleResetSubmit)} className="flex flex-col gap-4">
                        <div className="text-sm mb-2">
                            Код был отправлен на <span className="font-semibold">{email}</span>
                        </div>

                        <PixInputMask
                            className="text-center"
                            name="code"
                            register={register}
                            mask="9 9 9 9 9 9"
                            placeholder="Введите код"
                        />

                        <PixInput
                            name="password"
                            register={register}
                            type="password"
                            className="mt-2"
                            label="Новый пароль"
                            placeholder="***"
                        />

                        <PixButton
                            type="submit"
                            className="w-full"
                            disabled={isSending}
                            value={isSending ? "Сохранение..." : "Сохранить"}
                        />

                        <PixButton
                            onClick={handleResend}
                            disabled={resendTimer > 0}
                            className={`w-full ${
                                resendTimer > 0
                                    ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                                    : "bg-emerald-900 hover:bg-emerald-800 text-white"
                            }`}
                            value={resendTimer > 0 ? `Отправить ещё раз (${resendTimer})` : "Отправить ещё раз"}
                        />

                        <PixButton
                            onClick={() => setStep(1)}
                            variant="cancel"
                            value="Назад"
                        />

                        {message && <p className="mt-4 text-center text-sm text-gray-700">{message}</p>}
                    </form>
                )}
            </div>
        </div>
    );
}
