import React, { useState, useMemo } from "react";
import { useTable, useSortBy, useGlobalFilter } from "react-table";
import {
  TextInput,
  Table,
  Autocomplete,
  Select,
  Flex,
  Box,
  Tooltip,
  Button,
  Collapse,
  Group,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconArrowDown,
  IconArrowUp,
  IconFilter,
  IconFilterOff,
} from "@tabler/icons-react";

const GlobalFilter = ({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter,
}) => {
  const count = preGlobalFilteredRows.length;
  return (
    <TextInput
      value={globalFilter || ""}
      label="Search"
      onChange={(e) => setGlobalFilter(e.target.value || undefined)}
      placeholder={`Search from ${count} listings`}
      fullWidth
    />
  );
};

const normalizeCompensation = (compensation) => {
  if (Array.isArray(compensation)) {
    if (compensation.length === 2) {
      return `$${compensation[0]} - $${compensation[1]}/hour`;
    } else if (compensation.length === 1) {
      return `$${compensation[0]}/hour`;
    }
  } else if (typeof compensation === "number") {
    return `$${compensation}/hour`;
  }
  return ""; // Handle null, empty array, and other cases
};

const CustomTable = ({ columns, data, appliedJobs }) => {
  const [selectedFilter, setSelectedFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [appliedFilter, setAppliedFilter] = useState("Show all");
  const [minPay, setMinPay] = useState("0");
  const [opened, { toggle }] = useDisclosure(false);

  const handleMinPayChange = (e) => {
    const value = e.target.value;
    setMinPay(value);
  };

  // Sort data by date before passing to the table
  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [data]);

  const filteredData = useMemo(() => {
    return sortedData.filter((listing) => {
      let pay = [0, 0];
      if (
        Array.isArray(listing.compensation) &&
        listing.compensation.length > 0
      ) {
        pay =
          listing.compensation.length === 1
            ? [listing.compensation[0], listing.compensation[0]]
            : listing.compensation;
      } else if (typeof listing.compensation === "number") {
        pay = [listing.compensation, listing.compensation];
      }

      const isAboveMinPay =
        minPay === "" || pay[0] >= Number(minPay) || pay[1] >= Number(minPay);

      if (
        selectedFilter &&
        !(listing.tags || []).some((tag) =>
          tag.toLowerCase().includes(selectedFilter.toLowerCase())
        )
      ) {
        return false;
      }
      const location = Array.isArray(listing.location)
        ? listing.location.join(", ").toLowerCase()
        : listing.location.toLowerCase();
      if (locationFilter && !location.includes(locationFilter.toLowerCase())) {
        return false;
      }
      if (
        (appliedFilter === "Show only applied jobs" &&
          !appliedJobs[listing.id]) ||
        (appliedFilter === "Hide applied jobs" && appliedJobs[listing.id])
      ) {
        return false;
      }
      return isAboveMinPay;
    });
  }, [
    sortedData,
    selectedFilter,
    locationFilter,
    appliedFilter,
    appliedJobs,
    minPay,
  ]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state,
    preGlobalFilteredRows,
    setGlobalFilter,
  } = useTable(
    {
      columns,
      data: filteredData,
    },
    useGlobalFilter,
    useSortBy
  );

  const filterOptions = useMemo(() => {
    const allTags = filteredData.flatMap((listing) => listing.tags || []);
    return Array.from(new Set(allTags));
  }, [filteredData]);

  const locationOptions = useMemo(() => {
    const allLocations = filteredData.flatMap((listing) =>
      Array.isArray(listing.location) ? listing.location : [listing.location]
    );
    return Array.from(new Set(allLocations));
  }, [filteredData]);

  const renderLocation = (location) => {
    if (Array.isArray(location)) {
      const firstLocation = location[0];
      const allLocations = location.join(", ");
      return (
        <Tooltip withArrow label={allLocations} multiline w={150}>
          <span>
            {firstLocation}
            {location.length > 1 && ` + ${location.length - 1} more`}
          </span>
        </Tooltip>
      );
    }
    return location;
  };

  return (
    <>
      <Group justify="space-between" align="flex-end" spacing="sm" mb="md">
        <Box style={{ flex: 1 }}>
          <GlobalFilter
            preGlobalFilteredRows={preGlobalFilteredRows}
            globalFilter={state.globalFilter}
            setGlobalFilter={setGlobalFilter}
          />
        </Box>
        <Button
          rightSection={
            opened ? <IconFilterOff size={18} /> : <IconFilter size={20} />
          }
          onClick={toggle}
        >
          {opened ? "Hide" : ""} Filters
        </Button>
      </Group>

      <Box mb="md">
        <Collapse in={opened}>
          <Flex justify={"space-between"}>
            <Autocomplete
              label="Job Type"
              placeholder="Select a job type"
              data={filterOptions}
              value={selectedFilter}
              onChange={setSelectedFilter}
            />

            <Autocomplete
              label="Location"
              placeholder="Select a location"
              data={locationOptions}
              value={locationFilter}
              onChange={setLocationFilter}
            />
            <TextInput
              type="number"
              label="Minimum Pay"
              value={minPay}
              onChange={handleMinPayChange}
              leftSection={"$"}
            />

            <Select
              label="Applied Status"
              placeholder="Select filter"
              data={[
                { value: "Show all", label: "Show all" },
                {
                  value: "Show only applied jobs",
                  label: "Show only applied jobs",
                },
                { value: "Hide applied jobs", label: "Hide applied jobs" },
              ]}
              value={appliedFilter}
              onChange={setAppliedFilter}
            />
          </Flex>
        </Collapse>
      </Box>

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
            {rows.map((row) => {
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
                        {cell.column.id === "location"
                          ? renderLocation(cell.value)
                          : cell.column.id === "compensation"
                          ? normalizeCompensation(cell.value)
                          : cell.render("Cell")}
                      </Table.Td>
                    );
                  })}
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
