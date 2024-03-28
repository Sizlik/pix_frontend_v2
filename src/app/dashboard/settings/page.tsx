"use client";
import PixButton from "@/components/button/button";
import { PixInput, PixInputMask } from "@/components/inputs/pixInputs";
import Navbar, { NavbarLinkEnum } from "@/components/navbar/navbar";
import { CheckPassword, UpdateUserEndpoint } from "@/routes/routes";
import { getCookie, setCookie } from "cookies-next";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

type SettingsInputs = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  oldPassword: string;
  password: string;
  password2: string;
};

type UserSettings = {
  first_name: string;
  last_name: string;
  phone_number: string;
  email: string;
};

export default function Settings() {
  const [user, setUser] = useState<UserSettings>();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<SettingsInputs>({ mode: "onChange" });
  const [changePassword, setChangePassword] = useState(false);

  const onSubmit: SubmitHandler<SettingsInputs> = async (data) => {
    if (!data.password && !data.oldPassword && !data.password2) {
      UpdateUserEndpoint({
        first_name: data.firstName,
        last_name: data.lastName,
        phone_number: data.phone,
        email: data.email,
      }).then((response) => {
        setCookie("user", JSON.stringify(response.data));
      });
    } else {
      CheckPassword({
        username: user!.email,
        password: data.oldPassword,
      }).then((response) => {
        if (response.status == 200) {
          UpdateUserEndpoint({
            first_name: data.firstName,
            last_name: data.lastName,
            phone_number: data.phone,
            password: data.password,
            email: data.email,
          }).then((response) => {
            setCookie("user", JSON.stringify(response.data));
          });
        }
      });
    }
  };

  useEffect(() => {
    const userData = JSON.parse(getCookie("user")!);
    setUser(userData);
    setValue("email", userData.email);
    setValue("phone", userData.phone_number);
    setValue("firstName", userData.first_name);
    setValue("lastName", userData.last_name);
  }, []);

  useEffect(() => {
    setValue("password", "");
    setValue("password2", "");
    setValue("oldPassword", "");
  }, [user]);

  return (
    <div className="lg:w-screen lg:h-screen flex lg:flex-row flex-col lg:gap-2 justify-center items-top lg:pt-24 pt-16 lg:px-4">
      <div className="lg:h-[80vh] w-screen bg-white lg:rounded-2xl lg:p-4 flex flex-col gap-2 shadow-xl p-2 overflow-y-auto">
        <h1 className="font-bold text-2xl w-full text-end">Настройки</h1>
        <form
          className="w-full h-full flex flex-col"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="flex lg:justify-between lg:flex-row flex-col lg:gap-12">
            <PixInput
              options={{
                required: "Проверьте Ваше имя",
                value: user?.first_name,
              }}
              error={Boolean(errors.firstName)}
              name="firstName"
              register={register}
              className="w-full"
              label="Имя"
              placeholder="Иван"
            />
            <PixInput
              options={{
                required: "Проверьте Вашу фамилию",
                value: user?.last_name,
              }}
              error={Boolean(errors.lastName)}
              name="lastName"
              register={register}
              className="w-full lg:mt-0 mt-4"
              label="Фамилия"
              placeholder="Иванов"
            />
          </div>
          <PixInput
            options={{ required: "Проверьте Вашу почту", value: user?.email }}
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
              value: user?.phone_number,
            }}
            error={Boolean(errors.phone)}
            name="phone"
            register={register}
            className="mt-4"
            label="Телефон"
            placeholder="+7 (999) 999-99-99"
            mask="+7 (999) 999-99-99"
          ></PixInputMask>
          {changePassword ? (
            <>
              <hr className="mt-4" />
              <PixInput
                options={{ required: true }}
                error={Boolean(errors.password2)}
                name="oldPassword"
                register={register}
                type="password"
                className="mt-4"
                label="Текущий пароль"
                placeholder="***"
              />
              <PixInput
                options={{ required: true }}
                error={Boolean(errors.password)}
                name="password"
                register={register}
                type="password"
                className="mt-4"
                label="Новый пароль"
                placeholder="***"
              />
              <PixInput
                options={{
                  validate: (value, { password }) => password == value,
                  required: true,
                }}
                error={Boolean(errors.password2)}
                name="password2"
                register={register}
                type="password"
                className="mt-4"
                label="Повтор нового пароля"
                placeholder="***"
              />
              <PixButton
                value="Отмена"
                variant="cancel"
                onClick={() => setChangePassword(false)}
                className="mt-4 rounded-3xl"
              />
            </>
          ) : (
            <PixButton
              value="Сменить пароль"
              variant="cancel"
              onClick={() => setChangePassword(true)}
              className="mt-4 rounded-3xl"
            />
          )}
          <input
            value={"Сохранить"}
            type="submit"
            className="transition-all rounded-3xl px-12 py-4 bg-[#2E90FA] text-white mt-4 hover:bg-[#4F82B9] cursor-pointer"
          />
        </form>
      </div>
    </div>
  );
}
