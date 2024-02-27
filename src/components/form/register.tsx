import { SubmitHandler, useForm } from "react-hook-form";
import { PixInput, PixInputMask } from "../inputs/pixInputs";
import { RegisterEndpoint } from "@/routes/routes";

type RegisterInputs = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  password2: string;
};

export default function RegisterForm({
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
  } = useForm<RegisterInputs>({ mode: "onChange" });

  const onSubmit: SubmitHandler<RegisterInputs> = async (data) => {
    RegisterEndpoint({
      first_name: data.firstName,
      last_name: data.lastName,
      email: data.email,
      phone_number: data.phone,
      password: data.password,
      is_active: true,
      is_superuser: false,
      is_verified: false,
    }).then((response) => {
      if (response.status == 201) {
        setIsLogin(true);
      }
    });
  };

  return (
    <div className={className}>
      <div className="lg:w-[500px] w-full mx-auto">
        <h1 className="text-5xl font-bold mb-6">Регистрация</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="text-left">
          <div className="flex lg:justify-between lg:flex-row flex-col lg:gap-12">
            <PixInput
              options={{ required: "Проверьте Ваше имя" }}
              error={Boolean(errors.firstName)}
              name="firstName"
              register={register}
              className="w-full"
              label="Имя"
              placeholder="Иван"
            />
            <PixInput
              options={{ required: "Проверьте Вашу фамилию" }}
              error={Boolean(errors.lastName)}
              name="lastName"
              register={register}
              className="w-full lg:mt-0 mt-4"
              label="Фамилия"
              placeholder="Иванов"
            />
          </div>
          <PixInput
            options={{ required: "Проверьте Вашу почту" }}
            error={Boolean(errors.email)}
            name="email"
            register={register}
            type="email"
            className="mt-4"
            label="Почта"
            placeholder="example@mail.ru"
          />
          <PixInputMask
            options={{
              required: "Проверьте Ваш номер",
              validate: (value) => !value.includes("_"),
            }}
            error={Boolean(errors.phone)}
            name="phone"
            register={register}
            className="mt-4"
            label="Телефон"
            placeholder="+7 (999) 999-99-99"
            mask="+7 (999) 999-99-99"
          ></PixInputMask>
          <PixInput
            options={{ required: "Проверьте Ваш пароль" }}
            error={Boolean(errors.password)}
            name="password"
            register={register}
            type="password"
            className="mt-4"
            label="Пароль"
            placeholder="***"
          />
          <PixInput
            options={{
              required: "Пароли не совпадают",
              validate: (value, { password }) => password == value,
            }}
            error={Boolean(errors.password2)}
            name="password2"
            register={register}
            type="password"
            className="mt-4"
            label="Повтор пароля"
            placeholder="***"
          />
          <input
            value={"Регистрация"}
            type="submit"
            className="transition-all rounded-3xl px-12 py-4 bg-[#2E90FA] text-white mt-4 hover:bg-[#4F82B9] cursor-pointer"
          />
        </form>
        <h3 className="mt-4">
          Уже есть аккаунт?{" "}
          <button
            onClick={() => setIsLogin(true)}
            className="font-bold text-[#2E90FA] hover:underline transition-all"
          >
            Войти
          </button>
        </h3>
      </div>
    </div>
  );
}
