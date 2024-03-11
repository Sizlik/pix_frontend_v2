import axios from "axios";
import { getCookie, setCookie } from "cookies-next";
import toast from "react-hot-toast";

const BACKEND_URL = "https://pixlogistic.com/api_v1";
// const BACKEND_URL = "http://localhost:8000/api_v1";

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

type OrderPositionRowAssortment = {
  name: string;
  description?: string;
};

type OrderPositionRow = {
  assortment: OrderPositionRowAssortment;
  id: string;
  quantity: number;
  shipped: number;
  price: number;
};

type GetOrderType = {
  positions: { rows: OrderPositionRow[] };
  state: { name: string };
  name: string;
  purchaseOrders?: any[];
  invoicesOut?: any[];
};

type TransactionRow = {
  created: string;
  name: string;
  sum: number;
  operations: { customerOrder: { meta: { href: string } } }[];
};

type GetTransactionsType = {
  rows: TransactionRow[];
};

type RemovePositionData = {
  order_id: string;
  position_id: string;
};

type PutPositionCountData = {
  order_id: string;
  position_id: string;
  count: any;
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

export async function GetOrder(order_id: string) {
  const promise = axios.get<GetOrderType>(`${BACKEND_URL}/orders/${order_id}`, {
    headers: { Authorization: getCookie("token") },
  });

  const response = toast.promise(promise, {
    loading: "Загрузка...",
    success: "Успешно!",
    error: "Ошибка!",
  });

  return response;
}

export async function GetTransactions() {
  const promise = axios.get<GetTransactionsType>(`${BACKEND_URL}/payment`, {
    headers: { Authorization: getCookie("token") },
  });

  const response = toast.promise(promise, {
    loading: "Загрузка...",
    success: "Успешно!",
    error: "Ошибка!",
  });

  return response;
}

export async function LogoutEndpoint() {
  const promise = axios.post(
    `${BACKEND_URL}/users/auth/jwt/logout`,
    {},
    {
      headers: { Authorization: getCookie("token") },
    }
  );

  const response = toast.promise(promise, {
    loading: "Загрузка...",
    success: "Успешно!",
    error: "Ошибка!",
  });

  return response;
}

export async function RemovePositionEndpoint(data: RemovePositionData) {
  const promise = axios.delete(
    `${BACKEND_URL}/orders/${data.order_id}/positions/${data.position_id}`,
    {
      headers: { Authorization: getCookie("token") },
    }
  );
  const response = toast.promise(promise, {
    loading: "Загрузка...",
    success: "Успешно!",
    error: "Ошибка!",
  });

  return response;
}

export async function PutPositionCountEndpoint(data: PutPositionCountData) {
  const promise = axios.put(
    `${BACKEND_URL}/orders/${data.order_id}/positions/${data.position_id}`,
    data.count,
    { headers: { Authorization: getCookie("token") } }
  );

  const response = toast.promise(promise, {
    loading: "Загрузка...",
    success: "Успешно!",
    error: "Ошибка!",
  });

  return response;
}

export async function AcceptOrderEndpoint(order_id: string) {
  const promise = axios.put(
    `${BACKEND_URL}/orders/state/${order_id}`,
    {},
    { headers: { Authorization: getCookie("token") } }
  );

  const response = toast.promise(promise, {
    loading: "Загрузка...",
    success: "Успешно!",
    error: "Ошибка!",
  });

  return response;
}

export async function CancelOrderEndpoint(order_id: string) {
  const promise = axios.delete(`${BACKEND_URL}/orders/${order_id}`, {
    headers: { Authorization: getCookie("token") },
  });

  const response = toast.promise(promise, {
    loading: "Загрузка...",
    success: "Успешно!",
    error: "Ошибка!",
  });

  return response;
}

export async function ExportEndpoint(document_id: string, order_type: string) {
  let promise;
  if (order_type == "order") {
    promise = axios.get(`${BACKEND_URL}/orders/export/${document_id}`, {
      headers: { Authorization: getCookie("token") },
      responseType: "blob",
    });
  } else {
    promise = axios.get(`${BACKEND_URL}/orders/${order_type}/export/${document_id}`, {
      headers: { Authorization: getCookie("token") },
      responseType: "blob",
    });
  }


  const response = toast.promise(promise, {
    loading: "Загрузка...",
    success: "Успешно!",
    error: "Ошибка!",
  });

  return response;
}
