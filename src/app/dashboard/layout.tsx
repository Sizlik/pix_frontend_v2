"use client";
import Balance from "@/components/balance/balance";
import Navbar, { NavbarLinkEnum } from "@/components/navbar/navbar";
import SupportChat from "@/components/supportChat/supportChat";
import { usePathname, useSelectedLayoutSegment } from "next/navigation";

export default function DashboardLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
    const segment = useSelectedLayoutSegment();
    const pathname = usePathname();

    if (pathname.startsWith("/dashboard/orders/") && pathname.split("/").length == 4) {return (
          <section className="overflow-clip">
            <Navbar selectedItem={NavbarLinkEnum.orders} />
            <Balance />{children}
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
          <section className="overflow-clip">
            <Navbar selectedItem={segment} />
            <Balance />
            <SupportChat />
            {children}
          </section>
        );
      }

      return (
        <section>
          <Navbar />
          <Balance />
          <SupportChat />
          {children}
        </section>
      );
}
