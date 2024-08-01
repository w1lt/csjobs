import React, { useState, useEffect, useMemo } from "react";
import {
  Button,
  Title,
  Space,
  Table as MantineTable,
  Modal,
  Box,
  TextInput,
  Select,
} from "@mantine/core";
import { deleteUser, fetchUsers, updateUser } from "../api/admin";
import { useAuth } from "../context/AuthContext";
import { notifications } from "@mantine/notifications";
import { useTable, useSortBy } from "react-table";
import { IconArrowDown, IconArrowUp } from "@tabler/icons-react";

const UsersTable = () => {
  const { token } = useAuth();
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userForm, setUserForm] = useState({ username: "", isAdmin: false });

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
      } finally {
        setLoadingUsers(false);
      }
    };

    loadUsers();
  }, [token]);

  const openUserModal = (user) => {
    setSelectedUser(user);
    setUserForm({ username: user.username, isAdmin: user.isAdmin });
  };

  const handleUserFormChange = (field, value) => {
    setUserForm({ ...userForm, [field]: value });
  };

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

  const handleDeleteUser = async (userId) => {
    try {
      await deleteUser(userId, token);
      notifications.show({
        title: "Success",
        message: "User deleted successfully",
        color: "green",
      });
      setUsers(users.filter((user) => user.id !== userId));
    } catch (error) {
      notifications.show({
        title: "Error",
        message: error.message,
        color: "red",
      });
    }
  };

  const columns = useMemo(
    () => [
      {
        Header: "ID",
        accessor: "id",
      },
      {
        Header: "Username",
        accessor: "username",
      },
      {
        Header: "Admin",
        accessor: "isAdmin",
        Cell: ({ value }) => (value ? "Yes" : "No"),
      },
      {
        Header: "Action",
        Cell: ({ row }) => (
          <>
            <Button onClick={() => openUserModal(row.original)}>
              Modify User
            </Button>
          </>
        ),
      },
    ],
    [users]
  );

  const data = useMemo(() => users, [users]);

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable(
      {
        columns,
        data,
      },
      useSortBy
    );

  return (
    <>
      <Title order={3}>User List</Title>
      <Space h="md" />

      <div style={{ overflowX: "auto" }}>
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
      </div>

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
        <Space h="sm" />
        <Button
          fullWidth
          color="red"
          onClick={() => handleDeleteUser(selectedUser.id)}
        >
          Delete User
        </Button>
      </Modal>
    </>
  );
};

export default UsersTable;
