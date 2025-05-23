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
  transactions = "operations",
  organization = "organization",
  settings = "settings",
  statistics = "statistics",
  logout = "logout",
  messages = "notifications",
}

type NavItemProps = {
  title: string;
  link: NavbarLinkEnum;
  selected?: boolean;
  color?: string;
  icon?: ReactElement;
  isBlocked?: boolean;
  setIsOpened: (value: boolean) => void;
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
        {
          title: "Главная",
          link: NavbarLinkEnum.main,
          icon: <Box />,
          setIsOpened: setIsOpened,
        },
        {
          title: "Оповещения",
          link: NavbarLinkEnum.messages,
          icon: <Bell />,
          setIsOpened: setIsOpened,
        },
      ],
    },
    {
      title: "Заказы",
      items: [
        {
          title: "Новый заказ",
          link: NavbarLinkEnum.neworder,
          icon: <CartPlus />,
          setIsOpened: setIsOpened,
        },
        {
          title: "Мои заказы",
          link: NavbarLinkEnum.orders,
          icon: <Basket />,
          setIsOpened: setIsOpened,
        },
        {
          title: "Финансы",
          link: NavbarLinkEnum.transactions,
          icon: <Journals />,
          setIsOpened: setIsOpened,
        },
        {
          title: "Организации",
          link: NavbarLinkEnum.organization,
          icon: <Building />,
          setIsOpened: setIsOpened,
        },
      ],
    },
    {
      title: "Профиль",
      items: [
        {
          title: "Настройки",
          link: NavbarLinkEnum.settings,
          icon: <Gear />,
          setIsOpened: setIsOpened,
        },
        {
          title: "Статистика",
          link: NavbarLinkEnum.statistics,
          icon: <GraphUp />,
          isBlocked: true,
          setIsOpened: setIsOpened,
        },
        {
          title: "Выход",
          link: NavbarLinkEnum.logout,
          color: "#F04438",
          icon: <DoorOpen />,
          setIsOpened: setIsOpened,
        },
      ],
    },
  ];
  return (
      <div
          className="bg-white rounded-r-xl h-screen shadow-lg overflow-y-auto"
      >
        <div className="lg:w-72 p-4 min-h-screen">
          <div className="sticky top-0 pt-2 pb-4 bg-white z-10">
            <div className="flex items-center">
              <Logo width={64} height={64}/>
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
      </div>
  // <AnimatePresence>
  //   {isOpened ? (
  //       <motion.div
  //           key={"opened"}
  //           initial={{x: -1100}}
  //           animate={{x: 0}}
  //           exit={{x: -1100}}
  //           transition={{duration: 0.5}}
  //           className="relative z-10 bg-white rounded-r-xl h-full"
  //       >
  //         <div className="lg:w-72 p-4 w-screen">
  //           <div className="relative flex items-center">
  //             <OpenCloseButton
  //                 onClick={() => setIsOpened(false)}
  //                 className="absolute lg:-right-10 right-0 cursor-pointer"
  //             />
  //             <div className="flex items-center">
  //               <Logo width={64} height={64}/>
  //               <h1 className="font-bold text-xl">PIX Logistic</h1>
  //             </div>
  //           </div>
  //           {sections.map((section, index) => (
  //               <div key={index} className="flex flex-col">
  //                 <p className="text-[#D3D3D3] mt-4">{section.title}</p>
  //                 <div className="flex flex-col text-[#565656] gap-1">
  //                   {section.items.map((item, index) => (
  //                       <NavItem
  //                           key={index}
  //                           {...item}
  //                           selected={item.link == selectedItem}
  //                       />
  //                   ))}
  //                 </div>
  //               </div>
  //           ))}
  //         </div>
  //       </motion.div>
  //     ) : (
  //       <motion.div
  //         key={"closed"}
  //         initial={{ x: -1100 }}
  //         animate={{ x: 0 }}
  //         transition={{ duration: 0.5 }}
  //         exit={{ x: -1100 }}
  //         className="fixed z-10"
  //       >
  //         <div className="p-4 flex items-center h-24">
  //           <OpenCloseButton
  //             onClick={() => setIsOpened(true)}
  //             className="absolute -scale-100 cursor-pointer"
  //           />
  //         </div>
  //       </motion.div>
  //     )}
  //   </AnimatePresence>
  );
}

function NavItem({
  title,
  link,
  selected = false,
  color,
  icon,
  isBlocked,
  setIsOpened,
}: NavItemProps) {
  const [hovered, setHovered] = useState<boolean>(false);
  if (isBlocked)
    return (
      <div className="relative">
        <div
          className={`${selected ? "bg-[#444CE7] text-white" : `${color && `text-[#F04438]`} bg-red-50`} rounded-md px-8 py-2 transition-all flex items-center gap-3`}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          {icon}
          {title}
        </div>
        {hovered && (
          <div className="absolute top-10 z-10 bg-slate-500 text-center rounded-xl py-4 text-white bg-opacity-80">
            Этот раздел появится в будущих обновлениях
          </div>
        )}
      </div>
    );
  return (
    <Link
      prefetch={true}
      href={`/dashboard/${link}`}
      className={`${selected ? "bg-[#444CE7] text-white" : `${color && `text-[#F04438]`} ${"hover:bg-slate-300"}`} rounded-md px-8 py-2 transition-all flex items-center gap-3`}
      onClick={() => setIsOpened(false)}
    >
      {icon}
      {title}
    </Link>
  );
}
