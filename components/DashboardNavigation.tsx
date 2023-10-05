"use client";

import React from "react";
import { usePathname } from "next/navigation";

import { classNames } from "@/utils/functions";

import {
  Cog6ToothIcon,
  FolderIcon,
  PuzzlePieceIcon,
  SwatchIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { motion } from "framer-motion";

type Icon = React.ForwardRefExoticComponent<
  Omit<React.SVGProps<SVGSVGElement>, "ref"> & {
    title?: string | undefined;
    titleId?: string | undefined;
  } & React.RefAttributes<SVGSVGElement>
>;

type Navigation = {
  name: string;
  href: string;
  icon: Icon;
};

const navigation: Navigation[] = [
  {
    name: "Attachments",
    href: "/dashboard/attachments",
    icon: PuzzlePieceIcon,
  },
  {
    name: "Models",
    href: "/dashboard/models",
    icon: FolderIcon,
  },
  {
    name: "Types",
    href: "/dashboard/types",
    icon: SwatchIcon,
  },
  { name: "Settings", href: "#", icon: Cog6ToothIcon },
];

export default function DashboardNavigation() {
  const pathname = usePathname();
  const [hoveredNavItem, setHoveredNavItem] = React.useState<string | null>(
    null
  );
  const id = React.useId();
  // const pathname = "/dashboard";
  return (
    <nav className="flex flex-1 flex-col">
      <ul
        role="list"
        className="-mx-2 space-y-1"
        onMouseLeave={() => setHoveredNavItem(null)}
      >
        {navigation.map(({ name, icon: Icon, href }) => {
          const selected = pathname === href;
          return (
            <li
              key={name}
              className="relative"
              style={{
                zIndex: hoveredNavItem === name ? 1 : 2,
              }}
            >
              {hoveredNavItem === name && (
                <motion.div
                  layoutId={id}
                  className="bg-gray-100 absolute inset-0"
                  initial={{
                    borderRadius: 6,
                  }}
                />
              )}

              <Link
                href={href}
                onMouseEnter={() => setHoveredNavItem(name)}
                className={classNames(
                  selected ? "text-blue-600" : "text-gray-700",
                  "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold relative"
                )}
              >
                <Icon
                  className={classNames(
                    "h-6 w-6 shrink-0",
                    selected ? "text-blue-600" : "text-gray-400"
                  )}
                  aria-hidden="true"
                />
                {name}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
