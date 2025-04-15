import { SubmitHandler, useForm } from "react-hook-form";
import { PixInput, PixInputMask } from "../inputs/pixInputs";
import { CheckToken, LoginEndpoint } from "@/routes/routes";
import { useRouter } from "next/navigation";
import { setConfig } from "next/config";
import { getCookie, setCookie } from "cookies-next";

type LoginInputs = {
  email: string;
  password: string;
};

export default function LoginForm({
  className,
  setIsLogin,
}: {
  className?: string;
  setIsLogin: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInputs>({ mode: "onChange" });

  const router = useRouter();

  const onSubmit: SubmitHandler<LoginInputs> = async (data) => {
    LoginEndpoint({
      username: data.email,
      password: data.password,
    }).then((response) => {
      if (response.status == 200){
        const token = getCookie("token")
        if (token) {
          CheckToken({ token }).then((result) => {
            if (result.is_verified == false) router.push("verify")
            else router.push("/dashboard/orders");
          })

        }
      } 
    });
  };

  return (
    <div className={className}>
      <div className="lg:w-[500px] w-full mx-auto g">
        <h1 className="text-5xl font-bold mb-6">Вход</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="text-left">
          <PixInput
              options={{required: "Проверьте Вашу почту"}}
              error={Boolean(errors.email)}
              name="email"
              register={register}
              type="email"
              className="mt-4"
              label="Почта"
              placeholder="example@mail.ru"
          />
          <PixInput
              options={{required: "Проверьте Ваш пароль"}}
              error={Boolean(errors.password)}
              name="password"
              register={register}
              type="password"
              className="mt-4"
              label="Пароль"
              placeholder="***"
          />
          <input
              value={"Войти"}
              type="submit"
              className="transition-all rounded-3xl px-12 py-4 bg-[#2E90FA] text-white mt-4 hover:bg-[#4F82B9] cursor-pointer"
          />
        </form>
        <h3 className="mt-4">

        </h3>
        <h3 className="mt-4">
          Ещё нет аккаунта?{" "}
          <button
              onClick={() => setIsLogin(false)}
              className="font-bold text-[#2E90FA] hover:underline transition-all"
          >
            Создать!
          </button>
          {" "}Забыли пароль?{" "}
          <button
              onClick={() => router.push("/resetPassword")}
              className="font-bold text-[#2E90FA] hover:underline transition-all"
          >
            Восстановить
          </button>
        </h3>
      </div>
    </div>
  );
}
