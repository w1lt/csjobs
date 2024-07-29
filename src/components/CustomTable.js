import React from "react";
import { useTable, useSortBy, useGlobalFilter } from "react-table";
import { TextInput, Table, LoadingOverlay } from "@mantine/core";
import { IconArrowDown, IconArrowUp } from "@tabler/icons-react";

const GlobalFilter = ({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter,
}) => {
  const count = preGlobalFilteredRows.length;

  return (
    <TextInput
      value={globalFilter || ""}
      onChange={(e) => setGlobalFilter(e.target.value || undefined)}
      placeholder={`Search from ${count} jobs...`}
      style={{ marginBottom: "10px" }}
    />
  );
};

const CustomTable = ({ columns, data, loading }) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state,
    preGlobalFilteredRows,
    setGlobalFilter,
  } = useTable({ columns, data }, useGlobalFilter, useSortBy);

  return (
    <>
      <GlobalFilter
        preGlobalFilteredRows={preGlobalFilteredRows}
        globalFilter={state.globalFilter}
        setGlobalFilter={setGlobalFilter}
      />
      <div style={{ overflowX: "auto" }}>
        <Table
          {...getTableProps()}
          striped
          highlightOnHover
          withTableBorder
          withColumnBorders
          style={{ tableLayout: "auto", width: "100%" }}
        >
          <LoadingOverlay visible={loading} />
          <Table.Thead>
            {headerGroups.map((headerGroup) => (
              <Table.Tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <Table.Th
                    {...column.getHeaderProps(column.getSortByToggleProps())}
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
                ))}
              </Table.Tr>
            ))}
          </Table.Thead>
          <Table.Tbody {...getTableBodyProps()}>
            {rows.map((row) => {
              prepareRow(row);
              return (
                <Table.Tr {...row.getRowProps()}>
                  {row.cells.map((cell) => (
                    <Table.Td
                      {...cell.getCellProps()}
                      style={{
                        padding: "4px 8px",
                        textAlign: "left",
                        whiteSpace: "normal",
                        wordBreak: "break-word",
                      }}
                    >
                      {cell.render("Cell")}
                    </Table.Td>
                  ))}
                </Table.Tr>
              );
            })}
          </Table.Tbody>
        </Table>
      </div>
    </>
  );
};

export default CustomTable;
