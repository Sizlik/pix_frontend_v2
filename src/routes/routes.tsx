import axios from "axios";
import { getCookie, setCookie } from "cookies-next";
import toast from "react-hot-toast";

const BACKEND_URL = "http://localhost:8000/api_v1";

type LoginData = {
  username: string;
  password: string;
};

type RegisterData = {
  first_name: string;
  last_name: string;
  phone_number: string;
  email: string;
  password: string;
  is_active: boolean;
  is_superuser: boolean;
  is_verified: boolean;
};

type TokenData = {
  token: string;
};

type OrderData = {
  link: string;
  count: number;
  comment: string;
};

type State = {
  name: string;
};

type Positions = {
  meta: { size: number };
};

type GetOrdersType = {
  id: string;
  name: string;
  state: State;
  positions: Positions;
  sum: number;
  payedSum: number;
  shippedSum: number;
  created: string;
  updated: string;
};

export function LoginEndpoint(data: LoginData) {
  const promise = axios.post(`${BACKEND_URL}/users/auth/jwt/login`, data, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });

  const response = toast.promise(promise, {
    loading: "Проверяем...",
    success: (response) => {
      setCookie("token", `Bearer ${response.data.access_token}`);
      return "Успешно!";
    },
    error: "Не правильный логин или пароль!",
  });

  return response;
}

export function RegisterEndpoint(data: RegisterData) {
  const promise = axios.post(`${BACKEND_URL}/users/auth/register`, data);

  const response = toast.promise(promise, {
    loading: "Отправляем...",
    success: "Успешно!",
    error: "Ошибка!",
  });

  return response;
}

export async function CheckToken(data: TokenData) {
  const fetchOptions = {
    method: "GET",
    headers: {
      Authorization: data.token,
      "Content-Type": "application/json", // Adjust content type if needed
    },
  };
  const response = fetch(`${BACKEND_URL}/users/updatedMe`, fetchOptions)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      return data;
      // Do something with the data
    })
    .catch((error) => {
      return;
    });
  return response;
}

export async function CreateOrder(data: OrderData[]) {
  const promise = axios.post(
    `${BACKEND_URL}/orders`,
    { order_items: data },
    { headers: { Authorization: getCookie("token") } }
  );

  const response = toast.promise(promise, {
    loading: "Создаём...",
    success: "Успешно!",
    error: "Ошибка!",
  });

  return response;
}

export async function GetOrders() {
  const promise = axios.get<GetOrdersType[]>(`${BACKEND_URL}/orders`, {
    headers: { Authorization: getCookie("token") },
  });

  const response = toast.promise(promise, {
    loading: "Загрузка...",
    success: "Успешно!",
    error: "Ошибка!",
  });

  return response;
}
