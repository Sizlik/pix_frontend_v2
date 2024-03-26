"use client";
import PixButton from "@/components/button/button";
import TabButton from "@/components/button/tabButton";
import RegisterForm from "@/components/form/register";
import {
  PixInput,
  PixInputMask,
  PixSearch,
} from "@/components/inputs/pixInputs";
import Navbar, { NavbarLinkEnum } from "@/components/navbar/navbar";
import {
  CreateOrganizationEndpoint,
  GetOrganizationOrders,
  GetOrganizationUserType,
  GetOrganizationUsers,
  RegisterOrganizationUserEndpoint,
} from "@/routes/routes";
import { ColDef } from "ag-grid-community";
import { AgGridReact, CustomCellRendererProps } from "ag-grid-react";
import { getCookie } from "cookies-next";
import Link from "next/link";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { Search } from "react-bootstrap-icons";
import { SubmitHandler, useForm } from "react-hook-form";

interface OrdersGrid {
  id: string;
  user: string;
  name: string;
  state: string;
  count: number;
  created_at: string;
  updated_at: string;
  sum: number;
  payed_sum: number;
  delivered_sum: number;
}

type RegisterInputs = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  password2: string;
};

export default function Organization() {
  const [user, setUser] = useState<{
    is_organization_user: boolean;
    organization_id?: string;
  }>();
  const [users, setUsers] = useState<GetOrganizationUserType[]>([]);
  const tabButtons: Array<string> = [
    "Все",
    "В обработке",
    "Ждут подтверждения",
    "Закрыты",
  ];
  const [search, setSearch] = useState<string>("");
  const ref = useRef<AgGridReact<OrdersGrid>>(null);
  const [tabButton, setTabButton] = useState<string>(tabButtons[0]);
  const [gridColumnState, setGridColumnState] = useState<string>("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInputs>({ mode: "onChange" });

  const onSubmit: SubmitHandler<RegisterInputs> = async (data) => {
    RegisterOrganizationUserEndpoint({
      first_name: data.firstName,
      last_name: data.lastName,
      email: data.email,
      phone_number: data.phone,
      password: data.password,
      is_active: true,
      is_superuser: false,
      is_verified: false,
    }).then((response) => {
      GetOrganizationUsers(user!.organization_id!).then((response) => {
        setUsers(response.data);
      });
    });
  };
  const [colDefs, setColDefs] = useState<ColDef<OrdersGrid>[]>([
    {
      field: "name",
      resizable: false,
      minWidth: 80,
      headerName: "№",
      width: 80,
      cellRenderer: OrderLink,
    },
    {
      field: "state",
      resizable: false,
      minWidth: 250,
      headerName: "Статус",
      filter: true,
      filterParams: {
        readOnly: true,
        maxNumConditions: 20,
      },
    },
    {
      field: "user",
      resizable: false,
      minWidth: 250,
      headerName: "Пользователь",
      filter: true,
      filterParams: {
        readOnly: true,
        maxNumConditions: 20,
      },
    },
    {
      field: "count",
      resizable: false,
      minWidth: 110,
      width: 110,
      headerName: "Количество",
    },
    {
      field: "sum",
      resizable: false,
      minWidth: 120,
      width: 120,
      headerName: "Сумма",
    },
    {
      field: "payed_sum",
      resizable: false,
      minWidth: 120,
      width: 120,
      headerName: "Оплачено",
    },
    {
      field: "delivered_sum",
      resizable: false,
      minWidth: 120,
      width: 120,
      headerName: "Отправлено",
    },
    {
      field: "created_at",
      resizable: false,
      minWidth: 120,
      width: 120,
      headerName: "Создан",
    },
    {
      field: "updated_at",
      resizable: false,
      minWidth: 120,
      width: 120,
      headerName: "Обновлён",
    },
  ]);

  const [rowData, setRowData] = useState<OrdersGrid[]>([]);

  useEffect(() => {
    GetOrganizationOrders().then((response) => {
      const orders = new Array();
      response.data.forEach((itemMain) =>
        itemMain.orders?.forEach((item) =>
          orders.push({ ...item, user: itemMain.user.email })
        )
      );
      setRowData(
        orders.map((item) => {
          return {
            id: item.id,
            count: item.positions.meta.size,
            created_at: item.created.split(" ")[0],
            updated_at: item.updated.split(" ")[0],
            delivered_sum: item.shippedSum / 100,
            name: item.name,
            payed_sum: item.payedSum / 100,
            state: item.state.name,
            sum: item.sum / 100,
            user: item.user,
          };
        })
      );
    });
    const userData = JSON.parse(getCookie("user")!);
    setUser(userData);
    GetOrganizationUsers(userData.organization_id).then((response) => {
      setUsers(response.data);
    });
  }, []);

  const onClickTabButton = (title: string) => {
    switch (title) {
      case "Все":
        ref.current!.api.setColumnFilterModel("state", null).then(() => {
          ref.current!.api.onFilterChanged();
        });
        break;
      case "В обработке":
        ref
          .current!.api.setColumnFilterModel("state", {
            filterType: "text",
            conditions: [
              {
                type: "equals",
                filter: "Новый",
              },
              {
                type: "equals",
                filter: "Собран",
              },
              {
                type: "equals",
                filter: "Отгружен",
              },
              {
                type: "equals",
                filter: "Подтвержден",
              },
              {
                type: "equals",
                filter: "Подтвержден клиентом",
              },
              {
                type: "equals",
                filter: "Подтвержден менеджером",
              },
              {
                type: "equals",
                filter: "Заказ доставляется",
              },
              {
                type: "equals",
                filter: "Выдан частично",
              },
              {
                type: "equals",
                filter: "Ожидание документов от продавца",
              },
              {
                type: "equals",
                filter: "Готов к выдаче",
              },
              {
                type: "equals",
                filter: "Обмен",
              },
              {
                type: "equals",
                filter: "Доставляется в РБ",
              },
              {
                type: "equals",
                filter: "В ожидании перевозчика",
              },
              {
                type: "equals",
                filter: "Заказ принят",
              },
              {
                type: "equals",
                filter: "Ожидание предоплаты",
              },
              {
                type: "equals",
                filter: "Принят к исполнению",
              },
              {
                type: "equals",
                filter: "Выслан продавцу",
              },
              {
                type: "equals",
                filter: "Возврат",
              },
              {
                type: "equals",
                filter: "Ожидание денег",
              },
              {
                type: "equals",
                filter: "Возвращен продавцу",
              },
            ],
            operator: "OR",
          })
          .then(() => {
            ref.current!.api.onFilterChanged();
          });
        break;
      case "Ждут подтверждения":
        ref
          .current!.api.setColumnFilterModel("state", {
            filterType: "text",
            conditions: [
              {
                type: "equals",
                filter: "Ожидает подтверждения клиента",
              },
            ],
            operator: "OR",
          })
          .then(() => {
            ref.current!.api.onFilterChanged();
          });
        break;
      case "Закрыты":
        ref.current!.api.setColumnFilterModel("state", {
          values: ["Возврат", "Доставлен", "Отменен"],
        });
        ref
          .current!.api.setColumnFilterModel("state", {
            filterType: "text",
            conditions: [
              {
                type: "equals",
                filter: "Возврат",
              },
              {
                type: "equals",
                filter: "Доставлен",
              },
              {
                type: "equals",
                filter: "Отменен",
              },
            ],
            operator: "OR",
          })
          .then(() => {
            ref.current!.api.onFilterChanged();
          });
        break;
    }
  };

  const onChangeSearch = (event: ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  const handleCreateOrganization = () => {
    CreateOrganizationEndpoint().then((response) => {
      setUser((prev) => {
        return { ...prev!, organization_id: response.data };
      });
    });
  };
  if (user?.organization_id)
    return (
      <div className="lg:w-screen lg:h-screen flex lg:flex-row flex-col lg:gap-2 items-top lg:pt-24 pt-16 lg:px-4">
        <div className="lg:h-[80vh] w-full bg-white lg:rounded-2xl lg:p-4 flex flex-col gap-2 shadow-xl p-2">
          <div className="flex lg:flex-row flex-col-reverse justify-between items-center lg:gap-0 gap-2">
            <PixSearch
              icon={<Search />}
              inputClassName="w-[300px]"
              className=""
              placeholder="Поиск по заказам"
              onChange={onChangeSearch}
            />
            <h1 className="font-bold text-2xl text-right">
              Заказы организации
            </h1>
          </div>
          <TabButton
            className="lg:text-base text-xs mx-auto"
            titles={tabButtons}
            state={tabButton}
            setState={setTabButton}
            onClick={onClickTabButton}
          />
          <div className={`w-full lg:h-full h-[260px] ag-theme-quartz`}>
            <AgGridReact
              ref={ref}
              autoSizeStrategy={{ type: "fitGridWidth" }}
              suppressMovableColumns={true}
              className="w-full h-full"
              columnDefs={colDefs}
              rowData={rowData}
              quickFilterText={search}
            />
          </div>
        </div>
        <div className="flex flex-col justify-between h-[80vh] gap-2 w-full">
          <div className="h-1/2 w-full bg-white lg:rounded-2xl lg:p-4 flex flex-col gap-2 shadow-xl p-2">
            <h1 className="font-bold text-2xl text-right">Пользователи</h1>
            <div className="h-full flex flex-col overflow-auto gap-2">
              {users.map((item, index) => {
                return (
                  <div
                    key={index}
                    className="bg-gray-100 p-2 rounded-xl flex justify-between"
                  >
                    <div className="w-1/3 text-left">
                      {item.first_name} {item.last_name}
                    </div>
                    <div className="w-1/3 text-center">{item.email}</div>
                    <div className="w-1/3 text-right">{item.balance / 100}</div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="h-1/2 w-full bg-white lg:rounded-2xl lg:p-4 flex flex-col gap-2 shadow-xl p-2">
            <h1 className="font-bold text-2xl text-right">
              Новый пользователь организации
            </h1>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="text-left overflow-auto"
            >
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
                value={"Создать"}
                type="submit"
                className="transition-all rounded-3xl px-12 py-4 bg-[#2E90FA] text-white mt-4 hover:bg-[#4F82B9] cursor-pointer"
              />
            </form>
          </div>
        </div>
      </div>
    );
  return (
    <div className="lg:w-screen lg:h-screen flex lg:flex-row flex-col lg:gap-2 justify-center items-top lg:pt-24 pt-16 lg:px-4">
      <div className="lg:h-[80vh] w-screen justify-center items-center bg-white lg:rounded-2xl lg:p-4 flex flex-col gap-2 shadow-xl p-2">
        <div>У вас нет организации</div>
        <PixButton
          value="Создать организацию"
          onClick={handleCreateOrganization}
        />
      </div>
    </div>
  );
}

function OrderLink(props: CustomCellRendererProps<OrdersGrid>) {
  console.log(props);
  return (
    <Link
      className="text-[#2E90FA] hover:underline transition-all"
      href={`/dashboard/orders/${props.data!.id}`}
    >
      #{props.value}
    </Link>
  );
}
