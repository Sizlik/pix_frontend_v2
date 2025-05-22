"use client";
import Balance from "@/components/balance/balance";
import Navbar, {NavbarLinkEnum} from "@/components/navbar/navbar";
import SupportChat from "@/components/supportChat/supportChat";
import {usePathname, useSelectedLayoutSegment} from "next/navigation";

export default function DashboardLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
    const segment = useSelectedLayoutSegment();
    const pathname = usePathname();

    if (pathname.startsWith("/dashboard/orders/") && pathname.split("/").length == 4) {return (
          <section className="w-screen overflow-x-hidden">
            <Balance />
              <div className="flex w-full">
                  <div className="fixed h-screen z-10 w-[288px]">
                    <Navbar selectedItem={NavbarLinkEnum.orders} />
                  </div>
                  <div className="flex-1 ml-[288px]">
                      {children}
                  </div>
              </div>
          </section>
        );
      }

      if (
        segment == NavbarLinkEnum.main ||
        segment == NavbarLinkEnum.orders ||
        segment == NavbarLinkEnum.transactions ||
        segment == NavbarLinkEnum.neworder ||
        segment == NavbarLinkEnum.organization ||
        segment == NavbarLinkEnum.statistics ||
        segment == NavbarLinkEnum.settings ||
        segment == NavbarLinkEnum.logout ||
        segment == NavbarLinkEnum.messages
      ) {
        return (
            <section className="w-screen overflow-x-hidden">
                {/*<Navbar selectedItem={segment}/>*/}
                <Balance/>
                <SupportChat/>
                <div className="flex w-full">
                    <div className="fixed h-screen z-10 w-[288px]">
                        <Navbar selectedItem={segment}/>
                    </div>
                    <div className="flex-1 ml-[288px]">
                        {children}
                    </div>
                </div>
                {/*{children}*/}
            </section>
        );
      }

    return (
        <section>
            {/*<Navbar/>*/}
            <Balance/>
            <SupportChat/>
            <div className="flex">
                <div className="fixed h-screen z-10 w-[288px]">
                    <Navbar />
                </div>
                <div className="flex-1 ml-[288px]">
                    {children}
                </div>
            </div>
        </section>
    );
}
