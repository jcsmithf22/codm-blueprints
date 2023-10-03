"use client";

import { usePathname } from "next/navigation";

import { classNames } from "@/utils/functions";

import {
  Cog6ToothIcon,
  FolderIcon,
  PuzzlePieceIcon,
  SwatchIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";

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
    name: "Models",
    href: "/dashboard/models",
    icon: FolderIcon,
  },
  {
    name: "Attachments",
    href: "/dashboard/attachments",
    icon: PuzzlePieceIcon,
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
  // const pathname = "/dashboard";
  return (
    <nav className="flex flex-1 flex-col">
      <ul role="list" className="-mx-2 space-y-1">
        {navigation.map((item) => {
          const selected = pathname === item.href;
          return (
            <li key={item.name}>
              <Link
                href={item.href}
                className={classNames(
                  selected
                    ? "bg-gray-100 text-blue-600"
                    : "text-gray-700 hover:text-blue-600 hover:bg-gray-100",
                  "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                )}
              >
                <item.icon
                  className={classNames(
                    "h-6 w-6 shrink-0 group-hover:text-blue-600",
                    selected ? "text-blue-600" : "text-gray-400"
                  )}
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
