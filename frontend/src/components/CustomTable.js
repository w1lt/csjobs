import React from "react";
import { useTable, useSortBy, useGlobalFilter } from "react-table";
import { Skeleton, Table, Text } from "@mantine/core";
import { IconArrowDown, IconArrowUp } from "@tabler/icons-react";
import { useAuth } from "../context/AuthContext";

const CustomTable = ({ columns, data }) => {
  const { loading } = useAuth();
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable(
      {
        columns,
        data,
      },
      useGlobalFilter,
      useSortBy
    );

  return (
    <div style={{ overflowX: "auto" }}>
      <Table
        {...getTableProps()}
        striped
        highlightOnHover
        withTableBorder
        withColumnBorders
        style={{ tableLayout: "auto", width: "100%" }}
      >
        <Table.Thead>
          {headerGroups.map((headerGroup) => {
            const { key, ...restHeaderGroupProps } =
              headerGroup.getHeaderGroupProps();
            return (
              <Table.Tr key={headerGroup.id} {...restHeaderGroupProps}>
                {headerGroup.headers.map((column) => {
                  const { key, ...restColumnProps } = column.getHeaderProps(
                    column.getSortByToggleProps()
                  );
                  return (
                    <Table.Th
                      key={column.id}
                      {...restColumnProps}
                      style={{
                        cursor: "pointer",
                        padding: "4px 8px",
                        textAlign: "left",
                        whiteSpace: "normal",
                      }}
                    >
                      {column.render("Header")}
                      <span>
                        {column.isSorted ? (
                          column.isSortedDesc ? (
                            <IconArrowDown size={16} />
                          ) : (
                            <IconArrowUp size={16} />
                          )
                        ) : (
                          ""
                        )}
                      </span>
                    </Table.Th>
                  );
                })}
              </Table.Tr>
            );
          })}
        </Table.Thead>
        <Table.Tbody {...getTableBodyProps()}>
          {loading && rows.length === 0 ? (
            Array.from({ length: 8 }).map((_, index) => (
              <Table.Tr key={`skeleton-${index}`}>
                {columns.map((column) => (
                  <Table.Td key={`skeleton-cell-${column.accessor}-${index}`}>
                    <Skeleton height={20} />
                  </Table.Td>
                ))}
              </Table.Tr>
            ))
          ) : rows.length === 0 ? (
            <Table.Tr>
              <Table.Td
                colSpan={columns.length}
                style={{ textAlign: "center", padding: "16px" }}
              >
                <Text>No results found. </Text>
              </Table.Td>
            </Table.Tr>
          ) : (
            rows.map((row) => {
              prepareRow(row);
              const { key, ...restRowProps } = row.getRowProps();
              return (
                <Table.Tr key={row.id} {...restRowProps}>
                  {row.cells.map((cell) => {
                    const { key, ...restCellProps } = cell.getCellProps();
                    return (
                      <Table.Td
                        key={cell.column.id}
                        {...restCellProps}
                        style={{
                          padding: "4px 8px",
                          textAlign: "left",
                          whiteSpace: "normal",
                          wordBreak: "break-word",
                        }}
                      >
                        {cell.render("Cell")}
                      </Table.Td>
                    );
                  })}
                </Table.Tr>
              );
            })
          )}
        </Table.Tbody>
      </Table>
    </div>
  );
};

export default CustomTable;
