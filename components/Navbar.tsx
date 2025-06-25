"use client";

import { cn } from "@/utils/cn";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import Link from "next/link";

export const ActiveLink = (props: { href: string; children: ReactNode }) => {
  const pathname = usePathname();
  const isActive = pathname === props.href;
  
  return (
    <Link
      href={props.href}
      className={cn(
        "nav-link",
        isActive && "active"
      )}
    >
      {props.children}
    </Link>
  );
};
