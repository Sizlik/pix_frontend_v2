import Link from "next/link";
import Logo from "../../../public/Logo";
import OpenCloseButton from "../../../public/OpenCloseButton";
import { ReactElement, useState } from "react";
import { AnimatePresence, delay, motion } from "framer-motion";
import {
  Basket,
  Bell,
  Box,
  Building,
  CartPlus,
  ClipboardData,
  DoorOpen,
  Gear,
  GraphUp,
  Journals,
} from "react-bootstrap-icons";

export enum NavbarLinkEnum {
  main = "",
  neworder = "neworder",
  orders = "orders",
  transactions = "transactions",
  organizations = "organizations",
  settings = "settings",
  statistics = "statistics",
  logout = "logout",
  messages = "messages",
}

type NavItemProps = {
  title: string;
  link: NavbarLinkEnum;
  selected?: boolean;
  color?: string;
  icon?: ReactElement;
};

type NavbarSection = {
  title: string;
  items: NavItemProps[];
};

export default function Navbar({
  selectedItem = NavbarLinkEnum.main,
}: {
  selectedItem?: NavbarLinkEnum;
}) {
  const [isOpened, setIsOpened] = useState<boolean>(false);
  const sections: NavbarSection[] = [
    {
      title: "Главная",
      items: [
        { title: "Главная", link: NavbarLinkEnum.main, icon: <Box /> },
        { title: "Сообщения", link: NavbarLinkEnum.messages, icon: <Bell /> },
      ],
    },
    {
      title: "Заказы",
      items: [
        {
          title: "Новый заказ",
          link: NavbarLinkEnum.neworder,
          icon: <CartPlus />,
        },
        { title: "Мои заказы", link: NavbarLinkEnum.orders, icon: <Basket /> },
        {
          title: "Транзакции",
          link: NavbarLinkEnum.transactions,
          icon: <Journals />,
        },
        {
          title: "Организации",
          link: NavbarLinkEnum.organizations,
          icon: <Building />,
        },
      ],
    },
    {
      title: "Профиль",
      items: [
        { title: "Настройки", link: NavbarLinkEnum.settings, icon: <Gear /> },
        {
          title: "Статистика",
          link: NavbarLinkEnum.statistics,
          icon: <GraphUp />,
        },
        {
          title: "Выход",
          link: NavbarLinkEnum.logout,
          color: "#F04438",
          icon: <DoorOpen />,
        },
      ],
    },
  ];
  return (
    <AnimatePresence>
      {isOpened ? (
        <motion.div
          key={"opened"}
          initial={{ x: -1100 }}
          animate={{ x: 0 }}
          exit={{ x: -1100 }}
          transition={{ duration: 0.5 }}
          className="fixed z-10 bg-white rounded-r-xl h-full"
        >
          <div className="lg:w-72 p-4 w-screen">
            <div className="relative flex items-center">
              <OpenCloseButton
                onClick={() => setIsOpened(false)}
                className="absolute lg:-right-10 right-0 cursor-pointer"
              />
              <div className="flex items-center">
                <Logo width={64} height={64} />
                <h1 className="font-bold text-xl">PIX Logistic</h1>
              </div>
            </div>
            {sections.map((section, index) => (
              <div key={index} className="flex flex-col">
                <p className="text-[#D3D3D3] mt-4">{section.title}</p>
                <div className="flex flex-col text-[#565656] gap-1">
                  {section.items.map((item, index) => (
                    <NavItem
                      key={index}
                      {...item}
                      selected={item.link == selectedItem}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      ) : (
        <motion.div
          key={"closed"}
          initial={{ x: -1100 }}
          animate={{ x: 0 }}
          transition={{ duration: 0.5 }}
          exit={{ x: -1100 }}
          className="fixed z-10"
        >
          <div className="p-4 flex items-center h-24">
            <OpenCloseButton
              onClick={() => setIsOpened(true)}
              className="absolute -scale-100 cursor-pointer"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function NavItem({ title, link, selected = false, color, icon }: NavItemProps) {
  return (
    <Link
      href={`/dashboard/${link}`}
      className={`${selected ? "bg-[#444CE7] text-white" : `${color && `text-[#F04438]`} ${"hover:bg-slate-300"}`} rounded-md px-8 py-2 transition-all flex items-center gap-3`}
    >
      {icon}
      {title}
    </Link>
  );
}
