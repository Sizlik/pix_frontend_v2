"use client";
import Navbar, { NavbarLinkEnum } from "@/components/navbar/navbar";
import SupportChat from "@/components/supportChat/supportChat";
import { useSelectedLayoutSegment } from "next/navigation";

export default function DashboardLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  const segment = useSelectedLayoutSegment();

  if (
    segment == NavbarLinkEnum.main ||
    segment == NavbarLinkEnum.orders ||
    segment == NavbarLinkEnum.transactions ||
    segment == NavbarLinkEnum.neworder ||
    segment == NavbarLinkEnum.organizations ||
    segment == NavbarLinkEnum.statistics ||
    segment == NavbarLinkEnum.settings ||
    segment == NavbarLinkEnum.logout ||
    segment == NavbarLinkEnum.messages
  ) {
    return (
      <section className="overflow-clip">
        <Navbar selectedItem={segment} />
        <SupportChat />
        {children}
      </section>
    );
  }

  return (
    <section>
      <Navbar />
      <SupportChat />
      {children}
    </section>
  );
}
