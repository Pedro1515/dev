import React from "react";
import {
  IconButton,
  PopOver,
  MenuItemGroup,
  MenuItem,
  Divider,
  MenuItemProps,
} from "src/components/";
import { useModal } from "src/utils/hooks";
import { callAll } from "src/utils";

export interface MenuDropdownProps extends React.HTMLAttributes<HTMLButtonElement> {
  label: any;
  items: MenuItemProps[][];
  classNamePositionDrop: string; // example "origin-top-left left-0 mt-2" left, top, right or buttom
}

export function MenuDropdown({ items, label, className, classNamePositionDrop }: MenuDropdownProps) {
  const [activedStyle, setActivedStyle] = React.useState(false)
  const popover = useModal();
  const [item] = items
  React.useEffect(() => {
    if (item?.length >= 10) {
      setActivedStyle(true)
    }
  }, [items])

  return (
    <div className="relative inline-block">
      <IconButton
        active={popover.visibility}
        onClick={popover.toggle}
        IconComponent={label}
        className={className}
      />
      <PopOver
        visible={popover.visibility}
        onClose={popover.toggle}
        className={classNamePositionDrop}
        style={{ height: activedStyle ? "50vh" : "auto" }}
      >
        {items.map((group, index, arr) => {
          return (
            <React.Fragment key={index}>
              <MenuItemGroup
                key={index}
                aria-orientation="vertical"
                aria-labelledby="options-menu"
                className="h-full overflow-y-auto rounded-md bg-white shadow-xs"
                style={{width:"max-content"}}
              >
                {group?.map(({ label, onClick, ...props }) => (
                  <MenuItem
                    key={label}
                    {...{ label }}
                    onClick={callAll(onClick, popover.toggle)}
                    {...props}
                  />
                ))}
              </MenuItemGroup>
              {arr[index] ? <Divider /> : null}
            </React.Fragment>
          );
        })}
      </PopOver>
    </div>
  );
}
