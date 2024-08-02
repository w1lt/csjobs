import React, { useState, useEffect, useMemo } from "react";
import {
  Container,
  Paper,
  Button,
  TextInput,
  Title,
  Space,
  Modal,
  Box,
  Table as MantineTable,
  Skeleton,
  Select,
  Text,
} from "@mantine/core";
import {
  fetchReports,
  triggerScraping,
  fetchUsers,
  updateUser,
} from "../api/admin"; // Import the necessary API functions
import { useAuth } from "../context/AuthContext";
import { notifications } from "@mantine/notifications";
import { useTable, useSortBy } from "react-table";
import { IconArrowDown, IconArrowUp, IconCheck } from "@tabler/icons-react";
import UsersTable from "../components/UsersTable";
import { nprogress } from "@mantine/nprogress";
import Header from "../components/Header";

const AdminPage = () => {
  const { token, loading } = useAuth();
  const [reports, setReports] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userForm, setUserForm] = useState({ username: "", isAdmin: false });
  const [resolutionMessage, setResolutionMessage] = useState("");

  // Load reports and users data
  useEffect(() => {
    const loadReports = async () => {
      nprogress.start();
      try {
        if (token) {
          const data = await fetchReports(token);
          setReports(data);
          console.log(data);
        }
      } catch (error) {
        notifications.show({
          title: "Error",
          message: "Failed to fetch reports",
          color: "red",
        });
      } finally {
        nprogress.complete();
      }
    };

    loadReports();
  }, [token]);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        if (token) {
          const data = await fetchUsers(token);
          setUsers(data);
        }
      } catch (error) {
        notifications.show({
          title: "Error",
          message: "Failed to fetch users",
          color: "red",
        });
      }
    };

    loadUsers();
  }, [token]);

  // Modal functions for reports and users
  const openResolveModal = (report) => {
    setSelectedReport(report);
  };

  const openUserModal = (user) => {
    setSelectedUser(user);
    setUserForm({ username: user.username, isAdmin: user.isAdmin });
  };

  // Handle report resolution
  const handleResolveReport = async () => {
    try {
      notifications.show({
        title: "Success",
        message: "Report resolved successfully",
        color: "green",
      });
      setReports(
        reports.map((report) =>
          report.id === selectedReport.id
            ? { ...report, status: "resolved", resolutionMessage }
            : report
        )
      );
    } catch (error) {
      notifications.show({
        title: "Error",
        message: "Failed to resolve report",
        color: "red",
      });
    } finally {
      setSelectedReport(null);
      setResolutionMessage("");
    }
  };

  // Trigger the scraping process
  const handleTriggerScraping = async () => {
    try {
      const id = notifications.show({
        loading: true,
        title: "Scraper Begin",
        message: "Scraping data...",
        autoClose: false,
        withCloseButton: false,
      });
      const response = await triggerScraping(token);
      console.log(response);
      notifications.update({
        id,
        color: "teal",
        title: "Data successfully scraped",
        message: "Data was successfully scraped",
        icon: <IconCheck width={18} />,
        loading: false,
        autoClose: 2000,
      });
    } catch (error) {
      notifications.show({
        title: "Error",
        message: `Failed to trigger scraping ${error}`,
        color: "red",
      });
    }
  };

  // Handle user form changes
  const handleUserFormChange = (field, value) => {
    setUserForm({ ...userForm, [field]: value });
  };

  // Handle user update
  const handleUpdateUser = async () => {
    try {
      await updateUser(selectedUser.id, userForm, token);
      notifications.show({
        title: "Success",
        message: "User updated successfully",
        color: "green",
      });
      setUsers(
        users.map((user) =>
          user.id === selectedUser.id ? { ...user, ...userForm } : user
        )
      );
      setSelectedUser(null);
    } catch (error) {
      notifications.show({
        title: "Error",
        message: "Failed to update user",
        color: "red",
      });
    }
  };

  // Table columns for reports
  const columns = useMemo(
    () => [
      {
        Header: "Listing",
        accessor: "listing.title",
      },
      {
        Header: "Reason",
        accessor: "reason",
      },
      {
        Header: "Message",
        accessor: "message",
      },
      {
        Header: "Status",
        accessor: "status",
      },
      {
        Header: "Action",
        Cell: ({ row }) => (
          <Button onClick={() => openResolveModal(row.original)}>
            Resolve
          </Button>
        ),
      },
    ],
    []
  );

  // Report data
  const data = useMemo(() => reports, [reports]);

  // Table hooks
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable(
      {
        columns,
        data,
      },
      useSortBy
    );

  return (
    <Container size="md">
      <Header />
      <Title align="center" mb="lg">
        Admin Page
      </Title>

      <Paper shadow="md" p="lg" withBorder>
        <Title order={3}>Reports</Title>
        <Space h="md" />

        {/* Display the total number of users */}
        <Text size="lg" weight={500} mb="sm">
          Total Users: {users.length}
        </Text>

        <div style={{ overflowX: "auto" }}>
          <Skeleton visible={loading} />
          <MantineTable
            {...getTableProps()}
            striped
            highlightOnHover
            withTableBorder
            withColumnBorders
            style={{ tableLayout: "auto", width: "100%" }}
          >
            <MantineTable.Thead>
              {headerGroups.map((headerGroup) => (
                <MantineTable.Tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => (
                    <MantineTable.Th
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
                    </MantineTable.Th>
                  ))}
                </MantineTable.Tr>
              ))}
            </MantineTable.Thead>
            <MantineTable.Tbody {...getTableBodyProps()}>
              {rows.map((row) => {
                prepareRow(row);
                return (
                  <MantineTable.Tr {...row.getRowProps()}>
                    {row.cells.map((cell) => (
                      <MantineTable.Td
                        {...cell.getCellProps()}
                        style={{
                          padding: "4px 8px",
                          textAlign: "left",
                          whiteSpace: "normal",
                          wordBreak: "break-word",
                        }}
                      >
                        {cell.render("Cell")}
                      </MantineTable.Td>
                    ))}
                  </MantineTable.Tr>
                );
              })}
            </MantineTable.Tbody>
          </MantineTable>
          <Skeleton />
        </div>

        {/* Render the UsersTable component */}
        <UsersTable openUserModal={openUserModal} users={users} />
        <Space h="md" />
        <Title order={3}>Actions</Title>
        <Button onClick={handleTriggerScraping}>Trigger Scraping</Button>
      </Paper>

      {/* Modal for resolving reports */}
      <Modal
        opened={selectedReport !== null}
        onClose={() => setSelectedReport(null)}
        title="Resolve Report"
      >
        <Box mb="sm">
          <TextInput
            label="Resolution Message"
            placeholder="Enter resolution message"
            value={resolutionMessage}
            onChange={(e) => setResolutionMessage(e.currentTarget.value)}
          />
        </Box>
        <Button fullWidth onClick={handleResolveReport}>
          Resolve
        </Button>
      </Modal>

      {/* Modal for modifying users */}
      <Modal
        opened={selectedUser !== null}
        onClose={() => setSelectedUser(null)}
        title="Modify User"
      >
        <Box mb="sm">
          <TextInput
            label="Username"
            placeholder="Enter username"
            value={userForm.username}
            onChange={(e) =>
              handleUserFormChange("username", e.currentTarget.value)
            }
          />
          <Select
            label="Role"
            placeholder="Select role"
            data={[
              { value: "true", label: "Admin" },
              { value: "false", label: "User" },
            ]}
            value={userForm.isAdmin.toString()}
            onChange={(value) =>
              handleUserFormChange("isAdmin", value === "true")
            }
          />
        </Box>
        <Button fullWidth onClick={handleUpdateUser}>
          Update User
        </Button>
      </Modal>
    </Container>
  );
};

export default AdminPage;
