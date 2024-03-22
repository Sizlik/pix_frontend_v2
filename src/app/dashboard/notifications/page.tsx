"use client";
import PixButton from "@/components/button/button";
import Navbar, { NavbarLinkEnum } from "@/components/navbar/navbar";
import {
  GetNotificationsEndpoint,
  ReadAllNotificationsEndpoint,
  ReadOneNotificationEndpoint,
  getNotificationsType,
} from "@/routes/routes";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Messages() {
  const [notifications, setNotifications] = useState<getNotificationsType[]>(
    []
  );
  const router = useRouter();

  const readOneHandle = (id: string) => {
    setNotifications((prev) => {
      const index = prev.findIndex((item) => item.id == id);
      const newArray = [...prev];
      newArray[index].is_readed = true;
      return newArray;
    });
    ReadOneNotificationEndpoint(id).then();
  };

  const readAllHandle = () => {
    ReadAllNotificationsEndpoint().then();
    setNotifications((prev) => {
      const newArray = prev.map((item) => {
        return { ...item, is_readed: true };
      });
      return newArray;
    });
  };

  useEffect(() => {
    GetNotificationsEndpoint().then((response) => {
      setNotifications(response.data);
    });
  }, []);

  return (
    <div className="lg:w-screen lg:h-screen flex lg:flex-row flex-col lg:gap-2 justify-center items-top lg:pt-24 pt-16 lg:px-4">
      <div className="lg:h-[80vh] w-screen bg-white lg:rounded-2xl lg:p-4 flex flex-col gap-2 shadow-xl p-2">
        <div className="flex justify-between">
          <h1 className="font-bold text-2xl">Оповещения</h1>
          <PixButton value="Прочитать всё" onClick={readAllHandle} />
        </div>
        <div className="bg-gray-100 h-full w-full max-h-[75vh] rounded-xl p-4 flex flex-col gap-2 overflow-y-auto shadow-xl">
          {notifications?.map((notification) => (
            <div key={notification.id}>
              {notification.type == "MESSAGE" ? (
                <div
                  className={`w-full ${notification.is_readed ? "bg-white hover:bg-gray-200" : "bg-blue-100 hover:bg-blue-300"} transition-all p-4`}
                  onMouseEnter={
                    !notification.is_readed
                      ? () => readOneHandle(notification.id)
                      : undefined
                  }
                >
                  <span className="text-sm italic">
                    {notification.time_created}
                  </span>
                  <br />
                  ЧАТ | новое сообщение |{" "}
                  <span className="italic">{notification.message}</span>
                </div>
              ) : notification.type == "ORDER_MESSAGE" ? (
                <div
                  className={`w-full ${notification.is_readed ? "bg-white hover:bg-gray-200" : "bg-blue-100 hover:bg-blue-300"} transition-all p-4 rounded-xl cursor-pointer`}
                  onMouseEnter={
                    !notification.is_readed
                      ? () => readOneHandle(notification.id)
                      : undefined
                  }
                  onClick={() =>
                    router.replace(
                      `/dashboard/orders/${notification.to_chat_room_id}`
                    )
                  }
                >
                  <span className="text-sm italic">
                    {notification.time_created}
                  </span>
                  <br />
                  ЗАКАЗ | новое сообщение |{" "}
                  <span className="italic">{notification.message}</span>
                </div>
              ) : (
                <div
                  className={`w-full ${notification.is_readed ? "bg-white hover:bg-gray-200" : "bg-blue-100 hover:bg-blue-300"} transition-all p-4 rounded-xl cursor-pointer`}
                  onMouseEnter={
                    !notification.is_readed
                      ? () => readOneHandle(notification.id)
                      : undefined
                  }
                  onClick={() =>
                    router.replace(
                      `/dashboard/orders/${notification.to_chat_room_id}`
                    )
                  }
                >
                  <span className="text-sm italic">
                    {notification.time_created}
                  </span>
                  <br />
                  ЗАКАЗ | новый статус |{" "}
                  <span className="italic">{notification.state!.name}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
