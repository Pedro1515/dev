import { useRouter } from "next/router";
import Link from "next/link";
import classNames from "classnames";
import { Avatar } from "src/components/";
import { ArchiveIcon, UsersIcon } from "src/components/icons";

export interface SidebarItemsProps {
  href: string;
  label: string;
  IconComponent?: React.ReactNode;
}

export function SidebarItem({ href, label, IconComponent }: SidebarItemsProps) {
  const router = useRouter();
  const active = router.pathname.includes(href);
  return (
    <Link {...{ href }}>
      <a
        className={classNames(
          "flex",
          "items-center",
          "p-2",
          { "hover:bg-gray-800": !active },
          "rounded",
          { "bg-gray-800": active },
          "text-sm",
          "justify-center",
          "xl:justify-start"
        )}
        title={label}
      >
        <div
          className={classNames(
            "w-5",
            "h-5",
            { "text-gray-700": !active },
            {
              "text-gray-500": active,
            }
          )}
        >
          {IconComponent}
        </div>
        <span
          className={classNames(
            "hidden",
            "xl:block",
            "ml-4",
            { "text-gray-600": !active },
            "font-medium",
            "text-sm",
            {
              "text-gray-400": active,
            }
          )}
        >
          {label}
        </span>
      </a>
    </Link>
  );
}

export function Sidebar() {
  return (
    <aside
      className={classNames(
        "z-20",
        "w-16",
        "xl:w-64",
        "overflow-y-auto",
        "bg-gray-900",
        "flex-shrink-0",
        "overflow-x-hidden"
      )}
    >
      <div className="p-2 xl:p-4 flex flex-col justify-center">
        <img
          className="hidden xl:block h-12 w-auto object-contain"
          src="/assets/logo_lippia.png"
          alt="lippia"
        />
        <img
          className="block xl:hidden h-10 w-auto object-contain mt-2"
          src="/assets/logo_lippia_min.png"
          alt="lippia"
        />
        <Avatar />
        <div className="space-y-3">
          <SidebarItem
            href="/projects"
            label="Projects"
            IconComponent={<ArchiveIcon />}
          />
          {/* <SidebarItem href="/users" label="Gestionar Usernames" IconComponent={<UsersIcon />} /> */}
        </div>
      </div>
    </aside>
  );
}
