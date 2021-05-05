import classNames from "classnames";
import { PopOver } from "src/components/";
import { useAuth, useUser } from "src/context";
import { SelectorIcon } from "src/components/icons";
import { useModal } from "src/utils/hooks";
import { MenuItemGroup, MenuItem, Divider } from "./menu-item";

export function Avatar() {
  const { visibility, toggle, getModalProps } = useModal();
  const { logout } = useAuth();
  const { user } = useUser({});

  return (
    <div className="my-8">
      <div
        className={classNames(
          "flex",
          "items-center",
          "justify-around",
          "py-2",
          "rounded-md",
          "hover:shadow-sm",
          "cursor-pointer",
          "hover:bg-gray-800",
          "duration-100",
          { "bg-gray-800": visibility }
        )}
        {...getModalProps()}
      >
        <div className="flex items-center">
          <img src={`https://ui-avatars.com/api/?name=${user?.name}&background=718096&color=4a5568&bold=true`} className="rounded-full h-8 xl:h-10" />
          <div className="flex-col text-sm truncate ml-4 hidden xl:flex">
            <span className="font-medium text-gray-600 leading-7">{user?.name}</span>
            <span className="text-gray-500 text-xs uppercase">
              {user?.role}
            </span>
          </div>
        </div>
        <div className="w-5 h-5 text-gray-500 hidden xl:block">
          <SelectorIcon />
        </div>
      </div>
      <PopOver
        visible={visibility}
        className="origin-top-left mt-2"
        onClose={toggle}
      >
        {/* <MenuItemGroup>
          <MenuItem label="Configuracion de cuenta" />
          <MenuItem label="Modo oscuro" />
          <MenuItem label="Soporte" />
        </MenuItemGroup> */}
        {/* <Divider /> */}
        {/* <MenuItemGroup className="bg-white rounded-md w-64"> */}
        <MenuItemGroup style={{width:"14rem"}} className="bg-white rounded-md w-64">
          <MenuItem label="Log Out" onClick={logout} />
        </MenuItemGroup>
      </PopOver>
    </div>
  );
}
