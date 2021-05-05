import React from "react";
import { useTable } from "react-table";
import classNames from "classnames";

export interface TableHeaderProps
  extends React.HTMLAttributes<HTMLTableHeaderCellElement> {
  children: React.ReactNode;
  sticky?: boolean;
}

export interface TableRowProps
  extends React.HTMLAttributes<HTMLTableRowElement> {
  children: React.ReactNode;
  hover?: boolean;
}

export interface TableCellProps
  extends React.HTMLAttributes<HTMLTableCellElement> {
  children: React.ReactNode;
}

export function TableHeader({
  sticky,
  children,
  className,
  ...props
}: TableHeaderProps) {
  return (
    <th
      className={classNames(
        "px-3",
        "py-3",
        "bg-gray-100",
        "text-left",
        "text-xs",
        "leading-4",
        "font-medium",
        "text-gray-500",
        "uppercase",
        "tracking-wider",
        { "sticky top-0 z-10": sticky },
        className
      )}
      {...props}
    >
      {children}
    </th>
  );
}

export function TableRow({ children, hover, ...props }: TableRowProps) {
  return (
    <tr className={classNames({ "hover:bg-indigo-100": hover })} {...props}>
      {children}
    </tr>
  );
}

export function TableCell({ children, className, ...props }: TableCellProps) {
  return (
    <td
      className={classNames("px-3", "py-4", "whitespace-no-wrap", className)}
      {...props}
    >
      {children}
    </td>
  );
}

export function Table({ columns, data, sticky }) {
  const { getTableProps, headerGroups, rows, prepareRow } = useTable({
    columns,
    data,
  });

  return (
    <table className="table-fixed w-full divide-y divide-gray-200" {...getTableProps()}>
      <thead className="border-b">
        {headerGroups.map((headerGroup) => (
          <TableRow {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <TableHeader
                {...column.getHeaderProps({
                  // @ts-ignore
                  className: column.headerClassName,
                })}
                {...{ sticky }}
              >
                {column.render("Header")}
              </TableHeader>
            ))}
          </TableRow>
        ))}
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {rows.map((row, i) => {
          prepareRow(row);
          return (
            <TableRow {...row.getRowProps()} hover>
              {row.cells.map((cell) => {
                return (
                  <TableCell
                    // @ts-ignore
                    {...cell.getCellProps({ className: cell.column.className })}
                  >
                    {cell.render("Cell")}
                  </TableCell>
                );
              })}
            </TableRow>
          );
        })}
      </tbody>
    </table>
  );
}
