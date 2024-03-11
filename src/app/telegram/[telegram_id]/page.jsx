"use client";
import { Envelope } from "react-bootstrap-icons";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { getCookie } from "cookies-next";
import { PasswordIcon, PixInput, PixSumbitInput } from "../../../components/old/inputs";
import { LoginEndpoint } from "@/routes/routes";



export default function TelegramLogin({ params }) {
  const [eye, setEye] = useState(false);
  const [loader, setLoader] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const BACKEND_URL = "https://pixlogistic.com/api_v1";
  // const BACKEND_URL = "http://localhost:8000/api_v1";

  const onSumbit = async (event) => {
    event.preventDefault();
    const email = event.target[0].value;
    const password = event.target[1].value;
    setLoader(true);
    const promise = LoginEndpoint({ password: password, username: email });
    const response = await toast
      .promise(promise, {
        loading: "Подтверждаем...",
        success: () => {
          return "Успешно! Можете закрыть окно.";
        },
        error: () => {
          return "Не правильный логин или пароль!";
        },
      })
      .catch((error) => error.response);
    setLoader(false);

    if (response.status == 200) {
      await axios.put(
        `${BACKEND_URL}/users/telegram/${params.telegram_id}`,
        {},
        { headers: { Authorization: getCookie("token") } }
      );
      setIsSuccess(true);
    }
  };

  return (
    <div className="flex flex-col items-center h-screen justify-center">
      {!isSuccess ? (
        <form onSubmit={onSumbit} className="h-full">
          <div className="flex flex-col h-full justify-center">
            <div className="text-5xl font-bold text-center">PIX | БОТ</div>
            <PixInput
              className="mt-16"
              id="email"
              type="email"
              placeholder="example@gmail.com"
              text="Введите почту:"
              icon={<Envelope />}
            />
            <PixInput
              className="mt-4 cursor-pointer"
              id="password"
              type={eye ? "text" : "password"}
              placeholder="Пароль..."
              text="Введите пароль:"
              icon={<PasswordIcon eye={eye} setEye={setEye} />}
            />
            <PixSumbitInput
              className="pt-4"
              value="Подтвердить"
              disabled={loader}
            />
          </div>
        </form>
      ) : (
        <div>Отлично! Теперь вы можете закрыть это окно!</div>
      )}
    </div>
  );
}